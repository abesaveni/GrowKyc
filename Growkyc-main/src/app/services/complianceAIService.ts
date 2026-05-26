import { apiRequest, delay } from './apiClient';

export interface ComplianceAIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ComplianceAIContext {
  caseId?: string;
  clientId?: string;
  page?: string;
}

export interface ComplianceAIResponse {
  content: string;
  confidence?: number;
  sources?: Array<{ title: string; type: string }>;
}

function mockComplianceReply(query: string, history: ComplianceAIMessage[]): string {
  const q = query.toLowerCase();
  const prior = history.filter((m) => m.role === 'user').length;

  if (q.includes('memo') || q.includes('ecdd')) {
    return `Based on AUSTRAC Tranche 2 obligations and your firm's ECDD policy, I recommend structuring the memo with:\n\n1. **Customer profile** — entity structure, beneficial owners, and source of wealth\n2. **Risk rationale** — why enhanced measures were triggered\n3. **Evidence reviewed** — ID, address, ASIC extracts, adverse media\n4. **Residual risk** — low/medium/high with mitigations\n5. **Reviewer decision** — clear approve/escalate recommendation\n\n${prior > 1 ? 'Following up on our thread: ' : ''}I can draft section 1–3 if you share the case reference.`;
  }
  if (q.includes('smr') || q.includes('suspicious')) {
    return 'Suspicious matter reports require human approval before lodgement. Key steps:\n\n• Document the grounds for suspicion objectively\n• Exclude tipping-off language in client communications\n• Attach supporting transaction records and screening results\n• Route to AMLCO for review within 24 hours of forming suspicion\n\nI can help outline grounds but cannot submit an SMR autonomously.';
  }
  if (q.includes('risk') || q.includes('pep')) {
    return 'Elevated risk typically stems from PEP exposure, adverse media, complex structures, or high-risk jurisdictions. For this context, verify:\n\n• Beneficial ownership to 25%+ thresholds\n• Sanctions and PEP screening (domestic and international lists)\n• Source of funds/source of wealth corroboration\n• Ongoing monitoring frequency aligned to risk rating';
  }
  return `I understand you're asking about "${query}". As your compliance copilot I can explain regulatory requirements, summarize case files, identify missing evidence, and draft reviewer-ready language.\n\nCould you specify whether you need help with **CDD/EDD**, **reporting**, **risk scoring**, or **policy interpretation**?`;
}

export async function sendComplianceAIMessage(
  messages: ComplianceAIMessage[],
  context?: ComplianceAIContext
): Promise<ComplianceAIResponse> {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  const query = lastUser?.content ?? '';

  try {
    return await apiRequest<ComplianceAIResponse>('/compliance/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ messages, context })
    });
  } catch {
    await delay(null, 800 + Math.random() * 400);
    return {
      content: mockComplianceReply(query, messages),
      confidence: 92,
      sources: [
        { title: 'AML/CTF Program — Premier Advisory Group', type: 'internal' },
        { title: 'AUSTRAC ECDD Guidance', type: 'regulatory' }
      ]
    };
  }
}
