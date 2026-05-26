import React, { useEffect, useState } from 'react';
import { InvestorRegistry } from '../../app/components/imfo/InvestorRegistry';
import { DashboardTable } from '../components/DashboardTable';
import { fetchMock } from '../utils/fetchMock';
import { formatCurrency, formatDate } from '../utils/format';
import { getDistributionHistory, getCapitalCallSchedule } from '../data/investorRelationsData';

export function InvestorRelationsPage({ onNavigate, role = 'fund-manager' }) {
  const [distributions, setDistributions] = useState([]);
  const [capitalCalls, setCapitalCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMock(() => ({
      distributions: getDistributionHistory(),
      capitalCalls: getCapitalCallSchedule()
    })).then((data) => {
      setDistributions(data.distributions);
      setCapitalCalls(data.capitalCalls);
      setLoading(false);
    });
  }, []);

  const distributionColumns = [
    { key: 'investor', label: 'Investor' },
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    { key: 'amount', label: 'Amount', render: (r) => formatCurrency(r.amount) },
    { key: 'type', label: 'Type' },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
          {r.status}
        </span>
      )
    }
  ];

  const capitalColumns = [
    { key: 'investor', label: 'Investor' },
    { key: 'fund', label: 'Fund' },
    { key: 'dueDate', label: 'Due date', render: (r) => formatDate(r.dueDate) },
    { key: 'amount', label: 'Amount', render: (r) => formatCurrency(r.amount) },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 capitalize">
          {r.status}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <InvestorRegistry onNavigate={onNavigate || (() => {})} role={role} />

      <div className="px-6 pb-8 space-y-8 max-w-[1600px] mx-auto">
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Distribution history</h3>
          {loading ? (
            <p className="text-gray-500">Loading…</p>
          ) : (
            <DashboardTable columns={distributionColumns} rows={distributions} />
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Capital call schedule</h3>
          {loading ? (
            <p className="text-gray-500">Loading…</p>
          ) : (
            <DashboardTable columns={capitalColumns} rows={capitalCalls} />
          )}
        </div>
      </div>
    </div>
  );
}
