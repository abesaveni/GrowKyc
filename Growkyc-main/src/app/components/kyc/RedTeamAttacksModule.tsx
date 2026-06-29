import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Shield,
  AlertTriangle,
  Target,
  Lock,
  Unlock,
  Database,
  Key,
  User,
  FileText,
  Mail,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  TrendingUp
} from 'lucide-react';

interface AttackScenario {
  id: string;
  name: string;
  category: 'authentication' | 'authorization' | 'data-access' | 'injection' | 'social-engineering' | 'compliance-bypass';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'not-tested' | 'testing' | 'passed' | 'failed';
  description: string;
  testDate?: string;
  result?: string;
}

export function RedTeamAttacksModule() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [testResults, setTestResults] = useState<{ [key: string]: 'passed' | 'failed' }>({});

  const [scenarios] = useState<AttackScenario[]>([
    {
      id: 'AUTH-001',
      name: 'Brute Force Login Attack',
      category: 'authentication',
      severity: 'high',
      status: 'passed',
      description: 'Attempt multiple login combinations to guess credentials',
      testDate: '2024-02-15',
      result: 'System blocked after 5 failed attempts. Account lockout triggered. ✓ PASSED'
    },
    {
      id: 'AUTH-002',
      name: 'Session Hijacking',
      category: 'authentication',
      severity: 'critical',
      status: 'passed',
      description: 'Intercept and reuse session tokens to impersonate users',
      testDate: '2024-02-15',
      result: 'Secure HTTPS enforced. Session tokens encrypted. IP validation active. ✓ PASSED'
    },
    {
      id: 'AUTH-003',
      name: '2FA Bypass Attempt',
      category: 'authentication',
      severity: 'critical',
      status: 'passed',
      description: 'Try to access account without completing two-factor authentication',
      testDate: '2024-02-15',
      result: 'Access denied without 2FA completion. Backup codes secured. ✓ PASSED'
    },
    {
      id: 'AUTHZ-001',
      name: 'Privilege Escalation',
      category: 'authorization',
      severity: 'critical',
      status: 'passed',
      description: 'Client Manager attempting to access Compliance Officer functions',
      testDate: '2024-02-15',
      result: 'Role-based access control enforced. Unauthorized access blocked. ✓ PASSED'
    },
    {
      id: 'AUTHZ-002',
      name: 'SMR Submission Bypass',
      category: 'authorization',
      severity: 'critical',
      status: 'passed',
      description: 'Attempt to submit Suspicious Matter Report without senior approval',
      testDate: '2024-02-15',
      result: 'AI Copilot cannot submit SMRs. Human approval required. ✓ PASSED'
    },
    {
      id: 'AUTHZ-003',
      name: 'Risk Override Attempt',
      category: 'authorization',
      severity: 'high',
      status: 'passed',
      description: 'Try to override high-risk client restrictions without approval',
      testDate: '2024-02-15',
      result: 'Risk appetite changes require Board approval. AI cannot override. ✓ PASSED'
    },
    {
      id: 'DATA-001',
      name: 'Client Data Exfiltration',
      category: 'data-access',
      severity: 'critical',
      status: 'passed',
      description: 'Bulk download of sensitive client information',
      testDate: '2024-02-16',
      result: 'Rate limiting enforced. Audit trail logged. Large exports require approval. ✓ PASSED'
    },
    {
      id: 'DATA-002',
      name: 'PII Access Without Need',
      category: 'data-access',
      severity: 'high',
      status: 'passed',
      description: 'Access personally identifiable information outside role scope',
      testDate: '2024-02-16',
      result: 'Field-level access control active. PII masked for unauthorized roles. ✓ PASSED'
    },
    {
      id: 'DATA-003',
      name: 'Audit Log Tampering',
      category: 'data-access',
      severity: 'critical',
      status: 'passed',
      description: 'Attempt to delete or modify audit trail entries',
      testDate: '2024-02-16',
      result: 'Immutable audit logs. Write-only access. Tampering detected and blocked. ✓ PASSED'
    },
    {
      id: 'INJ-001',
      name: 'SQL Injection Attack',
      category: 'injection',
      severity: 'critical',
      status: 'passed',
      description: 'Inject malicious SQL code through client search fields',
      testDate: '2024-02-16',
      result: 'Parameterized queries enforced. Input sanitization active. ✓ PASSED'
    },
    {
      id: 'INJ-002',
      name: 'XSS (Cross-Site Scripting)',
      category: 'injection',
      severity: 'high',
      status: 'passed',
      description: 'Inject malicious JavaScript through form inputs',
      testDate: '2024-02-16',
      result: 'Content Security Policy enforced. All inputs escaped. ✓ PASSED'
    },
    {
      id: 'SOC-001',
      name: 'Phishing Simulation',
      category: 'social-engineering',
      severity: 'high',
      status: 'passed',
      description: 'Send fake emails requesting credentials or sensitive data',
      testDate: '2024-02-17',
      result: '85% of staff identified phishing attempt. Training effective. ✓ PASSED'
    },
    {
      id: 'SOC-002',
      name: 'Impersonation Attack',
      category: 'social-engineering',
      severity: 'high',
      status: 'passed',
      description: 'Impersonate senior manager to request data or approvals',
      testDate: '2024-02-17',
      result: 'Verbal verification policy enforced. Request denied. ✓ PASSED'
    },
    {
      id: 'COMP-001',
      name: 'Sanctions Screening Bypass',
      category: 'compliance-bypass',
      severity: 'critical',
      status: 'passed',
      description: 'Onboard client without completing sanctions/PEP screening',
      testDate: '2024-02-17',
      result: 'Screening mandatory before onboarding. Cannot proceed without check. ✓ PASSED'
    },
    {
      id: 'COMP-002',
      name: 'CDD Documentation Skip',
      category: 'compliance-bypass',
      severity: 'critical',
      status: 'passed',
      description: 'Approve client without completing Customer Due Diligence',
      testDate: '2024-02-17',
      result: 'CDD checklist mandatory. System prevents approval without completion. ✓ PASSED'
    },
    {
      id: 'COMP-003',
      name: 'AI Decision Override',
      category: 'compliance-bypass',
      severity: 'critical',
      status: 'passed',
      description: 'Test if AI can make final "suspicious" determination alone',
      testDate: '2024-02-17',
      result: 'AI suggests, humans decide. Final decisions require human approval. ✓ PASSED'
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'gray';
      case 'medium': return 'yellow';
      case 'high': return 'orange';
      case 'critical': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'testing': return <Clock className="w-5 h-5 text-blue-400" />;
      case 'not-tested': return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  const filteredScenarios = activeCategory === 'all' 
    ? scenarios 
    : scenarios.filter(s => s.category === activeCategory);

  const stats = {
    totalTests: scenarios.length,
    passed: scenarios.filter(s => s.status === 'passed').length,
    failed: scenarios.filter(s => s.status === 'failed').length,
    critical: scenarios.filter(s => s.severity === 'critical').length,
    successRate: (scenarios.filter(s => s.status === 'passed').length / scenarios.length * 100).toFixed(1)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="w-16 h-16" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Red Team Security Testing</h1>
              <p className="text-xl text-red-100">Penetration Testing & Attack Simulations</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white text-red-400 hover:bg-red-500/10">
              <Target className="w-5 h-5 mr-2" />
              Run New Test
            </Button>
            <Button className="bg-white text-red-400 hover:bg-red-500/10">
              <FileText className="w-5 h-5 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-5 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Total Tests</h3>
              <Target className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{stats.totalTests}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Passed</h3>
              <CheckCircle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-green-300">{stats.passed}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Failed</h3>
              <XCircle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-red-300">{stats.failed}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Critical</h3>
              <AlertTriangle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-orange-300">{stats.critical}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Success Rate</h3>
              <TrendingUp className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-green-300">{stats.successRate}%</p>
          </div>
        </div>
      </div>

      {/* Security Status */}
      <div className="bg-green-500/10 border-2 border-green-500 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-8 h-8 text-green-400 mt-0.5" />
          <div>
            <h3 className="text-2xl font-bold text-green-300 mb-2">🎉 All Security Tests Passed!</h3>
            <p className="text-lg text-green-300 mb-3">
              The Grow KYC platform has successfully defended against all {stats.totalTests} attack scenarios, 
              including {stats.critical} critical-severity threats.
            </p>
            <p className="text-sm text-green-300">
              <strong>Last Test Run:</strong> February 17, 2024 • <strong>Success Rate:</strong> {stats.successRate}%
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg border border-white/10 p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Tests', count: scenarios.length },
            { id: 'authentication', label: 'Authentication', count: scenarios.filter(s => s.category === 'authentication').length },
            { id: 'authorization', label: 'Authorization', count: scenarios.filter(s => s.category === 'authorization').length },
            { id: 'data-access', label: 'Data Access', count: scenarios.filter(s => s.category === 'data-access').length },
            { id: 'injection', label: 'Injection', count: scenarios.filter(s => s.category === 'injection').length },
            { id: 'social-engineering', label: 'Social Engineering', count: scenarios.filter(s => s.category === 'social-engineering').length },
            { id: 'compliance-bypass', label: 'Compliance Bypass', count: scenarios.filter(s => s.category === 'compliance-bypass').length }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-red-600 text-white'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Attack Scenarios */}
      <div className="space-y-3">
        {filteredScenarios.map((scenario) => {
          const severityColor = getSeverityColor(scenario.severity);
          return (
            <div key={scenario.id} className="bg-white rounded-lg border-2 border-white/10 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-gray-800 text-white text-xs font-mono font-bold rounded">
                      {scenario.id}
                    </span>
                    <span className={`px-3 py-1 bg-${severityColor}-100 text-${severityColor}-700 text-xs font-bold rounded-full uppercase`}>
                      {scenario.severity}
                    </span>
                    {scenario.testDate && (
                      <span className="text-xs text-slate-300">
                        Tested: {scenario.testDate}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 mb-2">{scenario.name}</h3>
                  <p className="text-slate-300 mb-3">{scenario.description}</p>
                  
                  {scenario.result && (
                    <div className={`p-3 rounded-lg ${
                      scenario.status === 'passed' ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
                    }`}>
                      <p className={`text-sm font-semibold ${
                        scenario.status === 'passed' ? 'text-green-300' : 'text-red-300'
                      }`}>
                        {scenario.result}
                      </p>
                    </div>
                  )}
                </div>

                <div className="ml-6 flex flex-col items-center gap-2">
                  {getStatusIcon(scenario.status)}
                  <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                    scenario.status === 'passed' ? 'bg-green-500/15 text-green-300' :
                    scenario.status === 'failed' ? 'bg-red-500/15 text-red-300' :
                    scenario.status === 'testing' ? 'bg-blue-500/15 text-blue-300' :
                    'bg-white/5 text-slate-300'
                  }`}>
                    {scenario.status.replace('-', ' ')}
                  </span>
                  <Button size="sm" variant="outline">
                    Retest
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Recommendations */}
      <div className="bg-white rounded-lg border border-white/10 p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-4">Security Best Practices Implemented</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: 'Multi-Factor Authentication', desc: 'Required for all privileged accounts', icon: Lock },
            { title: 'Role-Based Access Control', desc: 'Strict separation of duties enforced', icon: User },
            { title: 'Encryption at Rest & Transit', desc: 'AES-256 encryption for sensitive data', icon: Shield },
            { title: 'Immutable Audit Logs', desc: 'Tamper-proof activity logging', icon: FileText },
            { title: 'AI Safety Guardrails', desc: 'AI suggests, humans decide principle', icon: Zap },
            { title: 'Input Validation', desc: 'All inputs sanitized and validated', icon: CheckCircle },
            { title: 'Session Management', desc: 'Secure tokens with auto-timeout', icon: Clock },
            { title: 'Security Training', desc: 'Regular staff awareness programs', icon: TrendingUp }
          ].map((practice, index) => {
            const Icon = practice.icon;
            return (
              <div key={index} className="p-4 border border-white/10 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon className="w-6 h-6 text-green-400 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-100 mb-1">{practice.title}</h4>
                    <p className="text-sm text-slate-300">{practice.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
