import React from 'react';
import { IdVerification100Point } from './IdVerification100Point';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

interface Step3Props {
  onComplete: (data: { selectedDocuments: any[], uploadedFiles: any }) => void;
  onBack: () => void;
}

export function ClientFormStep3_IdVerification({ onComplete, onBack }: Step3Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Step 3: Identity Verification</h2>
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>
      
      <IdVerification100Point onComplete={onComplete} />
    </div>
  );
}
