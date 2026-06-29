import React, { useState } from 'react';
import { Download, FileText, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../ui/button';
import { PageHeader } from '../../shared/dashboard/PageHeader';

const REPORTS = [
  { id: 'asic-504', name: 'ASIC Form 504 — Remuneration', category: 'Regulatory' },
  { id: 'progress', name: 'Progress report template', category: 'Operational' },
  { id: 'secured', name: 'Secured creditor report', category: 'Creditors' },
  { id: 'asset-real', name: 'Asset realisation report', category: 'Assets' },
  { id: 'trust', name: 'Trust account report', category: 'Accounting' }
];

export function ReceivershipReportingView() {
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerate = (id: string, name: string) => {
    if (generating) return;
    setGenerating(id);
    setTimeout(() => {
      setGenerating(null);
      toast.success(`${name} generated`);
    }, 800);
  };

  return (
    <div className="p-6 space-y-8 max-w-[1200px] mx-auto">
      <PageHeader
        title="Statutory Reporting"
        description="Generate ASIC Form 504, progress reports, and creditor communications."
      />

      <section className="bg-white border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-red-400" />
          <h2 className="text-lg font-semibold text-slate-100">ASIC Form 504</h2>
        </div>
        <p className="text-sm text-slate-300 mb-4">
          Remuneration report and progress report templates for lodged appointments.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border border-white/10 rounded-lg p-4">
            <h3 className="font-medium text-slate-100 mb-2">Remuneration report</h3>
            <p className="text-sm text-slate-300 mb-4">Receiver remuneration, disbursements, and approval status.</p>
            <Button variant="outline" disabled={generating === 'asic-rem'} onClick={() => handleGenerate('asic-rem', 'ASIC remuneration report')}>
              <Download className="w-4 h-4 mr-2" />
              {generating === 'asic-rem' ? 'Generating…' : 'Generate PDF'}
            </Button>
          </div>
          <div className="border border-white/10 rounded-lg p-4">
            <h3 className="font-medium text-slate-100 mb-2">Progress report</h3>
            <p className="text-sm text-slate-300 mb-4">Matter progress, asset realisation, and creditor updates.</p>
            <Button variant="outline" disabled={generating === 'asic-prog'} onClick={() => handleGenerate('asic-prog', 'ASIC progress report')}>
              <Download className="w-4 h-4 mr-2" />
              {generating === 'asic-prog' ? 'Generating…' : 'Generate PDF'}
            </Button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-100 mb-4">All reports</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REPORTS.map((r) => (
            <div key={r.id} className="bg-white border border-white/10 rounded-lg p-5 hover:shadow-md transition-shadow">
              <FileText className="w-8 h-8 text-red-400 mb-3" />
              <p className="text-xs text-slate-400 uppercase">{r.category}</p>
              <p className="font-semibold text-slate-100 mt-1 mb-3">{r.name}</p>
              <Button size="sm" variant="outline" className="w-full" disabled={generating === r.id} onClick={() => handleGenerate(r.id, r.name)}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
