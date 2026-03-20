import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Users, Zap, LayoutDashboard, Smartphone, ArrowRight, Sparkles, ShieldCheck, ChevronDown } from "lucide-react";
import Logo from "@/components/Logo";

function BackgroundGlow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] rounded-full bg-blue-600/10 dark:bg-blue-600/20 blur-[120px]" />
      <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[60vh] rounded-full bg-indigo-600/10 dark:bg-indigo-600/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vh] rounded-full bg-purple-600/10 dark:bg-purple-600/20 blur-[120px]" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background font-sans overflow-hidden">
      <BackgroundGlow />
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo size={40} />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">Login</Link>
            <Link href="/register">
              <Button className="rounded-full shadow-lg font-bold px-6">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 px-4 z-10 flex flex-col items-center justify-between min-h-screen">
        <div className="container mx-auto max-w-5xl text-center flex flex-col items-center mt-12 mb-auto">
          
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest border border-blue-500/20 backdrop-blur-md mb-8 shadow-sm">
              <Sparkles size={16} className="fill-current animate-pulse" />
              The Future of Queueing
            </div>
            
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[1] mb-8">
              Skip the line.<br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 inline-block drop-shadow-sm pb-2">
                Keep your time.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed mb-12">
              QueueEase is the intelligent, zero-friction waiting line manager. No apps to download. No hardware to buy. Just pure efficiency for your business.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/register">
                <Button size="lg" className="h-16 px-10 rounded-full text-lg font-extrabold gap-3 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.7)] hover:scale-105 transition-all duration-300">
                  Launch Your Queue
                  <ArrowRight size={22} className="opacity-80" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="h-16 px-10 rounded-full text-lg font-bold border-2 hover:bg-muted/50 hover:scale-105 transition-all duration-300">
                  View Live Dashboard
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Mockup Dashboard / Glass Panel */}
          <div className="w-full max-w-5xl mt-24 relative animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 group">
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent z-10" />
            <div className="rounded-t-3xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-3xl shadow-2xl overflow-hidden transition-transform duration-700 group-hover:-translate-y-2">
              <div className="h-14 border-b border-white/10 bg-white/40 dark:bg-white/5 flex items-center px-6 gap-2 backdrop-blur-md">
                <div className="h-3.5 w-3.5 rounded-full bg-[#ff5f56] shadow-sm" />
                <div className="h-3.5 w-3.5 rounded-full bg-[#ffbd2e] shadow-sm" />
                <div className="h-3.5 w-3.5 rounded-full bg-[#27c93f] shadow-sm" />
                <div className="mx-auto text-xs font-bold text-muted-foreground tracking-widest uppercase opacity-50">QueueEase Live Status</div>
              </div>
              <div className="p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-6 opacity-90">
                <div className="col-span-2 row-span-2 rounded-2xl bg-blue-500/10 border-2 border-blue-500/30 flex flex-col items-center justify-center relative overflow-hidden group-hover:bg-blue-500/20 transition-colors duration-500 min-h-[200px]">
                  <div className="absolute top-0 right-0 p-4 opacity-20"><Smartphone size={60} /></div>
                  <div className="text-blue-700 dark:text-blue-300 text-sm font-bold uppercase tracking-widest mb-2 opacity-70">Currently Serving</div>
                  <div className="text-6xl sm:text-8xl font-black text-blue-600 dark:text-blue-400 drop-shadow-md tracking-tighter">#042</div>
                </div>
                <div className="rounded-2xl bg-muted/40 border border-border/50 flex flex-col items-center justify-center p-6 gap-3">
                  <div className="text-3xl font-black text-muted-foreground/80">#043</div>
                  <div className="h-2 w-16 bg-muted-foreground/20 rounded-full" />
                </div>
                <div className="rounded-2xl bg-muted/40 border border-border/50 flex flex-col items-center justify-center p-6 gap-3">
                  <div className="text-3xl font-black text-muted-foreground/80">#044</div>
                  <div className="h-2 w-16 bg-muted-foreground/20 rounded-full" />
                </div>
                <div className="rounded-2xl bg-muted/40 border border-border/50 flex flex-col items-center justify-center p-6 gap-3">
                  <div className="text-3xl font-black text-muted-foreground/80">#045</div>
                  <div className="h-2 w-16 bg-muted-foreground/20 rounded-full" />
                </div>
                <div className="rounded-2xl bg-muted/40 border border-border/50 flex flex-col items-center justify-center p-6 gap-3 relative overflow-hidden">
                  <div className="text-3xl font-black text-muted-foreground/80">#046</div>
                  <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
                </div>
              </div>
            </div>
          </div>

        </div>
        
        {/* Scroll Indicator */}
        <div className="animate-bounce flex flex-col items-center text-muted-foreground/40 mb-8 mt-12 hidden md:flex">
          <span className="text-[10px] font-black tracking-widest uppercase mb-2">Scroll To Explore</span>
          <ChevronDown size={20} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative z-10 border-y border-border/40 bg-background/40 backdrop-blur-3xl">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-border/50">
          <div className="flex flex-col items-center justify-center pt-8 md:pt-0 duration-500 hover:scale-105 transition-transform">
             <div className="text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/30 mb-4 drop-shadow-sm">
               50%
             </div>
             <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Reduced Wait Times</p>
          </div>
          <div className="flex flex-col items-center justify-center pt-8 md:pt-0 duration-500 hover:scale-105 transition-transform">
             <div className="text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/30 mb-4 drop-shadow-sm">
               Free
             </div>
             <p className="text-sm font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">Zero Setup Costs</p>
          </div>
          <div className="flex flex-col items-center justify-center pt-8 md:pt-0 duration-500 hover:scale-105 transition-transform">
             <div className="text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/30 mb-4 drop-shadow-sm">
               1.2s
             </div>
             <p className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">Scan to Join</p>
          </div>
        </div>
      </section>

      {/* Bento Layout Features */}
      <section id="features" className="py-32 px-4 relative z-10 bg-black/[0.02] dark:bg-white/[0.02]">
        <div className="container mx-auto max-w-6xl space-y-20">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              The ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">waiting experience.</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">Everything you need to turn frustrating lines into seamless, highly-rated digital workflows.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 auto-rows-fr">
            {/* Big Card */}
            <div className="md:col-span-2 min-h-[350px] group rounded-[2.5rem] border border-border/40 bg-gradient-to-br from-background/80 to-muted/20 backdrop-blur-xl p-10 overflow-hidden relative shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-500/30 transition-all duration-500 flex flex-col justify-between">
              <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 transition-all duration-700">
                <Smartphone size={350} />
              </div>
              <div className="h-16 w-16 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20 flex items-center justify-center shadow-inner mb-8 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <Smartphone size={30} />
              </div>
              <div className="relative z-10 mt-auto">
                <h3 className="text-3xl font-black mb-3">App-less Entry</h3>
                <p className="text-lg text-muted-foreground/80 max-w-md font-medium leading-relaxed">Customers scan a QR code holding your brand, and they're instantly in line. Nothing to download. No accounts required.</p>
              </div>
            </div>

            {/* Square Card 1 */}
            <div className="min-h-[350px] group rounded-[2.5rem] border border-border/40 bg-gradient-to-br from-background/80 to-muted/20 backdrop-blur-xl p-10 relative shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-500/30 transition-all duration-500 flex flex-col justify-between overflow-hidden">
               <div className="absolute -bottom-10 -right-10 p-8 opacity-[0.03] group-hover:opacity-[0.06] group-hover:rotate-12 transition-all duration-700">
                 <Zap size={250} />
               </div>
               <div className="h-16 w-16 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-600/20 flex items-center justify-center shadow-inner mb-8 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                 <Zap size={30} />
               </div>
               <div className="relative z-10 mt-auto">
                 <h3 className="text-2xl font-black mb-3">Instant Sync</h3>
                 <p className="text-muted-foreground/80 font-medium leading-relaxed">Real-time socket updates ensure nobody misses their turn.</p>
               </div>
            </div>

            {/* Square Card 2 */}
            <div className="min-h-[350px] group rounded-[2.5rem] border border-border/40 bg-gradient-to-br from-background/80 to-muted/20 backdrop-blur-xl p-10 relative shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-purple-500/30 transition-all duration-500 flex flex-col justify-between overflow-hidden">
               <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] group-hover:opacity-[0.06] group-hover:-rotate-12 transition-all duration-700">
                 <ShieldCheck size={250} />
               </div>
               <div className="h-16 w-16 rounded-2xl bg-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-600/20 flex items-center justify-center shadow-inner mb-8 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                 <ShieldCheck size={30} />
               </div>
               <div className="relative z-10 mt-auto">
                 <h3 className="text-2xl font-black mb-3">Bulletproof</h3>
                 <p className="text-muted-foreground/80 font-medium leading-relaxed">Enterprise-grade servers. Never crash under heavy weekend load.</p>
               </div>
            </div>
            
            {/* Big Bottom Card */}
            <div className="md:col-span-2 min-h-[350px] group rounded-[2.5rem] border border-border/40 bg-gradient-to-br from-background/80 to-muted/20 backdrop-blur-xl p-10 relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-amber-500/30 transition-all duration-500 flex flex-col justify-between">
              <div className="absolute -bottom-10 -right-10 p-8 opacity-[0.03] group-hover:opacity-[0.06] group-hover:-translate-y-4 group-hover:-translate-x-4 transition-all duration-700">
                <LayoutDashboard size={350} />
              </div>
               <div className="h-16 w-16 rounded-2xl bg-amber-600/10 text-amber-600 dark:text-amber-500 border border-amber-600/20 flex items-center justify-center shadow-inner mb-8 transition-colors group-hover:bg-amber-600 group-hover:text-white">
                 <LayoutDashboard size={30} />
               </div>
               <div className="relative z-10 mt-auto">
                 <h3 className="text-3xl font-black mb-3">God-mode Dashboard</h3>
                 <p className="text-lg text-muted-foreground/80 max-w-xl font-medium leading-relaxed">Edit party sizes, manage walk-ins versus remote joiners, and analyze your peak hours in one stunning interface.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-border/40 bg-background relative z-10">
        <div className="container mx-auto px-4 flex flex-col items-center space-y-8">
           <Logo size={48} showText={true} />
           <p className="text-sm font-medium text-muted-foreground/60 max-w-sm text-center">Digitally orchestrating the world's waiting lines.</p>
           <div className="flex items-center justify-center gap-8 text-sm font-bold text-muted-foreground/80">
             <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
             <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
             <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
           </div>
           <p className="text-xs text-muted-foreground/40 font-bold tracking-widest uppercase mt-8">© 2026 QueueEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
