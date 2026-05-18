/**
 * Checkout — Full WooCommerce order placement with coupon support.
 * Supports: COD, bKash/Nagad, Card payment methods.
 * Places a real order via WooCommerce REST API on submit.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCoupon } from "@/hooks/useCoupon";
import { ordersApi } from "@/lib/woocommerce/api";
import { formatPrice } from "@/lib/woocommerce/helpers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ChevronRight, ShieldCheck, CreditCard, Wallet,
  Truck, Tag, X, Loader2,
} from "lucide-react";
import type { WCOrderPayload } from "@/lib/woocommerce/types";

const SHIPPING_COST = 60;

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isPlacing, setIsPlacing] = useState(false);

  // Coupon
  const { appliedCoupon, couponCode, setCouponCode, applyCoupon, removeCoupon, isValidating, error: couponError, getDiscountedTotal } = useCoupon();

  // Form state
  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: "",
    address: "",
    address2: "",
    city: "",
    state: "Dhaka",
    postcode: "",
    country: "BD",
    txnId: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    orderNote: "",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // Price calculations
  const shippingCost = cartItems.length > 0 ? SHIPPING_COST : 0;
  const { discounted, freeShipping } = getDiscountedTotal(totalPrice);
  const finalShipping = freeShipping ? 0 : shippingCost;
  const discountAmount = totalPrice - discounted;
  const grandTotal = discounted + finalShipping;

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <Wallet className="w-10 h-10 text-muted-foreground opacity-50" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8 text-center max-w-md font-body">
            Looks like you haven't added anything yet. Browse our premium collections to find what you're looking for.
          </p>
          <Link to="/products">
            <Button className="h-12 px-8 font-body font-semibold tracking-wide">CONTINUE SHOPPING</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.address || !form.city) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please sign in to place an order.");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    setIsPlacing(true);

    try {
      const payload: WCOrderPayload = {
        payment_method: paymentMethod,
        payment_method_title:
          paymentMethod === "cod" ? "Cash on Delivery"
          : paymentMethod === "bkash" ? "bKash / Nagad"
          : "Credit/Debit Card",
        set_paid: paymentMethod === "card",
        billing: {
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          phone: form.phone,
          address_1: form.address,
          address_2: form.address2,
          city: form.city,
          state: form.state,
          postcode: form.postcode || "1000",
          country: form.country,
        },
        shipping: {
          first_name: form.firstName,
          last_name: form.lastName,
          address_1: form.address,
          address_2: form.address2,
          city: form.city,
          state: form.state,
          postcode: form.postcode || "1000",
          country: form.country,
        },
        line_items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        shipping_lines: [
          {
            method_id: "flat_rate",
            method_title: "Standard Shipping",
            total: String(finalShipping),
          },
        ],
        ...(appliedCoupon ? { coupon_lines: [{ code: appliedCoupon.code }] } : {}),
        meta_data: [
          { key: "payment_txn_id", value: form.txnId },
          { key: "order_note", value: form.orderNote },
        ],
      };

      const order = await ordersApi.create(payload);
      clearCart();
      toast.success("Order placed successfully! Thank you for shopping with SkyBD.");
      navigate(`/order-success/${order.id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to place order. Please try again.";
      toast.error(msg);
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 font-body">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-foreground transition-colors">Shop</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Checkout</span>
        </div>

        <h1 className="text-3xl lg:text-4xl font-display font-bold mb-10 text-slate-900">Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* ── Left: Forms ── */}
          <div className="flex-1 space-y-8">
            {/* Contact */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">1</span>
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" placeholder="John" required value={form.firstName} onChange={set("firstName")} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" placeholder="Doe" required value={form.lastName} onChange={set("lastName")} className="h-11" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required value={form.email} onChange={set("email")} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" placeholder="+880 1XXX-XXXXXX" required value={form.phone} onChange={set("phone")} className="h-11" />
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">2</span>
                Shipping Address
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input id="address" placeholder="House 42, Road 7, Block C" required value={form.address} onChange={set("address")} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address2">Apartment / Suite (Optional)</Label>
                  <Input id="address2" placeholder="Flat 3B" value={form.address2} onChange={set("address2")} className="h-11" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" placeholder="Dhaka" required value={form.city} onChange={set("city")} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Division</Label>
                    <Input id="state" placeholder="Dhaka" value={form.state} onChange={set("state")} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postcode">Postal Code</Label>
                    <Input id="postcode" placeholder="1213" value={form.postcode} onChange={set("postcode")} className="h-11" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderNote">Order Note (Optional)</Label>
                  <Input id="orderNote" placeholder="Special instructions for your order…" value={form.orderNote} onChange={set("orderNote")} className="h-11" />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">3</span>
                Payment Method
              </h2>

              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                {[
                  { value: "cod", icon: <Truck className="w-5 h-5 text-slate-500" />, label: "Cash on Delivery" },
                  { value: "bkash", icon: <Wallet className="w-5 h-5 text-pink-600" />, label: "bKash / Nagad" },
                  { value: "card", icon: <CreditCard className="w-5 h-5 text-slate-500" />, label: "Credit / Debit Card" },
                ].map((opt) => (
                  <div
                    key={opt.value}
                    className={`flex items-center space-x-3 border p-4 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === opt.value ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <RadioGroupItem value={opt.value} id={opt.value} />
                    <Label htmlFor={opt.value} className="flex-1 cursor-pointer font-medium flex items-center gap-3">
                      {opt.icon}
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {/* bKash detail */}
              {paymentMethod === "bkash" && (
                <div className="mt-5 p-5 bg-pink-50 rounded-xl border border-pink-100 space-y-3 animate-in fade-in zoom-in duration-200">
                  <p className="text-sm font-medium text-pink-900">
                    Send money to Merchant: <strong>01XXX-XXXXXX</strong>
                  </p>
                  <Input placeholder="Enter Transaction ID" value={form.txnId} onChange={set("txnId")} className="h-11 bg-white" />
                </div>
              )}

              {/* Card detail */}
              {paymentMethod === "card" && (
                <div className="mt-5 p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-200">
                  <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    Secure encrypted transaction
                  </p>
                  <Input placeholder="Card Number" value={form.cardNumber} onChange={set("cardNumber")} className="h-11 bg-white" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="MM/YY" value={form.cardExpiry} onChange={set("cardExpiry")} className="h-11 bg-white" />
                    <Input placeholder="CVC" value={form.cardCvc} onChange={set("cardCvc")} className="h-11 bg-white" />
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:w-[420px]">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 sticky top-24 space-y-6">
              <h2 className="text-xl font-display font-bold">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-sm font-medium text-slate-900 line-clamp-2 leading-tight">{item.name}</h4>
                      <p className="font-body text-xs text-slate-500 mt-1">Qty: {item.quantity}</p>
                      <p className="font-body text-sm font-bold text-slate-900 mt-1">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Coupon */}
              <div className="space-y-2">
                <p className="font-body text-xs font-bold uppercase tracking-widest text-slate-500">Coupon Code</p>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <Tag className="w-4 h-4" />
                      <span className="font-body text-sm font-semibold uppercase">{appliedCoupon.code}</span>
                      <span className="text-xs">
                        (-{appliedCoupon.discount_type === "percent" ? `${appliedCoupon.amount}%` : formatPrice(appliedCoupon.amount)})
                      </span>
                    </div>
                    <button onClick={removeCoupon} className="text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyCoupon())}
                      className="h-10 text-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 px-4 font-body text-xs shrink-0"
                      onClick={applyCoupon}
                      disabled={isValidating}
                    >
                      {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                    </Button>
                  </div>
                )}
                {couponError && <p className="text-xs text-destructive font-body">{couponError}</p>}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-3 font-body text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">{formatPrice(totalPrice)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Coupon Discount</span>
                    <span className="font-medium">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-medium text-slate-900">
                    {freeShipping ? <span className="text-green-600">Free</span> : formatPrice(finalShipping)}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-display font-bold text-lg text-slate-900">Total</span>
                <span className="font-display font-bold text-2xl text-slate-900">{formatPrice(grandTotal)}</span>
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-base font-semibold tracking-wide bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/10"
                disabled={isPlacing}
              >
                {isPlacing ? (
                  <><Loader2 className="w-5 h-5 animate-spin mr-2" />Placing Order…</>
                ) : "PLACE ORDER"}
              </Button>

              <p className="text-xs text-center text-slate-500 font-body flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Guaranteed safe &amp; secure checkout
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
