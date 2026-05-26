import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Bot, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileSearch, 
  AlertCircle,
  Loader2,
  Sparkles,
  Shield,
  FileText,
  TrendingUp,
  ClipboardCheck,
  Eye,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface AIComplianceAgentProps {
  caseId: string;
  caseStatus: string;
  openIssues: any[];
  docExpiry: { expiringSoon: number; expired: number };
  formData: any;
  uploadedDocuments?: any[];
  infoTrackData?: any;
  rpData?: any;
  onSuggestionApply?: (field: string, value: any) => void;
}

interface ComplianceIssue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'missing_data' | 'incorrect_data' | 'document_mismatch' | 'compliance' | 'validation';
  field?: string;
  title: string;
  description: string;
  recommendation: string;
  suggestedValue?: any;
  regulation?: string;
  canAutoFix: boolean;
  source?: string;
}

interface DocumentAnalysis {
  documentName: string;
  status: 'verified' | 'missing' | 'inconsistent' | 'unreadable';
  issues: string[];
  extractedData?: any;
}

interface ComplianceReport {
  overallScore: number;
  totalIssues: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  issues: ComplianceIssue[];
  documentAnalysis: DocumentAnalysis[];
  complianceChecks: {
    nccp: boolean;
    privacyAct: boolean;
    ppsa: boolean;
    amlCtf: boolean;
  };
  recommendations: string[];
  timestamp: string;
}

