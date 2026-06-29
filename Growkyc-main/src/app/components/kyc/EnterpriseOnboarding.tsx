import React, { useState } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import {
  Shield,
  Building,
  Users,
  TrendingUp,
  Database,
  Zap,
  Lock,
  Globe,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Activity,
  Settings,
  Eye,
  Download,
  Upload,
  Search,
  Filter,
  Plus,
  ChevronRight,
  DollarSign,
  CreditCard,
  Link,
  MessageSquare,
  Calendar,
  BarChart,
  Workflow,
  Code,
  Play,
  Pause,
  Check,
  X
} from 'lucide-react';

type OnboardingState = 
  | 'draft' 
  | 'information-collection' 
  | 'kyc' 
  | 'risk-review' 
  | 'approval' 
  | 'engaged' 
  | 'activated';

interface Client {
  id: string;
  name: string;
  type: string;
  state: OnboardingState;
  progress: number;
  riskScore: number;
  riskTier: 'low' | 'medium' | 'high';
  services: string[];
  commercialStatus: 'unpaid' | 'deposit-paid' | 'paid';
  assignedTo: string;
  createdDate: string;
  auditEvents: number;
}

export function EnterpriseOnboarding() {
  const [activeView, setActiveView] = useState<'dashboard' | 'clients' | 'risk' | 'integrations' | 'audit' | 'settings'>('dashboard');
  const [showNewClientModal, setShowNewClientModal] = useState(false);

  const clients: Client[] = [
    {
      id: 'CLI-2024-001',
      name: 'TechCorp Pty Ltd',
      type: 'Company',
      state: 'activated',
      progress: 100,
      riskScore: 15,
      riskTier: 'low',
      services: ['Tax Compliance', 'BAS', 'Payroll'],
      commercialStatus: 'paid',
      assignedTo: 'Emma Wilson',
      createdDate: '2024-02-15',
      auditEvents: 247
    },
    {
      id: 'CLI-2024-002',
      name: 'Johnson Family Trust',
      type: 'Trust',
      state: 'risk-review',
      progress: 75,
      riskScore: 48,
      riskTier: 'medium',
      services: ['Trust Management', 'Estate Planning'],
      commercialStatus: 'deposit-paid',
      assignedTo: 'Michael Chen',
      createdDate: '2024-02-18',
      auditEvents: 156
    },
    {
      id: 'CLI-2024-003',
      name: 'Property Investment Co',
      type: 'Company',
      state: 'kyc',
      progress: 60,
      riskScore: 32,
      riskTier: 'medium',
      services: ['Investment Loan', 'Property Finance'],
      commercialStatus: 'unpaid',
      assignedTo: 'Sarah Williams',
      createdDate: '2024-02-19',
      auditEvents: 89
    }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-100">Active Clients</h3>
            <Users className="w-8 h-8 text-green-400" />
          </div>
          <p className="text-4xl font-bold text-slate-100 mb-2">492</p>
          <p className="text-sm text-green-400">↑ 18% growth</p>
        </div>

        <div className="bg-white rounded-lg border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-100">Avg Risk Score</h3>
            <TrendingUp className="w-8 h-8 text-orange-400" />
          </div>
          <p className="text-4xl font-bold text-slate-100 mb-2">22</p>
          <p className="text-sm text-green-400">LOW risk</p>
        </div>

        <div className="bg-white rounded-lg border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-100">Compliance Rate</h3>
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-4xl font-bold text-slate-100 mb-2">98.7%</p>
          <p className="text-sm text-green-400">AUSTRAC compliant</p>
        </div>

        <div className="bg-white rounded-lg border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-100">Audit Events</h3>
            <Activity className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-4xl font-bold text-slate-100 mb-2">15.2K</p>
          <p className="text-sm text-slate-300">Last 30 days</p>
        </div>
      </div>

      {/* Risk Intelligence */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-white/10 p-6">
          <h3 className="text-xl font-bold text-slate-100 mb-4">Risk Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-green-300">Low Risk (0-30)</span>
                <span className="text-lg font-bold text-green-400">312</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-green-600" style={{ width: '63%' }} />
              </div>
              <p className="text-xs text-slate-300 mt-1">63% of portfolio</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-yellow-300">Medium Risk (31-60)</span>
                <span className="text-lg font-bold text-yellow-400">156</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-600" style={{ width: '32%' }} />
              </div>
              <p className="text-xs text-slate-300 mt-1">32% of portfolio</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-red-300">High Risk (61-100)</span>
                <span className="text-lg font-bold text-red-400">24</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-red-600" style={{ width: '5%' }} />
              </div>
              <p className="text-xs text-slate-300 mt-1">5% of portfolio</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-white/10 p-6">
          <h3 className="text-xl font-bold text-slate-100 mb-4">Commercial Control</h3>
          <div className="space-y-3">
            {[
              { rule: 'Payment Before Activation', clients: 492 },
              { rule: 'Risk-Based Pricing', adjustments: 24 },
              { rule: 'Auto Deposit Requirement', triggered: 12 },
              { rule: 'Engagement Lock', locked: 3 }
            ].map((rule) => (
              <div key={rule.rule} className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-green-300">{rule.rule}</span>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-xs text-green-300">
                  {Object.entries(rule).filter(([key]) => key !== 'rule').map(([key, value]) => `${value} ${key}`).join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-white/10 p-6">
          <h3 className="text-xl font-bold text-slate-100 mb-4">System Health</h3>
          <div className="space-y-3">
            {[
              { name: 'API Response', value: '124ms', icon: Zap, color: 'blue' },
              { name: 'Database', value: '98.7%', icon: Database, color: 'green' },
              { name: 'Uptime', value: '99.9%', icon: Activity, color: 'purple' }
            ].map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.name} className={`bg-${metric.color}-50 border border-${metric.color}-200 rounded-lg p-3`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 text-${metric.color}-600`} />
                      <span className="text-sm font-semibold text-slate-100">{metric.name}</span>
                    </div>
                    <span className={`text-lg font-bold text-${metric.color}-600`}>{metric.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-100">Client Onboarding Pipeline</h2>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowNewClientModal(true)}>
          <Plus className="w-5 h-5 mr-2" />
          New Client
        </Button>
      </div>

      {/* State Pipeline */}
      <div className="bg-white rounded-lg border border-white/10 p-6">
        <h3 className="font-bold text-slate-100 mb-4">Stage-Gated State Engine</h3>
        <div className="flex items-center justify-between">
          {[
            { state: 'draft', label: 'Draft', count: 12, color: 'gray' },
            { state: 'information-collection', label: 'Info Collection', count: 8, color: 'blue' },
            { state: 'kyc', label: 'KYC', count: 15, color: 'purple' },
            { state: 'risk-review', label: 'Risk Review', count: 6, color: 'orange' },
            { state: 'approval', label: 'Approval', count: 4, color: 'yellow' },
            { state: 'engaged', label: 'Engaged', count: 3, color: 'green' },
            { state: 'activated', label: 'Activated', count: 244, color: 'teal' }
          ].map((stage, idx) => (
            <div key={stage.state} className="flex items-center">
              <div className={`bg-${stage.color}-50 border-2 border-${stage.color}-300 rounded-lg p-4 text-center min-w-[120px]`}>
                <div className={`w-10 h-10 bg-${stage.color}-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold`}>
                  {stage.count}
                </div>
                <p className={`text-sm font-bold text-${stage.color}-900`}>{stage.label}</p>
              </div>
              {idx < 6 && (
                <ChevronRight className="w-6 h-6 text-gray-400 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Client List */}
      <div className="bg-white rounded-lg border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-100 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-100 uppercase">State</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-100 uppercase">Progress</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-100 uppercase">Risk</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-100 uppercase">Commercial</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-100 uppercase">Assigned</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-100 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {clients.map((client) => {
              const stateColors = {
                'draft': 'gray',
                'information-collection': 'blue',
                'kyc': 'purple',
                'risk-review': 'orange',
                'approval': 'yellow',
                'engaged': 'green',
                'activated': 'teal'
              };
              const stateColor = stateColors[client.state];

              return (
                <tr key={client.id} className="hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-100">{client.name}</p>
                      <p className="text-sm text-slate-300">{client.id} • {client.type}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 bg-${stateColor}-100 text-${stateColor}-700 text-xs font-bold rounded-full uppercase`}>
                      {client.state.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white/10 rounded-full h-2">
                        <div 
                          className={`bg-${stateColor}-600 h-2 rounded-full`}
                          style={{ width: `${client.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-100">{client.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 bg-${
                        client.riskTier === 'low' ? 'green' :
                        client.riskTier === 'medium' ? 'yellow' : 'red'
                      }-100 text-${
                        client.riskTier === 'low' ? 'green' :
                        client.riskTier === 'medium' ? 'yellow' : 'red'
                      }-700 text-xs font-bold rounded-full uppercase`}>
                        {client.riskScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {client.commercialStatus === 'paid' ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : client.commercialStatus === 'deposit-paid' ? (
                      <Clock className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-100">{client.assignedTo}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRiskEngine = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-100">Advanced Risk Intelligence Engine</h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-6 text-white">
          <Shield className="w-12 h-12 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Risk Scoring Model</h3>
          <p className="text-red-100 mb-4">Weighted multi-factor analysis</p>
          <div className="space-y-2">
            {[
              { factor: 'Industry Risk', weight: '20%' },
              { factor: 'Geographic Risk', weight: '15%' },
              { factor: 'Ownership Complexity', weight: '25%' },
              { factor: 'Sanctions/PEP', weight: '30%' },
              { factor: 'Behavioral Flags', weight: '10%' }
            ].map((item) => (
              <div key={item.factor} className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded p-2">
                <span className="text-sm">{item.factor}</span>
                <span className="font-bold">{item.weight}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-white/10 p-6">
          <h3 className="font-bold text-slate-100 mb-4">Risk Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-green-300">Low Risk (0-30)</span>
                <span className="text-lg font-bold text-green-400">312</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-green-600" style={{ width: '63%' }} />
              </div>
              <p className="text-xs text-slate-300 mt-1">63% of portfolio</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-yellow-300">Medium Risk (31-60)</span>
                <span className="text-lg font-bold text-yellow-400">156</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-600" style={{ width: '32%' }} />
              </div>
              <p className="text-xs text-slate-300 mt-1">32% of portfolio</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-red-300">High Risk (61-100)</span>
                <span className="text-lg font-bold text-red-400">24</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-red-600" style={{ width: '5%' }} />
              </div>
              <p className="text-xs text-slate-300 mt-1">5% of portfolio</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-white/10 p-6">
          <h3 className="font-bold text-slate-100 mb-4">Commercial Control</h3>
          <div className="space-y-3">
            {[
              { rule: 'Payment Before Activation', status: 'active', clients: 492 },
              { rule: 'Risk-Based Pricing', status: 'active', adjustments: 24 },
              { rule: 'Auto Deposit Requirement', status: 'active', triggered: 12 },
              { rule: 'Engagement Lock', status: 'active', locked: 3 }
            ].map((rule) => (
              <div key={rule.rule} className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-green-300">{rule.rule}</span>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-xs text-green-300">
                  {Object.entries(rule).filter(([key]) => key !== 'rule' && key !== 'status').map(([key, value]) => `${value} ${key}`).join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-white/10 p-6">
          <h3 className="font-bold text-slate-100 mb-4">Ongoing Monitoring Triggers</h3>
          <div className="space-y-3">
            {[
              { trigger: 'Sanctions list update', frequency: 'Daily', lastRun: '2 hours ago' },
              { trigger: 'PEP database refresh', frequency: 'Weekly', lastRun: '2 days ago' },
              { trigger: 'Adverse media scan', frequency: 'Weekly', lastRun: '3 days ago' },
              { trigger: 'Ownership change detect', frequency: 'Monthly', lastRun: '5 days ago' },
              { trigger: 'Credit bureau check', frequency: 'Quarterly', lastRun: '12 days ago' }
            ].map((item) => (
              <div key={item.trigger} className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                <div>
                  <p className="font-semibold text-blue-300 text-sm">{item.trigger}</p>
                  <p className="text-xs text-blue-300">Frequency: {item.frequency}</p>
                </div>
                <span className="text-xs text-slate-300">{item.lastRun}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-white/10 p-6">
          <h3 className="font-bold text-slate-100 mb-4">Risk Escalation Rules</h3>
          <div className="space-y-3">
            {[
              { condition: 'Risk Score > 60', action: 'Senior Manager Approval', triggered: 24 },
              { condition: 'Sanctions Match', action: 'Immediate Block + Alert', triggered: 0 },
              { condition: 'PEP Identified', action: 'Enhanced CDD Required', triggered: 8 },
              { condition: 'Adverse Media Found', action: 'Compliance Review', triggered: 3 },
              { condition: 'Payment Overdue', action: 'Auto Suspension', triggered: 2 }
            ].map((rule) => (
              <div key={rule.condition} className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-orange-300 text-sm">{rule.condition}</p>
                  <span className="px-2 py-1 bg-orange-600 text-white text-xs font-bold rounded-full">
                    {rule.triggered}
                  </span>
                </div>
                <p className="text-xs text-orange-300">{rule.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-100">Integration Hub</h2>

      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-8 text-white">
        <div className="flex items-center gap-4 mb-6">
          <Link className="w-16 h-16" />
          <div>
            <h3 className="text-2xl font-bold mb-1">Central Integration Layer</h3>
            <p className="text-purple-100">Pre-built connectors with logging and retry logic</p>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {[
            { name: 'Xero', syncs: '247', status: 'live' },
            { name: 'Microsoft 365', syncs: '3', status: 'live' },
            { name: 'Banks (Open Banking)', syncs: '156', status: 'live' },
            { name: 'ASIC', syncs: '189', status: 'live' },
            { name: 'InfoTrack', syncs: '89', status: 'live' }
          ].map((integration) => (
            <div key={integration.name} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="font-bold mb-1">{integration.name}</p>
              <p className="text-2xl font-bold mb-1">{integration.syncs}</p>
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full uppercase">
                {integration.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {[
          {
            name: 'Xero Integration',
            color: 'blue',
            features: [
              'Chart of accounts sync',
              'Client entity sync',
              'Financial data pull',
              'Real-time updates'
            ]
          },
          {
            name: 'Microsoft 365',
            color: 'indigo',
            features: [
              'Email synchronization',
              'Calendar integration',
              'OneDrive storage',
              'Teams collaboration'
            ]
          },
          {
            name: 'Banking (Open Banking)',
            color: 'green',
            features: [
              'Account verification',
              'Statement extraction',
              'Transaction monitoring',
              'Balance checks'
            ]
          },
          {
            name: 'ASIC',
            color: 'orange',
            features: [
              'Company search',
              'Director verification',
              'Share structure',
              'Real-time lookups'
            ]
          },
          {
            name: 'InfoTrack',
            color: 'purple',
            features: [
              'Title searches',
              'PPSR checks',
              'Identity verification',
              'GreenID integration'
            ]
          },
          {
            name: 'ATO',
            color: 'red',
            features: [
              'Client authorization',
              'Tax registrations',
              'ABN lookups',
              'TFN validation'
            ]
          }
        ].map((integration) => (
          <div key={integration.name} className={`bg-white rounded-lg border-2 border-${integration.color}-200 p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-100">{integration.name}</h3>
              <span className="px-3 py-1 bg-green-500/15 text-green-300 text-xs font-bold rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                CONNECTED
              </span>
            </div>
            <ul className="space-y-2">
              {integration.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-green-400" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Activity className="w-4 h-4 mr-2" />
                Logs
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-white/10 p-6">
        <h3 className="font-bold text-slate-100 mb-4">Webhook Configuration</h3>
        <div className="space-y-3">
          {[
            { event: 'onboarding.completed', endpoint: 'https://api.firm.com/webhooks/onboarding', status: 'active' },
            { event: 'risk.high_score', endpoint: 'https://api.firm.com/webhooks/risk-alert', status: 'active' },
            { event: 'payment.received', endpoint: 'https://api.firm.com/webhooks/payment', status: 'active' },
            { event: 'kyc.approved', endpoint: 'https://api.firm.com/webhooks/kyc', status: 'active' }
          ].map((webhook) => (
            <div key={webhook.event} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <p className="font-semibold text-slate-100 text-sm">{webhook.event}</p>
                <p className="text-xs text-slate-300 font-mono">{webhook.endpoint}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-500/15 text-green-300 text-xs font-bold rounded-full">
                  {webhook.status.toUpperCase()}
                </span>
                <Button size="sm" variant="outline">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAudit = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-100">Full Audit Trail</h2>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
          <Activity className="w-12 h-12 mb-3" />
          <p className="text-sm mb-1">Total Events</p>
          <p className="text-4xl font-bold">15,247</p>
          <p className="text-xs text-blue-100 mt-2">Last 30 days</p>
        </div>

        <div className="bg-white rounded-lg border border-white/10 p-6">
          <Eye className="w-12 h-12 text-purple-400 mb-3" />
          <p className="text-sm text-slate-300 mb-1">User Actions</p>
          <p className="text-4xl font-bold text-slate-100">8,934</p>
        </div>

        <div className="bg-white rounded-lg border border-white/10 p-6">
          <Database className="w-12 h-12 text-green-400 mb-3" />
          <p className="text-sm text-slate-300 mb-1">System Events</p>
          <p className="text-4xl font-bold text-slate-100">6,313</p>
        </div>

        <div className="bg-white rounded-lg border border-white/10 p-6">
          <Lock className="w-12 h-12 text-red-400 mb-3" />
          <p className="text-sm text-slate-300 mb-1">Immutable</p>
          <p className="text-4xl font-bold text-slate-100">100%</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-white/10 p-6">
        <h3 className="font-bold text-slate-100 mb-4">Event Stream (Real-time)</h3>
        <div className="space-y-2">
          {[
            { timestamp: '2024-02-19 14:32:15', user: 'emma.wilson@firm.com', action: 'Client activated', entity: 'CLI-2024-001', ip: '203.45.67.89' },
            { timestamp: '2024-02-19 14:31:48', user: 'system', action: 'Risk score calculated', entity: 'CLI-2024-001', ip: 'internal' },
            { timestamp: '2024-02-19 14:31:22', user: 'michael.chen@firm.com', action: 'Document uploaded', entity: 'CLI-2024-002', ip: '192.168.1.45' },
            { timestamp: '2024-02-19 14:30:56', user: 'system', action: 'Sanctions screening completed', entity: 'CLI-2024-002', ip: 'internal' },
            { timestamp: '2024-02-19 14:30:12', user: 'sarah.williams@firm.com', action: 'Field updated: email', entity: 'CLI-2024-003', ip: '10.0.0.23' }
          ].map((event, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg font-mono text-xs">
              <div className="flex items-center gap-4">
                <span className="text-slate-400">{event.timestamp}</span>
                <span className={`px-2 py-1 rounded ${event.user === 'system' ? 'bg-blue-500/15 text-blue-300' : 'bg-purple-500/15 text-purple-300'}`}>
                  {event.user}
                </span>
                <span className="text-slate-100 font-semibold">{event.action}</span>
                <span className="text-blue-400">{event.entity}</span>
              </div>
              <span className="text-slate-400">{event.ip}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-white/10 p-6">
          <h3 className="font-bold text-slate-100 mb-4">Field-Level Change Tracking</h3>
          <div className="space-y-3">
            {[
              { field: 'Client Name', before: 'Tech Corp', after: 'TechCorp Pty Ltd', user: 'Emma Wilson' },
              { field: 'Risk Score', before: '18', after: '15', user: 'System' },
              { field: 'Email', before: 'old@email.com', after: 'new@email.com', user: 'Michael Chen' }
            ].map((change, idx) => (
              <div key={idx} className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="font-semibold text-slate-100 text-sm mb-2">{change.field}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 bg-red-500/15 text-red-300 rounded line-through">{change.before}</span>
                  <span>→</span>
                  <span className="px-2 py-1 bg-green-500/15 text-green-300 rounded">{change.after}</span>
                </div>
                <p className="text-xs text-slate-300 mt-2">Changed by: {change.user}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-white/10 p-6">
          <h3 className="font-bold text-slate-100 mb-4">Compliance Readiness</h3>
          <div className="space-y-3">
            {[
              { check: 'Immutable Event Ledger', status: 'pass' },
              { check: 'Timestamp on All Actions', status: 'pass' },
              { check: 'IP & Device Tracking', status: 'pass' },
              { check: 'Field-Level Changes', status: 'pass' },
              { check: 'KYC Decision Logs', status: 'pass' },
              { check: 'Export Capability', status: 'pass' }
            ].map((item) => (
              <div key={item.check} className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <span className="text-sm font-semibold text-green-300">{item.check}</span>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white/5">
      {/* New Client Modal */}
      {showNewClientModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
            <h2 className="text-xl font-bold mb-4">Onboard New Client</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Client Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter client name..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Client Type</label>
                <select className="w-full px-3 py-2 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Select type...</option>
                  <option>Company</option>
                  <option>Trust</option>
                  <option>Individual</option>
                  <option>Partnership</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Contact Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="client@email.com"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewClientModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  toast.success('Client created successfully! Starting onboarding workflow...');
                  setShowNewClientModal(false);
                }}
              >
                Create Client
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className="w-12 h-12" />
              <div>
                <h1 className="text-3xl font-bold">Enterprise Onboarding Platform</h1>
                <p className="text-indigo-100">Market-Leading Risk Intelligence + Automation + Commercial Control</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-white text-indigo-400 hover:bg-indigo-500/10">
                <Code className="w-5 h-5 mr-2" />
                API Docs
              </Button>
              <Button className="bg-white text-indigo-400 hover:bg-indigo-500/10">
                <Download className="w-5 h-5 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 p-4">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart },
              { id: 'clients', label: 'Clients', icon: Users },
              { id: 'risk', label: 'Risk Engine', icon: Shield },
              { id: 'integrations', label: 'Integrations', icon: Link },
              { id: 'audit', label: 'Audit Trail', icon: Activity },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as any)}
                  className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                    activeView === item.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'clients' && renderClients()}
        {activeView === 'risk' && renderRiskEngine()}
        {activeView === 'integrations' && renderIntegrations()}
        {activeView === 'audit' && renderAudit()}
        {activeView === 'settings' && (
          <div className="bg-white rounded-lg border border-white/10 p-8 text-center">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-100 mb-2">Settings & Configuration</h3>
            <p className="text-slate-300">System-wide settings and customization options</p>
          </div>
        )}
      </div>
    </div>
  );
}