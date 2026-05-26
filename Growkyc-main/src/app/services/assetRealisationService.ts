import { delay } from './apiClient';

export type AssetRealisationStatus = 'marketing' | 'under-offer' | 'sold' | 'withdrawn' | 'for-sale';

export interface AssetRealisationRecord {
  id: string;
  assetName: string;
  assetType: string;
  estimatedValue: number;
  realisedValue: number;
  saleProgress: number;
  agentName: string;
  agentEmail: string;
  agentPhone: string;
  agentCompany: string;
  status: AssetRealisationStatus;
  lastUpdated: string;
  matterId: string;
}

const MOCK_ASSETS: AssetRealisationRecord[] = [
  {
    id: 'AR-001',
    assetName: 'Commercial Property — 123 Main St',
    assetType: 'Real Estate',
    estimatedValue: 8500000,
    realisedValue: 0,
    saleProgress: 45,
    agentName: 'Sarah Mitchell',
    agentEmail: 'sarah.mitchell@cbre.com.au',
    agentPhone: '+61 2 9000 1100',
    agentCompany: 'CBRE Australia',
    status: 'marketing',
    lastUpdated: '2026-05-18',
    matterId: 'MAT-2024-008'
  },
  {
    id: 'AR-002',
    assetName: 'Plant & Equipment — CNC Line',
    assetType: 'Plant & Equipment',
    estimatedValue: 450000,
    realisedValue: 412000,
    saleProgress: 100,
    agentName: 'James Chen',
    agentEmail: 'j.chen@grays.com',
    agentPhone: '+61 3 8800 2200',
    agentCompany: 'Grays Industrial',
    status: 'sold',
    lastUpdated: '2026-05-10',
    matterId: 'MAT-2024-008'
  },
  {
    id: 'AR-003',
    assetName: 'Fleet Vehicles (5 units)',
    assetType: 'Motor Vehicles',
    estimatedValue: 185000,
    realisedValue: 0,
    saleProgress: 72,
    agentName: 'Emma Wilson',
    agentEmail: 'emma@manheim.com.au',
    agentPhone: '+61 7 3300 4400',
    agentCompany: 'Manheim Auctions',
    status: 'under-offer',
    lastUpdated: '2026-05-20',
    matterId: 'MAT-2024-007'
  },
  {
    id: 'AR-004',
    assetName: 'Retail Inventory — Seasonal Stock',
    assetType: 'Inventory',
    estimatedValue: 280000,
    realisedValue: 195000,
    saleProgress: 88,
    agentName: 'David Smith',
    agentEmail: 'd.smith@liquidators.com.au',
    agentPhone: '+61 2 8100 5500',
    agentCompany: 'Premier Liquidation',
    status: 'for-sale',
    lastUpdated: '2026-05-15',
    matterId: 'MAT-2024-007'
  }
];

export async function fetchAssetRealisations(matterId?: string): Promise<AssetRealisationRecord[]> {
  const list = matterId ? MOCK_ASSETS.filter((a) => a.matterId === matterId) : MOCK_ASSETS;
  return delay([...list]);
}
