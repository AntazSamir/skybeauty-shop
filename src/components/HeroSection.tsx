import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-skincare.jpg";
import heroCarousel2 from "@/assets/hero-carousel-2.png";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { image: heroImage },
    { image: heroCarousel2 },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden bg-black flex items-center">
      {/* Slides Container */}
      <div className="absolute inset-0 w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? "opacity-100 scale-100 pointer-events-auto" 
                : "opacity-0 scale-[1.03] pointer-events-none"
            }`}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt="Skincare Hero Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>

      {/* Static Top-Left-Aligned Content */}
      <div className="relative z-10 container mx-auto px-6 pt-24 md:pt-32 flex flex-col items-start justify-start h-full text-left">
        <p className="font-body text-xs md:text-sm tracking-[0.3em] uppercase text-white mb-4 animate-fade-in-up font-semibold drop-shadow-md">
          Clinically Tested · Dermatologist Approved
        </p>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight animate-fade-in-up-delay-1 drop-shadow-lg max-w-3xl">
          Glow with Confidence
        </h1>
        <p className="font-body text-sm md:text-base text-white/90 mt-4 max-w-xl animate-fade-in-up-delay-2 drop-shadow-md">
          Premium skincare & cosmetics for everyone. Discover 50+ curated products from world-renowned brands like CeraVe, Neutrogena, and Medicube.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-fade-in-up-delay-2 w-full sm:w-auto">
          <Link
            to="/products"
            className="bg-primary border-2 border-primary text-primary-foreground px-8 py-3 w-full sm:w-auto text-center text-xs md:text-sm font-body font-bold tracking-widest hover:opacity-95 hover:border-primary/90 transition-all active:scale-95 uppercase rounded-none shadow-lg shadow-primary/20"
          >
            SHOP NOW
          </Link>
          <a
            href="#categories"
            className="border-2 border-white text-white px-8 py-3 w-full sm:w-auto text-center text-xs md:text-sm font-body font-bold tracking-widest hover:bg-white/10 transition-all active:scale-95 uppercase rounded-none"
          >
            EXPLORE
          </a>
        </div>
      </div>

      {/* Indicator Dots */}
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
    </section>
  );
};

export default HeroSection;
