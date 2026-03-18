import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ChevronRight, ShieldCheck, CreditCard, Wallet, Truck } from "lucide-react";

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const shippingCost = 60; // Standard shipping inside Dhaka
  
  const grandTotal = totalPrice + (cartItems.length > 0 ? shippingCost : 0);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    // In a real app, this would process the order via an API
    toast.success("Order placed successfully! Thank you for shopping with SkyBeauty.");
    clearCart();
    // Maybe redirect to an order success page here
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col pt-[72px]">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <Wallet className="w-10 h-10 text-muted-foreground opacity-50" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8 text-center max-w-md font-body">
            Looks like you haven't added anything to your cart yet. Browse our premium collections to find what you're looking for.
          </p>
          <Link to="/products">
            <Button className="h-12 px-8 font-body font-semibold tracking-wide">
              CONTINUE SHOPPING
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-[72px] bg-sky-50/30">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 font-body">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-foreground transition-colors">Shop</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Checkout</span>
        </div>

        <h1 className="text-3xl lg:text-4xl font-display font-bold mb-10 text-slate-900">Checkout</h1>
        
        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Left Column - Forms */}
          <div className="flex-1 space-y-10">
            {/* Contact Information */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">1</span>
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" required className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" required className="h-11" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+880 1XXX-XXXXXX" required className="h-11" />
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">2</span>
                Shipping Address
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" placeholder="123 Main St, Apartment, Studio, or Floor" required className="h-11" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Dhaka" required className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zone">Area/Zone</Label>
                    <Input id="zone" placeholder="Gulshan-1" required className="h-11" />
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">3</span>
                Payment Method
              </h2>
              
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                <div className={`relative flex items-center space-x-3 border p-4 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex-1 cursor-pointer font-medium flex items-center justify-between">
                    <span className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-slate-500" />
                      Cash on Delivery
                    </span>
                  </Label>
                </div>
                
                <div className={`relative flex items-center space-x-3 border p-4 rounded-xl cursor-pointer transition-all ${paymentMethod === 'bkash' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <RadioGroupItem value="bkash" id="bkash" />
                  <Label htmlFor="bkash" className="flex-1 cursor-pointer font-medium flex items-center justify-between">
                    <span className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-pink-600" />
                      bKash / Nagad
                    </span>
                  </Label>
                </div>

                <div className={`relative flex items-center space-x-3 border p-4 rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex-1 cursor-pointer font-medium flex items-center justify-between">
                    <span className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-slate-500" />
                      Credit/Debit Card
                    </span>
                  </Label>
                </div>
              </RadioGroup>
              
              {paymentMethod === 'card' && (
                <div className="mt-6 p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-300">
                  <p className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-600" /> 
                    Secure encrypted transaction
                  </p>
                  <div className="space-y-3">
                    <Input placeholder="Card Number" className="h-11 bg-white" />
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="MM/YY" className="h-11 bg-white" />
                      <Input placeholder="CVC" className="h-11 bg-white" />
                    </div>
                  </div>
                </div>
              )}
              {paymentMethod === 'bkash' && (
                <div className="mt-6 p-5 bg-pink-50 rounded-xl border border-pink-100 space-y-3 animate-in fade-in zoom-in duration-300">
                   <p className="text-sm font-medium text-pink-900">
                    Send money to our Merchant Number: <strong>01XXX-XXXXXX</strong>
                  </p>
                  <Input placeholder="Enter TxnID" className="h-11 bg-white" />
                </div>
              )}
            </section>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-[420px]">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
              <h2 className="text-xl font-display font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-5 mb-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-display text-sm font-medium text-slate-900 line-clamp-2 leading-tight">
                        {item.name}
                      </h4>
                      <p className="font-body text-xs text-slate-500 mt-1">Qty: {item.quantity}</p>
                      <p className="font-body text-sm font-bold text-slate-900 mt-1">৳{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-3 font-body text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">৳{totalPrice}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-medium text-slate-900">৳{shippingCost}</span>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex justify-between items-center mb-8">
                <span className="font-display font-bold text-lg text-slate-900">Total</span>
                <span className="font-display font-bold text-2xl text-slate-900">৳{grandTotal}</span>
              </div>
              
              <Button type="submit" className="w-full h-14 text-base font-semibold tracking-wide bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/10">
                PLACE ORDER
              </Button>
              
              <p className="text-xs text-center text-slate-500 mt-4 font-body flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Guaranteed safe & secure checkout
              </p>
            </div>
          </div>
        </form>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
