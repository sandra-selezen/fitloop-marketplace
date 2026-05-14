import type { Metadata } from "next";
import { AuthPageShell } from "@/features/auth/components/AuthPageShell";

export const metadata: Metadata = {
  title: "Log in | FitLoop",
  description: "Log in to your FitLoop account.",
};

export default function LoginPage() {
  return <AuthPageShell mode="login" />;
}
