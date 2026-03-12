"use client";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type SheetMusicDownloadButtonProps = {
  title: string;
};

export default function SheetMusicDownloadButton({
  title,
}: SheetMusicDownloadButtonProps) {
  const handleDownload = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText("Melody Monks Piano Academy", {
      x: 50,
      y: 790,
      size: 12,
      font,
      color: rgb(0.8, 0.7, 0.3),
    });

    page.drawText(`Sheet Music: ${title}`, {
      x: 50,
      y: 740,
      size: 20,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });

    page.drawText(
      "This is a placeholder sheet music PDF. Replace with your real score.",
      {
        x: 50,
        y: 700,
        size: 12,
        font,
        color: rgb(0.2, 0.2, 0.2),
      }
    );

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${title.replace(/\s+/g, "-").toLowerCase()}.pdf`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button type="button" onClick={handleDownload} className="btn-secondary">
      Download Sheet Music (PDF)
    </button>
  );
}
