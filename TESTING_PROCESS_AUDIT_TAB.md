# Testing Process: Audit Tab – Comprehensive Audit Trail

## Testing Strategy Overview

This guide covers unit tests, integration tests, end-to-end tests, and manual testing for the Audit Tab feature with comprehensive event logging, filtering, and reporting capabilities.

---

## 1. UNIT TESTS

### 1.1 Audit Log Entry Creation Tests

**File:** `tests/unit/audit/audit-logger.test.ts`

```typescript
describe('Audit Logger - Event Creation', () => {
  let logger: AuditLogger;
  let mockDatabase: jest.Mocked<Database>;

  beforeEach(() => {
    mockDatabase = createMockDatabase();
    logger = new AuditLogger(mockDatabase);
  });

  describe('Basic Event Logging', () => {
    it('should create audit log entry with all required fields', () => {
      const event = logger.logEvent({
        actorId: 'user-1',
        actorName: 'John Smith',
        actorRole: 'Compliance Analyst',
        action: 'APPROVE_DECISION',
        entityType: 'Decision',
        entityId: 'DOC-001',
        entityName: 'KYC Verification - Applicant ABC',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
        outcome: 'SUCCESS',
        statusCode: 200
      });

      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('eventId');
      expect(event).toHaveProperty('timestamp');
      expect(event.actor_id).toBe('user-1');
      expect(event.action).toBe('APPROVE_DECISION');
      expect(event.ip_address).toBe('192.168.1.100');
    });

    it('should generate unique event IDs', () => {
      const event1 = logger.logEvent({ /* ...params */ });
      const event2 = logger.logEvent({ /* ...params */ });
      
      expect(event1.eventId).not.toBe(event2.eventId);
    });

    it('should capture request payload when provided', () => {
      const requestPayload = { decision: 'APPROVED', comments: 'Verified' };
      const event = logger.logEvent({
        /* ...params */,
        requestPayload
      });

      expect(event.request_payload).toEqual(requestPayload);
    });

    it('should capture response payload when provided', () => {
      const responsePayload = { success: true, message: 'Decision approved' };
      const event = logger.logEvent({
        /* ...params */,
        responsePayload
      });

      expect(event.response_payload).toEqual(responsePayload);
    });

    it('should track resource state changes (before/after)', () => {
      const resourceBefore = { status: 'PENDING', approver: null };
      const resourceAfter = { status: 'APPROVED', approver: 'user-1' };
      
      const event = logger.logEvent({
        /* ...params */,
        resourceBefore,
        resourceAfter
      });

      expect(event.resource_before).toEqual(resourceBefore);
      expect(event.resource_after).toEqual(resourceAfter);
    });

    it('should handle failed events with error messages', () => {
      const event = logger.logEvent({
        /* ...params */,
        outcome: 'FAILED',
        statusCode: 403,
        errorMessage: 'Permission Denied: User lacks required role'
      });

      expect(event.outcome).toBe('FAILED');
      expect(event.status_code).toBe(403);
      expect(event.error_message).toContain('Permission Denied');
    });

    it('should set severity level based on action', () => {
      const infoEvent = logger.logEvent({
        /* ...params */,
        action: 'VIEW_DOCUMENT'
      });
      expect(infoEvent.severity_level).toBe('INFO');

      const warningEvent = logger.logEvent({
        /* ...params */,
        action: 'FAILED_LOGIN'
      });
      expect(warningEvent.severity_level).toBe('WARNING');

      const criticalEvent = logger.logEvent({
        /* ...params */,
        action: 'DELETE_DECISION'
      });
      expect(criticalEvent.severity_level).toBe('CRITICAL');
    });
  });

  describe('Event Categorization', () => {
    it('should categorize user management events', () => {
      const actions = ['CREATE_USER', 'UPDATE_USER', 'DELETE_USER', 'DISABLE_USER'];
      
      actions.forEach(action => {
        const event = logger.logEvent({ /* ...params */, action });
        expect(event.category).toBe('USER_MANAGEMENT');
      });
    });

    it('should categorize authentication events', () => {
      const actions = ['LOGIN', 'LOGOUT', 'FAILED_LOGIN', 'MFA_CHALLENGE'];
      
      actions.forEach(action => {
        const event = logger.logEvent({ /* ...params */, action });
        expect(event.category).toBe('AUTHENTICATION');
      });
    });

    it('should categorize decision management events', () => {
      const actions = ['CREATE_DECISION', 'UPDATE_DECISION', 'APPROVE_DECISION', 'REJECT_DECISION'];
      
      actions.forEach(action => {
        const event = logger.logEvent({ /* ...params */, action });
        expect(event.category).toBe('DECISION_MANAGEMENT');
      });
    });

    it('should categorize system events', () => {
      const actions = ['BACKUP_COMPLETED', 'BATCH_PROCESS', 'CONFIG_CHANGE'];
      
      actions.forEach(action => {
        const event = logger.logEvent({ /* ...params */, action });
        expect(event.category).toBe('SYSTEM_EVENT');
      });
    });
  });

  describe('Data Redaction', () => {
    it('should redact sensitive fields in audit logs', () => {
      const sensitivePayload = {
        password: 'secret123',
        apiKey: 'sk_live_abc123',
        ssn: '123-45-6789'
      };

      const event = logger.logEvent({
        /* ...params */,
        requestPayload: sensitivePayload
      });

      const redactedPayload = logger.redactSensitiveData(event.request_payload);
      expect(redactedPayload.password).toBe('***REDACTED***');
      expect(redactedPayload.apiKey).toBe('***REDACTED***');
      expect(redactedPayload.ssn).toBe('***REDACTED***');
    });

    it('should preserve non-sensitive fields', () => {
      const payload = {
        userId: 'user-1',
        action: 'APPROVE',
        comments: 'Document verified'
      };

      const redacted = logger.redactSensitiveData(payload);
      expect(redacted.userId).toBe('user-1');
      expect(redacted.action).toBe('APPROVE');
      expect(redacted.comments).toBe('Document verified');
    });
  });
});
```

