import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingBag, Heart, Star, ChevronLeft, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProductBySlug, products, getProductSlug } from "@/data/products";

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

      {/* Reviews Section */}
      <section className="container py-20 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-12 mb-16">
            <div className="space-y-4">
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">Customer Reviews</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-border"}
                    />
                  ))}
                </div>
                <span className="font-body text-lg font-bold text-foreground">{product.rating} out of 5</span>
              </div>
              <p className="font-body text-sm text-muted-foreground text-foreground/70">Based on {product.reviews} reviews</p>
            </div>
            
            <div className="flex-1 max-w-sm space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="font-body text-xs text-muted-foreground w-3">{rating}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${rating === 5 ? 80 : rating === 4 ? 15 : 5}%` }} 
                    />
                  </div>
                  <span className="font-body text-xs text-muted-foreground w-8">
                    {rating === 5 ? "80%" : rating === 4 ? "15%" : "5%"}
                  </span>
                </div>
              ))}
            </div>

            <button className="h-12 px-8 border-2 border-primary text-primary font-body text-sm font-bold tracking-wide hover:bg-primary hover:text-primary-foreground transition-all">
              WRITE A REVIEW
            </button>
          </div>

          <div className="space-y-12">
            {reviews.map((review) => (
              <div key={review.id} className="pb-12 border-b border-border last:border-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                      <img src={review.avatar} alt={review.author} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-body text-sm font-bold text-foreground">{review.author}</h4>
                      <p className="font-body text-[11px] text-muted-foreground uppercase tracking-widest">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < review.rating ? "fill-primary text-primary" : "text-border"}
                      />
                    ))}
                  </div>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed italic">"{review.comment}"</p>
              </div>
            ))}
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
