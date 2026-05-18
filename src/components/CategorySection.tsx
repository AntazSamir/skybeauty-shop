/**
 * CategorySection — Dynamically fetches WooCommerce product categories.
 * Falls back to static data if API is unavailable.
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import productSerum from "@/assets/product-serum.jpg";
import productMoisturizer from "@/assets/product-moisturizer.jpg";
import productCleanser from "@/assets/product-cleanser.jpg";

// Fallback static categories (shown while loading or if API fails)
const FALLBACK = [
  { id: 0, name: "Moisturiser", slug: "moisturiser", image: productMoisturizer, count: 12 },
  { id: 0, name: "Cleanser", slug: "cleanser", image: productCleanser, count: 8 },
  { id: 0, name: "Serum", slug: "serum", image: productSerum, count: 20 },
];

const FALLBACK_IMAGES: Record<string, string> = {
  moisturiser: productMoisturizer,
  moisturizer: productMoisturizer,
  cleanser: productCleanser,
  serum: productSerum,
  syrum: productSerum,
};

const CategorySection = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data: wcCategories, isLoading } = useCategories();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Resolve categories: prefer API, fall back to static
  const categories =
    !isLoading && wcCategories && wcCategories.length > 0
      ? wcCategories
          .filter((c) => c.count > 0 && c.parent === 0)
          .slice(0, 6)
          .map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            image: c.image?.src ?? FALLBACK_IMAGES[c.slug] ?? productMoisturizer,
            count: c.count,
          }))
      : FALLBACK;

  // Skeleton cards while loading
  const skeletons = Array.from({ length: 3 });

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
          {isLoading
            ? skeletons.map((_, i) => (
                <div
                  key={i}
                  className="w-[calc(50%-16px)] md:w-[280px] bg-muted animate-pulse rounded-md overflow-hidden"
                >
                  <div className="aspect-square bg-muted-foreground/10" />
                  <div className="p-4 text-center space-y-2">
                    <div className="h-4 bg-muted-foreground/20 rounded w-24 mx-auto" />
                    <div className="h-3 bg-muted-foreground/10 rounded w-16 mx-auto" />
                  </div>
                </div>
              ))
            : categories.map((cat, i) => (
                <Link
                  key={cat.slug + i}
                  to={`/products?category=${cat.id || cat.slug}`}
                  className={`group relative overflow-hidden bg-muted transition-all duration-500 w-[calc(50%-16px)] md:w-[280px] active:scale-95 ${
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-display text-lg font-semibold text-foreground">{cat.name}</h3>
                    <p className="font-body text-xs text-muted-foreground mt-1">{cat.count}+ Products</p>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
