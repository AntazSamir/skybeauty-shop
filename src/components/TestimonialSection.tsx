import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Fatima R.",
    text: "The Vitamin C Serum completely transformed my skin! I've been using it for 3 months and the glow is real.",
    rating: 5,
    product: "Vitamin C Serum",
  },
  {
    name: "Arif H.",
    text: "Finally found a sunscreen that doesn't leave a white cast. Perfect for daily use. Highly recommend!",
    rating: 5,
    product: "SPF 50+ Sunscreen",
  },
  {
    name: "Nusrat A.",
    text: "The moisturizer is so lightweight yet deeply hydrating. My go-to product from SkyBD. Love it!",
    rating: 5,
    product: "Hydra Glow Moisturizer",
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground text-center mb-3">
          What Our Customers Say
        </h2>
        <p className="font-body text-muted-foreground text-center mb-12 text-sm">
          Real reviews from real people
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-background p-8 border border-border">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="font-body text-sm text-foreground leading-relaxed mb-6">
                "{t.text}"
              </p>
              <div className="border-t border-border pt-4">
                <p className="font-body text-sm font-semibold text-foreground">{t.name}</p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">
                  Purchased: {t.product}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
