"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle2, XCircle, Share2, ArrowLeft, ClipboardList, ChevronDown, ChevronUp } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

type Token = {
  id: string;
  position: number;
  status: 'waiting' | 'served' | 'left';
  source: 'digital' | 'walk-in';
  created_at: string;
  customer_id: string | null;
  guest_name: string | null;
  customer_email: string | null;
  party_size: number;
  snooze_count: number;
  preboarding_data: Record<string, string> | null;
  users?: {
    name: string;
  };
};

type Queue = {
  id: string;
  name: string;
  status: 'active' | 'closed';
  require_party_size: boolean;
  preboarding_enabled: boolean;
  preboarding_fields: {id: string; label: string; type: string}[];
};

export default function QueueDashboardPage() {
  const { id } = useParams();
  const [queue, setQueue] = useState<Queue | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualPartySize, setManualPartySize] = useState("1");
  const [addingManual, setAddingManual] = useState(false);
  const [expandedToken, setExpandedToken] = useState<string | null>(null);

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
      // Get the token's position before updating
      const currentToken = tokens.find(t => t.id === tokenId);
      
      const { error } = await supabase
        .from("tokens")
        .update({ 
          status,
          served_at: status === 'served' ? new Date().toISOString() : null
        })
        .eq("id", tokenId);

      if (error) throw error;
      
      // Real-time subscription handles UI updates
      setTokens(prev => prev.map(t => t.id === tokenId ? { ...t, status } : t));
    } catch (error) {
      console.error("Error updating token status:", error);
    }
  }


  async function addManualCustomer(e: React.FormEvent) {
    e.preventDefault();
    if (!manualName.trim()) return;
    
    setAddingManual(true);
    try {
      // Calculate next position
      const lastTokenPosition = tokens.length > 0 
        ? Math.max(...tokens.map(t => t.position)) 
        : 0;
      const nextPosition = lastTokenPosition + 1;

      const { data, error } = await supabase
        .from("tokens")
        .insert([{
          queue_id: id,
          guest_name: manualName,
          party_size: parseInt(manualPartySize) || 1,
          position: nextPosition,
          status: 'waiting',
          source: 'walk-in'
        }])
        .select()
        .single();

      if (error) throw error;
      
      setManualName("");
      setManualPartySize("1");
      // Real-time subscription will handle the UI update, but we can do it optimistically too
      setTokens(prev => [...prev, data]);
    } catch (error) {
      console.error("Error adding manual customer:", error);
    } finally {
      setAddingManual(false);
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
          
          <Card className="border-dashed">
            <CardContent className="p-4">
              <form onSubmit={addManualCustomer} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Add walk-in name..." 
                  className="flex-1 bg-transparent border rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  disabled={addingManual}
                />
                {queue?.require_party_size && (
                  <input 
                    type="number" 
                    placeholder="Party Size" 
                    className="w-24 bg-transparent border rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    min="1"
                    value={manualPartySize}
                    onChange={(e) => setManualPartySize(e.target.value)}
                    disabled={addingManual}
                  />
                )}
                <Button size="sm" type="submit" disabled={addingManual || !manualName.trim()}>
                  {addingManual ? "Adding..." : "Add Walk-in"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {waitingTokens.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center border rounded-lg border-dashed">No customers waiting.</p>
            ) : (
              waitingTokens.map((token) => (
                <Card key={token.id} className={`border-l-4 ${token.source === 'walk-in' ? 'border-l-orange-400' : 'border-l-primary'}`}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black text-primary">#{token.position}</span>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {(() => {
                            const profileName = Array.isArray(token.users) 
                              ? token.users[0]?.name 
                              : (token.users as any)?.name;
                            return token.guest_name || profileName || "Guest Customer";
                          })()}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground/70">
                          {token.source === 'walk-in' ? "🚶 Walk-in" : "📱 Digital"}
                        </span>
                        {queue?.require_party_size && token.party_size > 0 && (
                          <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 w-fit px-1.5 py-0.5 rounded-md mt-1">
                            <Users size={12} /> {token.party_size}
                          </span>
                        )}
                        {token.snooze_count > 0 && (
                          <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-100 w-fit px-1.5 py-0.5 rounded-md mt-1">
                            💤 Snoozed ×{token.snooze_count}
                          </span>
                        )}
                        {queue?.preboarding_enabled && token.preboarding_data && (
                          <button
                            type="button"
                            className="flex items-center gap-1 text-xs font-bold text-violet-600 bg-violet-100 w-fit px-1.5 py-0.5 rounded-md mt-1 hover:bg-violet-200 transition-colors"
                            onClick={() => setExpandedToken(expandedToken === token.id ? null : token.id)}
                          >
                            <ClipboardList size={12} /> Pre-boarding
                            {expandedToken === token.id ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                          </button>
                        )}
                      </div>
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
                  {expandedToken === token.id && token.preboarding_data && (
                    <div className="px-4 pb-4 pt-0">
                      <div className="bg-violet-50 rounded-lg p-3 space-y-2 border border-violet-100">
                        {queue?.preboarding_fields?.map((field) => (
                          <div key={field.id} className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase text-violet-500 tracking-wider">{field.label}</span>
                            <span className="text-sm font-medium text-violet-900">{token.preboarding_data?.[field.id] || '—'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                    {queue?.require_party_size && token.party_size > 0 && (
                      <span className="ml-2 text-xs font-bold text-primary/70">
                        ({token.party_size} people)
                      </span>
                    )}
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
