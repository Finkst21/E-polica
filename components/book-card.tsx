import Image from "next/image";
import Link from "next/link";
import { BookOpen, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatRating } from "@/lib/utils";

type BookCardProps = {
  book: {
    id: string;
    title: string;
    author: string;
    description: string;
    coverImage: string | null;
    averageRating: number | null;
    ratingsCount: number;
  };
};

export function BookCard({ book }: BookCardProps) {
  return (
    <Card className="group overflow-hidden">
      <div className="relative aspect-[3/4] overflow-hidden">
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-secondary">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>
      <CardContent className="space-y-4 p-6">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-serif text-2xl font-bold">{book.title}</h3>
              <p className="text-sm text-muted-foreground">{book.author}</p>
            </div>
            <Badge>{book.ratingsCount} ocen</Badge>
          </div>
          <p className="line-clamp-3 text-sm text-muted-foreground">{book.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold">{formatRating(book.averageRating)}</span>
          </div>
          <Button asChild>
            <Link href={`/books/${book.id}`}>Odpri knjigo</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
