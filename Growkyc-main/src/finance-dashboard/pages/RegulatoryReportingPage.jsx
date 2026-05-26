import React, { useEffect, useState } from 'react';
import { FileText, Download, Loader2 } from 'lucide-react';
import { Button } from '../../app/components/ui/button';
import { fetchMock } from '../utils/fetchMock';
import { formatDate } from '../utils/format';
import { getReportTypes } from '../data/reportingData';

export function RegulatoryReportingPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchMock(() => getReportTypes()).then((data) => {
      setReports(data);
      setLoading(false);
    });
  }, []);

  const simulateAction = (reportId, action) => {
    setBusyId(reportId);
    setToast(null);
    fetchMock(() => ({ ok: true }), 800).then(() => {
      setBusyId(null);
      setToast({ id: reportId, message: action === 'generate' ? 'Report generated' : 'PDF download started' });
      setTimeout(() => setToast(null), 3000);
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Regulatory Reporting</h2>
        <p className="text-gray-600 mt-1">Generate and download investor and regulatory reports.</p>
      </div>

      {toast && (
        <div className="rounded-lg bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm">
          {toast.message}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 py-12 text-center">Loading report types…</p>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                <FileText className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Last generated: {formatDate(report.lastGenerated)} · Format: {report.format}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  disabled={busyId === report.id}
                  onClick={() => simulateAction(report.id, 'generate')}
                >
                  {busyId === report.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Generate Report
                </Button>
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700"
                  disabled={busyId === report.id}
                  onClick={() => simulateAction(report.id, 'download')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
