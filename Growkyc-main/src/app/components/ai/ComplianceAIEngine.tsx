import React, { useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Brain,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Activity,
  Clock,
  Eye,
} from 'lucide-react';
import { ensureOperationalSeedData, listBotRuns } from '../../lib/operationalBotEngine';

interface ComplianceAIEngineProps {
  onBack: () => void;
}

export function ComplianceAIEngine({ onBack }: ComplianceAIEngineProps) {
  useEffect(() => {
    ensureOperationalSeedData();
  }, []);

  const runs = listBotRuns();

  const metrics = useMemo(() => {
    const total = runs.length;
    const approved = runs.filter((r) => r.decision === 'auto-approve').length;
    const review = runs.filter((r) => r.decision === 'manual-review').length;
    const rejected = runs.filter((r) => r.decision === 'reject').length;
    const passRate = total > 0 ? Math.round((approved / total) * 100) : 0;
    const avgConfidence =
      total > 0 ? Number((runs.reduce((sum, run) => sum + run.confidence, 0) / total).toFixed(1)) : 0;
    return { total, approved, review, rejected, passRate, avgConfidence };
  }, [runs]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-8 py-10">
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
            <h1 className="text-4xl font-bold">Compliance AI Engine</h1>
            <p className="text-white/90">Operational bot execution with persisted findings, confidence, and decisions</p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <Card className="bg-white/10 border-white/20 text-white"><CardContent className="p-4"><div className="text-sm">Total Screenings</div><div className="text-3xl font-bold">{metrics.total}</div></CardContent></Card>
          <Card className="bg-white/10 border-white/20 text-white"><CardContent className="p-4"><div className="text-sm">Auto-Approved</div><div className="text-3xl font-bold">{metrics.approved}</div></CardContent></Card>
          <Card className="bg-white/10 border-white/20 text-white"><CardContent className="p-4"><div className="text-sm">Manual Review</div><div className="text-3xl font-bold">{metrics.review}</div></CardContent></Card>
          <Card className="bg-white/10 border-white/20 text-white"><CardContent className="p-4"><div className="text-sm">Rejected</div><div className="text-3xl font-bold">{metrics.rejected}</div></CardContent></Card>
          <Card className="bg-white/10 border-white/20 text-white"><CardContent className="p-4"><div className="text-sm">Avg Confidence</div><div className="text-3xl font-bold">{metrics.avgConfidence}%</div></CardContent></Card>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Recent Screenings</CardTitle>
            <CardDescription>Shared bot engine runs with decision outputs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {runs.slice(0, 8).map((run) => (
                <div key={run.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-900">{run.clientName}</div>
                      <div className="text-xs text-gray-500">{run.clientId} • {new Date(run.completedAt).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {run.decision === 'auto-approve' && <CheckCircle className="w-4 h-4 text-green-600" />}
                      {run.decision === 'manual-review' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                      {run.decision === 'reject' && <XCircle className="w-4 h-4 text-red-600" />}
                      <Badge className={run.decision === 'auto-approve' ? 'bg-green-600 text-white' : run.decision === 'manual-review' ? 'bg-amber-600 text-white' : 'bg-red-600 text-white'}>
                        {run.decision}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-3">
                    <div className="text-sm text-gray-600">Risk Score: <span className="font-semibold text-gray-900">{run.riskScore}</span></div>
                    <div className="text-sm text-gray-600">Confidence: <span className="font-semibold text-gray-900">{run.confidence}%</span></div>
                    <div className="text-sm text-gray-600">Findings: <span className="font-semibold text-gray-900">{run.findingsCount}</span></div>
                    <div className="text-sm text-gray-600">Alerts/Fails: <span className="font-semibold text-gray-900">{run.alertedChecks}/{run.failedChecks}</span></div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {run.botResults.slice(0, 3).map((result) => (
                      <div key={result.botId} className="text-sm bg-gray-50 rounded border p-2">
                        <div className="font-medium">{result.botName}</div>
                        <div className="text-gray-600">{result.outcome} • {result.confidence}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {runs.length === 0 && (
                <div className="text-sm text-gray-600">No screening runs found.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Operational Notes</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4 text-sm text-gray-700">
            <div className="border rounded p-3">
              <div className="font-semibold flex items-center gap-2 mb-1"><Activity className="w-4 h-4" /> Persistent Run State</div>
              Bot runs are stored and replayable across sessions.
            </div>
            <div className="border rounded p-3">
              <div className="font-semibold flex items-center gap-2 mb-1"><Clock className="w-4 h-4" /> Decision Outputs</div>
              Each run produces confidence, risk score, and clear decision outcomes.
            </div>
            <div className="border rounded p-3">
              <div className="font-semibold flex items-center gap-2 mb-1"><Eye className="w-4 h-4" /> Evidence Trace</div>
              Findings and evidence are generated per bot and tied to audit trail events.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
