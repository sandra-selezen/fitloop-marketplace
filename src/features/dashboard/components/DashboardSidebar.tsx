"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { dashboardNavLinks } from "@/constants/dashboard";

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-fit rounded-card border border-border bg-white p-4 shadow-sm lg:sticky lg:top-28">
      <div className="px-2 pb-4">
        <p className="overline mb-2 text-brand">Account</p>
        <h2 className="heading-3 text-text-strong">Dashboard</h2>
        <p className="caption mt-2 text-text-muted">
          Manage your listings, orders, and account details.
        </p>
      </div>

      <nav className="mt-4 grid gap-1 border-t border-border pt-4">
        {dashboardNavLinks.map((link) => {
          const Icon = link.icon;

          const isActive =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "body-2 flex items-center gap-3 rounded-2xl px-3 py-3 transition",
                isActive
                  ? "bg-brand text-white shadow-sm"
                  : "text-text-primary hover:bg-background-soft hover:text-brand",
              )}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
