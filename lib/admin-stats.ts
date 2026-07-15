import type { DashboardStats, Order, Product } from "./types";
import { getOfflineSaleProfit, getOfflineSaleRevenue } from "./types";
import { getOfflineSoldProducts } from "./products";

function offlineSaleTotals(products: Product[], orders: Order[]) {
  return getOfflineSoldProducts(products, orders).reduce(
    (acc, product) => ({
      revenue: acc.revenue + getOfflineSaleRevenue(product),
      profit: acc.profit + getOfflineSaleProfit(product),
    }),
    { revenue: 0, profit: 0 }
  );
}

export function getDashboardStats(
  products: Product[],
  orders: Order[]
): DashboardStats {
  const today = new Date().toISOString().split("T")[0];
  const ordersToday = orders.filter((o) =>
    o.createdAt.startsWith(today)
  ).length;

  const completedOrders = orders.filter(
    (o) => o.status === "Delivered" || o.status === "Shipped" || o.status === "Processing"
  );

  const orderRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const orderProfit = completedOrders.reduce((sum, order) => {
    const orderProfit = order.items.reduce(
      (itemSum, item) => itemSum + (item.discountPrice - item.purchasePrice),
      0
    );
    return sum + orderProfit;
  }, 0);

  const offline = offlineSaleTotals(products, orders);
  const totalRevenue = orderRevenue + offline.revenue;
  const totalProfit = orderProfit + offline.profit;

  const uniqueCustomers = new Set(
    orders.map((o) => o.customerId).filter((id): id is string => Boolean(id))
  ).size;
  const availablePieces = products.filter((p) => !p.isSold).length;

  return {
    totalRevenue,
    totalProfit,
    ordersToday,
    totalCustomers: uniqueCustomers,
    availablePieces,
  };
}

export function buildRevenueByDate(orders: Order[], products: Product[] = []) {
  const map = new Map<string, { revenue: number; profit: number; orders: number }>();

  orders
    .filter(
      (o) =>
        o.status === "Processing" ||
        o.status === "Shipped" ||
        o.status === "Delivered"
    )
    .forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const current = map.get(date) ?? { revenue: 0, profit: 0, orders: 0 };
      const profit = order.items.reduce(
        (sum, item) => sum + (item.discountPrice - item.purchasePrice),
        0
      );
      map.set(date, {
        revenue: current.revenue + order.total,
        profit: current.profit + profit,
        orders: current.orders + 1,
      });
    });

  getOfflineSoldProducts(products, orders).forEach((product) => {
    const date = new Date(product.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const current = map.get(date) ?? { revenue: 0, profit: 0, orders: 0 };
    map.set(date, {
      revenue: current.revenue + getOfflineSaleRevenue(product),
      profit: current.profit + getOfflineSaleProfit(product),
      orders: current.orders,
    });
  });

  return Array.from(map.entries())
    .map(([date, data]) => ({ date, ...data }))
    .slice(-14);
}

export function buildRevenueByBrand(orders: Order[], products: Product[] = []) {
  const map = new Map<string, { revenue: number; profit: number }>();

  orders
    .filter(
      (o) =>
        o.status === "Processing" ||
        o.status === "Shipped" ||
        o.status === "Delivered"
    )
    .forEach((order) => {
      order.items.forEach((item) => {
        const current = map.get(item.brand) ?? { revenue: 0, profit: 0 };
        map.set(item.brand, {
          revenue: current.revenue + item.discountPrice,
          profit: current.profit + (item.discountPrice - item.purchasePrice),
        });
      });
    });

  getOfflineSoldProducts(products, orders).forEach((product) => {
    const current = map.get(product.brand) ?? { revenue: 0, profit: 0 };
    map.set(product.brand, {
      revenue: current.revenue + getOfflineSaleRevenue(product),
      profit: current.profit + getOfflineSaleProfit(product),
    });
  });

  return Array.from(map.entries())
    .map(([brand, data]) => ({ brand, ...data }))
    .sort((a, b) => b.revenue - a.revenue);
}

export function getOfflineSalesTotals(products: Product[], orders: Order[]) {
  return offlineSaleTotals(products, orders);
}
