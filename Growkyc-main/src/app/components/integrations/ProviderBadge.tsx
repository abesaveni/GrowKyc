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
      color: 'bg-blue-50 text-blue-700 border-blue-300',
      icon: '🏛️'
    },
    equifax: {
      label: 'Equifax',
      color: 'bg-purple-50 text-purple-700 border-purple-300',
      icon: '📊'
    },
    illion: {
      label: 'Illion',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-300',
      icon: '🏢'
    },
    complyadvantage: {
      label: 'ComplyAdvantage',
      color: 'bg-green-50 text-green-700 border-green-300',
      icon: '🛡️'
    },
    lexisnexis: {
      label: 'LexisNexis',
      color: 'bg-amber-50 text-amber-700 border-amber-300',
      icon: '⚖️'
    },
    chainalysis: {
      label: 'Chainalysis',
      color: 'bg-orange-50 text-orange-700 border-orange-300',
      icon: '₿'
    },
    internal: {
      label: 'Internal',
      color: 'bg-gray-50 text-gray-700 border-gray-300',
      icon: '⚙️'
    },
    internal_ai: {
      label: 'Internal AI',
      color: 'bg-cyan-50 text-cyan-700 border-cyan-300',
      icon: '🤖'
    },
    analytics: {
      label: 'Analytics',
      color: 'bg-pink-50 text-pink-700 border-pink-300',
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
