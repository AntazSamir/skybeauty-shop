/**
 * HeroSection — Dynamic banner/slider fetched from WooCommerce WordPress backend.
 * Falls back to local static assets if the API is unavailable.
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useBanners } from "@/hooks/useBanners";
import heroImage from "@/assets/hero-skincare.jpg";

// ─── Static fallback slides ───────────────────────────────────────────────────

const FALLBACK_SLIDES = [
  {
    id: 1,
    image: heroImage,
    title: "Glow with Confidence",
    subtitle: "Premium skincare & cosmetics for everyone. Discover 50+ curated products from world-renowned brands.",
    link: "/products",
    button_text: "SHOP NOW",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: apiBanners, isLoading } = useBanners();

  // Use API banners if available, otherwise fall back to static
  const slides =
    !isLoading && apiBanners && apiBanners.length > 0
      ? apiBanners.map((b) => ({
          id: b.id,
          image: b.image,
          title: b.title,
          subtitle: b.subtitle ?? "",
          link: b.link || "/products",
          button_text: b.button_text ?? "SHOP NOW",
        }))
      : FALLBACK_SLIDES;

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goPrev = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goNext = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <section
      className="relative w-full h-[85vh] min-h-[500px] overflow-hidden bg-black flex items-center"
      aria-label="Hero Banner"
    >
      {/* Slides */}
      <div className="absolute inset-0 w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-[1.03] pointer-events-none"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/45" />
          </div>
        ))}
      </div>

      {/* Text Content */}
      <div className="relative z-10 container mx-auto px-6 pt-24 md:pt-32 flex flex-col items-start justify-start h-full text-left">
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight animate-fade-in-up-delay-1 drop-shadow-lg max-w-3xl">
          {slides[currentSlide]?.title}
        </h1>
        <p className="font-body text-sm md:text-base text-white/90 mt-4 max-w-xl animate-fade-in-up-delay-2 drop-shadow-md">
          {slides[currentSlide]?.subtitle}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-fade-in-up-delay-2 w-full sm:w-auto">
          <Link
            to={slides[currentSlide]?.link ?? "/products"}
            className="bg-primary border-2 border-primary text-primary-foreground px-8 py-3 w-full sm:w-auto text-center text-xs md:text-sm font-body font-bold tracking-widest hover:opacity-95 hover:border-primary/90 transition-all active:scale-95 uppercase rounded-none shadow-lg shadow-primary/20"
          >
            {slides[currentSlide]?.button_text ?? "SHOP NOW"}
          </Link>
        </div>
      </div>

      {/* Dot Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 transition-all duration-300 rounded-full ${
                index === currentSlide ? "w-8 bg-primary" : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;
