import Link from "next/link";
import { BookOpenText } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
        <BookOpenText className="h-5 w-5" />
      </div>
      <div>
        <div className="font-serif text-xl font-bold">E-polica</div>
        <div className="text-xs text-muted-foreground">Branje, ocene in analitika</div>
      </div>
    </Link>
  );
}
