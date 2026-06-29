import React, { useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  Activity,
} from 'lucide-react';
import { ensureOperationalSeedData, listBotRuns } from '../../lib/operationalBotEngine';

interface RiskScoringEngineProps {
  onBack: () => void;
}

function getRiskLabel(score: number): 'Low' | 'Medium' | 'High' {
  if (score < 35) return 'Low';
  if (score < 70) return 'Medium';
  return 'High';
}

function riskBadge(score: number): string {
  if (score < 35) return 'bg-green-600 text-white';
  if (score < 70) return 'bg-amber-600 text-white';
  return 'bg-red-600 text-white';
}

export function RiskScoringEngine({ onBack }: RiskScoringEngineProps) {
  useEffect(() => {
    ensureOperationalSeedData();
  }, []);

  const runs = listBotRuns();

  const clients = useMemo(() => {
    const byClient = new Map<string, typeof runs>();

    for (const run of runs) {
      if (!byClient.has(run.clientId)) byClient.set(run.clientId, []);
      byClient.get(run.clientId)!.push(run);
    }

    return Array.from(byClient.values()).map((clientRuns) => {
      const sorted = [...clientRuns].sort((a, b) => b.completedAt.localeCompare(a.completedAt));
      const latest = sorted[0];
      const previous = sorted[1];
      const delta = previous ? latest.riskScore - previous.riskScore : 0;

      return {
        clientId: latest.clientId,
        clientName: latest.clientName,
        currentScore: latest.riskScore,
        previousScore: previous?.riskScore ?? latest.riskScore,
        delta,
        confidence: latest.confidence,
        decision: latest.decision,
        updatedAt: latest.completedAt,
        topFindings: latest.botResults
          .flatMap((result) => result.findings)
          .slice(0, 3)
          .map((finding) => finding.title),
      };
    });
  }, [runs]);

  const modelMetrics = useMemo(() => {
    const total = clients.length;
    const avgScore = total > 0 ? Math.round(clients.reduce((sum, c) => sum + c.currentScore, 0) / total) : 0;
    const avgConfidence = total > 0 ? Math.round(clients.reduce((sum, c) => sum + c.confidence, 0) / total) : 0;
    return { total, avgScore, avgConfidence };
  }, [clients]);

  return (
    <div className="min-h-screen bg-white/5">
      <div className="bg-gradient-to-r from-fuchsia-600 to-rose-600 text-white px-8 py-10">
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
            <h1 className="text-4xl font-bold">Risk Scoring Engine</h1>
            <p className="text-white/90">Risk scores generated from shared operational bot outcomes</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-white/10 border-white/20 text-white"><CardContent className="p-4"><div className="text-sm">Tracked Clients</div><div className="text-3xl font-bold">{modelMetrics.total}</div></CardContent></Card>
          <Card className="bg-white/10 border-white/20 text-white"><CardContent className="p-4"><div className="text-sm">Average Risk Score</div><div className="text-3xl font-bold">{modelMetrics.avgScore}</div></CardContent></Card>
          <Card className="bg-white/10 border-white/20 text-white"><CardContent className="p-4"><div className="text-sm">Average Confidence</div><div className="text-3xl font-bold">{modelMetrics.avgConfidence}%</div></CardContent></Card>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto space-y-4">
        {clients.map((client) => (
          <Card key={client.clientId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{client.clientName}</CardTitle>
                  <CardDescription>
                    {client.clientId} • Updated {new Date(client.updatedAt).toLocaleString()}
                  </CardDescription>
                </div>
                <Badge className={riskBadge(client.currentScore)}>{getRiskLabel(client.currentScore)} Risk</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="border rounded p-3">
                  <div className="text-xs text-slate-400">Current Score</div>
                  <div className="text-2xl font-bold">{client.currentScore}</div>
                </div>
                <div className="border rounded p-3">
                  <div className="text-xs text-slate-400">Previous Score</div>
                  <div className="text-2xl font-bold">{client.previousScore}</div>
                </div>
                <div className="border rounded p-3">
                  <div className="text-xs text-slate-400">Trend</div>
                  <div className="text-2xl font-bold flex items-center gap-1">
                    {client.delta > 0 ? <TrendingUp className="w-5 h-5 text-red-400" /> : <TrendingDown className="w-5 h-5 text-green-400" />}
                    <span className={client.delta > 0 ? 'text-red-400' : 'text-green-400'}>
                      {client.delta > 0 ? `+${client.delta}` : client.delta}
                    </span>
                  </div>
                </div>
                <div className="border rounded p-3">
                  <div className="text-xs text-slate-400">Model Confidence</div>
                  <div className="text-2xl font-bold">{client.confidence}%</div>
                </div>
              </div>

              <div className="mb-3 text-sm text-slate-300">
                Decision: <span className="font-semibold">{client.decision}</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {client.topFindings.map((finding) => (
                  <div key={finding} className="text-sm border rounded bg-white/5 p-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    {finding}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {clients.length === 0 && (
          <Card>
            <CardContent className="p-6 text-sm text-slate-300">No risk runs available.</CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Scoring Inputs</CardTitle>
            <CardDescription>Risk score is derived from operational outcomes across core bot domains</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-4 gap-3 text-sm text-slate-300">
            <div className="border rounded p-3 flex items-center gap-2"><Target className="w-4 h-4" /> Identity + KYB outcomes</div>
            <div className="border rounded p-3 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Passed vs alerted checks</div>
            <div className="border rounded p-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Failed check weighting</div>
            <div className="border rounded p-3 flex items-center gap-2"><Activity className="w-4 h-4" /> Confidence aggregation</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
