import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Ime mora vsebovati vsaj 2 znaka."),
  email: z.string().email("Vnesi veljaven email naslov."),
  password: z.string().min(6, "Geslo mora vsebovati vsaj 6 znakov.")
});

export const loginSchema = z.object({
  email: z.string().email("Vnesi veljaven email naslov."),
  password: z.string().min(6, "Geslo mora vsebovati vsaj 6 znakov.")
});

export const bookSchema = z.object({
  title: z.string().min(2, "Naslov je obvezen."),
  author: z.string().min(2, "Avtor je obvezen."),
  description: z.string().min(20, "Opis naj vsebuje vsaj 20 znakov."),
  content: z.string().min(100, "Vsebina naj vsebuje vsaj 100 znakov."),
  coverImage: z
    .string()
    .url("Naslovnica mora biti veljaven URL.")
    .or(z.literal(""))
    .optional()
});

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z
    .string()
    .max(500, "Komentar je lahko dolg največ 500 znakov.")
    .optional()
    .or(z.literal(""))
});
