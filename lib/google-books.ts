type GoogleBooksVolume = {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    description?: string;
    publisher?: string;
    publishedDate?: string;
    pageCount?: number;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    infoLink?: string;
    previewLink?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
  };
};

export async function fetchGoogleBooksData(title: string, author: string) {
  const params = new URLSearchParams({
    q: `intitle:${title} inauthor:${author}`,
    maxResults: "1",
    printType: "books"
  });

  if (process.env.GOOGLE_BOOKS_API_KEY) {
    params.set("key", process.env.GOOGLE_BOOKS_API_KEY);
  }

  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?${params.toString()}`, {
    method: "GET",
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Google Books API error: ${response.status}`);
  }

  const payload = (await response.json()) as { items?: GoogleBooksVolume[] };
  const volume = payload.items?.[0];

  if (!volume?.volumeInfo) {
    return null;
  }

  return {
    externalId: volume.id,
    externalSource: "GOOGLE_BOOKS",
    description: volume.volumeInfo.description,
    publisher: volume.volumeInfo.publisher,
    publishedDate: volume.volumeInfo.publishedDate,
    pageCount: volume.volumeInfo.pageCount,
    categories: volume.volumeInfo.categories ?? [],
    externalRating: volume.volumeInfo.averageRating ?? null,
    externalRatingsCount: volume.volumeInfo.ratingsCount ?? null,
    externalInfoLink: volume.volumeInfo.infoLink,
    externalPreviewLink: volume.volumeInfo.previewLink,
    coverImage:
      volume.volumeInfo.imageLinks?.thumbnail ??
      volume.volumeInfo.imageLinks?.smallThumbnail ??
      null
  };
}