### 1.2 Audit Log Filtering Tests

**File:** `tests/unit/audit/audit-filter.test.ts`

```typescript
describe('Audit Log Filtering', () => {
  let filter: AuditFilter;
  let mockLogs: AuditLog[];

  beforeEach(() => {
    filter = new AuditFilter();
    mockLogs = createMockAuditLogs(100);
  });

  describe('Filter by Actor', () => {
    it('should filter logs by single actor', () => {
      const filtered = filter.filterByActor(mockLogs, 'user-1');
      expect(filtered.every(log => log.actor_id === 'user-1')).toBe(true);
    });

    it('should filter logs by multiple actors (OR logic)', () => {
      const filtered = filter.filterByActor(mockLogs, ['user-1', 'user-2']);
      expect(filtered.every(log => 
        log.actor_id === 'user-1' || log.actor_id === 'user-2'
      )).toBe(true);
    });

    it('should filter by actor role', () => {
      const filtered = filter.filterByRole(mockLogs, 'Compliance Officer');
      expect(filtered.every(log => log.actor_role === 'Compliance Officer')).toBe(true);
    });

    it('should filter by actor department', () => {
      const filtered = filter.filterByDepartment(mockLogs, 'COMPLIANCE');
      expect(filtered.every(log => log.actor_department === 'COMPLIANCE')).toBe(true);
    });
  });

  describe('Filter by Action', () => {
    it('should filter logs by single action', () => {
      const filtered = filter.filterByAction(mockLogs, 'APPROVE_DECISION');
      expect(filtered.every(log => log.action === 'APPROVE_DECISION')).toBe(true);
    });

    it('should filter logs by multiple actions', () => {
      const filtered = filter.filterByAction(mockLogs, ['CREATE_DECISION', 'APPROVE_DECISION']);
      expect(filtered.every(log => 
        log.action === 'CREATE_DECISION' || log.action === 'APPROVE_DECISION'
      )).toBe(true);
    });

    it('should filter by action category', () => {
      const filtered = filter.filterByCategory(mockLogs, 'DECISION_MANAGEMENT');
      expect(filtered.every(log => 
        ['CREATE_DECISION', 'UPDATE_DECISION', 'APPROVE_DECISION'].includes(log.action)
      )).toBe(true);
    });
  });

  describe('Filter by Entity', () => {
    it('should filter logs by entity type', () => {
      const filtered = filter.filterByEntityType(mockLogs, 'Decision');
      expect(filtered.every(log => log.entity_type === 'Decision')).toBe(true);
    });

    it('should filter logs by entity ID', () => {
      const filtered = filter.filterByEntityId(mockLogs, 'DOC-001');
      expect(filtered.every(log => log.entity_id === 'DOC-001')).toBe(true);
    });

    it('should filter by multiple entity types', () => {
      const filtered = filter.filterByEntityType(mockLogs, ['Decision', 'User']);
      expect(filtered.every(log => 
        log.entity_type === 'Decision' || log.entity_type === 'User'
      )).toBe(true);
    });
  });

  describe('Filter by Date/Time Range', () => {
    it('should filter logs by date range', () => {
      const startDate = new Date('2024-03-01');
      const endDate = new Date('2024-03-31');
      
      const filtered = filter.filterByDateRange(mockLogs, startDate, endDate);
      expect(filtered.every(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= startDate && logDate <= endDate;
      })).toBe(true);
    });

    it('should filter logs by preset date range (Last 7 Days)', () => {
      const filtered = filter.filterByPreset(mockLogs, 'LAST_7_DAYS');
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      expect(filtered.every(log => 
        new Date(log.timestamp) >= sevenDaysAgo
      )).toBe(true);
    });

    it('should filter logs by time of day', () => {
      const filtered = filter.filterByTimeRange(mockLogs, '09:00', '17:00');
      expect(filtered.every(log => {
        const time = new Date(log.timestamp).getHours();
        return time >= 9 && time < 17;
      })).toBe(true);
    });
  });

  describe('Filter by IP Address', () => {
    it('should filter logs by exact IP address', () => {
      const filtered = filter.filterByIP(mockLogs, '192.168.1.100');
      expect(filtered.every(log => log.ip_address === '192.168.1.100')).toBe(true);
    });

    it('should filter logs by IP range (CIDR)', () => {
      const filtered = filter.filterByIPRange(mockLogs, '192.168.1.0/24');
      expect(filtered.every(log => 
        isIPInRange(log.ip_address, '192.168.1.0/24')
      )).toBe(true);
    });
  });

  describe('Filter by Outcome & Severity', () => {
    it('should filter logs by outcome (SUCCESS, FAILED, PARTIAL)', () => {
      const filtered = filter.filterByOutcome(mockLogs, 'FAILED');
      expect(filtered.every(log => log.outcome === 'FAILED')).toBe(true);
    });

    it('should filter logs by severity level', () => {
      const filtered = filter.filterBySeverity(mockLogs, 'CRITICAL');
      expect(filtered.every(log => log.severity_level === 'CRITICAL')).toBe(true);
    });

    it('should filter by multiple severity levels', () => {
      const filtered = filter.filterBySeverity(mockLogs, ['WARNING', 'CRITICAL']);
      expect(filtered.every(log => 
        log.severity_level === 'WARNING' || log.severity_level === 'CRITICAL'
      )).toBe(true);
    });
  });

  describe('Combined Filtering', () => {
    it('should apply multiple filters with AND logic', () => {
      const criteria = {
        actorId: 'user-1',
        action: 'APPROVE_DECISION',
        dateStart: new Date('2024-03-01'),
        dateEnd: new Date('2024-03-31'),
        outcome: 'SUCCESS'
      };

      const filtered = filter.applyFilters(mockLogs, criteria);
      
      expect(filtered.every(log => 
        log.actor_id === 'user-1' &&
        log.action === 'APPROVE_DECISION' &&
        log.outcome === 'SUCCESS' &&
        new Date(log.timestamp) >= criteria.dateStart
      )).toBe(true);
    });

    it('should return empty array when no matches found', () => {
      const criteria = {
        actorId: 'non-existent-user',
        action: 'INVALID_ACTION'
      };

      const filtered = filter.applyFilters(mockLogs, criteria);
      expect(filtered).toHaveLength(0);
    });
  });

  describe('Filter Presets', () => {
    it('should save filter preset', () => {
      const preset = {
        name: 'Suspicious Activity',
        criteria: {
          severity: 'CRITICAL',
          outcome: 'FAILED'
        }
      };

      filter.savePreset(preset);
      const saved = filter.getPreset('Suspicious Activity');
      
      expect(saved).toEqual(preset);
    });

    it('should list all saved presets', () => {
      filter.savePreset({ name: 'Preset 1', criteria: {} });
      filter.savePreset({ name: 'Preset 2', criteria: {} });

      const presets = filter.getPresets();
      expect(presets).toHaveLength(2);
    });
  });
});
```

