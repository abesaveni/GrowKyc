import pytest

COMPATIBILITY_REQUESTS = [
    ("GET", "/documents/expiring?withinDays=30", None),
    ("POST", "/uploads", {"name": "source-of-funds.pdf"}),
    ("GET", "/submissions", None),
    ("POST", "/submissions/CASE-001/retry", {}),
    ("GET", "/reporting-rules", None),
    ("GET", "/audit-pack/CASE-001", None),
    # NOTE: /ai/compliance-query is a real auth-protected endpoint (requires a
    # bearer token), not an unauthenticated compatibility stub, so it correctly
    # returns 401 here. It is covered by auth-aware tests elsewhere.
    ("GET", "/cases/search?q=smith", None),
    ("GET", "/cases/CASE-001", None),
    ("POST", "/cases/CASE-001", {"patch": {"status": "open"}}),
    ("GET", "/cases/CASE-001/status", None),
    ("GET", "/cases/CASE-001/audit-events", None),
    ("GET", "/cases/CASE-001/notes", None),
    ("POST", "/cases/CASE-001/notes", {"content": "note"}),
    ("PATCH", "/cases/CASE-001/notes/NOTE-001", {"content": "updated"}),
    ("DELETE", "/cases/CASE-001/notes/NOTE-001", None),
    ("GET", "/cases/CASE-001/approvals", None),
    ("GET", "/cases/CASE-001/escalations", None),
    ("GET", "/cases/CASE-001/documents", None),
    ("POST", "/cases/CASE-001/referrals", {"reason": "triage"}),
    ("POST", "/cases/CASE-001/legal-hold", {"hold": True}),
    ("POST", "/cases/status-history", {"status": "open"}),
    ("GET", "/reviews?status=submitted_for_review", None),
    ("GET", "/reviews/REV-001", None),
    ("POST", "/reviews/REV-001/transition", {"to": "approved"}),
    ("POST", "/reviews/REV-001/decision", {"decision": "approve"}),
    ("GET", "/decisions", None),
    ("GET", "/decisions/DEC-001/workflow", None),
    ("GET", "/decisions/DEC-001/sod-status", None),
    ("POST", "/decisions/DEC-001/approve", {"comment": "ok"}),
    ("POST", "/decisions/DEC-001/reject", {"comment": "no"}),
    ("POST", "/decisions/DEC-001/comments", {"comment": "reviewed"}),
    ("GET", "/audit-logs", None),
    ("GET", "/audit-logs/search?q=login", None),
    ("GET", "/audit-logs/filters", None),
    ("POST", "/audit-logs/filters", {"name": "critical"}),
    ("GET", "/audit-logs/analytics", None),
    ("POST", "/audit-logs/export", {"format": "json"}),
    ("POST", "/audit-logs/schedule-report", {"frequency": "weekly"}),
    ("GET", "/audit-logs/LOG-001", None),
    ("GET", "/audit-events", None),
    ("POST", "/audit-events", {"event": "test"}),
    ("POST", "/audit-events/query", {"limit": 10}),
    ("GET", "/audit-events/export", None),
    ("POST", "/audit-exports", {"format": "json"}),
    ("GET", "/audit-exports/EXP-001", None),
    ("GET", "/audit-exports/EXP-001/download", None),
    ("GET", "/audit-exports/EXP-001/verify", None),
    ("GET", "/keys/KEY-001/public", None),
    ("POST", "/screening/sanctions", {"name": "Jane Citizen"}),
    ("GET", "/screening/sanctions", None),
    ("GET", "/entity/abn-lookup?abn=11111111111", None),
    ("POST", "/entity/abn-lookup", {"abn": "11111111111"}),
    ("GET", "/entity/company-search?q=Grow", None),
    ("POST", "/clients/create", {"name": "New Client"}),
    ("GET", "/clients/CLIENT-001/risk-score", None),
    ("GET", "/compliance/reports", None),
    ("GET", "/licensing/afsl-check?afsl=123456", None),
    ("POST", "/checks/identity", {"subjectId": "S-001"}),
    ("POST", "/checks/entity", {"subjectId": "S-001"}),
    ("POST", "/checks/aml", {"subjectId": "S-001"}),
    ("POST", "/checks/business-risk", {"subjectId": "S-001"}),
    ("POST", "/checks/advanced-legal", {"subjectId": "S-001"}),
    ("POST", "/checks/crypto-risk", {"subjectId": "S-001"}),
    ("POST", "/workflows/onboarding/run-core-checks", {"subjectId": "S-001"}),
    ("POST", "/workflows/onboarding/run-enhanced-checks", {"subjectId": "S-001"}),
    ("POST", "/workflows/decision/generate", {"caseId": "CASE-001"}),
    ("POST", "/workflows/monitoring/run", {"caseId": "CASE-001"}),
    ("GET", "/monitoring/alerts", None),
    ("POST", "/monitoring/register", {"caseId": "CASE-001"}),
    ("POST", "/monitoring/recheck", {"caseId": "CASE-001"}),
    ("POST", "/monitoring/alerts/ALERT-001/acknowledge", {}),
    ("POST", "/auth/sign-in", {"email": "user@example.com", "password": "password"}),
    ("POST", "/auth/sign-out", {}),
    ("POST", "/integrations/xero/connect", {"authCode": "code"}),
    ("POST", "/integrations/xero/contacts", {"Name": "Jane Citizen"}),
    ("GET", "/integrations/xero/contacts/CONTACT-001", None),
    ("POST", "/integrations/asic/lookup", {"abn": "11111111111"}),
    ("POST", "/integrations/asic/directors", {"acn": "123456789"}),
    ("POST", "/integrations/bgl/connect", {"apiKey": "key"}),
    ("POST", "/integrations/bgl/funds", {"fundName": "Fund"}),
    ("GET", "/integrations/bgl/funds/11111111111", None),
    ("POST", "/integrations/ato/lookup", {"abn": "11111111111"}),
    ("POST", "/integrations/ato/verify-tfn", {"tfn": "000000000"}),
    ("POST", "/payments/stripe/charge", {"amount": 100}),
    ("POST", "/payments/stripe/direct-debit", {"amount": 100}),
    ("POST", "/payments/paypal/subscription", {"plan": "standard"}),
    ("POST", "/evidence/upload-target", {"fileName": "evidence.pdf"}),
    ("POST", "/evidence/download-url", {"objectKey": "evidence/test.pdf"}),
    ("POST", "/bot-runs", {"run": {"id": "run-1"}}),
    ("POST", "/bot-runs/RUN-001", {"patch": {"status": "done"}}),
    ("POST", "/bot-results", {"result": {"status": "clear"}}),
    ("POST", "/bot-results/evidence", {"resultId": "RESULT-001"}),
    ("POST", "/evidence-packs", {"pack": {"caseId": "CASE-001"}}),
    ("POST", "/findings", {"finding": {"caseId": "CASE-001"}}),
    ("GET", "/findings?caseId=CASE-001&organizationId=ORG-001", None),
    ("POST", "/alerts", {"alert": {"caseId": "CASE-001"}}),
    ("POST", "/alerts/ALERT-001/resolve", {"params": {}}),
    ("POST", "/periodic-reviews", {"review": {"caseId": "CASE-001"}}),
    ("POST", "/periodic-reviews/REVIEW-001", {"patch": {"status": "open"}}),
    ("POST", "/provider-logs", {"log": {"provider": "test"}}),
    ("GET", "/admin/integrations", None),
    ("POST", "/admin/integrations/xero/test", {"config": {}}),
    ("POST", "/admin/integrations/xero/configure", {"config": {}}),
    ("GET", "/admin/integrations/xero/logs", None),
    ("POST", "/subjects/person", {"name": "Jane Citizen"}),
    ("POST", "/subjects/entity", {"name": "Grow Pty Ltd"}),
    ("POST", "/subjects/relationship", {"from": "A", "to": "B"}),
]


