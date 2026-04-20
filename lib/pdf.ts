import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type PdfSection = {
  title: string;
  rows: string[];
};

export async function createAdminPdfReport(title: string, sections: PdfSection[]) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = 790;

  page.drawText(title, {
    x: 40,
    y,
    size: 22,
    font: bold,
    color: rgb(0.05, 0.2, 0.45)
  });

  y -= 32;
  page.drawText(`Generirano: ${new Date().toLocaleString("sl-SI")}`, {
    x: 40,
    y,
    size: 10,
    font,
    color: rgb(0.3, 0.35, 0.42)
  });

  for (const section of sections) {
    y -= 30;
    page.drawText(section.title, {
      x: 40,
      y,
      size: 14,
      font: bold,
      color: rgb(0.1, 0.1, 0.12)
    });

    y -= 18;

    for (const row of section.rows) {
      if (y < 60) {
        break;
      }

      page.drawText(`- ${row}`, {
        x: 48,
        y,
        size: 10,
        font,
        color: rgb(0.2, 0.24, 0.3),
        maxWidth: 500
      });
      y -= 14;
    }
  }

  return pdfDoc.save();
}
