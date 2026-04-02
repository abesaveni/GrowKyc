import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  ArrowLeft,
  Shield,
  Users,
  Lock,
  CheckCircle,
  XCircle,
  Search,
  Plus,
  Settings,
  Eye,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';

interface AdvancedRBACProps {
  onBack: () => void;
}

export function AdvancedRBAC({ onBack }: AdvancedRBACProps) {
  const [selectedTab, setSelectedTab] = useState<'roles' | 'permissions' | 'users'>('roles');

  const roles = [
    {
      id: 'role-1',
      name: 'Super Admin',
      description: 'Full system access across all organizations',
      users: 3,
      permissions: 58,
      builtIn: true,
      color: 'red'
    },
    {
      id: 'role-2',
      name: 'Compliance Officer',
      description: 'Review and approve KYC, generate reports',
      users: 24,
      permissions: 42,
      builtIn: true,
      color: 'blue'
    },
    {
      id: 'role-3',
      name: 'Analyst',
      description: 'Conduct screening, upload documents, data entry',
      users: 89,
      permissions: 28,
      builtIn: true,
      color: 'green'
    },
    {
      id: 'role-4',
      name: 'Auditor (Read-Only)',
      description: 'View-only access for compliance auditing',
      users: 15,
      permissions: 18,
      builtIn: true,
      color: 'purple'
    },
    {
      id: 'role-5',
      name: 'Custom: Senior Reviewer',
      description: 'Custom role for senior client reviewers',
      users: 12,
      permissions: 35,
      builtIn: false,
      color: 'amber'
    }
  ];

  const permissionCategories = [
    {
      name: 'Client Management',
      permissions: [
        { id: 'client.create', name: 'Create clients', enabled: true },
        { id: 'client.read', name: 'View client details', enabled: true },
        { id: 'client.update', name: 'Edit client information', enabled: true },
        { id: 'client.delete', name: 'Delete clients', enabled: false },
        { id: 'client.approve', name: 'Approve client onboarding', enabled: true },
        { id: 'client.export', name: 'Export client data', enabled: true }
      ]
    },
    {
      name: 'Screening & Risk',
      permissions: [
        { id: 'screening.run', name: 'Run sanctions screening', enabled: true },
        { id: 'screening.override', name: 'Override screening results', enabled: false },
        { id: 'risk.view', name: 'View risk scores', enabled: true },
        { id: 'risk.adjust', name: 'Manually adjust risk scores', enabled: false }
      ]
    },
    {
      name: 'Documents',
      permissions: [
        { id: 'doc.upload', name: 'Upload documents', enabled: true },
        { id: 'doc.view', name: 'View documents', enabled: true },
        { id: 'doc.delete', name: 'Delete documents', enabled: false },
        { id: 'doc.verify', name: 'Verify document authenticity', enabled: true }
      ]
    },
    {
      name: 'Reports & Compliance',
      permissions: [
        { id: 'report.view', name: 'View reports', enabled: true },
        { id: 'report.generate', name: 'Generate custom reports', enabled: true },
        { id: 'report.export', name: 'Export reports', enabled: true },
        { id: 'compliance.file', name: 'File AUSTRAC reports', enabled: false }
      ]
    },
    {
      name: 'System Administration',
      permissions: [
        { id: 'user.create', name: 'Create users', enabled: false },
        { id: 'user.edit', name: 'Edit user permissions', enabled: false },
        { id: 'org.settings', name: 'Modify organization settings', enabled: false },
        { id: 'api.manage', name: 'Manage API keys', enabled: false },
        { id: 'audit.view', name: 'View audit logs', enabled: true }
      ]
    },
    {
      name: 'Data Access',
      permissions: [
        { id: 'data.pii', name: 'Access PII (names, DOB, etc)', enabled: true },
        { id: 'data.financial', name: 'Access financial data', enabled: true },
        { id: 'data.internal', name: 'Access internal notes', enabled: false },
        { id: 'data.all-orgs', name: 'Cross-organization data access', enabled: false }
      ]
    }
  ];

  const users = [
    { name: 'Sarah Chen', role: 'Compliance Officer', status: 'active', lastActive: '2 mins ago' },
    { name: 'James Wilson', role: 'Analyst', status: 'active', lastActive: '15 mins ago' },
    { name: 'Maria Garcia', role: 'Senior Reviewer', status: 'active', lastActive: '1 hour ago' },
    { name: 'David Kim', role: 'Auditor', status: 'active', lastActive: '3 hours ago' },
    { name: 'Emma Brown', role: 'Analyst', status: 'inactive', lastActive: '2 days ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-12">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-white hover:bg-white/20 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2">Advanced RBAC System</h1>
            <p className="text-white/90 text-xl">58 permissions • Custom role builder • Field-level security</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-white" />
              <div className="text-sm text-white/80">Total Roles</div>
            </div>
            <div className="text-4xl font-bold mb-1">{roles.length}</div>
            <div className="text-xs text-white/70">4 built-in, 1 custom</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Lock className="w-6 h-6 text-white" />
              <div className="text-sm text-white/80">Permissions</div>
            </div>
            <div className="text-4xl font-bold mb-1">58</div>
            <div className="text-xs text-white/70">Granular control</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6 text-white" />
              <div className="text-sm text-white/80">Users</div>
            </div>
            <div className="text-4xl font-bold mb-1">143</div>
            <div className="text-xs text-white/70">Across all roles</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-6 h-6 text-white" />
              <div className="text-sm text-white/80">Active Sessions</div>
            </div>
            <div className="text-4xl font-bold mb-1">87</div>
            <div className="text-xs text-white/70">Right now</div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex items-center gap-3 mb-8">
          <Button
            variant={selectedTab === 'roles' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('roles')}
          >
            <Shield className="w-4 h-4 mr-2" />
            Roles
          </Button>
          <Button
            variant={selectedTab === 'permissions' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('permissions')}
          >
            <Lock className="w-4 h-4 mr-2" />
            Permissions
          </Button>
          <Button
            variant={selectedTab === 'users' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('users')}
          >
            <Users className="w-4 h-4 mr-2" />
            Users
          </Button>
        </div>

        {/* Roles Tab */}
        {selectedTab === 'roles' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">User Roles</h2>
                <p className="text-gray-600">Pre-built and custom roles with granular permissions</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Custom Role
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {roles.map((role) => (
                <Card key={role.id} className={`border-2 ${role.builtIn ? 'border-gray-200' : 'border-amber-200 bg-amber-50'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{role.name}</h3>
                          {role.builtIn && (
                            <Badge variant="outline">Built-in</Badge>
                          )}
                          {!role.builtIn && (
                            <Badge className="bg-amber-600 text-white">Custom</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4">{role.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-600">{role.users} users</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-600">{role.permissions} permissions</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-6">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        {!role.builtIn && (
                          <>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              <Copy className="w-4 h-4 mr-2" />
                              Clone
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Permissions Tab */}
        {selectedTab === 'permissions' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Permission Categories</h2>
              <p className="text-gray-600">58 granular permissions across 6 categories</p>
            </div>

            {permissionCategories.map((category, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.permissions.length} permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {category.permissions.map((perm) => (
                      <div key={perm.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          {perm.enabled ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-gray-400" />
                          )}
                          <div>
                            <div className="font-semibold text-gray-900">{perm.name}</div>
                            <div className="text-xs text-gray-500 font-mono">{perm.id}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Users Tab */}
        {selectedTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  placeholder="Search users..." 
                  className="pl-10"
                />
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Active</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">{user.name}</div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline">{user.role}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={user.status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{user.lastActive}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600">
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
          </div>
        )}

        {/* Feature Highlights */}
        <Card className="mt-12 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <CardHeader>
            <CardTitle>Advanced RBAC Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Granular Control</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    58 distinct permissions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Field-level data access control
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Cross-organization access policies
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-3">Custom Roles</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Build unlimited custom roles
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Clone and modify existing roles
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Role templates for industries
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-3">Audit & Compliance</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Complete audit trail of permission changes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Session monitoring and controls
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    SOC 2 and ISO 27001 compliant
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
