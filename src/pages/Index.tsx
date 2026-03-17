import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import ProductGrid from "@/components/ProductGrid";
import PromoSection from "@/components/PromoSection";
import TestimonialSection from "@/components/TestimonialSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <CategorySection />
      <ProductGrid />
      <PromoSection />
      <TestimonialSection />
      <Footer />
    </div>
  );
};

export default Index;
