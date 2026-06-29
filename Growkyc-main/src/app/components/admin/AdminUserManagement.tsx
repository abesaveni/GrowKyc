import React, { useState, useEffect, useCallback } from 'react';
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
  Eye,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Download,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';

interface RoleOption {
  value: string;
  label: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;        // canonical backend role value, e.g. "Compliance_Officer"
  roleLabel: string;   // human label, e.g. "Compliance Officer"
  status: 'active' | 'suspended';
  kycStatus: 'approved' | 'pending';
  joinedDate: Date;
}

function getAuthHeader(): Record<string, string> {
  const token = sessionStorage.getItem('growkyc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function mapBackendUser(u: any): User {
  return {
    id: String(u.id),
    name: u.name || u.email,
    email: u.email,
    role: u.role || 'User',
    roleLabel: u.role_label || u.role || 'User',
    status: u.is_active ? 'active' : 'suspended',
    kycStatus: u.verified ? 'approved' : 'pending',
    joinedDate: new Date(u.created_at),
  };
}

export function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirmAction, setConfirmAction] = useState<{
    open: boolean;
    type: 'delete' | 'suspend' | 'activate' | null;
    user: User | null;
  }>({ open: false, type: null, user: null });

  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', role: '' });

  const roleLabelFor = useCallback(
    (value: string) => roles.find(r => r.value === value)?.label || value,
    [roles]
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/v1/admin/roles', {
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        });
        if (res.ok) setRoles(await res.json());
      } catch { /* roles are best-effort; dropdown falls back to raw values */ }
    })();
  }, []);

  const handleCreateUser = async () => {
    const { name, email, password, role } = createForm;
    if (!name || !email || !password || !role) {
      toast.error('All fields are required');
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/v1/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ name, email, password, role }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(typeof err?.detail === 'string' ? err.detail : `Create failed (${res.status})`);
      }
      toast.success(`${name} created as ${roleLabelFor(role)}`);
      setShowCreate(false);
      setCreateForm({ name: '', email: '', password: '', role: '' });
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/users?limit=100', {
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(typeof err?.detail === 'string' ? err.detail : `Failed to load users (${res.status})`);
      }
      const data = await res.json();
      setUsers((data.items || []).map(mapBackendUser));
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filteredUsers = users.filter(user => {
    const searchMatch = searchQuery === '' ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const roleMatch = roleFilter === 'all' || user.role === roleFilter;
    const statusMatch = statusFilter === 'all' || user.status === statusFilter;
    return searchMatch && roleMatch && statusMatch;
  });

  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingKYC = users.filter(u => u.kycStatus === 'pending').length;
  const suspendedUsers = users.filter(u => u.status === 'suspended').length;

  const handleSuspendUser = (user: User) => setConfirmAction({ open: true, type: 'suspend', user });
  const handleActivateUser = (user: User) => setConfirmAction({ open: true, type: 'activate', user });
  const handleDeleteUser = (user: User) => setConfirmAction({ open: true, type: 'delete', user });

  const handleConfirmAction = async () => {
    if (!confirmAction.user) return;
    const { type, user } = confirmAction;
    setConfirmAction({ open: false, type: null, user: null });

    try {
      if (type === 'delete') {
        const res = await fetch(`/api/v1/admin/users/${user.id}`, {
          method: 'DELETE',
          headers: getAuthHeader(),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(typeof err?.detail === 'string' ? err.detail : `Delete failed (${res.status})`);
        }
        setUsers(prev => prev.filter(u => u.id !== user.id));
        toast.success(`${user.name} permanently deleted`);
      } else {
        const res = await fetch(`/api/v1/admin/users/${user.id}/toggle-active`, {
          method: 'POST',
          headers: getAuthHeader(),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(typeof err?.detail === 'string' ? err.detail : `Action failed (${res.status})`);
        }
        const data = await res.json();
        const newStatus: User['status'] = data.is_active ? 'active' : 'suspended';
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
        toast.success(`${user.name} ${newStatus === 'active' ? 'activated' : 'suspended'}`);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Action failed');
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const user = users.find(u => u.id === userId);
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(typeof err?.detail === 'string' ? err.detail : `Role update failed (${res.status})`);
      }
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole as User['role'] } : u));
      toast.success(`${user?.name} role updated to ${newRole}`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update role');
    }
  };

  const handleExport = () => {
    const rows = [
      ['ID', 'Name', 'Email', 'Role', 'Status', 'KYC', 'Joined'],
      ...filteredUsers.map(u => [
        u.id, `"${u.name}"`, u.email, u.role, u.status, u.kycStatus,
        format(u.joinedDate, 'dd/MM/yyyy'),
      ]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${filteredUsers.length} users exported to CSV`);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setStatusFilter('all');
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '#' },
    { label: 'Admin', href: '#' },
    { label: 'User Management' },
  ];

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-500/15 text-green-300',
      suspended: 'bg-red-500/15 text-red-300',
      pending: 'bg-amber-500/15 text-amber-300',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[status] || 'bg-white/5 text-slate-100'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getKYCBadge = (kycStatus: string) => {
    const colors: Record<string, string> = {
      approved: 'bg-green-500/15 text-green-300',
      pending: 'bg-amber-500/15 text-amber-300',
      rejected: 'bg-red-500/15 text-red-300',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[kycStatus] || 'bg-white/5 text-slate-100'}`}>
        {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header + Create User */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">User Management</h1>
          <p className="text-sm text-slate-400">Create users and assign compliance roles.</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <UserCheck className="w-4 h-4 mr-2" />
          Create User
        </Button>
      </div>

      {/* Create User modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => !creating && setShowCreate(false)}>
          <div className="bg-[#1e293b] border border-white/10 rounded-lg shadow-2xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-white">Create User</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-300">Full name</label>
                <Input value={createForm.name} onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))} placeholder="Jane Smith" />
              </div>
              <div>
                <label className="text-sm text-slate-300">Email</label>
                <Input type="email" value={createForm.email} onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@firm.com" />
              </div>
              <div>
                <label className="text-sm text-slate-300">Temporary password</label>
                <Input type="password" value={createForm.password} onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 12 chars, 1 special" />
              </div>
              <div>
                <label className="text-sm text-slate-300">Role</label>
                <select
                  className="w-full border border-white/10 bg-[#0f172a] text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#13B5EA]/30"
                  value={createForm.role}
                  onChange={e => setCreateForm(f => ({ ...f, role: e.target.value }))}
                >
                  <option value="">Select a role…</option>
                  {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowCreate(false)} disabled={creating}>Cancel</Button>
              <Button onClick={handleCreateUser} disabled={creating}>
                {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Create
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Users</p>
                <p className="text-3xl font-semibold text-white">{users.length}</p>
                <p className="text-xs text-slate-400 mt-1">All platform users</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Active Users</p>
                <p className="text-3xl font-semibold text-white">{activeUsers}</p>
                <p className="text-xs text-slate-400 mt-1">Currently active</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Pending KYC</p>
                <p className="text-3xl font-semibold text-white">{pendingKYC}</p>
                <p className="text-xs text-slate-400 mt-1">Awaiting review</p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <Shield className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Suspended</p>
                <p className="text-3xl font-semibold text-white">{suspendedUsers}</p>
                <p className="text-xs text-slate-400 mt-1">Access restricted</p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-lg">
                <UserX className="w-6 h-6 text-red-400" />
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
            <div className="flex items-center gap-3 flex-wrap">
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

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-white/10 bg-[#1e293b] text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#13B5EA]/30"
              >
                <option value="all">All Roles</option>
                {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-white/10 bg-[#1e293b] text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#13B5EA]/30"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>

              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear
              </Button>

              <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              <Button variant="outline" size="sm" onClick={handleExport} disabled={filteredUsers.length === 0}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              <span className="ml-3 text-slate-400">Loading users...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No users found"
              description={
                searchQuery || roleFilter !== 'all' || statusFilter !== 'all'
                  ? 'No users match your filters'
                  : 'No users have been registered yet'
              }
              action={{ label: 'Clear Filters', onClick: handleClearFilters }}
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-white/5">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-white">{user.name}</p>
                            <p className="text-xs text-slate-400">ID: {user.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-slate-300">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="px-2 py-1 border border-white/10 bg-[#1e293b] text-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#13B5EA]/30"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Ensure the user's current role is selectable even if
                              not in the assignable list (e.g. legacy roles). */}
                          {!roles.some(r => r.value === user.role) && (
                            <option value={user.role}>{user.roleLabel}</option>
                          )}
                          {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{getKYCBadge(user.kycStatus)}</TableCell>
                      <TableCell className="text-sm text-slate-400">
                        {format(user.joinedDate, 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => alert(`User: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nStatus: ${user.status}`)}
                            title="View User"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          {user.status === 'active' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuspendUser(user)}
                              className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                              title="Suspend User"
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleActivateUser(user)}
                              className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                              title="Activate User"
                            >
                              <UserCheck className="w-4 h-4" />
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
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
            ? `Are you sure you want to permanently delete ${confirmAction.user?.name}? This cannot be undone.`
            : confirmAction.type === 'suspend'
            ? `Are you sure you want to suspend ${confirmAction.user?.name}? They will lose access immediately.`
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
