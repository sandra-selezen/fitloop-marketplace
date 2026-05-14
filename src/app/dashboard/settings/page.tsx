import type { Metadata } from "next";

import { SettingsView } from "@/features/dashboard/components/SettingsView";

export const metadata: Metadata = {
  title: "Settings | FitLoop",
  description: "Manage your FitLoop profile settings.",
};

export default function DashboardSettingsPage() {
  return <SettingsView />;
}
