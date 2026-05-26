# User Story: Audit Tab – Export Audit Trail to PDF/CSV with Digital Signature

## Story ID
US-AUDIT-EXPORT-001

## Title
Signed Audit Export (PDF/CSV) with Metadata Header

## User Story Description
**As a** Compliance Officer / Auditor  
**I want** to export audit logs to PDF or CSV that are digitally signed and include a standardized metadata header  
**So that** exported audit trails are verifiable, tamper-evident, and include context required for compliance reviews and legal evidence

## Priority
High

## Story Points
5

---

## Acceptance Criteria (Key)

1. **Export Action**
   - [ ] An `Export` button is available on the Audit Tab and in the filter panel
   - [ ] Users can select export format: `PDF` or `CSV`
   - [ ] Users must select a date range (or the system enforces a maximum record window for large exports)

2. **Metadata Header**
   - [ ] Each exported file MUST include an unambiguous metadata header containing at least:
     - Export ID (UUID)
     - Exported by (user id + name + role)
     - Export timestamp (ISO8601 UTC)
     - Export format (PDF/CSV)
     - Filter criteria used (actor, actions, entity, date range, IP filters, severity, outcomes)
     - Record count
     - Correlation ID (trace id if available)
     - Hash algorithm used (e.g., SHA-256)
     - Content hash (hex of the exported payload hash)
     - Signature algorithm and signing key id

3. **Digital Signature**
   - [ ] The exported file SHALL be signed using a server-side private key managed by the compliance signing service
   - [ ] Signature MUST cover the exported payload and the metadata header (i.e., sign header+payload concatenation)
   - [ ] Signature format: JWS (JSON Web Signature) or detached PKCS#7; document the chosen format
   - [ ] Signature MUST use a secure algorithm (e.g., RSASSA-PSS with SHA-256, or ECDSA P-256 with SHA-256)
   - [ ] Signature MUST include the signing key identifier so verifiers can retrieve the public key
   - [ ] The exported file MUST include a signature block or accompanying `.sig` file containing:
     - signature value (base64)
     - signingKeyId
     - signatureAlgorithm
     - signatureTimestamp
     - signedContentHash

4. **Verification & Integrity**
   - [ ] Provide a verification guide and an endpoint `GET /api/audit-exports/{exportId}/verify` that returns verification results
   - [ ] Verification returns: `valid | invalid | unknown-key` and includes details (mismatched hash, missing header, expired key)
   - [ ] Verification MUST validate header integrity, payload hash, and signature authenticity

5. **Security & Key Management**
   - [ ] Private signing keys MUST be stored in an HSM or cloud KMS (Azure Key Vault, AWS KMS)
   - [ ] Signing operations MUST be performed server-side using KMS/HSM APIs (no private key stored on disk)
   - [ ] Signing key rotation MUST be supported; exported files retain the signingKeyId so old exports remain verifiable
   - [ ] Access to export/signed files restricted to authorized roles (Compliance, Auditor, Admin)

6. **Audit of the Export Action**
   - [ ] Export operations MUST be logged as audit events (action `EXPORT_AUDIT_LOG`) capturing user, filters, exportId, format, recordCount, and IP
   - [ ] Export audit entry MUST be immutable and searchable

7. **User Experience & Constraints**
   - [ ] Show progress and estimated time for large exports; allow background export with email/notification when ready
   - [ ] Limit maximum records per export or require manager approval for very large exports
   - [ ] Downloaded filename pattern: `audit-export-{exportId}-{YYYYMMDDTHHMMSSZ}.{csv|pdf}`
   - [ ] Attach an adjacent metadata file for CSV exports when embedding header is not practical: `audit-export-{exportId}.meta.json`

8. **Compliance & Retention**
   - [ ] Export files and corresponding signatures retained in secure export storage for the configured retention period
   - [ ] Export storage access must be audited

---

## Definition of Done

