import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from '../../lib/toast';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { RemainingTabs } from './RemainingTabs';
import { AMLHitsDetail } from './AMLHitsDetail';
import { RelatedEntitiesTab } from './RelatedEntitiesTab';
import { IdentityTab } from '../grow-kyc/IdentityTab';
import { ClientsDB, TestClient } from './ClientsDatabase';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  User,
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
  ,
  Building
} from 'lucide-react';

type TabType = 'overview' | 'actions' | 'identity' | 'aml' | 'entity' | 'ownership' | 'financial' | 'fraud' | 'legal' | 'run-checks' | 'compliance' | 'documents' | 'monitoring' | 'decisions' | 'austrac' | 'audit' | 'related-entities';

const TEST_CLIENTS: TestClient[] = [
  {
    id: 'client-001',
    name: 'ABC Enterprises Pty Ltd',
    entityType: 'Company',
    status: 'Active',
    abn: '12 345 678 901',
    acn: '123 456 789',
    country: 'Australia',
    industry: 'Technology Services',
    serviceType: 'Trust Administration',
    clientGroup: 'Professional Services',
    riskScores: {
      overall: 42,
      aml: 38,
      financial: 55,
      business: 48,
      ownership: 35
    },
    quickStatus: {
      identity: 'Verified',
      aml: '2 Matches',
      entity: 'Active',
      monitoring: 'Active'
    },
    lastReview: '2026-03-15',
    nextReview: '2026-06-15',
    identityData: {
      primaryID: { type: 'Passport', number: 'N1234567', expiry: '2028-06-15', verified: true },
      secondaryID: { type: 'Driver License', number: '12345678', expiry: '2027-03-20', verified: true },
      additionalDocuments: [
        { type: 'Medicare Card', number: '1234 56789 0', expiry: '2026-12-31', verified: true },
        { type: 'Utility Bill', number: 'UB-998877', verified: true }
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
      adverseMediaHits: 2,
      worldCheckStatus: 'Clear',
      transactionMonitoring: 'Active',
      riskRating: 'Low',
      lastScreeningDate: '2026-03-21'
    },
    entityData: {
      registrationDate: '2018-03-15',
      asicStatus: 'Registered',
      companyStatus: 'Active',
      lastRegistrySync: '2026-03-20T09:15:00+11:00',
      registrationHistory: [
        { date: '2018-03-15', event: 'Company registered — ACN issued', source: 'ASIC' },
        { date: '2020-06-01', event: 'Director appointed — Sarah Williams', source: 'ASIC' },
        { date: '2025-06-30', event: 'Annual review lodged', source: 'ASIC' },
        { date: '2026-03-18', event: 'Change to principal place of business notified', source: 'ASIC' }
      ],
      keyDates: [
        { label: 'ACN issued', date: '2018-03-15', detail: '123 456 789' },
        { label: 'Last annual review lodged', date: '2025-06-30' },
        { label: 'Next annual review due', date: '2026-06-30' }
      ],
      directors: [
        {
          name: 'Michael Chen',
          appointed: '2018-03-15',
          dateOfBirth: '1978-04-22',
          role: 'Director',
          kycStatus: 'Verified',
          screeningBatches: ['AML-2026-Q1-8841', 'PEP-2026-03-12', 'Media-2026-03-12']
        },
        {
          name: 'Sarah Williams',
          appointed: '2020-06-01',
          dateOfBirth: '1982-11-03',
          role: 'Director',
          kycStatus: 'Verified',
          screeningBatches: ['AML-2026-Q1-8842', 'PEP-2026-03-18']
        }
      ],
      shareholders: [
        { name: 'Michael Chen', shares: 60, percentage: 60 },
        { name: 'Sarah Williams', shares: 40, percentage: 40 }
      ]
    },
    ownershipData: {
      ubos: [
        { name: 'Michael Chen', ownership: 60, verified: true, country: 'Australia' },
        { name: 'Sarah Williams', ownership: 40, verified: true, country: 'Australia' }
      ],
      ownershipStructureComplete: true,
      complexStructure: false
    },
    financialData: {
      bankAccounts: 3,
      sourceOfFunds: 'Business revenue and retained earnings',
      sourceOfWealth: 'Technology consulting services',
      estimatedWealth: '$2.5M - $5M',
      transactionVolume: '$500K - $1M monthly',
      highRiskTransactions: 0
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2026-01-15',
      kycConsentDate: '2026-01-15'
    },
    documentsData: {
      total: 24,
      verified: 22,
      pending: 2,
      rejected: 0
    },
    monitoringData: {
      alertsLast30Days: 3,
      activeAlerts: 0,
      nameChanges: 0,
      addressChanges: 1,
      ownershipChanges: 0
    },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2026-01-20',
      approver: 'Jane Smith - Compliance Manager',
      riskAssessments: 4,
      escalations: 0
    },
    austracData: {
      smrsFiled: 0,
      ttrsFiled: 12,
      lastReportDate: '2026-03-15',
      suspiciousActivity: false
    },
    auditData: {
      totalEvents: 156,
      lastActivity: '2026-03-21 14:35:22',
      lastUser: 'compliance.officer@grow.com'
    }
  },
  {
    id: 'client-002',
    name: 'The Smith Family Trust',
    entityType: 'Trust',
    status: 'Active',
    abn: '98 765 432 109',
    country: 'Australia',
    industry: 'Investment & Wealth Management',
    serviceType: 'Trust Administration',
    clientGroup: 'High Net Worth',
    riskScores: {
      overall: 58,
      aml: 52,
      financial: 65,
      business: 48,
      ownership: 72
    },
    quickStatus: {
      identity: 'Verified',
      aml: 'Clear',
      entity: 'Active',
      monitoring: 'Active'
    },
    lastReview: '2026-02-28',
    nextReview: '2026-08-28',
    identityData: {
      primaryID: { type: 'Driver License', number: 'NSW98765432', expiry: '2029-12-31', verified: true },
      secondaryID: { type: 'Medicare Card', number: '2234 56789 0', expiry: '2027-01-01', verified: true },
      additionalDocuments: [
        { type: 'Bank Statement', number: 'ACC-123456', verified: true },
        { type: 'Utility Bill', number: 'GAS-554433', verified: true }
      ],
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
      lastScreeningDate: '2026-03-20'
    },
    entityData: {
      registrationDate: '2010-06-22',
      asicStatus: 'Scheme — trust not ASIC-registered as company',
      companyStatus: 'Active (trust deed current)',
      lastRegistrySync: '2026-03-19T14:02:00+11:00',
      registrationHistory: [
        { date: '2010-06-22', event: 'Trust established — deed executed', source: 'Trust deed / KYC' },
        { date: '2018-09-01', event: 'Deed of variation — trustee powers updated', source: 'Trust deed' },
        { date: '2025-11-10', event: 'Beneficiary class amended (education fund)', source: 'Trust deed' }
      ],
      keyDates: [
        { label: 'Trust establishment', date: '2010-06-22' },
        { label: 'Last deed variation', date: '2018-09-01' },
        { label: 'Next KYC review due', date: '2026-08-28' }
      ],
      trustType: 'Discretionary Family Trust',
      trustees: [
        { name: 'Robert Smith', type: 'Individual' },
        { name: 'Margaret Smith', type: 'Individual' }
      ],
      beneficiaries: [
        { name: 'Smith Family Members', entitlement: 'Discretionary' },
        { name: 'Smith Children Education Fund', entitlement: '25% Fixed' }
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
      sourceOfFunds: 'Investment returns, rental income, dividends',
      sourceOfWealth: 'Accumulated wealth from property and share investments',
      estimatedWealth: '$10M - $25M',
      transactionVolume: '$1M - $2M monthly',
      highRiskTransactions: 2
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2025-11-10',
      kycConsentDate: '2025-11-10'
    },
    documentsData: {
      total: 42,
      verified: 39,
      pending: 3,
      rejected: 0
    },
    monitoringData: {
      alertsLast30Days: 5,
      activeAlerts: 1,
      nameChanges: 0,
      addressChanges: 0,
      ownershipChanges: 1
    },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2025-11-18',
      approver: 'David Lee - Senior Compliance Officer',
      riskAssessments: 6,
      escalations: 1
    },
    austracData: {
      smrsFiled: 0,
      ttrsFiled: 28,
      lastReportDate: '2026-03-10',
      suspiciousActivity: false
    },
    auditData: {
      totalEvents: 289,
      lastActivity: '2026-03-20 16:22:11',
      lastUser: 'trust.admin@grow.com'
    }
  },
  {
    id: 'client-003',
    name: 'Dr. James Patterson',
    entityType: 'Individual',
    status: 'Active',
    tfn: '123 456 789',
    country: 'Australia',
    industry: 'Healthcare - Medical Practitioner',
    serviceType: 'Wealth Management',
    clientGroup: 'Professional Individual',
    riskScores: {
      overall: 72,
      aml: 85,
      financial: 45,
      business: 55,
      ownership: 0
    },
    quickStatus: {
      identity: 'Verified',
      aml: 'PEP Match',
      entity: 'N/A',
      monitoring: 'Enhanced'
    },
    lastReview: '2026-03-10',
    nextReview: '2026-04-10',
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
      lastScreeningDate: '2026-03-21'
    },
    entityData: {},
    ownershipData: {
      ubos: [
        { name: 'Dr. James Patterson', ownership: 100, verified: true, country: 'Australia' }
      ],
      ownershipStructureComplete: true,
      complexStructure: false
    },
    financialData: {
      bankAccounts: 4,
      sourceOfFunds: 'Medical practice income, consulting fees',
      sourceOfWealth: 'Professional medical practice income over 25 years',
      estimatedWealth: '$5M - $10M',
      transactionVolume: '$200K - $500K monthly',
      highRiskTransactions: 1
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2025-09-22',
      kycConsentDate: '2025-09-22'
    },
    documentsData: {
      total: 31,
      verified: 28,
      pending: 2,
      rejected: 1
    },
    monitoringData: {
      alertsLast30Days: 8,
      activeAlerts: 2,
      nameChanges: 0,
      addressChanges: 0,
      ownershipChanges: 0
    },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2025-10-05',
      approver: 'Emma Thompson - Head of Compliance',
      riskAssessments: 8,
      escalations: 3
    },
    austracData: {
      smrsFiled: 0,
      ttrsFiled: 15,
      lastReportDate: '2026-03-05',
      suspiciousActivity: false
    },
    auditData: {
      totalEvents: 412,
      lastActivity: '2026-03-21 11:18:45',
      lastUser: 'edd.specialist@grow.com'
    }
  },
  {
    id: 'client-004',
    name: 'Global Trade Solutions Ltd',
    entityType: 'Company',
    status: 'Under Review',
    abn: '45 678 912 345',
    acn: '456 789 123',
    country: 'Australia',
    industry: 'Import/Export',
    serviceType: 'Corporate Banking',
    clientGroup: 'International Trade',
    riskScores: {
      overall: 88,
      aml: 92,
      financial: 78,
      business: 85,
      ownership: 95
    },
    quickStatus: {
      identity: 'Verified',
      aml: 'SANCTIONS',
      entity: 'Active',
      monitoring: 'Enhanced'
    },
    lastReview: '2026-03-21',
    nextReview: '2026-03-28',
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
      lastScreeningDate: '2026-03-21'
    },
    entityData: {
      registrationDate: '2022-11-08',
      asicStatus: 'Registered',
      companyStatus: 'Active',
      lastRegistrySync: '2026-03-21T08:40:00+11:00',
      registrationHistory: [
        { date: '2022-11-08', event: 'Company registered', source: 'ASIC' },
        { date: '2023-03-15', event: 'Director appointed — Anna Kowalski', source: 'ASIC' },
        { date: '2024-01-10', event: 'Director appointed — Chen Wei', source: 'ASIC' },
        { date: '2026-03-12', event: 'Change to share structure notified', source: 'ASIC' }
      ],
      keyDates: [
        { label: 'ACN issued', date: '2022-11-08', detail: '456 789 123' },
        { label: 'Last ASIC extract (KYC)', date: '2026-03-21' },
        { label: 'Next KYC review due', date: '2026-03-28' }
      ],
      directors: [
        {
          name: 'Viktor Petrov',
          appointed: '2022-11-08',
          dateOfBirth: '1975-02-14',
          role: 'Director',
          kycStatus: 'Enhanced review',
          screeningBatches: ['AML-2026-CRIT-9910', 'Sanctions-daily-2026-03-21', 'PEP-2026-03-21', 'EDD-batch-442']
        },
        {
          name: 'Anna Kowalski',
          appointed: '2023-03-15',
          dateOfBirth: '1988-09-30',
          role: 'Director',
          kycStatus: 'Pending',
          screeningBatches: ['AML-2026-Q1-9012']
        },
        {
          name: 'Chen Wei',
          appointed: '2024-01-10',
          dateOfBirth: '1990-01-08',
          role: 'Director',
          kycStatus: 'Verified',
          screeningBatches: ['AML-2026-Q1-9013', 'PEP-2026-03-19']
        }
      ],
      shareholders: [
        { name: 'Offshore Holdings BVI', shares: 65, percentage: 65 },
        { name: 'Viktor Petrov', shares: 20, percentage: 20 },
        { name: 'Chen Wei', shares: 15, percentage: 15 }
      ]
    },
    ownershipData: {
      ubos: [
        { name: 'Viktor Petrov', ownership: 45, verified: true, country: 'Russia' },
        { name: 'Unknown Beneficial Owner(s)', ownership: 15, verified: false, country: 'British Virgin Islands' },
        { name: 'Chen Wei', ownership: 15, verified: true, country: 'China' }
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
      engagementLetterDate: '2024-08-15',
      kycConsentDate: '2024-08-15'
    },
    documentsData: {
      total: 58,
      verified: 35,
      pending: 18,
      rejected: 5
    },
    monitoringData: {
      alertsLast30Days: 24,
      activeAlerts: 12,
      nameChanges: 2,
      addressChanges: 3,
      ownershipChanges: 4
    },
    decisionsData: {
      onboardingDecision: 'Pending',
      onboardingDate: '',
      approver: 'Tom Anderson - Chief Compliance Officer',
      riskAssessments: 15,
      escalations: 8
    },
    austracData: {
      smrsFiled: 4,
      ttrsFiled: 87,
      lastReportDate: '2026-03-18',
      suspiciousActivity: true
    },
    auditData: {
      totalEvents: 1247,
      lastActivity: '2026-03-21 15:42:33',
      lastUser: 'sanctions.team@grow.com'
    }
  },
  {
    id: 'client-005',
    name: 'Anderson & Partners LLP',
    entityType: 'Partnership',
    status: 'Active',
    abn: '87 654 321 098',
    country: 'Australia',
    industry: 'Legal Services',
    serviceType: 'Trust Account Management',
    clientGroup: 'Professional Services',
    riskScores: {
      overall: 35,
      aml: 28,
      financial: 42,
      business: 38,
      ownership: 30
    },
    quickStatus: {
      identity: 'Verified',
      aml: 'Clear',
      entity: 'Active',
      monitoring: 'Standard'
    },
    lastReview: '2026-01-30',
    nextReview: '2026-07-30',
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
      lastScreeningDate: '2026-03-15'
    },
    entityData: {
      registrationDate: '2015-04-12',
      asicStatus: 'ABN active — partnership',
      companyStatus: 'Active',
      lastRegistrySync: '2026-03-15T11:00:00+11:00',
      registrationHistory: [
        { date: '2015-04-12', event: 'Partnership commenced / ABN application granted', source: 'ABR' },
        { date: '2018-07-01', event: 'Partner admitted — Sarah Thompson', source: 'Partnership agreement' },
        { date: '2021-01-15', event: 'Partner admitted — David Chang', source: 'Partnership agreement' }
      ],
      keyDates: [
        { label: 'ABN effective', date: '2015-04-12' },
        { label: 'Last partnership deed update', date: '2021-01-15' },
        { label: 'Next KYC review due', date: '2026-07-30' }
      ],
      directors: [
        {
          name: 'Jennifer Anderson',
          appointed: '2015-04-12',
          dateOfBirth: '1972-06-18',
          role: 'Partner',
          kycStatus: 'Verified',
          screeningBatches: ['AML-2025-Q4-7100', 'PEP-2026-01-08']
        },
        {
          name: 'Michael O\'Brien',
          appointed: '2015-04-12',
          dateOfBirth: '1970-03-25',
          role: 'Partner',
          kycStatus: 'Verified',
          screeningBatches: ['AML-2025-Q4-7101', 'PEP-2026-01-08']
        },
        {
          name: 'Sarah Thompson',
          appointed: '2018-07-01',
          dateOfBirth: '1985-12-01',
          role: 'Partner',
          kycStatus: 'Verified',
          screeningBatches: ['AML-2026-Q1-7202', 'Media-2026-02-01']
        },
        {
          name: 'David Chang',
          appointed: '2021-01-15',
          dateOfBirth: '1991-07-09',
          role: 'Partner',
          kycStatus: 'Pending',
          screeningBatches: ['AML-2026-Q1-7203']
        }
      ]
    },
    ownershipData: {
      ubos: [
        { name: 'Jennifer Anderson', ownership: 35, verified: true, country: 'Australia' },
        { name: 'Michael O\'Brien', ownership: 35, verified: true, country: 'Australia' },
        { name: 'Sarah Thompson', ownership: 20, verified: true, country: 'Australia' },
        { name: 'David Chang', ownership: 10, verified: true, country: 'Australia' }
      ],
      ownershipStructureComplete: true,
      complexStructure: false
    },
    financialData: {
      bankAccounts: 6,
      sourceOfFunds: 'Legal services fees, client trust accounts',
      sourceOfWealth: 'Partnership income from legal practice',
      estimatedWealth: '$5M - $10M',
      transactionVolume: '$800K - $1.5M monthly',
      highRiskTransactions: 0
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2025-06-20',
      kycConsentDate: '2025-06-20'
    },
    documentsData: {
      total: 35,
      verified: 34,
      pending: 1,
      rejected: 0
    },
    monitoringData: {
      alertsLast30Days: 2,
      activeAlerts: 0,
      nameChanges: 0,
      addressChanges: 0,
      ownershipChanges: 0
    },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2025-07-01',
      approver: 'Lisa Chen - Compliance Officer',
      riskAssessments: 3,
      escalations: 0
    },
    austracData: {
      smrsFiled: 0,
      ttrsFiled: 45,
      lastReportDate: '2026-02-28',
      suspiciousActivity: false
    },
    auditData: {
      totalEvents: 234,
      lastActivity: '2026-03-19 09:15:28',
      lastUser: 'relationship.manager@grow.com'
    }
  },
  {
    id: 'client-006',
    name: 'Pacific Investment Holdings Pte Ltd',
    entityType: 'Foreign Entity',
    status: 'Active',
    country: 'Singapore',
    industry: 'Investment Management',
    serviceType: 'Investment Advisory',
    clientGroup: 'International Institutional',
    riskScores: {
      overall: 65,
      aml: 68,
      financial: 58,
      business: 62,
      ownership: 75
    },
    quickStatus: {
      identity: 'Verified',
      aml: '1 Match',
      entity: 'Foreign',
      monitoring: 'Enhanced'
    },
    lastReview: '2026-03-05',
    nextReview: '2026-05-05',
    identityData: {
      primaryID: { type: 'Certificate of Incorporation', number: 'SG201912345A', expiry: 'N/A', verified: true },
      biometricStatus: 'Not Required',
      livenessCheck: false,
      addressVerified: true,
      infoTrackStatus: 'Foreign Entity - Apostille Verified'
    },
    amlData: {
      sanctionsMatches: 0,
      pepStatus: 'Foreign PEP',
      adverseMediaHits: 3,
      worldCheckStatus: 'Foreign PEP Association - Enhanced Monitoring',
      transactionMonitoring: 'Active',
      riskRating: 'Medium',
      lastScreeningDate: '2026-03-21'
    },
    entityData: {
      registrationDate: '2019-08-15',
      asicStatus: 'Foreign company (ARBN) registered in Australia',
      companyStatus: 'Active (foreign company)',
      lastRegistrySync: '2026-03-17T16:30:00+11:00',
      registrationHistory: [
        { date: '2019-08-15', event: 'Singapore incorporation; Australian branch/ARBN registration', source: 'ASIC / ACRA' },
        { date: '2020-02-10', event: 'Local director appointed — Priya Sharma', source: 'ASIC' },
        { date: '2024-11-05', event: 'Annual financial report lodged (foreign)', source: 'ASIC' }
      ],
      keyDates: [
        { label: 'Foreign registration (AU)', date: '2019-08-15' },
        { label: 'Last financial report (AU)', date: '2024-11-05' },
        { label: 'Next KYC review due', date: '2026-05-05' }
      ],
      directors: [
        {
          name: 'Lawrence Tan',
          appointed: '2019-08-15',
          dateOfBirth: '1968-05-20',
          role: 'Director',
          kycStatus: 'Verified',
          screeningBatches: ['AML-2026-INTL-5501', 'PEP-2026-03-05', 'Sanctions-daily-2026-03-17']
        },
        {
          name: 'Priya Sharma',
          appointed: '2020-02-10',
          dateOfBirth: '1984-10-16',
          role: 'Director',
          kycStatus: 'Verified',
          screeningBatches: ['AML-2026-INTL-5502', 'PEP-2026-03-10']
        }
      ],
      shareholders: [
        { name: 'Pacific Holdings Group', shares: 80, percentage: 80 },
        { name: 'Lawrence Tan', shares: 20, percentage: 20 }
      ]
    },
    ownershipData: {
      ubos: [
        { name: 'Lawrence Tan', ownership: 35, verified: true, country: 'Singapore' },
        { name: 'Tan Family Trust', ownership: 45, verified: true, country: 'Singapore' },
        { name: 'Strategic Partners Group', ownership: 20, verified: true, country: 'Hong Kong' }
      ],
      ownershipStructureComplete: true,
      complexStructure: true
    },
    financialData: {
      bankAccounts: 4,
      sourceOfFunds: 'Investment management fees, carried interest',
      sourceOfWealth: 'Investment fund operations and management',
      estimatedWealth: '$50M - $100M',
      transactionVolume: '$3M - $5M monthly',
      highRiskTransactions: 5
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2025-08-10',
      kycConsentDate: '2025-08-10'
    },
    documentsData: {
      total: 52,
      verified: 45,
      pending: 5,
      rejected: 2
    },
    monitoringData: {
      alertsLast30Days: 7,
      activeAlerts: 2,
      nameChanges: 0,
      addressChanges: 1,
      ownershipChanges: 2
    },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2025-09-15',
      approver: 'Emma Thompson - Head of Compliance',
      riskAssessments: 9,
      escalations: 2
    },
    austracData: {
      smrsFiled: 1,
      ttrsFiled: 34,
      lastReportDate: '2026-03-01',
      suspiciousActivity: false
    },
    auditData: {
      totalEvents: 567,
      lastActivity: '2026-03-21 13:27:56',
      lastUser: 'international.team@grow.com'
    }
  },
  {
    id: 'client-007',
    name: 'Legacy Holdings Pty Ltd',
    entityType: 'Company',
    status: 'Inactive',
    abn: '11 222 333 444',
    acn: '112 233 445',
    country: 'Australia',
    industry: 'Property',
    serviceType: 'Wealth Management',
    clientGroup: 'Historical',
    riskScores: { overall: 30, aml: 25, financial: 28, business: 32, ownership: 28 },
    quickStatus: { identity: 'Verified', aml: 'Clear', entity: 'Closed', monitoring: 'Inactive' },
    lastReview: '2024-11-01',
    nextReview: 'N/A — file closed',
    identityData: {
      primaryID: { type: 'Company Extract (archived)', number: 'ASIC-112233445', expiry: 'N/A', verified: true },
      biometricStatus: 'Not Required',
      livenessCheck: false,
      addressVerified: true
    },
    amlData: {
      sanctionsMatches: 0,
      pepStatus: 'Not PEP',
      adverseMediaHits: 0,
      worldCheckStatus: 'Clear',
      transactionMonitoring: 'Inactive',
      riskRating: 'Low',
      lastScreeningDate: '2024-10-15'
    },
    entityData: {
      registrationDate: '2005-02-10',
      asicStatus: 'Deregistered',
      companyStatus: 'Deregistered',
      lastRegistrySync: '2024-12-02T10:00:00+11:00',
      registrationHistory: [
        { date: '2005-02-10', event: 'Company registered', source: 'ASIC' },
        { date: '2019-08-20', event: 'Director change lodged', source: 'ASIC' },
        { date: '2024-11-28', event: 'Voluntary deregistration application lodged', source: 'ASIC' },
        { date: '2024-12-01', event: 'Company deregistered', source: 'ASIC' }
      ],
      keyDates: [
        { label: 'ACN issued', date: '2005-02-10', detail: '112 233 445' },
        { label: 'Deregistration effective', date: '2024-12-01' },
        { label: 'Last registry sync (archive)', date: '2024-12-02' }
      ],
      directors: [
        {
          name: 'Former Director (archived)',
          appointed: '2005-02-10',
          resigned: '2024-11-01',
          dateOfBirth: '1965-01-12',
          role: 'Director',
          kycStatus: 'Closed — entity deregistered',
          screeningBatches: ['AML-archive-LEG-01']
        }
      ],
      shareholders: [{ name: 'Former Shareholder (archived)', shares: 100, percentage: 100 }]
    },
    ownershipData: {
      ubos: [{ name: 'Former UBO (archived)', ownership: 100, verified: true, country: 'Australia' }],
      ownershipStructureComplete: true,
      complexStructure: false
    },
    financialData: {
      bankAccounts: 0,
      sourceOfFunds: 'N/A — entity closed',
      sourceOfWealth: 'Historical property development',
      estimatedWealth: 'N/A',
      transactionVolume: 'N/A',
      highRiskTransactions: 0
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      kycConsentDate: '2020-01-10'
    },
    documentsData: { total: 8, verified: 8, pending: 0, rejected: 0 },
    monitoringData: { alertsLast30Days: 0, activeAlerts: 0, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2020-01-12',
      approver: 'Compliance',
      riskAssessments: 1,
      escalations: 0
    },
    austracData: { smrsFiled: 0, ttrsFiled: 0, lastReportDate: undefined, suspiciousActivity: false },
    auditData: {
      totalEvents: 42,
      lastActivity: '2024-12-02 10:05:00',
      lastUser: 'system@grow.com'
    }
  }
];

