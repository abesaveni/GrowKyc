import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  ArrowLeft,
  Building2,
  Landmark,
  Shield,
  BarChart3,
  Scale,
  Briefcase,
  Home,
  CheckCircle,
  Target,
  TrendingUp,
  Users,
  FileText,
  Clock,
  DollarSign,
  AlertCircle,
  Zap,
  Lock,
  Activity,
  Database,
  Network
} from 'lucide-react';

interface IndustryDetailProps {
  industryId: string;
  onBack: () => void;
}

const industryData = {
  'Accountants': {
    icon: Building2,
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
    tagline: 'Purpose-Built for Accounting Practices',
    description: 'Transform your accounting practice with compliance infrastructure that integrates with Xero, MYOB, and your practice management system.',
    painPoints: [
      {
        title: 'Manual Client Onboarding',
        problem: 'Spending 3-5 days collecting ID, company searches, and trust deeds for each new client.',
        solution: 'Self-service client portal with drag-and-drop upload. Client completes in 5 minutes, you review in 2 minutes.',
        impact: '95% time saving'
      },
      {
        title: 'AUSTRAC Compliance Burden',
        problem: 'Accountants are now reporting entities under AUSTRAC. No idea where to start with AML/CTF program.',
        solution: 'Pre-built AML/CTF program template for accountants, auto KYC workflows, TTR automation.',
        impact: 'Fully AUSTRAC compliant'
      },
      {
        title: 'Trust Client Complexity',
        problem: 'Managing trusts with multiple trustees, beneficiaries, appointors - ownership mapping is nightmare.',
        solution: 'Visual ownership mapper shows trust structure automatically, identifies UBOs, tracks changes.',
        impact: '70% faster trust onboarding'
      },
      {
        title: 'Annual Review Chaos',
        problem: 'Excel spreadsheet of 500 clients, manually tracking who needs annual KYC refresh. Miss 40% of deadlines.',
        solution: 'Auto-scheduled annual reviews, email reminders to clients, compliance dashboard shows completion rates.',
        impact: '98% completion rate'
      }
    ],
    keyFeatures: [
      {
        title: 'Xero Practice Manager Integration',
        description: 'Two-way sync of clients, contacts, and documents. KYC status visible in Xero.',
        icon: Zap,
        benefit: 'No dual data entry'
      },
      {
        title: 'Trust & SMSF Workflows',
        description: 'Specialized onboarding for trusts and SMSFs with trust deed verification and beneficiary tracking.',
        icon: Shield,
        benefit: 'Purpose-built for accountants'
      },
      {
        title: 'Client Self-Service Portal',
        description: 'Branded portal where clients upload their own documents and complete verification.',
        icon: Users,
        benefit: '80% less admin work'
      },
      {
        title: 'Annual Review Automation',
        description: 'Automatic annual KYC refresh with client notifications and compliance tracking.',
        icon: Clock,
        benefit: 'Never miss a deadline'
      }
    ],
    specificModules: [
      'Xero PM Integration',
      'MYOB Practice Integration',
      'Trust Onboarding Workflow',
      'SMSF Onboarding Workflow',
      'Individual Tax Client Workflow',
      'Company Client Workflow',
      'Annual Review Scheduler',
      'Client Self-Service Portal',
      'Document Collection Portal',
      'AUSTRAC AML/CTF Program Template'
    ],
    compliance: [
      'AUSTRAC AML/CTF (Accountants)',
      'Tax Practitioners Board',
      'CA ANZ Code of Ethics',
      'CPA Australia Standards',
      'IPA Professional Standards',
      'Privacy Act 1988'
    ],
    roi: {
      timesSaved: '15 hours per week per practice',
      costSavings: '$78,000 per year (5-person practice)',
      clientCapacity: 'Handle 40% more clients with same team',
      riskReduction: '95% reduction in compliance breaches'
    },
    testimonial: {
      quote: 'We onboarded 127 clients in the first month. Previously that would have taken us 6 months. Grow Compliance OS paid for itself in week 2.',
      author: 'Sarah Mitchell',
      role: 'Partner, Mitchell & Associates',
      firm: '450 clients, Melbourne'
    }
  },
  'Credit Providers': {
    icon: Landmark,
    color: 'green',
    gradient: 'from-green-500 to-green-600',
    tagline: 'Compliance for Credit & Lending',
    description: 'Meet NCCP responsible lending obligations with automated verification, affordability assessment, and ASIC compliance.',
    painPoints: [
      {
        title: 'NCCP Responsible Lending',
        problem: 'ASIC fines for failing to verify income, expenses, and affordability. Manual process prone to errors.',
        solution: 'Automated income verification, bank statement parsing, affordability calculator with audit trail.',
        impact: '100% NCCP compliance'
      },
      {
        title: 'Slow ID Verification',
        problem: 'Borrowers wait 48 hours for manual ID checks. Losing deals to faster competitors.',
        solution: 'InfoTrack integration provides instant ID verification in 3.7 minutes with 100-point checks.',
        impact: '95% faster decisioning'
      },
      {
        title: 'AML/CTF for Lenders',
        problem: 'Credit providers must screen borrowers for sanctions/PEP. No system in place.',
        solution: 'Automated sanctions and PEP screening on every borrower with daily updates and alerts.',
        impact: 'AUSTRAC compliant'
      },
      {
        title: 'Missing Audit Trail',
        problem: 'ASIC audit shows 30% of loans missing complete KYC documentation. Major risk.',
        solution: 'Evidence vault captures every document, decision, and verification with SHA-256 encryption.',
        impact: '100% audit coverage'
      }
    ],
    keyFeatures: [
      {
        title: 'NCCP Compliance Workflow',
        description: 'Hard gates prevent loan approval without income verification, expense validation, and affordability pass.',
        icon: Shield,
        benefit: 'ASIC compliant by design'
      },
      {
        title: 'InfoTrack ID Verification',
        description: 'Instant 100-point ID checks, address verification, and criminal record screening.',
        icon: Zap,
        benefit: '3.7 minute verification'
      },
      {
        title: 'Bank Statement Parsing',
        description: 'AI extracts income, expenses, and spending patterns from uploaded bank statements.',
        icon: FileText,
        benefit: 'Auto income verification'
      },
      {
        title: 'Loan Decision Audit Trail',
        description: 'Every decision point captured with timestamp, user, and rationale for ASIC compliance.',
        icon: Lock,
        benefit: 'Regulator-ready evidence'
      }
    ],
    specificModules: [
      'NCCP Compliance Workflow',
      'Affordability Calculator',
      'Income Verification',
      'Expense Validation',
      'InfoTrack Integration',
      'Bank Statement Parser',
      'Loan Decision Audit',
      'Borrower Portal',
      'AML/CTF for Lenders',
      'Sanctions Screening'
    ],
    compliance: [
      'NCCP (National Credit Code)',
      'ASIC Responsible Lending',
      'ASIC RG209 (Credit Licensing)',
      'AUSTRAC AML/CTF',
      'Privacy Act 1988',
      'Credit Reporting Code'
    ],
    roi: {
      timesSaved: '22 hours per week per credit officer',
      costSavings: '$142,000 per year (10 loans/week)',
      clientCapacity: 'Process 3x more loan applications',
      riskReduction: 'Zero ASIC breaches since implementation'
    },
    testimonial: {
      quote: 'We went from 48-hour loan decisions to same-day approvals. Our conversion rate increased 34% and ASIC compliance is now automated.',
      author: 'Michael Zhang',
      role: 'Head of Credit',
      firm: 'Pacific Lending Group'
    }
  },
  'AFSL Holders': {
    icon: Shield,
    color: 'purple',
    gradient: 'from-purple-500 to-purple-600',
    tagline: 'Financial Services Compliance',
    description: 'Meet ASIC RG78, RG271, and AUSTRAC requirements with enterprise-grade compliance infrastructure for financial services.',
    painPoints: [
      {
        title: 'ASIC RG78 Client Verification',
        problem: 'RG78 requires robust client verification. Manual process inconsistent and audit shows gaps.',
        solution: 'Standardized RG78 workflow with 100-point ID, source of wealth, and beneficial ownership for all clients.',
        impact: 'RG78 compliant'
      },
      {
        title: 'Complex Entity Structures',
        problem: 'Fund investors include trusts, companies, SMSFs with 5+ beneficial owners. Manual mapping takes days.',
        solution: 'Visual ownership graph automatically maps UBOs from ASIC searches, trust deeds, and SMSF docs.',
        impact: '85% faster onboarding'
      },
      {
        title: 'PEP & Sanctions Screening',
        problem: 'AUSTRAC requires screening all investors. Using manual Google searches - high risk.',
        solution: 'Automated screening against World-Check, Dow Jones, and DFAT sanctions with daily updates.',
        impact: 'Enterprise-grade screening'
      },
      {
        title: 'Ongoing Monitoring',
        problem: 'No system for ongoing CDD. Only screen at onboarding, missing changes in client risk.',
        solution: 'Continuous monitoring with daily screening, transaction monitoring, and automatic alerts.',
        impact: 'True ongoing CDD'
      }
    ],
    keyFeatures: [
      {
        title: 'ASIC RG78 Workflows',
        description: 'Pre-built workflows for individual, corporate, and trust clients meeting RG78 requirements.',
        icon: Shield,
        benefit: 'ASIC compliant'
      },
      {
        title: 'Beneficial Ownership Mapping',
        description: 'Visual graph showing ownership structure, UBOs, and control for complex entities.',
        icon: Users,
        benefit: '25% ownership visibility'
      },
      {
        title: 'Enhanced Due Diligence',
        description: 'Guided EDD workflow for high-risk clients with source of wealth, source of funds verification.',
        icon: Target,
        benefit: 'Standardized EDD'
      },
      {
        title: 'AUSTRAC Reporting',
        description: 'One-click TTR and SMR generation with automatic AUSTRAC Online submission.',
        icon: FileText,
        benefit: 'Automated reporting'
      }
    ],
    specificModules: [
      'ASIC RG78 Workflow',
      'RG271 IDR Workflow',
      'Beneficial Ownership Mapper',
      'Enhanced Due Diligence',
      'PEP Screening',
      'Sanctions Screening',
      'Transaction Monitoring',
      'Ongoing CDD Automation',
      'AUSTRAC TTR Generator',
      'AUSTRAC SMR Generator'
    ],
    compliance: [
      'ASIC RG78 (Client Verification)',
      'ASIC RG271 (Internal Dispute Resolution)',
      'AUSTRAC AML/CTF Program',
      'AFSL Compliance',
      'Financial Services Licensing',
      'Privacy Act 1988'
    ],
    roi: {
      timesSaved: '32 hours per week for compliance team',
      costSavings: '$215,000 per year (50-person AFSL)',
      clientCapacity: 'Onboard 5x more investors',
      riskReduction: 'Zero ASIC/AUSTRAC breaches'
    },
    testimonial: {
      quote: 'Our ASIC audit was flawless. The auditor said our compliance documentation was the best they\'d seen. That\'s 100% due to Grow Compliance OS.',
      author: 'James Robertson',
      role: 'Chief Compliance Officer',
      firm: 'Horizon Wealth Management (AFSL)'
    }
  },
  'Fund Managers': {
    icon: BarChart3,
    color: 'amber',
    gradient: 'from-amber-500 to-amber-600',
    tagline: 'Investment Fund Compliance',
    description: 'Investor onboarding, sophisticated investor verification, and regulatory compliance for fund managers.',
    painPoints: [
      {
        title: 'Sophisticated Investor Verification',
        problem: 'Corporations Act requires verification of sophisticated/wholesale investors. Manual process slow and risky.',
        solution: 'Automated verification against $2.5M asset or $250K income thresholds with accountant certification workflow.',
        impact: 'Legally compliant'
      },
      {
        title: 'Slow Investor Onboarding',
        problem: 'Taking 7-10 days to onboard investors. Losing opportunities in fast-moving markets.',
        solution: 'Self-service investor portal with automated verification. Onboard in 12 minutes vs 7 days.',
        impact: '95% faster onboarding'
      },
      {
        title: 'AML for Fund Managers',
        problem: 'AUSTRAC requires PEP/sanctions screening for all investors. No system in place.',
        solution: 'Enterprise PEP and sanctions screening with World-Check integration and daily monitoring.',
        impact: 'AUSTRAC compliant'
      },
      {
        title: 'Subscription Document Chaos',
        problem: 'PDFs, wet signatures, manual data entry, version control nightmare.',
        solution: 'Digital subscription workflow with e-signature, auto data extraction, and version control.',
        impact: '80% less admin'
      }
    ],
    keyFeatures: [
      {
        title: 'Sophisticated Investor Workflow',
        description: 'Automated verification of sophisticated/wholesale status with accountant certification portal.',
        icon: Target,
        benefit: 'Corporations Act compliant'
      },
      {
        title: 'Investor Self-Service Portal',
        description: 'Branded portal for investors to complete subscription docs, upload IDs, and complete verification.',
        icon: Users,
        benefit: 'White-label experience'
      },
      {
        title: 'E-Signature Integration',
        description: 'DocuSign and Adobe Sign integration for subscription documents with audit trail.',
        icon: FileText,
        benefit: 'Paperless process'
      },
      {
        title: 'Ongoing Investor Monitoring',
        description: 'Daily PEP/sanctions screening, transaction monitoring, and periodic review automation.',
        icon: Activity,
        benefit: 'Continuous compliance'
      }
    ],
    specificModules: [
      'Sophisticated Investor Verification',
      'Wholesale Investor Verification',
      'Investor Portal',
      'Subscription Workflow',
      'E-Signature Integration',
      'PEP/Sanctions Screening',
      'Transaction Monitoring',
      'Investor Registry',
      'Distribution Tracking',
      'AUSTRAC Reporting'
    ],
    compliance: [
      'Corporations Act (Sophisticated Investors)',
      'ASIC RG78 (Client Verification)',
      'AUSTRAC AML/CTF',
      'Managed Investment Schemes',
      'Privacy Act 1988',
      'Financial Services Licensing'
    ],
    roi: {
      timesSaved: '40 hours per week for fund admin',
      costSavings: '$185,000 per year (100 investors)',
      clientCapacity: 'Manage 3x more investors',
      riskReduction: 'Zero compliance breaches'
    },
    testimonial: {
      quote: 'We onboarded 43 investors in one month during our latest raise. Previously our record was 12. The ROI is insane.',
      author: 'Emma Chen',
      role: 'Fund Administrator',
      firm: 'Vista Capital Partners'
    }
  },
  'Trustees': {
    icon: Scale,
    color: 'pink',
    gradient: 'from-pink-500 to-pink-600',
    tagline: 'Trust & Estate Compliance',
    description: 'Manage trustee obligations, beneficiary verification, and estate compliance with purpose-built workflows.',
    painPoints: [
      {
        title: 'Beneficiary Verification',
        problem: 'Verifying dozens of beneficiaries across multiple trusts. Manual ID checks take weeks.',
        solution: 'Bulk beneficiary upload with automated ID verification, relationship mapping, and entitlement tracking.',
        impact: '90% faster verification'
      },
      {
        title: 'Trust Deed Management',
        problem: 'Paper trust deeds in filing cabinets. Can\'t find clauses, no version control.',
        solution: 'Digital trust deed vault with searchable text, clause tagging, and automatic version tracking.',
        impact: 'Instant deed access'
      },
      {
        title: 'Appointor & Controller Tracking',
        problem: 'Tracking who has control of each trust - appointors, controllers, guardians. Excel chaos.',
        solution: 'Visual control map showing appointors, controllers, and succession for each trust.',
        impact: 'Clear control visibility'
      },
      {
        title: 'Distribution Compliance',
        problem: 'Ensuring distributions comply with trust deed requirements and tax law.',
        solution: 'Distribution workflow validates against trust deed rules and generates compliant minutes.',
        impact: 'Compliant distributions'
      }
    ],
    keyFeatures: [
      {
        title: 'Trust Registry',
        description: 'Central repository of all trusts with trust deeds, beneficiaries, and distribution history.',
        icon: Database,
        benefit: 'Single source of truth'
      },
      {
        title: 'Beneficiary Management',
        description: 'Track all beneficiaries with verification status, entitlements, and distribution history.',
        icon: Users,
        benefit: 'Complete beneficiary records'
      },
      {
        title: 'Trust Control Mapping',
        description: 'Visual map of appointors, controllers, guardians, and succession arrangements.',
        icon: Shield,
        benefit: 'Clear governance'
      },
      {
        title: 'Distribution Workflow',
        description: 'Automated distribution validation, minute generation, and tax compliance.',
        icon: FileText,
        benefit: 'Compliant distributions'
      }
    ],
    specificModules: [
      'Trust Registry',
      'Trust Deed Vault',
      'Beneficiary Verification',
      'Appointor Tracking',
      'Controller Mapping',
      'Distribution Workflow',
      'Trust Minutes Generator',
      'Succession Planning',
      'Estate Management',
      'Tax Distribution Compliance'
    ],
    compliance: [
      'Trust Law',
      'Taxation of Trusts',
      'ATO Trust Requirements',
      'State Trustee Regulations',
      'Privacy Act 1988',
      'Beneficial Ownership Register'
    ],
    roi: {
      timesSaved: '25 hours per week for trustee admin',
      costSavings: '$95,000 per year (200 trusts)',
      clientCapacity: 'Manage 2x more trusts',
      riskReduction: '100% distribution compliance'
    },
    testimonial: {
      quote: 'We manage 340 family trusts. Before Grow, it was spreadsheet hell. Now everything is automated and we haven\'t had a single distribution error.',
      author: 'David Wilson',
      role: 'Principal',
      firm: 'Wilson Trust Services'
    }
  },
  'Legal Firms': {
    icon: Briefcase,
    color: 'indigo',
    gradient: 'from-indigo-500 to-indigo-600',
    tagline: 'Law Firm Compliance & Risk',
    description: 'Client verification, trust account compliance, and AML obligations for legal practices.',
    painPoints: [
      {
        title: 'AML/CTF for Lawyers',
        problem: 'Lawyers are now reporting entities under AUSTRAC. Most firms have no AML program.',
        solution: 'Pre-built AML/CTF program template for legal firms with client risk assessment and reporting.',
        impact: 'AUSTRAC compliant'
      },
      {
        title: 'Client ID Verification',
        problem: 'Law Society rules require robust client ID. Manual 100-point checks slow and inconsistent.',
        solution: 'Automated 100-point ID verification with InfoTrack integration and digital evidence vault.',
        impact: 'Law Society compliant'
      },
      {
        title: 'Trust Account Regulations',
        problem: 'Trust account regulations require client verification before holding funds. Manual tracking.',
        solution: 'Hard gate prevents trust deposit until KYC complete with audit trail of verification.',
        impact: '100% trust compliance'
      },
      {
        title: 'Conflict of Interest Checks',
        problem: 'Manual conflict checks across 1000+ clients. Miss related parties and opposing counsel.',
        solution: 'Graph intelligence maps relationships, identifies conflicts, and alerts before engagement.',
        impact: 'Zero conflict issues'
      }
    ],
    keyFeatures: [
      {
        title: 'Law Society Compliant KYC',
        description: 'Purpose-built workflow meeting law society client verification requirements in all states.',
        icon: Shield,
        benefit: 'Professional compliance'
      },
      {
        title: 'Trust Account Gate',
        description: 'Hard stop prevents trust account deposits until client verification is complete.',
        icon: Lock,
        benefit: 'Trust account protection'
      },
      {
        title: 'Conflict Check System',
        description: 'Graph-based conflict detection showing client relationships and opposing parties.',
        icon: AlertCircle,
        benefit: 'Prevent conflicts'
      },
      {
        title: 'Matter-Based Verification',
        description: 'Link KYC to specific matters with verification level based on matter risk.',
        icon: FileText,
        benefit: 'Risk-based approach'
      }
    ],
    specificModules: [
      'Law Society KYC Workflow',
      'Trust Account Compliance',
      'Conflict Check System',
      'Matter-Based Verification',
      'Client Risk Assessment',
      'AML/CTF for Lawyers',
      'Source of Funds Verification',
      'Legal Practice Integration',
      'Client Portal',
      'Evidence Vault'
    ],
    compliance: [
      'AUSTRAC AML/CTF (Lawyers)',
      'Law Society Client ID Rules',
      'Trust Account Regulations',
      'Professional Conduct Rules',
      'Privacy Act 1988',
      'Legal Professional Privilege'
    ],
    roi: {
      timesSaved: '18 hours per week per solicitor',
      costSavings: '$125,000 per year (15-lawyer firm)',
      clientCapacity: 'Handle 50% more clients',
      riskReduction: 'Zero trust account breaches'
    },
    testimonial: {
      quote: 'Our trust account audit was perfect. The auditor commented on how impressed they were with our client verification system.',
      author: 'Rebecca Thompson',
      role: 'Managing Partner',
      firm: 'Thompson & Associates Legal'
    }
  },
  'Real Estate': {
    icon: Home,
    color: 'teal',
    gradient: 'from-teal-500 to-teal-600',
    tagline: 'Property & Real Estate Compliance',
    description: 'AML compliance for real estate agents, property managers, and settlement agents.',
    painPoints: [
      {
        title: 'AML for Real Estate',
        problem: 'Real estate agents must comply with AUSTRAC. Most have no AML program or client screening.',
        solution: 'Pre-built AML/CTF program for real estate with client risk assessment and transaction monitoring.',
        impact: 'AUSTRAC compliant'
      },
      {
        title: 'Client Verification Delays',
        problem: 'Buyers and sellers waiting 2-3 days for manual ID checks. Slowing down settlements.',
        solution: 'Instant ID verification with InfoTrack integration. Verify clients in 3 minutes.',
        impact: '95% faster verification'
      },
      {
        title: 'Beneficial Owner Identification',
        problem: 'AUSTRAC requires identifying beneficial owners of buying entities. Manual ASIC searches.',
        solution: 'Automated UBO identification with ASIC integration and visual ownership mapping.',
        impact: 'Automatic UBO mapping'
      },
      {
        title: 'Settlement Deadline Pressure',
        problem: 'Settlement in 30 days. KYC delays causing settlement failures and penalties.',
        solution: 'Fast-track verification with automated workflows and client self-service portal.',
        impact: 'On-time settlements'
      }
    ],
    keyFeatures: [
      {
        title: 'Real Estate AML Program',
        description: 'Purpose-built AML/CTF program meeting AUSTRAC requirements for real estate agents.',
        icon: Shield,
        benefit: 'AUSTRAC compliant'
      },
      {
        title: 'Buyer/Seller Portal',
        description: 'Self-service portal for buyers and sellers to upload ID and complete verification.',
        icon: Users,
        benefit: 'Client convenience'
      },
      {
        title: 'Settlement Integration',
        description: 'Integration with PEXA and settlement software with verification status sync.',
        icon: Zap,
        benefit: 'Seamless workflow'
      },
      {
        title: 'Transaction Monitoring',
        description: 'Monitor property transactions for suspicious activity with automatic AUSTRAC reporting.',
        icon: Activity,
        benefit: 'AML monitoring'
      }
    ],
    specificModules: [
      'Real Estate AML Program',
      'Buyer Verification',
      'Seller Verification',
      'Beneficial Owner ID',
      'Transaction Monitoring',
      'PEXA Integration',
      'Settlement Tracking',
      'Client Portal',
      'AUSTRAC Reporting',
      'Property Transaction Log'
    ],
    compliance: [
      'AUSTRAC AML/CTF (Real Estate)',
      'Real Estate Licensing',
      'Property Transaction Regulations',
      'Privacy Act 1988',
      'Consumer Law',
      'Settlement Requirements'
    ],
    roi: {
      timesSaved: '12 hours per week per agent',
      costSavings: '$68,000 per year (5-agent office)',
      clientCapacity: 'Handle 30% more transactions',
      riskReduction: 'Zero AUSTRAC breaches'
    },
    testimonial: {
      quote: 'We do 200+ settlements per year. Since implementing Grow, we haven\'t had a single KYC-related delay. Our settlement success rate is now 99.8%.',
      author: 'Mark Stevens',
      role: 'Principal Agent',
      firm: 'Stevens Property Group'
    }
  }
};

