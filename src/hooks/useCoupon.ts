import { useState, useCallback } from "react";
import { couponsApi } from "@/lib/woocommerce/api";
import { applyCouponDiscount } from "@/lib/woocommerce/helpers";

interface CouponState {
  code: string;
  discount_type: string;
  amount: string;
  free_shipping: boolean;
}

interface UseCouponReturn {
  appliedCoupon: CouponState | null;
  couponCode: string;
  setCouponCode: (code: string) => void;
  applyCoupon: () => Promise<void>;
  removeCoupon: () => void;
  isValidating: boolean;
  error: string | null;
  getDiscountedTotal: (subtotal: number) => { discounted: number; freeShipping: boolean };
}

export function useCoupon(): UseCouponReturn {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponState | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyCoupon = useCallback(async () => {
    const code = couponCode.trim().toLowerCase();
    if (!code) {
      setError("Please enter a coupon code.");
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const coupon = await couponsApi.validate(code);
      setAppliedCoupon({
        code: coupon.code,
        discount_type: coupon.discount_type,
        amount: coupon.amount,
        free_shipping: coupon.free_shipping,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid coupon code.");
      setAppliedCoupon(null);
    } finally {
      setIsValidating(false);
    }
  }, [couponCode]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponCode("");
    setError(null);
  }, []);

  const getDiscountedTotal = useCallback(
    (subtotal: number) => {
      if (!appliedCoupon) return { discounted: subtotal, freeShipping: false };
      return applyCouponDiscount(subtotal, appliedCoupon);
    },
    [appliedCoupon]
  );

  return {
    appliedCoupon,
    couponCode,
    setCouponCode,
    applyCoupon,
    removeCoupon,
    isValidating,
    error,
    getDiscountedTotal,
  };
}
