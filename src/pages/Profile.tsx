import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Package, MapPin, Heart, LogOut, ChevronRight, ShoppingBag, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const initialUser = {
  name: "Samir Antaz",
  email: "samir@example.com",
  phone: "+880 1712-345678",
  since: "January 2024",
  birthday: "1995-10-15",
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
    phone: "+880 1712-341234",
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
  const [userData, setUserData] = useState(initialUser);
  const [editForm, setEditForm] = useState(initialUser);
  const [addresses, setAddresses] = useState(mockAddresses);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [addressForm, setAddressForm] = useState(mockAddresses[0]);
  const { toast } = useToast();

  const handleSave = () => {
    setUserData(editForm);
    toast({
      title: "Profile Updated",
      description: "Your account details have been saved successfully.",
    });
  };

  const handleCancel = () => {
    setEditForm(userData);
    toast({
      title: "Changes Discarded",
      description: "Your profile remains unchanged.",
      variant: "destructive",
    });
  };

  const saveAddress = () => {
    setAddresses(addresses.map(a => a.id === editingAddressId ? addressForm : a));
    setEditingAddressId(null);
    toast({
      title: "Address Updated",
      description: "Your shipping information has been saved.",
    });
  };

  const deleteAddress = (id: number) => {
    setAddresses(addresses.filter(a => a.id !== id));
    toast({
      title: "Address Deleted",
      description: "The address has been removed from your profile.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-muted/30 p-6 border border-border rounded-lg text-center lg:text-left transition-all hover:shadow-sm">
              <div className="relative w-24 h-24 mx-auto lg:mx-0 mb-4 group cursor-pointer">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-primary/20 transition-transform group-hover:scale-105">
                  <img src={userData.avatar} alt={userData.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white w-6 h-6" />
                </div>
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">{userData.name}</h2>
                <p className="font-body text-sm text-muted-foreground">{userData.email}</p>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="font-body text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Member Since</p>
                  <p className="font-body text-sm text-foreground">{userData.since}</p>
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
                <div className="space-y-8 animate-fade-in">
                  <h1 className="font-display text-2xl font-bold text-foreground">Account Details</h1>
                  <div className="max-w-xl space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                        <Input 
                          value={editForm.name} 
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          className="font-body text-sm bg-muted/20 border-border focus:ring-primary h-11" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
                        <Input 
                          value={editForm.email} 
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          className="font-body text-sm bg-muted/20 border-border focus:ring-primary h-11" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Phone Number</label>
                        <Input 
                          value={editForm.phone} 
                          onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                          className="font-body text-sm bg-muted/20 border-border focus:ring-primary h-11" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Birthday</label>
                        <Input 
                          type="date"
                          value={editForm.birthday} 
                          onChange={(e) => setEditForm({...editForm, birthday: e.target.value})}
                          className="font-body text-sm bg-muted/20 border-border focus:ring-primary h-11" 
                        />
                      </div>
                    </div>
                    
                    <Separator className="bg-border/60" />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-semibold text-foreground">Update Password</h3>
                        <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-widest border-primary/20 text-primary">Secure</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-body leading-relaxed max-w-sm">
                        It's a good idea to use a strong password that you're not using elsewhere.
                      </p>
                      <Button variant="outline" className="font-body text-sm h-11 px-6 hover:bg-muted">
                        MODIFY SECURITY SETTINGS
                      </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Button 
                        onClick={handleSave}
                        className="w-full sm:w-auto px-12 h-12 font-body font-bold tracking-[0.1em] text-xs bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all"
                      >
                        SAVE CHANGES
                      </Button>
                      <Button 
                        onClick={handleCancel}
                        variant="ghost" 
                        className="w-full sm:w-auto px-12 h-12 font-body font-bold tracking-[0.1em] text-xs hover:bg-muted text-muted-foreground"
                      >
                        CANCEL
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "addresses" && (
                <div className="space-y-8 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h1 className="font-display text-2xl font-bold text-foreground">Shipping Addresses</h1>
                    <Button 
                      variant="outline" 
                      className="gap-2 font-body text-sm h-10 px-6"
                      onClick={() => {
                        setEditingAddressId(0);
                        setAddressForm({
                          id: Date.now(),
                          type: "New Address",
                          name: userData.name,
                          address: "",
                          area: "",
                          phone: userData.phone
                        });
                      }}
                    >
                      <MapPin size={16} /> Add New
                    </Button>
                  </div>

                  {editingAddressId !== null ? (
                    <Card className="border-primary/20 bg-muted/5">
                      <CardHeader>
                        <CardTitle className="text-lg font-display">
                          {editingAddressId === 0 ? "Add Brand New Address" : "Edit Existing Address"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Address Label</label>
                            <Input value={addressForm.type} onChange={e => setAddressForm({...addressForm, type: e.target.value})} className="h-10" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Receiver Name</label>
                            <Input value={addressForm.name} onChange={e => setAddressForm({...addressForm, name: e.target.value})} className="h-10" />
                          </div>
                          <div className="col-span-full space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Street Address</label>
                            <Input value={addressForm.address} onChange={e => setAddressForm({...addressForm, address: e.target.value})} className="h-10" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Area / City</label>
                            <Input value={addressForm.area} onChange={e => setAddressForm({...addressForm, area: e.target.value})} className="h-10" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Phone Number</label>
                            <Input value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} className="h-10" />
                          </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Button 
                            className="h-10 px-8 font-bold text-[10px] tracking-widest uppercase"
                            onClick={() => {
                              if (editingAddressId === 0) {
                                setAddresses([...addresses, addressForm]);
                                setEditingAddressId(null);
                                toast({ title: "Address Added", description: "Your new shipping location is ready." });
                              } else {
                                saveAddress();
                              }
                            }}
                          >
                            SAVE ADDRESS
                          </Button>
                          <Button variant="ghost" className="h-10 px-8 font-bold text-[10px] tracking-widest uppercase" onClick={() => setEditingAddressId(null)}>CANCEL</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {addresses.map((addr) => (
                        <Card key={addr.id} className="border-border hover:border-primary/40 transition-all hover:shadow-md group">
                          <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-display font-bold">{addr.name}</CardTitle>
                            <Badge variant="secondary" className="text-[9px] uppercase tracking-tighter h-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">{addr.type}</Badge>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="font-body text-sm text-muted-foreground space-y-1">
                              <p className="leading-relaxed">{addr.address}</p>
                              <p>{addr.area}</p>
                              <p className="pt-2 text-foreground font-semibold flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-primary" />
                                Ph: {addr.phone}
                              </p>
                            </div>
                            <Separator className="bg-border/40" />
                            <div className="flex gap-6 pt-1">
                              <button 
                                onClick={() => {
                                  setEditingAddressId(addr.id);
                                  setAddressForm(addr);
                                }}
                                className="text-[10px] font-body font-bold text-primary hover:underline tracking-widest uppercase"
                              >
                                Edit Details
                              </button>
                              <button 
                                onClick={() => deleteAddress(addr.id)}
                                className="text-[10px] font-body font-bold text-destructive hover:underline tracking-widest uppercase"
                              >
                                Remove
                              </button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
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
