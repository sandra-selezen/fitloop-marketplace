"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { loginSchema, type LoginFormValues } from "@/features/auth/auth-schema";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/FormField";

export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") ?? "/";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Welcome back");
    router.push(nextUrl);
    router.refresh();
  };

  return (
    <div className="w-full max-w-md rounded-[32px] border border-border bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-8 text-center">
        <p className="overline mb-2 text-brand">Welcome back</p>

        <h1 className="heading-2 text-text-strong">Log in to your account</h1>

        <p className="body-2 mt-3 text-text-muted">
          Continue shopping, selling, and managing your activewear listings.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={form.formState.errors.email?.message}
          {...form.register("email")}
        />

        <div className="relative">
          <FormInput
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete="current-password"
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-[38px] text-text-muted transition hover:text-brand"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="button-text h-12 w-full rounded-button bg-brand text-white hover:bg-brand-dark"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="body-2 text-text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-brand transition hover:text-brand-dark"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
