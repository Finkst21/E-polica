export const dynamic = "force-dynamic";

import { EmailForm } from "@/components/admin/email-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function AdminMessagesPage() {
  const [users, emailLogs] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.emailLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 20
    })
  ]);

  return (
    <main className="space-y-8">
      <div className="space-y-3">
        <Badge variant="outline" className="w-fit">
          Sporocila
        </Badge>
        <h1 className="font-serif text-4xl font-bold">Komunikacija s strankami</h1>
      </div>

      <EmailForm users={users} />

      <Card>
        <CardHeader>
          <CardTitle>Zgodovina emailov</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/70 text-left text-muted-foreground">
                <th className="pb-3">Prejemnik</th>
                <th className="pb-3">Zadeva</th>
                <th className="pb-3">Tip</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {emailLogs.map((item) => (
                <tr key={item.id} className="border-b border-border/40">
                  <td className="py-3">{item.toEmail}</td>
                  <td className="py-3">{item.subject}</td>
                  <td className="py-3">{item.type}</td>
                  <td className="py-3">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </main>
  );
}
