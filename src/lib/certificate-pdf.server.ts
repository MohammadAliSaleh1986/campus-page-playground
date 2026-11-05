import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { site } from "@/config/site";

export async function createCertificatePdf(data: { name: string; title: string; completed: string; reference: string }) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([842, 595]);
  const regular = await pdf.embedFont(StandardFonts.TimesRoman);
  const bold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const ink = rgb(0.13, 0.22, 0.34), accent = rgb(0.12, 0.48, 0.46);
  const text = (value: string, y: number, size: number, strong = false) => {
    const font = strong ? bold : regular;
    // Standard PDF fonts cover Latin scripts; retain supported characters in the PDF.
    const safe = [...value].map(char => { try { font.encodeText(char); return char; } catch { return "?"; } }).join("");
    let fit = size;
    while (font.widthOfTextAtSize(safe, fit) > 720 && fit > 9) fit -= 0.5;
    page.drawText(safe, { x: (842 - font.widthOfTextAtSize(safe, fit)) / 2, y, size: fit, font, color: ink });
  };
  page.drawRectangle({ x: 24, y: 24, width: 794, height: 547, borderColor: accent, borderWidth: 2 });
  page.drawRectangle({ x: 32, y: 32, width: 778, height: 531, borderColor: accent, borderWidth: 0.5 });
  text(site.brandName, 504, 26, true);
  text("CERTIFICATE OF COMPLETION", 436, 30, true);
  text("This certificate is awarded to", 378, 17);
  text(data.name, 326, 34, true);
  text("for successfully completing the required assessments for", 285, 16);
  text(data.title, 242, 25, true);
  text(`Completed ${new Date(data.completed).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}`, 190, 16);
  text(site.instructor.name, 123, 20, true);
  text("Instructor · MAS Academy", 98, 14);
  text(`Certificate reference: ${data.reference}`, 57, 10);
  pdf.setTitle(`${site.brandName} — Certificate of Completion`);
  pdf.setAuthor(site.instructor.name);
  return Buffer.from(await pdf.save()).toString("base64");
}