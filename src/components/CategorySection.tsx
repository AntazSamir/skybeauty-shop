import { useEffect, useRef, useState } from "react";
import productSerum from "@/assets/product-serum.jpg";
import productMoisturizer from "@/assets/product-moisturizer.jpg";
import productCleanser from "@/assets/product-cleanser.jpg";
import productLipcare from "@/assets/product-lipcare.jpg";

const categories = [
  { name: "Skincare", image: productSerum, count: "20+ Products" },
  { name: "Moisturizers", image: productMoisturizer, count: "12+ Products" },
  { name: "Cleansers", image: productCleanser, count: "8+ Products" },
];

const CategorySection = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="categories" className="py-20 bg-background" ref={ref}>
      <div className="container">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground text-center mb-3">
          Shop by Category
        </h2>
        <p className="font-body text-muted-foreground text-center mb-12 text-sm">
          Find exactly what your skin needs
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          {categories.map((cat, i) => (
            <a
              key={cat.name}
              href="#"
              className={`group relative overflow-hidden bg-muted transition-all duration-500 w-[calc(50%-16px)] md:w-[280px] ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-display text-lg font-semibold text-foreground">{cat.name}</h3>
                <p className="font-body text-xs text-muted-foreground mt-1">{cat.count}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
