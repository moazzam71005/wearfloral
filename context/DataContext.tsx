"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";
import { mapDbProduct, productToDb } from "@/lib/db-mappers";
import { PRODUCT_IMAGE_BUCKET } from "@/lib/constants";
import type {
  CustomerWithStats,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  ProductInput,
} from "@/lib/types";

interface DataContextValue {
  products: Product[];
  allProducts: Product[];
  orders: Order[];
  customers: CustomerWithStats[];
  isLoading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  refreshCustomers: () => Promise<void>;
  addProduct: (data: ProductInput, imageFile: File) => Promise<void>;
  updateProduct: (
    id: string,
    data: Partial<ProductInput>,
    imageFile?: File
  ) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  placeOrder: (order: Omit<Order, "createdAt" | "updatedAt">) => Promise<void>;
  fetchCustomerOrders: (customerId: string) => Promise<Order[]>;
}

const DataContext = createContext<DataContextValue | null>(null);

function mapDbOrder(row: Record<string, unknown>): Order {
  const items = (row.order_items as Record<string, unknown>[] | null) ?? [];
  return {
    id: row.id as string,
    customerId: row.customer_id as string,
    customerName: row.customer_name as string,
    customerEmail: row.customer_email as string,
    customerPhone: row.customer_phone as string,
    shippingAddress: row.shipping_address as string,
    city: row.city as string,
    items: items.map(
      (item): OrderItem => ({
        productId: item.product_id as string,
        name: item.name as string,
        imageUrl: (item.image_url as string) ?? "",
        brand: (item.brand as string) ?? "",
        volume: (item.volume as string) ?? "",
        displayPrice: Number(item.display_price),
        discountPrice: Number(item.discount_price),
        purchasePrice: Number(item.purchase_price),
      })
    ),
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping_fee),
    total: Number(row.total),
    status: row.status as OrderStatus,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

async function uploadProductImage(file: File, productCode: string): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${productCode}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .upload(path, file, { upsert: true });
  if (error) throw error;
  return path;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const products = useMemo(
    () => allProducts.filter((p) => !p.isSold),
    [allProducts]
  );

  const refreshProducts = useCallback(async () => {
    const { data, error: err } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (err) throw err;
    setAllProducts((data ?? []).map(mapDbProduct));
  }, []);

  const refreshOrders = useCallback(async () => {
    const { data, error: err } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    if (err) throw err;
    setOrders((data ?? []).map(mapDbOrder));
  }, []);

  const refreshCustomers = useCallback(async () => {
    const { data: profiles, error: profileErr } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (profileErr) throw profileErr;

    const { data: allOrders } = await supabase
      .from("orders")
      .select("customer_id, total, status");

    const statsMap = new Map<string, { count: number; spent: number }>();
    (allOrders ?? []).forEach((o) => {
      const cid = o.customer_id as string;
      const current = statsMap.get(cid) ?? { count: 0, spent: 0 };
      if (o.status !== "Cancelled") {
        current.count += 1;
        current.spent += Number(o.total);
      }
      statsMap.set(cid, current);
    });

    setCustomers(
      (profiles ?? []).map((p) => {
        const stats = statsMap.get(p.id as string) ?? { count: 0, spent: 0 };
        return {
          id: p.id as string,
          name: p.name as string,
          phone: p.phone as string,
          address: p.address as string,
          city: p.city as string,
          createdAt: p.created_at as string,
          orderCount: stats.count,
          totalSpent: stats.spent,
        };
      })
    );
  }, []);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        await refreshProducts();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [refreshProducts]);

  const addProduct = useCallback(
    async (data: ProductInput, imageFile: File) => {
      const imagePath = await uploadProductImage(imageFile, data.productCode);
      const { error: err } = await supabase.from("products").insert(
        productToDb({ ...data, imagePath })
      );
      if (err) throw err;
      await refreshProducts();
    },
    [refreshProducts]
  );

  const updateProduct = useCallback(
    async (id: string, data: Partial<ProductInput>, imageFile?: File) => {
      let imagePath = data.imagePath;
      if (imageFile && data.productCode) {
        imagePath = await uploadProductImage(imageFile, data.productCode);
      }
      const updates = productToDb({
        productCode: data.productCode ?? "",
        name: data.name ?? "",
        brand: data.brand ?? "",
        volume: data.volume,
        description: data.description,
        imagePath,
        displayPrice: data.displayPrice ?? 0,
        discountPrice: data.discountPrice ?? 0,
        purchasePrice: data.purchasePrice ?? 0,
      });
      const { error: err } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id);
      if (err) throw err;
      await refreshProducts();
    },
    [refreshProducts]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      const product = allProducts.find((p) => p.id === id);
      const { error: err } = await supabase.from("products").delete().eq("id", id);
      if (err) throw err;
      if (product?.imagePath) {
        await supabase.storage
          .from(PRODUCT_IMAGE_BUCKET)
          .remove([product.imagePath]);
      }
      await refreshProducts();
    },
    [allProducts, refreshProducts]
  );

  const updateOrderStatus = useCallback(
    async (id: string, status: OrderStatus) => {
      const { error: err } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id);
      if (err) throw err;
      await refreshOrders();
    },
    [refreshOrders]
  );

  const placeOrder = useCallback(
    async (order: Omit<Order, "createdAt" | "updatedAt">) => {
      const { error: orderErr } = await supabase.from("orders").insert({
        id: order.id,
        customer_id: order.customerId,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        customer_phone: order.customerPhone,
        shipping_address: order.shippingAddress,
        city: order.city,
        subtotal: order.subtotal,
        shipping_fee: order.shipping,
        total: order.total,
        status: order.status,
      });
      if (orderErr) throw orderErr;

      const orderItems = order.items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        name: item.name,
        image_url: item.imageUrl,
        brand: item.brand,
        volume: item.volume,
        display_price: item.displayPrice,
        discount_price: item.discountPrice,
        purchase_price: item.purchasePrice,
      }));

      const { error: itemsErr } = await supabase
        .from("order_items")
        .insert(orderItems);
      if (itemsErr) throw itemsErr;

      const productIds = order.items.map((i) => i.productId);
      const { error: soldErr } = await supabase
        .from("products")
        .update({ is_sold: true })
        .in("id", productIds);
      if (soldErr) throw soldErr;

      await refreshProducts();
      await refreshOrders();
    },
    [refreshProducts, refreshOrders]
  );

  const fetchCustomerOrders = useCallback(async (customerId: string) => {
    const { data, error: err } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });
    if (err) throw err;
    return (data ?? []).map(mapDbOrder);
  }, []);

  const value = useMemo(
    () => ({
      products,
      allProducts,
      orders,
      customers,
      isLoading,
      error,
      refreshProducts,
      refreshOrders,
      refreshCustomers,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      placeOrder,
      fetchCustomerOrders,
    }),
    [
      products,
      allProducts,
      orders,
      customers,
      isLoading,
      error,
      refreshProducts,
      refreshOrders,
      refreshCustomers,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      placeOrder,
      fetchCustomerOrders,
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
