/**
 * NewArrivals — Fetches the latest products from WooCommerce API.
 */

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useNewArrivals } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { formatPrice, stripHtml, productPath } from "@/lib/woocommerce/helpers";
import type { WCProduct } from "@/lib/woocommerce/types";

const NewArrivals = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data: products, isLoading } = useNewArrivals(6);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: WCProduct) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }
    addToCart(product, 1);
    toast({ title: "Added to Cart", description: `${product.name} added.` });
  };

  const skeletons = Array.from({ length: 4 });

  return (
    <section
      ref={ref}
      className="py-24 bg-gradient-to-b from-background to-muted/20 border-t border-border overflow-hidden"
    >
      <div className="container">
        {/* Header */}
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
            to="/products"
            className="group inline-flex items-center gap-2 font-body text-xs font-bold tracking-widest text-foreground hover:text-primary mt-6 md:mt-0 transition-colors uppercase"
          >
            Explore Full Collection
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading
            ? skeletons.map((_, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-center bg-card border border-border rounded-3xl p-6 gap-6 animate-pulse">
                  <div className="w-full sm:w-48 aspect-square rounded-2xl bg-muted shrink-0" />
                  <div className="flex-1 space-y-3 w-full">
                    <div className="h-3 bg-muted rounded w-1/4" />
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                  </div>
                </div>
              ))
            : (products ?? []).map((product, i) => (
                <Link
                  to={productPath(product.slug)}
                  key={product.id}
                  className={`group flex flex-col sm:flex-row items-center bg-card border border-border rounded-3xl p-6 gap-6 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 ${
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                  }`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  {/* Image */}
                  <div className="relative w-full sm:w-48 aspect-square rounded-2xl overflow-hidden bg-muted shrink-0">
                    <img
                      src={product.images?.[0]?.src}
                      alt={product.images?.[0]?.alt || product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute top-4 left-4 bg-primary text-primary-foreground font-body text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                      NEW
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col justify-between h-full py-2 text-center sm:text-left w-full">
                    <div>
                      <span className="font-body text-[10px] font-bold tracking-widest text-primary uppercase mb-2 block">
                        {product.categories?.[0]?.name ?? "Skincare"}
                      </span>
                      <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="font-body text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                        {stripHtml(product.short_description || product.description)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-lg font-bold text-foreground">
                          {formatPrice(product.price)}
                        </span>
                        {product.on_sale && product.regular_price && (
                          <span className="font-body text-xs text-muted-foreground line-through opacity-60">
                            {formatPrice(product.regular_price)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag size={18} />
                      </button>
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
