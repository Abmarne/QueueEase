"use client";

import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ListOrdered, Play, Square, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";

type Queue = {
  id: string;
  name: string;
  status: 'active' | 'closed';
  created_at: string;
};

export default function QueuesPage() {
  const { user } = useAuth();
  const [queues, setQueues] = useState<Queue[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newQueueName, setNewQueueName] = useState("");

  useEffect(() => {
    if (user) {
      fetchQueues();
    }
  }, [user]);

  async function fetchQueues() {
    try {
      const { data, error } = await supabase
        .from("queues")
        .select("*")
        .eq("business_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQueues(data || []);
    } catch (error) {
      console.error("Error fetching queues:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createQueue(e: React.FormEvent) {
    e.preventDefault();
    if (!newQueueName.trim()) return;

    try {
      const { data, error } = await supabase
        .from("queues")
        .insert([
          { business_id: user?.id, name: newQueueName, status: "active" }
        ])
        .select()
        .single();

      if (error) throw error;
      setQueues([data, ...queues]);
      setNewQueueName("");
      setIsCreating(false);
    } catch (error) {
      console.error("Error creating queue:", error);
    }
  }

  async function toggleQueueStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "active" ? "closed" : "active";
    try {
      const { error } = await supabase
        .from("queues")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      setQueues(queues.map(q => q.id === id ? { ...q, status: newStatus as any } : q));
    } catch (error) {
      console.error("Error updating queue status:", error);
    }
  }

  async function deleteQueue(id: string) {
    if (!confirm("Are you sure you want to delete this queue? All tokens and data associated with it will be permanently removed.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("queues")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setQueues(queues.filter(q => q.id !== id));
    } catch (error) {
      console.error("Error deleting queue:", error);
      alert("Failed to delete queue. Please try again.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Queues</h2>
          <p className="text-muted-foreground">Manage your existing queues or create a new one.</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus size={18} />
          Create Queue
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Queue</CardTitle>
            <CardDescription>Enter a name for your new queue (e.g. Haircut, Consultation).</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={createQueue} className="flex gap-4">
              <input
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Queue Name"
                value={newQueueName}
                onChange={(e) => setNewQueueName(e.target.value)}
                autoFocus
              />
              <Button type="submit">Create</Button>
              <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {loading ? (
          <p>Loading queues...</p>
        ) : queues.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">No queues found. Create your first queue to get started!</p>
        ) : (
          queues.map((queue) => (
            <Card key={queue.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${queue.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    <ListOrdered size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{queue.name}</h3>
                    <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                      {queue.status}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/queues/${queue.id}`}>
                    <Button variant="outline" className="gap-2">
                      <ExternalLink size={16} />
                      Live Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => toggleQueueStatus(queue.id, queue.status)}
                    title={queue.status === 'active' ? 'Close Queue' : 'Open Queue'}
                  >
                    {queue.status === 'active' ? <Square size={18} className="fill-current" /> : <Play size={18} className="fill-current" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => deleteQueue(queue.id)}
                    title="Delete Queue"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
