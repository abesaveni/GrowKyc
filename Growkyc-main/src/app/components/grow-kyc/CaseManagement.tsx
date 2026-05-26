import React from 'react';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { CaseManagement as CaseManagementModule } from '../kyc/CaseManagement';
import { Breadcrumbs } from './Breadcrumbs';

interface CaseManagementProps {
  onViewCase: (caseId: string) => void;
  onBack: () => void;
}

export function CaseManagement({ onViewCase, onBack }: CaseManagementProps) {
  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Dashboard', onClick: onBack },
          { label: 'Case Management', active: true }
        ]}
      />
      <CaseManagementModule onViewCase={onViewCase} />
    </div>
  );
}