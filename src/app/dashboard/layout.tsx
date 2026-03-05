"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, ListOrdered, BarChart3, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const navLinks = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/queues", icon: ListOrdered, label: "My Queues" },
    { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b flex items-center justify-between px-4 z-40">
        <h1 className="text-xl font-bold text-primary">QueueEase</h1>
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
          <Menu size={24} />
        </Button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-card border-r flex flex-col z-50 transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-black text-primary">QueueEase</h1>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </Button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsSidebarOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
                <link.icon size={18} />
                <span className="font-medium">{link.label}</span>
              </Button>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t space-y-4">
          <div className="px-2">
            <p className="text-sm font-bold truncate">{profile?.name || user.email?.split('@')[0]}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 h-11 text-destructive border-destructive/20 hover:bg-destructive/5 hover:text-destructive transition-all" 
            onClick={() => signOut()}
          >
            <LogOut size={18} />
            <span className="font-medium">Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8 w-full max-w-7xl mx-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