### 1.3 Audit Log Search Tests

**File:** `tests/unit/audit/audit-search.test.ts`

```typescript
describe('Audit Log Search', () => {
  let search: AuditSearch;
  let mockLogs: AuditLog[];

  beforeEach(() => {
    search = new AuditSearch();
    mockLogs = createMockAuditLogs(200);
  });

  describe('Full-Text Search', () => {
    it('should search by keyword across all fields', () => {
      const results = search.search(mockLogs, 'DOC-001');
      
      expect(results.every(log => 
        log.entity_id.includes('DOC-001') ||
        log.entity_name.includes('DOC-001') ||
        log.error_message?.includes('DOC-001')
      )).toBe(true);
    });

    it('should support phrase search with quotes', () => {
      const results = search.search(mockLogs, '"Permission Denied"');
      
      expect(results.every(log => 
        log.error_message?.includes('Permission Denied')
      )).toBe(true);
    });

    it('should support wildcard search', () => {
      const results = search.search(mockLogs, 'APPROVE*');
      
      expect(results.every(log => 
        log.action.startsWith('APPROVE')
      )).toBe(true);
    });

    it('should be case-insensitive', () => {
      const results1 = search.search(mockLogs, 'approve_decision');
      const results2 = search.search(mockLogs, 'APPROVE_DECISION');
      
      expect(results1.length).toBe(results2.length);
    });
  });

  describe('Search Performance', () => {
    it('should complete search within 100ms for 1000 logs', () => {
      const largeMockLogs = createMockAuditLogs(1000);
      const startTime = performance.now();
      
      search.search(largeMockLogs, 'test');
      
      const duration = performance.now() - startTime;
      expect(duration).toBeLessThan(100);
    });

    it('should use index for fast lookup', () => {
      search.buildIndex(mockLogs);
      const startTime = performance.now();
      
      const results = search.search(mockLogs, 'APPROVE_DECISION');
      
      const duration = performance.now() - startTime;
      expect(duration).toBeLessThan(50);
    });
  });
});
```

---

## 2. INTEGRATION TESTS

### 2.1 Audit Log Capture Integration Tests

**File:** `tests/integration/audit/audit-capture.test.ts`

