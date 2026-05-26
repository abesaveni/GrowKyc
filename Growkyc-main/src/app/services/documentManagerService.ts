import { delay } from './apiClient';

export interface DocumentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  lastModified: string;
  version: string;
}

export interface DeletedDocument {
  id: string;
  name: string;
  deletedAt: string;
  deletedBy: string;
  size: string;
  originalPath: string;
}

const TEMPLATES: DocumentTemplate[] = [
  { id: 'TPL-001', name: 'Engagement Letter — Individual', category: 'Client Onboarding', description: 'Standard engagement for individual clients', lastModified: '2026-05-10', version: '2.1' },
  { id: 'TPL-002', name: 'Trust Deed Review Checklist', category: 'Compliance', description: 'Checklist for trust deed reviews', lastModified: '2026-04-22', version: '1.4' },
  { id: 'TPL-003', name: 'IM Disclosure Pack', category: 'Investments', description: 'Information memorandum template', lastModified: '2026-05-01', version: '3.0' },
  { id: 'TPL-004', name: 'Proof of Debt Form', category: 'Receivership', description: 'Creditor proof of debt lodgement', lastModified: '2026-03-15', version: '1.0' }
];

let trash: DeletedDocument[] = [
  { id: 'DEL-001', name: 'FY24_Financials_Draft.pdf', deletedAt: '2026-05-19', deletedBy: 'Emma Wilson', size: '2.4 MB', originalPath: '/Clients/Acme/FY24' },
  { id: 'DEL-002', name: 'Old_Constitution_v1.docx', deletedAt: '2026-05-17', deletedBy: 'Sarah Mitchell', size: '890 KB', originalPath: '/Templates/Legacy' }
];

