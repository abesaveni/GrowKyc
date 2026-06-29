import React, { useState, useEffect } from 'react';
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
  Gavel,
  Plus,
  Trash2,
  RotateCcw,
  Upload,
  X,
  Check
} from 'lucide-react';

// Map icon strings to Lucide components for serializability
const ICON_COMPONENTS: Record<string, React.ComponentType<any>> = {
  Scale,
  Award,
  ClipboardCheck,
  FileText,
  Eye,
  Gavel,
  Target,
  FileCheck,
  GraduationCap,
  BookOpen,
  Users,
  TrendingUp,
  Shield,
  Stamp,
  Lock,
  Activity,
  Briefcase
};

interface RequirementItem {
  id: string;
  requirement: string;
  status: 'completed' | 'in-progress' | 'pending';
  description: string;
  legalRef: string;
  frequency: string;
  lastCompleted: string;
  documents: string[];
}

interface Section {
  title: string;
  iconName: string;
  items: RequirementItem[];
}

interface ProfessionData {
  title: string;
  subtitle: string;
  color: string;
  iconName: string;
  avatar: string;
  sections: Section[];
}

interface ProfessionRequirementsProps {
  profession: 'compliance_officer' | 'partner' | 'analyst' | 'auditor';
  onBack: () => void;
}

