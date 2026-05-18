/**
 * AllProducts — Full product catalogue with WooCommerce API.
 * Supports: search, category filter, sort, grid/list view, pagination, and auth-aware cart.
 */

import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  Search, ShoppingBag, Heart, ChevronDown,
  LayoutGrid, List, ChevronLeft, ChevronRight, SlidersHorizontal,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { formatPrice, productPath, discountPercent } from "@/lib/woocommerce/helpers";
import type { WCProduct, ProductQueryParams } from "@/lib/woocommerce/types";

const SORT_OPTIONS = [
  { label: "Featured",            orderby: "popularity" as const, order: "desc" as const },
  { label: "Newest First",        orderby: "date" as const,       order: "desc" as const },
  { label: "Price: Low to High",  orderby: "price" as const,      order: "asc" as const },
  { label: "Price: High to Low",  orderby: "price" as const,      order: "desc" as const },
  { label: "Top Rated",           orderby: "rating" as const,     order: "desc" as const },
];

const PER_PAGE = 16;

const AllProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // ── URL-synced state ──
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(
    searchParams.get("category_id") ? Number(searchParams.get("category_id")) : undefined
  );
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState(searchParams.get("category") ?? "All");
  const [sortLabel, setSortLabel] = useState("Featured");
  const [sortParams, setSortParams] = useState<Pick<ProductQueryParams, "orderby" | "order">>({
    orderby: "popularity",
    order: "desc",
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Sync from URL params on mount
  useEffect(() => {
    const catId = searchParams.get("category_id");
    if (catId) setSelectedCategoryId(Number(catId));
    const catLabel = searchParams.get("category");
    if (catLabel) setSelectedCategoryLabel(catLabel);
    window.scrollTo(0, 0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build query
  const queryParams: ProductQueryParams = {
    page,
    per_page: PER_PAGE,
    search: debouncedSearch || undefined,
    category: selectedCategoryId,
    orderby: sortParams.orderby,
    order: sortParams.order,
  };

  const { data: result, isLoading } = useProducts(queryParams);
  const { data: categories } = useCategories();

  const products = result?.data ?? [];
  const totalPages = result?.totalPages ?? 1;
  const totalItems = result?.totalItems ?? 0;

  const handleAddToCart = (e: React.MouseEvent, product: WCProduct) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      });
      navigate("/login", { state: { from: "/products" } });
      return;
    }
    addToCart(product, 1);
    toast({ title: "Added to Cart", description: `${product.name} added.` });
  };

  const handleCategoryChange = (label: string, id?: number) => {
    setSelectedCategoryLabel(label);
    setSelectedCategoryId(id);
    setPage(1);
    const next = new URLSearchParams(searchParams);
    if (id) { next.set("category_id", String(id)); next.set("category", label); }
    else { next.delete("category_id"); next.delete("category"); }
    setSearchParams(next);
  };

  const handleSortChange = (opt: typeof SORT_OPTIONS[0]) => {
    setSortLabel(opt.label);
    setSortParams({ orderby: opt.orderby, order: opt.order });
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedCategoryId(undefined);
    setSelectedCategoryLabel("All");
    setSortLabel("Featured");
    setSortParams({ orderby: "popularity", order: "desc" });
    setPage(1);
    setSearchParams({});
  };

  const hasActiveFilters = debouncedSearch || selectedCategoryId;

  const categoryTabs = [
    { label: "All", id: undefined },
    ...(categories?.filter((c) => c.parent === 0 && c.count > 0).map((c) => ({
      label: c.name,
      id: c.id,
    })) ?? []),
  ];

  const skeletons = Array.from({ length: PER_PAGE });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-muted/30 py-16 border-b border-border">
        <div className="container text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Our Products</h1>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto uppercase tracking-[0.2em] text-xs">
            Discover our curated range of premium skincare and cosmetics
          </p>
        </div>
      </section>

      <main className="container py-12">
        {/* Category Pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categoryTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => handleCategoryChange(tab.label, tab.id)}
              className={`font-body text-xs px-4 py-2 rounded-full border transition-all ${
                selectedCategoryLabel === tab.label
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8">
          {/* Search */}
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search products…"
              className="pl-10 h-11 bg-card border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto justify-end flex-wrap">
            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 gap-2 font-body text-xs font-bold tracking-wide px-5">
                  <SlidersHorizontal size={14} />
                  {sortLabel}
                  <ChevronDown size={13} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-background border-border">
                {SORT_OPTIONS.map((opt) => (
                  <DropdownMenuItem
                    key={opt.label}
                    onClick={() => handleSortChange(opt)}
                    className="font-body text-xs cursor-pointer"
                  >
                    {opt.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View toggle */}
            <div className="hidden sm:flex items-center gap-1 border border-border p-1 rounded-md bg-card">
              <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("grid")} className="h-9 w-9">
                <LayoutGrid size={18} />
              </Button>
              <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("list")} className="h-9 w-9">
                <List size={18} />
              </Button>
            </div>
          </div>
        </div>

        {/* Results + clear */}
        <div className="flex items-center justify-between mb-6">
          <p className="font-body text-sm text-muted-foreground">
            {isLoading ? "Loading…" : (
              <>Showing <span className="font-bold text-foreground">{totalItems}</span> products</>
            )}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs font-body font-bold text-primary hover:underline uppercase tracking-wider">
              Clear Filters
            </button>
          )}
        </div>

        {/* Product Grid / List */}
        {isLoading ? (
          <div className={viewMode === "grid" ? "grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6" : "flex flex-col gap-4"}>
            {skeletons.map((_, i) => (
              <div key={i} className={`bg-card border border-border animate-pulse ${viewMode === "list" ? "flex h-40" : ""}`}>
                <div className={`bg-muted ${viewMode === "list" ? "w-40 shrink-0" : "aspect-square"}`} />
                <div className="p-4 flex-1 space-y-2">
                  <div className="h-3 bg-muted rounded w-1/4" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-muted/20 rounded-2xl border border-dashed border-border">
            <Search className="mx-auto w-12 h-12 text-muted-foreground opacity-20 mb-4" />
            <h3 className="font-display text-xl font-bold text-foreground">No products found</h3>
            <p className="font-body text-muted-foreground mt-2">Try adjusting your search or filters.</p>
            <Button onClick={clearFilters} variant="outline" className="mt-6 font-body">Clear Filters</Button>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6" : "flex flex-col gap-4"}>
            {products.map((product) => {
              const discount = discountPercent(product.regular_price, product.sale_price);
              return (
                <Link
                  to={productPath(product.slug)}
                  key={product.id}
                  className={`group bg-card border border-border transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 ${
                    viewMode === "list" ? "flex flex-row h-44 overflow-hidden" : "flex flex-col"
                  }`}
                >
                  {/* Image */}
                  <div className={`relative overflow-hidden bg-muted ${viewMode === "list" ? "w-40 shrink-0" : "aspect-square"}`}>
                    <img
                      src={product.images?.[0]?.src}
                      alt={product.images?.[0]?.alt || product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    {discount && (
                      <Badge className="absolute top-3 left-3 font-body text-[9px] uppercase tracking-widest px-2 py-0.5">
                        -{discount}%
                      </Badge>
                    )}
                    <button
                      onClick={(e) => { e.preventDefault(); }}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-destructive"
                      aria-label="Wishlist"
                    >
                      <Heart size={15} />
                    </button>
                  </div>

                  {/* Info */}
                  <div className={`p-4 flex flex-col ${viewMode === "list" ? "flex-1 justify-center" : "flex-1"}`}>
                    <p className="text-[10px] font-body font-bold text-primary uppercase tracking-[0.2em] mb-1">
                      {product.categories?.[0]?.name ?? "Skincare"}
                    </p>
                    <h3 className="font-display text-sm md:text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="mt-auto pt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-base font-bold text-foreground">
                          {formatPrice(product.price)}
                        </span>
                        {product.on_sale && product.regular_price && (
                          <span className="font-body text-xs text-muted-foreground line-through opacity-60">
                            {formatPrice(product.regular_price)}
                          </span>
                        )}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => handleAddToCart(e, product)}
                        className="rounded-full hover:bg-primary hover:text-white transition-all transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 h-9 w-9"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag size={17} />
                      </Button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !isLoading && (
          <div className="flex items-center justify-center gap-3 mt-14">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-10 w-10"
            >
              <ChevronLeft size={18} />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
              .map((p, idx, arr) => (
                <span key={p}>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="font-body text-muted-foreground px-1">…</span>
                  )}
                  <button
                    onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className={`h-10 w-10 font-body text-sm font-semibold rounded transition-all ${
                      p === page
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                </span>
              ))}
            <Button
              variant="outline"
              size="icon"
              onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              disabled={page === totalPages}
              className="h-10 w-10"
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AllProducts;
