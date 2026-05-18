import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { products, getProductSlug } from "@/data/products";

const NewArrivals = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Filter products that have the "New" tag
  const newProducts = products.filter((p) => p.tag === "New");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={ref} 
      className="py-24 bg-gradient-to-b from-background to-muted/20 border-t border-border overflow-hidden"
    >
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 animate-fade-in-up">
          <div>
            <span className="font-body text-[10px] font-bold tracking-[0.4em] text-primary uppercase mb-4 block">
              Just In
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
              Discover <span className="italic text-primary">New Arrivals</span>
            </h2>
          </div>
          <Link
            to="/products?category=All"
            className="group inline-flex items-center gap-2 font-body text-xs font-bold tracking-widest text-foreground hover:text-primary mt-6 md:mt-0 transition-colors uppercase"
          >
            Explore Full Collection 
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {newProducts.map((product, i) => (
            <Link
              to={`/product/${getProductSlug(product)}`}
              key={product.id}
              className={`group flex flex-col sm:flex-row items-center bg-card border border-border rounded-3xl p-6 gap-6 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Product Image */}
              <div className="relative w-full sm:w-48 aspect-square rounded-2xl overflow-hidden bg-muted shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute top-4 left-4 bg-primary text-primary-foreground font-body text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                  NEW
                </span>
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-between h-full py-2 text-center sm:text-left w-full">
                <div>
                  <span className="font-body text-[10px] font-bold tracking-widest text-primary uppercase mb-2 block">
                    {product.category}
                  </span>
                  <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-lg font-bold text-foreground">
                      ৳{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="font-body text-xs text-muted-foreground line-through opacity-60">
                        ৳{product.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105">
                    <ShoppingBag size={18} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
