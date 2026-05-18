import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/woocommerce/api";
import type { ProductQueryParams, WCProduct } from "@/lib/woocommerce/types";

// Query key factory for cache consistency
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params: ProductQueryParams) => [...productKeys.lists(), params] as const,
  slug: (slug: string) => [...productKeys.all, "slug", slug] as const,
  id: (id: number) => [...productKeys.all, "id", id] as const,
  newArrivals: (limit: number) => [...productKeys.all, "new-arrivals", limit] as const,
  featured: (limit: number) => [...productKeys.all, "featured", limit] as const,
  onSale: (limit: number) => [...productKeys.all, "on-sale", limit] as const,
  byIds: (ids: number[]) => [...productKeys.all, "by-ids", ids.sort().join(",")] as const,
  search: (q: string) => [...productKeys.all, "search", q] as const,
};

/** Fetch paginated products with filters */
export function useProducts(params: ProductQueryParams = {}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productsApi.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (prev) => prev,
  });
}

/** Infinite scroll / load more products */
export function useInfiniteProducts(params: Omit<ProductQueryParams, "page"> = {}) {
  return useInfiniteQuery({
    queryKey: [...productKeys.lists(), "infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      productsApi.getAll({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const nextPage = (lastPageParam as number) + 1;
      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
}

/** Fetch a single product by slug */
export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: productKeys.slug(slug ?? ""),
    queryFn: () => productsApi.getBySlug(slug!),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  });
}

/** Fetch a single product by numeric ID */
export function useProductById(id: number | undefined) {
  return useQuery({
    queryKey: productKeys.id(id ?? 0),
    queryFn: () => productsApi.getById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
}

/** Fetch new arrivals */
export function useNewArrivals(limit = 8) {
  return useQuery({
    queryKey: productKeys.newArrivals(limit),
    queryFn: () => productsApi.getNewArrivals(limit),
    staleTime: 1000 * 60 * 10,
  });
}

/** Fetch featured products */
export function useFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: productKeys.featured(limit),
    queryFn: () => productsApi.getFeatured(limit),
    staleTime: 1000 * 60 * 10,
  });
}

/** Fetch on-sale products */
export function useOnSaleProducts(limit = 8) {
  return useQuery({
    queryKey: productKeys.onSale(limit),
    queryFn: () => productsApi.getOnSale(limit),
    staleTime: 1000 * 60 * 10,
  });
}

/** Fetch multiple products by IDs (e.g. related products) */
export function useProductsByIds(ids: number[]) {
  return useQuery({
    queryKey: productKeys.byIds(ids),
    queryFn: () => productsApi.getByIds(ids),
    enabled: ids.length > 0,
    staleTime: 1000 * 60 * 10,
  });
}

/** Search products */
export function useProductSearch(query: string, limit = 20) {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => productsApi.search(query, limit),
    enabled: query.trim().length > 1,
    staleTime: 1000 * 30,
  });
}

/** Derived helper: get products from a paginated response */
export function flattenProducts(pages: { data: WCProduct[] }[]): WCProduct[] {
  return pages.flatMap((p) => p.data);
}
