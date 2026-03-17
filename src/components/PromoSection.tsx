import productsCollection from "@/assets/products-collection.jpg";

const PromoSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-0 overflow-hidden border border-border">
          <div className="overflow-hidden">
            <img
              src={productsCollection}
              alt="SkyBD Skincare Collection"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="flex flex-col justify-center p-10 md:p-16 bg-accent">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-4">
              Limited Time Offer
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Your Skincare
              <br />
              Routine, Perfected
            </h2>
            <p className="font-body text-muted-foreground mt-4 text-sm leading-relaxed">
              Get 15% off when you build your complete skincare routine. 
              Cleanser + Toner + Serum + Moisturizer — all selected for your skin type.
            </p>
            <a
              href="#"
              className="mt-8 inline-block bg-primary text-primary-foreground px-8 py-3 font-body text-sm font-semibold tracking-wide hover:opacity-90 transition-opacity w-fit"
            >
              BUILD YOUR ROUTINE
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
