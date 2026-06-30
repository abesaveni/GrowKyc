// Shared client-side CSV export. Builds a properly-escaped CSV from a column
// header list + row arrays and triggers a browser download. Used across list /
// register screens so "Export" buttons produce a real file, not a stub.

function escapeCell(value: unknown): string {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

/** Format a Date (or date-like value) as YYYY-MM-DD; empty string on failure. */
export function csvDate(value: unknown): string {
  if (!value) return '';
  try {
    return new Date(value as any).toISOString().split('T')[0];
  } catch {
    return '';
  }
}

/**
 * Build a CSV from `columns` (header row) and `rows` (array of cell arrays) and
 * download it as `filename`. Returns the number of data rows written.
 */
export function downloadCsv(
  filename: string,
  columns: string[],
  rows: unknown[][],
): number {
  const csv = [columns, ...rows]
    .map((row) => row.map(escapeCell).join(','))
    .join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return rows.length;
}