const DEFAULT_PROFESSION_DATA: Record<string, ProfessionData> = {
  compliance_officer: {
    title: 'Compliance Officer',
    subtitle: 'AML/CTF Compliance Requirements',
    color: 'from-slate-800 to-slate-700',
    iconName: 'Shield',
    avatar: '👩‍💼',
    sections: [
      {
        title: 'Legal & Regulatory Requirements',
        iconName: 'Scale',
        items: [
          {
            id: 'co-lr-1',
            requirement: 'AUSTRAC Registration & Reporting',
            status: 'completed',
            description: 'Maintain current AUSTRAC registration for the reporting entity',
            legalRef: 'AML/CTF Act 2006 - Section 75',
            frequency: 'Ongoing',
            lastCompleted: '2026-03-15',
            documents: ['AUSTRAC Registration Certificate', 'Annual Compliance Report']
          },
          {
            id: 'co-lr-2',
            requirement: 'AML/CTF Program Implementation',
            status: 'completed',
            description: 'Develop, maintain and comply with Part A and Part B of AML/CTF Program',
            legalRef: 'AML/CTF Act 2006 - Section 84',
            frequency: 'Annual Review',
            lastCompleted: '2026-02-01',
            documents: ['AML/CTF Program Part A', 'AML/CTF Program Part B', 'Board Approval']
          },
          {
            id: 'co-lr-3',
            requirement: 'Customer Due Diligence (CDD)',
            status: 'in-progress',
            description: 'Collect and verify customer identification and beneficial ownership',
            legalRef: 'AML/CTF Act 2006 - Sections 30-37',
            frequency: 'Per Transaction',
            lastCompleted: '2026-03-19',
            documents: ['CDD Procedures Manual', 'ID Verification Records']
          },
          {
            id: 'co-lr-4',
            requirement: 'Enhanced Due Diligence (EDD)',
            status: 'completed',
            description: 'Apply enhanced measures for high-risk customers and PEPs',
            legalRef: 'AML/CTF Rules - Chapter 4',
            frequency: 'Risk-Based',
            lastCompleted: '2026-03-18',
            documents: ['EDD Framework', 'PEP Screening Reports']
          },
          {
            id: 'co-lr-5',
            requirement: 'Suspicious Matter Reporting (SMR)',
            status: 'in-progress',
            description: 'Submit SMRs to AUSTRAC within 3 business days of forming suspicion',
            legalRef: 'AML/CTF Act 2006 - Section 41',
            frequency: 'As Required',
            lastCompleted: '2026-03-10',
            documents: ['SMR Procedures', 'SMR Log Register']
          },
          {
            id: 'co-lr-6',
            requirement: 'Threshold Transaction Reports (TTR)',
            status: 'completed',
            description: 'Report physical currency transactions of $10,000 or more within 10 days',
            legalRef: 'AML/CTF Act 2006 - Section 43',
            frequency: 'As Required',
            lastCompleted: '2026-03-19',
            documents: ['TTR Submission Records']
          },
          {
            id: 'co-lr-7',
            requirement: 'International Funds Transfer Instructions (IFTI)',
            status: 'completed',
            description: 'Report all international fund transfers within 10 business days',
            legalRef: 'AML/CTF Act 2006 - Section 45',
            frequency: 'As Required',
            lastCompleted: '2026-03-19',
            documents: ['IFTI Reporting Logs']
          },
          {
            id: 'co-lr-8',
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
        iconName: 'Award',
        items: [
          {
            id: 'co-pq-1',
            requirement: 'ACAMS Certification (CAMS)',
            status: 'completed',
            description: 'Certified Anti-Money Laundering Specialist credential',
            legalRef: 'Industry Best Practice',
            frequency: 'Renewal every 3 years',
            lastCompleted: '2025-06-15',
            documents: ['CAMS Certificate', 'CPE Credits Log']
          },
          {
            id: 'co-pq-2',
            requirement: 'Continuing Professional Education (CPE)',
            status: 'in-progress',
            description: 'Complete 40 CPE credits over 3-year cycle',
            legalRef: 'ACAMS Requirement',
            frequency: 'Ongoing - 40 credits/3 years',
            lastCompleted: '2026-03-01',
            documents: ['CPE Transcript - 28/40 credits completed']
          },
          {
            id: 'co-pq-3',
            requirement: 'Australian Financial Crimes Law Training',
            status: 'completed',
            description: 'Comprehensive understanding of AU AML/CTF legislation',
            legalRef: 'Internal Requirement',
            frequency: 'Annual Refresh',
            lastCompleted: '2026-02-10',
            documents: ['Training Certificate', 'Assessment Results']
          },
          {
            id: 'co-pq-4',
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
        iconName: 'ClipboardCheck',
        items: [
          {
            id: 'co-oo-1',
            requirement: 'Transaction Monitoring System Oversight',
            status: 'in-progress',
            description: 'Daily review of automated alerts and suspicious activity',
            legalRef: 'AML/CTF Program Part A',
            frequency: 'Daily',
            lastCompleted: '2026-03-20',
            documents: ['Alert Review Logs', 'Escalation Reports']
          },
          {
            id: 'co-oo-2',
            requirement: 'Sanctions Screening - Real-Time',
            status: 'in-progress',
            description: 'Screen all customers and transactions against sanctions lists',
            legalRef: 'Autonomous Sanctions Act 2011',
            frequency: 'Real-Time + Daily Batch',
            lastCompleted: '2026-03-20',
            documents: ['Screening Results', 'Match Resolution Records']
          },
          {
            id: 'co-oo-3',
            requirement: 'Risk Assessment Reviews',
            status: 'completed',
            description: 'Annual ML/TF risk assessment of business operations',
            legalRef: 'AML/CTF Rules - Rule 8.6',
            frequency: 'Annual',
            lastCompleted: '2026-02-01',
            documents: ['Annual Risk Assessment Report', 'Board Presentation']
          },
          {
            id: 'co-oo-4',
            requirement: 'Customer Periodic Reviews',
            status: 'in-progress',
            description: 'Conduct ongoing customer due diligence based on risk rating',
            legalRef: 'AML/CTF Rules - Chapter 15',
            frequency: 'Risk-Based (Low: 3yr, Med: 2yr, High: 1yr)',
            lastCompleted: '2026-03-19',
            documents: ['Review Schedule', 'Completed Review Records']
          },
          {
            id: 'co-oo-5',
            requirement: 'Record Keeping - 7 Year Retention',
            status: 'completed',
            description: 'Maintain all AML/CTF records for minimum 7 years',
            legalRef: 'AML/CTF Act 2006 - Section 107',
            frequency: 'Ongoing',
            lastCompleted: 'Current',
            documents: ['Document Retention Policy', 'Archive Audit Log']
          },
          {
            id: 'co-oo-6',
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
        iconName: 'FileText',
        items: [
          {
            id: 'co-rd-1',
            requirement: 'Annual Compliance Report to AUSTRAC',
            status: 'completed',
            description: 'Submit annual compliance report by March 31st',
            legalRef: 'AML/CTF Act 2006 - Section 47',
            frequency: 'Annual - Due March 31',
            lastCompleted: '2026-03-15',
            documents: ['2025 Annual Compliance Report Submitted']
          },
          {
            id: 'co-rd-2',
            requirement: 'Quarterly Board Compliance Report',
            status: 'completed',
            description: 'Report compliance status and metrics to Board of Directors',
            legalRef: 'Internal Governance Requirement',
            frequency: 'Quarterly',
            lastCompleted: '2026-03-01',
            documents: ['Q1 2026 Board Report', 'Board Minutes']
          },
          {
            id: 'co-rd-3',
            requirement: 'Monthly Regulatory Reporting Package',
            status: 'completed',
            description: 'Consolidate all regulatory reports and metrics',
            legalRef: 'Internal Requirement',
            frequency: 'Monthly',
            lastCompleted: '2026-03-05',
            documents: ['February 2026 Regulatory Package']
          },
          {
            id: 'co-rd-4',
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
        iconName: 'Eye',
        items: [
          {
            id: 'co-aq-1',
            requirement: 'Independent AML Audit',
            status: 'completed',
            description: 'Commission external audit of AML/CTF program effectiveness',
            legalRef: 'AML/CTF Program Part A - Section 11',
            frequency: 'Biennial (Every 2 years)',
            lastCompleted: '2025-09-01',
            documents: ['2025 External Audit Report', 'Management Response', 'Remediation Plan']
          },
          {
            id: 'co-aq-2',
            requirement: 'Internal Compliance Testing',
            status: 'in-progress',
            description: 'Conduct sample testing of CDD, monitoring, and reporting',
            legalRef: 'Internal Audit Plan',
            frequency: 'Quarterly',
            lastCompleted: '2026-03-10',
            documents: ['Q1 2026 Testing Results - In Progress']
          },
          {
            id: 'co-aq-3',
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
    color: 'from-slate-800 to-slate-700',
    iconName: 'Briefcase',
    avatar: '👨‍💼',
    sections: [
      {
        title: 'Board & Governance Responsibilities',
        iconName: 'Gavel',
        items: [
          {
            id: 'pa-bg-1',
            requirement: 'AML/CTF Program Board Approval',
            status: 'completed',
            description: 'Review and formally approve AML/CTF Program annually',
            legalRef: 'AML/CTF Act 2006 - Section 84',
            frequency: 'Annual',
            lastCompleted: '2026-02-01',
            documents: ['Board Resolution', 'Approved AML/CTF Program', 'Board Minutes']
          },
          {
            id: 'pa-bg-2',
            requirement: 'Appointment of Compliance Officer',
            status: 'completed',
            description: 'Designate and empower AML/CTF Compliance Officer',
            legalRef: 'AML/CTF Program Part A - Section 4',
            frequency: 'As Required',
            lastCompleted: '2025-01-15',
            documents: ['Compliance Officer Appointment Letter', 'Authority Delegation']
          },
          {
            id: 'pa-bg-3',
            requirement: 'Risk Appetite Statement Approval',
            status: 'completed',
            description: 'Define and approve enterprise ML/TF risk tolerance levels',
            legalRef: 'Corporate Governance Best Practice',
            frequency: 'Annual Review',
            lastCompleted: '2026-01-20',
            documents: ['2026 Risk Appetite Statement', 'Board Approval']
          },
          {
            id: 'pa-bg-4',
            requirement: 'Compliance Budget Authorization',
            status: 'completed',
            description: 'Allocate sufficient resources for compliance program',
            legalRef: 'AML/CTF Program Part A',
            frequency: 'Annual',
            lastCompleted: '2025-12-10',
            documents: ['2026 Compliance Budget', 'Resource Allocation Plan']
          },
          {
            id: 'pa-bg-5',
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
        iconName: 'Scale',
        items: [
          {
            id: 'pa-lo-1',
            requirement: 'AUSTRAC Engagement & Liaison',
            status: 'completed',
            description: 'Maintain relationship with AUSTRAC as senior executive',
            legalRef: 'Regulatory Expectation',
            frequency: 'Biannual Meetings',
            lastCompleted: '2025-11-20',
            documents: ['AUSTRAC Meeting Notes', 'Correspondence Log']
          },
          {
            id: 'pa-lo-2',
            requirement: 'Regulatory Change Management',
            status: 'in-progress',
            description: 'Oversee implementation of new regulatory requirements',
            legalRef: 'Business Management',
            frequency: 'Ongoing',
            lastCompleted: '2026-03-01',
            documents: ['Regulatory Horizon Scanning Report', 'Implementation Plans']
          },
          {
            id: 'pa-lo-3',
            requirement: 'High-Risk Client Approval Authority',
            status: 'in-progress',
            description: 'Review and approve onboarding of high-risk customers',
            legalRef: 'AML/CTF Program Part A - Escalation',
            frequency: 'As Required',
            lastCompleted: '2026-03-18',
            documents: ['High Risk Approval Log - 3 pending']
          },
          {
            id: 'pa-lo-4',
            requirement: 'Enhanced Due Diligence Oversight',
            status: 'in-progress',
            description: 'Approve EDD reports for PEPs and high-risk relationships',
            legalRef: 'AML/CTF Rules - Chapter 4',
            frequency: 'As Required',
            lastCompleted: '2026-03-17',
            documents: ['EDD Approval Register']
          },
          {
            id: 'pa-lo-5',
            requirement: 'Whistleblower Protection Program',
            status: 'completed',
            description: 'Implement and oversee whistleblower protection framework',
            legalRef: 'Corporations Act 2001 - Part 9.4AAA',
            frequency: 'Annual Review',
            lastCompleted: '2026-02-15',
            documents: ['Whistleblower Policy', 'Protected Disclosure Procedures']
          }
        ]
      }
    ]
  },
  analyst: {
    title: 'AML Analyst',
    subtitle: 'Transaction Monitoring & Investigation Requirements',
    color: 'from-slate-800 to-slate-700',
    iconName: 'Activity',
    avatar: '👩‍💻',
    sections: [
      {
        title: 'Core Investigation Responsibilities',
        iconName: 'Eye',
        items: [
          {
            id: 'an-ci-1',
            requirement: 'Transaction Alert Review & Investigation',
            status: 'in-progress',
            description: 'Review and investigate automated transaction monitoring alerts',
            legalRef: 'AML/CTF Program Part A - Section 8',
            frequency: 'Daily',
            lastCompleted: '2026-03-20',
            documents: ['Alert Queue - 23 pending', 'Investigation Guidelines']
          },
          {
            id: 'an-ci-2',
            requirement: 'Customer Activity Pattern Analysis',
            status: 'in-progress',
            description: 'Analyze customer transaction patterns for suspicious behavior',
            legalRef: 'AML/CTF Rules - Chapter 25',
            frequency: 'Ongoing per alert',
            lastCompleted: '2026-03-20',
            documents: ['Transaction Analysis Templates']
          },
          {
            id: 'an-ci-3',
            requirement: 'Suspicious Matter Report (SMR) Preparation',
            status: 'in-progress',
            description: 'Document findings and prepare SMRs for compliance officer review',
            legalRef: 'AML/CTF Act 2006 - Section 41',
            frequency: 'As Required',
            lastCompleted: '2026-03-18',
            documents: ['SMR Draft Template', 'Supporting Evidence Files']
          }
        ]
      }
    ]
  },
  auditor: {
    title: 'Compliance Auditor',
    subtitle: 'Audit & Quality Assurance Requirements',
    color: 'from-slate-800 to-slate-700',
    iconName: 'ClipboardCheck',
    avatar: '🧑‍💼',
    sections: [
      {
        title: 'Independent Audit Requirements',
        iconName: 'Shield',
        items: [
          {
            id: 'au-ia-1',
            requirement: 'Biennial AML/CTF Program Audit',
            status: 'completed',
            description: 'Conduct comprehensive independent audit every 2 years',
            legalRef: 'AML/CTF Program Part A - Section 11',
            frequency: 'Biennial (Every 2 years)',
            lastCompleted: '2025-09-01',
            documents: ['2025 Audit Report', 'Audit Plan', 'Workpapers']
          },
          {
            id: 'au-ia-2',
            requirement: 'Audit Independence & Objectivity',
            status: 'completed',
            description: 'Maintain independence from operational compliance functions',
            legalRef: 'IIA Standards - 1110',
            frequency: 'Ongoing',
            lastCompleted: 'Continuous',
            documents: ['Independence Declaration', 'Conflict of Interest Disclosure']
          }
        ]
      }
    ]
  }
};

export function ProfessionRequirements({ profession, onBack }: ProfessionRequirementsProps) {
  const [data, setData] = useState<ProfessionData | null>(null);
  
  // Track adding requirement state
  const [showAddForm, setShowAddForm] = useState<number | null>(null); // section index
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLegal, setNewLegal] = useState('');
  const [newFreq, setNewFreq] = useState('Ongoing');
  const [newStatus, setNewStatus] = useState<'completed' | 'in-progress' | 'pending'>('pending');

  // Track adding document input state
  const [docInputReqId, setDocInputReqId] = useState<string | null>(null);
  const [docText, setDocText] = useState('');

  // Load state on mount/profession change
  useEffect(() => {
    const saved = localStorage.getItem(`growkyc_requirements_${profession}`);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading profession requirements from localStorage, resetting to defaults.', e);
        const defaultData = DEFAULT_PROFESSION_DATA[profession] || DEFAULT_PROFESSION_DATA.compliance_officer;
        setData(JSON.parse(JSON.stringify(defaultData)));
      }
    } else {
      const defaultData = DEFAULT_PROFESSION_DATA[profession] || DEFAULT_PROFESSION_DATA.compliance_officer;
      setData(JSON.parse(JSON.stringify(defaultData)));
    }
  }, [profession]);

  // Save data state helper
  const saveState = (updatedData: ProfessionData) => {
    setData(updatedData);
    localStorage.setItem(`growkyc_requirements_${profession}`, JSON.stringify(updatedData));
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all compliance requirements to their default states?')) {
      const defaultData = DEFAULT_PROFESSION_DATA[profession] || DEFAULT_PROFESSION_DATA.compliance_officer;
      const cloned = JSON.parse(JSON.stringify(defaultData));
      saveState(cloned);
    }
  };

  if (!data) return <div className="p-8 text-center text-gray-500">Loading requirements...</div>;

  const Icon = ICON_COMPONENTS[data.iconName] || Shield;

  // Calculate statistics dynamically
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

  const completionRate = totalRequirements > 0 ? Math.round((completedRequirements / totalRequirements) * 100) : 0;

  // Cycle status: completed -> in-progress -> pending -> completed
  const handleToggleStatus = (itemId: string) => {
    const updatedSections = data.sections.map(section => {
      const updatedItems = section.items.map(item => {
        if (item.id === itemId) {
          let newStatus: 'completed' | 'in-progress' | 'pending' = 'completed';
          if (item.status === 'completed') newStatus = 'in-progress';
          else if (item.status === 'in-progress') newStatus = 'pending';
          
          return {
            ...item,
            status: newStatus,
            lastCompleted: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : item.lastCompleted
          };
        }
        return item;
      });
      return { ...section, items: updatedItems };
    });

    saveState({ ...data, sections: updatedSections });
  };

  const handleDeleteRequirement = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this requirement?')) {
      const updatedSections = data.sections.map(section => {
        return {
          ...section,
          items: section.items.filter(item => item.id !== itemId)
        };
      });
      saveState({ ...data, sections: updatedSections });
    }
  };

  const handleAddRequirement = (sectionIndex: number) => {
    if (!newTitle.trim()) {
      alert('Requirement title is required');
      return;
    }

    const newItem: RequirementItem = {
      id: `${profession}-custom-${Date.now()}`,
      requirement: newTitle.trim(),
      description: newDesc.trim() || 'No description provided.',
      legalRef: newLegal.trim() || 'Internal standard',
      frequency: newFreq.trim() || 'Ongoing',
      status: newStatus,
      lastCompleted: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : 'N/A',
      documents: []
    };

    const updatedSections = data.sections.map((section, idx) => {
      if (idx === sectionIndex) {
        return {
          ...section,
          items: [...section.items, newItem]
        };
      }
      return section;
    });

    saveState({ ...data, sections: updatedSections });
    
    // Reset form states
    setShowAddForm(null);
    setNewTitle('');
    setNewDesc('');
    setNewLegal('');
    setNewFreq('Ongoing');
    setNewStatus('pending');
  };

  // Document management
  const handleAddDocument = (itemId: string) => {
    if (!docText.trim()) return;

    const updatedSections = data.sections.map(section => {
      const updatedItems = section.items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            documents: [...item.documents, docText.trim()]
          };
        }
        return item;
      });
      return { ...section, items: updatedItems };
    });

    saveState({ ...data, sections: updatedSections });
    setDocInputReqId(null);
    setDocText('');
  };

  const handleDeleteDocument = (itemId: string, docIndex: number) => {
    const updatedSections = data.sections.map(section => {
      const updatedItems = section.items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            documents: item.documents.filter((_, idx) => idx !== docIndex)
          };
        }
        return item;
      });
      return { ...section, items: updatedItems };
    });

    saveState({ ...data, sections: updatedSections });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600 cursor-pointer" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-amber-600 cursor-pointer" />;
      case 'pending':
        return <XCircle className="w-5 h-5 text-red-600 cursor-pointer" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400 cursor-pointer" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-300 select-none cursor-pointer">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300 select-none cursor-pointer">In Progress</Badge>;
      case 'pending':
        return <Badge className="bg-red-100 text-red-800 border-red-300 select-none cursor-pointer">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-white pb-12">
      {/* Header */}
      <div className={`bg-gradient-to-r ${data.color} text-white px-8 py-8 shadow-md`}>
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white hover:bg-white/20 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <Button
            variant="outline"
            onClick={handleReset}
            className="text-white border-white/40 bg-white/10 hover:bg-white/20 text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset to Defaults
          </Button>
        </div>

        <div className="flex items-center gap-6 mb-6">
          <div className="text-6xl select-none">{data.avatar}</div>
          <div>
            <h1 className="text-4xl font-bold mb-2">{data.title}</h1>
            <p className="text-white/90 text-xl font-medium">{data.subtitle}</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
            <div className="text-3xl font-bold mb-1">{totalRequirements}</div>
            <div className="text-sm text-white/90">Total Requirements</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
            <div className="text-3xl font-bold mb-1">{completedRequirements}</div>
            <div className="text-sm text-white/90">Completed</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
            <div className="text-3xl font-bold mb-1">{inProgressRequirements}</div>
            <div className="text-sm text-white/90">In Progress</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
            <div className="text-3xl font-bold mb-1">{completionRate}%</div>
            <div className="text-sm text-white/90">Completion Rate</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 max-w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/90">Overall Compliance Checklist Progress</span>
            <span className="text-sm font-semibold">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-3 bg-white/20 rounded-full" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-8 py-8 space-y-8 max-w-6xl mx-auto">
        {data.sections.map((section, sectionIndex) => {
          const SectionIcon = ICON_COMPONENTS[section.iconName] || Shield;
          return (
            <Card key={sectionIndex} className="border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gray-50/70 border-b border-gray-100 py-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="flex items-center gap-3.5 text-2xl font-black text-gray-900">
                    <div className="w-12 h-12 bg-[#13B5EA]/10 rounded-xl flex items-center justify-center">
                      <SectionIcon className="w-6 h-6 text-[#13B5EA]" />
                    </div>
                    {section.title}
                  </CardTitle>
                  <Button 
                    size="sm" 
                    className="bg-[#13B5EA] hover:bg-[#0E7C9E] text-white"
                    onClick={() => setShowAddForm(showAddForm === sectionIndex ? null : sectionIndex)}
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Add Requirement
                  </Button>
                </div>
                <CardDescription className="text-sm text-gray-600 mt-2 font-medium">
                  {section.items.filter(i => i.status === 'completed').length} of {section.items.length} requirements completed
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-4 md:p-6 space-y-4">
                {/* Form to add a new requirement */}
                {showAddForm === sectionIndex && (
                  <Card className="border-2 border-dashed border-[#13B5EA] bg-cyan-50/20 p-5 rounded-xl space-y-4 mb-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                        <Plus className="w-4 h-4 text-[#13B5EA]" /> Add New Requirement
                      </h4>
                      <Button variant="ghost" size="sm" className="p-1 h-auto text-gray-500 hover:text-gray-900" onClick={() => setShowAddForm(null)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Requirement Title *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Annual Compliance Audit Review" 
                          value={newTitle} 
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B5EA]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Legal / Program Reference</label>
                        <input 
                          type="text" 
                          placeholder="e.g. AML/CTF Rules Rule 8.6" 
                          value={newLegal} 
                          onChange={(e) => setNewLegal(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B5EA]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Frequency</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Annual, Ongoing" 
                          value={newFreq} 
                          onChange={(e) => setNewFreq(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B5EA]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Status</label>
                        <select 
                          value={newStatus} 
                          onChange={(e) => setNewStatus(e.target.value as any)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B5EA] bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-bold text-gray-700 uppercase">Description</label>
                        <textarea 
                          placeholder="Provide details about what this obligation requires and how to fulfill it..." 
                          value={newDesc} 
                          onChange={(e) => setNewDesc(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B5EA]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                      <Button variant="outline" size="sm" onClick={() => setShowAddForm(null)}>Cancel</Button>
                      <Button size="sm" className="bg-[#13B5EA] hover:bg-[#0E7C9E] text-white" onClick={() => handleAddRequirement(sectionIndex)}>
                        Add Obligation
                      </Button>
                    </div>
                  </Card>
                )}

                {section.items.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 border border-dashed rounded-xl bg-gray-50/50">
                    No requirements defined in this section.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {section.items.map((item, itemIndex) => (
                      <Card key={item.id} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
                        <div className="border-l-4 border-l-[#13B5EA] p-4 sm:p-5 flex flex-col md:flex-row items-start justify-between gap-4">
                          <div className="flex-1 space-y-2.5">
                            <div className="flex flex-wrap items-center gap-3">
                              {/* Clicking icon toggles status */}
                              <div 
                                onClick={() => handleToggleStatus(item.id)} 
                                title="Click to toggle status"
                                className="hover:scale-115 transition-transform duration-150"
                              >
                                {getStatusIcon(item.status)}
                              </div>
                              
                              <h4 className="font-bold text-lg text-gray-900">{item.requirement}</h4>
                              
                              <div 
                                onClick={() => handleToggleStatus(item.id)}
                                title="Click to toggle status"
                              >
                                {getStatusBadge(item.status)}
                              </div>
                              
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider hidden group-hover:inline animate-pulse">
                                Click status/badge to cycle status
                              </span>
                            </div>

                            <p className="text-sm text-gray-700 leading-relaxed font-medium">{item.description}</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs md:text-sm">
                              <div className="flex items-center gap-2">
                                <Scale className="w-4 h-4 text-[#13B5EA] flex-shrink-0" />
                                <span className="font-semibold text-gray-600">Legal Reference:</span>
                                <span className="text-gray-900 font-bold">{item.legalRef}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#13B5EA] flex-shrink-0" />
                                <span className="font-semibold text-gray-600">Frequency:</span>
                                <span className="text-gray-900 font-medium">{item.frequency}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span className="font-semibold text-gray-600">Last Completed:</span>
                                <span className="text-gray-900 font-medium">{item.lastCompleted || 'N/A'}</span>
                              </div>
                            </div>

                            {/* Documents Vault section */}
                            <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100 space-y-2 mt-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-[#13B5EA] flex-shrink-0" />
                                  <span className="text-xs sm:text-sm font-bold text-gray-800">Obligation Documents ({item.documents.length})</span>
                                </div>
                                
                                {docInputReqId === item.id ? (
                                  <div className="flex items-center gap-1.5 animate-in slide-in-from-right-2 duration-200">
                                    <input 
                                      type="text" 
                                      placeholder="e.g. AuditReport_2026.pdf" 
                                      value={docText}
                                      onChange={(e) => setDocText(e.target.value)}
                                      onKeyDown={(e) => e.key === 'Enter' && handleAddDocument(item.id)}
                                      className="px-2 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#13B5EA] w-48"
                                    />
                                    <Button size="sm" className="h-6 px-2 bg-green-600 hover:bg-green-700 text-white text-[10px]" onClick={() => handleAddDocument(item.id)}>
                                      Add
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-6 p-1 text-gray-500 hover:text-gray-900" onClick={() => setDocInputReqId(null)}>
                                      <X className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    variant="link" 
                                    className="p-0 h-auto text-xs font-bold text-[#13B5EA] hover:text-[#0E7C9E] flex items-center"
                                    onClick={() => setDocInputReqId(item.id)}
                                  >
                                    <Upload className="w-3 h-3 mr-1" /> Add Document
                                  </Button>
                                )}
                              </div>

                              {item.documents.length === 0 ? (
                                <p className="text-xs text-gray-500 italic ml-6">No documentation attached. Click "Add Document" to upload compliance evidence.</p>
                              ) : (
                                <ul className="ml-6 space-y-1.5">
                                  {item.documents.map((doc, docIndex) => (
                                    <li key={docIndex} className="text-xs text-gray-700 flex items-center justify-between group/doc py-0.5 hover:bg-gray-100/50 px-2 rounded">
                                      <span className="flex items-center gap-2 truncate">
                                        <div className="w-1.5 h-1.5 bg-[#13B5EA] rounded-full flex-shrink-0"></div>
                                        <span className="truncate">{doc}</span>
                                      </span>
                                      <button 
                                        onClick={() => handleDeleteDocument(item.id, docIndex)}
                                        className="text-gray-400 hover:text-red-600 opacity-0 group-hover/doc:opacity-100 transition-opacity ml-2"
                                        title="Delete Document"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>

                          <div className="flex md:flex-col items-center justify-end gap-2 w-full md:w-auto mt-2 md:mt-0 flex-shrink-0">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg"
                              onClick={() => handleDeleteRequirement(item.id)}
                              title="Delete requirement"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Summary Card */}
        <Card className="border-2 border-[#13B5EA] bg-gradient-to-br from-[#13B5EA]/5 to-white shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="py-6 border-b border-gray-100">
            <CardTitle className="flex items-center gap-3.5 text-2xl font-black text-gray-900">
              <Icon className="w-7 h-7 text-[#13B5EA]" />
              Compliance Overview & Audit Ready Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-5 border border-green-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-semibold text-gray-600">Completed Obligations</span>
                </div>
                <div className="text-4xl font-black text-green-600">{completedRequirements}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">
                  {totalRequirements > 0 ? ((completedRequirements / totalRequirements) * 100).toFixed(1) : 0}% of total
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-amber-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-6 h-6 text-amber-600" />
                  <span className="text-sm font-semibold text-gray-600">In Progress</span>
                </div>
                <div className="text-4xl font-black text-amber-600">{inProgressRequirements}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">
                  {totalRequirements > 0 ? ((inProgressRequirements / totalRequirements) * 100).toFixed(1) : 0}% of total
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-red-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <XCircle className="w-6 h-6 text-red-600" />
                  <span className="text-sm font-semibold text-gray-600">Pending Actions</span>
                </div>
                <div className="text-4xl font-black text-red-600">{pendingRequirements}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">
                  {totalRequirements > 0 ? ((pendingRequirements / totalRequirements) * 100).toFixed(1) : 0}% of total
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#13B5EA]/10 border border-[#13B5EA]/30 rounded-xl">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#13B5EA] mt-0.5 flex-shrink-0 animate-bounce" />
                <div>
                  <p className="font-bold text-gray-900 mb-1">Dynamic Regulatory Health Monitor</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    You are currently maintaining a <span className="font-bold text-gray-900">{completionRate}%</span> compliance readiness rate across all <span className="font-bold">{data.title}</span> checklists.
                    {inProgressRequirements > 0 && ` There are ${inProgressRequirements} items currently in progress.`}
                    {pendingRequirements > 0 ? ` WARNING: ${pendingRequirements} items are outstanding and require immediate action.` : ' All items are up to date and audit ready.'}
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
