import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { SearchBar } from '../ui/filters';
import { 
  Shield, 
  Users, 
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Settings,
  CheckCircle
} from 'lucide-react';
import { toast } from '../../lib/toast';

interface Permission {
  id: string;
  name: string;
  description: string;
  module: 'Grow MIP' | 'grow_accounting' | 'pfa';
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

const allPermissions: Permission[] = [
  // Grow MIP permissions
  { id: 'Grow MIP_view_deals', name: 'View Deals', description: 'View all mortgage deals', module: 'Grow MIP', category: 'Deals' },
  { id: 'Grow MIP_create_deals', name: 'Create Deals', description: 'Create new deals', module: 'Grow MIP', category: 'Deals' },
  { id: 'Grow MIP_edit_deals', name: 'Edit Deals', description: 'Edit existing deals', module: 'Grow MIP', category: 'Deals' },
  { id: 'Grow MIP_delete_deals', name: 'Delete Deals', description: 'Delete deals', module: 'Grow MIP', category: 'Deals' },
  
  { id: 'Grow MIP_view_auctions', name: 'View Auctions', description: 'View auction rooms', module: 'Grow MIP', category: 'Auctions' },
  { id: 'Grow MIP_participate_auctions', name: 'Participate in Auctions', description: 'Place bids', module: 'Grow MIP', category: 'Auctions' },
  { id: 'Grow MIP_manage_auctions', name: 'Manage Auctions', description: 'Create/control auctions', module: 'Grow MIP', category: 'Auctions' },
  
  { id: 'Grow MIP_view_contracts', name: 'View Contracts', description: 'View contracts', module: 'Grow MIP', category: 'Contracts' },
  { id: 'Grow MIP_sign_contracts', name: 'Sign Contracts', description: 'E-sign contracts', module: 'Grow MIP', category: 'Contracts' },
  { id: 'Grow MIP_manage_contracts', name: 'Manage Contracts', description: 'Create/edit contracts', module: 'Grow MIP', category: 'Contracts' },
  
  { id: 'Grow MIP_view_escrow', name: 'View Escrow', description: 'View escrow details', module: 'Grow MIP', category: 'Escrow' },
  { id: 'Grow MIP_release_escrow', name: 'Release Escrow', description: 'Release funds', module: 'Grow MIP', category: 'Escrow' },
  
  // Grow Accounting permissions
  { id: 'accounting_view_invoices', name: 'View Invoices', description: 'View all invoices', module: 'grow_accounting', category: 'Invoices' },
  { id: 'accounting_create_invoices', name: 'Create Invoices', description: 'Create new invoices', module: 'grow_accounting', category: 'Invoices' },
  { id: 'accounting_send_invoices', name: 'Send Invoices', description: 'Send invoices to clients', module: 'grow_accounting', category: 'Invoices' },
  { id: 'accounting_delete_invoices', name: 'Delete Invoices', description: 'Delete invoices', module: 'grow_accounting', category: 'Invoices' },
  
  { id: 'accounting_view_bills', name: 'View Bills', description: 'View all bills', module: 'grow_accounting', category: 'Bills' },
  { id: 'accounting_pay_bills', name: 'Pay Bills', description: 'Make payments', module: 'grow_accounting', category: 'Bills' },
  { id: 'accounting_manage_bills', name: 'Manage Bills', description: 'Create/edit bills', module: 'grow_accounting', category: 'Bills' },
  
  { id: 'accounting_view_clients', name: 'View Clients', description: 'View client list', module: 'grow_accounting', category: 'Clients' },
  { id: 'accounting_manage_clients', name: 'Manage Clients', description: 'Add/edit clients', module: 'grow_accounting', category: 'Clients' },
  
  { id: 'accounting_view_reports', name: 'View Reports', description: 'View financial reports', module: 'grow_accounting', category: 'Reports' },
  { id: 'accounting_export_reports', name: 'Export Reports', description: 'Export report data', module: 'grow_accounting', category: 'Reports' },
  
  // PFA permissions
  { id: 'pfa_view_clients', name: 'View Clients', description: 'View client profiles', module: 'pfa', category: 'Clients' },
  { id: 'pfa_manage_clients', name: 'Manage Clients', description: 'Add/edit clients', module: 'pfa', category: 'Clients' },
  { id: 'pfa_view_advice', name: 'View Advice', description: 'View financial advice', module: 'pfa', category: 'Advice' },
  { id: 'pfa_provide_advice', name: 'Provide Advice', description: 'Create financial plans', module: 'pfa', category: 'Advice' }
];

const mockRoles: Role[] = [
  {
    id: 'super_admin',
    name: 'Super Administrator',
    description: 'Full access to all modules and features',
    permissions: allPermissions.map(p => p.id),
    userCount: 2
  },
  {
    id: 'Grow MIP_admin',
    name: 'Grow MIP Administrator',
    description: 'Full access to Grow MIP module',
    permissions: allPermissions.filter(p => p.module === 'Grow MIP').map(p => p.id),
    userCount: 5
  },
  {
    id: 'investor',
    name: 'Investor',
    description: 'Can view and bid on deals',
    permissions: [
      'Grow MIP_view_deals',
      'Grow MIP_view_auctions',
      'Grow MIP_participate_auctions',
      'Grow MIP_view_contracts',
      'Grow MIP_sign_contracts',
      'Grow MIP_view_escrow'
    ],
    userCount: 847
  },
  {
    id: 'accountant',
    name: 'Accountant',
    description: 'Full access to Grow Accounting',
    permissions: allPermissions.filter(p => p.module === 'grow_accounting').map(p => p.id),
    userCount: 12
  },
  {
    id: 'financial_advisor',
    name: 'Financial Advisor',
    description: 'Access to PFA module',
    permissions: allPermissions.filter(p => p.module === 'pfa').map(p => p.id),
    userCount: 45
  }
];

export function AccessControl() {
  const [roles, setRoles] = useState(mockRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');

  const filteredPermissions = allPermissions.filter(permission => {
    if (selectedModule !== 'all' && permission.module !== selectedModule) {
      return false;
    }
    if (searchQuery && 
        !permission.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !permission.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const groupedPermissions = filteredPermissions.reduce((acc, permission) => {
    const key = `${permission.module}-${permission.category}`;
    if (!acc[key]) {
      acc[key] = {
        module: permission.module,
        category: permission.category,
        permissions: []
      };
    }
    acc[key].permissions.push(permission);
    return acc;
  }, {} as Record<string, { module: string; category: string; permissions: Permission[] }>);

  const togglePermission = (roleId: string, permissionId: string) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.includes(permissionId);
        return {
          ...role,
          permissions: hasPermission
            ? role.permissions.filter(p => p !== permissionId)
            : [...role.permissions, permissionId]
        };
      }
      return role;
    }));
    toast.success('Permissions updated');
  };

