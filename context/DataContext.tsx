"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  buildInventoryFromProducts,
  mockInventory,
  mockOrders,
  mockProducts,
} from "@/lib/mock-data";
import type {
  InventoryItem,
  Order,
  OrderStatus,
  Product,
} from "@/lib/types";

interface DataContextValue {
  products: Product[];
  orders: Order[];
  inventory: InventoryItem[];
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  addStock: (inventoryId: string, amount: number) => void;
  addOrder: (order: Order) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

const DATA_STORAGE_KEY = "wearfloral-data";

interface StoredData {
  products: Product[];
  orders: Order[];
  inventory: InventoryItem[];
}

function loadStoredData(): StoredData | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(DATA_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return null;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadStoredData();
    if (stored) {
      setProducts(stored.products);
      setOrders(stored.orders);
      setInventory(stored.inventory);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      DATA_STORAGE_KEY,
      JSON.stringify({ products, orders, inventory })
    );
  }, [products, orders, inventory, hydrated]);

  const syncInventory = useCallback((updatedProducts: Product[]) => {
    setInventory(buildInventoryFromProducts(updatedProducts));
  }, []);

  const addProduct = useCallback(
    (product: Omit<Product, "id" | "createdAt">) => {
      const newProduct: Product = {
        ...product,
        id: `prod-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => {
        const next = [...prev, newProduct];
        syncInventory(next);
        return next;
      });
    },
    [syncInventory]
  );

  const updateProduct = useCallback(
    (id: string, updates: Partial<Product>) => {
      setProducts((prev) => {
        const next = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
        syncInventory(next);
        return next;
      });
    },
    [syncInventory]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      setProducts((prev) => {
        const next = prev.filter((p) => p.id !== id);
        syncInventory(next);
        return next;
      });
    },
    [syncInventory]
  );

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, status, updatedAt: new Date().toISOString() }
          : o
      )
    );
  }, []);

  const addStock = useCallback((inventoryId: string, amount: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === inventoryId
          ? { ...item, stock: item.stock + amount }
          : item
      )
    );
    setProducts((prev) =>
      prev.map((p) => {
        const invItem = inventory.find((i) => i.id === inventoryId);
        if (invItem && invItem.productId === p.id) {
          return { ...p, stock: p.stock + amount };
        }
        return p;
      })
    );
  }, [inventory]);

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const value = useMemo(
    () => ({
      products,
      orders,
      inventory,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      addStock,
      addOrder,
    }),
    [
      products,
      orders,
      inventory,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      addStock,
      addOrder,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
}
