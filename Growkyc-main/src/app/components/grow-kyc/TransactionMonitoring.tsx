import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  ArrowLeft,
  Activity,
  AlertTriangle,
  Zap,
  Eye,
  Download,
  RefreshCw,
  Clock,
  Shield,
  AlertCircle,
  Search,
  FileText,
  XCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { toast } from '../../lib/toast';
import { Breadcrumbs } from './Breadcrumbs';
import { ClientsDB } from '../kyc/ClientsDatabase';

interface TransactionMonitoringProps {
  onBack: () => void;
  onOpenReferral?: (alertId: string) => void;
  /** Compliance Officer: alerts derived from live client monitoring data. */
  complianceOfficerMode?: boolean;
}

type AlertStatus = 'new' | 'investigating' | 'escalated' | 'closed';
type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

interface TransactionAlert {
  id: string;
  client: string;
  clientId: string;
  transactionId: string;
  riskScore: number;
  pattern: string;
  details: string;
  transactions: number;
  totalAmount: number;
  timeframe: string;
  status: AlertStatus;
  severity: AlertSeverity;
  flaggedAt: string;
  autoAction: string;
  pepStatus: 'clear' | 'review' | 'match';
  sanctionsStatus: 'clear' | 'review' | 'match';
  kycStatus: 'verified' | 'pending' | 'expired';
}

const INITIAL_ALERTS: TransactionAlert[] = [
  {
    id: 'alert-001',
    client: 'Alpha Holdings Pty Ltd',
    clientId: 'C001',
    transactionId: 'TXN-89011',
    riskScore: 92,
    pattern: 'Structuring Alert',
    details: '4 transactions totaling $38,500 within 6 hours, each $9,500-$9,800.',
    transactions: 4,
    totalAmount: 38500,
    timeframe: '6 hours',
    status: 'new',
    severity: 'critical',
    flaggedAt: '2026-05-28T09:15:00.000Z',
    autoAction: 'Account under review hold',
    pepStatus: 'review',
    sanctionsStatus: 'clear',
    kycStatus: 'pending'
  },
  {
    id: 'alert-002',
    client: 'John Smith',
    clientId: 'C002',
    transactionId: 'TXN-89012',
    riskScore: 78,
    pattern: 'Velocity Anomaly',
    details: '$75,000 received and $72,000 sent within 24 hours across linked accounts.',
    transactions: 2,
    totalAmount: 75000,
    timeframe: '24 hours',
    status: 'investigating',
    severity: 'high',
    flaggedAt: '2026-05-28T08:30:00.000Z',
    autoAction: 'None',
    pepStatus: 'clear',
    sanctionsStatus: 'review',
    kycStatus: 'verified'
  },
  {
    id: 'alert-003',
    client: 'Beta Investment Corp',
    clientId: 'C003',
    transactionId: 'TXN-89013',
    riskScore: 85,
    pattern: 'High Geographical Risk',
    details: '$120,000 transfer to a high-risk jurisdiction with no prior business relationship.',
    transactions: 1,
    totalAmount: 120000,
    timeframe: 'Single',
    status: 'escalated',
    severity: 'high',
    flaggedAt: '2026-05-27T16:20:00.000Z',
    autoAction: 'Transaction held pending review',
    pepStatus: 'clear',
    sanctionsStatus: 'match',
    kycStatus: 'verified'
  }
];

function buildAlertsFromClients(): TransactionAlert[] {
  const clients = ClientsDB.getClients();
  const rows: TransactionAlert[] = [];
  clients.forEach((c, idx) => {
    const active = c.monitoringData?.activeAlerts || 0;
    if (active === 0 && c.amlData?.riskRating !== 'High' && c.amlData?.riskRating !== 'Critical') return;

    const severity: AlertSeverity =
      c.amlData?.riskRating === 'Critical'
        ? 'critical'
        : c.amlData?.riskRating === 'High'
          ? 'high'
          : 'medium';

    let pattern = 'Monitoring Alert';
    if (c.monitoringData?.ownershipChanges) pattern = 'Ownership Changes';
    else if (c.amlData?.sanctionsMatches > 0) pattern = 'Sanctions Changes';
    else if (c.amlData?.pepStatus && c.amlData.pepStatus !== 'Not PEP') pattern = 'PEP Changes';
    else if (c.amlData?.adverseMediaHits > 0) pattern = 'Adverse Media';
    else if (c.monitoringData?.nameChanges) pattern = 'Director Changes';

    rows.push({
      id: `alert-co-${c.id}-${idx}`,
      client: c.name,
      clientId: c.id,
      transactionId: `TXN-${10000 + idx}`,
      riskScore: Math.min(99, c.riskScores?.overall || 50),
      pattern,
      details: `${active || 1} active monitoring signal(s) for ${c.name}.`,
      transactions: active || 1,
      totalAmount: c.financialData?.highRiskTransactions ? c.financialData.highRiskTransactions * 10000 : 25000,
      timeframe: '24 hours',
      status: c.status === 'Suspended' ? 'escalated' : 'new',
      severity,
      flaggedAt: new Date().toISOString(),
      autoAction: c.status === 'Suspended' ? 'Account under review hold' : 'None',
      pepStatus: c.amlData?.pepStatus !== 'Not PEP' ? 'match' : 'clear',
      sanctionsStatus: c.amlData?.sanctionsMatches > 0 ? 'match' : 'clear',
      kycStatus: c.quickStatus?.identity === 'Verified' ? 'verified' : 'pending',
    });
  });
  return rows;
}

