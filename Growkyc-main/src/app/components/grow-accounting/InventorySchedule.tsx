import React from 'react';
import { Button } from '../ui/button';
import { ArrowLeft, Save, Package } from 'lucide-react';

interface InventoryScheduleProps {
  onBack?: () => void;
}

export function InventorySchedule({ onBack }: InventoryScheduleProps) {
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
            <Package className="w-6 h-6 text-purple-400" />
            <div>
              <h1 className="text-xl font-bold text-slate-100">LS-03: Inventory Schedule</h1>
              <p className="text-xs text-slate-300">Account 1400 • Raw Materials • FY2024</p>
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
          <p className="text-sm text-blue-300">Inventory Schedule workpaper - stocktake reconciliation, valuation, and obsolescence analysis.</p>
        </div>
      </div>
    </div>
  );
}
