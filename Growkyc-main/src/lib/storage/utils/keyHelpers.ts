/**
 * Format a date as YYYY-MM-DD for audit-friendly sorting in S3 keys.
 */
export function formatDateForKey(date: Date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Generate a version string for S3 keys.
 * Format: v{timestamp}
 * Allows multiple uploads of the same evidence on the same day.
 */
export function generateVersionToken(): string {
  const now = Date.now();
  const hex = now.toString(16).padStart(10, '0');
  return `v${hex}`;
}
