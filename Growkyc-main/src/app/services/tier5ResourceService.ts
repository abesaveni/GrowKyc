import { delay } from './apiClient';

export type AvailabilityStatus = 'available' | 'busy' | 'away' | 'offline';
export type AssignmentStatus = 'balanced' | 'at-capacity' | 'overloaded' | 'underutilized';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  availability: AvailabilityStatus;
  activeCases: number;
  capacity: number;
  assignmentStatus: AssignmentStatus;
  email: string;
}

let teamMembers: TeamMember[] = [
  { id: 'TM-001', name: 'Sarah Mitchell', role: 'Senior Compliance Manager', availability: 'available', activeCases: 12, capacity: 18, assignmentStatus: 'balanced', email: 'sarah.mitchell@firm.com.au' },
  { id: 'TM-002', name: 'James Chen', role: 'AML Analyst', availability: 'busy', activeCases: 16, capacity: 16, assignmentStatus: 'at-capacity', email: 'james.chen@firm.com.au' },
  { id: 'TM-003', name: 'Emma Wilson', role: 'Compliance Officer', availability: 'available', activeCases: 8, capacity: 14, assignmentStatus: 'underutilized', email: 'emma.wilson@firm.com.au' },
  { id: 'TM-004', name: 'Michael Torres', role: 'EDD Specialist', availability: 'away', activeCases: 10, capacity: 12, assignmentStatus: 'balanced', email: 'michael.torres@firm.com.au' },
  { id: 'TM-005', name: 'Lisa Park', role: 'Quality Assurance Lead', availability: 'available', activeCases: 6, capacity: 10, assignmentStatus: 'underutilized', email: 'lisa.park@firm.com.au' },
  { id: 'TM-006', name: 'David Nguyen', role: 'Junior Analyst', availability: 'busy', activeCases: 14, capacity: 12, assignmentStatus: 'overloaded', email: 'david.nguyen@firm.com.au' },
  { id: 'TM-007', name: 'Rachel Adams', role: 'Partner Reviewer', availability: 'offline', activeCases: 4, capacity: 8, assignmentStatus: 'underutilized', email: 'rachel.adams@firm.com.au' },
  { id: 'TM-008', name: 'Tom Bradley', role: 'Workflow Coordinator', availability: 'available', activeCases: 11, capacity: 15, assignmentStatus: 'balanced', email: 'tom.bradley@firm.com.au' },
  { id: 'TM-009', name: 'Nina Kowalski', role: 'Screening Analyst', availability: 'busy', activeCases: 19, capacity: 16, assignmentStatus: 'overloaded', email: 'nina.k@firm.com.au' },
  { id: 'TM-010', name: 'Chris O’Brien', role: 'Reporting Specialist', availability: 'available', activeCases: 7, capacity: 12, assignmentStatus: 'balanced', email: 'chris.obrien@firm.com.au' }
];

export async function fetchTeamMembers(search?: string, availability?: string): Promise<TeamMember[]> {
  let list = [...teamMembers];
  if (availability && availability !== 'all') {
    list = list.filter((m) => m.availability === availability);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q)
    );
  }
  return delay(list);
}

export async function assignCasesToMember(
  memberId: string,
  caseCount: number
): Promise<TeamMember> {
  const member = teamMembers.find((m) => m.id === memberId);
  if (!member) throw new Error('Team member not found');
  member.activeCases = Math.min(member.capacity + 4, member.activeCases + caseCount);
  if (member.activeCases >= member.capacity) member.assignmentStatus = member.activeCases > member.capacity ? 'overloaded' : 'at-capacity';
  else if (member.activeCases < member.capacity * 0.5) member.assignmentStatus = 'underutilized';
  else member.assignmentStatus = 'balanced';
  return delay({ ...member });
}
