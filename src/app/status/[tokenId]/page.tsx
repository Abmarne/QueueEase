"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, ArrowLeft, RefreshCw, Zap, Moon } from "lucide-react";
import ArcadeGame from "@/components/ArcadeGame";
import PreboardingForm from "@/components/PreboardingForm";
import Logo from "@/components/Logo";

export default function TokenStatusPage() {
  const { tokenId } = useParams();
  const router = useRouter();
  const [token, setToken] = useState<any>(null);
  const [queue, setQueue] = useState<any>(null);
  const [position, setPosition] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [snoozing, setSnoozing] = useState(false);

  useEffect(() => {
    if (tokenId) {
      fetchTokenData();

      // Check for notification permission
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          setNotificationsEnabled(true);
        }
      }

      // Realtime subscription for ALL changes to tokens in this queue
      const channel = supabase
        .channel(`queue-updates-${tokenId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'tokens' },
          () => {
            fetchTokenData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [tokenId]);

  async function requestNotificationPermission() {
    if (!('Notification' in window)) {
      alert("This browser does not support desktop notification");
      return;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        new Notification("Notifications Enabled!", {
          body: "We'll alert you when it's almost your turn.",
          icon: "/favicon.ico"
        });
      }
    }
  }

  function sendTurnAlert() {
    if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification("Your turn is near!", {
        body: `You are #${position} in line at ${queue?.name}. Please head to the counter.`,
        icon: "/favicon.ico"
      });
    }
  }

  useEffect(() => {
    if (position !== null && position <= 3 && position > 0) {
      sendTurnAlert();
    }
  }, [position]);

  async function fetchTokenData() {
    try {
      const { data: tokenData, error: tokenError } = await supabase
        .from("tokens")
        .select(`
          *,
          queues (
            *,
            users (name)
          )
        `)
        .eq("id", tokenId)
        .single();

      if (tokenError) throw tokenError;
      setToken(tokenData);
      setQueue(tokenData.queues);

      // Calculate position
      const { count } = await supabase
        .from("tokens")
        .select("*", { count: 'exact', head: true })
        .eq("queue_id", tokenData.queue_id)
        .eq("status", "waiting")
        .lt("position", tokenData.position);

      setPosition((count || 0) + 1);
    } catch (error) {
      console.error("Error fetching token data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function leaveQueue() {
    if (!confirm("Are you sure you want to leave the queue? Your position will be lost.")) return;
    
    try {
      const { error } = await supabase
        .from("tokens")
        .update({ status: "left" })
        .eq("id", tokenId);

      if (error) throw error;
      
      // Clear session when leaving
      localStorage.removeItem(`queue_token_${token.queue_id}`);
      
      router.push("/");
    } catch (error) {
      console.error("Error leaving queue:", error);
    }
  }

  async function snoozeQueue() {
    if (!token || token.snooze_count >= 2) return;
    setSnoozing(true);
    try {
      // Find the highest current position in the queue to know where to land
      const { data: lastToken } = await supabase
        .from("tokens")
        .select("position")
        .eq("queue_id", token.queue_id)
        .eq("status", "waiting")
        .order("position", { ascending: false })
        .limit(1);

      const maxPosition = lastToken?.[0]?.position || token.position;
      // Bump 3 spots back, but don't go past the current tail of the queue
      const newPosition = Math.min(token.position + 3, maxPosition + 1);

      const { error } = await supabase
        .from("tokens")
        .update({
          position: newPosition,
          snooze_count: token.snooze_count + 1,
        })
        .eq("id", tokenId);

      if (error) throw error;
      // Real-time will refresh the data automatically
    } catch (error) {
      console.error("Error snoozing queue:", error);
    } finally {
      setSnoozing(false);
    }
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center">Checking your position...</div>;
  if (!token) return <div className="flex min-h-screen items-center justify-center text-destructive">Token not found.</div>;

  if (token.status === 'served') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50 p-4">
        <Card className="w-full max-w-md text-center border-green-200">
          <CardHeader>
            <CardTitle className="text-3xl text-green-700">It's Your Turn!</CardTitle>
            <CardDescription>Please proceed to the counter.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-8">
              <span className="text-8xl font-black text-green-600">#{token.position}</span>
            </div>
            <p className="font-medium">{queue?.name}</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => {
              if (token?.queue_id) localStorage.removeItem(`queue_token_${token.queue_id}`);
              router.push("/");
            }}>Back to Home</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (token.status === 'left') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>You left the queue</CardTitle>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={() => {
              if (token?.queue_id) localStorage.removeItem(`queue_token_${token.queue_id}`);
              router.push("/");
            }}>Back to Home</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const estWaitTime = position ? (position - 1) * 5 : 0; // 5 mins per person

  return (
    <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">
      {/* Immersive Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vh] rounded-full bg-primary/10 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vh] rounded-full bg-secondary/10 blur-[130px] pointer-events-none -z-10" />

      <header className="p-6 flex items-center gap-4 relative z-10 border-b border-white/5">
        <Button variant="ghost" size="icon" className="hover:bg-white/5 bg-black/20 backdrop-blur-md border border-white/5 rounded-full" onClick={() => router.push("/")}>
          <ArrowLeft size={18} className="text-white" />
        </Button>
        <Logo size={24} />
      </header>

      <main className="flex-1 flex flex-col items-center justify-start p-6 pt-12 gap-8 relative z-10">
        
        {/* Massive Typographic Hero Section */}
        <div className="text-center w-full relative">
          <p className="text-muted-foreground/60 uppercase tracking-[0.3em] text-[10px] font-black mb-4 md:mb-6">Your Token Number</p>
          <div className="relative inline-block">
            {/* The soft glowing text effect */}
            <h2 className="text-7xl sm:text-[10rem] font-black text-white leading-none tracking-tighter drop-shadow-[0_0_60px_rgba(0,112,243,0.3)]">
              #{token.position}
            </h2>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent mix-blend-overlay pointer-events-none" />
          </div>
        </div>


        {/* Dynamic State Alert */}
        {position !== null && position <= 3 && position > 0 && (
          <div className="w-full max-w-sm bg-[#1a1500]/80 backdrop-blur-md border border-amber-500/30 rounded-2xl p-5 flex items-center gap-5 shadow-[0_0_30px_rgba(245,158,11,0.15)] animate-in slide-in-from-bottom flex-shrink-0">
            <div className="bg-gradient-to-br from-amber-400 to-orange-600 text-white p-3 rounded-xl shadow-inner">
              <Zap size={24} className="fill-current" />
            </div>
            <div>
              <p className="font-black text-amber-500 leading-tight tracking-wide text-sm uppercase">PREPARE</p>
              <p className="text-white text-base font-medium">Head to the counter immediately.</p>
            </div>
          </div>
        )}

        {/* Bento Stats Grid */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-4">
          <Card className="text-center p-6 bg-white/[0.02] backdrop-blur-xl border-white/5 rounded-3xl shadow-lg relative overflow-hidden group">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20" />
            <Users className="mx-auto mb-4 text-primary opacity-80" size={28} />
            <p className="text-[10px] text-muted-foreground/60 uppercase font-black tracking-widest mb-1">Ahead of you</p>
            <p className="text-4xl font-black text-white">{position === 1 ? "NEXT" : (position || 0) - 1}</p>
          </Card>
          
          <Card className="text-center p-6 bg-white/[0.02] backdrop-blur-xl border-white/5 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-20" />
            <Clock className="mx-auto mb-4 text-secondary opacity-80" size={28} />
            <p className="text-[10px] text-muted-foreground/60 uppercase font-black tracking-widest mb-1">Est. Wait</p>
            <p className="text-4xl font-black text-white">{estWaitTime}<span className="text-base text-muted-foreground ml-1">m</span></p>
          </Card>
        </div>

        {/* Interaction Panel */}
        <Card className="w-full max-w-sm bg-[#121212]/80 backdrop-blur-xl border-white/5 rounded-3xl overflow-hidden mt-4 shadow-xl">
          <CardContent className="p-6 text-center space-y-5">
            <div className="flex items-center justify-center gap-2 text-primary/70 animate-pulse bg-primary/5 p-2 rounded-lg">
              <RefreshCw size={14} />
              <span className="text-xs font-bold uppercase tracking-widest">Live Sync Active</span>
            </div>
            
            {!notificationsEnabled && (
              <Button 
                className="w-full gap-2 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white rounded-xl h-12 shadow-sm font-bold tracking-wide transition-all"
                onClick={requestNotificationPermission}
              >
                <Zap size={16} className="text-primary" />
                Enable Push Alerts
              </Button>
            )}

            <p className="text-xs text-muted-foreground/50 font-medium">
              We'll alert you when it's almost your turn. You can close your phone.
            </p>
          </CardContent>
          
          <div className="border-t border-white/5 p-4 flex flex-col gap-3 bg-black/20">
            {/* Snooze Button */}
            {position !== null && position > 3 && token.snooze_count < 2 && (
              <Button
                variant="outline"
                className="w-full gap-2 border-white/5 bg-transparent text-muted-foreground hover:bg-white/5 hover:text-white rounded-xl h-11"
                onClick={snoozeQueue}
                disabled={snoozing}
              >
                <Moon size={16} />
                {snoozing ? "Snoozing..." : `Pause & Step Back (${2 - token.snooze_count} left)`}
              </Button>
            )}
            
            <Button variant="ghost" className="w-full text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-xl h-11 font-bold tracking-wide" onClick={leaveQueue}>
              Abandon Line
            </Button>
          </div>
        </Card>

        {queue?.arcade_enabled && (
          <div className="w-full max-w-sm mt-4">
             <ArcadeGame 
               queueId={queue.id} 
               tokenId={token.id} 
               guestName={token.guest_name || token.users?.name || "Guest"} 
               arcadeReward={queue.arcade_reward}
             />
          </div>
        )}

        {queue?.preboarding_enabled && queue?.preboarding_fields?.length > 0 && (
          <div className="w-full max-w-sm mt-4">
             <PreboardingForm
               tokenId={token.id}
               fields={queue.preboarding_fields}
               existingData={token.preboarding_data}
             />
          </div>
        )}
      </main>

      <footer className="p-8 pb-12 flex flex-col items-center justify-center gap-3 relative z-10 border-t border-white/5 mt-auto">
        <Logo showText={true} size={18} className="opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
        <p className="text-[9px] text-muted-foreground/30 uppercase tracking-widest font-black">Powered by Nex</p>
      </footer>
    </div>
  );
}
