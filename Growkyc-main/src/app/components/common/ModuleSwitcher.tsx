import React from 'react';
import { LayoutGrid } from 'lucide-react';

function getRuntimeEnv(): Record<string, string | boolean | undefined> {
  const viteEnv = (typeof import.meta !== 'undefined' ? (import.meta as any).env : {}) || {};
  const processEnv = ((globalThis as any)?.process?.env || {}) as Record<string, string>;
  return { ...processEnv, ...viteEnv };
}

function isFlagEnabled(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
}

interface ModuleSwitcherProps {
  currentModule?: string;
  onSwitchModule: (module: string) => void;
  className?: string;
}

export function ModuleSwitcher({ currentModule, onSwitchModule, className = '' }: ModuleSwitcherProps) {
  const env = getRuntimeEnv();
  const isProduction =
    Boolean((import.meta as any)?.env?.PROD) ||
    env.NODE_ENV === 'production' ||
    env.VITE_APP_ENV === 'production';
  const allowLegacyModules = isFlagEnabled(env.VITE_ENABLE_LEGACY_MODULES);
  const blockLegacyModules = isProduction && !allowLegacyModules;

  if (blockLegacyModules) {
    return (
      <div className={`fixed top-4 right-4 z-50 ${className}`}>
        <div className="flex items-center gap-2 bg-white border-2 border-red-300 rounded-lg shadow-xl px-3 py-2">
          <LayoutGrid className="w-4 h-4 text-red-400" />
          <span className="text-sm font-semibold text-red-300">Production Lock: Grow KYC only</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <div className="flex items-center gap-2 bg-white border-2 border-white/10 rounded-lg shadow-xl px-3 py-2">
        <LayoutGrid className="w-4 h-4 text-slate-300" />
        <select
          value={currentModule || 'Grow MIP'}
          onChange={(e) => onSwitchModule(e.target.value)}
          className="bg-transparent text-sm font-semibold text-slate-300 focus:outline-none cursor-pointer pr-8"
        >
          <option value="Grow MIP">Grow MIP</option>
          <option value="grow_kyc">Grow KYC</option>
          <option value="grow_esign">ðŸ” Grow E-Sign</option>
        </select>
      </div>
    </div>
  );
}