export function TransactionMonitoring({ onBack, onOpenReferral, complianceOfficerMode = false }: TransactionMonitoringProps) {
  const [alerts, setAlerts] = useState<TransactionAlert[]>(
    () => (complianceOfficerMode ? buildAlertsFromClients() : [])
  );
  const [selectedAlert, setSelectedAlert] = useState<TransactionAlert | null>(null);
  const [investigationTab, setInvestigationTab] = useState<'overview' | 'kyc' | 'screening' | 'timeline' | 'notes'>('overview');
  const [notesByAlert, setNotesByAlert] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AlertStatus>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | AlertSeverity>('all');
  const [sortBy, setSortBy] = useState<'flaggedAt' | 'riskScore'>('flaggedAt');
  const [currentPage, setCurrentPage] = useState(1);
  const [liveRefresh, setLiveRefresh] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 5;

  const heatmapData = useMemo(() => {
    if (!complianceOfficerMode) return [];
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().slice(0, 10);
    });
    const avgRisk = alerts.length > 0
      ? Math.round(alerts.reduce((s, a) => s + a.riskScore, 0) / alerts.length)
      : 0;
    return last7.map((date) => ({
      date,
      riskScore: avgRisk,
      flagged: alerts.filter((a) => a.flaggedAt.startsWith(date)).length,
    }));
  }, [complianceOfficerMode, alerts]);

  const sortedFilteredAlerts = useMemo(() => {
    const filtered = alerts.filter((alert) => {
      if (statusFilter !== 'all' && alert.status !== statusFilter) return false;
      if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;
      if (!search.trim()) return true;
      const needle = search.toLowerCase();
      return (
        alert.client.toLowerCase().includes(needle) ||
        alert.pattern.toLowerCase().includes(needle) ||
        alert.id.toLowerCase().includes(needle) ||
        alert.transactionId.toLowerCase().includes(needle)
      );
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'riskScore') return b.riskScore - a.riskScore;
      return new Date(b.flaggedAt).getTime() - new Date(a.flaggedAt).getTime();
    });
  }, [alerts, statusFilter, severityFilter, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedFilteredAlerts.length / pageSize));
  const visibleAlerts = sortedFilteredAlerts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, severityFilter, search, sortBy]);

  useEffect(() => {
    if (!liveRefresh) return;
    const timer = window.setInterval(() => {
      if (complianceOfficerMode) {
        setAlerts(buildAlertsFromClients());
      } else {
        setAlerts((prev) =>
          prev.map((alert) =>
            alert.status === 'new'
              ? { ...alert, riskScore: Math.min(99, alert.riskScore + 1) }
              : alert
          )
        );
      }
    }, 30000);
    return () => window.clearInterval(timer);
  }, [liveRefresh, complianceOfficerMode]);

  useEffect(() => {
    if (!complianceOfficerMode) return;
    setAlerts(buildAlertsFromClients());
    return ClientsDB.subscribe(() => setAlerts(buildAlertsFromClients()));
  }, [complianceOfficerMode]);

  const refreshAlerts = () => {
    setIsRefreshing(true);
    setError(null);
    window.setTimeout(() => {
      if (complianceOfficerMode) {
        setAlerts(buildAlertsFromClients());
      } else {
        setAlerts((prev) =>
          prev.map((alert, idx) =>
            idx === 0 ? { ...alert, flaggedAt: new Date().toISOString() } : alert
          )
        );
      }
      setIsRefreshing(false);
      toast.success('Alert queue refreshed');
    }, 700);
  };

  const setAlertStatus = (alertId: string, status: AlertStatus) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, status } : alert)));
  };

  const saveNote = () => {
    if (!selectedAlert) return;
    toast.success('Investigation note saved');
  };

  const severityBadgeClass = (severity: AlertSeverity) => {
    if (severity === 'critical') return 'bg-red-600';
    if (severity === 'high') return 'bg-amber-600';
    if (severity === 'medium') return 'bg-blue-600';
    return 'bg-slate-600';
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="h-6 w-px bg-white/30" />
              <Activity className="w-6 h-6 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Transaction Monitoring</h1>
                <p className="text-sm text-white/90">Real-Time AML Surveillance & Pattern Detection</p>
              </div>
            </div>
            <Badge className="bg-[#1e293b] text-green-400 text-sm px-3 py-1">
              <Zap className="w-4 h-4 mr-1" />
              {liveRefresh ? 'Live Monitoring Active' : 'Live Monitoring Paused'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Breadcrumbs items={[
          { label: 'Compliance Office', onClick: onBack },
          { label: 'Transaction Monitoring', active: true }
        ]} />
        <Tabs defaultValue="alerts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="alerts">Daily Alert Queue</TabsTrigger>
            <TabsTrigger value="heatmap">Risk Heatmap</TabsTrigger>
          </TabsList>

          {/* Transaction Alerts */}
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardContent className="p-4 grid grid-cols-1 lg:grid-cols-5 gap-3">
                <div className="lg:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search alert, client, or transaction..."
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | AlertStatus)}>
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="escalated">Escalated</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={severityFilter} onValueChange={(value) => setSeverityFilter(value as 'all' | AlertSeverity)}>
                  <SelectTrigger><SelectValue placeholder="Severity" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'flaggedAt' | 'riskScore')}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flaggedAt">Sort: Newest</SelectItem>
                      <SelectItem value="riskScore">Sort: Risk Score</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" onClick={refreshAlerts} disabled={isRefreshing}>
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>{sortedFilteredAlerts.length} alert(s)</span>
              <Button variant="outline" size="sm" onClick={() => setLiveRefresh((v) => !v)}>
                {liveRefresh ? 'Pause refresh' : 'Resume refresh'}
              </Button>
            </div>

            {isLoading && <div className="p-6 bg-[#1e293b] rounded border">Loading alerts...</div>}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            {!isLoading && visibleAlerts.length === 0 && (
              <div className="p-10 bg-[#1e293b] rounded border text-center text-slate-300">
                No alerts match current filters.
              </div>
            )}

            <div className="space-y-4">
              {visibleAlerts.map((alert) => (
                <Card 
                  key={alert.id}
                  className={`border-2 ${
                    alert.riskScore >= 90 ? 'border-red-300 bg-red-500/10' :
                    alert.riskScore >= 70 ? 'border-amber-300 bg-amber-500/10' :
                    'border-blue-300 bg-blue-500/10'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <AlertTriangle className={`w-6 h-6 ${
                            alert.riskScore >= 90 ? 'text-red-400' :
                            alert.riskScore >= 70 ? 'text-amber-400' :
                            'text-blue-400'
                          }`} />
                          <div>
                            <h3 className="text-lg font-semibold text-white">{alert.client}</h3>
                            <div className="text-sm text-slate-300">{alert.pattern}</div>
                            <div className="text-xs text-slate-400 mt-1">Customer {alert.clientId} · Txn {alert.transactionId}</div>
                          </div>
                          <Badge className={severityBadgeClass(alert.severity)}>
                            {alert.severity.toUpperCase()} · {alert.riskScore}/100
                          </Badge>
                        </div>

                        <p className="text-sm text-white mb-4 p-3 bg-[#1e293b] rounded border">
                          {alert.details}
                        </p>

                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-slate-300">Transactions</div>
                            <div className="font-semibold">{alert.transactions}</div>
                          </div>
                          <div>
                            <div className="text-sm text-slate-300">Total Amount</div>
                            <div className="font-semibold text-green-400">
                              ${alert.totalAmount.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-slate-300">Timeframe</div>
                            <div className="font-semibold">{alert.timeframe}</div>
                          </div>
                          <div>
                            <div className="text-sm text-slate-300">Status</div>
                            <Badge variant="outline">{alert.status}</Badge>
                          </div>
                        </div>

                        {alert.autoAction !== 'None' && (
                          <div className="p-3 bg-amber-500/15 rounded border border-amber-300 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-semibold text-amber-300">
                              Auto Action: {alert.autoAction}
                            </span>
                          </div>
                        )}

                        <div className="text-xs text-slate-400 mt-3">
                          Flagged: {new Date(alert.flaggedAt).toLocaleString('en-AU')}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-6">
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => {
                            setAlertStatus(alert.id, 'escalated');
                            if (onOpenReferral) onOpenReferral(alert.id);
                            toast.success('Alert escalated to internal referral');
                          }}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Create SMR Case
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setAlertStatus(alert.id, 'investigating');
                            setSelectedAlert(alert);
                            setInvestigationTab('overview');
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Investigate
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => toast.info('Evidence export started')}>
                          <Download className="w-4 h-4 mr-2" />
                          Export Evidence
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}>
                Previous
              </Button>
              <span className="text-sm text-slate-300">Page {currentPage} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </TabsContent>

          {/* Risk Heatmap */}
          <TabsContent value="heatmap" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>7-Day Transaction Risk Heatmap</CardTitle>
                <CardDescription>
                  Daily risk score trend and flagged transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {heatmapData.map((day, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-24 text-sm font-medium text-slate-300">
                        {new Date(day.date).toLocaleDateString('en-AU', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Progress 
                            value={day.riskScore} 
                            className={`h-8 ${
                              day.riskScore >= 80 ? 'bg-red-500/15' :
                              day.riskScore >= 50 ? 'bg-amber-500/15' :
                              'bg-green-500/15'
                            }`}
                          />
                          <span className={`font-bold text-lg ${
                            day.riskScore >= 80 ? 'text-red-400' :
                            day.riskScore >= 50 ? 'text-amber-400' :
                            'text-green-400'
                          }`}>
                            {day.riskScore}
                          </span>
                        </div>
                      </div>
                      <div className="w-32 text-right">
                        <Badge className={
                          day.flagged >= 10 ? 'bg-red-600' :
                          day.flagged >= 5 ? 'bg-amber-600' :
                          'bg-blue-600'
                        }>
                          {day.flagged} flagged
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {selectedAlert && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4 overflow-y-auto" onClick={() => setSelectedAlert(null)}>
          <Card className="max-w-4xl mx-auto mt-6" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Alert Investigation Workbench</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setSelectedAlert(null)}>
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
              <CardDescription>{selectedAlert.client} · {selectedAlert.id}</CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <Tabs value={investigationTab} onValueChange={(v) => setInvestigationTab(v as typeof investigationTab)}>
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="kyc">KYC</TabsTrigger>
                  <TabsTrigger value="screening">PEP/Sanctions</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="pt-4 text-sm space-y-2">
                  <p><strong>Pattern:</strong> {selectedAlert.pattern}</p>
                  <p><strong>Transaction:</strong> {selectedAlert.transactionId}</p>
                  <p><strong>Amount:</strong> ${selectedAlert.totalAmount.toLocaleString()}</p>
                  <p><strong>Details:</strong> {selectedAlert.details}</p>
                </TabsContent>
                <TabsContent value="kyc" className="pt-4 text-sm space-y-2">
                  <p><strong>KYC status:</strong> {selectedAlert.kycStatus}</p>
                  <p><strong>Customer:</strong> {selectedAlert.clientId}</p>
                  <p>CDD checklist and profile data loaded for review.</p>
                </TabsContent>
                <TabsContent value="screening" className="pt-4 text-sm space-y-2">
                  <p><strong>PEP screening:</strong> {selectedAlert.pepStatus}</p>
                  <p><strong>Sanctions screening:</strong> {selectedAlert.sanctionsStatus}</p>
                  <p>Risk scoring is synced with screening outcomes.</p>
                </TabsContent>
                <TabsContent value="timeline" className="pt-4 text-sm space-y-2">
                  <p>{new Date(selectedAlert.flaggedAt).toLocaleString('en-AU')} - Alert triggered</p>
                  <p>{new Date().toLocaleString('en-AU')} - Investigation opened</p>
                </TabsContent>
                <TabsContent value="notes" className="pt-4 space-y-3">
                  <textarea
                    rows={5}
                    value={notesByAlert[selectedAlert.id] ?? ''}
                    onChange={(e) =>
                      setNotesByAlert((prev) => ({ ...prev, [selectedAlert.id]: e.target.value }))
                    }
                    className="w-full border rounded-md p-3 text-sm"
                    placeholder="Add investigation notes, rationale, and findings..."
                  />
                  <Button onClick={saveNote}>
                    <FileText className="w-4 h-4 mr-2" />
                    Save Notes
                  </Button>
                </TabsContent>
              </Tabs>

              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <Button variant="outline" onClick={() => setAlertStatus(selectedAlert.id, 'closed')}>Close Alert</Button>
                <Button variant="outline" onClick={() => setAlertStatus(selectedAlert.id, 'investigating')}>Mark Investigating</Button>
                <Button className="bg-red-600 hover:bg-red-700" onClick={() => {
                  setAlertStatus(selectedAlert.id, 'escalated');
                  if (onOpenReferral) onOpenReferral(selectedAlert.id);
                }}>Escalate Referral</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}