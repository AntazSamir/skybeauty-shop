import { Facebook, Instagram, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-display text-2xl font-bold mb-4">SkyBD</h3>
            <p className="font-body text-sm text-secondary-foreground/70 leading-relaxed">
              Your trusted source for premium cosmetics & skincare in Bangladesh.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-9 h-9 border border-secondary-foreground/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 border border-secondary-foreground/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 border border-secondary-foreground/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors" aria-label="WhatsApp">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-body text-sm font-semibold mb-4 tracking-wide uppercase">Shop</h4>
            <ul className="space-y-2.5">
              {["New Arrivals", "Bestsellers", "Skincare", "Makeup", "For Him"].map((link) => (
                <li key={link}>
                  <a href="#" className="font-body text-sm text-secondary-foreground/70 hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body text-sm font-semibold mb-4 tracking-wide uppercase">Help</h4>
            <ul className="space-y-2.5">
              {["Track Order", "Shipping Info", "Returns", "FAQ", "Contact Us"].map((link) => (
                <li key={link}>
                  <a href="#" className="font-body text-sm text-secondary-foreground/70 hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body text-sm font-semibold mb-4 tracking-wide uppercase">Newsletter</h4>
            <p className="font-body text-sm text-secondary-foreground/70 mb-4">
              Get exclusive offers & skincare tips.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-secondary-foreground/10 px-3 py-2 text-sm font-body text-secondary-foreground placeholder:text-secondary-foreground/40 border-none outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="bg-primary text-primary-foreground px-4 py-2 text-sm font-body font-semibold hover:opacity-90 transition-opacity">
                JOIN
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-secondary-foreground/10">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-secondary-foreground/50">
            © 2026 SkyBD. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="font-body text-xs text-secondary-foreground/50 hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="font-body text-xs text-secondary-foreground/50 hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
