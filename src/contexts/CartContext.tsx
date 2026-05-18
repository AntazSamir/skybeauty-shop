/**
 * CartContext — WooCommerce-ready cart with localStorage persistence.
 * CartItem now maps directly from WCProduct for clean type safety.
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import type { WCProduct } from "@/lib/woocommerce/types";
import { getProductImage, formatPrice } from "@/lib/woocommerce/helpers";

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: WCProduct, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  formattedTotalPrice: string;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isInCart: (id: number) => boolean;
  getItemQuantity: (id: number) => number;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "skybd_cart";

// ─── Provider ─────────────────────────────────────────────────────────────────

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persist on change
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: WCProduct, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: parseFloat(product.price) || 0,
        image: getProductImage(product),
        quantity,
        stock_status: product.stock_status,
        sku: product.sku,
      };
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: number) =>
    setCartItems((prev) => prev.filter((item) => item.id !== id));

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCartItems([]);

  const isInCart = (id: number) => cartItems.some((item) => item.id === id);

  const getItemQuantity = (id: number) =>
    cartItems.find((item) => item.id === id)?.quantity ?? 0;

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        formattedTotalPrice: formatPrice(totalPrice),
        isCartOpen,
        setIsCartOpen,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
};
