import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Users, Zap, LayoutDashboard, Smartphone, ArrowRight, Sparkles, ShieldCheck, ChevronDown, ListOrdered } from "lucide-react";
import Logo from "@/components/Logo";

function BackgroundGlow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vh] rounded-full bg-primary/10 blur-[150px]" />
      <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[70vh] rounded-full bg-secondary/10 blur-[150px]" />
      <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vh] rounded-full bg-primary/5 blur-[150px]" />
    </div>
  );
}

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Nex",
    "operatingSystem": "Web",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "description": "High-performance digital queue management system for modern businesses.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "850"
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-white font-sans overflow-hidden selection:bg-primary/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BackgroundGlow />
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-2xl">
        <div className="container mx-auto px-4 sm:px-6 h-20 md:h-24 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo size={32} className="md:scale-110" />
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            <Link href="#features" className="text-xs font-black tracking-widest uppercase text-muted-foreground hover:text-white transition-colors">Features</Link>
            <Link href="/login" className="text-xs font-black tracking-widest uppercase text-muted-foreground hover:text-white transition-colors">Login</Link>
            <Link href="/register">
              <Button className="rounded-xl shadow-[0_0_20px_-5px_var(--color-primary)] hover:shadow-[0_0_30px_-5px_var(--color-primary)] bg-primary text-white font-black uppercase tracking-widest text-[10px] px-8 h-12 transition-all">Command Center</Button>
            </Link>
          </nav>

          {/* Mobile CTA */}
          <div className="md:hidden flex items-center gap-4">
             <Link href="/login" className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">Login</Link>
             <Link href="/register">
               <Button className="rounded-lg bg-primary text-white font-black uppercase tracking-widest text-[9px] px-4 h-9">HQ</Button>
             </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 px-4 md:px-6 z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="container mx-auto max-w-6xl text-center flex flex-col items-center mt-12 mb-auto">
          
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-3 px-4 md:px-6 py-2 md:py-2.5 rounded-full bg-primary/10 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20 backdrop-blur-md mb-8 md:mb-12 shadow-[0_0_15px_-5px_var(--color-primary)]">
              <Sparkles size={14} className="fill-primary animate-pulse" />
              Next-Gen Queueing Protocol
            </div>
            
            <h1 className="text-5xl sm:text-8xl md:text-[8rem] font-black tracking-tighter leading-[0.95] md:leading-[0.9] mb-8 md:mb-10 text-white drop-shadow-2xl">
              Wait <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-lg">Smarter.</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-muted-foreground/80 max-w-2xl md:max-w-3xl mx-auto font-medium leading-relaxed mb-12 md:mb-16 tracking-wide px-4">
              The high-performance, real-time waiting terminal. No downloads. No friction. Pure operational superiority.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full max-w-xs sm:max-w-none mx-auto">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-14 md:h-16 px-8 md:px-12 rounded-2xl text-[12px] md:text-[14px] font-black uppercase tracking-widest gap-4 shadow-[0_0_40px_-10px_var(--color-primary)] hover:shadow-[0_0_60px_-10px_var(--color-primary)] hover:scale-105 transition-all duration-300 bg-primary text-white border border-primary/50">
                  Deploy Terminal
                  <ArrowRight size={20} className="hidden sm:block" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 md:h-16 px-8 md:px-12 rounded-2xl text-[12px] md:text-[14px] font-black uppercase tracking-widest gap-4 border border-white/10 bg-white/5 hover:bg-white/10 text-white hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                  System Login
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Glass Mockup Dashboard */}
          <div className="w-full max-w-5xl mt-24 md:mt-32 relative animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 group perspective">
            <div className="absolute inset-x-0 bottom-[-50px] h-32 bg-primary/20 blur-[100px] z-0" />
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 z-20" />
            
            <div className="rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 bg-[#121212]/90 backdrop-blur-3xl shadow-2xl shadow-primary/10 overflow-hidden transition-transform duration-700 hover:-translate-y-4 relative z-10 mx-2 md:mx-0">
              <div className="h-12 md:h-16 border-b border-white/5 bg-black/40 flex items-center px-4 md:px-8 gap-2 md:gap-3 backdrop-blur-md">
                <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-red-500 shadow-[0_0_10px_var(--color-red-500)]" />
                <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-amber-500 shadow-[0_0_10px_var(--color-amber-500)]" />
                <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_var(--color-emerald-500)]" />
                <div className="mx-auto text-[8px] md:text-[10px] font-black text-muted-foreground/50 tracking-widest uppercase">TERMINAL_PREVIEW_01</div>
              </div>
              <div className="p-4 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 relative">
                 {/* Left Glowing Active Card */}
                <div className="col-span-2 md:row-span-2 rounded-[1.2rem] md:rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center relative overflow-hidden min-h-[160px] md:min-h-[250px] shadow-[inset_0_0_50px_-20px_var(--color-emerald-500)]">
                  <div className="absolute top-0 right-0 p-4 md:p-8 opacity-10 md:opacity-20"><Smartphone size={40} className="md:w-20 md:h-20 text-emerald-500" /></div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 md:w-2 h-1/2 bg-emerald-500 rounded-r-full shadow-[0_0_15px_var(--color-emerald-500)]" />
                  <div className="text-emerald-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-2 md:mb-4">Live Focus</div>
                  <div className="text-5xl sm:text-7xl md:text-9xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] tracking-tighter">#042</div>
                </div>
                
                {/* Secondary Cards */}
                <div className="rounded-[1.2rem] md:rounded-[2rem] bg-black/40 border border-white/5 flex flex-col items-center justify-center p-4 md:p-8 gap-2 md:gap-4 hover:border-white/10 transition-colors">
                  <div className="text-2xl md:text-4xl font-black text-white/40">#043</div>
                  <div className="h-1 w-8 md:h-1.5 md:w-12 bg-white/10 rounded-full" />
                </div>
                <div className="rounded-[1.2rem] md:rounded-[2rem] bg-black/40 border border-white/5 flex flex-col items-center justify-center p-4 md:p-8 gap-2 md:gap-4 hover:border-white/10 transition-colors">
                  <div className="text-2xl md:text-4xl font-black text-white/40">#044</div>
                  <div className="h-1 w-8 md:h-1.5 md:w-12 bg-white/10 rounded-full" />
                </div>
                <div className="hidden md:flex rounded-[2rem] bg-black/40 border border-white/5 flex-col items-center justify-center p-8 gap-4 hover:border-white/10 transition-colors">
                  <div className="text-4xl font-black text-white/40">#045</div>
                  <div className="h-1.5 w-12 bg-white/10 rounded-full" />
                </div>
                <div className="hidden md:flex rounded-[2rem] bg-black/40 border border-primary/20 flex-col items-center justify-center p-8 gap-4 relative overflow-hidden bg-primary/5">
                  <div className="text-4xl font-black text-primary">#046</div>
                  <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />
                </div>
              </div>
            </div>
          </div>

        </div>
        
        {/* Scroll Indicator */}
        <div className="animate-bounce flex flex-col items-center text-white/20 mb-12 mt-20 hidden md:flex">
          <span className="text-[10px] font-black tracking-[0.2em] uppercase mb-4">Scroll Down</span>
          <ChevronDown size={24} />
        </div>
      </section>


      {/* Extreme Stats */}
      <section className="py-20 md:py-24 relative z-10 border-y border-white/5 bg-black/50 backdrop-blur-2xl">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 text-center divide-y md:divide-y-0 md:divide-x divide-white/5">
          <div className="flex flex-col items-center justify-center pt-8 md:pt-0 group cursor-default">
             <div className="text-6xl sm:text-7xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500 title-font tracking-tighter">
               50%
             </div>
             <p className="text-[10px] md:text-[12px] font-black text-primary uppercase tracking-[0.2em]">Efficiency Boost</p>
          </div>
          <div className="flex flex-col items-center justify-center pt-8 md:pt-0 group cursor-default">
             <div className="text-6xl sm:text-7xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500 title-font tracking-tighter">
               $0
             </div>
             <p className="text-[10px] md:text-[12px] font-black text-secondary uppercase tracking-[0.2em]">Deployment Cost</p>
          </div>
          <div className="flex flex-col items-center justify-center pt-8 md:pt-0 group cursor-default">
             <div className="text-6xl sm:text-7xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500 title-font tracking-tighter">
               1s
             </div>
             <p className="text-[10px] md:text-[12px] font-black text-emerald-500 uppercase tracking-[0.2em]">Scan to Enter</p>
          </div>
        </div>
      </section>

      {/* Bento Layout Features */}
      <section id="features" className="py-24 md:py-40 px-6 relative z-10 bg-background">
        <div className="container mx-auto max-w-7xl space-y-16 md:space-y-24">
          <div className="text-center space-y-4 md:space-y-6">
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-tight text-white drop-shadow-lg">
              The Architecture of <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Waiting.</span>
            </h2>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed tracking-wide px-4">Heavy-duty enterprise features bundled in a premium UI layer tailored for maximum aesthetics.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 auto-rows-fr">
            {/* Big Bento Left */}
            <div className="md:col-span-2 min-h-[350px] md:min-h-[400px] group rounded-[2rem] md:rounded-[3rem] border border-white/5 bg-[#121212]/80 backdrop-blur-2xl p-8 md:p-12 overflow-hidden relative shadow-2xl hover:-translate-y-2 hover:border-primary/30 transition-all duration-500 flex flex-col justify-between">
              <div className="absolute -top-10 -right-10 md:-top-20 md:-right-20 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
                <Smartphone size={300} className="md:w-[400px] md:h-[400px] text-primary" />
              </div>
              <div className="h-14 w-14 md:h-20 md:w-20 rounded-xl md:rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shadow-[inset_0_0_20px_rgba(var(--color-primary),0.2)] mb-8 md:mb-10 transition-colors group-hover:bg-primary group-hover:text-white">
                <Smartphone size={28} className="md:w-10 md:h-10" />
              </div>
              <div className="relative z-10 mt-auto">
                <h3 className="text-3xl md:text-4xl font-black mb-3 md:mb-4 text-white tracking-tight">Zero-Install Access</h3>
                <p className="text-base md:text-lg text-muted-foreground max-w-md font-medium leading-relaxed">Customers scan a branded QR tag to instantly serialize onto the list. No garbage apps. No passwords.</p>
              </div>
            </div>

            {/* Small Bento Right Top */}
            <div className="min-h-[350px] md:min-h-[400px] group rounded-[2rem] md:rounded-[3rem] border border-white/5 bg-[#121212]/80 backdrop-blur-2xl p-8 md:p-12 relative shadow-2xl hover:-translate-y-2 hover:border-secondary/30 transition-all duration-500 flex flex-col justify-between overflow-hidden">
               <div className="absolute -bottom-10 -right-10 p-8 opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all duration-700">
                 <Zap size={200} className="md:w-[250px] md:h-[250px] text-secondary" />
               </div>
               <div className="h-14 w-14 md:h-20 md:w-20 rounded-xl md:rounded-2xl bg-secondary/10 text-secondary border border-secondary/20 flex items-center justify-center shadow-inner mb-8 md:mb-10 transition-colors group-hover:bg-secondary group-hover:text-white">
                 <Zap size={28} className="md:w-10 md:h-10" />
               </div>
               <div className="relative z-10 mt-auto">
                 <h3 className="text-2xl md:text-3xl font-black mb-3 md:mb-4 text-white tracking-tight">Hyper-Sync</h3>
                 <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed">Socket-level immediate reactivity across every mobile device globally.</p>
               </div>
            </div>

            {/* Small Bento Left Bottom */}
            <div className="min-h-[350px] md:min-h-[400px] group rounded-[2rem] md:rounded-[3rem] border border-white/5 bg-[#121212]/80 backdrop-blur-2xl p-8 md:p-12 relative shadow-2xl hover:-translate-y-2 hover:border-amber-500/30 transition-all duration-500 flex flex-col justify-between overflow-hidden">
               <div className="absolute -top-10 -right-10 p-8 opacity-5 group-hover:opacity-10 group-hover:-rotate-12 transition-all duration-700">
                 <ShieldCheck size={200} className="md:w-[250px] md:h-[250px] text-amber-500" />
               </div>
               <div className="h-14 w-14 md:h-20 md:w-20 rounded-xl md:rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shadow-inner mb-8 md:mb-10 transition-colors group-hover:bg-amber-500 group-hover:text-white">
                 <ShieldCheck size={28} className="md:w-10 md:h-10" />
               </div>
               <div className="relative z-10 mt-auto">
                 <h3 className="text-2xl md:text-3xl font-black mb-3 md:mb-4 text-white tracking-tight">Armor Core</h3>
                 <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed">Redundant cloud edges prevent dropouts during holiday rushes.</p>
               </div>
            </div>
            
            {/* Big Bento Right Bottom */}
            <div className="md:col-span-2 min-h-[350px] md:min-h-[400px] group rounded-[2rem] md:rounded-[3rem] border border-white/5 bg-[#121212]/80 backdrop-blur-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl hover:-translate-y-2 hover:border-primary/30 transition-all duration-500 flex flex-col justify-between">
              <div className="absolute -bottom-10 -right-10 md:-bottom-20 md:-right-20 p-8 opacity-5 group-hover:opacity-10 group-hover:-translate-y-4 group-hover:-translate-x-4 transition-all duration-700">
                <ListOrdered size={300} className="md:w-[400px] md:h-[400px] text-primary" />
              </div>
               <div className="h-14 w-14 md:h-20 md:w-20 rounded-xl md:rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shadow-inner mb-8 md:mb-10 transition-colors group-hover:bg-primary group-hover:text-white">
                 <LayoutDashboard size={28} className="md:w-10 md:h-10" />
               </div>
               <div className="relative z-10 mt-auto">
                 <h3 className="text-3xl md:text-4xl font-black mb-3 md:mb-4 text-white tracking-tight">Command Center</h3>
                 <p className="text-base md:text-lg text-muted-foreground max-w-xl font-medium leading-relaxed">Omniscient God-mode dashboard. Process wait intervals, analytics, and active hubs in a completely modernized dark format.</p>
               </div>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-32 border-t border-white/5 bg-black relative z-10">
        <div className="container mx-auto px-6 flex flex-col items-center space-y-12">
           <Logo size={60} showText={true} />
           <p className="text-sm font-black tracking-widest uppercase text-muted-foreground/30 max-w-sm text-center">Digitally orchestrating the world's waiting lines.</p>
           <div className="flex items-center justify-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
             <Link href="#" className="hover:text-white transition-colors">Terms of Spec</Link>
             <Link href="#" className="hover:text-white transition-colors">Privacy Matrix</Link>
             <Link href="#" className="hover:text-white transition-colors">Comms Link</Link>
           </div>
           <p className="text-[10px] text-muted-foreground/20 font-black tracking-[0.3em] uppercase mt-12">© 2026 Nex Platform.</p>
        </div>
      </footer>
    </div>
  );
}
