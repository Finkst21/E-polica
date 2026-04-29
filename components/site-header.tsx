import Link from "next/link";

import { auth } from "@/auth";
import { LogoutButton } from "@/components/auth/logout-button";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export async function SiteHeader() {
  const session = await auth().catch(() => null);
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="container-shell flex min-h-20 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex">
          <Link className="text-sm font-medium text-muted-foreground transition hover:text-foreground" href="/">
            Domov
          </Link>
          <Link className="text-sm font-medium text-muted-foreground transition hover:text-foreground" href="/books">
            Knjige
          </Link>
          {isAdmin ? (
            <Link className="text-sm font-medium text-muted-foreground transition hover:text-foreground" href="/admin">
              Admin
            </Link>
          ) : null}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session?.user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">{session.user.name ?? session.user.email}</p>
                <p className="text-xs text-muted-foreground">{session.user.role}</p>
              </div>
              <LogoutButton />
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Prijava</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Registracija</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
