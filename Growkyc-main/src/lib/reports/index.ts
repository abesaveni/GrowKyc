export type { ReportType } from './models/reportType';
export type { ReportStatus } from './models/reportStatus';
export type { ReportFilter } from './models/reportFilter';
export type { ReportSummary } from './models/reportSummary';
export type { PersistedReportRecord, ReportQueryInput } from './models/reportQueryInput';
export type { ReportQueryOutput } from './models/reportQueryOutput';
export type {
	CreateReportRecordInput,
	IReportRecordPersistenceAdapter,
	ReportRecord,
	UpdateReportStatusInput,
} from './models/reportRecordPersistence';
export type {
	FirmCaseRiskSummary,
	FirmRiskRecord,
	FirmRiskSummaryInput,
	FirmRiskSummaryResult,
} from './models/firmRiskSummaryResult';
export type {
	ReviewerExceptionEntry,
	ReviewerExceptionItem,
	ReviewerExceptionReasonCode,
	ReviewerExceptionReportInput,
	ReviewerExceptionResult,
} from './models/reviewerExceptionResult';
export { assembleReportQuery } from './services/reportQueryAssembler';
export { createReportRecord, updateReportStatus } from './services/reportRecordPersistenceHelper';
export type { ReportingServiceDependencies } from './services/reportingService';
export { ReportingService } from './services/reportingService';
export {
	aggregateExpiringDocumentCounts,
	aggregateHighRiskCounts,
	aggregateOverdueReviews,
	aggregateRiskByCase,
	buildFirmRiskSummary,
	isExpiringDocumentRecord,
	isHighRiskRecord,
	isOverdueReviewRecord,
} from './services/firmRiskSummaryHelper';
export {
	buildReviewerExceptionReport,
	isOpenReviewIssue,
	isRejectedOrEscalatedItem,
	isUnresolvedSevereFinding,
} from './services/reviewerExceptionReportHelper';