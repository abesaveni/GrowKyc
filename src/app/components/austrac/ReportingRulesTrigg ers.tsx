import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Settings,
  ToggleLeft,
  ToggleRight,
  Edit,
  Plus,
  Trash2,
  AlertTriangle,
  Shield,
  DollarSign,
  FileText,
  Scale,
  Users,
  Activity,
  Eye
} from 'lucide-react';

interface Rule {
  id: string;
  name: string;
  group: string;
  triggerCondition: string;
  action: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  autoCreate: boolean;
  managerReview: boolean;
  serviceHold: boolean;
  enabled: boolean;
  threshold?: number | string;
  icon: any;
}

export function ReportingRulesAndTriggers() {
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [editingRule, setEditingRule] = useState<Rule | null>(null);

  const ruleGroups = [
    { id: 'aml', label: 'AML Trigger Rules', icon: Shield, count: 4 },
    { id: 'transaction', label: 'Transaction/Funding Rules', icon: DollarSign, count: 3 },
    { id: 'document', label: 'Document Fraud Rules', icon: FileText, count: 2 },
    { id: 'legal', label: 'Legal Risk Triggers', icon: Scale, count: 2 },
    { id: 'ownership', label: 'Ownership Inconsistency', icon: Users, count: 2 },
    { id: 'monitoring', label: 'Monitoring Escalation', icon: Activity, count: 3 },
    { id: 'manual', label: 'Manual Referral Rules', icon: Eye, count: 1 }
  ];

  const [rules, setRules] = useState<Rule[]>([
    {
      id: 'R001',
      name: 'Confirmed Sanctions Hit',
      group: 'aml',
      triggerCondition: 'Match confidence >85%',
      action: 'Immediate escalation and hold',
      severity: 'critical',
      autoCreate: true,
      managerReview: true,
      serviceHold: true,
      enabled: true,
      threshold: 85,
      icon: Shield
    },
    {
      id: 'R002',
      name: 'Foreign PEP Detected',
      group: 'aml',
      triggerCondition: 'PEP status = Foreign or Domestic',
      action: 'Create case, enhanced DD',
      severity: 'high',
      autoCreate: true,
      managerReview: true,
      serviceHold: false,
      enabled: true,
      icon: Shield
    },
    {
      id: 'R003',
      name: 'Severe Adverse Media',
      group: 'aml',
      triggerCondition: 'Severity = High AND Financial crime theme',
      action: 'Escalate',
      severity: 'high',
      autoCreate: true,
      managerReview: true,
      serviceHold: false,
      enabled: true,
      icon: Shield
    },
    {
      id: 'R004',
      name: 'PEP + Adverse Media Combination',
      group: 'aml',
      triggerCondition: 'Both conditions met',
      action: 'Immediate escalation',
      severity: 'critical',
      autoCreate: true,
      managerReview: true,
      serviceHold: true,
      enabled: true,
      icon: Shield
    },
    {
      id: 'R005',
      name: 'Unexplained SOF Above Threshold',
      group: 'transaction',
      triggerCondition: 'Amount >$100,000 AND Cannot verify source',
      action: 'Create reportable matter review',
      severity: 'high',
      autoCreate: true,
      managerReview: true,
      serviceHold: false,
      enabled: true,
      threshold: 100000,
      icon: DollarSign
    },
    {
      id: 'R006',
      name: 'Large Cash Transaction',
      group: 'transaction',
      triggerCondition: 'Cash transaction >$10,000',
      action: 'TTR trigger + review',
      severity: 'medium',
      autoCreate: true,
      managerReview: false,
      serviceHold: false,
      enabled: true,
      threshold: 10000,
      icon: DollarSign
    },
    {
      id: 'R007',
      name: 'Structuring Pattern Detected',
      group: 'transaction',
      triggerCondition: 'Multiple transactions just below threshold',
      action: 'Case creation',
      severity: 'high',
      autoCreate: true,
      managerReview: true,
      serviceHold: false,
      enabled: true,
      icon: DollarSign
    },
    {
      id: 'R008',
      name: 'False Document Detected',
      group: 'document',
      triggerCondition: 'Confidence >75%',
      action: 'Escalate with hold',
      severity: 'critical',
      autoCreate: true,
      managerReview: true,
      serviceHold: true,
      enabled: true,
      threshold: 75,
      icon: FileText
    },
    {
      id: 'R009',
      name: 'Document Inconsistency',
      group: 'document',
      triggerCondition: 'Data mismatch across sources',
      action: 'Review required',
      severity: 'medium',
      autoCreate: true,
      managerReview: false,
      serviceHold: false,
      enabled: true,
      icon: FileText
    },
    {
      id: 'R010',
      name: 'Court Case - Financial Crime',
      group: 'legal',
      triggerCondition: 'Court flag = True AND Theme = Financial',
      action: 'High-risk review',
      severity: 'high',
      autoCreate: true,
      managerReview: true,
      serviceHold: false,
      enabled: true,
      icon: Scale
    },
    {
      id: 'R011',
      name: 'Insolvency Detected',
      group: 'legal',
      triggerCondition: 'Insolvency flag = True',
      action: 'Enhanced monitoring',
      severity: 'medium',
      autoCreate: true,
      managerReview: false,
      serviceHold: false,
      enabled: true,
      icon: Scale
    },
    {
      id: 'R012',
      name: 'UBO Cannot Be Established',
      group: 'ownership',
      triggerCondition: 'Ownership incomplete after 30 days',
      action: 'High-risk review',
      severity: 'high',
      autoCreate: true,
      managerReview: true,
      serviceHold: false,
      enabled: true,
      icon: Users
    },
    {
      id: 'R013',
      name: 'Complex Ownership Structure',
      group: 'ownership',
      triggerCondition: '>3 layers OR Offshore entities',
      action: 'Enhanced DD',
      severity: 'medium',
      autoCreate: true,
      managerReview: true,
      serviceHold: false,
      enabled: true,
      icon: Users
    },
    {
      id: 'R014',
      name: 'Repeated High-Risk Alerts',
      group: 'monitoring',
      triggerCondition: '3+ alerts within 30 days',
      action: 'Case creation',
      severity: 'medium',
      autoCreate: true,
      managerReview: false,
      serviceHold: false,
      enabled: true,
      threshold: '3 in 30 days',
      icon: Activity
    },
    {
      id: 'R015',
      name: 'Monitoring Alert - Critical Severity',
      group: 'monitoring',
      triggerCondition: 'Alert severity = Critical',
      action: 'Immediate review',
      severity: 'high',
      autoCreate: true,
      managerReview: true,
      serviceHold: false,
      enabled: true,
      icon: Activity
    },
    {
      id: 'R016',
      name: 'Sanctions List Update Match',
      group: 'monitoring',
      triggerCondition: 'New sanctions match on monitoring',
      action: 'Immediate escalation and hold',
      severity: 'critical',
      autoCreate: true,
      managerReview: true,
      serviceHold: true,
      enabled: true,
      icon: Activity
    },
    {
      id: 'R017',
      name: 'Manual Referral - All',
      group: 'manual',
      triggerCondition: 'Staff submits internal referral',
      action: 'Case creation',
      severity: 'medium',
      autoCreate: true,
      managerReview: true,
      serviceHold: false,
      enabled: true,
      icon: Eye
    }
  ]);

  const toggleRule = (ruleId: string) => {
    setRules(rules.map(rule =>
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const toggleSetting = (ruleId: string, setting: 'autoCreate' | 'managerReview' | 'serviceHold') => {
    setRules(rules.map(rule =>
      rule.id === ruleId ? { ...rule, [setting]: !rule[setting] } : rule
    ));
  };

  const getSeverityBadge = (severity: string) => {
    const configs = {
      critical: 'bg-red-100 text-red-700',
      high: 'bg-orange-100 text-orange-700',
      medium: 'bg-amber-100 text-amber-700',
      low: 'bg-green-100 text-green-700'
    };
    return <Badge className={`${configs[severity as keyof typeof configs]} text-xs px-2 py-1`}>{severity.toUpperCase()}</Badge>;
  };

  const filteredRules = filterGroup === 'all'
    ? rules
    : rules.filter(rule => rule.group === filterGroup);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-orange-900 rounded-lg p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
                <Settings className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Reporting Rules & Triggers</h1>
                <p className="text-white/90">Configure logic that creates AUSTRAC cases</p>
              </div>
            </div>
            <Button className="bg-white text-red-900 hover:bg-red-50">
              <Plus className="w-5 h-5 mr-2" />
              Create New Rule
            </Button>
          </div>
        </div>

        {/* Rule Groups */}
        <div className="grid md:grid-cols-7 gap-4">
          <Card
            onClick={() => setFilterGroup('all')}
            className={`cursor-pointer transition-all ${
              filterGroup === 'all'
                ? 'border-4 border-purple-500 bg-purple-50'
                : 'border-2 border-gray-300 hover:border-purple-300'
            }`}
          >
            <CardContent className="p-4 text-center">
              <p className="font-bold text-gray-900 mb-1">All Rules</p>
              <p className="text-3xl font-bold text-purple-900">{rules.length}</p>
            </CardContent>
          </Card>

          {ruleGroups.map((group) => {
            const Icon = group.icon;
            return (
              <Card
                key={group.id}
                onClick={() => setFilterGroup(group.id)}
                className={`cursor-pointer transition-all ${
                  filterGroup === group.id
                    ? 'border-4 border-blue-500 bg-blue-50'
                    : 'border-2 border-gray-300 hover:border-blue-300'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="font-semibold text-xs text-gray-900 mb-1">{group.label}</p>
                  <p className="text-2xl font-bold text-blue-900">{group.count}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Rules Table */}
        <Card className="border-2 border-gray-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
            <CardTitle className="text-2xl">
              {filterGroup === 'all'
                ? 'All Rules'
                : ruleGroups.find(g => g.id === filterGroup)?.label || 'Rules'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Rule Name</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Trigger Condition</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Action</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Severity</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Auto-Create</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Manager Review</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Service Hold</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRules.map((rule) => (
                    <tr
                      key={rule.id}
                      className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                        !rule.enabled ? 'opacity-50' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleRule(rule.id)}
                          className="focus:outline-none"
                        >
                          {rule.enabled ? (
                            <ToggleRight className="w-12 h-12 text-green-600" />
                          ) : (
                            <ToggleLeft className="w-12 h-12 text-gray-400" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {React.createElement(rule.icon, { className: 'w-5 h-5 text-blue-600' })}
                          <div>
                            <p className="font-semibold text-gray-900">{rule.name}</p>
                            <p className="text-xs text-gray-600">ID: {rule.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-800">{rule.triggerCondition}</p>
                        {rule.threshold && (
                          <p className="text-xs text-gray-600 mt-1">
                            Threshold: <span className="font-semibold">{rule.threshold}</span>
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-semibold text-gray-900">{rule.action}</p>
                      </td>
                      <td className="py-3 px-4">
                        {getSeverityBadge(rule.severity)}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleSetting(rule.id, 'autoCreate')}
                          disabled={!rule.enabled}
                        >
                          {rule.autoCreate ? (
                            <Badge className="bg-green-100 text-green-700 cursor-pointer">
                              ✓ Yes
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-700 cursor-pointer">
                              ✗ No
                            </Badge>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleSetting(rule.id, 'managerReview')}
                          disabled={!rule.enabled}
                        >
                          {rule.managerReview ? (
                            <Badge className="bg-green-100 text-green-700 cursor-pointer">
                              ✓ Yes
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-700 cursor-pointer">
                              ✗ No
                            </Badge>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleSetting(rule.id, 'serviceHold')}
                          disabled={!rule.enabled}
                        >
                          {rule.serviceHold ? (
                            <Badge className="bg-red-100 text-red-700 cursor-pointer">
                              ✓ Yes
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-700 cursor-pointer">
                              ✗ No
                            </Badge>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingRule(rule)}
                            disabled={!rule.enabled}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            disabled={!rule.enabled}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Info Banner */}
        <Card className="border-2 border-amber-300 bg-amber-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-amber-900 mb-2">Important: Rule Changes</h3>
                <p className="text-sm text-amber-800">
                  Any changes to rules will apply to new cases going forward. Existing cases will continue under the
                  rules that were active at the time of creation. All rule changes are logged in the audit trail.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
