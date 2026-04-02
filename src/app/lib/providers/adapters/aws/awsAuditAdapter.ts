import { IAuditProvider } from '../../interfaces';
import { AuditEvent, AuditEventInput, AuditQueryFilter, AuditQueryResult } from '../../types';
import { AwsApiClient } from './awsApiClient';

export class AwsAuditAdapter implements IAuditProvider {
  constructor(private readonly client: AwsApiClient) {}

  async createAuditEvent(input: AuditEventInput): Promise<AuditEvent> {
    return this.client.post<AuditEvent>('/api/audit-events', input);
  }

  async queryAuditEvents(filter: AuditQueryFilter): Promise<AuditQueryResult> {
    return this.client.post<AuditQueryResult>('/api/audit-events/query', filter);
  }
}
