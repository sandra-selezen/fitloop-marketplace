import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email({ error: "Enter a valid email" })
    .min(1, { error: "Email is required" }),

  password: z.string().min(1, { error: "Password is required" }),
});

export const registerSchema = z
  .object({
    email: z
      .email({ error: "Enter a valid email" })
      .min(1, { error: "Email is required" }),

    password: z
      .string()
      .min(8, { error: "Password should be at least 8 characters" }),

    confirmPassword: z.string().min(1, { error: "Confirm your password" }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match",
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