export async function fetchTemplates(category?: string, search?: string): Promise<DocumentTemplate[]> {
  let list = [...TEMPLATES];
  if (category && category !== 'all') list = list.filter((t) => t.category === category);
  if (search) {
    const q = search.toLowerCase();
    list = list.filter((t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  }
  return delay(list);
}

export async function fetchTrash(): Promise<DeletedDocument[]> {
  return delay([...trash]);
}

export async function restoreDocument(id: string): Promise<void> {
  trash = trash.filter((d) => d.id !== id);
  return delay(undefined as void, 300);
}

export async function permanentDeleteDocument(id: string): Promise<void> {
  trash = trash.filter((d) => d.id !== id);
  return delay(undefined as void, 400);
}

export type DocumentPermission = 'View' | 'Edit' | 'Admin';
export type DocumentFileType = 'pdf' | 'docx' | 'xlsx' | 'image' | 'other';

export interface SharedDocument {
  id: string;
  name: string;
  sharedBy: string;
  permission: DocumentPermission;
  sharedDate: string;
  lastOpened: string;
  fileType: DocumentFileType;
  docType: string;
}

export interface RecentDocument {
  id: string;
  name: string;
  lastOpened: string;
  lastOpenedTs: number;
  fileType: DocumentFileType;
  client: string;
  path: string;
  viewsToday: number;
}

const SHARED_DOCUMENTS: SharedDocument[] = [
  { id: 'SH-001', name: 'FY25_Audit_Workpapers.pdf', sharedBy: 'Sarah Mitchell', permission: 'View', sharedDate: '2026-05-20', lastOpened: '2026-05-24 09:12', fileType: 'pdf', docType: 'Audit' },
  { id: 'SH-002', name: 'Trust_Deed_Amendment_v3.docx', sharedBy: 'James Chen', permission: 'Edit', sharedDate: '2026-05-18', lastOpened: '2026-05-23 14:30', fileType: 'docx', docType: 'Legal' },
  { id: 'SH-003', name: 'Client_Onboarding_Checklist.xlsx', sharedBy: 'Emma Wilson', permission: 'Admin', sharedDate: '2026-05-15', lastOpened: '2026-05-22 11:05', fileType: 'xlsx', docType: 'Operations' },
  { id: 'SH-004', name: 'ASIC_Company_Extract.pdf', sharedBy: 'Michael Torres', permission: 'View', sharedDate: '2026-05-12', lastOpened: '2026-05-21 16:44', fileType: 'pdf', docType: 'Compliance' },
  { id: 'SH-005', name: 'Property_Valuation_Photos.zip', sharedBy: 'Lisa Park', permission: 'View', sharedDate: '2026-05-10', lastOpened: '2026-05-19 08:20', fileType: 'other', docType: 'Valuation' },
  { id: 'SH-006', name: 'Engagement_Letter_Template.docx', sharedBy: 'Sarah Mitchell', permission: 'Edit', sharedDate: '2026-05-08', lastOpened: '2026-05-24 07:55', fileType: 'docx', docType: 'Templates' },
  { id: 'SH-007', name: 'AML_Risk_Assessment_Matrix.xlsx', sharedBy: 'James Chen', permission: 'Edit', sharedDate: '2026-05-05', lastOpened: '2026-05-18 13:22', fileType: 'xlsx', docType: 'Compliance' },
  { id: 'SH-008', name: 'Director_ID_Scan.png', sharedBy: 'Emma Wilson', permission: 'View', sharedDate: '2026-05-03', lastOpened: '2026-05-17 10:11', fileType: 'image', docType: 'KYC' },
  { id: 'SH-009', name: 'Board_Minutes_Q1.pdf', sharedBy: 'Michael Torres', permission: 'Admin', sharedDate: '2026-04-28', lastOpened: '2026-05-16 15:40', fileType: 'pdf', docType: 'Governance' },
  { id: 'SH-010', name: 'Loan_Agreement_Draft.pdf', sharedBy: 'Lisa Park', permission: 'Edit', sharedDate: '2026-04-25', lastOpened: '2026-05-15 09:33', fileType: 'pdf', docType: 'Finance' },
  { id: 'SH-011', name: 'Tax_Return_Working_Papers.xlsx', sharedBy: 'Sarah Mitchell', permission: 'View', sharedDate: '2026-04-22', lastOpened: '2026-05-14 12:18', fileType: 'xlsx', docType: 'Tax' },
  { id: 'SH-012', name: 'SMSF_Trust_Deed.pdf', sharedBy: 'James Chen', permission: 'View', sharedDate: '2026-04-18', lastOpened: '2026-05-13 17:02', fileType: 'pdf', docType: 'SMSF' }
];

const RECENT_DOCUMENTS: RecentDocument[] = [
  { id: 'RC-001', name: 'Acme_Corp_ECDD_Memo.pdf', lastOpened: '2026-05-24 10:45', lastOpenedTs: Date.parse('2026-05-24T10:45:00'), fileType: 'pdf', client: 'Acme Corp Pty Ltd', path: '/Clients/Acme/Compliance', viewsToday: 3 },
  { id: 'RC-002', name: 'Smith_Family_Trust_Deed.pdf', lastOpened: '2026-05-24 09:30', lastOpenedTs: Date.parse('2026-05-24T09:30:00'), fileType: 'pdf', client: 'Smith Family Trust', path: '/Clients/Smith/Trust', viewsToday: 2 },
  { id: 'RC-003', name: 'Q2_Portfolio_Summary.xlsx', lastOpened: '2026-05-23 16:20', lastOpenedTs: Date.parse('2026-05-23T16:20:00'), fileType: 'xlsx', client: 'IMFO Growth Fund', path: '/Funds/Growth/Q2', viewsToday: 1 },
  { id: 'RC-004', name: 'Director_Passport_Scan.jpg', lastOpened: '2026-05-23 14:05', lastOpenedTs: Date.parse('2026-05-23T14:05:00'), fileType: 'image', client: 'Beta Holdings Ltd', path: '/Clients/Beta/KYC', viewsToday: 4 },
  { id: 'RC-005', name: 'Loan_Application_Pack.pdf', lastOpened: '2026-05-23 11:50', lastOpenedTs: Date.parse('2026-05-23T11:50:00'), fileType: 'pdf', client: 'Thompson Property Group', path: '/Lending/Thompson', viewsToday: 2 },
  { id: 'RC-006', name: 'Engagement_Letter_Signed.docx', lastOpened: '2026-05-22 15:33', lastOpenedTs: Date.parse('2026-05-22T15:33:00'), fileType: 'docx', client: 'Greenfield Advisory', path: '/Clients/Greenfield/Onboarding', viewsToday: 0 },
  { id: 'RC-007', name: 'AUSTRAC_SMR_Draft.docx', lastOpened: '2026-05-22 10:12', lastOpenedTs: Date.parse('2026-05-22T10:12:00'), fileType: 'docx', client: 'Delta Mining Co', path: '/Compliance/SMR', viewsToday: 1 },
  { id: 'RC-008', name: 'Valuation_Report_Final.pdf', lastOpened: '2026-05-21 17:44', lastOpenedTs: Date.parse('2026-05-21T17:44:00'), fileType: 'pdf', client: 'Harbour Apartments', path: '/Valuations/Harbour', viewsToday: 0 }
];

export interface SharedDocumentsQuery {
  search?: string;
  permission?: string;
  docType?: string;
  sortBy?: 'sharedDate' | 'lastOpened' | 'name';
  sortDir?: 'asc' | 'desc';
}

export async function fetchSharedDocuments(query: SharedDocumentsQuery = {}): Promise<SharedDocument[]> {
  let list = [...SHARED_DOCUMENTS];
  const { search, permission, docType, sortBy = 'sharedDate', sortDir = 'desc' } = query;

  if (permission && permission !== 'all') {
    list = list.filter((d) => d.permission === permission);
  }
  if (docType && docType !== 'all') {
    list = list.filter((d) => d.docType === docType);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.sharedBy.toLowerCase().includes(q) ||
        d.docType.toLowerCase().includes(q)
    );
  }

  list.sort((a, b) => {
    let av: string | number = a[sortBy] ?? a.name;
    let bv: string | number = b[sortBy] ?? b.name;
    if (sortBy === 'sharedDate' || sortBy === 'lastOpened') {
      av = new Date(String(av)).getTime() || 0;
      bv = new Date(String(bv)).getTime() || 0;
    }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  return delay(list);
}

export async function fetchRecentDocuments(search?: string): Promise<RecentDocument[]> {
  let list = [...RECENT_DOCUMENTS].sort((a, b) => b.lastOpenedTs - a.lastOpenedTs);
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.client.toLowerCase().includes(q) ||
        d.path.toLowerCase().includes(q)
    );
  }
  return delay(list);
}

export function touchRecentDocument(id: string): void {
  const doc = RECENT_DOCUMENTS.find((d) => d.id === id);
  if (doc) {
    const now = new Date();
    doc.lastOpened = now.toLocaleString('en-AU', { dateStyle: 'short', timeStyle: 'short' });
    doc.lastOpenedTs = now.getTime();
    doc.viewsToday += 1;
  }
}
