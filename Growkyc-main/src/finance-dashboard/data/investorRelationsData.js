export function getDistributionHistory() {
  return [
    { id: 'D-001', investor: 'Meridian Capital Pty Ltd', date: '2026-02-28', amount: 425000, type: 'Income', status: 'Paid' },
    { id: 'D-002', investor: 'Harbour View Super Fund', date: '2026-02-28', amount: 280000, type: 'Income', status: 'Paid' },
    { id: 'D-003', investor: 'Pacific Growth Trust', date: '2026-01-15', amount: 150000, type: 'Return of capital', status: 'Paid' },
    { id: 'D-004', investor: 'James & Helen Williams', date: '2025-12-20', amount: 95000, type: 'Income', status: 'Paid' },
    { id: 'D-005', investor: 'Southern Cross Family Office', date: '2026-03-10', amount: 310000, type: 'Income', status: 'Scheduled' }
  ];
}

export function getCapitalCallSchedule() {
  return [
    { id: 'CC-001', investor: 'Meridian Capital Pty Ltd', dueDate: '2026-04-15', amount: 750000, fund: 'IMFO Credit Fund III', status: 'Upcoming' },
    { id: 'CC-002', investor: 'Harbour View Super Fund', dueDate: '2026-04-15', amount: 500000, fund: 'IMFO Credit Fund III', status: 'Upcoming' },
    { id: 'CC-003', investor: 'Pacific Growth Trust', dueDate: '2026-03-25', amount: 200000, fund: 'IMFO Property SPV 12', status: 'Issued' },
    { id: 'CC-004', investor: 'Southern Cross Family Office', dueDate: '2026-05-01', amount: 400000, fund: 'IMFO Credit Fund III', status: 'Planned' },
    { id: 'CC-005', investor: 'James & Helen Williams', dueDate: '2026-02-01', amount: 125000, fund: 'IMFO Property SPV 11', status: 'Received' }
  ];
}
