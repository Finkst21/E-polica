"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";

import { sendAdminEmail } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function SubmitButton() {
  const { pending } = useFormStatus();

  return <Button type="submit">{pending ? "Posiljam..." : "Poslji sporocilo"}</Button>;
}

export function EmailForm({
  users
}: {
  users: Array<{ id: string; name: string | null; email: string }>;
}) {
  const [state, formAction] = useActionState(sendAdminEmail, undefined);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
    if (state?.success) {
      toast.success(state.success);
    }
  }, [state]);

  return (
    <form action={formAction} className="grid gap-4 rounded-lg border border-border bg-card p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="mode">Prejemniki</Label>
          <Select id="mode" name="mode" defaultValue="ALL_USERS">
            <option value="ALL_USERS">Vsi uporabniki</option>
            <option value="ADMINS">Samo admini</option>
            <option value="SINGLE">Posamezen uporabnik</option>
            <option value="CUSTOM">Poljuben email</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="userId">Uporabnik</Label>
          <Select id="userId" name="userId" defaultValue="">
            <option value="">Izberi uporabnika</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name ?? user.email}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email naslov po meri</Label>
        <Input id="email" name="email" placeholder="nekdo@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Zadeva</Label>
        <Input id="subject" name="subject" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="body">Sporocilo</Label>
        <Textarea id="body" name="body" className="min-h-[220px]" required />
      </div>
      <SubmitButton />
    </form>
  );
}
