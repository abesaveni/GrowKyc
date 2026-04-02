import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { AIComplianceAgent } from './AIComplianceAgent';
import { CreditPackSection } from './CreditPackSection';
import {
  FileText,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface ReviewSubmitStepProps {
  formData: any;
  uploadedDocuments: any[];
  infoTrackChecksRun: any;
  avmValuationResults: any;
  propertySearchStatus: string;
  kycStatus: 'pending' | 'clear' | 'flagged';
  handleInputChange: (field: string, value: any) => void;
  handleAISuggestionApply: (field: string, value: any) => void;
}

export function ReviewSubmitStep({
  formData,
  uploadedDocuments,
  infoTrackChecksRun,
  avmValuationResults,
  propertySearchStatus,
  kycStatus,
  handleInputChange,
  handleAISuggestionApply
}: ReviewSubmitStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-orange-50 rounded-lg">
          <FileText className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Review & Submit</h2>
          <p className="text-gray-600 text-sm">Final details and case review</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="defaultReason">Reason for Default *</Label>
          <Textarea
            id="defaultReason"
            value={formData.defaultReason}
            onChange={(e) => handleInputChange('defaultReason', e.target.value)}
            placeholder="Provide details about why the borrower has defaulted on loan payments..."
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="hardshipCircumstances">Hardship Circumstances</Label>
          <Textarea
            id="hardshipCircumstances"
            value={formData.hardshipCircumstances}
            onChange={(e) => handleInputChange('hardshipCircumstances', e.target.value)}
            placeholder="Job loss, illness, divorce, business failure, etc."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="borrowerCooperation">Borrower Cooperation</Label>
          <select
            id="borrowerCooperation"
            value={formData.borrowerCooperation}
            onChange={(e) => handleInputChange('borrowerCooperation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="yes">Yes - Fully Cooperative</option>
            <option value="partial">Partially Cooperative</option>
            <option value="no">No - Not Responsive</option>
            <option value="hostile">Hostile/Adversarial</option>
          </select>
        </div>

        <div>
          <Label htmlFor="possessionStatus">Current Possession Status</Label>
          <select
            id="possessionStatus"
            value={formData.possessionStatus}
            onChange={(e) => handleInputChange('possessionStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="owner_occupied">Owner Occupied</option>
            <option value="tenant_occupied">Tenant Occupied</option>
            <option value="vacant">Vacant</option>
            <option value="possession_taken">Lender Has Taken Possession</option>
          </select>
        </div>

        {formData.possessionStatus === 'tenant_occupied' && (
          <div>
            <Label htmlFor="tenancyDetails">Tenancy Details</Label>
            <Textarea
              id="tenancyDetails"
              value={formData.tenancyDetails}
              onChange={(e) => handleInputChange('tenancyDetails', e.target.value)}
              placeholder="Lease end date, weekly rent, tenant contact information, etc."
              rows={2}
            />
          </div>
        )}

        <div>
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Any additional information that might be relevant..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="urgency">Case Urgency</Label>
          <select
            id="urgency"
            value={formData.urgency}
            onChange={(e) => handleInputChange('urgency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="low">Low - Standard processing (30+ days)</option>
            <option value="medium">Medium - Priority processing (14-30 days)</option>
            <option value="high">High - Urgent attention (7-14 days)</option>
            <option value="critical">Critical - Immediate action (&lt;7 days)</option>
          </select>
        </div>

        {/* AI Compliance Agent */}
        <AIComplianceAgent
          formData={formData}
          uploadedDocuments={uploadedDocuments}
          infoTrackData={infoTrackChecksRun}
          rpData={avmValuationResults}
          onSuggestionApply={handleAISuggestionApply}
        />

        {/* Credit Pack Assembly */}
        <CreditPackSection
          infoTrackChecksRun={infoTrackChecksRun}
          propertySearchStatus={propertySearchStatus}
          kycStatus={kycStatus}
          formData={formData}
        />

        {/* InfoTrack Checks Summary */}
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              InfoTrack Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Title Search', status: infoTrackChecksRun.titleSearch },
                { label: 'Ownership Verification', status: infoTrackChecksRun.ownership },
                { label: 'Encumbrances Check', status: infoTrackChecksRun.encumbrances },
                { label: 'Zoning Information', status: infoTrackChecksRun.zoning },
                { label: 'Identity Verification', status: infoTrackChecksRun.identity },
                { label: 'Sanctions Screening', status: infoTrackChecksRun.sanctions },
                { label: 'PEP Checks', status: infoTrackChecksRun.pep },
                { label: 'Valuation', status: infoTrackChecksRun.valuation }
              ].map((check, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  {check.status ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className={check.status ? 'text-green-800 font-medium' : 'text-gray-600'}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg">Complete Case Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Property</p>
                <p className="font-semibold">{formData.propertyAddress || 'Not provided'}</p>
                <p className="text-sm text-gray-500">{formData.propertySuburb}, {formData.propertyState}</p>
                {formData.lotNumber && (
                  <p className="text-xs text-gray-500">Lot {formData.lotNumber}, {formData.planNumber}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">Borrower</p>
                <p className="font-semibold">{formData.borrowerFirstName} {formData.borrowerLastName || 'Not provided'}</p>
                <p className="text-sm text-gray-500">{formData.borrowerEmail || 'No email'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">KYC Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {kycStatus === 'clear' && (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-800">InfoTrack Verified</span>
                    </>
                  )}
                  {kycStatus === 'flagged' && (
                    <>
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-semibold text-red-800">Requires Review</span>
                    </>
                  )}
                  {kycStatus === 'pending' && (
                    <span className="text-sm text-gray-600">Not completed</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Lender</p>
                <p className="font-semibold">{formData.lenderName || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Outstanding Debt</p>
                <p className="font-semibold text-lg">
                  {formData.outstandingDebt ? `A$${parseFloat(formData.outstandingDebt).toLocaleString()}` : 'Not provided'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Property Valuation</p>
                <p className="font-semibold text-lg">
                  {formData.propertyValuation ? `A$${parseFloat(formData.propertyValuation).toLocaleString()}` : 'Not provided'}
                </p>
              </div>
            </div>

            {formData.outstandingDebt && formData.propertyValuation && (
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Loan-to-Value Ratio (LVR)</span>
                  <span className={`text-lg font-bold ${
                    ((parseFloat(formData.outstandingDebt) / parseFloat(formData.propertyValuation)) * 100) > 80 
                      ? 'text-red-600' 
                      : 'text-green-600'
                  }`}>
                    {((parseFloat(formData.outstandingDebt) / parseFloat(formData.propertyValuation)) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-900">Ready to submit?</p>
            <p className="text-xs text-amber-700 mt-1">
              This case will be verified via InfoTrack, processed by our platform, and made available to qualified investors. All lender information will be kept confidential until a deal is accepted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
