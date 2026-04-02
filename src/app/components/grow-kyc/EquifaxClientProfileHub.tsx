import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Shield,
  User,
  Building2,
  DollarSign,
  CreditCard,
  Home,
  Bell,
  FileText,
  Settings,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle,
  Eye,
  Clock,
  TrendingUp,
  Activity,
  Database,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';

interface ClientProfile {
  id: string;
  name: string;
  type: 'individual' | 'business';
  status: 'active' | 'pending' | 'suspended';
  onboardedDate: Date;
  
  // Equifax Modules Status
  modules: {
    identity: ModuleStatus;
    amlScreening: ModuleStatus;
    entityStructure: ModuleStatus;
    affordability: ModuleStatus;
    credit: ModuleStatus;
    property: ModuleStatus;
    monitoring: ModuleStatus;
  };
}

interface ModuleStatus {
  enabled: boolean;
  lastUpdated: Date | null;
  nextUpdateDue: Date | null;
  status: 'complete' | 'pending' | 'expired' | 'error';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  score?: number;
  alerts: number;
}

export function EquifaxClientProfileHub() {
  const [selectedClient, setSelectedClient] = useState<string>('CLI-001');
  const [activeTab, setActiveTab] = useState<'identity' | 'aml' | 'entity' | 'affordability' | 'credit' | 'property' | 'monitoring' | 'evidence'>('identity');

  // Mock Data
  const [clientProfile] = useState<ClientProfile>({
    id: 'CLI-001',
    name: 'Sarah Mitchell',
    type: 'individual',
    status: 'active',
    onboardedDate: new Date('2024-01-15'),
    
    modules: {
      identity: {
        enabled: true,
        lastUpdated: new Date('2024-03-20T10:30:00'),
        nextUpdateDue: new Date('2025-03-20T10:30:00'),
        status: 'complete',
        riskLevel: 'low',
        score: 12,
        alerts: 0
      },
      amlScreening: {
        enabled: true,
        lastUpdated: new Date('2024-03-20T10:30:00'),
        nextUpdateDue: new Date('2024-06-20T10:30:00'),
        status: 'complete',
        riskLevel: 'low',
        score: 0,
        alerts: 0
      },
      entityStructure: {
        enabled: false,
        lastUpdated: null,
        nextUpdateDue: null,
        status: 'pending',
        riskLevel: 'low',
        alerts: 0
      },
      affordability: {
        enabled: true,
        lastUpdated: new Date('2024-03-18T14:20:00'),
        nextUpdateDue: new Date('2024-06-18T14:20:00'),
        status: 'complete',
        riskLevel: 'low',
        score: 2850,
        alerts: 0
      },
      credit: {
        enabled: true,
        lastUpdated: new Date('2024-03-20T09:15:00'),
        nextUpdateDue: new Date('2024-09-20T09:15:00'),
        status: 'complete',
        riskLevel: 'low',
        score: 785,
        alerts: 0
      },
      property: {
        enabled: true,
        lastUpdated: new Date('2024-03-19T11:45:00'),
        nextUpdateDue: new Date('2024-06-19T11:45:00'),
        status: 'complete',
        riskLevel: 'low',
        alerts: 0
      },
      monitoring: {
        enabled: true,
        lastUpdated: new Date('2024-03-22T08:00:00'),
        nextUpdateDue: new Date('2024-03-23T08:00:00'),
        status: 'complete',
        riskLevel: 'low',
        alerts: 0
      }
    }
  });

  const tabs = [
    { id: 'identity', label: 'Identity', icon: Shield, color: 'blue' },
    { id: 'aml', label: 'AML Screening', icon: AlertTriangle, color: 'purple' },
    { id: 'entity', label: 'Entity / Structure', icon: Building2, color: 'indigo' },
    { id: 'affordability', label: 'Affordability', icon: DollarSign, color: 'green' },
    { id: 'credit', label: 'Credit', icon: CreditCard, color: 'orange' },
    { id: 'property', label: 'Property', icon: Home, color: 'pink' },
    { id: 'monitoring', label: 'Monitoring', icon: Bell, color: 'red' },
    { id: 'evidence', label: 'Evidence', icon: FileText, color: 'gray' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'expired': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'error': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'critical': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const renderModuleSummary = (moduleKey: keyof typeof clientProfile.modules, icon: any, title: string, description: string) => {
    const module = clientProfile.modules[moduleKey];
    const Icon = icon;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-[#13B5EA] hover:shadow-xl transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0E7C9E] to-[#13B5EA] flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(module.status)}`}>
            {module.status.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">Risk Level</div>
            <div className={`text-lg font-bold capitalize ${getRiskColor(module.riskLevel)}`}>
              {module.riskLevel}
            </div>
          </div>
          {module.score !== undefined && (
            <div>
              <div className="text-xs text-gray-500 mb-1">Score</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {module.score}
              </div>
            </div>
          )}
          <div>
            <div className="text-xs text-gray-500 mb-1">Alerts</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {module.alerts}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Last Updated</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {module.lastUpdated ? module.lastUpdated.toLocaleDateString() : 'Never'}
            </div>
          </div>
        </div>

        {module.enabled && module.lastUpdated && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Next update: {module.nextUpdateDue?.toLocaleDateString()}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
              <Button size="sm" variant="outline">
                <RefreshCw className="w-3 h-3 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        )}

        {!module.enabled && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button size="sm" className="w-full">
              Enable Module
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0E7C9E] to-[#13B5EA] text-white p-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <User className="w-10 h-10" />
                <div>
                  <h1 className="text-4xl font-bold">{clientProfile.name}</h1>
                  <p className="text-xl text-cyan-100">Equifax Client Profile • Complete Data Integration</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  <span>Client ID: {clientProfile.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Onboarded: {clientProfile.onboardedDate.toLocaleDateString()}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white`}>
                  {clientProfile.status.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="text-right">
              <Button variant="outline" className="bg-white text-[#0E7C9E] hover:bg-cyan-50">
                <Settings className="w-4 h-4 mr-2" />
                Manage Integrations
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">Modules Active</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {Object.values(clientProfile.modules).filter(m => m.enabled).length}
                  <span className="text-lg text-gray-500">/{Object.keys(clientProfile.modules).length}</span>
                </div>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">Total Alerts</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {Object.values(clientProfile.modules).reduce((sum, m) => sum + m.alerts, 0)}
                </div>
              </div>
              <Bell className="w-12 h-12 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">Overall Risk</div>
                <div className="text-3xl font-bold text-green-600">
                  Low
                </div>
              </div>
              <Shield className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">Last Sync</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {new Date().toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500">2 hours ago</div>
              </div>
              <Activity className="w-12 h-12 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {tabs.map(tab => {
              const module = clientProfile.modules[tab.id as keyof typeof clientProfile.modules];
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap relative ${
                    activeTab === tab.id
                      ? 'bg-[#13B5EA] text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                  {module?.alerts > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {module.alerts}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Module Content */}
        <div className="space-y-6">
          {activeTab === 'identity' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Identity Verification & Fraud Detection</h2>
              {renderModuleSummary(
                'identity',
                Shield,
                'Identity Module',
                'Biometric verification, document authenticity, fraud indicators'
              )}
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">Identity Verified</div>
                        <div className="text-xs text-gray-500">Face match 96%, Document authentic</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">2024-03-20 10:30</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">Fraud Score: 12/100</div>
                        <div className="text-xs text-gray-500">Low risk - No indicators detected</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">2024-03-20 10:30</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'aml' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AML/CTF Screening</h2>
              {renderModuleSummary(
                'amlScreening',
                AlertTriangle,
                'AML Screening Module',
                'PEP, Sanctions, Watchlists, Adverse Media'
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-gray-900 dark:text-white">PEP</h3>
                  </div>
                  <div className="text-3xl font-bold text-green-600">Clear</div>
                  <div className="text-xs text-gray-500 mt-1">No matches found</div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-red-500">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-red-600" />
                    <h3 className="font-bold text-gray-900 dark:text-white">Sanctions</h3>
                  </div>
                  <div className="text-3xl font-bold text-green-600">Clear</div>
                  <div className="text-xs text-gray-500 mt-1">No matches found</div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <h3 className="font-bold text-gray-900 dark:text-white">Watchlists</h3>
                  </div>
                  <div className="text-3xl font-bold text-green-600">Clear</div>
                  <div className="text-xs text-gray-500 mt-1">No hits detected</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'affordability' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Affordability Assessment</h2>
              {renderModuleSummary(
                'affordability',
                DollarSign,
                'Affordability Module',
                'Income, expenses, net surplus analysis'
              )}
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Monthly Income</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">$8,500</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Monthly Expenses</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">$5,650</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Net Surplus</div>
                    <div className="text-2xl font-bold text-green-600">$2,850</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'credit' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Credit Assessment</h2>
              {renderModuleSummary(
                'credit',
                CreditCard,
                'Credit Module',
                'Credit score, repayment history, enquiries'
              )}
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Equifax Credit Score</div>
                    <div className="text-5xl font-bold text-gray-900 dark:text-white">785</div>
                    <div className="text-sm text-gray-500">Excellent</div>
                  </div>
                  <div className="w-32 h-32">
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="none" 
                        stroke="#3DD598" 
                        strokeWidth="8"
                        strokeDasharray={`${(785/1000) * 251.2} 251.2`}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400">Repayment History</div>
                    <div className="text-lg font-bold text-green-600">Excellent</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400">Defaults</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">None</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400">Insolvency</div>
                    <div className="text-lg font-bold text-green-600">None</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'property' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Property Information</h2>
              {renderModuleSummary(
                'property',
                Home,
                'Property Module',
                'Valuation, ownership, title verification'
              )}
            </div>
          )}

          {activeTab === 'monitoring' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Continuous Monitoring</h2>
              {renderModuleSummary(
                'monitoring',
                Bell,
                'Monitoring Module',
                'Real-time alerts and change detection'
              )}
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Evidence Vault</h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search evidence..."
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                </div>

                <div className="space-y-3">
                  {['Identity Verification Report', 'AML Screening Report', 'Credit Report', 'Affordability Assessment', 'Property Valuation'].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#13B5EA]" />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{doc}</div>
                          <div className="text-xs text-gray-500">Equifax • {new Date().toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Global Actions</h3>
          <div className="flex gap-3">
            <Button onClick={() => alert('Refreshing all modules...')}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh All Data
            </Button>
            <Button variant="outline" onClick={() => alert('Downloading all reports...')}>
              <Download className="w-4 h-4 mr-2" />
              Download All Reports
            </Button>
            <Button variant="outline" onClick={() => alert('Audit log...')}>
              <FileText className="w-4 h-4 mr-2" />
              View Audit Log
            </Button>
            <Button variant="outline" onClick={() => alert('Settings...')}>
              <Settings className="w-4 h-4 mr-2" />
              Integration Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
