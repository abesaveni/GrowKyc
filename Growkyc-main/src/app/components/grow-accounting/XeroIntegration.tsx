import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  AlertCircle,
  ExternalLink,
  Link as LinkIcon,
  Unlink,
  Calendar,
  Building2,
  FileText,
  TrendingUp,
  Clock
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';
import { toast } from 'sonner';

interface XeroIntegrationProps {
  onNavigate?: (page: string) => void;
}

interface XeroOrg {
  id: string;
  name: string;
  shortCode: string;
  countryCode: string;
  connected: boolean;
  lastSync: string;
  status: 'connected' | 'disconnected' | 'error';
}

interface SyncHistory {
  id: string;
  timestamp: string;
  type: string;
  status: 'success' | 'failed' | 'partial';
  recordsProcessed: number;
  duration: string;
}

export function XeroIntegration({ onNavigate }: XeroIntegrationProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const organizations: XeroOrg[] = [
    {
      id: 'XO-001',
      name: 'Smith Family Trust',
      shortCode: 'SFT',
      countryCode: 'AU',
      connected: true,
      lastSync: '2024-02-14T10:30:00',
      status: 'connected'
    },
    {
      id: 'XO-002',
      name: 'Jones & Associates Pty Ltd',
      shortCode: 'JAPL',
      countryCode: 'AU',
      connected: true,
      lastSync: '2024-02-14T09:15:00',
      status: 'connected'
    },
    {
      id: 'XO-003',
      name: 'Brown SMSF',
      shortCode: 'BSMSF',
      countryCode: 'AU',
      connected: true,
      lastSync: '2024-02-13T16:45:00',
      status: 'connected'
    }
  ];

  const syncHistory: SyncHistory[] = [
    {
      id: 'SH-001',
      timestamp: '2024-02-14T10:30:00',
      type: 'Full Sync',
      status: 'success',
      recordsProcessed: 1247,
      duration: '2m 15s'
    },
    {
      id: 'SH-002',
      timestamp: '2024-02-14T09:15:00',
      type: 'Full Sync',
      status: 'success',
      recordsProcessed: 892,
      duration: '1m 48s'
    },
    {
      id: 'SH-003',
      timestamp: '2024-02-13T16:45:00',
      type: 'Incremental Sync',
      status: 'success',
      recordsProcessed: 156,
      duration: '32s'
    }
  ];

  const handleConnect = () => {
    setIsConnecting(true);
    // Simulate OAuth flow
    setTimeout(() => {
      setIsConnecting(false);
      toast.success('Xero Connected', {
        description: 'Successfully connected to Xero account'
      });
    }, 2000);
  };

  const handleDisconnect = (orgId: string) => {
    toast.success('Xero Disconnected', {
      description: 'Organization has been disconnected'
    });
  };

  const handleSyncNow = (orgId: string) => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast.success('Sync Complete', {
        description: 'Successfully synced data from Xero'
      });
    }, 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <span className="px-2 py-0.5 bg-green-500/15 text-green-300 text-xs font-semibold rounded flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Connected
        </span>;
      case 'disconnected':
        return <span className="px-2 py-0.5 bg-white/5 text-slate-300 text-xs font-semibold rounded flex items-center gap-1">
          <Unlink className="w-3 h-3" />
          Disconnected
        </span>;
      case 'error':
        return <span className="px-2 py-0.5 bg-red-500/15 text-red-300 text-xs font-semibold rounded flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Error
        </span>;
      default:
        return null;
    }
  };

  const getSyncStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <span className="px-2 py-0.5 bg-green-500/15 text-green-300 text-xs font-semibold rounded">Success</span>;
      case 'failed':
        return <span className="px-2 py-0.5 bg-red-500/15 text-red-300 text-xs font-semibold rounded">Failed</span>;
      case 'partial':
        return <span className="px-2 py-0.5 bg-orange-500/15 text-orange-300 text-xs font-semibold rounded">Partial</span>;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <WorkpaperLayout currentPage="integrations" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => onNavigate?.('integrations')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-slate-100">Xero Integration</h1>
              <p className="text-sm text-slate-300 mt-1">Connect and sync data from Xero organizations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Connect New Organization
                </>
              )}
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => onNavigate?.('xero-mapping')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Configure Mappings
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-white/10 rounded p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/15 rounded flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-300">Connected</p>
                <p className="text-2xl font-semibold text-slate-100">{organizations.filter(o => o.connected).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-white/10 rounded p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/15 rounded flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-300">Last Sync</p>
                <p className="text-lg font-semibold text-slate-100">2 hours ago</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-white/10 rounded p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/15 rounded flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-300">Records Synced</p>
                <p className="text-2xl font-semibold text-slate-100">2,295</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-white/10 rounded p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/15 rounded flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-300">Sync Status</p>
                <p className="text-lg font-semibold text-green-400">All Good</p>
              </div>
            </div>
          </div>
        </div>

        {/* Connected Organizations */}
        <div className="border border-white/10 rounded bg-white overflow-hidden">
          <div className="bg-white/5 border-b border-white/10 px-4 py-2">
            <h3 className="font-semibold text-slate-100">Connected Organizations</h3>
          </div>
          <table className="w-full text-sm border-collapse">
            {/* Header Row */}
            <thead>
              <tr className="bg-white/5">
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300 w-8">ID</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Organization Name</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300 w-24">Code</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300 w-20">Country</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300 w-48">Last Sync</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300 w-32">Status</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300 w-48">Actions</th>
              </tr>
            </thead>

            {/* Data Rows */}
            <tbody>
              {organizations.map((org) => (
                <tr key={org.id} className="hover:bg-white/5">
                  <td className="border border-white/10 px-3 py-2 text-center text-slate-300 font-mono text-xs">
                    {org.id.split('-')[1]}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-slate-100">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      {org.name}
                    </div>
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-slate-300 font-mono text-xs">
                    {org.shortCode}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-center text-slate-300 font-mono text-xs">
                    {org.countryCode}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-slate-300 text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {formatTimestamp(org.lastSync)}
                    </div>
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-center">
                    {getStatusBadge(org.status)}
                  </td>
                  <td className="border border-white/10 px-2 py-2">
                    <div className="flex items-center gap-1 justify-center">
                      <button
                        onClick={() => handleSyncNow(org.id)}
                        disabled={syncing}
                        className="px-2 py-1 text-xs bg-blue-500/15 text-blue-300 hover:bg-blue-500/20 rounded flex items-center gap-1"
                      >
                        <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
                        Sync Now
                      </button>
                      <button
                        onClick={() => onNavigate?.('xero-mapping')}
                        className="px-2 py-1 text-xs bg-white/5 text-slate-300 hover:bg-white/10 rounded flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        Mappings
                      </button>
                      <button
                        onClick={() => handleDisconnect(org.id)}
                        className="px-2 py-1 text-xs bg-red-500/15 text-red-300 hover:bg-red-500/20 rounded flex items-center gap-1"
                      >
                        <Unlink className="w-3 h-3" />
                        Disconnect
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sync History */}
        <div className="border border-white/10 rounded bg-white overflow-hidden">
          <div className="bg-white/5 border-b border-white/10 px-4 py-2">
            <h3 className="font-semibold text-slate-100">Sync History</h3>
          </div>
          <table className="w-full text-sm border-collapse">
            {/* Header Row */}
            <thead>
              <tr className="bg-white/5">
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300 w-8">ID</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Timestamp</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300 w-32">Type</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300 w-32">Records</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300 w-24">Duration</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300 w-24">Status</th>
              </tr>
            </thead>

            {/* Data Rows */}
            <tbody>
              {syncHistory.map((sync) => (
                <tr key={sync.id} className="hover:bg-white/5">
                  <td className="border border-white/10 px-3 py-2 text-center text-slate-300 font-mono text-xs">
                    {sync.id.split('-')[1]}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-slate-300 text-xs">
                    {formatTimestamp(sync.timestamp)}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-slate-300">
                    {sync.type}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-center font-mono text-slate-100">
                    {sync.recordsProcessed.toLocaleString()}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-center font-mono text-slate-300 text-xs">
                    {sync.duration}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-center">
                    {getSyncStatusBadge(sync.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Help Text */}
        <div className="bg-blue-500/10 border border-blue-300 rounded px-4 py-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-300">About Xero Integration</h4>
              <p className="text-sm text-blue-300 mt-1">
                Sync data automatically from Xero organizations into your workpapers. Configure account mappings to control which Xero accounts populate which workpaper line items. Data syncs hourly or can be triggered manually.
              </p>
            </div>
          </div>
        </div>
      </div>
    </WorkpaperLayout>
  );
}
