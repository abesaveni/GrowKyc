import React from 'react';
import { Button } from '../ui/button';
import { ArrowLeft, Save, Calculator } from 'lucide-react';

interface GSTBASWorkpaperProps {
  onBack?: () => void;
}

export function GSTBASWorkpaper({ onBack }: GSTBASWorkpaperProps) {
  return (
    <div className="min-h-screen bg-white/5">
      <div className="bg-white border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <Calculator className="w-6 h-6 text-green-400" />
            <div>
              <h1 className="text-xl font-bold text-slate-100">LS-06: GST/BAS Reconciliation</h1>
              <p className="text-xs text-slate-300">Account 2200 • BAS Workpaper • FY2024</p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
      <div className="p-6">
        <div className="bg-blue-500/10 border border-blue-300 rounded p-4">
          <p className="text-sm text-blue-300">GST/BAS Reconciliation - quarterly BAS reconciliation, GST on sales/purchases, and ATO lodgements.</p>
        </div>
      </div>
    </div>
  );
}
