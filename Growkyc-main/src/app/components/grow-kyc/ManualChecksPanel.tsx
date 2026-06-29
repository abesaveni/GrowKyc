import React, { useState } from 'react';
import { Button } from '../ui/button';
import { logComplianceActivity } from '../../../utils/activityLogger';
import {
  Play,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Shield,
  User,
  Building2,
  CreditCard,
  Home,
  FileText,
  Search,
  RefreshCw,
  Zap,
  Activity,
  DollarSign,
  Globe,
  Eye,
  Lock,
  Loader2
} from 'lucide-react';
import { botOrchestrator } from '../../services/BotOrchestrator';

interface CheckStatus {
  id: string;
  name: string;
  description: string;
  category: 'identity' | 'aml' | 'credit' | 'property' | 'affordability' | 'entity' | 'comprehensive';
  provider: string;
  status: 'not-run' | 'running' | 'passed' | 'failed' | 'alert';
  lastRun?: Date;
  duration?: number;
  icon: any;
  automated: boolean;
  cost?: number;
}

interface ManualChecksPanelProps {
  clientId: string;
  clientName: string;
}

export function ManualChecksPanel({ clientId, clientName }: ManualChecksPanelProps) {
  const [runningChecks, setRunningChecks] = useState<Set<string>>(new Set());
  const [checkResults, setCheckResults] = useState<Map<string, CheckStatus>>(new Map());

  const checks: CheckStatus[] = [
    // Identity Checks
    {
      id: 'identity-verification',
      name: 'Identity Verification',
      description: 'Verify identity using government ID, biometrics, and fraud detection',
      category: 'identity',
      provider: 'Equifax',
      status: 'not-run',
      icon: Shield,
      automated: true,
      cost: 2.50
    },
    {
      id: 'document-verification',
      name: 'Document Verification',
      description: 'Verify authenticity of uploaded identity documents',
      category: 'identity',
      provider: 'Onfido',
      status: 'not-run',
      icon: FileText,
      automated: true,
      cost: 3.00
    },
    {
      id: 'biometric-check',
      name: 'Biometric Verification',
      description: 'Facial recognition and liveness detection',
      category: 'identity',
      provider: 'Equifax',
      status: 'not-run',
      icon: User,
      automated: true,
      cost: 1.50
    },
    {
      id: 'device-intelligence',
      name: 'Device Intelligence',
      description: 'Analyze device fingerprint and risk indicators',
      category: 'identity',
      provider: 'Equifax',
      status: 'not-run',
      icon: Eye,
      automated: true,
      cost: 1.00
    },

    // AML Checks
    {
      id: 'aml-screening',
      name: 'AML Screening',
      description: 'Screen against PEP, sanctions, and watchlists',
      category: 'aml',
      provider: 'Equifax',
      status: 'not-run',
      icon: AlertTriangle,
      automated: true,
      cost: 5.00
    },
    {
      id: 'sanctions-check',
      name: 'Sanctions Check',
      description: 'Check against OFAC, UN, EU, DFAT sanctions lists',
      category: 'aml',
      provider: 'Dow Jones',
      status: 'not-run',
      icon: Lock,
      automated: true,
      cost: 3.50
    },
    {
      id: 'pep-screening',
      name: 'PEP Screening',
      description: 'Politically Exposed Persons screening',
      category: 'aml',
      provider: 'World-Check',
      status: 'not-run',
      icon: Globe,
      automated: true,
      cost: 4.00
    },
    {
      id: 'adverse-media',
      name: 'Adverse Media Screening',
      description: 'Screen for negative news and media coverage',
      category: 'aml',
      provider: 'Equifax',
      status: 'not-run',
      icon: Search,
      automated: true,
      cost: 2.00
    },

    // Credit Checks
    {
      id: 'credit-report',
      name: 'Credit Report',
      description: 'Comprehensive credit history and score',
      category: 'credit',
      provider: 'Equifax',
      status: 'not-run',
      icon: CreditCard,
      automated: true,
      cost: 15.00
    },
    {
      id: 'credit-score',
      name: 'Credit Score',
      description: 'VedaScore or Equifax Score',
      category: 'credit',
      provider: 'Equifax',
      status: 'not-run',
      icon: Activity,
      automated: true,
      cost: 5.00
    },
    {
      id: 'payment-history',
      name: 'Payment History',
      description: 'Repayment history and defaults check',
      category: 'credit',
      provider: 'Equifax',
      status: 'not-run',
      icon: FileText,
      automated: true,
      cost: 3.00
    },

    // Entity Checks
    {
      id: 'abn-lookup',
      name: 'ABN Lookup',
      description: 'Verify ABN/ACN and business details',
      category: 'entity',
      provider: 'ABR',
      status: 'not-run',
      icon: Building2,
      automated: true,
      cost: 0.00
    },
    {
      id: 'asic-search',
      name: 'ASIC Company Search',
      description: 'Company registration and officeholder details',
      category: 'entity',
      provider: 'ASIC',
      status: 'not-run',
      icon: Building2,
      automated: true,
      cost: 9.00
    },
    {
      id: 'beneficial-ownership',
      name: 'Beneficial Ownership',
      description: 'Ultimate beneficial owner identification',
      category: 'entity',
      provider: 'Equifax',
      status: 'not-run',
      icon: User,
      automated: true,
      cost: 12.00
    },

    // Property Checks
    {
      id: 'property-ownership',
      name: 'Property Ownership',
      description: 'Title search and ownership verification',
      category: 'property',
      provider: 'InfoTrack',
      status: 'not-run',
      icon: Home,
      automated: true,
      cost: 25.00
    },
    {
      id: 'property-valuation',
      name: 'Property Valuation',
      description: 'Automated property valuation (AVM)',
      category: 'property',
      provider: 'CoreLogic',
      status: 'not-run',
      icon: DollarSign,
      automated: true,
      cost: 15.00
    },

    // Affordability Checks
    {
      id: 'bank-statement-analysis',
      name: 'Bank Statement Analysis',
      description: 'Analyze income and expense patterns',
      category: 'affordability',
      provider: 'Equifax',
      status: 'not-run',
      icon: DollarSign,
      automated: true,
      cost: 8.00
    },
    {
      id: 'income-verification',
      name: 'Income Verification',
      description: 'Verify employment and income via payroll data',
      category: 'affordability',
      provider: 'Equifax',
      status: 'not-run',
      icon: FileText,
      automated: true,
      cost: 5.00
    }
  ];

  const runCheck = async (checkId: string) => {
    setRunningChecks(prev => new Set(prev).add(checkId));

    const check = checks.find(c => c.id === checkId);
    if (check) {
      const outcome = await botOrchestrator.runOne(checkId, {
        clientId,
        clientName,
        trigger: 'manual',
      });

      const mappedStatus = outcome.run.status === 'error'
        ? 'failed'
        : outcome.run.status;

      const updatedCheck: CheckStatus = {
        ...check,
        status: mappedStatus as CheckStatus['status'],
        lastRun: new Date(outcome.run.completedAt || new Date().toISOString()),
        duration: outcome.run.durationMs,
      };

      setCheckResults(prev => new Map(prev).set(checkId, updatedCheck));
      logComplianceActivity({
        type: 'review',
        action: `executed manual check "${check.name}" for ${clientName}`,
        iconName: 'UserCheck',
        color: 'text-blue-400'
      });
    }

    setRunningChecks(prev => {
      const newSet = new Set(prev);
      newSet.delete(checkId);
      return newSet;
    });
  };

  const runAllChecks = async () => {
    const checkIds = checks.map(check => check.id);
    setRunningChecks(new Set(checkIds));

    const outcomes = await botOrchestrator.runMany(checkIds, {
      clientId,
      clientName,
      trigger: 'manual',
    });

    const nextResults = new Map(checkResults);
    for (const outcome of outcomes) {
      const check = checks.find(item => item.id === outcome.run.botId);
      if (!check) continue;

      const mappedStatus = outcome.run.status === 'error'
        ? 'failed'
        : outcome.run.status;

      nextResults.set(check.id, {
        ...check,
        status: mappedStatus as CheckStatus['status'],
        lastRun: new Date(outcome.run.completedAt || new Date().toISOString()),
        duration: outcome.run.durationMs,
      });
    }

    setCheckResults(nextResults);
    logComplianceActivity({
      type: 'review',
      action: `executed comprehensive manual audit on ${clientName}`,
      iconName: 'UserCheck',
      color: 'text-blue-400'
    });
    setRunningChecks(new Set());
  };

  const runCategoryChecks = async (category: string) => {
    const categoryChecks = checks.filter(c => c.category === category);
    const checkIds = categoryChecks.map(check => check.id);
    setRunningChecks(prev => {
      const next = new Set(prev);
      checkIds.forEach(id => next.add(id));
      return next;
    });

    const outcomes = await botOrchestrator.runMany(checkIds, {
      clientId,
      clientName,
      trigger: 'manual',
    });

    const nextResults = new Map(checkResults);
    for (const outcome of outcomes) {
      const check = checks.find(item => item.id === outcome.run.botId);
      if (!check) continue;

      const mappedStatus = outcome.run.status === 'error'
        ? 'failed'
        : outcome.run.status;

      nextResults.set(check.id, {
        ...check,
        status: mappedStatus as CheckStatus['status'],
        lastRun: new Date(outcome.run.completedAt || new Date().toISOString()),
        duration: outcome.run.durationMs,
      });
    }

    setCheckResults(nextResults);
    logComplianceActivity({
      type: 'review',
      action: `executed manual category checks for "${category}" on ${clientName}`,
      iconName: 'UserCheck',
      color: 'text-blue-400'
    });
    setRunningChecks(prev => {
      const next = new Set(prev);
      checkIds.forEach(id => next.delete(id));
      return next;
    });
  };

  const getCheckStatus = (checkId: string): CheckStatus => {
    return checkResults.get(checkId) || checks.find(c => c.id === checkId)!;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'identity': return 'border-blue-500 bg-blue-500/10 dark:bg-blue-900/20';
      case 'aml': return 'border-red-500 bg-red-500/10 dark:bg-red-900/20';
      case 'credit': return 'border-purple-500 bg-purple-500/10 dark:bg-purple-900/20';
      case 'entity': return 'border-green-500 bg-green-500/10 dark:bg-green-900/20';
      case 'property': return 'border-orange-500 bg-orange-500/10 dark:bg-orange-900/20';
      case 'affordability': return 'border-cyan-500 bg-cyan-500/10 dark:bg-cyan-900/20';
      default: return 'border-gray-500 bg-[#0f172a] dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'alert': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'running': return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const categories = [
    { id: 'identity', label: 'Identity Verification', icon: Shield, count: checks.filter(c => c.category === 'identity').length },
    { id: 'aml', label: 'AML / Screening', icon: AlertTriangle, count: checks.filter(c => c.category === 'aml').length },
    { id: 'credit', label: 'Credit Checks', icon: CreditCard, count: checks.filter(c => c.category === 'credit').length },
    { id: 'entity', label: 'Entity Verification', icon: Building2, count: checks.filter(c => c.category === 'entity').length },
    { id: 'property', label: 'Property Checks', icon: Home, count: checks.filter(c => c.category === 'property').length },
    { id: 'affordability', label: 'Affordability', icon: DollarSign, count: checks.filter(c => c.category === 'affordability').length }
  ];

  const totalCost = checks.reduce((sum, check) => sum + (check.cost || 0), 0);
  const completedChecks = Array.from(checkResults.values()).filter(c => c.status === 'passed' || c.status === 'failed' || c.status === 'alert').length;
  const passedChecks = Array.from(checkResults.values()).filter(c => c.status === 'passed').length;
  const failedChecks = Array.from(checkResults.values()).filter(c => c.status === 'failed').length;
  const alertChecks = Array.from(checkResults.values()).filter(c => c.status === 'alert').length;

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="bg-gradient-to-r from-[#0E7C9E] to-[#13B5EA] rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Manual Verification Checks</h3>
            <p className="text-cyan-100">Run comprehensive verification checks on {clientName}</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => runAllChecks()}
              disabled={runningChecks.size > 0}
              className="bg-[#1e293b] text-[#0E7C9E] hover:bg-cyan-500/10"
            >
              <Zap className="w-5 h-5 mr-2" />
              Run All Checks ({checks.length})
            </Button>
            <Button
              variant="outline"
              onClick={() => setCheckResults(new Map())}
              className="bg-white/20 text-white border-white/40 hover:bg-white/30"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mt-6">
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="text-sm text-cyan-100 mb-1">Total Checks</div>
            <div className="text-3xl font-bold text-white">{checks.length}</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="text-sm text-cyan-100 mb-1">Completed</div>
            <div className="text-3xl font-bold text-white">{completedChecks}</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="text-sm text-cyan-100 mb-1">Passed</div>
            <div className="text-3xl font-bold text-green-300">{passedChecks}</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="text-sm text-cyan-100 mb-1">Alerts</div>
            <div className="text-3xl font-bold text-yellow-300">{alertChecks}</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="text-sm text-cyan-100 mb-1">Total Cost</div>
            <div className="text-3xl font-bold text-white">${totalCost.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Categories */}
      {categories.map(category => {
        const categoryChecks = checks.map(c => getCheckStatus(c.id)).filter(c => c.category === category.id);
        const categoryCompleted = categoryChecks.filter(c => c.status === 'passed' || c.status === 'failed' || c.status === 'alert').length;
        const categoryCost = categoryChecks.reduce((sum, c) => sum + (c.cost || 0), 0);

        return (
          <div key={category.id} className={`bg-[#1e293b] dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border-l-4 ${getCategoryColor(category.id)}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <category.icon className="w-6 h-6 text-[#13B5EA]" />
                  <div>
                    <h4 className="text-lg font-bold text-white dark:text-white">{category.label}</h4>
                    <p className="text-sm text-slate-300 dark:text-slate-400">
                      {categoryCompleted}/{category.count} checks completed • ${categoryCost.toFixed(2)} total
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => runCategoryChecks(category.id)}
                  disabled={runningChecks.size > 0}
                  size="sm"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Run All ({category.count})
                </Button>
              </div>

              <div className="space-y-3">
                {categoryChecks.map(check => {
                  const isRunning = runningChecks.has(check.id);
                  const currentStatus = isRunning ? 'running' : check.status;

                  return (
                    <div
                      key={check.id}
                      className="flex items-center justify-between p-4 bg-[#0f172a] dark:bg-gray-900 rounded-lg border border-white/10 dark:border-gray-700"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <check.icon className="w-5 h-5 text-slate-300 dark:text-slate-400" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-semibold text-white dark:text-white">{check.name}</h5>
                            {check.automated && (
                              <span className="px-2 py-0.5 bg-blue-500/15 text-blue-300 dark:bg-blue-900 dark:text-blue-300 text-xs rounded-full">
                                Automated
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-300 dark:text-slate-400">{check.description}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                            <span>Provider: {check.provider}</span>
                            <span>•</span>
                            <span>Cost: ${check.cost?.toFixed(2)}</span>
                            {check.lastRun && (
                              <>
                                <span>•</span>
                                <span>Last run: {check.lastRun.toLocaleString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {getStatusIcon(currentStatus)}
                        {currentStatus !== 'not-run' && currentStatus !== 'running' && (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            currentStatus === 'passed' ? 'bg-green-500/15 text-green-300 dark:bg-green-900 dark:text-green-300' :
                            currentStatus === 'failed' ? 'bg-red-500/15 text-red-300 dark:bg-red-900 dark:text-red-300' :
                            'bg-yellow-500/15 text-yellow-300 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}>
                            {currentStatus.toUpperCase()}
                          </span>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => runCheck(check.id)}
                          disabled={isRunning}
                        >
                          {isRunning ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Running...
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Run Check
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
