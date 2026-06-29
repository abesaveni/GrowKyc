import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CheckResultCard } from '../integrations/CheckResultCard';
import { RiskIntelligencePanel } from '../integrations/RiskIntelligencePanel';
import { DataSourceEvidence } from '../integrations/DataSourceEvidence';
import {
  Zap,
  Eye,
  Shield,
  Database,
  GitBranch,
  Server,
  Workflow,
  ChevronRight,
  CheckCircle
} from 'lucide-react';

function getRuntimeEnv(): Record<string, string | boolean | undefined> {
  const viteEnv = (typeof import.meta !== 'undefined' ? (import.meta as any).env : {}) || {};
  const processEnv = ((globalThis as any)?.process?.env || {}) as Record<string, string>;
  return { ...processEnv, ...viteEnv };
}

function isFlagEnabled(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
}

export function IntegrationsDemo() {
  const env = getRuntimeEnv();
  const isProduction =
    Boolean((import.meta as any)?.env?.PROD) ||
    env.NODE_ENV === 'production' ||
    env.VITE_APP_ENV === 'production';
  const allowDemoInProduction = isFlagEnabled(env.VITE_ENABLE_INTEGRATIONS_DEMO);
  const blockDemo = isProduction && !allowDemoInProduction;

  const [activeTab, setActiveTab] = useState<'results' | 'risk' | 'evidence'>('results');

  if (blockDemo) {
    return (
      <div className="min-h-screen bg-white/5 p-8">
        <Card className="max-w-3xl mx-auto border-2 border-red-300">
          <CardHeader>
            <CardTitle className="text-red-300">Integrations Demo Blocked in Production</CardTitle>
            <CardDescription>
              This demo view is disabled for production runtime unless explicitly enabled.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Mock unified risk profile following the API spec
  const mockRiskProfile = {
    riskScores: {
      identity: 12,
      aml: 35,
      business: 22,
      financial: 18,
      legal: 20,
      ownership: 25,
      overall: 22
    },
    riskBand: 'low' as const,
    hardStopFlags: ['none'],
    reviewFlags: [
      {
        type: 'Minor Court Case',
        severity: 'low' as const,
        source: 'Illion',
        message: 'Civil case resolved in client favor - no material impact'
      }
    ],
    recommendedDecision: 'approve' as const
  };

  return (
    <div className="min-h-screen bg-white/5">
      {/* API Architecture Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white p-8 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
              <GitBranch className="w-9 h-9" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">API Architecture Layer</h1>
              <p className="text-xl text-white/90">
                Orchestration Engine → Provider Adapters → Unified Canonical Schema
              </p>
            </div>
          </div>

          {/* Architecture Flow */}
          <div className="grid md:grid-cols-6 gap-4">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-5 h-5 text-white" />
                  <h3 className="font-bold text-white text-sm">Front End</h3>
                </div>
                <p className="text-xs text-white/80">UI calls internal APIs only</p>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center">
              <ChevronRight className="w-6 h-6 text-white/60" />
            </div>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="w-5 h-5 text-white" />
                  <h3 className="font-bold text-white text-sm">API Gateway</h3>
                </div>
                <p className="text-xs text-white/80">Centralised auth & routing</p>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center">
              <ChevronRight className="w-6 h-6 text-white/60" />
            </div>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Workflow className="w-5 h-5 text-white" />
                  <h3 className="font-bold text-white text-sm">Orchestration</h3>
                </div>
                <p className="text-xs text-white/80">Decision engine & workflow</p>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center">
              <ChevronRight className="w-6 h-6 text-white/60" />
            </div>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-5 h-5 text-white" />
                  <h3 className="font-bold text-white text-sm">Adapters</h3>
                </div>
                <p className="text-xs text-white/80">6 provider connectors</p>
              </CardContent>
            </Card>
          </div>

          {/* API Endpoints */}
          <div className="mt-6 p-4 bg-black/20 backdrop-blur-sm rounded-xl border border-white/20">
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Internal API Endpoints
            </h3>
            <div className="grid md:grid-cols-4 gap-3 text-sm font-mono">
              <div className="text-green-300">/api/workflows/onboarding/run-core-checks</div>
              <div className="text-green-300">/api/workflows/onboarding/run-enhanced-checks</div>
              <div className="text-green-300">/api/workflows/decision/generate</div>
              <div className="text-green-300">/api/workflows/monitoring/run</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content Area */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Navigation Tabs */}
            <div className="flex gap-2 mb-6">
              <Button
                onClick={() => setActiveTab('results')}
                className={
                  activeTab === 'results'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-slate-300 hover:bg-white/5'
                }
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Check Results
              </Button>
              <Button
                onClick={() => setActiveTab('risk')}
                className={
                  activeTab === 'risk'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-slate-300 hover:bg-white/5'
                }
              >
                <Shield className="w-4 h-4 mr-2" />
                Risk Intelligence
              </Button>
              <Button
                onClick={() => setActiveTab('evidence')}
                className={
                  activeTab === 'evidence'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-slate-300 hover:bg-white/5'
                }
              >
                <Database className="w-4 h-4 mr-2" />
                Data Sources & Evidence
              </Button>
            </div>

            {/* Check Results Tab */}
            {activeTab === 'results' && (
              <div className="space-y-6">
                <Card className="border-2 border-purple-300 bg-purple-500/10">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Zap className="w-6 h-6 text-purple-400 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-purple-300 mb-2">
                          Composite Orchestration: POST /api/workflows/onboarding/run-core-checks
                        </h3>
                        <p className="text-sm text-purple-300 mb-3">
                          This endpoint orchestrates Identity + Entity + AML + Business Risk checks from multiple
                          providers and returns one consolidated object with normalised results.
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          <Badge className="bg-purple-600 text-white">Equifax → Identity</Badge>
                          <Badge className="bg-purple-600 text-white">ASIC → Entity</Badge>
                          <Badge className="bg-purple-600 text-white">ComplyAdvantage → AML</Badge>
                          <Badge className="bg-purple-600 text-white">Illion → Business Risk</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <h2 className="text-2xl font-bold text-slate-100">Provider-Backed Results (Normalised Schema)</h2>

                {/* Identity Check Result */}
                <CheckResultCard
                  checkType="identity"
                  status="verified"
                  provider="equifax"
                  checkedAt="2026-03-21T10:00:03Z"
                  riskLevel="low"
                  confidence={0.91}
                  summary="Identity verified via Equifax 100-point check. All signals confirmed with high confidence."
                  details={[
                    { label: 'Identity Verified', value: true },
                    { label: 'Address Match', value: true },
                    { label: 'Identity Confidence', value: '91%' },
                    { label: 'Fraud Flags', value: 'thin_file' },
                    { label: 'Review Required', value: false }
                  ]}
                  flags={['Thin file detected - acceptable for new business']}
                  onRecheck={() => alert('POST /api/checks/identity - Re-running check...')}
                />

                {/* AML Check Result */}
                <CheckResultCard
                  checkType="aml"
                  status="clear"
                  provider="complyadvantage"
                  checkedAt="2026-03-21T10:00:20Z"
                  riskLevel="low"
                  confidence={1.0}
                  summary="Clear across sanctions (DFAT, UN, OFAC, EU), PEP screening, and adverse media. No matches found."
                  details={[
                    { label: 'Sanctions Status', value: 'Clear' },
                    { label: 'PEP Status', value: 'No Match' },
                    { label: 'Adverse Media', value: 'Clear' },
                    { label: 'Match Count', value: 0 },
                    { label: 'Hard Stop', value: false },
                    { label: 'Review Required', value: false }
                  ]}
                  onRecheck={() => alert('POST /api/checks/aml - Re-running AML screening...')}
                />

                {/* Entity Check Result */}
                <CheckResultCard
                  checkType="entity"
                  status="active"
                  provider="asic"
                  checkedAt="2026-03-21T10:01:00Z"
                  riskLevel="low"
                  summary="Entity verified via ASIC direct registry. Company is active and compliant with all registrations current."
                  details={[
                    { label: 'Registry Status', value: 'Active' },
                    { label: 'Registration Date', value: '2020-04-15' },
                    { label: 'Entity Type', value: 'Proprietary Company' },
                    { label: 'Officer Count', value: 2 },
                    { label: 'Mismatch Flags', value: 'None' }
                  ]}
                  onRecheck={() => alert('POST /api/checks/entity - Re-running ASIC lookup...')}
                />

                {/* Business Risk Check */}
                <CheckResultCard
                  checkType="business_risk"
                  status="review"
                  provider="illion"
                  checkedAt="2026-03-21T10:02:00Z"
                  riskLevel="medium"
                  confidence={0.85}
                  summary="Business credit score: 640 (Medium risk). Minor court case identified but resolved. Insolvency check clear."
                  details={[
                    { label: 'Business Credit Score', value: 640 },
                    { label: 'Credit Risk Band', value: 'Medium' },
                    { label: 'Payment Defaults', value: 1 },
                    { label: 'Insolvency Flag', value: false },
                    { label: 'Court Cases', value: 1 },
                    { label: 'Review Required', value: true }
                  ]}
                  flags={['Minor civil case - reviewed and accepted by analyst']}
                  onRecheck={() => alert('POST /api/checks/business-risk - Re-running Illion checks...')}
                />

                {/* Optional: Advanced Legal (Trigger-based) */}
                <CheckResultCard
                  checkType="advanced_legal"
                  status="not_run"
                  provider="lexisnexis"
                  checkedAt="2026-03-21T10:00:00Z"
                  summary="Advanced legal check not triggered. Only runs when Illion shows legal risk, adverse media severity is high, or deal value exceeds threshold."
                  details={[
                    { label: 'Trigger Conditions Met', value: false },
                    { label: 'Manual Override Available', value: true }
                  ]}
                  onRecheck={() => alert('POST /api/checks/advanced-legal - Manual trigger...')}
                />

                {/* Optional: Crypto Risk (Trigger-based) */}
                <CheckResultCard
                  checkType="crypto_risk"
                  status="not_run"
                  provider="chainalysis"
                  checkedAt="2026-03-21T10:00:00Z"
                  summary="Crypto risk assessment not triggered. Only runs when cryptocurrency detected in Source of Funds or wallet address provided."
                  details={[
                    { label: 'Crypto Detected', value: false },
                    { label: 'Wallet Address Provided', value: false }
                  ]}
                />
              </div>
            )}

            {/* Risk Intelligence Tab */}
            {activeTab === 'risk' && (
              <div className="space-y-6">
                <Card className="border-2 border-purple-300 bg-purple-500/10">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-purple-400 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-purple-300 mb-2">
                          Unified Risk Profile: POST /api/workflows/decision/generate
                        </h3>
                        <p className="text-sm text-purple-300 mb-3">
                          All normalised results feed into one central UnifiedRiskProfile object. Risk aggregation
                          combines Identity + AML + Business + Financial + Legal + Ownership scores with hard-stop and
                          escalation rules.
                        </p>
                        <div className="text-xs font-mono text-purple-300 bg-purple-500/15 p-3 rounded border border-purple-500/30">
                          {JSON.stringify(mockRiskProfile, null, 2)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-300">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <CardTitle>Risk Intelligence Panel (Embedded Component)</CardTitle>
                    <CardDescription>
                      This panel appears on the right side of client files, showing unified risk from all 6 providers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="flex-1 p-6 bg-white/5">
                        <p className="text-slate-300 text-center py-12">
                          ← Risk Intelligence Panel displays here on the right side
                        </p>
                      </div>
                      <RiskIntelligencePanel
                        matterId="mat_001"
                        riskProfile={mockRiskProfile}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Evidence Tab */}
            {activeTab === 'evidence' && (
              <div className="space-y-6">
                <Card className="border-2 border-purple-300 bg-purple-500/10">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Database className="w-6 h-6 text-purple-400 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-purple-300 mb-2">Audit Model: Every Check Writes Evidence</h3>
                        <p className="text-sm text-purple-300 mb-3">
                          Every provider interaction writes ProviderResponseEnvelope + AuditEvent. The UI shows provider
                          used, time checked, result status, analyst decision, and override reason for full compliance
                          traceability.
                        </p>
                        <div className="grid md:grid-cols-2 gap-3 mt-3">
                          <div className="bg-purple-500/15 p-3 rounded border border-purple-500/30">
                            <p className="font-semibold text-purple-300 text-xs mb-1">ProviderResponseEnvelope</p>
                            <pre className="text-xs text-purple-300 font-mono">
{`{
  "response_id": "resp_001",
  "provider": "equifax",
  "normalised": true,
  "http_status": 200
}`}
                            </pre>
                          </div>
                          <div className="bg-purple-500/15 p-3 rounded border border-purple-500/30">
                            <p className="font-semibold text-purple-300 text-xs mb-1">AuditEvent</p>
                            <pre className="text-xs text-purple-300 font-mono">
{`{
  "audit_id": "aud_001",
  "action": "provider_response",
  "actor": "system",
  "reason": "AML screen complete"
}`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <DataSourceEvidence
                  matterId="mat_001"
                  subjectId="per_123"
                  subjectName="TechCorp Pty Ltd"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
