"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Settings, ListOrdered, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (!loading && profile && profile.role !== "business") {
      router.push("/"); // Or some customer landing page
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!user || (profile && profile.role !== "business")) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">QueueEase</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LayoutDashboard size={18} />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/queues">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <ListOrdered size={18} />
              My Queues
            </Button>
          </Link>
          <Link href="/dashboard/analytics">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <BarChart3 size={18} />
              Analytics
            </Button>
          </Link>
        </nav>
        <div className="p-4 border-t space-y-4">
          <div className="px-2">
            <p className="text-sm font-medium truncate">{profile?.name || user.email}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <Button variant="outline" className="w-full justify-start gap-2 text-destructive hover:text-destructive" onClick={() => signOut()}>
            <LogOut size={18} />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