export function IndustryDetail({ industryId, onBack }: IndustryDetailProps) {
  const industry = industryData[industryId as keyof typeof industryData];
  
  if (!industry) {
    return (
      <div className="min-h-screen bg-white p-8">
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center mt-12">
          <p className="text-gray-600">Industry not found</p>
        </div>
      </div>
    );
  }

  const IndustryIcon = industry.icon;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Overview
          </Button>

          <div className="flex items-center gap-6 mb-6">
            <div className={`w-20 h-20 bg-gradient-to-br ${industry.gradient} rounded-2xl flex items-center justify-center shadow-xl`}>
              <IndustryIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{industryId}</h1>
              <p className="text-xl text-gray-600">{industry.tagline}</p>
            </div>
          </div>

          <p className="text-lg text-gray-700 max-w-4xl">{industry.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Pain Points & Solutions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">We Solve Your Biggest Pain Points</h2>
          <div className="space-y-6">
            {industry.painPoints.map((pain, idx) => (
              <Card key={idx} className="border-2 hover:border-[#13B5EA] transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{pain.title}</h3>
                      <p className="text-gray-600">{pain.problem}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 pl-14">
                    <div className="flex-1 bg-green-50 p-4 rounded-lg border-2 border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-900">Our Solution</span>
                      </div>
                      <p className="text-gray-700 mb-3">{pain.solution}</p>
                      <Badge className="bg-green-600 text-white">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {pain.impact}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Built Specifically for {industryId}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {industry.keyFeatures.map((feature, idx) => {
              const FeatureIcon = feature.icon;
              return (
                <Card key={idx} className="border-2">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-${industry.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <FeatureIcon className={`w-6 h-6 text-${industry.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600 mb-3">{feature.description}</p>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                          {feature.benefit}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Modules */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Specialized Modules for {industryId}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {industry.specificModules.map((module, idx) => (
              <Card key={idx} className="bg-gray-50 hover:bg-gray-100 transition-colors">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs font-medium text-gray-900">{module}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ROI */}
        <Card className="mb-16 border-2 border-[#13B5EA]">
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <DollarSign className="w-8 h-8 text-green-600" />
              Return on Investment
            </CardTitle>
            <CardDescription>Real numbers from {industryId} using Grow Compliance OS</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{industry.roi.timesSaved}</div>
                <div className="text-sm text-gray-600">Time Saved</div>
              </div>
              <div className="text-center">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{industry.roi.costSavings}</div>
                <div className="text-sm text-gray-600">Cost Savings</div>
              </div>
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{industry.roi.clientCapacity}</div>
                <div className="text-sm text-gray-600">Capacity Increase</div>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{industry.roi.riskReduction}</div>
                <div className="text-sm text-gray-600">Risk Reduction</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testimonial */}
        <Card className="mb-16 bg-gradient-to-r from-gray-50 to-gray-100 border-2">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <div className="text-6xl text-[#13B5EA]">"</div>
              <div className="flex-1">
                <p className="text-xl text-gray-900 mb-6 italic">{industry.testimonial.quote}</p>
                <div>
                  <p className="font-bold text-gray-900">{industry.testimonial.author}</p>
                  <p className="text-gray-600">{industry.testimonial.role}</p>
                  <p className="text-sm text-gray-500">{industry.testimonial.firm}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-600" />
              Compliance Coverage for {industryId}
            </CardTitle>
            <CardDescription>All regulatory requirements specific to your industry</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {industry.compliance.map((comp, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-green-50 rounded border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900">{comp}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-slate-800 to-slate-700 text-white border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your {industryId} Practice?</h3>
            <p className="text-white/90 mb-6 text-lg max-w-2xl mx-auto">
              Join hundreds of {industryId.toLowerCase()} who have automated their compliance and grown their practice with Grow Compliance OS.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button 
                size="lg"
                className="bg-white text-[#13B5EA] hover:bg-white/90"
                onClick={onBack}
              >
                Explore Other Industries
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Schedule Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}