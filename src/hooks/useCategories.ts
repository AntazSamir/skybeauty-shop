import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/woocommerce/api";

export const categoryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
  id: (id: number) => [...categoryKeys.all, "id", id] as const,
  slug: (slug: string) => [...categoryKeys.all, "slug", slug] as const,
};

/** Fetch all product categories */
export function useCategories(perPage = 100) {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => categoriesApi.getAll(perPage),
    staleTime: 1000 * 60 * 30, // Categories rarely change
  });
}

/** Fetch a single category by ID */
export function useCategoryById(id: number | undefined) {
  return useQuery({
    queryKey: categoryKeys.id(id ?? 0),
    queryFn: () => categoriesApi.getById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 30,
  });
}

/** Fetch a single category by slug */
export function useCategoryBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: categoryKeys.slug(slug ?? ""),
    queryFn: () => categoriesApi.getBySlug(slug!),
    enabled: !!slug,
    staleTime: 1000 * 60 * 30,
  });
}
