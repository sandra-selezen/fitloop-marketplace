export type DashboardListingStatus = "active" | "draft" | "sold" | "archived";

export const dashboardListings = [
  {
    id: "1",
    title: "Nike Dri-FIT Training Hoodie",
    brand: "Nike",
    price: 68,
    size: "M",
    condition: "New with tags",
    status: "active",
    views: 124,
    saves: 18,
    createdAt: "2026-05-10",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Adidas Ultraboost Running Shoes",
    brand: "Adidas",
    price: 112,
    size: "39",
    condition: "Like new",
    status: "draft",
    views: 0,
    saves: 0,
    createdAt: "2026-05-12",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "The North Face Wind Jacket",
    brand: "The North Face",
    price: 95,
    size: "L",
    condition: "Good",
    status: "sold",
    views: 210,
    saves: 34,
    createdAt: "2026-05-04",
    image:
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Lululemon Align Leggings",
    brand: "Lululemon",
    price: 74,
    size: "S",
    condition: "New without tags",
    status: "archived",
    views: 89,
    saves: 11,
    createdAt: "2026-04-28",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
  },
] satisfies {
  id: string;
  title: string;
  brand: string;
  price: number;
  size: string;
  condition: string;
  status: DashboardListingStatus;
  views: number;
  saves: number;
  createdAt: string;
  image: string;
}[];
