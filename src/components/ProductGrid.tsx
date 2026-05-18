/**
 * ProductGrid — Homepage product grid with category filter, fetching from WooCommerce.
 */

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { formatPrice, productPath } from "@/lib/woocommerce/helpers";
import type { WCProduct } from "@/lib/woocommerce/types";

const ProductGrid = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(undefined);
  const [activeLabel, setActiveLabel] = useState("All");
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: categories } = useCategories();
  const { data: result, isLoading } = useProducts({
    per_page: 12,
    category: activeCategoryId,
    orderby: "popularity",
  });
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

  // Build filter tabs: All + top categories
  const filterTabs = [
    { label: "All", id: undefined },
    ...(categories?.filter((c) => c.parent === 0 && c.count > 0).slice(0, 5).map((c) => ({
      label: c.name,
      id: c.id,
    })) ?? []),
  ];

  const products = result?.data ?? [];
  const skeletons = Array.from({ length: 8 });

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
          {filterTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => {
                setActiveCategoryId(tab.id);
                setActiveLabel(tab.label);
              }}
              className={`font-body text-sm px-5 py-2 transition-all duration-200 active:scale-95 ${
                activeLabel === tab.label
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 auto-rows-auto">
          {isLoading
            ? skeletons.map((_, i) => (
                <div key={i} className="bg-background border border-border animate-pulse">
                  <div className="aspect-square bg-muted" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))
            : products.map((product, i) => {
                const isBentoFull = i % 3 === 0;
                return (
                  <Link
                    to={productPath(product.slug)}
                    key={product.id}
                    className={`group bg-background border border-border overflow-hidden transition-all duration-500 hover:shadow-lg ${
                      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    } ${isBentoFull ? "col-span-2 md:col-span-1" : "col-span-1"}`}
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <div
                      className={`relative overflow-hidden bg-muted ${
                        isBentoFull ? "aspect-[2/1] md:aspect-square" : "aspect-square"
                      }`}
                    >
                      <img
                        src={product.images?.[0]?.src}
                        alt={product.images?.[0]?.alt || product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      {product.on_sale && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-body font-semibold tracking-wide uppercase bg-primary text-primary-foreground">
                          Sale
                        </span>
                      )}
                      <button
                        className="absolute top-3 right-3 w-8 h-8 bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-background text-muted-foreground hover:text-destructive active:scale-90"
                        aria-label="Add to wishlist"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Heart size={16} />
                      </button>
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="absolute bottom-3 right-3 w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:opacity-90 active:scale-90"
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
                        <span className="font-body text-sm font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
                        {product.on_sale && product.regular_price && (
                          <span className="font-body text-xs text-muted-foreground line-through">
                            {formatPrice(product.regular_price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-block border-2 border-foreground text-foreground px-10 py-3 font-body text-sm font-semibold tracking-wide hover:bg-foreground hover:text-background transition-all duration-200 active:scale-95"
          >
            VIEW ALL PRODUCTS
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
