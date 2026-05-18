import { useState, useEffect, useRef } from "react";
import { Search, User, ShoppingBag, Menu, X, LogOut } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [announceIndex, setAnnounceIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { totalItems, setIsCartOpen } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: categories } = useCategories();

  const announcements = [
    "Safe Delivery guaranteed to your doorstep · Trusted by 500+ customers",
    "Enjoy Free Shipping on orders over ৳2,000!",
    "100% Authentic imported cosmetics & skincare products",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnounceIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  // Focus search input when overlay opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Close search on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSearchOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  // Build nav links from WC categories (top 4 parent cats) + static links
  const categoryNavLinks = (categories && categories.length > 0)
    ? categories
        .filter((c) => c.parent === 0)
        .slice(0, 4)
        .map((c) => ({ label: c.name, to: `/products?category_id=${c.id}&category=${c.name}` }))
    : [
        { label: "Moisturizer", to: "/products?category=moisturizer" },
        { label: "Cleanser", to: "/products?category=cleanser" },
        { label: "Serum", to: "/products?category=serum" }
      ];

  const staticLinks = [
    { label: "Home", to: "/" },
    ...categoryNavLinks,
    { label: "Contact", to: "/contact" },
  ];

  return (
    <>
      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm animate-fade-in flex items-start justify-center pt-24 px-6 md:pt-32">
          <div className="w-full max-w-3xl bg-background/90 backdrop-blur-2xl p-2 rounded-2xl border border-border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] animate-scale-in">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <Search className="absolute left-5 text-primary" size={24} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skincare, serums, moisturizers…"
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-xl font-display py-5 pl-14 pr-16 rounded-xl border-none focus:ring-0 outline-none"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-4 bg-secondary hover:bg-secondary/80 text-secondary-foreground p-2 rounded-xl transition-all active:scale-95"
                aria-label="Close search"
              >
                <X size={22} />
              </button>
            </form>

            {/* Quick suggestions */}
            <div className="px-5 py-4 border-t border-border mt-1">
              <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-semibold">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {["Cleanser", "Serum", "Moisturizer", "Sunscreen", "Toner"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => { navigate(`/products?search=${tag}`); setIsSearchOpen(false); }}
                    className="font-body text-xs px-4 py-1.5 bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground rounded-full transition-all duration-300"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setIsSearchOpen(false)} />
        </div>
      )}

      {/* Announcement bar */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-xs font-body tracking-wide min-h-[32px] flex items-center justify-center">
        <span className="animate-fade-in">{announcements[announceIndex]}</span>
      </div>

      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-foreground"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1">
            <img src="/logo.png" alt="SkyBD Logo" className="h-10 w-auto -mr-1" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <span className="font-display text-2xl font-bold tracking-tight text-foreground">SkyBD</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {staticLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="font-body text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-foreground hover:text-primary transition-all duration-200 hover:-translate-y-0.5"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Auth icon — profile or login */}
            {isAuthenticated ? (
              <div className="relative group hidden sm:block">
                <button className="text-foreground hover:text-primary transition-all duration-200 hover:-translate-y-0.5" aria-label="Account">
                  <User size={20} />
                </button>
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-44 bg-background border border-border rounded-xl shadow-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <p className="font-body text-xs font-bold text-muted-foreground px-3 py-2 truncate">{user?.email}</p>
                  <div className="h-px bg-border my-1" />
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted font-body text-sm text-foreground transition-colors"
                  >
                    <User size={15} /> My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-destructive/10 font-body text-sm text-destructive transition-colors"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-foreground hover:text-primary transition-all duration-200 hover:-translate-y-0.5 hidden sm:block"
                aria-label="Sign In"
              >
                <User size={20} />
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-foreground hover:text-primary transition-all duration-200 hover:-translate-y-0.5"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden border-t border-border bg-background px-6 py-4 space-y-3">
            {staticLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block font-body text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="block font-body text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    My Profile ({user?.email})
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block font-body text-sm text-destructive hover:text-destructive/80 transition-colors font-semibold"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block font-body text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </nav>
        )}
      </header>
    </>
  );
};

export default Navbar;
