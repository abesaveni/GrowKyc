import {
  BotRunRecord,
  EvidencePack,
  EvidencePackItem,
  PersistedBotResult,
} from './BotTypes';
import { botPersistenceRepository } from './BotPersistence';

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

interface RunResultInput {
  run: BotRunRecord;
  result: PersistedBotResult;
}

export class EvidencePackBuilder {
  async buildAndPersist(args: {
    organizationId?: string;
    clientId: string;
    clientName: string;
    caseId?: string;
    runResults: RunResultInput[];
  }): Promise<EvidencePack> {
    const items: EvidencePackItem[] = args.runResults.flatMap(({ run, result }) => {
      return result.rawResult.evidence.map((evidence) => ({
        id: createId('evidence-pack-item'),
        runId: run.id,
        botId: run.botId,
        title: evidence.title,
        source: evidence.source,
        evidenceType: evidence.evidenceType,
        confidence: evidence.confidence,
        capturedAt: evidence.capturedAt,
        metadata: evidence.metadata,
      }));
    });

    const statuses = args.runResults.map(({ result }) => result.status);
    const averageScore =
      args.runResults.length > 0
        ? args.runResults.reduce((sum, item) => sum + item.result.score, 0) / args.runResults.length
        : 0;

    const pack: EvidencePack = {
      id: createId('evidence-pack'),
      organizationId: args.organizationId,
      clientId: args.clientId,
      clientName: args.clientName,
      caseId: args.caseId,
      runIds: args.runResults.map(({ run }) => run.id),
      generatedAt: new Date().toISOString(),
      summary: {
        passed: statuses.filter((s) => s === 'passed').length,
        alert: statuses.filter((s) => s === 'alert').length,
        failed: statuses.filter((s) => s === 'failed').length,
        averageScore: Number(averageScore.toFixed(2)),
      },
      items,
    };

    return botPersistenceRepository.persistEvidencePack(pack);
  }
}

export const evidencePackBuilder = new EvidencePackBuilder();