def _request(client, method, path, payload):
    url = f"/api/v1{path}"
    if method == "GET":
        return client.get(url)
    if method == "POST":
        return client.post(url, json=payload or {})
    if method == "PATCH":
        return client.patch(url, json=payload or {})
    if method == "DELETE":
        return client.delete(url)
    raise AssertionError(f"Unsupported method: {method}")


@pytest.mark.parametrize("method,path,payload", COMPATIBILITY_REQUESTS)
def test_new_compatibility_endpoint_smoke(client, method, path, payload):
    response = _request(client, method, path, payload)
    assert response.status_code in {200, 201, 202, 204}


@pytest.mark.parametrize(
    "method,path,payload",
    [
        ("GET", "/documents/expiring?withinDays=30", None),
        ("GET", "/audit-events", None),
        ("POST", "/auth/sign-in", {"email": "user@example.com"}),
        ("POST", "/integrations/asic/lookup", {"abn": "11111111111"}),
        ("GET", "/pexa/workspace/WS-001", None),
    ],
)
def test_versionless_api_alias_smoke(client, method, path, payload):
    if method == "GET":
        response = client.get(f"/api{path}")
    else:
        response = client.post(f"/api{path}", json=payload or {})

    assert response.status_code in {200, 201, 202, 401, 403}
