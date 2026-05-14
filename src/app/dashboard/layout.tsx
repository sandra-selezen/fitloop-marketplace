import type { ReactNode } from "react";

import { Container } from "@/components/layout/Container";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <section className="bg-background-soft py-8 lg:py-10">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <DashboardSidebar />

          <div>{children}</div>
        </div>
      </Container>
    </section>
  );
}
