import React, { useEffect, useState } from 'react';
import { Shield, ArrowRight } from 'lucide-react';
import { Button } from '../../app/components/ui/button';
import { DashboardTable } from '../components/DashboardTable';
import { fetchMock } from '../utils/fetchMock';
import { formatDate } from '../utils/format';
import { RISK_MATRIX, getComplianceObligations } from '../data/complianceData';

const LIKELIHOODS = ['Low', 'Medium', 'High'];
const IMPACTS = ['Low', 'Medium', 'High'];

function cellColor(count, level) {
  if (count === 0) return 'bg-slate-50 text-slate-400';
  if (level === 'critical') return 'bg-red-200 text-red-900 font-bold';
  if (level === 'high') return 'bg-orange-100 text-orange-900 font-semibold';
  if (level === 'medium') return 'bg-amber-50 text-amber-900';
  return 'bg-green-50 text-green-800';
}

function obligationStatusClass(status) {
  const map = {
    completed: 'bg-green-100 text-green-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    pending: 'bg-slate-100 text-slate-800',
    overdue: 'bg-red-100 text-red-800'
  };
  return map[status] || map.pending;
}

export function ComplianceRiskPage({ onGoToKyc }) {
  const [obligations, setObligations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMock(() => getComplianceObligations()).then((data) => {
      setObligations(data);
      setLoading(false);
    });
  }, []);

  const getCell = (likelihood, impact) => {
    const cell = RISK_MATRIX.find((r) => r.likelihood === likelihood && r.impact === impact);
    return cell || { count: 0, level: 'low' };
  };

  const columns = [
    { key: 'name', label: 'Obligation' },
    { key: 'dueDate', label: 'Due date', render: (r) => formatDate(r.dueDate) },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${obligationStatusClass(r.status)}`}>
          {r.status.replace('-', ' ')}
        </span>
      )
    }
  ];

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-7 h-7 text-indigo-600" />
            Compliance & Risk
          </h2>
          <p className="text-gray-600 mt-1">Risk heatmap and regulatory obligations tracker.</p>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={() => onGoToKyc && onGoToKyc()}
        >
          Go to KYC Review
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left text-gray-600 font-medium">Likelihood ↓ / Impact →</th>
                {IMPACTS.map((imp) => (
                  <th key={imp} className="p-2 text-center font-semibold text-gray-700">
                    {imp}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LIKELIHOODS.map((lik) => (
                <tr key={lik}>
                  <td className="p-2 font-semibold text-gray-700">{lik}</td>
                  {IMPACTS.map((imp) => {
                    const cell = getCell(lik, imp);
                    return (
                      <td key={imp} className="p-1">
                        <div
                          className={`rounded-lg p-4 text-center min-h-[64px] flex flex-col justify-center ${cellColor(cell.count, cell.level)}`}
                        >
                          <span className="text-2xl">{cell.count}</span>
                          <span className="text-[10px] uppercase tracking-wide opacity-80">risks</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance obligations</h3>
        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : (
          <DashboardTable columns={columns} rows={obligations} />
        )}
      </div>
    </div>
  );
}
