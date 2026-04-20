import Link from "next/link";

import { RegisterForm } from "@/components/auth/auth-form";

export default function RegisterPage() {
  return (
    <main className="container-shell space-y-6 py-12">
      <RegisterForm />
      <p className="text-center text-sm text-muted-foreground">
        Že imaš račun? <Link href="/login" className="font-semibold text-primary">Prijavi se</Link>
      </p>
    </main>
  );
}