export function AIComplianceAgent({
  caseId,
  caseStatus,
  openIssues,
  docExpiry,
  formData,
  uploadedDocuments = [],
  infoTrackData,
  rpData,
  onSuggestionApply
}: AIComplianceAgentProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const runComplianceAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const payload = {
        caseId,
        caseStatus,
        openIssues,
        docExpiry,
        formData,
        uploadedDocuments,
        infoTrackData,
        rpData
      };
      const response = await fetch('/api/v1/ai/compliance-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }
      const data = await response.json();
      // Expect data to be a ComplianceReport
      setReport(data);
    } catch (err) {
      console.error('Compliance analysis failed', err);
      // Fallback: run client-side analysis if API is unavailable
      runLocalAnalysis();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runLocalAnalysis = () => {
    const issues: ComplianceIssue[] = [];

    // 1. MISSING DATA CHECKS
    if (!formData.borrowerFirstName) {
      issues.push({
        id: 'missing_borrower_name',
        severity: 'critical',
        category: 'missing_data',
        field: 'borrowerFirstName',
        title: 'Missing Borrower Name',
        description: 'Borrower first name is required for all credit applications under NCCP.',
        recommendation: 'Obtain and enter the borrower\'s legal first name from identification documents.',
        regulation: 'NCCP s117 - Reasonable Inquiries',
        canAutoFix: false
      });
    }

    if (!formData.borrowerEmail) {
      issues.push({
        id: 'missing_borrower_email',
        severity: 'high',
        category: 'missing_data',
        field: 'borrowerEmail',
        title: 'Missing Borrower Email',
        description: 'Email address is required for disclosure delivery and communication.',
        recommendation: 'Obtain borrower\'s email address for mandatory NCCP disclosures.',
        regulation: 'NCCP s17 - Disclosure Requirements',
        canAutoFix: false
      });
    }

    if (!formData.employmentType) {
      issues.push({
        id: 'missing_employment',
        severity: 'critical',
        category: 'missing_data',
        field: 'employmentType',
        title: 'Missing Employment Information',
        description: 'Employment type is mandatory for responsible lending assessment.',
        recommendation: 'Complete employment verification in Step 9 - Responsible Lending Assessment.',
        regulation: 'NCCP s117(1)(a) - Verify Financial Situation',
        canAutoFix: false
      });
    }

    if (!formData.verifiedMonthlyIncome) {
      issues.push({
        id: 'missing_income',
        severity: 'critical',
        category: 'missing_data',
        field: 'verifiedMonthlyIncome',
        title: 'Missing Income Verification',
        description: 'Verified monthly income is required for affordability assessment.',
        recommendation: 'Verify income using payslips, tax returns, or bank statements.',
        regulation: 'NCCP s117(1)(a) & s119',
        canAutoFix: false
      });
    }

    if (!formData.verifiedMonthlyExpenses) {
      issues.push({
        id: 'missing_expenses',
        severity: 'critical',
        category: 'missing_data',
        field: 'verifiedMonthlyExpenses',
        title: 'Missing Expense Verification',
        description: 'Verified living expenses are required for surplus calculation.',
        recommendation: 'Verify expenses using bank statements or HEM benchmark.',
        regulation: 'NCCP s117(1)(b) - Requirements and Objectives',
        canAutoFix: false
      });
    }

    if (!formData.creditCheckConsentObtained) {
      issues.push({
        id: 'missing_credit_consent',
        severity: 'critical',
        category: 'compliance',
        field: 'creditCheckConsentObtained',
        title: 'Missing Credit Check Consent',
        description: 'Privacy Act requires explicit consent before accessing credit report.',
        recommendation: 'Obtain written consent from borrower before running credit check.',
        regulation: 'Privacy Act 1988 - Australian Privacy Principles',
        canAutoFix: false
      });
    }

    if (!formData.lenderLicenceType) {
      issues.push({
        id: 'missing_licence',
        severity: 'critical',
        category: 'compliance',
        field: 'lenderLicenceType',
        title: 'Missing Lender Licence Verification',
        description: 'Lender must hold valid ACL or be exempt under NCCP.',
        recommendation: 'Verify lender holds valid Australian Credit Licence (ACL).',
        regulation: 'NCCP s29 - Licence Requirements',
        canAutoFix: false
      });
    }

    if (!formData.creditGuideProvided) {
      issues.push({
        id: 'missing_credit_guide',
        severity: 'critical',
        category: 'compliance',
        field: 'creditGuideProvided',
        title: 'Credit Guide Not Provided',
        description: 'Credit Guide must be provided before providing credit assistance.',
        recommendation: 'Provide Credit Guide and record the date provided.',
        regulation: 'NCCP s126 - Credit Guide Requirement',
        canAutoFix: false
      });
    }

    if (!formData.creditContractProvided) {
      issues.push({
        id: 'missing_credit_contract',
        severity: 'critical',
        category: 'compliance',
        field: 'creditContractProvided',
        title: 'Credit Contract Not Provided',
        description: 'Credit contract must be provided with all mandatory disclosures.',
        recommendation: 'Provide credit contract with comparison rate and all fees disclosed.',
        regulation: 'NCCP s17 - Pre-contractual Disclosure',
        canAutoFix: false
      });
    }

    // 2. INCORRECT DATA VALIDATION
    if (formData.borrowerEmail && !formData.borrowerEmail.includes('@')) {
      issues.push({
        id: 'invalid_email',
        severity: 'high',
        category: 'incorrect_data',
        field: 'borrowerEmail',
        title: 'Invalid Email Format',
        description: 'Email address appears to be invalid (missing @ symbol).',
        recommendation: 'Verify and correct the email address format.',
        canAutoFix: false
      });
    }

    if (formData.borrowerDob) {
      const age = calculateAge(formData.borrowerDob);
      if (age < 18) {
        issues.push({
          id: 'underage_borrower',
          severity: 'critical',
          category: 'incorrect_data',
          field: 'borrowerDob',
          title: 'Borrower Under 18 Years Old',
          description: `Calculated age is ${age} years. Borrower must be 18+ for credit contract.`,
          recommendation: 'Verify date of birth is correct. Cannot lend to minors under NCCP.',
          regulation: 'NCCP s11 - Contract with Minors',
          canAutoFix: false
        });
      } else if (age > 100) {
        issues.push({
          id: 'invalid_age',
          severity: 'medium',
          category: 'incorrect_data',
          field: 'borrowerDob',
          title: 'Unusual Age Detected',
          description: `Calculated age is ${age} years. This may be a data entry error.`,
          recommendation: 'Verify date of birth is entered correctly.',
          canAutoFix: false
        });
      }
    }

    // 3. THIRD-PARTY DATA VERIFICATION
    if (rpData) {
      const addressMismatch = formData.propertyAddress !== rpData.address;
      if (addressMismatch) {
        issues.push({
          id: 'address_mismatch',
          severity: 'high',
          category: 'document_mismatch',
          field: 'propertyAddress',
          title: 'Property Address Mismatch',
          description: `Form shows "${formData.propertyAddress}" but RP Data shows "${rpData.address}"`,
          recommendation: 'Verify which address is correct and update accordingly.',
          suggestedValue: rpData.address,
          source: 'RP Data',
          canAutoFix: true
        });
      }

      if (formData.intendedLoanAmount && formData.valuationAmount) {
        const lvr = (parseFloat(formData.intendedLoanAmount) / parseFloat(formData.valuationAmount)) * 100;
        if (lvr > 80) {
          issues.push({
            id: 'high_lvr',
            severity: 'high',
            category: 'validation',
            title: 'High Loan-to-Value Ratio',
            description: `LVR is ${lvr.toFixed(1)}% (Loan: $${formatCurrency(formData.intendedLoanAmount)}, Value: $${formatCurrency(formData.valuationAmount)})`,
            recommendation: 'LVR exceeds 80%. Consider requiring Lenders Mortgage Insurance (LMI) or obtaining additional security.',
            regulation: 'APRA Prudential Standards (if applicable)',
            canAutoFix: false
          });
        }
      }
    }

    // 4. AFFORDABILITY ASSESSMENT
    if (formData.verifiedMonthlyIncome && formData.verifiedMonthlyExpenses && formData.verifiedExistingDebts) {
      const income = parseFloat(formData.verifiedMonthlyIncome) || 0;
      const expenses = parseFloat(formData.verifiedMonthlyExpenses) || 0;
      const debts = parseFloat(formData.verifiedExistingDebts) || 0;

      const loanAmount = parseFloat(formData.intendedLoanAmount) || 0;
      const interestRate = (parseFloat(formData.interestRate) || 0) / 100 / 12;
      const loanTermMonths = (parseFloat(formData.loanTermYears) || 25) * 12;

      const monthlyRepayment = loanAmount > 0 && interestRate > 0
        ? loanAmount * (interestRate * Math.pow(1 + interestRate, loanTermMonths)) / (Math.pow(1 + interestRate, loanTermMonths) - 1)
        : 0;

      const totalMonthlyObligations = expenses + debts + monthlyRepayment;
      const monthlySurplus = income - totalMonthlyObligations;
      const dti = income > 0 ? ((debts + monthlyRepayment) / income) * 100 : 0;

      if (monthlySurplus < 0) {
        issues.push({
          id: 'negative_surplus',
          severity: 'critical',
          category: 'compliance',
          title: 'Negative Monthly Surplus - UNSUITABLE LOAN',
          description: `Monthly surplus is $${monthlySurplus.toFixed(2)}. Borrower cannot afford repayments.`,
          recommendation: 'BREACH RISK: NCCP s131 - This loan appears unsuitable. Do not proceed unless circumstances change significantly.',
          regulation: 'NCCP s131 - Presumption of Unsuitability',
          canAutoFix: false
        });
      } else if (monthlySurplus < income * 0.3) {
        issues.push({
          id: 'low_surplus',
          severity: 'high',
          category: 'validation',
          title: 'Low Monthly Surplus - Enhanced Assessment Required',
          description: `Monthly surplus is $${monthlySurplus.toFixed(2)} (${((monthlySurplus/income)*100).toFixed(1)}% of income).`,
          recommendation: 'Enhanced assessment required. Document why loan is suitable despite low buffer.',
          regulation: 'NCCP s131 - Unsuitability Assessment',
          canAutoFix: false
        });
      }

      if (dti > 50) {
        issues.push({
          id: 'high_dti',
          severity: 'critical',
          category: 'compliance',
          title: 'Debt-to-Income Ratio Exceeds 50%',
          description: `DTI is ${dti.toFixed(1)}%. This is above regulatory guidelines.`,
          recommendation: 'BREACH RISK: Loans with DTI >50% typically fail unsuitability assessment. Require additional supporting evidence.',
          regulation: 'ASIC RG 209 - Responsible Lending',
          canAutoFix: false
        });
      } else if (dti > 40) {
        issues.push({
          id: 'elevated_dti',
          severity: 'high',
          category: 'validation',
          title: 'Elevated Debt-to-Income Ratio',
          description: `DTI is ${dti.toFixed(1)}%. This exceeds conservative thresholds.`,
          recommendation: 'Enhanced scrutiny required. Document compensating factors.',
          regulation: 'ASIC RG 209 - Responsible Lending',
          canAutoFix: false
        });
      }
    }

    // 5. DOCUMENT VERIFICATION
    const documentAnalysis: DocumentAnalysis[] = [];

    const requiredDocs = [
      'Identification (Driver Licence or Passport)',
      'Proof of Income (Payslips or Tax Returns)',
      'Bank Statements (90 days)',
      'Credit Report',
      'Property Valuation',
      'Credit Guide',
      'Credit Contract',
      'Privacy Consent Form'
    ];

    requiredDocs.forEach(docName => {
      const hasDoc = uploadedDocuments.some(doc =>
        doc.name?.toLowerCase().includes(docName.toLowerCase().split(' ')[0])
      );

      if (!hasDoc) {
        documentAnalysis.push({
          documentName: docName,
          status: 'missing',
          issues: ['Document not uploaded or attached']
        });

        issues.push({
          id: `missing_doc_${docName.replace(/\s/g, '_').toLowerCase()}`,
          severity: docName.includes('Credit') || docName.includes('Privacy') ? 'critical' : 'high',
          category: 'missing_data',
          title: `Missing Document: ${docName}`,
          description: `Required document "${docName}" has not been uploaded.`,
          recommendation: 'Upload this document before proceeding to submission.',
          regulation: determineRegulation(docName),
          canAutoFix: false
        });
      } else {
        documentAnalysis.push({
          documentName: docName,
          status: 'verified',
          issues: []
        });
      }
    });

    // 6. SUITABILITY ASSESSMENT DOCUMENTATION
    if (!formData.suitabilityAssessmentNotes || formData.suitabilityAssessmentNotes.length < 50) {
      issues.push({
        id: 'insufficient_assessment',
        severity: 'critical',
        category: 'compliance',
        field: 'suitabilityAssessmentNotes',
        title: 'Insufficient Suitability Assessment Documentation',
        description: 'Suitability assessment notes are missing or insufficient (minimum 50 characters required).',
        recommendation: 'Document your full assessment including why you believe the loan is not unsuitable, considering borrower\'s requirements and objectives.',
        regulation: 'NCCP s133 - Assessment Documentation (7-year retention)',
        canAutoFix: false
      });
    }

    // Calculate scores
    const criticalIssues = issues.filter(i => i.severity === 'critical').length;
    const highIssues = issues.filter(i => i.severity === 'high').length;
    const mediumIssues = issues.filter(i => i.severity === 'medium').length;
    const lowIssues = issues.filter(i => i.severity === 'low').length;

    const overallScore = Math.max(0, 100 - (criticalIssues * 25) - (highIssues * 10) - (mediumIssues * 5) - (lowIssues * 2));

    const complianceChecks = {
      nccp: criticalIssues === 0 && formData.suitabilityAssessmentNotes && formData.creditGuideProvided,
      privacyAct: formData.creditCheckConsentObtained === true,
      ppsa: formData.securityType ? (formData.mortgageRegisteredOnTitle || formData.ppsrRegistered) : true,
      amlCtf: formData.kycStatus === 'clear'
    };

    const recommendations = [
      'Review all Critical issues immediately - these must be resolved before proceeding',
      'Verify all third-party data (RP Data, InfoTrack) independently',
      'Ensure all mandatory NCCP disclosures are provided and dated',
      'Maintain comprehensive file notes for 7-year retention period',
      'Consider obtaining legal advice for any unsuitable loan determinations'
    ];

    const complianceReport: ComplianceReport = {
      overallScore,
      totalIssues: issues.length,
      criticalIssues,
      highIssues,
      mediumIssues,
      lowIssues,
      issues,
      documentAnalysis,
      complianceChecks,
      recommendations,
      timestamp: new Date().toISOString()
    };

    setReport(complianceReport);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'medium': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'low': return <AlertCircle className="w-5 h-5 text-blue-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleApplySuggestion = (issue: ComplianceIssue) => {
    if (issue.suggestedValue && issue.field && onSuggestionApply) {
      onSuggestionApply(issue.field, issue.suggestedValue);
    }
  };

  return (
    <Card className="border-2 border-purple-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border-b-2 border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-md">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                AI Compliance Agent
                <Sparkles className="w-5 h-5 text-purple-600" />
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Automated compliance checking & data verification assistant
              </p>
            </div>
          </div>
          <Button
            onClick={runComplianceAnalysis}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Run Analysis
              </>
            )}
          </Button>
        </div>

        {/* AI Disclaimer Banner */}
        <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-yellow-800">
              <p className="font-semibold">AI ASSISTANT DISCLAIMER</p>
              <p className="mt-1">
                This AI agent is an <span className="font-bold">assistive tool only</span>. All suggestions must be reviewed and validated by a qualified professional. 
                The AI cannot replace professional judgment, provide legal advice, or guarantee compliance. You remain solely responsible for all decisions and compliance obligations.
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {!report && !isAnalyzing && (
          <div className="text-center py-12 text-gray-500">
            <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">Click "Run Analysis" to start AI compliance checking</p>
            <p className="text-sm mt-2">I'll check for missing data, incorrect information, document mismatches, and compliance issues</p>
          </div>
        )}

        {isAnalyzing && (
          <div className="text-center py-12">
            <Loader2 className="w-16 h-16 mx-auto mb-4 text-purple-600 animate-spin" />
            <p className="text-lg font-medium text-gray-700">AI Agent is analyzing your case...</p>
            <p className="text-sm text-gray-500 mt-2">Checking data completeness, validating information, reviewing documents, and assessing compliance</p>
          </div>
        )}

        {report && !isAnalyzing && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border-2 border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Overall Compliance Score</h3>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-bold ${getScoreColor(report.overallScore)}`}>
                      {report.overallScore}
                    </span>
                    <span className="text-2xl text-gray-400">/100</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className={`w-6 h-6 ${getScoreColor(report.overallScore)}`} />
                  </div>
                  <p className="text-sm text-gray-600">
                    {report.overallScore >= 80 && 'Excellent compliance'}
                    {report.overallScore >= 60 && report.overallScore < 80 && 'Good - Minor issues'}
                    {report.overallScore >= 40 && report.overallScore < 60 && 'Fair - Action required'}
                    {report.overallScore < 40 && 'Poor - Urgent action required'}
                  </p>
                </div>
              </div>
            </div>

            {/* Issue Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600 font-medium">Critical</p>
                    <p className="text-3xl font-bold text-red-700">{report.criticalIssues}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
              </div>

              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 font-medium">High</p>
                    <p className="text-3xl font-bold text-orange-700">{report.highIssues}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-orange-400" />
                </div>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600 font-medium">Medium</p>
                    <p className="text-3xl font-bold text-yellow-700">{report.mediumIssues}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-yellow-400" />
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Low</p>
                    <p className="text-3xl font-bold text-blue-700">{report.lowIssues}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-blue-400" />
                </div>
              </div>
            </div>

            {/* Compliance Checks */}
            <div className="border-2 border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                Regulatory Compliance Checks
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className={`p-3 rounded-lg border-2 ${report.complianceChecks.nccp ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                  <div className="flex items-center gap-2">
                    {report.complianceChecks.nccp ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                    <span className="text-sm font-medium">NCCP Act</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg border-2 ${report.complianceChecks.privacyAct ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                  <div className="flex items-center gap-2">
                    {report.complianceChecks.privacyAct ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                    <span className="text-sm font-medium">Privacy Act</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg border-2 ${report.complianceChecks.ppsa ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                  <div className="flex items-center gap-2">
                    {report.complianceChecks.ppsa ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                    <span className="text-sm font-medium">PPSA</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg border-2 ${report.complianceChecks.amlCtf ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                  <div className="flex items-center gap-2">
                    {report.complianceChecks.amlCtf ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                    <span className="text-sm font-medium">AML/CTF</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Issues List */}
            {report.issues.length > 0 && (
              <div className="border-2 border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-purple-600" />
                  Detailed Issues ({report.totalIssues})
                </h3>
                <div className="space-y-3">
                  {report.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className={`border-2 rounded-lg p-4 ${getSeverityColor(issue.severity)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {getSeverityIcon(issue.severity)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{issue.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {issue.severity.toUpperCase()}
                              </Badge>
                              {issue.regulation && (
                                <Badge variant="outline" className="text-xs bg-white">
                                  {issue.regulation}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm mb-2">{issue.description}</p>
                            
                            {expandedIssue === issue.id && (
                              <div className="mt-3 space-y-2 bg-white/50 rounded p-3 border">
                                <div>
                                  <p className="text-xs font-semibold mb-1">Recommendation:</p>
                                  <p className="text-xs">{issue.recommendation}</p>
                                </div>
                                {issue.suggestedValue && (
                                  <div>
                                    <p className="text-xs font-semibold mb-1">Suggested Value:</p>
                                    <p className="text-xs font-mono bg-white p-2 rounded border">
                                      {issue.suggestedValue}
                                    </p>
                                  </div>
                                )}
                                {issue.source && (
                                  <p className="text-xs">
                                    <span className="font-semibold">Source:</span> {issue.source}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {issue.canAutoFix && issue.suggestedValue && (
                            <Button
                              size="sm"
                              onClick={() => handleApplySuggestion(issue)}
                              className="bg-green-600 hover:bg-green-700 text-xs"
                            >
                              Apply Fix
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
                          >
                            {expandedIssue === issue.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Document Analysis */}
            <div className="border-2 border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <FileSearch className="w-5 h-5 text-purple-600" />
                Document Verification Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {report.documentAnalysis.map((doc, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border-2 ${
                      doc.status === 'verified'
                        ? 'bg-green-50 border-green-300'
                        : doc.status === 'missing'
                        ? 'bg-red-50 border-red-300'
                        : 'bg-yellow-50 border-yellow-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {doc.status === 'verified' ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : doc.status === 'missing' ? (
                          <XCircle className="w-4 h-4 text-red-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                        )}
                        <span className="text-sm font-medium">{doc.documentName}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          doc.status === 'verified'
                            ? 'bg-green-100'
                            : doc.status === 'missing'
                            ? 'bg-red-100'
                            : 'bg-yellow-100'
                        }`}
                      >
                        {doc.status}
                      </Badge>
                    </div>
                    {doc.issues.length > 0 && (
                      <p className="text-xs mt-2 text-gray-600">{doc.issues[0]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                AI Recommendations
              </h3>
              <ul className="space-y-2">
                {report.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Timestamp */}
            <p className="text-xs text-gray-500 text-center">
              Analysis completed at {new Date(report.timestamp).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper functions
function calculateAge(dob: string): number {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function formatCurrency(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return num.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function determineRegulation(docName: string): string {
  if (docName.includes('Credit Guide') || docName.includes('Credit Contract')) {
    return 'NCCP s17, s126';
  }
  if (docName.includes('Privacy') || docName.includes('Credit Report')) {
    return 'Privacy Act 1988';
  }
  if (docName.includes('Identification')) {
    return 'AML/CTF Act 2006';
  }
  if (docName.includes('Income') || docName.includes('Bank')) {
    return 'NCCP s117, s119';
  }
  return 'Various';
}
