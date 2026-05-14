"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { cn } from "@/lib/utils/cn";
import {
  productCategories,
  productConditions,
  productGenders,
  productTypes,
  sizes,
} from "@/constants/products";
import { Container } from "@/components/layout/Container";
import {
  createListingSchema,
  type CreateListingFormInput,
  type CreateListingFormValues,
} from "../create-listing-schema";

export function CreateListingView() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<
    CreateListingFormInput,
    unknown,
    CreateListingFormValues
  >({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "clothing",
      brand: "",
      productType: "new",
      condition: "new_with_tags",
      size: "",
      color: "",
      gender: "unisex",
      price: 1,
      location: "",
    },
  });

  const selectedProductType = useWatch({
    control: form.control,
    name: "productType",
  });

  const availableConditions = productConditions.filter((condition) =>
    condition.productTypes.includes(selectedProductType),
  );

  const onSubmit = async (values: CreateListingFormValues) => {
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    console.log("Create listing values:", values);

    toast.success("Listing created successfully");

    setIsSubmitting(false);
    form.reset();
  };

  return (
    <section className="bg-background-soft py-10 lg:py-14">
      <Container>
        <div className="mb-8 max-w-3xl">
          <p className="overline mb-2 text-brand">Sell on FitLoop</p>

          <h1 className="heading-1 text-text-strong">Create a new listing</h1>

          <p className="body-2 mt-3 text-text-muted">
            Add product details, condition, size, price, and location. Image
            upload preview will be added next, and later this form will save
            listings to Supabase.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-8 lg:grid-cols-[1fr_340px]"
        >
          <div className="space-y-6">
            <FormSection
              title="Product details"
              description="Start with the basic information buyers will see first."
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
                  <FormSelect
                    label="Category"
                    error={form.formState.errors.category?.message}
                    {...form.register("category")}
                  >
                    {productCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </FormSelect>

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
              description="Help buyers understand the type, condition, size, and color."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormSelect
                  label="Product type"
                  error={form.formState.errors.productType?.message}
                  {...form.register("productType", {
                    onChange: (event) => {
                      const nextType = event.target.value;

                      if (nextType === "new") {
                        form.setValue("condition", "new_with_tags");
                      } else {
                        form.setValue("condition", "like_new");
                      }
                    },
                  })}
                >
                  {productTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </FormSelect>

                <FormSelect
                  label="Condition"
                  error={form.formState.errors.condition?.message}
                  {...form.register("condition")}
                >
                  {availableConditions.map((condition) => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </FormSelect>

                <FormSelect
                  label="Size"
                  error={form.formState.errors.size?.message}
                  {...form.register("size")}
                >
                  <option value="">Select size</option>
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </FormSelect>

                <FormInput
                  label="Color"
                  placeholder="e.g. Black"
                  error={form.formState.errors.color?.message}
                  {...form.register("color")}
                />

                <FormSelect
                  label="Gender"
                  error={form.formState.errors.gender?.message}
                  {...form.register("gender")}
                >
                  {productGenders.map((gender) => (
                    <option key={gender.value} value={gender.value}>
                      {gender.label}
                    </option>
                  ))}
                </FormSelect>
              </div>
            </FormSection>

            <FormSection
              title="Pricing and location"
              description="Set the price and where the item is available."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput
                  label="Price"
                  type="number"
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
            <h2 className="heading-3 text-text-strong">Listing checklist</h2>

            <div className="mt-5 space-y-4">
              <ChecklistItem label="Add clear product details" />
              <ChecklistItem label="Choose the correct condition" />
              <ChecklistItem label="Set a realistic price" />
              <ChecklistItem label="Add product photos next" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="button-text mt-6 flex h-12 w-full items-center justify-center rounded-button bg-brand px-6 text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Publishing..." : "Publish listing"}
            </button>

            <p className="caption mt-4 text-text-muted">
              This is currently a front-end demo. Later, listings will be saved
              to Supabase and connected to the authenticated user.
            </p>
          </aside>
        </form>
      </Container>
    </section>
  );
}

interface FormSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="rounded-card border border-border bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="heading-3 text-text-strong">{title}</h2>
        <p className="body-2 mt-2 text-text-muted">{description}</p>
      </div>

      {children}
    </section>
  );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function FormInput({ label, error, className, ...props }: FormInputProps) {
  return (
    <label className="block">
      <span className="subtitle-2 text-text-strong">{label}</span>

      <input
        className={cn(
          "mt-2 h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-text-strong outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand/15",
          error && "border-error focus:border-error focus:ring-error/10",
          className,
        )}
        {...props}
      />

      {error && <span className="caption mt-1 block text-error">{error}</span>}
    </label>
  );
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

function FormTextarea({
  label,
  error,
  className,
  ...props
}: FormTextareaProps) {
  return (
    <label className="block">
      <span className="subtitle-2 text-text-strong">{label}</span>

      <textarea
        rows={5}
        className={cn(
          "mt-2 w-full resize-none rounded-2xl border border-border bg-white px-4 py-3 text-sm text-text-strong outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand/15",
          error && "border-error focus:border-error focus:ring-error/10",
          className,
        )}
        {...props}
      />

      {error && <span className="caption mt-1 block text-error">{error}</span>}
    </label>
  );
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

function FormSelect({
  label,
  error,
  className,
  children,
  ...props
}: FormSelectProps) {
  return (
    <label className="block">
      <span className="subtitle-2 text-text-strong">{label}</span>

      <select
        className={cn(
          "mt-2 h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-text-strong outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15",
          error && "border-error focus:border-error focus:ring-error/10",
          className,
        )}
        {...props}
      >
        {children}
      </select>

      {error && <span className="caption mt-1 block text-error">{error}</span>}
    </label>
  );
}

interface ChecklistItemProps {
  label: string;
}

function ChecklistItem({ label }: ChecklistItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-mint/15 text-accent-mint">
        <CheckCircle2 size={17} />
      </div>

      <p className="body-2 text-text-primary">{label}</p>
    </div>
  );
}
