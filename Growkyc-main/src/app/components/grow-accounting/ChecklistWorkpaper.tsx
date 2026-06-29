import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  CheckSquare,
  Save,
  Download,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Circle,
  AlertCircle,
  FileText,
  Plus,
  Filter
} from 'lucide-react';

interface ChecklistWorkpaperProps {
  onBack?: () => void;
  checklistType?: 'compliance' | 'evidence';
}

export function ChecklistWorkpaper({ onBack, checklistType = 'compliance' }: ChecklistWorkpaperProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Evidence checklist for supporting documents
  const evidenceChecklistItems = [
    // Balance Sheet - Assets
    {
      id: 'ev-001',
      category: 'Cash & Bank Accounts',
      description: 'Bank statements for all accounts (June 30)',
      required: true,
      status: 'complete' as const,
      completed_by: 'Sarah Chen',
      completed_at: '2024-02-10',
      linked_evidence: ['bank-stmt-001'],
      signoff_required: false,
      priority: 'high' as const
    },
    {
      id: 'ev-002',
      category: 'Cash & Bank Accounts',
      description: 'Bank reconciliations (all accounts)',
      required: true,
      status: 'complete' as const,
      completed_by: 'Sarah Chen',
      completed_at: '2024-02-10',
      linked_evidence: ['recon-001'],
      signoff_required: false,
      priority: 'high' as const
    },
    {
      id: 'ev-003',
      category: 'Accounts Receivable',
      description: 'Aged debtors report as at June 30',
      required: true,
      status: 'complete' as const,
      completed_by: 'David Kim',
      completed_at: '2024-02-11',
      linked_evidence: ['aged-debt-001'],
      signoff_required: false,
      priority: 'high' as const
    },
    {
      id: 'ev-004',
      category: 'Accounts Receivable',
      description: 'Bad debt write-off approval documentation',
      required: true,
      status: 'in_progress' as const,
      completed_by: 'David Kim',
      completed_at: undefined,
      linked_evidence: [],
      signoff_required: true,
      priority: 'medium' as const
    },
    {
      id: 'ev-005',
      category: 'Inventory',
      description: 'Stocktake sheets/certificate (June 30)',
      required: true,
      status: 'not_started' as const,
      completed_by: undefined,
      completed_at: undefined,
      linked_evidence: [],
      signoff_required: true,
      priority: 'high' as const
    },
    {
      id: 'ev-006',
      category: 'Inventory',
      description: 'Inventory valuation breakdown',
      required: true,
      status: 'not_started' as const,
      completed_by: undefined,
      completed_at: undefined,
      linked_evidence: [],
      signoff_required: false,
      priority: 'high' as const
    },
    {
      id: 'ev-007',
      category: 'Fixed Assets',
      description: 'Fixed asset register',
      required: true,
      status: 'complete' as const,
      completed_by: 'Emma Wilson',
      completed_at: '2024-02-08',
      linked_evidence: ['fa-reg-001'],
      signoff_required: false,
      priority: 'high' as const
    },
    {
      id: 'ev-008',
      category: 'Fixed Assets',
      description: 'Invoices for asset additions',
      required: true,
      status: 'in_progress' as const,
      completed_by: 'Emma Wilson',
      completed_at: undefined,
      linked_evidence: ['inv-012', 'inv-034'],
      signoff_required: false,
      priority: 'medium' as const
    },
    {
      id: 'ev-009',
      category: 'Fixed Assets',
      description: 'Disposal documentation (if applicable)',
      required: false,
      status: 'complete' as const,
      completed_by: 'Emma Wilson',
      completed_at: '2024-02-09',
      linked_evidence: ['disposal-001'],
      signoff_required: false,
      priority: 'low' as const
    },
    // Liabilities
    {
      id: 'ev-010',
      category: 'Accounts Payable',
      description: 'Aged creditors report as at June 30',
      required: true,
      status: 'complete' as const,
      completed_by: 'Sarah Chen',
      completed_at: '2024-02-11',
      linked_evidence: ['aged-cred-001'],
      signoff_required: false,
      priority: 'high' as const
    },
    {
      id: 'ev-011',
      category: 'Accounts Payable',
      description: 'Supplier statements for material creditors',
      required: true,
      status: 'in_progress' as const,
      completed_by: 'Sarah Chen',
      completed_at: undefined,
      linked_evidence: ['stmt-001', 'stmt-002'],
      signoff_required: false,
      priority: 'medium' as const
    },
    {
      id: 'ev-012',
      category: 'Loans & Borrowings',
      description: 'Loan agreements',
      required: true,
      status: 'complete' as const,
      completed_by: 'Michael Ross',
      completed_at: '2024-02-07',
      linked_evidence: ['loan-agr-001'],
      signoff_required: false,
      priority: 'high' as const
    },
    {
      id: 'ev-013',
      category: 'Loans & Borrowings',
      description: 'Loan statements showing balance and repayments',
      required: true,
      status: 'complete' as const,
      completed_by: 'Michael Ross',
      completed_at: '2024-02-07',
      linked_evidence: ['loan-stmt-001'],
      signoff_required: false,
      priority: 'high' as const
    },
    {
      id: 'ev-014',
      category: 'GST & BAS',
      description: 'BAS lodgement confirmations (all quarters)',
      required: true,
      status: 'in_progress' as const,
      completed_by: 'David Kim',
      completed_at: undefined,
      linked_evidence: ['bas-q1', 'bas-q2'],
      signoff_required: true,
      priority: 'high' as const
    },
    {
      id: 'ev-015',
      category: 'GST & BAS',
      description: 'GST reconciliation workings',
      required: true,
      status: 'not_started' as const,
      completed_by: undefined,
      completed_at: undefined,
      linked_evidence: [],
      signoff_required: true,
      priority: 'high' as const
    },
    {
      id: 'ev-016',
      category: 'Payroll & Superannuation',
      description: 'Payroll summary reports (all pay periods)',
      required: true,
      status: 'complete' as const,
      completed_by: 'Emma Wilson',
      completed_at: '2024-02-10',
      linked_evidence: ['payroll-sum-001'],
      signoff_required: false,
      priority: 'high' as const
    },
    {
      id: 'ev-017',
      category: 'Payroll & Superannuation',
      description: 'Superannuation payment confirmations',
      required: true,
      status: 'not_started' as const,
      completed_by: undefined,
      completed_at: undefined,
      linked_evidence: [],
      signoff_required: true,
      priority: 'high' as const
    },
    {
      id: 'ev-018',
      category: 'Payroll & Superannuation',
      description: 'PAYG payment summaries/IAS statements',
      required: true,
      status: 'not_started' as const,
      completed_by: undefined,
      completed_at: undefined,
      linked_evidence: [],
      signoff_required: true,
      priority: 'high' as const
    },
    // Income Statement
    {
      id: 'ev-019',
      category: 'Revenue & Sales',
      description: 'Sales invoices for sample testing',
      required: true,
      status: 'in_progress' as const,
      completed_by: 'David Kim',
      completed_at: undefined,
      linked_evidence: ['inv-sample-001'],
      signoff_required: false,
      priority: 'medium' as const
    },
    {
      id: 'ev-020',
      category: 'Revenue & Sales',
      description: 'Contracts/agreements for major revenue streams',
      required: false,
      status: 'not_started' as const,
      completed_by: undefined,
      completed_at: undefined,
      linked_evidence: [],
      signoff_required: false,
      priority: 'low' as const
    },
    {
      id: 'ev-021',
      category: 'Cost of Sales',
      description: 'Purchase invoices (sample)',
      required: true,
      status: 'in_progress' as const,
      completed_by: 'Sarah Chen',
      completed_at: undefined,
      linked_evidence: ['purchase-sample-001'],
      signoff_required: false,
      priority: 'medium' as const
    },
    {
      id: 'ev-022',
      category: 'Operating Expenses',
      description: 'Rent/lease agreements',
      required: true,
      status: 'complete' as const,
      completed_by: 'Michael Ross',
      completed_at: '2024-02-06',
      linked_evidence: ['lease-001'],
      signoff_required: false,
      priority: 'medium' as const
    },
    {
      id: 'ev-023',
      category: 'Operating Expenses',
      description: 'Insurance policies and certificates',
      required: true,
      status: 'complete' as const,
      completed_by: 'Michael Ross',
      completed_at: '2024-02-06',
      linked_evidence: ['insurance-001'],
      signoff_required: false,
      priority: 'medium' as const
    },
    {
      id: 'ev-024',
      category: 'Operating Expenses',
      description: 'Motor vehicle logbooks (if claiming)',
      required: true,
      status: 'not_started' as const,
      completed_by: undefined,
      completed_at: undefined,
      linked_evidence: [],
      signoff_required: true,
      priority: 'high' as const
    },
    {
      id: 'ev-025',
      category: 'Operating Expenses',
      description: 'Depreciation schedule',
      required: true,
      status: 'complete' as const,
      completed_by: 'Emma Wilson',
      completed_at: '2024-02-09',
      linked_evidence: ['depr-sch-001'],
      signoff_required: false,
      priority: 'high' as const
    },
    // Tax & Compliance
    {
      id: 'ev-026',
      category: 'Tax Compliance',
      description: 'Division 7A loan agreements (if applicable)',
      required: false,
      status: 'complete' as const,
      completed_by: 'Michael Ross',
      completed_at: '2024-02-08',
      linked_evidence: ['div7a-001'],
      signoff_required: true,
      priority: 'high' as const
    },
    {
      id: 'ev-027',
      category: 'Tax Compliance',
      description: 'FBT records and calculations (if applicable)',
      required: false,
      status: 'not_started' as const,
      completed_by: undefined,
      completed_at: undefined,
      linked_evidence: [],
      signoff_required: true,
      priority: 'medium' as const
    },
    {
      id: 'ev-028',
      category: 'Tax Compliance',
      description: 'R&D tax incentive documentation (if applicable)',
      required: false,
      status: 'not_started' as const,
      completed_by: undefined,
      completed_at: undefined,
      linked_evidence: [],
      signoff_required: false,
      priority: 'low' as const
    },
    // Corporate
    {
      id: 'ev-029',
      category: 'Corporate Records',
      description: 'ASIC company extract',
      required: true,
      status: 'complete' as const,
      completed_by: 'Sarah Chen',
      completed_at: '2024-02-05',
      linked_evidence: ['asic-001'],
      signoff_required: false,
      priority: 'high' as const
    },
    {
      id: 'ev-030',
      category: 'Corporate Records',
      description: 'Director resolutions/minutes',
      required: true,
      status: 'in_progress' as const,
      completed_by: 'Michael Ross',
      completed_at: undefined,
      linked_evidence: ['minutes-001'],
      signoff_required: true,
      priority: 'medium' as const
    },
    {
      id: 'ev-031',
      category: 'Corporate Records',
      description: 'Share register',
      required: true,
      status: 'complete' as const,
      completed_by: 'Michael Ross',
      completed_at: '2024-02-05',
      linked_evidence: ['share-reg-001'],
      signoff_required: false,
      priority: 'medium' as const
    }
  ];

  const checklistItems = [
    {
      id: 'chk-001',
      category: 'Setup & Planning',
      description: 'Obtain and review prior year workpapers',
      required: true,
      status: 'complete' as const,
      completed_by: 'Sarah Chen',
      completed_at: '2024-02-01',
      linked_evidence: ['ev-001'],
      signoff_required: false,
      priority: 'high' as const
    },
    {
      id: 'chk-002',
      category: 'Setup & Planning',
      description: 'Review materiality and risk assessment',
      required: true,
      status: 'complete' as const,
      completed_by: 'Sarah Chen',
      completed_at: '2024-02-01',
      linked_evidence: [],
      signoff_required: true,
      priority: 'high' as const
    },
    {
      id: 'chk-003',
      category: 'Setup & Planning',
      description: 'Set up current year binder structure',
      required: true,
      status: 'complete' as const,
      completed_by: 'Sarah Chen',
      completed_at: '2024-02-02',
      linked_evidence: [],
      signoff_required: false,
      priority: 'medium' as const
    },
    {
      id: 'chk-004',
      category: 'Trial Balance',
      description: 'Import trial balance from ledger',
      required: true,
      status: 'complete' as const,
      completed_by: 'Sarah Chen',
      completed_at: '2024-02-03',
      linked_evidence: ['ev-002'],
      signoff_required: false,
      priority: 'high' as const
    },
    {
      id: 'chk-005',
      category: 'Trial Balance',
      description: 'Verify trial balance mathematical accuracy',
      required: true,
      status: 'complete' as const,
      completed_by: 'Sarah Chen',
      completed_at: '2024-02-03',
      linked_evidence: [],
      signoff_required: false,
      priority: 'high' as const
    },
    {
      id: 'chk-006',
      category: 'Trial Balance',
      description: 'Map accounts to lead schedules',
      required: true,
      status: 'complete' as const,
      completed_by: 'David Kim',
      completed_at: '2024-02-04',
      linked_evidence: [],
      signoff_required: false,
      priority: 'high' as const
    },
    {
      id: 'chk-007',
      category: 'Assets',
      description: 'Prepare cash reconciliation',
      required: true,
      status: 'complete' as const,
      completed_by: 'David Kim',
      completed_at: '2024-02-05',
      linked_evidence: ['ev-003'],
      signoff_required: false,
      priority: 'high' as const
    },
    {
      id: 'chk-008',
      category: 'Assets',
      description: 'Prepare aged receivables analysis',
      required: true,
      status: 'in_progress' as const,
      completed_by: 'David Kim',
      completed_at: undefined,
      linked_evidence: ['ev-004'],
      signoff_required: false,
      priority: 'high' as const
    },
    {
      id: 'chk-009',
      category: 'Assets',
      description: 'Review provision for doubtful debts',
      required: true,
      status: 'in_progress' as const,
      completed_by: undefined,
      completed_at: undefined,
      linked_evidence: [],
      signoff_required: true,
      priority: 'medium' as const
    },
    {
      id: 'chk-010',
      category: 'Assets',
      description: 'Verify inventory stocktake and valuation',
      required: true,
      status: 'not_started' as const,
      completed_by: undefined,
      completed_at: undefined,
      linked_evidence: [],
      signoff_required: true,
      priority: 'high' as const
    },
    {
      id: 'chk-011',
      category: 'Assets',
      description: 'Prepare fixed asset register reconciliation',
      required: true,
      status: 'not_started' as const,
      completed_by: undefined,
      completed_at: undefined,
      linked_evidence: [],
      signoff_required: false,
      priority: 'medium' as const
    },
    {
      id: 'chk-012',
      category: 'Liabilities',
      description: 'Reconcile trade creditors',
      required: true,
      status: 'not_started' as const,
      completed_by: undefined,
      completed_at: undefined,
      linked_evidence: [],
      signoff_required: false,
      priority: 'medium' as const
    },
    {
      id: 'chk-013',
      category: 'Liabilities',
      description: 'Review GST reconciliation and BAS compliance',
      required: true,
      status: 'not_started' as const,
      completed_by: undefined,
      completed_at: undefined,
      linked_evidence: [],
      signoff_required: true,
      priority: 'high' as const
    },
    {
      id: 'chk-014',
      category: 'Liabilities',
      description: 'Verify PAYG withholding compliance',
      required: true,
      status: 'not_started' as const,
      completed_by: undefined,
      completed_at: undefined,
      linked_evidence: [],
      signoff_required: true,
      priority: 'high' as const
    },
    {
      id: 'chk-015',
      category: 'Liabilities',
      description: 'Confirm superannuation payments up to date',
      required: true,
      status: 'not_started' as const,
      completed_by: undefined,
      completed_at: undefined,
      linked_evidence: [],
      signoff_required: true,
      priority: 'high' as const
    },
    {
      id: 'chk-016',
      category: 'Revenue & Expenses',
      description: 'Perform revenue analytical review',
      required: true,
      status: 'not_started' as const,
      completed_by: undefined,
      completed_at: undefined,
      linked_evidence: [],
      signoff_required: false,
      priority: 'medium' as const
    },
    {
      id: 'chk-017',
      category: 'Revenue & Expenses',
      description: 'Review major expense categories',
      required: true,
      status: 'not_started' as const,
      completed_by: undefined,
      completed_at: undefined,
      linked_evidence: [],
      signoff_required: false,
      priority: 'medium' as const
    },
    {
      id: 'chk-018',
      category: 'Tax',
      description: 'Prepare Division 7A calculation',
      required: true,
      status: 'not_started' as const,
      completed_by: undefined,
      completed_at: undefined,
      linked_evidence: [],
      signoff_required: true,
      priority: 'high' as const
    },
    {
      id: 'chk-019',
      category: 'Tax',
      description: 'Prepare income tax reconciliation',
      required: true,
      status: 'not_started' as const,
      completed_by: undefined,
      completed_at: undefined,
      linked_evidence: [],
      signoff_required: true,
      priority: 'high' as const
    },
    {
      id: 'chk-020',
      category: 'Completion',
      description: 'Review all adjusting journal entries',
      required: true,
      status: 'not_started' as const,
      completed_by: undefined,
      completed_at: undefined,
      linked_evidence: [],
      signoff_required: true,
      priority: 'high' as const
    },
    {
      id: 'chk-021',
      category: 'Completion',
      description: 'Obtain management representation letter',
      required: true,
      status: 'not_started' as const,
      completed_by: undefined,
      completed_at: undefined,
      linked_evidence: [],
      signoff_required: true,
      priority: 'high' as const
    },
    {
      id: 'chk-022',
      category: 'Completion',
      description: 'Manager final review completed',
      required: true,
      status: 'not_started' as const,
      completed_by: undefined,
      completed_at: undefined,
      linked_evidence: [],
      signoff_required: true,
      priority: 'high' as const
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'not_started':
        return <Circle className="w-5 h-5 text-gray-400" />;
      case 'n/a':
        return <XCircle className="w-5 h-5 text-gray-400" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">COMPLETE</span>;
      case 'in_progress':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded">IN PROGRESS</span>;
      case 'not_started':
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded">NOT STARTED</span>;
      case 'n/a':
        return <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-xs font-semibold rounded">N/A</span>;
      default:
        return null;
    }
  };

  // Use evidence checklist if requested, otherwise use compliance checklist
  const activeChecklist = checklistType === 'evidence' ? evidenceChecklistItems : checklistItems;
  
  const filteredItems = filterStatus === 'all' 
    ? activeChecklist 
    : activeChecklist.filter(item => item.status === filterStatus);

  // Group by category
  const categories = Array.from(new Set(activeChecklist.map(item => item.category)));
  
  // Calculate stats
  const totalItems = activeChecklist.length;
  const completedItems = activeChecklist.filter(item => item.status === 'complete').length;
  const inProgressItems = activeChecklist.filter(item => item.status === 'in_progress').length;
  const notStartedItems = activeChecklist.filter(item => item.status === 'not_started').length;
  const completionPercent = Math.round((completedItems / totalItems) * 100);
  
  const checklistTitle = checklistType === 'evidence' 
    ? 'Supporting Documents & Evidence Checklist'
    : 'Year-End Completion Checklist';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-300 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <CheckSquare className="w-6 h-6 text-amber-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">{checklistTitle}</h1>
              <p className="text-xs text-gray-600">Checklist Workpaper • Manager approval required • FY2024</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save Progress
            </Button>
          </div>
        </div>

        {/* Metadata Bar */}
        <div className="grid grid-cols-6 gap-4 text-sm">
          <div>
            <span className="text-gray-600 text-xs">Status:</span>
            <div className="font-semibold text-amber-700">IN PROGRESS</div>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Completion:</span>
            <div className="font-semibold text-blue-700">{completionPercent}%</div>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Items:</span>
            <div className="font-semibold text-gray-900">{completedItems}/{totalItems}</div>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Preparer:</span>
            <div className="font-semibold text-gray-900">Sarah Chen</div>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Reviewer:</span>
            <div className="font-semibold text-gray-900">Michael Ross</div>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Last Updated:</span>
            <div className="font-semibold text-gray-900">2024-02-14</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Progress Bar */}
        <div className="bg-white border border-gray-300 rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Overall Progress</h3>
            <span className="text-2xl font-bold text-blue-600">{completionPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all"
              style={{ width: `${completionPercent}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">Complete: <strong>{completedItems}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-gray-700">In Progress: <strong>{inProgressItems}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">Not Started: <strong>{notStartedItems}</strong></span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="all">All Items</option>
              <option value="complete">Complete</option>
              <option value="in_progress">In Progress</option>
              <option value="not_started">Not Started</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter by Category
            </Button>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Custom Item
          </Button>
        </div>

        {/* Checklist by Category */}
        {categories.map((category) => {
          const categoryItems = filteredItems.filter(item => item.category === category);
          if (categoryItems.length === 0) return null;

          const categoryComplete = categoryItems.filter(item => item.status === 'complete').length;
          const categoryTotal = categoryItems.length;
          const categoryPercent = Math.round((categoryComplete / categoryTotal) * 100);

          return (
            <div key={category} className="border border-gray-300 rounded bg-white overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-300 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{category}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                      {categoryComplete}/{categoryTotal} complete
                    </span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${categoryPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-16">
                      Status
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">
                      Description
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-32">
                      Required
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-32">
                      Signoff
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 w-40">
                      Completed By
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 w-32">
                      Date
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-32">
                      Evidence
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categoryItems.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50">
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        {getStatusIcon(item.status)}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-gray-900">
                        {item.description}
                        {item.priority === 'high' && (
                          <AlertCircle className="w-3 h-3 text-red-600 inline ml-2" />
                        )}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        {item.required ? (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">YES</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded">NO</span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        {item.signoff_required ? (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded">REQ</span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-gray-700">
                        {item.completed_by || '-'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-gray-700 text-xs">
                        {item.completed_at || '-'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        {item.linked_evidence.length > 0 ? (
                          <Button size="sm" variant="outline">
                            <FileText className="w-3 h-3 mr-1" />
                            {item.linked_evidence.length}
                          </Button>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}

        {/* Manager Approval Section */}
        <div className="bg-purple-50 border border-purple-300 rounded p-4">
          <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Manager Approval Gate
          </h3>
          <p className="text-sm text-purple-800 mb-4">
            All required checklist items must be completed before manager approval. Items requiring signoff must be reviewed by the assigned reviewer.
          </p>
          <div className="flex items-center gap-3">
            <Button variant="outline" disabled={completionPercent < 100}>
              Request Manager Approval
            </Button>
            <span className="text-sm text-purple-700">
              {completionPercent < 100 ? `${totalItems - completedItems} items remaining` : 'Ready for approval'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}