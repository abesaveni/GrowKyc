import React from 'react';
import { IdVerification100Point } from './IdVerification100Point';

export function IdVerificationDemo() {
  const handleComplete = (data: any) => {
    alert('ID Verification complete! Check console for data.');
  };

  return (
    <div className="min-h-screen bg-white/5 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            Australian 100-Point ID Verification System
          </h1>
          <p className="text-slate-300">
            Bank-grade KYC/AML compliant identity verification with document upload
          </p>
        </div>

        <IdVerification100Point onComplete={handleComplete} />
      </div>
    </div>
  );
}
