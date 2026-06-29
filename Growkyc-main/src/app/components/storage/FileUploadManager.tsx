import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  Upload,
  File,
  Download,
  Trash2,
  Search,
  FolderOpen,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  Loader2,
  X
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';

function getRuntimeEnv(): Record<string, string | boolean | undefined> {
  const viteEnv = (typeof import.meta !== 'undefined' ? (import.meta as any).env : {}) || {};
  const processEnv = ((globalThis as any)?.process?.env || {}) as Record<string, string>;
  return { ...processEnv, ...viteEnv };
}

function isFlagEnabled(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
}

interface FileMetadata {
  id: string;
  path: string;
  name: string;
  size: number;
  type: string;
  module: string;
  folder: string;
  uploadedAt: string;
}

interface FileUploadManagerProps {
  module?: string;
  folder?: string;
  onFileSelect?: (file: FileMetadata) => void;
}

export function FileUploadManager({ 
  module = 'grow_accounting', 
  folder = 'workpapers',
  onFileSelect 
}: FileUploadManagerProps) {
  const env = getRuntimeEnv();
  const isProduction =
    Boolean((import.meta as any)?.env?.PROD) ||
    env.NODE_ENV === 'production' ||
    env.VITE_APP_ENV === 'production';
  const allowLegacyStorage = isFlagEnabled(env.VITE_ENABLE_LEGACY_FILE_STORAGE);
  const blockInProduction = isProduction && !allowLegacyStorage;

  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-b186a255`;

  // Fetch files on mount
  useEffect(() => {
    if (blockInProduction) {
      return;
    }
    fetchFiles();
  }, [module, folder, blockInProduction]);

  const fetchFiles = async () => {
    if (blockInProduction) {
      setError('Legacy file storage is blocked in production runtime.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE}/files/list?module=${module}&folder=${folder}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setFiles(data.files);
      } else {
        setError(data.error || 'Failed to fetch files');
      }
    } catch (err) {
      setError(`Failed to fetch files: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (blockInProduction) {
      setError('Legacy file upload is blocked in production runtime.');
      return;
    }
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('module', module);
      formData.append('folder', folder);
      formData.append('metadata', JSON.stringify({
        uploadedBy: 'current_user',
        description: 'Uploaded via File Manager'
      }));

      const response = await fetch(`${API_BASE}/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Successfully uploaded ${file.name}`);
        await fetchFiles();
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    if (blockInProduction) {
      setError('Legacy file download is blocked in production runtime.');
      return;
    }
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE}/files/download/${filePath}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      
      if (data.success) {
        // Open signed URL in new tab
        window.open(data.signedUrl, '_blank');
      } else {
        setError(data.error || 'Download failed');
      }
    } catch (err) {
      setError(`Download failed: ${err.message}`);
    }
  };

  const handleDelete = async (filePath: string) => {
    if (blockInProduction) {
      setError('Legacy file deletion is blocked in production runtime.');
      return;
    }
    if (!confirm('Are you sure you want to delete this file?')) return;

    setError(null);
    try {
      const response = await fetch(
        `${API_BASE}/files/delete/${filePath}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setSuccess('File deleted successfully');
        await fetchFiles();
      } else {
        setError(data.error || 'Delete failed');
      }
    } catch (err) {
      setError(`Delete failed: ${err.message}`);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return ImageIcon;
    if (type.includes('pdf')) return FileText;
    if (type.includes('spreadsheet') || type.includes('excel')) return FileSpreadsheet;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (blockInProduction) {
    return (
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-red-300">
            <AlertCircle className="w-5 h-5" />
            Legacy Storage Blocked in Production
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-sm text-slate-300">
          This file manager targets legacy Supabase storage paths and is disabled in production.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-blue-400" />
            File Manager - {module} / {folder}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Alerts */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-300">Error</p>
                <p className="text-sm text-red-300">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-300">Success</p>
                <p className="text-sm text-green-300">{success}</p>
              </div>
              <button onClick={() => setSuccess(null)} className="text-green-400 hover:text-green-300">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Upload Section */}
          <div className="mb-6 p-6 border-2 border-dashed border-white/10 rounded-lg hover:border-blue-400 transition-colors">
            <div className="text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={uploading}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Choose File to Upload
                  </>
                )}
              </label>
              <p className="text-sm text-slate-400 mt-2">
                Maximum file size: 50MB
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Files List */}
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
              <p className="text-slate-300">Loading files...</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-slate-300 mb-2">
                {searchQuery ? 'No files found matching your search' : 'No files uploaded yet'}
              </p>
              {searchQuery && (
                <Button onClick={() => setSearchQuery('')} variant="outline" size="sm">
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => {
                const Icon = getFileIcon(file.type);
                return (
                  <div
                    key={file.id}
                    className="flex items-center gap-4 p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-500/15 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blue-400" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-100 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleDownload(file.path, file.name)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                      <Button
                        onClick={() => handleDelete(file.path)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Refresh Button */}
          <div className="mt-4 flex justify-end">
            <Button onClick={fetchFiles} variant="outline" size="sm" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Refresh'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Documentation */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-base">API Endpoints Reference</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold text-slate-100 mb-1">Upload File</p>
              <code className="block bg-white/5 p-2 rounded text-xs">
                POST {API_BASE}/files/upload
              </code>
              <p className="text-slate-300 mt-1">FormData: file, module, folder, metadata</p>
            </div>
            
            <div>
              <p className="font-semibold text-slate-100 mb-1">List Files</p>
              <code className="block bg-white/5 p-2 rounded text-xs">
                GET {API_BASE}/files/list?module={module}&folder={folder}
              </code>
            </div>
            
            <div>
              <p className="font-semibold text-slate-100 mb-1">Download File</p>
              <code className="block bg-white/5 p-2 rounded text-xs">
                GET {API_BASE}/files/download/:path
              </code>
              <p className="text-slate-300 mt-1">Returns signed URL valid for 1 hour</p>
            </div>
            
            <div>
              <p className="font-semibold text-slate-100 mb-1">Delete File</p>
              <code className="block bg-white/5 p-2 rounded text-xs">
                DELETE {API_BASE}/files/delete/:path
              </code>
            </div>
            
            <div>
              <p className="font-semibold text-slate-100 mb-1">Search Files</p>
              <code className="block bg-white/5 p-2 rounded text-xs">
                GET {API_BASE}/files/search?q=query&module={module}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
