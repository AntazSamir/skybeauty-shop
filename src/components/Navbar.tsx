import { useState } from "react";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate, Link } from "react-router-dom";

const navLinks = ["Home", "Skincare", "About", "Contact"];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  return (
    <>
      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm animate-fade-in flex items-start justify-center pt-24 px-6 md:pt-32">
          <div className="w-full max-w-3xl bg-background/90 backdrop-blur-2xl p-2 rounded-2xl border border-border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] animate-scale-in">
            <div className="relative flex items-center">
              <Search className="absolute left-5 text-primary" size={24} />
              <input 
                autoFocus
                type="text" 
                placeholder="Search for skincare, makeup, or concerns..." 
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-xl font-display py-5 pl-14 pr-16 rounded-xl border-none focus:ring-0 outline-none"
              />
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-4 bg-secondary hover:bg-secondary/80 text-secondary-foreground p-2 rounded-xl transition-all active:scale-95"
                aria-label="Close search"
              >
                <X size={22} />
              </button>
            </div>
            
            {/* Quick search suggestions (Optional touch) */}
            <div className="px-5 py-4 border-t border-border mt-1">
              <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-semibold">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {["Cleansers", "Serums", "Moisturizers", "Sunscreen", "Lip Care"].map(tag => (
                  <button 
                    key={tag}
                    className="font-body text-xs px-4 py-1.5 bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground hover:text-primary-foreground rounded-full transition-all duration-300"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div 
            className="absolute inset-0 -z-10" 
            onClick={() => setIsSearchOpen(false)}
          />
        </div>
      )}

      {/* Announcement bar */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-xs font-body tracking-wide">
        FREE delivery on orders over ৳1500 · Trusted by 10,000+ customers
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
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="SkyBD Logo" className="h-10 w-auto -mr-1" />
            <span className="font-display text-2xl font-bold tracking-tight text-foreground">SkyBD</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link}
                to={
                  link === "Home" ? "/" :
                  link === "Skincare" ? "/products" : 
                  link === "About" ? "/about" : 
                  link === "Contact" ? "/contact" : "#"
                }
                className="font-body text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                {link}
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
            <Link 
              to="/login" 
              className="text-foreground hover:text-primary transition-all duration-200 hover:-translate-y-0.5 hidden sm:block" 
              aria-label="Account"
            >
              <User size={20} />
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative text-foreground hover:text-primary transition-all duration-200 hover:-translate-y-0.5" 
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden border-t border-border bg-background px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link}
                to={
                  link === "Home" ? "/" :
                  link === "Skincare" ? "/products" : 
                  link === "About" ? "/about" : 
                  link === "Contact" ? "/contact" : "#"
                }
                onClick={() => setMobileOpen(false)}
                className="block font-body text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
};

export default Navbar;
