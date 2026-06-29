import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  User,
  Shield,
  AlertTriangle,
  Building2,
  DollarSign,
  CreditCard,
  Home,
  Bell,
  CheckSquare,
  FileText,
  Activity,
  MessageSquare,
  AlertCircle,
  Eye,
  Download,
  Edit,
  RefreshCw,
  Clock,
  TrendingUp,
  Database,
  Settings,
  Play,
  Users,
  CheckCircle
} from 'lucide-react';
import { ManualChecksPanel } from './ManualChecksPanel';
import { ClientFraudPanel } from './ClientFraudPanel';

interface ClientMasterProfileProps {
  clientId: string;
  onBack: () => void;
}

type ProfileTab = 
  | 'overview'
  | 'identity'
  | 'aml-risk'
  | 'entity'
  | 'affordability'
  | 'credit'
  | 'property'
  | 'monitoring'
  | 'related-parties'
  | 'fraud-detection'
  | 'run-checks'
  | 'tasks'
  | 'notes'
  | 'evidence'
  | 'audit-log'
  | 'complaints'
  | 'breaches';

export function ClientMasterProfile({ clientId, onBack }: ClientMasterProfileProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [isLoading, setIsLoading] = useState(false);

  // Mock client data - extend existing data structure
  const client = {
    id: clientId,
    name: 'Sarah Mitchell',
    type: 'individual',
    email: 'sarah.mitchell@example.com',
    phone: '+61 400 123 456',
    dateOfBirth: '1985-06-15',
    address: '123 Collins Street, Melbourne VIC 3000',
    status: 'active',
    riskTier: 'low',
    riskScore: 12,
    onboardedDate: '2024-01-15',
    lastReviewDate: '2024-03-20',
    nextReviewDue: '2024-06-20',
    kycStatus: 'verified',
    amlStatus: 'clear',
    
    // Module status tracking
    modules: {
      identity: { complete: true, lastUpdated: new Date('2024-03-20'), alerts: 0 },
      amlScreening: { complete: true, lastUpdated: new Date('2024-03-20'), alerts: 0 },
      affordability: { complete: true, lastUpdated: new Date('2024-03-18'), alerts: 0 },
      credit: { complete: true, lastUpdated: new Date('2024-03-20'), alerts: 0 },
      property: { complete: true, lastUpdated: new Date('2024-03-19'), alerts: 0 },
      monitoring: { complete: true, lastUpdated: new Date('2024-03-22'), alerts: 0 }
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'identity', label: 'Identity', icon: Shield },
    { id: 'aml-risk', label: 'AML / Risk', icon: AlertTriangle },
    { id: 'entity', label: 'Entity / Structure', icon: Building2 },
    { id: 'affordability', label: 'Affordability', icon: DollarSign },
    { id: 'credit', label: 'Credit', icon: CreditCard },
    { id: 'fraud-detection', label: 'Fraud Detection', icon: Shield },
    { id: 'property', label: 'Property', icon: Home },
    { id: 'monitoring', label: 'Monitoring', icon: Bell },
    { id: 'related-parties', label: 'Related Parties', icon: Users },
    { id: 'run-checks', label: 'Run Checks', icon: RefreshCw },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'evidence', label: 'Evidence', icon: Database },
    { id: 'audit-log', label: 'Audit Log', icon: Activity },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare },
    { id: 'breaches', label: 'Breaches', icon: AlertCircle }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'suspended': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-[#0f172a] text-slate-300 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getRiskColor = (tier: string) => {
    switch (tier) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'critical': return 'text-red-600 dark:text-red-400';
      default: return 'text-slate-300 dark:text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0E7C9E] to-[#13B5EA] text-white p-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/20 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Registry
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
                  {client.type === 'individual' ? '👤' : '🏢'}
                </div>
                <div>
                  <h1 className="text-4xl font-bold">{client.name}</h1>
                  <p className="text-xl text-cyan-100 capitalize">{client.type} Client • ID: {client.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(client.status)}`}>
                  {client.status.toUpperCase()}
                </span>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>KYC: {client.kycStatus}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>AML: {client.amlStatus}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className={getRiskColor(client.riskTier)}>Risk: {client.riskTier}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex gap-2">
                <Button variant="outline" className="bg-[#1e293b] text-[#0E7C9E] hover:bg-cyan-50">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh All
                </Button>
                <Button variant="outline" className="bg-[#1e293b] text-[#0E7C9E] hover:bg-cyan-50">
                  <Download className="w-4 h-4 mr-2" />
                  Export Profile
                </Button>
                <Button variant="outline" className="bg-[#1e293b] text-[#0E7C9E] hover:bg-cyan-50">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tab Navigation */}
        <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg shadow-lg mb-6 overflow-hidden">
          <div className="flex overflow-x-auto border-b border-white/10 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ProfileTab)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#13B5EA] text-white border-b-2 border-[#0E7C9E]'
                    : 'text-slate-300 dark:text-slate-400 hover:bg-white/5 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-slate-400">KYC Status</div>
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-white dark:text-white capitalize">{client.kycStatus}</div>
                  <div className="text-xs text-slate-400 mt-1">Last verified {client.lastReviewDate}</div>
                </div>

                <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-slate-400">Risk Score</div>
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className={`text-2xl font-bold capitalize ${getRiskColor(client.riskTier)}`}>
                    {client.riskScore}/100
                  </div>
                  <div className="text-xs text-slate-400 mt-1 capitalize">{client.riskTier} Risk</div>
                </div>

                <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-slate-400">Active Alerts</div>
                    <Bell className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-white dark:text-white">
                    {Object.values(client.modules).reduce((sum, m) => sum + m.alerts, 0)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">All clear</div>
                </div>

                <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-slate-400">Next Review</div>
                    <Clock className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="text-lg font-bold text-white dark:text-white">
                    {new Date(client.nextReviewDue).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {Math.ceil((new Date(client.nextReviewDue).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-white dark:text-white mb-4">Client Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Full Name</div>
                    <div className="text-base font-semibold text-white dark:text-white">{client.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Date of Birth</div>
                    <div className="text-base font-semibold text-white dark:text-white">{client.dateOfBirth}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Email</div>
                    <div className="text-base font-semibold text-white dark:text-white">{client.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Phone</div>
                    <div className="text-base font-semibold text-white dark:text-white">{client.phone}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm text-slate-400 mb-1">Address</div>
                    <div className="text-base font-semibold text-white dark:text-white">{client.address}</div>
                  </div>
                </div>
              </div>

              {/* Module Status */}
              <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-white dark:text-white mb-4">Module Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(client.modules).map(([key, module]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-[#0f172a] dark:bg-gray-900 rounded-lg">
                      <div>
                        <div className="font-semibold text-white dark:text-white capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-xs text-slate-400">
                          Last updated: {module.lastUpdated.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {module.complete ? (
                          <span className="text-green-600">
                            <CheckSquare className="w-5 h-5" />
                          </span>
                        ) : (
                          <span className="text-yellow-600">
                            <Clock className="w-5 h-5" />
                          </span>
                        )}
                        {module.alerts > 0 && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                            {module.alerts} alerts
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-white dark:text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { date: '2024-03-22 08:00', action: 'Monitoring alert check', user: 'System', status: 'success' },
                    { date: '2024-03-20 10:30', action: 'Identity verification refreshed', user: 'compliance@growkyc.com', status: 'success' },
                    { date: '2024-03-20 10:30', action: 'AML screening completed', user: 'compliance@growkyc.com', status: 'success' },
                    { date: '2024-03-20 09:15', action: 'Credit report pulled', user: 'System', status: 'success' }
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-[#0f172a] dark:bg-gray-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-[#13B5EA]" />
                        <div>
                          <div className="text-sm font-semibold text-white dark:text-white">{activity.action}</div>
                          <div className="text-xs text-slate-400">By: {activity.user}</div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-400">{activity.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Identity Tab - Link to existing Equifax module */}
          {activeTab === 'identity' && (
            <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-white dark:text-white mb-4">Identity Verification Module</h3>
              <p className="text-slate-300 dark:text-slate-400 mb-4">
                Complete identity verification powered by Equifax, including fraud detection, biometrics, and document authenticity checks.
              </p>
              <Button onClick={() => alert('Navigate to EquifaxIdentityFraudModule')}>
                <Eye className="w-4 h-4 mr-2" />
                Open Identity Module
              </Button>
            </div>
          )}

          {/* AML / Risk Tab - Link to existing modules */}
          {activeTab === 'aml-risk' && (
            <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-white dark:text-white mb-4">AML Screening & Risk Assessment</h3>
              <p className="text-slate-300 dark:text-slate-400 mb-4">
                Comprehensive AML/CTF screening including PEP, sanctions, watchlists, and risk scoring.
              </p>
              <div className="flex gap-3">
                <Button onClick={() => alert('Navigate to EquifaxAMLScreeningModule')}>
                  <Eye className="w-4 h-4 mr-2" />
                  AML Screening
                </Button>
                <Button variant="outline" onClick={() => alert('Navigate to CustomerRiskScoringEngine')}>
                  <Eye className="w-4 h-4 mr-2" />
                  Risk Engine
                </Button>
              </div>
            </div>
          )}

          {/* Related Parties Tab */}
          {activeTab === 'related-parties' && (
            <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-white dark:text-white mb-4">Related Parties & Associations</h3>
              <p className="text-slate-300 dark:text-slate-400 mb-6">
                View and manage related individuals, entities, and business associations for this client.
              </p>
              
              <div className="space-y-4">
                {[
                  { name: 'Mitchell Family Trust', type: 'Trust', relationship: 'Trustee', status: 'Active', verified: true },
                  { name: 'John Mitchell', type: 'Individual', relationship: 'Spouse', status: 'Active', verified: true },
                  { name: 'Mitchell Consulting Pty Ltd', type: 'Company', relationship: 'Director', status: 'Active', verified: true }
                ].map((party, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-[#0f172a] dark:bg-gray-900 rounded-lg border border-white/10 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#13B5EA] text-white flex items-center justify-center font-semibold">
                        {party.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-white dark:text-white">{party.name}</div>
                        <div className="text-sm text-slate-300 dark:text-slate-400">
                          {party.type} • {party.relationship}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-xs font-semibold">
                        {party.status}
                      </span>
                      {party.verified && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Button>
                  <Users className="w-4 h-4 mr-2" />
                  Add Related Party
                </Button>
              </div>
            </div>
          )}

          {/* Fraud Detection Tab */}
          {activeTab === 'fraud-detection' && (
            <ClientFraudPanel clientId={client.id} clientName={client.name} />
          )}

          {/* Run Checks Tab */}
          {activeTab === 'run-checks' && (
            <ManualChecksPanel clientId={client.id} clientName={client.name} />
          )}

          {/* Placeholder for other tabs */}
          {!['overview', 'identity', 'aml-risk', 'related-parties', 'fraud-detection', 'run-checks'].includes(activeTab) && (
            <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-white dark:text-white mb-4 capitalize">
                {activeTab.replace('-', ' / ')} Module
              </h3>
              <p className="text-slate-300 dark:text-slate-400">
                This module integrates existing functionality for {activeTab.replace('-', ' / ')}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}