```typescript
describe('Audit Log Capture Integration', () => {
  let app: Express.Application;
  let db: Database;
  let auditService: AuditService;
  let request: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    db = new Database();
    await db.connect();
    auditService = new AuditService(db);
    app = createApp(auditService);
    request = supertest(app);
  });

  afterAll(async () => {
    await db.disconnect();
  });

  describe('User Action Logging', () => {
    it('should log decision approval action', async () => {
      const response = await request
        .post('/api/decisions/DOC-001/approve')
        .set('Authorization', `Bearer ${getTestToken('user-1')}`)
        .send({ comments: 'Approved' });

      expect(response.status).toBe(200);

      const auditLogs = await db.query(
        'SELECT * FROM audit_logs WHERE action = ? AND entity_id = ?',
        ['APPROVE_DECISION', 'DOC-001']
      );

      expect(auditLogs).toHaveLength(1);
      expect(auditLogs[0].actor_id).toBe('user-1');
      expect(auditLogs[0].outcome).toBe('SUCCESS');
    });

    it('should log failed login attempts', async () => {
      const response = await request
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrong' });

      expect(response.status).toBe(401);

      const auditLogs = await db.query(
        'SELECT * FROM audit_logs WHERE action = ? AND outcome = ?',
        ['LOGIN', 'FAILED']
      );

      expect(auditLogs.length).toBeGreaterThan(0);
      expect(auditLogs[0].status_code).toBe(401);
    });

    it('should log successful login', async () => {
      const response = await request
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'correct_password' });

      expect(response.status).toBe(200);

      const auditLogs = await db.query(
        'SELECT * FROM audit_logs WHERE action = ? AND outcome = ?',
        ['LOGIN', 'SUCCESS']
      );

      expect(auditLogs.length).toBeGreaterThan(0);
      expect(auditLogs[0].actor_id).toBeDefined();
    });

    it('should capture IP address and user agent', async () => {
      await request
        .post('/api/auth/login')
        .set('User-Agent', 'Mozilla/5.0 Test')
        .send({ email: 'test@example.com', password: 'correct_password' });

      const auditLogs = await db.query(
        'SELECT * FROM audit_logs WHERE action = ? ORDER BY created_at DESC LIMIT 1',
        ['LOGIN']
      );

      expect(auditLogs[0].ip_address).toBeDefined();
      expect(auditLogs[0].user_agent).toContain('Mozilla/5.0');
    });
  });

  describe('Permission Enforcement Logging', () => {
    it('should log permission denied errors', async () => {
      const response = await request
        .post('/api/decisions/DOC-001/approve')
        .set('Authorization', `Bearer ${getTestToken('analyst-1')}`) // Analyst, not approver
        .send({ comments: 'Not allowed' });

      expect(response.status).toBe(403);

      const auditLogs = await db.query(
        'SELECT * FROM audit_logs WHERE outcome = ? ORDER BY created_at DESC LIMIT 1',
        ['FAILED']
      );

      expect(auditLogs[0].status_code).toBe(403);
      expect(auditLogs[0].error_message).toContain('Permission');
    });

    it('should track role changes', async () => {
      await request
        .patch('/api/users/user-1/role')
        .set('Authorization', `Bearer ${getTestToken('admin')}`)
        .send({ role: 'Approver' });

      const auditLogs = await db.query(
        'SELECT * FROM audit_logs WHERE action = ? AND entity_id = ?',
        ['UPDATE_USER', 'user-1']
      );

      expect(auditLogs[0].resource_before).toHaveProperty('role');
      expect(auditLogs[0].resource_after.role).toBe('Approver');
    });
  });

  describe('Sensitive Data Redaction', () => {
    it('should redact password in audit logs', async () => {
      await request
        .post('/api/users')
        .set('Authorization', `Bearer ${getTestToken('admin')}`)
        .send({ 
          name: 'New User',
          email: 'user@example.com',
          password: 'SuperSecret123'
        });

      const auditLogs = await db.query(
        'SELECT * FROM audit_logs WHERE action = ? ORDER BY created_at DESC LIMIT 1',
        ['CREATE_USER']
      );

      expect(auditLogs[0].request_payload.password).toBe('***REDACTED***');
    });

    it('should redact API keys in audit logs', async () => {
      const payload = {
        apiKey: 'sk_live_abc123def456',
        label: 'Integration Key'
      };

      const redacted = auditService.redactSensitiveData(payload);
      expect(redacted.apiKey).toBe('***REDACTED***');
      expect(redacted.label).toBe('Integration Key');
    });
  });

  describe('Before/After State Tracking', () => {
    it('should track resource changes for update operations', async () => {
      await request
        .patch('/api/decisions/DOC-001')
        .set('Authorization', `Bearer ${getTestToken('user-1')}`)
        .send({ status: 'VERIFIED' });

      const auditLogs = await db.query(
        'SELECT * FROM audit_logs WHERE entity_id = ? AND action = ? ORDER BY created_at DESC LIMIT 1',
        ['DOC-001', 'UPDATE_DECISION']
      );

      const log = auditLogs[0];
      expect(log.resource_before).toBeDefined();
      expect(log.resource_after).toBeDefined();
      expect(log.resource_after.status).toBe('VERIFIED');
    });
  });

  describe('Timestamp Accuracy', () => {
    it('should record accurate timestamps for events', async () => {
      const beforeTime = new Date();

      await request
        .post('/api/decisions/DOC-001/approve')
        .set('Authorization', `Bearer ${getTestToken('user-1')}`)
        .send({ comments: 'OK' });

      const afterTime = new Date();

      const auditLogs = await db.query(
        'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 1'
      );

      const logTime = new Date(auditLogs[0].timestamp);
      expect(logTime.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(logTime.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });

    it('should handle timezone information correctly', async () => {
      const auditLogs = await db.query(
        'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 1'
      );

      const timestamp = auditLogs[0].timestamp;
      expect(timestamp).toMatch(/T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/); // ISO format with Z
    });
  });
});
```

### 2.2 Audit Log Filtering Integration Tests

**File:** `tests/integration/audit/audit-filtering.test.ts`

