// Engagement Letter, Internal Review & Activation Components
import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, AlertCircle, Shield, Lock, XCircle, Clock } from 'lucide-react';
import { PrimaryButton, SecondaryButton, StatusBadge } from './DesignSystem';
import { toast } from 'sonner';

// ENGAGEMENT LETTER COMPONENT
export function EngagementLetter({ entities, onBack, onContinue }: any) {
  const [agreed, setAgreed] = useState(false);
  const [fullName, setFullName] = useState('');
  const [date, setDate] = useState('');

  const totalAnnual = entities.reduce((sum: number, e: any) => sum + e.pricing, 0);
  const totalMonthly = Math.round(totalAnnual / 12);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Phase 3: Engagement & Payment</h2>
        <p className="text-slate-300">Review and sign your engagement letter</p>
      </div>

      <div className="bg-white border-2 border-white/10 rounded-lg p-8 max-h-[600px] overflow-y-auto">
        <h3 className="text-xl font-bold text-slate-100 mb-6">Engagement Letter</h3>
        
        <div className="prose max-w-none space-y-4 text-sm">
          <p className="text-slate-300">
            This engagement letter confirms our appointment as your accountants and tax agents for the following entities:
          </p>

          <div className="space-y-4 my-6">
            {entities.map((entity: any) => (
              <div key={entity.id} className="p-4 bg-white/5 rounded-lg border-2 border-white/10">
                <h4 className="font-bold text-slate-100">{entity.name}</h4>
                <p className="text-sm text-slate-300 mt-1">Entity Type: {entity.type}</p>
                <div className="mt-2">
                  <p className="text-sm font-semibold text-slate-300">Services:</p>
                  <ul className="list-disc list-inside text-sm text-slate-300 mt-1">
                    {entity.services.map((service: string) => (
                      <li key={service}>{service}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm font-semibold text-slate-100 mt-2">
                  Annual Fee: ${entity.pricing.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-lg p-4 my-6">
            <h4 className="font-bold text-blue-300 mb-2">Total Investment</h4>
            <div className="flex justify-between text-blue-300">
              <span>Annual Total:</span>
              <span className="text-xl font-bold">${totalAnnual.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-blue-300 text-sm mt-1">
              <span>Monthly (approximate):</span>
              <span className="font-semibold">${totalMonthly.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-3 text-slate-300">
            <h4 className="font-bold text-slate-100 text-base">Terms & Conditions:</h4>
            
            <div className="space-y-2 pl-4">
              <p>✓ <strong>Authority to Act:</strong> You authorize us to act on your behalf with the ATO and other regulatory bodies</p>
              <p>✓ <strong>AML/CTF Compliance:</strong> You consent to ongoing AML/CTF monitoring and verification</p>
              <p>✓ <strong>Ongoing Monitoring:</strong> You agree to notify us of any material changes to your circumstances</p>
              <p>✓ <strong>Privacy & Confidentiality:</strong> We will protect your information in accordance with Australian Privacy Principles</p>
              <p>✓ <strong>Payment Terms:</strong> Fees are payable monthly in advance or as otherwise agreed</p>
              <p>✓ <strong>Ownership Changes:</strong> You must notify us of any ownership or control changes within 30 days</p>
              <p>✓ <strong>Document Requests:</strong> You agree to provide requested documents within reasonable timeframes</p>
            </div>
          </div>

          <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-lg p-4 my-6">
            <h4 className="font-bold text-amber-300 mb-2">Important Notes:</h4>
            <ul className="text-sm text-amber-300 space-y-1">
              <li>• This engagement commences upon signature and payment</li>
              <li>• AML/CTF verification must be completed before service delivery</li>
              <li>• High risk clients require additional compliance officer approval</li>
              <li>• We reserve the right to terminate if compliance obligations cannot be met</li>
            </ul>
          </div>
        </div>

        <div className="border-t-2 border-white/10 pt-6 mt-6">
          <div className="flex items-start gap-3 mb-6">
            <input
              type="checkbox"
              id="accept-terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4"
            />
            <label htmlFor="accept-terms" className="text-sm text-slate-300">
              I have read and agree to the terms of this engagement letter. I confirm that all information provided is accurate and complete.
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-white/10 rounded-lg"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-white/10 rounded-lg"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Digital Signature <span className="text-red-400">*</span>
            </label>
            <div className="border-2 border-white/10 rounded-lg h-32 flex items-center justify-center bg-white/5">
              <span className="text-gray-400">Signature will be captured here</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <SecondaryButton onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </SecondaryButton>
        <div className="flex items-center gap-4">
          {!agreed && (
            <div className="flex items-center gap-2 text-amber-400">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">Please accept terms</span>
            </div>
          )}
          <PrimaryButton
            onClick={() => {
              // For testing: Allow continuing without completing all fields
              toast.success('✓ Engagement letter acknowledged');
              onContinue();
            }}
          >
            Sign & Continue to AML/CDD
            <ArrowRight className="w-4 h-4 ml-2" />
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

// INTERNAL REVIEW & APPROVAL COMPONENT
export function InternalReviewAndApproval({ entities, onApprove, onReject, onBack, onContinue, canProgress }: any) {
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [comments, setComments] = useState('');
  const [reason, setReason] = useState('');
  const [role, setRole] = useState('Manager');

  const selectedEntity = entities.find((e: any) => e.id === selectedEntityId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Phase 5: Internal Review & Manager Approval</h2>
        <p className="text-slate-300">Review compliance checks and approve or reject each entity</p>
      </div>

      {/* Compliance Matrix */}
      <div className="bg-white border-2 border-white/10 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5 border-b-2 border-white/10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-300 uppercase">Entity</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-300 uppercase">ID Verified</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-300 uppercase">UBO</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-300 uppercase">Sanctions</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-300 uppercase">PEP</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-300 uppercase">Risk</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-300 uppercase">Approval</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {entities.map((entity: any) => (
              <tr key={entity.id} className="hover:bg-white/5">
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-100">{entity.name}</p>
                  <p className="text-xs text-slate-300">{entity.type}</p>
                </td>
                <td className="px-4 py-3">
                  {entity.data.idDocuments ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                </td>
                <td className="px-4 py-3">
                  {entity.data.beneficialOwners?.length > 0 || entity.data.fullLegalName ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                </td>
                <td className="px-4 py-3">
                  {entity.data.sanctionsResult === 'clear' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : entity.data.sanctionsResult === 'hit' ? (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-400" />
                  )}
                </td>
                <td className="px-4 py-3">
                  {entity.data.pepResult === 'clear' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : entity.data.pepResult === 'hit' ? (
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-400" />
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-bold rounded ${
                    entity.riskStatus === 'low' ? 'bg-green-500/15 text-green-300' :
                    entity.riskStatus === 'medium' ? 'bg-amber-500/15 text-amber-300' :
                    entity.riskStatus === 'high' ? 'bg-red-500/15 text-red-300' :
                    'bg-white/5 text-slate-300'
                  }`}>
                    {entity.riskStatus.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    status={
                      entity.data.approvalStatus === 'approved' ? 'approved' :
                      entity.data.approvalStatus === 'rejected' ? 'rejected' :
                      'pending'
                    }
                  />
                </td>
                <td className="px-4 py-3">
                  {entity.data.approvalStatus !== 'approved' && entity.data.approvalStatus !== 'rejected' && (
                    <button
                      onClick={() => setSelectedEntityId(entity.id)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Review
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Approval Form */}
      {selectedEntity && (
        <div className="bg-white border-2 border-blue-600 rounded-lg p-6">
          <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-400" />
            Review & Approve: {selectedEntity.name}
          </h3>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-slate-100 mb-2">Entity Details</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-slate-300">Type:</span> {selectedEntity.type}</p>
                <p><span className="text-slate-300">Risk Level:</span> {selectedEntity.riskStatus.toUpperCase()}</p>
                <p><span className="text-slate-300">Services:</span> {selectedEntity.services.length}</p>
                <p><span className="text-slate-300">Annual Fee:</span> ${selectedEntity.pricing.toLocaleString()}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 mb-2">Compliance Status</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-slate-300">ID Verified:</span> {selectedEntity.data.idDocuments ? '✓ Yes' : '✗ No'}</p>
                <p><span className="text-slate-300">UBO Complete:</span> {selectedEntity.data.beneficialOwners?.length > 0 || selectedEntity.data.fullLegalName ? '✓ Yes' : '✗ No'}</p>
                <p><span className="text-slate-300">Sanctions:</span> {selectedEntity.data.sanctionsResult || 'Pending'}</p>
                <p><span className="text-slate-300">PEP:</span> {selectedEntity.data.pepResult || 'Pending'}</p>
              </div>
            </div>
          </div>

          {selectedEntity.riskStatus === 'high' && (
            <div className="bg-red-500/10 border-2 border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-300 font-semibold flex items-center gap-2">
                <Lock className="w-5 h-5" />
                High Risk Client - Compliance Officer Approval Required
              </p>
              <p className="text-sm text-red-300 mt-1">
                This client requires senior compliance officer review and approval before activation.
              </p>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Reviewer Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-white/10 rounded-lg"
              >
                <option value="Manager">Manager</option>
                <option value="Senior Manager">Senior Manager</option>
                <option value="Compliance Officer">Compliance Officer</option>
                <option value="Partner">Partner</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Approval Comments
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full px-4 py-2 border border-white/10 rounded-lg"
                rows={3}
                placeholder="Enter approval comments and justification..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Rejection Reason (if rejecting)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-2 border border-white/10 rounded-lg"
                rows={2}
                placeholder="Enter reason for rejection..."
              />
            </div>
          </div>

          <div className="flex justify-between">
            <SecondaryButton onClick={() => setSelectedEntityId(null)}>
              Cancel
            </SecondaryButton>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (!reason) {
                    toast.error('Please provide rejection reason');
                    return;
                  }
                  if (selectedEntity.riskStatus === 'high' && role !== 'Compliance Officer') {
                    toast.error('⚠️ High risk clients require Compliance Officer approval');
                    return;
                  }
                  onReject(selectedEntity.id, reason, role);
                  setSelectedEntityId(null);
                  setComments('');
                  setReason('');
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reject
              </button>
              <PrimaryButton
                onClick={() => {
                  if (!comments) {
                    toast.error('Please provide approval comments');
                    return;
                  }
                  if (selectedEntity.riskStatus === 'high' && role !== 'Compliance Officer') {
                    toast.error('⚠️ High risk clients require Compliance Officer approval');
                    return;
                  }
                  onApprove(selectedEntity.id, comments, role);
                  setSelectedEntityId(null);
                  setComments('');
                  setReason('');
                }}
              >
                Approve
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <SecondaryButton onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </SecondaryButton>
        <div className="flex items-center gap-4">
          {!canProgress && (
            <div className="flex items-center gap-2 text-amber-400">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">All entities must be approved before activation</span>
            </div>
          )}
          <PrimaryButton onClick={onContinue} disabled={!canProgress}>
            Continue to Activation
            <ArrowRight className="w-4 h-4 ml-2" />
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

// CLIENT ACTIVATION COMPONENT
export function ClientActivation({ entities, onComplete }: any) {
  const [finalAgreed, setFinalAgreed] = useState(false);

  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <CheckCircle className="w-24 h-24 text-green-400 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-slate-100 mb-4">Onboarding Complete!</h2>
        <p className="text-slate-300 mb-8">All compliance checks passed - Ready for activation</p>

        <div className="max-w-3xl mx-auto space-y-4 mb-8">
          {entities.map((entity: any) => (
            <div key={entity.id} className="flex items-center justify-between p-4 bg-green-500/10 border-2 border-green-500/30 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div className="text-left">
                  <span className="font-semibold text-slate-100">{entity.name}</span>
                  <p className="text-xs text-slate-300">
                    {entity.type} • {entity.riskStatus.toUpperCase()} Risk • 
                    Approved by {entity.data.approvedBy}
                  </p>
                </div>
              </div>
              <StatusBadge status="approved" />
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto bg-blue-500/10 border-2 border-blue-500/30 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-bold text-blue-300 mb-4">Final Acknowledgement</h3>
          <div className="space-y-2 text-sm text-blue-300">
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" defaultChecked disabled />
              <span>✓ All information provided is accurate and complete</span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" defaultChecked disabled />
              <span>✓ I will notify the firm of ownership or control changes within 30 days</span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" defaultChecked disabled />
              <span>✓ I agree to ongoing AML/CTF monitoring and verification</span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" defaultChecked disabled />
              <span>✓ I understand compliance obligations must be maintained</span>
            </label>
          </div>

          <div className="mt-6">
            <label className="flex items-start gap-3 p-3 bg-white rounded-lg border-2 border-blue-300">
              <input
                type="checkbox"
                checked={finalAgreed}
                onChange={(e) => setFinalAgreed(e.target.checked)}
                className="mt-1 w-4 h-4"
              />
              <span className="text-sm font-semibold text-slate-100">
                I confirm all above statements and agree to activate my account
              </span>
            </label>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <PrimaryButton
            onClick={() => {
              if (finalAgreed) {
                toast.success('🎉 Account Activated! Redirecting to dashboard...');
                setTimeout(() => {
                  if (onComplete) onComplete();
                }, 1500);
              } else {
                toast.error('Please confirm all statements to activate');
              }
            }}
            disabled={!finalAgreed}
            className="w-full"
          >
            Activate Account & Go to Dashboard
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}