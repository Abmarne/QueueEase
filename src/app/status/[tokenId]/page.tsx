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
    <div className="flex min-h-screen flex-col bg-primary/5">
      <header className="p-4 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
          <ArrowLeft size={20} />
        </Button>
        <Logo size={24} />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground uppercase tracking-widest text-sm font-bold">Your Token Number</p>
          <h2 className="text-7xl font-black text-primary">#{token.position}</h2>
        </div>

        {position !== null && position <= 3 && position > 0 && (
          <div className="w-full max-w-sm bg-orange-100 border-2 border-orange-500 rounded-xl p-4 flex items-center gap-4 animate-bounce">
            <div className="bg-orange-500 text-white p-2 rounded-full">
              <Zap size={20} className="fill-current" />
            </div>
            <div>
              <p className="font-black text-orange-900 leading-tight">YOUR TURN IS NEAR!</p>
              <p className="text-orange-800 text-xs">Please head to the counter now.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <Card className="text-center p-4 bg-white/50 backdrop-blur">
            <Users className="mx-auto mb-2 text-primary" size={24} />
            <p className="text-xs text-muted-foreground uppercase font-bold">Your Position</p>
            <p className="text-2xl font-bold">{position === 1 ? "NEXT" : position}</p>
          </Card>
          <Card className="text-center p-4 bg-white/50 backdrop-blur">
            <Clock className="mx-auto mb-2 text-primary" size={24} />
            <p className="text-xs text-muted-foreground uppercase font-bold">Est. Wait</p>
            <p className="text-2xl font-bold">{estWaitTime} min</p>
          </Card>
        </div>

        <Card className="w-full max-w-sm">
          <CardContent className="p-6 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-primary animate-pulse">
              <RefreshCw size={16} />
              <span className="text-sm font-medium">Auto-updating in real-time</span>
            </div>
            
            {!notificationsEnabled && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full gap-2 border-primary/20 hover:bg-primary/5 text-primary"
                onClick={requestNotificationPermission}
              >
                <Zap size={14} />
                Enable Browser Alerts
              </Button>
            )}

            <p className="text-sm text-muted-foreground">
              Please stay on this page. We'll alert you when it's almost your turn.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            {/* Snooze Button - shown when not too close to front and snoozes remain */}
            {position !== null && position > 3 && token.snooze_count < 2 && (
              <Button
                variant="outline"
                className="w-full gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={snoozeQueue}
                disabled={snoozing}
              >
                <Moon size={16} />
                {snoozing ? "Snoozing..." : `Snooze — I Need More Time (${2 - token.snooze_count} left)`}
              </Button>
            )}
            {token.snooze_count >= 2 && position !== null && position > 3 && (
              <p className="text-xs text-muted-foreground text-center w-full">
                💤 You've used both snoozes. Hang tight!
              </p>
            )}
            <Button variant="outline" className="w-full text-destructive hover:bg-destructive/5" onClick={leaveQueue}>
              Leave Queue
            </Button>
          </CardFooter>
        </Card>

        {queue?.arcade_enabled && (
          <ArcadeGame 
            queueId={queue.id} 
            tokenId={token.id} 
            guestName={token.guest_name || token.users?.name || "Guest"} 
            arcadeReward={queue.arcade_reward}
          />
        )}

        {queue?.preboarding_enabled && queue?.preboarding_fields?.length > 0 && (
          <PreboardingForm
            tokenId={token.id}
            fields={queue.preboarding_fields}
            existingData={token.preboarding_data}
          />
        )}
      </main>

      <footer className="p-8 flex flex-col items-center gap-2">
        <Logo showText={true} size={20} className="opacity-50 grayscale hover:grayscale-0 transition-all" />
        <p className="text-[10px] text-muted-foreground">© 2026 QueueEase</p>
      </footer>
    </div>
  );
}
