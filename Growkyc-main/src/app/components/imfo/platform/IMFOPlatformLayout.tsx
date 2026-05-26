import React from 'react';
import { Breadcrumbs } from '../../ui/breadcrumbs';
import { PageHeader } from '../../shared/dashboard/PageHeader';
import { TableSkeleton } from '../../ui/loading';

interface IMFOPlatformLayoutProps {
  title: string;
  description: string;
  section: string;
  onNavigate?: (page: string) => void;
  loading?: boolean;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function IMFOPlatformLayout({
  title,
  description,
  section,
  onNavigate,
  loading,
  actions,
  children
}: IMFOPlatformLayoutProps) {
  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <Breadcrumbs
        items={[
          { label: 'IMFO Platform', onClick: onNavigate ? () => onNavigate('dashboard') : undefined },
          { label: section, active: true }
        ]}
      />
      <PageHeader title={title} description={description} actions={actions} />
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <TableSkeleton rows={5} />
        </div>
      ) : (
        children
      )}
    </div>
  );
}
