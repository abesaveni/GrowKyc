/**
 * diditApi.ts
 * Frontend client for the Didit KYC/KYB verification endpoints exposed by the
 * FastAPI backend. Uses the shared apiRequest helper (adds the Bearer token and
 * /api/v1 base URL).
 */
import { apiRequest } from './apiClient';

export type VerificationKind = 'individual' | 'business';

export interface StartVerificationResult {
  session_id: string;
  url: string;
  status: string;
}

export interface VerificationStatus {
  session_id: string;
  kind: string;
  status: string;
  kyc_id: number | null;
  decision: Record<string, any> | null;
  verification_url: string | null;
}

/** Terminal Didit statuses — polling can stop once one of these is reached. */
export const TERMINAL_STATUSES = [
  'Approved',
  'Declined',
  'Abandoned',
  'Expired',
  'Kyc Expired',
];

/** Create a Didit verification session and get the hosted verification URL. */
export async function startVerification(
  kind: VerificationKind = 'individual',
  kycId?: number,
  callbackUrl?: string
): Promise<StartVerificationResult> {
  return apiRequest<StartVerificationResult>('/verifications/start', {
    method: 'POST',
    body: JSON.stringify({
      kind,
      kyc_id: kycId ?? null,
      callback_url: callbackUrl ?? null,
    }),
  });
}

/** Fetch a session's status/decision. Pass refresh=true to pull live from Didit. */
export async function getVerification(
  sessionId: string,
  refresh = false
): Promise<VerificationStatus> {
  const q = refresh ? '?refresh=true' : '';
  return apiRequest<VerificationStatus>(`/verifications/${sessionId}${q}`);
}
