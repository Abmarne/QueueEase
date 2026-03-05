"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Clock, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeQueues: 0,
    waitingTotal: 0,
    servedToday: 0,
  });

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  async function fetchStats() {
    // This would be more complex in a real app, but for MVP:
    const { data: queues } = await supabase
      .from("queues")
      .select("id")
      .eq("business_id", user?.id)
      .eq("status", "active");

    const activeQueueIds = queues?.map(q => q.id) || [];

    const { count: waitingCount } = await supabase
      .from("tokens")
      .select("*", { count: 'exact', head: true })
      .in('queue_id', activeQueueIds)
      .eq('status', 'waiting');

    const { count: servedTodayCount } = await supabase
      .from("tokens")
      .select("*", { count: 'exact', head: true })
      .in('queue_id', activeQueueIds)
      .eq('status', 'served')
      .gte('created_at', new Date().toISOString().split('T')[0]);

    setStats({
      activeQueues: activeQueueIds.length,
      waitingTotal: waitingCount || 0,
      servedToday: servedTodayCount || 0,
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground">Welcome back to your QueueEase dashboard.</p>
        </div>
        <Button className="gap-2">
          <Plus size={18} />
          Create New Queue
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Queues</CardTitle>
            <ListOrdered className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeQueues}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waiting Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.waitingTotal}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Served Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.servedToday}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest tokens issued and served.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent activity found.</p>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your queues efficiently.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Button variant="outline" className="w-full justify-start">Create a new queue</Button>
             <Button variant="outline" className="w-full justify-start">View live dashboard</Button>
             <Button variant="outline" className="w-full justify-start">Print QR codes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { ListOrdered } from "lucide-react";
