import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { DollarSign, CheckCircle } from 'lucide-react';

interface FinancialProfileProps {
  entity: any;
  onComplete: (data: any) => void;
}

export function FinancialProfile({ entity, onComplete }: FinancialProfileProps) {
  // Skip if not required based on business profile
  const shouldSkip = !entity.data.crossBorder && !entity.data.cashHandling;

  if (shouldSkip) {
    // Auto-skip this stage
    React.useEffect(() => {
      onComplete({ skipped: true });
    }, []);
    
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>Financial Profile</CardTitle>
            <CardDescription>Provide financial details for credit assessment</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-slate-300 mb-4">This section is optional for basic compliance.</p>
        <Button onClick={() => onComplete({ skipped: false })}>
          Skip for Now
          <CheckCircle className="w-5 h-5 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