  const getModuleBadge = (module: string) => {
    const colors = {
      grow_mip: 'bg-indigo-100 text-indigo-700',
      grow_accounting: 'bg-blue-100 text-blue-700',
      pfa: 'bg-green-100 text-green-700'
    };
    return colors[module as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const createRole = () => {
    const newRole: Role = {
      id: `role_${roles.length + 1}`,
      name: newRoleName,
      description: newRoleDescription,
      permissions: [],
      userCount: 0
    };
    setRoles([...roles, newRole]);
    setSelectedRole(newRole);
    setShowCreateModal(false);
    toast.success('Role created');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Access Control</h1>
          <p className="text-gray-600">Manage roles and permissions across all modules</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowCreateModal(true)}>
          <Shield className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Roles</span>
              <Shield className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
            <p className="text-xs text-gray-500 mt-1">Active role configurations</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Permissions</span>
              <Lock className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{allPermissions.length}</p>
            <p className="text-xs text-gray-500 mt-1">Across all modules</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Users Assigned</span>
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {roles.reduce((sum, role) => sum + role.userCount, 0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">With role assignments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <Card className="lg:col-span-1">
          <CardHeader className="border-b">
            <CardTitle>Roles</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                    selectedRole?.id === role.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{role.name}</h3>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {role.userCount}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{role.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {role.permissions.length} permissions
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Permissions Grid */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>
                {selectedRole ? `${selectedRole.name} Permissions` : 'Select a role'}
              </CardTitle>
              {selectedRole && (
                <div className="flex gap-2">
                  <select
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg"
                  >
                    <option value="all">All Modules</option>
                    <option value="Grow MIP">Grow MIP</option>
                    <option value="grow_accounting">Grow Accounting</option>
                    <option value="pfa">PFA</option>
                  </select>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {!selectedRole ? (
              <div className="text-center py-12">
                <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Select a role to view and edit permissions</p>
              </div>
            ) : (
              <div className="space-y-6">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search permissions..."
                />

                {Object.values(groupedPermissions).map((group) => (
                  <div key={`${group.module}-${group.category}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getModuleBadge(group.module)}`}>
                        {group.module.replace('_', ' ')}
                      </span>
                      <h3 className="font-semibold text-gray-900">{group.category}</h3>
                    </div>
                    <div className="space-y-2">
                      {group.permissions.map((permission) => {
                        const hasPermission = selectedRole.permissions.includes(permission.id);
                        return (
                          <div
                            key={permission.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">{permission.name}</h4>
                              <p className="text-xs text-gray-600">{permission.description}</p>
                            </div>
                            <button
                              onClick={() => togglePermission(selectedRole.id, permission.id)}
                              className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                                hasPermission
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }`}
                            >
                              {hasPermission ? (
                                <>
                                  <CheckCircle className="w-4 h-4" />
                                  <span className="text-xs font-semibold">Enabled</span>
                                </>
                              ) : (
                                <>
                                  <Lock className="w-4 h-4" />
                                  <span className="text-xs font-semibold">Disabled</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Create New Role</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Role Name</label>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button className="bg-gray-500 hover:bg-gray-600 mr-2" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={createRole}>
                Create Role
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
