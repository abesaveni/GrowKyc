import {
  BotDescriptor,
  BotResult,
  ComplianceBot,
  BotRunContext,
  BotOutcomeStatus,
} from './BotTypes';
import { AIComplianceBot } from './AIComplianceBot';

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function buildDeterministicStatus(seed: string): BotOutcomeStatus {
  const value = hashString(seed) % 100;
  if (value >= 93) return 'failed';
  if (value >= 80) return 'alert';
  return 'passed';
}

class DefaultComplianceBot implements ComplianceBot {
  id: string;
  name: string;
  description: string;
  category: BotDescriptor['category'];
  provider: string;
  cost: number;
  version: string;
  enabled: boolean;

  constructor(descriptor: BotDescriptor) {
    this.id = descriptor.id;
    this.name = descriptor.name;
    this.description = descriptor.description;
    this.category = descriptor.category;
    this.provider = descriptor.provider;
    this.cost = descriptor.cost;
    this.version = descriptor.version;
    this.enabled = descriptor.enabled;
  }

  async run(context: BotRunContext): Promise<BotResult> {
    const seed = `${context.clientId}:${this.id}:${context.clientName}`;
    const status = buildDeterministicStatus(seed);
    const score = 100 - (hashString(`${seed}:score`) % 35);

    return {
      status,
      score,
      summary: `${this.name} completed for ${context.clientName} with ${status.toUpperCase()} status.`,
      findings: [
        `${this.provider} response validated`,
        `${this.category.toUpperCase()} workflow executed`,
      ],
      evidence: [
        {
          id: createId('evidence'),
          title: `${this.name} provider payload`,
          source: this.provider,
          evidenceType: 'api-response',
          confidence: Math.max(0.5, score / 100),
          capturedAt: new Date().toISOString(),
          metadata: {
            botId: this.id,
            category: this.category,
            simulated: true,
          },
        },
      ],
      metadata: {
        provider: this.provider,
        category: this.category,
      },
    };
  }
}

const DEFAULT_BOTS: BotDescriptor[] = [
  {
    id: 'identity-verification',
    name: 'Identity Verification',
    description: 'Verify identity using government ID, biometrics, and fraud signals.',
    category: 'identity',
    provider: 'Equifax',
    cost: 2.5,
    version: '1.0.0',
    enabled: true,
  },
  {
    id: 'document-verification',
    name: 'Document Verification',
    description: 'Verify authenticity of uploaded identity documents.',
    category: 'identity',
    provider: 'Onfido',
    cost: 3,
    version: '1.0.0',
    enabled: true,
  },
  {
    id: 'biometric-check',
    name: 'Biometric Verification',
    description: 'Run facial recognition and liveness checks.',
    category: 'identity',
    provider: 'Equifax',
    cost: 1.5,
    version: '1.0.0',
    enabled: true,
  },
  {
    id: 'device-intelligence',
    name: 'Device Intelligence',
    description: 'Evaluate device fingerprint and risk indicators.',
    category: 'identity',
    provider: 'Equifax',
    cost: 1,
    version: '1.0.0',
    enabled: true,
  },
  {
    id: 'aml-screening',
    name: 'AML Screening',
    description: 'Screen against PEP, sanctions, and watchlists.',
    category: 'aml',
    provider: 'Equifax',
    cost: 5,
    version: '1.0.0',
    enabled: true,
  },
  {
    id: 'sanctions-check',
    name: 'Sanctions Check',
    description: 'Check against major sanctions lists.',
    category: 'aml',
    provider: 'Dow Jones',
    cost: 3.5,
    version: '1.0.0',
    enabled: true,
  },
  {
    id: 'pep-screening',
    name: 'PEP Screening',
    description: 'Screen politically exposed persons databases.',
    category: 'aml',
    provider: 'World-Check',
    cost: 4,
    version: '1.0.0',
    enabled: true,
  },
  {
    id: 'adverse-media',
    name: 'Adverse Media Screening',
    description: 'Scan adverse media and reputational signals.',
    category: 'aml',
    provider: 'Equifax',
    cost: 2,
    version: '1.0.0',
    enabled: true,
  },
  {
    id: 'credit-report',
    name: 'Credit Report',
    description: 'Retrieve credit history and reporting data.',
    category: 'credit',
    provider: 'Equifax',
    cost: 15,
    version: '1.0.0',
    enabled: true,
  },
  {
    id: 'credit-score',
    name: 'Credit Score',
    description: 'Retrieve primary credit score band.',
    category: 'credit',
    provider: 'Equifax',
    cost: 5,
    version: '1.0.0',
    enabled: true,
  },
  {
    id: 'payment-history',
    name: 'Payment History',
    description: 'Review repayment behaviour and defaults.',
    category: 'credit',
    provider: 'Equifax',
    cost: 3,
    version: '1.0.0',
    enabled: true,
  },
  {
    id: 'abn-lookup',
    name: 'ABN Lookup',
    description: 'Validate ABN and entity registration details.',
    category: 'entity',
    provider: 'ABR',
    cost: 0,
    version: '1.0.0',
    enabled: true,
  },
  {
    id: 'asic-search',
    name: 'ASIC Company Search',
    description: 'Retrieve ASIC company details and officeholders.',
    category: 'entity',
    provider: 'ASIC',
    cost: 9,
    version: '1.0.0',
    enabled: true,
  },
  {
    id: 'beneficial-ownership',
    name: 'Beneficial Ownership',
    description: 'Identify ultimate beneficial owners and controllers.',
    category: 'entity',
    provider: 'Equifax',
    cost: 12,
    version: '1.0.0',
    enabled: true,
  },
  {
    id: 'property-ownership',
    name: 'Property Ownership',
    description: 'Run title search and ownership verification.',
    category: 'property',
    provider: 'InfoTrack',
    cost: 25,
    version: '1.0.0',
    enabled: true,
  },
  {
    id: 'property-valuation',
    name: 'Property Valuation',
    description: 'Get AVM estimate and confidence range.',
    category: 'property',
    provider: 'CoreLogic',
    cost: 15,
    version: '1.0.0',
    enabled: true,
  },
  {
    id: 'bank-statement-analysis',
    name: 'Bank Statement Analysis',
    description: 'Analyse transactional affordability patterns.',
    category: 'affordability',
    provider: 'Equifax',
    cost: 8,
    version: '1.0.0',
    enabled: true,
  },
  {
    id: 'income-verification',
    name: 'Income Verification',
    description: 'Verify income and employment information.',
    category: 'affordability',
    provider: 'Equifax',
    cost: 5,
    version: '1.0.0',
    enabled: true,
  },
];

export class BotRegistry {
  private bots = new Map<string, ComplianceBot>();

  register(bot: ComplianceBot): void {
    this.bots.set(bot.id, bot);
  }

  registerDescriptor(descriptor: BotDescriptor): void {
    // Use AI-powered bot — falls back to simulation if backend is unreachable
    this.register(new AIComplianceBot(descriptor));
  }

  get(botId: string): ComplianceBot | undefined {
    return this.bots.get(botId);
  }

  list(): ComplianceBot[] {
    return Array.from(this.bots.values());
  }

  listEnabled(): ComplianceBot[] {
    return this.list().filter((bot) => bot.enabled);
  }
}

const sharedBotRegistry = new BotRegistry();
DEFAULT_BOTS.forEach((descriptor) => sharedBotRegistry.registerDescriptor(descriptor));

export { DEFAULT_BOTS, sharedBotRegistry };