- [ ] Export UI implemented and accessible to authorized roles
- [ ] Server-side export pipeline implemented (PDF/CSV generation)
- [ ] Digital signing integrated with KMS/HSM
- [ ] `GET /api/audit-exports/{exportId}` and `/verify` endpoints implemented
- [ ] Unit, integration and e2e tests covering export + signature verification
- [ ] Documentation: verification guide and key rotation policy
- [ ] Security review completed
- [ ] Performance: exports for up to 10k records complete within acceptable time or run as background job
- [ ] Product Owner sign-off obtained

---

## Technical Notes

### Metadata Header Example (JSON)

{
  "exportId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "exportedBy": { "userId": "admin-1", "name": "Alice Doe", "role": "Compliance Officer" },
  "exportTimestamp": "2026-05-25T18:30:00Z",
  "format": "CSV",
  "filterCriteria": { "startDate": "2026-05-01T00:00:00Z", "endDate": "2026-05-25T23:59:59Z", "actorIds": ["user-1"] },
  "recordCount": 1240,
  "correlationId": "trace-abc123",
  "hashAlgorithm": "SHA-256",
  "contentHash": "a3b1c5...",
  "signatureAlgorithm": "RSASSA-PSS-SHA256",
  "signingKeyId": "compliance-signing-key-v1"
}

### Signing Flow (high level)
- Server generates the export payload (CSV bytes or PDF bytes)
- Compute payloadHash = SHA256(headerJson + "\n" + payloadBytes)
- Create signature = KMS.sign(payloadHash, keyId)
- Create signatureBlock JSON with signature value, key id, algorithm, timestamp, contentHash
- Append signatureBlock to PDF (as metadata) or provide a separate `.sig`/`.meta.json` file alongside CSV
- Store export files securely and return download link to user

### API Endpoints
- `POST /api/audit-exports` - Request export; body includes format and filter criteria; returns `exportId` and `status` (ready/in-progress)
- `GET /api/audit-exports/{exportId}` - Retrieve export metadata and download links
- `GET /api/audit-exports/{exportId}/download` - Download signed export file
- `GET /api/audit-exports/{exportId}/verify` - Verify signature & integrity (returns JSON with validation result)

### Frontend Components
- `ExportButton` - Triggers export modal
- `ExportModal` - Select format, date range, filters, and submit
- `ExportStatus` - Shows progress and provides download when ready
- `ExportList` - History of recent exports with `verify` action

### Key Management
- Use cloud KMS/HSM (recommended)
- Store `signingKeyId` in configuration and include in signatureBlock
- Provide HTTP endpoint for public key retrieval: `GET /api/keys/{signingKeyId}/public` for verifiers

---

## Test Scenarios

1. **Happy Path - Small CSV Export**
   - User requests CSV export for 2 days; export completes; metadata header present; signature verifies as `valid`

2. **Happy Path - PDF Export**
   - User requests PDF export; signed PDF metadata contains header and signature block; external verifier validates signature

3. **Background Export**
   - Large export initiated; background job completes; user receives notification with download link; verification endpoint reports `valid`

4. **Tamper Detection**
   - Modify exported CSV content after download; verification returns `invalid` (hash mismatch)

5. **Unknown Key**
   - Use old signingKeyId not present in public key directory; verification returns `unknown-key`

6. **Key Rotation**
   - After key rotation, new exports are signed with new key; old exports remain verifiable using historical public key

7. **Unauthorized Export**
   - A user without export permission attempts to export; request denied and a `EXPORT_AUDIT_LOG` entry created with outcome `FAILED`

8. **Partial Export**
   - If generation fails mid-run, partial export not delivered; error logged and user notified

---

## Notes
- Prefer detached signature formats for CSV to avoid modifying data bytes (use `audit-export-{exportId}.sig` and `audit-export-{exportId}.meta.json` alongside CSV)
- For PDF, embed signed metadata in PDF document metadata (XMP) and include signature block as attachment
- Provide open-source verification scripts (Node/Python) in docs to help external auditors verify signature validity
- Ensure export verification API rate-limits to prevent abuse


