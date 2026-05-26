export const RISK_MATRIX = [
  { id: 'r1', likelihood: 'Low', impact: 'Low', count: 12, level: 'low' },
  { id: 'r2', likelihood: 'Low', impact: 'Medium', count: 5, level: 'medium' },
  { id: 'r3', likelihood: 'Low', impact: 'High', count: 1, level: 'medium' },
  { id: 'r4', likelihood: 'Medium', impact: 'Low', count: 8, level: 'low' },
  { id: 'r5', likelihood: 'Medium', impact: 'Medium', count: 6, level: 'medium' },
  { id: 'r6', likelihood: 'Medium', impact: 'High', count: 3, level: 'high' },
  { id: 'r7', likelihood: 'High', impact: 'Low', count: 2, level: 'medium' },
  { id: 'r8', likelihood: 'High', impact: 'Medium', count: 4, level: 'high' },
  { id: 'r9', likelihood: 'High', impact: 'High', count: 2, level: 'critical' }
];

export function getComplianceObligations() {
  return [
    { id: 'O-001', name: 'AML/CTF annual compliance report', dueDate: '2026-04-30', status: 'in-progress' },
    { id: 'O-002', name: 'AFSL financial statement lodgement', dueDate: '2026-05-15', status: 'pending' },
    { id: 'O-003', name: 'Trustee quarterly attestation', dueDate: '2026-03-31', status: 'overdue' },
    { id: 'O-004', name: 'Privacy policy review', dueDate: '2026-06-01', status: 'completed' },
    { id: 'O-005', name: 'Conflicts register update', dueDate: '2026-04-10', status: 'in-progress' },
    { id: 'O-006', name: 'PEP/sanctions rescreening cycle', dueDate: '2026-03-25', status: 'pending' }
  ];
}
