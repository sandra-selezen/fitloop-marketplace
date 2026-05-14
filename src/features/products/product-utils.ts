import { slugify } from "@/lib/utils";

export function createProductSlug(title: string) {
  const baseSlug = slugify(title);
  const suffix = crypto.randomUUID().slice(0, 8);

  return `${baseSlug}-${suffix}`;
}
