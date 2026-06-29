import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { toast } from '../../lib/toast';
import {
  ArrowLeft,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Shield,
  AlertTriangle,
  Briefcase,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';

interface PendingUser {
  id: string;
  name: string;
  email: string;
  role: string;
  verified: boolean;
  joinedDate: Date;
}

interface UserApprovalQueueProps {
  onBack: () => void;
}

function getAuthHeader(): Record<string, string> {
  const token = sessionStorage.getItem('growkyc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function UserApprovalQueue({ onBack }: UserApprovalQueueProps) {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [approvedToday, setApprovedToday] = useState(0);
  const [rejectedToday, setRejectedToday] = useState(0);

  const fetchPendingUsers = useCallback(async () => {
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
      const inactive = (data.items || [])
        .filter((u: any) => !u.is_active)
        .map((u: any): PendingUser => ({
          id: String(u.id),
          name: u.name || u.email,
          email: u.email,
          role: (u.role || 'user').toLowerCase(),
          verified: u.verified || false,
          joinedDate: new Date(u.created_at),
        }));
      setPendingUsers(inactive);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load pending users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPendingUsers(); }, [fetchPendingUsers]);

  const handleApprove = async (user: PendingUser) => {
    setProcessingId(user.id);
    try {
      const res = await fetch(`/api/v1/admin/users/${user.id}/toggle-active`, {
        method: 'POST',
        headers: getAuthHeader(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(typeof err?.detail === 'string' ? err.detail : `Approve failed (${res.status})`);
      }
      setPendingUsers(prev => prev.filter(u => u.id !== user.id));
      setApprovedToday(n => n + 1);
      toast.success(`${user.name} approved — access granted`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to approve user');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (user: PendingUser) => {
    setProcessingId(user.id);
    try {
      const res = await fetch(`/api/v1/admin/users/${user.id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(typeof err?.detail === 'string' ? err.detail : `Reject failed (${res.status})`);
      }
      setPendingUsers(prev => prev.filter(u => u.id !== user.id));
      setRejectedToday(n => n + 1);
      toast.success(`${user.name} rejected and removed`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reject user');
    } finally {
      setProcessingId(null);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-600 text-white';
      case 'agent': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white px-8 py-12">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-white hover:bg-white/20 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin
        </Button>

        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
            <Users className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2">User Approval Queue</h1>
            <p className="text-white/90 text-xl">Review pending accounts • Verify credentials • Approve access</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Pending Review</div>
            </div>
            <div className="text-4xl font-bold mb-1">{pendingUsers.length}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Approved This Session</div>
            </div>
            <div className="text-4xl font-bold mb-1">{approvedToday}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Rejected This Session</div>
            </div>
            <div className="text-4xl font-bold mb-1">{rejectedToday}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Email Verified</div>
            </div>
            <div className="text-4xl font-bold mb-1">
              {pendingUsers.filter(u => u.verified).length}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Pending Accounts ({pendingUsers.length})
          </h2>
          <Button variant="outline" size="sm" onClick={fetchPendingUsers} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-3 text-gray-500">Loading pending users...</span>
          </div>
        ) : pendingUsers.length === 0 ? (
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-900 mb-2">All clear!</h3>
              <p className="text-green-700">No pending accounts require review at this time.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {pendingUsers.map((user) => {
              const isProcessing = processingId === user.id;
              const hasRisk = !user.verified;

              return (
                <Card
                  key={user.id}
                  className={`border-2 ${hasRisk ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${hasRisk ? 'bg-red-100' : 'bg-green-100'}`}>
                          <Users className={`w-8 h-8 ${hasRisk ? 'text-red-600' : 'text-green-600'}`} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
                            <Badge className={getRoleBadgeColor(user.role)}>
                              {user.role}
                            </Badge>
                            {hasRisk && (
                              <Badge className="bg-amber-600 text-white">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Email not verified
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-6 mb-4">
                            <div>
                              <div className="text-xs text-gray-600 mb-1">Email</div>
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span className="font-semibold text-gray-900">{user.email}</span>
                                {user.verified ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-600" />
                                )}
                              </div>
                            </div>

                            <div>
                              <div className="text-xs text-gray-600 mb-1">User ID</div>
                              <div className="font-semibold text-gray-900">#{user.id}</div>
                            </div>

                            <div>
                              <div className="text-xs text-gray-600 mb-1">Registered</div>
                              <div className="font-semibold text-gray-900">
                                {format(user.joinedDate, 'dd MMM yyyy, HH:mm')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-6">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(user)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          )}
                          Approve
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 border-red-300"
                          onClick={() => handleReject(user)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4 mr-2" />
                          )}
                          Reject
                        </Button>

                        {!hasRisk && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleApprove(user)}
                            disabled={isProcessing}
                          >
                            <Briefcase className="w-4 h-4 mr-2" />
                            Quick Approve
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Approval Guidelines */}
        <Card className="mt-12 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              Approval Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Required for Approval:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Valid email address verified
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Business registration confirmed
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    No matches on DFAT sanctions list
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    No matches on ASIC banned/disqualified list
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-3">Automatic Rejection Triggers:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    Match on DFAT sanctions list
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    Match on ASIC banned/disqualified list
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    Fake/disposable email address
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    High-risk jurisdiction with no local presence
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
