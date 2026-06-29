import React from 'react';
import { Button } from '../ui/button';
import { Upload, CheckCircle, File, X } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface DocumentUploadSectionProps {
  title: string;
  description: string;
  categories: {
    name: string;
    description: string;
    required: boolean;
    uploaded: boolean;
    files?: string[];
  }[];
  onUpload: (categoryName: string) => void;
  onRemove?: (categoryName: string, fileName: string) => void;
}

export function DocumentUploadSection({
  title,
  description,
  categories,
  onUpload,
  onRemove
}: DocumentUploadSectionProps) {
  return (
    <Card className="border-2 border-purple-500/30">
      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <File className="w-5 h-5 text-purple-400" />
            {title}
          </h3>
          <p className="text-sm text-slate-300 mt-1">{description}</p>
        </div>

        <div className="space-y-4">
          {categories.map((category, idx) => (
            <div
              key={idx}
              className={`p-4 border-2 rounded-lg ${
                category.uploaded
                  ? 'border-green-500/30 bg-green-500/10'
                  : category.required
                  ? 'border-orange-500/30 bg-orange-500/10'
                  : 'border-white/10 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-slate-100">
                      {category.name}
                      {category.required && (
                        <span className="text-red-400 ml-1">*</span>
                      )}
                    </p>
                    {category.uploaded && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300">{category.description}</p>

                  {/* Show uploaded files */}
                  {category.uploaded && category.files && category.files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {category.files.map((file, fileIdx) => (
                        <div
                          key={fileIdx}
                          className="flex items-center gap-2 text-xs bg-white p-2 rounded border border-white/10"
                        >
                          <File className="w-3 h-3 text-slate-400" />
                          <span className="flex-1 text-slate-300">{file}</span>
                          {onRemove && (
                            <button
                              onClick={() => onRemove(category.name, file)}
                              className="text-red-500 hover:text-red-300"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => onUpload(category.name)}
                  variant={category.uploaded ? 'outline' : 'default'}
                  size="sm"
                  className={
                    category.uploaded
                      ? 'border-green-300 text-green-300 hover:bg-green-500/10'
                      : ''
                  }
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {category.uploaded ? 'Add More' : 'Upload'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t flex items-center justify-between">
          <div className="text-sm">
            <span className="font-semibold text-slate-100">
              {categories.filter((c) => c.uploaded).length} of {categories.length}
            </span>
            <span className="text-slate-300"> categories completed</span>
          </div>
          <div className="text-xs text-slate-300">
            {categories.filter((c) => c.required && !c.uploaded).length > 0 && (
              <span className="text-orange-400 font-medium">
                {categories.filter((c) => c.required && !c.uploaded).length} required
                documents missing
              </span>
            )}
            {categories.filter((c) => c.required && !c.uploaded).length === 0 && (
              <span className="text-green-400 font-medium">
                ✓ All required documents uploaded
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
