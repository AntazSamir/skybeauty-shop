import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Info } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col pt-[72px] bg-sky-50/30">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8">
            <Info className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-bold mb-6 text-slate-900">About SkyBD</h1>
          <p className="text-lg text-slate-600 font-body leading-relaxed mb-10">
            Welcome to SkyBD, your premier destination for high-quality skincare and cosmetics. 
            Founded with a passion for beauty and self-care, we curate the finest products 
            to help you achieve your best skin yet.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left mt-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-display font-bold mb-4">Our Mission</h3>
              <p className="text-slate-600 font-body">
                To empower individuals to embrace their natural beauty through effective, 
                clinically-tested skincare solutions that deliver visible results.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-display font-bold mb-4">Our Values</h3>
              <p className="text-slate-600 font-body">
                Quality, transparency, and customer satisfaction are at the heart of everything we do. 
                We believe in beauty that is both accessible and ethical.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
