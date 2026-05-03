export const dynamic = "force-dynamic";

import { BookOpenText, MessageSquareMore, Star, Users } from "lucide-react";

import { BookRatingsChart } from "@/components/admin/book-ratings-chart";
import { ReviewDistributionChart } from "@/components/admin/review-distribution-chart";
import { ReviewModeration } from "@/components/admin/review-moderation";
import { DatabaseUnavailableCard } from "@/components/database-unavailable-card";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminDashboard } from "@/lib/data";

export default async function AdminPage({
  searchParams
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const params = await searchParams;
  const period = Number(params.period ?? "30");
  const dashboard = await getAdminDashboard(period);

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin pregled</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Osnovni pregled knjig, uporabnikov in ocen v aplikaciji.
          </p>
        </div>

        <form className="flex w-full gap-2 md:w-auto">
          <select name="period" defaultValue={String(period)} className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm md:w-36">
            <option value="7">7 dni</option>
            <option value="30">30 dni</option>
            <option value="90">90 dni</option>
            <option value="365">365 dni</option>
          </select>
          <button type="submit" className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
            Prikazi
          </button>
        </form>
      </div>

      {dashboard.databaseUnavailable ? <DatabaseUnavailableCard /> : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Knjige" value={dashboard.stats.booksCount} description="Vse knjige v bazi." icon={BookOpenText} />
        <StatCard title="Uporabniki" value={dashboard.stats.usersCount} description={`Novih: ${dashboard.stats.periodUsers}.`} icon={Users} />
        <StatCard title="Ocene" value={dashboard.stats.reviewsCount} description={`Novih: ${dashboard.stats.periodReviews}.`} icon={MessageSquareMore} />
        <StatCard title="Cakajoce" value={dashboard.stats.pendingReviewsCount} description="Ocene za pregled." icon={Star} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-lg shadow-none">
          <CardHeader>
            <CardTitle className="text-xl">Povprecne ocene knjig</CardTitle>
          </CardHeader>
          <CardContent>
            <BookRatingsChart data={dashboard.bookRatingChart} />
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-none">
          <CardHeader>
            <CardTitle className="text-xl">Porazdelitev ocen</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewDistributionChart data={dashboard.reviewDistribution} />
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-lg shadow-none">
        <CardHeader>
          <CardTitle className="text-xl">Najbolje ocenjene knjige</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium">Knjiga</th>
                <th className="pb-3 font-medium">Avtor</th>
                <th className="pb-3 font-medium">Ocena</th>
                <th className="pb-3 font-medium">Stevilo ocen</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.topBooks.slice(0, 6).map((book) => (
                <tr key={book.id} className="border-b border-border/60">
                  <td className="py-3 font-medium">{book.title}</td>
                  <td className="py-3 text-muted-foreground">{book.author}</td>
                  <td className="py-3">{book.averageRating.toFixed(1)}</td>
                  <td className="py-3">{book.ratingsCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Cakajoce ocene</h2>
        <ReviewModeration reviews={dashboard.pendingReviews} />
      </section>
    </main>
  );
}
