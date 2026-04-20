"use client";

import { LogOut } from "lucide-react";

import { logoutUser } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={logoutUser}>
      <Button type="submit" variant="outline" className="gap-2">
        <LogOut className="h-4 w-4" />
        Odjava
      </Button>
    </form>
  );
}
