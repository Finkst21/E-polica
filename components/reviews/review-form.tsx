"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { submitReview } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Shranjujem..." : "Shrani oceno"}
    </Button>
  );
}

export function ReviewForm({ bookId }: { bookId: string }) {
  const [state, formAction] = useActionState(submitReview, undefined);
  const [rating, setRating] = useState(5);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }

    if (state?.success) {
      toast.success(state.success);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4 rounded-[28px] border border-border/70 bg-card/90 p-6">
      <input type="hidden" name="bookId" value={bookId} />
      <input type="hidden" name="rating" value={rating} />
      <div className="space-y-2">
        <p className="text-sm font-medium">Tvoja ocena</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button key={value} type="button" onClick={() => setRating(value)} className="p-1">
              <Star
                className={`h-7 w-7 ${
                  value <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <Textarea name="comment" placeholder="Dodaj mnenje o knjigi, slogu ali zgodbi." />
      <SubmitButton />
    </form>
  );
}
