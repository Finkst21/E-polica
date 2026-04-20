import { approveReview, deleteReview } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ReviewModerationProps = {
  reviews: Array<{
    id: string;
    comment: string | null;
    rating: number;
    user: { name: string | null; email: string };
    book: { title: string };
  }>;
};

export function ReviewModeration({ reviews }: ReviewModerationProps) {
  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Trenutno ni cakajocih ocen za moderiranje.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="font-semibold">{review.book.title}</p>
              <p className="text-sm text-muted-foreground">
                {review.user.name ?? review.user.email} • {review.rating}/5
              </p>
              <p className="text-sm">{review.comment || "Brez komentarja"}</p>
            </div>
            <div className="flex gap-2">
              <form action={approveReview}>
                <input type="hidden" name="reviewId" value={review.id} />
                <Button type="submit">Odobri</Button>
              </form>
              <form action={deleteReview}>
                <input type="hidden" name="reviewId" value={review.id} />
                <Button type="submit" variant="destructive">
                  Izbrisi
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

