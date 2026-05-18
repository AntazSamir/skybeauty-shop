import { useQuery } from "@tanstack/react-query";
import { reviewsApi } from "@/lib/woocommerce/api";

export function useProductReviews(productId: number | undefined) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => reviewsApi.getForProduct(productId!),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
  });
}
