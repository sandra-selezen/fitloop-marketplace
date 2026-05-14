import { z } from "zod";

export const checkoutSchema = z.object({
  email: z
    .email({ error: "Enter a valid email" })
    .min(1, { error: "Email is required" }),

  phone: z.string().trim().min(6, { error: "Phone number is required" }),

  firstName: z.string().trim().min(2, { error: "First name is required" }),
  lastName: z.string().trim().min(2, { error: "Last name is required" }),

  country: z.string().trim().min(2, { error: "Country is required" }),
  city: z.string().trim().min(2, { error: "City is required" }),
  address: z.string().trim().min(5, { error: "Address is required" }),
  postalCode: z
    .string()
    .trim()
    .min(3, { error: "Postal code is required" })
    .max(12, { error: "Postal code is too long" })
    .regex(/^[A-Za-z0-9\s-]+$/, {
      error: "Enter a valid postal code",
    }),

  deliveryMethod: z.enum(["standard", "express", "pickup"]),
  paymentMethod: z.enum(["demo_card"]),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
