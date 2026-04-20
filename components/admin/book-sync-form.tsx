"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { syncBookExternalData } from "@/lib/actions";
import { Button } from "@/components/ui/button";

function SyncButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="outline" size="sm" disabled={pending}>
      {pending ? "Sinhroniziram..." : "Sync API"}
    </Button>
  );
}

export function BookSyncForm({ bookId }: { bookId: string }) {
  const [state, formAction] = useActionState(syncBookExternalData, undefined);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
    if (state?.success) {
      toast.success(state.success);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="bookId" value={bookId} />
      <SyncButton />
    </form>
  );
}
