/**
 * ProductDetail — Dynamic product page powered by WooCommerce REST API.
 * Fetches product by slug, shows gallery, ratings, reviews, add-to-cart,
 * and related products.
 */

import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag, Heart, ChevronRight, Star, Minus, Plus,
  Share2, Truck, RotateCcw, ShieldCheck, ZoomIn, Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProduct, useProductsByIds } from "@/hooks/useProducts";
import { useProductReviews } from "@/hooks/useReviews";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  formatPrice, stripHtml, productPath,
  discountPercent, isInStock, stockLabel,
} from "@/lib/woocommerce/helpers";

const StarRating = ({ rating, count }: { rating: number; count: number }) => (
  <div className="flex items-center gap-2">
    <div className="flex">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}
        />
      ))}
    </div>
    <span className="font-body text-xs text-muted-foreground">({count} reviews)</span>
  </div>
);

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: product, isLoading, error } = useProduct(slug);
  const { data: reviews } = useProductReviews(product?.id);
  const { data: relatedProducts } = useProductsByIds(product?.related_ids?.slice(0, 4) ?? []);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-2xl" />
              <div className="grid grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => <div key={i} className="aspect-square bg-muted rounded-lg" />)}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-10 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-8 bg-muted rounded w-1/4" />
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => <div key={i} className="h-3 bg-muted rounded" />)}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Error / Not Found ──
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Product Not Found</h2>
          <p className="font-body text-muted-foreground mb-8">
            This product may have been removed or the link is incorrect.
          </p>
          <Link to="/products">
            <Button>Browse All Products</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Derived values ──
  const images = product.images.length > 0 ? product.images : [{ id: 0, src: "/placeholder-product.jpg", alt: product.name, name: "" }];
  const price = parseFloat(product.price) || 0;
  const regularPrice = parseFloat(product.regular_price) || 0;
  const discount = discountPercent(product.regular_price, product.sale_price);
  const inStock = isInStock(product);
  const stockText = stockLabel(product);
  const avgRating = parseFloat(product.average_rating) || 0;
  const alreadyInCart = isInCart(product.id);
  const cartQty = getItemQuantity(product.id);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      });
      navigate("/login", { state: { from: `/product/${slug}` } });
      return;
    }
    if (!inStock) return;
    addToCart(product, quantity);
    toast({
      title: "Added to Cart!",
      description: `${product.name} (×${quantity}) added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-body text-muted-foreground mb-8 flex-wrap">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
          {product.categories?.[0] && (
            <>
              <ChevronRight size={12} />
              <Link
                to={`/products?category_id=${product.categories[0].id}&category=${product.categories[0].name}`}
                className="hover:text-foreground transition-colors"
              >
                {product.categories[0].name}
              </Link>
            </>
          )}
          <ChevronRight size={12} />
          <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* ── Image Gallery ── */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              className="relative aspect-square rounded-2xl overflow-hidden bg-muted cursor-zoom-in group"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={images[selectedImage]?.src}
                alt={images[selectedImage]?.alt || product.name}
                className={`w-full h-full object-cover transition-transform duration-500 ${isZoomed ? "scale-150" : "group-hover:scale-105"}`}
              />
              {discount && (
                <div className="absolute top-4 left-4">
                  <Badge className="font-body text-xs uppercase tracking-wider px-3 py-1">
                    -{discount}%
                  </Badge>
                </div>
              )}
              <div className="absolute top-4 right-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn size={15} className="text-slate-700" />
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === i ? "border-primary shadow-md" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img src={img.src} alt={img.alt || product.name} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="space-y-6">
            {/* Category */}
            {product.categories?.[0] && (
              <Link
                to={`/products?category_id=${product.categories[0].id}`}
                className="font-body text-[11px] font-bold tracking-[0.3em] text-primary uppercase hover:opacity-80 transition-opacity"
              >
                {product.categories[0].name}
              </Link>
            )}

            {/* Title */}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating_count > 0 && (
              <StarRating rating={avgRating} count={product.rating_count} />
            )}

            {/* SKU */}
            {product.sku && (
              <p className="font-body text-xs text-muted-foreground">SKU: <span className="font-semibold">{product.sku}</span></p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="font-display text-4xl font-bold text-foreground">{formatPrice(price)}</span>
              {product.on_sale && regularPrice > price && (
                <>
                  <span className="font-body text-xl text-muted-foreground line-through">{formatPrice(regularPrice)}</span>
                  <span className="font-body text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    Save {formatPrice(regularPrice - price)}
                  </span>
                </>
              )}
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${inStock ? "bg-green-500" : "bg-red-400"}`} />
              <span className={`font-body text-sm font-semibold ${inStock ? "text-green-700" : "text-red-600"}`}>
                {stockText}
              </span>
            </div>

            {/* Short Description */}
            {product.short_description && (
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {stripHtml(product.short_description)}
              </p>
            )}

            <Separator />

            {/* Quantity + Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {/* Quantity selector */}
                <div className="flex items-center border border-border rounded-lg overflow-hidden h-12">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 h-full hover:bg-muted transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-display font-bold text-base">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-4 h-full hover:bg-muted transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {alreadyInCart && (
                  <span className="font-body text-xs text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {cartQty} in cart
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="flex-1 h-14 font-body font-bold tracking-widest text-sm shadow-lg shadow-primary/20 gap-2"
                >
                  <ShoppingBag size={18} />
                  {inStock ? "ADD TO CART" : "OUT OF STOCK"}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className={`h-14 w-14 shrink-0 border-border transition-colors ${
                    isWishlisted ? "text-destructive border-destructive bg-destructive/5" : ""
                  }`}
                  onClick={() => setIsWishlisted((w) => !w)}
                  aria-label="Add to wishlist"
                >
                  <Heart size={20} className={isWishlisted ? "fill-destructive" : ""} />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 shrink-0 border-border"
                  onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
                  aria-label="Share product"
                >
                  <Share2 size={18} />
                </Button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              {[
                { icon: Truck, label: "Free delivery on orders over ৳1000" },
                { icon: RotateCcw, label: "7-day hassle-free returns" },
                { icon: ShieldCheck, label: "100% authentic & verified" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 text-center p-3 bg-muted/30 rounded-xl">
                  <Icon size={20} className="text-primary" />
                  <p className="font-body text-[10px] text-muted-foreground leading-tight">{label}</p>
                </div>
              ))}
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {product.tags.map((tag) => (
                  <span key={tag.id} className="font-body text-[10px] uppercase tracking-wider border border-border px-2.5 py-1 text-muted-foreground rounded-full hover:border-primary/50 transition-colors cursor-pointer">
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Details Tabs ── */}
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0 gap-0">
              {["description", "ingredients", "reviews"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="font-body text-xs uppercase tracking-widest font-bold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground pb-4 px-6 h-auto"
                >
                  {tab === "reviews" ? `Reviews (${product.rating_count})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="description" className="pt-8">
              <div
                className="prose prose-sm max-w-none font-body text-muted-foreground leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
                dangerouslySetInnerHTML={{ __html: product.description || "<p>No description available.</p>" }}
              />
            </TabsContent>

            <TabsContent value="ingredients" className="pt-8">
              {product.meta_data?.find((m) => m.key === "_ingredients")?.value ? (
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {product.meta_data.find((m) => m.key === "_ingredients")?.value}
                </p>
              ) : (
                <p className="font-body text-sm text-muted-foreground">
                  Ingredient information is not available for this product. Please refer to the product packaging.
                </p>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="pt-8">
              {reviews && reviews.length > 0 ? (
                <div className="space-y-6">
                  {/* Rating Summary */}
                  <div className="flex items-center gap-6 p-6 bg-muted/30 rounded-xl">
                    <div className="text-center">
                      <p className="font-display text-5xl font-bold text-foreground">{avgRating.toFixed(1)}</p>
                      <StarRating rating={avgRating} count={product.rating_count} />
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviews.filter((r) => r.rating === star).length;
                        const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-3">
                            <span className="font-body text-xs w-3">{star}</span>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="font-body text-xs text-muted-foreground w-6">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Individual reviews */}
                  {reviews.map((review) => (
                    <div key={review.id} className="flex gap-4 pb-6 border-b border-border last:border-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-display font-bold text-primary text-sm">
                        {review.reviewer[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-body font-semibold text-sm text-foreground">{review.reviewer}</p>
                          {review.verified && (
                            <span className="font-body text-[9px] uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-bold">Verified</span>
                          )}
                          <span className="font-body text-xs text-muted-foreground ml-auto">
                            {new Date(review.date_created).toLocaleDateString("en-BD", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                        <div className="flex mb-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={12} className={s <= review.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"} />
                          ))}
                        </div>
                        <div
                          className="font-body text-sm text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: review.review }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground font-body">
                  <Star className="mx-auto w-10 h-10 opacity-20 mb-3" />
                  <p>No reviews yet. Be the first to review this product!</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* ── Related Products ── */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((related) => (
                <Link
                  to={productPath(related.slug)}
                  key={related.id}
                  className="group bg-card border border-border hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={related.images?.[0]?.src}
                      alt={related.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-body text-[10px] uppercase tracking-widest text-primary font-bold mb-1">
                      {related.categories?.[0]?.name}
                    </p>
                    <h3 className="font-display text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {related.name}
                    </h3>
                    <p className="font-body text-sm font-bold text-foreground mt-2">{formatPrice(related.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
