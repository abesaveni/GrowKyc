import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { EmptyState } from '../ui/empty-state';
import { SearchBar, FiltersBar, SortBar } from '../ui/filters';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  Plus,
  Users,
  Shield,
  Edit,
  Trash2,
  MoreVertical,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { toast } from '../../lib/toast';
import { useConfirmDialog } from '../ui/confirm-dialog';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'user' | 'viewer';
  modules: Array<'Grow MIP' | 'grow_accounting' | 'pfa' | 'grow_hq'>;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
}

const mockUsers: User[] = [
  {
    id: 'USR-001',
    name: 'Admin User',
    email: 'admin@grow.com',
    role: 'super_admin',
    modules: ['Grow MIP', 'grow_accounting', 'pfa', 'grow_hq'],
    status: 'active',
    lastLogin: '2024-02-13 14:23',
    createdAt: '2024-01-01'
  },
  {
    id: 'USR-002',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'user',
    modules: ['Grow MIP'],
    status: 'active',
    lastLogin: '2024-02-13 12:15',
    createdAt: '2024-01-15'
  },
  {
    id: 'USR-003',
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    role: 'admin',
    modules: ['grow_accounting'],
    status: 'active',
    lastLogin: '2024-02-12 16:45',
    createdAt: '2024-01-20'
  },
  {
    id: 'USR-004',
    name: 'Michael Brown',
    email: 'mbrown@business.com',
    role: 'user',
    modules: ['Grow MIP', 'grow_accounting'],
    status: 'inactive',
    lastLogin: '2024-01-28 09:30',
    createdAt: '2024-01-10'
  },
  {
    id: 'USR-005',
    name: 'Emily Davis',
    email: 'emily.davis@corp.com',
    role: 'viewer',
    modules: ['grow_accounting'],
    status: 'active',
    lastLogin: '2024-02-13 11:20',
    createdAt: '2024-02-01'
  }
];

