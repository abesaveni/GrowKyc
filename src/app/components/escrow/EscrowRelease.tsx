import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { StatusBadge } from '../StatusBadge';
import { toast } from '../../lib/toast';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { EmptyState } from '../ui/empty-state';
import { DollarSign, TrendingUp, Wallet, AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  date: Date;
  type: string;
  amount: number;
  status: 'completed' | 'pending';
  recipient?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    date: new Date('2026-02-10'),
    type: 'Initial Deposit',
    amount: 125000,
    status: 'completed',
    recipient: 'Escrow Account'
  },
  {
    id: 'txn-002',
    date: new Date('2026-02-12'),
    type: 'Release to Seller',
    amount: 100000,
    status: 'completed',
    recipient: 'Sarah Mitchell'
  },
  {
    id: 'txn-003',
    date: new Date('2026-02-13'),
    type: 'Agent Commission',
    amount: 12500,
    status: 'pending',
    recipient: 'Melbourne Property Group'
  },
  {
    id: 'txn-004',
    date: new Date('2026-02-13'),
    type: 'Legal Fees',
    amount: 2500,
    status: 'pending',
    recipient: 'Smith & Partners Legal'
  }
];

export function EscrowRelease() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [confirmReleaseOpen, setConfirmReleaseOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isReleasing, setIsReleasing] = useState(false);

  // Calculate totals
  const totalHeld = 125000;
  const totalReleased = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const remainingBalance = totalHeld - totalReleased;
  const pendingTransactions = transactions.filter(t => t.status === 'pending');

  const handleReleaseFundsClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setConfirmReleaseOpen(true);
  };

  const handleReleaseFunds = async () => {
    if (!selectedTransaction) return;

    setConfirmReleaseOpen(false);
    setIsReleasing(true);

    // Show loading toast
    toast.loading('Releasing funds...');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update transaction status
    setTransactions(transactions.map(t => 
      t.id === selectedTransaction.id 
        ? { ...t, status: 'completed' as const }
        : t
    ));

    setIsReleasing(false);

    toast.success(`Funds released successfully!`, {
      description: `A$${selectedTransaction.amount.toLocaleString()} sent to ${selectedTransaction.recipient}`
    });

    setSelectedTransaction(null);
  };

  const handleReleaseAll = () => {
    if (pendingTransactions.length === 0) {
      toast.info('No pending transactions to release');
      return;
    }
    setSelectedTransaction({
      id: 'all',
      date: new Date(),
      type: 'Release All Pending',
      amount: pendingTransactions.reduce((sum, t) => sum + t.amount, 0),
      status: 'pending'
    });
    setConfirmReleaseOpen(true);
  };

  const confirmReleaseAll = async () => {
    setConfirmReleaseOpen(false);
    setIsReleasing(true);

    toast.loading('Releasing all pending funds...');

    await new Promise(resolve => setTimeout(resolve, 2500));

    // Update all pending transactions to completed
    setTransactions(transactions.map(t => 
      t.status === 'pending' 
        ? { ...t, status: 'completed' as const }
        : t
    ));

    setIsReleasing(false);

    toast.success('All funds released successfully!', {
      description: `A$${pendingTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()} processed`
    });

    setSelectedTransaction(null);
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '#' },
    { label: 'Escrow', href: '#' },
    { label: 'Release Funds' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Held</p>
                <p className="text-3xl font-semibold text-gray-900">
                  A${totalHeld.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">In escrow account</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Released</p>
                <p className="text-3xl font-semibold text-gray-900">
                  A${totalReleased.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">{transactions.filter(t => t.status === 'completed').length} transactions</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Remaining Balance</p>
                <p className="text-3xl font-semibold text-gray-900">
                  A${remainingBalance.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">{pendingTransactions.length} pending</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert for pending transactions */}
      {pendingTransactions.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">Pending Releases</p>
                  <p className="text-xs text-amber-800 mt-1">
                    {pendingTransactions.length} transaction{pendingTransactions.length > 1 ? 's' : ''} awaiting release 
                    (A${pendingTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()})
                  </p>
                </div>
              </div>
              <Button 
                size="sm"
                onClick={handleReleaseAll}
                disabled={isReleasing}
                className="whitespace-nowrap"
              >
                Release All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction History Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction History</CardTitle>
            <div className="flex gap-2">
              <span className="text-sm text-gray-600">
                {transactions.length} total transactions
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <EmptyState
              icon={Wallet}
              title="No transactions yet"
              description="Escrow transactions will appear here once funds are deposited"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {format(transaction.date, 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell className="text-gray-600">{transaction.recipient}</TableCell>
                    <TableCell className="text-right font-semibold">
                      A${transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={transaction.status} type="case" />
                    </TableCell>
                    <TableCell>
                      {transaction.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReleaseFundsClick(transaction)}
                          disabled={isReleasing}
                        >
                          Release
                        </Button>
                      )}
                      {transaction.status === 'completed' && (
                        <div className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>Released</span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Escrow Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Escrow Agent</p>
              <p className="font-medium text-gray-900">Australian Settlement Services</p>
              <p className="text-sm text-gray-500 mt-1">License: ESA-2024-5678</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Settlement Date</p>
              <p className="font-medium text-gray-900">28 February 2026</p>
              <p className="text-sm text-gray-500 mt-1">15 days remaining</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Account Number</p>
              <p className="font-mono text-sm text-gray-900">ESC-2024-1234</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-base">Security & Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Secure Escrow</p>
                <p className="text-xs text-blue-800">Funds held in trust account</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Two-Factor Authorization</p>
                <p className="text-xs text-blue-800">All releases require 2FA</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Audit Trail</p>
                <p className="text-xs text-blue-800">All transactions logged</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Insured</p>
                <p className="text-xs text-blue-800">Professional indemnity insurance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirm Release Dialog */}
      <ConfirmDialog
        open={confirmReleaseOpen}
        onOpenChange={setConfirmReleaseOpen}
        title="Release Escrow Funds?"
        description={
          selectedTransaction?.id === 'all'
            ? `Are you sure you want to release all pending funds totaling A$${selectedTransaction.amount.toLocaleString()}? This action cannot be undone.`
            : `Are you sure you want to release A$${selectedTransaction?.amount.toLocaleString()} to ${selectedTransaction?.recipient}? This action cannot be undone.`
        }
        confirmLabel="Release Funds"
        onConfirm={selectedTransaction?.id === 'all' ? confirmReleaseAll : handleReleaseFunds}
        variant="destructive"
      />
    </div>
  );
}
