/**
 * Content Type Helper
 * Determines and validates MIME types for evidence storage
 */

export interface ContentTypeInfo {
  mimeType: string;
  extension: string;
  isCompressed: boolean;
  isEncrypted: boolean;
  isAudio: boolean;
  isVideo: boolean;
  isImage: boolean;
  isDocument: boolean;
}

/**
 * Comprehensive MIME type registry with metadata
 */
const CONTENT_TYPE_REGISTRY: Record<string, ContentTypeInfo> = {
  // Documents
  'application/pdf': {
    mimeType: 'application/pdf',
    extension: '.pdf',
    isDocument: true,
    isCompressed: false,
    isEncrypted: false,
    isAudio: false,
    isVideo: false,
    isImage: false,
  },
  'application/msword': {
    mimeType: 'application/msword',
    extension: '.doc',
    isDocument: true,
    isCompressed: false,
    isEncrypted: false,
    isAudio: false,
    isVideo: false,
    isImage: false,
  },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    extension: '.docx',
    isDocument: true,
    isCompressed: false,
    isEncrypted: false,
    isAudio: false,
    isVideo: false,
    isImage: false,
  },
  'text/plain': {
    mimeType: 'text/plain',
    extension: '.txt',
    isDocument: true,
    isCompressed: false,
    isEncrypted: false,
    isAudio: false,
    isVideo: false,
    isImage: false,
  },
  // Images
  'image/jpeg': {
    mimeType: 'image/jpeg',
    extension: '.jpg',
    isImage: true,
    isCompressed: true,
    isEncrypted: false,
    isAudio: false,
    isVideo: false,
    isDocument: false,
  },
  'image/png': {
    mimeType: 'image/png',
    extension: '.png',
    isImage: true,
    isCompressed: true,
    isEncrypted: false,
    isAudio: false,
    isVideo: false,
    isDocument: false,
  },
  'image/tiff': {
    mimeType: 'image/tiff',
    extension: '.tiff',
    isImage: true,
    isCompressed: false,
    isEncrypted: false,
    isAudio: false,
    isVideo: false,
    isDocument: false,
  },
  // Video
  'video/mp4': {
    mimeType: 'video/mp4',
    extension: '.mp4',
    isVideo: true,
    isCompressed: true,
    isEncrypted: false,
    isAudio: false,
    isImage: false,
    isDocument: false,
  },
  'video/quicktime': {
    mimeType: 'video/quicktime',
    extension: '.mov',
    isVideo: true,
    isCompressed: true,
    isEncrypted: false,
    isAudio: false,
    isImage: false,
    isDocument: false,
  },
  // Audio
  'audio/mpeg': {
    mimeType: 'audio/mpeg',
    extension: '.mp3',
    isAudio: true,
    isCompressed: true,
    isEncrypted: false,
    isVideo: false,
    isImage: false,
    isDocument: false,
  },
  'audio/wav': {
    mimeType: 'audio/wav',
    extension: '.wav',
    isAudio: true,
    isCompressed: false,
    isEncrypted: false,
    isVideo: false,
    isImage: false,
    isDocument: false,
  },
  // Archives
  'application/zip': {
    mimeType: 'application/zip',
    extension: '.zip',
    isCompressed: true,
    isEncrypted: false,
    isAudio: false,
    isVideo: false,
    isImage: false,
    isDocument: false,
  },
  'application/x-rar-compressed': {
    mimeType: 'application/x-rar-compressed',
    extension: '.rar',
    isCompressed: true,
    isEncrypted: false,
    isAudio: false,
    isVideo: false,
    isImage: false,
    isDocument: false,
  },
};

/**
 * Get content type info for a given MIME type
 * Returns default for unknown types
 */
export function getContentTypeInfo(mimeType: string): ContentTypeInfo {
  const info = CONTENT_TYPE_REGISTRY[mimeType];
  if (info) {
    return info;
  }

  // Default for unknown types
  return {
    mimeType,
    extension: '',
    isCompressed: false,
    isEncrypted: false,
    isAudio: false,
    isVideo: false,
    isImage: false,
    isDocument: false,
  };
}

/**
 * Normalize MIME type (handle common variants)
 */
export function normalizeMimeType(mimeType: string): string {
  if (!mimeType) {
    return 'application/octet-stream';
  }

  const normalized = mimeType.toLowerCase().trim();

  // Handle common aliases
  const aliases: Record<string, string> = {
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'png': 'image/png',
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'txt': 'text/plain',
    'zip': 'application/zip',
  };

  return aliases[normalized] || normalized;
}

/**
 * Validate if a MIME type is allowed for evidence storage
 */
export function isValidEvidenceContentType(mimeType: string): boolean {
  const normalized = normalizeMimeType(mimeType);
  return (
    CONTENT_TYPE_REGISTRY[normalized] !== undefined ||
    normalized.startsWith('image/') ||
    normalized.startsWith('video/') ||
    normalized.startsWith('audio/') ||
    normalized.startsWith('text/') ||
    normalized.startsWith('application/')
  );
}
