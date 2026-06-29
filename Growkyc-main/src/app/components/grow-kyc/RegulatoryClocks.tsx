import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft, Clock } from 'lucide-react';

interface RegulatoryClocksProps {
  onViewClient: (clientId: string) => void;
  onViewCase: (caseId: string) => void;
  onBack: () => void;
}

export function RegulatoryClocks({ onViewClient, onViewCase, onBack }: RegulatoryClocksProps) {
  return (
    <div className="p-8 space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Regulatory Clocks & Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-slate-300">Regulatory clock tracking coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
