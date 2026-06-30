import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle, AlertTriangle, Shield, Clock, FileText, User, XCircle, ArrowRight, Lock, UserCircle, ShieldAlert, PlusCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Decision {
  id: string;
  type: 'Approval' | 'Rejection' | 'Escalation' | 'Risk Adjustment' | 'EDD Review';
  title: string;
  approver: string;
  role: string;
  date: Date;
  rationale: string;
  status: 'Approved' | 'Rejected' | 'Pending' | 'Escalated' | 'Completed';
}

const mockDecisions: Decision[] = [
  {
    id: 'dec-001',
    type: 'Approval',
    title: 'Final KYC Onboarding Approval',
    approver: 'Tom Anderson',
    role: 'Chief Compliance Officer',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    rationale: 'All identity documents have been certified. UBO structure has been verified and screening returned zero material sanctions or PEP hits. Risk profile aligns with standard tolerance. Account is approved for active trading.',
    status: 'Approved'
  },
  {
    id: 'dec-002',
    type: 'EDD Review',
    title: 'Enhanced Due Diligence Clearance',
    approver: 'Sarah Jenkins',
    role: 'Senior AML Analyst',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    rationale: 'Completed EDD due to high-risk jurisdiction exposure in transaction history. Source of wealth has been corroborated with provided tax returns. Flag mitigated.',
    status: 'Completed'
  },
  {
    id: 'dec-003',
    type: 'Escalation',
    title: 'Escalation to Compliance Level 2',
    approver: 'Michael Chen',
    role: 'KYC Officer',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    rationale: 'Initial screening matched a potential partial name against Adverse Media. Escalating to Senior AML Analyst for manual review and false-positive determination.',
    status: 'Escalated'
  },
  {
    id: 'dec-004',
    type: 'Risk Adjustment',
    title: 'Risk Rating Elevated to High',
    approver: 'System Auto-Decision',
    role: 'Risk Engine',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    rationale: 'Automated risk engine adjusted profile to HIGH based on complex ownership structure spanning multiple jurisdictions and presence of a corporate trustee.',
    status: 'Completed'
  }
];

