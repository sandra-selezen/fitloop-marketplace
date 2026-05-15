"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import {
  editListingSchema,
  type EditListingFormInput,
  type EditListingFormValues,
} from "@/features/products/edit-listing-schema";
import { createProductSlug } from "@/features/products/product-utils";
import { createClient } from "@/lib/supabase/client";
import {
  productCategories,
  productConditions,
  productGenders,
  productTypes,
  sizes,
} from "@/constants/products";

import { Button } from "@/components/ui/button";
import {
  FormInput,
  FormSection,
  FormSelect,
  FormTextarea,
} from "@/components/form/FormField";

interface EditListingViewProps {
  product: {
    id: string;
    title: string;
    slug: string;
    description: string;
    category: string;
    brand: string;
    product_type: "new" | "pre_owned";
    condition:
      | "new_with_tags"
      | "new_without_tags"
      | "like_new"
      | "good"
      | "fair";
    size: string;
    color: string;
    gender: "women" | "men" | "unisex";
    price: number;
    location: string;
    status: "active" | "draft" | "sold" | "archived";
  };
}

export function EditListingView({ product }: EditListingViewProps) {
  const router = useRouter();
  const supabase = createClient();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditListingFormInput, unknown, EditListingFormValues>({
    resolver: zodResolver(editListingSchema),
    defaultValues: {
      title: product.title,
      description: product.description,
      category: product.category as EditListingFormInput["category"],
      brand: product.brand,
      productType: product.product_type,
      condition: product.condition,
      size: product.size,
      color: product.color,
      gender: product.gender,
      price: product.price,
      location: product.location,
    },
  });

  const selectedProductType = useWatch({
    control: form.control,
    name: "productType",
  });

  const availableConditions = productConditions.filter((condition) =>
    condition.productTypes.includes(selectedProductType),
  );

  const onSubmit = async (values: EditListingFormValues) => {
    setIsSubmitting(true);

    const shouldUpdateSlug = values.title !== product.title;
    const nextSlug = shouldUpdateSlug
      ? createProductSlug(values.title)
      : product.slug;

    const { error } = await supabase
      .from("products")
      .update({
        title: values.title,
        slug: nextSlug,
        description: values.description,
        category: values.category,
        brand: values.brand,
        product_type: values.productType,
        condition: values.condition,
        size: values.size,
        color: values.color,
        gender: values.gender,
        price: values.price,
        location: values.location,
      })
      .eq("id", product.id);

    setIsSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Listing updated");
    router.push("/dashboard/listings");
    router.refresh();
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-border bg-white p-6 shadow-sm lg:p-8">
        <Link
          href="/dashboard/listings"
          className="button-text mb-5 inline-flex items-center gap-2 text-text-muted transition hover:text-brand"
        >
          <ArrowLeft size={17} />
          Back to listings
        </Link>

        <div>
          <p className="overline mb-3 text-brand">Seller dashboard</p>

          <h1 className="heading-1 text-text-strong">Edit listing</h1>

          <p className="body-2 mt-3 max-w-2xl text-text-muted">
            Update product details, pricing, and listing information. Image
            editing will be added as a separate step.
          </p>
        </div>
      </section>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-8 xl:grid-cols-[1fr_340px]"
      >
        <div className="space-y-6">
          <FormSection
            title="Product details"
            description="Update the basic information buyers see first."
          >
            <div className="grid gap-4">
              <FormInput
                label="Title"
                placeholder="e.g. Nike Dri-FIT Training Hoodie"
                error={form.formState.errors.title?.message}
                {...form.register("title")}
              />

              <FormTextarea
                label="Description"
                placeholder="Describe the item, fit, fabric, condition, and anything buyers should know."
                error={form.formState.errors.description?.message}
                {...form.register("description")}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormSelect
                      label="Category"
                      value={field.value}
                      options={productCategories}
                      error={form.formState.errors.category?.message}
                      onChange={field.onChange}
                    />
                  )}
                />

                <FormInput
                  label="Brand"
                  placeholder="e.g. Nike"
                  error={form.formState.errors.brand?.message}
                  {...form.register("brand")}
                />
              </div>
            </div>
          </FormSection>

          <FormSection
            title="Item information"
            description="Keep the type, condition, size, and color accurate."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="productType"
                render={({ field }) => (
                  <FormSelect
                    label="Product type"
                    value={field.value}
                    options={productTypes}
                    error={form.formState.errors.productType?.message}
                    onChange={(value) => {
                      field.onChange(value);

                      if (value === "new") {
                        form.setValue("condition", "new_with_tags");
                      } else {
                        form.setValue("condition", "like_new");
                      }
                    }}
                  />
                )}
              />

              <Controller
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormSelect
                    label="Condition"
                    value={field.value}
                    options={availableConditions}
                    error={form.formState.errors.condition?.message}
                    onChange={field.onChange}
                  />
                )}
              />

              <Controller
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormSelect
                    label="Size"
                    value={field.value}
                    placeholder="Select size"
                    options={sizes.map((size) => ({
                      value: size,
                      label: size,
                    }))}
                    error={form.formState.errors.size?.message}
                    onChange={field.onChange}
                  />
                )}
              />

              <FormInput
                label="Color"
                placeholder="e.g. Black"
                error={form.formState.errors.color?.message}
                {...form.register("color")}
              />

              <Controller
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormSelect
                    label="Gender"
                    value={field.value}
                    options={productGenders}
                    error={form.formState.errors.gender?.message}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </FormSection>

          <FormSection
            title="Pricing and location"
            description="Update the price and where the item is available."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                label="Price"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                placeholder="68"
                error={form.formState.errors.price?.message}
                {...form.register("price")}
              />

              <FormInput
                label="Location"
                placeholder="Tallinn, Estonia"
                error={form.formState.errors.location?.message}
                {...form.register("location")}
              />
            </div>
          </FormSection>
        </div>

        <aside className="h-fit rounded-card border border-border bg-white p-5 shadow-sm lg:sticky lg:top-28">
          <p className="overline mb-2 text-brand">Listing status</p>

          <h2 className="heading-3 text-text-strong">Update listing</h2>

          <p className="body-2 mt-3 text-text-muted">
            Changes will be saved to Supabase and reflected on the public
            product page.
          </p>

          <div className="mt-5 rounded-[24px] bg-background-soft p-4">
            <p className="caption text-text-muted">Current status</p>
            <p className="subtitle-2 mt-1 text-text-strong">
              {formatStatus(product.status)}
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="button-text mt-6 h-12 w-full rounded-button bg-brand px-6 text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>

          <Link
            href="/dashboard/listings"
            className="button-text mt-3 flex h-12 items-center justify-center rounded-button border border-border bg-white px-6 text-text-strong transition hover:border-brand hover:text-brand"
          >
            Cancel
          </Link>
        </aside>
      </form>
    </div>
  );
}

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
