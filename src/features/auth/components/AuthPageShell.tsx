import { Suspense } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface AuthPageShellProps {
  mode: "login" | "register";
}

export function AuthPageShell({ mode }: AuthPageShellProps) {
  const isLogin = mode === "login";

  return (
    <section className="min-h-[calc(100vh-80px)] bg-background-soft py-10 lg:py-14">
      <div className="mx-auto grid w-full max-w-[1180px] gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_480px] lg:px-8">
        <div className="hidden overflow-hidden gap-6 rounded-[32px] bg-text-strong p-8 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-full bg-brand text-white">
                F
              </div>
              <span className="heading-4">FitLoop</span>
            </Link>

            <div className="mt-14 max-w-md">
              <div className="mb-5 flex size-12 items-center justify-center rounded-full bg-white/10 text-brand">
                <Sparkles size={22} />
              </div>

              <p className="overline mb-3 text-brand">Activewear marketplace</p>

              <h2 className="text-[42px] font-bold leading-[52px]">
                Buy, sell, and discover activewear that fits your lifestyle.
              </h2>

              <p className="body-1 mt-5 text-white/70">
                Manage listings, save favorite products, and checkout with a
                marketplace experience built for active people.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-[24px] bg-white/10 p-4">
              <p className="text-[24px] font-bold leading-8">120+</p>
              <p className="caption mt-1 text-white/60">Listings</p>
            </div>

            <div className="rounded-[24px] bg-brand/80 p-4">
              <p className="text-[24px] font-bold leading-8">4.8</p>
              <p className="caption mt-1 text-white/80">Rating</p>
            </div>

            <div className="rounded-[24px] bg-white/10 p-4">
              <p className="text-[24px] font-bold leading-8">24h</p>
              <p className="caption mt-1 text-white/60">Support</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          {isLogin ? (
            <Suspense fallback={<AuthFormSkeleton />}>
              <LoginForm />
            </Suspense>
          ) : (
            <RegisterForm />
          )}
        </div>
      </div>
    </section>
  );
}

function AuthFormSkeleton() {
  return (
    <div className="w-full max-w-md rounded-[32px] border border-border bg-white p-6 shadow-sm sm:p-8">
      <div className="mx-auto h-4 w-28 animate-pulse rounded-full bg-background-soft" />
      <div className="mx-auto mt-4 h-8 w-64 animate-pulse rounded-full bg-background-soft" />
      <div className="mx-auto mt-3 h-4 w-72 animate-pulse rounded-full bg-background-soft" />

      <div className="mt-8 space-y-5">
        <div className="h-12 animate-pulse rounded-2xl bg-background-soft" />
        <div className="h-12 animate-pulse rounded-2xl bg-background-soft" />
        <div className="h-12 animate-pulse rounded-button bg-background-soft" />
      </div>
    </div>
  );
}
