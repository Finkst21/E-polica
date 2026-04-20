export const dynamic = "force-dynamic";

import { BookOpenText, ChartColumnIncreasing, Mail, MessageSquareMore, Upload, Users } from "lucide-react";

import { ActivityChart } from "@/components/admin/activity-chart";
import { ReviewDistributionChart } from "@/components/admin/review-distribution-chart";
import { ReviewModeration } from "@/components/admin/review-moderation";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
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
    <main className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Badge variant="outline" className="w-fit">
            Admin nadzorna plosca
          </Badge>
          <h1 className="font-serif text-4xl font-bold">Pregled najpomembnejsih podatkov</h1>
          <p className="text-muted-foreground">Filtriran pregled vsebine, uporabnikov, ocen, emailov in uvozov.</p>
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

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Knjige" value={dashboard.stats.booksCount} description="Skupno knjig v katalogu." icon={BookOpenText} />
        <StatCard title="Uporabniki" value={dashboard.stats.usersCount} description={`Novih v obdobju: ${dashboard.stats.periodUsers}.`} icon={Users} />
        <StatCard title="Ocene" value={dashboard.stats.reviewsCount} description={`Novih v obdobju: ${dashboard.stats.periodReviews}.`} icon={MessageSquareMore} />
        <StatCard title="Cakajoce ocene" value={dashboard.stats.pendingReviewsCount} description="Potrebujejo moderiranje." icon={ChartColumnIncreasing} />
        <StatCard title="Poslana sporocila" value={dashboard.stats.emailsCount} description="Zabelezeni email dogodki." icon={Mail} />
        <StatCard title="Uvozi" value={dashboard.stats.importsCount} description="Zadnji CSV/Excel uvozi." icon={Upload} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Aktivnost platforme</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityChart data={dashboard.activity} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Porazdelitev ocen</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewDistributionChart data={dashboard.reviewDistribution} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
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
                  <th className="pb-3">Ocene</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.topBooks.map((book) => (
                  <tr key={book.id} className="border-b border-border/40">
                    <td className="py-3">
                      <div className="font-medium">{book.title}</div>
                      <div className="text-muted-foreground">{book.author}</div>
                    </td>
                    <td className="py-3">{book.averageRating.toFixed(1)}</td>
                    <td className="py-3">{book.hasExternal ? book.externalRating.toFixed(1) : "-"}</td>
                    <td className="py-3">{book.ratingsCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Zadnji email dogodki</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {dashboard.recentEmails.map((item) => (
                <div key={item.id} className="rounded-2xl border border-border/70 p-4">
                  <p className="font-medium">{item.subject}</p>
                  <p className="text-muted-foreground">{item.toEmail}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.status}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Zadnji uvozi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {dashboard.recentImports.map((item) => (
                <div key={item.id} className="rounded-2xl border border-border/70 p-4">
                  <p className="font-medium">{item.fileName}</p>
                  <p className="text-muted-foreground">Dodani: {item.importedCount}, posodobljeni: {item.updatedCount}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-3xl font-bold">Cakajoce ocene</h2>
        <ReviewModeration reviews={dashboard.pendingReviews} />
      </section>
    </main>
  );
}

