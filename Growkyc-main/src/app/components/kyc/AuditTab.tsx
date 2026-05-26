import React, { useState } from 'react';
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
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '../../lib/toast';

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

const mockEvents: AuditEvent[] = [
  {
    id: 'evt-001',
    actor: 'Michael Chen',
    actorType: 'User',
    action: 'Document Uploaded',
    entity: 'Passport_Scan.pdf',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
    ip: '10.0.4.52',
    outcome: 'Success',
    details: 'File size: 2.4MB, Malware scan: Passed'
  },
  {
    id: 'evt-002',
    actor: 'Risk Engine v2.1',
    actorType: 'System',
    action: 'Automated Risk Assessment',
    entity: 'Client Risk Profile',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    ip: 'internal',
    outcome: 'Warning',
    details: 'Elevated risk detected due to complex ownership structure'
  },
  {
    id: 'evt-003',
    actor: 'Sarah Jenkins',
    actorType: 'User',
    action: 'Approval Attempt',
    entity: 'L2 KYC Checker',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    ip: '192.168.1.104',
    outcome: 'Denied',
    details: 'Blocked by SoD controls. Maker cannot be Checker.'
  },
  {
    id: 'evt-004',
    actor: 'Screening API',
    actorType: 'API',
    action: 'Sanctions Sync',
    entity: 'WorldCheck DB',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    ip: 'api.screening.net',
    outcome: 'Success',
    details: '0 new matches found for active entities.'
  },
  {
    id: 'evt-005',
    actor: 'Unknown Origin',
    actorType: 'API',
    action: 'Unauthorized Access Attempt',
    entity: 'Client Records',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    ip: '45.22.11.9',
    outcome: 'Failed',
    details: 'Invalid token signature rejected at gateway.'
  },
  {
    id: 'evt-006',
    actor: 'Tom Anderson',
    actorType: 'User',
    action: 'Exported Data',
    entity: 'Audit Trail PDF',
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
    ip: '10.0.4.18',
    outcome: 'Success',
    details: 'Exported 500 rows. Request ID: REQ-8821'
  }
];

export function AuditTab({ clientId }: { clientId: string }) {
  const [events] = useState<AuditEvent[]>(mockEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('all');
  const [actorTypeFilter, setActorTypeFilter] = useState('all');

  // Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'PDF' | 'CSV'>('PDF');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate generation and cryptographic signing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
    setIsExportModalOpen(false);
    toast.success(`Signed Audit Log exported as ${exportFormat}`, {
      description: 'The cryptographic signature has been attached to the file metadata.'
    });
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
      case 'User': return <User className="w-4 h-4 text-blue-600" />;
      case 'System': return <MonitorSmartphone className="w-4 h-4 text-purple-600" />;
      case 'API': return <Globe className="w-4 h-4 text-emerald-600" />;
    }
  };

  const getOutcomeBadge = (outcome: AuditEvent['outcome']) => {
    switch (outcome) {
      case 'Success':
        return <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-green-100 text-green-800"><CheckCircle className="w-3 h-3"/> Success</span>;
      case 'Failed':
        return <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-red-100 text-red-800"><XCircle className="w-3 h-3"/> Failed</span>;
      case 'Denied':
        return <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-red-100 text-red-900 border border-red-300"><Shield className="w-3 h-3"/> Denied</span>;
      case 'Warning':
        return <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-800"><AlertCircle className="w-3 h-3"/> Warning</span>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
              <Terminal className="w-6 h-6 text-slate-600" />
              Comprehensive Audit Trail
            </CardTitle>
            <Button variant="outline" className="bg-white hover:bg-slate-100" onClick={() => setIsExportModalOpen(true)}>
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
              <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold">Timestamp</th>
                  <th className="px-6 py-4 font-semibold">Actor & IP</th>
                  <th className="px-6 py-4 font-semibold">Action & Entity</th>
                  <th className="px-6 py-4 font-semibold">Outcome & Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No audit events match your current filters.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900">{format(evt.timestamp, 'dd MMM yyyy')}</span>
                          <span className="text-xs text-slate-500">{format(evt.timestamp, 'HH:mm:ss')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            {getActorIcon(evt.actorType)}
                            <span className="font-semibold text-slate-900">{evt.actor}</span>
                          </div>
                          <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            {evt.ip}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-slate-800">{evt.action}</span>
                          <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md inline-block w-max border">
                            {evt.entity}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2 items-start">
                          {getOutcomeBadge(evt.outcome)}
                          {evt.details && (
                            <span className="text-xs text-slate-500 leading-tight">
                              {evt.details}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Export Signed Log Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 border-0">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-600" />
                Generate Signed Audit Log
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsExportModalOpen(false)} className="h-8 w-8 p-0 rounded-full">
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Export Format</label>
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

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3 font-mono text-sm">
                <div className="flex items-center gap-2 text-slate-800 font-semibold mb-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  Cryptographic Metadata Preview
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-x-2 gap-y-1 text-xs text-slate-600">
                  <span className="text-slate-400">Generated:</span>
                  <span>{format(new Date(), 'dd MMM yyyy, HH:mm:ss')}</span>
                  <span className="text-slate-400">Target Entity:</span>
                  <span>{clientId}</span>
                  <span className="text-slate-400">Generated By:</span>
                  <span>Current Authorized User</span>
                  <span className="text-slate-400">Signature:</span>
                  <span className="text-emerald-600 break-all">SHA256:7b42f...a19c (Pending Generation)</span>
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
