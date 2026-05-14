export type DashboardOrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "completed"
  | "cancelled";

export const dashboardOrders = [
  {
    id: "FL-1004",
    date: "2026-05-13",
    status: "completed",
    total: 180,
    itemsCount: 2,
    customerName: "Mia Anderson",
    deliveryMethod: "Standard delivery",
    items: ["Nike Dri-FIT Training Hoodie", "Adidas Ultraboost Running Shoes"],
  },
  {
    id: "FL-1003",
    date: "2026-05-11",
    status: "shipped",
    total: 95,
    itemsCount: 1,
    customerName: "Laura Bennett",
    deliveryMethod: "Express delivery",
    items: ["The North Face Wind Jacket"],
  },
  {
    id: "FL-1002",
    date: "2026-05-08",
    status: "paid",
    total: 74,
    itemsCount: 1,
    customerName: "Sofia Miller",
    deliveryMethod: "Pickup",
    items: ["Lululemon Align Leggings"],
  },
  {
    id: "FL-1001",
    date: "2026-05-03",
    status: "cancelled",
    total: 48,
    itemsCount: 1,
    customerName: "Emma Wilson",
    deliveryMethod: "Standard delivery",
    items: ["Training Shorts"],
  },
] satisfies {
  id: string;
  date: string;
  status: DashboardOrderStatus;
  total: number;
  itemsCount: number;
  customerName: string;
  deliveryMethod: string;
  items: string[];
}[];
