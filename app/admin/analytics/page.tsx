export const dynamic = "force-dynamic";

import { AnalyticsChart } from "@/components/admin/analytics-chart";
import { ExternalComparisonChart } from "@/components/admin/external-comparison-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminAnalytics } from "@/lib/data";

export default async function AdminAnalyticsPage({
  searchParams
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const params = await searchParams;
  const period = Number(params.period ?? "30");
  const analytics = await getAdminAnalytics(period);

  return (
    <main className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Badge variant="outline" className="w-fit">
            Analitika
          </Badge>
          <h1 className="font-serif text-4xl font-bold">Grafi, primerjave in preglednice</h1>
        </div>
        <form className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-3">
          <span className="text-sm text-muted-foreground">Obdobje</span>
          <select name="period" defaultValue={String(period)} className="rounded-xl border border-input bg-background px-3 py-2 text-sm">
            <option value="7">7 dni</option>
            <option value="30">30 dni</option>
            <option value="90">90 dni</option>
            <option value="365">365 dni</option>
          </select>
          <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Uporabi
          </button>
        </form>
      </div>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Povprecna interna ocena po knjigah</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart data={analytics.chartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Primerjava interne in zunanje ocene</CardTitle>
          </CardHeader>
          <CardContent>
            <ExternalComparisonChart data={analytics.comparisonData} />
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Najbolje ocenjene knjige</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/70 text-left text-muted-foreground">
                <th className="pb-3">Knjiga</th>
                <th className="pb-3">Interna ocena</th>
                <th className="pb-3">Zunanja ocena</th>
                <th className="pb-3">Stevilo ocen</th>
              </tr>
            </thead>
            <tbody>
              {analytics.bestRatedBooks.map((book) => (
                <tr key={book.id} className="border-b border-border/40">
                  <td className="py-3 font-medium">{book.title}</td>
                  <td className="py-3">{book.averageRating.toFixed(1)}</td>
                  <td className="py-3">{book.hasExternal ? book.externalRating.toFixed(1) : "-"}</td>
                  <td className="py-3">{book.ratingsCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </main>
  );
}

