import React from 'react';

export function DashboardCard({ title, value, subtitle, icon: Icon, accent = 'indigo' }) {
  const accents = {
    indigo: 'border-indigo-200 bg-indigo-50/50',
    emerald: 'border-emerald-200 bg-emerald-50/50',
    amber: 'border-amber-200 bg-amber-50/50',
    rose: 'border-rose-200 bg-rose-50/50',
    slate: 'border-slate-200 bg-white'
  };

  return (
    <div className={`rounded-xl border-2 p-5 shadow-sm ${accents[accent] || accents.slate}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="p-2 rounded-lg bg-white border border-gray-200">
            <Icon className="w-5 h-5 text-gray-700" />
          </div>
        )}
      </div>
    </div>
  );
}
