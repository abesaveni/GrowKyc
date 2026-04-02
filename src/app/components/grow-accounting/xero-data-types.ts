// Comprehensive Xero Data Model - All 6 Tiers

// TIER 1 - Core Financial Control (Mandatory)

export interface XeroOrganisation {
  organisationID: string;
  name: string;
  financialYearEnd: string; // MM-DD format
  taxBasis: 'CASH' | 'ACCRUAL';
  gstRegistered: boolean;
  gstFrequency: 'MONTHLY' | 'QUARTERLY' | 'SIXMONTHLY' | 'ANNUALLY' | 'NONE';
  payrollEnabled: boolean;
  baseCurrency: string;
  reportingLockDate?: string;
  endOfYearLockDate?: string;
}

export interface ChartOfAccountsItem {
  accountID: string;
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  class: 'ASSET' | 'EQUITY' | 'EXPENSE' | 'LIABILITY' | 'REVENUE';
  status: 'ACTIVE' | 'ARCHIVED';
  systemAccount: boolean;
  taxType?: string;
  description?: string;
  enablePaymentsToAccount?: boolean;
  showInExpenseClaims?: boolean;
}

export interface TrialBalanceAccount {
  accountID: string;
  accountCode: string;
  accountName: string;
  accountType: string;
  ytdBalance: number;
  comparativeBalance: number;
  trackingBreakdown?: TrackingBreakdown[];
}

export interface TrackingBreakdown {
  trackingCategoryID: string;
  trackingOptionID: string;
  trackingCategoryName: string;
  trackingOptionName: string;
  balance: number;
}

export interface GeneralLedgerTransaction {
  transactionID: string;
  date: string;
  accountID: string;
  accountCode: string;
  contactID?: string;
  contactName?: string;
  description: string;
  reference?: string;
  debit: number;
  credit: number;
  taxCode?: string;
  taxAmount?: number;
  trackingCategories?: TransactionTracking[];
  sourceType: 'ACCPAY' | 'ACCREC' | 'MANJOURNAL' | 'CASHPAID' | 'CASHREC' | 'TRANSFER';
  sourceID: string;
  lineNumber: number;
}

export interface TransactionTracking {
  trackingCategoryID: string;
  trackingOptionID: string;
  name: string;
  option: string;
}

export interface ManualJournal {
  journalID: string;
  journalNumber?: string;
  date: string;
  createdDateUTC: string;
  createdBy?: string;
  narration: string;
  reference?: string;
  status: 'DRAFT' | 'POSTED' | 'DELETED' | 'VOIDED';
  lines: ManualJournalLine[];
  showOnCashBasisReports?: boolean;
}

export interface ManualJournalLine {
  lineID?: string;
  accountID: string;
  accountCode: string;
  accountName: string;
  description?: string;
  taxType?: string;
  taxAmount?: number;
  lineAmount: number;
  trackingCategories?: TransactionTracking[];
}

// TIER 2 - Working Capital Intelligence

export interface OutstandingInvoice {
  invoiceID: string;
  invoiceNumber: string;
  contactID: string;
  contactName: string;
  date: string;
  dueDate: string;
  total: number;
  amountPaid: number;
  amountDue: number;
  amountCredited: number;
  status: 'DRAFT' | 'SUBMITTED' | 'AUTHORISED' | 'PAID' | 'VOIDED';
  type: 'ACCREC' | 'ACCPAY';
  reference?: string;
  currencyCode: string;
  trackingCategories?: TransactionTracking[];
  lineItems: InvoiceLineItem[];
}

export interface InvoiceLineItem {
  lineItemID?: string;
  description: string;
  quantity: number;
  unitAmount: number;
  accountCode: string;
  accountID: string;
  taxType?: string;
  taxAmount: number;
  lineAmount: number;
  trackingCategories?: TransactionTracking[];
}

export interface OutstandingBill {
  billID: string;
  billNumber?: string;
  supplierID: string;
  supplierName: string;
  date: string;
  dueDate: string;
  total: number;
  amountPaid: number;
  amountDue: number;
  status: 'DRAFT' | 'SUBMITTED' | 'AUTHORISED' | 'PAID' | 'VOIDED';
  reference?: string;
  currencyCode: string;
  taxTotal: number;
  lineItems: InvoiceLineItem[];
}

export interface BankAccount {
  accountID: string;
  code: string;
  name: string;
  bankBalance: number;
  reconciledBalance: number;
  unreconciledTransactionCount: number;
  lastReconciledDate?: string;
  bankAccountNumber?: string;
  currencyCode: string;
}

// TIER 3 - Payroll and Super

