export const dynamic = "force-dynamic";

import { BookCard } from "@/components/book-card";
import { BookFilters } from "@/components/books/book-filters";
import { Badge } from "@/components/ui/badge";
import { getBooks } from "@/lib/data";

export default async function BooksPage({
  searchParams
}: {
  searchParams: Promise<{ search?: string; sort?: "newest" | "rating" | "title" }>;
}) {
  const params = await searchParams;
  const books = await getBooks({
    search: params.search,
    sort: params.sort
  });

  return (
    <main className="container-shell space-y-6 py-6">
      <div className="space-y-3">
        <Badge variant="outline" className="w-fit">
          Katalog knjig
        </Badge>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pregled vseh knjig</h1>
            <p className="text-muted-foreground">
              Išči po naslovu, avtorju ali opisu in razvrsti katalog po oceni ali datumu.
            </p>
          </div>
          <Badge>{books.length} rezultatov</Badge>
        </div>
      </div>
      <BookFilters />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </section>
    </main>
  );
}
