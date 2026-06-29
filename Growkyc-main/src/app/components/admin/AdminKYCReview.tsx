import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { StatusBadge } from '../StatusBadge';
import { CheckCircle2, XCircle, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '../../lib/toast';
import { ConfirmDialog } from '../ui/confirm-dialog';

interface KYCSubmission {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  email: string;
  submittedDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  documentsCount: number;
}

interface AdminKYCReviewProps {
  onNavigate?: (page: string, id?: string) => void;
}

function getAuthHeader(): Record<string, string> {
  const token = sessionStorage.getItem('growkyc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function AdminKYCReview({ onNavigate }: AdminKYCReviewProps) {
  const [submissions, setSubmissions] = React.useState<KYCSubmission[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [confirmDialog, setConfirmDialog] = React.useState<{ open: boolean; type: 'approve' | 'reject' | null; userName: string; userId: string; }>(
    { open: false, type: null, userName: '', userId: '' }
  );

  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const approvedCount = submissions.filter(s => s.status === 'approved').length;
  const rejectedCount = submissions.filter(s => s.status === 'rejected').length;

  React.useEffect(() => {
    fetch('/api/v1/admin/kyc/pending', { headers: getAuthHeader() })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data: { total: number; items: any[] }) => {
        const mapped: KYCSubmission[] = (data.items || []).map((item: any) => ({
          id: String(item.id),
          userId: String(item.user_id),
          userName: item.name || 'Unknown',
          userRole: item.user?.role || 'User',
          email: item.user?.email || '',
          submittedDate: new Date(item.submitted_at || item.created_at),
          status: (item.status || 'pending').toLowerCase() as KYCSubmission['status'],
          documentsCount: item.documents?.length ?? 0,
        }));
        setSubmissions(mapped);
      })
      .catch(() => {
        toast.error('Unable to load KYC submissions');
      })
      .finally(() => setLoading(false));
  }, []);

  const updateSubmissionStatus = (id: string, newStatus: KYCSubmission['status']) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const handleApprove = (id: string, userName: string) => {
    setConfirmDialog({ open: true, type: 'approve', userName, userId: id });
  };
  const handleReject = (id: string, userName: string) => {
    setConfirmDialog({ open: true, type: 'reject', userName, userId: id });
  };

  const confirmAction = async () => {
    const { userId, userName, type } = confirmDialog;
    if (!type) return;
    setConfirmDialog({ open: false, type: null, userName: '', userId: '' });
    try {
      const endpoint = type === 'approve'
        ? `/api/v1/kyc/approve/${userId}`
        : `/api/v1/kyc/reject/${userId}`;
      const body = type === 'approve'
        ? { approval_reason: 'Approved via admin review' }
        : { rejection_reason: 'Rejected via admin review' };
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const detail = typeof errData?.detail === 'string'
          ? errData.detail
          : `Request failed (${response.status})`;
        throw new Error(detail);
      }
      updateSubmissionStatus(userId, type === 'approve' ? 'approved' : 'rejected');
      toast.success(
        type === 'approve'
          ? `KYC Approved for ${userName}`
          : `KYC Rejected for ${userName}`
      );
    } catch (err: any) {
      toast.error(err?.message || `Failed to ${type} KYC for ${userName}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Reviews</p>
                <p className="text-3xl font-semibold text-gray-900">{loading ? '—' : pendingCount}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <Eye className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Approved Today</p>
                <p className="text-3xl font-semibold text-gray-900">{loading ? '—' : approvedCount}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rejected Today</p>
                <p className="text-3xl font-semibold text-gray-900">{loading ? '—' : rejectedCount}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>KYC Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10 text-gray-400">Loading submissions…</div>
          ) : submissions.length === 0 ? (
            <div className="flex justify-center py-10 text-gray-400">No pending KYC submissions.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.userName}</TableCell>
                    <TableCell>{submission.userRole}</TableCell>
                    <TableCell className="text-gray-600">{submission.email}</TableCell>
                    <TableCell>{format(submission.submittedDate, 'dd MMM yyyy')}</TableCell>
                    <TableCell>{submission.documentsCount} files</TableCell>
                    <TableCell>
                      <StatusBadge status={submission.status} type="case" />
                    </TableCell>
                    <TableCell>
                      {submission.status === 'pending' ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onNavigate?.('admin_kyc_detail', submission.userId)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleApprove(submission.id, submission.userName)}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleReject(submission.id, submission.userName)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onNavigate?.('admin_kyc_detail', submission.userId)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        title={confirmDialog.type === 'approve' ? 'Approve KYC?' : 'Reject KYC?'}
        description={
          confirmDialog.type === 'approve'
            ? `Are you sure you want to approve KYC for ${confirmDialog.userName}? They will be granted full platform access.`
            : `Are you sure you want to reject KYC for ${confirmDialog.userName}? They will need to resubmit their documents.`
        }
        confirmLabel={confirmDialog.type === 'approve' ? 'Approve' : 'Reject'}
        onConfirm={confirmAction}
        variant={confirmDialog.type === 'reject' ? 'destructive' : 'default'}
      />
    </div>
  );
}