export interface PayrollSummary {
  periodStart: string;
  periodEnd: string;
  grossWages: number;
  superExpense: number;
  paygWithholding: number;
  employeeCount: number;
  netPay: number;
  employerSuperContributions: number;
}

export interface PayrollLiabilities {
  asAtDate: string;
  superPayable: number;
  paygPayable: number;
  employeeTaxPayable: number;
  otherPayrollLiabilities: number;
}

// TIER 4 - Asset and Capital Structure

export interface FixedAsset {
  assetID: string;
  assetName: string;
  assetNumber: string;
  purchaseDate?: string;
  purchasePrice: number;
  disposalDate?: string;
  disposalPrice?: number;
  assetStatus: 'DRAFT' | 'REGISTERED' | 'DISPOSED';
  warrantyExpiryDate?: string;
  serialNumber?: string;
  depreciationMethod: 'NONE' | 'STRAIGHTLINE' | 'DIMINISHINGVALUE100' | 'DIMINISHINGVALUE150' | 'DIMINISHINGVALUE200' | 'FULLIMMEDIATEWRITE';
  depreciationRate?: number;
  effectiveLifeYears?: number;
  bookValue: number;
  accumulatedDepreciation: number;
  accountingBookValue: number;
}

export interface Contact {
  contactID: string;
  contactNumber?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  contactStatus: 'ACTIVE' | 'ARCHIVED';
  isSupplier: boolean;
  isCustomer: boolean;
  defaultCurrency?: string;
  taxNumber?: string;
  accountsReceivableTaxType?: string;
  accountsPayableTaxType?: string;
  balances?: ContactBalances;
  relatedPartyTag?: string; // Custom field
  contactGroups?: ContactGroup[];
}

export interface ContactBalances {
  accountsReceivable: number;
  accountsPayable: number;
}

export interface ContactGroup {
  contactGroupID: string;
  name: string;
}

// TIER 5 - GST & Tax Intelligence

export interface TaxCode {
  taxType: string;
  name: string;
  effectiveRate: number;
  status: 'ACTIVE' | 'DELETED';
  taxComponents: TaxComponent[];
  reportTaxType: string;
}

export interface TaxComponent {
  name: string;
  rate: number;
  isCompound: boolean;
  isNonRecoverable: boolean;
}

export interface BASReport {
  reportID: string;
  reportName: string;
  reportDate: string;
  reportPeriod: string;
  reportRows: BASReportRow[];
  gstTotal: number;
  netGST: number;
}

export interface BASReportRow {
  rowType: string;
  description: string;
  title: string;
  cells: BASReportCell[];
}

export interface BASReportCell {
  value: string;
  attributes?: BASReportAttribute[];
}

export interface BASReportAttribute {
  id: string;
  value: string;
}

// TIER 6 - Optional but High Value

export interface Budget {
  budgetID: string;
  type: 'OVERALL' | 'TRACKING';
  description?: string;
  trackingCategoryID?: string;
  trackingOptionID?: string;
  periods: BudgetPeriod[];
}

export interface BudgetPeriod {
  periodStart: string;
  periodEnd: string;
  amount: number;
}

export interface TrackingCategory {
  trackingCategoryID: string;
  name: string;
  status: 'ACTIVE' | 'ARCHIVED';
  options: TrackingOption[];
}

export interface TrackingOption {
  trackingOptionID: string;
  name: string;
  status: 'ACTIVE' | 'ARCHIVED';
}

export interface AttachmentMetadata {
  attachmentID: string;
  fileName: string;
  url: string;
  mimeType: string;
  contentLength: number;
  includeOnline: boolean;
  attachedToType: 'Invoice' | 'CreditNote' | 'BankTransaction' | 'ManualJournal' | 'Contact' | 'Account';
  attachedToID: string;
}

// Complete Xero Data Pull Structure

export interface XeroDataPull {
  organisationID: string;
  pullDate: string;
  pullStatus: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  
  // Tier 1 - Core Financial Control
  organisation: XeroOrganisation;
  chartOfAccounts: ChartOfAccountsItem[];
  trialBalance: TrialBalanceAccount[];
  generalLedger: GeneralLedgerTransaction[];
  manualJournals: ManualJournal[];
  
  // Tier 2 - Working Capital
  outstandingInvoices: OutstandingInvoice[];
  outstandingBills: OutstandingBill[];
  bankAccounts: BankAccount[];
  
  // Tier 3 - Payroll
  payrollSummary?: PayrollSummary;
  payrollLiabilities?: PayrollLiabilities;
  
  // Tier 4 - Assets
  fixedAssets?: FixedAsset[];
  contacts: Contact[];
  
  // Tier 5 - GST & Tax
  taxCodes: TaxCode[];
  basReports?: BASReport[];
  
