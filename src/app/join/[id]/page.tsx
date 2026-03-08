"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";

export default function JoinQueuePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [queue, setQueue] = useState<any>(null);
  const [mode, setMode] = useState<'join' | 'schedule'>('join');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (id) {
      fetchQueue();
    }
  }, [id]);

  async function fetchQueue() {
    try {
      const { data, error } = await supabase
        .from("queues")
        .select(`
          *,
          users(name)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      setQueue(data);
    } catch (error) {
      console.error("Error fetching queue:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === 'join') {
      await joinQueue();
    } else {
      await scheduleAppointment();
    }
  }

  async function joinQueue() {
    setJoining(true);
    try {
      let customerId = user?.id;

      const { data: lastToken } = await supabase
        .from("tokens")
        .select("position")
        .eq("queue_id", id)
        .order("position", { ascending: false })
        .limit(1);

      const nextPosition = (lastToken?.[0]?.position || 0) + 1;

      const { data: token, error } = await supabase
        .from("tokens")
        .insert([
          {
            queue_id: id,
            customer_id: customerId || null,
            guest_name: name,
            customer_email: email || null,
            position: nextPosition,
            status: "waiting",
          },
        ])
        .select()
        .single();

      if (error) throw error;
      router.push(`/status/${token.id}`);
    } catch (error) {
      console.error("Error joining queue:", error);
    } finally {
      setJoining(false);
    }
  }

  async function scheduleAppointment() {
    if (!scheduledAt) return;
    setJoining(true);
    try {
      const { data, error } = await supabase
        .from("appointments")
        .insert([{
          business_id: queue.business_id,
          queue_id: id,
          customer_id: user?.id || null,
          guest_name: name,
          guest_email: email || null,
          scheduled_at: new Date(scheduledAt).toISOString(),
          status: 'scheduled'
        }])
        .select()
        .single();

      if (error) throw error;
      alert(`Appointment scheduled for ${new Date(scheduledAt).toLocaleString()}`);
      setName("");
      setEmail("");
      setScheduledAt("");
      setMode('join');
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      alert("Failed to schedule appointment.");
    } finally {
      setJoining(false);
    }
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading queue...</div>;
  if (!queue) return <div className="flex min-h-screen items-center justify-center text-destructive">Queue not found.</div>;
  if (queue.status === "closed") return <div className="flex min-h-screen items-center justify-center">This queue is currently closed.</div>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-black">{queue.name}</CardTitle>
          <CardDescription className="text-base font-medium">
            by {queue.users?.name || "Business"}
          </CardDescription>
        </CardHeader>
        
        <div className="px-6 flex gap-2 mb-4">
          <Button 
            variant={mode === 'join' ? 'default' : 'ghost'} 
            className="flex-1 rounded-full font-bold h-10"
            onClick={() => setMode('join')}
          >
            Join Now
          </Button>
          <Button 
            variant={mode === 'schedule' ? 'default' : 'ghost'} 
            className="flex-1 rounded-full font-bold h-10"
            onClick={() => setMode('schedule')}
          >
            Schedule Later
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-bold tracking-wide uppercase opacity-70">Your Name</Label>
              <Input
                id="name"
                className="h-11 rounded-xl"
                placeholder="Ex. Sarah Parker"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold tracking-wide uppercase opacity-70">Email (Optional)</Label>
              <Input
                id="email"
                className="h-11 rounded-xl"
                type="email"
                placeholder="sarah@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Used for turn notifications & updates.
              </p>
            </div>

            {mode === 'schedule' && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <Label htmlFor="date" className="text-sm font-bold tracking-wide uppercase opacity-70">Pick a Date & Time</Label>
                <Input
                  id="date"
                  className="h-11 rounded-xl"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  required
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-2">
            <Button
              type="submit"
              className="w-full h-14 text-lg font-black rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={joining}
            >
              {joining ? (mode === 'join' ? "Joining..." : "Scheduling...") : (mode === 'join' ? "Join Queue Now" : "Schedule Appointment")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
