import * as XLSX from "xlsx";

type ImportRow = {
  title?: string;
  author?: string;
  description?: string;
  content?: string;
  coverImage?: string;
  publisher?: string;
  publishedDate?: string;
  pageCount?: string | number;
  categories?: string;
};

export async function parseBookImportFile(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheet = workbook.SheetNames[0];

  if (!firstSheet) {
    return [];
  }

  const rows = XLSX.utils.sheet_to_json<ImportRow>(workbook.Sheets[firstSheet], {
    defval: ""
  });

  return rows.map((row) => ({
    title: String(row.title ?? "").trim(),
    author: String(row.author ?? "").trim(),
    description: String(row.description ?? "").trim(),
    content: String(row.content ?? "").trim(),
    coverImage: String(row.coverImage ?? "").trim() || null,
    publisher: String(row.publisher ?? "").trim() || null,
    publishedDate: String(row.publishedDate ?? "").trim() || null,
    pageCount: row.pageCount ? Number(row.pageCount) : null,
    categories: String(row.categories ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
  }));
}
