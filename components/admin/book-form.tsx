"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { upsertBook } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type BookFormProps = {
  book?: {
    id: string;
    title: string;
    author: string;
    description: string;
    content: string;
    coverImage: string | null;
    publisher: string | null;
    publishedDate: string | null;
    pageCount: number | null;
    categories: string[];
  };
};

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Shranjujem..." : isEditing ? "Posodobi knjigo" : "Dodaj knjigo"}
    </Button>
  );
}

export function BookForm({ book }: BookFormProps) {
  const [state, formAction] = useActionState(upsertBook, undefined);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
      return;
    }

    if (state?.success) {
      toast.success(book ? "Knjiga je bila posodobljena." : "Knjiga je bila dodana.");
    }
  }, [book, state]);

  return (
    <form action={formAction} className="grid gap-4 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="bookId" value={book?.id ?? ""} />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Naslov</Label>
          <Input id="title" name="title" defaultValue={book?.title} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Avtor</Label>
          <Input id="author" name="author" defaultValue={book?.author} required />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="publisher">Zaloznik</Label>
          <Input id="publisher" name="publisher" defaultValue={book?.publisher ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="publishedDate">Datum izdaje</Label>
          <Input id="publishedDate" name="publishedDate" defaultValue={book?.publishedDate ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pageCount">Stevilo strani</Label>
          <Input id="pageCount" name="pageCount" type="number" min="1" defaultValue={book?.pageCount ?? undefined} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="categories">Kategorije</Label>
        <Input
          id="categories"
          name="categories"
          defaultValue={book?.categories?.join(", ") ?? ""}
          placeholder="roman, drama, zgodovina"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Opis</Label>
        <Textarea id="description" name="description" defaultValue={book?.description} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Vsebina knjige</Label>
        <Textarea id="content" name="content" defaultValue={book?.content} className="min-h-[260px]" required />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="coverImage">URL naslovnice</Label>
          <Input id="coverImage" name="coverImage" defaultValue={book?.coverImage ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="coverFile">Ali nalozi datoteko</Label>
          <Input id="coverFile" name="coverFile" type="file" accept="image/*" />
        </div>
      </div>
      <SubmitButton isEditing={Boolean(book)} />
    </form>
  );
}

