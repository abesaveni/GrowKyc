import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '../ui/button';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm mb-4" aria-label="Breadcrumb">
      <Button
        variant="ghost"
        size="sm"
        onClick={items[0]?.onClick}
        className="h-7 px-2 text-slate-300 hover:text-white"
      >
        <Home className="w-4 h-4" />
      </Button>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="w-4 h-4 text-slate-400" />
          {item.active || index === items.length - 1 ? (
            <span className="px-2 py-1 font-semibold text-white">
              {item.label}
            </span>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={item.onClick}
              className="h-7 px-2 text-slate-300 hover:text-white"
            >
              {item.label}
            </Button>
          )}
        </div>
      ))}
    </nav>
  );
}
