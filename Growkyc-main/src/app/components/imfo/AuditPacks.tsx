import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  FileText,
  Download,
  CheckCircle,
  Clock,
  Package,
  Folder,
  Shield,
  AlertCircle,
  Play,
  Eye,
  Archive
} from 'lucide-react';

interface AuditPacksProps {
  onNavigate: (page: string) => void;
  role: string;
  onBack?: () => void;
}

type PackStatus = 'ready' | 'generating' | 'review' | 'archived';

interface AuditPack {
  id: string;
  quarter: string;
  year: number;
  fund: string;
  status: PackStatus;
  generatedDate?: string;
  documents: number;
  size: string;
  auditor?: string;
}

export function AuditPacks({ onNavigate, role, onBack }: AuditPacksProps) {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);

  const auditPacks: AuditPack[] = [
    {
      id: 'pack-001',
      quarter: 'Q1',
      year: 2026,
      fund: 'Growth Credit Fund I',
      status: 'ready',
      generatedDate: '2026-04-15',
      documents: 47,
      size: '125 MB',
      auditor: 'KPMG'
    },
    {
      id: 'pack-002',
      quarter: 'Q4',
      year: 2025,
      fund: 'Growth Credit Fund I',
      status: 'archived',
      generatedDate: '2026-01-20',
      documents: 52,
      size: '138 MB',
      auditor: 'KPMG'
    },
    {
      id: 'pack-003',
      quarter: 'Q3',
      year: 2025,
      fund: 'Growth Credit Fund I',
      status: 'archived',
      generatedDate: '2025-10-18',
      documents: 45,
      size: '118 MB',
      auditor: 'KPMG'
    },
    {
      id: 'pack-004',
      quarter: 'Q1',
      year: 2026,
      fund: 'Opportunity Fund II',
      status: 'review',
      generatedDate: '2026-04-12',
      documents: 38,
      size: '95 MB',
      auditor: 'EY'
    }
  ];

  const packContents = [
    {
      category: 'Financial Statements',
      items: [
        'Trial Balance',
        'Income Statement',
        'Balance Sheet',
        'Cash Flow Statement',
        'Notes to Financial Statements'
      ]
    },
    {
      category: 'Transaction Records',
      items: [
        'Capital Calls Register',
        'Distribution Register',
        'Investment Transactions',
        'Bank Statements',
        'Reconciliations'
      ]
    },
    {
      category: 'Investor Records',
      items: [
        'Investor Registry',
        'Subscription Agreements',
        'Capital Account Statements',
        'Investor Communications',
        'KYC/AML Documentation'
      ]
    },
    {
      category: 'Compliance & Governance',
      items: [
        'Board Minutes',
        'Investment Committee Minutes',
        'Compliance Certificates',
        'Policy Documents',
        'Regulatory Filings'
      ]
    },
    {
      category: 'Portfolio Documentation',
      items: [
        'Investment Agreements',
        'Deal Memoranda',
        'Valuations',
        'Portfolio Company Financials',
        'Risk Assessments'
      ]
    },
    {
      category: 'Supporting Documents',
      items: [
        'Management Fees Calculation',
        'Performance Fees Calculation',
        'Expense Allocations',
        'NAV Calculations',
        'Audit Trail Logs'
      ]
    }
  ];

  const statusConfig = {
    ready: { label: 'Ready', color: 'bg-green-500/15 text-green-300 border-green-300', icon: CheckCircle },
    generating: { label: 'Generating', color: 'bg-blue-500/15 text-blue-300 border-blue-300', icon: Clock },
    review: { label: 'In Review', color: 'bg-yellow-500/15 text-yellow-300 border-yellow-300', icon: AlertCircle },
    archived: { label: 'Archived', color: 'bg-white/5 text-slate-300 border-white/10', icon: Archive }
  };

  if (selectedPack) {
    const pack = auditPacks.find(p => p.id === selectedPack);
    if (!pack) return null;

    const statusConf = statusConfig[pack.status];
    const StatusIcon = statusConf.icon;

    return (
      <div className="p-8 space-y-6">
        <Button variant="ghost" onClick={() => setSelectedPack(null)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Audit Packs
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">
              {pack.quarter} {pack.year} Audit Pack
            </h1>
            <p className="text-slate-300 mt-1">{pack.fund}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Download className="w-4 h-4 mr-2" />
              Download Pack
            </Button>
          </div>
        </div>

        {/* Pack Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${statusConf.color}`}>
                <StatusIcon className="w-5 h-5" />
                <span className="font-semibold">{statusConf.label}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-300">Documents</p>
              <p className="text-2xl font-bold text-slate-100 mt-1">{pack.documents}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-300">Total Size</p>
              <p className="text-2xl font-bold text-slate-100 mt-1">{pack.size}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-300">Generated</p>
              <p className="text-sm font-medium text-slate-100 mt-1">{pack.generatedDate}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-300">Auditor</p>
              <p className="text-sm font-medium text-slate-100 mt-1">{pack.auditor}</p>
            </CardContent>
          </Card>
        </div>

        {/* Pack Contents */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Pack Contents</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {packContents.map((category, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Folder className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-bold text-slate-100">{category.category}</h3>
                  </div>
                  <div className="space-y-2 ml-7">
                    {category.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start">
                <Download className="w-4 h-4 mr-2" />
                Download Full Pack (ZIP)
              </Button>
              <Button variant="outline" className="justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Download Index (PDF)
              </Button>
              <Button variant="outline" className="justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Share with Auditor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Quarterly Audit Packs</h1>
          <p className="text-slate-300 mt-1">One-click generation of comprehensive audit documentation packages</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Play className="w-4 h-4 mr-2" />
          Generate New Pack
        </Button>
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
                <p className="text-sm text-slate-300">Ready</p>
                <p className="text-3xl font-bold text-green-400 mt-1">
                  {auditPacks.filter(p => p.status === 'ready').length}
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
                <p className="text-sm text-slate-300">In Review</p>
                <p className="text-3xl font-bold text-yellow-400 mt-1">
                  {auditPacks.filter(p => p.status === 'review').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Archived</p>
                <p className="text-3xl font-bold text-slate-300 mt-1">
                  {auditPacks.filter(p => p.status === 'archived').length}
                </p>
              </div>
              <Archive className="w-8 h-8 text-slate-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* What's Included */}
      <Card className="border-2 border-indigo-300 bg-indigo-500/10">
        <CardHeader className="border-b border-indigo-500/30">
          <CardTitle className="text-indigo-300">What's Included in an Audit Pack</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-indigo-300 mb-3">Financial Documentation</h4>
              <ul className="space-y-2 text-sm text-indigo-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-400 mt-0.5" />
                  <span>Complete financial statements</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-400 mt-0.5" />
                  <span>Trial balances with adjustments</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-400 mt-0.5" />
                  <span>Bank reconciliations</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-300 mb-3">Transaction Records</h4>
              <ul className="space-y-2 text-sm text-indigo-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-400 mt-0.5" />
                  <span>Investment transaction log</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-400 mt-0.5" />
                  <span>Capital calls and distributions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-400 mt-0.5" />
                  <span>Fee calculations</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-300 mb-3">Compliance & Governance</h4>
              <ul className="space-y-2 text-sm text-indigo-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-400 mt-0.5" />
                  <span>Board and IC minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-400 mt-0.5" />
                  <span>Compliance certificates</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-400 mt-0.5" />
                  <span>Investor KYC/AML records</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Packs List */}
      <div className="grid grid-cols-1 gap-4">
        {auditPacks.map((pack) => {
          const statusConf = statusConfig[pack.status];
          const StatusIcon = statusConf.icon;

          return (
            <Card
              key={pack.id}
              className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-indigo-400"
              onClick={() => setSelectedPack(pack.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Package className="w-6 h-6 text-indigo-400" />
                      <h3 className="text-xl font-bold text-slate-100">
                        {pack.quarter} {pack.year} - {pack.fund}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConf.color}`}>
                        <StatusIcon className="w-3 h-3 inline mr-1" />
                        {statusConf.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-6">
                      <div>
                        <p className="text-xs text-slate-400">Documents</p>
                        <p className="text-lg font-semibold text-slate-100 mt-1">
                          <FileText className="w-4 h-4 inline mr-1" />
                          {pack.documents}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Size</p>
                        <p className="text-lg font-semibold text-slate-100 mt-1">{pack.size}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Generated</p>
                        <p className="text-sm font-medium text-slate-100 mt-1">{pack.generatedDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Auditor</p>
                        <p className="text-sm font-medium text-slate-100 mt-1">{pack.auditor}</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" onClick={(e) => {
                    e.stopPropagation();
                    // Handle download
                  }}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