export function UserManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { confirm, Dialog } = useConfirmDialog();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as User['role'],
    modules: [] as Array<'Grow MIP' | 'grow_accounting' | 'pfa' | 'grow_hq'>
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user => {
    if (searchQuery && 
        !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !user.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.role && user.role !== filters.role) {
      return false;
    }
    if (filters.status && user.status !== filters.status) {
      return false;
    }
    return true;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aVal, bVal;
    if (sortBy === 'name') {
      aVal = a.name;
      bVal = b.name;
    } else if (sortBy === 'lastLogin') {
      aVal = new Date(a.lastLogin).getTime();
      bVal = new Date(b.lastLogin).getTime();
    } else {
      aVal = a.role;
      bVal = b.role;
    }
    
    return sortDirection === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });

  const getRoleBadge = (role: User['role']) => {
    const config = {
      super_admin: { label: 'Super Admin', className: 'bg-purple-100 text-purple-700' },
      admin: { label: 'Admin', className: 'bg-blue-100 text-blue-700' },
      user: { label: 'User', className: 'bg-green-100 text-green-700' },
      viewer: { label: 'Viewer', className: 'bg-gray-100 text-gray-700' }
    };
    
    const { label, className } = config[role];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${className}`}>
        {label}
      </span>
    );
  };

  const getStatusIcon = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'inactive':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'suspended':
        return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const handleDeleteUser = async (user: User) => {
    await confirm({
      title: 'Delete User?',
      description: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      variant: 'danger',
      confirmLabel: 'Delete User',
      onConfirm: () => {
        setUsers(users.filter(u => u.id !== user.id));
        toast.success('User deleted successfully');
      }
    });
  };

  const handleSuspendUser = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' as User['status'] } : u
    ));
    toast.success('User status updated');
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const user: User = {
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      modules: newUser.modules,
      status: 'active',
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setUsers([...users, user]);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', role: 'user', modules: [] });
    toast.success('User added successfully');
  };

  const toggleModule = (module: 'Grow MIP' | 'grow_accounting' | 'pfa' | 'grow_hq') => {
    setNewUser(prev => ({
      ...prev,
      modules: prev.modules.includes(module)
        ? prev.modules.filter(m => m !== module)
        : [...prev.modules, module]
    }));
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;
    
    if (!editingUser.name || !editingUser.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setShowEditModal(false);
    setEditingUser(null);
    toast.success('User updated successfully');
  };

  const toggleEditModule = (module: 'Grow MIP' | 'grow_accounting' | 'pfa' | 'grow_hq') => {
    if (!editingUser) return;
    setEditingUser({
      ...editingUser,
      modules: editingUser.modules.includes(module)
        ? editingUser.modules.filter(m => m !== module)
        : [...editingUser.modules, module]
    });
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admins: users.filter(u => u.role === 'admin' || u.role === 'super_admin').length,
    suspended: users.filter(u => u.status === 'suspended').length
  };

  return (
    <div className="space-y-6">
      {Dialog}
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage users and their access across all modules</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Users</span>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-500 mt-1">Across all modules</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Active Users</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            <p className="text-xs text-green-600 mt-1">{((stats.active / stats.total) * 100).toFixed(0)}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Administrators</span>
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.admins}</p>
            <p className="text-xs text-blue-600 mt-1">With elevated access</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Suspended</span>
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.suspended}</p>
            <p className="text-xs text-red-600 mt-1">Requires review</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search users by name or email..."
          />
        </div>
        <SortBar
          options={[
            { label: 'Name', value: 'name' },
            { label: 'Last Login', value: 'lastLogin' },
            { label: 'Role', value: 'role' }
          ]}
          value={sortBy}
          onChange={setSortBy}
          direction={sortDirection}
          onDirectionChange={setSortDirection}
        />
      </div>

      <FiltersBar
        filters={[
          {
            id: 'role',
            label: 'Role',
            type: 'select',
            options: [
              { label: 'Super Admin', value: 'super_admin' },
              { label: 'Admin', value: 'admin' },
              { label: 'User', value: 'user' },
              { label: 'Viewer', value: 'viewer' }
            ]
          },
          {
            id: 'status',
            label: 'Status',
            type: 'select',
            options: [
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
              { label: 'Suspended', value: 'suspended' }
            ]
          }
        ]}
        onFilterChange={(id, value) => setFilters({ ...filters, [id]: value })}
        onClearAll={() => setFilters({})}
        activeFilters={filters}
      />

      {/* Users Table */}
      {sortedUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description={searchQuery || Object.keys(filters).length > 0 
            ? "No users match your search criteria. Try adjusting your filters."
            : "No users have been added yet. Click 'Add User' to get started."
          }
          actionLabel="Add User"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">User</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Role</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Modules</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Last Login</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-indigo-100 text-indigo-700">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.modules.map((module) => (
                            <span
                              key={module}
                              className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                              {module.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(user.status)}
                          <span className="text-sm text-gray-600 capitalize">{user.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {user.lastLogin}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSuspendUser(user.id)}
                          >
                            {user.status === 'suspended' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                          </Button>
                          {user.role !== 'super_admin' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Add New User</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                  âœ•
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User['role'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Module Access
                  </label>
                  <div className="space-y-2">
                    {(['Grow MIP', 'grow_accounting', 'pfa', 'grow_hq'] as const).map((module) => (
                      <label
                        key={module}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={newUser.modules.includes(module)}
                          onChange={() => toggleModule(module)}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {module.replace('_', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={handleAddUser}
                  >
                    Add User
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Edit User</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowEditModal(false)}>
                  âœ•
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Role
                  </label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as User['role'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Module Access
                  </label>
                  <div className="space-y-2">
                    {(['Grow MIP', 'grow_accounting', 'pfa', 'grow_hq'] as const).map((module) => (
                      <label
                        key={module}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={editingUser.modules.includes(module)}
                          onChange={() => toggleEditModule(module)}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {module.replace('_', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={handleUpdateUser}
                  >
                    Update User
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
