// Practice Planning - Service Plans, Pricing Tools, and Client Onboarding Flows
import React, { useState } from 'react';
import {
  DollarSign,
  Package,
  Calculator,
  Users,
  Plus,
  Edit,
  Trash2,
  Copy,
  CheckCircle,
  ArrowRight,
  FileText,
  TrendingUp,
  Layers,
  Settings,
  Star,
  Clock,
  Calendar,
  Target,
  BarChart3,
  Shield,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface ServiceItem {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  unit: 'monthly' | 'annual' | 'one-time' | 'hourly';
  description: string;
}

interface ServicePlan {
  id: string;
  name: string;
  type: 'starter' | 'professional' | 'premium' | 'custom';
  monthlyPrice: number;
  annualPrice: number;
  services: string[];
  features: string[];
  clientType: string;
  active: boolean;
  clientsCount: number;
}

interface PricingRule {
  id: string;
  name: string;
  type: 'volume-discount' | 'bundle-discount' | 'loyalty-discount' | 'early-payment';
  value: number;
  valueType: 'percentage' | 'fixed';
  conditions: string;
}

interface AUSTRACCheck {
  id: string;
  name: string;
  category: 'ID Verification' | 'Screening' | 'Monitoring' | 'Reporting' | 'Other';
  cost: number;
  unit: 'per check' | 'monthly' | 'annual';
  provider: string;
  description: string;
  active: boolean;
}

export function PracticePlanning() {
  const [activeTab, setActiveTab] = useState<'plans' | 'pricing' | 'calculator' | 'onboarding' | 'settings'>('plans');
  const [plansActivated, setPlansActivated] = useState(false);
  const [pricingActivated, setPricingActivated] = useState(false);

  // Sample Service Plans
  const [servicePlans, setServicePlans] = useState<ServicePlan[]>([
    {
      id: 'plan-001',
      name: 'Individual Starter',
      type: 'starter',
      monthlyPrice: 150,
      annualPrice: 1620,
      services: ['Individual Tax Return', 'Basic Tax Planning', 'Email Support'],
      features: ['1 Tax Return', 'Basic advice', 'Priority lodgment', '10% discount on annual'],
      clientType: 'Individual',
      active: true,
      clientsCount: 45
    },
    {
      id: 'plan-002',
      name: 'Business Professional',
      type: 'professional',
      monthlyPrice: 450,
      annualPrice: 4860,
      services: ['Company Tax Return', 'BAS Lodgment', 'Bookkeeping Review', 'Tax Planning', 'Advisory'],
      features: ['Company compliance', 'Quarterly BAS', 'Monthly bookkeeping', 'Annual tax planning', 'Phone support'],
      clientType: 'Company',
      active: true,
      clientsCount: 28
    },
    {
      id: 'plan-003',
      name: 'Enterprise Premium',
      type: 'premium',
      monthlyPrice: 1200,
      annualPrice: 12960,
      services: ['Full Compliance', 'CFO Advisory', 'Strategic Planning', 'Management Reporting', 'Audit Support'],
      features: ['Dedicated advisor', 'Monthly meetings', 'Management reports', 'Strategic planning', '24/7 support'],
      clientType: 'Company',
      active: true,
      clientsCount: 12
    },
    {
      id: 'plan-004',
      name: 'Trust & SMSF Package',
      type: 'professional',
      monthlyPrice: 350,
      annualPrice: 3780,
      services: ['Trust Tax Return', 'SMSF Compliance', 'Financial Statements', 'ATO Lodgments'],
      features: ['Trust compliance', 'SMSF annual return', 'Financial statements', 'Audit coordination'],
      clientType: 'Trust/SMSF',
      active: true,
      clientsCount: 32
    }
  ]);

  // Sample Services Library
  const [services] = useState<ServiceItem[]>([
    { id: 's1', name: 'Individual Tax Return', category: 'Tax', basePrice: 200, unit: 'annual', description: 'Personal tax return lodgment' },
    { id: 's2', name: 'Company Tax Return', category: 'Tax', basePrice: 1200, unit: 'annual', description: 'Company tax compliance' },
    { id: 's3', name: 'BAS Lodgment', category: 'Compliance', basePrice: 150, unit: 'monthly', description: 'Quarterly BAS preparation' },
    { id: 's4', name: 'Bookkeeping', category: 'Bookkeeping', basePrice: 300, unit: 'monthly', description: 'Monthly bookkeeping services' },
    { id: 's5', name: 'Payroll', category: 'Payroll', basePrice: 200, unit: 'monthly', description: 'Payroll processing' },
    { id: 's6', name: 'Tax Planning', category: 'Advisory', basePrice: 500, unit: 'annual', description: 'Strategic tax planning' },
    { id: 's7', name: 'CFO Advisory', category: 'Advisory', basePrice: 800, unit: 'monthly', description: 'Strategic financial advice' },
    { id: 's8', name: 'Trust Tax Return', category: 'Tax', basePrice: 800, unit: 'annual', description: 'Trust tax compliance' },
    { id: 's9', name: 'SMSF Compliance', category: 'SMSF', basePrice: 2000, unit: 'annual', description: 'SMSF annual return' },
    { id: 's10', name: 'Financial Statements', category: 'Compliance', basePrice: 600, unit: 'annual', description: 'Annual financial statements' }
  ]);

  // Pricing Rules
  const [pricingRules] = useState<PricingRule[]>([
    { id: 'r1', name: 'Annual Payment Discount', type: 'early-payment', value: 10, valueType: 'percentage', conditions: 'Pay annually in advance' },
    { id: 'r2', name: 'Multi-Entity Discount', type: 'volume-discount', value: 15, valueType: 'percentage', conditions: '3+ entities' },
    { id: 'r3', name: 'Service Bundle', type: 'bundle-discount', value: 20, valueType: 'percentage', conditions: 'Tax + Bookkeeping + Advisory' },
    { id: 'r4', name: 'Loyalty Discount', type: 'loyalty-discount', value: 5, valueType: 'percentage', conditions: '3+ years client' }
  ]);

  // AUSTRAC Checks
  const [austracChecks, setAustracChecks] = useState<AUSTRACCheck[]>([
    { id: 'c1', name: 'InfoTrack ID Verification', category: 'ID Verification', cost: 3.50, unit: 'per check', provider: 'InfoTrack', description: 'Driver License, Passport, Medicare verification', active: true },
    { id: 'c2', name: 'InfoTrack KYC Check', category: 'ID Verification', cost: 7.00, unit: 'per check', provider: 'InfoTrack', description: 'Full identity verification package', active: true },
    { id: 'c3', name: 'Sanctions Screening', category: 'Screening', cost: 2.50, unit: 'per check', provider: 'InfoTrack', description: 'DFAT sanctions list screening', active: true },
    { id: 'c4', name: 'PEP Screening', category: 'Screening', cost: 2.50, unit: 'per check', provider: 'InfoTrack', description: 'Politically Exposed Person screening', active: true },
    { id: 'c5', name: 'Adverse Media Check', category: 'Screening', cost: 5.00, unit: 'per check', provider: 'InfoTrack', description: 'Negative news and media monitoring', active: true },
    { id: 'c6', name: 'Ongoing Monitoring', category: 'Monitoring', cost: 1.50, unit: 'monthly', provider: 'InfoTrack', description: 'Continuous sanctions/PEP monitoring per client', active: true },
    { id: 'c7', name: 'AML/CTF Platform Fee', category: 'Other', cost: 99.00, unit: 'monthly', provider: 'Grow', description: 'AUSTRAC compliance platform subscription', active: true },
    { id: 'c8', name: 'AUSTRAC Registration', category: 'Reporting', cost: 0, unit: 'annual', provider: 'AUSTRAC', description: 'Free AUSTRAC reporting entity registration', active: true }
  ]);
  const [editingCheck, setEditingCheck] = useState<string | null>(null);
  const [showAddCheck, setShowAddCheck] = useState(false);
  const [newCheck, setNewCheck] = useState<Partial<AUSTRACCheck>>({
    name: '',
    category: 'Other',
    cost: 0,
    unit: 'per check',
    provider: '',
    description: '',
    active: true
  });

  const renderServicePlans = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Service Plans</h3>
          <p className="text-gray-600">Pre-configured service packages for different client types</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
          <Plus className="w-5 h-5" />
          New Plan
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {servicePlans.map((plan) => {
          const getPlanColor = (type: string) => {
            switch (type) {
              case 'starter': return 'border-green-300 bg-green-50';
              case 'professional': return 'border-blue-300 bg-blue-50';
              case 'premium': return 'border-purple-300 bg-purple-50';
              case 'custom': return 'border-gray-300 bg-gray-50';
              default: return 'border-gray-300 bg-gray-50';
            }
          };

          const getPlanBadge = (type: string) => {
            switch (type) {
              case 'starter': return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">STARTER</span>;
              case 'professional': return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">PROFESSIONAL</span>;
              case 'premium': return <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full flex items-center gap-1"><Star className="w-3 h-3" />PREMIUM</span>;
              case 'custom': return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">CUSTOM</span>;
              default: return null;
            }
          };

          return (
            <div key={plan.id} className={`border-2 rounded-lg p-6 ${getPlanColor(plan.type)}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h4>
                  {getPlanBadge(plan.type)}
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-white rounded transition-colors">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-white rounded transition-colors">
                    <Copy className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-bold text-gray-900">${plan.monthlyPrice}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-600">
                  ${plan.annualPrice}/year (save ${(plan.monthlyPrice * 12 - plan.annualPrice).toFixed(0)})
                </p>
              </div>

              <div className="mb-4 pb-4 border-b border-gray-300">
                <p className="text-xs text-gray-600 mb-2 font-semibold">CLIENT TYPE</p>
                <span className="px-2 py-1 bg-white rounded text-xs font-semibold text-gray-700">{plan.clientType}</span>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-600 mb-2 font-semibold">INCLUDED SERVICES</p>
                <div className="space-y-1">
                  {plan.services.map((service, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {service}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-600 mb-2 font-semibold">KEY FEATURES</p>
                <div className="space-y-1">
                  {plan.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <Star className="w-3 h-3 text-amber-500" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700 font-semibold">{plan.clientsCount} clients</span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                  plan.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {plan.active ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Plans</span>
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{servicePlans.length}</p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active Clients</span>
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{servicePlans.reduce((sum, p) => sum + p.clientsCount, 0)}</p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">MRR</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${servicePlans.reduce((sum, p) => sum + (p.monthlyPrice * p.clientsCount), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">ARR</span>
            <BarChart3 className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${servicePlans.reduce((sum, p) => sum + (p.annualPrice * p.clientsCount), 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );

  const renderPricingTools = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Pricing Tools</h3>
        <p className="text-gray-600">Services library and pricing rules</p>
      </div>

      {/* Services Library */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-gray-900">Services Library</h4>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Service Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Base Price</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Billing</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-gray-900">{service.name}</p>
                    <p className="text-xs text-gray-600">{service.description}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                      {service.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-gray-900">${service.basePrice}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600 capitalize">{service.unit}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing Rules */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-gray-900">Pricing Rules & Discounts</h4>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            <Plus className="w-4 h-4" />
            Add Rule
          </button>
        </div>

        <div className="space-y-3">
          {pricingRules.map((rule) => {
            const getRuleIcon = (type: string) => {
              switch (type) {
                case 'volume-discount': return <Layers className="w-5 h-5 text-blue-600" />;
                case 'bundle-discount': return <Package className="w-5 h-5 text-purple-600" />;
                case 'loyalty-discount': return <Star className="w-5 h-5 text-amber-600" />;
                case 'early-payment': return <Clock className="w-5 h-5 text-green-600" />;
                default: return <DollarSign className="w-5 h-5 text-gray-600" />;
              }
            };

            return (
              <div key={rule.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                    {getRuleIcon(rule.type)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{rule.name}</p>
                    <p className="text-sm text-gray-600">{rule.conditions}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {rule.valueType === 'percentage' ? `${rule.value}%` : `$${rule.value}`}
                    </p>
                    <p className="text-xs text-gray-600">Discount</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white rounded transition-colors">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-white rounded transition-colors">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AUSTRAC Checks & Compliance Costs */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-red-600" />
            <div>
              <h4 className="font-bold text-red-900">AUSTRAC Checks & Compliance Costs</h4>
              <p className="text-sm text-red-700">InfoTrack verification and AML/CTF compliance costs</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddCheck(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add Check
          </button>
        </div>

        {/* Cost Summary */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-lg p-4 border border-red-200">
            <p className="text-xs text-red-700 font-semibold mb-1">Per Client Onboarding</p>
            <p className="text-2xl font-bold text-red-900">
              ${austracChecks.filter(c => c.unit === 'per check').reduce((sum, c) => sum + c.cost, 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-red-200">
            <p className="text-xs text-red-700 font-semibold mb-1">Monthly Costs</p>
            <p className="text-2xl font-bold text-red-900">
              ${austracChecks.filter(c => c.unit === 'monthly').reduce((sum, c) => sum + c.cost, 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-red-200">
            <p className="text-xs text-red-700 font-semibold mb-1">Annual Costs</p>
            <p className="text-2xl font-bold text-red-900">
              ${austracChecks.filter(c => c.unit === 'annual').reduce((sum, c) => sum + c.cost, 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Add New Check Form */}
        {showAddCheck && (
          <div className="bg-white rounded-lg p-4 mb-4 border-2 border-red-300">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-bold text-gray-900">Add New Check</h5>
              <button
                onClick={() => {
                  setShowAddCheck(false);
                  setNewCheck({
                    name: '',
                    category: 'Other',
                    cost: 0,
                    unit: 'per check',
                    provider: '',
                    description: '',
                    active: true
                  });
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Check Name</label>
                <input
                  type="text"
                  value={newCheck.name}
                  onChange={(e) => setNewCheck({ ...newCheck, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  placeholder="e.g., Company Extract"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Provider</label>
                <input
                  type="text"
                  value={newCheck.provider}
                  onChange={(e) => setNewCheck({ ...newCheck, provider: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  placeholder="e.g., InfoTrack"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={newCheck.category}
                  onChange={(e) => setNewCheck({ ...newCheck, category: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                >
                  <option value="ID Verification">ID Verification</option>
                  <option value="Screening">Screening</option>
                  <option value="Monitoring">Monitoring</option>
                  <option value="Reporting">Reporting</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Unit</label>
                <select
                  value={newCheck.unit}
                  onChange={(e) => setNewCheck({ ...newCheck, unit: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                >
                  <option value="per check">Per Check</option>
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newCheck.cost}
                  onChange={(e) => setNewCheck({ ...newCheck, cost: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  placeholder="0.00"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    if (newCheck.name && newCheck.provider) {
                      setAustracChecks([...austracChecks, {
                        id: `c${austracChecks.length + 1}`,
                        ...newCheck as AUSTRACCheck
                      }]);
                      setShowAddCheck(false);
                      setNewCheck({
                        name: '',
                        category: 'Other',
                        cost: 0,
                        unit: 'per check',
                        provider: '',
                        description: '',
                        active: true
                      });
                      toast.success('✓ Check added successfully!');
                    }
                  }}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm"
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  Save Check
                </button>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newCheck.description}
                  onChange={(e) => setNewCheck({ ...newCheck, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  placeholder="Brief description of the check"
                />
              </div>
            </div>
          </div>
        )}

        {/* Checks Table */}
        <div className="bg-white rounded-lg overflow-hidden border border-red-200">
          <table className="w-full">
            <thead className="bg-red-100">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-bold text-red-900">Check Name</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-red-900">Category</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-red-900">Provider</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-red-900">Cost</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-red-900">Unit</th>
                <th className="text-center py-3 px-4 text-xs font-bold text-red-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {austracChecks.map((check) => {
                const isEditing = editingCheck === check.id;
                return (
                  <tr key={check.id} className="border-b border-red-100 hover:bg-red-50">
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={check.name}
                          onChange={(e) => {
                            setAustracChecks(austracChecks.map(c => 
                              c.id === check.id ? { ...c, name: e.target.value } : c
                            ));
                          }}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      ) : (
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{check.name}</p>
                          <p className="text-xs text-gray-600">{check.description}</p>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <select
                          value={check.category}
                          onChange={(e) => {
                            setAustracChecks(austracChecks.map(c => 
                              c.id === check.id ? { ...c, category: e.target.value as any } : c
                            ));
                          }}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        >
                          <option value="ID Verification">ID Verification</option>
                          <option value="Screening">Screening</option>
                          <option value="Monitoring">Monitoring</option>
                          <option value="Reporting">Reporting</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                          {check.category}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={check.provider}
                          onChange={(e) => {
                            setAustracChecks(austracChecks.map(c => 
                              c.id === check.id ? { ...c, provider: e.target.value } : c
                            ));
                          }}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      ) : (
                        <span className="text-sm text-gray-700">{check.provider}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={check.cost}
                          onChange={(e) => {
                            setAustracChecks(austracChecks.map(c => 
                              c.id === check.id ? { ...c, cost: parseFloat(e.target.value) || 0 } : c
                            ));
                          }}
                          className="w-24 px-2 py-1 text-sm border border-gray-300 rounded text-right"
                        />
                      ) : (
                        <span className="font-bold text-gray-900">${check.cost.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <select
                          value={check.unit}
                          onChange={(e) => {
                            setAustracChecks(austracChecks.map(c => 
                              c.id === check.id ? { ...c, unit: e.target.value as any } : c
                            ));
                          }}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        >
                          <option value="per check">Per Check</option>
                          <option value="monthly">Monthly</option>
                          <option value="annual">Annual</option>
                        </select>
                      ) : (
                        <span className="text-xs text-gray-600">{check.unit}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => {
                                setEditingCheck(null);
                                toast.success('✓ Changes saved!');
                              }}
                              className="p-1 hover:bg-green-100 rounded text-green-600"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingCheck(null)}
                              className="p-1 hover:bg-gray-100 rounded text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingCheck(check.id)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Edit className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => {
                                setAustracChecks(austracChecks.filter(c => c.id !== check.id));
                                toast.success('✓ Check deleted!');
                              }}
                              className="p-1 hover:bg-red-100 rounded"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCalculator = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Pricing Calculator</h3>
        <p className="text-gray-600">Build custom quotes for prospective clients</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Form */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h4 className="font-bold text-gray-900 mb-4">Build Quote</h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Client Name</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Enter client name" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Client Type</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option>Individual</option>
                <option>Company</option>
                <option>Trust</option>
                <option>SMSF</option>
                <option>Partnership</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Services</label>
              <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {services.slice(0, 6).map((service) => (
                  <label key={service.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{service.name}</p>
                      <p className="text-xs text-gray-600">${service.basePrice}/{service.unit}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Billing Frequency</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Annual (10% discount)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Apply Discount</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value="">No discount</option>
                {pricingRules.map((rule) => (
                  <option key={rule.id} value={rule.id}>
                    {rule.name} ({rule.value}{rule.valueType === 'percentage' ? '%' : '$'})
                  </option>
                ))}
              </select>
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              <Calculator className="w-5 h-5" />
              Calculate Quote
            </button>
          </div>
        </div>

        {/* Quote Preview */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6">
          <h4 className="font-bold text-gray-900 mb-4">Quote Summary</h4>

          <div className="bg-white rounded-lg p-6 mb-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Services Subtotal</span>
                <span className="font-semibold text-gray-900">$0.00</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount Applied</span>
                <span className="font-semibold">-$0.00</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>GST (10%)</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">$0.00</span>
              </div>
              <p className="text-xs text-gray-600 text-center">per month</p>
            </div>
          </div>

          <div className="space-y-2">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              <FileText className="w-5 h-5" />
              Generate Proposal
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
              <Copy className="w-5 h-5" />
              Copy Quote Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOnboardingFlows = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Client Onboarding Flows</h3>
        <p className="text-gray-600">Automated onboarding workflows by client type</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Onboarding Templates */}
        {[
          { 
            type: 'Individual', 
            steps: ['Welcome Email', 'Document Collection', 'ID Verification', 'Tax File', 'Engagement Letter', 'Portal Access'],
            duration: '3-5 days',
            active: true
          },
          { 
            type: 'Company', 
            steps: ['Welcome Email', 'Company Verification', 'Director ID', 'AML/CTF', 'Engagement Letter', 'Compliance Setup', 'Portal Access'],
            duration: '5-7 days',
            active: true
          },
          { 
            type: 'Trust/SMSF', 
            steps: ['Welcome Email', 'Trust Deed Review', 'Trustee Verification', 'AML/CTF', 'Engagement Letter', 'Compliance Setup', 'Portal Access'],
            duration: '7-10 days',
            active: true
          }
        ].map((flow, idx) => (
          <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">{flow.type} Onboarding</h4>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {flow.duration}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <Target className="w-4 h-4" />
                    {flow.steps.length} steps
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  flow.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {flow.active ? 'Active' : 'Inactive'}
                </span>
                <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {flow.steps.map((step, stepIdx) => (
                <div key={stepIdx} className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      {stepIdx + 1}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{step}</span>
                  </div>
                  {stepIdx < flow.steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
        <Plus className="w-5 h-5" />
        Create Custom Flow
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Activation Banner */}
      {(!plansActivated || !pricingActivated) && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Package className="w-6 h-6" />
                Activate Service Plans & Pricing Tools
              </h3>
              <p className="text-blue-100 mb-4">
                Enable automated service packages, pricing calculators, and client quoting tools to streamline your onboarding and grow revenue.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold">Service Plans</h4>
                    {plansActivated ? (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-blue-100 mb-3">
                    Pre-configured service packages, client segmentation, and MRR/ARR tracking
                  </p>
                  {!plansActivated && (
                    <button
                      onClick={() => {
                        setPlansActivated(true);
                        toast.success('✓ Service Plans activated! You can now create and manage service packages.');
                      }}
                      className="w-full px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-sm"
                    >
                      Activate Service Plans
                    </button>
                  )}
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold">Pricing Tools</h4>
                    {pricingActivated ? (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-blue-100 mb-3">
                    Services library, pricing rules, discount automation, and quote calculator
                  </p>
                  {!pricingActivated && (
                    <button
                      onClick={() => {
                        setPricingActivated(true);
                        toast.success('✓ Pricing Tools activated! Build custom quotes and manage pricing rules.');
                      }}
                      className="w-full px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-sm"
                    >
                      Activate Pricing Tools
                    </button>
                  )}
                </div>
              </div>

              {plansActivated && pricingActivated && (
                <div className="bg-green-500/20 border border-green-400 rounded-lg p-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-200" />
                  <p className="text-sm font-semibold text-green-100">
                    All tools activated! Explore the tabs below to set up your service plans and pricing.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Banner (when both activated) */}
      {plansActivated && pricingActivated && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-bold text-green-900">Service Plans & Pricing Tools Active</h3>
              <p className="text-sm text-green-800">
                You can now create service packages, set pricing rules, and generate client quotes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Practice Planning</h2>
        <p className="text-gray-600">Manage service plans, pricing, and onboarding workflows</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
            activeTab === 'plans'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Service Plans
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
            activeTab === 'pricing'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Pricing Tools
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
            activeTab === 'calculator'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Calculator
        </button>
        <button
          onClick={() => setActiveTab('onboarding')}
          className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
            activeTab === 'onboarding'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Onboarding Flows
        </button>
      </div>

      {/* Content */}
      {activeTab === 'plans' && renderServicePlans()}
      {activeTab === 'pricing' && renderPricingTools()}
      {activeTab === 'calculator' && renderCalculator()}
      {activeTab === 'onboarding' && renderOnboardingFlows()}
    </div>
  );
}