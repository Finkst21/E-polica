import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DatabaseUnavailableCard() {
  return (
    <Card className="border-destructive/40 bg-destructive/5">
      <CardHeader>
        <CardTitle>Baza ni dosegljiva</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>PostgreSQL ne tece na localhost:5432. Zazeni lokalno bazo in pripravi shemo:</p>
        <code className="block rounded-lg bg-background p-3 text-foreground">npm run db:up &amp;&amp; npm run db:setup</code>
      </CardContent>
    </Card>
  );
}