  // Tier 6 - Optional
  budgets?: Budget[];
  trackingCategories?: TrackingCategory[];
  attachments?: AttachmentMetadata[];
}

// Derived Metrics (Computed Internally)

export interface DerivedMetrics {
  organisationID: string;
  calculatedAt: string;
  
  // Materiality
  overallMateriality: number;
  performanceMateriality: number;
  clearlyTrivial: number;
  
  // Risk Scoring
  accountVolatility: AccountVolatilityMetric[];
  journalDensityRatio: number;
  manualJournalPercentage: number;
  
  // Working Capital
  arAgeingProfile: AgeingProfile;
  apAgeingProfile: AgeingProfile;
  concentrationRatios: ConcentrationMetrics;
  
  // Compliance Risk
  cutOffSpikes: CutOffSpike[];
  suspenseAging: number;
  superUnpaidRatio: number;
  
  // Control Flags
  unreconciledBankAccounts: string[];
  lockedPeriods: PeriodLock[];
  highRiskAccounts: string[];
}

export interface AccountVolatilityMetric {
  accountID: string;
  accountCode: string;
  accountName: string;
  transactionCount: number;
  volatilityScore: number; // 0-100
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface AgeingProfile {
  current: number;
  days30: number;
  days60: number;
  days90: number;
  days90Plus: number;
  total: number;
  percentageOverdue: number;
}

export interface ConcentrationMetrics {
  topCustomerPercentage: number;
  topSupplierPercentage: number;
  topCustomers: ConcentrationItem[];
  topSuppliers: ConcentrationItem[];
}

export interface ConcentrationItem {
  contactID: string;
  contactName: string;
  amount: number;
  percentage: number;
}

export interface CutOffSpike {
  accountID: string;
  accountCode: string;
  date: string;
  amount: number;
  percentageOfAccount: number;
  riskFlag: boolean;
}

export interface PeriodLock {
  lockType: 'REPORTING' | 'END_OF_YEAR';
  lockDate: string;
  isActive: boolean;
}

// Journal Push Structure (CONTROLLED)

export interface JournalPushRequest {
  workpaperJournalID: string; // Internal ID
  binderID: string;
  reviewerApproved: boolean;
  approvedBy: string;
  approvedAt: string;
  journal: DraftJournalPayload;
}

export interface DraftJournalPayload {
  date: string;
  narration: string;
  reference: string; // e.g., "Apex Workpapers Adjustment FY25"
  status: 'DRAFT'; // Always DRAFT
  lines: JournalLinePayload[];
  externalID?: string; // Links back to workpaper_journal_id
}

export interface JournalLinePayload {
  accountID: string;
  accountCode: string;
  description?: string;
  debit?: number;
  credit?: number;
  taxType?: string;
  trackingCategories?: TransactionTracking[];
}

export interface JournalPushResult {
  success: boolean;
  xeroJournalID?: string;
  xeroJournalNumber?: string;
  pushedAt: string;
  errorMessage?: string;
  validationErrors?: string[];
}

export interface JournalPushValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  checks: {
    debitsEqualCredits: boolean;
    reviewerApproved: boolean;
    binderNotSealed: boolean;
    accountsNotLocked: boolean;
    withinAllowedPeriod: boolean;
    noDuplicatePush: boolean;
  };
}

// Sync Strategy Configuration

export interface XeroSyncConfig {
  tenantID: string;
  organisationID: string;
  
  // Pull Strategy
  pullOnBinderCreation: boolean;
  pullOnManualRefresh: boolean;
  nightlyDeltaSync: boolean;
  lastSyncDate?: string;
  
  // Push Strategy
  pushRequiresReviewerApproval: boolean;
  pushRequiresPartnerOverride: boolean;
  allowPushToLockedPeriods: boolean;
  
  // Security
  oauthTokenEncrypted: string;
  idempotencyKeyPrefix: string;
}

export interface XeroSyncHistory {
  syncID: string;
  syncType: 'FULL_PULL' | 'DELTA_PULL' | 'JOURNAL_PUSH';
  startedAt: string;
  completedAt?: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  recordsPulled?: number;
  recordsPushed?: number;
  errorMessage?: string;
}

// Minimum V1 Pull (Lean)

export interface MinimumV1Pull {
  organisation: XeroOrganisation;
  chartOfAccounts: ChartOfAccountsItem[];
  trialBalance: TrialBalanceAccount[];
  generalLedgerSummary: GeneralLedgerTransaction[]; // Last 12 months
  outstandingInvoices: OutstandingInvoice[];
  outstandingBills: OutstandingBill[];
  manualJournals: ManualJournal[];
  taxCodes: TaxCode[];
}