export function DecisionsTab({ clientId }: { clientId: string }) {
  const [decisions, setDecisions] = useState<Decision[]>(mockDecisions);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<Decision['type']>('EDD Review');
  const [newRationale, setNewRationale] = useState('');

  const closeModal = () => {
    setIsLogModalOpen(false);
    setNewTitle('');
    setNewRationale('');
    setNewType('EDD Review');
  };

  const handleLogDecision = () => {
    const titleTrimmed = newTitle.trim();
    const rationaleTrimmed = newRationale.trim();

    if (!titleTrimmed || !rationaleTrimmed) {
      toast.error('Please fill in all fields with valid text');
      return;
    }

    if (rationaleTrimmed.length < 10) {
      toast.error('Rationale must be at least 10 characters long to provide sufficient context');
      return;
    }

    if (rationaleTrimmed.length > 1000) {
      toast.error('Rationale exceeds the 1000 character limit');
      return;
    }

    const newDecision: Decision = {
      id: `dec-${Date.now()}`,
      type: newType,
      title: titleTrimmed,
      approver: 'Current User',
      role: 'KYC Analyst',
      date: new Date(),
      rationale: rationaleTrimmed,
      status: 'Pending'
    };

    setDecisions([newDecision, ...decisions]);
    closeModal();
    toast.success('New decision logged successfully');
  };

  const getStatusIcon = (status: Decision['status']) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'Rejected':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'Pending':
        return <Clock className="w-6 h-6 text-amber-500" />;
      case 'Escalated':
        return <AlertTriangle className="w-6 h-6 text-orange-500" />;
      case 'Completed':
        return <Shield className="w-6 h-6 text-blue-500" />;
      default:
        return <FileText className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: Decision['status']) => {
    switch (status) {
      case 'Approved':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">Approved</span>;
      case 'Rejected':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">Rejected</span>;
      case 'Pending':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">Pending</span>;
      case 'Escalated':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">Escalated</span>;
      case 'Completed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">Completed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Workflow Status Card */}
      <Card className="border-2 border-blue-100 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b pb-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" />
            Approval Workflow Status
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between mb-8 gap-6">
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Current Stage</h4>
              <p className="text-2xl font-bold text-blue-700">L2 Senior Review</p>
              <p className="text-sm text-gray-600 mt-1">Step 2 of 3</p>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Current Approver</h4>
              <div className="flex items-center gap-2">
                <UserCircle className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-bold text-gray-900">Sarah Jenkins</p>
                  <p className="text-xs text-gray-500">Senior AML Analyst</p>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Time in Stage</h4>
              <p className="text-lg font-bold text-gray-900">2 Days, 4 Hours</p>
              <p className="text-sm text-gray-600 mt-1">SLA: 5 Days</p>
            </div>
          </div>

          {/* Workflow Progress Steps */}
          <div className="relative flex justify-between items-center mb-8 px-4">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-1 bg-blue-500 transition-all"></div>
            
            <div className="relative flex flex-col items-center z-10">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center border-4 border-white shadow-sm">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <p className="mt-2 text-xs font-bold text-gray-900">L1 Maker</p>
              <p className="text-[10px] text-gray-500">Michael Chen</p>
            </div>

            <div className="relative flex flex-col items-center z-10">
              <div className="w-8 h-8 rounded-full bg-blue-50 border-4 border-blue-500 flex items-center justify-center shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></div>
              </div>
              <p className="mt-2 text-xs font-bold text-blue-700">L2 Checker</p>
              <p className="text-[10px] text-blue-600 font-semibold">In Progress</p>
            </div>

            <div className="relative flex flex-col items-center z-10">
              <div className="w-8 h-8 rounded-full bg-gray-100 border-4 border-white flex items-center justify-center shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
              </div>
              <p className="mt-2 text-xs font-bold text-gray-400">MLRO Sign-off</p>
              <p className="text-[10px] text-gray-400">Upcoming</p>
            </div>
          </div>

          {/* SoD Enforcement Alert */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-3 shadow-sm">
            <ShieldAlert className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-orange-900 text-sm">Separation of Duties (SoD) Enforced</h4>
              <p className="text-sm text-orange-800 mt-1">
                You are currently logged in as <strong>Michael Chen</strong>. Because you completed the <strong>L1 Maker</strong> step, system controls actively prevent you from completing the <strong>L2 Checker</strong> approval. This document must be reviewed by another authorized user.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-indigo-100 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-white border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-indigo-600" />
              Decision History & Audit Trail
            </CardTitle>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setIsLogModalOpen(true)}>
              <FileText className="w-4 h-4 mr-2" />
              Log New Decision
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative border-l-2 border-indigo-100 ml-4 pl-8 space-y-8">
            {decisions.map((decision, index) => (
              <div key={decision.id} className="relative">
                {/* Timeline Node */}
                <div className="absolute -left-[43px] top-1 bg-white p-1 rounded-full border-2 border-indigo-100">
                  {getStatusIcon(decision.status)}
                </div>

                <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{decision.title}</h3>
                        {getStatusBadge(decision.status)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700">{decision.type}</span>
                        <span>•</span>
                        <span>{format(decision.date, 'dd MMM yyyy, HH:mm')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border">
                      <div className="bg-indigo-100 p-2 rounded-full">
                        <User className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="text-sm">
                        <p className="font-bold text-gray-900">{decision.approver}</p>
                        <p className="text-gray-500 text-xs">{decision.role}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <span className="font-semibold text-gray-900 mr-2">Rationale:</span>
                      {decision.rationale}
                    </p>
                  </div>
                  
                  {index !== decisions.length - 1 && (
                    <div className="mt-4 flex items-center text-xs text-indigo-600 font-medium">
                      <ArrowRight className="w-3 h-3 mr-1" />
                      Previous state transition
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Log Decision Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200 border-0">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-600" />
                Log New Decision
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={closeModal} className="h-8 w-8 p-0 rounded-full">
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Decision Title</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Cleared Sanctions Alert"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Decision Type</label>
                <select 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newType}
                  onChange={e => setNewType(e.target.value as Decision['type'])}
                >
                  <option value="Approval">Approval</option>
                  <option value="Rejection">Rejection</option>
                  <option value="Escalation">Escalation</option>
                  <option value="Risk Adjustment">Risk Adjustment</option>
                  <option value="EDD Review">EDD Review</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Rationale</label>
                <textarea 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                  placeholder="Detail the reasoning for this decision..."
                  value={newRationale}
                  onChange={e => setNewRationale(e.target.value)}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={closeModal}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleLogDecision}>
                  Submit Decision
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
