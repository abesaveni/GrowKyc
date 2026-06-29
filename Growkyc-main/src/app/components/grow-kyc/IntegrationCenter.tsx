import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft, Shield, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface IntegrationCenterProps {
  onBack: () => void;
}

export function IntegrationCenter({ onBack }: IntegrationCenterProps) {
  const integrations = [
    { name: 'GreenID', purpose: 'Identity Verification & AML/CTF', status: 'connected', critical: true },
    { name: 'Credit Watch', purpose: 'Insolvency & Court Action Monitoring', status: 'connected', critical: true },
    { name: 'WorldCheck', purpose: 'Sanctions & PEP Screening', status: 'connected', critical: true },
    { name: 'ASIC Connect', purpose: 'Company & Director Searches', status: 'connected', critical: false },
    { name: 'ABR Lookup', purpose: 'ABN Validation', status: 'connected', critical: false },
    { name: 'PPSR', purpose: 'Security Interest Searches', status: 'disconnected', critical: false }
  ];

  return (
    <div className="p-8 space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      <div>
        <h1 className="text-3xl font-bold text-white">Integration Center</h1>
        <p className="text-slate-300 mt-1">Regulatory data providers and verification services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <Card
            key={integration.name}
            className={`border-2 ${
              integration.status === 'connected'
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300'
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-white mb-1">{integration.name}</h3>
                  <p className="text-sm text-slate-300">{integration.purpose}</p>
                </div>
                {integration.status === 'connected' ? (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-slate-400 flex-shrink-0" />
                )}
              </div>
              {integration.critical && (
                <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded border border-orange-300 mb-3">
                  Critical Service
                </span>
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={integration.status === 'connected' ? 'outline' : 'default'}
                  className="flex-1"
                >
                  {integration.status === 'connected' ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Test
                    </>
                  ) : (
                    'Connect'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-2 border-blue-300 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-bold text-blue-900 mb-2">API Security</h3>
              <p className="text-sm text-blue-800">
                All integration credentials are encrypted at rest. API calls are logged immutably for audit purposes.
                Webhook endpoints use HMAC signing for verification.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
