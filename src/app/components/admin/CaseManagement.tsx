import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { StatusBadge } from '../StatusBadge';
import { toast } from '../../lib/toast';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { EmptyState } from '../ui/empty-state';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  FileText,
  Download,
  RefreshCw,
  MoreVertical
} from 'lucide-react';
import { mockCases } from '../../data/mockData';
import { format } from 'date-fns';

interface CaseManagementProps {
  onViewCase?: (caseId: string) => void;
  userRole?: 'borrower' | 'lender' | 'lawyer' | 'admin' | 'super_admin' | 'investor';
  onCreateCase?: () => void;
}

export function CaseManagement({ onViewCase, userRole = 'admin', onCreateCase }: CaseManagementProps) {
  const [cases, setCases] = useState(mockCases);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState<any>(null);

  // Filter cases based on user role
  const getUserCases = () => {
    switch (userRole) {
      case 'borrower':
        // Borrowers only see their own case(s)
        return cases.filter(c => c.borrowerName === 'John Thompson' || c.borrowerName === 'Sarah Mitchell');
      case 'lender':
        // Lenders see cases they've submitted to the platform
        return cases; // In production, filter by lender ID
      case 'lawyer':
        // Lawyers see cases assigned to them
        return cases.filter(c => c.status !== 'completed'); // Show active cases only
      case 'admin':
      case 'super_admin':
        // Admins see all cases
        return cases;
      default:
        return cases;
    }
  };

  const visibleCases = getUserCases();

  // Get page title based on role
  const getPageTitle = () => {
    switch (userRole) {
      case 'borrower':
        return 'My Case';
      case 'lender':
        return 'My MIP Cases';
      case 'lawyer':
        return 'Assigned Cases';
      case 'admin':
      case 'super_admin':
        return 'Case Management';
      default:
        return 'Cases';
    }
  };

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'in_auction', label: 'In Auction' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' }
  ];

  const handleStatusChange = (caseId: string, newStatus: string) => {
    const caseItem = cases.find(c => c.id === caseId);
    setCases(cases.map(c => 
      c.id === caseId ? { ...c, status: newStatus } : c
    ));
    toast.success(`Status updated - ${caseItem?.caseNumber} set to ${newStatus}`);
  };

  const handleDeleteClick = (caseItem: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setCaseToDelete(caseItem);
    setConfirmDeleteOpen(true);
  };

  const handleDeleteCase = async () => {
    if (!caseToDelete) return;

    setConfirmDeleteOpen(false);
    toast.loading('Deleting case...');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setCases(cases.filter(c => c.id !== caseToDelete.id));
    
    toast.success(`Case deleted - ${caseToDelete.caseNumber}`);
    
    setCaseToDelete(null);
  };

  const handleExportCases = () => {
    toast.info('Preparing export...');
    setTimeout(() => {
      toast.success(`Cases exported - ${filteredCases.length} cases exported to CSV`);
    }, 1000);
  };

  const handleRefresh = () => {
    toast.success('Cases refreshed');
  };

  const filteredCases = visibleCases.filter(caseItem => {
    const matchesSearch = caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          caseItem.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          caseItem.property.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || caseItem.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const breadcrumbItems = [
    { label: 'Dashboard', href: '#' },
    { label: 'Admin', href: '#' },
    { label: 'Case Management' }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Title and Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
          <p className="text-gray-600 mt-1">
            {userRole === 'borrower' && 'View and manage your mortgage insurance protection case'}
            {userRole === 'lender' && 'Manage loans you\'ve placed on the MIP platform'}
            {userRole === 'lawyer' && 'Create and manage cases for your clients'}
            {(userRole === 'admin' || userRole === 'super_admin') && 'Oversee all cases and platform activity'}
          </p>
        </div>
        {(userRole === 'lender' || userRole === 'lawyer' || userRole === 'admin' || userRole === 'super_admin' || userRole === 'investor') && (
          <Button onClick={onCreateCase} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Submit New Case
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {userRole === 'borrower' ? 'Your Cases' : 'Total Cases'}
                </p>
                <p className="text-3xl font-semibold text-gray-900">{visibleCases.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Cases</p>
                <p className="text-3xl font-semibold text-gray-900">
                  {visibleCases.filter(c => c.status === 'active' || c.status === 'in_auction').length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">In Auction</p>
                <p className="text-3xl font-semibold text-gray-900">
                  {visibleCases.filter(c => c.status === 'in_auction').length}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <RefreshCw className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-semibold text-gray-900">
                  {visibleCases.filter(c => c.status === 'completed').length}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Cases ({filteredCases.length})</CardTitle>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cases..."
                  className="pl-9 w-64"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              {/* Actions */}
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleExportCases}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCases.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No cases found"
              description={
                searchQuery || statusFilter !== 'all'
                  ? "No cases match your filters"
                  : "No cases have been created yet"
              }
              action={
                searchQuery || statusFilter !== 'all'
                  ? {
                      label: 'Clear Filters',
                      onClick: () => {
                        setSearchQuery('');
                        setStatusFilter('all');
                        toast.info('Filters cleared');
                      }
                    }
                  : undefined
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case Number</TableHead>
                    <TableHead>Borrower</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead className="text-right">Debt</TableHead>
                    <TableHead className="text-right">Valuation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCases.map((caseItem) => (
                    <TableRow 
                      key={caseItem.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        onViewCase?.(caseItem.id);
                      }}
                    >
                      <TableCell className="font-semibold">{caseItem.caseNumber}</TableCell>
                      <TableCell>{caseItem.borrowerName}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{caseItem.property.address}</p>
                          <p className="text-xs text-gray-500">{caseItem.property.suburb}, {caseItem.property.state}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-right">A${(caseItem.outstandingDebt / 1000).toFixed(0)}k</TableCell>
                      <TableCell className="font-semibold text-right">A${(caseItem.valuation.amount / 1000).toFixed(0)}k</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <select
                          value={caseItem.status}
                          onChange={(e) => handleStatusChange(caseItem.id, e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={caseItem.riskLevel} type="risk" />
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {format(caseItem.createdAt, 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewCase?.(caseItem.id);
                            }}
                            title="View Case Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => handleDeleteClick(caseItem, e)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete Case"
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

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Delete Case?"
        description={`Are you sure you want to delete case ${caseToDelete?.caseNumber}? This action cannot be undone and will remove all associated data.`}
        confirmLabel="Delete Case"
        onConfirm={handleDeleteCase}
        variant="destructive"
      />
    </div>
  );
}