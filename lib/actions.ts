"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { signIn, signOut } from "@/auth";
import { requireAdmin, requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { bookSchema, registerSchema, reviewSchema } from "@/lib/validations";

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

function revalidateAdminPaths() {
  revalidatePath("/books");
  revalidatePath("/admin");
  revalidatePath("/admin/books");
  revalidatePath("/admin/users");
  revalidatePath("/admin/analytics");
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
  await requireAdmin();
  const reviewId = String(formData.get("reviewId") ?? "");

  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { approved: true },
    include: {
      user: true,
      book: true
    }
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

