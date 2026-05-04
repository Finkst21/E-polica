export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, Star } from "lucide-react";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { ReviewForm } from "@/components/reviews/review-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getBookById } from "@/lib/data";
import { formatRating } from "@/lib/utils";

export default async function RateBookPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bookId = decodeURIComponent(id);
  const session = await auth();
  const book = await getBookById(bookId);

  if (!book) {
    notFound();
  }

  return (
    <main className="container-shell grid gap-6 py-6 lg:grid-cols-[340px_1fr]">
      <aside className="space-y-4">
        <Button asChild variant="ghost" className="w-fit">
          <Link href={`/books/${book.id}`} className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Nazaj na knjigo
          </Link>
        </Button>

        <Card className="overflow-hidden">
          <div className="relative aspect-[3/4]">
            {book.coverImage ? (
              <Image src={book.coverImage} alt={book.title} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-secondary">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
          <CardContent className="space-y-3 p-4">
            <div>
              <h1 className="text-2xl font-bold">{book.title}</h1>
              <p className="text-muted-foreground">{book.author}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {formatRating(book.averageRating)} / 5
              </Badge>
              <Badge variant="outline">{book.approvedReviews.length} objavljenih ocen</Badge>
            </div>
          </CardContent>
        </Card>
      </aside>

      <section className="space-y-4">
        <div className="space-y-2">
          <Badge variant="outline" className="w-fit">
            Ocenjevanje
          </Badge>
          <h2 className="text-3xl font-bold">Oddaj oceno za knjigo</h2>
          <p className="max-w-2xl text-muted-foreground">
            Izberi stevilo zvezdic in po zelji dodaj mnenje. Ocena bo vidna po odobritvi administratorja.
          </p>
        </div>

        {session?.user ? (
          <ReviewForm bookId={book.id} />
        ) : (
          <Card>
            <CardContent className="space-y-3 p-4">
              <p className="text-sm text-muted-foreground">
                Za oddajo ocene se moras prijaviti v sistem.
              </p>
              <Button asChild>
                <Link href="/login">Prijava</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
