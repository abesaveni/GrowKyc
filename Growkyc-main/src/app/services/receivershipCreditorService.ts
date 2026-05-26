import { delay } from './apiClient';

export type ClaimStatus = 'admitted' | 'rejected' | 'partial' | 'pending' | 'withdrawn';
export type ClaimType = 'secured' | 'unsecured' | 'employee' | 'priority';

export interface CreditorRecord {
  id: string;
  name: string;
  claimAmount: number;
  admittedAmount: number;
  claimType: ClaimType;
  status: ClaimStatus;
  proofSubmitted: boolean;
  email: string;
  lastUpdated: string;
}

export interface ProofOfDebtSubmission {
  creditorName: string;
  claimAmount: number;
  claimType: ClaimType;
  notes: string;
  status: ClaimStatus;
  submissionDate: string;
  files: File[];
}

const MOCK_CREDITORS: CreditorRecord[] = [
  { id: 'CR-001', name: 'National Australia Bank', claimAmount: 6200000, admittedAmount: 6200000, claimType: 'secured', status: 'admitted', proofSubmitted: true, email: 'recoveries@nab.com.au', lastUpdated: '2026-05-01' },
  { id: 'CR-002', name: 'Westpac Banking Corp', claimAmount: 2500000, admittedAmount: 2500000, claimType: 'secured', status: 'admitted', proofSubmitted: true, email: 'legal@westpac.com.au', lastUpdated: '2026-05-01' },
  { id: 'CR-003', name: 'Trade Suppliers Pty Ltd', claimAmount: 890000, admittedAmount: 650000, claimType: 'unsecured', status: 'partial', proofSubmitted: true, email: 'accounts@tradesuppliers.com.au', lastUpdated: '2026-05-12' },
  { id: 'CR-004', name: 'ATO — Priority Tax', claimAmount: 420000, admittedAmount: 0, claimType: 'priority', status: 'pending', proofSubmitted: false, email: 'insolvency@ato.gov.au', lastUpdated: '2026-05-18' },
  { id: 'CR-005', name: 'Former Employees (class)', claimAmount: 185000, admittedAmount: 185000, claimType: 'employee', status: 'admitted', proofSubmitted: true, email: 'hr@techco.com.au', lastUpdated: '2026-04-28' }
];

export async function fetchCreditors(): Promise<CreditorRecord[]> {
  return delay([...MOCK_CREDITORS]);
}

export async function submitProofOfDebt(payload: Omit<ProofOfDebtSubmission, 'files'>): Promise<{ ok: boolean; id: string }> {
  return delay({ ok: true, id: `POD-${Date.now()}` }, 600);
}

export interface DividendPriorityRow {
  priority: string;
  creditorClass: string;
  totalClaims: number;
  admitted: number;
  distributionPct: number;
  distributedAmount: number;
}

export async function fetchDividendCalculation(): Promise<{
  rows: DividendPriorityRow[];
  totalPool: number;
  totalDistributed: number;
  remaining: number;
}> {
  const rows: DividendPriorityRow[] = [
    { priority: '1', creditorClass: 'Costs of administration', totalClaims: 320000, admitted: 320000, distributionPct: 100, distributedAmount: 320000 },
    { priority: '2', creditorClass: 'Employee entitlements', totalClaims: 185000, admitted: 185000, distributionPct: 100, distributedAmount: 185000 },
    { priority: '3', creditorClass: 'Secured creditors', totalClaims: 8700000, admitted: 8700000, distributionPct: 78, distributedAmount: 6786000 },
    { priority: '4', creditorClass: 'Unsecured creditors', totalClaims: 2800000, admitted: 2650000, distributionPct: 12, distributedAmount: 318000 }
  ];
  const totalDistributed = rows.reduce((s, r) => s + r.distributedAmount, 0);
  const totalPool = 8500000;
  return delay({ rows, totalPool, totalDistributed, remaining: totalPool - totalDistributed });
}
