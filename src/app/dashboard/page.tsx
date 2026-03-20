"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, CheckCircle2, ListOrdered } from "lucide-react";
import Link from "next/link";

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
    <div className="space-y-8 relative pb-24 border-none">
      {/* Background Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vh] rounded-full bg-primary/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vh] rounded-full bg-secondary/5 blur-[120px] pointer-events-none -z-10" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-6 gap-4">
        <div>
          <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-white mb-1">Overview</h2>
          <p className="text-muted-foreground uppercase tracking-widest text-[10px] md:text-xs font-bold">Welcome back to your Control Center.</p>
        </div>
        <Link href="/dashboard/queues" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-white font-bold tracking-wide rounded-xl shadow-[0_0_20px_-5px_var(--color-primary)] hover:shadow-[0_0_30px_-5px_var(--color-primary)] transition-all h-12 px-6">
            <Plus size={18} />
            Launch Queue
          </Button>
        </Link>
      </div>


      {/* KPI Bento Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-white/5 bg-[#121212]/80 backdrop-blur-md rounded-3xl overflow-hidden relative group shadow-lg">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20 group-hover:opacity-50 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-xs uppercase font-black tracking-widest text-muted-foreground">Active Hubs</CardTitle>
            <ListOrdered className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent className="relative z-10 pt-4">
            <div className="text-5xl font-black text-white">{stats.activeQueues}</div>
          </CardContent>
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-500"><ListOrdered size={100} /></div>
        </Card>
        
        <Card className="border-white/5 bg-[#121212]/80 backdrop-blur-md rounded-3xl overflow-hidden relative group shadow-lg">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20 group-hover:opacity-50 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-xs uppercase font-black tracking-widest text-muted-foreground">Waiting Traffic</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="relative z-10 pt-4">
            <div className="text-5xl font-black text-white">{stats.waitingTotal}</div>
          </CardContent>
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-500"><Users size={100} /></div>
        </Card>
        
        <Card className="border-white/5 bg-[#121212]/80 backdrop-blur-md rounded-3xl overflow-hidden relative group shadow-lg">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-20 group-hover:opacity-50 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-xs uppercase font-black tracking-widest text-muted-foreground">Served Today</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent className="relative z-10 pt-4">
            <div className="text-5xl font-black text-white">{stats.servedToday}</div>
          </CardContent>
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-500"><CheckCircle2 size={100} /></div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-12 auto-rows-fr">
        {/* Recent Activity */}
        <Card className="col-span-12 md:col-span-7 border-white/5 bg-black/40 backdrop-blur-md rounded-3xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white">System Logs</CardTitle>
            <CardDescription className="uppercase tracking-widest text-[10px] font-bold">Latest check-ins and dispatches.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[200px]">
            <p className="text-sm text-muted-foreground bg-white/5 px-4 py-2 rounded-xl font-medium tracking-wide">Ready for action. Waiting for queue events.</p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-12 md:col-span-5 border-white/5 bg-black/40 backdrop-blur-md rounded-3xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white">Command Deck</CardTitle>
            <CardDescription className="uppercase tracking-widest text-[10px] font-bold">Rapid management links.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Link href="/dashboard/queues" className="block">
               <Button variant="outline" className="w-full justify-start h-14 rounded-xl border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-white/20 text-white transition-all font-bold tracking-wide">
                 + Create Empty Queue
               </Button>
             </Link>
             <Link href="/dashboard/queues" className="block">
               <Button variant="outline" className="w-full justify-start h-14 rounded-xl border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-white/20 text-white transition-all font-bold tracking-wide">
                 ⚡ Jump to Active Dashboards
               </Button>
             </Link>
             <Button variant="outline" className="w-full justify-start h-14 rounded-xl border-white/5 bg-black/50 text-muted-foreground opacity-50 cursor-not-allowed font-medium" disabled>
               Print QR Posters (Incoming)
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
