import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site-header";

export default function MarketingLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      {children}
    </div>
  );
}
