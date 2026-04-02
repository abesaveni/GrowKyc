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

const mockKYCSubmissions: KYCSubmission[] = [
  {
    id: 'kyc-001',
    userName: 'Sarah Mitchell',
    userRole: 'Borrower',
    email: 'sarah.mitchell@email.com',
    submittedDate: new Date('2026-02-10'),
    status: 'pending',
    documentsCount: 3
  },
  {
    id: 'kyc-002',
    userName: 'James Chen',
    userRole: 'Investor',
    email: 'james.chen@email.com',
    submittedDate: new Date('2026-02-11'),
    status: 'pending',
    documentsCount: 4
  },
  {
    id: 'kyc-003',
    userName: 'Emma Watson',
    userRole: 'Investor',
    email: 'emma.watson@email.com',
    submittedDate: new Date('2026-02-09'),
    status: 'approved',
    documentsCount: 3
  }
];

export function AdminKYCReview({ onNavigate }: AdminKYCReviewProps) {
  const [confirmDialog, setConfirmDialog] = React.useState<{
    open: boolean;
    type: 'approve' | 'reject' | null;
    userName: string;
    userId: string;
  }>({ open: false, type: null, userName: '', userId: '' });

  const handleApprove = (id: string, userName: string) => {
    setConfirmDialog({ open: true, type: 'approve', userName, userId: id });
  };

  const handleReject = (id: string, userName: string) => {
    setConfirmDialog({ open: true, type: 'reject', userName, userId: id });
  };

  const confirmAction = () => {
    if (confirmDialog.type === 'approve') {
      toast.success(`KYC Approved for ${confirmDialog.userName} - User has been notified and can now access the platform`);
    } else if (confirmDialog.type === 'reject') {
      toast.error(`KYC Rejected for ${confirmDialog.userName} - User has been notified and can resubmit documents`);
    }
    setConfirmDialog({ open: false, type: null, userName: '', userId: '' });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Reviews</p>
                <p className="text-3xl font-semibold text-gray-900">
                  {mockKYCSubmissions.filter(k => k.status === 'pending').length}
                </p>
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
                <p className="text-3xl font-semibold text-gray-900">7</p>
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
                <p className="text-3xl font-semibold text-gray-900">2</p>
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
              {mockKYCSubmissions.map((submission) => (
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
                          onClick={() => onNavigate?.('admin_kyc_detail', submission.id)}
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
                        onClick={() => onNavigate?.('admin_kyc_detail', submission.id)}
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