import React from 'react';
import { Button } from '../ui/button';
import { ArrowLeft, Save, Users } from 'lucide-react';

interface PayrollSuperWorkpaperProps {
  onBack?: () => void;
}

export function PayrollSuperWorkpaper({ onBack }: PayrollSuperWorkpaperProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-300 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <Users className="w-6 h-6 text-purple-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">LS-07: Payroll & Superannuation</h1>
              <p className="text-xs text-gray-600">Accounts 2300, 2400 • PAYG & Super • FY2024</p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
      <div className="p-6">
        <div className="bg-blue-50 border border-blue-300 rounded p-4">
          <p className="text-sm text-blue-800">Payroll & Super Workpaper - STP reconciliation, PAYG withholding, super guarantee compliance, and payment verification.</p>
        </div>
      </div>
    </div>
  );
}
