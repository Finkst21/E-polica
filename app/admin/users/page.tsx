export const dynamic = "force-dynamic";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRoleForm } from "@/components/admin/user-role-form";
import { getAdminUsersTable } from "@/lib/data";

export default async function AdminUsersPage({
  searchParams
}: {
  searchParams: Promise<{ search?: string; role?: "all" | "USER" | "ADMIN"; sort?: "newest" | "name" | "reviews" }>;
}) {
  const params = await searchParams;
  const users = await getAdminUsersTable({
    search: params.search,
    role: params.role,
    sort: params.sort
  });

  return (
    <main className="space-y-8">
      <div className="space-y-3">
        <Badge variant="outline" className="w-fit">
          Upravljanje uporabnikov
        </Badge>
        <h1 className="font-serif text-4xl font-bold">Filtriran pregled uporabnikov in vlog</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preglednica uporabnikov</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="grid gap-4 md:grid-cols-[1fr_180px_180px_auto]">
            <input
              name="search"
              defaultValue={params.search ?? ""}
              placeholder="Ime ali email"
              className="h-11 rounded-2xl border border-input bg-background px-4 text-sm"
            />
            <select name="role" defaultValue={params.role ?? "all"} className="h-11 rounded-2xl border border-input bg-background px-4 text-sm">
              <option value="all">Vse vloge</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <select name="sort" defaultValue={params.sort ?? "newest"} className="h-11 rounded-2xl border border-input bg-background px-4 text-sm">
              <option value="newest">Najnovejsi</option>
              <option value="name">Po imenu</option>
              <option value="reviews">Po stevilu ocen</option>
            </select>
            <button type="submit" className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Filtriraj
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/70 text-left text-muted-foreground">
                  <th className="pb-3">Uporabnik</th>
                  <th className="pb-3">Vloga</th>
                  <th className="pb-3">Ocene</th>
                  <th className="pb-3">Akcija</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border/40 align-top">
                    <td className="py-4">
                      <div className="font-medium">{user.name ?? "Brez imena"}</div>
                      <div className="text-muted-foreground">{user.email}</div>
                    </td>
                    <td className="py-4">{user.role}</td>
                    <td className="py-4">{user._count.reviews}</td>
                    <td className="py-4">
                      <UserRoleForm userId={user.id} role={user.role} />
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

