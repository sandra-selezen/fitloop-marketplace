export const mockProducts = [
  {
    id: "1",
    title: "Nike Dri-FIT Training Hoodie",
    brand: "Nike",
    price: 68,
    category: "Clothing",
    productType: "New",
    condition: "New with tags",
    size: "M",
    color: "Coral",
    location: "Tallinn, Estonia",
    seller: {
      name: "Emma Sportswear",
      rating: 4.8,
      listingsCount: 24,
    },
    description:
      "Lightweight Nike Dri-FIT hoodie designed for training, warm-ups, and everyday activewear. Soft fabric, relaxed fit, and breathable feel.",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578681994506-b8f463449011?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    id: "2",
    title: "Adidas Ultraboost Running Shoes",
    brand: "Adidas",
    price: 112,
    category: "Shoes",
    productType: "Pre-owned",
    condition: "Like new",
    size: "39",
    color: "Red",
    location: "Riga, Latvia",
    seller: {
      name: "RunLab",
      rating: 4.9,
      listingsCount: 18,
    },
    description:
      "Comfortable Adidas Ultraboost running shoes with responsive cushioning. Lightly worn, clean, and perfect for daily runs or casual outfits.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    id: "3",
    title: "Lululemon Align Leggings",
    brand: "Lululemon",
    price: 74,
    category: "Training",
    productType: "New",
    condition: "New without tags",
    size: "S",
    color: "Black",
    location: "Tallinn, Estonia",
    seller: {
      name: "Active Closet",
      rating: 4.7,
      listingsCount: 31,
    },
    description:
      "Soft high-rise leggings for yoga, pilates, and training. Stretchy, comfortable, and easy to style with oversized hoodies or training tops.",
    image:
      "https://images.unsplash.com/photo-1506629905607-d405b7a30db9?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1506629905607-d405b7a30db9?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    id: "4",
    title: "The North Face Wind Jacket",
    brand: "The North Face",
    price: 95,
    category: "Outdoor",
    productType: "Pre-owned",
    condition: "Good",
    size: "L",
    color: "Blue",
    location: "Helsinki, Finland",
    seller: {
      name: "Nordic Gear",
      rating: 4.6,
      listingsCount: 12,
    },
    description:
      "Lightweight wind jacket for outdoor activities, cycling, hiking, and daily wear. Pre-owned condition with minor signs of use.",
    image:
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542295669297-4d352b042bca?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=1200&auto=format&fit=crop",
    ],
  },
];

export type MockProduct = (typeof mockProducts)[number];

export const categories = [
  "All",
  "Clothing",
  "Shoes",
  "Accessories",
  "Running",
  "Training",
  "Yoga",
  "Outdoor",
  "Cycling",
];

export const productCategories = [
  {
    value: "clothing",
    label: "Clothing",
  },
  {
    value: "shoes",
    label: "Shoes",
  },
  {
    value: "accessories",
    label: "Accessories",
  },
  {
    value: "running",
    label: "Running",
  },
  {
    value: "training",
    label: "Training",
  },
  {
    value: "yoga",
    label: "Yoga",
  },
  {
    value: "outdoor",
    label: "Outdoor",
  },
  {
    value: "cycling",
    label: "Cycling",
  },
] as const;

export const productTypes = [
  {
    value: "new",
    label: "New",
  },
  {
    value: "pre_owned",
    label: "Pre-owned",
  },
] as const;

export type ProductType = "new" | "pre_owned";

export const sizes = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
];

export const productGenders = [
  {
    value: "women",
    label: "Women",
  },
  {
    value: "men",
    label: "Men",
  },
  {
    value: "unisex",
    label: "Unisex",
  },
] as const;

export const productConditions: {
  value: "new_with_tags" | "new_without_tags" | "like_new" | "good" | "fair";
  label: string;
  productTypes: ProductType[];
}[] = [
  {
    value: "new_with_tags",
    label: "New with tags",
    productTypes: ["new"],
  },
  {
    value: "new_without_tags",
    label: "New without tags",
    productTypes: ["new"],
  },
  {
    value: "like_new",
    label: "Like new",
    productTypes: ["pre_owned"],
  },
  {
    value: "good",
    label: "Good",
    productTypes: ["pre_owned"],
  },
  {
    value: "fair",
    label: "Fair",
    productTypes: ["pre_owned"],
  },
];
