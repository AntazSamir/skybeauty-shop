import type { WCProduct } from "./types";

/** Strip HTML tags from WooCommerce description strings */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/** Format a WC price string to BDT display */
export function formatPrice(price: string | number): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(num)) return "৳0";
  return `৳${num.toLocaleString("en-BD")}`;
}

/** Get the primary image URL from a WC product */
export function getProductImage(product: WCProduct, fallback = "/placeholder-product.jpg"): string {
  return product.images?.[0]?.src ?? fallback;
}

/** Calculate the discount percentage between regular and sale price */
export function discountPercent(regular: string, sale: string): number | null {
  const r = parseFloat(regular);
  const s = parseFloat(sale);
  if (!r || !s || s >= r) return null;
  return Math.round(((r - s) / r) * 100);
}

/** Determine badge label for a product */
export function getProductBadge(product: WCProduct): string | null {
  if (product.on_sale) return "Sale";
  const createdDiff = Date.now() - new Date(product.meta_data?.find(m => m.key === "date_created")?.value ?? 0).getTime();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  if (createdDiff < sevenDays) return "New";
  if (product.featured) return "Featured";
  return null;
}

/** Check if a product is in stock */
export function isInStock(product: WCProduct): boolean {
  return product.stock_status === "instock";
}

/** Get stock label string */
export function stockLabel(product: WCProduct): string {
  if (product.stock_status === "outofstock") return "Out of Stock";
  if (product.stock_status === "onbackorder") return "On Backorder";
  if (product.manage_stock && product.stock_quantity !== null && product.stock_quantity < 5) {
    return `Only ${product.stock_quantity} left`;
  }
  return "In Stock";
}

/** Build a slug-safe URL path for a product */
export function productPath(slug: string): string {
  return `/product/${slug}`;
}

/** Apply coupon discount to a cart total */
export function applyCouponDiscount(
  subtotal: number,
  coupon: { discount_type: string; amount: string; free_shipping: boolean }
): { discounted: number; freeShipping: boolean } {
  const amount = parseFloat(coupon.amount);
  let discounted = subtotal;

  if (coupon.discount_type === "percent") {
    discounted = subtotal - (subtotal * amount) / 100;
  } else if (coupon.discount_type === "fixed_cart") {
    discounted = subtotal - amount;
  }

  return {
    discounted: Math.max(0, discounted),
    freeShipping: coupon.free_shipping,
  };
}

/** Truncate text to a max length with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}
