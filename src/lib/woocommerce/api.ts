/**
 * WooCommerce API Client
 *
 * Handles all communication with the WooCommerce REST API v3.
 * Consumer key/secret are passed as query params (no server proxy needed
 * for read operations). Write operations use JWT bearer tokens for
 * customer-scoped requests.
 */

const WC_BASE = (import.meta.env.VITE_WC_BASE_URL || import.meta.env.VITE_WC_URL) as string;
const WP_API = (import.meta.env.VITE_WP_API_URL || `${import.meta.env.VITE_WC_BASE_URL || import.meta.env.VITE_WC_URL}/wp-json`) as string;
const CK = (import.meta.env.VITE_WC_CONSUMER_KEY || import.meta.env.VITE_WC_KEY) as string;
const CS = (import.meta.env.VITE_WC_CONSUMER_SECRET || import.meta.env.VITE_WC_SECRET) as string;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build a full WC REST URL with consumer key auth appended */
function wcUrl(path: string, params: Record<string, string | number | boolean | undefined> = {}): string {
  const url = new URL(`${WC_BASE}/wp-json/wc/v3${path}`);
  url.searchParams.set("consumer_key", CK);
  url.searchParams.set("consumer_secret", CS);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, String(v));
    }
  });
  return url.toString();
}

/** Build a WordPress REST URL */
function wpUrl(path: string): string {
  return `${WP_API}${path}`;
}

/** Get JWT from localStorage */
function getToken(): string | null {
  return localStorage.getItem("wc_jwt");
}

/** Auth headers for customer-scoped requests */
function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

/** Fetch with error handling — throws a typed error */
async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    let message = `API Error ${res.status}`;
    try {
      const errBody = await res.json();
      message = errBody?.message || errBody?.error || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

// ─── Products ─────────────────────────────────────────────────────────────────

import type {
  WCProduct,
  WCCategory,
  WCOrder,
  WCOrderPayload,
  WPAuthResponse,
  WCCustomer,
  WCBanner,
  ProductQueryParams,
  PaginatedResponse,
} from "./types";

export const productsApi = {
  /** Fetch paginated products with optional filters */
  async getAll(params: ProductQueryParams = {}): Promise<PaginatedResponse<WCProduct>> {
    const url = wcUrl("/products", {
      page: params.page ?? 1,
      per_page: params.per_page ?? 20,
      search: params.search,
      category: params.category,
      tag: params.tag,
      orderby: params.orderby ?? "date",
      order: params.order ?? "desc",
      on_sale: params.on_sale,
      featured: params.featured,
      min_price: params.min_price,
      max_price: params.max_price,
      stock_status: params.stock_status,
    });

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);

    const data: WCProduct[] = await res.json();
    const totalItems = parseInt(res.headers.get("X-WP-Total") ?? "0", 10);
    const totalPages = parseInt(res.headers.get("X-WP-TotalPages") ?? "1", 10);

    return { data, totalItems, totalPages };
  },

  /** Fetch a single product by slug */
  async getBySlug(slug: string): Promise<WCProduct | null> {
    const url = wcUrl("/products", { slug, per_page: 1 });
    const data = await apiFetch<WCProduct[]>(url);
    return data[0] ?? null;
  },

  /** Fetch a single product by ID */
  async getById(id: number): Promise<WCProduct> {
    const url = wcUrl(`/products/${id}`);
    return apiFetch<WCProduct>(url);
  },

  /** Fetch new arrivals (latest products) */
  async getNewArrivals(limit = 8): Promise<WCProduct[]> {
    const url = wcUrl("/products", { per_page: limit, orderby: "date", order: "desc" });
    return apiFetch<WCProduct[]>(url);
  },

  /** Fetch featured products */
  async getFeatured(limit = 8): Promise<WCProduct[]> {
    const url = wcUrl("/products", { per_page: limit, featured: true });
    return apiFetch<WCProduct[]>(url);
  },

  /** Fetch on-sale products */
  async getOnSale(limit = 8): Promise<WCProduct[]> {
    const url = wcUrl("/products", { per_page: limit, on_sale: true });
    return apiFetch<WCProduct[]>(url);
  },

  /** Fetch related products by product IDs */
  async getByIds(ids: number[]): Promise<WCProduct[]> {
    if (!ids.length) return [];
    const url = wcUrl("/products", { include: ids.join(","), per_page: ids.length } as Record<string, string | number | boolean>);
    return apiFetch<WCProduct[]>(url);
  },

  /** Search products */
  async search(query: string, limit = 20): Promise<WCProduct[]> {
    const url = wcUrl("/products", { search: query, per_page: limit });
    return apiFetch<WCProduct[]>(url);
  },
};

// ─── Categories ───────────────────────────────────────────────────────────────

