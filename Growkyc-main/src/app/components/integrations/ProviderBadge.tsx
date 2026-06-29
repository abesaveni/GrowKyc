import React from 'react';
import { Badge } from '../ui/badge';

interface ProviderBadgeProps {
  provider: 'asic' | 'equifax' | 'illion' | 'complyadvantage' | 'lexisnexis' | 'chainalysis' | 'internal' | 'internal_ai' | 'analytics';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function ProviderBadge({ provider, size = 'md', showIcon = false }: ProviderBadgeProps) {
  const providerConfig: Record<string, { label: string; color: string; icon: string }> = {
    asic: {
      label: 'ASIC Direct',
      color: 'bg-blue-500/10 text-blue-300 border-blue-300',
      icon: '🏛️'
    },
    equifax: {
      label: 'Equifax',
      color: 'bg-purple-500/10 text-purple-300 border-purple-300',
      icon: '📊'
    },
    illion: {
      label: 'Illion',
      color: 'bg-indigo-500/10 text-indigo-300 border-indigo-300',
      icon: '🏢'
    },
    complyadvantage: {
      label: 'ComplyAdvantage',
      color: 'bg-green-500/10 text-green-300 border-green-300',
      icon: '🛡️'
    },
    lexisnexis: {
      label: 'LexisNexis',
      color: 'bg-amber-500/10 text-amber-300 border-amber-300',
      icon: '⚖️'
    },
    chainalysis: {
      label: 'Chainalysis',
      color: 'bg-orange-500/10 text-orange-300 border-orange-300',
      icon: '₿'
    },
    internal: {
      label: 'Internal',
      color: 'bg-white/5 text-slate-300 border-white/10',
      icon: '⚙️'
    },
    internal_ai: {
      label: 'Internal AI',
      color: 'bg-cyan-500/10 text-cyan-300 border-cyan-300',
      icon: '🤖'
    },
    analytics: {
      label: 'Analytics',
      color: 'bg-pink-500/10 text-pink-300 border-pink-300',
      icon: '📈'
    }
  };

  const config = providerConfig[provider];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1'
  };

  return (
    <Badge variant="outline" className={`${config.color} ${sizeClasses[size]} font-semibold`}>
      {showIcon && <span className="mr-1">{config.icon}</span>}
      Source: {config.label}
    </Badge>
  );
}
