import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Shield
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';
import { toast } from 'sonner';

interface ExcelSignoffSummaryProps {
  onNavigate?: (page: string) => void;
  jobId?: string;
}

interface SectionStatus {
  id: string;
  section: string;
  preparedBy: string;
  preparedDate: string;
  reviewedBy: string;
  reviewedDate: string;
  status: 'signed' | 'pending' | 'returned';
  flagsCount: number;
}

export function ExcelSignoffSummary({ onNavigate, jobId = 'JOB-2024-045' }: ExcelSignoffSummaryProps) {
  const [isLocked, setIsLocked] = useState(false);
  const [preparerSignature, setPreparerSignature] = useState('');
  const [reviewerSignature, setReviewerSignature] = useState('');
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  const sections: SectionStatus[] = [
    {
      id: 'S1',
      section: 'Client Retention Checklist',
      preparedBy: 'Mike Brown',
      preparedDate: '2024-02-12',
      reviewedBy: 'Sarah Johnson',
      reviewedDate: '2024-02-13',
      status: 'signed',
      flagsCount: 0
    },
    {
      id: 'S2',
      section: 'Materials Requested',
      preparedBy: 'Mike Brown',
      preparedDate: '2024-02-12',
      reviewedBy: 'Sarah Johnson',
      reviewedDate: '2024-02-13',
      status: 'signed',
      flagsCount: 0
    },
    {
      id: 'S3',
      section: 'ATO Prefill',
      preparedBy: 'Mike Brown',
      preparedDate: '2024-02-13',
      reviewedBy: 'Sarah Johnson',
      reviewedDate: '2024-02-14',
      status: 'signed',
      flagsCount: 0
    },
    {
      id: 'S4',
      section: 'Income Indiv. 1',
      preparedBy: 'Mike Brown',
      preparedDate: '2024-02-13',
      reviewedBy: 'Sarah Johnson',
      reviewedDate: '2024-02-14',
      status: 'signed',
      flagsCount: 0
    },
    {
      id: 'S5',
      section: 'Deductions Indiv. 1',
      preparedBy: 'Mike Brown',
      preparedDate: '2024-02-13',
      reviewedBy: 'Sarah Johnson',
      reviewedDate: '2024-02-14',
      status: 'signed',
      flagsCount: 0
    },
    {
      id: 'S6',
      section: 'Investment Income',
      preparedBy: 'Mike Brown',
      preparedDate: '2024-02-13',
      reviewedBy: 'Sarah Johnson',
      reviewedDate: '2024-02-14',
      status: 'signed',
      flagsCount: 0
    },
    {
      id: 'S7',
      section: 'Rental Property 1',
      preparedBy: 'Mike Brown',
      preparedDate: '2024-02-13',
      reviewedBy: '',
      reviewedDate: '',
      status: 'pending',
      flagsCount: 1
    },
    {
      id: 'S8',
      section: 'BAS-GST Reconciliation',
      preparedBy: 'Mike Brown',
      preparedDate: '2024-02-13',
      reviewedBy: '',
      reviewedDate: '',
      status: 'pending',
      flagsCount: 2
    }
  ];

  const signedCount = sections.filter(s => s.status === 'signed').length;
  const pendingCount = sections.filter(s => s.status === 'pending').length;
  const returnedCount = sections.filter(s => s.status === 'returned').length;
  const totalFlagsCount = sections.reduce((sum, s) => sum + s.flagsCount, 0);

  const canLock = signedCount === sections.length && declarationAccepted && preparerSignature && reviewerSignature;

  const handleLock = () => {
    if (!canLock) {
      toast.error('Cannot lock workpapers', {
        description: 'All sections must be signed off and declaration accepted'
      });
      return;
    }
    setIsLocked(true);
    toast.success('Workpapers locked', {
      description: 'Job is now read-only and ready for lodgement'
    });
  };

  const handleUnlock = () => {
    setIsLocked(false);
    toast.info('Workpapers unlocked', {
      description: 'Changes can now be made'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'signed':
        return <span className="px-2 py-0.5 bg-green-500/15 text-green-300 text-xs font-semibold rounded">Signed</span>;
      case 'pending':
        return <span className="px-2 py-0.5 bg-orange-500/15 text-orange-300 text-xs font-semibold rounded">Pending</span>;
      case 'returned':
        return <span className="px-2 py-0.5 bg-red-500/15 text-red-300 text-xs font-semibold rounded">Returned</span>;
      default:
        return null;
    }
  };

  return (
    <WorkpaperLayout currentPage="workpapers" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => onNavigate?.('jobs')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-slate-100">Signoff Summary</h1>
              <p className="text-sm text-slate-300 mt-1">Smith, John & Mary • Individual Tax Return • FY2024 • {jobId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isLocked ? (
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!canLock}
                onClick={handleLock}
              >
                <Lock className="w-4 h-4 mr-2" />
                Lock & Finalize
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={handleUnlock}>
                  <Unlock className="w-4 h-4 mr-2" />
                  Unlock
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  Send to Client
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Lock Banner */}
        {isLocked && (
          <div className="bg-green-500/10 border border-green-300 rounded px-4 py-3">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-green-400" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-300">Workpapers Locked</h3>
                <p className="text-sm text-green-300">Job is now read-only and ready for lodgement</p>
              </div>
              <span className="px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded">LOCKED</span>
            </div>
          </div>
        )}

        {/* Stats Bar */}
        <div className="bg-white/5 border border-white/10 rounded px-6 py-3">
          <div className="flex items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-300">Signed:</span>
              <span className="font-semibold text-green-400">{signedCount}/{sections.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-300">Pending:</span>
              <span className="font-semibold text-orange-400">{pendingCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-300">Returned:</span>
              <span className="font-semibold text-red-400">{returnedCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-300">Outstanding Flags:</span>
              <span className="font-semibold text-red-400">{totalFlagsCount}</span>
            </div>
          </div>
        </div>

        {/* Section Status Table */}
        <div className="border border-white/10 rounded bg-white overflow-hidden">
          <div className="bg-white/5 border-b border-white/10 px-4 py-2">
            <h3 className="font-semibold text-slate-100">Section Signoff Status</h3>
          </div>
          <table className="w-full text-sm border-collapse">
            {/* Header Row */}
            <thead>
              <tr className="bg-white/5">
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300 w-8">Ref</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Section</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300 w-32">Prepared By</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300 w-28">Prep. Date</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300 w-32">Reviewed By</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300 w-28">Review Date</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300 w-20">Flags</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300 w-24">Status</th>
              </tr>
            </thead>

            {/* Data Rows */}
            <tbody>
              {sections.map((section) => (
                <tr 
                  key={section.id} 
                  className={`hover:bg-white/5 ${
                    section.status === 'signed' ? 'bg-green-500/10' :
                    section.status === 'returned' ? 'bg-red-500/10' : ''
                  }`}
                >
                  <td className="border border-white/10 px-3 py-2 text-center text-slate-300 font-mono text-xs">
                    {section.id}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-slate-100">
                    {section.section}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-slate-300">
                    {section.preparedBy || <span className="text-gray-400">-</span>}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-slate-300 font-mono text-xs">
                    {section.preparedDate ? new Date(section.preparedDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-slate-300">
                    {section.reviewedBy || <span className="text-gray-400">-</span>}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-slate-300 font-mono text-xs">
                    {section.reviewedDate ? new Date(section.reviewedDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-center">
                    {section.flagsCount > 0 ? (
                      <span className="text-red-400 font-semibold">{section.flagsCount}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-center">
                    {getStatusBadge(section.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Declaration */}
        {!isLocked && (
          <div className="border border-white/10 rounded bg-white p-6">
            <h3 className="font-semibold text-slate-100 mb-4">Professional Declaration</h3>
            
            <div className="bg-white/5 border border-white/10 rounded p-4 text-sm text-slate-300 mb-4">
              <p className="mb-2">I declare that:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>All information in this tax return is true and correct</li>
                <li>All workpapers prepared in accordance with professional standards</li>
                <li>All source documents reviewed and verified</li>
                <li>All AI flags and variances adequately explained</li>
                <li>This return is ready for lodgement with the ATO</li>
              </ul>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={declarationAccepted}
                onChange={(e) => setDeclarationAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-white/10 text-blue-400 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-300">
                I accept the above declaration and confirm all information is accurate
              </span>
            </label>
          </div>
        )}

        {/* Signatures */}
        {!isLocked && (
          <div className="border border-white/10 rounded bg-white overflow-hidden">
            <div className="bg-white/5 border-b border-white/10 px-4 py-2">
              <h3 className="font-semibold text-slate-100">Signatures</h3>
            </div>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white/5">
                  <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300 w-32">Role</th>
                  <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Name</th>
                  <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300 w-32">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-white/5">
                  <td className="border border-white/10 px-3 py-2 font-semibold text-slate-100">Preparer</td>
                  <td className="border border-white/10 px-3 py-2">
                    <input
                      type="text"
                      value={preparerSignature}
                      onChange={(e) => setPreparerSignature(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full px-2 py-1 border border-white/10 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-slate-300 font-mono text-xs">
                    {new Date().toLocaleDateString()}
                  </td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="border border-white/10 px-3 py-2 font-semibold text-slate-100">Reviewer</td>
                  <td className="border border-white/10 px-3 py-2">
                    <input
                      type="text"
                      value={reviewerSignature}
                      onChange={(e) => setReviewerSignature(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full px-2 py-1 border border-white/10 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-slate-300 font-mono text-xs">
                    {new Date().toLocaleDateString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Locked Signatures View */}
        {isLocked && (
          <div className="border border-green-300 rounded bg-white overflow-hidden">
            <div className="bg-green-500/10 border-b border-green-300 px-4 py-2">
              <h3 className="font-semibold text-green-300">Final Signatures (Locked)</h3>
            </div>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white/5">
                  <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300 w-32">Role</th>
                  <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Name</th>
                  <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300 w-32">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-green-500/10">
                  <td className="border border-white/10 px-3 py-2 font-semibold text-slate-100">Preparer</td>
                  <td className="border border-white/10 px-3 py-2 font-semibold text-slate-100">{preparerSignature}</td>
                  <td className="border border-white/10 px-3 py-2 text-slate-300 font-mono text-xs">
                    {new Date().toLocaleDateString()}
                  </td>
                </tr>
                <tr className="bg-green-500/10">
                  <td className="border border-white/10 px-3 py-2 font-semibold text-slate-100">Reviewer</td>
                  <td className="border border-white/10 px-3 py-2 font-semibold text-slate-100">{reviewerSignature}</td>
                  <td className="border border-white/10 px-3 py-2 text-slate-300 font-mono text-xs">
                    {new Date().toLocaleDateString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Warning */}
        {!isLocked && !canLock && (
          <div className="bg-orange-500/10 border border-orange-300 rounded px-4 py-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-300">Not Ready to Lock</h4>
                <p className="text-sm text-orange-300">
                  All sections must be signed off, declaration accepted, and both signatures provided
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </WorkpaperLayout>
  );
}
