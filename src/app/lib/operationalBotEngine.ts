export type BotCategory = 'identity' | 'aml' | 'kyb' | 'ownership' | 'risk' | 'monitoring';
export type BotOutcome = 'passed' | 'alert' | 'failed';
export type RunStatus = 'completed' | 'failed';
export type Decision = 'auto-approve' | 'manual-review' | 'reject';
export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface BotFinding {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface BotEvidence {
  id: string;
  title: string;
  source: string;
  confidence: number;
  capturedAt: string;
}

export interface BotResult {
  botId: string;
  botName: string;
  category: BotCategory;
  outcome: BotOutcome;
  confidence: number;
  score: number;
  summary: string;
  findings: BotFinding[];
  evidence: BotEvidence[];
}

export interface EvidencePack {
  id: string;
  runId: string;
  clientId: string;
  clientName: string;
  generatedAt: string;
  summary: {
    totalItems: number;
    averageConfidence: number;
    failedChecks: number;
    alertedChecks: number;
  };
  items: Array<BotEvidence & { botId: string; botName: string }>;
}

export interface BotRunRecord {
  id: string;
  clientId: string;
  clientName: string;
  startedAt: string;
  completedAt: string;
  status: RunStatus;
  decision: Decision;
  riskScore: number;
  confidence: number;
  findingsCount: number;
  alertedChecks: number;
  failedChecks: number;
  evidencePackId: string;
  botResults: BotResult[];
}

export interface AuditEvent {
  id: string;
  occurredAt: string;
  eventType:
    | 'BOT_RUN_STARTED'
    | 'BOT_RUN_COMPLETED'
    | 'EVIDENCE_PACK_GENERATED'
    | 'MANUAL_DECISION_RECORDED';
  severity: AuditSeverity;
  actor: string;
  targetId: string;
  description: string;
  metadata?: Record<string, unknown>;
}

interface EngineStore {
  runs: BotRunRecord[];
  evidencePacks: EvidencePack[];
  auditEvents: AuditEvent[];
}

interface RunInput {
  clientId: string;
  clientName: string;
  actor?: string;
}

const STORAGE_KEY = 'growkyc.operationalBotEngine.v1';

const BOT_CATALOG: Array<{ id: string; name: string; category: BotCategory }> = [
  { id: 'identity-verification', name: 'Identity Verification', category: 'identity' },
  { id: 'aml-screening', name: 'AML Screening', category: 'aml' },
  { id: 'kyb-validation', name: 'KYB Validation', category: 'kyb' },
  { id: 'ubo-mapping', name: 'Ownership Mapping', category: 'ownership' },
  { id: 'risk-scoring', name: 'Risk Scoring', category: 'risk' },
  { id: 'ongoing-monitoring', name: 'Ongoing Monitoring', category: 'monitoring' },
];

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function hashToInt(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function scoreToOutcome(score: number): BotOutcome {
  if (score < 40) return 'failed';
  if (score < 70) return 'alert';
  return 'passed';
}

function scoreToSeverity(score: number): BotFinding['severity'] {
  if (score < 20) return 'critical';
  if (score < 40) return 'high';
  if (score < 70) return 'medium';
  return 'low';
}

function getNow(): string {
  return new Date().toISOString();
}

function getBrowserStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

function readStore(): EngineStore {
  const storage = getBrowserStorage();
  if (!storage) {
    return { runs: [], evidencePacks: [], auditEvents: [] };
  }

  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) {
    return { runs: [], evidencePacks: [], auditEvents: [] };
  }

  try {
    const parsed = JSON.parse(raw) as EngineStore;
    return {
      runs: parsed.runs || [],
      evidencePacks: parsed.evidencePacks || [],
      auditEvents: parsed.auditEvents || [],
    };
  } catch {
    return { runs: [], evidencePacks: [], auditEvents: [] };
  }
}

function writeStore(store: EngineStore): void {
  const storage = getBrowserStorage();
  if (!storage) return;
  storage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function buildBotResult(clientId: string, clientName: string, botId: string, botName: string, category: BotCategory): BotResult {
  const baseSeed = `${clientId}:${botId}:${clientName}`;
  const score = hashToInt(`${baseSeed}:score`) % 101;
  const confidence = 55 + (hashToInt(`${baseSeed}:confidence`) % 46);
  const outcome = scoreToOutcome(score);
  const findingSeverity = scoreToSeverity(score);

  const finding: BotFinding = {
    id: createId('finding'),
    title: `${botName} ${outcome === 'passed' ? 'validation complete' : 'requires attention'}`,
    description:
      outcome === 'passed'
        ? `${category.toUpperCase()} checks returned clean indicators.`
        : `${category.toUpperCase()} checks identified elevated risk signals requiring review.`,
    severity: findingSeverity,
  };

  const evidence: BotEvidence = {
    id: createId('evidence'),
    title: `${botName} response payload`,
    source: `provider:${category}`,
    confidence,
    capturedAt: getNow(),
  };

  return {
    botId,
    botName,
    category,
    outcome,
    confidence,
    score,
    summary:
      outcome === 'passed'
        ? `${botName} completed with no material anomalies.`
        : `${botName} produced ${outcome.toUpperCase()} outcome and needs analyst review.`,
    findings: [finding],
    evidence: [evidence],
  };
}

function buildEvidencePack(runId: string, clientId: string, clientName: string, botResults: BotResult[]): EvidencePack {
  const items = botResults.flatMap((result) =>
    result.evidence.map((item) => ({
      ...item,
      botId: result.botId,
      botName: result.botName,
    }))
  );

  const averageConfidence =
    items.length > 0 ? items.reduce((sum, item) => sum + item.confidence, 0) / items.length : 0;

  return {
    id: createId('evidence-pack'),
    runId,
    clientId,
    clientName,
    generatedAt: getNow(),
    summary: {
      totalItems: items.length,
      averageConfidence: Number(averageConfidence.toFixed(2)),
      failedChecks: botResults.filter((r) => r.outcome === 'failed').length,
      alertedChecks: botResults.filter((r) => r.outcome === 'alert').length,
    },
    items,
  };
}

function decideOutcome(results: BotResult[]): { decision: Decision; riskScore: number; confidence: number } {
  const failed = results.filter((r) => r.outcome === 'failed').length;
  const alerted = results.filter((r) => r.outcome === 'alert').length;
  const averageScore = results.reduce((sum, r) => sum + r.score, 0) / Math.max(results.length, 1);
  const confidence = results.reduce((sum, r) => sum + r.confidence, 0) / Math.max(results.length, 1);

  const riskScore = Math.max(0, Math.min(100, Math.round(100 - averageScore + failed * 10 + alerted * 5)));

  if (failed >= 2 || riskScore >= 75) {
    return { decision: 'reject', riskScore, confidence: Number(confidence.toFixed(2)) };
  }
  if (failed >= 1 || alerted >= 2 || riskScore >= 45) {
    return { decision: 'manual-review', riskScore, confidence: Number(confidence.toFixed(2)) };
  }
  return { decision: 'auto-approve', riskScore, confidence: Number(confidence.toFixed(2)) };
}

function addAuditEvent(store: EngineStore, event: AuditEvent): void {
  store.auditEvents.unshift(event);
}

function buildAudit(
  eventType: AuditEvent['eventType'],
  severity: AuditSeverity,
  actor: string,
  targetId: string,
  description: string,
  metadata?: Record<string, unknown>
): AuditEvent {
  return {
    id: createId('audit'),
    occurredAt: getNow(),
    eventType,
    severity,
    actor,
    targetId,
    description,
    metadata,
  };
}

export function runOperationalBots(input: RunInput): BotRunRecord {
  const actor = input.actor || 'system';
  const store = readStore();
  const runId = createId('run');

  addAuditEvent(
    store,
    buildAudit('BOT_RUN_STARTED', 'info', actor, runId, `Bot run started for ${input.clientName}`, {
      clientId: input.clientId,
      clientName: input.clientName,
    })
  );

  const results = BOT_CATALOG.map((bot) =>
    buildBotResult(input.clientId, input.clientName, bot.id, bot.name, bot.category)
  );

  const decision = decideOutcome(results);
  const evidencePack = buildEvidencePack(runId, input.clientId, input.clientName, results);

  const runRecord: BotRunRecord = {
    id: runId,
    clientId: input.clientId,
    clientName: input.clientName,
    startedAt: getNow(),
    completedAt: getNow(),
    status: 'completed',
    decision: decision.decision,
    riskScore: decision.riskScore,
    confidence: decision.confidence,
    findingsCount: results.reduce((sum, result) => sum + result.findings.length, 0),
    alertedChecks: results.filter((r) => r.outcome === 'alert').length,
    failedChecks: results.filter((r) => r.outcome === 'failed').length,
    evidencePackId: evidencePack.id,
    botResults: results,
  };

  store.runs.unshift(runRecord);
  store.evidencePacks.unshift(evidencePack);

  addAuditEvent(
    store,
    buildAudit('BOT_RUN_COMPLETED', 'info', actor, runId, `Bot run completed with ${runRecord.decision} decision`, {
      riskScore: runRecord.riskScore,
      confidence: runRecord.confidence,
      decision: runRecord.decision,
      findingsCount: runRecord.findingsCount,
    })
  );

  addAuditEvent(
    store,
    buildAudit(
      'EVIDENCE_PACK_GENERATED',
      'info',
      actor,
      evidencePack.id,
      `Evidence pack generated for run ${runId}`,
      {
        runId,
        totalItems: evidencePack.summary.totalItems,
        averageConfidence: evidencePack.summary.averageConfidence,
      }
    )
  );

  writeStore(store);
  return runRecord;
}

export function listBotRuns(): BotRunRecord[] {
  return readStore().runs;
}

export function listAuditEvents(): AuditEvent[] {
  return readStore().auditEvents;
}

export function getEvidencePackById(packId: string): EvidencePack | undefined {
  return readStore().evidencePacks.find((pack) => pack.id === packId);
}

export function recordManualDecision(args: {
  runId: string;
  actor: string;
  decision: Decision;
  reason?: string;
}): BotRunRecord | undefined {
  const store = readStore();
  const run = store.runs.find((item) => item.id === args.runId);
  if (!run) return undefined;

  run.decision = args.decision;
  addAuditEvent(
    store,
    buildAudit(
      'MANUAL_DECISION_RECORDED',
      args.decision === 'reject' ? 'warning' : 'info',
      args.actor,
      run.id,
      `Manual decision set to ${args.decision}`,
      { reason: args.reason || null }
    )
  );

  writeStore(store);
  return run;
}

export function ensureOperationalSeedData(): void {
  const store = readStore();
  if (store.runs.length > 0) return;

  runOperationalBots({ clientId: 'client-1001', clientName: 'Acme Investment Pty Ltd', actor: 'system-seed' });
  runOperationalBots({ clientId: 'client-1002', clientName: 'Global Investment Fund', actor: 'system-seed' });
  runOperationalBots({ clientId: 'client-1003', clientName: 'Smith Family Trust', actor: 'system-seed' });
}
