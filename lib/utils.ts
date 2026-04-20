import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRating(value: number | null | undefined) {
  if (!value) {
    return "Ni ocen";
  }

  return value.toFixed(1);
}
