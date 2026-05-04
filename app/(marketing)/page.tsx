export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowRight, BookOpenCheck, BookText, MessageSquareText, Search, Star, Users } from "lucide-react";

import { DatabaseUnavailableCard } from "@/components/database-unavailable-card";
import { HeroSection } from "@/components/sections/hero";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBooks } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { formatRating } from "@/lib/utils";

export default async function HomePage() {
  let databaseUnavailable = false;
  const handleUnavailable = () => {
    databaseUnavailable = true;
    return 0;
  };

  const [booksCount, usersCount, reviewsCount, books] = await Promise.all([
    prisma.book.count().catch(handleUnavailable),
    prisma.user.count().catch(handleUnavailable),
    prisma.review.count().catch(handleUnavailable),
    getBooks({ sort: "rating" })
  ]);

  const featuredBooks = books.slice(0, 3);
  return (
    <main className="pb-16">
      <HeroSection featuredBooks={featuredBooks} />

      <section className="container-shell space-y-10 py-10">
        {databaseUnavailable ? <DatabaseUnavailableCard /> : null}

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Knjige v katalogu"
            value={booksCount}
            description="Pripravljene za branje in ocenjevanje."
            icon={BookText}
          />
          <StatCard
            title="Bralci"
            value={usersCount}
            description="Uporabniki, ki gradijo skupnost ocen."
            icon={Users}
          />
          <StatCard
            title="Oddane ocene"
            value={reviewsCount}
            description="Mnenja, ki pomagajo izbrati naslednje branje."
            icon={Star}
          />
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="space-y-3 p-4">
              <Search className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-semibold">Poisci knjigo</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Katalog lahko filtriras po naslovu, avtorju ali opisu in ga razvrstis po oceni.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3 p-4">
              <BookOpenCheck className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-semibold">Preberi podrobnosti</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Pri vsaki knjigi so zbrane osnovne informacije, opis, vsebina in ocene bralcev.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3 p-4">
              <MessageSquareText className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-semibold">Oddaj oceno</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Po prijavi lahko knjigi dodas zvezdice in komentar, ki ga administrator pred objavo pregleda.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge variant="outline" className="w-fit">
                Priporoceno za zacetek
              </Badge>
              <h2 className="mt-3 text-2xl font-bold">Najbolje ocenjene knjige</h2>
            </div>
            <Button asChild variant="outline" className="w-fit gap-2">
              <Link href="/books">
                Vse knjige
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featuredBooks.map((book) => (
              <Card key={book.id}>
                <CardHeader>
                  <CardTitle className="line-clamp-2 text-lg">{book.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{formatRating(book.averageRating)}</span>
                    <span className="text-muted-foreground">({book.ratingsCount} ocen)</span>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/books/${book.id}`}>Odpri knjigo</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
