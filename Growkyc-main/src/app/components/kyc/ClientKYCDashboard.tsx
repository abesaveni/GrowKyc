import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from '../../lib/toast';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { RemainingTabs } from './RemainingTabs';
import { AMLHitsDetail } from './AMLHitsDetail';
import { RelatedEntitiesTab } from './RelatedEntitiesTab';
import { IdentityTab } from '../grow-kyc/IdentityTab';
import { ClientsDB } from './ClientsDatabase';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  User,
  Building,
  CreditCard,
  FileText,
  Eye,
  Upload,
  PlayCircle,
  RefreshCw,
  Users,
  DollarSign,
  Scale,
  Activity,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  Plus,
  ChevronRight,
  Globe,
  Target,
  Network,
  ArrowLeft,
  Home,
  Calendar,
  Flag,
  CheckSquare,
  AlertCircle
} from 'lucide-react';

type TabType = 'overview' | 'actions' | 'identity' | 'aml' | 'entity' | 'ownership' | 'financial' | 'fraud' | 'legal' | 'run-checks' | 'compliance' | 'documents' | 'monitoring' | 'decisions' | 'austrac' | 'audit' | 'related-entities';

interface TestClient {
  id: string;
  name: string;
  entityType: 'Individual' | 'Company' | 'Trust' | 'Partnership' | 'Foreign Entity';
  status: 'Active' | 'Inactive' | 'Suspended' | 'Under Review';
  abn?: string;
  acn?: string;
  tfn?: string;
  country: string;
  industry: string;
  serviceType: string;
  clientGroup: string;
  riskScores: {
    overall: number;
    aml: number;
    financial: number;
    business: number;
    ownership: number;
  };
  quickStatus: {
    identity: string;
    aml: string;
    entity: string;
    monitoring: string;
  };
  lastReview: string;
  nextReview: string;
  identityData: {
    primaryID: { type: string; number: string; expiry: string; verified: boolean };
    secondaryID?: { type: string; number: string; expiry: string; verified: boolean };
    additionalDocuments?: Array<{ type: string; number: string; expiry?: string; verified: boolean }>;
    biometricStatus: 'Passed' | 'Failed' | 'Pending' | 'Not Required';
    livenessCheck: boolean;
    addressVerified: boolean;
    greenIDScore?: number;
    infoTrackStatus?: string;
    fraudFlags?: Array<{ id: number; type: string; message: string }>;
  };
  amlData: {
    sanctionsMatches: number;
    pepStatus: 'Not PEP' | 'Domestic PEP' | 'Foreign PEP' | 'International Org PEP';
    adverseMediaHits: number;
    worldCheckStatus: string;
    transactionMonitoring: 'Active' | 'Inactive';
    riskRating: 'Low' | 'Medium' | 'High' | 'Critical';
    lastScreeningDate: string;
  };
  entityData: {
    registrationDate?: string;
    asicStatus?: string;
    /** ASIC-style company / scheme status (e.g. Active, Deregistered). Shown as primary status in Entity tab. */
    companyStatus?: string;
    /** ISO or display timestamp of last registry sync (shown when present). */
    lastRegistrySync?: string;
    registrationHistory?: Array<{ date: string; event: string; source?: string }>;
    keyDates?: Array<{ label: string; date: string; detail?: string }>;
    directors?: Array<{
      name: string;
      appointed: string;
      resigned?: string;
      dateOfBirth?: string;
      role?: string;
      kycStatus?: string;
      /** Screening run identifiers (e.g. batch IDs) — rendered dynamically in Entity tab. */
      screeningBatches?: string[];
    }>;
    shareholders?: Array<{ name: string; shares: number; percentage: number }>;
    trustType?: string;
    trustees?: Array<{ name: string; type: string }>;
    beneficiaries?: Array<{ name: string; entitlement: string }>;
  };
  ownershipData: {
    ubos: Array<{ name: string; ownership: number; verified: boolean; country: string }>;
    ownershipStructureComplete: boolean;
    complexStructure: boolean;
  };
  financialData: {
    bankAccounts: number;
    sourceOfFunds: string;
    sourceOfWealth: string;
    estimatedWealth: string;
    transactionVolume: string;
    highRiskTransactions: number;
  };
  legalData: {
    serviceAgreementSigned: boolean;
    termsAccepted: boolean;
    privacyConsentGiven: boolean;
    engagementLetterDate?: string;
    kycConsentDate: string;
  };
  documentsData: {
    total: number;
    verified: number;
    pending: number;
    rejected: number;
  };
  monitoringData: {
    alertsLast30Days: number;
    activeAlerts: number;
    nameChanges: number;
    addressChanges: number;
    ownershipChanges: number;
  };
  decisionsData: {
    onboardingDecision: 'Approved' | 'Rejected' | 'Pending';
    onboardingDate: string;
    approver: string;
    riskAssessments: number;
    escalations: number;
  };
  austracData: {
    smrsFiled: number;
    ttrsFiled: number;
    lastReportDate?: string;
    suspiciousActivity: boolean;
  };
  auditData: {
    totalEvents: number;
    lastActivity: string;
    lastUser: string;
  };
}

