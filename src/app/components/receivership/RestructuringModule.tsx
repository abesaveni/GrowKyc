import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Target,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Percent,
  Calculator,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Info,
  Download,
  Save,
  Copy,
  RefreshCw,
  ArrowRight,
  Package,
  Scale,
  FileText,
  Users,
  Clock,
  Activity,
  Shield,
  Zap,
  Eye,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

export function RestructuringModule({ matter, role }: any) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'debt-builder' | 'asset-optimization' | 'proposal' | 'exit'>('dashboard');
  const [selectedScenario, setSelectedScenario] = useState<'liquidate' | 'standstill' | 'partial-sale' | 'refinance'>('standstill');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restructuring Engine</h1>
          <p className="text-gray-600 mt-1">Debt restructure modeling, scenario planning, and viability analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Proposal
          </Button>
          <Button variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Save Scenario
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="flex border-b border-gray-300">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'debt-builder', label: 'Debt Restructure Builder', icon: Calculator },
            { id: 'asset-optimization', label: 'Asset Optimization', icon: Package },
            { id: 'proposal', label: 'Proposal Builder', icon: FileText },
            { id: 'exit', label: 'Exit Planning', icon: Target }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-red-600 text-red-600 font-medium bg-red-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'dashboard' && <RestructuringDashboard matter={matter} />}
          {activeTab === 'debt-builder' && <DebtRestructureBuilder matter={matter} selectedScenario={selectedScenario} onScenarioChange={setSelectedScenario} />}
          {activeTab === 'asset-optimization' && <AssetOptimization matter={matter} />}
          {activeTab === 'proposal' && <ProposalBuilder matter={matter} />}
          {activeTab === 'exit' && <ExitPlanning matter={matter} />}
        </div>
      </div>
    </div>
  );
}

