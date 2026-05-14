"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/auth-schema";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/FormField";

export function RegisterForm() {
  const router = useRouter();
  const supabase = createClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);

    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setIsSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setRegisteredEmail(values.email);
    setIsSuccess(true);
    toast.success("Check your email to confirm your account");
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md rounded-[32px] border border-border bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand/10 text-brand">
          ✓
        </div>

        <p className="overline mt-6 text-brand">Confirm your email</p>

        <h1 className="heading-2 mt-2 text-text-strong">Check your inbox</h1>

        <p className="body-2 mt-3 text-text-muted">
          If this email is new, we sent a confirmation link to{" "}
          <span className="font-semibold text-text-strong">
            {registeredEmail}
          </span>
          . If you already have an account, try logging in instead.
        </p>

        <Link
          href="/auth/login"
          className="button-text mt-8 inline-flex h-12 w-full items-center justify-center rounded-button bg-brand px-6 text-white transition hover:bg-brand-dark"
        >
          Go to login
        </Link>

        <button
          type="button"
          onClick={() => {
            setIsSuccess(false);
            form.reset();
          }}
          className="button-text mt-3 inline-flex h-12 w-full items-center justify-center rounded-button border border-border bg-white px-6 text-text-strong transition hover:border-brand hover:text-brand"
        >
          Use another email
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-[32px] border border-border bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-8 text-center">
        <p className="overline mb-2 text-brand">Join FitLoop</p>

        <h1 className="heading-2 text-text-strong">Create your account</h1>

        <p className="body-2 mt-3 text-text-muted">
          Start buying and selling activewear, sneakers, and sports accessories.
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
            placeholder="Create a password"
            autoComplete="new-password"
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

        <FormInput
          label="Confirm password"
          type="password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          error={form.formState.errors.confirmPassword?.message}
          {...form.register("confirmPassword")}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="button-text h-12 w-full rounded-button bg-brand text-white hover:bg-brand-dark"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="body-2 text-text-muted">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-brand transition hover:text-brand-dark"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
