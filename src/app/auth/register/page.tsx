import type { Metadata } from "next";
import { AuthPageShell } from "@/features/auth/components/AuthPageShell";

export const metadata: Metadata = {
  title: "Create account | FitLoop",
  description: "Create your FitLoop account.",
};

export default function RegisterPage() {
  return <AuthPageShell mode="register" />;
}
