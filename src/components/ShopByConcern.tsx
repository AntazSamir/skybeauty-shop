import { Droplets, Sparkles, ShieldCheck, Zap } from "lucide-react";
import productSerum from "@/assets/product-serum.jpg";
import productMoisturizer from "@/assets/product-moisturizer.jpg";
import productToner from "@/assets/product-toner.jpg";
import productCleanser from "@/assets/product-cleanser.jpg";

const concerns = [
  {
    id: 1,
    name: "Fine Lines & Wrinkles",
    icon: Sparkles,
    description: "Targeted anti-aging solutions for youthful, firm skin.",
    image: productSerum
  },
  {
    id: 2,
    name: "Dryness & Dehydration",
    icon: Droplets,
    description: "Intense moisture boosters for a plump, dewy glow.",
    image: productMoisturizer
  },
  {
    id: 3,
    name: "Dark Spots & Dullness",
    icon: Zap,
    description: "Brightening formulas to even out your natural tone.",
    image: productToner
  },
  {
    id: 4,
    name: "Acne & Blemishes",
    icon: ShieldCheck,
    description: "Gentle yet effective treatments for clear, calm skin.",
    image: productCleanser
  }
];

const ShopByConcern = () => {
  return (
    <section className="py-24 bg-background border-t border-border">
      <div className="container">
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="font-body text-[10px] font-bold tracking-[0.4em] text-muted-foreground uppercase mb-4 block">Personalized Care</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            Shop by <span className="italic text-primary">Skin Concern</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {concerns.map((concern, i) => (
            <div 
              key={concern.id}
              className={`group cursor-pointer animate-fade-in-up-delay-${Math.min(i + 1, 2)}`}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-6 shadow-sm group-hover:shadow-xl transition-all duration-500">
                <img 
                  src={concern.image} 
                  alt={concern.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors" />
                
                {/* Icon Badge */}
                <div className="absolute top-6 left-6 w-12 h-12 bg-background/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-primary shadow-lg border border-primary/10">
                  <concern.icon size={24} />
                </div>
              </div>
              
              <div className="text-center px-4">
                <h3 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {concern.name}
                </h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed mb-4">
                  {concern.description}
                </p>
                <span className="inline-block font-body text-[10px] font-bold tracking-widest text-primary border-b border-primary/20 pb-0.5 uppercase group-hover:border-primary transition-all">
                  Browse Solutions
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByConcern;
