"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, ArrowLeft, CalendarCheck, Info } from "lucide-react";

export default function AppointmentStatusPage() {
  const { id } = useParams();
  const router = useRouter();
  const [appointment, setAppointment] = useState<any>(null);
  const [queue, setQueue] = useState<any>(null);
  const [waitingCount, setWaitingCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData();

      // Subscribe to token changes to keep live queue count updated!
      const channel = supabase
        .channel(`queue-updates-appt-${id}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'tokens' },
          () => {
            fetchQueueStats();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [id]);

  async function fetchData() {
    try {
      const { data: apptData, error: apptError } = await supabase
        .from("appointments")
        .select(`
          *,
          queues (
            *,
            users (name)
          )
        `)
        .eq("id", id)
        .single();

      if (apptError) throw apptError;
      setAppointment(apptData);
      setQueue(apptData.queues);
      
      await fetchQueueStats(apptData.queue_id);
    } catch (error) {
      console.error("Error fetching appointment data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchQueueStats(queueId?: string) {
    const qId = queueId || appointment?.queue_id;
    if (!qId) return;

    try {
      const { count } = await supabase
        .from("tokens")
        .select("*", { count: 'exact', head: true })
        .eq("queue_id", qId)
        .eq("status", "waiting");

      setWaitingCount(count || 0);
    } catch (error) {
      console.error("Error fetching queue stats:", error);
    }
  }

  async function cancelAppointment() {
    if (!confirm("Are you sure you want to cancel your appointment?")) return;
    
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading appointment...</div>;
  if (!appointment) return <div className="flex min-h-screen items-center justify-center text-destructive">Appointment not found.</div>;

  const isCancelled = appointment.status === 'cancelled';
  const isCheckedIn = appointment.status === 'checked-in';

  const scheduledDate = new Date(appointment.scheduled_at);
  const formattedDate = scheduledDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const formattedTime = scheduledDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="p-4 flex items-center gap-2 border-b bg-white">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/join/${appointment.queue_id}`)}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="font-bold text-lg">{queue?.name}</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start p-4 pt-10 gap-6">
        
        <Card className="w-full max-w-md border-t-4 border-t-primary shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isCancelled ? 'bg-red-100 text-red-500' : isCheckedIn ? 'bg-emerald-100 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
              <CalendarCheck size={32} />
            </div>
            <CardTitle className="text-2xl font-black">Your Appointment</CardTitle>
            <CardDescription className="text-base font-medium">
              at {queue?.name}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-4">
            
            <div className="bg-slate-100 p-4 rounded-xl text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Scheduled For</p>
              <div className="text-3xl font-black text-slate-800">{formattedTime}</div>
              <div className="text-slate-500 font-medium">{formattedDate}</div>
            </div>

            <div className="flex items-center gap-3 bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100">
              <Info className="shrink-0" size={24} />
              <div className="text-sm font-medium leading-snug">
                {isCancelled && "This appointment has been cancelled."}
                {isCheckedIn && "You have been checked in! Your live turn is registered with the business."}
                {!isCancelled && !isCheckedIn && "Show this screen to the business counter when you arrive at your scheduled time. They will check you in."}
              </div>
            </div>

            {!isCancelled && !isCheckedIn && waitingCount !== null && (
              <div className="border border-slate-200 rounded-xl p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Live Current View</p>
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Users className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800">{waitingCount} {waitingCount === 1 ? 'person' : 'people'}</h4>
                    <p className="text-xs font-medium text-slate-500">Currently waiting in the live queue right now</p>
                  </div>
                </div>
              </div>
            )}

          </CardContent>
          <CardFooter className="flex-col gap-3">
            {!isCancelled && !isCheckedIn && (
              <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={cancelAppointment}>
                Cancel Appointment
              </Button>
            )}
            {(isCancelled || isCheckedIn) && (
              <Button className="w-full" onClick={() => router.push(`/join/${appointment.queue_id}`)}>
                Back to Queue Page
              </Button>
            )}
          </CardFooter>
        </Card>

      </main>

      <footer className="p-8 text-center text-xs text-muted-foreground">
        Powered by QueueEase
      </footer>
    </div>
  );
}
