import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Building,
  Globe,
  Users,
  DollarSign,
  Shield,
  Layers,
  Settings,
  Eye,
  Plus,
  CheckCircle,
  TrendingUp,
  Lock,
  Palette,
  Database,
  Activity
} from 'lucide-react';

interface Firm {
  id: string;
  name: string;
  domain: string;
  logo: string;
  color: string;
  modules: string[];
  clients: number;
  revenue: number;
  users: number;
  status: 'active' | 'inactive';
}

export function MultiFirmManagement({ onBack }: { onBack: () => void }) {
  const [firms] = useState<Firm[]>([
    {
      id: 'firm-001',
      name: 'Melbourne Accounting Group',
      domain: 'accounting.grow.com',
      logo: '🏦',
      color: 'blue',
      modules: ['Accounting', 'ATO Integration', 'Xero'],
      clients: 247,
      revenue: 589000,
      users: 12,
      status: 'active'
    },
    {
      id: 'firm-002',
      name: 'Sydney Legal Partners',
      domain: 'legal.grow.com',
      logo: '⚖️',
      color: 'purple',
      modules: ['Legal', 'Matter Management', 'Trust'],
      clients: 156,
      revenue: 1240000,
      users: 8,
      status: 'active'
    },
    {
      id: 'firm-003',
      name: 'Capital Lending Co',
      domain: 'lending.grow.com',
      logo: '💰',
      color: 'green',
      modules: ['Lending', 'Credit Bureau', 'Serviceability'],
      clients: 89,
      revenue: 780000,
      users: 15,
      status: 'active'
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Multi-Firm Management</h1>
          <p className="text-gray-600 mt-1">Manage multiple firms with isolated databases and white-label branding</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack}>
            ← Back to HQ
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-5 h-5 mr-2" />
            Add New Firm
          </Button>
        </div>
      </div>

      {/* Enterprise Features Overview */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
          <Building className="w-12 h-12 mb-4" />
          <h3 className="text-xl font-bold mb-2">Multi-Firm Support</h3>
          <ul className="text-sm text-blue-100 space-y-1">
            <li>• Isolated databases per firm</li>
            <li>• Role segregation</li>
            <li>• Revenue reporting per firm</li>
            <li>• Franchise & aggregator models</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
          <Globe className="w-12 h-12 mb-4" />
          <h3 className="text-xl font-bold mb-2">White Label</h3>
          <ul className="text-sm text-purple-100 space-y-1">
            <li>• Custom branding</li>
            <li>• Custom domain</li>
            <li>• Firm-specific templates</li>
            <li>• Independent configuration</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 text-white">
          <Layers className="w-12 h-12 mb-4" />
          <h3 className="text-xl font-bold mb-2">Modular Add-Ons</h3>
          <ul className="text-sm text-green-100 space-y-1">
            <li>• Accounting</li>
            <li>• Legal</li>
            <li>• Lending</li>
            <li>• Broker</li>
            <li>• Fund Management</li>
          </ul>
        </div>
      </div>

      {/* Firms Grid */}
      <div className="grid grid-cols-3 gap-6">
        {firms.map((firm) => (
          <div key={firm.id} className={`bg-white rounded-lg border-2 border-${firm.color}-200 hover:shadow-lg transition-all`}>
            <div className={`bg-gradient-to-r from-${firm.color}-600 to-${firm.color}-500 p-6 text-white rounded-t-lg`}>
              <div className="text-4xl mb-3">{firm.logo}</div>
              <h3 className="text-xl font-bold mb-1">{firm.name}</h3>
              <p className={`text-${firm.color}-100 text-sm font-mono`}>{firm.domain}</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{firm.clients}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(firm.revenue / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Active Modules ({firm.modules.length})</p>
                <div className="flex flex-wrap gap-2">
                  {firm.modules.map((module) => (
                    <span key={module} className={`px-2 py-1 bg-${firm.color}-100 text-${firm.color}-700 text-xs font-semibold rounded`}>
                      {module}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">{firm.users} users</span>
                  <span className={`px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full`}>
                    {firm.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    Portal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Features Detail */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Database Isolation</h3>
          <div className="space-y-3">
            {[
              { label: 'Separate Databases', value: 'Complete data isolation', icon: Database },
              { label: 'Security', value: 'Firm-level encryption', icon: Lock },
              { label: 'Performance', value: 'Dedicated resources', icon: Activity },
              { label: 'Compliance', value: 'Independent audit trails', icon: Shield }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                      <p className="text-xs text-gray-600">{item.value}</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">White Label Capabilities</h3>
          <div className="space-y-3">
            {[
              { label: 'Custom Branding', value: 'Logo, colors, fonts', icon: Palette },
              { label: 'Domain Mapping', value: 'firm.grow.com', icon: Globe },
              { label: 'Email Templates', value: 'Branded communications', icon: Shield },
              { label: 'Client Portal', value: 'Firm-specific UI', icon: Eye }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                      <p className="text-xs text-gray-600">{item.value}</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Revenue Analytics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Revenue Performance</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Revenue', value: '$2.61M', change: '+24%', color: 'green' },
            { label: 'Avg per Firm', value: '$870K', change: '+18%', color: 'blue' },
            { label: 'Total Clients', value: '492', change: '+12%', color: 'purple' },
            { label: 'Avg per Client', value: '$5,305', change: '+8%', color: 'orange' }
          ].map((metric) => (
            <div key={metric.label} className={`p-4 bg-${metric.color}-50 border-2 border-${metric.color}-200 rounded-lg`}>
              <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
              <div className="flex items-center gap-1">
                <TrendingUp className={`w-4 h-4 text-${metric.color}-600`} />
                <span className={`text-sm font-semibold text-${metric.color}-600`}>{metric.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
