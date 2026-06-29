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
    <div className="p-4 md:p-6 space-y-6">
      {/* Welcome Hero Section */}
      <div className="bg-gradient-to-r from-[#1e293b] to-[#4338ca] rounded-2xl p-6 md:p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 text-center sm:text-left">
          <div className="text-4xl">🕵️‍♂️</div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, David!</h1>
            <p className="text-white/90 text-sm md:text-xl">
              Internal Auditor • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Embedded Glassmorphism KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 h-32 md:h-40 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl md:text-3xl font-bold mb-1">45,892</div>
                <div className="text-xs md:text-sm text-white/90 font-medium">Audit Events (30d)</div>
              </div>
              <Database className="w-8 h-8 text-white/80" />
            </div>
            <div className="text-[10px] text-white/70 uppercase tracking-wider font-bold">System Log Track</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 h-32 md:h-40 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl md:text-3xl font-bold mb-1">1,247</div>
                <div className="text-xs md:text-sm text-white/90 font-medium">Cases Logged</div>
              </div>
              <FileText className="w-8 h-8 text-white/80" />
            </div>
            <div className="text-[10px] text-white/70 uppercase tracking-wider font-bold">Matched Records</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 h-32 md:h-40 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl md:text-3xl font-bold mb-1">100%</div>
                <div className="text-xs md:text-sm text-white/90 font-medium">Retention Compliant</div>
              </div>
              <CheckCircle className="w-8 h-8 text-white/80" />
            </div>
            <div className="text-[10px] text-white/70 uppercase tracking-wider font-bold">Security Standard</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 h-32 md:h-40 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl md:text-3xl font-bold mb-1">28,456</div>
                <div className="text-xs md:text-sm text-white/90 font-medium">Evidence Items</div>
              </div>
              <Shield className="w-8 h-8 text-white/80" />
            </div>
            <div className="text-[10px] text-white/70 uppercase tracking-wider font-bold">Audit Evidence Pack</div>
          </div>
        </div>
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
                <div key={idx} className="flex items-center justify-between p-4 bg-[#0f172a] rounded-lg border">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-slate-300" />
                    <span className="font-semibold text-white">{item}</span>
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
