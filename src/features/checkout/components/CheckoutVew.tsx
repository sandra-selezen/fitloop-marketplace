"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Lock, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useCartStore } from "@/features/cart/cart-store";
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/features/checkout/checkout-schema";

import { DEFAULT_DELIVERY_METHOD, deliveryMethods } from "@/constants/checkout";

import { Container } from "@/components/layout/Container";
import { FormInput, FormSection } from "@/components/form/FormField";

export function CheckoutView() {
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const totalItems = useCartStore((state) => state.getTotalItems());
  const clearCart = useCartStore((state) => state.clearCart);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      country: "",
      city: "",
      address: "",
      postalCode: "",
      deliveryMethod: DEFAULT_DELIVERY_METHOD,
      paymentMethod: "demo_card",
    },
  });

  const selectedDeliveryMethod = useWatch({
    control: form.control,
    name: "deliveryMethod",
  });

  const shipping =
    deliveryMethods.find((method) => method.id === selectedDeliveryMethod)
      ?.price ?? 0;

  const total = subtotal + shipping;

  const onSubmit = async () => {
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 900));

    clearCart();
    toast.success("Order placed successfully");
    router.push("/checkout/success");
  };

  if (!hasHydrated) {
    return (
      <section className="bg-background-soft py-10 lg:py-14">
        <Container>
          <div className="h-96 animate-pulse rounded-card bg-white" />
        </Container>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="bg-background-soft py-12 lg:py-16">
        <Container>
          <div className="mx-auto flex max-w-xl flex-col items-center rounded-[32px] border border-border bg-white px-6 py-14 text-center shadow-sm">
            <div className="flex size-16 items-center justify-center rounded-full bg-brand/10 text-brand">
              <ShoppingBag size={28} />
            </div>

            <h1 className="heading-2 mt-6 text-text-strong">
              Your cart is empty
            </h1>

            <p className="body-2 mt-3 max-w-md text-text-muted">
              Add at least one item to your cart before continuing to checkout.
            </p>

            <Link
              href="/products"
              className="button-text mt-8 inline-flex h-12 items-center justify-center rounded-button bg-brand px-6 text-white transition hover:bg-brand-dark"
            >
              Browse products
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-background-soft py-10 lg:py-14">
      <Container>
        <div className="mb-8">
          <p className="overline mb-2 text-brand">Checkout</p>
          <h1 className="heading-1 text-text-strong">Complete your order</h1>
          <p className="body-2 mt-3 max-w-2xl text-text-muted">
            Enter your contact and delivery details. This is a demo checkout, so
            no real payment will be processed.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-8 lg:grid-cols-[1fr_380px]"
        >
          <div className="space-y-6">
            <FormSection
              title="Contact information"
              description="We'll use this information to send order updates."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput
                  label="Email"
                  type="email"
                  error={form.formState.errors.email?.message}
                  {...form.register("email")}
                />

                <FormInput
                  label="Phone number"
                  error={form.formState.errors.phone?.message}
                  {...form.register("phone")}
                />
              </div>
            </FormSection>

            <FormSection
              title="Shipping address"
              description="Tell us where the order should be delivered."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput
                  label="First name"
                  error={form.formState.errors.firstName?.message}
                  {...form.register("firstName")}
                />

                <FormInput
                  label="Last name"
                  error={form.formState.errors.lastName?.message}
                  {...form.register("lastName")}
                />

                <FormInput
                  label="Country"
                  error={form.formState.errors.country?.message}
                  {...form.register("country")}
                />

                <FormInput
                  label="City"
                  error={form.formState.errors.city?.message}
                  {...form.register("city")}
                />

                <div className="sm:col-span-2">
                  <FormInput
                    label="Address"
                    error={form.formState.errors.address?.message}
                    {...form.register("address")}
                  />
                </div>

                <FormInput
                  label="Postal code"
                  error={form.formState.errors.postalCode?.message}
                  {...form.register("postalCode")}
                />
              </div>
            </FormSection>

            <FormSection
              title="Delivery method"
              description="Choose the delivery option that works best for you."
            >
              <div className="grid gap-3">
                {deliveryMethods.map((method) => {
                  const isSelected = selectedDeliveryMethod === method.id;

                  return (
                    <label
                      key={method.id}
                      className={cn(
                        "flex cursor-pointer items-start justify-between gap-4 rounded-[24px] border bg-white p-4 transition",
                        isSelected
                          ? "border-brand ring-2 ring-brand/15"
                          : "border-border hover:border-brand/50",
                      )}
                    >
                      <span className="flex gap-3">
                        <input
                          type="radio"
                          value={method.id}
                          className="mt-1 size-4 accent-brand"
                          {...form.register("deliveryMethod")}
                        />

                        <span>
                          <span className="subtitle-2 block text-text-strong">
                            {method.label}
                          </span>
                          <span className="caption mt-1 block text-text-muted">
                            {method.description}
                          </span>
                        </span>
                      </span>

                      <span className="subtitle-2 text-text-strong">
                        {method.price === 0 ? "Free" : `€${method.price}`}
                      </span>
                    </label>
                  );
                })}
              </div>
            </FormSection>

            <FormSection
              title="Payment"
              description="Demo payment method for portfolio checkout flow."
            >
              <label className="flex cursor-pointer items-start gap-3 rounded-[24px] border border-brand bg-brand/5 p-4">
                <input
                  type="radio"
                  value="demo_card"
                  className="mt-1 size-4 accent-brand"
                  {...form.register("paymentMethod")}
                />

                <span className="flex-1">
                  <span className="flex items-center gap-2 subtitle-2 text-text-strong">
                    <CreditCard size={18} />
                    Demo card payment
                  </span>

                  <span className="caption mt-2 block text-text-muted">
                    No real payment will be processed. Stripe test checkout can
                    be added later after orders and auth are connected.
                  </span>
                </span>
              </label>

              <div className="mt-4 flex items-center gap-2 rounded-[20px] bg-background-soft p-4 text-text-muted">
                <Lock size={17} />
                <p className="caption">
                  This checkout is currently a front-end demo flow.
                </p>
              </div>
            </FormSection>
          </div>

          <aside className="h-fit rounded-card border border-border bg-white p-5 shadow-sm lg:sticky lg:top-28">
            <h2 className="heading-3 text-text-strong">Order summary</h2>

            <div className="mt-5 space-y-4 border-b border-border pb-5">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between gap-4"
                >
                  <div>
                    <p className="body-2 text-text-strong">
                      {item.product.title}
                    </p>
                    <p className="caption mt-1 text-text-muted">
                      Qty {item.quantity} · Size {item.product.size}
                    </p>
                  </div>

                  <p className="subtitle-2 shrink-0 text-text-strong">
                    €{item.product.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 border-b border-border pb-5">
              <SummaryRow
                label={`Subtotal (${totalItems} items)`}
                value={`€${subtotal}`}
              />
              <SummaryRow label="Shipping" value={`€${shipping}`} />
            </div>

            <div className="flex items-center justify-between pt-5">
              <span className="subtitle-1 text-text-strong">Total</span>
              <span className="text-[28px] font-bold leading-[36px] text-text-black">
                €{total}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="button-text mt-6 flex h-12 w-full items-center justify-center rounded-button bg-brand px-6 text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Placing order..." : "Place order"}
            </button>

            <Link
              href="/cart"
              className="button-text mt-3 flex h-12 items-center justify-center rounded-button border border-border bg-white px-6 text-text-strong transition hover:border-brand hover:text-brand"
            >
              Back to cart
            </Link>
          </aside>
        </form>
      </Container>
    </section>
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="body-2 text-text-muted">{label}</span>
      <span className="subtitle-2 text-text-strong">{value}</span>
    </div>
  );
}
