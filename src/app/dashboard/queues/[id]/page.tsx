"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle2, XCircle, Share2, ArrowLeft } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

type Token = {
  id: string;
  position: number;
  status: 'waiting' | 'served' | 'left';
  created_at: string;
  customer_id: string | null;
  guest_name: string | null;
  users?: {
    name: string;
  };
};

type Queue = {
  id: string;
  name: string;
  status: 'active' | 'closed';
};

export default function QueueDashboardPage() {
  const { id } = useParams();
  const [queue, setQueue] = useState<Queue | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (id) {
      fetchQueueData();
      
      // Subscribe to real-time updates for tokens in this queue
      const channel = supabase
        .channel(`queue-${id}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'tokens', filter: `queue_id=eq.${id}` },
          () => {
            fetchTokens();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [id]);

  async function fetchQueueData() {
    setLoading(true);
    try {
      const { data: queueData, error: queueError } = await supabase
        .from("queues")
        .select("*")
        .eq("id", id)
        .single();

      if (queueError) throw queueError;
      setQueue(queueData);

      await fetchTokens();
    } catch (error) {
      console.error("Error fetching queue data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTokens() {
    try {
      // Fetch token with associated user data if it exists
      const { data, error } = await supabase
        .from("tokens")
        .select(`
          *,
          users:customer_id(name)
        `)
        .eq("queue_id", id)
        .in("status", ["waiting", "served"])
        .order("position", { ascending: true });

      if (error) throw error;
      console.log("Tokens fetched for dashboard:", data?.[0]); 
      setTokens(data || []);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    }
  }

  async function updateTokenStatus(tokenId: string, status: 'served' | 'left') {
    try {
      const { error } = await supabase
        .from("tokens")
        .update({ status })
        .eq("id", tokenId);

      if (error) throw error;
      
      // Optimistic update for better UX
      setTokens(prev => prev.map(t => t.id === tokenId ? { ...t, status } : t));
    } catch (error) {
      console.error("Error updating token status:", error);
    }
  }

  if (loading) return <div className="p-8">Loading queue details...</div>;
  if (!queue) return <div className="p-8 text-destructive">Queue not found.</div>;

  const waitingTokens = tokens.filter(t => t.status === 'waiting');
  const servedTokens = tokens.filter(t => t.status === 'served');
  const joinUrl = `${window.location.origin}/join/${queue.id}`;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/queues">
            <Button variant="ghost" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{queue.name}</h2>
            <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold flex items-center gap-2">
               <span className={`h-2 w-2 rounded-full ${queue.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
               {queue.status}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setShowQR(!showQR)}>
            <Share2 size={18} />
            {showQR ? "Hide QR" : "Show QR"}
          </Button>
        </div>
      </div>

      {showQR && (
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Customer Join Link</CardTitle>
            <CardDescription>Customers can scan this QR to join the queue.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="p-4 bg-white rounded-lg">
              <QRCodeSVG value={joinUrl} size={200} />
            </div>
            <p className="text-sm font-mono bg-muted p-2 rounded break-all">{joinUrl}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {/* Waiting List */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Users size={20} className="text-primary" />
            Waiting ({waitingTokens.length})
          </h3>
          <div className="space-y-2">
            {waitingTokens.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center border rounded-lg border-dashed">No customers waiting.</p>
            ) : (
              waitingTokens.map((token) => (
                <Card key={token.id} className="border-l-4 border-l-primary">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <span className="text-2xl font-black text-primary mr-4">#{token.position}</span>
                      <span className="font-medium">
                        {(() => {
                          // Try to get name from joined user data first, then guest_name
                          const profileName = Array.isArray(token.users) 
                            ? token.users[0]?.name 
                            : (token.users as any)?.name;
                          return token.guest_name || profileName || "Guest Customer";
                        })()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="gap-1 bg-green-600 hover:bg-green-700" onClick={() => updateTokenStatus(token.id, 'served')}>
                        <CheckCircle2 size={16} />
                        Serve
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => updateTokenStatus(token.id, 'left')}>
                        <XCircle size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Recently Served */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 size={20} className="text-green-600" />
            Recently Served
          </h3>
          <div className="space-y-2 opacity-60">
            {servedTokens.slice(-5).reverse().map((token) => (
              <Card key={token.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <span className="text-lg font-bold mr-4">#{token.position}</span>
                    <span className="text-muted-foreground">
                      {(() => {
                        const profileName = Array.isArray(token.users) 
                          ? token.users[0]?.name 
                          : (token.users as any)?.name;
                        return token.guest_name || profileName || "Guest Customer";
                      })()}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">Served</span>
                </CardContent>
              </Card>
            ))}
            {servedTokens.length === 0 && <p className="text-muted-foreground py-8 text-center border rounded-lg border-dashed">No customers served yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
