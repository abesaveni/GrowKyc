import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Upload,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lock,
  Shield,
  User,
  Calendar,
  FileText,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface JournalPushControlProps {
  onBack?: () => void;
}

export function JournalPushControl({ onBack }: JournalPushControlProps) {
  const [selectedJournals, setSelectedJournals] = useState<string[]>([]);
  const [pushStatus, setPushStatus] = useState<'idle' | 'validating' | 'pushing'>('idle');

  // Mock journal data
  const journals = [
    {
      workpaperJournalID: 'wpj-001',
      binderID: 'binder-001',
      journalNumber: 'AJ-001',
      description: 'Depreciation Adjustment',
      date: '2024-06-30',
      totalDebit: 56800,
      totalCredit: 56800,
      lineCount: 2,
      preparedBy: 'Sarah Chen',
      reviewerApproved: true,
      approvedBy: 'Michael Ross',
      approvedAt: '2024-02-13 14:30:00',
      pushedToXero: false,
      xeroJournalID: null,
      validationStatus: 'VALID' as const,
      validationChecks: {
        debitsEqualCredits: true,
        reviewerApproved: true,
        binderNotSealed: true,
        accountsNotLocked: true,
        withinAllowedPeriod: true,
        noDuplicatePush: true
      }
    },
    {
      workpaperJournalID: 'wpj-002',
      binderID: 'binder-001',
      journalNumber: 'AJ-002',
      description: 'Bad Debt Provision',
      date: '2024-06-30',
      totalDebit: 2700,
      totalCredit: 2700,
      lineCount: 2,
      preparedBy: 'David Kim',
      reviewerApproved: true,
      approvedBy: 'Sarah Chen',
      approvedAt: '2024-02-14 09:15:00',
      pushedToXero: false,
      xeroJournalID: null,
      validationStatus: 'VALID' as const,
      validationChecks: {
        debitsEqualCredits: true,
        reviewerApproved: true,
        binderNotSealed: true,
        accountsNotLocked: true,
        withinAllowedPeriod: true,
        noDuplicatePush: true
      }
    },
    {
      workpaperJournalID: 'wpj-003',
      binderID: 'binder-001',
      journalNumber: 'AJ-003',
      description: 'Accrued Expenses',
      date: '2024-06-30',
      totalDebit: 12500,
      totalCredit: 12500,
      lineCount: 3,
      preparedBy: 'Emma Wilson',
      reviewerApproved: false,
      approvedBy: null,
      approvedAt: null,
      pushedToXero: false,
      xeroJournalID: null,
      validationStatus: 'INVALID' as const,
      validationChecks: {
        debitsEqualCredits: true,
        reviewerApproved: false,
        binderNotSealed: true,
        accountsNotLocked: true,
        withinAllowedPeriod: true,
        noDuplicatePush: true
      }
    },
    {
      workpaperJournalID: 'wpj-004',
      binderID: 'binder-001',
      journalNumber: 'AJ-004',
      description: 'Year-End Inventory Adjustment',
      date: '2024-06-30',
      totalDebit: 14400,
      totalCredit: 14400,
      lineCount: 2,
      preparedBy: 'Sarah Chen',
      reviewerApproved: true,
      approvedBy: 'Michael Ross',
      approvedAt: '2024-02-12 16:45:00',
      pushedToXero: true,
      xeroJournalID: 'xero-mj-12345',
      xeroJournalNumber: 'MJ00145',
      pushedAt: '2024-02-12 16:50:00',
      validationStatus: 'PUSHED' as const,
      validationChecks: {
        debitsEqualCredits: true,
        reviewerApproved: true,
        binderNotSealed: true,
        accountsNotLocked: true,
        withinAllowedPeriod: true,
        noDuplicatePush: false
      }
    },
    {
      workpaperJournalID: 'wpj-005',
      binderID: 'binder-001',
      journalNumber: 'AJ-005',
      description: 'Period Locked Adjustment',
      date: '2024-03-31',
      totalDebit: 8900,
      totalCredit: 8900,
      lineCount: 2,
      preparedBy: 'David Kim',
      reviewerApproved: true,
      approvedBy: 'Michael Ross',
      approvedAt: '2024-02-14 10:00:00',
      pushedToXero: false,
      xeroJournalID: null,
      validationStatus: 'WARNING' as const,
      validationChecks: {
        debitsEqualCredits: true,
        reviewerApproved: true,
        binderNotSealed: true,
        accountsNotLocked: false,
        withinAllowedPeriod: false,
        noDuplicatePush: true
      }
    }
  ];

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getValidationBadge = (status: string) => {
    switch (status) {
      case 'VALID':
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          VALID
        </span>;
      case 'INVALID':
        return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          INVALID
        </span>;
      case 'WARNING':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          WARNING
        </span>;
      case 'PUSHED':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          PUSHED
        </span>;
      default:
        return null;
    }
  };

  const handlePush = () => {
    setPushStatus('validating');
    setTimeout(() => {
      setPushStatus('pushing');
      setTimeout(() => {
        setPushStatus('idle');
        setSelectedJournals([]);
      }, 2000);
    }, 1000);
  };

  const validJournals = journals.filter(j => j.validationStatus === 'VALID');
  const invalidJournals = journals.filter(j => j.validationStatus === 'INVALID');
  const pushedJournals = journals.filter(j => j.validationStatus === 'PUSHED');
  const warningJournals = journals.filter(j => j.validationStatus === 'WARNING');

  const canPush = selectedJournals.length > 0 && selectedJournals.every(id => {
    const journal = journals.find(j => j.workpaperJournalID === id);
    return journal && journal.validationStatus === 'VALID' && !journal.pushedToXero;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Upload className="w-8 h-8 text-blue-600" />
                Controlled Journal Push
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Push approved draft journals to Xero with validation and approval workflow
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Validation
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!canPush || pushStatus !== 'idle'}
              onClick={handlePush}
            >
              <Upload className="w-4 h-4 mr-2" />
              {pushStatus === 'validating' ? 'Validating...' : 
               pushStatus === 'pushing' ? 'Pushing to Xero...' :
               `Push ${selectedJournals.length} Journal${selectedJournals.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>

        {/* Control Policy */}
        <div className="bg-red-50 border border-red-300 rounded px-4 py-3">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-2">Strict Journal Push Controls</h3>
              <div className="grid grid-cols-2 gap-3 text-sm text-red-800">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Push ONLY as DRAFT status (never auto-post)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Require reviewer approval before push</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Validate debits = credits</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Check binder not sealed</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Verify accounts not locked in Xero</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Prevent duplicate pushes (idempotency)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-gray-300 rounded p-4">
            <div className="text-xs text-gray-600 mb-1">Ready to Push</div>
            <div className="text-2xl font-bold text-green-600 font-mono">{validJournals.length}</div>
            <div className="text-xs text-gray-600 mt-1">Approved & validated</div>
          </div>
          <div className="bg-white border border-gray-300 rounded p-4">
            <div className="text-xs text-gray-600 mb-1">Requires Approval</div>
            <div className="text-2xl font-bold text-red-600 font-mono">{invalidJournals.length}</div>
            <div className="text-xs text-gray-600 mt-1">Missing reviewer sign-off</div>
          </div>
          <div className="bg-white border border-gray-300 rounded p-4">
            <div className="text-xs text-gray-600 mb-1">Period Warnings</div>
            <div className="text-2xl font-bold text-amber-600 font-mono">{warningJournals.length}</div>
            <div className="text-xs text-gray-600 mt-1">Locked period override needed</div>
          </div>
          <div className="bg-white border border-gray-300 rounded p-4">
            <div className="text-xs text-gray-600 mb-1">Already Pushed</div>
            <div className="text-2xl font-bold text-blue-600 font-mono">{pushedJournals.length}</div>
            <div className="text-xs text-gray-600 mt-1">In Xero as draft</div>
          </div>
        </div>

        {/* Journal Lifecycle */}
        <div className="bg-white border border-gray-300 rounded p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Journal Lifecycle</h3>
          <div className="flex items-center gap-2">
            <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded text-sm font-semibold text-gray-700">
              Draft
            </div>
            <div className="flex-1 border-t-2 border-gray-300"></div>
            <div className="px-3 py-2 bg-blue-100 border border-blue-300 rounded text-sm font-semibold text-blue-700">
              Reviewer Approved
            </div>
            <div className="flex-1 border-t-2 border-gray-300"></div>
            <div className="px-3 py-2 bg-green-100 border border-green-300 rounded text-sm font-semibold text-green-700">
              Ready to Push
            </div>
            <div className="flex-1 border-t-2 border-gray-300"></div>
            <div className="px-3 py-2 bg-purple-100 border border-purple-300 rounded text-sm font-semibold text-purple-700">
              Pushed to Xero (Draft)
            </div>
            <div className="flex-1 border-t-2 border-gray-300"></div>
            <div className="px-3 py-2 bg-indigo-100 border border-indigo-300 rounded text-sm font-semibold text-indigo-700">
              Posted in Xero (Manual)
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-3">
            <strong>Important:</strong> Journals are never auto-posted. Final posting must be done manually in Xero after review.
          </p>
        </div>

        {/* Journal List */}
        <div className="border border-gray-300 rounded bg-white overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-300 px-4 py-2">
            <h3 className="font-semibold text-gray-900">Adjustment Journals ({journals.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-2 text-center font-semibold text-gray-700 w-16">
                    Select
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Journal #</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Description</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Date</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700">Amount</th>
                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">Lines</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Approved By</th>
                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">Validation</th>
                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {journals.map((journal) => (
                  <tr key={journal.workpaperJournalID} className="hover:bg-blue-50">
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedJournals.includes(journal.workpaperJournalID)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedJournals([...selectedJournals, journal.workpaperJournalID]);
                          } else {
                            setSelectedJournals(selectedJournals.filter(id => id !== journal.workpaperJournalID));
                          }
                        }}
                        disabled={journal.pushedToXero || journal.validationStatus !== 'VALID'}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-900 font-mono font-semibold">
                      {journal.journalNumber}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-900">
                      {journal.description}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-700">
                      {journal.date}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right text-gray-900 font-mono">
                      ${formatCurrency(journal.totalDebit)}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-gray-700">
                      {journal.lineCount}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-700">
                      {journal.approvedBy ? (
                        <div>
                          <div className="font-semibold">{journal.approvedBy}</div>
                          <div className="text-xs text-gray-600">{journal.approvedAt}</div>
                        </div>
                      ) : (
                        <span className="text-red-600 text-xs">Not approved</span>
                      )}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {getValidationBadge(journal.validationStatus)}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {journal.pushedToXero ? (
                        <div>
                          <div className="text-xs text-blue-700 font-semibold">Pushed to Xero</div>
                          <div className="text-xs text-gray-600 font-mono">{journal.xeroJournalNumber}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-600">Ready</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Validation Checks Detail (for selected journals) */}
        {selectedJournals.length > 0 && (
          <div className="bg-white border border-gray-300 rounded p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Validation Checks ({selectedJournals.length} selected)</h3>
            {selectedJournals.map(journalId => {
              const journal = journals.find(j => j.workpaperJournalID === journalId);
              if (!journal) return null;
              
              return (
                <div key={journalId} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
                  <h4 className="font-semibold text-gray-900 mb-2">{journal.journalNumber} - {journal.description}</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(journal.validationChecks).map(([check, passed]) => (
                      <div key={check} className="flex items-center gap-2">
                        {passed ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`text-sm ${passed ? 'text-gray-700' : 'text-red-700 font-semibold'}`}>
                          {check.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Push Result */}
        {pushStatus === 'pushing' && (
          <div className="bg-blue-50 border border-blue-300 rounded px-4 py-3">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">Pushing journals to Xero...</h3>
                <p className="text-sm text-blue-800">
                  Creating draft manual journals with idempotency keys. This may take a few moments.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Architecture Safeguards */}
        <div className="bg-purple-50 border border-purple-300 rounded p-4">
          <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Architecture Safeguards
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm text-purple-800">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Xero tenant ID stored and validated</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>OAuth tokens encrypted at rest</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Idempotency key per journal push</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Prevent duplicate pushes</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Validate debits = credits before push</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Audit trail of all push operations</span>
            </div>
          </div>
        </div>

        {/* Partner Override (for locked periods) */}
        {warningJournals.length > 0 && (
          <div className="bg-amber-50 border border-amber-300 rounded p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 mb-2">Partner Override Required</h3>
                <p className="text-sm text-amber-800 mb-3">
                  {warningJournals.length} journal{warningJournals.length !== 1 ? 's' : ''} target{warningJournals.length === 1 ? 's' : ''} locked periods in Xero. Partner approval required to proceed.
                </p>
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Request Partner Override
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
