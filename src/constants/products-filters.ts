export const productFilterCategories = [
  { value: "clothing", label: "Clothing" },
  { value: "shoes", label: "Shoes" },
  { value: "accessories", label: "Accessories" },
  { value: "running", label: "Running" },
  { value: "training", label: "Training" },
  { value: "yoga", label: "Yoga" },
  { value: "outdoor", label: "Outdoor" },
  { value: "cycling", label: "Cycling" },
] as const;

export const productFilterTypes = [
  { value: "new", label: "New" },
  { value: "pre_owned", label: "Pre-owned" },
] as const;

export const productFilterSizes = [
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
] as const;

export const productSortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
] as const;
