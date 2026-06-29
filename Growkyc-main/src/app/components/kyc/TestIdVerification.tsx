import React from 'react';
import { IdVerification100Point } from './IdVerification100Point';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

export function TestIdVerification() {
  const handleComplete = (data: any) => {
    const summary = `
✅ ID Verification Complete!

📊 Documents Added: ${data.selectedDocuments.length}
📤 Files Uploaded: ${Object.keys(data.uploadedFiles).length}
🎯 Total Points: ${data.selectedDocuments.reduce((sum: number, doc: any) => sum + doc.points, 0)}

Documents:
${data.selectedDocuments.map((doc: any) => `• ${doc.name} (${doc.points} points)`).join('\n')}
    `;
    
    alert(summary);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-900">
            🆔 100-Point ID Verification System - LIVE TEST
          </h1>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </Button>
        </div>
        
        <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
          <h2 className="font-bold text-blue-900 mb-2">🧪 Test Instructions:</h2>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✅ Official 14-document AML/CTF matrix displayed at top</li>
            <li>✅ Select documents from Category A (blue) and Category B (purple)</li>
            <li>✅ Enter document details (number, issuer, expiry)</li>
            <li>✅ Upload files for each document (drag & drop or click)</li>
            <li>✅ Watch the points counter update in real-time</li>
            <li>✅ System validates 100+ points, Category A, DOB, and Address</li>
            <li>✅ When complete, all data is logged to console</li>
          </ul>
        </div>
        
        <IdVerification100Point onComplete={handleComplete} />
      </div>
    </div>
  );
}
