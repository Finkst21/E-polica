import { Prisma } from "@prisma/client";
import { subDays } from "date-fns";

import { prisma } from "@/lib/prisma";

type AdminDashboardBook = Prisma.BookGetPayload<{
  include: {
    reviews: true;
  };
}>;

type AdminDashboardReview = Prisma.ReviewGetPayload<{
  include: {
    book: true;
    user: true;
  };
}>;

type AdminUserTableItem = Prisma.UserGetPayload<{
  include: {
    _count: {
      select: {
        reviews: true;
      };
    };
  };
}>;

function getDateFilter(days?: number) {
  if (!days || days <= 0) {
    return undefined;
  }

  return subDays(new Date(), days);
}

function parseCategories(value: string | string[]) {
  if (Array.isArray(value)) {
    return value;
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

export async function getBooks({
  search,
  sort = "newest"
}: {
  search?: string;
  sort?: "newest" | "rating" | "title";
}) {
  const where: Prisma.BookWhereInput = search
    ? {
        OR: [
          { title: { contains: search } },
          { author: { contains: search } },
          { description: { contains: search } },
          { publisher: { contains: search } }
        ]
      }
    : {};

  const books: AdminDashboardBook[] = await prisma.book
    .findMany({
      where,
      include: {
        reviews: {
          where: { approved: true }
        }
      },
      orderBy: sort === "title" ? { title: "asc" } : { createdAt: "desc" }
    })
    .catch(() => []);

  const enriched = books.map((book) => ({
    ...book,
    categories: parseCategories(book.categories),
    averageRating:
      book.reviews.length > 0
        ? book.reviews.reduce((total, review) => total + review.rating, 0) / book.reviews.length
        : null,
    ratingsCount: book.reviews.length
  }));

  if (sort === "rating") {
    return enriched.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
  }

  return enriched;
}

export async function getBookById(id: string) {
  const book = await prisma.book
    .findUnique({
      where: { id },
      include: {
        reviews: {
          orderBy: { createdAt: "desc" },
          include: { user: true }
        }
      }
    })
    .catch(() => null);

  if (!book) {
    return null;
  }

  const approvedReviews = book.reviews.filter((review) => review.approved);
  const averageRating =
    approvedReviews.length > 0
      ? approvedReviews.reduce((total, review) => total + review.rating, 0) /
        approvedReviews.length
      : null;

  return {
    ...book,
    categories: parseCategories(book.categories),
    approvedReviews,
    averageRating
  };
}

export async function getAdminDashboard(period = 30) {
  const fromDate = getDateFilter(period);

  let books: AdminDashboardBook[] = [];
  let users: Prisma.UserGetPayload<Record<string, never>>[] = [];
  let reviews: AdminDashboardReview[] = [];
  let pendingReviews: AdminDashboardReview[] = [];
  let databaseUnavailable = false;

  const handleUnavailable = () => {
    databaseUnavailable = true;
    return [];
  };

  [books, users, reviews, pendingReviews] = await Promise.all([
    prisma.book
      .findMany({
        include: {
          reviews: {
            where: { approved: true }
          }
        },
        orderBy: { createdAt: "desc" }
      })
      .catch(handleUnavailable),
    prisma.user
      .findMany({
        orderBy: { createdAt: "desc" }
      })
      .catch(handleUnavailable),
    prisma.review
      .findMany({
        include: {
          book: true,
          user: true
        },
        orderBy: { createdAt: "desc" }
      })
      .catch(handleUnavailable),
    prisma.review
      .findMany({
        where: { approved: false },
        include: {
          book: true,
          user: true
        },
        orderBy: { createdAt: "desc" },
        take: 8
      })
      .catch(handleUnavailable)
  ]);

  const filteredUsers = fromDate ? users.filter((user) => user.createdAt >= fromDate) : users;
  const filteredReviews = fromDate ? reviews.filter((review) => review.createdAt >= fromDate) : reviews;

  const topBooks = books
    .map((book) => {
      const averageRating =
        book.reviews.length > 0
          ? book.reviews.reduce((sum, review) => sum + review.rating, 0) / book.reviews.length
          : 0;

      return {
        id: book.id,
        title: book.title,
        author: book.author,
        averageRating: Number(averageRating.toFixed(2)),
        ratingsCount: book.reviews.length
      };
    })
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 10);

  const activity = Array.from({ length: 6 }).map((_, index) => {
    const pointDate = subDays(new Date(), (5 - index) * 30);
    const label = pointDate.toLocaleString("sl-SI", { month: "short" });
    const usersCount = users.filter(
      (user) =>
        user.createdAt.getMonth() === pointDate.getMonth() &&
        user.createdAt.getFullYear() === pointDate.getFullYear()
    ).length;
    const reviewsCount = reviews.filter(
      (review) =>
        review.createdAt.getMonth() === pointDate.getMonth() &&
        review.createdAt.getFullYear() === pointDate.getFullYear()
    ).length;

    return {
      label,
      users: usersCount,
      reviews: reviewsCount
    };
  });

  const reviewDistribution = [1, 2, 3, 4, 5].map((rating) => ({
    name: `${rating} zvezd`,
    value: filteredReviews.filter((review) => review.rating === rating).length
  }));

  const bookRatingChart = topBooks
    .filter((book) => book.ratingsCount > 0)
    .slice(0, 6)
    .map((book) => ({
      title: book.title,
      averageRating: book.averageRating,
      ratingsCount: book.ratingsCount
    }));

  return {
    stats: {
      booksCount: books.length,
      usersCount: users.length,
      reviewsCount: reviews.length,
      pendingReviewsCount: pendingReviews.length,
      periodUsers: filteredUsers.length,
      periodReviews: filteredReviews.length
    },
    activity,
    reviewDistribution,
    bookRatingChart,
    topBooks,
    pendingReviews,
    databaseUnavailable
  };
}

export async function getAdminAnalytics(period = 30) {
  const fromDate = getDateFilter(period);
  const books: AdminDashboardBook[] = await prisma.book
    .findMany({
      include: {
        reviews: {
          where: fromDate
            ? {
                approved: true,
                createdAt: { gte: fromDate }
              }
            : { approved: true }
        }
      }
    })
    .catch(() => []);

  const chartData = books
    .map((book) => {
      const averageRating =
        book.reviews.length > 0
          ? book.reviews.reduce((sum, review) => sum + review.rating, 0) / book.reviews.length
          : 0;

      return {
        id: book.id,
        title: book.title,
        averageRating: Number(averageRating.toFixed(2)),
        ratingsCount: book.reviews.length
      };
    })
    .sort((a, b) => b.averageRating - a.averageRating);

  return {
    chartData: chartData.slice(0, 8),
    bestRatedBooks: chartData.filter((item) => item.ratingsCount > 0).slice(0, 5)
  };
}

export async function getAdminBooksTable({
  search,
  sort = "newest"
}: {
  search?: string;
  sort?: "newest" | "title" | "rating";
}) {
  const books = await prisma.book
    .findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search } },
              { author: { contains: search } },
              { publisher: { contains: search } }
            ]
          }
        : undefined,
      include: {
        reviews: {
          where: { approved: true }
        }
      },
      orderBy: sort === "title" ? { title: "asc" } : { createdAt: "desc" }
    })
    .catch((): AdminDashboardBook[] => []);

  let items = books.map((book) => ({
    ...book,
    categories: parseCategories(book.categories),
    averageRating:
      book.reviews.length > 0
        ? Number((book.reviews.reduce((sum, review) => sum + review.rating, 0) / book.reviews.length).toFixed(2))
        : 0,
    ratingsCount: book.reviews.length
  }));

  if (sort === "rating") {
    items = items.sort((a, b) => b.averageRating - a.averageRating);
  }

  return items;
}

export async function getAdminUsersTable({
  search,
  role = "all",
  sort = "newest"
}: {
  search?: string;
  role?: "all" | "USER" | "ADMIN";
  sort?: "newest" | "name" | "reviews";
}) {
  const users: AdminUserTableItem[] = await prisma.user
    .findMany({
      where: {
        ...(role !== "all" ? { role } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search } },
                { email: { contains: search } }
              ]
            }
          : {})
      },
      include: {
        _count: {
          select: { reviews: true }
        }
      },
      orderBy: sort === "name" ? { name: "asc" } : { createdAt: "desc" }
    })
    .catch((): AdminUserTableItem[] => []);

  if (sort === "reviews") {
    return users.sort((a, b) => b._count.reviews - a._count.reviews);
  }

  return users;
}
