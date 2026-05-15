import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { EditListingView } from "@/features/products/components/EditListingView";

interface EditListingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: "Edit listing | FitLoop",
  description: "Edit your FitLoop product listing.",
};

export default async function EditListingPage({
  params,
}: EditListingPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?next=/dashboard/listings/${id}/edit`);
  }

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
        id,
        title,
        slug,
        description,
        category,
        brand,
        product_type,
        condition,
        size,
        color,
        gender,
        price,
        location,
        status,
        seller_id
      `,
    )
    .eq("id", id)
    .eq("seller_id", user.id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <EditListingView
      product={{
        id: product.id,
        title: product.title,
        slug: product.slug,
        description: product.description,
        category: product.category,
        brand: product.brand,
        product_type: product.product_type,
        condition: product.condition,
        size: product.size,
        color: product.color,
        gender: product.gender,
        price: Number(product.price),
        location: product.location,
        status: product.status,
      }}
    />
  );
}
