import { z } from "zod";

export const createListingSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, { error: "Title should be at least 5 characters" })
    .max(80, { error: "Title should be less than 80 characters" }),

  description: z
    .string()
    .trim()
    .min(20, { error: "Description should be at least 20 characters" })
    .max(1000, { error: "Description should be less than 1000 characters" }),

  category: z.enum([
    "clothing",
    "shoes",
    "accessories",
    "running",
    "training",
    "yoga",
    "outdoor",
    "cycling",
  ]),

  brand: z
    .string()
    .trim()
    .min(2, { error: "Brand is required" })
    .max(50, { error: "Brand should be less than 50 characters" }),

  productType: z.enum(["new", "pre_owned"]),

  condition: z.enum([
    "new_with_tags",
    "new_without_tags",
    "like_new",
    "good",
    "fair",
  ]),

  size: z.string().min(1, { error: "Size is required" }),

  color: z
    .string()
    .trim()
    .min(2, { error: "Color is required" })
    .max(30, { error: "Color should be less than 30 characters" }),

  gender: z.enum(["women", "men", "unisex"]),

  price: z.coerce
    .number()
    .min(1, { error: "Price should be at least €1" })
    .max(10000, { error: "Price is too high" }),

  location: z
    .string()
    .trim()
    .min(2, { error: "Location is required" })
    .max(80, { error: "Location should be less than 80 characters" }),
});

export type CreateListingFormInput = z.input<typeof createListingSchema>;
export type CreateListingFormValues = z.output<typeof createListingSchema>;
