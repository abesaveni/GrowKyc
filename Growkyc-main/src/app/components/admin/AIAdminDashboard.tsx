import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/button';
import {
  Brain,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Eye,
} from 'lucide-react';
import {
  BotRunRecord,
  Decision,
  ensureOperationalSeedData,
  listBotRuns,
  recordManualDecision,
} from '../../lib/operationalBotEngine';
import { toast } from '../../lib/toast';

interface AIEngineStatus {
  ai_powered: boolean;
  model: string | null;
  bot_count: number;
  mode: string;
  message: string;
}

async function fetchAIStatus(): Promise<AIEngineStatus | null> {
  try {
    const token = sessionStorage.getItem('growkyc_token');
    const base = (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1';
    const res = await fetch(`${base}/ai/status`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

interface AIAdminDashboardProps {
  onNavigate: (page: string) => void;
}

type DashboardTab = 'pending' | 'approved' | 'rejected';

function badgeClass(decision: Decision): string {
  if (decision === 'auto-approve') return 'bg-green-500/15 text-green-300';
  if (decision === 'manual-review') return 'bg-amber-500/15 text-amber-300';
  return 'bg-red-500/15 text-red-300';
}

export function AIAdminDashboard({ onNavigate }: AIAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('pending');
  const [runs, setRuns] = useState<BotRunRecord[]>([]);
  const [aiStatus, setAiStatus] = useState<AIEngineStatus | null>(null);

  useEffect(() => {
    ensureOperationalSeedData();
    setRuns(listBotRuns());
    fetchAIStatus().then((status) => setAiStatus(status));
  }, []);

  const grouped = useMemo(() => {
    const pending = runs.filter((run) => run.decision === 'manual-review');
    const approved = runs.filter((run) => run.decision === 'auto-approve');
    const rejected = runs.filter((run) => run.decision === 'reject');
    return { pending, approved, rejected };
  }, [runs]);

  const visibleRuns =
    activeTab === 'pending' ? grouped.pending : activeTab === 'approved' ? grouped.approved : grouped.rejected;

  const metrics = useMemo(() => {
    const total = runs.length;
    const avgConfidence = total > 0 ? Number((runs.reduce((sum, r) => sum + r.confidence, 0) / total).toFixed(1)) : 0;
    return {
      total,
      pending: grouped.pending.length,
      approved: grouped.approved.length,
      rejected: grouped.rejected.length,
      avgConfidence,
    };
  }, [grouped, runs]);

  const refreshRuns = () => setRuns(listBotRuns());

  const handleDecision = (runId: string, decision: Decision) => {
    recordManualDecision({
      runId,
      actor: 'ai-admin',
      decision,
      reason: 'Manual compliance review decision',
    });
    refreshRuns();
    toast.success(`Decision updated to ${decision}`);
  };

  return (
    <div className="min-h-screen bg-white/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-100">AI Admin Assistant</h1>
              <p className="text-slate-300">Operational bot run queue with manual decision controls</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {aiStatus ? (
              <div className={`border rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 ${
                aiStatus.ai_powered
                  ? 'bg-green-500/10 border-green-500/30 text-green-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}>
                <Sparkles className="w-4 h-4" />
                {aiStatus.ai_powered ? `AI Active — ${aiStatus.model}` : 'Simulated Mode'}
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-slate-400 text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Checking AI status…
              </div>
            )}
            <Button onClick={() => onNavigate('admin')} variant="outline">Back to Admin</Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border rounded-lg p-4"><div className="text-sm text-slate-300">Total Runs</div><div className="text-3xl font-bold">{metrics.total}</div></div>
          <div className="bg-white border rounded-lg p-4"><div className="text-sm text-slate-300">Pending Review</div><div className="text-3xl font-bold text-amber-400">{metrics.pending}</div></div>
          <div className="bg-white border rounded-lg p-4"><div className="text-sm text-slate-300">Approved</div><div className="text-3xl font-bold text-green-400">{metrics.approved}</div></div>
          <div className="bg-white border rounded-lg p-4"><div className="text-sm text-slate-300">Avg Confidence</div><div className="text-3xl font-bold">{metrics.avgConfidence}%</div></div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-white border text-slate-300'}`}
          >
            Pending ({grouped.pending.length})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'approved' ? 'bg-blue-600 text-white' : 'bg-white border text-slate-300'}`}
          >
            Approved ({grouped.approved.length})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'rejected' ? 'bg-blue-600 text-white' : 'bg-white border text-slate-300'}`}
          >
            Rejected ({grouped.rejected.length})
          </button>
        </div>

        <div className="space-y-4">
          {visibleRuns.map((run) => (
            <div key={run.id} className="bg-white rounded-xl border overflow-hidden">
              <div className="px-6 py-4 border-b bg-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-100">{run.clientName}</h3>
                    <p className="text-sm text-slate-300">{run.clientId} • {new Date(run.completedAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-slate-100">{run.riskScore}</div>
                    <div className="text-xs text-slate-400">Risk Score</div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 grid grid-cols-4 gap-3 border-b">
                <div className="text-sm text-slate-300">Confidence: <span className="font-semibold">{run.confidence}%</span></div>
                <div className="text-sm text-slate-300">Findings: <span className="font-semibold">{run.findingsCount}</span></div>
                <div className="text-sm text-slate-300">Alerts: <span className="font-semibold">{run.alertedChecks}</span></div>
                <div className="text-sm text-slate-300">Failures: <span className="font-semibold">{run.failedChecks}</span></div>
              </div>

              <div className="px-6 py-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-100">Current Decision</span>
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${badgeClass(run.decision)}`}>{run.decision}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {run.botResults.slice(0, 3).map((bot) => (
                    <div key={bot.botId} className="text-sm p-2 bg-white/5 border rounded">
                      <div className="font-medium">{bot.botName}</div>
                      <div className="text-slate-300">{bot.outcome} • {bot.confidence}%</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-6 py-4 flex items-center justify-between bg-white/5">
                <div className="text-sm text-slate-300 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Run ID: {run.id}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Evidence
                  </Button>

                  <Button variant="outline" size="sm" onClick={() => handleDecision(run.id, 'auto-approve')}>
                    <CheckCircle className="w-4 h-4 mr-1 text-green-400" />
                    Approve
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDecision(run.id, 'manual-review')}>
                    <AlertTriangle className="w-4 h-4 mr-1 text-amber-400" />
                    Review
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDecision(run.id, 'reject')}>
                    <XCircle className="w-4 h-4 mr-1 text-red-400" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {visibleRuns.length === 0 && (
            <div className="bg-white border rounded-lg p-8 text-center text-slate-300">
              No items in this queue.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
