import {
  ClipboardList,
  LayoutDashboard,
  Package,
  Settings,
} from "lucide-react";

export const dashboardNavLinks = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My listings",
    href: "/dashboard/listings",
    icon: Package,
  },
  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: ClipboardList,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export const dashboardStats = [
  {
    label: "Active listings",
    value: "8",
    description: "Products currently visible in the marketplace",
  },
  {
    label: "Draft listings",
    value: "3",
    description: "Listings saved but not published yet",
  },
  {
    label: "Sold items",
    value: "12",
    description: "Items sold through FitLoop",
  },
  {
    label: "Orders",
    value: "5",
    description: "Recent purchases and checkout activity",
  },
];
