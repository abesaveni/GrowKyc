import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { AlertTriangle, Shield, FileText, Scale, UserCheck, AlertCircle } from 'lucide-react';

interface LiabilityDisclaimerProps {
  onAccept: (declarationData: DisclaimerData) => void;
  onDecline: () => void;
}

export interface DisclaimerData {
  fullName: string;
  position: string;
  organization: string;
  aclNumber?: string;
  acceptedTimestamp: string;
  ipAddress?: string;
  declarations: {
    accuracy: boolean;
    authority: boolean;
    documentation: boolean;
    compliance: boolean;
    liability: boolean;
    professional: boolean;
    thirdParty: boolean;
    antiMoneyLaundering: boolean;
  };
}

export function LiabilityDisclaimer({ onAccept, onDecline }: LiabilityDisclaimerProps) {
  const [fullName, setFullName] = useState('');
  const [position, setPosition] = useState('');
  const [organization, setOrganization] = useState('');
  const [aclNumber, setAclNumber] = useState('');
  
  const [declarations, setDeclarations] = useState({
    accuracy: false,
    authority: false,
    documentation: false,
    compliance: false,
    liability: false,
    professional: false,
    thirdParty: false,
    antiMoneyLaundering: false,
  });

  const allDeclarationsAccepted = Object.values(declarations).every(val => val === true);
  const allFieldsCompleted = fullName && position && organization;

  const handleDeclarationChange = (key: keyof typeof declarations) => {
    setDeclarations(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAccept = () => {
    if (!allDeclarationsAccepted || !allFieldsCompleted) {
      return;
    }

    const declarationData: DisclaimerData = {
      fullName,
      position,
      organization,
      aclNumber: aclNumber || undefined,
      acceptedTimestamp: new Date().toISOString(),
      declarations,
    };

    onAccept(declarationData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="max-w-4xl w-full my-8 shadow-2xl border-2 border-red-200">
        <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b-2 border-red-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl text-red-900 mb-2">
                Professional Liability Declaration & Disclaimer
              </CardTitle>
              <p className="text-sm text-red-700 font-medium">
                IMPORTANT: You must read and accept all declarations before proceeding. This declaration establishes professional responsibility and liability for the information entered into this system.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Critical Notice */}
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm">
                <p className="font-bold text-red-900">CRITICAL NOTICE - PROFESSIONAL RESPONSIBILITY</p>
                <p className="text-red-800">
                  This system is a professional tool for licensed credit professionals. By proceeding, you acknowledge that YOU (the user) are solely responsible for:
                </p>
                <ul className="list-disc ml-5 space-y-1 text-red-800">
                  <li>Accuracy and completeness of all information entered</li>
                  <li>Compliance with NCCP, Privacy Act, PPSA, and all applicable legislation</li>
                  <li>Verification of all third-party data and documents</li>
                  <li>Professional assessment and decision-making</li>
                  <li>All legal and regulatory obligations arising from this matter</li>
                </ul>
                <p className="font-bold text-red-900 mt-3">
                  The AI Compliance Agent is an ASSISTIVE TOOL ONLY. It cannot replace professional judgment, legal advice, or regulatory obligations.
                </p>
              </div>
            </div>
          </div>

          {/* Your Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-lg">Your Professional Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Full Legal Name <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., John David Smith"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="position" className="text-sm font-medium">
                  Position/Title <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g., Senior Credit Manager"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="organization" className="text-sm font-medium">
                  Organization/Firm <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="organization"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g., ABC Financial Services Pty Ltd"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="aclNumber" className="text-sm font-medium">
                  ACL/ACR Number (if applicable)
                </Label>
                <Input
                  id="aclNumber"
                  value={aclNumber}
                  onChange={(e) => setAclNumber(e.target.value)}
                  placeholder="e.g., 123456 or 456789"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Declarations */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Scale className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-lg">Professional Declarations</h3>
            </div>

            <div className="space-y-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
              {/* Declaration 1: Accuracy */}
              <div className="flex items-start gap-3 p-3 bg-white rounded border border-gray-200">
                <Checkbox
                  id="accuracy"
                  checked={declarations.accuracy}
                  onCheckedChange={() => handleDeclarationChange('accuracy')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="accuracy" className="font-medium cursor-pointer text-sm">
                    ✓ Accuracy & Completeness of Information
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">
                    I declare that all information I enter into this system is, to the best of my knowledge and belief, accurate, complete, and current. I understand that I am responsible for verifying all information before submission.
                  </p>
                </div>
              </div>

              {/* Declaration 2: Authority */}
              <div className="flex items-start gap-3 p-3 bg-white rounded border border-gray-200">
                <Checkbox
                  id="authority"
                  checked={declarations.authority}
                  onCheckedChange={() => handleDeclarationChange('authority')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="authority" className="font-medium cursor-pointer text-sm">
                    ✓ Professional Authority & Competence
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">
                    I declare that I have the necessary professional qualifications, authority, and competence to handle this matter. I hold appropriate licences/registrations and am authorized by my organization to use this system.
                  </p>
                </div>
              </div>

              {/* Declaration 3: Documentation */}
              <div className="flex items-start gap-3 p-3 bg-white rounded border border-gray-200">
                <Checkbox
                  id="documentation"
                  checked={declarations.documentation}
                  onCheckedChange={() => handleDeclarationChange('documentation')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="documentation" className="font-medium cursor-pointer text-sm">
                    ✓ Document Verification & Third-Party Data
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">
                    I acknowledge my responsibility to verify all documents uploaded or obtained from third parties (including RP Data, InfoTrack, credit bureaus). I understand that automated systems can contain errors and I must independently verify critical information.
                  </p>
                </div>
              </div>

              {/* Declaration 4: Compliance */}
              <div className="flex items-start gap-3 p-3 bg-white rounded border border-gray-200">
                <Checkbox
                  id="compliance"
                  checked={declarations.compliance}
                  onCheckedChange={() => handleDeclarationChange('compliance')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="compliance" className="font-medium cursor-pointer text-sm">
                    ✓ Regulatory Compliance Responsibility (NCCP, Privacy Act, PPSA)
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">
                    I acknowledge that I am solely responsible for ensuring compliance with the National Consumer Credit Protection Act 2009, Privacy Act 1988, Personal Property Securities Act 2009, and all other applicable laws and regulations. I understand that using this system does not guarantee compliance.
                  </p>
                </div>
              </div>

              {/* Declaration 5: Liability */}
              <div className="flex items-start gap-3 p-3 bg-white rounded border border-red-100">
                <Checkbox
                  id="liability"
                  checked={declarations.liability}
                  onCheckedChange={() => handleDeclarationChange('liability')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="liability" className="font-medium cursor-pointer text-sm text-red-900">
                    ✓ Acceptance of Professional Liability
                  </Label>
                  <p className="text-xs text-red-700 mt-1 font-medium">
                    I accept full professional liability for all information entered and decisions made using this system. I understand that I, my organization, or the original loan writer (as applicable) bear all legal, regulatory, and professional responsibility for this matter. The system provider accepts no liability for errors, omissions, or compliance failures.
                  </p>
                </div>
              </div>

              {/* Declaration 6: Professional Judgment */}
              <div className="flex items-start gap-3 p-3 bg-white rounded border border-gray-200">
                <Checkbox
                  id="professional"
                  checked={declarations.professional}
                  onCheckedChange={() => handleDeclarationChange('professional')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="professional" className="font-medium cursor-pointer text-sm">
                    ✓ Professional Judgment & AI Tool Limitations
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">
                    I understand that the AI Compliance Agent is an assistive tool only and cannot replace my professional judgment. All AI suggestions must be reviewed and validated by me before implementation. I remain responsible for all final decisions.
                  </p>
                </div>
              </div>

              {/* Declaration 7: Third Party Reliance */}
              <div className="flex items-start gap-3 p-3 bg-white rounded border border-gray-200">
                <Checkbox
                  id="thirdParty"
                  checked={declarations.thirdParty}
                  onCheckedChange={() => handleDeclarationChange('thirdParty')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="thirdParty" className="font-medium cursor-pointer text-sm">
                    ✓ Original Loan Writer & Third-Party Reliance
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">
                    Where I am entering information on behalf of another party (e.g., original loan writer, lender), I declare that I have obtained appropriate authority and that the original party remains liable for the accuracy of their original information and representations. This does not diminish my responsibility to verify information entered by me.
                  </p>
                </div>
              </div>

              {/* Declaration 8: AML/CTF */}
              <div className="flex items-start gap-3 p-3 bg-white rounded border border-gray-200">
                <Checkbox
                  id="antiMoneyLaundering"
                  checked={declarations.antiMoneyLaundering}
                  onCheckedChange={() => handleDeclarationChange('antiMoneyLaundering')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="antiMoneyLaundering" className="font-medium cursor-pointer text-sm">
                    ✓ AML/CTF & Record Keeping Obligations
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">
                    I acknowledge my obligations under the Anti-Money Laundering and Counter-Terrorism Financing Act 2006 (if applicable) and agree to maintain all records for the required 7-year retention period. I understand that KYC and verification checks performed by this system do not replace my independent obligations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Statement */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-yellow-900 space-y-2">
                <p className="font-bold">LEGAL STATEMENT</p>
                <p>
                  By accepting these declarations, you create a binding legal record of your professional responsibility for this matter. This declaration will be timestamped, stored with the case file, and may be used as evidence of your acknowledgment of professional obligations in any legal, regulatory, or disciplinary proceedings.
                </p>
                <p className="font-bold">
                  Electronic Signature: Your acceptance constitutes your electronic signature under the Electronic Transactions Act 1999 (Cth).
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={onDecline}
              className="border-gray-300"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Decline & Exit
            </Button>

            <Button
              onClick={handleAccept}
              disabled={!allDeclarationsAccepted || !allFieldsCompleted}
              className={`${
                allDeclarationsAccepted && allFieldsCompleted
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Accept All Declarations & Proceed
            </Button>
          </div>

          {!allDeclarationsAccepted && (
            <p className="text-sm text-red-600 text-center">
              You must accept all 8 declarations to proceed
            </p>
          )}
          {!allFieldsCompleted && (
            <p className="text-sm text-red-600 text-center">
              You must complete all required fields (*)
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
