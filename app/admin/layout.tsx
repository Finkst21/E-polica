import type { ReactNode } from "react";
import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { requireAdmin } from "@/lib/auth-helpers";

const links = [
  { href: "/admin", label: "Pregled" },
  { href: "/admin/books", label: "Knjige" },
  { href: "/admin/users", label: "Uporabniki" },
  { href: "/admin/analytics", label: "Analitika" },
  { href: "/admin/messages", label: "Sporocila" },
  { href: "/admin/import-export", label: "Uvoz in izvoz" }
];

export default async function AdminLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  await requireAdmin();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container-shell grid gap-8 py-10 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-[28px] border border-border/70 bg-card/90 p-4">
          <div className="mb-4 px-4 py-2">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Admin panel</p>
            <h2 className="mt-2 font-serif text-2xl font-bold">Nadzor sistema</h2>
          </div>
          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
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

