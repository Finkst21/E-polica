"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { registerUser } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? "Počakaj..." : label}
    </Button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState(registerUser, undefined);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Registracija</CardTitle>
        <CardDescription>Ustvari račun za branje, ocenjevanje in komentiranje knjig.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ime</Label>
            <Input id="name" name="name" placeholder="Maja Novak" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="maja@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Geslo</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <SubmitButton label="Ustvari račun" />
        </form>
      </CardContent>
    </Card>
  );
}
