import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  FileText,
  Send,
  CheckCircle,
  Clock,
  DollarSign,
  Plus,
  Eye,
  Edit,
  Download,
  Mail,
  CreditCard,
  Users,
  Building2,
  Calendar,
  AlertCircle,
  Zap,
  TrendingUp,
  FileCheck,
  Banknote
} from 'lucide-react';

interface ServiceLine {
  id: string;
  name: string;
  description: string;
  fee: number;
  frequency: 'one-time' | 'monthly' | 'quarterly' | 'annual';
}

interface Proposal {
  id: string;
  clientName: string;
  clientType: 'individual' | 'company' | 'trust' | 'group';
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined';
  services: ServiceLine[];
  totalFee: number;
  sentDate?: string;
  acceptedDate?: string;
  paymentStatus: 'pending' | 'deposit-paid' | 'paid' | 'overdue';
  engagementSigned: boolean;
}

interface ProposalEngagementModuleProps {
  onBack: () => void;
}

export function ProposalEngagementModule({ onBack }: ProposalEngagementModuleProps) {
  const [selectedTab, setSelectedTab] = useState<'proposals' | 'engagements' | 'payments'>('proposals');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Sample data
  const proposals: Proposal[] = [
    {
      id: 'prop-1',
      clientName: 'Smith Family Group',
      clientType: 'group',
      status: 'accepted',
      services: [
        { id: 's1', name: 'Individual Tax Returns', description: 'John & Jane Smith', fee: 800, frequency: 'annual' },
        { id: 's2', name: 'Trust Tax Return', description: 'Smith Family Trust', fee: 1200, frequency: 'annual' },
        { id: 's3', name: 'Company Tax Return', description: 'Smith Holdings Pty Ltd', fee: 1500, frequency: 'annual' },
        { id: 's4', name: 'BAS Lodgement', description: 'Quarterly BAS', fee: 300, frequency: 'quarterly' }
      ],
      totalFee: 3800,
      sentDate: '2026-03-15',
      acceptedDate: '2026-03-18',
      paymentStatus: 'deposit-paid',
      engagementSigned: true
    },
    {
      id: 'prop-2',
      clientName: 'ABC Manufacturing Pty Ltd',
      clientType: 'company',
      status: 'sent',
      services: [
        { id: 's5', name: 'Annual Financial Statements', description: 'Compilation', fee: 2500, frequency: 'annual' },
        { id: 's6', name: 'Tax Return', description: 'Corporate tax', fee: 2000, frequency: 'annual' },
        { id: 's7', name: 'Tax Planning', description: 'Strategic advice', fee: 1500, frequency: 'one-time' }
      ],
      totalFee: 6000,
      sentDate: '2026-03-19',
      paymentStatus: 'pending',
      engagementSigned: false
    },
    {
      id: 'prop-3',
      clientName: 'Johnson SMSF',
      clientType: 'trust',
      status: 'viewed',
      services: [
        { id: 's8', name: 'SMSF Annual Return', description: 'Tax and compliance', fee: 1800, frequency: 'annual' },
        { id: 's9', name: 'SMSF Audit', description: 'Independent audit', fee: 800, frequency: 'annual' },
        { id: 's10', name: 'Member Statements', description: 'Year-end statements', fee: 200, frequency: 'annual' }
      ],
      totalFee: 2800,
      sentDate: '2026-03-20',
      paymentStatus: 'pending',
      engagementSigned: false
    },
    {
      id: 'prop-4',
      clientName: 'Sarah Chen',
      clientType: 'individual',
      status: 'draft',
      services: [
        { id: 's11', name: 'Individual Tax Return', description: 'Standard ITR', fee: 400, frequency: 'annual' }
      ],
      totalFee: 400,
      paymentStatus: 'pending',
      engagementSigned: false
    }
  ];

  const serviceTemplates: ServiceLine[] = [
    { id: 't1', name: 'Individual Tax Return - Simple', description: 'PAYG income only', fee: 300, frequency: 'annual' },
    { id: 't2', name: 'Individual Tax Return - Complex', description: 'Investment income, rentals', fee: 600, frequency: 'annual' },
    { id: 't3', name: 'Company Tax Return', description: 'Standard company', fee: 1500, frequency: 'annual' },
    { id: 't4', name: 'Trust Tax Return', description: 'Family trust', fee: 1200, frequency: 'annual' },
    { id: 't5', name: 'SMSF Annual Return', description: 'Tax and compliance', fee: 1800, frequency: 'annual' },
    { id: 't6', name: 'BAS Lodgement', description: 'Quarterly BAS', fee: 300, frequency: 'quarterly' },
    { id: 't7', name: 'Bookkeeping', description: 'Monthly bookkeeping', fee: 500, frequency: 'monthly' },
    { id: 't8', name: 'Tax Planning', description: 'Strategic advice', fee: 1500, frequency: 'one-time' },
    { id: 't9', name: 'Ethical Clearance', description: 'Accountant handover', fee: 150, frequency: 'one-time' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-600 text-white';
      case 'sent': return 'bg-blue-600 text-white';
      case 'viewed': return 'bg-purple-600 text-white';
      case 'declined': return 'bg-red-600 text-white';
      case 'draft': return 'bg-gray-600 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-600 text-white';
      case 'deposit-paid': return 'bg-blue-600 text-white';
      case 'pending': return 'bg-amber-600 text-white';
      case 'overdue': return 'bg-red-600 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const stats = {
    totalProposals: proposals.length,
    accepted: proposals.filter(p => p.status === 'accepted').length,
    pending: proposals.filter(p => p.status === 'sent' || p.status === 'viewed').length,
    totalValue: proposals.reduce((sum, p) => sum + p.totalFee, 0),
    paidValue: proposals.filter(p => p.paymentStatus === 'paid' || p.paymentStatus === 'deposit-paid').reduce((sum, p) => sum + p.totalFee, 0)
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white px-8 py-12">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-white hover:bg-white/20 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2">Proposal & Engagement Module</h1>
            <p className="text-white/90 text-xl">Create proposals • Capture payments • Automate engagement</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Total Proposals</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.totalProposals}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Accepted</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.accepted}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Pending</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.pending}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Total Value</div>
            </div>
            <div className="text-4xl font-bold mb-1">${stats.totalValue.toLocaleString()}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Collected</div>
            </div>
            <div className="text-4xl font-bold mb-1">${stats.paidValue.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant={selectedTab === 'proposals' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('proposals')}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Proposals
          </Button>
          <Button
            variant={selectedTab === 'engagements' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('engagements')}
            className="flex items-center gap-2"
          >
            <FileCheck className="w-4 h-4" />
            Engagements
          </Button>
          <Button
            variant={selectedTab === 'payments' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('payments')}
            className="flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Payments
          </Button>

          <div className="flex-1" />

          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Proposal
          </Button>
        </div>

        {selectedTab === 'proposals' && (
          <div className="space-y-6">
            {proposals.map((proposal) => {
              const ClientIcon = proposal.clientType === 'individual' ? Users : Building2;
              
              return (
                <Card key={proposal.id} className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                          <ClientIcon className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-gray-900">{proposal.clientName}</h3>
                            <Badge className={getStatusColor(proposal.status)}>
                              {proposal.status}
                            </Badge>
                            {proposal.engagementSigned && (
                              <Badge className="bg-green-600 text-white">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Signed
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            <span className="capitalize">{proposal.clientType}</span>
                            {proposal.sentDate && (
                              <>
                                <span>•</span>
                                <span>Sent: {proposal.sentDate}</span>
                              </>
                            )}
                            {proposal.acceptedDate && (
                              <>
                                <span>•</span>
                                <span>Accepted: {proposal.acceptedDate}</span>
                              </>
                            )}
                          </div>

                          {/* Services */}
                          <div className="space-y-2 mb-4">
                            {proposal.services.map((service) => (
                              <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900">{service.name}</div>
                                  <div className="text-sm text-gray-600">{service.description}</div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-gray-900">${service.fee.toLocaleString()}</div>
                                  <div className="text-xs text-gray-600 capitalize">{service.frequency}</div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Total */}
                          <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-blue-200 rounded-xl">
                            <span className="font-bold text-gray-900 text-lg">Total Fee</span>
                            <span className="text-3xl font-bold text-blue-600">${proposal.totalFee.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3 ml-6">
                        <Badge className={getPaymentStatusColor(proposal.paymentStatus)}>
                          {proposal.paymentStatus === 'deposit-paid' ? 'Deposit Paid' : proposal.paymentStatus}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          {proposal.status === 'draft' && (
                            <Button size="sm">
                              <Send className="w-4 h-4 mr-2" />
                              Send
                            </Button>
                          )}
                          {proposal.status === 'accepted' && !proposal.engagementSigned && (
                            <Button size="sm">
                              <FileText className="w-4 h-4 mr-2" />
                              Send Engagement
                            </Button>
                          )}
                          {proposal.paymentStatus === 'pending' && proposal.status === 'accepted' && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <CreditCard className="w-4 h-4 mr-2" />
                              Collect Payment
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {selectedTab === 'engagements' && (
          <div className="space-y-6">
            <Card className="border-2 border-green-200 bg-gray-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-green-600" />
                  Engagement Letters
                </CardTitle>
                <CardDescription>Digital engagement letters with e-signature integration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {proposals.filter(p => p.status === 'accepted').map((proposal) => (
                    <div key={proposal.id} className="p-4 bg-white rounded-lg border-2 border-green-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-gray-900">{proposal.clientName}</h4>
                        {proposal.engagementSigned ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-amber-600" />
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        {proposal.engagementSigned ? 'Signed' : 'Awaiting signature'}
                      </div>
                      {!proposal.engagementSigned ? (
                        <Button size="sm" className="w-full">
                          <Send className="w-4 h-4 mr-2" />
                          Send Engagement Letter
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Engagement Letter Template */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Letter Templates</CardTitle>
                <CardDescription>Customize templates for different service types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'Standard Tax Services', count: 12 },
                    { name: 'SMSF Services', count: 8 },
                    { name: 'Advisory Services', count: 5 },
                    { name: 'Bookkeeping Services', count: 3 }
                  ].map((template, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-900">{template.name}</h4>
                        <Badge variant="outline">{template.count} active</Badge>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Template
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'payments' && (
          <div className="space-y-6">
            <Card className="border-2 border-blue-200 bg-gray-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Payment Collection
                </CardTitle>
                <CardDescription>Stripe integration for upfront, deposit, and recurring payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-white rounded-lg border border-blue-200">
                    <div className="text-sm text-gray-600 mb-1">Total Outstanding</div>
                    <div className="text-2xl font-bold text-gray-900">${proposals.filter(p => p.paymentStatus === 'pending').reduce((sum, p) => sum + p.totalFee, 0).toLocaleString()}</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-green-200">
                    <div className="text-sm text-gray-600 mb-1">Collected</div>
                    <div className="text-2xl font-bold text-green-600">${stats.paidValue.toLocaleString()}</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-amber-200">
                    <div className="text-sm text-gray-600 mb-1">Deposits Paid</div>
                    <div className="text-2xl font-bold text-amber-600">${proposals.filter(p => p.paymentStatus === 'deposit-paid').reduce((sum, p) => sum + p.totalFee * 0.3, 0).toLocaleString()}</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-red-200">
                    <div className="text-sm text-gray-600 mb-1">Overdue</div>
                    <div className="text-2xl font-bold text-red-600">$0</div>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="space-y-3">
                  {proposals.filter(p => p.status === 'accepted').map((proposal) => (
                    <div key={proposal.id} className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Banknote className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{proposal.clientName}</div>
                          <div className="text-sm text-gray-600">${proposal.totalFee.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getPaymentStatusColor(proposal.paymentStatus)}>
                          {proposal.paymentStatus === 'deposit-paid' ? 'Deposit Paid (30%)' : proposal.paymentStatus}
                        </Badge>
                        {proposal.paymentStatus === 'pending' && (
                          <>
                            <Button size="sm" variant="outline">
                              <DollarSign className="w-4 h-4 mr-2" />
                              Request Deposit (30%)
                            </Button>
                            <Button size="sm">
                              <CreditCard className="w-4 h-4 mr-2" />
                              Request Full Payment
                            </Button>
                          </>
                        )}
                        {proposal.paymentStatus === 'deposit-paid' && (
                          <Button size="sm">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Request Balance
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Configure payment options for clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: 'Credit Card (Stripe)', status: 'Active', icon: CreditCard, color: 'bg-blue-100 text-blue-600' },
                    { name: 'Direct Debit', status: 'Active', icon: Banknote, color: 'bg-green-100 text-green-600' },
                    { name: 'Bank Transfer', status: 'Active', icon: Building2, color: 'bg-purple-100 text-purple-600' }
                  ].map((method, idx) => {
                    const MethodIcon = method.icon;
                    return (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 ${method.color} rounded-lg flex items-center justify-center`}>
                            <MethodIcon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900">{method.name}</div>
                            <div className="text-xs text-green-600">{method.status}</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="w-full">
                          Configure
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Service Templates Library */}
        <Card className="mt-12 bg-gray-50 border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              Service Templates Library
            </CardTitle>
            <CardDescription>Quick-add common services to proposals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {serviceTemplates.map((template) => (
                <div key={template.id} className="p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-400 cursor-pointer">
                  <div className="font-bold text-gray-900 mb-1">{template.name}</div>
                  <div className="text-sm text-gray-600 mb-2">{template.description}</div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-600">${template.fee}</span>
                    <Badge variant="outline" className="text-xs capitalize">{template.frequency}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
