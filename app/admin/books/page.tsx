export const dynamic = "force-dynamic";

import { BookSyncForm } from "@/components/admin/book-sync-form";
import { BookForm } from "@/components/admin/book-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteBook } from "@/lib/actions";
import { getAdminBooksTable } from "@/lib/data";

export default async function AdminBooksPage({
  searchParams
}: {
  searchParams: Promise<{ search?: string; sort?: "newest" | "title" | "rating" | "external"; external?: "all" | "synced" | "missing"; edit?: string }>;
}) {
  const params = await searchParams;
  const books = await getAdminBooksTable({
    search: params.search,
    sort: params.sort,
    external: params.external
  });
  const editBook = params.edit ? books.find((book) => book.id === params.edit) : undefined;

  return (
    <main className="space-y-6">
      <div className="space-y-3">
        <Badge variant="outline" className="w-fit">
          Upravljanje knjig
        </Badge>
        <h1 className="text-3xl font-bold">Knjige</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editBook ? `Urejanje: ${editBook.title}` : "Dodaj novo knjigo"}</CardTitle>
        </CardHeader>
        <CardContent>
          <BookForm book={editBook} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preglednica knjig</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="grid gap-4 md:grid-cols-[1fr_180px_180px_auto]">
            <input
              name="search"
              defaultValue={params.search ?? ""}
              placeholder="Naslov, avtor ali zaloznik"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            />
            <select name="sort" defaultValue={params.sort ?? "newest"} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="newest">Najnovejse</option>
              <option value="title">Po naslovu</option>
              <option value="rating">Po interni oceni</option>
              <option value="external">Po zunanji oceni</option>
            </select>
            <select name="external" defaultValue={params.external ?? "all"} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="all">Vse knjige</option>
              <option value="synced">Samo sinhronizirane</option>
              <option value="missing">Brez API podatkov</option>
            </select>
            <Button type="submit">Filtriraj</Button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/70 text-left text-muted-foreground">
                  <th className="pb-3">Knjiga</th>
                  <th className="pb-3">Zaloznik</th>
                  <th className="pb-3">Interna ocena</th>
                  <th className="pb-3">Zunanja ocena</th>
                  <th className="pb-3">Stanje</th>
                  <th className="pb-3">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className="border-b border-border/40 align-top">
                    <td className="py-4">
                      <div className="font-medium">{book.title}</div>
                      <div className="text-muted-foreground">{book.author}</div>
                    </td>
                    <td className="py-4">{book.publisher ?? "-"}</td>
                    <td className="py-4">{book.averageRating.toFixed(1)} ({book.ratingsCount})</td>
                    <td className="py-4">{book.externalRating?.toFixed(1) ?? "-"}</td>
                    <td className="py-4">{book.externalSource ? "API sync" : "Brez API"}</td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline" size="sm">
                          <a href={`/admin/books?edit=${book.id}`}>Uredi</a>
                        </Button>
                        <BookSyncForm bookId={book.id} />
                        <form action={deleteBook}>
                          <input type="hidden" name="bookId" value={book.id} />
                          <Button type="submit" variant="destructive" size="sm">
                            Izbrisi
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

