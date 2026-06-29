import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Upload, 
  Download,
  Eye,
  Clock,
  Shield,
  Gavel,
  AlertCircle,
  CheckSquare,
  Scale,
  FileCheck,
  Building2,
  User,
  Calendar,
  DollarSign
} from 'lucide-react';
import { toast } from '../../lib/toast';

interface LawyerReviewProps {
  caseData: any;
  userRole?: string;
}

export function LawyerReview({ caseData, userRole = 'lawyer' }: LawyerReviewProps) {
  const [reviewStatus, setReviewStatus] = useState<'pending' | 'in_progress' | 'approved' | 'rejected'>('in_progress');
  const [ncppCompliance, setNcppCompliance] = useState<'yes' | 'no' | 'pending'>('pending');
  const [statementOfAdvice, setStatementOfAdvice] = useState<File | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [complianceIssues, setComplianceIssues] = useState<string[]>([]);

  // Document Review Checklist
  const [documentChecklist, setDocumentChecklist] = useState([
    { id: '1', name: 'Loan Agreement', status: 'pending', reviewed: false, compliant: null, notes: '' },
    { id: '2', name: 'Mortgage Documents', status: 'pending', reviewed: false, compliant: null, notes: '' },
    { id: '3', name: 'Default Notice (Section 57)', status: 'pending', reviewed: false, compliant: null, notes: '' },
    { id: '4', name: 'Notice of Exercise of Power of Sale', status: 'pending', reviewed: false, compliant: null, notes: '' },
    { id: '5', name: 'Borrower Correspondence', status: 'pending', reviewed: false, compliant: null, notes: '' },
    { id: '6', name: 'Title Documents', status: 'pending', reviewed: false, compliant: null, notes: '' },
    { id: '7', name: 'Valuation Report', status: 'pending', reviewed: false, compliant: null, notes: '' },
    { id: '8', name: 'Insurance Certificates', status: 'pending', reviewed: false, compliant: null, notes: '' },
    { id: '9', name: 'Credit Contract', status: 'pending', reviewed: false, compliant: null, notes: '' },
    { id: '10', name: 'Financial Hardship Correspondence', status: 'pending', reviewed: false, compliant: null, notes: '' }
  ]);

  // NCCP Compliance Checklist
  const [ncpChecklist, setNcpChecklist] = useState([
    { id: '1', item: 'Loan is for personal, domestic or household purposes', checked: false, required: true },
    { id: '2', item: 'Credit provider holds Australian Credit License', checked: false, required: true },
    { id: '3', item: 'Responsible lending obligations complied with', checked: false, required: true },
    { id: '4', item: 'Key Facts Sheet provided to borrower', checked: false, required: true },
    { id: '5', item: 'Assessment of unsuitability conducted', checked: false, required: true },
    { id: '6', item: 'NCCP disclosure documents provided', checked: false, required: true }
  ]);

  // Enforcement Steps Verification
  const [enforcementSteps, setEnforcementSteps] = useState([
    { 
      id: '1', 
      step: 'Default Notice Issued (Section 57)', 
      completed: false, 
      compliant: null,
      date: null,
      notes: '',
      required: true 
    },
    { 
      id: '2', 
      step: 'Minimum 30-day notice period observed', 
      completed: false, 
      compliant: null,
      date: null,
      notes: '',
      required: true 
    },
    { 
      id: '3', 
      step: 'Notice of Exercise of Power of Sale issued', 
      completed: false, 
      compliant: null,
      date: null,
      notes: '',
      required: true 
    },
    { 
      id: '4', 
      step: 'All statutory notice periods complied with', 
      completed: false, 
      compliant: null,
      date: null,
      notes: '',
      required: true 
    },
    { 
      id: '5', 
      step: 'Good faith attempts to contact borrower documented', 
      completed: false, 
      compliant: null,
      date: null,
      notes: '',
      required: true 
    },
    { 
      id: '6', 
      step: 'Financial hardship assessment conducted', 
      completed: false, 
      compliant: null,
      date: null,
      notes: '',
      required: false 
    },
    { 
      id: '7', 
      step: 'Mortgagee duties complied with', 
      completed: false, 
      compliant: null,
      date: null,
      notes: '',
      required: true 
    }
  ]);

  // Compliance Issues Checklist
  const [complianceChecklist, setComplianceChecklist] = useState([
    { id: '1', item: 'No outstanding disputes or litigation', checked: false, critical: true },
    { id: '2', item: 'All notices properly served and documented', checked: false, critical: true },
    { id: '3', item: 'No cooling-off period violations', checked: false, critical: true },
    { id: '4', item: 'Interest calculations are correct', checked: false, critical: false },
    { id: '5', item: 'Fees and charges comply with loan agreement', checked: false, critical: true },
    { id: '6', item: 'No unconscionable conduct issues identified', checked: false, critical: true },
    { id: '7', item: 'Title search confirms no adverse encumbrances', checked: false, critical: true },
    { id: '8', item: 'Property can be legally sold', checked: false, critical: true },
    { id: '9', item: 'No bankruptcy or insolvency proceedings', checked: false, critical: true },
    { id: '10', item: 'All required statutory declarations obtained', checked: false, critical: false }
  ]);

  const toggleDocumentReview = (id: string, field: 'reviewed' | 'compliant', value: any) => {
    setDocumentChecklist(documentChecklist.map(doc => 
      doc.id === id ? { ...doc, [field]: value } : doc
    ));
  };

  const updateDocumentNotes = (id: string, notes: string) => {
    setDocumentChecklist(documentChecklist.map(doc => 
      doc.id === id ? { ...doc, notes } : doc
    ));
  };

  const toggleNcpChecklistItem = (id: string) => {
    setNcpChecklist(ncpChecklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const updateEnforcementStep = (id: string, field: string, value: any) => {
    setEnforcementSteps(enforcementSteps.map(step => 
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  const toggleComplianceItem = (id: string) => {
    setComplianceChecklist(complianceChecklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const calculateOverallProgress = () => {
    const totalItems = documentChecklist.length + ncpChecklist.length + enforcementSteps.length + complianceChecklist.length;
    const completedItems = 
      documentChecklist.filter(d => d.reviewed).length +
      ncpChecklist.filter(n => n.checked).length +
      enforcementSteps.filter(e => e.completed).length +
      complianceChecklist.filter(c => c.checked).length;
    
    return Math.round((completedItems / totalItems) * 100);
  };

  const getCriticalIssues = () => {
    const issues: string[] = [];
    
    // Check for non-compliant documents
    const nonCompliantDocs = documentChecklist.filter(d => d.compliant === false);
    if (nonCompliantDocs.length > 0) {
      issues.push(`${nonCompliantDocs.length} non-compliant documents`);
    }

    // Check for incomplete enforcement steps
    const incompleteSteps = enforcementSteps.filter(e => e.required && !e.completed);
    if (incompleteSteps.length > 0) {
      issues.push(`${incompleteSteps.length} required enforcement steps incomplete`);
    }

    // Check for critical compliance issues
    const criticalIssues = complianceChecklist.filter(c => c.critical && !c.checked);
    if (criticalIssues.length > 0) {
      issues.push(`${criticalIssues.length} critical compliance issues`);
    }

    return issues;
  };

  const handleStatementUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setStatementOfAdvice(file);
      toast.success('Statement of Advice uploaded', {
        description: `File: ${file.name}`
      });
    }
  };

  const handleApproveCase = () => {
    const issues = getCriticalIssues();
    
    if (issues.length > 0) {
      toast.error('Cannot approve case', {
        description: 'Please resolve all critical issues before approval'
      });
      return;
    }

    if (!statementOfAdvice) {
      toast.error('Statement of Advice required', {
        description: 'Please upload your statement of advice before approval'
      });
      return;
    }

    setReviewStatus('approved');
    toast.success('Case Approved', {
      description: 'Legal review completed successfully. Case can proceed to sale.'
    });
  };

  const handleRejectCase = () => {
    if (!reviewNotes.trim()) {
      toast.error('Rejection notes required', {
        description: 'Please provide detailed reasons for rejection'
      });
      return;
    }

    setReviewStatus('rejected');
    toast.error('Case Rejected', {
      description: 'Case has been rejected and returned to lender'
    });
  };

  const progress = calculateOverallProgress();
  const criticalIssues = getCriticalIssues();

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-400" />
                Legal Review & Compliance
              </CardTitle>
              <p className="text-sm text-slate-300 mt-1">
                Comprehensive legal review for {caseData.caseNumber}
              </p>
            </div>
            <Badge 
              variant={
                reviewStatus === 'approved' ? 'default' : 
                reviewStatus === 'rejected' ? 'destructive' : 
                reviewStatus === 'in_progress' ? 'secondary' : 
                'outline'
              }
              className="text-lg px-4 py-2"
            >
              {reviewStatus === 'approved' && <><CheckCircle2 className="w-4 h-4 mr-2" /> Approved</>}
              {reviewStatus === 'rejected' && <><XCircle className="w-4 h-4 mr-2" /> Rejected</>}
              {reviewStatus === 'in_progress' && <><Clock className="w-4 h-4 mr-2" /> In Review</>}
              {reviewStatus === 'pending' && <><AlertCircle className="w-4 h-4 mr-2" /> Pending</>}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">Review Progress</span>
                <span className="text-sm font-semibold text-slate-100">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            {/* Critical Issues Alert */}
            {criticalIssues.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  <strong className="block mb-1">Critical Issues Identified:</strong>
                  <ul className="list-disc list-inside space-y-1">
                    {criticalIssues.map((issue, idx) => (
                      <li key={idx} className="text-sm">{issue}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Case Summary */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-white/5 rounded-lg">
              <div>
                <div className="text-xs text-slate-300 mb-1">Property</div>
                <div className="font-medium text-sm">{caseData?.property?.address || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-300 mb-1">Borrower</div>
                <div className="font-medium text-sm">{caseData?.borrowerName || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-300 mb-1">Outstanding Debt</div>
                <div className="font-medium text-sm">${caseData?.outstandingDebt?.toLocaleString() || '0'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-300 mb-1">Valuation</div>
                <div className="font-medium text-sm">${caseData?.valuation?.amount?.toLocaleString() || '0'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NCCP Determination */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            NCCP Loan Determination
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              <strong>National Consumer Credit Protection (NCCP)</strong> applies to loans for personal, domestic, or household purposes. Determine if this loan is subject to NCCP requirements.
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="flex-1">
              <Label className="text-base font-semibold mb-2">Is this an NCCP loan?</Label>
              <p className="text-sm text-slate-300">
                NCCP applies if the loan is for personal, domestic or household purposes (not business/investment)
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={ncppCompliance === 'yes' ? 'default' : 'outline'}
                onClick={() => setNcppCompliance('yes')}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Yes - NCCP
              </Button>
              <Button
                variant={ncppCompliance === 'no' ? 'default' : 'outline'}
                onClick={() => setNcppCompliance('no')}
              >
                <XCircle className="w-4 h-4 mr-2" />
                No - Not NCCP
              </Button>
            </div>
          </div>

          {ncppCompliance === 'yes' && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">NCCP Compliance Checklist</h4>
              {ncpChecklist.map(item => (
                <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleNcpChecklistItem(item.id)}
                    className="mt-1 w-5 h-5 rounded border-white/10"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.item}</div>
                    {item.required && (
                      <Badge variant="destructive" className="mt-1 text-xs">Required</Badge>
                    )}
                  </div>
                  {item.checked && (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  )}
                </div>
              ))}
            </div>
          )}

          {ncppCompliance === 'no' && (
            <Alert>
              <CheckCircle2 className="w-4 h-4" />
              <AlertDescription>
                <strong>Non-NCCP Loan Confirmed.</strong> Standard mortgage enforcement procedures apply. NCCP compliance requirements do not apply to this case.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Document Review */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-400" />
            Document Review ({documentChecklist.filter(d => d.reviewed).length}/{documentChecklist.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documentChecklist.map(doc => (
              <div key={doc.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <FileText className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <div className="font-medium">{doc.name}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={doc.reviewed}
                            onChange={(e) => toggleDocumentReview(doc.id, 'reviewed', e.target.checked)}
                            className="w-4 h-4 rounded border-white/10"
                          />
                          <span className="text-sm text-slate-300">Reviewed</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {doc.reviewed && (
                  <div className="space-y-3 pt-3 border-t">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={doc.compliant === true ? 'default' : 'outline'}
                        onClick={() => toggleDocumentReview(doc.id, 'compliant', true)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Compliant
                      </Button>
                      <Button
                        size="sm"
                        variant={doc.compliant === false ? 'destructive' : 'outline'}
                        onClick={() => toggleDocumentReview(doc.id, 'compliant', false)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Non-Compliant
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Add review notes..."
                      value={doc.notes}
                      onChange={(e) => updateDocumentNotes(doc.id, e.target.value)}
                      className="text-sm"
                      rows={2}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enforcement Steps Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gavel className="w-5 h-5 text-orange-400" />
            Enforcement Steps Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              Verify that all required enforcement steps have been completed correctly and in accordance with legislation.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            {enforcementSteps.map(step => (
              <div key={step.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3 mb-3">
                  <input
                    type="checkbox"
                    checked={step.completed}
                    onChange={(e) => updateEnforcementStep(step.id, 'completed', e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-white/10"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{step.step}</div>
                    {step.required && (
                      <Badge variant="destructive" className="mt-1 text-xs">Required</Badge>
                    )}
                  </div>
                  {step.completed && (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  )}
                </div>

                {step.completed && (
                  <div className="space-y-3 pl-8">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Date Completed</Label>
                        <Input
                          type="date"
                          value={step.date || ''}
                          onChange={(e) => updateEnforcementStep(step.id, 'date', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Compliance Status</Label>
                        <div className="flex gap-2 mt-1">
                          <Button
                            size="sm"
                            variant={step.compliant === true ? 'default' : 'outline'}
                            onClick={() => updateEnforcementStep(step.id, 'compliant', true)}
                            className="flex-1"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Compliant
                          </Button>
                          <Button
                            size="sm"
                            variant={step.compliant === false ? 'destructive' : 'outline'}
                            onClick={() => updateEnforcementStep(step.id, 'compliant', false)}
                            className="flex-1"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Issues
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Textarea
                      placeholder="Add verification notes..."
                      value={step.notes}
                      onChange={(e) => updateEnforcementStep(step.id, 'notes', e.target.value)}
                      className="text-sm"
                      rows={2}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Loan Compliance for Buyer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-green-400" />
            Loan Compliance - Buyer Protection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <Shield className="w-4 h-4" />
            <AlertDescription>
              Ensure the loan is fully compliant and will present no legal issues for the buyer/investor.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            {complianceChecklist.map(item => (
              <div 
                key={item.id} 
                className={`flex items-start gap-3 p-3 border rounded-lg ${
                  item.critical && !item.checked ? 'border-red-300 bg-red-500/10' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleComplianceItem(item.id)}
                  className="mt-1 w-5 h-5 rounded border-white/10"
                />
                <div className="flex-1">
                  <div className="font-medium">{item.item}</div>
                  <div className="flex gap-2 mt-1">
                    {item.critical && (
                      <Badge variant="destructive" className="text-xs">Critical</Badge>
                    )}
                  </div>
                </div>
                {item.checked && (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statement of Advice Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Statement of Advice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              <strong>Required:</strong> Upload your comprehensive statement of advice documenting all findings, compliance status, and recommendations.
            </AlertDescription>
          </Alert>

          <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center">
            {statementOfAdvice ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3 text-green-400">
                  <CheckCircle2 className="w-8 h-8" />
                  <div className="text-left">
                    <div className="font-semibold">{statementOfAdvice.name}</div>
                    <div className="text-sm text-slate-300">
                      {(statementOfAdvice.size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setStatementOfAdvice(null)}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <Label htmlFor="statement-upload" className="cursor-pointer">
                    <div className="text-base font-semibold text-blue-400 hover:text-blue-300">
                      Click to upload Statement of Advice
                    </div>
                    <div className="text-sm text-slate-300 mt-1">
                      PDF, DOC, or DOCX (Max 10MB)
                    </div>
                  </Label>
                  <Input
                    id="statement-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleStatementUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Review Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Review Notes & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Provide detailed review notes, findings, and recommendations..."
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            rows={6}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-300">
              {criticalIssues.length === 0 && statementOfAdvice ? (
                <span className="text-green-400 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  All requirements met - Ready for approval
                </span>
              ) : (
                <span className="text-amber-400 font-medium flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {criticalIssues.length > 0 ? 'Critical issues must be resolved' : 'Statement of Advice required'}
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleRejectCase}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Reject Case
              </Button>
              <Button
                size="lg"
                onClick={handleApproveCase}
                disabled={criticalIssues.length > 0 || !statementOfAdvice}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Approve Case
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}