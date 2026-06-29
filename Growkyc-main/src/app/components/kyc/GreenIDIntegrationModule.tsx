import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  User,
  FileText,
  CreditCard,
  Home,
  Briefcase,
  AlertTriangle,
  Search,
  Download,
  Activity,
  Zap,
  TrendingUp,
  Building,
  Phone
} from 'lucide-react';

interface VerificationRecord {
  id: string;
  clientName: string;
  verificationType: 'individual' | 'company' | 'trust';
  status: 'verified' | 'pending' | 'failed' | 'manual-review';
  greenIDScore: number;
  timestamp: string;
  documentsChecked: string[];
  dataSources: string[];
}

export function GreenIDIntegrationModule() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const [verifications] = useState<VerificationRecord[]>([
    {
      id: 'GID-2024-001',
      clientName: 'Sarah Williams',
      verificationType: 'individual',
      status: 'verified',
      greenIDScore: 98,
      timestamp: '2024-02-19 14:30',
      documentsChecked: ['Drivers License', 'Medicare Card', 'Bank Statement'],
      dataSources: ['DVS (Drivers License)', 'DHS (Medicare)', 'Credit Bureau']
    },
    {
      id: 'GID-2024-002',
      clientName: 'Michael Chen',
      verificationType: 'individual',
      status: 'verified',
      greenIDScore: 95,
      timestamp: '2024-02-19 13:15',
      documentsChecked: ['Passport', 'Utility Bill'],
      dataSources: ['DFAT (Passport)', 'Electoral Roll']
    },
    {
      id: 'GID-2024-003',
      clientName: 'Emma Thompson',
      verificationType: 'individual',
      status: 'manual-review',
      greenIDScore: 72,
      timestamp: '2024-02-19 11:45',
      documentsChecked: ['Drivers License', 'Proof of Age Card'],
      dataSources: ['DVS (Drivers License)']
    },
    {
      id: 'GID-2024-004',
      clientName: 'TechCorp Pty Ltd',
      verificationType: 'company',
      status: 'verified',
      greenIDScore: 100,
      timestamp: '2024-02-18 16:20',
      documentsChecked: ['ASIC Extract', 'Directors Verified'],
      dataSources: ['ASIC Registry', 'DVS (Directors)']
    }
  ]);

  const stats = {
    totalVerifications: 247,
    successRate: 94.3,
    avgVerificationTime: 45,
    pendingReviews: 3,
    costSavings: 18500
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'green';
      case 'pending': return 'blue';
      case 'failed': return 'red';
      case 'manual-review': return 'orange';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'manual-review': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="w-16 h-16" />
            <div>
              <h1 className="text-4xl font-bold mb-2">GreenID Integration</h1>
              <p className="text-xl text-green-100">Real-Time Identity Verification</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white text-green-600 hover:bg-green-50">
              <Zap className="w-5 h-5 mr-2" />
              New Verification
            </Button>
            <Button className="bg-white text-green-600 hover:bg-green-50">
              <Download className="w-5 h-5 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-5 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Total Checks</h3>
              <Activity className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{stats.totalVerifications}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Success Rate</h3>
              <CheckCircle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-green-300">{stats.successRate}%</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Avg Time</h3>
              <Clock className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{stats.avgVerificationTime}s</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Pending</h3>
              <AlertTriangle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-orange-300">{stats.pendingReviews}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Cost Savings</h3>
              <TrendingUp className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-2xl font-bold">${(stats.costSavings / 1000).toFixed(1)}k</p>
          </div>
        </div>
      </div>

      {/* Integration Status */}
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
          <div>
            <h3 className="font-bold text-green-900 mb-2">GreenID Integration Active</h3>
            <p className="text-sm text-green-800 mb-3">
              Connected to GreenID identity verification service. Real-time checks against Australian government databases.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-white border border-green-200 rounded-lg">
                <p className="text-xs text-green-700 font-semibold mb-1">API Status</p>
                <p className="font-bold text-green-900">✓ Connected</p>
              </div>
              <div className="p-3 bg-white border border-green-200 rounded-lg">
                <p className="text-xs text-green-700 font-semibold mb-1">Data Sources</p>
                <p className="font-bold text-green-900">12 Active</p>
              </div>
              <div className="p-3 bg-white border border-green-200 rounded-lg">
                <p className="text-xs text-green-700 font-semibold mb-1">Last Sync</p>
                <p className="font-bold text-green-900">Just now</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Available Data Sources</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: 'DVS - Drivers License', icon: CreditCard, status: 'active' },
            { name: 'DHS - Medicare', icon: Shield, status: 'active' },
            { name: 'DFAT - Passport', icon: Briefcase, status: 'active' },
            { name: 'ATO - Tax File Number', icon: FileText, status: 'active' },
            { name: 'ASIC - Company Registry', icon: Building, status: 'active' },
            { name: 'Electoral Roll', icon: User, status: 'active' },
            { name: 'Credit Bureau', icon: Activity, status: 'active' },
            { name: 'Utility Providers', icon: Home, status: 'active' },
            { name: 'Telco Providers', icon: Phone, status: 'active' }
          ].map((source, index) => {
            const Icon = source.icon;
            return (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon className="w-6 h-6 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm mb-1">{source.name}</h4>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                      {source.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search verification records by client name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Recent Verifications */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Verifications</h3>
        <div className="space-y-3">
          {verifications.map((verification) => {
            const statusColor = getStatusColor(verification.status);
            return (
              <div key={verification.id} className="p-4 border-2 border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-gray-800 text-white text-xs font-mono font-bold rounded">
                        {verification.id}
                      </span>
                      <span className="text-sm text-gray-600">{verification.timestamp}</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{verification.clientName}</h4>
                    <p className="text-sm text-gray-600 capitalize">
                      {verification.verificationType.replace('-', ' ')} Verification
                    </p>
                  </div>

                  <div className="ml-6 flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(verification.status)}
                      <span className={`px-3 py-1 bg-${statusColor}-100 text-${statusColor}-700 text-xs font-bold rounded-full uppercase`}>
                        {verification.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">GreenID Score</p>
                      <p className={`text-2xl font-bold ${
                        verification.greenIDScore >= 90 ? 'text-green-600' :
                        verification.greenIDScore >= 70 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {verification.greenIDScore}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-2">Documents Checked</p>
                    <div className="flex flex-wrap gap-1">
                      {verification.documentsChecked.map((doc, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-2">Data Sources</p>
                    <div className="flex flex-wrap gap-1">
                      {verification.dataSources.map((source, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    View Report
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  {verification.status === 'manual-review' && (
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      Review Now
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">GreenID Benefits</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: 'Instant Verification', desc: 'Real-time checks in under 60 seconds' },
            { title: 'Government Data Sources', desc: 'Direct access to 12+ official databases' },
            { title: 'AUSTRAC Compliant', desc: 'Meets ACIP requirements for customer identification' },
            { title: 'Cost Effective', desc: 'Reduce manual verification costs by 75%' },
            { title: 'Audit Trail', desc: 'Complete documentation for compliance records' },
            { title: 'High Success Rate', desc: '94%+ verification success rate' }
          ].map((benefit, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-1">{benefit.title}</h4>
              <p className="text-sm text-gray-600">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}