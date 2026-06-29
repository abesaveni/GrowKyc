import React from 'react';

const PRESETS: Record<string, string> = {
  active: 'bg-green-500/15 text-green-300 border-green-500/30',
  pending: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  sold: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  'for-sale': 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  marketing: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  frozen: 'bg-red-500/15 text-red-300 border-red-500/30',
  approved: 'bg-green-500/15 text-green-300 border-green-500/30',
  rejected: 'bg-red-500/15 text-red-300 border-red-500/30',
  admitted: 'bg-green-500/15 text-green-300 border-green-500/30',
  partial: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  subscribed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  draft: 'bg-white/5 text-slate-300 border-white/10'
};

interface StatusPillProps {
  status: string;
  label?: string;
  className?: string;
}

export function StatusPill({ status, label, className = '' }: StatusPillProps) {
  const key = status.toLowerCase().replace(/\s+/g, '-');
  const styles = PRESETS[key] || 'bg-white/5 text-slate-100 border-white/10';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles} ${className}`}>
      {label || status}
    </span>
  );
}
