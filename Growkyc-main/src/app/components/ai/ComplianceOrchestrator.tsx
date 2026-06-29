import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Brain,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  Search,
  Shield,
  Clock,
  Target,
} from 'lucide-react';
import {
  BotRunRecord,
  Decision,
  ensureOperationalSeedData,
  getEvidencePackById,
  listAuditEvents,
  listBotRuns,
  runOperationalBots,
} from '../../lib/operationalBotEngine';

interface ComplianceOrchestratorProps {
  onBack: () => void;
}

function decisionBadge(decision: Decision): string {
  if (decision === 'auto-approve') return 'bg-green-600 text-white';
  if (decision === 'manual-review') return 'bg-amber-600 text-white';
  return 'bg-red-600 text-white';
}

function outcomeIcon(outcome: 'passed' | 'alert' | 'failed') {
  if (outcome === 'passed') return <CheckCircle className="w-4 h-4 text-green-400" />;
  if (outcome === 'alert') return <AlertTriangle className="w-4 h-4 text-amber-400" />;
  return <XCircle className="w-4 h-4 text-red-400" />;
}

export function ComplianceOrchestrator({ onBack }: ComplianceOrchestratorProps) {
  const [clientId, setClientId] = useState('client-1001');
  const [clientName, setClientName] = useState('Acme Investment Pty Ltd');
  const [runs, setRuns] = useState<BotRunRecord[]>([]);

  useEffect(() => {
    ensureOperationalSeedData();
    setRuns(listBotRuns());
  }, []);

  const latestRun = runs[0];
  const latestPack = latestRun ? getEvidencePackById(latestRun.evidencePackId) : undefined;
  const recentAuditEvents = listAuditEvents().slice(0, 5);

  const runCounts = useMemo(() => {
    return runs.reduce(
      (acc, run) => {
        acc.total += 1;
        if (run.decision === 'auto-approve') acc.approved += 1;
        if (run.decision === 'manual-review') acc.review += 1;
        if (run.decision === 'reject') acc.rejected += 1;
        return acc;
      },
      { total: 0, approved: 0, review: 0, rejected: 0 }
    );
  }, [runs]);

  const handleRun = () => {
    if (!clientId.trim() || !clientName.trim()) return;
    const newRun = runOperationalBots({
      clientId: clientId.trim(),
      clientName: clientName.trim(),
      actor: 'compliance-orchestrator',
    });
    setRuns((prev) => [newRun, ...prev]);
  };

  return (
    <div className="min-h-screen bg-white/5">
      <div className="bg-gradient-to-r from-indigo-600 to-sky-600 text-white px-8 py-10">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-5 text-white hover:bg-white/20 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
            <Brain className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Operational Compliance Orchestrator</h1>
            <p className="text-white/90">Persistent bot runs, evidence packs, decisions, and audit events</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-4">
              <div className="text-sm text-white/80">Total Runs</div>
              <div className="text-3xl font-bold">{runCounts.total}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-4">
              <div className="text-sm text-white/80">Auto Approved</div>
              <div className="text-3xl font-bold">{runCounts.approved}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-4">
              <div className="text-sm text-white/80">Manual Review</div>
              <div className="text-3xl font-bold">{runCounts.review}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-4">
              <div className="text-sm text-white/80">Rejected</div>
              <div className="text-3xl font-bold">{runCounts.rejected}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Run Screening</CardTitle>
            <CardDescription>Execute the shared operational bot engine for a client</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 items-end">
              <div>
                <label className="text-sm font-medium text-slate-300">Client ID</label>
                <input
                  className="w-full border rounded-md px-3 py-2 mt-1"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Client Name</label>
                <input
                  className="w-full border rounded-md px-3 py-2 mt-1"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <Button onClick={handleRun} className="h-10">
                <Search className="w-4 h-4 mr-2" />
                Execute Bot Run
              </Button>
            </div>
          </CardContent>
        </Card>

        {latestRun && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Latest Run: {latestRun.clientName}</CardTitle>
                  <CardDescription>
                    Started {new Date(latestRun.startedAt).toLocaleString()} • Completed {new Date(latestRun.completedAt).toLocaleString()}
                  </CardDescription>
                </div>
                <Badge className={decisionBadge(latestRun.decision)}>{latestRun.decision}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-5">
                <div className="p-3 rounded-lg border">
                  <div className="text-xs text-slate-400">Risk Score</div>
                  <div className="text-2xl font-bold">{latestRun.riskScore}</div>
                </div>
                <div className="p-3 rounded-lg border">
                  <div className="text-xs text-slate-400">Confidence</div>
                  <div className="text-2xl font-bold">{latestRun.confidence}%</div>
                </div>
                <div className="p-3 rounded-lg border">
                  <div className="text-xs text-slate-400">Findings</div>
                  <div className="text-2xl font-bold">{latestRun.findingsCount}</div>
                </div>
                <div className="p-3 rounded-lg border">
                  <div className="text-xs text-slate-400">Alerts / Fails</div>
                  <div className="text-2xl font-bold">{latestRun.alertedChecks} / {latestRun.failedChecks}</div>
                </div>
              </div>

              <div className="space-y-3">
                {latestRun.botResults.map((result) => (
                  <div key={result.botId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 font-semibold">
                        {outcomeIcon(result.outcome)}
                        {result.botName}
                      </div>
                      <div className="text-sm text-slate-300">
                        Score {result.score} • Confidence {result.confidence}%
                      </div>
                    </div>
                    <div className="text-sm text-slate-300 mb-2">{result.summary}</div>
                    {result.findings.map((finding) => (
                      <div key={finding.id} className="text-sm bg-white/5 border rounded p-2 mb-2">
                        <span className="font-semibold">{finding.title}</span>: {finding.description}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Evidence Pack
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!latestPack ? (
                <div className="text-sm text-slate-300">No evidence pack generated yet.</div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm text-slate-300">Pack ID: {latestPack.id}</div>
                  <div className="text-sm text-slate-300">
                    Items: {latestPack.summary.totalItems} • Avg confidence: {latestPack.summary.averageConfidence}%
                  </div>
                  <div className="max-h-52 overflow-y-auto space-y-2">
                    {latestPack.items.map((item) => (
                      <div key={item.id} className="text-sm border rounded p-2">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-slate-300">{item.botName} • {item.source} • {item.confidence}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Recent Audit Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentAuditEvents.length === 0 && <div className="text-sm text-slate-300">No audit events yet.</div>}
                {recentAuditEvents.map((event) => (
                  <div key={event.id} className="border rounded p-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{event.eventType}</span>
                      <span className="text-slate-400">{new Date(event.occurredAt).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-slate-300">{event.description}</div>
                    <div className="text-xs text-slate-400 mt-1">Actor: {event.actor} • Target: {event.targetId}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