```typescript
describe('Audit Log Filtering API Integration', () => {
  let app: Express.Application;
  let db: Database;
  let request: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    db = new Database();
    await db.connect();
    app = createApp();
    request = supertest(app);
    await seedAuditLogs(db, 500);
  });

  describe('GET /api/audit-logs', () => {
    it('should return all audit logs with pagination', async () => {
      const response = await request
        .get('/api/audit-logs')
        .set('Authorization', `Bearer ${getTestToken('admin')}`)
        .query({ page: 1, limit: 50 });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(50);
      expect(response.body.total).toBeGreaterThanOrEqual(50);
      expect(response.body.page).toBe(1);
    });

    it('should filter by actor ID', async () => {
      const response = await request
        .get('/api/audit-logs')
        .set('Authorization', `Bearer ${getTestToken('admin')}`)
        .query({ actorId: 'user-1' });

      expect(response.status).toBe(200);
      expect(response.body.data.every(log => log.actor_id === 'user-1')).toBe(true);
    });

    it('should filter by action type', async () => {
      const response = await request
        .get('/api/audit-logs')
        .set('Authorization', `Bearer ${getTestToken('admin')}`)
        .query({ action: 'APPROVE_DECISION' });

      expect(response.status).toBe(200);
      expect(response.body.data.every(log => log.action === 'APPROVE_DECISION')).toBe(true);
    });

    it('should filter by date range', async () => {
      const startDate = '2024-03-01T00:00:00Z';
      const endDate = '2024-03-31T23:59:59Z';

      const response = await request
        .get('/api/audit-logs')
        .set('Authorization', `Bearer ${getTestToken('admin')}`)
        .query({ startDate, endDate });

      expect(response.status).toBe(200);
      expect(response.body.data.every(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= new Date(startDate) && logDate <= new Date(endDate);
      })).toBe(true);
    });

    it('should filter by multiple criteria combined', async () => {
      const response = await request
        .get('/api/audit-logs')
        .set('Authorization', `Bearer ${getTestToken('admin')}`)
        .query({
          actorId: 'user-1',
          action: 'APPROVE_DECISION',
          outcome: 'SUCCESS'
        });

      expect(response.status).toBe(200);
      expect(response.body.data.every(log =>
        log.actor_id === 'user-1' &&
        log.action === 'APPROVE_DECISION' &&
        log.outcome === 'SUCCESS'
      )).toBe(true);
    });
  });

  describe('GET /api/audit-logs/{id}', () => {
    it('should return detailed audit log entry', async () => {
      const auditLogs = await db.query('SELECT id FROM audit_logs LIMIT 1');
      const logId = auditLogs[0].id;

      const response = await request
        .get(`/api/audit-logs/${logId}`)
        .set('Authorization', `Bearer ${getTestToken('admin')}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', logId);
      expect(response.body).toHaveProperty('request_payload');
      expect(response.body).toHaveProperty('resource_before');
      expect(response.body).toHaveProperty('resource_after');
    });

    it('should redact sensitive data in detail view', async () => {
      const auditLogs = await db.query(
        'SELECT id FROM audit_logs WHERE request_payload LIKE ? LIMIT 1',
        ['%password%']
      );
      const logId = auditLogs[0].id;

      const response = await request
        .get(`/api/audit-logs/${logId}`)
        .set('Authorization', `Bearer ${getTestToken('admin')}`);

      expect(response.body.request_payload.password).toBe('***REDACTED***');
    });
  });

  describe('GET /api/audit-logs/search', () => {
    it('should search by keyword', async () => {
      const response = await request
        .get('/api/audit-logs/search')
        .set('Authorization', `Bearer ${getTestToken('admin')}`)
        .query({ q: 'DOC-001' });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return search results within acceptable time', async () => {
      const startTime = performance.now();

      await request
        .get('/api/audit-logs/search')
        .set('Authorization', `Bearer ${getTestToken('admin')}`)
        .query({ q: 'APPROVE' });

      const duration = performance.now() - startTime;
      expect(duration).toBeLessThan(500);
    });
  });
});
```

### 2.3 Audit Log Export Integration Tests

**File:** `tests/integration/audit/audit-export.test.ts`

```typescript
describe('Audit Log Export Integration', () => {
  let app: Express.Application;
  let request: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    app = createApp();
    request = supertest(app);
  });

  describe('CSV Export', () => {
    it('should export audit logs as CSV', async () => {
      const response = await request
        .post('/api/audit-logs/export')
        .set('Authorization', `Bearer ${getTestToken('admin')}`)
        .send({
          format: 'CSV',
          startDate: '2024-03-01T00:00:00Z',
          endDate: '2024-03-31T23:59:59Z'
        });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.text).toContain('actor_id');
      expect(response.text).toContain('action');
    });

    it('should apply filters to export', async () => {
      const response = await request
        .post('/api/audit-logs/export')
        .set('Authorization', `Bearer ${getTestToken('admin')}`)
        .send({
          format: 'CSV',
          filters: { actorId: 'user-1', action: 'APPROVE_DECISION' }
        });

      expect(response.status).toBe(200);
      const lines = response.text.split('\n');
      // Verify filtered data
      expect(lines.length).toBeGreaterThan(1);
    });
  });

  describe('PDF Export', () => {
    it('should export audit logs as formatted PDF', async () => {
      const response = await request
        .post('/api/audit-logs/export')
        .set('Authorization', `Bearer ${getTestToken('admin')}`)
        .send({
          format: 'PDF',
          startDate: '2024-03-01T00:00:00Z',
          endDate: '2024-03-31T23:59:59Z'
        });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/pdf');
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('JSON Export', () => {
    it('should export audit logs as JSON', async () => {
      const response = await request
        .post('/api/audit-logs/export')
        .set('Authorization', `Bearer ${getTestToken('admin')}`)
        .send({
          format: 'JSON',
          startDate: '2024-03-01T00:00:00Z',
          endDate: '2024-03-31T23:59:59Z'
        });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Export Audit Trail', () => {
    it('should log the export action itself', async () => {
      const exportResponse = await request
        .post('/api/audit-logs/export')
        .set('Authorization', `Bearer ${getTestToken('admin')}`)
        .send({ format: 'CSV' });

      expect(exportResponse.status).toBe(200);

      // Check if export was logged
      const auditLogs = await db.query(
        'SELECT * FROM audit_logs WHERE action = ? ORDER BY created_at DESC LIMIT 1',
        ['EXPORT_AUDIT_LOG']
      );

      expect(auditLogs.length).toBeGreaterThan(0);
    });
  });
});
```

---

## 3. END-TO-END TESTS

### 3.1 Audit Tab UI Tests

**File:** `tests/e2e/audit-tab.e2e.ts`

```typescript
describe('Audit Tab E2E Tests', () => {
  beforeEach(() => {
    cy.login('admin@grow.com');
    cy.visit('/compliance/audit');
  });

  describe('Audit Timeline Display', () => {
    it('should display audit events in chronological order', () => {
      cy.get('[data-testid="audit-timeline"]').should('exist');
      cy.get('[data-testid="audit-entry"]').should('have.length.greaterThan', 0);

      // Verify newest first
      cy.get('[data-testid="audit-entry-timestamp"]').then(timestamps => {
        for (let i = 0; i < timestamps.length - 1; i++) {
          const current = new Date(timestamps.eq(i).text());
          const next = new Date(timestamps.eq(i + 1).text());
          expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
        }
      });
    });

    it('should display all required columns', () => {
      cy.get('[data-testid="audit-entry"]').first().within(() => {
        cy.get('[data-testid="actor"]').should('exist');
        cy.get('[data-testid="action"]').should('exist');
        cy.get('[data-testid="entity"]').should('exist');
        cy.get('[data-testid="timestamp"]').should('exist');
        cy.get('[data-testid="ip-address"]').should('exist');
        cy.get('[data-testid="outcome"]').should('exist');
      });
    });
  });

  describe('Filtering', () => {
    it('should filter by actor', () => {
      cy.get('[data-testid="filter-actor"]').click();
      cy.get('[data-testid="actor-input"]').type('John Smith');
      cy.get('[data-testid="apply-filter"]').click();

      cy.get('[data-testid="audit-entry"]').each(entry => {
        cy.wrap(entry)
          .find('[data-testid="actor"]')
          .should('contain', 'John Smith');
      });
    });

    it('should filter by action type', () => {
      cy.get('[data-testid="filter-action"]').click();
      cy.get('[data-testid="action-dropdown"]').select('APPROVE_DECISION');
      cy.get('[data-testid="apply-filter"]').click();

      cy.get('[data-testid="audit-entry"]').each(entry => {
        cy.wrap(entry)
          .find('[data-testid="action"]')
          .should('contain', 'APPROVE_DECISION');
      });
    });

    it('should filter by date range', () => {
      cy.get('[data-testid="filter-date"]').click();
      cy.get('[data-testid="date-preset"]').select('LAST_7_DAYS');
      cy.get('[data-testid="apply-filter"]').click();

      cy.get('[data-testid="audit-entry"]').should('have.length.greaterThan', 0);
    });

    it('should filter by outcome (Success/Failed)', () => {
      cy.get('[data-testid="filter-outcome"]').click();
      cy.get('[data-testid="outcome-failed"]').click();
      cy.get('[data-testid="apply-filter"]').click();

      cy.get('[data-testid="audit-entry"]').each(entry => {
        cy.wrap(entry)
          .find('[data-testid="outcome"]')
          .should('contain', '✗ Failed');
      });
    });

    it('should save filter preset', () => {
      cy.get('[data-testid="filter-actor"]').click();
      cy.get('[data-testid="actor-input"]').type('user-1');
      cy.get('[data-testid="save-filter-preset"]').click();
      cy.get('[data-testid="preset-name"]').type('User-1 Activity');
      cy.get('[data-testid="confirm-save"]').click();

      cy.get('[data-testid="filter-presets"]')
        .should('contain', 'User-1 Activity');
    });
  });

  describe('Event Details', () => {
    it('should show detailed event information on click', () => {
      cy.get('[data-testid="audit-entry"]').first().click();

      cy.get('[data-testid="event-detail-modal"]').should('exist');
      cy.get('[data-testid="detail-actor"]').should('not.be.empty');
      cy.get('[data-testid="detail-action"]').should('not.be.empty');
      cy.get('[data-testid="detail-timestamp"]').should('not.be.empty');
      cy.get('[data-testid="detail-ip"]').should('not.be.empty');
    });

    it('should show request/response payloads with redacted sensitive data', () => {
      cy.get('[data-testid="audit-entry"]:contains("CREATE_USER")').first().click();

      cy.get('[data-testid="request-payload"]').should('exist');
      cy.get('[data-testid="request-payload"]').should('contain', '***REDACTED***');
    });

    it('should show before/after state for update operations', () => {
      cy.get('[data-testid="audit-entry"]:contains("UPDATE_DECISION")').first().click();

      cy.get('[data-testid="resource-before"]').should('exist');
      cy.get('[data-testid="resource-after"]').should('exist');
    });
  });

  describe('Export', () => {
    it('should export audit logs as CSV', () => {
      cy.get('[data-testid="export-button"]').click();
      cy.get('[data-testid="export-format-csv"]').click();
      cy.get('[data-testid="export-confirm"]').click();

      cy.readFile('cypress/downloads').should('exist');
    });

    it('should export with applied filters', () => {
      cy.get('[data-testid="filter-actor"]').click();
      cy.get('[data-testid="actor-input"]').type('user-1');
      cy.get('[data-testid="apply-filter"]').click();

      cy.get('[data-testid="export-button"]').click();
      cy.get('[data-testid="export-format-csv"]').click();
      cy.get('[data-testid="export-confirm"]').click();

      // Verify exported file contains only filtered data
      cy.readFile('cypress/downloads/audit-logs.csv')
        .should('contain', 'user-1');
    });
  });

  describe('Search', () => {
    it('should search audit logs by keyword', () => {
      cy.get('[data-testid="search-input"]').type('DOC-001');
      cy.get('[data-testid="search-button"]').click();

      cy.get('[data-testid="audit-entry"]').each(entry => {
        cy.wrap(entry).should('contain', 'DOC-001');
      });
    });

    it('should search across all fields', () => {
      cy.get('[data-testid="search-input"]').type('Permission Denied');
      cy.get('[data-testid="search-button"]').click();

      cy.get('[data-testid="audit-entry"]').should('have.length.greaterThan', 0);
    });
  });

  describe('Analytics', () => {
    it('should display audit metrics dashboard', () => {
      cy.get('[data-testid="analytics-tab"]').click();

      cy.get('[data-testid="metric-total-events"]').should('exist');
      cy.get('[data-testid="metric-unique-users"]').should('exist');
      cy.get('[data-testid="metric-failed-events"]').should('exist');
      cy.get('[data-testid="metric-critical-events"]').should('exist');
    });

    it('should show activity heatmap', () => {
      cy.get('[data-testid="analytics-tab"]').click();
      cy.get('[data-testid="heatmap"]').should('exist');
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard navigable', () => {
      cy.get('[data-testid="filter-button"]').focus();
      cy.realPress('Tab');
      cy.realPress('Tab');
      cy.realPress('Enter');

      cy.get('[data-testid="filter-panel"]').should('be.visible');
    });

    it('should have proper ARIA labels', () => {
      cy.get('[data-testid="export-button"]')
        .should('have.attr', 'aria-label');

      cy.get('[data-testid="audit-timeline"]')
        .should('have.attr', 'role', 'grid');
    });
  });

  describe('Performance', () => {
    it('should load audit page within 3 seconds', () => {
      const startTime = Date.now();
      cy.visit('/compliance/audit');
      cy.get('[data-testid="audit-timeline"]').should('exist');
      
      expect(Date.now() - startTime).toBeLessThan(3000);
    });

    it('should filter results within 500ms', () => {
      const startTime = performance.now();
      
      cy.get('[data-testid="filter-actor"]').click();
      cy.get('[data-testid="actor-input"]').type('user-1');
      cy.get('[data-testid="apply-filter"]').click();
      
      cy.get('[data-testid="audit-entry"]').should('have.length.greaterThan', 0);
      
      // Verify response time
      cy.then(() => {
        const duration = performance.now() - startTime;
        expect(duration).toBeLessThan(500);
      });
    });
  });
});
```

---

## 4. MANUAL TESTING CHECKLIST

### 4.1 Audit Timeline Display
- [ ] Navigate to Compliance > Audit Tab
- [ ] Verify events display in reverse chronological order (newest first)
- [ ] Verify all 6 columns visible: Actor, Action, Entity, Timestamp, IP, Outcome
- [ ] Verify columns are sortable
- [ ] Click column header to sort ascending/descending
- [ ] Verify pagination works (50 items per page)

### 4.2 Actor Column
- [ ] Verify shows: Name (ID, Role)
- [ ] Example: "John Smith (analyst-1, Compliance Analyst)"
- [ ] Click actor name to filter by user
- [ ] Verify department is displayed on hover

### 4.3 Action Column
- [ ] Verify shows action type (CREATE, UPDATE, APPROVE, etc.)
- [ ] Verify category badges (User Management, Authentication, etc.)
- [ ] Verify system events are captured (Backup, Process Batch)
- [ ] Verify security events are flagged with warning badge

### 4.4 Entity Column
- [ ] Verify shows entity type and ID
- [ ] Example: "Decision - DOC-001"
- [ ] Click entity link to navigate to resource
- [ ] Verify entity name on hover

### 4.5 Timestamp Column
- [ ] Verify ISO format with timezone
- [ ] Verify relative time on hover ("2 hours ago")
- [ ] Click to sort by date ascending/descending
- [ ] Verify timezone handling across regions

### 4.6 IP Address Column
- [ ] Verify IP address is captured
- [ ] Verify IP can be filtered
- [ ] Click IP to show all activity from that IP
- [ ] Verify geolocation on hover

### 4.7 Outcome Column
- [ ] Verify shows: ✓ Success (green), ✗ Failed (red)
- [ ] Verify failed events show error code
- [ ] Filter by "Failed" to show only failures
- [ ] Click failed event to see error message

### 4.8 Filter by Actor
- [ ] Open Filter panel
- [ ] Select single user - verify results filtered
- [ ] Select multiple users - verify AND logic
- [ ] Filter by role (Analyst, Manager, Admin)
- [ ] Filter by department (Compliance, Operations)
- [ ] Clear filter - verify all results return

### 4.9 Filter by Action
- [ ] Select action type from dropdown
- [ ] Verify only that action appears
- [ ] Select multiple action types
- [ ] Filter by action category (CRUD, Authentication, Approval)

### 4.10 Filter by Date Range
- [ ] Select "Today" preset
- [ ] Select "Last 7 Days" preset
- [ ] Select "Last 30 Days" preset
- [ ] Select custom date range
- [ ] Verify results limited to selected range

### 4.11 Filter by Outcome
- [ ] Filter by "Success" - verify all green checkmarks
- [ ] Filter by "Failed" - verify all red X marks
- [ ] Apply multiple filters combined
- [ ] Verify "No results" message when no match

### 4.12 Filter by IP Address
- [ ] Filter by exact IP address
- [ ] Verify only that IP appears
- [ ] Try IP range filter (CIDR notation)
- [ ] Block suspicious IP - verify in audit log

### 4.13 Search Functionality
- [ ] Search by keyword "DOC-001"
- [ ] Search by user name
- [ ] Search across all fields
- [ ] Verify search is case-insensitive
- [ ] Search with special characters

### 4.14 Event Details
- [ ] Click event to open detail modal
- [ ] Verify all metadata displayed
- [ ] Verify request payload shown (with sensitive data redacted)
- [ ] Verify response payload shown
- [ ] For updates: verify before/after state
- [ ] Verify session info (session ID, login time)
- [ ] Close modal and return to list

### 4.15 Sensitive Data Redaction
- [ ] View event with password in payload
- [ ] Verify password shows as "***REDACTED***"
- [ ] Verify API keys redacted
- [ ] Verify SSN redacted
- [ ] Verify non-sensitive data not redacted

### 4.16 Export to CSV
- [ ] Click Export button
- [ ] Select CSV format
- [ ] Select date range
- [ ] Click Download
- [ ] Verify CSV file downloads
- [ ] Verify columns in correct order
- [ ] Verify all filtered events included

### 4.17 Export to PDF
- [ ] Click Export button
- [ ] Select PDF format
- [ ] Add custom title/notes
- [ ] Click Download
- [ ] Verify PDF file downloads
- [ ] Verify formatted report with headers
- [ ] Verify digital signature included

### 4.18 Export to JSON
- [ ] Click Export button
- [ ] Select JSON format
- [ ] Click Download
- [ ] Verify JSON file downloads
- [ ] Verify valid JSON structure
- [ ] Verify can re-import JSON

### 4.19 Save Filter Preset
- [ ] Apply multiple filters
- [ ] Click "Save Filter Preset"
- [ ] Enter preset name
- [ ] Click Save
- [ ] Verify preset listed in dropdown
- [ ] Select preset to apply filters
- [ ] Delete preset - verify removed

### 4.20 Audit Log Immutability
- [ ] View completed audit entry
- [ ] Verify no edit/delete buttons present
- [ ] Right-click on entry - no edit option
- [ ] Attempt to manually edit database (should fail)

### 4.21 Security - Permission Enforcement
- [ ] Login as Analyst (not authorized)
- [ ] Try to navigate to /audit
- [ ] Verify "Access Denied" error
- [ ] Login as Compliance Officer
- [ ] Verify Audit Tab is visible
- [ ] Try to export entire database
- [ ] Verify limited by date range enforcement

### 4.22 Analytics Dashboard
- [ ] Click Analytics tab
- [ ] Verify displays:
     - [ ] Total Events count
     - [ ] Unique Users count
     - [ ] Failed Attempts count
     - [ ] Critical Events count
- [ ] Verify activity heatmap shows busiest times
- [ ] Verify trend chart shows volume over time

### 4.23 Performance
- [ ] Load audit page with 100K events
- [ ] Verify loads within 3 seconds
- [ ] Apply filter - verify responds in < 500ms
- [ ] Scroll through 100 events
- [ ] Verify smooth scrolling (no lag)
- [ ] Export 10K events - verify completes in reasonable time

### 4.24 Responsive Design
- [ ] View on desktop (1920px)
- [ ] View on tablet (768px) - verify layout adapts
- [ ] View on mobile (375px) - verify columns collapse
- [ ] Verify filters accessible on mobile
- [ ] Verify export buttons accessible

---

## 5. TEST DATA SETUP

### Seed Audit Logs

```sql
-- Insert sample audit logs with various event types
INSERT INTO audit_logs (
  event_id, actor_id, actor_name, actor_role, action, 
  entity_type, entity_id, timestamp, ip_address, outcome, status_code
) VALUES
('evt-001', 'user-1', 'John Smith', 'Compliance Analyst', 'APPROVE_DECISION', 'Decision', 'DOC-001', NOW() - INTERVAL '1 hour', '192.168.1.100', 'SUCCESS', 200),
('evt-002', 'user-2', 'Jane Doe', 'Manager', 'LOGIN', 'User', 'user-2', NOW() - INTERVAL '2 hours', '192.168.1.101', 'SUCCESS', 200),
('evt-003', 'user-1', 'John Smith', 'Compliance Analyst', 'FAILED_LOGIN', 'User', 'user-1', NOW() - INTERVAL '3 hours', '192.168.1.102', 'FAILED', 401),
('evt-004', 'user-3', 'Admin User', 'Administrator', 'CREATE_USER', 'User', 'user-new', NOW() - INTERVAL '4 hours', '192.168.1.100', 'SUCCESS', 201),
('evt-005', 'user-2', 'Jane Doe', 'Manager', 'EXPORT_AUDIT_LOG', 'Audit', 'export-001', NOW() - INTERVAL '5 hours', '192.168.1.101', 'SUCCESS', 200);
```

---

## 6. RUNNING THE TESTS

```bash
# Run all unit tests
npm run test:unit -- tests/unit/audit

# Run integration tests
npm run test:integration -- tests/integration/audit

# Run e2e tests
npm run test:e2e -- tests/e2e/audit-tab.e2e.ts

# Run all audit tests
npm run test:audit

# Run with coverage
npm run test:coverage -- tests/unit/audit

# Run specific test file
npm run test -- tests/unit/audit/audit-logger.test.ts

# Run in watch mode for development
npm run test:watch -- tests/unit/audit
```

---

## 7. CI/CD Integration

```yaml
# .github/workflows/audit-tests.yml
name: Audit Tab Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 16

      - name: Install dependencies
        run: npm install

      - name: Run unit tests
        run: npm run test:unit -- tests/unit/audit

      - name: Run integration tests
        run: npm run test:integration -- tests/integration/audit

      - name: Run e2e tests
        run: npm run test:e2e -- tests/e2e/audit-tab.e2e.ts

      - name: Upload coverage
        run: npm run test:coverage && codecov
```

---

## 8. Success Criteria

- ✅ All unit tests passing (>85% coverage)
- ✅ All integration tests passing
- ✅ All e2e tests passing
- ✅ Manual testing checklist 100% complete
- ✅ No critical/high severity bugs
- ✅ Page loads < 3 seconds with 100K entries
- ✅ Filtering responds < 500ms
- ✅ Audit logs immutable (cannot edit/delete)
- ✅ Sensitive data properly redacted
- ✅ Permission enforcement working
- ✅ Export generates valid files
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ Product Owner approval
