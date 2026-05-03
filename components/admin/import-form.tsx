"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { importBooksFromFile } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();

  return <Button type="submit">{pending ? "Uvozim..." : "Uvozi datoteko"}</Button>;
}

export function ImportForm() {
  const [state, formAction] = useActionState(importBooksFromFile, undefined);

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
      <div className="space-y-2">
        <Label htmlFor="file">CSV ali Excel datoteka</Label>
        <Input id="file" name="file" type="file" accept=".csv,.xls,.xlsx" required />
      </div>
      <p className="text-sm text-muted-foreground">
        Podprti stolpci: title, author, description, content, coverImage, publisher, publishedDate, pageCount, categories
      </p>
      <SubmitButton />
    </form>
  );
}
