import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { toast } from '../../lib/toast';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { EmptyState } from '../ui/empty-state';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { 
  Users, 
  Search, 
  Plus,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Download,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'borrower' | 'lender' | 'investor' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  kycStatus: 'approved' | 'pending' | 'rejected';
  joinedDate: Date;
  lastActive: Date;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    role: 'investor',
    status: 'active',
    kycStatus: 'approved',
    joinedDate: new Date('2024-01-15'),
    lastActive: new Date()
  },
  {
    id: '2',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@example.com',
    role: 'borrower',
    status: 'active',
    kycStatus: 'approved',
    joinedDate: new Date('2024-02-01'),
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '3',
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    role: 'lender',
    status: 'active',
    kycStatus: 'pending',
    joinedDate: new Date('2024-02-10'),
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: '4',
    name: 'Emma Thompson',
    email: 'emma.thompson@example.com',
    role: 'investor',
    status: 'suspended',
    kycStatus: 'rejected',
    joinedDate: new Date('2024-01-20'),
    lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: '5',
    name: 'James Anderson',
    email: 'james.anderson@example.com',
    role: 'admin',
    status: 'active',
    kycStatus: 'approved',
    joinedDate: new Date('2023-12-01'),
    lastActive: new Date(Date.now() - 30 * 60 * 1000)
  }
];

export function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirmAction, setConfirmAction] = useState<{
    open: boolean;
    type: 'delete' | 'suspend' | 'activate' | null;
    user: User | null;
  }>({ open: false, type: null, user: null });

  // Filter users
  const filteredUsers = users.filter(user => {
    const searchMatch = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const roleMatch = roleFilter === 'all' || user.role === roleFilter;
    const statusMatch = statusFilter === 'all' || user.status === statusFilter;
    
    return searchMatch && roleMatch && statusMatch;
  });

  // Calculate stats
  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingKYC = users.filter(u => u.kycStatus === 'pending').length;
  const suspendedUsers = users.filter(u => u.status === 'suspended').length;

  const handleSuspendUser = (user: User) => {
    setConfirmAction({ open: true, type: 'suspend', user });
  };

  const handleActivateUser = (user: User) => {
    setConfirmAction({ open: true, type: 'activate', user });
  };

  const handleDeleteUser = (user: User) => {
    setConfirmAction({ open: true, type: 'delete', user });
  };

  const handleConfirmAction = async () => {
    if (!confirmAction.user) return;

    const { type, user } = confirmAction;
    setConfirmAction({ open: false, type: null, user: null });

    toast.loading(`Processing...`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (type === 'delete') {
      setUsers(users.filter(u => u.id !== user.id));
      toast.success(`User deleted - ${user.name} removed from platform`);
    } else if (type === 'suspend') {
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, status: 'suspended' as const } : u
      ));
      toast.success(`User suspended - ${user.name} account suspended`);
    } else if (type === 'activate') {
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, status: 'active' as const } : u
      ));
      toast.success(`User activated - ${user.name} account activated`);
    }
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    const user = users.find(u => u.id === userId);
    setUsers(users.map(u =>
      u.id === userId ? { ...u, role: newRole as any } : u
    ));
    toast.success(`Role updated - ${user?.name} is now ${newRole}`);
  };

  const handleExport = () => {
    toast.info('Preparing export...');
    setTimeout(() => {
      toast.success(`Users exported - ${filteredUsers.length} users exported to CSV`);
    }, 1000);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setStatusFilter('all');
    toast.info('Filters cleared');
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '#' },
    { label: 'Admin', href: '#' },
    { label: 'User Management' }
  ];

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-amber-100 text-amber-800'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getKYCBadge = (kycStatus: string) => {
    const colors = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-amber-100 text-amber-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[kycStatus as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-semibold text-gray-900">{users.length}</p>
                <p className="text-xs text-gray-500 mt-1">All platform users</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Users</p>
                <p className="text-3xl font-semibold text-gray-900">{activeUsers}</p>
                <p className="text-xs text-gray-500 mt-1">Currently active</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending KYC</p>
                <p className="text-3xl font-semibold text-gray-900">{pendingKYC}</p>
                <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <Shield className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Suspended</p>
                <p className="text-3xl font-semibold text-gray-900">{suspendedUsers}</p>
                <p className="text-xs text-gray-500 mt-1">Access restricted</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users ({filteredUsers.length})</CardTitle>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="pl-9 w-64"
                />
              </div>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Roles</option>
                <option value="borrower">Borrower</option>
                <option value="lender">Lender</option>
                <option value="investor">Investor</option>
                <option value="admin">Admin</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>

              {/* Actions */}
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No users found"
              description={
                searchQuery || roleFilter !== 'all' || statusFilter !== 'all'
                  ? "No users match your filters"
                  : "No users have been registered yet"
              }
              action={{
                label: 'Clear Filters',
                onClick: handleClearFilters
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>KYC</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow 
                      key={user.id} 
                      className="hover:bg-gray-50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">ID: {user.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-700">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary capitalize"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="borrower">Borrower</option>
                          <option value="lender">Lender</option>
                          <option value="investor">Investor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.status)}
                      </TableCell>
                      <TableCell>
                        {getKYCBadge(user.kycStatus)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {format(user.joinedDate, 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {format(user.lastActive, 'dd MMM, HH:mm')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              // In production, navigate to user detail page
                              // For now, show basic info
                              alert(`User: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nStatus: ${user.status}`);\n                            }}
                            title="View User"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          {user.status === 'active' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuspendUser(user)}
                              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                              title="Suspend User"
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleActivateUser(user)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              title="Activate User"
                            >
                              <UserCheck className="w-4 h-4" />
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirm Action Dialog */}
      <ConfirmDialog
        open={confirmAction.open}
        onOpenChange={(open) => setConfirmAction({ ...confirmAction, open })}
        title={
          confirmAction.type === 'delete' ? 'Delete User?' :
          confirmAction.type === 'suspend' ? 'Suspend User?' :
          'Activate User?'
        }
        description={
          confirmAction.type === 'delete' 
            ? `Are you sure you want to permanently delete ${confirmAction.user?.name}? This will remove all their data and cannot be undone.`
            : confirmAction.type === 'suspend'
            ? `Are you sure you want to suspend ${confirmAction.user?.name}? They will lose access to the platform immediately.`
            : `Are you sure you want to activate ${confirmAction.user?.name}? They will regain access to the platform.`
        }
        confirmLabel={
          confirmAction.type === 'delete' ? 'Delete User' :
          confirmAction.type === 'suspend' ? 'Suspend User' :
          'Activate User'
        }
        onConfirm={handleConfirmAction}
        variant={confirmAction.type === 'delete' || confirmAction.type === 'suspend' ? 'destructive' : 'default'}
      />
    </div>
  );
}