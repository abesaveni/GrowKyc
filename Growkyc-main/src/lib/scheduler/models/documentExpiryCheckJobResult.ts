export type DocumentExpiryCheckJobStatus = 'processed' | 'no_op' | 'failed';

export interface DocumentExpiryCheckJobResult {
  job_id: string;
  tenant_id: string;
  job_type: 'document_expiry_check';
  status: DocumentExpiryCheckJobStatus;
  started_at: string;
  completed_at: string;
  due_document_count: number;
  evaluated_document_count: number;
  expired_document_count: number;
  metadata?: Record<string, unknown>;
}
