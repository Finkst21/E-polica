export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowRight, BookText, ChartNoAxesCombined, Shield } from "lucide-react";

import { auth } from "@/auth";
import { DatabaseUnavailableCard } from "@/components/database-unavailable-card";
import { HeroSection } from "@/components/sections/hero";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const session = await auth().catch(() => null);
  let databaseUnavailable = false;
  const handleUnavailable = () => {
    databaseUnavailable = true;
    return 0;
  };
  const booksCount = await prisma.book.count().catch(handleUnavailable);
  const usersCount = await prisma.user.count().catch(handleUnavailable);
  const reviewsCount = await prisma.review.count().catch(handleUnavailable);

  return (
    <main className="pb-20">
      <HeroSection />
      <section className="container-shell space-y-8 py-10">
        {databaseUnavailable ? (
          <DatabaseUnavailableCard />
        ) : null}
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
                Uporabniški tok
              </Badge>
              <CardTitle className="mt-2">Od prijave do branja in recenzije</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Uporabnik pregleda katalog, odpre podrobnosti knjige, prebere vsebino in odda oceno z komentarjem.</p>
              <p>Vse ocene se prikažejo skupaj s povprečjem, admin pa jih lahko pred objavo moderira.</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-secondary via-card to-accent/10">
            <CardHeader>
              <Badge variant="outline" className="w-fit">
                Administracija
              </Badge>
              <CardTitle className="mt-2">Nadzor nad vsebino, uporabniki in analitiko</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Admin nadzoruje knjige, uporabnike, ocene in grafične prikaze uspešnosti kataloga.
              </p>
              <Button asChild className="gap-2">
                <Link href={session?.user?.role === "ADMIN" ? "/admin" : "/books"}>
                  {session?.user?.role === "ADMIN" ? "Odpri admin panel" : "Razišči katalog"}
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
