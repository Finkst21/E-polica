import type { ReactNode } from "react";
import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { requireAdmin } from "@/lib/auth-helpers";

const links = [
  { href: "/admin", label: "Pregled" },
  { href: "/admin/books", label: "Knjige" },
  { href: "/admin/users", label: "Uporabniki" },
  { href: "/admin/analytics", label: "Analitika" }
];

export default async function AdminLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  await requireAdmin();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container-shell grid gap-6 py-6 lg:grid-cols-[220px_1fr]">
        <aside className="border border-border bg-card p-4">
          <div className="mb-4">
            <p className="text-sm font-semibold">Admin panel</p>
            <p className="mt-1 text-sm text-muted-foreground">Nadzor sistema</p>
          </div>
          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}

