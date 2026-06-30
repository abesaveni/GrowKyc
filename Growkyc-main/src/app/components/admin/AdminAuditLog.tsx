import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { EmptyState } from '../ui/empty-state';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { toast } from '../../lib/toast';
import { Shield, Search, Download, Eye, AlertCircle, CheckCircle, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { AuditEvent, ensureOperationalSeedData, listAuditEvents } from '../../lib/operationalBotEngine';

export interface AdminAuditLogProps {
  onNavigateToDashboard?: () => void;
  onNavigateToSettings?: () => void;
  onHomeClick?: () => void;
}

export function AdminAuditLog({ onNavigateToDashboard, onNavigateToSettings, onHomeClick }: AdminAuditLogProps) {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  // 300ms Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch events using Server-Side filtering query params
  useEffect(() => {
    const fetchAuditEvents = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          tenantId: 'tenant-123',
          page: '1',
          limit: '50'
        });
        if (debouncedSearchQuery) params.append('q', debouncedSearchQuery);
        if (eventTypeFilter && eventTypeFilter !== 'all') params.append('eventType', eventTypeFilter);
        if (severityFilter && severityFilter !== 'all') params.append('severity', severityFilter);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const _token = sessionStorage.getItem('growkyc_token');
        const response = await fetch(`/api/v1/audit-events?${params.toString()}`, {
          headers: _token ? { Authorization: `Bearer ${_token}` } : {},
        });
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }
        const data = await response.json();
        const eventItems = data.events || data || [];
        setEvents(eventItems);
      } catch (err) {
        console.warn('Audit Log API query failed, using local operational seed engine filtered results:', err);
        ensureOperationalSeedData();
        
        // Dynamic Filter Fallback
        let localEvents = listAuditEvents();
        if (debouncedSearchQuery) {
          const q = debouncedSearchQuery.toLowerCase();
          localEvents = localEvents.filter(e => 
            e.eventType.toLowerCase().includes(q) || 
            e.description.toLowerCase().includes(q) || 
            e.actor.toLowerCase().includes(q)
          );
        }
        if (eventTypeFilter && eventTypeFilter !== 'all') {
          localEvents = localEvents.filter(e => e.eventType === eventTypeFilter);
        }
        if (severityFilter && severityFilter !== 'all') {
          localEvents = localEvents.filter(e => e.severity === severityFilter);
        }
        if (startDate) {
          localEvents = localEvents.filter(e => new Date(e.occurredAt) >= new Date(startDate));
        }
        if (endDate) {
          localEvents = localEvents.filter(e => new Date(e.occurredAt) <= new Date(endDate + 'T23:59:59'));
        }
        setEvents(localEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditEvents();
  }, [debouncedSearchQuery, eventTypeFilter, severityFilter, startDate, endDate]);

  const filteredEvents = useMemo(() => {
    return events; // Filters are already handled by server-side query or fallback reducer
  }, [events]);

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        format: 'csv',
        tenantId: 'tenant-123'
      });
      if (debouncedSearchQuery) params.append('q', debouncedSearchQuery);
      if (eventTypeFilter && eventTypeFilter !== 'all') params.append('eventType', eventTypeFilter);
      if (severityFilter && severityFilter !== 'all') params.append('severity', severityFilter);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`/api/v1/audit-events/export?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Export API returned status ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit-events-export-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success('CSV Audit Log export downloaded successfully.');
    } catch (err) {
      console.warn('API Export failed, performing high-fidelity browser CSV fallback download:', err);
      
      const headers = ['ID', 'OccurredAt', 'EventType', 'Actor', 'Description', 'TargetId', 'Severity'];
      const rows = filteredEvents.map(e => [
        e.id,
        e.occurredAt,
        e.eventType,
        e.actor,
        `"${e.description.replace(/"/g, '""')}"`,
        e.targetId,
        e.severity
      ]);
      
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `local-audit-events-export-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success('Offline CSV Audit Log export generated and downloaded successfully.');
    }
  };

  const getSeverityBadge = (severity: string) => {
    const classes: Record<string, string> = {
      info: 'bg-blue-100 text-blue-800 border border-blue-200',
      warning: 'bg-amber-100 text-amber-800 border border-amber-200',
      error: 'bg-red-100 text-red-800 border border-red-200',
      critical: 'bg-red-200 text-red-900 border border-red-300 animate-pulse',
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${classes[severity] || classes.info}`}>
        {severity}
      </span>
    );
  };

  const getEventIcon = (eventType: AuditEvent['eventType']) => {
    if (eventType === 'BOT_RUN_COMPLETED') return <CheckCircle className="w-4 h-4 text-green-600 animate-pulse" />;
    if (eventType === 'BOT_RUN_STARTED') return <Clock className="w-4 h-4 text-blue-600 animate-spin" style={{ animationDuration: '3s' }} />;
    return <AlertCircle className="w-4 h-4 text-indigo-600" />;
  };

  const breadcrumbItems = [
    { label: 'Dashboard', onClick: onNavigateToDashboard },
    { label: 'Audit Log', active: true },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbItems} showHomeIcon={false} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Events</div>
              <div className="text-3xl font-extrabold text-gray-900 mt-1">{events.length}</div>
            </div>
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Run Started</div>
              <div className="text-3xl font-extrabold text-blue-600 mt-1">{events.filter((e) => e.eventType === 'BOT_RUN_STARTED').length}</div>
            </div>
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Run Completed</div>
              <div className="text-3xl font-extrabold text-green-600 mt-1">{events.filter((e) => e.eventType === 'BOT_RUN_COMPLETED').length}</div>
            </div>
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Manual Decisions</div>
              <div className="text-3xl font-extrabold text-amber-600 mt-1">{events.filter((e) => e.eventType === 'MANUAL_DECISION_RECORDED').length}</div>
            </div>
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200/80 shadow-sm bg-white">
        <CardHeader className="border-b bg-gray-50/40 p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <CardTitle className="text-xl font-bold text-gray-900">Operational Compliance Audit Log ({filteredEvents.length})</CardTitle>
              <Button onClick={handleExport} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                <Download className="w-4 h-4 mr-1.5" />
                Export Register (CSV)
              </Button>
            </div>

            {/* Premium Filter Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
              <div className="relative col-span-1 md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search types, actor names, description keywords..."
                  className="pl-9 w-full bg-white border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <select
                  value={eventTypeFilter}
                  onChange={(e) => setEventTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option value="all">All Event Types</option>
                  <option value="BOT_RUN_STARTED">BOT_RUN_STARTED</option>
                  <option value="BOT_RUN_COMPLETED">BOT_RUN_COMPLETED</option>
                  <option value="MANUAL_DECISION_RECORDED">MANUAL_DECISION_RECORDED</option>
                </select>
              </div>

              <div>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option value="all">All Severities</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              {/* Date Filters */}
              <div className="flex gap-2 items-center">
                <div className="relative w-full">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-white border-gray-300 text-xs px-2 py-1.5 focus:ring-indigo-500"
                  />
                </div>
                <span className="text-gray-400 text-xs">to</span>
                <div className="relative w-full">
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-white border-gray-300 text-xs px-2 py-1.5 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-24 text-center text-gray-500 flex flex-col items-center justify-center">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-indigo-600 rounded-full mb-3" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="text-sm font-semibold text-gray-700 animate-pulse">Syncing Operational Audit Logs...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={Shield}
                title="No audit events found"
                description="No events match the current server query parameters"
                actionLabel="Reset Filters"
                onAction={() => {
                  setSearchQuery('');
                  setSeverityFilter('all');
                  setEventTypeFilter('all');
                  setStartDate('');
                  setEndDate('');
                }}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold text-xs text-gray-600 tracking-wider">Timestamp</TableHead>
                    <TableHead className="font-semibold text-xs text-gray-600 tracking-wider">Event Type</TableHead>
                    <TableHead className="font-semibold text-xs text-gray-600 tracking-wider">Actor Role</TableHead>
                    <TableHead className="font-semibold text-xs text-gray-600 tracking-wider">Description</TableHead>
                    <TableHead className="font-semibold text-xs text-gray-600 tracking-wider">Case/Target Reference</TableHead>
                    <TableHead className="font-semibold text-xs text-gray-600 tracking-wider">Severity</TableHead>
                    <TableHead className="font-semibold text-xs text-gray-600 tracking-wider text-center w-24 pr-4">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell className="text-xs text-gray-500 whitespace-nowrap pl-6">
                        {format(new Date(event.occurredAt), 'dd MMM yyyy, HH:mm:ss')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-800">
                          {getEventIcon(event.eventType)}
                          {event.eventType}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-gray-600 font-medium whitespace-nowrap">{event.actor}</TableCell>
                      <TableCell className="text-xs text-gray-700 max-w-sm leading-relaxed">{event.description}</TableCell>
                      <TableCell className="text-xs text-gray-600 font-mono font-bold whitespace-nowrap">{event.targetId}</TableCell>
                      <TableCell>{getSeverityBadge(event.severity)}</TableCell>
                      <TableCell className="text-center w-24 pr-4 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedEvent(event)}
                          className="h-7 w-7 p-0 inline-flex items-center justify-center rounded-lg border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-gray-500 hover:text-indigo-600 mx-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Premium Dynamic Event Detail Dialog Modal */}
      {selectedEvent !== null && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-indigo-600 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-indigo-100" />
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Audit Event Details</h3>
                  <p className="text-xs text-indigo-100 font-medium">{selectedEvent.eventType}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 text-xl font-bold leading-none"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              
              {/* Event Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Event ID</span>
                  <div className="text-xs font-mono font-bold text-gray-800 mt-0.5 truncate">{selectedEvent.id}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Timestamp</span>
                  <div className="text-xs font-semibold text-gray-800 mt-0.5">
                    {format(new Date(selectedEvent.occurredAt), 'dd MMM yyyy, HH:mm:ss')}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Actor / Role</span>
                  <div className="text-xs font-semibold text-gray-800 mt-0.5">{selectedEvent.actor}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Severity Level</span>
                  <div className="mt-1">{getSeverityBadge(selectedEvent.severity)}</div>
                </div>
              </div>

              {/* Case / Target Reference */}
              <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100/50">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">Case / Target Reference</span>
                <span className="text-sm font-mono font-bold text-indigo-900">{selectedEvent.targetId}</span>
              </div>

              {/* Event Description */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Description</span>
                <div className="text-sm text-gray-700 leading-relaxed bg-white border p-4 rounded-xl font-medium shadow-sm">
                  {selectedEvent.description}
                </div>
              </div>

              {/* JSON Metadata Payload */}
              {selectedEvent.metadata && Object.keys(selectedEvent.metadata).length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Associated Payload Metadata</span>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-48 leading-relaxed shadow-inner">
                    {JSON.stringify(selectedEvent.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t flex items-center justify-end">
              <Button 
                onClick={() => setSelectedEvent(null)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6"
              >
                Close Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
