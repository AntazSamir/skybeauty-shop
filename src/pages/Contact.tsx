import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send, Facebook, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen flex flex-col pt-[72px] bg-sky-50/30">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4 text-slate-900">Get in Touch</h1>
          <p className="text-lg text-slate-600 font-body max-w-2xl mx-auto">
            Have questions or need assistance? Our beauty experts are here to help. 
            Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Your name" required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="your@email.com" required className="h-11" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help?" required className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Tell us more about your inquiry..." className="min-h-[150px] resize-none" required />
              </div>
              <Button type="submit" className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-body font-bold gap-2">
                <Send className="w-4 h-4" /> SEND MESSAGE
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-10 py-4">
            <h2 className="text-3xl font-display font-bold text-slate-900">Contact Information</h2>
            <div className="space-y-8 font-body">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Email Us</h4>
                  <p className="text-slate-600">hello@skybd.com</p>
                  <p className="text-slate-600">support@skybd.com</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Call Us</h4>
                  <p className="text-slate-600">+880 1XXX-XXXXXX</p>
                  <p className="text-slate-600">Mon-Fri, 9am - 6pm</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Visit Us</h4>
                  <p className="text-slate-600">Gulshan-1, Dhaka</p>
                  <p className="text-slate-600">Bangladesh</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                  <Facebook className="w-6 h-6 text-[#1877F2]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Facebook</h4>
                  <p className="text-slate-600">facebook.com/skybeautybd</p>
                  <p className="text-slate-600">@skybeautybd</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6 text-[#25D366]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">WhatsApp</h4>
                  <p className="text-slate-600">+880 1XXX-XXXXXX</p>
                  <p className="text-slate-600">Available 24/7 for support</p>
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
