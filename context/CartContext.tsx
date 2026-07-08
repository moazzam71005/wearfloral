"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem } from "@/lib/types";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (
    productId: string,
    size: string,
    color: string
  ) => void;
  updateQuantity: (
    productId: string,
    size: string,
    color: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = "wearfloral-cart";

function getItemKey(productId: string, size: string, color: string) {
  return `${productId}-${size}-${color}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          getItemKey(i.productId, i.size, i.color) ===
          getItemKey(item.productId, item.size, item.color)
      );
      if (existing) {
        return prev.map((i) =>
          getItemKey(i.productId, i.size, i.color) ===
          getItemKey(item.productId, item.size, item.color)
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback(
    (productId: string, size: string, color: string) => {
      setItems((prev) =>
        prev.filter(
          (i) =>
            getItemKey(i.productId, i.size, i.color) !==
            getItemKey(productId, size, color)
        )
      );
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: string, size: string, color: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, size, color);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          getItemKey(i.productId, i.size, i.color) ===
          getItemKey(productId, size, color)
            ? { ...i, quantity }
            : i
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }),
    [
      items,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isOpen,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
