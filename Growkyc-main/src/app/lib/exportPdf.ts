// Shared client-side PDF generation using jsPDF. Replaces the old pattern of
// dumping plain text into a Blob and naming it ".pdf" (which produced files that
// were not real PDFs). Use these for any "Download PDF / Export Report" action.

import { jsPDF } from 'jspdf';

function newDoc(title: string): { doc: jsPDF; y: number } {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 40, 50);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120);
  doc.text(`Generated ${new Date().toLocaleString()}`, 40, 66);
  doc.setTextColor(0);
  return { doc, y: 92 };
}

/** Download a key/value record as a real PDF (e.g. a single case / report). */
export function downloadRecordPdf(
  filename: string,
  title: string,
  fields: Array<[string, string]>,
  note?: string,
): void {
  const { doc } = newDoc(title);
  let y = 92;
  doc.setFontSize(11);
  for (const [label, value] of fields) {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, 40, y);
    doc.setFont('helvetica', 'normal');
    const wrapped = doc.splitTextToSize(String(value ?? '—'), 360);
    doc.text(wrapped, 180, y);
    y += Math.max(18, wrapped.length * 14);
    if (y > 780) {
      doc.addPage();
      y = 60;
    }
  }
  if (note) {
    y += 10;
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(doc.splitTextToSize(note, 500), 40, y);
  }
  doc.save(filename);
}

/** Download a tabular dataset as a real PDF (columns + rows). */
export function downloadTablePdf(
  filename: string,
  title: string,
  columns: string[],
  rows: string[][],
  note?: string,
): void {
  const { doc } = newDoc(title);
  let y = 92;
  const left = 40;
  const usableWidth = 515;
  const colWidth = usableWidth / columns.length;

  const drawHeader = () => {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(241, 245, 249);
    doc.rect(left, y - 12, usableWidth, 18, 'F');
    columns.forEach((c, i) => doc.text(String(c), left + 4 + i * colWidth, y));
    y += 16;
    doc.setFont('helvetica', 'normal');
  };

  drawHeader();
  for (const row of rows) {
    columns.forEach((_, i) => {
      const text = doc.splitTextToSize(String(row[i] ?? ''), colWidth - 6);
      doc.text(text[0] ?? '', left + 4 + i * colWidth, y);
    });
    y += 16;
    if (y > 790) {
      doc.addPage();
      y = 60;
      drawHeader();
    }
  }
  if (note) {
    y += 12;
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(doc.splitTextToSize(note, usableWidth), left, y);
  }
  doc.save(filename);
}
