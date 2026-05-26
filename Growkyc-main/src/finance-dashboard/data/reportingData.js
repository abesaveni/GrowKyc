export function getReportTypes() {
  return [
    {
      id: 'asic',
      title: 'ASIC disclosure',
      description: 'Periodic disclosure and regulatory filings for managed investment schemes.',
      lastGenerated: '2026-01-15',
      format: 'PDF / XML'
    },
    {
      id: 'investor',
      title: 'Investor statements',
      description: 'Quarterly investor statements with NAV, distributions, and capital activity.',
      lastGenerated: '2026-02-28',
      format: 'PDF'
    },
    {
      id: 'tax',
      title: 'Tax reports',
      description: 'Annual tax reporting packs including AMIT statements where applicable.',
      lastGenerated: '2025-07-10',
      format: 'PDF / CSV'
    }
  ];
}
