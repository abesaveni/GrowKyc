import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { ComprehensiveSearchResults } from './ComprehensiveSearchResults';

interface FinalSubmitStepProps {
  formData: any;
  avmValuationResults: any;
  automatedChecksComplete: boolean;
  directors: Array<{name: string; position: string; dob: string; email: string; phone: string}>;
  shareholders: Array<{name: string; percentage: number; dob: string; email: string; phone: string}>;
  trustees: Array<{type: 'individual' | 'company'; name: string; abn?: string; directors?: Array<{name: string; position: string}>}>;
  guarantors: Array<{name: string; dob: string; email: string; phone: string}>;
  onBack: () => void;
  onSubmit: () => void;
}

export function FinalSubmitStep({
  formData,
  avmValuationResults,
  automatedChecksComplete,
  directors,
  shareholders,
  trustees,
  guarantors,
  onBack,
  onSubmit
}: FinalSubmitStepProps) {
  return (
    <div className="space-y-6">
      <ComprehensiveSearchResults
        formData={formData}
        avmValuationResults={avmValuationResults}
        automatedChecksComplete={automatedChecksComplete}
        directors={directors}
        shareholders={shareholders}
        trustees={trustees}
        guarantors={guarantors}
      />
      
      {/* Final Submit Section */}
      <Card className="border-4 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <CardTitle className="text-xl flex items-center gap-2">
            <CheckCircle className="w-6 h-6" />
            Ready to Finalize Case
          </CardTitle>
          <p className="text-sm opacity-90 mt-2">
            All verifications complete. Review the results above and submit to create the case.
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-green-100 border-2 border-green-400 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-green-900 text-lg mb-2">All Pre-Checks Passed ✓</h3>
                <ul className="space-y-2 text-sm text-green-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Property valuation and title search completed
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    All parties identified and verified
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    AML/CTF screening complete for all entities
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Credit checks and identity verification passed
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    NCCP compliance requirements met
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    All required documents collected
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">⚠️ Final Confirmation Required</p>
                <p>
                  By submitting this case, you confirm that all information provided is accurate and complete. 
                  This will create a new Mortgage in Possession case in the system and notify all relevant parties.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={onBack}
              className="min-w-[200px]"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Review
            </Button>
            
            <Button
              size="lg"
              onClick={onSubmit}
              className="min-w-[250px] bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg py-6"
            >
              <CheckCircle className="w-6 h-6 mr-2" />
              Submit & Create Case
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
