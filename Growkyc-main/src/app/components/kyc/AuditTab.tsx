import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Search, 
  Filter, 
  Shield, 
  Terminal, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Activity, 
  Globe,
  MonitorSmartphone,
  Download,
  X,
  Lock,
  FileText,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '../../lib/toast';
import { ClientsDB } from './ClientsDatabase';

interface AuditEvent {
  id: string;
  actor: string;
  actorType: 'User' | 'System' | 'API';
  action: string;
  entity: string;
  timestamp: Date;
  ip: string;
  outcome: 'Success' | 'Failed' | 'Denied' | 'Warning';
  details?: string;
}

export function AuditTab({ clientId }: { clientId: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('all');
  const [actorTypeFilter, setActorTypeFilter] = useState('all');
  
  // Selected event for Details Modal
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  // Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'PDF' | 'CSV'>('PDF');
  const [isExporting, setIsExporting] = useState(false);

  // Retrieve client information from ClientsDB dynamically
  const client = useMemo(() => {
    return ClientsDB.getClients().find(c => c.id === clientId);
  }, [clientId]);

  // Dynamically generate audit events based on client's actual data
  const events = useMemo<AuditEvent[]>(() => {
    if (!client) return [];

    const clientName = client.name;
    const primaryDirector = client.entityData?.directors?.[0]?.name || 'Authorized Signatory';
    const approver = client.decisionsData?.approver || 'Sarah Chen';
    const onboardingDate = client.decisionsData?.onboardingDate || '2024-03-20';
    const lastReviewDate = client.lastReview || '2024-03-15';
    const ipAddress = '203.45.67.89';

    const list: AuditEvent[] = [
      {
        id: `evt-${client.id}-001`,
        actor: client.entityType === 'Individual' ? clientName : primaryDirector,
        actorType: 'User',
        action: 'Service Agreement Signed',
        entity: 'Service_Agreement.pdf',
        timestamp: new Date(`${onboardingDate}T09:15:00`),
        ip: ipAddress,
        outcome: client.legalData.serviceAgreementSigned ? 'Success' : 'Warning',
        details: client.legalData.serviceAgreementSigned 
          ? 'Completed via GovSign. Cryptographic signature verified.' 
          : 'Agreement signature bypassed or pending.'
      },
      {
        id: `evt-${client.id}-002`,
        actor: client.entityType === 'Individual' ? clientName : primaryDirector,
        actorType: 'User',
        action: 'Terms & Conditions Accepted',
        entity: 'Client Portal Terms',
        timestamp: new Date(`${onboardingDate}T09:16:12`),
        ip: ipAddress,
        outcome: client.legalData.termsAccepted ? 'Success' : 'Warning',
        details: client.legalData.termsAccepted 
          ? 'Accepted terms and privacy consent during onboarding.' 
          : 'Pending terms acceptance.'
      },
      {
        id: `evt-${client.id}-003`,
        actor: 'AML Screening Engine',
        actorType: 'System',
        action: 'PEP & Sanctions Search',
        entity: clientName,
        timestamp: new Date(`${lastReviewDate}T10:05:00`),
        ip: 'internal-api',
        outcome: client.amlData.riskRating === 'High' || client.amlData.riskRating === 'Critical' ? 'Warning' : 'Success',
        details: `Screened against WorldCheck DB. Sanctions matches: ${client.amlData.sanctionsMatches}, PEP Status: ${client.amlData.pepStatus}. Risk Rating: ${client.amlData.riskRating}.`
      },
      {
        id: `evt-${client.id}-004`,
        actor: 'Registry Monitor',
        actorType: 'API',
        action: 'Registry Profile Verification',
        entity: client.entityType === 'Individual' ? 'Equifax Identity Search' : 'ASIC Corporate Registry',
        timestamp: new Date(`${lastReviewDate}T10:06:30`),
        ip: 'api.registry.gov.au',
        outcome: client.quickStatus.identity === 'Verified' ? 'Success' : 'Warning',
        details: client.entityType === 'Individual' 
          ? `Liveness check: ${client.identityData.livenessCheck ? 'Passed' : 'Not Performed'}. Biometrics: ${client.identityData.biometricStatus}. GreenID Score: ${client.identityData.greenIDScore || 'N/A'}.`
          : `ASIC Status: ${client.entityData.asicStatus || 'Active'}. Registry sync completed.`
      }
    ];

    // Add decision event if decisionsData exists
    if (client.decisionsData) {
      list.unshift({
        id: `evt-${client.id}-005`,
        actor: approver,
        actorType: 'User',
        action: 'Onboarding Decision Recorded',
        entity: 'Client Review Status',
        timestamp: new Date(`${onboardingDate}T14:30:00`),
        ip: '10.0.4.15',
        outcome: client.decisionsData.onboardingDecision === 'Approved' ? 'Success' : 
                 client.decisionsData.onboardingDecision === 'Rejected' ? 'Failed' : 'Warning',
        details: `Client status changed to Approved. Signed off by ${approver}. Onboarding date: ${onboardingDate}.`
      });
    }

    // Add high risk transaction log if highRiskTransactions > 0
    if (client.financialData && client.financialData.highRiskTransactions > 0) {
      list.push({
        id: `evt-${client.id}-006`,
        actor: 'Transaction Monitoring System',
        actorType: 'System',
        action: 'High-Risk Transaction Flagged',
        entity: 'Bank Account Ledger',
        timestamp: new Date(`${lastReviewDate}T11:45:10`),
        ip: 'internal-monitoring',
        outcome: 'Warning',
        details: `Detected ${client.financialData.highRiskTransactions} high-risk transactions. Source of Funds: ${client.financialData.sourceOfFunds}. Estimated Wealth: ${client.financialData.estimatedWealth}.`
      });
    }

    return list.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [client]);

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate generation and cryptographic signing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
    setIsExportModalOpen(false);
    toast.success(
      `Signed Audit Log exported as ${exportFormat}`,
      'The cryptographic signature has been attached to the file metadata.'
    );
  };

  const filteredEvents = events.filter(evt => {
    const searchMatch = 
      evt.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
      evt.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.entity.toLowerCase().includes(searchQuery.toLowerCase());
    
    const outcomeMatch = outcomeFilter === 'all' || evt.outcome.toLowerCase() === outcomeFilter;
    const actorMatch = actorTypeFilter === 'all' || evt.actorType.toLowerCase() === actorTypeFilter;

    return searchMatch && outcomeMatch && actorMatch;
  });

  const getActorIcon = (type: AuditEvent['actorType']) => {
    switch (type) {
      case 'User': return <User className="w-4 h-4 text-blue-400" />;
      case 'System': return <MonitorSmartphone className="w-4 h-4 text-purple-400" />;
      case 'API': return <Globe className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getOutcomeBadge = (outcome: AuditEvent['outcome']) => {
    switch (outcome) {
      case 'Success':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-green-500/15 text-green-300"><CheckCircle className="w-3 h-3"/> Success</span>;
      case 'Failed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-red-500/15 text-red-300"><XCircle className="w-3 h-3"/> Failed</span>;
      case 'Denied':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-red-500/15 text-red-300 border border-red-300"><Shield className="w-3 h-3"/> Denied</span>;
      case 'Warning':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500/15 text-amber-300"><AlertCircle className="w-3 h-3"/> Warning</span>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-white/10 shadow-sm">
        <CardHeader className="bg-white/5 border-b pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-100">
              <Terminal className="w-6 h-6 text-slate-300" />
              Comprehensive Audit Trail
            </CardTitle>
            <Button variant="outline" className="bg-white hover:bg-white/5" onClick={() => setIsExportModalOpen(true)}>
              <Download className="w-4 h-4 mr-2" />
              Export Log
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Filters */}
          <div className="p-4 border-b bg-white flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search actor, action, or entity..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Filter className="w-4 h-4 text-gray-400" />
              <select 
                className="px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-slate-500 w-full md:w-auto"
                value={actorTypeFilter}
                onChange={(e) => setActorTypeFilter(e.target.value)}
              >
                <option value="all">All Actors</option>
                <option value="user">Users Only</option>
                <option value="system">Systems Only</option>
                <option value="api">APIs Only</option>
              </select>
              
              <select 
                className="px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-slate-500 w-full md:w-auto"
                value={outcomeFilter}
                onChange={(e) => setOutcomeFilter(e.target.value)}
              >
                <option value="all">All Outcomes</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="denied">Denied</option>
                <option value="warning">Warning</option>
              </select>
            </div>
          </div>

          {/* Audit Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-white/5/80 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold">Timestamp</th>
                  <th className="px-6 py-4 font-semibold">Actor & IP</th>
                  <th className="px-6 py-4 font-semibold">Action & Entity</th>
                  <th className="px-6 py-4 font-semibold">Outcome</th>
                  <th className="px-6 py-4 font-semibold text-center w-24">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-white">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No audit events match your current filters.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-white/5/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-100">{format(evt.timestamp, 'dd MMM yyyy')}</span>
                          <span className="text-xs text-slate-400">{format(evt.timestamp, 'HH:mm:ss')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            {getActorIcon(evt.actorType)}
                            <span className="font-semibold text-slate-100">{evt.actor}</span>
                          </div>
                          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            {evt.ip}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-slate-100">{evt.action}</span>
                          <span className="text-xs text-slate-300 bg-white/5 px-2 py-0.5 rounded-md inline-block w-max border">
                            {evt.entity}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getOutcomeBadge(evt.outcome)}
                      </td>
                      <td className="px-6 py-4 text-center w-24 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedEvent(evt)}
                          className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-lg border-white/10 hover:border-blue-400 hover:bg-blue-500/10 text-slate-400 hover:text-blue-400 mx-auto"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Event Details Modal */}
      {selectedEvent !== null && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-white/10 flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-indigo-400" />
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-white">Audit Event Details</h3>
                  <p className="text-xs text-slate-400">ID: {selectedEvent.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 text-xl font-bold leading-none"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              
              {/* Event Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Timestamp</span>
                  <div className="text-xs font-semibold text-slate-100 mt-0.5">
                    {format(selectedEvent.timestamp, 'dd MMM yyyy, HH:mm:ss')}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Outcome</span>
                  <div className="mt-1">{getOutcomeBadge(selectedEvent.outcome)}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Actor</span>
                  <div className="text-xs font-semibold text-slate-100 mt-0.5 flex items-center gap-1.5">
                    {getActorIcon(selectedEvent.actorType)}
                    {selectedEvent.actor}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">IP Address / Source</span>
                  <div className="text-xs font-mono font-bold text-slate-100 mt-0.5">{selectedEvent.ip}</div>
                </div>
              </div>

              {/* Action / Entity */}
              <div className="p-4 bg-indigo-500/10/40 rounded-xl border border-indigo-500/20/50 space-y-2">
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">Action Performed</span>
                  <span className="text-sm font-bold text-indigo-300">{selectedEvent.action}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">Target Entity</span>
                  <span className="text-xs font-mono bg-indigo-500/15 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30 inline-block font-bold">
                    {selectedEvent.entity}
                  </span>
                </div>
              </div>

              {/* Details Description */}
              {selectedEvent.details && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Outcome Details & Logs</span>
                  <div className="text-sm text-slate-300 leading-relaxed bg-white border border-white/10 p-4 rounded-xl font-medium shadow-sm">
                    {selectedEvent.details}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white/5 border-t flex items-center justify-end">
              <Button 
                onClick={() => setSelectedEvent(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6"
              >
                Close Details
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Export Signed Log Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 border-0">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-white/5 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-400" />
                Generate Signed Audit Log
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsExportModalOpen(false)} className="h-8 w-8 p-0 rounded-full">
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-300">Export Format</label>
                <div className="flex gap-4">
                  <Button 
                    variant={exportFormat === 'PDF' ? 'default' : 'outline'}
                    className={exportFormat === 'PDF' ? 'flex-1 bg-indigo-600 hover:bg-indigo-700 text-white' : 'flex-1'}
                    onClick={() => setExportFormat('PDF')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    PDF Document
                  </Button>
                  <Button 
                    variant={exportFormat === 'CSV' ? 'default' : 'outline'}
                    className={exportFormat === 'CSV' ? 'flex-1 bg-indigo-600 hover:bg-indigo-700 text-white' : 'flex-1'}
                    onClick={() => setExportFormat('CSV')}
                  >
                    <Terminal className="w-4 h-4 mr-2" />
                    CSV Data
                  </Button>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3 font-mono text-sm">
                <div className="flex items-center gap-2 text-slate-100 font-semibold mb-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Cryptographic Metadata Preview
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-x-2 gap-y-1 text-xs text-slate-300">
                  <span className="text-slate-400">Generated:</span>
                  <span>{format(new Date(), 'dd MMM yyyy, HH:mm:ss')}</span>
                  <span className="text-slate-400">Target Entity:</span>
                  <span>{clientId}</span>
                  <span className="text-slate-400">Generated By:</span>
                  <span>Current Authorized User</span>
                  <span className="text-slate-400">Signature:</span>
                  <span className="text-emerald-400 break-all">SHA256:7b42f...a19c (Pending Generation)</span>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11"
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <>
                      <Activity className="w-4 h-4 mr-2 animate-spin" />
                      Generating & Signing...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download Signed {exportFormat}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
