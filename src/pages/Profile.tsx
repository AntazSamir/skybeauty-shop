/**
 * Profile — Customer account page powered by WooCommerce.
 * Shows real orders from WC REST API and allows profile editing.
 */

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useCustomerOrders } from "@/hooks/useOrders";
import { customersApi } from "@/lib/woocommerce/api";
import { formatPrice } from "@/lib/woocommerce/helpers";
import {
  User, Package, MapPin, LogOut, ChevronRight,
  ShoppingBag, Camera, Loader2, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { WCCustomer } from "@/lib/woocommerce/types";

type Tab = "orders" | "details" | "addresses";

const STATUS_STYLES: Record<string, string> = {
  completed:  "bg-green-100 text-green-700",
  processing: "bg-blue-100 text-blue-700",
  on_hold:    "bg-amber-100 text-amber-700",
  cancelled:  "bg-red-100 text-red-700",
  refunded:   "bg-slate-100 text-slate-600",
  pending:    "bg-orange-100 text-orange-700",
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [customer, setCustomer] = useState<WCCustomer | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [ordersPage] = useState(1);

  // Form state for editing
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    billing_phone: "",
    billing_address_1: "",
    billing_city: "",
  });

  // Fetch orders for this customer
  const { data: orders, isLoading: ordersLoading } = useCustomerOrders(
    user?.id ?? undefined,
    ordersPage
  );

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({ title: "Access Denied", description: "Please sign in to view your profile.", variant: "destructive" });
      navigate("/login", { state: { from: "/profile" } });
    }
  }, [authLoading, isAuthenticated, navigate, toast]);

  // Load customer data
  useEffect(() => {
    if (!user?.id) return;
    customersApi.getById(user.id).then((data) => {
      setCustomer(data);
      setEditForm({
        first_name: data.first_name,
        last_name: data.last_name,
        billing_phone: data.billing?.phone ?? "",
        billing_address_1: data.billing?.address_1 ?? "",
        billing_city: data.billing?.city ?? "",
      });
    }).catch(() => {
      // Non-critical: use JWT data as fallback
    });
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      const updated = await customersApi.update(user.id, {
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        billing: {
          ...(customer?.billing ?? {} as WCCustomer["billing"]),
          phone: editForm.billing_phone,
          address_1: editForm.billing_address_1,
          city: editForm.billing_city,
        },
      });
      setCustomer(updated);
      toast({ title: "Profile Updated", description: "Your details have been saved." });
    } catch {
      toast({ title: "Update Failed", description: "Could not save changes. Please try again.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({ title: "Logged Out", description: "You've been signed out." });
    navigate("/");
  };

  const displayName = customer
    ? `${customer.first_name} ${customer.last_name}`.trim()
    : user?.displayName ?? "Customer";
  const displayEmail = customer?.email ?? user?.email ?? "";
  const avatarUrl = customer?.avatar_url ?? user?.avatarUrl ?? "";

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  const navItems: { id: Tab; icon: React.ElementType; label: string }[] = [
    { id: "orders",    icon: Package, label: "My Orders" },
    { id: "details",   icon: User,    label: "Account Details" },
    { id: "addresses", icon: MapPin,  label: "Addresses" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-muted/30 p-6 border border-border rounded-lg text-center lg:text-left transition-all hover:shadow-sm">
              {/* Avatar */}
              <div className="relative w-24 h-24 mx-auto lg:mx-0 mb-4 group cursor-pointer">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-primary/20 transition-transform group-hover:scale-105 bg-muted">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-display text-2xl font-bold">
                      {displayName[0]?.toUpperCase() ?? "U"}
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white w-6 h-6" />
                </div>
              </div>
              <h2 className="font-display text-xl font-bold text-foreground">{displayName}</h2>
              <p className="font-body text-sm text-muted-foreground">{displayEmail}</p>
              {customer && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="font-body text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Total Orders</p>
                  <p className="font-body text-sm text-foreground font-bold">{customer.orders_count}</p>
                </div>
              )}
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                    activeTab === item.id
                      ? "bg-primary text-primary-foreground font-semibold shadow-md"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3 font-body text-sm">
                    <item.icon size={18} />
                    {item.label}
                  </div>
                  <ChevronRight size={14} className={activeTab === item.id ? "opacity-100" : "opacity-0"} />
                </button>
              ))}

              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start gap-3 mt-4 text-destructive hover:text-destructive hover:bg-destructive/10 px-4 py-3 h-auto font-body text-sm"
              >
                <LogOut size={18} />
                Logout
              </Button>
            </nav>
          </div>

          {/* ── Main Content ── */}
          <div className="lg:col-span-3">
            <div className="bg-background border border-border rounded-lg p-6 md:p-8">

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h1 className="font-display text-2xl font-bold text-foreground">Order History</h1>
                    <ShoppingBag className="w-6 h-6 text-muted-foreground opacity-30" />
                  </div>

                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : !orders || orders.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                      <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                      <h2 className="font-display text-2xl font-bold text-slate-800 mb-3">No Orders Yet</h2>
                      <p className="font-body text-sm text-slate-500 max-w-md mx-auto mb-6">
                        You haven't placed any orders yet. Explore our premium skincare collection!
                      </p>
                      <Link to="/products">
                        <Button className="px-10 h-11 font-body font-semibold tracking-wider">
                          EXPLORE PRODUCTS
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-border rounded-xl overflow-hidden bg-card/40 hover:bg-card transition-colors">
                          {/* Order header */}
                          <div className="bg-muted/30 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex flex-wrap gap-x-6 gap-y-1">
                              <div>
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Order #</p>
                                <p className="text-sm font-semibold text-foreground">{order.number}</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Date</p>
                                <p className="text-sm text-foreground">
                                  {new Date(order.date_created).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Total</p>
                                <p className="text-sm font-bold text-primary">{formatPrice(order.total)}</p>
                              </div>
                            </div>
                            <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full ${STATUS_STYLES[order.status] ?? "bg-muted text-muted-foreground"}`}>
                              {order.status.replace("_", " ")}
                            </span>
                          </div>

                          {/* Line items */}
                          <div className="px-5 py-4 space-y-3">
                            {order.line_items.slice(0, 3).map((item) => (
                              <div key={item.id} className="flex items-center gap-3">
                                {item.image?.src && (
                                  <div className="w-12 h-12 bg-muted rounded overflow-hidden border border-border shrink-0">
                                    <img src={item.image.src} alt={item.name} className="w-full h-full object-cover" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">Qty: {item.quantity} · {formatPrice(item.price)}</p>
                                </div>
                              </div>
                            ))}
                            {order.line_items.length > 3 && (
                              <p className="text-xs text-muted-foreground font-body">+{order.line_items.length - 3} more item(s)</p>
                            )}
                          </div>

                          <div className="px-5 py-3 border-t border-border flex justify-end gap-3">
                            <Button variant="outline" size="sm" className="font-body text-xs h-8 px-4">
                              View Details
                            </Button>
                            {order.status === "completed" && (
                              <Button size="sm" className="font-body text-xs h-8 px-4">
                                Reorder
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Account Details Tab */}
              {activeTab === "details" && (
                <div className="space-y-8 animate-fade-in">
                  <h1 className="font-display text-2xl font-bold text-foreground">Account Details</h1>

                  <div className="max-w-xl space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {[
                        { label: "First Name", key: "first_name" as const, placeholder: "John" },
                        { label: "Last Name", key: "last_name" as const, placeholder: "Doe" },
                        { label: "Phone Number", key: "billing_phone" as const, placeholder: "+880 1XXX-XXXXXX" },
                        { label: "City", key: "billing_city" as const, placeholder: "Dhaka" },
                      ].map(({ label, key, placeholder }) => (
                        <div className="space-y-2" key={key}>
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">{label}</label>
                          <Input
                            value={editForm[key]}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, [key]: e.target.value }))}
                            placeholder={placeholder}
                            className="font-body text-sm h-11"
                          />
                        </div>
                      ))}
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Street Address</label>
                        <Input
                          value={editForm.billing_address_1}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, billing_address_1: e.target.value }))}
                          placeholder="House 42, Road 7, Block C"
                          className="font-body text-sm h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
                      <Input
                        value={displayEmail}
                        disabled
                        className="font-body text-sm h-11 bg-muted/30 text-muted-foreground cursor-not-allowed"
                      />
                      <p className="text-[11px] font-body text-muted-foreground ml-1">Email cannot be changed here.</p>
                    </div>

                    <Separator className="bg-border/60" />

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full sm:w-auto px-12 h-12 font-body font-bold tracking-[0.1em] text-xs"
                      >
                        {isSaving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving…</> : "SAVE CHANGES"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <div className="space-y-8 animate-fade-in">
                  <h1 className="font-display text-2xl font-bold text-foreground">Saved Addresses</h1>

                  {customer ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Billing address */}
                      <div className="border border-border rounded-xl p-5 hover:border-primary/40 transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-display text-sm font-bold">Billing Address</h3>
                          <span className="text-[9px] uppercase tracking-widest font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>
                        </div>
                        <div className="font-body text-sm text-muted-foreground space-y-1">
                          <p className="font-semibold text-foreground">{customer.billing.first_name} {customer.billing.last_name}</p>
                          <p>{customer.billing.address_1}</p>
                          {customer.billing.address_2 && <p>{customer.billing.address_2}</p>}
                          <p>{customer.billing.city}, {customer.billing.state}</p>
                          <p className="text-foreground font-semibold mt-2">{customer.billing.phone}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setActiveTab("details")} className="mt-4 text-xs text-primary hover:text-primary font-body font-bold tracking-widest uppercase">
                          Edit Address
                        </Button>
                      </div>

                      {/* Shipping address */}
                      <div className="border border-border rounded-xl p-5 hover:border-primary/40 transition-all">
                        <h3 className="font-display text-sm font-bold mb-3">Shipping Address</h3>
                        <div className="font-body text-sm text-muted-foreground space-y-1">
                          {customer.shipping.address_1 ? (
                            <>
                              <p className="font-semibold text-foreground">{customer.shipping.first_name} {customer.shipping.last_name}</p>
                              <p>{customer.shipping.address_1}</p>
                              <p>{customer.shipping.city}, {customer.shipping.state}</p>
                            </>
                          ) : (
                            <p className="text-muted-foreground italic">Same as billing address</p>
                          )}
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs text-green-600 font-body font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Updated automatically on checkout
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                      <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="font-body text-sm text-muted-foreground">
                        Your addresses will appear here after your first order.
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
