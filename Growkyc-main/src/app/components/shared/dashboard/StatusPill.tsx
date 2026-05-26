import React from 'react';

const PRESETS: Record<string, string> = {
  active: 'bg-green-100 text-green-800 border-green-200',
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  sold: 'bg-blue-100 text-blue-800 border-blue-200',
  'for-sale': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  marketing: 'bg-purple-100 text-purple-800 border-purple-200',
  frozen: 'bg-red-100 text-red-800 border-red-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  admitted: 'bg-green-100 text-green-800 border-green-200',
  partial: 'bg-amber-100 text-amber-800 border-amber-200',
  subscribed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  draft: 'bg-gray-100 text-gray-700 border-gray-200'
};

interface StatusPillProps {
  status: string;
  label?: string;
  className?: string;
}

export function StatusPill({ status, label, className = '' }: StatusPillProps) {
  const key = status.toLowerCase().replace(/\s+/g, '-');
  const styles = PRESETS[key] || 'bg-slate-100 text-slate-800 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles} ${className}`}>
      {label || status}
    </span>
  );
}
