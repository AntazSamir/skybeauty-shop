import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, Heart, Filter, ChevronDown, LayoutGrid, List } from "lucide-react";
import { products, getProductSlug } from "@/data/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const AllProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filtering and Sorting logic
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    if (sortBy === "Newest First") return b.id - a.id;
    return 0; // Featured
  });

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Header */}
      <section className="bg-muted/30 py-16 border-b border-border">
        <div className="container text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Our Collection</h1>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto uppercase tracking-[0.2em] text-xs">
            Discover our curated range of premium skincare and cosmetics
          </p>
        </div>
      </section>

      <main className="container py-12">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search products..."
              className="pl-10 h-12 bg-card border-border focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 w-full lg:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-12 gap-2 font-body text-xs font-bold tracking-widest uppercase px-6">
                  Category: {selectedCategory} <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-background border-border">
                {categories.map((cat) => (
                  <DropdownMenuItem 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    className="font-body text-xs cursor-pointer hover:bg-muted"
                  >
                    {cat}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-12 gap-2 font-body text-xs font-bold tracking-widest uppercase px-6">
                  Sort By: {sortBy} <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background border-border">
                {["Featured", "Newest First", "Price: Low to High", "Price: High to Low"].map((option) => (
                  <DropdownMenuItem 
                    key={option} 
                    onClick={() => setSortBy(option)}
                    className="font-body text-xs cursor-pointer hover:bg-muted"
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden sm:flex items-center gap-1 border border-border p-1 rounded-md bg-card">
              <Button 
                variant={viewMode === "grid" ? "secondary" : "ghost"} 
                size="icon" 
                onClick={() => setViewMode("grid")}
                className="h-9 w-9"
              >
                <LayoutGrid size={18} />
              </Button>
              <Button 
                variant={viewMode === "list" ? "secondary" : "ghost"} 
                size="icon" 
                onClick={() => setViewMode("list")}
                className="h-9 w-9"
              >
                <List size={18} />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-8">
          <p className="font-body text-sm text-muted-foreground">
            Showing <span className="font-bold text-foreground">{sortedProducts.length}</span> results
          </p>
          {(selectedCategory !== "All" || searchQuery) && (
            <button 
              onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
              className="text-xs font-body font-bold text-primary hover:underline uppercase tracking-wider"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Product Grid/List */}
        {sortedProducts.length > 0 ? (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8" 
              : "flex flex-col gap-6"
          }>
            {sortedProducts.map((product) => (
              <Link
                to={`/product/${getProductSlug(product)}`}
                key={product.id}
                className={`group bg-card border border-border transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 ${
                  viewMode === "list" ? "flex flex-row h-48 md:h-64 overflow-hidden" : "flex flex-col"
                }`}
              >
                <div className={`relative overflow-hidden bg-muted ${
                  viewMode === "list" ? "w-1/3 md:w-1/4 h-full" : "aspect-square"
                }`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {product.tag && (
                    <Badge className="absolute top-4 left-4 font-body text-[9px] uppercase tracking-widest px-2.5 py-1">
                      {product.tag}
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className={`p-5 flex flex-col ${viewMode === "list" ? "flex-1 justify-center" : "flex-1"}`}>
                  <div className="flex-1">
                    <p className="text-[10px] font-body font-bold text-primary uppercase tracking-[0.2em] mb-2">{product.category}</p>
                    <h3 className="font-display text-sm md:text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    {viewMode === "list" && (
                      <p className="mt-3 text-sm text-muted-foreground font-body line-clamp-2 hidden md:block">
                        {product.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-lg font-bold text-foreground">৳{product.price}</span>
                      {product.originalPrice && (
                        <span className="font-body text-sm text-muted-foreground line-through opacity-60">৳{product.originalPrice}</span>
                      )}
                    </div>
                    <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary hover:text-white transition-all transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                      <ShoppingBag size={18} />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-muted/20 rounded-2xl border border-dashed border-border mt-12">
            <Search className="mx-auto w-12 h-12 text-muted-foreground opacity-20 mb-4" />
            <h3 className="font-display text-xl font-bold text-foreground">No matches found</h3>
            <p className="font-body text-muted-foreground mt-2">Try adjusting your search or category filters.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AllProducts;
