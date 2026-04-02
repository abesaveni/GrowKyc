import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Shield,
  Users,
  Lock,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  XCircle,
  X,
  Info,
  Clock,
  FileText,
  Database,
  Zap,
  UserCheck,
  UserX,
  ShieldAlert,
  ShieldCheck,
  Activity,
  GitBranch,
  Layers,
  Crown,
  Briefcase,
  Award,
  Settings,
  Search,
  Filter,
  Download,
  Upload,
  Copy,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  CheckCheck,
  Ban,
  Fingerprint,
  Smartphone,
  MapPin,
  History,
  FileCheck,
  UserCog,
  ShieldOff
} from 'lucide-react';

interface RoleAccessControlProps {
  onBack: () => void;
}

export function RoleAccessControl({ onBack }: RoleAccessControlProps) {
  const [activeView, setActiveView] = useState<'overview' | 'hierarchy' | 'matrix' | 'dual-control' | 'governance' | 'audit'>('overview');
  const [expandedTier, setExpandedTier] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Role Hierarchy Data
  const roleTiers = [
    {
      tier: 0,
      name: 'CLIENT',
      color: 'from-gray-500 to-gray-600',
      icon: Users,
      roles: [{ id: 'client', name: 'Client User', count: 450 }],
      scope: 'Own entity only',
      summary: 'Self-service portal access only'
    },
    {
      tier: 1,
      name: 'OPERATIONAL',
      color: 'from-blue-500 to-blue-600',
      icon: UserCheck,
      roles: [
        { id: 'analyst', name: 'AML Analyst', count: 8 },
        { id: 'kyc_officer', name: 'KYC Officer', count: 6 },
        { id: 'client_manager', name: 'Client Manager', count: 5 }
      ],
      scope: 'Assigned clients only',
      summary: 'Day-to-day verification and monitoring'
    },
    {
      tier: 2,
      name: 'COMPLIANCE',
      color: 'from-purple-500 to-purple-600',
      icon: ShieldCheck,
      roles: [
        { id: 'compliance_officer', name: 'Compliance Officer', count: 4 },
        { id: 'senior_aml', name: 'Senior AML Manager', count: 2 }
      ],
      scope: 'All clients within tenant',
      summary: 'High-risk approvals and oversight'
    },
    {
      tier: 3,
      name: 'EXECUTIVE',
      color: 'from-amber-500 to-amber-600',
      icon: Crown,
      roles: [
        { id: 'partner', name: 'Partner', count: 3 },
        { id: 'board_member', name: 'Board Member', count: 2 },
        { id: 'credit_committee', name: 'Credit Committee', count: 4 },
        { id: 'responsible_manager', name: 'Responsible Manager', count: 2 }
      ],
      scope: 'Portfolio level',
      summary: 'Strategic oversight and approvals'
    },
    {
      tier: 4,
      name: 'SYSTEM & SECURITY',
      color: 'from-red-500 to-red-600',
      icon: Settings,
      roles: [
        { id: 'system_admin', name: 'System Administrator', count: 2 },
        { id: 'security_admin', name: 'Security Administrator', count: 1 },
        { id: 'devops', name: 'DevOps', count: 2 },
        { id: 'tenant_admin', name: 'Tenant Admin (Restricted)', count: 1 }
      ],
      scope: 'Infrastructure only',
      summary: 'System configuration (no case access)'
    }
  ];

  // Permission Matrix Data
  const permissionMatrix = [
    { 
      action: 'Run ID Check', 
      tier0: false, tier1: true, tier2: true, tier3: false, tier4: false,
      category: 'Verification',
      dualControl: false
    },
    { 
      action: 'Assign Low Risk', 
      tier0: false, tier1: true, tier2: true, tier3: false, tier4: false,
      category: 'Risk Assessment',
      dualControl: false
    },
    { 
      action: 'Assign High Risk', 
      tier0: false, tier1: false, tier2: true, tier3: false, tier4: false,
      category: 'Risk Assessment',
      dualControl: false
    },
    { 
      action: 'Override Sanctions', 
      tier0: false, tier1: false, tier2: true, tier3: false, tier4: false,
      category: 'Override',
      dualControl: true
    },
    { 
      action: 'Close EDD Case', 
      tier0: false, tier1: false, tier2: true, tier3: false, tier4: false,
      category: 'Case Management',
      dualControl: false
    },
    { 
      action: 'Approve Credit', 
      tier0: false, tier1: false, tier2: false, tier3: true, tier4: false,
      category: 'Financial',
      dualControl: false
    },
    { 
      action: 'Modify Rule Engine', 
      tier0: false, tier1: false, tier2: false, tier3: false, tier4: true,
      category: 'System',
      dualControl: false
    },
    { 
      action: 'Delete Evidence', 
      tier0: false, tier1: false, tier2: false, tier3: false, tier4: false,
      category: 'Data Management',
      dualControl: false
    },
    { 
      action: 'Access Full PII', 
      tier0: false, tier1: false, tier2: true, tier3: false, tier4: false,
      category: 'Data Access',
      dualControl: false
    },
    { 
      action: 'Unlock Engagement Restriction', 
      tier0: false, tier1: false, tier2: true, tier3: false, tier4: false,
      category: 'Override',
      dualControl: true
    },
    { 
      action: 'Approve High-Risk Client', 
      tier0: false, tier1: false, tier2: true, tier3: true, tier4: false,
      category: 'Risk Assessment',
      dualControl: true
    },
    { 
      action: 'Submit Regulatory Breach', 
      tier0: false, tier1: false, tier2: true, tier3: true, tier4: false,
      category: 'Regulatory',
      dualControl: true
    },
    { 
      action: 'Change Retention Policy', 
      tier0: false, tier1: false, tier2: false, tier3: false, tier4: true,
      category: 'System',
      dualControl: true
    },
    { 
      action: 'Rotate Encryption Keys', 
      tier0: false, tier1: false, tier2: false, tier3: false, tier4: true,
      category: 'Security',
      dualControl: true
    }
  ];

  // Dual Control Actions
  const dualControlActions = [
    { action: 'Sanctions Override', category: 'Risk Override', requiresTiers: [2], requiredApprovers: 2, status: 'active', pendingCount: 3 },
    { action: 'Engagement Unlock After Restriction', category: 'Access Control', requiresTiers: [2], requiredApprovers: 2, status: 'active', pendingCount: 1 },
    { action: 'High-Risk Client Acceptance', category: 'Onboarding', requiresTiers: [2, 3], requiredApprovers: 2, status: 'active', pendingCount: 5 },
    { action: 'Regulatory Breach Submission', category: 'Regulatory', requiresTiers: [2, 3], requiredApprovers: 2, status: 'active', pendingCount: 0 },
    { action: 'Retention Policy Change', category: 'Data Governance', requiresTiers: [4], requiredApprovers: 2, status: 'active', pendingCount: 0 },
    { action: 'Encryption Key Rotation', category: 'Security', requiresTiers: [4], requiredApprovers: 2, status: 'active', pendingCount: 0 }
  ];

  // Access Governance Metrics
  const governanceMetrics = {
    lastAccessReview: '14 days ago',
    nextReview: 'In 76 days',
    inactiveAccounts: 3,
    privilegedAccounts: 12,
    failedLogins: 18,
    mfaCompliance: 98.5,
    roleRecertificationDue: 5,
    anomalousAccess: 2
  };

  // Special Roles
  const specialRoles = [
    {
      id: 'internal_auditor',
      name: 'Internal Auditor',
      icon: FileCheck,
      access: 'Read-only across audit logs, risk history, case samples',
      restrictions: 'Cannot modify data, override decisions, or access unmasked PII without approval',
      count: 2,
      status: 'active'
    },
    {
      id: 'independent_reviewer',
      name: 'Independent AML Reviewer',
      icon: UserCog,
      access: 'Temporary scoped access to AML program, risk assessments, selected cases',
      restrictions: 'Time-bound access, auto-expires after review period',
      count: 1,
      status: 'temporary'
    },
    {
      id: 'regulator_audit',
      name: 'Regulator Audit Mode',
      icon: ShieldAlert,
      access: 'Read-only, redaction control, export access',
      restrictions: 'Session time-bound, watermarked interface, all actions logged',
      count: 0,
      status: 'dormant'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-7 h-7 text-purple-600" />
            Role & Access Control Framework
          </h2>
          <p className="text-sm text-gray-600 mt-1">ISO 27001 & SOC 2 Compliant • Bank-Grade Segregation of Duties</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            ISO 27001 Aligned
          </Badge>
          <Badge variant="default" className="bg-blue-600">
            <ShieldCheck className="w-3 h-3 mr-1" />
            SOC 2 Compliant
          </Badge>
        </div>
      </div>

      {/* Control Principles Banner */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            Access Control Principles
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: Lock, text: 'Least Privilege Access', color: 'text-blue-600' },
              { icon: GitBranch, text: 'Segregation of Duties', color: 'text-purple-600' },
              { icon: Ban, text: 'No Self-Approval', color: 'text-red-600' },
              { icon: CheckCheck, text: 'Dual Control Critical', color: 'text-green-600' },
              { icon: Database, text: 'Immutable Audit Logs', color: 'text-amber-600' },
              { icon: Zap, text: 'Just-in-Time Elevation', color: 'text-orange-600' },
              { icon: UserCheck, text: 'Role-Based Access', color: 'text-indigo-600' },
              { icon: History, text: 'Quarterly Reviews', color: 'text-teal-600' }
            ].map((principle, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <principle.icon className={`w-4 h-4 ${principle.color}`} />
                <span className="font-medium text-gray-700">{principle.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Navigation */}
      <div className="flex items-center gap-2 border-b">
        <Button
          variant={activeView === 'overview' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('overview')}
        >
          <Layers className="w-4 h-4 mr-2" />
          Role Overview
        </Button>
        <Button
          variant={activeView === 'hierarchy' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('hierarchy')}
        >
          <GitBranch className="w-4 h-4 mr-2" />
          Tier Hierarchy
        </Button>
        <Button
          variant={activeView === 'matrix' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('matrix')}
        >
          <FileCheck className="w-4 h-4 mr-2" />
          Permission Matrix
        </Button>
        <Button
          variant={activeView === 'dual-control' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('dual-control')}
        >
          <CheckCheck className="w-4 h-4 mr-2" />
          Dual Control
        </Button>
        <Button
          variant={activeView === 'governance' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('governance')}
        >
          <ShieldCheck className="w-4 h-4 mr-2" />
          Governance
        </Button>
        <Button
          variant={activeView === 'audit' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('audit')}
        >
          <Activity className="w-4 h-4 mr-2" />
          Audit Trail
        </Button>
      </div>

      {/* OVERVIEW VIEW */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-6">
                <Users className="w-8 h-8 text-blue-600 mb-2" />
                <div className="text-3xl font-bold">489</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Layers className="w-8 h-8 text-purple-600 mb-2" />
                <div className="text-3xl font-bold">5</div>
                <div className="text-sm text-gray-600">Access Tiers</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <CheckCheck className="w-8 h-8 text-green-600 mb-2" />
                <div className="text-3xl font-bold">9</div>
                <div className="text-sm text-gray-600">Pending Dual Control</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <ShieldCheck className="w-8 h-8 text-amber-600 mb-2" />
                <div className="text-3xl font-bold">98.5%</div>
                <div className="text-sm text-gray-600">MFA Compliance</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <AlertTriangle className="w-8 h-8 text-red-600 mb-2" />
                <div className="text-3xl font-bold">2</div>
                <div className="text-sm text-gray-600">Access Anomalies</div>
              </CardContent>
            </Card>
          </div>

          {/* Role Tier Cards */}
          <div className="grid grid-cols-1 gap-4">
            {roleTiers.map((tier) => (
              <Card key={tier.tier} className="border-l-4" style={{ borderLeftColor: `rgb(${tier.tier === 0 ? '107, 114, 128' : tier.tier === 1 ? '59, 130, 246' : tier.tier === 2 ? '168, 85, 247' : tier.tier === 3 ? '251, 191, 36' : '239, 68, 68'})` }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tier.color} flex items-center justify-center text-white`}>
                        <tier.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">Tier {tier.tier}: {tier.name}</CardTitle>
                          <Badge variant="secondary">{tier.roles.reduce((sum, role) => sum + role.count, 0)} users</Badge>
                        </div>
                        <CardDescription>{tier.summary}</CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedTier(expandedTier === tier.tier ? null : tier.tier)}
                    >
                      {expandedTier === tier.tier ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                {expandedTier === tier.tier && (
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Scope</div>
                          <div className="font-semibold text-sm">{tier.scope}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Total Roles</div>
                          <div className="font-semibold text-sm">{tier.roles.length} role types</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {tier.roles.map((role) => (
                          <div key={role.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <UserCheck className="w-5 h-5 text-gray-400" />
                              <div>
                                <div className="font-semibold text-sm">{role.name}</div>
                                <div className="text-xs text-gray-600">{role.count} active users</div>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              View Permissions
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Special Roles */}
          <Card>
            <CardHeader>
              <CardTitle>Special Roles</CardTitle>
              <CardDescription>Temporary and auditor access roles with enhanced logging</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {specialRoles.map((role) => (
                  <div key={role.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <role.icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{role.name}</span>
                          <Badge variant={role.status === 'active' ? 'default' : role.status === 'temporary' ? 'secondary' : 'outline'}>
                            {role.status}
                          </Badge>
                          <Badge variant="secondary">{role.count} active</Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <div><strong>Access:</strong> {role.access}</div>
                          <div><strong>Restrictions:</strong> {role.restrictions}</div>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TIER HIERARCHY VIEW */}
      {activeView === 'hierarchy' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>5-Tier Access Hierarchy</CardTitle>
              <CardDescription>Structured authority levels with clear segregation of duties</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Visual Hierarchy Pyramid */}
              <div className="space-y-4">
                {roleTiers.reverse().map((tier, index) => {
                  const width = 20 + (tier.tier * 16);
                  return (
                    <div key={tier.tier} className="flex flex-col items-center">
                      <div 
                        className={`bg-gradient-to-r ${tier.color} text-white rounded-lg p-6 transition-all hover:scale-105`}
                        style={{ width: `${width}%` }}
                      >
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <tier.icon className="w-6 h-6" />
                            <span className="font-bold text-lg">TIER {tier.tier}</span>
                          </div>
                          <div className="font-semibold mb-1">{tier.name}</div>
                          <div className="text-sm opacity-90">{tier.scope}</div>
                          <div className="text-xs opacity-75 mt-2">
                            {tier.roles.reduce((sum, role) => sum + role.count, 0)} users across {tier.roles.length} roles
                          </div>
                        </div>
                      </div>
                      {index < roleTiers.length - 1 && (
                        <div className="w-px h-8 bg-gray-300 my-2" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Segregation Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Segregation of Duties Rules</CardTitle>
              <CardDescription>Bank-grade separation controls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { rule: 'Analyst cannot approve their own escalated case', tiers: [1, 2], type: 'Self-approval prevention', status: 'active' },
                  { rule: 'Credit approval must not be performed by same person who conducted serviceability', tiers: [3], type: 'Financial separation', status: 'active' },
                  { rule: 'System admin must use just-in-time access for PII', tiers: [4], type: 'Zero-trust PII', status: 'active' },
                  { rule: 'Compliance cannot modify their own audit trails', tiers: [2], type: 'Audit integrity', status: 'active' },
                  { rule: 'Two Tier 2+ users required for sanctions override', tiers: [2], type: 'Dual control', status: 'active' }
                ].map((rule, index) => (
                  <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-l-purple-500">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <GitBranch className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-sm">{rule.rule}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <Badge variant="secondary" className="text-xs">{rule.type}</Badge>
                        <span>Applies to: Tier {rule.tiers.join(', ')}</span>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {rule.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* PERMISSION MATRIX VIEW */}
      {activeView === 'matrix' && (
        <Card>
          <CardHeader>
            <CardTitle>Permission Matrix</CardTitle>
            <CardDescription>Complete access control matrix across all tiers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold">Action</th>
                    <th className="text-left py-3 px-4 font-semibold">Category</th>
                    <th className="text-center py-3 px-4 font-semibold">Tier 0<br/><span className="text-xs font-normal text-gray-600">Client</span></th>
                    <th className="text-center py-3 px-4 font-semibold">Tier 1<br/><span className="text-xs font-normal text-gray-600">Operational</span></th>
                    <th className="text-center py-3 px-4 font-semibold">Tier 2<br/><span className="text-xs font-normal text-gray-600">Compliance</span></th>
                    <th className="text-center py-3 px-4 font-semibold">Tier 3<br/><span className="text-xs font-normal text-gray-600">Executive</span></th>
                    <th className="text-center py-3 px-4 font-semibold">Tier 4<br/><span className="text-xs font-normal text-gray-600">System</span></th>
                    <th className="text-center py-3 px-4 font-semibold">Dual Control</th>
                  </tr>
                </thead>
                <tbody>
                  {permissionMatrix.map((permission, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{permission.action}</td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="text-xs">{permission.category}</Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {permission.tier0 ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {permission.tier1 ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {permission.tier2 ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {permission.tier3 ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {permission.tier4 ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {permission.dualControl ? (
                          <Badge variant="default" className="bg-amber-600 text-xs">
                            <CheckCheck className="w-3 h-3 mr-1" />
                            Required
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-900">
                  <strong>Legend:</strong> Green checkmark indicates permission granted. Dual Control actions require approval from two authorized users from the specified tiers. Actions marked with <X className="w-4 h-4 inline text-gray-400" /> are denied for that tier.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DUAL CONTROL VIEW */}
      {activeView === 'dual-control' && (
        <div className="space-y-6">
          <Card className="border-2 border-amber-200 bg-amber-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <CheckCheck className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Bank-Grade Dual Control</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Critical actions require approval from two authorized users to prevent fraud, errors, and ensure regulatory compliance. 
                    Both approvers must be from designated tiers and cannot approve their own requests.
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant="default" className="bg-green-600">9 Pending Approvals</Badge>
                    <Badge variant="secondary">6 Active Rules</Badge>
                    <Badge variant="secondary">156 Completed This Month</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dual Control Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Dual Control Actions</CardTitle>
              <CardDescription>Actions requiring two-person approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dualControlActions.map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-l-amber-500">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCheck className="w-5 h-5 text-amber-600" />
                        <span className="font-semibold">{action.action}</span>
                        {action.pendingCount > 0 && (
                          <Badge variant="destructive">{action.pendingCount} pending</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Category:</span>
                          <Badge variant="secondary" className="ml-2 text-xs">{action.category}</Badge>
                        </div>
                        <div>
                          <span className="text-gray-600">Required Approvers:</span>
                          <span className="ml-2 font-semibold">{action.requiredApprovers}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Authorized Tiers:</span>
                          <span className="ml-2 font-semibold">Tier {action.requiresTiers.join(', ')}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <Badge variant="default" className="ml-2 bg-green-600 text-xs">{action.status}</Badge>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      {action.pendingCount > 0 ? 'Review Pending' : 'View History'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Dual Control Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Dual Control Requests</CardTitle>
              <CardDescription>Requests awaiting second approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { id: 'DC-2847', action: 'Sanctions Override', client: 'Apex Holdings Ltd', requester: 'Sarah Chen', approver1: 'Jessica Lee', timestamp: '2 hours ago', urgency: 'high' },
                  { id: 'DC-2846', action: 'High-Risk Client Acceptance', client: 'GlobalTech Corp', requester: 'Emma Williams', approver1: 'Michael Roberts', timestamp: '4 hours ago', urgency: 'high' },
                  { id: 'DC-2845', action: 'Sanctions Override', client: 'Phoenix Ventures', requester: 'Sarah Chen', approver1: 'Jessica Lee', timestamp: '6 hours ago', urgency: 'medium' },
                  { id: 'DC-2844', action: 'High-Risk Client Acceptance', client: 'Summit Partners', requester: 'Emma Williams', approver1: 'Robert Kim', timestamp: '1 day ago', urgency: 'high' }
                ].map((request, index) => (
                  <div key={index} className={`p-4 rounded-lg border-2 ${request.urgency === 'high' ? 'bg-red-50 border-red-300' : 'bg-amber-50 border-amber-300'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm text-gray-500">{request.id}</span>
                          <Badge variant={request.urgency === 'high' ? 'destructive' : 'default'}>{request.urgency}</Badge>
                        </div>
                        <div className="font-semibold text-lg mb-1">{request.action}</div>
                        <div className="text-sm text-gray-600">Client: {request.client}</div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        {request.timestamp}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 mb-3 text-sm">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Requester:</span>
                        <span className="font-semibold">{request.requester}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-600">1st Approver:</span>
                        <span className="font-semibold">{request.approver1}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span className="text-gray-600">Awaiting 2nd approval</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-300">
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* GOVERNANCE VIEW */}
      {activeView === 'governance' && (
        <div className="space-y-6">
          {/* Governance Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
                <div className="text-2xl font-bold">{governanceMetrics.mfaCompliance}%</div>
                <div className="text-sm text-gray-600">MFA Compliance</div>
                <Progress value={governanceMetrics.mfaCompliance} className="mt-2" />
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="p-6">
                <Clock className="w-8 h-8 text-amber-600 mb-2" />
                <div className="text-2xl font-bold">{governanceMetrics.roleRecertificationDue}</div>
                <div className="text-sm text-gray-600">Recertifications Due</div>
                <Button size="sm" variant="outline" className="mt-2 w-full">Review Now</Button>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <AlertTriangle className="w-8 h-8 text-red-600 mb-2" />
                <div className="text-2xl font-bold">{governanceMetrics.anomalousAccess}</div>
                <div className="text-sm text-gray-600">Access Anomalies</div>
                <Button size="sm" variant="outline" className="mt-2 w-full">Investigate</Button>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <UserX className="w-8 h-8 text-blue-600 mb-2" />
                <div className="text-2xl font-bold">{governanceMetrics.inactiveAccounts}</div>
                <div className="text-sm text-gray-600">Inactive Accounts</div>
                <Button size="sm" variant="outline" className="mt-2 w-full">Disable</Button>
              </CardContent>
            </Card>
          </div>

          {/* Access Review Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Access Review Schedule</CardTitle>
              <CardDescription>Quarterly and annual access governance reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold">Last Quarterly Review</span>
                    </div>
                    <Badge variant="default" className="bg-green-600">Completed</Badge>
                  </div>
                  <div className="text-sm text-gray-600">Completed {governanceMetrics.lastAccessReview} • 100% roles reviewed</div>
                </div>

                <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold">Next Quarterly Review</span>
                    </div>
                    <Badge variant="secondary">{governanceMetrics.nextReview}</Badge>
                  </div>
                  <div className="text-sm text-gray-600">Scheduled for Q2 2026 • All Tier 2+ roles</div>
                  <Progress value={18} className="mt-2" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Access Review</div>
                    <div className="font-semibold">Quarterly</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Role Recertification</div>
                    <div className="font-semibold">Quarterly</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Independent Audit</div>
                    <div className="font-semibold">Annual</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mandatory Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Mandatory Access Controls</CardTitle>
              <CardDescription>Security controls enforced across all users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { control: 'Multi-Factor Authentication', status: 'enabled', compliance: 98.5, icon: Fingerprint },
                  { control: 'Device Fingerprinting', status: 'enabled', compliance: 100, icon: Smartphone },
                  { control: 'Session Timeout (30min)', status: 'enabled', compliance: 100, icon: Clock },
                  { control: 'Geo-location Monitoring', status: 'enabled', compliance: 100, icon: MapPin },
                  { control: 'Login Attempt Monitoring', status: 'enabled', compliance: 100, icon: ShieldAlert },
                  { control: 'Password Complexity', status: 'enabled', compliance: 100, icon: Lock }
                ].map((control, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <control.icon className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="font-semibold text-sm">{control.control}</div>
                        <div className="text-xs text-gray-600">{control.compliance}% compliance</div>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-600">
                      {control.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Data Access Tiers */}
          <Card>
            <CardHeader>
              <CardTitle>Data Access Tiers</CardTitle>
              <CardDescription>Graduated data access levels with escalation requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { level: 1, name: 'Metadata Only', description: 'Client names, IDs, case references', access: 'All users', color: 'bg-blue-100 text-blue-900 border-blue-300' },
                  { level: 2, name: 'Masked PII', description: 'Partially redacted personal information', access: 'Tier 1+', color: 'bg-green-100 text-green-900 border-green-300' },
                  { level: 3, name: 'Full PII', description: 'Complete personal and financial data', access: 'Tier 2+ or JIT', color: 'bg-amber-100 text-amber-900 border-amber-300' },
                  { level: 4, name: 'Restricted Investigative', description: 'Sanctions details, adverse media, PEP data', access: 'Tier 2 with approval', color: 'bg-red-100 text-red-900 border-red-300' }
                ].map((tier) => (
                  <div key={tier.level} className={`p-4 rounded-lg border-2 ${tier.color}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold">
                          {tier.level}
                        </div>
                        <span className="font-bold">{tier.name}</span>
                      </div>
                      <Badge variant="secondary">{tier.access}</Badge>
                    </div>
                    <div className="text-sm ml-10">{tier.description}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-purple-900">
                    <strong>Escalation Policy:</strong> Access to Level 3+ requires manager approval and is logged. System administrators must use just-in-time (JIT) elevation with justification for any PII access.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AUDIT TRAIL VIEW */}
      {activeView === 'audit' && (
        <div className="space-y-6">
          {/* Audit Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <Activity className="w-8 h-8 text-blue-600 mb-2" />
                <div className="text-3xl font-bold">12.5K</div>
                <div className="text-sm text-gray-600">Events Today</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <ShieldAlert className="w-8 h-8 text-amber-600 mb-2" />
                <div className="text-3xl font-bold">24</div>
                <div className="text-sm text-gray-600">Privileged Actions</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <AlertTriangle className="w-8 h-8 text-red-600 mb-2" />
                <div className="text-3xl font-bold">18</div>
                <div className="text-sm text-gray-600">Failed Login Attempts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <CheckCheck className="w-8 h-8 text-green-600 mb-2" />
                <div className="text-3xl font-bold">156</div>
                <div className="text-sm text-gray-600">Dual Control Approvals</div>
              </CardContent>
            </Card>
          </div>

          {/* Audit Log */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Access Control Audit Log</CardTitle>
                  <CardDescription>Immutable log of all access control events</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { type: 'dual_control_approval', user: 'Michael Roberts (Partner)', action: 'Approved sanctions override for Apex Holdings', timestamp: '2 min ago', severity: 'high', ip: '203.45.12.68' },
                  { type: 'role_assignment', user: 'System Admin', action: 'Assigned Compliance Officer role to Jessica Lee', timestamp: '15 min ago', severity: 'medium', ip: '203.45.12.71' },
                  { type: 'privileged_access', user: 'System Admin', action: 'JIT elevation to access PII for investigation INV-2847', timestamp: '1 hour ago', severity: 'high', ip: '203.45.12.71' },
                  { type: 'failed_login', user: 'unknown@example.com', action: 'Failed login attempt (invalid credentials)', timestamp: '2 hours ago', severity: 'warning', ip: '192.168.1.1' },
                  { type: 'permission_change', user: 'Sarah Chen (Compliance)', action: 'Updated permission matrix for KYC Officers', timestamp: '3 hours ago', severity: 'medium', ip: '203.45.12.67' },
                  { type: 'session_timeout', user: 'Emma Williams (Analyst)', action: 'Session terminated due to inactivity', timestamp: '4 hours ago', severity: 'info', ip: '203.45.12.69' },
                  { type: 'mfa_enabled', user: 'David Thompson (Auditor)', action: 'Enabled two-factor authentication', timestamp: '5 hours ago', severity: 'info', ip: '203.45.12.70' },
                  { type: 'access_review', user: 'Sarah Chen (Compliance)', action: 'Completed quarterly access review', timestamp: '1 day ago', severity: 'info', ip: '203.45.12.67' }
                ].map((log, index) => (
                  <div key={index} className={`flex items-start justify-between p-3 rounded-lg border-l-4 ${
                    log.severity === 'high' ? 'bg-red-50 border-l-red-500' :
                    log.severity === 'warning' ? 'bg-amber-50 border-l-amber-500' :
                    log.severity === 'medium' ? 'bg-blue-50 border-l-blue-500' :
                    'bg-gray-50 border-l-gray-300'
                  }`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">{log.type.replace('_', ' ')}</Badge>
                        {log.severity === 'high' && (
                          <Badge variant="destructive" className="text-xs">High Priority</Badge>
                        )}
                      </div>
                      <div className="font-semibold text-sm mb-1">{log.action}</div>
                      <div className="text-xs text-gray-600 flex items-center gap-3">
                        <span>User: {log.user}</span>
                        <span>•</span>
                        <span>IP: {log.ip}</span>
                        <span>•</span>
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ISO Compliance Mapping */}
          <Card>
            <CardHeader>
              <CardTitle>ISO 27001 Control Mapping</CardTitle>
              <CardDescription>Access control framework alignment with ISO standards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { control: 'A.5 Access Control', status: 'compliant', coverage: 100 },
                  { control: 'A.6 Segregation of Duties', status: 'compliant', coverage: 100 },
                  { control: 'A.9 User Access Management', status: 'compliant', coverage: 100 },
                  { control: 'A.12 Logging & Monitoring', status: 'compliant', coverage: 100 },
                  { control: 'A.16 Incident Management', status: 'compliant', coverage: 100 },
                  { control: 'A.18 Compliance', status: 'compliant', coverage: 100 }
                ].map((control, index) => (
                  <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">{control.control}</span>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <Progress value={control.coverage} className="mb-2" />
                    <div className="flex items-center justify-between text-xs">
                      <Badge variant="default" className="bg-green-600">{control.status}</Badge>
                      <span className="text-gray-600">{control.coverage}% coverage</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}