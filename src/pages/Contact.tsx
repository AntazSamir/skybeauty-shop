import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send, Facebook, MessageCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! SKYe.BD team will get back to you soon.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-display font-bold mb-4 text-slate-900 tracking-tight">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-lg text-slate-600 font-body max-w-2xl mx-auto leading-relaxed">
            Have questions about products or need routine advice? Our skincare experts 
            at **SKYe.BD** are just a message away.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-medium">Full Name</Label>
                  <Input id="name" placeholder="Your name" required className="h-12 border-slate-200 focus:border-primary focus:ring-primary bg-slate-50/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                  <Input id="email" type="email" placeholder="your@email.com" required className="h-12 border-slate-200 focus:border-primary focus:ring-primary bg-slate-50/50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-slate-700 font-medium">Subject</Label>
                <Input id="subject" placeholder="How can we help?" required className="h-12 border-slate-200 focus:border-primary focus:ring-primary bg-slate-50/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-slate-700 font-medium">Message</Label>
                <Textarea id="message" placeholder="Tell us more about your inquiry..." className="min-h-[150px] resize-none border-slate-200 focus:border-primary focus:ring-primary bg-slate-50/50" required />
              </div>
              <Button type="submit" className="w-full h-14 bg-primary hover:opacity-90 text-primary-foreground font-body font-bold text-lg rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] gap-3">
                <Send className="w-5 h-5" /> SEND MESSAGE
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8 py-4 px-2">
            <h2 className="text-3xl font-display font-bold text-slate-900 border-b-2 border-primary/20 pb-4 inline-block">Contact Information</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 font-body">
              <a href="https://wa.me/8801805705187" target="_blank" rel="noopener noreferrer" 
                 className="flex gap-5 p-6 bg-white rounded-2xl border border-slate-100 hover:border-green-200 hover:shadow-lg hover:shadow-green-50 transition-all group">
                <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-green-500 transition-colors">
                  <MessageCircle className="w-7 h-7 text-green-500 group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">WhatsApp</h4>
                  <p className="text-slate-600">01805-705187</p>
                  <p className="text-green-600 text-xs font-semibold mt-1 uppercase tracking-wider">Fastest Response</p>
                </div>
              </a>

              <a href="https://m.me/SKYeBD" target="_blank" rel="noopener noreferrer"
                 className="flex gap-5 p-6 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all group">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-500 transition-colors">
                  <MessageSquare className="w-7 h-7 text-blue-500 group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Messenger</h4>
                  <p className="text-slate-600">SKYe.BD</p>
                  <p className="text-blue-600 text-xs font-semibold mt-1 uppercase tracking-wider">DM us 24/7</p>
                </div>
              </a>

              <div className="flex gap-5 p-6 bg-white rounded-2xl border border-slate-100">
                <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Email Us</h4>
                  <p className="text-slate-600">hello@skyebd.com</p>
                </div>
              </div>

              <div className="flex gap-5 p-6 bg-white rounded-2xl border border-slate-100">
                <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Visit Us</h4>
                  <p className="text-slate-600">Narayanganj, Dhaka</p>
                  <p className="text-slate-600">Bangladesh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
