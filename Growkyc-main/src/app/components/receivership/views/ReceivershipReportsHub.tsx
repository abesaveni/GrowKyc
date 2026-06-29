import React, { useState } from 'react';
import { Calculator, FileText } from 'lucide-react';
import { DividendCalculationView } from './DividendCalculationView';
import { ReceivershipReportingView } from './ReceivershipReportingView';

type ReportTab = 'statutory' | 'dividend';

export function ReceivershipReportsHub() {
  const [tab, setTab] = useState<ReportTab>('statutory');

  const tabs = [
    { id: 'statutory' as const, label: 'Reporting & ASIC 504', icon: FileText },
    { id: 'dividend' as const, label: 'Dividend calculation', icon: Calculator }
  ];

  return (
    <div className="min-h-full">
      <div className="border-b border-white/10 bg-white px-6">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                  tab === t.id
                    ? 'border-red-600 text-red-300'
                    : 'border-transparent text-slate-300 hover:text-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
      {tab === 'statutory' ? <ReceivershipReportingView /> : <DividendCalculationView />}
    </div>
  );
}