const TEST_CLIENTS: TestClient[] = [
  {
    id: '1',
    name: 'Acme Property Holdings Pty Ltd',
    entityType: 'Company',
    status: 'Active',
    abn: '12 345 678 901',
    acn: '123 456 789',
    country: 'Australia',
    industry: 'Real Estate & Investment',
    serviceType: 'Trust Administration',
    clientGroup: 'Property Sector',
    riskScores: { overall: 28, aml: 25, financial: 30, business: 35, ownership: 20 },
    quickStatus: { identity: 'Verified', aml: 'Clear', entity: 'Active', monitoring: 'Active' },
    lastReview: '2024-03-15',
    nextReview: '2025-03-15',
    identityData: {
      primaryID: { type: 'Passport', number: 'N1234567', expiry: '2028-06-15', verified: true },
      secondaryID: { type: 'Driver License', number: '12345678', expiry: '2027-03-20', verified: true },
      additionalDocuments: [
        { type: 'Medicare Card', number: '1234 56789 0', expiry: '2026-12-31', verified: true }
      ],
      biometricStatus: 'Passed',
      livenessCheck: true,
      addressVerified: true,
      greenIDScore: 920,
      infoTrackStatus: 'Verified - High Confidence',
      fraudFlags: []
    },
    amlData: {
      sanctionsMatches: 0,
      pepStatus: 'Not PEP',
      adverseMediaHits: 0,
      worldCheckStatus: 'Clear',
      transactionMonitoring: 'Active',
      riskRating: 'Low',
      lastScreeningDate: '2024-03-15'
    },
    entityData: {
      registrationDate: '2018-03-15',
      asicStatus: 'Registered',
      companyStatus: 'Active',
      lastRegistrySync: '2024-03-15T09:15:00Z',
      registrationHistory: [
        { date: '2018-03-15', event: 'Company registered — ACN issued', source: 'ASIC' }
      ],
      keyDates: [
        { label: 'ACN issued', date: '2018-03-15', detail: '123 456 789' }
      ],
      directors: [
        { name: 'Michael Chen', appointed: '2018-03-15', dateOfBirth: '1978-04-22', role: 'Director', kycStatus: 'Verified' }
      ],
      shareholders: [
        { name: 'Michael Chen', shares: 100, percentage: 100 }
      ]
    },
    ownershipData: {
      ubos: [
        { name: 'Michael Chen', ownership: 100, verified: true, country: 'Australia' }
      ],
      ownershipStructureComplete: true,
      complexStructure: false
    },
    financialData: {
      bankAccounts: 3,
      sourceOfFunds: 'Business revenue and property rent',
      sourceOfWealth: 'Real estate development',
      estimatedWealth: '$2.5M - $5M',
      transactionVolume: '$100K - $250K monthly',
      highRiskTransactions: 0
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2024-01-15',
      kycConsentDate: '2024-01-15'
    },
    documentsData: { total: 12, verified: 12, pending: 0, rejected: 0 },
    monitoringData: { alertsLast30Days: 0, activeAlerts: 0, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2024-01-20',
      approver: 'Jane Smith - Compliance Manager',
      riskAssessments: 2,
      escalations: 0
    },
    austracData: { smrsFiled: 0, ttrsFiled: 12, lastReportDate: '2024-03-15', suspiciousActivity: false },
    auditData: { totalEvents: 54, lastActivity: '2024-03-15 14:35:22', lastUser: 'compliance.officer@grow.com' }
  },
  {
    id: '2',
    name: 'Chen Family Trust',
    entityType: 'Trust',
    status: 'Active',
    abn: '98 765 432 109',
    country: 'Australia',
    industry: 'Investment & Wealth Management',
    serviceType: 'Trust Administration',
    clientGroup: 'High Net Worth',
    riskScores: { overall: 45, aml: 35, financial: 50, business: 40, ownership: 60 },
    quickStatus: { identity: 'Verified', aml: 'Clear', entity: 'Active', monitoring: 'Active' },
    lastReview: '2024-01-10',
    nextReview: '2024-03-25',
    identityData: {
      primaryID: { type: 'Driver License', number: 'NSW98765432', expiry: '2029-12-31', verified: true },
      secondaryID: { type: 'Medicare Card', number: '2234 56789 0', expiry: '2027-01-01', verified: true },
      biometricStatus: 'Passed',
      livenessCheck: true,
      addressVerified: true,
      greenIDScore: 885,
      infoTrackStatus: 'Verified - Medium Confidence'
    },
    amlData: {
      sanctionsMatches: 0,
      pepStatus: 'Not PEP',
      adverseMediaHits: 0,
      worldCheckStatus: 'Clear',
      transactionMonitoring: 'Active',
      riskRating: 'Medium',
      lastScreeningDate: '2024-01-10'
    },
    entityData: {
      registrationDate: '2010-06-22',
      asicStatus: 'Scheme — trust not ASIC-registered',
      companyStatus: 'Active',
      lastRegistrySync: '2024-01-10T14:02:00Z',
      trustType: 'Discretionary Family Trust',
      trustees: [
        { name: 'Robert Smith', type: 'Individual' },
        { name: 'Margaret Smith', type: 'Individual' }
      ],
      beneficiaries: [
        { name: 'Chen Family Members', entitlement: 'Discretionary' }
      ]
    },
    ownershipData: {
      ubos: [
        { name: 'Robert Smith', ownership: 50, verified: true, country: 'Australia' },
        { name: 'Margaret Smith', ownership: 50, verified: true, country: 'Australia' }
      ],
      ownershipStructureComplete: true,
      complexStructure: true
    },
    financialData: {
      bankAccounts: 5,
      sourceOfFunds: 'Investment returns, dividends',
      sourceOfWealth: 'Accumulated wealth from property investments',
      estimatedWealth: '$5M - $10M',
      transactionVolume: '$250K - $500K monthly',
      highRiskTransactions: 2
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2023-11-10',
      kycConsentDate: '2023-11-10'
    },
    documentsData: { total: 10, verified: 10, pending: 0, rejected: 0 },
    monitoringData: { alertsLast30Days: 2, activeAlerts: 1, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2023-11-18',
      approver: 'David Lee - Senior Compliance Officer',
      riskAssessments: 3,
      escalations: 1
    },
    austracData: { smrsFiled: 0, ttrsFiled: 15, lastReportDate: '2024-01-10', suspiciousActivity: false },
    auditData: { totalEvents: 120, lastActivity: '2024-01-10 16:22:11', lastUser: 'trust.admin@grow.com' }
  },
  {
    id: '3',
    name: 'John Michael Smith',
    entityType: 'Individual',
    status: 'Active',
    country: 'Australia',
    industry: 'Engineering & Construction',
    serviceType: 'Wealth Management',
    clientGroup: 'Professional Individual',
    riskScores: { overall: 22, aml: 15, financial: 25, business: 20, ownership: 0 },
    quickStatus: { identity: 'Verified', aml: 'Clear', entity: 'N/A', monitoring: 'Active' },
    lastReview: '2024-03-20',
    nextReview: '2024-04-20',
    identityData: {
      primaryID: { type: 'Passport', number: 'PA9876543', expiry: '2030-09-15', verified: true },
      secondaryID: { type: 'Driver License', number: 'VIC87654321', expiry: '2028-11-30', verified: true },
      biometricStatus: 'Passed',
      livenessCheck: true,
      addressVerified: true,
      greenIDScore: 945,
      infoTrackStatus: 'Verified - High Confidence'
    },
    amlData: {
      sanctionsMatches: 0,
      pepStatus: 'Not PEP',
      adverseMediaHits: 0,
      worldCheckStatus: 'Clear',
      transactionMonitoring: 'Active',
      riskRating: 'Low',
      lastScreeningDate: '2024-03-20'
    },
    entityData: {},
    ownershipData: {
      ubos: [
        { name: 'John Michael Smith', ownership: 100, verified: true, country: 'Australia' }
      ],
      ownershipStructureComplete: true,
      complexStructure: false
    },
    financialData: {
      bankAccounts: 2,
      sourceOfFunds: 'Salary, consulting fees',
      sourceOfWealth: 'Professional career over 15 years',
      estimatedWealth: '$1M - $2M',
      transactionVolume: '$20K - $50K monthly',
      highRiskTransactions: 0
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2024-03-18',
      kycConsentDate: '2024-03-18'
    },
    documentsData: { total: 7, verified: 7, pending: 0, rejected: 0 },
    monitoringData: { alertsLast30Days: 0, activeAlerts: 0, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2024-03-20',
      approver: 'Sarah Chen',
      riskAssessments: 1,
      escalations: 0
    },
    austracData: { smrsFiled: 0, ttrsFiled: 4, lastReportDate: '2024-03-20', suspiciousActivity: false },
    auditData: { totalEvents: 18, lastActivity: '2024-03-20 11:18:45', lastUser: 'compliance.officer@grow.com' }
  },
  {
    id: '4',
    name: 'Global Investments Pty Ltd',
    entityType: 'Company',
    status: 'Active',
    abn: '44 654 321 098',
    acn: '456 789 123',
    country: 'Australia',
    industry: 'Financial Investments',
    serviceType: 'Corporate Portfolio',
    clientGroup: 'Corporate Client',
    riskScores: { overall: 42, aml: 38, financial: 55, business: 45, ownership: 35 },
    quickStatus: { identity: 'Verified', aml: 'Clear', entity: 'Active', monitoring: 'Active' },
    lastReview: '2024-02-28',
    nextReview: '2025-02-28',
    identityData: {
      primaryID: { type: 'Company Extract', number: 'ASIC-456789123', expiry: 'N/A', verified: true },
      biometricStatus: 'Not Required',
      livenessCheck: false,
      addressVerified: true,
      infoTrackStatus: 'Verified - Company Confirmed',
      fraudFlags: []
    },
    amlData: {
      sanctionsMatches: 0,
      pepStatus: 'Not PEP',
      adverseMediaHits: 0,
      worldCheckStatus: 'Clear',
      transactionMonitoring: 'Active',
      riskRating: 'Medium',
      lastScreeningDate: '2024-02-28'
    },
    entityData: {
      registrationDate: '2021-11-10',
      asicStatus: 'Registered',
      companyStatus: 'Active',
      lastRegistrySync: '2024-02-28T08:40:00Z',
      directors: [
        { name: 'Chen Wei', appointed: '2021-11-10', dateOfBirth: '1990-01-08', role: 'Director', kycStatus: 'Verified' }
      ],
      shareholders: [
        { name: 'Chen Wei', shares: 100, percentage: 100 }
      ]
    },
    ownershipData: {
      ubos: [
        { name: 'Chen Wei', ownership: 100, verified: true, country: 'Australia' }
      ],
      ownershipStructureComplete: true,
      complexStructure: false
    },
    financialData: {
      bankAccounts: 4,
      sourceOfFunds: 'Investment dividends and trading surplus',
      sourceOfWealth: 'Financial consulting operations',
      estimatedWealth: '$5M - $10M',
      transactionVolume: '$500K - $1M monthly',
      highRiskTransactions: 1
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2021-11-10',
      kycConsentDate: '2021-11-10'
    },
    documentsData: { total: 15, verified: 15, pending: 0, rejected: 0 },
    monitoringData: { alertsLast30Days: 1, activeAlerts: 0, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2021-11-15',
      approver: 'Jessica Lee',
      riskAssessments: 4,
      escalations: 0
    },
    austracData: { smrsFiled: 0, ttrsFiled: 24, lastReportDate: '2024-02-28', suspiciousActivity: false },
    auditData: { totalEvents: 184, lastActivity: '2024-02-28 15:42:33', lastUser: 'compliance.officer@grow.com' }
  },
  {
    id: '5',
    name: 'Sarah Williams',
    entityType: 'Individual',
    status: 'Under Review',
    country: 'Australia',
    industry: 'Executive Management',
    serviceType: 'Wealth Management',
    clientGroup: 'High Net Worth',
    riskScores: { overall: 72, aml: 85, financial: 45, business: 55, ownership: 0 },
    quickStatus: { identity: 'Verified', aml: 'PEP Match', entity: 'N/A', monitoring: 'Enhanced' },
    lastReview: '2023-03-10',
    nextReview: '2024-03-10',
    identityData: {
      primaryID: { type: 'Passport', number: 'PA9876543', expiry: '2030-09-15', verified: true },
      secondaryID: { type: 'Driver License', number: 'VIC87654321', expiry: '2028-11-30', verified: true },
      biometricStatus: 'Passed',
      livenessCheck: true,
      addressVerified: true,
      greenIDScore: 945,
      infoTrackStatus: 'Verified - High Confidence'
    },
    amlData: {
      sanctionsMatches: 0,
      pepStatus: 'Domestic PEP',
      adverseMediaHits: 5,
      worldCheckStatus: 'PEP Confirmed - Enhanced Due Diligence Required',
      transactionMonitoring: 'Active',
      riskRating: 'High',
      lastScreeningDate: '2023-03-10'
    },
    entityData: {},
    ownershipData: {
      ubos: [
        { name: 'Sarah Williams', ownership: 100, verified: true, country: 'Australia' }
      ],
      ownershipStructureComplete: true,
      complexStructure: false
    },
    financialData: {
      bankAccounts: 4,
      sourceOfFunds: 'Corporate salary and stock options',
      sourceOfWealth: 'Executive career in public companies',
      estimatedWealth: '$5M - $10M',
      transactionVolume: '$200K - $500K monthly',
      highRiskTransactions: 1
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2020-03-10',
      kycConsentDate: '2020-03-10'
    },
    documentsData: { total: 10, verified: 10, pending: 0, rejected: 0 },
    monitoringData: { alertsLast30Days: 8, activeAlerts: 2, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 },
    decisionsData: {
      onboardingDecision: 'Pending',
      onboardingDate: '2020-03-12',
      approver: 'Compliance',
      riskAssessments: 8,
      escalations: 3
    },
    austracData: { smrsFiled: 0, ttrsFiled: 15, lastReportDate: '2023-03-10', suspiciousActivity: true },
    auditData: { totalEvents: 412, lastActivity: '2023-03-10 11:18:45', lastUser: 'edd.specialist@grow.com' }
  },
  {
    id: '6',
    name: 'Thompson & Associates Partnership',
    entityType: 'Partnership',
    status: 'Active',
    abn: '87 654 321 098',
    country: 'Australia',
    industry: 'Legal Services',
    serviceType: 'Trust Account Management',
    clientGroup: 'Professional Services',
    riskScores: { overall: 35, aml: 28, financial: 42, business: 38, ownership: 30 },
    quickStatus: { identity: 'Verified', aml: 'Clear', entity: 'Active', monitoring: 'Standard' },
    lastReview: '2024-03-01',
    nextReview: '2025-03-01',
    identityData: {
      primaryID: { type: 'Partnership Agreement', number: 'PA-2015-001', expiry: 'N/A', verified: true },
      biometricStatus: 'Not Required',
      livenessCheck: false,
      addressVerified: true,
      infoTrackStatus: 'Verified - Partnership Confirmed'
    },
    amlData: {
      sanctionsMatches: 0,
      pepStatus: 'Not PEP',
      adverseMediaHits: 0,
      worldCheckStatus: 'Clear',
      transactionMonitoring: 'Active',
      riskRating: 'Low',
      lastScreeningDate: '2024-03-01'
    },
    entityData: {
      registrationDate: '2015-04-12',
      asicStatus: 'ABN active — partnership',
      companyStatus: 'Active',
      lastRegistrySync: '2024-03-01T11:00:00Z',
      registrationHistory: [
        { date: '2015-04-12', event: 'Partnership commenced', source: 'ABR' }
      ],
      keyDates: [
        { label: 'ABN effective', date: '2015-04-12' }
      ],
      directors: [
        { name: 'Jennifer Anderson', appointed: '2015-04-12', dateOfBirth: '1972-06-18', role: 'Partner', kycStatus: 'Verified' }
      ]
    },
    ownershipData: {
      ubos: [
        { name: 'Jennifer Anderson', ownership: 50, verified: true, country: 'Australia' },
        { name: 'Michael Thompson', ownership: 50, verified: true, country: 'Australia' }
      ],
      ownershipStructureComplete: true,
      complexStructure: false
    },
    financialData: {
      bankAccounts: 3,
      sourceOfFunds: 'Professional services fees',
      sourceOfWealth: 'Law firm partnership equity',
      estimatedWealth: '$2.5M - $5M',
      transactionVolume: '$100K - $250K monthly',
      highRiskTransactions: 0
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2015-04-12',
      kycConsentDate: '2015-04-12'
    },
    documentsData: { total: 14, verified: 14, pending: 0, rejected: 0 },
    monitoringData: { alertsLast30Days: 0, activeAlerts: 0, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2015-04-15',
      approver: 'Compliance',
      riskAssessments: 1,
      escalations: 0
    },
    austracData: { smrsFiled: 0, ttrsFiled: 8, lastReportDate: '2024-03-01', suspiciousActivity: false },
    auditData: { totalEvents: 84, lastActivity: '2024-03-01 10:00:00', lastUser: 'compliance.officer@grow.com' }
  },
  {
    id: '7',
    name: 'Sunrise Development Trust',
    entityType: 'Trust',
    status: 'Active',
    abn: '77 654 321 999',
    country: 'Australia',
    industry: 'Real Estate & Investment',
    serviceType: 'Trust Administration',
    clientGroup: 'High Net Worth',
    riskScores: { overall: 48, aml: 38, financial: 52, business: 42, ownership: 65 },
    quickStatus: { identity: 'Verified', aml: 'Clear', entity: 'Active', monitoring: 'Active' },
    lastReview: '2024-03-18',
    nextReview: '2024-04-18',
    identityData: {
      primaryID: { type: 'Driver License', number: 'VIC77665544', expiry: '2028-10-31', verified: true },
      secondaryID: { type: 'Medicare Card', number: '3234 56789 0', expiry: '2027-02-02', verified: true },
      biometricStatus: 'Passed',
      livenessCheck: true,
      addressVerified: true,
      greenIDScore: 890,
      infoTrackStatus: 'Verified - Medium Confidence'
    },
    amlData: {
      sanctionsMatches: 0,
      pepStatus: 'Not PEP',
      adverseMediaHits: 0,
      worldCheckStatus: 'Clear',
      transactionMonitoring: 'Active',
      riskRating: 'Medium',
      lastScreeningDate: '2024-03-18'
    },
    entityData: {
      registrationDate: '2012-08-15',
      asicStatus: 'Scheme — trust not ASIC-registered',
      companyStatus: 'Active',
      lastRegistrySync: '2024-03-18T14:02:00Z',
      trustType: 'Discretionary Family Trust',
      trustees: [
        { name: 'Marcus Sunrise', type: 'Individual' }
      ],
      beneficiaries: [
        { name: 'Sunrise Family Members', entitlement: 'Discretionary' }
      ]
    },
    ownershipData: {
      ubos: [
        { name: 'Marcus Sunrise', ownership: 100, verified: true, country: 'Australia' }
      ],
      ownershipStructureComplete: true,
      complexStructure: true
    },
    financialData: {
      bankAccounts: 4,
      sourceOfFunds: 'Property rentals, investment dividends',
      sourceOfWealth: 'Real estate development surplus capital',
      estimatedWealth: '$5M - $10M',
      transactionVolume: '$250K - $500K monthly',
      highRiskTransactions: 1
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2012-08-15',
      kycConsentDate: '2012-08-15'
    },
    documentsData: { total: 12, verified: 9, pending: 3, rejected: 0 },
    monitoringData: { alertsLast30Days: 1, activeAlerts: 0, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2012-08-20',
      approver: 'Sarah Chen',
      riskAssessments: 3,
      escalations: 0
    },
    austracData: { smrsFiled: 0, ttrsFiled: 10, lastReportDate: '2024-03-18', suspiciousActivity: false },
    auditData: { totalEvents: 92, lastActivity: '2024-03-18 16:22:11', lastUser: 'compliance.officer@grow.com' }
  },
  {
    id: '8',
    name: 'Pacific Trading Co Pty Ltd',
    entityType: 'Company',
    status: 'Suspended',
    abn: '45 678 912 345',
    acn: '456 789 123',
    country: 'Australia',
    industry: 'Import/Export',
    serviceType: 'Corporate Banking',
    clientGroup: 'International Trade',
    riskScores: { overall: 88, aml: 92, financial: 78, business: 85, ownership: 95 },
    quickStatus: { identity: 'Verified', aml: 'SANCTIONS', entity: 'Active', monitoring: 'Enhanced' },
    lastReview: '2024-03-05',
    nextReview: '2024-03-23',
    identityData: {
      primaryID: { type: 'Company Extract', number: 'ASIC-456789123', expiry: 'N/A', verified: true },
      biometricStatus: 'Not Required',
      livenessCheck: false,
      addressVerified: true,
      infoTrackStatus: 'Verified - Company Confirmed',
      fraudFlags: [
        { id: 1, type: 'warning', message: 'IP Mismatch: Request originates from a different jurisdiction than the registered residential address.' },
        { id: 2, type: 'warning', message: 'Device Anomaly: Associated hardware fingerprint detected across multiple flagged accounts.' },
        { id: 3, type: 'warning', message: 'Multiple Failed Attempts: Intercepted 3 consecutive liveness detection failures.' }
      ]
    },
    amlData: {
      sanctionsMatches: 3,
      pepStatus: 'Foreign PEP',
      adverseMediaHits: 12,
      worldCheckStatus: 'CRITICAL - Sanctions Match on UBO',
      transactionMonitoring: 'Active',
      riskRating: 'Critical',
      lastScreeningDate: '2024-03-05'
    },
    entityData: {
      registrationDate: '2022-11-08',
      asicStatus: 'Registered',
      companyStatus: 'Active',
      lastRegistrySync: '2024-03-05T08:40:00Z',
      directors: [
        { name: 'Viktor Petrov', appointed: '2022-11-08', dateOfBirth: '1975-02-14', role: 'Director', kycStatus: 'Enhanced review', screeningBatches: ['AML-2026-CRIT-9910'] },
        { name: 'Chen Wei', appointed: '2024-01-10', dateOfBirth: '1990-01-08', role: 'Director', kycStatus: 'Verified', screeningBatches: ['AML-2026-Q1-9013'] }
      ],
      shareholders: [
        { name: 'Offshore Holdings BVI', shares: 80, percentage: 80 },
        { name: 'Chen Wei', shares: 20, percentage: 20 }
      ]
    },
    ownershipData: {
      ubos: [
        { name: 'Viktor Petrov', ownership: 45, verified: true, country: 'Russia' },
        { name: 'Unknown Beneficial Owner(s)', ownership: 35, verified: false, country: 'British Virgin Islands' },
        { name: 'Chen Wei', ownership: 20, verified: true, country: 'China' }
      ],
      ownershipStructureComplete: false,
      complexStructure: true
    },
    financialData: {
      bankAccounts: 8,
      sourceOfFunds: 'International trade receipts, export revenues',
      sourceOfWealth: 'Trading operations - partial verification',
      estimatedWealth: '$25M - $50M',
      transactionVolume: '$5M - $10M monthly',
      highRiskTransactions: 18
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2022-11-08',
      kycConsentDate: '2022-11-08'
    },
    documentsData: { total: 15, verified: 13, pending: 2, rejected: 0 },
    monitoringData: { alertsLast30Days: 24, activeAlerts: 12, nameChanges: 2, addressChanges: 3, ownershipChanges: 4 },
    decisionsData: {
      onboardingDecision: 'Rejected',
      onboardingDate: '2024-03-05',
      approver: 'Tom Anderson - Chief Compliance Officer',
      riskAssessments: 15,
      escalations: 8
    },
    austracData: { smrsFiled: 4, ttrsFiled: 87, lastReportDate: '2024-03-05', suspiciousActivity: true },
    auditData: { totalEvents: 1247, lastActivity: '2024-03-05 15:42:33', lastUser: 'sanctions.team@grow.com' }
  },
  {
    id: '9',
    name: 'Emily Zhang',
    entityType: 'Individual',
    status: 'Active',
    country: 'Australia',
    industry: 'Information Technology',
    serviceType: 'Wealth Management',
    clientGroup: 'Professional Individual',
    riskScores: { overall: 15, aml: 10, financial: 18, business: 12, ownership: 0 },
    quickStatus: { identity: 'Verified', aml: 'Clear', entity: 'N/A', monitoring: 'Active' },
    lastReview: '2024-03-12',
    nextReview: '2025-03-12',
    identityData: {
      primaryID: { type: 'Passport', number: 'PA1122334', expiry: '2031-01-15', verified: true },
      secondaryID: { type: 'Driver License', number: 'NSW9988776', expiry: '2029-05-20', verified: true },
      biometricStatus: 'Passed',
      livenessCheck: true,
      addressVerified: true,
      greenIDScore: 955,
      infoTrackStatus: 'Verified - High Confidence'
    },
    amlData: {
      sanctionsMatches: 0,
      pepStatus: 'Not PEP',
      adverseMediaHits: 0,
      worldCheckStatus: 'Clear',
      transactionMonitoring: 'Active',
      riskRating: 'Low',
      lastScreeningDate: '2024-03-12'
    },
    entityData: {},
    ownershipData: {
      ubos: [
        { name: 'Emily Zhang', ownership: 100, verified: true, country: 'Australia' }
      ],
      ownershipStructureComplete: true,
      complexStructure: false
    },
    financialData: {
      bankAccounts: 2,
      sourceOfFunds: 'Salary and equity vesting',
      sourceOfWealth: 'Software engineering career at global tech company',
      estimatedWealth: '$1.5M - $3M',
      transactionVolume: '$30K - $80K monthly',
      highRiskTransactions: 0
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2023-12-05',
      kycConsentDate: '2023-12-05'
    },
    documentsData: { total: 10, verified: 10, pending: 0, rejected: 0 },
    monitoringData: { alertsLast30Days: 0, activeAlerts: 0, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2023-12-10',
      approver: 'Sarah Chen',
      riskAssessments: 1,
      escalations: 0
    },
    austracData: { smrsFiled: 0, ttrsFiled: 2, lastReportDate: '2024-03-12', suspiciousActivity: false },
    auditData: { totalEvents: 12, lastActivity: '2024-03-12 09:30:00', lastUser: 'compliance.officer@grow.com' }
  },
  {
    id: '10',
    name: 'Coastal Properties Trust',
    entityType: 'Trust',
    status: 'Active',
    abn: '33 444 555 666',
    country: 'Australia',
    industry: 'Real Estate & Property',
    serviceType: 'Trust Administration',
    clientGroup: 'Professional Services',
    riskScores: { overall: 25, aml: 20, financial: 30, business: 25, ownership: 30 },
    quickStatus: { identity: 'Verified', aml: 'Clear', entity: 'Active', monitoring: 'Active' },
    lastReview: '2024-02-20',
    nextReview: '2025-02-20',
    identityData: {
      primaryID: { type: 'Driver License', number: 'QLD88776655', expiry: '2028-12-31', verified: true },
      secondaryID: { type: 'Medicare Card', number: '4234 56789 0', expiry: '2026-11-11', verified: true },
      biometricStatus: 'Passed',
      livenessCheck: true,
      addressVerified: true,
      greenIDScore: 910,
      infoTrackStatus: 'Verified - High Confidence'
    },
    amlData: {
      sanctionsMatches: 0,
      pepStatus: 'Not PEP',
      adverseMediaHits: 0,
      worldCheckStatus: 'Clear',
      transactionMonitoring: 'Active',
      riskRating: 'Low',
      lastScreeningDate: '2024-02-20'
    },
    entityData: {
      registrationDate: '2018-02-20',
      asicStatus: 'Scheme — trust not ASIC-registered',
      companyStatus: 'Active',
      lastRegistrySync: '2024-02-20T10:15:00Z',
      trustType: 'Discretionary Family Trust',
      trustees: [
        { name: 'Sarah Mitchell', type: 'Individual' }
      ],
      beneficiaries: [
        { name: 'Coastal Family Members', entitlement: 'Discretionary' }
      ]
    },
    ownershipData: {
      ubos: [
        { name: 'Sarah Mitchell', ownership: 100, verified: true, country: 'Australia' }
      ],
      ownershipStructureComplete: true,
      complexStructure: false
    },
    financialData: {
      bankAccounts: 3,
      sourceOfFunds: 'Property rentals, dividends',
      sourceOfWealth: 'Real estate investment',
      estimatedWealth: '$2M - $5M',
      transactionVolume: '$50K - $150K monthly',
      highRiskTransactions: 0
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2018-02-20',
      kycConsentDate: '2018-02-20'
    },
    documentsData: { total: 12, verified: 12, pending: 0, rejected: 0 },
    monitoringData: { alertsLast30Days: 0, activeAlerts: 0, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2018-02-22',
      approver: 'Jessica Lee',
      riskAssessments: 2,
      escalations: 0
    },
    austracData: { smrsFiled: 0, ttrsFiled: 12, lastReportDate: '2024-02-20', suspiciousActivity: false },
    auditData: { totalEvents: 48, lastActivity: '2024-02-20 14:00:00', lastUser: 'compliance.officer@grow.com' }
  },
  {
    id: '11',
    name: 'David Robertson',
    entityType: 'Individual',
    status: 'Active',
    country: 'Australia',
    industry: 'Healthcare - Surgeon',
    serviceType: 'Wealth Management',
    clientGroup: 'Professional Individual',
    riskScores: { overall: 48, aml: 40, financial: 55, business: 45, ownership: 0 },
    quickStatus: { identity: 'Verified', aml: 'Clear', entity: 'N/A', monitoring: 'Active' },
    lastReview: '2024-03-21',
    nextReview: '2024-04-21',
    identityData: {
      primaryID: { type: 'Passport', number: 'PA4455667', expiry: '2032-04-12', verified: true },
      secondaryID: { type: 'Driver License', number: 'VIC1122334', expiry: '2029-08-18', verified: true },
      biometricStatus: 'Passed',
      livenessCheck: true,
      addressVerified: true,
      greenIDScore: 935,
      infoTrackStatus: 'Verified - High Confidence'
    },
    amlData: {
      sanctionsMatches: 0,
      pepStatus: 'Not PEP',
      adverseMediaHits: 0,
      worldCheckStatus: 'Clear',
      transactionMonitoring: 'Active',
      riskRating: 'Medium',
      lastScreeningDate: '2024-03-21'
    },
    entityData: {},
    ownershipData: {
      ubos: [
        { name: 'David Robertson', ownership: 100, verified: true, country: 'Australia' }
      ],
      ownershipStructureComplete: true,
      complexStructure: false
    },
    financialData: {
      bankAccounts: 3,
      sourceOfFunds: 'Surgical practice revenue',
      sourceOfWealth: 'Surgical and consulting practice over 20 years',
      estimatedWealth: '$4M - $8M',
      transactionVolume: '$150K - $300K monthly',
      highRiskTransactions: 1
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2024-03-19',
      kycConsentDate: '2024-03-19'
    },
    documentsData: { total: 10, verified: 6, pending: 4, rejected: 0 },
    monitoringData: { alertsLast30Days: 2, activeAlerts: 0, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2024-03-21',
      approver: 'Sarah Chen',
      riskAssessments: 3,
      escalations: 0
    },
    austracData: { smrsFiled: 0, ttrsFiled: 14, lastReportDate: '2024-03-21', suspiciousActivity: false },
    auditData: { totalEvents: 34, lastActivity: '2024-03-21 11:00:00', lastUser: 'compliance.officer@grow.com' }
  },
  {
    id: '12',
    name: 'Metro Development Pty Ltd',
    entityType: 'Company',
    status: 'Active',
    abn: '22 333 444 555',
    acn: '223 333 444',
    country: 'Australia',
    industry: 'Commercial Construction',
    serviceType: 'Corporate Portfolio',
    clientGroup: 'Corporate Client',
    riskScores: { overall: 26, aml: 22, financial: 30, business: 28, ownership: 25 },
    quickStatus: { identity: 'Verified', aml: 'Clear', entity: 'Active', monitoring: 'Active' },
    lastReview: '2024-03-10',
    nextReview: '2025-03-10',
    identityData: {
      primaryID: { type: 'Company Extract', number: 'ASIC-223333444', expiry: 'N/A', verified: true },
      biometricStatus: 'Not Required',
      livenessCheck: false,
      addressVerified: true,
      infoTrackStatus: 'Verified - Company Confirmed',
      fraudFlags: []
    },
    amlData: {
      sanctionsMatches: 0,
      pepStatus: 'Not PEP',
      adverseMediaHits: 0,
      worldCheckStatus: 'Clear',
      transactionMonitoring: 'Active',
      riskRating: 'Low',
      lastScreeningDate: '2024-03-10'
    },
    entityData: {
      registrationDate: '2023-05-22',
      asicStatus: 'Registered',
      companyStatus: 'Active',
      lastRegistrySync: '2024-03-10T09:00:00Z',
      directors: [
        { name: 'Sarah Mitchell', appointed: '2023-05-22', dateOfBirth: '1990-11-08', role: 'Director', kycStatus: 'Verified' }
      ],
      shareholders: [
        { name: 'Sarah Mitchell', shares: 100, percentage: 100 }
      ]
    },
    ownershipData: {
      ubos: [
        { name: 'Sarah Mitchell', ownership: 100, verified: true, country: 'Australia' }
      ],
      ownershipStructureComplete: true,
      complexStructure: false
    },
    financialData: {
      bankAccounts: 3,
      sourceOfFunds: 'Property sale revenue, capital investment',
      sourceOfWealth: 'Commercial property development consulting',
      estimatedWealth: '$3M - $6M',
      transactionVolume: '$300K - $600K monthly',
      highRiskTransactions: 0
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2023-05-22',
      kycConsentDate: '2023-05-22'
    },
    documentsData: { total: 14, verified: 14, pending: 0, rejected: 0 },
    monitoringData: { alertsLast30Days: 0, activeAlerts: 0, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2023-05-25',
      approver: 'Jessica Lee',
      riskAssessments: 2,
      escalations: 0
    },
    austracData: { smrsFiled: 0, ttrsFiled: 18, lastReportDate: '2024-03-10', suspiciousActivity: false },
    auditData: { totalEvents: 28, lastActivity: '2024-03-10 10:15:00', lastUser: 'compliance.officer@grow.com' }
  }
];

