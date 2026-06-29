import React, { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  Download,
  Calendar,
  Shield,
  RefreshCw,
  Database,
  TrendingUp,
  Trash2
} from 'lucide-react';

interface SanctionsUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: () => void;
}

export function SanctionsUploadModal({ isOpen, onClose, onUploadComplete }: SanctionsUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState<{
    totalRecords: number;
    newRecords: number;
    updatedRecords: number;
    duplicates: number;
    errors: number;
  } | null>(null);

  const [previousUploads, setPreviousUploads] = useState([
    { id: '1', date: '2026-03-20', source: 'DFAT Consolidated List', records: 2847, status: 'active' },
    { id: '2', date: '2026-02-20', source: 'DFAT Consolidated List', records: 2720, status: 'archived' },
    { id: '3', date: '2026-01-20', source: 'DFAT Consolidated List', records: 2698, status: 'archived' }
  ]);

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('idle');
      setUploadResults(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus('uploading');
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);

    // Simulate API call
    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('success');
      
      // Mock results
      setUploadResults({
        totalRecords: 2847,
        newRecords: 127,
        updatedRecords: 42,
        duplicates: 2678,
        errors: 0
      });
      // Add new to previous uploads and mark others as archived
      setPreviousUploads(prev => {
        const archivedPrev = prev.map(p => ({ ...p, status: 'archived' }));
        return [
          { id: Date.now().toString(), date: new Date().toISOString().split('T')[0], source: selectedFile.name, records: 2847, status: 'active' },
          ...archivedPrev
        ];
      });

      if (onUploadComplete) {
        onUploadComplete();
      }
    }, 3000);
  };

  const handleDeleteUpload = (id: string) => {
    setPreviousUploads(prev => prev.filter(p => p.id !== id));
    toast.success('Sanctions list deleted successfully');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-purple-400 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-500/30">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl text-slate-100">Monthly Sanctions List Upload</CardTitle>
                <CardDescription className="text-lg">
                  Upload updated DFAT Consolidated Sanctions List (CSV/Excel/XML/JSON)
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="mt-2">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          {/* Upload Instructions */}
          <div className="bg-blue-500/10 border-2 border-blue-300 rounded-xl p-6">
            <h3 className="font-bold text-blue-300 text-xl mb-3 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Upload Instructions
            </h3>
            <div className="space-y-2 text-sm text-blue-300">
              <p><strong>Step 1:</strong> Download the latest DFAT Consolidated Sanctions List from the Australian Government website</p>
              <p><strong>Step 2:</strong> Upload the file below (CSV, Excel, XML, or JSON format)</p>
              <p><strong>Step 3:</strong> System will automatically parse, validate, and update the sanctions database</p>
              <p><strong>Step 4:</strong> All clients will be automatically re-screened against the new list within 24 hours</p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <a 
                href="https://www.dfat.gov.au/international-relations/security/sanctions/consolidated-list" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-300 underline text-sm flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                Download from DFAT Website
              </a>
            </div>
          </div>

          {/* File Upload Area */}
          <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
            <input
              type="file"
              accept=".csv,.xlsx,.xls,.xml,.json"
              onChange={handleFileSelect}
              className="hidden"
              id="sanctions-file-upload"
            />
            <label htmlFor="sanctions-file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-purple-500/15 rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10 text-purple-400" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-100">
                    {selectedFile ? selectedFile.name : 'Click to upload sanctions list'}
                  </p>
                  <p className="text-sm text-slate-300 mt-1">
                    Supported formats: CSV, Excel (.xlsx, .xls), XML, JSON
                  </p>
                  {selectedFile && (
                    <div className="mt-2">
                      <Badge className="bg-green-500/15 text-green-300">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        File selected: {(selectedFile.size / 1024).toFixed(1)} KB
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </label>
          </div>

          {/* Upload Progress */}
          {uploadStatus === 'uploading' && (
            <div className="bg-blue-500/10 border-2 border-blue-300 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                <p className="font-semibold text-blue-300">Processing sanctions list...</p>
              </div>
              <div className="w-full bg-blue-500/20 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-blue-600 h-full transition-all duration-300 flex items-center justify-center text-xs text-white font-bold"
                  style={{ width: `${uploadProgress}%` }}
                >
                  {uploadProgress}%
                </div>
              </div>
              <p className="text-xs text-blue-300 mt-2">
                Parsing entries, validating data, updating database...
              </p>
            </div>
          )}

          {/* Upload Success */}
          {uploadStatus === 'success' && uploadResults && (
            <div className="bg-green-500/10 border-2 border-green-300 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="font-bold text-green-300 text-xl">Upload Complete!</p>
                  <p className="text-sm text-green-300">Sanctions database updated successfully</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-white p-4 rounded-lg border-2 border-green-500/30 text-center">
                  <p className="text-2xl font-bold text-slate-100">{uploadResults.totalRecords}</p>
                  <p className="text-xs text-slate-300">Total Records</p>
                </div>
                <div className="bg-white p-4 rounded-lg border-2 border-blue-500/30 text-center">
                  <p className="text-2xl font-bold text-blue-400">{uploadResults.newRecords}</p>
                  <p className="text-xs text-slate-300">New Additions</p>
                </div>
                <div className="bg-white p-4 rounded-lg border-2 border-amber-500/30 text-center">
                  <p className="text-2xl font-bold text-amber-400">{uploadResults.updatedRecords}</p>
                  <p className="text-xs text-slate-300">Updated</p>
                </div>
                <div className="bg-white p-4 rounded-lg border-2 border-white/10 text-center">
                  <p className="text-2xl font-bold text-slate-300">{uploadResults.duplicates}</p>
                  <p className="text-xs text-slate-300">Unchanged</p>
                </div>
                <div className="bg-white p-4 rounded-lg border-2 border-red-500/30 text-center">
                  <p className="text-2xl font-bold text-red-400">{uploadResults.errors}</p>
                  <p className="text-xs text-slate-300">Errors</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div className="text-sm text-blue-300">
                    <p className="font-semibold mb-1">Automatic Re-screening Triggered</p>
                    <p className="text-blue-300">
                      All 1,847 active clients will be automatically re-screened against the updated sanctions list within the next 24 hours. 
                      You will receive email notifications if any new matches are detected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload Error */}
          {uploadStatus === 'error' && (
            <div className="bg-red-500/10 border-2 border-red-300 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="w-8 h-8 text-red-400" />
                <div>
                  <p className="font-bold text-red-300 text-lg">Upload Failed</p>
                  <p className="text-sm text-red-300">Please check the file format and try again</p>
                </div>
              </div>
            </div>
          )}

          {/* Previous Uploads History */}
          <div>
            <h3 className="font-bold text-slate-100 text-xl mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-slate-300" />
              Upload History
            </h3>
            <div className="space-y-2">
              {previousUploads.map((upload, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/15 rounded-lg flex items-center justify-center">
                      <Database className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-100">{upload.source}</p>
                      <p className="text-sm text-slate-300">
                        {upload.date} • {upload.records.toLocaleString()} records
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={
                      upload.status === 'active' 
                        ? 'bg-green-500/15 text-green-300' 
                        : 'bg-white/5 text-slate-300'
                    }>
                      {upload.status === 'active' ? 'Current' : 'Archived'}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteUpload(upload.id)}
                      className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 p-2 h-auto"
                      title="Delete List"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-white/10 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploadStatus === 'uploading' || uploadStatus === 'success'}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8"
            >
              {uploadStatus === 'uploading' ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : uploadStatus === 'success' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Upload Complete
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload & Process
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}