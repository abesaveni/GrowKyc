import React from 'react';
import { File, FileImage, FileSpreadsheet, FileText } from 'lucide-react';
import type { DocumentFileType } from '../../services/documentManagerService';

export function FileTypeIcon({ type, className = 'w-5 h-5' }: { type: DocumentFileType; className?: string }) {
  switch (type) {
    case 'pdf':
      return <FileText className={`${className} text-red-600`} aria-hidden />;
    case 'docx':
      return <FileText className={`${className} text-blue-600`} aria-hidden />;
    case 'xlsx':
      return <FileSpreadsheet className={`${className} text-green-600`} aria-hidden />;
    case 'image':
      return <FileImage className={`${className} text-purple-600`} aria-hidden />;
    default:
      return <File className={`${className} text-gray-500`} aria-hidden />;
  }
}

export function PermissionBadge({ permission }: { permission: string }) {
  const styles: Record<string, string> = {
    View: 'bg-slate-100 text-slate-800',
    Edit: 'bg-blue-100 text-blue-800',
    Admin: 'bg-purple-100 text-purple-800'
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[permission] || styles.View}`}>
      {permission}
    </span>
  );
}
