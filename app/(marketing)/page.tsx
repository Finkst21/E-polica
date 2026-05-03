export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowRight, BookText, ChartNoAxesCombined, Shield } from "lucide-react";

import { DatabaseUnavailableCard } from "@/components/database-unavailable-card";
import { HeroSection } from "@/components/sections/hero";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

async function withFallback<T>(promise: Promise<T>, fallback: T) {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<T>((resolve) => {
    timeout = setTimeout(() => resolve(fallback), 1500);
  });

  return Promise.race([promise, timeoutPromise])
    .catch(() => fallback)
    .finally(() => {
      if (timeout) {
        clearTimeout(timeout);
      }
    });
}

export default async function HomePage() {
  let databaseUnavailable = false;
  const handleUnavailable = () => {
    databaseUnavailable = true;
    return 0;
  };
  const [booksCount, usersCount, reviewsCount] = await Promise.all([
    withFallback(prisma.book.count().catch(handleUnavailable), 0),
    withFallback(prisma.user.count().catch(handleUnavailable), 0),
    withFallback(prisma.review.count().catch(handleUnavailable), 0)
  ]);

  databaseUnavailable = databaseUnavailable || booksCount + usersCount + reviewsCount === 0;

  return (
    <main className="pb-20">
      <HeroSection />
      <section className="container-shell space-y-8 py-10">
        {databaseUnavailable ? <DatabaseUnavailableCard /> : null}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Knjige v katalogu"
            value={booksCount}
            description="Digitalizirane in pripravljene za branje."
            icon={BookText}
          />
          <StatCard
            title="Registrirani uporabniki"
            value={usersCount}
            description="Skupnost bralcev in administratorjev."
            icon={Shield}
          />
          <StatCard
            title="Oddane ocene"
            value={reviewsCount}
            description="Komentarji in povratne informacije uporabnikov."
            icon={ChartNoAxesCombined}
          />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Badge variant="outline" className="w-fit">
                Uporabniski tok
              </Badge>
              <CardTitle className="mt-2">Od prijave do branja in recenzije</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Uporabnik pregleda katalog, odpre podrobnosti knjige, prebere vsebino in odda oceno s komentarjem.</p>
              <p>Vse ocene se prikazejo skupaj s povprecjem, admin pa jih lahko pred objavo moderira.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Badge variant="outline" className="w-fit">
                Administracija
              </Badge>
              <CardTitle className="mt-2">Nadzor nad vsebino, uporabniki in analitiko</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Admin nadzoruje knjige, uporabnike, ocene in graficne prikaze uspesnosti kataloga.
              </p>
              <Button asChild className="gap-2">
                <Link href="/books">
                  Razisci katalog
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
