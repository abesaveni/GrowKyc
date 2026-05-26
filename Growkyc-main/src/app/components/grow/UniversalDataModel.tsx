// Core Universal Data Model for Grow Platform
// This defines the single source of truth for all entities

export interface Person {
  id: string;
  type: 'staff' | 'client' | 'supplier' | 'partner' | 'contact';
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  title?: string;
  department?: string;
  teamId?: string;
  roleIds: string[];
  organisationId?: string;
  avatar?: string;
  isActive: boolean;
  tags: string[];
  customFields: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  leaderId?: string;
  memberIds: string[];
  parentTeamId?: string;
  organisationId: string;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  isSystemRole: boolean;
  organisationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  resource: string; // e.g., 'clients', 'invoices', 'workflows'
  actions: ('create' | 'read' | 'update' | 'delete' | 'approve' | 'export')[];
  scope: 'all' | 'team' | 'own' | 'none';
  conditions?: Record<string, any>;
}

export interface Organisation {
  id: string;
  type: 'customer' | 'supplier' | 'partner' | 'internal';
  name: string;
  legalName?: string;
  abn?: string;
  acn?: string;
  taxId?: string;
  website?: string;
  industry?: string;
  size?: 'micro' | 'small' | 'medium' | 'large' | 'enterprise';
  addresses: Address[];
  contacts: Person[];
  primaryContactId?: string;
  accountManagerId?: string;
  healthScore?: number;
  churnRisk?: 'low' | 'medium' | 'high';
  lifetimeValue: number;
  tags: string[];
  customFields: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  type: 'physical' | 'postal' | 'billing';
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  type: 'product' | 'service' | 'bundle' | 'subscription';
  name: string;
  code: string;
  description?: string;
  category?: string;
  unitOfMeasure?: string;
  priceBookEntries: PriceBookEntry[];
  costPrice?: number;
  defaultPrice: number;
  taxRate?: number;
  isActive: boolean;
  inventoryTracked: boolean;
  stockOnHand?: number;
  reorderLevel?: number;
  tags: string[];
  customFields: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PriceBookEntry {
  id: string;
  priceBookId: string;
  productId: string;
  price: number;
  discountPercent?: number;
  validFrom?: Date;
  validTo?: Date;
  currency: string;
}

export interface Project {
  id: string;
  type: 'project' | 'job' | 'ticket' | 'engagement';
  name: string;
  code: string;
  description?: string;
  organisationId: string;
  status: 'draft' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate?: Date;
  dueDate?: Date;
  completedDate?: Date;
  budget?: number;
  actualCost?: number;
  estimatedHours?: number;
  actualHours?: number;
  managerId: string;
  teamIds: string[];
  taskIds: string[];
  documentIds: string[];
  invoiceIds: string[];
  tags: string[];
  customFields: Record<string, any>;
  parentProjectId?: string;
  templateId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: 'task' | 'checklist-item' | 'approval' | 'review';
  status: 'not-started' | 'in-progress' | 'blocked' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  reporterId: string;
  projectId?: string;
  parentTaskId?: string;
  dependsOn: string[];
  dueDate?: Date;
  startDate?: Date;
  completedDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  slaTarget?: Date;
  slaStatus?: 'on-track' | 'at-risk' | 'breached';
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  checklistItems?: ChecklistItem[];
  approvalRequired: boolean;
  approvers?: string[];
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  tags: string[];
  customFields: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  interval: number;
  dayOfWeek?: number;
  dayOfMonth?: number;
  monthOfYear?: number;
  endDate?: Date;
  occurrences?: number;
}

export interface ChecklistItem {
  id: string;
  title: string;
  isCompleted: boolean;
  completedBy?: string;
  completedAt?: Date;
  isRequired: boolean;
  order: number;
}

export interface Document {
  id: string;
  type: 'document' | 'template' | 'asset' | 'attachment';
  name: string;
  description?: string;
  category?: string;
  mimeType: string;
  fileSize: number;
  url: string;
  thumbnailUrl?: string;
  version: string;
  versionHistory: DocumentVersion[];
  templateId?: string;
  mergeFields?: Record<string, any>;
  organisationId?: string;
  projectId?: string;
  taskId?: string;
  invoiceId?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  isTemplate: boolean;
  requiresApproval: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  signatureRequired: boolean;
  signatureStatus?: 'unsigned' | 'partially-signed' | 'fully-signed';
  signatories?: Signatory[];
  isPublic: boolean;
  expiryDate?: Date;
  tags: string[];
  customFields: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface DocumentVersion {
  version: string;
  url: string;
  changes?: string;
  createdAt: Date;
  createdBy: string;
}

export interface Signatory {
  personId: string;
  email: string;
  signedAt?: Date;
  ipAddress?: string;
  status: 'pending' | 'signed' | 'declined';
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  type: 'internal' | 'client' | 'supplier' | 'board';
  startTime: Date;
  endTime: Date;
  location?: string;
  meetingLink?: string;
  organiserId: string;
  attendeeIds: string[];
  organisationId?: string;
  projectId?: string;
  agendaItems: AgendaItem[];
  decisions: Decision[];
  actionItems: ActionItem[];
  notes?: string;
  recordingUrl?: string;
  transcriptUrl?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AgendaItem {
  id: string;
  title: string;
  description?: string;
  duration: number;
  order: number;
  presenterId?: string;
}

export interface Decision {
  id: string;
  title: string;
  description?: string;
  decidedBy: string;
  decidedAt: Date;
  relatedDocumentIds?: string[];
}

export interface ActionItem {
  id: string;
  title: string;
  assigneeId: string;
  dueDate?: Date;
  status: 'pending' | 'completed';
  taskId?: string;
}

export interface Invoice {
  id: string;
  type: 'invoice' | 'bill' | 'credit-note' | 'receipt';
  number: string;
  status: 'draft' | 'sent' | 'viewed' | 'overdue' | 'paid' | 'partially-paid' | 'cancelled';
  organisationId: string;
  projectId?: string;
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  currency: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  lineItems: InvoiceLineItem[];
  paymentTerms?: string;
  notes?: string;
  paymentMethodId?: string;
  paymentLinkUrl?: string;
  isSubscription: boolean;
  subscriptionId?: string;
  recurringPattern?: RecurringPattern;
  xeroInvoiceId?: string;
  quickBooksInvoiceId?: string;
  tags: string[];
  customFields: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface InvoiceLineItem {
  id: string;
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discountPercent?: number;
  taxRate?: number;
  amount: number;
  projectId?: string;
  taskId?: string;
}

export interface Payment {
  id: string;
  type: 'payment' | 'refund' | 'payout';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  invoiceId?: string;
  organisationId: string;
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'bank-transfer' | 'direct-debit' | 'cash' | 'check' | 'other';
  paymentDate: Date;
  reference?: string;
  transactionId?: string;
  gatewayResponse?: Record<string, any>;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryItem {
  id: string;
  productId: string;
  locationId: string;
  lotNumber?: string;
  serialNumber?: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  unitCost: number;
  expiryDate?: Date;
  receivedDate: Date;
  supplierId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  id: string;
  name: string;
  code: string;
  type: 'warehouse' | 'store' | 'office' | 'vehicle' | 'customer-site';
  address?: Address;
  managerId?: string;
  isActive: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Policy {
  id: string;
  code: string;
  name: string;
  description?: string;
  category: string;
  version: string;
  status: 'draft' | 'active' | 'under-review' | 'archived';
  effectiveDate?: Date;
  reviewDate?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  ownerId: string;
  documentId?: string;
  controls: Control[];
  risks: Risk[];
  attestations: Attestation[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Control {
  id: string;
  name: string;
  description?: string;
  type: 'preventive' | 'detective' | 'corrective';
  frequency: 'continuous' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  ownerId: string;
  status: 'active' | 'inactive' | 'needs-update';
  lastTestedDate?: Date;
  nextTestDate?: Date;
  effectiveness?: 'effective' | 'needs-improvement' | 'ineffective';
  evidenceDocumentIds?: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Risk {
  id: string;
  name: string;
  description?: string;
  category: string;
  likelihood: 'very-low' | 'low' | 'medium' | 'high' | 'very-high';
  impact: 'very-low' | 'low' | 'medium' | 'high' | 'very-high';
  inherentRiskScore: number;
  residualRiskScore: number;
  mitigationStrategy?: string;
  ownerId: string;
  status: 'open' | 'mitigated' | 'accepted' | 'transferred' | 'closed';
  controlIds: string[];
  reviewDate?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Incident {
  id: string;
  type: 'security' | 'safety' | 'compliance' | 'operational' | 'financial' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'investigating' | 'resolved' | 'closed';
  title: string;
  description?: string;
  reportedBy: string;
  reportedAt: Date;
  assignedTo?: string;
  affectedSystems?: string[];
  affectedPeople?: string[];
  rootCause?: string;
  correctionActions?: string;
  preventiveActions?: string;
  resolvedAt?: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  relatedIncidentIds?: string[];
  documentIds?: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Attestation {
  id: string;
  policyId?: string;
  controlId?: string;
  attestedBy: string;
  attestedAt: Date;
  period: string;
  statement: string;
  evidenceDocumentIds?: string[];
  status: 'pending' | 'attested' | 'declined';
  expiryDate?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Lead {
  id: string;
  source: 'website' | 'referral' | 'cold-call' | 'event' | 'partner' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  score?: number;
  organisationName?: string;
  contactPersonId?: string;
  estimatedValue?: number;
  probability?: number;
  expectedCloseDate?: Date;
  pipelineStage: string;
  lostReason?: string;
  ownerId: string;
  notes?: string;
  tags: string[];
  customFields: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  version: string;
  status: 'draft' | 'active' | 'inactive';
  triggerType: 'manual' | 'schedule' | 'event' | 'webhook' | 'email';
  triggerConfig: Record<string, any>;
  steps: WorkflowStep[];
  isTemplate: boolean;
  organisationId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface WorkflowStep {
  id: string;
  type: 'action' | 'condition' | 'approval' | 'delay' | 'loop';
  order: number;
  name: string;
  config: Record<string, any>;
  nextStepId?: string;
  alternateStepId?: string; // for conditions
}

export interface AIInteraction {
  id: string;
  type: 'search' | 'explain' | 'draft' | 'summarize' | 'flag' | 'recommend';
  userId: string;
  query: string;
  context?: Record<string, any>;
  response: string;
  sources?: AISource[];
  confidence?: number;
  wasHelpful?: boolean;
  feedback?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  tags: string[];
  createdAt: Date;
}

export interface AISource {
  type: 'document' | 'record' | 'external';
  id: string;
  title: string;
  excerpt?: string;
  url?: string;
  confidence: number;
}

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'approve' | 'export' | 'login' | 'logout';
  userId: string;
  changes?: Record<string, { old: any; new: any }>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  timestamp: Date;
}

// Type guards and utilities
export type UniversalEntity = 
  | Person 
  | Team 
  | Organisation 
  | Product 
  | Project 
  | Task 
  | Document 
  | Meeting 
  | Invoice 
  | Payment
  | InventoryItem
  | Policy
  | Control
  | Risk
  | Incident
  | Lead
  | Workflow;

export function getEntityType(entity: UniversalEntity): string {
  if ('firstName' in entity) return 'person';
  if ('leaderId' in entity) return 'team';
  if ('abn' in entity) return 'organisation';
  if ('priceBookEntries' in entity) return 'product';
  if ('managerId' in entity && 'budget' in entity) return 'project';
  if ('assigneeId' in entity && 'dueDate' in entity) return 'task';
  if ('mimeType' in entity) return 'document';
  if ('attendeeIds' in entity) return 'meeting';
  if ('invoiceId' in entity && 'amount' in entity) return 'payment';
  if ('lineItems' in entity) return 'invoice';
  if ('lotNumber' in entity) return 'inventory-item';
  if ('controls' in entity && 'version' in entity) return 'policy';
  if ('likelihood' in entity && 'impact' in entity) return 'risk';
  if ('severity' in entity && 'reportedBy' in entity) return 'incident';
  if ('pipelineStage' in entity) return 'lead';
  if ('triggerType' in entity && 'steps' in entity) return 'workflow';
  return 'unknown';
}

export function getEntityDisplayName(entity: UniversalEntity): string {
  if ('firstName' in entity) return `${entity.firstName} ${entity.lastName}`;
  if ('name' in entity) return entity.name;
  if ('title' in entity && 'assigneeId' in entity) return entity.title;
  return 'Untitled';
}
