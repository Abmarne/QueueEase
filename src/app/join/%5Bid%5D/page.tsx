"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";

export default function JoinQueuePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [queue, setQueue] = useState<any>(null);
  const [name, setName] = useState("");
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

  async function joinQueue(e: React.FormEvent) {
    e.preventDefault();
    setJoining(true);

    try {
      // 1. If user is logged in, use their ID. If not, we could create a guest user or handle it.
      // For MVP, if not logged in, we'll try to use a guest approach.
      // Actually, let's keep it simple: if not logged in, we need to create an anonymous session or just a record.
      // Supabase supports anonymous sign-ins, but let's assume the user might need to sign in/up or we just use their name.
      
      let customerId = user?.id;
      
      // If no user, for MVP we'll redirect to a simplified register/login or just use anonymous if enabled.
      // Let's assume for now they might need a quick account.
      // BUT, the PRD says "no login required for MVP". So we'll use a guest record or just the name.
      // In Supabase, tokens.customer_id is FK to users.id. If we want guest, it must be nullable.
      // I'll insert without customer_id if not logged in.
      
      // Calculate next position
      const { data: lastToken } = await supabase
        .from("tokens")
        .select("position")
        .eq("queue_id", id)
        .order("position", { ascending: false })
        .limit(1)
        .single();
      
      const nextPosition = (lastToken?.position || 0) + 1;

      const { data: token, error } = await supabase
        .from("tokens")
        .insert([
          { 
            queue_id: id, 
            customer_id: customerId || null, 
            guest_name: customerId ? null : name, 
            position: nextPosition, 
            status: "waiting" 
          }
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

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading queue...</div>;
  if (!queue) return <div className="flex min-h-screen items-center justify-center text-destructive">Queue not found.</div>;
  if (queue.status === 'closed') return <div className="flex min-h-screen items-center justify-center">This queue is currently closed.</div>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{queue.name}</CardTitle>
          <CardDescription>by {queue.users?.name || "Business"}</CardDescription>
        </CardHeader>
        <form onSubmit={joinQueue}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Click the button below to get your digital token.
            </p>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full h-12 text-lg" disabled={joining}>
              {joining ? "Joining..." : "Join Queue"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