interface ClientKYCDashboardProps {
  onBack?: () => void;
  clientId?: string;
}

export function ClientKYCDashboard({ onBack, clientId: propClientId }: ClientKYCDashboardProps = {}) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [clients, setClients] = useState<TestClient[]>(() => ClientsDB.getClients());
  const [selectedClientId, setSelectedClientId] = useState<string>(() => propClientId || ClientsDB.getClients()[0]?.id || '');
  const [runningCheck, setRunningCheck] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // Sync with prop if it changes
  useEffect(() => {
    if (propClientId && propClientId !== selectedClientId) {
      setSelectedClientId(propClientId);
    }
  }, [propClientId]);

  // Keep client data updated dynamically from ClientsDB
  useEffect(() => {
    const unsubscribe = ClientsDB.subscribe((updatedClients) => {
      setClients(updatedClients);
    });
    return () => unsubscribe();
  }, []);

  // Get selected client - attempt to find by ID or name, fallback to first client if not found
  const client = (clients.find(c =>
    c.id === selectedClientId ||
    c.name.toLowerCase() === decodeURIComponent(selectedClientId || '').toLowerCase()
  ) || clients[0]) as TestClient;

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

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-8">
        <div className="max-w-md w-full text-center p-8 bg-white border border-slate-100 rounded-2xl shadow-xl">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Clients Available</h2>
          <p className="text-sm text-slate-500 mb-6">
            There are currently no clients onboarded in the KYC Database. Go to Client Onboarding to add your first client.
          </p>
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOP SUMMARY STRIP */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 text-white shadow-xl">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-6 items-center">
            <div className="w-full lg:col-span-3">
              <div className="flex items-center gap-3 mb-2 sm:mb-3">
                {onBack && (
                  <button
                    onClick={onBack}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/25 transition-all text-white flex items-center justify-center cursor-pointer flex-shrink-0"
                    title="Back to KYC Dashboard"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div className="min-w-0">
                  <span className="text-[10px] uppercase tracking-wider opacity-85 block">Active Client Profile</span>
                  <div className="text-lg sm:text-xl font-bold tracking-tight text-white truncate">
                    {client?.name}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building className="w-6 h-6 sm:w-8 sm:h-8" />
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

            <div className="w-full lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center">
              <div className="bg-white/10 rounded-lg p-2 sm:p-3">
                <p className="text-[10px] sm:text-xs opacity-90">Overall Risk</p>
                <p className={`text-2xl sm:text-3xl font-bold ${client.riskScores.overall >= 80 ? 'text-red-200' : client.riskScores.overall >= 60 ? 'text-yellow-200' : 'text-green-200'}`}>
                  {client.riskScores.overall}
                </p>
                <p className="text-[10px] sm:text-xs">
                  {client.riskScores.overall < 40 ? 'Low' : client.riskScores.overall < 60 ? 'Medium' : client.riskScores.overall < 80 ? 'High' : 'Critical'}
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-2 sm:p-3">
                <p className="text-[10px] sm:text-xs opacity-90">Identity</p>
                <div className="flex items-center justify-center gap-1 mt-0.5 sm:mt-1">
                  {client.quickStatus.identity === 'Verified' ? (
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-300" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                  )}
                  <p className="text-sm sm:text-lg font-bold">{client.quickStatus.identity}</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-2 sm:p-3">
                <p className="text-[10px] sm:text-xs opacity-90">AML Status</p>
                <div className="flex items-center justify-center gap-1 mt-0.5 sm:mt-1">
                  {client.quickStatus.aml.includes('SANCTIONS') ? (
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-300" />
                  ) : client.quickStatus.aml === 'Clear' ? (
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-300" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                  )}
                  <p className="text-sm sm:text-lg font-bold">{client.quickStatus.aml}</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-2 sm:p-3">
                <p className="text-[10px] sm:text-xs opacity-90">Entity</p>
                <div className="flex items-center justify-center gap-1 mt-0.5 sm:mt-1">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-300" />
                  <p className="text-sm sm:text-lg font-bold">{client.quickStatus.entity}</p>
                </div>
              </div>
            </div>

            <div className="w-full lg:col-span-3 flex flex-wrap lg:justify-end gap-2">
              <Button
                variant="outline"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 flex-1 lg:flex-initial justify-center text-xs whitespace-nowrap"
                onClick={handleExportReport}
                disabled={isExporting}
              >
                {isExporting ? <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Download className="w-3.5 h-3.5 mr-1.5" />}
                {isExporting ? 'Exporting...' : 'Export Report'}
              </Button>
              <Button
                className="bg-green-500 hover:bg-green-600 text-white flex-1 lg:flex-initial justify-center text-xs whitespace-nowrap"
                onClick={handleApproveClient}
                disabled={isApproving || client.decisionsData?.onboardingDecision === 'Approved'}
              >
                {isApproving ? <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5 mr-1.5" />}
                {isApproving ? 'Approving...' : client.decisionsData?.onboardingDecision === 'Approved' ? 'Approved' : 'Approve Client'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-[2000px] mx-auto p-4 sm:p-8">
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
          <div className="col-span-12 lg:col-span-2">
            <Card className="lg:sticky lg:top-[200px] border-2 border-cyan-300 shadow-lg">
              <CardHeader className="bg-gray-50 border-b p-4">
                <CardTitle className="text-lg">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="flex flex-wrap lg:flex-col gap-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`w-auto lg:w-full flex items-center gap-2 lg:gap-3 px-2.5 lg:px-3 py-1.5 lg:py-2 rounded-lg text-left transition-all ${activeTab === tab.id
                          ? 'bg-cyan-600 text-white font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="col-span-12 lg:col-span-10">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <Card className="border-2 border-blue-300 shadow-lg">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      KYC Overview - {client.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    {/* Client Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-cyan-50 rounded-lg p-3 sm:p-4 border border-cyan-200">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Entity Type</p>
                        <p className="font-bold text-base sm:text-lg">{client.entityType}</p>
                      </div>
                      <div className="bg-cyan-50 rounded-lg p-3 sm:p-4 border border-cyan-200">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Country</p>
                        <p className="font-bold text-base sm:text-lg">{client.country}</p>
                      </div>
                      <div className="bg-cyan-50 rounded-lg p-3 sm:p-4 border border-cyan-200">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Industry</p>
                        <p className="font-bold text-base sm:text-lg">{client.industry}</p>
                      </div>
                      {client.abn && (
                        <div className="bg-cyan-50 rounded-lg p-3 sm:p-4 border border-cyan-200">
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">ABN</p>
                          <p className="font-bold text-base sm:text-lg">{client.abn}</p>
                        </div>
                      )}
                      {client.acn && (
                        <div className="bg-cyan-50 rounded-lg p-3 sm:p-4 border border-cyan-200">
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">ACN</p>
                          <p className="font-bold text-base sm:text-lg">{client.acn}</p>
                        </div>
                      )}
                      <div className="bg-cyan-50 rounded-lg p-3 sm:p-4 border border-cyan-200">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Service Type</p>
                        <p className="font-bold text-base sm:text-lg">{client.serviceType}</p>
                      </div>
                    </div>

                    {/* Dynamic Risk Scores Dashboard */}
                    <div className="mb-6">
                      <h3 className="font-bold text-base sm:text-lg mb-4">Risk Score Breakdown</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                        {Object.entries(client.riskScores).map(([key, value]) => (
                          <div key={key} className={`rounded-lg p-3 sm:p-4 border ${getRiskBg(value)}`}>
                            <p className="text-[10px] sm:text-xs uppercase text-gray-600 mb-1">{key}</p>
                            <p className={`text-2xl sm:text-3xl font-bold ${getRiskColor(value)}`}>{value}</p>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mt-2">
                              <div
                                className={`h-1.5 sm:h-2 rounded-full ${value < 40 ? 'bg-green-500' : value < 60 ? 'bg-yellow-500' : value < 80 ? 'bg-orange-500' : 'bg-red-500'}`}
                                style={{ width: `${value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Review Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-red-50 rounded-lg p-3 sm:p-4 border-2 border-red-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs sm:text-sm text-gray-600 mb-1">Overdue</p>
                            <p className="text-2xl sm:text-3xl font-bold text-red-600">
                              {client.riskScores.overall > 70 ? 2 : client.riskScores.overall > 50 ? 1 : 0}
                            </p>
                          </div>
                          <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 flex-shrink-0" />
                        </div>
                      </div>
                      <div className="bg-[#FFA300]/10 rounded-lg p-3 sm:p-4 border-2 border-[#FFA300]">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs sm:text-sm text-gray-600 mb-1">Due Soon</p>
                            <p className="text-2xl sm:text-3xl font-bold text-[#FFA300]">
                              {client.documentsData.pending + (client.monitoringData.activeAlerts > 0 ? 1 : 0)}
                            </p>
                          </div>
                          <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-[#FFA300] flex-shrink-0" />
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border-2 border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs sm:text-sm text-gray-600 mb-1">In Progress</p>
                            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                              {client.riskScores.overall > 40 ? 2 : 1}
                            </p>
                          </div>
                          <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 sm:p-4 border-2 border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs sm:text-sm text-gray-600 mb-1">Completed</p>
                            <p className="text-2xl sm:text-3xl font-bold text-green-600">
                              {client.documentsData.verified}
                            </p>
                          </div>
                          <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
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
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setActiveTab('documents')}
                                >
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
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setActiveTab('monitoring')}
                                >
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
                <CardHeader className="bg-gray-50 border-b">
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
                <AMLHitsDetail clientId={client.id} />
              </div>
            )}

            {/* Related Entities Tab */}
            {activeTab === 'related-entities' && (
              <RelatedEntitiesTab clientId={client.id} />
            )}

            {/* Remaining Tabs Component */}
            <RemainingTabs activeTab={activeTab as any} client={client} />
          </div>
        </div>
      </div>
    </div>
  );
}