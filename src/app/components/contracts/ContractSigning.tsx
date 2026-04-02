import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { StatusBadge } from '../StatusBadge';
import { toast } from '../../lib/toast';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { FileText, Download, CheckCircle2, AlertCircle, ArrowLeft, PenTool } from 'lucide-react';
import { mockCases } from '../../data/mockData';

interface ContractSigningProps {
  onBack?: () => void;
}

export function ContractSigning({ onBack }: ContractSigningProps) {
  const [isSigned, setIsSigned] = useState(false);
  const [isSigningInProgress, setIsSigningInProgress] = useState(false);
  const [confirmSignOpen, setConfirmSignOpen] = useState(false);
  
  // Use first case for contract details
  const contractCase = mockCases[0];

  const handleSignClick = () => {
    setConfirmSignOpen(true);
  };

  const handleSign = async () => {
    setConfirmSignOpen(false);
    setIsSigningInProgress(true);
    
    // Show loading toast
    toast.loading('Signing contract...');
    
    // Simulate signing process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSigningInProgress(false);
    setIsSigned(true);
    
    toast.success('Contract signed successfully!', {
      description: 'Confirmation sent to all parties via email'
    });
  };

  const handleDownload = () => {
    toast.info('Preparing download...');
    setTimeout(() => {
      toast.success(`Downloaded Contract_${contractCase.caseNumber}.pdf`);
    }, 1000);
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '#' },
    { label: 'Contracts', href: '#', onClick: onBack },
    { label: `Contract ${contractCase.caseNumber}` }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel - PDF Viewer (70%) */}
        <div className="col-span-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Contract Document</span>
                {isSigned && (
                  <span className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Signed
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center" style={{ height: '800px' }}>
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">PDF Viewer</p>
                  <p className="text-sm text-gray-500">Contract_{contractCase.caseNumber}.pdf</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {isSigned ? 'Digitally signed' : 'Awaiting signature'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Contract Summary (30%) */}
        <div className="col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contract Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Deal ID</p>
                <p className="font-semibold text-gray-900">{contractCase.caseNumber}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Property</p>
                <p className="font-semibold text-gray-900">{contractCase.property.address}</p>
                <p className="text-xs text-gray-600">{contractCase.property.suburb}, {contractCase.property.state}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Borrower</p>
                <p className="font-semibold text-gray-900">{contractCase.borrowerName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Lender</p>
                <p className="font-semibold text-gray-900">{contractCase.lenderName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Loan Amount</p>
                <p className="font-semibold text-gray-900">
                  A${contractCase.outstandingDebt.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <StatusBadge status={isSigned ? 'completed' : 'pending'} type="case" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleSignClick}
                disabled={isSigned || isSigningInProgress}
              >
                {isSigningInProgress ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Signing...
                  </>
                ) : isSigned ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Contract Signed
                  </>
                ) : (
                  <>
                    <PenTool className="w-4 h-4 mr-2" />
                    Sign Contract
                  </>
                )}
              </Button>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>

              {onBack && (
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={onBack}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Contracts
                </Button>
              )}
            </CardContent>
          </Card>

          {isSigned && (
            <Card className="border-green-200 bg-green-50 animate-in fade-in slide-in-from-top-2 duration-500">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Contract Signed Successfully</p>
                    <p className="text-xs text-green-800 mt-1">
                      A copy has been sent to all parties via email.
                    </p>
                    <p className="text-xs text-green-700 mt-2 font-semibold">
                      Digital signature timestamp: {new Date().toLocaleString('en-AU')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Important Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Legal Binding Agreement</p>
                    <p className="text-xs text-gray-600 mt-1">
                      By signing this contract, you agree to all terms and conditions outlined in the document.
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 pt-2 border-t">
                  <ul className="space-y-1">
                    <li>• Read all pages carefully before signing</li>
                    <li>• Ensure all details are correct</li>
                    <li>• Contact support if you have questions</li>
                    <li>• Digital signature is legally binding</li>
                    <li>• Cannot be undone once signed</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contract Requirements Checklist */}
          {!isSigned && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-base">Before You Sign</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Review all contract terms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Verify property details</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Confirm financial amounts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Check settlement timeline</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Confirm Sign Dialog */}
      <ConfirmDialog
        open={confirmSignOpen}
        onOpenChange={setConfirmSignOpen}
        title="Sign Contract?"
        description={`Are you sure you want to digitally sign this contract for ${contractCase.property.address}? This action is legally binding and cannot be undone.`}
        confirmLabel="Sign Contract"
        onConfirm={handleSign}
        variant="default"
      />
    </div>
  );
}
