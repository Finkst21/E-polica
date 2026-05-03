"use server";

import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { signIn, signOut } from "@/auth";
import { requireAdmin, requireUser } from "@/lib/auth-helpers";
import { sendTrackedEmail, wrapEmailTemplate } from "@/lib/email";
import { fetchGoogleBooksData } from "@/lib/google-books";
import { parseBookImportFile } from "@/lib/import-books";
import { prisma } from "@/lib/prisma";
import { adminEmailSchema, bookSchema, registerSchema, reviewSchema } from "@/lib/validations";

function fileToDataUrl(file: File | null) {
  if (!file || file.size === 0) {
    return Promise.resolve("");
  }

  return file.arrayBuffer().then((buffer) => {
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:${file.type};base64,${base64}`;
  });
}

function serializeCategories(categories: string[]) {
  return JSON.stringify(categories);
}

function parseStoredCategories(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function revalidateAdminPaths() {
  revalidatePath("/books");
  revalidatePath("/admin");
  revalidatePath("/admin/books");
  revalidatePath("/admin/users");
  revalidatePath("/admin/analytics");
  revalidatePath("/admin/messages");
  revalidatePath("/admin/import-export");
}

export async function registerUser(_: unknown, formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Neveljavni podatki." };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email }
  });

  if (existingUser) {
    return { error: "Uporabnik s tem email naslovom ze obstaja." };
  }

  const password = await bcrypt.hash(parsed.data.password, 10);

  await prisma.user.create({
    data: {
      ...parsed.data,
      password
    }
  });

  await sendTrackedEmail({
    to: parsed.data.email,
    subject: "Dobrodosli v E-polica",
    html: wrapEmailTemplate(
      "Dobrodosli",
      `<p>Racun za ${parsed.data.name} je uspesno ustvarjen. Zdaj lahko pregledujete knjige, berete vsebine in oddajate ocene.</p>`
    ),
    type: "WELCOME"
  });

  await signIn("credentials", {
    email: parsed.data.email,
    password: parsed.data.password,
    redirectTo: "/books"
  });
}

export async function logoutUser() {
  await signOut({
    redirectTo: "/"
  });
}

export async function upsertBook(_: unknown, formData: FormData) {
  await requireAdmin();

  const file = formData.get("coverFile");
  const coverImageValue = formData.get("coverImage");

  const parsed = bookSchema.safeParse({
    title: formData.get("title"),
    author: formData.get("author"),
    description: formData.get("description"),
    content: formData.get("content"),
    coverImage: coverImageValue
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Neveljavni podatki." };
  }

  const bookId = String(formData.get("bookId") ?? "");
  const uploadedImage = file instanceof File ? await fileToDataUrl(file) : "";
  const coverImage =
    uploadedImage || (parsed.data.coverImage && parsed.data.coverImage.length > 0
      ? parsed.data.coverImage
      : null);

  const data = {
    title: parsed.data.title,
    author: parsed.data.author,
    description: parsed.data.description,
    content: parsed.data.content,
    coverImage,
    publisher: String(formData.get("publisher") ?? "").trim() || null,
    publishedDate: String(formData.get("publishedDate") ?? "").trim() || null,
    pageCount: formData.get("pageCount") ? Number(formData.get("pageCount")) : null,
    categories: serializeCategories(
      String(formData.get("categories") ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  };

  if (bookId) {
    await prisma.book.update({
      where: { id: bookId },
      data
    });
  } else {
    await prisma.book.create({
      data
    });
  }

  revalidateAdminPaths();

  return { success: true };
}

export async function deleteBook(formData: FormData) {
  await requireAdmin();

  const bookId = String(formData.get("bookId") ?? "");

  await prisma.book.delete({
    where: { id: bookId }
  });

  revalidateAdminPaths();
}

export async function submitReview(_: unknown, formData: FormData) {
  const session = await requireUser();
  const bookId = String(formData.get("bookId") ?? "");
  const parsed = reviewSchema.safeParse({
    rating: formData.get("rating"),
    comment: formData.get("comment")
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Neveljavni podatki." };
  }

  await prisma.review.upsert({
    where: {
      userId_bookId: {
        userId: session.user.id,
        bookId
      }
    },
    update: {
      rating: parsed.data.rating,
      comment: parsed.data.comment || null,
      approved: false
    },
    create: {
      userId: session.user.id,
      bookId,
      rating: parsed.data.rating,
      comment: parsed.data.comment || null,
      approved: false
    }
  });

  revalidatePath(`/books/${bookId}`);
  revalidatePath("/admin");

  return { success: "Ocena je shranjena in caka na moderiranje." };
}

export async function approveReview(formData: FormData) {
  const session = await requireAdmin();
  const reviewId = String(formData.get("reviewId") ?? "");

  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { approved: true },
    include: {
      user: true,
      book: true
    }
  });

  await sendTrackedEmail({
    to: review.user.email,
    subject: `Tvoja ocena knjige "${review.book.title}" je odobrena`,
    html: wrapEmailTemplate(
      "Ocena je objavljena",
      `<p>Admin je odobril tvojo oceno za knjigo <strong>${review.book.title}</strong>. Zdaj je vidna ostalim uporabnikom.</p>`
    ),
    type: "REVIEW_APPROVED",
    triggeredById: session.user.id
  });

  revalidateAdminPaths();
  revalidatePath(`/books/${review.bookId}`);
}

export async function deleteReview(formData: FormData) {
  await requireAdmin();

  const reviewId = String(formData.get("reviewId") ?? "");

  await prisma.review.delete({
    where: { id: reviewId }
  });

  revalidateAdminPaths();
}

export async function updateUserRole(formData: FormData) {
  await requireAdmin();

  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "USER");

  await prisma.user.update({
    where: { id: userId },
    data: {
      role: role === "ADMIN" ? "ADMIN" : "USER"
    }
  });

  revalidateAdminPaths();
}

export async function syncBookExternalData(_: unknown, formData: FormData) {
  await requireAdmin();

  const bookId = String(formData.get("bookId") ?? "");
  const book = await prisma.book.findUnique({
    where: { id: bookId }
  });

  if (!book) {
    return { error: "Knjiga ni bila najdena." };
  }

  const external = await fetchGoogleBooksData(book.title, book.author);

  if (!external) {
    return { error: "Zunanji API ni vrnil zadetka za to knjigo." };
  }

  await prisma.book.update({
    where: { id: bookId },
    data: {
      publisher: external.publisher ?? book.publisher,
      publishedDate: external.publishedDate ?? book.publishedDate,
      pageCount: external.pageCount ?? book.pageCount,
      categories: serializeCategories(
        external.categories.length > 0 ? external.categories : parseStoredCategories(book.categories)
      ),
      externalSource: external.externalSource,
      externalId: external.externalId,
      externalRating: external.externalRating,
      externalRatingsCount: external.externalRatingsCount,
      externalInfoLink: external.externalInfoLink,
      externalPreviewLink: external.externalPreviewLink,
      description: external.description ?? book.description,
      coverImage: book.coverImage ?? external.coverImage
    }
  });

  revalidateAdminPaths();
  revalidatePath(`/books/${bookId}`);

  return { success: "Podatki iz zunanjega API-ja so osvezeni." };
}

export async function importBooksFromFile(_: unknown, formData: FormData) {
  const session = await requireAdmin();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Izberi CSV ali Excel datoteko." };
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  const format =
    extension === "csv"
      ? "CSV"
      : extension === "xlsx"
        ? "XLSX"
        : extension === "xls"
          ? "XLS"
          : null;

  if (!format) {
    return { error: "Podprt je le uvoz CSV, XLSX ali XLS." };
  }

  const rows = await parseBookImportFile(file);
  let importedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;

  for (const row of rows) {
    if (!row.title || !row.author || !row.description || !row.content) {
      skippedCount += 1;
      continue;
    }

    const payload: Prisma.BookUncheckedCreateInput = {
      title: row.title,
      author: row.author,
      description: row.description,
      content: row.content,
      coverImage: row.coverImage,
      publisher: row.publisher,
      publishedDate: row.publishedDate,
      pageCount: row.pageCount,
      categories: serializeCategories(row.categories)
    };

    const existing = await prisma.book.findFirst({
      where: {
        title: row.title,
        author: row.author
      }
    });

    if (existing) {
      await prisma.book.update({
        where: { id: existing.id },
        data: payload
      });
      updatedCount += 1;
    } else {
      await prisma.book.create({
        data: payload
      });
      importedCount += 1;
    }
  }

  await prisma.importJob.create({
    data: {
      fileName: file.name,
      format,
      importedCount,
      updatedCount,
      skippedCount,
      notes: `Uvoz zakljucen. Skupaj vrstic: ${rows.length}.`,
      triggeredById: session.user.id
    }
  });

  revalidateAdminPaths();

  return {
    success: `Uvoz koncan. Dodanih: ${importedCount}, posodobljenih: ${updatedCount}, preskocenih: ${skippedCount}.`
  };
}

export async function sendAdminEmail(_: unknown, formData: FormData) {
  const session = await requireAdmin();
  const parsed = adminEmailSchema.safeParse({
    mode: formData.get("mode"),
    userId: formData.get("userId"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    body: formData.get("body")
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Neveljavni podatki." };
  }

  let recipients: string[] = [];

  if (parsed.data.mode === "ALL_USERS") {
    const users = await prisma.user.findMany({ select: { email: true } });
    recipients = users.map((user) => user.email);
  } else if (parsed.data.mode === "ADMINS") {
    const users = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { email: true }
    });
    recipients = users.map((user) => user.email);
  } else if (parsed.data.mode === "SINGLE" && parsed.data.userId) {
    const user = await prisma.user.findUnique({
      where: { id: parsed.data.userId },
      select: { email: true }
    });
    recipients = user ? [user.email] : [];
  } else if (parsed.data.mode === "CUSTOM" && parsed.data.email) {
    recipients = [parsed.data.email];
  }

  if (recipients.length === 0) {
    return { error: "Ni najdenih prejemnikov za izbrani nacin." };
  }

  await Promise.all(
    recipients.map((email) =>
      sendTrackedEmail({
        to: email,
        subject: parsed.data.subject,
        html: wrapEmailTemplate(
          parsed.data.subject,
          parsed.data.body
            .split("\n")
            .map((line) => `<p>${line}</p>`)
            .join("")
        ),
        text: parsed.data.body,
        type: "MANUAL",
        triggeredById: session.user.id
      })
    )
  );

  revalidateAdminPaths();

  return { success: `Sporocilo je bilo poslano na ${recipients.length} naslovov.` };
}

