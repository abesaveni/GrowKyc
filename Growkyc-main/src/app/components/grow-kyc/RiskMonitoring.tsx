import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft, Activity } from 'lucide-react';

interface RiskMonitoringProps {
  onViewClient: (clientId: string) => void;
  onBack: () => void;
}

export function RiskMonitoring({ onViewClient, onBack }: RiskMonitoringProps) {
  return (
    <div className="p-8 space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Risk Monitoring & Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-600">Real-time monitoring dashboard coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
