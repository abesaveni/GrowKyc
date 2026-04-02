import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  Eye,
  FileText,
  Download,
  Shield,
  Clock,
  CheckCircle,
  Database
} from 'lucide-react';

interface AuditDashboardProps {
  onViewClient: (clientId: string) => void;
}

export function AuditDashboard({ onViewClient }: AuditDashboardProps) {
  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-blue-300 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-semibold">Audit Events (30d)</p>
                <p className="text-4xl font-bold text-blue-700 mt-1">45,892</p>
              </div>
              <Database className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-300 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-semibold">Cases Logged</p>
                <p className="text-4xl font-bold text-green-700 mt-1">1,247</p>
              </div>
              <FileText className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-300 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-semibold">Retention Compliant</p>
                <p className="text-4xl font-bold text-purple-700 mt-1">100%</p>
              </div>
              <CheckCircle className="w-10 h-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-300 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 font-semibold">Evidence Items</p>
                <p className="text-4xl font-bold text-orange-700 mt-1">28,456</p>
              </div>
              <Shield className="w-10 h-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Audit Trail Exports
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {['AUSTRAC Compliance Pack', 'ACL Credit Files', 'AFSL Incident Records', 'Privacy Breach Logs'].map(
              (item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-900">{item}</span>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
