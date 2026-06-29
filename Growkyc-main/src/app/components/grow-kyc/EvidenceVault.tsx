import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft, Lock } from 'lucide-react';

interface EvidenceVaultProps {
  onBack: () => void;
}

export function EvidenceVault({ onBack }: EvidenceVaultProps) {
  return (
    <div className="p-8 space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Evidence Vault
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-slate-300">Immutable evidence repository coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
