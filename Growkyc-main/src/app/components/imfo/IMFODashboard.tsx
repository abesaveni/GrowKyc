import React from 'react';
import { Button } from '../ui/button';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Briefcase,
  Target,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  FileText
} from 'lucide-react';

interface IMFODashboardProps {
  onNavigate: (page: string) => void;
}

export function IMFODashboard({ onNavigate }: IMFODashboardProps) {
  // Mock data
  const funds = [
    {
      name: 'Growth Fund I',
      aum: 125000000,
      investors: 47,
      vintage: 2021,
      irr: 18.5,
      moic: 1.42,
      status: 'Active',
      performance: 'Outperforming'
    },
    {
      name: 'Opportunity Fund II',
      aum: 89000000,
      investors: 32,
      vintage: 2022,
      irr: 15.2,
      moic: 1.28,
      status: 'Active',
      performance: 'On Track'
    },
    {
      name: 'Value Fund',
      aum: 67000000,
      investors: 28,
      vintage: 2023,
      irr: 12.8,
      moic: 1.15,
      status: 'Fundraising',
      performance: 'On Track'
    }
  ];

  const portfolioCompanies = [
    { name: 'TechCorp Solutions', sector: 'Technology', investment: 15000000, ownership: 35, status: 'Performing' },
    { name: 'HealthCare Plus', sector: 'Healthcare', investment: 12000000, ownership: 28, status: 'Performing' },
    { name: 'RetailX', sector: 'Retail', investment: 8500000, ownership: 42, status: 'Watch List' },
    { name: 'FinServe Co', sector: 'Financial Services', investment: 10000000, ownership: 30, status: 'Performing' },
    { name: 'ManufacturePro', sector: 'Manufacturing', investment: 7200000, ownership: 38, status: 'Underperforming' }
  ];

  const deals = [
    { name: 'AI Analytics Startup', sector: 'Technology', stage: 'Due Diligence', amount: 18000000, probability: 75 },
    { name: 'MedTech Innovation', sector: 'Healthcare', stage: 'Term Sheet', amount: 14000000, probability: 60 },
    { name: 'E-commerce Platform', sector: 'Retail', stage: 'Initial Review', amount: 9500000, probability: 40 },
    { name: 'CleanEnergy Solutions', sector: 'Energy', stage: 'LOI Signed', amount: 22000000, probability: 85 }
  ];

  const totalAUM = funds.reduce((sum, fund) => sum + fund.aum, 0);
  const totalInvestors = funds.reduce((sum, fund) => sum + fund.investors, 0);
  const avgIRR = funds.reduce((sum, fund) => sum + fund.irr, 0) / funds.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">IMFO Platform Dashboard</h1>
        <p className="text-gray-600 mt-1">Investment Management & Fund Operations Overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total AUM</p>
            <DollarSign className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${(totalAUM / 1000000).toFixed(0)}M
          </p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <p className="text-sm text-green-600">+12.5% YTD</p>
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Investors</p>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalInvestors}</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <p className="text-sm text-green-600">+8 this quarter</p>
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Avg IRR</p>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{avgIRR.toFixed(1)}%</p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4 text-green-600" />
            <p className="text-sm text-green-600">Above benchmark</p>
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Portfolio Companies</p>
            <Briefcase className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{portfolioCompanies.length}</p>
          <div className="flex items-center gap-1 mt-2">
            <Activity className="w-4 h-4 text-gray-600" />
            <p className="text-sm text-gray-600">Across {funds.length} funds</p>
          </div>
        </div>
      </div>

      {/* Funds Overview */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Fund Performance</h2>
          <Button variant="outline" size="sm" onClick={() => onNavigate('fund-performance')}>
            View All Funds
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Fund Name</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">AUM</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Investors</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Vintage</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">IRR</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">MOIC</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Performance</th>
              </tr>
            </thead>
            <tbody>
              {funds.map((fund, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-gray-900">{fund.name}</p>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-900">
                    ${(fund.aum / 1000000).toFixed(0)}M
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900">{fund.investors}</td>
                  <td className="py-3 px-4 text-right text-gray-900">{fund.vintage}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="flex items-center justify-end gap-1 text-green-600 font-semibold">
                      <TrendingUp className="w-4 h-4" />
                      {fund.irr}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-900">
                    {fund.moic}x
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      fund.status === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {fund.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      fund.performance === 'Outperforming' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {fund.performance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Portfolio Companies */}
        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Portfolio Companies</h2>
            <Button variant="outline" size="sm" onClick={() => onNavigate('portfolio-management')}>
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {portfolioCompanies.map((company, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{company.name}</p>
                  <p className="text-xs text-gray-600">{company.sector}</p>
                </div>
                <div className="text-right mr-4">
                  <p className="text-sm font-semibold text-gray-900">
                    ${(company.investment / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-gray-600">{company.ownership}% ownership</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  company.status === 'Performing' 
                    ? 'bg-green-100 text-green-700' 
                    : company.status === 'Watch List'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {company.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Deal Pipeline */}
        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Deal Pipeline</h2>
            <Button variant="outline" size="sm" onClick={() => onNavigate('deal-pipeline')}>
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {deals.map((deal, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{deal.name}</p>
                    <p className="text-xs text-gray-600">{deal.sector}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    deal.stage === 'LOI Signed' 
                      ? 'bg-green-100 text-green-700' 
                      : deal.stage === 'Due Diligence' || deal.stage === 'Term Sheet'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {deal.stage}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">
                    ${(deal.amount / 1000000).toFixed(1)}M
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${deal.probability}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{deal.probability}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => onNavigate('portfolio-management')}>
          <Briefcase className="w-4 h-4 mr-2" />
          Manage Portfolio
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => onNavigate('fund-performance')}>
          <TrendingUp className="w-4 h-4 mr-2" />
          Fund Performance
        </Button>
        <Button className="bg-green-600 hover:bg-green-700" onClick={() => onNavigate('investor-relations')}>
          <Users className="w-4 h-4 mr-2" />
          Investor Relations
        </Button>
        <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => onNavigate('deal-pipeline')}>
          <Target className="w-4 h-4 mr-2" />
          Deal Pipeline
        </Button>
        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => onNavigate('analytics')}>
          <BarChart3 className="w-4 h-4 mr-2" />
          Analytics
        </Button>
        <Button className="bg-slate-700 hover:bg-slate-800" onClick={() => onNavigate('documents')}>
          <FileText className="w-4 h-4 mr-2" />
          Documents
        </Button>
      </div>
    </div>
  );
}
