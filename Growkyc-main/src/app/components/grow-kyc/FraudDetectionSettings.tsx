import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Shield,
  AlertTriangle,
  Bell,
  Settings,
  Save,
  Plus,
  Trash2,
  Eye,
  Lock,
  Activity,
  Users,
  CreditCard,
  MapPin,
  Smartphone,
  FileText,
  DollarSign,
  RefreshCw,
  CheckCircle,
  XCircle,
  Zap,
  Brain,
  TrendingUp,
  Globe
} from 'lucide-react';

interface FraudRule {
  id: string;
  name: string;
  category: 'identity' | 'behavior' | 'transaction' | 'device' | 'document' | 'network';
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  autoCreateCase: boolean;
  threshold?: number;
  conditions: string[];
  actions: string[];
}

export function FraudDetectionSettings() {
  const [activeTab, setActiveTab] = useState<'rules' | 'ai-models' | 'case-triggers' | 'notifications'>('rules');
  const [fraudRules, setFraudRules] = useState<FraudRule[]>(() => {
    const saved = localStorage.getItem('grow_fraud_rules');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(rule => ({
            ...rule,
            conditions: Array.isArray(rule.conditions) ? rule.conditions : [],
            actions: Array.isArray(rule.actions) ? rule.actions : []
          }));
        }
      } catch (e) {}
    }
    return [
    // Identity Fraud
    {
      id: 'identity-mismatch',
      name: 'Identity Document Mismatch',
      category: 'identity',
      severity: 'critical',
      enabled: true,
      autoCreateCase: true,
      conditions: [
        'Name on document does not match application',
        'Date of birth discrepancy > 1 day',
        'Address mismatch across documents'
      ],
      actions: ['Create Case', 'Flag for Manual Review', 'Block Transaction', 'Send Alert']
    },
    {
      id: 'biometric-fail',
      name: 'Biometric Verification Failure',
      category: 'identity',
      severity: 'critical',
      enabled: true,
      autoCreateCase: true,
      conditions: [
        'Facial recognition confidence < 85%',
        'Liveness detection failed',
        'Multiple biometric attempts (>3)'
      ],
      actions: ['Create Case', 'Flag for Manual Review', 'Require Re-verification']
    },
    {
      id: 'synthetic-identity',
      name: 'Synthetic Identity Detection',
      category: 'identity',
      severity: 'critical',
      enabled: true,
      autoCreateCase: true,
      conditions: [
        'No credit history but recent address',
        'Phone number associated with multiple identities',
        'Social media footprint < 6 months'
      ],
      actions: ['Create Case', 'Flag for Manual Review', 'Enhanced Due Diligence']
    },
    {
      id: 'stolen-identity',
      name: 'Stolen Identity Indicators',
      category: 'identity',
      severity: 'critical',
      enabled: true,
      autoCreateCase: true,
      conditions: [
        'Document reported as stolen/lost',
        'Email/phone on fraud database',
        'Identity fraud alerts from credit bureau'
      ],
      actions: ['Create Case', 'Block Application', 'Report to Authorities', 'Send Alert']
    },

    // Behavioral Fraud
    {
      id: 'velocity-check',
      name: 'Application Velocity Check',
      category: 'behavior',
      severity: 'high',
      enabled: true,
      autoCreateCase: true,
      threshold: 3,
      conditions: [
        'Multiple applications within 24 hours',
        'Same device used for >3 applications',
        'Same IP address for >5 applications'
      ],
      actions: ['Create Case', 'Delay Processing', 'Enhanced Verification']
    },
    {
      id: 'unusual-patterns',
      name: 'Unusual Behavior Patterns',
      category: 'behavior',
      severity: 'medium',
      enabled: true,
      autoCreateCase: false,
      conditions: [
        'Application completed in < 2 minutes',
        'Copy-paste detected in multiple fields',
        'Non-business hours submission (1am-5am)'
      ],
      actions: ['Flag for Review', 'Increase Risk Score']
    },

    // Transaction Fraud
    {
      id: 'transaction-anomaly',
      name: 'Transaction Anomaly Detection',
      category: 'transaction',
      severity: 'high',
      enabled: true,
      autoCreateCase: true,
      threshold: 10000,
      conditions: [
        'Transaction amount > $10,000 AUD',
        'Transaction to high-risk jurisdiction',
        'Rapid succession of transactions (>5 in 1 hour)'
      ],
      actions: ['Create Case', 'Hold Transaction', 'Request Additional Verification']
    },
    {
      id: 'structuring-detection',
      name: 'Transaction Structuring',
      category: 'transaction',
      severity: 'critical',
      enabled: true,
      autoCreateCase: true,
      threshold: 9999,
      conditions: [
        'Multiple transactions just below reporting threshold',
        'Transactions split across multiple accounts',
        'Pattern of transactions designed to avoid detection'
      ],
      actions: ['Create Case', 'Report to AUSTRAC', 'Enhanced Monitoring', 'Block Account']
    },

    // Device Fraud
    {
      id: 'device-fingerprint',
      name: 'Suspicious Device Detection',
      category: 'device',
      severity: 'medium',
      enabled: true,
      autoCreateCase: false,
      conditions: [
        'VPN or proxy detected',
        'Device associated with fraud',
        'Emulator or virtual machine detected',
        'Device location mismatch with claimed address'
      ],
      actions: ['Flag for Review', 'Additional Device Verification', 'Increase Risk Score']
    },
    {
      id: 'bot-detection',
      name: 'Bot/Automation Detection',
      category: 'device',
      severity: 'high',
      enabled: true,
      autoCreateCase: true,
      conditions: [
        'Automated form filling detected',
        'Mouse movement patterns indicate bot',
        'No JavaScript execution',
        'Suspicious user agent'
      ],
      actions: ['Create Case', 'Block Application', 'CAPTCHA Challenge']
    },

    // Document Fraud
    {
      id: 'document-tampering',
      name: 'Document Tampering Detection',
      category: 'document',
      severity: 'critical',
      enabled: true,
      autoCreateCase: true,
      conditions: [
        'Image metadata manipulation detected',
        'Font inconsistencies',
        'Visible editing artifacts',
        'Document template mismatch'
      ],
      actions: ['Create Case', 'Flag for Manual Review', 'Request Original Documents', 'Block Application']
    },
    {
      id: 'document-quality',
      name: 'Low Quality Document Submission',
      category: 'document',
      severity: 'medium',
      enabled: true,
      autoCreateCase: false,
      conditions: [
        'Image resolution too low',
        'Document corners not visible',
        'Excessive glare or blur',
        'Screenshot detected instead of scan'
      ],
      actions: ['Request Re-upload', 'Flag for Review']
    },

    // Network Fraud
    {
      id: 'collusion-detection',
      name: 'Collusion Ring Detection',
      category: 'network',
      severity: 'critical',
      enabled: true,
      autoCreateCase: true,
      conditions: [
        'Shared contact details across multiple accounts',
        'Linked bank accounts',
        'Similar IP addresses or devices',
        'Known fraud network member'
      ],
      actions: ['Create Case', 'Flag All Related Accounts', 'Enhanced Due Diligence', 'Report to Authorities']
    },
    {
      id: 'mule-detection',
      name: 'Money Mule Detection',
      category: 'network',
      severity: 'high',
      enabled: true,
      autoCreateCase: true,
      conditions: [
        'Rapid in/out transaction patterns',
        'Receiving funds from multiple unknown sources',
        'Immediate withdrawal after deposit',
        'Account holder claims ignorance of transactions'
      ],
    }
  ];
});

  const [aiModels, setAiModels] = useState(() => {
    const saved = localStorage.getItem('grow_fraud_ai_models');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'ml-risk-scoring',
        name: 'ML Risk Scoring Engine',
        type: 'Machine Learning',
        status: 'active',
        accuracy: 94.2,
        lastTrained: '2024-03-15',
        description: 'Random Forest model trained on 500K+ applications to predict fraud risk'
      },
      {
        id: 'anomaly-detection',
        name: 'Behavioral Anomaly Detection',
        type: 'Unsupervised Learning',
        status: 'active',
        accuracy: 89.7,
        lastTrained: '2024-03-10',
        description: 'Isolation Forest algorithm to detect unusual patterns in user behavior'
      },
      {
        id: 'document-analysis',
        name: 'Document Authenticity AI',
        type: 'Deep Learning',
        status: 'active',
        accuracy: 96.8,
        lastTrained: '2024-03-18',
        description: 'CNN-based model for detecting forged or manipulated documents'
      },
      {
        id: 'network-graph',
        name: 'Network Graph Analysis',
        type: 'Graph Neural Network',
        status: 'active',
        accuracy: 91.5,
        lastTrained: '2024-03-12',
        description: 'GNN model to identify fraud rings and connected entities'
      }
    ];
  });

  const [caseTriggers, setCaseTriggers] = useState(() => {
    const saved = localStorage.getItem('grow_fraud_case_triggers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'trigger-1',
        name: 'High-Risk Application',
        enabled: true,
        conditions: 'Risk Score >= 75 OR 2+ Critical Alerts',
        priority: 'High',
        assignTo: 'Fraud Investigation Team',
        sla: '4 hours'
      },
      {
        id: 'trigger-2',
        name: 'Identity Verification Failure',
        enabled: true,
        conditions: 'Biometric Fail OR Document Tampering Detected',
        priority: 'Critical',
        assignTo: 'Senior Fraud Analyst',
        sla: '1 hour'
      },
      {
        id: 'trigger-3',
        name: 'Transaction Monitoring Alert',
        enabled: true,
        conditions: 'Structuring Detected OR Transaction > $50K',
        priority: 'High',
        assignTo: 'AML Compliance Team',
        sla: '2 hours'
      },
      {
        id: 'trigger-4',
        name: 'Network Fraud Indicators',
        enabled: true,
        conditions: 'Linked to Known Fraud Ring OR Mule Account Pattern',
        priority: 'Critical',
        assignTo: 'Fraud Investigation Team',
        sla: '1 hour'
      },
      {
        id: 'trigger-5',
        name: 'AI Model High Confidence',
        enabled: true,
        conditions: 'ML Fraud Probability > 90%',
        priority: 'High',
        assignTo: 'Fraud Investigation Team',
        sla: '4 hours'
      }
    ];
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const saveAllSettings = (
    currentRules = fraudRules,
    currentModels = aiModels,
    currentTriggers = caseTriggers,
    currentNotifications = notificationSettings
  ) => {
    localStorage.setItem('grow_fraud_rules', JSON.stringify(currentRules));
    localStorage.setItem('grow_fraud_ai_models', JSON.stringify(currentModels));
    localStorage.setItem('grow_fraud_case_triggers', JSON.stringify(currentTriggers));
    localStorage.setItem('grow_fraud_notification_settings', JSON.stringify(currentNotifications));
    showToast('Fraud detection and risk parameters saved successfully!', 'success');
  };

  const toggleRule = (ruleId: string) => {
    const updated = fraudRules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    );
    setFraudRules(updated);
    saveAllSettings(updated, aiModels, caseTriggers, notificationSettings);
  };

  const toggleAutoCase = (ruleId: string) => {
    const updated = fraudRules.map(rule => 
      rule.id === ruleId ? { ...rule, autoCreateCase: !rule.autoCreateCase } : rule
    );
    setFraudRules(updated);
    saveAllSettings(updated, aiModels, caseTriggers, notificationSettings);
  };

  const toggleCaseTrigger = (triggerId: string) => {
    const updated = caseTriggers.map(trigger => 
      trigger.id === triggerId ? { ...trigger, enabled: !trigger.enabled } : trigger
    );
    setCaseTriggers(updated);
    saveAllSettings(fraudRules, aiModels, updated, notificationSettings);
  };

  const [notificationSettings, setNotificationSettings] = useState(() => {
    const saved = localStorage.getItem('grow_fraud_notification_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'email-critical', label: 'Email alerts for critical fraud detections', enabled: true },
      { id: 'sms-case', label: 'SMS alerts for case creation', enabled: true },
      { id: 'slack-priority', label: 'Slack notifications for high-priority cases', enabled: false },
      { id: 'daily-summary', label: 'Daily fraud summary reports', enabled: true },
      { id: 'weekly-ai', label: 'Weekly AI model performance reports', enabled: true },
      { id: 'realtime-dashboard', label: 'Real-time dashboard updates', enabled: true }
    ];
  });

  const toggleNotification = (notificationId: string) => {
    const updated = notificationSettings.map(notification => 
      notification.id === notificationId ? { ...notification, enabled: !notification.enabled } : notification
    );
    setNotificationSettings(updated);
    saveAllSettings(fraudRules, aiModels, caseTriggers, updated);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'identity': return Shield;
      case 'behavior': return Activity;
      case 'transaction': return DollarSign;
      case 'device': return Smartphone;
      case 'document': return FileText;
      case 'network': return Users;
      default: return AlertTriangle;
    }
  };

  const categories = [
    { id: 'identity', label: 'Identity Fraud', count: fraudRules.filter(r => r.category === 'identity').length },
    { id: 'behavior', label: 'Behavioral', count: fraudRules.filter(r => r.category === 'behavior').length },
    { id: 'transaction', label: 'Transaction', count: fraudRules.filter(r => r.category === 'transaction').length },
    { id: 'device', label: 'Device/IP', count: fraudRules.filter(r => r.category === 'device').length },
    { id: 'document', label: 'Document', count: fraudRules.filter(r => r.category === 'document').length },
    { id: 'network', label: 'Network', count: fraudRules.filter(r => r.category === 'network').length }
  ];

  const enabledRules = fraudRules.filter(r => r.enabled).length;
  const autoCaseRules = fraudRules.filter(r => r.autoCreateCase).length;
  const criticalRules = fraudRules.filter(r => r.severity === 'critical' && r.enabled).length;

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl border text-white ${
            toast.type === 'success' ? 'bg-green-600 border-green-500' :
            toast.type === 'error' ? 'bg-red-600 border-red-500' :
            'bg-[#0E7C9E] border-cyan-500'
          }`}>
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span className="font-semibold text-sm">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8" />
              <h2 className="text-3xl font-bold">Fraud Detection & Prevention</h2>
            </div>
            <p className="text-red-100">Advanced fraud detection rules, AI models, and automated case creation</p>
          </div>
          <Button onClick={() => saveAllSettings()} className="bg-white text-red-600 hover:bg-red-50 font-bold shadow-md">
            <Save className="w-5 h-5 mr-2" />
            Save All Settings
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="text-sm text-red-100 mb-1">Total Rules</div>
            <div className="text-3xl font-bold">{fraudRules.length}</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="text-sm text-red-100 mb-1">Enabled</div>
            <div className="text-3xl font-bold">{enabledRules}</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="text-sm text-red-100 mb-1">Auto-Create Cases</div>
            <div className="text-3xl font-bold">{autoCaseRules}</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="text-sm text-red-100 mb-1">Critical Rules</div>
            <div className="text-3xl font-bold">{criticalRules}</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'rules', label: 'Fraud Rules', icon: Shield },
            { id: 'ai-models', label: 'AI Models', icon: Brain },
            { id: 'case-triggers', label: 'Case Creation Triggers', icon: Zap },
            { id: 'notifications', label: 'Notifications', icon: Bell }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white border-b-2 border-red-700'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Fraud Rules Tab */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              {/* Category Filter */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter by Category:</span>
                {categories.map(cat => {
                  const Icon = getCategoryIcon(cat.id);
                  return (
                    <button
                      key={cat.id}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-semibold">{cat.label}</span>
                      <span className="text-xs bg-gray-300 dark:bg-gray-600 px-2 py-0.5 rounded-full">{cat.count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Rules List */}
              <div className="space-y-4">
                {fraudRules.map(rule => {
                  const Icon = getCategoryIcon(rule.category);
                  return (
                    <div
                      key={rule.id}
                      className={`border-2 rounded-lg p-5 ${
                        rule.enabled ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900 opacity-60'
                      } ${getSeverityColor(rule.severity)} border-l-4`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-bold text-gray-900 dark:text-white">{rule.name}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getSeverityColor(rule.severity)}`}>
                                {rule.severity}
                              </span>
                              <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-semibold uppercase">
                                {rule.category}
                              </span>
                            </div>

                            {/* Conditions */}
                            <div className="mb-3">
                              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Trigger Conditions:</div>
                              <ul className="space-y-1">
                                {(rule.conditions || []).map((condition, i) => (
                                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                    {condition}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Actions */}
                            <div>
                              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Actions:</div>
                              <div className="flex flex-wrap gap-2">
                                {(rule.actions || []).map((action, i) => (
                                  <span
                                    key={i}
                                    className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs font-semibold"
                                  >
                                    {action}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 ml-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={rule.enabled}
                              onChange={() => toggleRule(rule.id)}
                              className="w-5 h-5 text-red-600 rounded"
                            />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              {rule.enabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={rule.autoCreateCase}
                              onChange={() => toggleAutoCase(rule.id)}
                              disabled={!rule.enabled}
                              className="w-5 h-5 text-orange-600 rounded"
                            />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Auto Case</span>
                          </label>

                          <Button size="sm" variant="outline">
                            <Settings className="w-4 h-4 mr-2" />
                            Configure
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Custom Rule
              </Button>
            </div>
          )}

          {/* AI Models Tab */}
          {activeTab === 'ai-models' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {aiModels.map(model => (
                  <div key={model.id} className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-lg p-6 border border-purple-200 dark:border-purple-700">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Brain className="w-8 h-8 text-purple-600" />
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">{model.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{model.type}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        model.status === 'active' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        {model.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{model.description}</p>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Accuracy</span>
                          <span className="font-bold text-gray-900 dark:text-white">{model.accuracy}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                            style={{ width: `${model.accuracy}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Last Trained:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{model.lastTrained}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="flex-1">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retrain
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Case Creation Triggers Tab */}
          {activeTab === 'case-triggers' && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Automated Case Creation Rules</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Define conditions that automatically create fraud investigation cases. Cases are assigned based on priority and team availability.
                    </p>
                  </div>
                </div>
              </div>

              {caseTriggers.map(trigger => (
                <div
                  key={trigger.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-orange-500"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">{trigger.name}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          trigger.priority === 'Critical'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                        }`}>
                          {trigger.priority.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Conditions</div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">{trigger.conditions}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Assign To</div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">{trigger.assignTo}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">SLA</div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">{trigger.sla}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={trigger.enabled}
                          onChange={() => toggleCaseTrigger(trigger.id)}
                          className="w-5 h-5 text-orange-600 rounded"
                        />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Enabled</span>
                      </label>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Case Trigger
              </Button>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Notification Settings</h4>
                <div className="space-y-4">
                  {notificationSettings.map((notification, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                      <input
                        type="checkbox"
                        checked={notification.enabled}
                        onChange={() => toggleNotification(notification.id)}
                        className="w-5 h-5 text-red-600 rounded"
                      />
                      <span className="text-gray-900 dark:text-white">{notification.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}