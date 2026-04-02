import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { EmptyState } from '../ui/empty-state';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { toast } from '../../lib/toast';
import { Shield, Search, Download, Eye, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { AuditEvent, ensureOperationalSeedData, listAuditEvents } from '../../lib/operationalBotEngine';

export function AdminAuditLog() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');

  useEffect(() => {
    ensureOperationalSeedData();
    setEvents(listAuditEvents());
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        event.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.actor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSeverity = severityFilter === 'all' || event.severity === severityFilter;
      return matchesSearch && matchesSeverity;
    });
  }, [events, searchQuery, severityFilter]);

  const handleExport = () => {
    toast.success(`Audit export prepared: ${filteredEvents.length} events`);
  };

  const getSeverityBadge = (severity: string) => {
    const classes: Record<string, string> = {
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-amber-100 text-amber-800',
      error: 'bg-red-100 text-red-800',
      critical: 'bg-red-200 text-red-900',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${classes[severity] || classes.info}`}>
        {severity}
      </span>
    );
  };

  const getEventIcon = (eventType: AuditEvent['eventType']) => {
    if (eventType === 'BOT_RUN_COMPLETED') return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (eventType === 'BOT_RUN_STARTED') return <Clock className="w-4 h-4 text-blue-600" />;
    return <AlertCircle className="w-4 h-4 text-amber-600" />;
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '#' },
    { label: 'Admin', href: '#' },
    { label: 'Audit Log' },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-gray-600">Total Events</div>
            <div className="text-3xl font-semibold">{events.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-gray-600">Run Started</div>
            <div className="text-3xl font-semibold">{events.filter((e) => e.eventType === 'BOT_RUN_STARTED').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-gray-600">Run Completed</div>
            <div className="text-3xl font-semibold">{events.filter((e) => e.eventType === 'BOT_RUN_COMPLETED').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-gray-600">Manual Decisions</div>
            <div className="text-3xl font-semibold">{events.filter((e) => e.eventType === 'MANUAL_DECISION_RECORDED').length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Operational Audit Log ({filteredEvents.length})</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search audit events..."
                  className="pl-9 w-72"
                />
              </div>

              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Severities</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="critical">Critical</option>
              </select>

              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredEvents.length === 0 ? (
            <EmptyState
              icon={Shield}
              title="No audit events found"
              description="No events match the current filters"
              action={{ label: 'Reset Filters', onClick: () => { setSearchQuery(''); setSeverityFilter('all'); } }}
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="text-sm">{format(new Date(event.occurredAt), 'dd MMM, HH:mm:ss')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm font-medium">
                          {getEventIcon(event.eventType)}
                          {event.eventType}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{event.actor}</TableCell>
                      <TableCell className="text-sm text-gray-700 max-w-md">{event.description}</TableCell>
                      <TableCell className="text-xs text-gray-600 font-mono">{event.targetId}</TableCell>
                      <TableCell>{getSeverityBadge(event.severity)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info(`${event.eventType}: ${event.description}`)}
                        >
                          <Eye className="w-4 h-4" />
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
    </div>
  );
}
