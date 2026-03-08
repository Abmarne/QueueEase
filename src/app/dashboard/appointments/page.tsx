"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, Clock, CheckCircle2, XCircle, Plus, LayoutList } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Appointment = {
  id: string;
  business_id: string;
  queue_id: string;
  customer_id: string | null;
  guest_name: string;
  guest_email: string | null;
  scheduled_at: string;
  status: 'scheduled' | 'checked_in' | 'cancelled';
  created_at: string;
  queues: {
    name: string;
  };
};

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  async function fetchAppointments() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          queues(name)
        `)
        .eq("business_id", user?.id)
        .order("scheduled_at", { ascending: true });

      if (error) throw error;
      setAppointments(data as Appointment[] || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, newStatus: 'checked_in' | 'cancelled') {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      
      // If checked in, we should create a token in the queue
      if (newStatus === 'checked_in') {
        const appointment = appointments.find(a => a.id === id);
        if (appointment) {
          await createTokenFromAppointment(appointment);
        }
      }

      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  }

  async function createTokenFromAppointment(appointment: Appointment) {
    try {
      // 1. Get current max position for the queue
      const { data: tokens } = await supabase
        .from("tokens")
        .select("position")
        .eq("queue_id", appointment.queue_id)
        .order("position", { ascending: false })
        .limit(1);

      const nextPosition = (tokens?.[0]?.position || 0) + 1;

      // 2. Insert token
      const { error } = await supabase
        .from("tokens")
        .insert([{
          queue_id: appointment.queue_id,
          customer_id: appointment.customer_id,
          guest_name: appointment.guest_name,
          position: nextPosition,
          status: 'waiting',
          source: 'walk-in' // Check-in is like a walk-in from the system's perspective
        }]);

      if (error) throw error;
    } catch (error) {
      console.error("Error creating token from appointment:", error);
    }
  }

  if (loading) return <div className="p-8 flex items-center justify-center min-h-[400px]">Loading appointments...</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Appointments</h2>
          <p className="text-muted-foreground">Manage scheduled bookings and check-in your customers.</p>
        </div>
        <Button className="gap-2 shadow-lg">
          <Plus size={18} />
          Create Appointment
        </Button>
      </div>

      <div className="grid gap-6">
        {appointments.length === 0 ? (
          <Card className="border-dashed border-2 py-16 flex flex-col items-center justify-center text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <CardTitle className="text-xl">No appointments found</CardTitle>
            <CardDescription className="max-w-xs mt-2 text-base">
              Start by creating your first scheduled appointment to see them here.
            </CardDescription>
          </Card>
        ) : (
          appointments.map((appointment) => (
            <Card key={appointment.id} className={`overflow-hidden transition-all hover:shadow-md border-l-4 ${
              appointment.status === 'scheduled' ? 'border-primary' : 
              appointment.status === 'checked_in' ? 'border-green-500' : 'border-gray-300'
            }`}>
              <CardContent className="p-0">
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="bg-primary/5 rounded-xl p-4 flex flex-col items-center justify-center min-w-[100px] border border-primary/10">
                      <Calendar className="h-5 w-5 text-primary mb-1" />
                      <span className="text-sm font-bold text-primary">
                        {new Date(appointment.scheduled_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-tight">
                        {new Date(appointment.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xl font-bold">{appointment.guest_name}</h4>
                        <Badge variant={
                          appointment.status === 'scheduled' ? 'default' : 
                          appointment.status === 'checked_in' ? 'secondary' : 'outline'
                        } className="capitalize px-3 py-0.5 rounded-full font-bold text-[10px] tracking-widest">
                          {appointment.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <LayoutList size={14} className="text-primary/70" />
                          <span className="font-semibold">{appointment.queues.name}</span>
                        </div>
                        {appointment.guest_email && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock size={14} className="text-primary/70" />
                            <span>{appointment.guest_email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-dashed">
                    {appointment.status === 'scheduled' && (
                      <>
                        <Button 
                          size="sm" 
                          className="font-bold bg-green-600 hover:bg-green-700 gap-1.5 shadow-sm"
                          onClick={() => updateStatus(appointment.id, 'checked_in')}
                        >
                          <CheckCircle2 size={16} />
                          Check-in
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="font-bold text-destructive hover:bg-destructive/5 gap-1.5 border-destructive/20"
                          onClick={() => updateStatus(appointment.id, 'cancelled')}
                        >
                          <XCircle size={16} />
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