export const categoriesApi = {
  async getAll(perPage = 100): Promise<WCCategory[]> {
    const url = wcUrl("/products/categories", { per_page: perPage, orderby: "name", hide_empty: true });
    return apiFetch<WCCategory[]>(url);
  },

  async getById(id: number): Promise<WCCategory> {
    const url = wcUrl(`/products/categories/${id}`);
    return apiFetch<WCCategory>(url);
  },

  async getBySlug(slug: string): Promise<WCCategory | null> {
    const url = wcUrl("/products/categories", { slug, per_page: 1 });
    const data = await apiFetch<WCCategory[]>(url);
    return data[0] ?? null;
  },
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export const ordersApi = {
  /** Place a new order (guest or authenticated) */
  async create(payload: WCOrderPayload): Promise<WCOrder> {
    const url = wcUrl("/orders");
    return apiFetch<WCOrder>(url, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
  },

  /** Get orders for a customer (requires auth) */
  async getCustomerOrders(customerId: number, page = 1): Promise<WCOrder[]> {
    const url = wcUrl("/orders", { customer: customerId, per_page: 20, page });
    return apiFetch<WCOrder[]>(url, { headers: authHeaders() });
  },

  /** Get a single order by ID */
  async getById(orderId: number): Promise<WCOrder> {
    const url = wcUrl(`/orders/${orderId}`);
    return apiFetch<WCOrder>(url, { headers: authHeaders() });
  },
};

// ─── Coupons ──────────────────────────────────────────────────────────────────

export const couponsApi = {
  /** Validate and retrieve coupon by code */
  async validate(code: string) {
    const url = wcUrl("/coupons", { code, per_page: 1 });
    const data = await apiFetch<{ id: number; code: string; discount_type: string; amount: string; free_shipping: boolean; minimum_amount: string; usage_count: number; usage_limit: number | null }[]>(url);
    if (!data || data.length === 0) throw new Error("Coupon not found or invalid.");
    const coupon = data[0];
    if (coupon.usage_limit !== null && coupon.usage_count >= coupon.usage_limit) {
      throw new Error("This coupon has reached its usage limit.");
    }
    return coupon;
  },
};

// ─── Auth (JWT via WordPress) ─────────────────────────────────────────────────

export const authApi = {
  /**
   * Login using JWT Authentication plugin.
   * Plugin: "JWT Authentication for WP-API" must be installed & configured.
   */
  async login(username: string, password: string): Promise<WPAuthResponse> {
    return apiFetch<WPAuthResponse>(wpUrl("/jwt-auth/v1/token"), {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },

  /** Validate an existing JWT token */
  async validateToken(token: string): Promise<boolean> {
    try {
      await apiFetch<{ code: string; data: { status: number } }>(
        wpUrl("/jwt-auth/v1/token/validate"),
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      return true;
    } catch {
      return false;
    }
  },

  /** Register a new WordPress/WooCommerce customer */
  async register(email: string, password: string, firstName: string, lastName: string): Promise<WCCustomer> {
    const url = wcUrl("/customers");
    return apiFetch<WCCustomer>(url, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        username: email,
      }),
    });
  },
};

// ─── Customers ────────────────────────────────────────────────────────────────

export const customersApi = {
  async getById(id: number): Promise<WCCustomer> {
    const url = wcUrl(`/customers/${id}`);
    return apiFetch<WCCustomer>(url, { headers: authHeaders() });
  },

  async update(id: number, data: Partial<WCCustomer>): Promise<WCCustomer> {
    const url = wcUrl(`/customers/${id}`);
    return apiFetch<WCCustomer>(url, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
  },
};

// ─── Banners / Sliders ────────────────────────────────────────────────────────
// Uses a custom WordPress REST endpoint powered by ACF or a custom plugin.
// Install "Custom Post Type UI" + "Advanced Custom Fields" on WordPress.
// Register a custom post type "banner" with fields: image, subtitle, link, button_text, active

export const bannersApi = {
  async getAll(): Promise<WCBanner[]> {
    try {
      // Try custom REST endpoint first (e.g. from ACF or custom plugin)
      const data = await apiFetch<WCBanner[]>(wpUrl("/skybeauty/v1/banners"));
      return data.filter((b) => b.active);
    } catch {
      // Fallback: empty array (will use local assets as fallback)
      return [];
    }
  },
};

// ─── Product Reviews ──────────────────────────────────────────────────────────

export interface WCReview {
  id: number;
  date_created: string;
  product_id: number;
  reviewer: string;
  reviewer_email: string;
  review: string;
  rating: number;
  verified: boolean;
  reviewer_avatar_urls: Record<string, string>;
}

export const reviewsApi = {
  async getForProduct(productId: number): Promise<WCReview[]> {
    const url = wcUrl("/products/reviews", { product: productId, per_page: 20 });
    return apiFetch<WCReview[]>(url);
  },

  async create(productId: number, reviewer: string, email: string, review: string, rating: number): Promise<WCReview> {
    const url = wcUrl("/products/reviews");
    return apiFetch<WCReview>(url, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ product_id: productId, reviewer, reviewer_email: email, review, rating }),
    });
  },
};
