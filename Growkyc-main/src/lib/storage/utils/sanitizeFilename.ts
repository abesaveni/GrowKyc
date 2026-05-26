/**
 * Sanitize a filename to be S3-safe and audit-friendly.
 * Replaces unsafe characters with underscores, removes doubles, trims.
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || filename.length === 0) {
    return 'file';
  }

  // Remove path separators and control characters
  let safe = filename.replace(/[/\\:*?"<>|]/g, '_');

  // Replace multiple underscores with single
  safe = safe.replace(/_+/g, '_');

  // Remove leading/trailing underscores and dots
  safe = safe.replace(/^_+|_+$/g, '').replace(/^\.+|\.+$/g, '');

  // Limit to 200 chars to leave room for key prefix
  if (safe.length > 200) {
    const ext = safe.lastIndexOf('.');
    if (ext > 0) {
      const name = safe.substring(0, 195 - (safe.length - ext));
      const extension = safe.substring(ext);
      safe = name + extension;
    } else {
      safe = safe.substring(0, 200);
    }
  }

  return safe || 'file';
}
