import heroImage from "@/assets/hero-skincare.jpg";

const HeroSection = () => {
  return (
    <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden">
      <img
        src={heroImage}
        alt="SkyBD Premium Skincare Collection"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-secondary/30" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-primary-foreground mb-4 animate-fade-in-up">
          Clinically Tested · Dermatologist Approved
        </p>
        <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground leading-tight animate-fade-in-up-delay-1">
          Glow with
          <br />
          Confidence
        </h1>
        <p className="font-body text-base md:text-lg text-primary-foreground/80 mt-4 max-w-md animate-fade-in-up-delay-2">
          Premium skincare & cosmetics for everyone. Discover 50+ curated products.
        </p>
        <div className="mt-8 flex gap-4 animate-fade-in-up-delay-2">
          <a
            href="#products"
            className="bg-primary text-primary-foreground px-8 py-3 text-sm font-body font-semibold tracking-wide hover:opacity-90 transition-all active:scale-95"
          >
            SHOP NOW
          </a>
          <a
            href="#categories"
            className="border border-primary-foreground text-primary-foreground px-8 py-3 text-sm font-body font-semibold tracking-wide hover:bg-primary-foreground/10 transition-all active:scale-95"
          >
            EXPLORE
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
