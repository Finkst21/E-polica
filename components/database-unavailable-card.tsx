import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DatabaseUnavailableCard() {
  return (
    <Card className="border-destructive/40 bg-destructive/5">
      <CardHeader>
        <CardTitle>Baza ni dosegljiva</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>
          Aplikacija ne more dostopati do PostgreSQL baze. Na Vercelu nastavi
          okoljsko spremenljivko DATABASE_URL na gostovano PostgreSQL povezavo
          in pripravi shemo:
        </p>
        <code className="block rounded-lg bg-background p-3 text-foreground">npm run db:setup</code>
      </CardContent>
    </Card>
  );
}
