import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  colorClass?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = true,
  colorClass = 'bg-indigo-600',
  size = 'md',
  className = ''
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const h = size === 'sm' ? 'h-1.5' : 'h-2.5';
  return (
    <div className={`w-full ${className}`.trim()}>
      {(label || showPercent) && (
        <div className="flex justify-between text-xs text-slate-300 mb-1">
          {label && <span>{label}</span>}
          {showPercent && <span className="font-medium text-slate-100">{pct.toFixed(0)}%</span>}
        </div>
      )}
      <div className={`w-full ${h} bg-white/10 rounded-full overflow-hidden`}>
        <div className={`${h} ${colorClass} rounded-full transition-all duration-300`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
