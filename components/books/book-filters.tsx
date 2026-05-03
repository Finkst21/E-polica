"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function BookFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-[1fr_200px]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          defaultValue={searchParams.get("search") ?? ""}
          onChange={(event) => updateParam("search", event.target.value)}
          placeholder="Išči po naslovu, avtorju ali opisu"
          className="pl-10"
        />
      </div>
      <Select
        defaultValue={searchParams.get("sort") ?? "newest"}
        onChange={(event) => updateParam("sort", event.target.value)}
      >
        <option value="newest">Najnovejše</option>
        <option value="rating">Najbolje ocenjene</option>
        <option value="title">Po naslovu</option>
      </Select>
    </div>
  );
}
