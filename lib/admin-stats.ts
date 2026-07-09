import type { DashboardStats, Order, Product } from "./types";

export function getDashboardStats(
  products: Product[],
  orders: Order[]
): DashboardStats {
  const today = new Date().toISOString().split("T")[0];
  const ordersToday = orders.filter((o) =>
    o.createdAt.startsWith(today)
  ).length;

  const completedOrders = orders.filter(
    (o) => o.status === "Delivered" || o.status === "Shipped"
  );

  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);

  const totalProfit = completedOrders.reduce((sum, order) => {
    const orderProfit = order.items.reduce(
      (itemSum, item) => itemSum + (item.discountPrice - item.purchasePrice),
      0
    );
    return sum + orderProfit;
  }, 0);

  const uniqueCustomers = new Set(orders.map((o) => o.customerId)).size;
  const availablePieces = products.filter((p) => !p.isSold).length;

  return {
    totalRevenue,
    totalProfit,
    ordersToday,
    totalCustomers: uniqueCustomers,
    availablePieces,
  };
}

export function buildRevenueByDate(orders: Order[]) {
  const map = new Map<string, { revenue: number; profit: number; orders: number }>();

  orders
    .filter((o) => o.status !== "Cancelled")
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

  return Array.from(map.entries())
    .map(([date, data]) => ({ date, ...data }))
    .slice(-14);
}

export function buildRevenueByBrand(orders: Order[]) {
  const map = new Map<string, { revenue: number; profit: number }>();

  orders
    .filter((o) => o.status !== "Cancelled")
    .forEach((order) => {
      order.items.forEach((item) => {
        const current = map.get(item.brand) ?? { revenue: 0, profit: 0 };
        map.set(item.brand, {
          revenue: current.revenue + item.discountPrice,
          profit: current.profit + (item.discountPrice - item.purchasePrice),
        });
      });
    });

  return Array.from(map.entries())
    .map(([brand, data]) => ({ brand, ...data }))
    .sort((a, b) => b.revenue - a.revenue);
}
