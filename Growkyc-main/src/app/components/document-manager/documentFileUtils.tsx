import React from 'react';
import { File, FileImage, FileSpreadsheet, FileText } from 'lucide-react';
import type { DocumentFileType } from '../../services/documentManagerService';

export function FileTypeIcon({ type, className = 'w-5 h-5' }: { type: DocumentFileType; className?: string }) {
  switch (type) {
    case 'pdf':
      return <FileText className={`${className} text-red-400`} aria-hidden />;
    case 'docx':
      return <FileText className={`${className} text-blue-400`} aria-hidden />;
    case 'xlsx':
      return <FileSpreadsheet className={`${className} text-green-400`} aria-hidden />;
    case 'image':
      return <FileImage className={`${className} text-purple-400`} aria-hidden />;
    default:
      return <File className={`${className} text-slate-400`} aria-hidden />;
  }
}

export function PermissionBadge({ permission }: { permission: string }) {
  const styles: Record<string, string> = {
    View: 'bg-white/5 text-slate-100',
    Edit: 'bg-blue-500/15 text-blue-300',
    Admin: 'bg-purple-500/15 text-purple-300'
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[permission] || styles.View}`}>
      {permission}
    </span>
  );
}
