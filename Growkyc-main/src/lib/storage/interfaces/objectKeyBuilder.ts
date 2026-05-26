export interface IObjectKeyBuilder {
  buildUploadKey(params: {
    organizationId: string;
    caseId?: string;
    evidenceId: string;
    filename: string;
  }): string;

  buildPrefixKey(params: {
    organizationId: string;
    caseId?: string;
  }): string;
}
