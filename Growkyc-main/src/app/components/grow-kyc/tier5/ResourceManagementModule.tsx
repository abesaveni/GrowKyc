import React, { useEffect, useState } from 'react';
import { ArrowLeft, Search, UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { DataTable, Column } from '../../shared/dashboard/DataTable';
import { PageHeader } from '../../shared/dashboard/PageHeader';
import {
  assignCasesToMember,
  fetchTeamMembers,
  TeamMember,
  AssignmentStatus
} from '../../../services/tier5ResourceService';
import { useAuth } from '../../../../context/AuthContext';

interface ResourceManagementModuleProps {
  onBack: () => void;
}

const AVAILABILITY_STYLES: Record<AvailabilityStatus, string> = {
  available: 'bg-green-500/15 text-green-300',
  busy: 'bg-amber-500/15 text-amber-300',
  away: 'bg-blue-500/15 text-blue-300',
  offline: 'bg-[#0f172a] text-slate-300'
};

const ASSIGNMENT_STYLES: Record<AssignmentStatus, string> = {
  balanced: 'bg-white/5 text-slate-100',
  'at-capacity': 'bg-amber-500/15 text-amber-300',
  overloaded: 'bg-red-500/15 text-red-300',
  underutilized: 'bg-emerald-500/15 text-emerald-300'
};

export function ResourceManagementModule({ onBack }: ResourceManagementModuleProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [availability, setAvailability] = useState('all');
  const [assignTarget, setAssignTarget] = useState<TeamMember | null>(null);
  const [caseCount, setCaseCount] = useState(1);
  const [assigning, setAssigning] = useState(false);
  
  const { user } = useAuth();
  const isPartner = user?.role === 'partner';

  const load = () => {
    setLoading(true);
    fetchTeamMembers(search, availability)
      .then(setMembers)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [search, availability]);

  const handleAssign = async () => {
    if (!assignTarget || caseCount < 1) return;
    setAssigning(true);
    try {
      await assignCasesToMember(assignTarget.id, caseCount);
      toast.success(`Assigned ${caseCount} case(s) to ${assignTarget.name}`);
      setAssignTarget(null);
      setCaseCount(1);
      load();
    } catch {
      toast.error('Assignment failed');
    } finally {
      setAssigning(false);
    }
  };

  const columns: Column<TeamMember>[] = [
    { key: 'name', label: 'Team Member', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    {
      key: 'availability',
      label: 'Availability',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${AVAILABILITY_STYLES[row.availability]}`}>
          {row.availability}
        </span>
      )
    },
    { key: 'activeCases', label: 'Active Cases', sortable: true },
    {
      key: 'capacity',
      label: 'Capacity',
      render: (row) => (
        <div className="min-w-[100px]">
          <div className="flex justify-between text-xs text-slate-300 mb-1">
            <span>{row.activeCases}</span>
            <span>{row.capacity}</span>
          </div>
          <div className="h-2 bg-[#0f172a] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                row.activeCases > row.capacity ? 'bg-red-500' : row.activeCases >= row.capacity * 0.85 ? 'bg-amber-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(100, (row.activeCases / row.capacity) * 100)}%` }}
            />
          </div>
        </div>
      )
    },
    {
      key: 'assignmentStatus',
      label: 'Assignment Status',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ASSIGNMENT_STYLES[row.assignmentStatus]}`}>
          {row.assignmentStatus.replace('-', ' ')}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => setAssignTarget(row)}
          disabled={isPartner}
          className={isPartner ? 'opacity-50 cursor-not-allowed' : ''}
          title={isPartner ? "Managing Partners cannot assign cases." : undefined}
        >
          <UserPlus className="w-4 h-4 mr-1" />
          Assign
        </Button>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="bg-[#1e293b] border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tier 5 Hub
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <Badge className="bg-green-600 text-white mb-1">RESOURCE MGMT</Badge>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Resource & Case Assignment</h1>
              <p className="text-sm text-slate-300">Team capacity, availability, and case load management</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        <PageHeader title="Team workload" description="Monitor availability and assign cases across your compliance team." />

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              placeholder="Search team members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg text-sm"
            />
          </div>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="px-3 py-2 border border-white/10 rounded-lg text-sm"
          >
            <option value="all">All availability</option>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="away">Away</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        <div className="hidden md:grid md:grid-cols-4 gap-4">
          {[
            { label: 'Team members', value: members.length },
            { label: 'Available now', value: members.filter((m) => m.availability === 'available').length },
            { label: 'At capacity', value: members.filter((m) => m.assignmentStatus === 'at-capacity').length },
            { label: 'Overloaded', value: members.filter((m) => m.assignmentStatus === 'overloaded').length }
          ].map((s) => (
            <div key={s.label} className="bg-[#1e293b] border border-white/10 rounded-lg p-4">
              <p className="text-xs text-slate-400">{s.label}</p>
              <p className="text-2xl font-bold text-white">{loading ? '—' : s.value}</p>
            </div>
          ))}
        </div>

        <div className="hidden md:block">
          <DataTable
            columns={columns}
            data={members}
            loading={loading}
            getRowId={(row) => row.id}
            emptyTitle="No team members found"
            emptyDescription="Adjust search or availability filters."
            pageSize={8}
          />
        </div>

        <div className="md:hidden grid gap-4">
          {!loading &&
            members.map((m) => (
              <div key={m.id} className="bg-[#1e293b] border border-white/10 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-white">{m.name}</p>
                    <p className="text-sm text-slate-300">{m.role}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${AVAILABILITY_STYLES[m.availability]}`}>
                    {m.availability}
                  </span>
                </div>
                <p className="text-sm text-slate-300 mb-3">
                  {m.activeCases} / {m.capacity} cases
                </p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className={`w-full ${isPartner ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => setAssignTarget(m)}
                  disabled={isPartner}
                  title={isPartner ? "Managing Partners cannot assign cases." : undefined}
                >
                  Assign cases
                </Button>
              </div>
            ))}
        </div>
      </div>

      {assignTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          onClick={() => !assigning && setAssignTarget(null)}
        >
          <div
            className="bg-[#1e293b] rounded-xl max-w-md w-full p-6 shadow-xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white">Assign cases</h3>
            <p className="text-sm text-slate-300 mt-1">
              {assignTarget.name} — {assignTarget.activeCases} active / {assignTarget.capacity} capacity
            </p>
            <label className="block mt-4 text-sm font-medium text-slate-300">Number of cases to assign</label>
            <input
              type="number"
              min={1}
              max={10}
              value={caseCount}
              onChange={(e) => setCaseCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="mt-1 w-full px-3 py-2 border border-white/10 rounded-lg text-sm"
            />
            <div className="flex gap-2 mt-6">
              <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={handleAssign} disabled={assigning}>
                {assigning ? 'Assigning...' : 'Confirm assignment'}
              </Button>
              <Button variant="outline" onClick={() => setAssignTarget(null)} disabled={assigning}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
