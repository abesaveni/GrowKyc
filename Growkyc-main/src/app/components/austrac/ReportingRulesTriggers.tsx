import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { toast } from 'sonner';
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
  Eye,
  RefreshCw
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
  icon: React.ComponentType<{ className?: string }>;
}

export type RuleBase = Omit<Rule, 'icon'>;


export function ReportingRulesAndTriggers({ onBack }: { onBack?: () => void }) {
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [rulesData, setRulesData] = useState<RuleBase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add/Edit rule modal state
  const emptyForm = {
    name: '',
    group: 'aml',
    triggerCondition: '',
    action: '',
    severity: 'medium' as Rule['severity'],
  };
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [ruleModalMode, setRuleModalMode] = useState<'add' | 'edit'>('add');
  const [ruleForm, setRuleForm] = useState(emptyForm);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  // Delete confirmation state
  const [ruleToDelete, setRuleToDelete] = useState<RuleBase | null>(null);

  const openAddRuleModal = () => {
    setRuleModalMode('add');
    setEditingRuleId(null);
    setRuleForm(emptyForm);
    setRuleModalOpen(true);
  };

  const openEditRuleModal = (rule: Rule) => {
    setRuleModalMode('edit');
    setEditingRuleId(rule.id);
    setRuleForm({
      name: rule.name,
      group: rule.group,
      triggerCondition: rule.triggerCondition,
      action: rule.action,
      severity: rule.severity,
    });
    setRuleModalOpen(true);
  };

  const handleSubmitRule = () => {
    if (!ruleForm.name.trim()) {
      toast.error('Rule name is required');
      return;
    }
    if (ruleModalMode === 'add') {
      const newRule: RuleBase = {
        id: `R${Math.floor(100 + Math.random() * 900)}`,
        name: ruleForm.name.trim(),
        group: ruleForm.group,
        triggerCondition: ruleForm.triggerCondition.trim(),
        action: ruleForm.action.trim(),
        severity: ruleForm.severity,
        autoCreate: true,
        managerReview: false,
        serviceHold: false,
        enabled: true,
      };
      setRulesData(prev => [...prev, newRule]);
      toast.success(`Rule "${newRule.name}" created successfully!`);
    } else if (editingRuleId) {
      setRulesData(prev => prev.map(r =>
        r.id === editingRuleId
          ? {
              ...r,
              name: ruleForm.name.trim(),
              group: ruleForm.group,
              triggerCondition: ruleForm.triggerCondition.trim(),
              action: ruleForm.action.trim(),
              severity: ruleForm.severity,
            }
          : r
      ));
      toast.success(`Rule "${ruleForm.name.trim()}" updated successfully!`);
    }
    setRuleModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!ruleToDelete) return;
    setRulesData(prev => prev.filter(r => r.id !== ruleToDelete.id));
    toast.success(`Rule "${ruleToDelete.name}" deleted successfully!`);
    setRuleToDelete(null);
  };

  const getGroupIcon = useCallback((
    group: RuleBase['group']
  ): React.ComponentType<{ className?: string }> => {
    switch (group) {
      case 'aml':
        return Shield;
      case 'transaction':
        return DollarSign;
      case 'document':
        return FileText;
      case 'legal':
        return Scale;
      case 'ownership':
        return Users;
      case 'monitoring':
        return Activity;
      default:
        return Eye;
    }
  }, []);

  // Performance-optimized useMemo to cleanly map RuleBase[] → Rule[] by injecting the icon
  const rules = useMemo<Rule[]>(() => {
    return rulesData.map((r: RuleBase): Rule => ({
      ...r,
      icon: getGroupIcon(r.group)
    }));
  }, [rulesData, getGroupIcon]);

  const ruleGroups = [
    { id: 'aml', label: 'AML Trigger Rules', icon: Shield, count: 4 },
    { id: 'transaction', label: 'Transaction/Funding Rules', icon: DollarSign, count: 3 },
    { id: 'document', label: 'Document Fraud Rules', icon: FileText, count: 2 },
    { id: 'legal', label: 'Legal Risk Triggers', icon: Scale, count: 2 },
    { id: 'ownership', label: 'Ownership Inconsistency', icon: Users, count: 2 },
    { id: 'monitoring', label: 'Monitoring Escalation', icon: Activity, count: 3 },
    { id: 'manual', label: 'Manual Referral Rules', icon: Eye, count: 1 }
  ];

  useEffect(() => {
    let active = true;
    const fetchRules = async () => {
      setIsLoading(true);

      const fallbackData: RuleBase[] = [
        { id: 'R001', name: 'Confirmed Sanctions Hit', group: 'aml', triggerCondition: 'Match confidence >85%', action: 'Immediate escalation and hold', severity: 'critical', autoCreate: true, managerReview: true, serviceHold: true, enabled: true, threshold: 85 },
        { id: 'R002', name: 'Foreign PEP Detected', group: 'aml', triggerCondition: 'PEP status = Foreign or Domestic', action: 'Create case, enhanced DD', severity: 'high', autoCreate: true, managerReview: true, serviceHold: false, enabled: true },
        { id: 'R003', name: 'Severe Adverse Media', group: 'aml', triggerCondition: 'Severity = High AND Financial crime theme', action: 'Escalate', severity: 'high', autoCreate: true, managerReview: true, serviceHold: false, enabled: true },
        { id: 'R004', name: 'PEP + Adverse Media Combination', group: 'aml', triggerCondition: 'Both conditions met', action: 'Immediate escalation', severity: 'critical', autoCreate: true, managerReview: true, serviceHold: true, enabled: true },
        { id: 'R005', name: 'Unexplained SOF Above Threshold', group: 'transaction', triggerCondition: 'Amount >$100,000 AND Cannot verify source', action: 'Create reportable matter review', severity: 'high', autoCreate: true, managerReview: true, serviceHold: false, enabled: true, threshold: 100000 },
        { id: 'R006', name: 'Large Cash Transaction', group: 'transaction', triggerCondition: 'Cash transaction >$10,000', action: 'TTR trigger + review', severity: 'medium', autoCreate: true, managerReview: false, serviceHold: false, enabled: true, threshold: 10000 },
        { id: 'R007', name: 'Structuring Pattern Detected', group: 'transaction', triggerCondition: 'Multiple transactions just below threshold', action: 'Case creation', severity: 'high', autoCreate: true, managerReview: true, serviceHold: false, enabled: true },
        { id: 'R008', name: 'False Document Detected', group: 'document', triggerCondition: 'Confidence >75%', action: 'Escalate with hold', severity: 'critical', autoCreate: true, managerReview: true, serviceHold: true, enabled: true, threshold: 75 },
        { id: 'R009', name: 'Document Inconsistency', group: 'document', triggerCondition: 'Data mismatch across sources', action: 'Review required', severity: 'medium', autoCreate: true, managerReview: false, serviceHold: false, enabled: true },
        { id: 'R010', name: 'Court Case - Financial Crime', group: 'legal', triggerCondition: 'Court flag = True AND Theme = Financial', action: 'High-risk review', severity: 'high', autoCreate: true, managerReview: true, serviceHold: false, enabled: true },
        { id: 'R011', name: 'Insolvency Detected', group: 'legal', triggerCondition: 'Insolvency flag = True', action: 'Enhanced monitoring', severity: 'medium', autoCreate: true, managerReview: false, serviceHold: false, enabled: true },
        { id: 'R012', name: 'UBO Cannot Be Established', group: 'ownership', triggerCondition: 'Ownership incomplete after 30 days', action: 'High-risk review', severity: 'high', autoCreate: true, managerReview: true, serviceHold: false, enabled: true },
        { id: 'R013', name: 'Complex Ownership Structure', group: 'ownership', triggerCondition: '>3 layers OR Offshore entities', action: 'Enhanced DD', severity: 'medium', autoCreate: true, managerReview: true, serviceHold: false, enabled: true },
        { id: 'R014', name: 'Repeated High-Risk Alerts', group: 'monitoring', triggerCondition: '3+ alerts within 30 days', action: 'Case creation', severity: 'medium', autoCreate: true, managerReview: false, serviceHold: false, enabled: true, threshold: '3 in 30 days' },
        { id: 'R015', name: 'Monitoring Alert - Critical Severity', group: 'monitoring', triggerCondition: 'Alert severity = Critical', action: 'Immediate review', severity: 'high', autoCreate: true, managerReview: true, serviceHold: false, enabled: true },
        { id: 'R016', name: 'Sanctions List Update Match', group: 'monitoring', triggerCondition: 'New sanctions match on monitoring', action: 'Immediate escalation and hold', severity: 'critical', autoCreate: true, managerReview: true, serviceHold: true, enabled: true },
        { id: 'R017', name: 'Manual Referral - All', group: 'manual', triggerCondition: 'Staff submits internal referral', action: 'Case creation', severity: 'medium', autoCreate: true, managerReview: true, serviceHold: false, enabled: true }
      ];

      try {
        const response = await fetch('/api/v1/reporting-rules');
        
        // Priority Fallback Logic
        if (!response.ok) {
          console.warn(`ReportingRulesAndTriggers API failed with status ${response.status}. Using high-res fallback rules.`);
          if (active) {
            setRulesData(fallbackData);
            setError(`HTTP error! status: ${response.status}`);
          }
          return;
        }

        const raw = await response.json();
        if (!Array.isArray(raw)) {
          throw new Error('Rules payload is not formatted as an array');
        }

        interface RawRule {
          id?: string;
          name?: string;
          group?: string;
          triggerCondition?: string;
          description?: string;
          action?: string;
          severity?: string;
          autoCreate?: boolean | number;
          managerReview?: boolean | number;
          serviceHold?: boolean | number;
          enabled?: boolean | number;
          threshold?: string | number;
        }

        // Safe runtime validation and transformation of raw values into RuleBase[] structure
        const validatedData: RuleBase[] = raw.map((item: RawRule): RuleBase => {
          const sev = String(item.severity || '').toLowerCase();
          const validSeverity: Rule['severity'] = 
            sev === 'low' || sev === 'medium' || sev === 'high' || sev === 'critical'
              ? (sev as Rule['severity'])
              : 'medium';

          return {
            id: String(item.id || ''),
            name: String(item.name || ''),
            group: String(item.group || ''),
            triggerCondition: String(item.triggerCondition || item.description || ''),
            action: String(item.action || ''),
            severity: validSeverity,
            autoCreate: Boolean(item.autoCreate),
            managerReview: Boolean(item.managerReview),
            serviceHold: Boolean(item.serviceHold),
            enabled: Boolean(item.enabled ?? true),
            threshold: item.threshold !== undefined ? item.threshold : undefined
          };
        });

        if (active) {
          setRulesData(validatedData);
          setError(null);
        }
      } catch (err) {
        console.warn('Failed to retrieve compliance rules from server API - Falling back to offline defaults:', err);
        if (active) {
          setError(err instanceof Error ? err.message : 'Fetch execution failed');
          setRulesData(fallbackData);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchRules();
    return () => { active = false; };
  }, []);

  const toggleRule = (ruleId: string) => {
    setRulesData(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const toggleSetting = (ruleId: string, setting: 'autoCreate' | 'managerReview' | 'serviceHold') => {
    setRulesData(prev => prev.map(rule =>
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="w-12 h-12 text-red-700 animate-spin mx-auto" />
          <p className="text-lg font-bold text-gray-700">Syncing Compliance Rules & Triggers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Offline Fallback Banner if API error occurred */}
        {error && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-amber-800 flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm">Offline Mode Active</p>
                <p className="text-xs text-amber-700">Failed to connect to the active rules API ({error}). Serving local system security triggers instead.</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="border-amber-400 hover:bg-amber-100 text-amber-900" onClick={() => window.location.reload()}>
              Retry Sync
            </Button>
          </div>
        )}
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-6 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20 flex-shrink-0">
                <Settings className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold">Reporting Rules & Triggers</h1>
                <p className="text-sm md:text-base text-white/90">Configure logic that creates AUSTRAC cases</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {onBack && (
                <Button onClick={onBack} className="bg-white text-slate-800 hover:bg-slate-100 flex-1 sm:flex-initial justify-center">
                  Return to Control Centre
                </Button>
              )}
              <Button
                onClick={openAddRuleModal}
                className="bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 flex-1 sm:flex-initial justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Rule
              </Button>
            </div>
          </div>
        </div>

        {/* Rule Groups */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
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
                            onClick={() => openEditRuleModal(rule)}
                            disabled={!rule.enabled}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => setRuleToDelete(rule)}
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
        <Card className="border border-gray-200 bg-white">
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

      {/* Add / Edit Rule Modal */}
      <Dialog open={ruleModalOpen} onOpenChange={setRuleModalOpen}>
        <DialogContent className="sm:max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle>{ruleModalMode === 'add' ? 'Create New Rule' : 'Edit Rule'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="rule-name">Rule Name</Label>
              <Input
                id="rule-name"
                value={ruleForm.name}
                onChange={(e) => setRuleForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Confirmed Sanctions Hit"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rule-group">Group</Label>
              <Select
                value={ruleForm.group}
                onValueChange={(value) => setRuleForm(f => ({ ...f, group: value }))}
              >
                <SelectTrigger id="rule-group">
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aml">AML Trigger Rules</SelectItem>
                  <SelectItem value="transaction">Transaction/Funding Rules</SelectItem>
                  <SelectItem value="document">Document Fraud Rules</SelectItem>
                  <SelectItem value="legal">Legal Risk Triggers</SelectItem>
                  <SelectItem value="ownership">Ownership Inconsistency</SelectItem>
                  <SelectItem value="monitoring">Monitoring Escalation</SelectItem>
                  <SelectItem value="manual">Manual Referral Rules</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rule-trigger">Trigger Condition</Label>
              <Input
                id="rule-trigger"
                value={ruleForm.triggerCondition}
                onChange={(e) => setRuleForm(f => ({ ...f, triggerCondition: e.target.value }))}
                placeholder="e.g. Match confidence >85%"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rule-action">Action</Label>
              <Input
                id="rule-action"
                value={ruleForm.action}
                onChange={(e) => setRuleForm(f => ({ ...f, action: e.target.value }))}
                placeholder="e.g. Immediate escalation and hold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rule-severity">Severity</Label>
              <Select
                value={ruleForm.severity}
                onValueChange={(value) => setRuleForm(f => ({ ...f, severity: value as Rule['severity'] }))}
              >
                <SelectTrigger id="rule-severity">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRuleModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitRule} className="bg-blue-600 hover:bg-blue-700 text-white">
              {ruleModalMode === 'add' ? 'Create Rule' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Rule Confirmation */}
      <ConfirmDialog
        isOpen={ruleToDelete !== null}
        onClose={() => setRuleToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Rule"
        description={ruleToDelete ? `Are you sure you want to delete the rule "${ruleToDelete.name}"? This action cannot be undone.` : ''}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
