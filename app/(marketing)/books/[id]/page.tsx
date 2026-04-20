export const dynamic = "force-dynamic";

import Image from "next/image";
import { CalendarDays, ExternalLink, Star, UserCircle2 } from "lucide-react";
import { format } from "date-fns";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { ReviewForm } from "@/components/reviews/review-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getBookById } from "@/lib/data";
import { formatRating } from "@/lib/utils";

export default async function BookDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const book = await getBookById(id);

  if (!book) {
    notFound();
  }

  return (
    <main className="container-shell grid gap-8 py-10 lg:grid-cols-[0.8fr_1.2fr]">
      <aside className="space-y-6">
        <Card className="overflow-hidden">
          <div className="relative aspect-[3/4]">
            {book.coverImage ? (
              <Image src={book.coverImage} alt={book.title} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-secondary text-muted-foreground">
                Brez naslovnice
              </div>
            )}
          </div>
          <CardContent className="space-y-4 p-6">
            <div>
              <h1 className="font-serif text-4xl font-bold">{book.title}</h1>
              <p className="text-muted-foreground">{book.author}</p>
            </div>
            <p className="text-sm text-muted-foreground">{book.description}</p>
            <div className="flex flex-wrap gap-3">
              <Badge>{formatRating(book.averageRating)} / 5</Badge>
              <Badge variant="outline">{book.approvedReviews.length} objavljenih ocen</Badge>
              {book.externalRating ? <Badge variant="outline">API {book.externalRating.toFixed(1)} / 5</Badge> : null}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6 text-sm">
            <p><strong>Zaloznik:</strong> {book.publisher ?? "-"}</p>
            <p><strong>Datum izdaje:</strong> {book.publishedDate ?? "-"}</p>
            <p><strong>Stevilo strani:</strong> {book.pageCount ?? "-"}</p>
            <p><strong>Kategorije:</strong> {book.categories.length > 0 ? book.categories.join(", ") : "-"}</p>
            {book.externalInfoLink ? (
              <a href={book.externalInfoLink} target="_blank" className="inline-flex items-center gap-2 text-primary">
                Zunanji vir <ExternalLink className="h-4 w-4" />
              </a>
            ) : null}
          </CardContent>
        </Card>

        {session?.user ? (
          <ReviewForm bookId={book.id} />
        ) : (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Za oddajo ocene se prijavi v sistem.
            </CardContent>
          </Card>
        )}
      </aside>
      <section className="space-y-8">
        <Card>
          <CardContent className="space-y-6 p-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              Dodano {format(book.createdAt, "dd.MM.yyyy")}
            </div>
            <article className="space-y-5 text-base leading-8 text-foreground/90">
              {book.content.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </article>
          </CardContent>
        </Card>
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-3xl font-bold">Ocene bralcev</h2>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {formatRating(book.averageRating)}
            </div>
          </div>
          <Separator />
          <div className="grid gap-4">
            {book.approvedReviews.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-sm text-muted-foreground">
                  Knjiga se nima objavljenih ocen.
                </CardContent>
              </Card>
            ) : (
              book.approvedReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="space-y-3 p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <UserCircle2 className="h-4 w-4 text-primary" />
                        <span className="font-medium">{review.user.name ?? review.user.email}</span>
                      </div>
                      <Badge>{review.rating}/5</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment || "Brez komentarja."}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

