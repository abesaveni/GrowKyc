import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  FileText,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  Calendar,
  Users,
  Shield,
  Eye,
  RefreshCw,
  Play,
  CheckSquare,
  Plus
} from 'lucide-react';

interface QuarterlyAuditPacksProps {
  onNavigate: (page: string) => void;
  role: string;
  onBack?: () => void;
}

type PackStatus = 'complete' | 'pending' | 'in_progress' | 'not_started';

interface AuditPack {
  id: string;
  period: string;
  fund: string;
  status: PackStatus;
  generatedDate?: string;
  auditor?: string;
  documents: number;
  completeness: number;
  sections: AuditSection[];
}

interface AuditSection {
  id: string;
  name: string;
  status: 'complete' | 'pending' | 'missing';
  documents: number;
  lastUpdated: string;
}

export function QuarterlyAuditPacks({ onNavigate, role, onBack }: QuarterlyAuditPacksProps) {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);

  const auditPacks: AuditPack[] = [
    {
      id: 'pack-001',
      period: 'Q4 2025',
      fund: 'Growth Credit Fund I',
      status: 'complete',
      generatedDate: '2026-01-15',
      auditor: 'KPMG',
      documents: 47,
      completeness: 100,
      sections: [
        { id: 's1', name: 'Financial Statements', status: 'complete', documents: 12, lastUpdated: '2026-01-10' },
        { id: 's2', name: 'Portfolio Holdings', status: 'complete', documents: 8, lastUpdated: '2026-01-12' },
        { id: 's3', name: 'Transaction Records', status: 'complete', documents: 15, lastUpdated: '2026-01-14' },
        { id: 's4', name: 'Capital Activity', status: 'complete', documents: 6, lastUpdated: '2026-01-13' },
        { id: 's5', name: 'NAV Calculations', status: 'complete', documents: 4, lastUpdated: '2026-01-15' },
        { id: 's6', name: 'Fee Calculations', status: 'complete', documents: 2, lastUpdated: '2026-01-15' }
      ]
    },
    {
      id: 'pack-002',
      period: 'Q3 2025',
      fund: 'Growth Credit Fund I',
      status: 'complete',
      generatedDate: '2025-10-20',
      auditor: 'KPMG',
      documents: 45,
      completeness: 100,
      sections: [
        { id: 's1', name: 'Financial Statements', status: 'complete', documents: 12, lastUpdated: '2025-10-15' },
        { id: 's2', name: 'Portfolio Holdings', status: 'complete', documents: 7, lastUpdated: '2025-10-16' },
        { id: 's3', name: 'Transaction Records', status: 'complete', documents: 14, lastUpdated: '2025-10-18' },
        { id: 's4', name: 'Capital Activity', status: 'complete', documents: 6, lastUpdated: '2025-10-17' },
        { id: 's5', name: 'NAV Calculations', status: 'complete', documents: 4, lastUpdated: '2025-10-19' },
        { id: 's6', name: 'Fee Calculations', status: 'complete', documents: 2, lastUpdated: '2025-10-20' }
      ]
    },
    {
      id: 'pack-003',
      period: 'Q1 2026',
      fund: 'Growth Credit Fund I',
      status: 'in_progress',
      documents: 32,
      completeness: 68,
      sections: [
        { id: 's1', name: 'Financial Statements', status: 'complete', documents: 12, lastUpdated: '2026-02-10' },
        { id: 's2', name: 'Portfolio Holdings', status: 'complete', documents: 8, lastUpdated: '2026-02-12' },
        { id: 's3', name: 'Transaction Records', status: 'pending', documents: 12, lastUpdated: '2026-02-14' },
        { id: 's4', name: 'Capital Activity', status: 'missing', documents: 0, lastUpdated: 'Not started' },
        { id: 's5', name: 'NAV Calculations', status: 'missing', documents: 0, lastUpdated: 'Not started' },
        { id: 's6', name: 'Fee Calculations', status: 'missing', documents: 0, lastUpdated: 'Not started' }
      ]
    },
    {
      id: 'pack-004',
      period: 'Q4 2025',
      fund: 'Opportunity Fund II',
      status: 'complete',
      generatedDate: '2026-01-18',
      auditor: 'Deloitte',
      documents: 38,
      completeness: 100,
      sections: [
        { id: 's1', name: 'Financial Statements', status: 'complete', documents: 10, lastUpdated: '2026-01-12' },
        { id: 's2', name: 'Portfolio Holdings', status: 'complete', documents: 6, lastUpdated: '2026-01-14' },
        { id: 's3', name: 'Transaction Records', status: 'complete', documents: 12, lastUpdated: '2026-01-16' },
        { id: 's4', name: 'Capital Activity', status: 'complete', documents: 5, lastUpdated: '2026-01-15' },
        { id: 's5', name: 'NAV Calculations', status: 'complete', documents: 3, lastUpdated: '2026-01-17' },
        { id: 's6', name: 'Fee Calculations', status: 'complete', documents: 2, lastUpdated: '2026-01-18' }
      ]
    }
  ];

  const statusConfig = {
    complete: { label: 'Complete', color: 'bg-green-500/15 text-green-300 border-green-300', icon: CheckCircle },
    pending: { label: 'Pending Review', color: 'bg-yellow-500/15 text-yellow-300 border-yellow-300', icon: Clock },
    in_progress: { label: 'In Progress', color: 'bg-blue-500/15 text-blue-300 border-blue-300', icon: RefreshCw },
    not_started: { label: 'Not Started', color: 'bg-white/5 text-slate-300 border-white/10', icon: AlertCircle }
  };

  const sectionStatusConfig = {
    complete: { color: 'bg-green-600', icon: CheckCircle, textColor: 'text-green-300' },
    pending: { color: 'bg-yellow-600', icon: Clock, textColor: 'text-yellow-300' },
    missing: { color: 'bg-red-600', icon: AlertCircle, textColor: 'text-red-300' }
  };

  // Pack Detail View
  if (selectedPack) {
    const pack = auditPacks.find(p => p.id === selectedPack);
    if (!pack) return null;

    return (
      <div className="p-8 space-y-6">
        <div>
          <Button variant="ghost" onClick={() => setSelectedPack(null)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Audit Packs
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-100">{pack.period} Audit Pack</h1>
              <p className="text-slate-300 mt-1">{pack.fund}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview Pack
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <Card className={`border-2 ${pack.status === 'complete' ? 'border-green-300 bg-green-500/10' : 'border-blue-300 bg-blue-500/10'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${pack.status === 'complete' ? 'bg-green-500/20' : 'bg-blue-500/20'}`}>
                  <Package className={`w-8 h-8 ${pack.status === 'complete' ? 'text-green-300' : 'text-blue-300'}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${pack.status === 'complete' ? 'text-green-300' : 'text-blue-300'}`}>
                    {pack.completeness}% Complete
                  </p>
                  <p className={`text-sm ${pack.status === 'complete' ? 'text-green-300' : 'text-blue-300'}`}>
                    {pack.documents} documents included
                  </p>
                </div>
              </div>
              {pack.status === 'complete' && pack.auditor && (
                <div className="text-right">
                  <p className="text-sm text-slate-300">Auditor</p>
                  <p className="font-bold text-slate-100">{pack.auditor}</p>
                  <p className="text-xs text-slate-400">Generated {pack.generatedDate}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <div>
          <h2 className="text-xl font-bold text-slate-100 mb-4">Audit Pack Sections</h2>
          <div className="grid grid-cols-1 gap-4">
            {pack.sections.map((section) => {
              const sectionStatus = sectionStatusConfig[section.status];
              const SectionIcon = sectionStatus.icon;

              return (
                <Card key={section.id} className="hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-2 h-16 ${sectionStatus.color} rounded`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-slate-100">{section.name}</h3>
                            <span className={`flex items-center gap-1 text-sm font-semibold ${sectionStatus.textColor}`}>
                              <SectionIcon className="w-4 h-4" />
                              {section.status === 'complete' ? 'Complete' : section.status === 'pending' ? 'In Review' : 'Missing'}
                            </span>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-slate-300">
                            <span>
                              <FileText className="w-4 h-4 inline mr-1" />
                              {section.documents} documents
                            </span>
                            <span>
                              Last updated: {section.lastUpdated}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {section.status === 'complete' && (
                          <>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </>
                        )}
                        {section.status === 'pending' && (
                          <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Complete
                          </Button>
                        )}
                        {section.status === 'missing' && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Play className="w-4 h-4 mr-1" />
                            Generate
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        {pack.status === 'in_progress' && (
          <Card className="border-2 border-blue-300 bg-blue-500/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <RefreshCw className="w-6 h-6 text-blue-400 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-blue-300 mb-2">Complete This Audit Pack</h3>
                  <p className="text-sm text-blue-300 mb-4">
                    {pack.sections.filter(s => s.status !== 'complete').length} sections remaining. 
                    Click "Generate" on missing sections to auto-populate from your fund data.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Play className="w-4 h-4 mr-2" />
                    Auto-Generate Missing Sections
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Main List View
  return (
    <div className="p-8 space-y-6">
      <div>
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        )}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Quarterly Audit Packs</h1>
            <p className="text-slate-300 mt-1">One-click quarterly audit pack generation with automatic data compilation</p>
          </div>
          {(role === 'fund-manager' || role === 'fund-accountant' || role === 'cfo') && (
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Generate New Pack
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Total Packs</p>
                <p className="text-3xl font-bold text-slate-100 mt-1">{auditPacks.length}</p>
              </div>
              <Package className="w-8 h-8 text-indigo-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Complete</p>
                <p className="text-3xl font-bold text-green-400 mt-1">
                  {auditPacks.filter(p => p.status === 'complete').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">In Progress</p>
                <p className="text-3xl font-bold text-blue-400 mt-1">
                  {auditPacks.filter(p => p.status === 'in_progress').length}
                </p>
              </div>
              <RefreshCw className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Total Documents</p>
                <p className="text-3xl font-bold text-purple-400 mt-1">
                  {auditPacks.reduce((sum, p) => sum + p.documents, 0)}
                </p>
              </div>
              <FileText className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Packs List */}
      <div className="grid grid-cols-1 gap-4">
        {auditPacks.map((pack) => {
          const status = statusConfig[pack.status];
          const StatusIcon = status.icon;

          return (
            <Card 
              key={pack.id} 
              className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-indigo-400"
              onClick={() => setSelectedPack(pack.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-indigo-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-100">{pack.period} Audit Pack</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {status.label}
                        </span>
                      </div>

                      <p className="text-sm text-slate-300 mb-3">{pack.fund}</p>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">Completeness</span>
                          <span className="font-semibold text-slate-100">{pack.completeness}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${pack.completeness === 100 ? 'bg-green-600' : 'bg-blue-600'}`}
                            style={{ width: `${pack.completeness}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-6 mt-3 text-sm text-slate-300">
                        <span>
                          <FileText className="w-4 h-4 inline mr-1" />
                          {pack.documents} documents
                        </span>
                        <span>
                          <CheckSquare className="w-4 h-4 inline mr-1" />
                          {pack.sections.filter(s => s.status === 'complete').length}/{pack.sections.length} sections
                        </span>
                        {pack.generatedDate && (
                          <span>
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Generated {pack.generatedDate}
                          </span>
                        )}
                        {pack.auditor && (
                          <span>
                            <Users className="w-4 h-4 inline mr-1" />
                            {pack.auditor}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature Highlight */}
      <Card className="border-2 border-green-300 bg-green-500/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
            <div>
              <h3 className="font-bold text-green-300 mb-2">One-Click Audit Pack Generation</h3>
              <p className="text-sm text-green-300 mb-4">
                Automatically compile all required documents, statements, and schedules from your fund operations. 
                Each pack includes:
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-green-300">Financial Statements</p>
                  <p className="text-green-300">Balance sheet, P&L, cashflow</p>
                </div>
                <div>
                  <p className="font-semibold text-green-300">Portfolio Reports</p>
                  <p className="text-green-300">Holdings, valuations, transactions</p>
                </div>
                <div>
                  <p className="font-semibold text-green-300">Supporting Schedules</p>
                  <p className="text-green-300">NAV, fees, capital activity</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
