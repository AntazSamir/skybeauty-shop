import { useState } from "react";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate, Link } from "react-router-dom";

const navLinks = ["New", "Bestsellers", "Skincare"];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  return (
    <>
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
          <Link to="/" className="font-display text-2xl font-bold tracking-tight text-foreground">
            SkyBD
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="font-body text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="text-foreground hover:text-primary transition-colors" aria-label="Search">
              <Search size={20} />
            </button>
            <Link 
              to="/profile" 
              className="text-foreground hover:text-primary transition-colors hidden sm:block" 
              aria-label="Account"
            >
              <User size={20} />
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative text-foreground hover:text-primary transition-colors" 
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
              <a
                key={link}
                href="#"
                className="block font-body text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link}
              </a>
            ))}
          </nav>
        )}
      </header>
    </>
  );
};

export default Navbar;
