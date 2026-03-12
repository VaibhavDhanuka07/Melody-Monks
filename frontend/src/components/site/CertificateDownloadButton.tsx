"use client";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type CertificateDownloadButtonProps = {
  studentName: string;
  level: string;
};

export default function CertificateDownloadButton({
  studentName,
  level,
}: CertificateDownloadButtonProps) {
  const handleDownload = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText("Certificate of Completion", {
      x: 200,
      y: 420,
      size: 26,
      font,
      color: rgb(0.85, 0.7, 0.2),
    });

    page.drawText(`This certifies that ${studentName}`, {
      x: 140,
      y: 360,
      size: 18,
      font: bodyFont,
      color: rgb(0.15, 0.15, 0.15),
    });

    page.drawText(`has completed the ${level} level`, {
      x: 160,
      y: 320,
      size: 18,
      font: bodyFont,
      color: rgb(0.15, 0.15, 0.15),
    });

    page.drawText("Melody Monks Piano Academy", {
      x: 240,
      y: 120,
      size: 14,
      font: bodyFont,
      color: rgb(0.3, 0.3, 0.3),
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${level.replace(/\s+/g, "-").toLowerCase()}-certificate.pdf`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button type="button" onClick={handleDownload} className="btn-secondary">
      Download Certificate
    </button>
  );
}
