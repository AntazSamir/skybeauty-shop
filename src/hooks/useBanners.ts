import { useQuery } from "@tanstack/react-query";
import { bannersApi } from "@/lib/woocommerce/api";

export function useBanners() {
  return useQuery({
    queryKey: ["banners"],
    queryFn: () => bannersApi.getAll(),
    staleTime: 1000 * 60 * 15, // 15 minutes — banners rarely change
    retry: 1,
  });
}
