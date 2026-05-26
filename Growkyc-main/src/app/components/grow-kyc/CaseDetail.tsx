import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';

interface CaseDetailProps {
  caseId: string;
  onBack: () => void;
}

export function CaseDetail({ caseId, onBack }: CaseDetailProps) {
  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Dashboard', onClick: () => onBack() },
          { label: 'Case Management', onClick: onBack },
          { label: `Case ${caseId}`, active: true }
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Case Detail: {caseId}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-600">Case detail view coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}