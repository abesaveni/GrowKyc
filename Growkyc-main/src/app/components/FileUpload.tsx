import React, { useCallback, useState } from 'react';
import { Upload, File, X, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  label?: string;
}

export function FileUpload({
  onFileSelect,
  acceptedTypes = '.pdf,.doc,.docx,.jpg,.png',
  maxSize = 10,
  multiple = false,
  label = 'Upload documents'
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const sizeMB = file.size / 1024 / 1024;
      return sizeMB <= maxSize;
    });

    setUploadedFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
    onFileSelect(validFiles);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 bg-white hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleChange}
          accept={acceptedTypes}
          multiple={multiple}
        />
        
        <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
        
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Drag and drop files here, or{' '}
            <label htmlFor="file-upload" className="text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer">
              browse
            </label>
          </p>
          <p className="text-xs text-gray-500">
            {acceptedTypes.replace(/\./g, '').toUpperCase()} up to {maxSize}MB
          </p>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <File className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
