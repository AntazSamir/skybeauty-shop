import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Info } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 shadow-sm">
            <Info className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-display font-bold mb-6 text-slate-900 tracking-tight">
            SKYe<span className="text-primary">.BD</span>
          </h1>
          <p className="text-xl text-primary font-display font-medium italic mb-8">
            "Authentic products on a student budget ❤️"
          </p>
          <p className="text-lg text-slate-600 font-body leading-relaxed mb-12 max-w-2xl">
            SKYe.BD is your trusted curator of genuine international skincare. We believe that professional skin care 
            should be accessible to everyone—especially students who want high-quality, authentic products 
            without breaking the bank.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left w-full mb-20">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4">
              <h3 className="text-2xl font-display font-bold text-slate-900">Our Story</h3>
              <p className="text-slate-600 font-body leading-relaxed">
                Starting as a social-first community, SKYe.BD has grown into a reliable destination for skincare enthusiasts in Bangladesh. 
                We understand the struggle of finding authentic products in a market filled with uncertainty. 
                That's why we personally curate every item we sell.
              </p>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4">
              <h3 className="text-2xl font-display font-bold text-slate-900">Why SKYe.BD?</h3>
              <p className="text-slate-600 font-body leading-relaxed">
                We prioritize **Authenticity, Reliability, and Accessibility**. Whether you're looking for global giants 
                or the latest K-Beauty trends, we ensure you get the real deal at the best possible price.
              </p>
            </div>
          </div>

          <div className="w-full">
            <h2 className="text-3xl font-display font-bold mb-10 text-slate-900">Trusted Global Brands</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
              {["CeraVe", "Cetaphil", "Bioderma", "Neutrogena", "Illiyoon", "Skin1004", "Anua"].map((brand) => (
                <div key={brand} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center hover:border-primary/30 transition-colors">
                  <span className="font-display font-bold text-slate-400 text-sm uppercase tracking-wider">{brand}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
