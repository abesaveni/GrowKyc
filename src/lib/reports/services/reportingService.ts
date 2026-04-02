import type { FirmRiskSummaryInput, FirmRiskSummaryResult } from '../models/firmRiskSummaryResult';
import type { ReportQueryInput } from '../models/reportQueryInput';
import type { ReportQueryOutput } from '../models/reportQueryOutput';
import type {
  CreateReportRecordInput,
  IReportRecordPersistenceAdapter,
  ReportRecord,
  UpdateReportStatusInput,
} from '../models/reportRecordPersistence';
import type {
  ReviewerExceptionReportInput,
  ReviewerExceptionResult,
} from '../models/reviewerExceptionResult';
import { buildFirmRiskSummary } from './firmRiskSummaryHelper';
import { assembleReportQuery } from './reportQueryAssembler';
import { createReportRecord, updateReportStatus } from './reportRecordPersistenceHelper';
import { buildReviewerExceptionReport } from './reviewerExceptionReportHelper';

export interface ReportingServiceDependencies {
  persistenceAdapter: IReportRecordPersistenceAdapter;
}

export class ReportingService {
  private readonly persistenceAdapter: IReportRecordPersistenceAdapter;

  constructor(dependencies: ReportingServiceDependencies) {
    this.persistenceAdapter = dependencies.persistenceAdapter;
  }

  async createReportRecord(input: CreateReportRecordInput): Promise<ReportRecord> {
    return createReportRecord(this.persistenceAdapter, input);
  }

  async updateReportStatus(input: UpdateReportStatusInput): Promise<ReportRecord | null> {
    return updateReportStatus(this.persistenceAdapter, input);
  }

  assembleReportQuery(input: ReportQueryInput): ReportQueryOutput {
    return assembleReportQuery(input);
  }

  buildReviewerExceptionReport(input: ReviewerExceptionReportInput): ReviewerExceptionResult {
    return buildReviewerExceptionReport(input);
  }

  buildFirmRiskSummary(input: FirmRiskSummaryInput): FirmRiskSummaryResult {
    return buildFirmRiskSummary(input);
  }
}
