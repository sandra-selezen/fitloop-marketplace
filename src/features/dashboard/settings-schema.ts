import { z } from "zod";

export const profileSettingsSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { error: "Full name should be at least 2 characters" })
    .max(80, { error: "Full name should be less than 80 characters" }),

  username: z
    .string()
    .trim()
    .min(3, { error: "Username should be at least 3 characters" })
    .max(30, { error: "Username should be less than 30 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      error: "Username can contain only letters, numbers, and underscores",
    }),

  location: z
    .string()
    .trim()
    .min(2, { error: "Location is required" })
    .max(80, { error: "Location should be less than 80 characters" }),

  bio: z
    .string()
    .trim()
    .max(240, { error: "Bio should be less than 240 characters" })
    .optional(),
});

export type ProfileSettingsFormValues = z.infer<typeof profileSettingsSchema>;
