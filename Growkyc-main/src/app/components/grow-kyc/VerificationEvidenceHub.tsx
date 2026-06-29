import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Link as LinkIcon,
  Eye,
  Upload,
  Download,
  Shield,
  DollarSign,
  Home,
  CreditCard,
  Briefcase,
  User,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';

interface VerificationEvidenceHubProps {
  clientId?: string;
  clientName?: string;
  onBack: () => void;
}

export function VerificationEvidenceHub({ 
  clientId = 'CL-2024-1203',
  clientName = 'Quantum Technologies Ltd',
  onBack 
}: VerificationEvidenceHubProps) {
  // Field-to-Document Evidence Mapping
  const evidenceMapping = {
    income: [
      {
        field: 'Employment Income',
        value: '$12,500/month',
        documentType: 'Payslips',
        documentRef: 'DOC-2024-0445',
        documentName: 'Payslips_Jan-Mar_2024.pdf',
        verifiedBy: 'Emma Williams',
        verifiedDate: '2024-03-15',
        verificationStatus: 'Verified',
        notes: '3 consecutive payslips verified - consistent income'
      },
      {
        field: 'Rental Income',
        value: '$2,800/month',
        documentType: 'Lease Agreement',
        documentRef: 'DOC-2024-0446',
        documentName: 'Rental_Agreement_Property_123.pdf',
        verifiedBy: 'Emma Williams',
        verifiedDate: '2024-03-15',
        verificationStatus: 'Verified',
        notes: 'Lease agreement + bank statements showing rental deposits'
      },
      {
        field: 'Investment Income',
        value: '$1,200/month',
        documentType: 'Investment Statements',
        documentRef: 'DOC-2024-0447',
        documentName: 'Investment_Portfolio_Statement_Q1.pdf',
        verifiedBy: 'Emma Williams',
        verifiedDate: '2024-03-15',
        verificationStatus: 'Verified',
        notes: 'Dividend income from share portfolio verified'
      }
    ],
    expenses: [
      {
        field: 'Rent/Mortgage',
        value: '$3,200/month',
        documentType: 'Bank Statement',
        documentRef: 'DOC-2024-0448',
        documentName: 'Bank_Statement_Jan-Mar_2024.pdf',
        verifiedBy: 'Emma Williams',
        verifiedDate: '2024-03-16',
        verificationStatus: 'Verified',
        notes: 'Recurring monthly mortgage payment verified in bank statements'
      },
      {
        field: 'Living Expenses',
        value: '$2,800/month',
        documentType: 'Declared Form',
        documentRef: 'DOC-2024-0449',
        documentName: 'Expense_Declaration_Form.pdf',
        verifiedBy: 'Emma Williams',
        verifiedDate: '2024-03-16',
        verificationStatus: 'Declared',
        notes: 'Client declared expenses - benchmarked against HEM (reasonable)'
      },
      {
        field: 'Existing Loan Repayments',
        value: '$1,500/month',
        documentType: 'Credit Report',
        documentRef: 'DOC-2024-0450',
        documentName: 'Credit_Report_Equifax.pdf',
        verifiedBy: 'Emma Williams',
        verifiedDate: '2024-03-16',
        verificationStatus: 'Verified',
        notes: 'Car loan repayment verified via credit report and bank statement'
      },
      {
        field: 'Credit Card Repayments',
        value: '$800/month',
        documentType: 'Credit Report',
        documentRef: 'DOC-2024-0450',
        documentName: 'Credit_Report_Equifax.pdf',
        verifiedBy: 'Emma Williams',
        verifiedDate: '2024-03-16',
        verificationStatus: 'Verified',
        notes: 'Credit card limit $15,000, using 3% buffer calculation'
      }
    ],
    liabilities: [
      {
        field: 'Car Loan',
        value: '$28,500 outstanding',
        documentType: 'Credit Report',
        documentRef: 'DOC-2024-0450',
        documentName: 'Credit_Report_Equifax.pdf',
        verifiedBy: 'Emma Williams',
        verifiedDate: '2024-03-16',
        verificationStatus: 'Verified',
        notes: 'Car loan balance verified - 18 months remaining'
      },
      {
        field: 'Credit Card',
        value: '$15,000 limit',
        documentType: 'Credit Report',
        documentRef: 'DOC-2024-0450',
        documentName: 'Credit_Report_Equifax.pdf',
        verifiedBy: 'Emma Williams',
        verifiedDate: '2024-03-16',
        verificationStatus: 'Verified',
        notes: 'Current balance $2,100 - using limit for assessment'
      },
      {
        field: 'Existing Mortgage',
        value: '$385,000 outstanding',
        documentType: 'Bank Statement',
        documentRef: 'DOC-2024-0448',
        documentName: 'Bank_Statement_Jan-Mar_2024.pdf',
        verifiedBy: 'Emma Williams',
        verifiedDate: '2024-03-16',
        verificationStatus: 'Verified',
        notes: 'Investment property mortgage - repayments verified'
      }
    ],
    assets: [
      {
        field: 'Primary Residence',
        value: '$850,000',
        documentType: 'Property Valuation',
        documentRef: 'DOC-2024-0451',
        documentName: 'Property_Valuation_Report.pdf',
        verifiedBy: 'Emma Williams',
        verifiedDate: '2024-03-17',
        verificationStatus: 'Verified',
        notes: 'Independent valuation conducted - current market value'
      },
      {
        field: 'Investment Property',
        value: '$620,000',
        documentType: 'Property Valuation',
        documentRef: 'DOC-2024-0452',
        documentName: 'Investment_Property_Valuation.pdf',
        verifiedBy: 'Emma Williams',
        verifiedDate: '2024-03-17',
        verificationStatus: 'Verified',
        notes: 'Investment property valuation - rental income verified'
      },
      {
        field: 'Savings Account',
        value: '$45,000',
        documentType: 'Bank Statement',
        documentRef: 'DOC-2024-0448',
        documentName: 'Bank_Statement_Jan-Mar_2024.pdf',
        verifiedBy: 'Emma Williams',
        verifiedDate: '2024-03-17',
        verificationStatus: 'Verified',
        notes: 'Savings balance verified - sufficient for deposit'
      },
      {
        field: 'Share Portfolio',
        value: '$95,000',
        documentType: 'Investment Statement',
        documentRef: 'DOC-2024-0447',
        documentName: 'Investment_Portfolio_Statement_Q1.pdf',
        verifiedBy: 'Emma Williams',
        verifiedDate: '2024-03-17',
        verificationStatus: 'Verified',
        notes: 'Share portfolio value verified - considered liquid asset'
      }
    ]
  };

  // Calculate verification completeness
  const allFields = [
    ...evidenceMapping.income,
    ...evidenceMapping.expenses,
    ...evidenceMapping.liabilities,
    ...evidenceMapping.assets
  ];
  
  const verifiedCount = allFields.filter(f => f.verificationStatus === 'Verified').length;
  const completeness = Math.round((verifiedCount / allFields.length) * 100);

  // Missing evidence alerts
  const missingEvidence = allFields.filter(f => f.verificationStatus === 'Missing' || f.verificationStatus === 'Pending');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Declared': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'Pending': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified': return 'bg-green-600';
      case 'Declared': return 'bg-amber-600';
      case 'Pending': return 'bg-red-600';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="h-6 w-px bg-white/30" />
            <Shield className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-bold">Verification Evidence Hub</h1>
              <p className="text-sm text-white/90">NCCP Field-to-Document Evidence Linking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Info & Completeness Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-xs text-gray-600">Client ID</div>
              <div className="font-semibold text-gray-900">{clientId}</div>
            </div>
            <div className="h-8 w-px bg-gray-300" />
            <div>
              <div className="text-xs text-gray-600">Client Name</div>
              <div className="font-semibold text-gray-900">{clientName}</div>
            </div>
            <div className="h-8 w-px bg-gray-300" />
            <div>
              <div className="text-xs text-gray-600">Assessment Date</div>
              <div className="font-semibold text-gray-900">2024-03-17</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{completeness}%</div>
              <div className="text-xs text-gray-600">Verification Complete</div>
            </div>
            <div className="w-32">
              <Progress value={completeness} className="h-3" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{verifiedCount}</div>
            <div className="text-xs text-gray-600">Verified</div>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-2xl font-bold text-amber-600">
              {allFields.filter(f => f.verificationStatus === 'Declared').length}
            </div>
            <div className="text-xs text-gray-600">Declared</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-600">{missingEvidence.length}</div>
            <div className="text-xs text-gray-600">Missing</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{allFields.length}</div>
            <div className="text-xs text-gray-600">Total Fields</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <Tabs defaultValue="income">
          <TabsList className="grid grid-cols-5 w-full mb-6">
            <TabsTrigger value="income">
              <DollarSign className="w-4 h-4 mr-2" />
              Income ({evidenceMapping.income.length})
            </TabsTrigger>
            <TabsTrigger value="expenses">
              <TrendingUp className="w-4 h-4 mr-2" />
              Expenses ({evidenceMapping.expenses.length})
            </TabsTrigger>
            <TabsTrigger value="liabilities">
              <CreditCard className="w-4 h-4 mr-2" />
              Liabilities ({evidenceMapping.liabilities.length})
            </TabsTrigger>
            <TabsTrigger value="assets">
              <Home className="w-4 h-4 mr-2" />
              Assets ({evidenceMapping.assets.length})
            </TabsTrigger>
            <TabsTrigger value="summary">
              <FileText className="w-4 h-4 mr-2" />
              Summary
            </TabsTrigger>
          </TabsList>

          {/* INCOME TAB */}
          <TabsContent value="income">
            <div className="space-y-3">
              {evidenceMapping.income.map((evidence, idx) => (
                <Card key={idx} className="border-2 border-green-200">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-12 gap-4 items-start">
                      {/* Field Info */}
                      <div className="md:col-span-3">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="font-bold text-gray-900">{evidence.field}</div>
                            <div className="text-lg font-semibold text-green-600">{evidence.value}</div>
                          </div>
                        </div>
                      </div>

                      {/* Document Link */}
                      <div className="md:col-span-4">
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <div className="flex items-center gap-2 mb-1">
                            <LinkIcon className="w-4 h-4 text-blue-600" />
                            <span className="text-xs text-gray-600">Linked Document</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-sm text-gray-900">{evidence.documentName}</div>
                              <div className="text-xs text-gray-600">
                                {evidence.documentType} • {evidence.documentRef}
                              </div>
                            </div>
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Verification Status */}
                      <div className="md:col-span-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(evidence.verificationStatus)}
                            <Badge className={getStatusColor(evidence.verificationStatus)}>
                              {evidence.verificationStatus}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {evidence.verifiedBy}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3" />
                              {evidence.verifiedDate}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="md:col-span-2">
                        <Button size="sm" variant="outline" className="w-full mb-2">
                          <Upload className="w-3 h-3 mr-1" />
                          Update Doc
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>

                    {/* Verification Notes */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xs font-semibold text-gray-700 mb-1">Verification Notes:</div>
                      <div className="text-sm text-gray-900">{evidence.notes}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* EXPENSES TAB */}
          <TabsContent value="expenses">
            <div className="space-y-3">
              {evidenceMapping.expenses.map((evidence, idx) => (
                <Card key={idx} className="border-2 border-amber-200">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-12 gap-4 items-start">
                      {/* Field Info */}
                      <div className="md:col-span-3">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-amber-600" />
                          <div>
                            <div className="font-bold text-gray-900">{evidence.field}</div>
                            <div className="text-lg font-semibold text-amber-600">{evidence.value}</div>
                          </div>
                        </div>
                      </div>

                      {/* Document Link */}
                      <div className="md:col-span-4">
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <div className="flex items-center gap-2 mb-1">
                            <LinkIcon className="w-4 h-4 text-blue-600" />
                            <span className="text-xs text-gray-600">Linked Document</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-sm text-gray-900">{evidence.documentName}</div>
                              <div className="text-xs text-gray-600">
                                {evidence.documentType} • {evidence.documentRef}
                              </div>
                            </div>
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Verification Status */}
                      <div className="md:col-span-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(evidence.verificationStatus)}
                            <Badge className={getStatusColor(evidence.verificationStatus)}>
                              {evidence.verificationStatus}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {evidence.verifiedBy}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3" />
                              {evidence.verifiedDate}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="md:col-span-2">
                        <Button size="sm" variant="outline" className="w-full mb-2">
                          <Upload className="w-3 h-3 mr-1" />
                          Update Doc
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>

                    {/* Verification Notes */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xs font-semibold text-gray-700 mb-1">Verification Notes:</div>
                      <div className="text-sm text-gray-900">{evidence.notes}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* LIABILITIES TAB */}
          <TabsContent value="liabilities">
            <div className="space-y-3">
              {evidenceMapping.liabilities.map((evidence, idx) => (
                <Card key={idx} className="border-2 border-red-200">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-12 gap-4 items-start">
                      {/* Field Info */}
                      <div className="md:col-span-3">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="w-5 h-5 text-red-600" />
                          <div>
                            <div className="font-bold text-gray-900">{evidence.field}</div>
                            <div className="text-lg font-semibold text-red-600">{evidence.value}</div>
                          </div>
                        </div>
                      </div>

                      {/* Document Link */}
                      <div className="md:col-span-4">
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <div className="flex items-center gap-2 mb-1">
                            <LinkIcon className="w-4 h-4 text-blue-600" />
                            <span className="text-xs text-gray-600">Linked Document</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-sm text-gray-900">{evidence.documentName}</div>
                              <div className="text-xs text-gray-600">
                                {evidence.documentType} • {evidence.documentRef}
                              </div>
                            </div>
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Verification Status */}
                      <div className="md:col-span-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(evidence.verificationStatus)}
                            <Badge className={getStatusColor(evidence.verificationStatus)}>
                              {evidence.verificationStatus}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {evidence.verifiedBy}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3" />
                              {evidence.verifiedDate}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="md:col-span-2">
                        <Button size="sm" variant="outline" className="w-full mb-2">
                          <Upload className="w-3 h-3 mr-1" />
                          Update Doc
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>

                    {/* Verification Notes */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xs font-semibold text-gray-700 mb-1">Verification Notes:</div>
                      <div className="text-sm text-gray-900">{evidence.notes}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ASSETS TAB */}
          <TabsContent value="assets">
            <div className="space-y-3">
              {evidenceMapping.assets.map((evidence, idx) => (
                <Card key={idx} className="border-2 border-blue-200">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-12 gap-4 items-start">
                      {/* Field Info */}
                      <div className="md:col-span-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Home className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-bold text-gray-900">{evidence.field}</div>
                            <div className="text-lg font-semibold text-blue-600">{evidence.value}</div>
                          </div>
                        </div>
                      </div>

                      {/* Document Link */}
                      <div className="md:col-span-4">
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <div className="flex items-center gap-2 mb-1">
                            <LinkIcon className="w-4 h-4 text-blue-600" />
                            <span className="text-xs text-gray-600">Linked Document</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-sm text-gray-900">{evidence.documentName}</div>
                              <div className="text-xs text-gray-600">
                                {evidence.documentType} • {evidence.documentRef}
                              </div>
                            </div>
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Verification Status */}
                      <div className="md:col-span-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(evidence.verificationStatus)}
                            <Badge className={getStatusColor(evidence.verificationStatus)}>
                              {evidence.verificationStatus}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {evidence.verifiedBy}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3" />
                              {evidence.verifiedDate}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="md:col-span-2">
                        <Button size="sm" variant="outline" className="w-full mb-2">
                          <Upload className="w-3 h-3 mr-1" />
                          Update Doc
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>

                    {/* Verification Notes */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xs font-semibold text-gray-700 mb-1">Verification Notes:</div>
                      <div className="text-sm text-gray-900">{evidence.notes}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* SUMMARY TAB */}
          <TabsContent value="summary">
            <Card className="border-2 border-cyan-200">
              <CardHeader className="bg-gray-50">
                <CardTitle>Verification Completeness Summary</CardTitle>
                <CardDescription>
                  Overall evidence verification status for NCCP compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  {/* Completeness Widget */}
                  <div className="text-center p-6 bg-green-50 rounded-lg border-2 border-green-300">
                    <div className="text-6xl font-bold text-green-600 mb-2">{completeness}%</div>
                    <div className="text-lg text-gray-900 mb-4">Verification Complete</div>
                    <Progress value={completeness} className="h-4 mb-4" />
                    <p className="text-sm text-gray-700">
                      {verifiedCount} of {allFields.length} fields have verified evidence
                    </p>
                  </div>

                  {/* Missing Evidence Alerts */}
                  {missingEvidence.length > 0 && (
                    <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
                      <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        Missing Evidence ({missingEvidence.length})
                      </h3>
                      <div className="space-y-2">
                        {missingEvidence.map((field, idx) => (
                          <div key={idx} className="p-3 bg-white rounded border border-red-200">
                            <div className="font-semibold text-gray-900">{field.field}</div>
                            <div className="text-sm text-gray-600">Required: {field.documentType}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Export Options */}
                  <div className="flex gap-3">
                    <Button className="bg-cyan-600 hover:bg-cyan-700">
                      <Download className="w-4 h-4 mr-2" />
                      Export Verification Report
                    </Button>
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Evidence Summary
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
