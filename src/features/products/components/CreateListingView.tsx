"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ImagePlus, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import {
  productCategories,
  productConditions,
  productGenders,
  productTypes,
  sizes,
} from "@/constants/products";
import {
  createListingSchema,
  type CreateListingFormInput,
  type CreateListingFormValues,
} from "../create-listing-schema";
import { createProductSlug } from "../product-utils";

import { Container } from "@/components/layout/Container";
import {
  FormInput,
  FormSection,
  FormSelect,
  FormTextarea,
} from "@/components/form/FormField";

interface ImagePreview {
  id: string;
  file: File;
  url: string;
}

export function CreateListingView() {
  const router = useRouter();
  const supabase = createClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [imageError, setImageError] = useState("");

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

  const watchedTitle = useWatch({
    control: form.control,
    name: "title",
  });

  const watchedBrand = useWatch({
    control: form.control,
    name: "brand",
  });

  const watchedPrice = useWatch({
    control: form.control,
    name: "price",
  });

  const previewPrice = Number(watchedPrice);

  const formattedPreviewPrice = Number.isFinite(previewPrice)
    ? previewPrice
    : 0;

  const watchedSize = useWatch({
    control: form.control,
    name: "size",
  });

  const watchedCondition = useWatch({
    control: form.control,
    name: "condition",
  });

  const conditionLabel =
    productConditions.find((condition) => condition.value === watchedCondition)
      ?.label || "Condition";

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      return;
    }

    const availableSlots = 5 - imagePreviews.length;

    if (availableSlots <= 0) {
      setImageError("You can upload up to 5 photos");
      return;
    }

    const selectedFiles = files.slice(0, availableSlots);

    const nextImages = selectedFiles.map((file) => ({
      id: `${file.name}-${crypto.randomUUID()}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setImagePreviews((prev) => [...prev, ...nextImages]);
    setImageError("");

    event.target.value = "";
  };

  const handleRemoveImage = (imageId: string) => {
    setImagePreviews((prev) => {
      const imageToRemove = prev.find((image) => image.id === imageId);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }

      return prev.filter((image) => image.id !== imageId);
    });
  };

  const onSubmit = async (values: CreateListingFormValues) => {
    if (imagePreviews.length === 0) {
      setImageError("Add at least one product photo");
      return;
    }

    setIsSubmitting(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setIsSubmitting(false);
      toast.error("You need to be logged in to create a listing");
      router.push("/auth/login?next=/sell");
      return;
    }

    const slug = createProductSlug(values.title);

    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        seller_id: user.id,
        title: values.title,
        slug,
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
        status: "active",
      })
      .select("id")
      .single();

    if (productError || !product) {
      setIsSubmitting(false);
      toast.error(productError?.message || "Failed to create listing");
      return;
    }

    const uploadedImages = [];

    for (const [index, image] of imagePreviews.entries()) {
      const fileExtension = image.file.name.split(".").pop();
      const filePath = `${user.id}/${product.id}/${crypto.randomUUID()}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, image.file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setIsSubmitting(false);
        toast.error(uploadError.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(filePath);

      uploadedImages.push({
        product_id: product.id,
        url: publicUrl,
        path: filePath,
        position: index,
      });
    }

    const { error: imagesError } = await supabase
      .from("product_images")
      .insert(uploadedImages);

    if (imagesError) {
      setIsSubmitting(false);
      toast.error(imagesError.message);
      return;
    }

    imagePreviews.forEach((image) => {
      URL.revokeObjectURL(image.url);
    });

    setImagePreviews([]);
    setImageError("");
    form.reset();

    toast.success("Listing published successfully");
    router.push("/dashboard/listings");
    router.refresh();

    setIsSubmitting(false);
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
              description="Help buyers understand the type, condition, size, and color."
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
              title="Product photos"
              description="Add clear photos of the item. The first photo will be used as the main listing image."
            >
              <div className="space-y-4">
                <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-border bg-background-soft px-6 py-8 text-center transition hover:border-brand hover:bg-brand/5">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={handleImagesChange}
                  />

                  <div className="flex size-12 items-center justify-center rounded-full bg-white text-brand shadow-sm">
                    <ImagePlus size={22} />
                  </div>

                  <p className="subtitle-2 mt-4 text-text-strong">
                    Upload product photos
                  </p>

                  <p className="caption mt-2 max-w-sm text-text-muted">
                    Choose up to 5 images. JPG, PNG, or WebP work best.
                  </p>
                </label>

                {imageError && (
                  <p className="caption text-error">{imageError}</p>
                )}

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {imagePreviews.map((image, index) => (
                      <div
                        key={image.id}
                        className="group relative aspect-square overflow-hidden rounded-[20px] border border-border bg-background-soft"
                      >
                        <Image
                          src={image.url}
                          alt={`Product photo ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, 180px"
                        />

                        {index === 0 && (
                          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-text-strong shadow-sm">
                            Main photo
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemoveImage(image.id)}
                          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90 text-text-strong shadow-sm transition hover:bg-error hover:text-white"
                          aria-label="Remove image"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
            <div>
              <p className="overline mb-2 text-brand">Live preview</p>
              <h2 className="heading-3 text-text-strong">Listing preview</h2>
              <p className="caption mt-2 text-text-muted">
                This is how your product card may appear in the marketplace.
              </p>
            </div>

            <div className="mt-5 overflow-hidden rounded-[24px] border border-border bg-white shadow-sm">
              <div className="relative aspect-[4/5] bg-background-soft">
                {imagePreviews[0] ? (
                  <Image
                    src={imagePreviews[0].url}
                    alt="Listing preview"
                    fill
                    className="object-cover"
                    sizes="340px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-6 text-center">
                    <p className="caption text-text-muted">
                      Your main product photo will appear here
                    </p>
                  </div>
                )}

                <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-text-strong shadow-sm">
                  Preview
                </span>
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <p className="caption text-text-muted">
                    {watchedBrand || "Brand"}
                  </p>

                  <h3 className="subtitle-2 mt-1 line-clamp-2 text-text-strong">
                    {watchedTitle || "Product title will appear here"}
                  </h3>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <p className="caption text-text-muted">
                    {conditionLabel} · Size {watchedSize || "—"}
                  </p>

                  <p className="subtitle-2 shrink-0 text-text-strong">
                    €{formattedPreviewPrice}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <h2 className="heading-3 text-text-strong">Listing checklist</h2>

              <div className="mt-5 space-y-4">
                <ChecklistItem label="Add clear product details" />
                <ChecklistItem label="Choose the correct condition" />
                <ChecklistItem label="Set a realistic price" />
                <ChecklistItem label="Add at least one product photo" />
              </div>
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
