import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Home,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Shield,
  MessageSquare,
  Calendar,
  Download,
  Eye,
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  User,
  Activity,
  TrendingUp,
  Bell
} from 'lucide-react';
import { mockCases } from '../../data/mockData';
import { StatusBadge } from '../StatusBadge';
import { format, addDays } from 'date-fns';
import { EnterpriseAlert, LoadingState } from '../common/EnterpriseComponents';
import { toast } from 'sonner';

interface EnterpriseBorrowerDashboardProps {
  onNavigate?: (page: string) => void;
}

export function EnterpriseBorrowerDashboard({ onNavigate }: EnterpriseBorrowerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'timeline'>('overview');

  // Mock borrower case data
  const myCase = mockCases[0];
  const caseStatus = {
    stage: 'auction',
    progress: 65,
    nextMilestone: 'Auction End',
    nextMilestoneDate: addDays(new Date(), 5)
  };

  // Timeline events
  const timeline = [
    {
      id: 1,
      date: new Date(2024, 0, 15),
      title: 'Default Notice Issued',
      description: 'Formal default notice issued under Section 57(2)(b) of National Credit Code',
      status: 'completed',
      icon: FileText
    },
    {
      id: 2,
      date: new Date(2024, 1, 20),
      title: 'Property Valuation Completed',
      description: 'Independent valuation conducted by certified valuer',
      status: 'completed',
      icon: Home
    },
    {
      id: 3,
      date: new Date(2024, 2, 1),
      title: 'Listed for Auction',
      description: 'Property listed on Grow MIP MIP platform for investor bidding',
      status: 'completed',
      icon: CheckCircle
    },
    {
      id: 4,
      date: new Date(2024, 2, 15),
      title: 'Auction Active',
      description: 'Current highest bid: A$2,450,000 (5 active bidders)',
      status: 'active',
      icon: Activity
    },
    {
      id: 5,
      date: addDays(new Date(), 5),
      title: 'Auction End',
      description: 'Final bids and selection of winning investor',
      status: 'pending',
      icon: Clock
    },
    {
      id: 6,
      date: addDays(new Date(), 12),
      title: 'Settlement',
      description: 'Property settlement and debt reconciliation',
      status: 'pending',
      icon: DollarSign
    }
  ];

  // Required documents
  const documents = [
    { id: 1, name: 'Loan Agreement', status: 'uploaded', uploadedDate: new Date(2023, 11, 15) },
    { id: 2, name: 'Property Title', status: 'uploaded', uploadedDate: new Date(2024, 0, 5) },
    { id: 3, name: 'Valuation Report', status: 'uploaded', uploadedDate: new Date(2024, 1, 20) },
    { id: 4, name: 'Default Notice', status: 'uploaded', uploadedDate: new Date(2024, 0, 15) },
    { id: 5, name: 'Credit Report', status: 'uploaded', uploadedDate: new Date(2023, 11, 10) },
    { id: 6, name: 'Settlement Statement', status: 'pending', uploadedDate: null }
  ];

  // Financial summary
  const financialSummary = {
    originalLoan: 2800000,
    outstandingBalance: 2945000,
    arrears: 145000,
    propertyValue: 3200000,
    currentBid: 2450000,
    expectedDeficit: 495000,
    legalCosts: 25000,
    sellingCosts: 48000
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Borrower Header */}
      <Card className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white border-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-white/5" />
        <CardContent className="p-8 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">My Case Dashboard</h1>
                  <p className="text-gray-300 text-sm mt-1">
                    Case Number: {myCase.caseNumber}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-xs">Property</span>
                    <Home className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-lg font-bold">{myCase.property.address}</p>
                  <p className="text-xs text-gray-400 mt-1">{myCase.property.suburb}, {myCase.property.state}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-xs">Case Status</span>
                    <Activity className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-lg font-bold capitalize">{caseStatus.stage}</p>
                  <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-green-400 h-1.5 rounded-full"
                      style={{ width: `${caseStatus.progress}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-xs">Next Milestone</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-lg font-bold">{caseStatus.nextMilestone}</p>
                  <p className="text-xs text-amber-400 mt-1">
                    {format(caseStatus.nextMilestoneDate, 'dd MMM yyyy')}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-xs">Current Bid</span>
                    <DollarSign className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-lg font-bold">A${(financialSummary.currentBid / 1000000).toFixed(2)}M</p>
                  <p className="text-xs text-green-400 mt-1">5 active bidders</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                size="lg"
                className="bg-white text-slate-900 hover:bg-gray-100 gap-2"
                onClick={() => onNavigate?.('auction_room')}
              >
                <Eye className="w-5 h-5" />
                View My Auction
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 gap-2"
                onClick={() => toast.info('Opening support...')}
              >
                <MessageSquare className="w-5 h-5" />
                Get Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Alerts */}
      <div className="grid grid-cols-2 gap-4">
        <EnterpriseAlert
          type="info"
          title="Auction Ending Soon"
          message="Your property auction ends in 5 days. Current bid is A$2.45M with 5 active bidders."
          actions={
            <Button size="sm" variant="outline" onClick={() => onNavigate?.('auction_room')}>
              View Live Auction
            </Button>
          }
        />
        <EnterpriseAlert
          type="warning"
          title="Outstanding Document Required"
          message="Settlement Statement is required for final settlement processing."
          actions={
            <Button size="sm" variant="outline" onClick={() => setActiveTab('documents')}>
              Upload Document
            </Button>
          }
        />
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Home className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-1">Property Value</p>
            <p className="text-2xl font-bold text-gray-900">A${(financialSummary.propertyValue / 1000000).toFixed(2)}M</p>
            <p className="text-xs text-gray-600 mt-1">Independent valuation</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-1">Outstanding Balance</p>
            <p className="text-2xl font-bold text-gray-900">A${(financialSummary.outstandingBalance / 1000000).toFixed(2)}M</p>
            <p className="text-xs text-red-600 mt-1">Inc. A${(financialSummary.arrears / 1000).toFixed(0)}K arrears</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-1">Current Highest Bid</p>
            <p className="text-2xl font-bold text-gray-900">A${(financialSummary.currentBid / 1000000).toFixed(2)}M</p>
            <p className="text-xs text-green-600 mt-1">5 active bidders</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-1">Expected Shortfall</p>
            <p className="text-2xl font-bold text-gray-900">A${(financialSummary.expectedDeficit / 1000).toFixed(0)}K</p>
            <p className="text-xs text-amber-600 mt-1">Based on current bid</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
                activeTab === 'overview'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
                activeTab === 'timeline'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
                activeTab === 'documents'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Documents
              <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                1 pending
              </span>
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Financial Breakdown */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">Original Loan Amount</span>
                    <span className="font-semibold text-gray-900">A${financialSummary.originalLoan.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">Outstanding Principal</span>
                    <span className="font-semibold text-gray-900">A${(financialSummary.outstandingBalance - financialSummary.arrears).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">Arrears & Interest</span>
                    <span className="font-semibold text-red-600">A${financialSummary.arrears.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">Legal Costs</span>
                    <span className="font-semibold text-gray-900">A${financialSummary.legalCosts.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">Selling Costs (est.)</span>
                    <span className="font-semibold text-gray-900">A${financialSummary.sellingCosts.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-t-2 border-gray-300 mt-2">
                    <span className="font-semibold text-gray-900">Total Amount Owed</span>
                    <span className="font-bold text-lg text-gray-900">
                      A${(financialSummary.outstandingBalance + financialSummary.legalCosts + financialSummary.sellingCosts).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 bg-green-50 rounded-lg px-4">
                    <span className="font-semibold text-gray-900">Current Highest Bid</span>
                    <span className="font-bold text-lg text-green-600">A${financialSummary.currentBid.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 bg-amber-50 rounded-lg px-4">
                    <span className="font-semibold text-gray-900">Expected Shortfall</span>
                    <span className="font-bold text-lg text-amber-600">
                      A${financialSummary.expectedDeficit.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Support Information */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Your Rights & Support
                </h3>
                <div className="space-y-3 text-sm">
                  <p className="text-gray-700">
                    <strong>Financial Hardship:</strong> If you're experiencing financial hardship, you may be eligible for assistance programs or payment arrangements.
                  </p>
                  <p className="text-gray-700">
                    <strong>Legal Advice:</strong> We recommend seeking independent legal advice about your rights and obligations.
                  </p>
                  <p className="text-gray-700">
                    <strong>Free Resources:</strong> National Debt Helpline: 1800 007 007 (free financial counseling)
                  </p>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button variant="outline" size="sm" onClick={() => toast.info('Opening support resources...')}>
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Support Resources
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toast.info('Connecting to support...')}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {timeline.map((event, idx) => {
                const Icon = event.icon;
                const isLast = idx === timeline.length - 1;
                return (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`p-3 rounded-full ${
                        event.status === 'completed' ? 'bg-green-100' :
                        event.status === 'active' ? 'bg-blue-100' :
                        'bg-gray-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          event.status === 'completed' ? 'text-green-600' :
                          event.status === 'active' ? 'text-blue-600' :
                          'text-gray-400'
                        }`} />
                      </div>
                      {!isLast && (
                        <div className={`w-0.5 h-full ${
                          event.status === 'completed' ? 'bg-green-300' : 'bg-gray-300'
                        }`} style={{ minHeight: '40px' }} />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        </div>
                        <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                          {format(event.date, 'dd MMM yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc) => (
                  <Card key={doc.id} className={`border-2 ${
                    doc.status === 'uploaded' ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            doc.status === 'uploaded' ? 'bg-green-100' : 'bg-amber-100'
                          }`}>
                            <FileText className={`w-5 h-5 ${
                              doc.status === 'uploaded' ? 'text-green-600' : 'text-amber-600'
                            }`} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {doc.status === 'uploaded' 
                                ? `Uploaded ${format(doc.uploadedDate!, 'dd MMM yyyy')}`
                                : 'Required for settlement'
                              }
                            </p>
                          </div>
                        </div>
                        {doc.status === 'uploaded' ? (
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button size="sm">
                            Upload
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
