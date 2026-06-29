import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  CheckCircle,
  Circle,
  AlertCircle,
  FileText,
  Upload,
  MessageSquare,
  X,
  Download,
  Save
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  status: 'complete' | 'pending' | 'not-applicable' | 'requires-attention';
  mandatory: boolean;
  notes?: string;
  attachments?: {
    name: string;
    uploadedDate: string;
    uploadedBy: string;
  }[];
}

export function ComplianceChecklist() {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    // Credit Checks
    {
      id: 'cc-001',
      category: 'Credit Checks',
      item: 'Company credit check completed',
      status: 'complete',
      mandatory: true,
      notes: 'CreditorWatch score 785 - Excellent rating',
      attachments: [
        { name: 'CreditorWatch_Report_ABC_Enterprises.pdf', uploadedDate: '2024-02-11', uploadedBy: 'Michael Chen' }
      ]
    },
    {
      id: 'cc-002',
      category: 'Credit Checks',
      item: 'Director 1 credit check completed',
      status: 'complete',
      mandatory: true,
      notes: 'John Smith - Equifax score 812 (Very Good)',
      attachments: [
        { name: 'Equifax_John_Smith.pdf', uploadedDate: '2024-02-11', uploadedBy: 'Michael Chen' }
      ]
    },
    {
      id: 'cc-003',
      category: 'Credit Checks',
      item: 'Director 2 credit check completed',
      status: 'complete',
      mandatory: true,
      notes: 'Jane Doe - Equifax score 795 (Very Good)',
      attachments: [
        { name: 'Equifax_Jane_Doe.pdf', uploadedDate: '2024-02-11', uploadedBy: 'Michael Chen' }
      ]
    },
    {
      id: 'cc-004',
      category: 'Credit Checks',
      item: 'Bankruptcy check - All directors',
      status: 'complete',
      mandatory: true,
      notes: 'No bankruptcies recorded for any directors'
    },
    {
      id: 'cc-005',
      category: 'Credit Checks',
      item: 'Adverse credit events reviewed',
      status: 'complete',
      mandatory: true,
      notes: 'No defaults, court actions, or adverse events found'
    },
    
    // Title & Security
    {
      id: 'ts-001',
      category: 'Title & Security',
      item: 'Title search completed',
      status: 'complete',
      mandatory: true,
      notes: 'InfoTrack search completed. Ownership verified.',
      attachments: [
        { name: 'Title_Search_Vol12345_Folio678.pdf', uploadedDate: '2024-02-08', uploadedBy: 'Michael Chen' }
      ]
    },
    {
      id: 'ts-002',
      category: 'Title & Security',
      item: 'Registered owner matches borrower',
      status: 'complete',
      mandatory: true,
      notes: 'ABC Enterprises Pty Ltd confirmed as registered owner'
    },
    {
      id: 'ts-003',
      category: 'Title & Security',
      item: 'Existing mortgages identified',
      status: 'requires-attention',
      mandatory: true,
      notes: 'CBA mortgage $450k registered 2020-03-15. Discharge required prior to settlement.',
      attachments: []
    },
    {
      id: 'ts-004',
      category: 'Title & Security',
      item: 'Caveats reviewed',
      status: 'requires-attention',
      mandatory: true,
      notes: 'Personal caveat by Jane Doe. Pending settlement - to be removed prior to our settlement.'
    },
    {
      id: 'ts-005',
      category: 'Title & Security',
      item: 'Easements reviewed',
      status: 'complete',
      mandatory: true,
      notes: 'Drainage easement - minimal impact, does not affect building'
    },
    {
      id: 'ts-006',
      category: 'Title & Security',
      item: 'Zoning compliance verified',
      status: 'complete',
      mandatory: true,
      notes: 'Commercial 1 zoning - compliant with intended use'
    },
    
    // KYC & Identity
    {
      id: 'kyc-001',
      category: 'KYC & Identity',
      item: 'Company ASIC search completed',
      status: 'complete',
      mandatory: true,
      notes: 'Current & Active - ACN 123 456 789',
      attachments: [
        { name: 'ASIC_Company_Extract.pdf', uploadedDate: '2024-02-10', uploadedBy: 'Sarah Johnson' }
      ]
    },
    {
      id: 'kyc-002',
      category: 'KYC & Identity',
      item: 'ABN verified',
      status: 'complete',
      mandatory: true,
      notes: 'ABN 12 345 678 901 - Active, GST registered'
    },
    {
      id: 'kyc-003',
      category: 'KYC & Identity',
      item: 'Director 1 ID verified',
      status: 'complete',
      mandatory: true,
      notes: 'John Smith - Australian Passport verified, expires 2028',
      attachments: [
        { name: 'John_Smith_Passport_Certified.pdf', uploadedDate: '2024-02-10', uploadedBy: 'Sarah Johnson' }
      ]
    },
    {
      id: 'kyc-004',
      category: 'KYC & Identity',
      item: 'Director 2 ID verified',
      status: 'complete',
      mandatory: true,
      notes: 'Jane Doe - Drivers License verified, expires 2026',
      attachments: [
        { name: 'Jane_Doe_License_Certified.pdf', uploadedDate: '2024-02-10', uploadedBy: 'Sarah Johnson' }
      ]
    },
    {
      id: 'kyc-005',
      category: 'KYC & Identity',
      item: 'Beneficial ownership disclosed',
      status: 'complete',
      mandatory: true,
      notes: 'John Smith 60%, Jane Doe 40% - both verified'
    },
    
    // AML/CTF
    {
      id: 'aml-001',
      category: 'AML/CTF',
      item: 'Source of funds verified',
      status: 'complete',
      mandatory: true,
      notes: 'Business operating cashflow - verified through bank statements and financials'
    },
    {
      id: 'aml-002',
      category: 'AML/CTF',
      item: 'PEP screening completed',
      status: 'complete',
      mandatory: true,
      notes: 'All parties screened - No PEPs identified'
    },
    {
      id: 'aml-003',
      category: 'AML/CTF',
      item: 'Sanctions screening completed',
      status: 'complete',
      mandatory: true,
      notes: 'All parties clear - no sanctions matches'
    },
    {
      id: 'aml-004',
      category: 'AML/CTF',
      item: 'Adverse media screening completed',
      status: 'complete',
      mandatory: true,
      notes: 'No adverse media found for any parties'
    },
    {
      id: 'aml-005',
      category: 'AML/CTF',
      item: 'Customer risk rating assigned',
      status: 'complete',
      mandatory: true,
      notes: 'Standard risk - Australian business, verified source of funds'
    },
    
    // Financial Verification
    {
      id: 'fin-001',
      category: 'Financial Verification',
      item: 'Financial statements verified',
      status: 'complete',
      mandatory: true,
      notes: 'FY2023 audited by KPMG',
      attachments: [
        { name: 'Financial_Statements_FY2023_Audited.pdf', uploadedDate: '2024-02-10', uploadedBy: 'Sarah Johnson' }
      ]
    },
    {
      id: 'fin-002',
      category: 'Financial Verification',
      item: 'Bank statements verified (6 months)',
      status: 'complete',
      mandatory: true,
      notes: 'No anomalies detected. Consistent trading pattern.',
      attachments: [
        { name: 'Bank_Statements_6_Months.pdf', uploadedDate: '2024-02-10', uploadedBy: 'Sarah Johnson' }
      ]
    },
    {
      id: 'fin-003',
      category: 'Financial Verification',
      item: 'Tax returns lodged (2 years)',
      status: 'complete',
      mandatory: true,
      notes: 'FY2022 and FY2023 lodged and verified'
    },
    {
      id: 'fin-004',
      category: 'Financial Verification',
      item: 'Serviceability calculations completed',
      status: 'complete',
      mandatory: true,
      notes: 'DSCR 1.32x - above minimum threshold of 1.25x'
    },
    
    // Security & Valuation
    {
      id: 'val-001',
      category: 'Security & Valuation',
      item: 'Property valuation completed',
      status: 'complete',
      mandatory: true,
      notes: 'Full valuation by McGrath Valuations - $1.2M',
      attachments: [
        { name: 'Valuation_Report_McGrath.pdf', uploadedDate: '2024-02-05', uploadedBy: 'Sarah Johnson' }
      ]
    },
    {
      id: 'val-002',
      category: 'Security & Valuation',
      item: 'LVR within policy limits',
      status: 'complete',
      mandatory: true,
      notes: 'LVR 70.8% - within 75% policy limit for commercial'
    },
    {
      id: 'val-003',
      category: 'Security & Valuation',
      item: 'Building & pest inspection',
      status: 'complete',
      mandatory: false,
      notes: 'Satisfactory - no major issues identified',
      attachments: [
        { name: 'Building_Pest_Report.pdf', uploadedDate: '2024-02-06', uploadedBy: 'Sarah Johnson' }
      ]
    },
    
    // Insurance
    {
      id: 'ins-001',
      category: 'Insurance',
      item: 'Property insurance required',
      status: 'pending',
      mandatory: true,
      notes: 'Certificate to be provided prior to settlement'
    },
    {
      id: 'ins-002',
      category: 'Insurance',
      item: 'Public liability insurance',
      status: 'pending',
      mandatory: true,
      notes: 'Certificate to be provided prior to settlement'
    },
    {
      id: 'ins-003',
      category: 'Insurance',
      item: 'Business interruption insurance',
      status: 'pending',
      mandatory: false,
      notes: 'Recommended but not mandatory for approval'
    },
    
    // Legal & Documentation
    {
      id: 'leg-001',
      category: 'Legal & Documentation',
      item: 'Contract of sale reviewed',
      status: 'complete',
      mandatory: true,
      notes: 'Standard terms - no unusual clauses',
      attachments: [
        { name: 'Contract_of_Sale.pdf', uploadedDate: '2024-02-10', uploadedBy: 'Sarah Johnson' }
      ]
    },
    {
      id: 'leg-002',
      category: 'Legal & Documentation',
      item: 'Section 32 statement reviewed',
      status: 'complete',
      mandatory: true,
      notes: 'Reviewed - all disclosures satisfactory',
      attachments: [
        { name: 'Section_32_Statement.pdf', uploadedDate: '2024-02-07', uploadedBy: 'Sarah Johnson' }
      ]
    },
    {
      id: 'leg-003',
      category: 'Legal & Documentation',
      item: 'Solicitor confirmation received',
      status: 'pending',
      mandatory: true,
      notes: 'Awaiting solicitor confirmation of instructions'
    }
  ]);

  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const getStatusIcon = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'requires-attention':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'not-applicable':
        return <Circle className="w-5 h-5 text-gray-400" />;
      default:
        return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  const getStatusBadge = (status: ChecklistItem['status']) => {
    const styles = {
      complete: 'bg-green-100 text-green-700',
      pending: 'bg-amber-100 text-amber-700',
      'not-applicable': 'bg-gray-100 text-gray-700',
      'requires-attention': 'bg-orange-100 text-orange-700'
    };

    const labels = {
      complete: 'Complete',
      pending: 'Pending',
      'not-applicable': 'N/A',
      'requires-attention': 'Attention Required'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const updateItemStatus = (id: string, status: ChecklistItem['status']) => {
    setChecklistItems(items =>
      items.map(item => (item.id === id ? { ...item, status } : item))
    );
  };

  const saveNote = (id: string) => {
    setChecklistItems(items =>
      items.map(item => (item.id === id ? { ...item, notes: noteText } : item))
    );
    setEditingItem(null);
    setNoteText('');
  };

  const startEditingNote = (item: ChecklistItem) => {
    setEditingItem(item.id);
    setNoteText(item.notes || '');
  };

  const groupedItems = checklistItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const getCompletionStats = () => {
    const total = checklistItems.filter(item => item.mandatory).length;
    const completed = checklistItems.filter(
      item => item.mandatory && item.status === 'complete'
    ).length;
    const attention = checklistItems.filter(
      item => item.status === 'requires-attention'
    ).length;
    return { total, completed, attention, percentage: Math.round((completed / total) * 100) };
  };

  const stats = getCompletionStats();

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Compliance Checklist</h3>
            <p className="text-sm text-gray-600">Track all mandatory checks and documentation</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{stats.percentage}%</p>
              <p className="text-xs text-gray-600">Complete</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {stats.completed}/{stats.total}
              </p>
              <p className="text-xs text-gray-600">Mandatory Items</p>
            </div>
            {stats.attention > 0 && (
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-600">{stats.attention}</p>
                <p className="text-xs text-gray-600">Needs Attention</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${stats.percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Checklist Items by Category */}
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category} className="bg-white border border-gray-300 rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">{category}</h4>
          <div className="space-y-3">
            {items.map(item => (
              <div
                key={item.id}
                className={`border rounded-lg p-4 ${
                  item.status === 'requires-attention'
                    ? 'border-orange-300 bg-orange-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(item.status)}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{item.item}</p>
                          {item.mandatory && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                              Mandatory
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(item.status)}
                        <select
                          value={item.status}
                          onChange={(e) =>
                            updateItemStatus(item.id, e.target.value as ChecklistItem['status'])
                          }
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="complete">Complete</option>
                          <option value="requires-attention">Attention Required</option>
                          <option value="not-applicable">N/A</option>
                        </select>
                      </div>
                    </div>

                    {/* Notes Section */}
                    {editingItem === item.id ? (
                      <div className="mt-3">
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add notes or explanation..."
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          rows={3}
                        />
                        <div className="flex items-center gap-2 mt-2">
                          <Button size="sm" onClick={() => saveNote(item.id)}>
                            <Save className="w-3 h-3 mr-1" />
                            Save Note
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingItem(null);
                              setNoteText('');
                            }}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {item.notes && (
                          <div className="mt-2 p-3 bg-white rounded border border-gray-200">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-2 flex-1">
                                <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                                <p className="text-sm text-gray-700">{item.notes}</p>
                              </div>
                              <button
                                onClick={() => startEditingNote(item)}
                                className="text-xs text-blue-600 hover:text-blue-700"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        )}
                        {!item.notes && (
                          <button
                            onClick={() => startEditingNote(item)}
                            className="mt-2 text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" />
                            Add Note
                          </button>
                        )}
                      </>
                    )}

                    {/* Attachments Section */}
                    {item.attachments && item.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {item.attachments.map((att, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-blue-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{att.name}</p>
                                <p className="text-xs text-gray-500">
                                  {att.uploadedDate} by {att.uploadedBy}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload Button */}
                    <div className="mt-2">
                      <Button variant="outline" size="sm">
                        <Upload className="w-3 h-3 mr-2" />
                        Attach Document
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Final Approval Section */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Final Sign-off</h4>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                I confirm all mandatory compliance checks have been completed and reviewed
              </p>
              <p className="text-sm text-gray-600 mt-1">
                All items marked as "Attention Required" have been documented with appropriate
                explanations and supporting documentation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Compliance Review
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Checklist Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
