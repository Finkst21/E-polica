import Link from "next/link";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="border-b border-border bg-card">
      <div className="container-shell py-10">
        <div className="max-w-3xl space-y-4">
          <h1 className="text-3xl font-bold sm:text-4xl">E-polica</h1>
          <p className="text-muted-foreground">
            Enostavna aplikacija za pregled knjig, branje, ocenjevanje in osnovno administracijo.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/books">Knjige</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register">Registracija</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
