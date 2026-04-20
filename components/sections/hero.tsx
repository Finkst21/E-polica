import Link from "next/link";
import { BookMarked, ChartColumn, ShieldCheck, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const highlights = [
  { label: "Katalog knjig", icon: BookMarked },
  { label: "Ocene in komentarji", icon: Star },
  { label: "Admin nadzor", icon: ShieldCheck },
  { label: "Analitika", icon: ChartColumn }
];

export function HeroSection() {
  return (
    <section className="container-shell grid gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
      <div className="space-y-8">
        <Badge variant="outline" className="w-fit">
          Next.js, Prisma, Auth.js, Recharts
        </Badge>
        <div className="space-y-5">
          <h1 className="max-w-3xl font-serif text-5xl font-bold leading-tight sm:text-6xl">
            Digitalna knjižna polica za branje, ocenjevanje in upravljanje vsebin.
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            E-polica združi javni katalog knjig, izkušnjo branja, recenzije uporabnikov in
            administrativni nadzor v eno odzivno platformo.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/books">Prebrskaj knjige</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/register">Ustvari račun</Link>
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-3xl border border-border/70 bg-card/80 px-4 py-4 backdrop-blur"
            >
              <item.icon className="h-5 w-5 text-primary" />
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/10 via-card to-accent/10">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/30 bg-white/70 p-6 shadow-glow backdrop-blur dark:bg-black/20">
              <p className="text-sm text-muted-foreground">Kaj prinese platforma</p>
              <div className="mt-4 grid gap-4">
                <div>
                  <div className="text-4xl font-bold">1–5</div>
                  <p className="text-sm text-muted-foreground">sistem zvezdičnih ocen in komentarjev</p>
                </div>
                <div>
                  <div className="text-4xl font-bold">ADMIN</div>
                  <p className="text-sm text-muted-foreground">upravljanje uporabnikov, knjig in moderiranja</p>
                </div>
                <div>
                  <div className="text-4xl font-bold">V živo</div>
                  <p className="text-sm text-muted-foreground">statistika ocen, knjig in aktivnosti sistema</p>
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Card className="bg-card/80">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">Branje</p>
                  <p className="mt-2 font-semibold">Celotna vsebina knjige na namenski strani.</p>
                </CardContent>
              </Card>
              <Card className="bg-card/80">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">Filtri</p>
                  <p className="mt-2 font-semibold">Iskanje po naslovu, avtorju ali opisu.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
