import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { createAdminPdfReport } from "@/lib/pdf";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth().catch(() => null);

  if (session?.user?.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const entity = searchParams.get("entity") ?? "books";

  let title = "E-polica porocilo";
  let sections: Array<{ title: string; rows: string[] }> = [];

  try {
    if (entity === "users") {
      const users = await prisma.user.findMany({
        include: {
          _count: {
            select: { reviews: true }
          }
        },
        orderBy: { createdAt: "desc" },
        take: 30
      });

      title = "Porocilo uporabnikov";
      sections = [
        {
          title: "Uporabniki",
          rows: users.map((user) => `${user.name ?? "Brez imena"} | ${user.email} | ${user.role} | ocene: ${user._count.reviews}`)
        }
      ];
    } else if (entity === "reviews") {
      const reviews = await prisma.review.findMany({
        include: {
          book: true,
          user: true
        },
        orderBy: { createdAt: "desc" },
        take: 30
      });

      title = "Porocilo ocen";
      sections = [
        {
          title: "Ocene",
          rows: reviews.map((review) => `${review.book.title} | ${review.user.email} | ${review.rating}/5 | ${review.approved ? "odobreno" : "cakajoce"}`)
        }
      ];
    } else {
      const books = await prisma.book.findMany({
        include: {
          reviews: {
            where: { approved: true }
          }
        },
        orderBy: { createdAt: "desc" },
        take: 30
      });

      title = "Porocilo knjig";
      sections = [
        {
          title: "Knjige",
          rows: books.map((book) => {
            const averageRating =
              book.reviews.length > 0
                ? (book.reviews.reduce((sum, review) => sum + review.rating, 0) / book.reviews.length).toFixed(1)
                : "0.0";
            return `${book.title} | ${book.author} | interna ocena: ${averageRating} | zunanja ocena: ${book.externalRating ?? "-"}`;
          })
        }
      ];
    }
  } catch {
    return new NextResponse("Database unavailable", { status: 503 });
  }

  const bytes = await createAdminPdfReport(title, sections);

  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=\"${entity}-report.pdf\"`
    }
  });
}
