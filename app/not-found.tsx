import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container-shell flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">404</p>
        <h1 className="text-3xl font-bold">Stran ni bila najdena</h1>
      </div>
      <Button asChild>
        <Link href="/">Nazaj na domačo stran</Link>
      </Button>
    </main>
  );
}
