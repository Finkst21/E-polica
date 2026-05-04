import Image from "next/image";
import Link from "next/link";
import { BookOpenText, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type HeroSectionProps = {
  featuredBooks: Array<{
    id: string;
    title: string;
    author: string;
    coverImage: string | null;
  }>;
};

export function HeroSection({ featuredBooks }: HeroSectionProps) {
  const previewBooks = featuredBooks.slice(0, 3);

  return (
    <section className="border-b border-border bg-card">
      <div className="container-shell grid gap-8 py-10 lg:grid-cols-[1fr_420px] lg:items-center">
        <div className="max-w-3xl space-y-6">
          <Badge variant="outline" className="w-fit">
            Bralna skupnost
          </Badge>
          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
              Odkrij knjigo, jo preberi in deli svoje mnenje.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              E-polica je prostor za bralce, ki zelijo hitro najti zanimive knjige,
              preveriti ocene drugih uporabnikov in oddati svojo recenzijo.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="gap-2">
              <Link href="/books">
                <BookOpenText className="h-4 w-4" />
                Razisci katalog
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/register">
                <Star className="h-4 w-4" />
                Ustvari racun
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative min-h-[320px]">
          <div className="absolute inset-0 rounded-lg border border-border bg-background" />
          <div className="relative grid h-full grid-cols-3 gap-3 p-4">
            {previewBooks.map((book, index) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className={`group relative overflow-hidden rounded-lg border border-border bg-secondary ${
                  index === 1 ? "mt-8" : index === 2 ? "mt-16" : ""
                }`}
              >
                <div className="relative aspect-[3/4]">
                  {book.coverImage ? (
                    <Image src={book.coverImage} alt={book.title} fill priority={index === 0} className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
                      {book.title}
                    </div>
                  )}
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-background/95 p-3">
                  <p className="line-clamp-2 text-sm font-semibold">{book.title}</p>
                  <p className="line-clamp-1 text-xs text-muted-foreground">{book.author}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