interface ClientKYCDashboardProps {
  onBack?: () => void;
  clientId?: string;
}

export function ClientKYCDashboard({ onBack, clientId: propClientId }: ClientKYCDashboardProps = {}) {
  // Helper to map the 12 dynamic client IDs ('1'-'12') to the static mock IDs ('client-001'-'client-007') used by external mock databases
  const getMockId = (id: string): string => {
    const mapping: Record<string, string> = {
      '1': 'client-001',
      '2': 'client-002',
      '3': 'client-003',
      '4': 'client-001',
      '5': 'client-003',
      '6': 'client-005',
      '7': 'client-002',
      '8': 'client-004',
      '9': 'client-003',
      '10': 'client-002',
      '11': 'client-003',
      '12': 'client-001'
    };
    return mapping[id] || id;
  };

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedClientId, setSelectedClientId] = useState<string>(propClientId || '1');
  const [clients, setClients] = useState<TestClient[]>(() => ClientsDB.getClients() as any);
  const [runningCheck, setRunningCheck] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    const unsubscribe = ClientsDB.subscribe(setClients as any);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (propClientId && propClientId !== selectedClientId) {
      setSelectedClientId(propClientId);
    }
  }, [propClientId]);

  const client = clients.find(c => c.id === selectedClientId) || clients[0];

  const handleExportReport = () => {
    setIsExporting(true);
    toast.info('Generating report...');
    setTimeout(() => {
      try {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(client, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${client.name.replace(/\\s+/g, '_')}_KYC_Report.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();

        toast.success('Report exported successfully', 'The KYC report has been downloaded');
      } catch (error) {
        toast.error('Export failed');
      } finally {
        setIsExporting(false);
      }
    }, 1500);
  };

  const handleApproveClient = () => {
    setIsApproving(true);
    setTimeout(() => {
      setClients(prevClients =>
        prevClients.map(c =>
          c.id === client.id
            ? {
              ...c,
              status: 'Active',
              decisionsData: {
                ...c.decisionsData,
                onboardingDecision: 'Approved',
                onboardingDate: new Date().toISOString().split('T')[0]
              }
            }
            : c
        )
      );

      setIsApproving(false);
      toast.success('Client Approved', `${client?.name || 'Client'} has been successfully approved`);
    }, 1500);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'actions', label: 'Actions', icon: PlayCircle },
    { id: 'identity', label: 'Identity', icon: User },
    { id: 'aml', label: 'AML', icon: Shield },
    { id: 'entity', label: 'Entity', icon: Building },
    { id: 'ownership', label: 'Ownership', icon: Users },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'fraud', label: 'Fraud Detection', icon: AlertCircle },
    { id: 'legal', label: 'Legal', icon: Scale },
    { id: 'run-checks', label: 'Run Checks', icon: RefreshCw },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'monitoring', label: 'Monitoring', icon: Activity },
    { id: 'decisions', label: 'Decisions', icon: CheckCircle },
    { id: 'austrac', label: 'AUSTRAC', icon: Shield },
    { id: 'audit', label: 'Audit Trail', icon: Clock },
    { id: 'related-entities', label: 'Related Entities', icon: Network }
  ];

  // Helper function to get risk color
  const getRiskColor = (score: number) => {
    if (score < 40) return 'text-green-600';
    if (score < 60) return 'text-yellow-600';
    if (score < 80) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRiskBg = (score: number) => {
    if (score < 40) return 'bg-green-50 border-green-200';
    if (score < 60) return 'bg-yellow-50 border-yellow-200';
    if (score < 80) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Under Review': return 'bg-orange-500';
      case 'Suspended': return 'bg-red-500';
      case 'Inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOP SUMMARY STRIP */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 text-white shadow-xl">
        <div className="max-w-[2000px] mx-auto px-8 py-6">
          <div className="grid grid-cols-12 gap-6 items-center">
            <div className="col-span-3">
              <div className="mb-3">
                <label className="text-xs opacity-80 mb-1 block">Select Test Client</label>
                <select
                  disabled
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white font-semibold focus:outline-none cursor-not-allowed opacity-75"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id} className="text-gray-900">
                      {c.name} ({c.entityType})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <Building className="w-8 h-8" />
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                      {client.entityType}
                    </Badge>
                    <Badge variant="outline" className={`${getStatusColor(client.status)} text-white border-white/30`}>
                      {client.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-6 grid grid-cols-4 gap-4 text-center">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-xs opacity-90">Overall Risk</p>
                <p className={`text-3xl font-bold ${client.riskScores.overall >= 80 ? 'text-red-200' : client.riskScores.overall >= 60 ? 'text-yellow-200' : 'text-green-200'}`}>
                  {client.riskScores.overall}
                </p>
                <p className="text-xs">
                  {client.riskScores.overall < 40 ? 'Low' : client.riskScores.overall < 60 ? 'Medium' : client.riskScores.overall < 80 ? 'High' : 'Critical'}
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-xs opacity-90">Identity</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {client.quickStatus.identity === 'Verified' ? (
                    <CheckCircle className="w-5 h-5 text-green-300" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-300" />
                  )}
                  <p className="text-lg font-bold">{client.quickStatus.identity}</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-xs opacity-90">AML Status</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {client.quickStatus.aml.includes('SANCTIONS') ? (
                    <XCircle className="w-5 h-5 text-red-300" />
                  ) : client.quickStatus.aml === 'Clear' ? (
                    <CheckCircle className="w-5 h-5 text-green-300" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-300" />
                  )}
                  <p className="text-lg font-bold">{client.quickStatus.aml}</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-xs opacity-90">Entity</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <p className="text-lg font-bold">{client.quickStatus.entity}</p>
                </div>
              </div>
            </div>

            <div className="col-span-3 flex justify-end gap-2">
              <Button
                variant="outline"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                onClick={handleExportReport}
                disabled={isExporting}
              >
                {isExporting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                {isExporting ? 'Exporting...' : 'Export Report'}
              </Button>
              <Button
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={handleApproveClient}
                disabled={isApproving || client.decisionsData?.onboardingDecision === 'Approved'}
              >
                {isApproving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                {isApproving ? 'Approving...' : client.decisionsData?.onboardingDecision === 'Approved' ? 'Approved' : 'Approve Client'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-[2000px] mx-auto p-8">
        {/* Breadcrumb Navigation */}
        {onBack && (
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
            <button
              onClick={onBack}
              className="flex items-center gap-1 hover:text-[#13B5EA] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to KYC Dashboard</span>
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{client.name}</span>
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT SIDEBAR - Navigation */}
          <div className="col-span-2">
            <Card className="sticky top-[200px] border-2 border-cyan-300 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b p-4">
                <CardTitle className="text-lg">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${activeTab === tab.id
                          ? 'bg-cyan-600 text-white font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="col-span-10">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <Card className="border-2 border-blue-300 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-6 h-6 text-blue-600" />
                      KYC Overview - {client.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {/* Client Summary */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                        <p className="text-sm text-gray-600 mb-1">Entity Type</p>
                        <p className="font-bold text-lg">{client.entityType}</p>
                      </div>
                      <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                        <p className="text-sm text-gray-600 mb-1">Country</p>
                        <p className="font-bold text-lg">{client.country}</p>
                      </div>
                      <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                        <p className="text-sm text-gray-600 mb-1">Industry</p>
                        <p className="font-bold text-lg">{client.industry}</p>
                      </div>
                      {client.abn && (
                        <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                          <p className="text-sm text-gray-600 mb-1">ABN</p>
                          <p className="font-bold text-lg">{client.abn}</p>
                        </div>
                      )}
                      {client.acn && (
                        <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                          <p className="text-sm text-gray-600 mb-1">ACN</p>
                          <p className="font-bold text-lg">{client.acn}</p>
                        </div>
                      )}
                      <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                        <p className="text-sm text-gray-600 mb-1">Service Type</p>
                        <p className="font-bold text-lg">{client.serviceType}</p>
                      </div>
                    </div>

                    {/* Risk Scores Dashboard */}
                    <div className="mb-6">
                      <h3 className="font-bold text-lg mb-4">Risk Score Breakdown</h3>
                      <div className="grid grid-cols-5 gap-4">
                        {Object.entries(client.riskScores).map(([key, value]) => (
                          <div key={key} className={`rounded-lg p-4 border ${getRiskBg(value)}`}>
                            <p className="text-xs uppercase text-gray-600 mb-1">{key}</p>
                            <p className={`text-3xl font-bold ${getRiskColor(value)}`}>{value}</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div
                                className={`h-2 rounded-full ${value < 40 ? 'bg-green-500' : value < 60 ? 'bg-yellow-500' : value < 80 ? 'bg-orange-500' : 'bg-red-500'}`}
                                style={{ width: `${value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Review Dates */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-blue-600" />
                          <p className="font-semibold">Last Review</p>
                        </div>
                        <p className="text-lg">{client.lastReview}</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-5 h-5 text-orange-600" />
                          <p className="font-semibold">Next Review Due</p>
                        </div>
                        <p className="text-lg">{client.nextReview}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ACTIONS TAB - Client Action Items & Task List */}
            {activeTab === 'actions' && (
              <div className="space-y-4">
                <Card className="border-2 border-[#13B5EA] shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-[#13B5EA]/10 to-[#0E7C9E]/10 border-b">
                    <CardTitle className="flex items-center gap-2">
                      <PlayCircle className="w-6 h-6 text-[#13B5EA]" />
                      Action Items & Tasks - {client.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Overdue</p>
                            <p className="text-3xl font-bold text-red-600">
                              {client.riskScores.overall > 70 ? 2 : client.riskScores.overall > 50 ? 1 : 0}
                            </p>
                          </div>
                          <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                      </div>
                      <div className="bg-[#FFA300]/10 rounded-lg p-4 border-2 border-[#FFA300]">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Due Soon</p>
                            <p className="text-3xl font-bold text-[#FFA300]">
                              {client.documentsData.pending + (client.monitoringData.activeAlerts > 0 ? 1 : 0)}
                            </p>
                          </div>
                          <Clock className="w-8 h-8 text-[#FFA300]" />
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">In Progress</p>
                            <p className="text-3xl font-bold text-blue-600">
                              {client.riskScores.overall > 40 ? 2 : 1}
                            </p>
                          </div>
                          <Activity className="w-8 h-8 text-blue-600" />
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Completed</p>
                            <p className="text-3xl font-bold text-green-600">
                              {client.documentsData.verified}
                            </p>
                          </div>
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                      </div>
                    </div>

                    {/* Action Items List */}
                    <div className="space-y-3">
                      {/* Overdue Actions - Show if high risk */}
                      {client.riskScores.overall > 70 && (
                        <>
                          <Card className="border-l-4 border-l-red-600 bg-red-50/30 hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded">OVERDUE</span>
                                    <span className="px-3 py-1 bg-gray-600 text-white text-xs font-bold rounded">HIGH PRIORITY</span>
                                  </div>
                                  <h4 className="font-bold text-lg mb-1">Annual KYC Review Required</h4>
                                  <p className="text-sm text-gray-600 mb-2">Complete annual KYC review and update client file - 12 days overdue</p>
                                  <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      <span>Due: {new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toLocaleDateString('en-AU')}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <User className="w-4 h-4" />
                                      <span>Assigned: Sarah Chen</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" className="bg-[#13B5EA] hover:bg-[#0E7C9E] text-white">
                                    <CheckSquare className="w-4 h-4 mr-1" />
                                    Complete
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="border-l-4 border-l-red-600 bg-red-50/30 hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded">OVERDUE</span>
                                    <span className="px-3 py-1 bg-red-700 text-white text-xs font-bold rounded">CRITICAL</span>
                                  </div>
                                  <h4 className="font-bold text-lg mb-1">Enhanced Due Diligence Required</h4>
                                  <p className="text-sm text-gray-600 mb-2">
                                    High risk rating detected - immediate EDD and senior approval needed
                                  </p>
                                  <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      <span>Due: {new Date().toLocaleDateString('en-AU')}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <User className="w-4 h-4" />
                                      <span>Assigned: Head of Compliance</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" className="bg-[#13B5EA] hover:bg-[#0E7C9E] text-white">
                                    <CheckSquare className="w-4 h-4 mr-1" />
                                    Complete EDD
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      )}

                      {/* Medium Risk - 1 Overdue */}
                      {client.riskScores.overall > 50 && client.riskScores.overall <= 70 && (
                        <Card className="border-l-4 border-l-red-600 bg-red-50/30 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded">OVERDUE</span>
                                  <span className="px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded">MEDIUM PRIORITY</span>
                                </div>
                                <h4 className="font-bold text-lg mb-1">Risk Assessment Update Required</h4>
                                <p className="text-sm text-gray-600 mb-2">Quarterly risk assessment overdue - requires immediate attention</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Due: {new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-AU')}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    <span>Assigned: Risk Team</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" className="bg-[#13B5EA] hover:bg-[#0E7C9E] text-white">
                                  <CheckSquare className="w-4 h-4 mr-1" />
                                  Complete
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Due Soon - Document Verification */}
                      {client.documentsData.pending > 0 && (
                        <Card className="border-l-4 border-l-[#FFA300] bg-orange-50/30 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="px-3 py-1 bg-[#FFA300] text-white text-xs font-bold rounded">DUE IN 3 DAYS</span>
                                  <span className="px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded">MEDIUM PRIORITY</span>
                                </div>
                                <h4 className="font-bold text-lg mb-1">Document Verification Required</h4>
                                <p className="text-sm text-gray-600 mb-2">
                                  {client.documentsData.pending} pending documents need review and verification
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Due: {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-AU')}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <FileText className="w-4 h-4" />
                                    <span>{client.documentsData.pending} documents</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  View Documents
                                </Button>
                                <Button size="sm" className="bg-[#13B5EA] hover:bg-[#0E7C9E] text-white">
                                  <CheckSquare className="w-4 h-4 mr-1" />
                                  Review
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Due Soon - Monitoring Alerts */}
                      {client.monitoringData.activeAlerts > 0 && (
                        <Card className="border-l-4 border-l-[#FFA300] bg-orange-50/30 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="px-3 py-1 bg-[#FFA300] text-white text-xs font-bold rounded">DUE IN 5 DAYS</span>
                                  <span className="px-3 py-1 bg-yellow-600 text-white text-xs font-bold rounded">MEDIUM PRIORITY</span>
                                </div>
                                <h4 className="font-bold text-lg mb-1">Monitoring Alert Investigation</h4>
                                <p className="text-sm text-gray-600 mb-2">
                                  {client.monitoringData.activeAlerts} active monitoring alerts require investigation
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Due: {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-AU')}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>{client.monitoringData.activeAlerts} active alerts</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  View Alerts
                                </Button>
                                <Button size="sm" className="bg-[#13B5EA] hover:bg-[#0E7C9E] text-white">
                                  <CheckSquare className="w-4 h-4 mr-1" />
                                  Investigate
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* In Progress - Risk Assessment */}
                      <Card className="border-l-4 border-l-blue-600 bg-blue-50/30 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded">IN PROGRESS</span>
                                <span className="px-3 py-1 bg-gray-600 text-white text-xs font-bold rounded">NORMAL PRIORITY</span>
                              </div>
                              <h4 className="font-bold text-lg mb-1">
                                {client.riskScores.overall > 60 ? 'Enhanced Due Diligence' : 'Risk Assessment Update'}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">
                                {client.riskScores.overall > 60
                                  ? 'Enhanced due diligence review in progress - 45% complete'
                                  : 'Quarterly risk assessment in progress - 60% complete'}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>Due: {client.nextReview}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  <span>Assigned: Risk Team</span>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: client.riskScores.overall > 60 ? '45%' : '60%' }}
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" className="bg-[#13B5EA] hover:bg-[#0E7C9E] text-white">
                                Continue
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* In Progress - Ownership Verification (if applicable) */}
                      {client.entityType === 'Company' && (
                        <Card className="border-l-4 border-l-blue-600 bg-blue-50/30 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded">IN PROGRESS</span>
                                  <span className="px-3 py-1 bg-gray-600 text-white text-xs font-bold rounded">NORMAL PRIORITY</span>
                                </div>
                                <h4 className="font-bold text-lg mb-1">Beneficial Ownership Verification</h4>
                                <p className="text-sm text-gray-600 mb-2">
                                  Verifying beneficial ownership structure and control persons - 75% complete
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Due: {new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString('en-AU')}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    <span>Assigned: KYC Officer</span>
                                  </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }} />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" className="bg-[#13B5EA] hover:bg-[#0E7C9E] text-white">
                                  Continue
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Completed Actions */}
                      <Card className="border-l-4 border-l-green-600 bg-green-50/20 opacity-75 hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded">COMPLETED</span>
                              </div>
                              <h4 className="font-bold text-lg mb-1 line-through text-gray-500">Identity Verification</h4>
                              <p className="text-sm text-gray-400 mb-2">
                                {(client.identityData.greenIDScore || client.identityData.infoTrackStatus) ? 'GreenID and InfoTrack verification completed successfully' : 'Identity verification completed'}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <span>Completed: {client.lastReview}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  <span>By: Sarah Chen</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-green-600 bg-green-50/20 opacity-75 hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded">COMPLETED</span>
                              </div>
                              <h4 className="font-bold text-lg mb-1 line-through text-gray-500">AML Screening</h4>
                              <p className="text-sm text-gray-500 mb-2">
                                Sanctions, PEP, and adverse media screening completed - no matches found
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <span>Completed: {new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-AU')}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  <span>By: Compliance Team</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* IDENTITY TAB */}
            {activeTab === 'identity' && (
              <IdentityTab client={client} />
            )}

            {/* AML TAB */}
            {activeTab === 'aml' && (
              <Card className="border-2 border-blue-300 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-blue-600" />
                    AML/CTF Screening
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Risk Rating Banner */}
                  <div className={`mb-6 rounded-lg p-6 border-2 ${client.amlData.riskRating === 'Critical' ? 'bg-red-50 border-red-300' :
                    client.amlData.riskRating === 'High' ? 'bg-orange-50 border-orange-300' :
                      client.amlData.riskRating === 'Medium' ? 'bg-yellow-50 border-yellow-300' :
                        'bg-green-50 border-green-300'
                    }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">AML/CTF Risk Rating</p>
                        <p className={`text-3xl font-bold ${client.amlData.riskRating === 'Critical' ? 'text-red-600' :
                          client.amlData.riskRating === 'High' ? 'text-orange-600' :
                            client.amlData.riskRating === 'Medium' ? 'text-yellow-600' :
                              'text-green-600'
                          }`}>
                          {client.amlData.riskRating}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Last Screening</p>
                        <p className="text-lg font-bold">{client.amlData.lastScreeningDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Screening Results */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className={`rounded-lg p-4 border-2 ${client.amlData.sanctionsMatches > 0 ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-200'
                      }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {client.amlData.sanctionsMatches > 0 ? (
                          <XCircle className="w-6 h-6 text-red-600" />
                        ) : (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        )}
                        <p className="font-semibold">Sanctions</p>
                      </div>
                      <p className="text-3xl font-bold">{client.amlData.sanctionsMatches}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {client.amlData.sanctionsMatches > 0 ? 'Matches Found' : 'No Matches'}
                      </p>
                    </div>

                    <div className={`rounded-lg p-4 border-2 ${client.amlData.pepStatus !== 'Not PEP' ? 'bg-orange-50 border-orange-300' : 'bg-green-50 border-green-200'
                      }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {client.amlData.pepStatus !== 'Not PEP' ? (
                          <AlertTriangle className="w-6 h-6 text-orange-600" />
                        ) : (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        )}
                        <p className="font-semibold">PEP Status</p>
                      </div>
                      <p className="text-xl font-bold">{client.amlData.pepStatus}</p>
                    </div>

                    <div className={`rounded-lg p-4 border-2 ${client.amlData.adverseMediaHits > 5 ? 'bg-red-50 border-red-300' :
                      client.amlData.adverseMediaHits > 0 ? 'bg-yellow-50 border-yellow-200' :
                        'bg-green-50 border-green-200'
                      }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {client.amlData.adverseMediaHits > 5 ? (
                          <XCircle className="w-6 h-6 text-red-600" />
                        ) : client.amlData.adverseMediaHits > 0 ? (
                          <AlertTriangle className="w-6 h-6 text-yellow-600" />
                        ) : (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        )}
                        <p className="font-semibold">Adverse Media</p>
                      </div>
                      <p className="text-3xl font-bold">{client.amlData.adverseMediaHits}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {client.amlData.adverseMediaHits > 0 ? 'Hits Found' : 'No Hits'}
                      </p>
                    </div>
                  </div>

                  {/* WorldCheck Status */}
                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-4">WorldCheck Status</h3>
                    <div className={`rounded-lg p-4 border-2 ${client.amlData.worldCheckStatus.includes('CRITICAL') ? 'bg-red-50 border-red-300' :
                      client.amlData.worldCheckStatus.includes('PEP') ? 'bg-orange-50 border-orange-300' :
                        'bg-green-50 border-green-200'
                      }`}>
                      <p className="text-lg font-bold">{client.amlData.worldCheckStatus}</p>
                    </div>
                  </div>

                  {/* Transaction Monitoring */}
                  <div>
                    <h3 className="font-bold text-lg mb-4">Transaction Monitoring</h3>
                    <div className={`rounded-lg p-4 border ${client.amlData.transactionMonitoring === 'Active' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                      }`}>
                      <div className="flex items-center gap-2">
                        <Activity className={`w-5 h-5 ${client.amlData.transactionMonitoring === 'Active' ? 'text-green-600' : 'text-gray-400'}`} />
                        <p className="font-semibold">Status: {client.amlData.transactionMonitoring}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AML Detailed Hits */}
            {activeTab === 'aml' && (
              <div className="mt-6">
                <AMLHitsDetail clientId={getMockId(client.id)} />
              </div>
            )}

            {/* Related Entities Tab */}
            {activeTab === 'related-entities' && (
              <RelatedEntitiesTab clientId={getMockId(client.id)} />
            )}

            {/* Remaining Tabs Component */}
            <RemainingTabs activeTab={activeTab as any} client={{ ...client, id: getMockId(client.id) }} />
          </div>
        </div>
      </div>
    </div>
  );
}