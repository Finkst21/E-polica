import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="container-shell space-y-6 py-12">
      <LoginForm callbackUrl={params.callbackUrl} />
      <p className="text-center text-sm text-muted-foreground">
        Še nimaš računa? <Link href="/register" className="font-semibold text-primary">Registriraj se</Link>
      </p>
    </main>
  );
}
