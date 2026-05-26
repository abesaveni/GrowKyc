export const PIPELINE_STAGES = [
  'Origination',
  'Due Diligence',
  'Credit Approval',
  'Documentation',
  'Funded'
];

export function getInitialDeals() {
  return [
    { id: 'deal-1', stage: 'Origination', name: 'Gold Coast Mixed-Use', amount: 18500000, borrower: 'Coastal Dev Group', closeDate: '2026-06-30' },
    { id: 'deal-2', stage: 'Origination', name: 'Canberra Office Refi', amount: 9200000, borrower: 'Capital Holdings Ltd', closeDate: '2026-05-15' },
    { id: 'deal-3', stage: 'Due Diligence', name: 'Hobart Hotel Acquisition', amount: 24000000, borrower: 'Tasman Hospitality', closeDate: '2026-07-20' },
    { id: 'deal-4', stage: 'Due Diligence', name: 'SME Warehouse Facility', amount: 5500000, borrower: 'Trade Finance Co', closeDate: '2026-04-28' },
    { id: 'deal-5', stage: 'Credit Approval', name: 'Perth Industrial Park', amount: 14200000, borrower: 'West Logistics REIT', closeDate: '2026-05-10' },
    { id: 'deal-6', stage: 'Documentation', name: 'Sydney Suburban Retail', amount: 11800000, borrower: 'Metro Retail Pty Ltd', closeDate: '2026-04-05' },
    { id: 'deal-7', stage: 'Funded', name: 'Melbourne Build-to-Rent', amount: 31000000, borrower: 'Urban Living SPV', closeDate: '2026-03-01' },
    { id: 'deal-8', stage: 'Funded', name: 'Brisbane Senior Loan', amount: 8700000, borrower: 'Queensland Property Co', closeDate: '2026-02-18' }
  ];
}
