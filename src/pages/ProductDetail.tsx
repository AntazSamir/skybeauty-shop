import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingBag, Heart, Star, ChevronLeft, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProductBySlug, products, getProductSlug } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useCart } from "@/contexts/CartContext";

const reviews = [
  {
    id: 1,
    author: "Sarah J.",
    rating: 5,
    date: "March 12, 2024",
    comment: "Absolutely love this! My skin has never felt better. The texture is lightweight and absorbs quickly.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100",
  },
  {
    id: 2,
    author: "Michael R.",
    rating: 4,
    date: "February 28, 2024",
    comment: "Great product, works as advertised. I've noticed a significant difference in just two weeks.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100",
  },
  {
    id: 3,
    author: "Emma W.",
    rating: 5,
    date: "January 15, 2024",
    comment: "This is a game changer for my morning routine. Highly recommend to anyone with sensitive skin!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
  },
];

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "ingredients" | "how-to-use">("description");

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-32 text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">Product Not Found</h1>
          <Link to="/" className="font-body text-primary hover:underline">← Back to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images || [product.image];
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Breadcrumb */}
      <div className="container pt-6 pb-2">
        <nav className="flex items-center gap-2 font-body text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      {/* Product Section */}
      <section className="container pb-16 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-muted overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.tag && (
                <span className={`absolute top-4 left-4 px-3 py-1.5 text-xs font-body font-semibold tracking-wide uppercase ${
                  product.tag === "New" ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
                }`}>
                  {product.tag}
                </span>
              )}
              {discount > 0 && (
                <span className="absolute top-4 right-4 px-3 py-1.5 text-xs font-body font-semibold bg-destructive text-destructive-foreground">
                  -{discount}%
                </span>
              )}
            </div>
            {/* Thumbnails */}
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 border-2 overflow-hidden transition-all ${
                    selectedImage === i ? "border-primary" : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mb-2">{product.category}</p>
            <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-border"}
                  />
                ))}
              </div>
              <span className="font-body text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-3xl font-bold text-primary">৳{product.price}</span>
              {product.originalPrice && (
                <span className="font-body text-lg text-muted-foreground line-through">৳{product.originalPrice}</span>
              )}
            </div>

            {/* Size */}
            <p className="font-body text-sm text-muted-foreground mb-8">
              Size: <span className="text-foreground font-medium">{product.size}</span>
            </p>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 h-12 flex items-center justify-center font-body text-sm font-semibold text-foreground border-x border-border">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button 
                onClick={() => addToCart(product, quantity)}
                className="flex-1 h-12 bg-primary text-primary-foreground font-body text-sm font-semibold tracking-wide flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <ShoppingBag size={18} />
                ADD TO CART
              </button>
              <button className="w-12 h-12 border border-border flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive transition-colors" aria-label="Add to wishlist">
                <Heart size={18} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-border mb-8">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck size={20} className="text-primary" />
                <span className="font-body text-[11px] text-muted-foreground leading-tight">Free Delivery<br />over ৳1500</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Shield size={20} className="text-primary" />
                <span className="font-body text-[11px] text-muted-foreground leading-tight">100%<br />Authentic</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw size={20} className="text-primary" />
                <span className="font-body text-[11px] text-muted-foreground leading-tight">Easy<br />Returns</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border mb-6">
              {(["description", "ingredients", "how-to-use"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-body text-sm py-3 px-4 transition-colors border-b-2 -mb-px capitalize ${
                    activeTab === tab
                      ? "border-primary text-foreground font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.replace("-", " ")}
                </button>
              ))}
            </div>
            <div className="font-body text-sm text-muted-foreground leading-relaxed">
              {activeTab === "description" && <p>{product.description}</p>}
              {activeTab === "ingredients" && <p>{product.ingredients}</p>}
              {activeTab === "how-to-use" && <p>{product.howToUse}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* Premium Reviews Section */}
      <section className="container py-24 border-t border-border bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">What Our Community Says</h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-border"}
                  />
                ))}
              </div>
              <span className="font-display text-xl font-bold text-foreground">{product.rating}</span>
            </div>
            <p className="font-body text-sm text-muted-foreground uppercase tracking-widest">Based on {product.reviews} verified reviews</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
            {/* Rating Summary Card */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 bg-background border border-border p-8 rounded-2xl shadow-sm space-y-6">
                <h3 className="font-display text-lg font-bold text-foreground">Rating Distribution</h3>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-4 group">
                      <span className="font-body text-xs font-semibold text-muted-foreground w-12 flex items-center gap-1">
                        {rating} <Star size={10} className="fill-muted-foreground" />
                      </span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-1000 group-hover:opacity-80" 
                          style={{ width: `${rating === 5 ? 85 : rating === 4 ? 10 : 2}%` }} 
                        />
                      </div>
                      <span className="font-body text-[10px] text-muted-foreground font-bold w-10">
                        {rating === 5 ? "85%" : rating === 4 ? "10%" : "2%"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-border">
                  <p className="font-body text-xs text-muted-foreground leading-relaxed mb-6 italic">
                    95% of customers recommend this product to their friends and family.
                  </p>
                  <Button className="w-full h-12 font-bold tracking-widest text-xs uppercase shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                    WRITE A REVIEW
                  </Button>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                <p className="font-display text-sm font-bold text-foreground">SORT BY: <span className="text-primary cursor-pointer hover:underline">MOST RECENT</span></p>
                <div className="flex gap-2">
                  <Badge variant="outline" className="rounded-full font-body text-[10px] py-1 px-3 cursor-pointer hover:bg-muted transition-colors">With Images</Badge>
                  <Badge variant="outline" className="rounded-full font-body text-[10px] py-1 px-3 cursor-pointer hover:bg-muted transition-colors">Verified Only</Badge>
                </div>
              </div>

              {reviews.map((review) => (
                <div key={review.id} className="group bg-background border border-border p-8 rounded-2xl hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex flex-col gap-4 flex-1">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < review.rating ? "fill-primary text-primary" : "text-border"}
                          />
                        ))}
                      </div>
                      <h4 className="font-display text-lg font-bold text-foreground leading-snug">
                        "{review.id === 1 ? "Simply the best I've used" : review.id === 2 ? "Exceeded my expectations" : "Highly recommended"}"
                      </h4>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed italic pr-4">
                        {review.comment}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <div className="px-3 py-1 bg-muted/50 rounded-md text-[10px] font-bold text-muted-foreground uppercase">Gentle</div>
                        <div className="px-3 py-1 bg-muted/50 rounded-md text-[10px] font-bold text-muted-foreground uppercase">Effective</div>
                      </div>
                    </div>

                    <div className="flex items-center md:flex-col md:items-end gap-3 min-w-[140px] shrink-0 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
                        <img src={review.avatar} alt={review.author} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left md:text-right">
                        <div className="flex items-center md:justify-end gap-1 mb-0.5">
                          <h5 className="font-display text-xs font-bold text-foreground truncate max-w-[100px]">{review.author}</h5>
                          <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center border-2 border-background">
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">{review.date}</p>
                        <p className="font-body text-[9px] text-green-600 font-bold uppercase tracking-widest mt-1">Verified Purchase</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-10 flex justify-center">
                <Button variant="outline" className="px-12 h-12 font-bold tracking-widest text-xs uppercase hover:bg-primary hover:text-primary-foreground transition-all">
                  LOAD MORE REVIEWS
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="container pb-20">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground text-center mb-10">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((rp) => (
              <Link
                key={rp.id}
                to={`/product/${getProductSlug(rp)}`}
                className="group bg-background border border-border overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-muted overflow-hidden">
                  <img src={rp.image} alt={rp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-sm font-semibold text-foreground leading-snug">{rp.name}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-body text-sm font-bold text-primary">৳{rp.price}</span>
                    {rp.originalPrice && (
                      <span className="font-body text-xs text-muted-foreground line-through">৳{rp.originalPrice}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
