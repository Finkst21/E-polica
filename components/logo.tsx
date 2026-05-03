import Link from "next/link";
import { BookOpenText } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <BookOpenText className="h-5 w-5" />
      </div>
      <div>
        <div className="text-lg font-semibold">E-polica</div>
        <div className="text-xs text-muted-foreground">Knjige in ocene</div>
      </div>
    </Link>
  );
}
