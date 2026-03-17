import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Package, MapPin, Heart, LogOut, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const mockUser = {
  name: "Samir Antaz",
  email: "samir@example.com",
  phone: "+880 1712-345678",
  since: "January 2024",
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
};

const mockOrders = [
  {
    id: "ORD-7321",
    date: "March 12, 2024",
    status: "Delivered",
    total: 3250,
    items: [
      { name: "Radiance Serum", price: 1850, quantity: 1, image: "https://images.unsplash.com/photo-1570171806991-6e04ed296683?auto=format&fit=crop&q=80&w=200" },
      { name: "Hydrating Cleanser", price: 1400, quantity: 1, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=200" },
    ],
  },
  {
    id: "ORD-6890",
    date: "February 28, 2024",
    status: "Processing",
    total: 4500,
    items: [
      { name: "Anti-Aging Night Cream", price: 4500, quantity: 1, image: "https://images.unsplash.com/photo-1594125350489-7b92f48583a7?auto=format&fit=crop&q=80&w=200" },
    ],
  },
  {
    id: "ORD-5412",
    date: "January 15, 2024",
    status: "Shipped",
    total: 1200,
    items: [
      { name: "Facial Mist", price: 1200, quantity: 1, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200" },
    ],
  },
];

const mockAddresses = [
  {
    id: 1,
    type: "Default Shipping",
    name: "Samir Antaz",
    address: "House 42, Road 7, Block C",
    area: "Banani, Dhaka 1213",
    phone: "+880 1712-345678",
  },
  {
    id: 2,
    type: "Work",
    name: "Samir Antaz (Office)",
    address: "Level 12, Sky Tower, Gulshan 1",
    area: "Dhaka 1212",
    phone: "+880 1712-345678",
  },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-muted/30 p-6 border border-border rounded-lg text-center lg:text-left">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto lg:mx-0 mb-4 border-2 border-primary/20">
                <img src={mockUser.avatar} alt={mockUser.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">{mockUser.name}</h2>
                <p className="font-body text-sm text-muted-foreground">{mockUser.email}</p>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="font-body text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Member Since</p>
                  <p className="font-body text-sm text-foreground">{mockUser.since}</p>
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              {[
                { id: "orders", icon: Package, label: "My Orders" },
                { id: "details", icon: User, label: "Account Details" },
                { id: "addresses", icon: MapPin, label: "Addresses" },
                { id: "wishlist", icon: Heart, label: "Wishlist" },
              ].map((item) => (
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
              <Button variant="ghost" className="w-full justify-start gap-3 mt-4 text-destructive hover:text-destructive hover:bg-destructive/10 px-4 py-3 h-auto font-body text-sm">
                <LogOut size={18} />
                Logout
              </Button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-background border border-border rounded-lg p-6 md:p-8">
              {activeTab === "orders" && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h1 className="font-display text-2xl font-bold text-foreground">Order History</h1>
                    <div className="hidden sm:block">
                      <ShoppingBag className="w-6 h-6 text-muted-foreground opacity-30" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {mockOrders.map((order) => (
                      <Card key={order.id} className="overflow-hidden border-border bg-card/40 hover:bg-card transition-colors">
                        <CardHeader className="bg-muted/30 py-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-x-6 gap-y-2">
                              <div>
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Order ID</p>
                                <p className="text-sm font-semibold text-foreground">{order.id}</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Placed On</p>
                                <p className="text-sm text-foreground">{order.date}</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Total Amount</p>
                                <p className="text-sm font-bold text-primary">৳{order.total}</p>
                              </div>
                            </div>
                            <Badge variant={
                              order.status === "Delivered" ? "default" : 
                              order.status === "Processing" ? "secondary" : "outline"
                            } className="font-body text-[10px] uppercase tracking-wider px-2.5 py-0.5">
                              {order.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-muted rounded overflow-hidden border border-border shrink-0">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold text-foreground truncate">{item.name}</h4>
                                  <p className="text-xs text-muted-foreground">Qty: {item.quantity} · Price: ৳{item.price}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-6 pt-6 border-t border-border flex justify-end gap-3">
                            {order.status !== "Delivered" && (
                              <Button variant="ghost" className="font-body text-xs h-9 px-4 text-destructive hover:text-destructive hover:bg-destructive/10">
                                Cancel Order
                              </Button>
                            )}
                            <Button variant="outline" className="font-body text-xs h-9 px-4">Download Invoice</Button>
                            <Button className="font-body text-xs h-9 px-4">Reorder</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "details" && (
                <div className="space-y-8">
                  <h1 className="font-display text-2xl font-bold text-foreground">Account Details</h1>
                  <div className="max-w-xl space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Full Name</label>
                        <p className="p-3 bg-muted/30 border border-border rounded-md text-sm font-body">{mockUser.name}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Email Address</label>
                        <p className="p-3 bg-muted/30 border border-border rounded-md text-sm font-body">{mockUser.email}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Phone Number</label>
                        <p className="p-3 bg-muted/30 border border-border rounded-md text-sm font-body">{mockUser.phone}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Birthday</label>
                        <p className="p-3 bg-muted/30 border border-border rounded-md text-sm font-body italic text-muted-foreground">Not specified</p>
                      </div>
                    </div>
                    <Separator className="my-8" />
                    <div className="space-y-4">
                      <h3 className="font-display text-lg font-semibold text-foreground">Update Password</h3>
                      <p className="text-xs text-muted-foreground font-body">Change your password to keep your account secure.</p>
                      <Button variant="outline" className="font-body text-sm">Modify Security Settings</Button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button className="w-full sm:w-auto px-10 h-11 font-body font-bold tracking-widest bg-primary text-primary-foreground hover:opacity-90">
                        SAVE CHANGES
                      </Button>
                      <Button variant="outline" className="w-full sm:w-auto px-10 h-11 font-body font-bold tracking-widest">
                        CANCEL
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "addresses" && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h1 className="font-display text-2xl font-bold text-foreground">Shipping Addresses</h1>
                    <Button variant="outline" className="gap-2 font-body text-sm">
                      <MapPin size={16} /> Add New
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {mockAddresses.map((addr) => (
                      <Card key={addr.id} className="border-border hover:border-primary/40 transition-colors">
                        <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
                          <CardTitle className="text-sm font-display font-bold">{addr.name}</CardTitle>
                          <Badge variant="secondary" className="text-[9px] uppercase tracking-tighter h-5">{addr.type}</Badge>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="font-body text-sm text-muted-foreground space-y-1">
                            <p>{addr.address}</p>
                            <p>{addr.area}</p>
                            <p className="pt-2 text-foreground font-medium">Ph: {addr.phone}</p>
                          </div>
                          <div className="flex gap-4 pt-2">
                            <button className="text-xs font-body font-semibold text-primary hover:underline">Edit</button>
                            <button className="text-xs font-body font-semibold text-destructive hover:underline">Delete</button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "wishlist" && (
                <div className="space-y-8 text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-muted-foreground opacity-30" />
                  </div>
                  <h1 className="font-display text-2xl font-bold text-foreground">Your Wishlist is Empty</h1>
                  <p className="font-body text-sm text-muted-foreground max-w-md mx-auto">
                    You haven't saved any items yet. Start exploring our collections to find products you love!
                  </p>
                  <Button className="mt-8 px-10 h-11 font-body font-bold tracking-widest">
                    EXPLORE SHOP
                  </Button>
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
