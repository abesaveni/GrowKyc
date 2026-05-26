/**
 * Server-side document expiry domain model.
 * Intentionally scheduler-agnostic and provider-agnostic.
 */

/**
 * Typed lifecycle status for document expiry tracking.
 */
export type DocumentExpiryStatus =
  | 'active'
  | 'no_expiry'
  | 'expiring_soon'
  | 'expired'
  | 'replaced';

/**
 * Canonical document expiry model.
 */
export interface DocumentExpiryModel {
  /**
   * Document id.
   */
  id: string;

  /**
   * Tenant/organization id.
   */
  organizationId: string;

  /**
   * Optional case id for case-scoped documents.
   */
  caseId?: string;

  /**
   * Current expiry status.
   */
  status: DocumentExpiryStatus;

  /**
   * Document expiry date (ISO 8601 timestamp).
   * Omitted for no-expiry documents.
   */
  expiryDate?: string;

  /**
   * True when this document does not expire.
   */
  hasNoExpiry: boolean;

  /**
   * When the document was replaced (ISO 8601 timestamp).
   */
  replacedAt?: string;

  /**
   * Reference to replacement document id.
   */
  replacedBy?: string;

  /**
   * Audit timestamps (ISO 8601).
   */
  createdAt: string;
  updatedAt: string;
}
