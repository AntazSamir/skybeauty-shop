import productsCollection from "@/assets/products-collection.jpg";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

const SkinDiagnostic = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>

      <div className="container relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            
            {/* Image Side with "Shade Matcher" UI */}
            <div className="lg:col-span-6 relative order-2 lg:order-1 group">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-primary/10">
                <img 
                  src={productsCollection} 
                  alt="Cosmetic Artistry" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                
                {/* Animated Scanner Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/40 blur-[2px] shadow-[0_0_15px_rgba(30,174,181,0.5)] animate-[scanner_4s_ease-in-out_infinite]" />
                
                {/* Overlay Pigment Grid */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.05)_100%)] opacity-30" />
              </div>

              {/* Floating Shade Badge */}
              <div className="absolute -bottom-6 -right-6 lg:-right-12 bg-white/90 backdrop-blur-xl border border-primary/20 p-6 rounded-2xl shadow-2xl max-w-[260px] animate-fade-in-up">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <p className="font-display text-sm font-extrabold uppercase tracking-tighter">Color AI</p>
                    <p className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Shade Detector v3</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-4 w-4 rounded-sm" style={{ backgroundColor: i === 1 ? '#E9C46A' : i === 2 ? '#F4A261' : i === 3 ? '#E76F51' : i === 4 ? '#2A9D8F' : '#264653', opacity: 0.8 }} />
                    ))}
                  </div>
                  <p className="font-body text-[10px] text-muted-foreground leading-relaxed">
                    Analyzing <span className="text-primary font-bold">undertone & depth</span> to find your 100% clinical match.
                  </p>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 animate-fade-in-up">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-body text-[10px] font-bold tracking-[0.3em] text-primary uppercase">Artistry Innovation</span>
                </div>
                
                <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-[1.1] animate-fade-in-up-delay-1">
                  Discover your <br />
                  <span className="text-primary italic">Perfect Glow</span>
                </h2>
                
                <p className="font-body text-lg text-muted-foreground leading-relaxed animate-fade-in-up-delay-2">
                  Never buy the wrong shade again. Our proprietary AI analyzes over 500 skin profiles to identify your exact undertone, ensuring flawless, professional-grade coverage every time.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-4 animate-fade-in-up-delay-2">
                <div className="space-y-2">
                  <h4 className="font-display text-3xl font-bold text-foreground italic">100%</h4>
                  <p className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Pigment Purity</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-display text-3xl font-bold text-foreground italic">24h</h4>
                  <p className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Weightless Wear</p>
                </div>
              </div>

              <div className="pt-6 animate-fade-in-up-delay-2">
                <Button size="lg" className="h-16 px-12 rounded-full font-bold tracking-widest text-xs uppercase group shadow-2xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all">
                  FIND MY PERFECT SHADE
                  <ArrowRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform" />
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanner {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default SkinDiagnostic;
