export const ASSET_TYPES = [
  { value: 'all', label: 'All types' },
  { value: 'real-estate', label: 'Real estate' },
  { value: 'private-credit', label: 'Private credit' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'equity', label: 'Equity' }
];

export const ASSET_STATUSES = [
  { value: 'all', label: 'All statuses' },
  { value: 'performing', label: 'Performing' },
  { value: 'watch', label: 'Watch' },
  { value: 'distressed', label: 'Distressed' },
  { value: 'exited', label: 'Exited' }
];

export function getPortfolioAssets() {
  return [
    { id: 'A-001', name: 'Sydney CBD Office Tower', type: 'real-estate', investedValue: 42000000, currentValue: 44500000, ltv: 62, status: 'performing' },
    { id: 'A-002', name: 'Melbourne Logistics Park', type: 'real-estate', investedValue: 28500000, currentValue: 27800000, ltv: 71, status: 'watch' },
    { id: 'A-003', name: 'Brisbane Senior Debt Fund II', type: 'private-credit', investedValue: 15000000, currentValue: 15240000, ltv: 58, status: 'performing' },
    { id: 'A-004', name: 'Renewable Energy SPV', type: 'infrastructure', investedValue: 22000000, currentValue: 23100000, ltv: 55, status: 'performing' },
    { id: 'A-005', name: 'Perth Retail Precinct', type: 'real-estate', investedValue: 12000000, currentValue: 9800000, ltv: 82, status: 'distressed' },
    { id: 'A-006', name: 'Growth Equity Co-Invest', type: 'equity', investedValue: 8500000, currentValue: 11200000, ltv: 0, status: 'performing' },
    { id: 'A-007', name: 'Adelaide Industrial Estate', type: 'real-estate', investedValue: 18000000, currentValue: 19200000, ltv: 64, status: 'performing' },
    { id: 'A-008', name: 'SME Lending Warehouse', type: 'private-credit', investedValue: 9500000, currentValue: 9400000, ltv: 68, status: 'exited' }
  ];
}

export function computePortfolioSummary(assets) {
  const totalAum = assets.reduce((s, a) => s + a.currentValue, 0);
  const totalInvested = assets.reduce((s, a) => s + a.investedValue, 0);
  const withLtv = assets.filter((a) => a.ltv > 0);
  const avgLtv = withLtv.length
    ? withLtv.reduce((s, a) => s + a.ltv, 0) / withLtv.length
    : 0;
  return {
    totalAum,
    totalAssets: assets.length,
    averageLtv: avgLtv,
    totalInvested
  };
}
