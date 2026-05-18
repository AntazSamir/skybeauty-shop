// ─── WooCommerce Core Types ───────────────────────────────────────────────────

export interface WCImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface WCCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  image: WCImage | null;
  count: number;
}

export interface WCTag {
  id: number;
  name: string;
  slug: string;
}

export interface WCProductAttribute {
  id: number;
  name: string;
  options: string[];
  variation: boolean;
  visible: boolean;
}

export interface WCProductVariation {
  id: number;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_status: string;
  stock_quantity: number | null;
  attributes: { id: number; name: string; option: string }[];
  image: WCImage | null;
}

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: "simple" | "variable" | "grouped" | "external";
  status: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  stock_status: "instock" | "outofstock" | "onbackorder";
  stock_quantity: number | null;
  manage_stock: boolean;
  categories: Pick<WCCategory, "id" | "name" | "slug">[];
  tags: WCTag[];
  images: WCImage[];
  attributes: WCProductAttribute[];
  variations: number[];
  average_rating: string;
  rating_count: number;
  related_ids: number[];
  meta_data: { key: string; value: string }[];
}

// ─── Cart Types ───────────────────────────────────────────────────────────────

export interface CartItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  stock_status: string;
  sku: string;
}

// ─── Order Types ──────────────────────────────────────────────────────────────

export interface WCOrderLineItem {
  product_id: number;
  variation_id?: number;
  quantity: number;
  name?: string;
}

export interface WCBilling {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface WCOrderPayload {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: WCBilling;
  shipping: Omit<WCBilling, "email" | "phone">;
  line_items: WCOrderLineItem[];
  shipping_lines: { method_id: string; method_title: string; total: string }[];
  coupon_lines?: { code: string }[];
  meta_data?: { key: string; value: string }[];
}

export interface WCOrder {
  id: number;
  status: string;
  number: string;
  date_created: string;
  total: string;
  line_items: {
    id: number;
    name: string;
    product_id: number;
    quantity: number;
    price: number;
    image: WCImage;
  }[];
  billing: WCBilling;
  payment_method_title: string;
  shipping_total: string;
  discount_total: string;
}

// ─── Coupon Types ─────────────────────────────────────────────────────────────

export interface WCCoupon {
  id: number;
  code: string;
  discount_type: "percent" | "fixed_cart" | "fixed_product";
  amount: string;
  free_shipping: boolean;
  minimum_amount: string;
  maximum_amount: string;
}

// ─── Auth / Customer Types ────────────────────────────────────────────────────

export interface WPAuthResponse {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
}

export interface WCCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  avatar_url: string;
  billing: WCBilling;
  shipping: Omit<WCBilling, "email" | "phone">;
  orders_count: number;
  total_spent: string;
  date_created: string;
}

export interface AuthUser {
  id: number;
  token: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

// ─── Banner / Slider Types ────────────────────────────────────────────────────

export interface WCBanner {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  link: string;
  button_text?: string;
  active: boolean;
}

// ─── Product Query Params ─────────────────────────────────────────────────────

export interface ProductQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  category?: number | string;
  tag?: number;
  orderby?: "date" | "popularity" | "rating" | "price" | "title";
  order?: "asc" | "desc";
  on_sale?: boolean;
  featured?: boolean;
  min_price?: string;
  max_price?: string;
  stock_status?: "instock" | "outofstock";
}

// ─── API Response Wrapper ─────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
}