// Restructuring Dashboard Tab
function RestructuringDashboard({ matter }: any) {
  return (
    <div className="space-y-6">
      {/* Current Trading Position */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Current Trading Position</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-600 mb-1">Revenue (MTD)</p>
            <p className="text-2xl font-bold text-green-900">$850K</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-green-700">
              <TrendingUp className="w-3 h-3" />
              <span>+12% vs last month</span>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600 mb-1">Expenses (MTD)</p>
            <p className="text-2xl font-bold text-red-900">$920K</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-red-700">
              <TrendingDown className="w-3 h-3" />
              <span>Above budget</span>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-600 mb-1">EBITDA (MTD)</p>
            <p className="text-2xl font-bold text-orange-900">-$70K</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-orange-700">
              <AlertTriangle className="w-3 h-3" />
              <span>Negative margin</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-600 mb-1">Burn Rate</p>
            <p className="text-2xl font-bold text-blue-900">$18K/day</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-blue-700">
              <Clock className="w-3 h-3" />
              <span>69 days runway</span>
            </div>
          </div>
        </div>
      </div>

      {/* 13-Week Cashflow Forecast */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">13-Week Cashflow Forecast</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {[1.2, 1.1, 0.9, 0.8, 1.0, 1.3, 1.4, 1.2, 0.7, 0.5, 0.3, 0.1, -0.2].map((val, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className={`w-full rounded-t ${val >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ height: `${Math.abs(val) * 100}px`, alignSelf: val >= 0 ? 'flex-end' : 'flex-start' }}
              />
              <p className="text-xs text-gray-600">W{idx + 1}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-600">Positive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-gray-600">Negative</span>
          </div>
          <p className="text-red-600 font-semibold">⚠️ Cashflow negative from Week 12</p>
        </div>
      </div>

      {/* Viability Score */}
      <div className="bg-indigo-50 border-2 border-indigo-300 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-indigo-900 mb-1">Viability Score</h3>
            <p className="text-sm text-indigo-700">Based on trading performance, debt position, and asset coverage</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-indigo-900">42/100</p>
            <p className="text-sm text-orange-600 font-medium mt-1">⚠️ Moderate Risk</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-white rounded-lg">
            <p className="text-xs text-indigo-600 mb-1">Trading Performance</p>
            <p className="text-lg font-bold text-gray-900">35/50</p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="text-xs text-indigo-600 mb-1">Debt Serviceability</p>
            <p className="text-lg font-bold text-gray-900">22/30</p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="text-xs text-indigo-600 mb-1">Asset Coverage</p>
            <p className="text-lg font-bold text-gray-900">15/20</p>
          </div>
        </div>
      </div>

      {/* Debt Schedule Summary */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Debt Schedule Summary</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-gray-900">Secured Debt</p>
                <p className="text-sm text-gray-600">ANZ Bank - First ranking mortgage</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">$6.2M</p>
              <p className="text-xs text-gray-600">8.5% p.a.</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Scale className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium text-gray-900">Trade Creditors</p>
                <p className="text-sm text-gray-600">45 unsecured creditors</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">$2.8M</p>
              <p className="text-xs text-gray-600">Priority claims</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-gray-900">Employee Entitlements</p>
                <p className="text-sm text-gray-600">12 employees</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">$380K</p>
              <p className="text-xs text-gray-600">Priority claim</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Debt Restructure Builder Tab
function DebtRestructureBuilder({ matter, selectedScenario, onScenarioChange }: any) {
  const [debtInputs, setDebtInputs] = useState({
    securedDebt: 6200000,
    interestRate: 8.5,
    standstillPeriod: 12,
    haircutPercent: 20,
    extensionTerm: 24,
    equityInjection: 500000,
    assetDisposals: 1500000
  });

  const scenarios = [
    { id: 'liquidate', label: 'Liquidate', color: 'red', recovery: 45 },
    { id: 'standstill', label: 'Standstill + Restructure', color: 'orange', recovery: 72 },
    { id: 'partial-sale', label: 'Partial Asset Sale', color: 'blue', recovery: 85 },
    { id: 'refinance', label: 'Full Refinance', color: 'green', recovery: 95 }
  ];

  return (
    <div className="space-y-6">
      {/* Scenario Selector */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Select Restructure Scenario</h3>
        <div className="grid grid-cols-4 gap-4">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => onScenarioChange(scenario.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedScenario === scenario.id
                  ? `border-${scenario.color}-500 bg-${scenario.color}-50`
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <p className="font-semibold text-gray-900 mb-2">{scenario.label}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-${scenario.color}-600`}
                    style={{ width: `${scenario.recovery}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-900">{scenario.recovery}%</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Est. recovery</p>
            </button>
          ))}
        </div>
      </div>

      {/* Debt Inputs */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Restructure Parameters</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secured Debt</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={debtInputs.securedDebt}
                onChange={(e) => setDebtInputs({ ...debtInputs, securedDebt: Number(e.target.value) })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate</label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                step="0.1"
                value={debtInputs.interestRate}
                onChange={(e) => setDebtInputs({ ...debtInputs, interestRate: Number(e.target.value) })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Standstill Period (months)</label>
            <input
              type="number"
              value={debtInputs.standstillPeriod}
              onChange={(e) => setDebtInputs({ ...debtInputs, standstillPeriod: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Haircut %</label>
            <input
              type="number"
              value={debtInputs.haircutPercent}
              onChange={(e) => setDebtInputs({ ...debtInputs, haircutPercent: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Extension Term (months)</label>
            <input
              type="number"
              value={debtInputs.extensionTerm}
              onChange={(e) => setDebtInputs({ ...debtInputs, extensionTerm: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Equity Injection</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={debtInputs.equityInjection}
                onChange={(e) => setDebtInputs({ ...debtInputs, equityInjection: Number(e.target.value) })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Asset Disposals</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={debtInputs.assetDisposals}
                onChange={(e) => setDebtInputs({ ...debtInputs, assetDisposals: Number(e.target.value) })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="flex items-end">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Outcomes
            </Button>
          </div>
        </div>
      </div>

      {/* Scenario Comparison */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Scenario Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Metric</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Liquidate</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Standstill</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Partial Sale</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Refinance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Secured Recovery</td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">$2.8M (45%)</td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">$4.5M (72%)</td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">$5.3M (85%)</td>
                <td className="px-4 py-3 text-center text-sm font-bold text-green-600">$5.9M (95%)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Unsecured Recovery</td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">$0 (0%)</td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">$560K (20%)</td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">$1.4M (50%)</td>
                <td className="px-4 py-3 text-center text-sm font-bold text-green-600">$2.8M (100%)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Time to Exit</td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">6 months</td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">18 months</td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">12 months</td>
                <td className="px-4 py-3 text-center text-sm font-bold text-green-600">3 months</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Jobs Preserved</td>
                <td className="px-4 py-3 text-center text-sm text-red-600">0</td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">8</td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">10</td>
                <td className="px-4 py-3 text-center text-sm font-bold text-green-600">12</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Business Continuity</td>
                <td className="px-4 py-3 text-center">
                  <ThumbsDown className="w-4 h-4 text-red-600 mx-auto" />
                </td>
                <td className="px-4 py-3 text-center">
                  <ThumbsUp className="w-4 h-4 text-orange-600 mx-auto" />
                </td>
                <td className="px-4 py-3 text-center">
                  <ThumbsUp className="w-4 h-4 text-blue-600 mx-auto" />
                </td>
                <td className="px-4 py-3 text-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Action */}
      <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-green-900 mb-2">Recommended Action</h3>
            <p className="text-sm text-green-800 mb-3">
              Based on current analysis, the <strong>Partial Asset Sale + Refinance</strong> scenario provides the best balance of:
            </p>
            <ul className="space-y-1 text-sm text-green-800">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>85% secured creditor recovery (vs 45% liquidation)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>50% unsecured creditor recovery</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Business preservation with 10 jobs retained</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>12-month exit timeline</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Asset Optimization Tab
function AssetOptimization({ matter }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Asset Disposition Strategy</h3>
        <p className="text-gray-600">Optimize asset portfolio for maximum recovery and debt reduction...</p>
      </div>
    </div>
  );
}

// Proposal Builder Tab
function ProposalBuilder({ matter }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Generate Restructuring Proposal</h3>
        <p className="text-gray-600">Auto-generate DOCA, refinance proposal, and creditor voting packs...</p>
      </div>
    </div>
  );
}

// Exit Planning Tab
function ExitPlanning({ matter }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Exit Conditions Checklist</h3>
        <div className="space-y-3">
          {[
            { condition: 'All secured debt repaid or restructured', status: 'pending', progress: 72 },
            { condition: 'Minimum liquidity threshold maintained ($500K)', status: 'met', progress: 100 },
            { condition: 'Creditor approval threshold (75%)', status: 'pending', progress: 68 },
            { condition: 'Trading cashflow positive for 3 months', status: 'not-met', progress: 33 },
            { condition: 'All statutory obligations filed', status: 'met', progress: 100 }
          ].map((item, idx) => (
            <div key={idx} className="p-4 border border-gray-300 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-900">{item.condition}</p>
                {item.status === 'met' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : item.status === 'pending' ? (
                  <Clock className="w-5 h-5 text-orange-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      item.status === 'met' ? 'bg-green-600' :
                      item.status === 'pending' ? 'bg-orange-600' :
                      'bg-red-600'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">{item.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <Info className="w-6 h-6 text-blue-600" />
          <div>
            <p className="font-semibold text-blue-900 mb-1">Exit Readiness: 75%</p>
            <p className="text-sm text-blue-800">2 conditions remaining before receivership can be exited</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Placeholder exports for other components
export function AssetRegister({ matter, role }: any) {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg border border-gray-300 p-8 text-center">
        <Package className="w-12 h-12 text-red-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Asset Register</h2>
        <p className="text-gray-600 mb-6">Complete asset register with control, valuation, and sale tracking</p>
      </div>
    </div>
  );
}

export function TrustAccounting({ matter, role }: any) {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg border border-gray-300 p-8 text-center">
        <DollarSign className="w-12 h-12 text-red-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Trust Accounting</h2>
        <p className="text-gray-600 mb-6">Trust receipts, payments, reconciliation, and batch approvals</p>
      </div>
    </div>
  );
}

export function StakeholdersClaims({ matter, role }: any) {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg border border-gray-300 p-8 text-center">
        <Users className="w-12 h-12 text-red-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Stakeholders & Claims</h2>
        <p className="text-gray-600 mb-6">Creditor register, claims adjudication, and portal submissions</p>
      </div>
    </div>
  );
}
