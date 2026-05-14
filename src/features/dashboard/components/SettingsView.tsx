"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  profileSettingsSchema,
  type ProfileSettingsFormValues,
} from "@/features/dashboard/settings-schema";
import { createClient } from "@/lib/supabase/client";
import {
  FormInput,
  FormSection,
  FormTextarea,
} from "@/components/form/FormField";

export function SettingsView() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileSettingsFormValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      fullName: "",
      username: "",
      location: "",
      bio: "",
    },
  });

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setEmail(user?.email ?? "");
      setIsLoadingUser(false);
    };

    getUser();
  }, [supabase]);

  const onSubmit = async (values: ProfileSettingsFormValues) => {
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    console.log("Profile settings values:", values);

    setIsSubmitting(false);
    toast.success("Profile settings saved");
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-border bg-white p-6 shadow-sm lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="overline mb-3 text-brand">Account settings</p>

            <h1 className="heading-1 text-text-strong">Profile settings</h1>

            <p className="body-2 mt-3 max-w-2xl text-text-muted">
              Manage your public seller profile and account information. Later,
              these settings will be saved to your Supabase profile.
            </p>
          </div>

          <div className="flex size-20 items-center justify-center rounded-full bg-brand/10 text-brand">
            <UserRound size={34} />
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormSection
            title="Public profile"
            description="This information can appear on your seller profile and listings."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                label="Full name"
                placeholder="e.g. John Doe"
                error={form.formState.errors.fullName?.message}
                {...form.register("fullName")}
              />

              <FormInput
                label="Username"
                placeholder="e.g. john"
                error={form.formState.errors.username?.message}
                {...form.register("username")}
              />

              <FormInput
                label="Location"
                placeholder="Tallinn, Estonia"
                error={form.formState.errors.location?.message}
                {...form.register("location")}
              />

              <div className="sm:col-span-2">
                <FormTextarea
                  label="Bio"
                  placeholder="Tell buyers a little about your activewear style, favorite sports, or selling approach."
                  error={form.formState.errors.bio?.message}
                  {...form.register("bio")}
                />
              </div>
            </div>
          </FormSection>

          <FormSection
            title="Account email"
            description="Your email is managed by Supabase Auth. It will be used for login and account notifications."
          >
            <div className="rounded-[24px] border border-border bg-background-soft p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-brand">
                  <Mail size={18} />
                </div>

                <div>
                  <p className="caption text-text-muted">Email address</p>

                  {isLoadingUser ? (
                    <div className="mt-2 h-5 w-52 animate-pulse rounded-full bg-white" />
                  ) : (
                    <p className="subtitle-2 mt-1 text-text-strong">
                      {email || "No email found"}
                    </p>
                  )}

                  <p className="caption mt-2 text-text-muted">
                    Email editing will be added later through Supabase Auth
                    account management.
                  </p>
                </div>
              </div>
            </div>
          </FormSection>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="button-text h-12 rounded-button border-border bg-white px-6 text-text-strong hover:border-brand hover:text-brand"
              onClick={() => form.reset()}
            >
              Reset
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="button-text h-12 rounded-button bg-brand px-6 text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>

        <aside className="h-fit rounded-card border border-border bg-white p-5 shadow-sm lg:sticky lg:top-28">
          <p className="overline mb-2 text-brand">Profile status</p>
          <h2 className="heading-3 text-text-strong">Seller readiness</h2>

          <div className="mt-5 space-y-4">
            <ReadinessItem label="Account created" completed />
            <ReadinessItem label="Email connected" completed={Boolean(email)} />
            <ReadinessItem
              label="Profile details added"
              completed={form.formState.isDirty}
            />
            <ReadinessItem label="First listing published" completed={false} />
          </div>

          <div className="mt-6 rounded-[24px] bg-background-soft p-4">
            <div className="flex gap-3">
              <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-brand">
                <ShieldCheck size={18} />
              </div>

              <div>
                <h3 className="subtitle-2 text-text-strong">Production note</h3>
                <p className="caption mt-1 text-text-muted">
                  Later this page will read and update data from a Supabase
                  profiles table linked to the authenticated user.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

interface ReadinessItemProps {
  label: string;
  completed: boolean;
}

function ReadinessItem({ label, completed }: ReadinessItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={
          completed
            ? "flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-mint/15 text-accent-mint"
            : "flex size-8 shrink-0 items-center justify-center rounded-full bg-background-soft text-text-muted"
        }
      >
        <ShieldCheck size={16} />
      </div>

      <p className="body-2 text-text-primary">{label}</p>
    </div>
  );
}
