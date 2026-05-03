export const dynamic = "force-dynamic";

import Link from "next/link";

import { ImportForm } from "@/components/admin/import-form";
import { DatabaseUnavailableCard } from "@/components/database-unavailable-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function AdminImportExportPage() {
  let databaseUnavailable = false;
  const importJobs = await prisma.importJob
    .findMany({
      orderBy: { createdAt: "desc" },
      take: 20
    })
    .catch(() => {
      databaseUnavailable = true;
      return [];
    });

  return (
    <main className="space-y-6">
      <div className="space-y-3">
        <Badge variant="outline" className="w-fit">
          Uvoz in izvoz
        </Badge>
        <h1 className="text-3xl font-bold">Uvoz in izvoz</h1>
      </div>

      {databaseUnavailable ? <DatabaseUnavailableCard /> : null}

      <section className="grid gap-4 xl:grid-cols-2">
        <ImportForm />
        <Card>
          <CardHeader>
            <CardTitle>PDF izvozi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Generiraj PDF porocila za knjige, uporabnike ali ocene neposredno iz admin panela.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/admin/reports/export?entity=books" target="_blank">
                  Izvozi knjige
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/reports/export?entity=users" target="_blank">
                  Izvozi uporabnike
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/reports/export?entity=reviews" target="_blank">
                  Izvozi ocene
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Zgodovina uvozov</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/70 text-left text-muted-foreground">
                <th className="pb-3">Datoteka</th>
                <th className="pb-3">Format</th>
                <th className="pb-3">Dodano</th>
                <th className="pb-3">Posodobljeno</th>
                <th className="pb-3">Preskoceno</th>
              </tr>
            </thead>
            <tbody>
              {importJobs.map((item) => (
                <tr key={item.id} className="border-b border-border/40">
                  <td className="py-3">{item.fileName}</td>
                  <td className="py-3">{item.format}</td>
                  <td className="py-3">{item.importedCount}</td>
                  <td className="py-3">{item.updatedCount}</td>
                  <td className="py-3">{item.skippedCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </main>
  );
}
