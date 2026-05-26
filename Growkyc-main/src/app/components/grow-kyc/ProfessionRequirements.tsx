import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Shield,
  FileText,
  GraduationCap,
  Scale,
  BookOpen,
  Award,
  Calendar,
  Users,
  Target,
  Briefcase,
  Eye,
  Bell,
  Lock,
  TrendingUp,
  Activity,
  ClipboardCheck,
  UserCheck,
  FileCheck,
  ScrollText,
  Stamp,
  Gavel
} from 'lucide-react';

interface ProfessionRequirementsProps {
  profession: 'compliance_officer' | 'partner' | 'analyst' | 'auditor';
  onBack: () => void;
}

export function ProfessionRequirements({ profession, onBack }: ProfessionRequirementsProps) {
  const professionData = {
    compliance_officer: {
      title: 'Compliance Officer',
      subtitle: 'AML/CTF Compliance Requirements',
      color: 'from-[#13B5EA] to-[#0E7C9E]',
      icon: Shield,
      avatar: '👩‍💼',
      completionRate: 94,
      sections: [
        {
          title: 'Legal & Regulatory Requirements',
          icon: Scale,
          items: [
            {
              requirement: 'AUSTRAC Registration & Reporting',
              status: 'completed',
              description: 'Maintain current AUSTRAC registration for the reporting entity',
              legalRef: 'AML/CTF Act 2006 - Section 75',
              frequency: 'Ongoing',
              lastCompleted: '2026-03-15',
              documents: ['AUSTRAC Registration Certificate', 'Annual Compliance Report']
            },
            {
              requirement: 'AML/CTF Program Implementation',
              status: 'completed',
              description: 'Develop, maintain and comply with Part A and Part B of AML/CTF Program',
              legalRef: 'AML/CTF Act 2006 - Section 84',
              frequency: 'Annual Review',
              lastCompleted: '2026-02-01',
              documents: ['AML/CTF Program Part A', 'AML/CTF Program Part B', 'Board Approval']
            },
            {
              requirement: 'Customer Due Diligence (CDD)',
              status: 'in-progress',
              description: 'Collect and verify customer identification and beneficial ownership',
              legalRef: 'AML/CTF Act 2006 - Sections 30-37',
              frequency: 'Per Transaction',
              lastCompleted: '2026-03-19',
              documents: ['CDD Procedures Manual', 'ID Verification Records']
            },
            {
              requirement: 'Enhanced Due Diligence (EDD)',
              status: 'completed',
              description: 'Apply enhanced measures for high-risk customers and PEPs',
              legalRef: 'AML/CTF Rules - Chapter 4',
              frequency: 'Risk-Based',
              lastCompleted: '2026-03-18',
              documents: ['EDD Framework', 'PEP Screening Reports']
            },
            {
              requirement: 'Suspicious Matter Reporting (SMR)',
              status: 'in-progress',
              description: 'Submit SMRs to AUSTRAC within 3 business days of forming suspicion',
              legalRef: 'AML/CTF Act 2006 - Section 41',
              frequency: 'As Required',
              lastCompleted: '2026-03-10',
              documents: ['SMR Procedures', 'SMR Log Register']
            },
            {
              requirement: 'Threshold Transaction Reports (TTR)',
              status: 'completed',
              description: 'Report physical currency transactions of $10,000 or more within 10 days',
              legalRef: 'AML/CTF Act 2006 - Section 43',
              frequency: 'As Required',
              lastCompleted: '2026-03-19',
              documents: ['TTR Submission Records']
            },
            {
              requirement: 'International Funds Transfer Instructions (IFTI)',
              status: 'completed',
              description: 'Report all international fund transfers within 10 business days',
              legalRef: 'AML/CTF Act 2006 - Section 45',
              frequency: 'As Required',
              lastCompleted: '2026-03-19',
              documents: ['IFTI Reporting Logs']
            },
            {
              requirement: 'Correspondent Banking Due Diligence',
              status: 'completed',
              description: 'Assess and approve all correspondent banking relationships',
              legalRef: 'AML/CTF Rules - Rule 8.4',
              frequency: 'Annual Review',
              lastCompleted: '2026-01-20',
              documents: ['Correspondent Bank Assessments']
            }
          ]
        },
        {
          title: 'Professional Qualifications & Certifications',
          icon: Award,
          items: [
            {
              requirement: 'ACAMS Certification (CAMS)',
              status: 'completed',
              description: 'Certified Anti-Money Laundering Specialist credential',
              legalRef: 'Industry Best Practice',
              frequency: 'Renewal every 3 years',
              lastCompleted: '2025-06-15',
              documents: ['CAMS Certificate', 'CPE Credits Log']
            },
            {
              requirement: 'Continuing Professional Education (CPE)',
              status: 'in-progress',
              description: 'Complete 40 CPE credits over 3-year cycle',
              legalRef: 'ACAMS Requirement',
              frequency: 'Ongoing - 40 credits/3 years',
              lastCompleted: '2026-03-01',
              documents: ['CPE Transcript - 28/40 credits completed']
            },
            {
              requirement: 'Australian Financial Crimes Law Training',
              status: 'completed',
              description: 'Comprehensive understanding of AU AML/CTF legislation',
              legalRef: 'Internal Requirement',
              frequency: 'Annual Refresh',
              lastCompleted: '2026-02-10',
              documents: ['Training Certificate', 'Assessment Results']
            },
            {
              requirement: 'Sanctions Compliance Certification',
              status: 'completed',
              description: 'OFAC, UN, EU, and Australian sanctions programs expertise',
              legalRef: 'Regulatory Expectation',
              frequency: 'Annual',
              lastCompleted: '2025-11-20',
              documents: ['Sanctions Training Certificate']
            }
          ]
        },
        {
          title: 'Ongoing Compliance Obligations',
          icon: ClipboardCheck,
          items: [
            {
              requirement: 'Transaction Monitoring System Oversight',
              status: 'in-progress',
              description: 'Daily review of automated alerts and suspicious activity',
              legalRef: 'AML/CTF Program Part A',
              frequency: 'Daily',
              lastCompleted: '2026-03-20',
              documents: ['Alert Review Logs', 'Escalation Reports']
            },
            {
              requirement: 'Sanctions Screening - Real-Time',
              status: 'in-progress',
              description: 'Screen all customers and transactions against sanctions lists',
              legalRef: 'Autonomous Sanctions Act 2011',
              frequency: 'Real-Time + Daily Batch',
              lastCompleted: '2026-03-20',
              documents: ['Screening Results', 'Match Resolution Records']
            },
            {
              requirement: 'Risk Assessment Reviews',
              status: 'completed',
              description: 'Annual ML/TF risk assessment of business operations',
              legalRef: 'AML/CTF Rules - Rule 8.6',
              frequency: 'Annual',
              lastCompleted: '2026-02-01',
              documents: ['Annual Risk Assessment Report', 'Board Presentation']
            },
            {
              requirement: 'Customer Periodic Reviews',
              status: 'in-progress',
              description: 'Conduct ongoing customer due diligence based on risk rating',
              legalRef: 'AML/CTF Rules - Chapter 15',
              frequency: 'Risk-Based (Low: 3yr, Med: 2yr, High: 1yr)',
              lastCompleted: '2026-03-19',
              documents: ['Review Schedule', 'Completed Review Records']
            },
            {
              requirement: 'Record Keeping - 7 Year Retention',
              status: 'completed',
              description: 'Maintain all AML/CTF records for minimum 7 years',
              legalRef: 'AML/CTF Act 2006 - Section 107',
              frequency: 'Ongoing',
              lastCompleted: 'Current',
              documents: ['Document Retention Policy', 'Archive Audit Log']
            },
            {
              requirement: 'Staff AML/CTF Training Program',
              status: 'in-progress',
              description: 'Provide ongoing training to all relevant staff',
              legalRef: 'AML/CTF Program Part A - Section 10',
              frequency: 'Annual + Onboarding',
              lastCompleted: '2026-03-15',
              documents: ['Training Curriculum', 'Attendance Records', 'Assessment Results']
            }
          ]
        },
        {
          title: 'Reporting & Documentation',
          icon: FileText,
          items: [
            {
              requirement: 'Annual Compliance Report to AUSTRAC',
              status: 'completed',
              description: 'Submit annual compliance report by March 31st',
              legalRef: 'AML/CTF Act 2006 - Section 47',
              frequency: 'Annual - Due March 31',
              lastCompleted: '2026-03-15',
              documents: ['2025 Annual Compliance Report Submitted']
            },
            {
              requirement: 'Quarterly Board Compliance Report',
              status: 'completed',
              description: 'Report compliance status and metrics to Board of Directors',
              legalRef: 'Internal Governance Requirement',
              frequency: 'Quarterly',
              lastCompleted: '2026-03-01',
              documents: ['Q1 2026 Board Report', 'Board Minutes']
            },
            {
              requirement: 'Monthly Regulatory Reporting Package',
              status: 'completed',
              description: 'Consolidate all regulatory reports and metrics',
              legalRef: 'Internal Requirement',
              frequency: 'Monthly',
              lastCompleted: '2026-03-05',
              documents: ['February 2026 Regulatory Package']
            },
            {
              requirement: 'Incident & Breach Reporting',
              status: 'completed',
              description: 'Document and report compliance breaches within required timeframes',
              legalRef: 'AML/CTF Act 2006 - Section 49',
              frequency: 'As Required',
              lastCompleted: 'N/A - No incidents',
              documents: ['Incident Log - No Active Incidents']
            }
          ]
        },
        {
          title: 'Audit & Quality Assurance',
          icon: Eye,
          items: [
            {
              requirement: 'Independent AML Audit',
              status: 'completed',
              description: 'Commission external audit of AML/CTF program effectiveness',
              legalRef: 'AML/CTF Program Part A - Section 11',
              frequency: 'Biennial (Every 2 years)',
              lastCompleted: '2025-09-01',
              documents: ['2025 External Audit Report', 'Management Response', 'Remediation Plan']
            },
            {
              requirement: 'Internal Compliance Testing',
              status: 'in-progress',
              description: 'Conduct sample testing of CDD, monitoring, and reporting',
              legalRef: 'Internal Audit Plan',
              frequency: 'Quarterly',
              lastCompleted: '2026-03-10',
              documents: ['Q1 2026 Testing Results - In Progress']
            },
            {
              requirement: 'Quality Assurance Reviews',
              status: 'in-progress',
              description: 'Review quality of case investigations and decision-making',
              legalRef: 'Internal QA Framework',
              frequency: 'Monthly - 10% Sample',
              lastCompleted: '2026-03-15',
              documents: ['February 2026 QA Report']
            }
          ]
        }
      ]
    },
    partner: {
      title: 'Managing Partner',
      subtitle: 'Executive Governance & Oversight Requirements',
      color: 'from-purple-600 to-pink-600',
      icon: Briefcase,
      avatar: '👨‍💼',
      completionRate: 97,
      sections: [
        {
          title: 'Board & Governance Responsibilities',
          icon: Gavel,
          items: [
            {
              requirement: 'AML/CTF Program Board Approval',
              status: 'completed',
              description: 'Review and formally approve AML/CTF Program annually',
              legalRef: 'AML/CTF Act 2006 - Section 84',
              frequency: 'Annual',
              lastCompleted: '2026-02-01',
              documents: ['Board Resolution', 'Approved AML/CTF Program', 'Board Minutes']
            },
            {
              requirement: 'Appointment of Compliance Officer',
              status: 'completed',
              description: 'Designate and empower AML/CTF Compliance Officer',
              legalRef: 'AML/CTF Program Part A - Section 4',
              frequency: 'As Required',
              lastCompleted: '2025-01-15',
              documents: ['Compliance Officer Appointment Letter', 'Authority Delegation']
            },
            {
              requirement: 'Risk Appetite Statement Approval',
              status: 'completed',
              description: 'Define and approve enterprise ML/TF risk tolerance levels',
              legalRef: 'Corporate Governance Best Practice',
              frequency: 'Annual Review',
              lastCompleted: '2026-01-20',
              documents: ['2026 Risk Appetite Statement', 'Board Approval']
            },
            {
              requirement: 'Compliance Budget Authorization',
              status: 'completed',
              description: 'Allocate sufficient resources for compliance program',
              legalRef: 'AML/CTF Program Part A',
              frequency: 'Annual',
              lastCompleted: '2025-12-10',
              documents: ['2026 Compliance Budget', 'Resource Allocation Plan']
            },
            {
              requirement: 'Corporate Governance Framework',
              status: 'completed',
              description: 'Establish three lines of defense model for compliance',
              legalRef: 'APRA CPS 220 / Industry Standard',
              frequency: 'Annual Review',
              lastCompleted: '2026-01-15',
              documents: ['Governance Framework', 'Committee Charters']
            }
          ]
        },
        {
          title: 'Legal & Regulatory Oversight',
          icon: Scale,
          items: [
            {
              requirement: 'AUSTRAC Engagement & Liaison',
              status: 'completed',
              description: 'Maintain relationship with AUSTRAC as senior executive',
              legalRef: 'Regulatory Expectation',
              frequency: 'Biannual Meetings',
              lastCompleted: '2025-11-20',
              documents: ['AUSTRAC Meeting Notes', 'Correspondence Log']
            },
            {
              requirement: 'Regulatory Change Management',
              status: 'in-progress',
              description: 'Oversee implementation of new regulatory requirements',
              legalRef: 'Business Management',
              frequency: 'Ongoing',
              lastCompleted: '2026-03-01',
              documents: ['Regulatory Horizon Scanning Report', 'Implementation Plans']
            },
            {
              requirement: 'High-Risk Client Approval Authority',
              status: 'in-progress',
              description: 'Review and approve onboarding of high-risk customers',
              legalRef: 'AML/CTF Program Part A - Escalation',
              frequency: 'As Required',
              lastCompleted: '2026-03-18',
              documents: ['High Risk Approval Log - 3 pending']
            },
            {
              requirement: 'Enhanced Due Diligence Oversight',
              status: 'in-progress',
              description: 'Approve EDD reports for PEPs and high-risk relationships',
              legalRef: 'AML/CTF Rules - Chapter 4',
              frequency: 'As Required',
              lastCompleted: '2026-03-17',
              documents: ['EDD Approval Register']
            },
            {
              requirement: 'Whistleblower Protection Program',
              status: 'completed',
              description: 'Implement and oversee whistleblower protection framework',
              legalRef: 'Corporations Act 2001 - Part 9.4AAA',
              frequency: 'Annual Review',
              lastCompleted: '2026-02-15',
              documents: ['Whistleblower Policy', 'Protected Disclosure Procedures']
            }
          ]
        },
        {
          title: 'Strategic Compliance Leadership',
          icon: Target,
          items: [
            {
              requirement: 'Compliance Culture & Tone from the Top',
              status: 'completed',
              description: 'Demonstrate visible commitment to compliance across organization',
              legalRef: 'Leadership Responsibility',
              frequency: 'Ongoing',
              lastCompleted: 'Continuous',
              documents: ['Staff Communications', 'All-Hands Presentations']
            },
            {
              requirement: 'Technology & Innovation Investment',
              status: 'in-progress',
              description: 'Approve investments in RegTech and compliance automation',
              legalRef: 'Business Strategy',
              frequency: 'Annual Budget Cycle',
              lastCompleted: '2026-03-01',
              documents: ['2026 Technology Roadmap', 'Capital Approvals']
            },
            {
              requirement: 'Third-Party Risk Management',
              status: 'completed',
              description: 'Oversee due diligence of outsourced service providers',
              legalRef: 'AML/CTF Rules - Chapter 11',
              frequency: 'Annual Review',
              lastCompleted: '2026-02-10',
              documents: ['Vendor Risk Assessments', 'Service Level Agreements']
            },
            {
              requirement: 'International Expansion Compliance',
              status: 'completed',
              description: 'Ensure compliance framework covers all jurisdictions',
              legalRef: 'Multi-Jurisdictional Requirement',
              frequency: 'Per Expansion',
              lastCompleted: '2025-10-15',
              documents: ['Jurisdictional Compliance Matrix']
            }
          ]
        },
        {
          title: 'Reporting & Accountability',
          icon: FileCheck,
          items: [
            {
              requirement: 'Quarterly Compliance Committee',
              status: 'completed',
              description: 'Chair quarterly compliance committee meetings',
              legalRef: 'Board Committee Charter',
              frequency: 'Quarterly',
              lastCompleted: '2026-03-05',
              documents: ['Q1 2026 Committee Minutes', 'Action Items Register']
            },
            {
              requirement: 'Annual Statement to Shareholders',
              status: 'completed',
              description: 'Report on compliance performance in annual report',
              legalRef: 'Corporate Reporting',
              frequency: 'Annual',
              lastCompleted: '2025-09-30',
              documents: ['2025 Annual Report - Compliance Section']
            },
            {
              requirement: 'Breach Notification to Board',
              status: 'completed',
              description: 'Immediate notification of material compliance breaches',
              legalRef: 'Directors Duties',
              frequency: 'As Required',
              lastCompleted: 'N/A - No material breaches',
              documents: ['Breach Escalation Protocol']
            },
            {
              requirement: 'Regulator Correspondence Review',
              status: 'in-progress',
              description: 'Review and approve all material regulator submissions',
              legalRef: 'Management Oversight',
              frequency: 'As Required',
              lastCompleted: '2026-03-15',
              documents: ['AUSTRAC Correspondence File']
            }
          ]
        },
        {
          title: 'Professional Development',
          icon: GraduationCap,
          items: [
            {
              requirement: 'Executive AML/CTF Training',
              status: 'completed',
              description: 'Maintain current knowledge of AML/CTF obligations',
              legalRef: 'Best Practice',
              frequency: 'Annual',
              lastCompleted: '2026-01-25',
              documents: ['Executive Training Certificate']
            },
            {
              requirement: 'Financial Crime Conference Attendance',
              status: 'completed',
              description: 'Participate in industry forums and knowledge sharing',
              legalRef: 'Professional Development',
              frequency: 'Annual',
              lastCompleted: '2025-11-10',
              documents: ['Conference Attendance Records']
            },
            {
              requirement: 'Director & Officer Insurance',
              status: 'completed',
              description: 'Maintain adequate D&O insurance coverage',
              legalRef: 'Risk Management',
              frequency: 'Annual Renewal',
              lastCompleted: '2025-12-01',
              documents: ['D&O Policy', 'Certificate of Currency']
            }
          ]
        }
      ]
    },
    analyst: {
      title: 'AML Analyst',
      subtitle: 'Transaction Monitoring & Investigation Requirements',
      color: 'from-cyan-600 to-blue-600',
      icon: Activity,
      avatar: '👩‍💻',
      completionRate: 89,
      sections: [
        {
          title: 'Core Investigation Responsibilities',
          icon: Eye,
          items: [
            {
              requirement: 'Transaction Alert Review & Investigation',
              status: 'in-progress',
              description: 'Review and investigate automated transaction monitoring alerts',
              legalRef: 'AML/CTF Program Part A - Section 8',
              frequency: 'Daily',
              lastCompleted: '2026-03-20',
              documents: ['Alert Queue - 23 pending', 'Investigation Guidelines']
            },
            {
              requirement: 'Customer Activity Pattern Analysis',
              status: 'in-progress',
              description: 'Analyze customer transaction patterns for suspicious behavior',
              legalRef: 'AML/CTF Rules - Chapter 25',
              frequency: 'Ongoing per alert',
              lastCompleted: '2026-03-20',
              documents: ['Transaction Analysis Templates']
            },
            {
              requirement: 'Suspicious Matter Report (SMR) Preparation',
              status: 'in-progress',
              description: 'Document findings and prepare SMRs for compliance officer review',
              legalRef: 'AML/CTF Act 2006 - Section 41',
              frequency: 'As Required',
              lastCompleted: '2026-03-18',
              documents: ['SMR Draft Template', 'Supporting Evidence Files']
            },
            {
              requirement: 'Enhanced Investigation for Complex Cases',
              status: 'in-progress',
              description: 'Conduct deep-dive investigations for high-risk scenarios',
              legalRef: 'Internal Procedures',
              frequency: 'As Assigned',
              lastCompleted: '2026-03-19',
              documents: ['Complex Case Guidelines', '6 active investigations']
            },
            {
              requirement: 'Customer Outreach & Inquiry',
              status: 'in-progress',
              description: 'Contact customers to clarify unusual transaction activity',
              legalRef: 'AML/CTF Program - Customer Communication',
              frequency: 'As Required',
              lastCompleted: '2026-03-19',
              documents: ['Customer Contact Log', 'Communication Scripts']
            },
            {
              requirement: 'False Positive Identification',
              status: 'in-progress',
              description: 'Properly document and close false positive alerts',
              legalRef: 'Internal Quality Standards',
              frequency: 'Daily',
              lastCompleted: '2026-03-20',
              documents: ['False Positive Criteria', 'Closure Documentation']
            }
          ]
        },
        {
          title: 'Technical & Analytical Skills',
          icon: Award,
          items: [
            {
              requirement: 'Transaction Monitoring System Training',
              status: 'completed',
              description: 'Proficiency in enterprise TM system operation',
              legalRef: 'Technical Requirement',
              frequency: 'Initial + Updates',
              lastCompleted: '2026-01-20',
              documents: ['System Training Certificate', 'Advanced User Guide']
            },
            {
              requirement: 'Financial Crime Typologies Knowledge',
              status: 'in-progress',
              description: 'Understanding of money laundering and terrorist financing methods',
              legalRef: 'Professional Competency',
              frequency: 'Ongoing - Annual Refresh',
              lastCompleted: '2026-02-15',
              documents: ['Typologies Training Materials', 'Case Studies']
            },
            {
              requirement: 'Sanctions & PEP Screening Expertise',
              status: 'completed',
              description: 'Ability to analyze and resolve screening alerts',
              legalRef: 'Operational Requirement',
              frequency: 'Annual Certification',
              lastCompleted: '2025-12-10',
              documents: ['Sanctions Training Certificate']
            },
            {
              requirement: 'ACAMS Associate Certification (CGSS)',
              status: 'in-progress',
              description: 'Certified Global Sanctions Specialist credential',
              legalRef: 'Career Development',
              frequency: 'Certification Track',
              lastCompleted: 'Exam scheduled Q2 2026',
              documents: ['Study Plan', 'Exam Registration']
            },
            {
              requirement: 'Data Analytics & Visualization',
              status: 'completed',
              description: 'Use of Excel, SQL, and visualization tools for analysis',
              legalRef: 'Technical Skill',
              frequency: 'Ongoing',
              lastCompleted: '2026-01-15',
              documents: ['Analytics Training Certificate']
            }
          ]
        },
        {
          title: 'Regulatory Knowledge',
          icon: BookOpen,
          items: [
            {
              requirement: 'AML/CTF Act 2006 - Core Provisions',
              status: 'completed',
              description: 'Understanding of key AML/CTF legislative requirements',
              legalRef: 'AML/CTF Act 2006',
              frequency: 'Annual Training',
              lastCompleted: '2026-02-10',
              documents: ['Legislation Training Certificate', 'Assessment Pass']
            },
            {
              requirement: 'Reporting Thresholds & Timeframes',
              status: 'completed',
              description: 'Knowledge of SMR, TTR, IFTI reporting obligations',
              legalRef: 'AML/CTF Act - Sections 41-45',
              frequency: 'Annual Refresh',
              lastCompleted: '2026-02-10',
              documents: ['Reporting Requirements Guide']
            },
            {
              requirement: 'Tipping Off Prohibition',
              status: 'completed',
              description: 'Understand legal prohibition against disclosing SMR filing',
              legalRef: 'AML/CTF Act 2006 - Section 123',
              frequency: 'Annual Training',
              lastCompleted: '2026-02-10',
              documents: ['Confidentiality Training', 'Acknowledgment Form']
            },
            {
              requirement: 'Privacy & Data Protection',
              status: 'completed',
              description: 'Comply with Privacy Act 1988 in handling customer data',
              legalRef: 'Privacy Act 1988',
              frequency: 'Annual',
              lastCompleted: '2026-01-30',
              documents: ['Privacy Training Certificate']
            }
          ]
        },
        {
          title: 'Documentation & Case Management',
          icon: FileText,
          items: [
            {
              requirement: 'Investigation Documentation Standards',
              status: 'in-progress',
              description: 'Maintain detailed records of all investigation steps',
              legalRef: 'AML/CTF Act - Section 107',
              frequency: 'Per Investigation',
              lastCompleted: '2026-03-20',
              documents: ['Documentation Guidelines', 'Quality Checklist']
            },
            {
              requirement: 'Evidence Collection & Preservation',
              status: 'in-progress',
              description: 'Gather and secure evidence supporting findings',
              legalRef: 'Internal Procedures',
              frequency: 'Per Investigation',
              lastCompleted: '2026-03-20',
              documents: ['Evidence Management Protocol']
            },
            {
              requirement: 'Case File Organization',
              status: 'in-progress',
              description: 'Organize case files for audit and regulatory review',
              legalRef: 'Record Keeping Requirement',
              frequency: 'Ongoing',
              lastCompleted: '2026-03-20',
              documents: ['File Structure Standards', 'Naming Conventions']
            },
            {
              requirement: 'Weekly Activity Reporting',
              status: 'completed',
              description: 'Report on alerts reviewed, cases closed, and SMRs prepared',
              legalRef: 'Management Reporting',
              frequency: 'Weekly',
              lastCompleted: '2026-03-17',
              documents: ['Week of 3/10 Activity Report']
            },
            {
              requirement: 'Quality Assurance Compliance',
              status: 'in-progress',
              description: 'Ensure work meets QA standards and supervisor reviews',
              legalRef: 'Internal QA Framework',
              frequency: 'Monthly - 10% Sample',
              lastCompleted: '2026-03-15',
              documents: ['February QA Results - 95% Pass Rate']
            }
          ]
        },
        {
          title: 'Collaboration & Escalation',
          icon: Users,
          items: [
            {
              requirement: 'Escalation to Senior Analysts',
              status: 'in-progress',
              description: 'Escalate complex or ambiguous cases appropriately',
              legalRef: 'Escalation Procedures',
              frequency: 'As Required',
              lastCompleted: '2026-03-19',
              documents: ['Escalation Matrix', '2 cases escalated this week']
            },
            {
              requirement: 'Compliance Officer Coordination',
              status: 'in-progress',
              description: 'Work with Compliance Officer on SMR submissions',
              legalRef: 'Internal Process',
              frequency: 'Ongoing',
              lastCompleted: '2026-03-18',
              documents: ['SMR Review Queue']
            },
            {
              requirement: 'Law Enforcement Inquiry Support',
              status: 'completed',
              description: 'Assist with information requests from authorities',
              legalRef: 'AML/CTF Act - Section 49A',
              frequency: 'As Required',
              lastCompleted: '2026-02-20',
              documents: ['LE Request Log', 'Information Disclosure Procedures']
            },
            {
              requirement: 'Knowledge Sharing & Training',
              status: 'completed',
              description: 'Share typologies and lessons learned with team',
              legalRef: 'Team Development',
              frequency: 'Monthly Team Meetings',
              lastCompleted: '2026-03-10',
              documents: ['March Team Meeting Presentation']
            }
          ]
        },
        {
          title: 'Performance & Productivity',
          icon: TrendingUp,
          items: [
            {
              requirement: 'Alert Disposition Targets',
              status: 'in-progress',
              description: 'Meet productivity targets for alert review and closure',
              legalRef: 'Performance Metrics',
              frequency: 'Daily - 15-20 alerts',
              lastCompleted: '2026-03-20',
              documents: ['Daily Productivity Dashboard']
            },
            {
              requirement: 'Average Investigation Time',
              status: 'in-progress',
              description: 'Maintain efficient case turnaround times',
              legalRef: 'Efficiency Metric',
              frequency: 'Ongoing - Target 2.5 days avg',
              lastCompleted: 'Current avg: 2.3 days',
              documents: ['Time Tracking Report']
            },
            {
              requirement: 'False Positive Rate',
              status: 'completed',
              description: 'Optimize alert accuracy through proper tuning',
              legalRef: 'Quality Metric',
              frequency: 'Monthly Review',
              lastCompleted: 'February: 87% accuracy',
              documents: ['Alert Tuning Recommendations']
            }
          ]
        }
      ]
    },
    auditor: {
      title: 'Compliance Auditor',
      subtitle: 'Audit & Quality Assurance Requirements',
      color: 'from-indigo-600 to-purple-600',
      icon: ClipboardCheck,
      avatar: '🧑‍💼',
      completionRate: 96,
      sections: [
        {
          title: 'Independent Audit Requirements',
          icon: Shield,
          items: [
            {
              requirement: 'Biennial AML/CTF Program Audit',
              status: 'completed',
              description: 'Conduct comprehensive independent audit every 2 years',
              legalRef: 'AML/CTF Program Part A - Section 11',
              frequency: 'Biennial (Every 2 years)',
              lastCompleted: '2025-09-01',
              documents: ['2025 Audit Report', 'Audit Plan', 'Workpapers']
            },
            {
              requirement: 'Audit Independence & Objectivity',
              status: 'completed',
              description: 'Maintain independence from operational compliance functions',
              legalRef: 'IIA Standards - 1110',
              frequency: 'Ongoing',
              lastCompleted: 'Continuous',
              documents: ['Independence Declaration', 'Conflict of Interest Disclosure']
            },
            {
              requirement: 'Risk-Based Audit Methodology',
              status: 'completed',
              description: 'Apply risk-based approach to audit planning and execution',
              legalRef: 'Audit Best Practice',
              frequency: 'Annual Audit Plan',
              lastCompleted: '2025-12-15',
              documents: ['2026 Risk-Based Audit Plan', 'Risk Assessment Matrix']
            },
            {
              requirement: 'Audit Committee Reporting',
              status: 'completed',
              description: 'Report audit findings to Board Audit Committee',
              legalRef: 'Corporate Governance',
              frequency: 'Quarterly',
              lastCompleted: '2026-03-05',
              documents: ['Q1 2026 Audit Committee Report']
            }
          ]
        },
        {
          title: 'Audit Testing & Procedures',
          icon: ClipboardCheck,
          items: [
            {
              requirement: 'Customer Due Diligence (CDD) Testing',
              status: 'in-progress',
              description: 'Sample test CDD procedures for effectiveness and compliance',
              legalRef: 'Audit Scope',
              frequency: 'Annual - 100+ sample',
              lastCompleted: '2026-03-15',
              documents: ['CDD Testing Workpapers - 78/100 completed']
            },
            {
              requirement: 'Transaction Monitoring System Testing',
              status: 'in-progress',
              description: 'Test alert generation, investigation quality, and disposition',
              legalRef: 'Audit Scope',
              frequency: 'Annual',
              lastCompleted: '2026-03-10',
              documents: ['TM Testing Plan', 'Sample Selection - 50 alerts']
            },
            {
              requirement: 'Suspicious Matter Report (SMR) Review',
              status: 'completed',
              description: 'Review SMR quality, timeliness, and AUSTRAC submission',
              legalRef: 'Audit Scope',
              frequency: 'Annual - 100% review',
              lastCompleted: '2026-02-20',
              documents: ['SMR Audit Report', '15 SMRs reviewed']
            },
            {
              requirement: 'Sanctions Screening Effectiveness',
              status: 'completed',
              description: 'Test sanctions screening coverage and match resolution',
              legalRef: 'Audit Scope',
              frequency: 'Annual',
              lastCompleted: '2026-01-30',
              documents: ['Sanctions Testing Report', 'Match Resolution Sample']
            },
            {
              requirement: 'Record Keeping Compliance',
              status: 'completed',
              description: 'Verify 7-year record retention and accessibility',
              legalRef: 'AML/CTF Act - Section 107',
              frequency: 'Annual',
              lastCompleted: '2026-02-15',
              documents: ['Record Retention Audit', 'Archive Access Testing']
            },
            {
              requirement: 'Staff Training Program Audit',
              status: 'completed',
              description: 'Review training delivery, attendance, and effectiveness',
              legalRef: 'Audit Scope',
              frequency: 'Annual',
              lastCompleted: '2026-02-28',
              documents: ['Training Audit Report', 'Attendance Analysis']
            },
            {
              requirement: 'AUSTRAC Reporting Validation',
              status: 'completed',
              description: 'Validate TTR, IFTI, and other regulatory report accuracy',
              legalRef: 'Audit Scope',
              frequency: 'Annual',
              lastCompleted: '2026-03-01',
              documents: ['Regulatory Reporting Audit', 'Data Quality Assessment']
            }
          ]
        },
        {
          title: 'Professional Certifications',
          icon: Award,
          items: [
            {
              requirement: 'Certified Internal Auditor (CIA)',
              status: 'completed',
              description: 'IIA global certification for internal audit professionals',
              legalRef: 'Professional Standard',
              frequency: 'CPE - 40 hours/year',
              lastCompleted: '2024-08-15 - 36/40 CPE credits',
              documents: ['CIA Certificate', 'CPE Transcript']
            },
            {
              requirement: 'Certified Anti-Money Laundering Specialist (CAMS)',
              status: 'completed',
              description: 'ACAMS certification for AML audit expertise',
              legalRef: 'Professional Standard',
              frequency: 'CPE - 40 credits/3 years',
              lastCompleted: '2024-03-20 - Current',
              documents: ['CAMS Certificate']
            },
            {
              requirement: 'Certified Information Systems Auditor (CISA)',
              status: 'completed',
              description: 'ISACA certification for IT audit and controls',
              legalRef: 'Technical Competency',
              frequency: 'CPE - 20 hours/year',
              lastCompleted: '2023-11-10 - 18/20 CPE credits',
              documents: ['CISA Certificate']
            },
            {
              requirement: 'Australian AML/CTF Law Training',
              status: 'completed',
              description: 'Specialized training in Australian regulatory framework',
              legalRef: 'Regional Requirement',
              frequency: 'Annual',
              lastCompleted: '2026-01-15',
              documents: ['AU Compliance Training Certificate']
            }
          ]
        },
        {
          title: 'Audit Quality & Standards',
          icon: Stamp,
          items: [
            {
              requirement: 'Institute of Internal Auditors (IIA) Standards',
              status: 'completed',
              description: 'Comply with International Standards for Professional Practice',
              legalRef: 'IIA Standards (IPPF)',
              frequency: 'Ongoing',
              lastCompleted: 'Continuous Compliance',
              documents: ['Quality Assurance Review - Conforms']
            },
            {
              requirement: 'Audit Quality Assurance Review',
              status: 'completed',
              description: 'External QA review of audit function every 5 years',
              legalRef: 'IIA Standards - 1300',
              frequency: 'Every 5 years',
              lastCompleted: '2023-06-30 - Next due 2028',
              documents: ['External QA Report - Generally Conforms']
            },
            {
              requirement: 'Audit Workpaper Standards',
              status: 'completed',
              description: 'Maintain professional audit documentation standards',
              legalRef: 'IIA Standards - 2330',
              frequency: 'Per Audit',
              lastCompleted: 'Ongoing',
              documents: ['Workpaper Guidelines', 'Document Templates']
            },
            {
              requirement: 'Audit Report Quality Control',
              status: 'completed',
              description: 'Supervisor review and approval of all audit reports',
              legalRef: 'Internal QC Process',
              frequency: 'Per Report',
              lastCompleted: '2026-03-05',
              documents: ['QC Checklist', 'Review Sign-Off Log']
            }
          ]
        },
        {
          title: 'Findings & Remediation Tracking',
          icon: Target,
          items: [
            {
              requirement: 'Audit Finding Documentation',
              status: 'in-progress',
              description: 'Document findings with root cause and risk rating',
              legalRef: 'Audit Methodology',
              frequency: 'Per Finding',
              lastCompleted: '2026-03-15',
              documents: ['Finding Template', '18 open findings']
            },
            {
              requirement: 'Management Action Plan Tracking',
              status: 'in-progress',
              description: 'Track management commitments to remediate audit findings',
              legalRef: 'Audit Follow-Up',
              frequency: 'Ongoing',
              lastCompleted: '2026-03-20',
              documents: ['Action Plan Tracker', '5 overdue actions']
            },
            {
              requirement: 'Follow-Up Audit Procedures',
              status: 'in-progress',
              description: 'Validate implementation of management action plans',
              legalRef: 'IIA Standards - 2500',
              frequency: 'Quarterly',
              lastCompleted: '2026-03-10',
              documents: ['Q1 Follow-Up Report', '12 items validated']
            },
            {
              requirement: 'Critical Finding Escalation',
              status: 'completed',
              description: 'Immediately escalate critical findings to Board',
              legalRef: 'Escalation Protocol',
              frequency: 'As Required',
              lastCompleted: 'N/A - No critical findings',
              documents: ['Escalation Procedures']
            }
          ]
        },
        {
          title: 'Reporting & Communication',
          icon: FileText,
          items: [
            {
              requirement: 'Annual Audit Report to Board',
              status: 'completed',
              description: 'Comprehensive annual report on audit activities and findings',
              legalRef: 'Board Reporting',
              frequency: 'Annual',
              lastCompleted: '2026-03-01',
              documents: ['2025 Annual Audit Report']
            },
            {
              requirement: 'Quarterly Audit Status Updates',
              status: 'completed',
              description: 'Update Audit Committee on audit plan progress',
              legalRef: 'Committee Charter',
              frequency: 'Quarterly',
              lastCompleted: '2026-03-05',
              documents: ['Q1 2026 Status Report']
            },
            {
              requirement: 'AUSTRAC Audit Results Notification',
              status: 'completed',
              description: 'Notify AUSTRAC of material audit findings if required',
              legalRef: 'AML/CTF Act - Section 49',
              frequency: 'As Required',
              lastCompleted: 'N/A - No material issues',
              documents: ['AUSTRAC Communication Protocol']
            },
            {
              requirement: 'External Auditor Coordination',
              status: 'completed',
              description: 'Coordinate with external financial auditors',
              legalRef: 'Audit Coordination',
              frequency: 'Annual',
              lastCompleted: '2025-11-15',
              documents: ['External Auditor Meeting Notes']
            }
          ]
        },
        {
          title: 'System & Technology Audit',
          icon: Lock,
          items: [
            {
              requirement: 'IT General Controls (ITGC) Testing',
              status: 'completed',
              description: 'Test access controls, change management, and system security',
              legalRef: 'IT Audit Scope',
              frequency: 'Annual',
              lastCompleted: '2026-01-20',
              documents: ['ITGC Audit Report', 'Control Testing Results']
            },
            {
              requirement: 'Data Integrity & Quality Audit',
              status: 'completed',
              description: 'Validate accuracy and completeness of compliance data',
              legalRef: 'Data Audit Scope',
              frequency: 'Annual',
              lastCompleted: '2026-02-25',
              documents: ['Data Quality Assessment', 'Reconciliation Testing']
            },
            {
              requirement: 'System Configuration Review',
              status: 'in-progress',
              description: 'Review TM system rules, thresholds, and scenarios',
              legalRef: 'System Audit',
              frequency: 'Annual',
              lastCompleted: '2026-03-05',
              documents: ['System Config Audit - In Progress']
            },
            {
              requirement: 'Cybersecurity Controls Assessment',
              status: 'completed',
              description: 'Assess cybersecurity controls protecting customer data',
              legalRef: 'IT Security Audit',
              frequency: 'Annual',
              lastCompleted: '2025-12-10',
              documents: ['Cybersecurity Audit Report']
            }
          ]
        }
      ]
    }
  };

  const data = professionData[profession];
  const Icon = data.icon;

  // Calculate statistics
  const totalRequirements = data.sections.reduce((acc, section) => acc + section.items.length, 0);
  const completedRequirements = data.sections.reduce(
    (acc, section) => acc + section.items.filter(item => item.status === 'completed').length,
    0
  );
  const inProgressRequirements = data.sections.reduce(
    (acc, section) => acc + section.items.filter(item => item.status === 'in-progress').length,
    0
  );
  const pendingRequirements = data.sections.reduce(
    (acc, section) => acc + section.items.filter(item => item.status === 'pending').length,
    0
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'pending':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300">In Progress</Badge>;
      case 'pending':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className={`bg-gradient-to-r ${data.color} text-white px-8 py-8`}>
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-white hover:bg-white/20 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center gap-6 mb-6">
          <div className="text-6xl">{data.avatar}</div>
          <div>
            <h1 className="text-4xl font-bold mb-2">{data.title}</h1>
            <p className="text-white/90 text-xl">{data.subtitle}</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold mb-1">{totalRequirements}</div>
            <div className="text-sm text-white/90">Total Requirements</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold mb-1">{completedRequirements}</div>
            <div className="text-sm text-white/90">Completed</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold mb-1">{inProgressRequirements}</div>
            <div className="text-sm text-white/90">In Progress</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold mb-1">{data.completionRate}%</div>
            <div className="text-sm text-white/90">Completion Rate</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/90">Overall Compliance Progress</span>
            <span className="text-sm font-semibold">{data.completionRate}%</span>
          </div>
          <Progress value={data.completionRate} className="h-3 bg-white/20" />
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8 space-y-8">
        {data.sections.map((section, sectionIndex) => {
          const SectionIcon = section.icon;
          return (
            <Card key={sectionIndex} className="border-2 shadow-sm">
              <CardHeader className="bg-gray-50 border-b-2">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-12 h-12 bg-[#13B5EA]/10 rounded-xl flex items-center justify-center">
                    <SectionIcon className="w-6 h-6 text-[#13B5EA]" />
                  </div>
                  {section.title}
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  {section.items.filter(i => i.status === 'completed').length} of {section.items.length} requirements completed
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <Card key={itemIndex} className="border-l-4 border-l-[#13B5EA] shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="mt-1">{getStatusIcon(item.status)}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-bold text-lg text-gray-900">{item.requirement}</h4>
                                {getStatusBadge(item.status)}
                              </div>
                              <p className="text-sm text-gray-700 mb-3">{item.description}</p>
                              
                              <div className="grid grid-cols-2 gap-4 mb-3">
                                <div className="flex items-center gap-2 text-sm">
                                  <Scale className="w-4 h-4 text-[#13B5EA]" />
                                  <span className="font-medium text-gray-600">Legal Reference:</span>
                                  <span className="text-gray-900 font-semibold">{item.legalRef}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="w-4 h-4 text-[#13B5EA]" />
                                  <span className="font-medium text-gray-600">Frequency:</span>
                                  <span className="text-gray-900">{item.frequency}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-sm mb-3">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="font-medium text-gray-600">Last Completed:</span>
                                <span className="text-gray-900">{item.lastCompleted}</span>
                              </div>

                              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <div className="flex items-start gap-2 mb-2">
                                  <FileText className="w-4 h-4 text-[#13B5EA] mt-0.5" />
                                  <span className="text-sm font-semibold text-gray-700">Required Documents:</span>
                                </div>
                                <ul className="ml-6 space-y-1">
                                  {item.documents.map((doc, docIndex) => (
                                    <li key={docIndex} className="text-sm text-gray-600 flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-[#13B5EA] rounded-full"></div>
                                      {doc}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Summary Card */}
        <Card className="border-2 border-[#13B5EA] bg-gradient-to-br from-[#13B5EA]/5 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Icon className="w-8 h-8 text-[#13B5EA]" />
              Compliance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 border-2 border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Completed</span>
                </div>
                <div className="text-4xl font-bold text-green-600">{completedRequirements}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {((completedRequirements / totalRequirements) * 100).toFixed(1)}% of total
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border-2 border-amber-200">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-6 h-6 text-amber-600" />
                  <span className="text-sm font-medium text-gray-600">In Progress</span>
                </div>
                <div className="text-4xl font-bold text-amber-600">{inProgressRequirements}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {((inProgressRequirements / totalRequirements) * 100).toFixed(1)}% of total
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border-2 border-red-200">
                <div className="flex items-center gap-3 mb-2">
                  <XCircle className="w-6 h-6 text-red-600" />
                  <span className="text-sm font-medium text-gray-600">Pending</span>
                </div>
                <div className="text-4xl font-bold text-red-600">{pendingRequirements}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {((pendingRequirements / totalRequirements) * 100).toFixed(1)}% of total
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#13B5EA]/10 border-2 border-[#13B5EA]/30 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#13B5EA] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Regulatory Compliance Status</p>
                  <p className="text-sm text-gray-700">
                    You are maintaining a {data.completionRate}% compliance rate across all {data.title.toLowerCase()} requirements. 
                    {inProgressRequirements > 0 && ` ${inProgressRequirements} requirements are currently in progress.`}
                    {pendingRequirements > 0 && ` ${pendingRequirements} requirements need immediate attention.`}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
