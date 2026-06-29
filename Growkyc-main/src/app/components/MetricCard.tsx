import React from 'react';
import { Card, CardContent } from './ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

export function MetricCard({ title, value, subtitle, icon: Icon, trend, className = '' }: MetricCardProps) {
  return (
    <Card className={`border shadow-sm ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-slate-400 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-semibold text-slate-100">{value}</h3>
              {trend && (
                <span className={`text-sm font-medium ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {trend.positive ? '↑' : '↓'} {trend.value}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
            )}
          </div>
          {Icon && (
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Icon className="w-5 h-5 text-indigo-400" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
