import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Users, Zap, LayoutDashboard, Smartphone, ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium hover:text-primary">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">How it Works</Link>
            <Link href="/login" className="text-sm font-medium hover:text-primary">Login</Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-5xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Zap size={14} className="fill-current" />
            Empowering Small Businesses
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-tighter">
            Say goodbye to <span className="text-primary italic">long lines.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            QueueEase helps small businesses (clinics, salons, shops) manage waiting lines digitally. Let your customers join remotely and track their position in real-time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 text-lg gap-2">
                Register Business Now
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg">
                View Demo Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div className="p-8 bg-card rounded-2xl border flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-primary/5 text-primary">
              <Clock size={32} />
            </div>
            <h3 className="text-3xl font-bold">50%</h3>
            <p className="text-muted-foreground">Reduction in perceived wait time</p>
          </div>
          <div className="p-8 bg-card rounded-2xl border flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-green-500/5 text-green-500">
              <Users size={32} />
            </div>
            <h3 className="text-3xl font-bold">100%</h3>
            <p className="text-muted-foreground">Digital token management</p>
          </div>
          <div className="p-8 bg-card rounded-2xl border flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-orange-500/5 text-orange-500">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-3xl font-bold">Free</h3>
            <p className="text-muted-foreground">No hidden fees for MVP users</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-4">
        <div className="container mx-auto max-w-6xl space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Everything you need to manage your line.</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Designed to be simple for businesses and effortless for customers.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-primary text-white flex items-center justify-center">
                <LayoutDashboard size={24} />
              </div>
              <h3 className="text-xl font-bold">Business Dashboard</h3>
              <p className="text-muted-foreground">A clean, real-time dashboard to monitor your queues and serve customers with one click.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-primary text-white flex items-center justify-center">
                <Smartphone size={24} />
              </div>
              <h3 className="text-xl font-bold">Customer App-less Experience</h3>
              <p className="text-muted-foreground">Customers scan a QR code or click a link to join. No app download required.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-primary text-white flex items-center justify-center">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold">Real-time Sync</h3>
              <p className="text-muted-foreground">Instant updates for both businesses and customers as the queue moves.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t bg-card">
        <div className="container mx-auto px-4 flex flex-col items-center space-y-4">
           <Logo showText={true} />
           <p className="text-sm text-muted-foreground">© 2026 QueueEase. All rights reserved.</p>
           <div className="flex items-center justify-center gap-6 text-sm font-medium text-muted-foreground">
             <Link href="#" className="hover:text-primary text-xs">Terms of Service</Link>
             <Link href="#" className="hover:text-primary text-xs">Privacy Policy</Link>
           </div>
        </div>
      </footer>
    </div>
  );
}
