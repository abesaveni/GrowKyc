import { delay, apiRequest } from './apiClient';

export interface DealAllocation {
  id: string;
  investorName: string;
  amount: number;
  percent: number;
  notes?: string;
  createdAt: string;
}

export interface DealAllocationSummary {
  dealId: string;
  targetRaise: number;
  totalAllocated: number;
  remaining: number;
  fullySubscribed: boolean;
  allocations: DealAllocation[];
}

const store: Record<string, DealAllocationSummary> = {
  'DEAL-2024-006': {
    dealId: 'DEAL-2024-006',
    targetRaise: 35000000,
    totalAllocated: 8200000,
    remaining: 26800000,
    fullySubscribed: false,
    allocations: [
      { id: 'A1', investorName: 'Meridian Capital Pty Ltd', amount: 5000000, percent: 14.3, notes: 'Tier A anchor', createdAt: '2026-05-01' },
      { id: 'A2', investorName: 'Smith Family Trust', amount: 2000000, percent: 5.7, createdAt: '2026-05-08' },
      { id: 'A3', investorName: 'Apex Investment Fund', amount: 1200000, percent: 3.4, createdAt: '2026-05-15' }
    ]
  },
  'DEAL-2024-001': {
    dealId: 'DEAL-2024-001',
    targetRaise: 25000000,
    totalAllocated: 25000000,
    remaining: 0,
    fullySubscribed: true,
    allocations: [
      { id: 'B1', investorName: 'Meridian Capital Pty Ltd', amount: 10000000, percent: 40, createdAt: '2026-03-01' },
      { id: 'B2', investorName: 'Apex Investment Fund', amount: 15000000, percent: 60, createdAt: '2026-03-05' }
    ]
  }
};

export async function fetchDealAllocations(dealId: string): Promise<DealAllocationSummary> {
  const existing = store[dealId];
  if (existing) return delay({ ...existing, allocations: [...existing.allocations] });
  const empty: DealAllocationSummary = {
    dealId,
    targetRaise: 10000000,
    totalAllocated: 0,
    remaining: 10000000,
    fullySubscribed: false,
    allocations: []
  };
  store[dealId] = empty;
  return delay({ ...empty });
}

export async function postDealAllocation(
  dealId: string,
  body: { investorName: string; allocationAmount: number; allocationPercentage?: number; notes?: string }
): Promise<DealAllocationSummary> {
  try {
    await apiRequest(`/deals/${dealId}/allocations`, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  } catch {
    /* mock fallback when API unavailable */
  }
  const current = store[dealId] || {
    dealId,
    targetRaise: 35000000,
    totalAllocated: 0,
    remaining: 35000000,
    fullySubscribed: false,
    allocations: []
  };
  const amount = body.allocationAmount;
  const percent = body.allocationPercentage ?? (amount / current.targetRaise) * 100;
  const row: DealAllocation = {
    id: `A-${Date.now()}`,
    investorName: body.investorName,
    amount,
    percent,
    notes: body.notes,
    createdAt: new Date().toISOString().slice(0, 10)
  };
  const allocations = [...current.allocations, row];
  const totalAllocated = allocations.reduce((s, a) => s + a.amount, 0);
  const remaining = Math.max(0, current.targetRaise - totalAllocated);
  const updated: DealAllocationSummary = {
    ...current,
    allocations,
    totalAllocated,
    remaining,
    fullySubscribed: remaining <= 0
  };
  store[dealId] = updated;
  return delay({ ...updated }, 500);
}
