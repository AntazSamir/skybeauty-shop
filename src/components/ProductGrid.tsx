import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart } from "lucide-react";
import { products, getProductSlug } from "@/data/products";

const products = [
  { id: 1, name: "Hydra Glow Moisturizer", price: 850, originalPrice: 1200, image: productMoisturizer, tag: "Bestseller", category: "Skincare" },
  { id: 2, name: "Vitamin C Serum", price: 1200, image: productSerum, tag: "New", category: "Skincare" },
  { id: 3, name: "Gentle Foam Cleanser", price: 550, image: productCleanser, category: "Cleanser" },
  { id: 4, name: "SPF 50+ Sunscreen", price: 750, originalPrice: 950, image: productSunscreen, category: "Skincare" },
  { id: 5, name: "Rose Tint Lip Balm", price: 350, image: productLipcare, tag: "Popular", category: "Makeup" },
  { id: 6, name: "Anti-Aging Eye Cream", price: 980, image: productEyecream, category: "Skincare" },
  { id: 7, name: "Hydrating Face Mask", price: 450, image: productFacemask, tag: "New", category: "Skincare" },
  { id: 8, name: "Balancing Toner", price: 680, image: productToner, category: "Skincare" },
];

const filters = ["All", "Skincare", "Makeup", "Cleanser"];

const ProductGrid = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = activeFilter === "All" ? products : products.filter((p) => p.category === activeFilter);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="products" className="py-20 bg-muted/50" ref={ref}>
      <div className="container">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground text-center mb-3">
          Our Products
        </h2>
        <p className="font-body text-muted-foreground text-center mb-8 text-sm">
          Dermatologist tested · 100% authentic · Loved by thousands
        </p>

        {/* Filters */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`font-body text-sm px-5 py-2 transition-all duration-200 ${
                activeFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 auto-rows-auto">
          {filtered.map((product, i) => {
            // Bento pattern on mobile: items 0,3,6 span full width
            const isBentoFull = i % 3 === 0;
            return (
            <div
              key={product.id}
              className={`group bg-background border border-border overflow-hidden transition-all duration-500 hover:shadow-lg ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              } ${isBentoFull ? "col-span-2 md:col-span-1" : "col-span-1"}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className={`relative overflow-hidden bg-muted ${isBentoFull ? "aspect-[2/1] md:aspect-square" : "aspect-square"}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {product.tag && (
                  <span className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-body font-semibold tracking-wide uppercase ${
                    product.tag === "New" ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
                  }`}>
                    {product.tag}
                  </span>
                )}
                <button
                  className="absolute top-3 right-3 w-8 h-8 bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-background text-muted-foreground hover:text-destructive"
                  aria-label="Add to wishlist"
                >
                  <Heart size={16} />
                </button>
                <button
                  className="absolute bottom-3 right-3 w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:opacity-90"
                  aria-label="Add to cart"
                >
                  <ShoppingBag size={16} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-display text-sm font-semibold text-foreground leading-snug">
                  {product.name}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-body text-sm font-bold text-primary">৳{product.price}</span>
                  {product.originalPrice && (
                    <span className="font-body text-xs text-muted-foreground line-through">
                      ৳{product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )})}

        </div>

        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-block border-2 border-foreground text-foreground px-10 py-3 font-body text-sm font-semibold tracking-wide hover:bg-foreground hover:text-background transition-colors duration-200"
          >
            VIEW ALL PRODUCTS
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
