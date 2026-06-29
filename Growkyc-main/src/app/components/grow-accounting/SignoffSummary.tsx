import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  User,
  Calendar,
  FileText,
  Download,
  Send,
  Shield,
  Edit,
  Eye
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';
import { toast } from 'sonner';

interface SignoffSummaryProps {
  onNavigate?: (page: string) => void;
  jobId?: string;
}

interface SectionSignoff {
  id: string;
  name: string;
  group: string;
  preparedBy: string;
  preparedDate: string;
  reviewedBy: string;
  reviewedDate: string;
  status: 'signed-off' | 'pending-review' | 'incomplete';
  completeness: number;
  flagsCount: number;
}

export function SignoffSummary({ onNavigate, jobId = 'JOB-2024-045' }: SignoffSummaryProps) {
  const [isLocked, setIsLocked] = useState(false);
  const [preparerSignature, setPreparerSignature] = useState('');
  const [reviewerSignature, setReviewerSignature] = useState('');
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  const sections: SectionSignoff[] = [
    {
      id: 'checklist',
      name: 'Client Retention Checklist',
      group: 'Admin + Client Comms',
      preparedBy: 'Mike Brown',
      preparedDate: '2024-02-12',
      reviewedBy: 'Sarah Johnson',
      reviewedDate: '2024-02-13',
      status: 'signed-off',
      completeness: 100,
      flagsCount: 0
    },
    {
      id: 'materials',
      name: 'Materials Requested',
      group: 'Admin + Client Comms',
      preparedBy: 'Mike Brown',
      preparedDate: '2024-02-12',
      reviewedBy: 'Sarah Johnson',
      reviewedDate: '2024-02-13',
      status: 'signed-off',
      completeness: 100,
      flagsCount: 0
    },
    {
      id: 'ato-prefill',
      name: 'ATO Prefill',
      group: 'ATO + Prefill',
      preparedBy: 'Mike Brown',
      preparedDate: '2024-02-13',
      reviewedBy: 'Sarah Johnson',
      reviewedDate: '2024-02-14',
      status: 'signed-off',
      completeness: 100,
      flagsCount: 0
    },
    {
      id: 'income-1',
      name: 'Income Indiv. 1',
      group: 'Income + Deductions',
      preparedBy: 'Mike Brown',
      preparedDate: '2024-02-13',
      reviewedBy: 'Sarah Johnson',
      reviewedDate: '2024-02-14',
      status: 'signed-off',
      completeness: 100,
      flagsCount: 0
    },
    {
      id: 'deductions-1',
      name: 'Deductions Indiv. 1',
      group: 'Income + Deductions',
      preparedBy: 'Mike Brown',
      preparedDate: '2024-02-13',
      reviewedBy: 'Sarah Johnson',
      reviewedDate: '2024-02-14',
      status: 'signed-off',
      completeness: 100,
      flagsCount: 0
    },
    {
      id: 'investment-income',
      name: 'Investment Income',
      group: 'Investments',
      preparedBy: 'Mike Brown',
      preparedDate: '2024-02-13',
      reviewedBy: 'Sarah Johnson',
      reviewedDate: '2024-02-14',
      status: 'signed-off',
      completeness: 100,
      flagsCount: 0
    },
    {
      id: 'rental-1',
      name: 'Rental Property 1',
      group: 'Investments',
      preparedBy: 'Mike Brown',
      preparedDate: '2024-02-13',
      reviewedBy: '',
      reviewedDate: '',
      status: 'pending-review',
      completeness: 95,
      flagsCount: 1
    },
    {
      id: 'bas-gst',
      name: 'BAS-GST Reconciliation',
      group: 'BAS + ATO Accounts',
      preparedBy: 'Mike Brown',
      preparedDate: '2024-02-13',
      reviewedBy: '',
      reviewedDate: '',
      status: 'pending-review',
      completeness: 90,
      flagsCount: 2
    },
    {
      id: 'tax-summary',
      name: 'Tax Summary',
      group: 'Finalisation',
      preparedBy: '',
      preparedDate: '',
      reviewedBy: '',
      reviewedDate: '',
      status: 'incomplete',
      completeness: 0,
      flagsCount: 0
    }
  ];

  const signedOffCount = sections.filter(s => s.status === 'signed-off').length;
  const pendingCount = sections.filter(s => s.status === 'pending-review').length;
  const incompleteCount = sections.filter(s => s.status === 'incomplete').length;
  const totalFlagsCount = sections.reduce((sum, s) => sum + s.flagsCount, 0);

  const canLock = signedOffCount === sections.length && declarationAccepted && preparerSignature && reviewerSignature;

  const handleLock = () => {
    if (!canLock) {
      toast.error('Cannot lock workpapers', {
        description: 'All sections must be signed off and declaration accepted'
      });
      return;
    }

    setIsLocked(true);
    toast.success('Workpapers locked successfully', {
      description: 'This job is now read-only and ready for lodgement'
    });
  };

  const handleUnlock = () => {
    setIsLocked(false);
    toast.info('Workpapers unlocked', {
      description: 'Changes can now be made to this job'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed-off': return 'text-green-400 bg-green-500/15';
      case 'pending-review': return 'text-orange-400 bg-orange-500/15';
      case 'incomplete': return 'text-slate-300 bg-white/5';
      default: return 'text-slate-300 bg-white/5';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed-off': return <CheckCircle className="w-4 h-4" />;
      case 'pending-review': return <Clock className="w-4 h-4" />;
      case 'incomplete': return <XCircle className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'signed-off': return 'Signed Off';
      case 'pending-review': return 'Pending Review';
      case 'incomplete': return 'Incomplete';
      default: return status;
    }
  };

  // Group sections
  const groupedSections = sections.reduce((acc, section) => {
    if (!acc[section.group]) {
      acc[section.group] = [];
    }
    acc[section.group].push(section);
    return acc;
  }, {} as Record<string, SectionSignoff[]>);

  return (
    <WorkpaperLayout currentPage="workpapers" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate?.('jobs')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
            <div>
              <h1 className="text-[28px] font-semibold text-slate-100">Signoff Summary</h1>
              <p className="text-sm text-slate-300 mt-1">Smith, John & Mary • Individual Tax Return • FY2024 • {jobId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isLocked && (
              <>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Summary
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!canLock}
                  onClick={handleLock}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Lock & Finalize
                </Button>
              </>
            )}
            {isLocked && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleUnlock}
                >
                  <Unlock className="w-4 h-4 mr-2" />
                  Unlock
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Send className="w-4 h-4 mr-2" />
                  Send to Client
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Lock State Banner */}
        {isLocked && (
          <Card className="bg-green-500/10 border-green-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-green-400" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-300">Workpapers Locked</h3>
                  <p className="text-sm text-green-300">
                    This job has been finalized and is now in read-only mode. All changes are locked until unlocked by a manager.
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded">
                  LOCKED
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-300 uppercase tracking-wider">Signed Off</p>
                  <p className="text-2xl font-bold text-green-400 mt-1">{signedOffCount}/{sections.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/15 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-300 uppercase tracking-wider">Pending Review</p>
                  <p className="text-2xl font-bold text-orange-400 mt-1">{pendingCount}</p>
                </div>
                <div className="w-12 h-12 bg-orange-500/15 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-300 uppercase tracking-wider">Incomplete</p>
                  <p className="text-2xl font-bold text-slate-300 mt-1">{incompleteCount}</p>
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-slate-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-300 uppercase tracking-wider">Outstanding Flags</p>
                  <p className="text-2xl font-bold text-red-400 mt-1">{totalFlagsCount}</p>
                </div>
                <div className="w-12 h-12 bg-red-500/15 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Status Table */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Section Signoff Status</h2>
            
            <div className="space-y-4">
              {Object.entries(groupedSections).map(([group, groupSections]) => (
                <div key={group}>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                    {group}
                  </h3>
                  <div className="space-y-1">
                    {groupSections.map((section) => (
                      <div 
                        key={section.id}
                        className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <span className={`px-2 py-1 text-xs font-semibold rounded flex items-center gap-1 ${getStatusColor(section.status)}`}>
                            {getStatusIcon(section.status)}
                            {getStatusLabel(section.status)}
                          </span>
                          <span className="font-medium text-slate-100">{section.name}</span>
                          {section.flagsCount > 0 && (
                            <span className="px-2 py-0.5 bg-red-500/15 text-red-300 text-xs font-semibold rounded">
                              {section.flagsCount} flags
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-6 text-sm">
                          {section.preparedBy && (
                            <div className="text-right">
                              <p className="text-xs text-slate-400">Prepared by</p>
                              <p className="font-medium text-slate-100">{section.preparedBy}</p>
                              <p className="text-xs text-slate-400">{new Date(section.preparedDate).toLocaleDateString()}</p>
                            </div>
                          )}
                          {section.reviewedBy && (
                            <div className="text-right">
                              <p className="text-xs text-slate-400">Reviewed by</p>
                              <p className="font-medium text-slate-100">{section.reviewedBy}</p>
                              <p className="text-xs text-slate-400">{new Date(section.reviewedDate).toLocaleDateString()}</p>
                            </div>
                          )}
                          {!isLocked && (
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Declaration */}
        {!isLocked && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-slate-100 mb-4">Declaration</h2>
              
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-100 mb-3">Professional Declaration</h3>
                  <div className="text-sm text-slate-300 space-y-2">
                    <p>I declare that:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>All information provided in this tax return is true and correct to the best of my knowledge</li>
                      <li>All workpapers have been prepared in accordance with professional standards</li>
                      <li>All source documents have been reviewed and verified</li>
                      <li>All AI flags and variances have been adequately explained and resolved</li>
                      <li>This return is ready for lodgement with the ATO</li>
                    </ul>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={declarationAccepted}
                    onChange={(e) => setDeclarationAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-white/10 text-blue-400 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-300">
                    I accept the above declaration and confirm that all information is accurate and complete
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Signatures */}
        {!isLocked && (
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-100 mb-4">Preparer Signature</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={preparerSignature}
                      onChange={(e) => setPreparerSignature(e.target.value)}
                      placeholder="Mike Brown"
                      className="w-full px-3 py-2 text-sm border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-300">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Mike Brown
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-100 mb-4">Reviewer Signature</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={reviewerSignature}
                      onChange={(e) => setReviewerSignature(e.target.value)}
                      placeholder="Sarah Johnson"
                      className="w-full px-3 py-2 text-sm border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-300">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Sarah Johnson
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Locked State - Read Only Signatures */}
        {isLocked && (
          <Card className="border-green-300">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-slate-100 mb-4">Final Signatures</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-xs text-slate-300 uppercase tracking-wider mb-2">Prepared By</p>
                  <p className="text-lg font-semibold text-slate-100 mb-1">{preparerSignature}</p>
                  <p className="text-sm text-slate-300">{new Date().toLocaleDateString()}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-xs text-slate-300 uppercase tracking-wider mb-2">Reviewed By</p>
                  <p className="text-lg font-semibold text-slate-100 mb-1">{reviewerSignature}</p>
                  <p className="text-sm text-slate-300">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Warning if not ready */}
        {!isLocked && !canLock && (
          <Card className="bg-orange-500/10 border-orange-300">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-300 mb-1">Not Ready to Lock</h4>
                  <p className="text-sm text-orange-300">
                    Before locking, ensure all sections are signed off, the declaration is accepted, and both preparer and reviewer signatures are provided.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </WorkpaperLayout>
  );
}
