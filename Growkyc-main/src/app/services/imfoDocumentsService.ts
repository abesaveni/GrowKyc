import { delay } from './apiClient';

export type ImfoDocumentStatus = 'approved' | 'pending-review' | 'draft' | 'archived';
export type ImfoDocumentCategory = 'Fund' | 'Investor' | 'Deal' | 'Compliance' | 'Audit';

export interface ImfoDocumentRecord {
  id: string;
  name: string;
  category: ImfoDocumentCategory;
  fund: string;
  fileType: string;
  sizeKb: number;
  uploadedBy: string;
  lastModified: string;
  status: ImfoDocumentStatus;
  version: string;
}

const ALL_DOCUMENTS: ImfoDocumentRecord[] = [
  { id: 'DOC-001', name: 'Growth Credit Fund I — IM (Final)', category: 'Fund', fund: 'Growth Credit Fund I', fileType: 'PDF', sizeKb: 4200, uploadedBy: 'Sarah Mitchell', lastModified: '2026-05-18', status: 'approved', version: '3.2' },
  { id: 'DOC-002', name: 'Q1 2026 Investor Statement Pack', category: 'Investor', fund: 'Growth Credit Fund I', fileType: 'PDF', sizeKb: 1850, uploadedBy: 'Investor Relations', lastModified: '2026-05-15', status: 'approved', version: '1.0' },
  { id: 'DOC-003', name: 'Sydney Commercial — Loan Agreement', category: 'Deal', fund: 'SPV-2024-023', fileType: 'PDF', sizeKb: 920, uploadedBy: 'Michael Chen', lastModified: '2026-05-12', status: 'approved', version: '2.0' },
  { id: 'DOC-004', name: 'AML/CTF Program Review 2026', category: 'Compliance', fund: 'Platform', fileType: 'DOCX', sizeKb: 640, uploadedBy: 'Compliance Team', lastModified: '2026-05-10', status: 'pending-review', version: '1.1' },
  { id: 'DOC-005', name: 'Q4 2025 Audit Pack — Working Papers', category: 'Audit', fund: 'Growth Credit Fund I', fileType: 'ZIP', sizeKb: 12400, uploadedBy: 'Fund Accountant', lastModified: '2026-04-28', status: 'approved', version: '1.0' },
  { id: 'DOC-006', name: 'Ag Land Portfolio — Teaser', category: 'Deal', fund: 'SPV-2024-033', fileType: 'PDF', sizeKb: 2100, uploadedBy: 'Deal Team', lastModified: '2026-05-20', status: 'draft', version: '0.9' },
  { id: 'DOC-007', name: 'Wholesale Investor Register Export', category: 'Investor', fund: 'All funds', fileType: 'CSV', sizeKb: 320, uploadedBy: 'Sarah Mitchell', lastModified: '2026-05-19', status: 'approved', version: '—' },
  { id: 'DOC-008', name: 'ASIC RG 46 Disclosure Template', category: 'Compliance', fund: 'Platform', fileType: 'PDF', sizeKb: 480, uploadedBy: 'Compliance Team', lastModified: '2026-03-01', status: 'archived', version: '4.0' }
];

let documentsStore = [...ALL_DOCUMENTS];

export interface ImfoDocumentsSummary {
  total: number;
  pendingReview: number;
  approved: number;
  totalSizeMb: number;
}

export function computeDocumentsSummary(docs: ImfoDocumentRecord[]): ImfoDocumentsSummary {
  const totalSizeMb = docs.reduce((s, d) => s + d.sizeKb, 0) / 1024;
  return {
    total: docs.length,
    pendingReview: docs.filter((d) => d.status === 'pending-review').length,
    approved: docs.filter((d) => d.status === 'approved').length,
    totalSizeMb: Math.round(totalSizeMb * 10) / 10
  };
}

export async function fetchImfoDocuments(filters?: {
  search?: string;
  category?: string;
  status?: string;
  fund?: string;
}): Promise<ImfoDocumentRecord[]> {
  let list = [...documentsStore];
  if (filters?.category && filters.category !== 'all') {
    list = list.filter((d) => d.category === filters.category);
  }
  if (filters?.status && filters.status !== 'all') {
    list = list.filter((d) => d.status === filters.status);
  }
  if (filters?.fund && filters.fund !== 'all') {
    list = list.filter((d) => d.fund === filters.fund);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        d.fund.toLowerCase().includes(q)
    );
  }
  return delay(list);
}

export async function uploadImfoDocument(payload: {
  name: string;
  category: ImfoDocumentCategory;
  fund: string;
}): Promise<ImfoDocumentRecord> {
  const row: ImfoDocumentRecord = {
    id: `DOC-${Date.now()}`,
    name: payload.name,
    category: payload.category,
    fund: payload.fund,
    fileType: 'PDF',
    sizeKb: Math.floor(Math.random() * 2000) + 200,
    uploadedBy: 'You',
    lastModified: new Date().toISOString().slice(0, 10),
    status: 'pending-review',
    version: '1.0'
  };
  documentsStore = [row, ...documentsStore];
  return delay(row, 500);
}
