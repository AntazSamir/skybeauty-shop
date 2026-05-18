import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/lib/woocommerce/api";

export const orderKeys = {
  all: ["orders"] as const,
  customer: (id: number, page: number) => [...orderKeys.all, "customer", id, page] as const,
  single: (id: number) => [...orderKeys.all, "single", id] as const,
};

/** Fetch orders for a customer */
export function useCustomerOrders(customerId: number | undefined, page = 1) {
  return useQuery({
    queryKey: orderKeys.customer(customerId ?? 0, page),
    queryFn: () => ordersApi.getCustomerOrders(customerId!, page),
    enabled: !!customerId,
    staleTime: 1000 * 60 * 2, // Orders can change frequently
  });
}

/** Fetch a single order by ID */
export function useOrder(orderId: number | undefined) {
  return useQuery({
    queryKey: orderKeys.single(orderId ?? 0),
    queryFn: () => ordersApi.getById(orderId!),
    enabled: !!orderId,
    staleTime: 1000 * 60 * 2,
  });
}
