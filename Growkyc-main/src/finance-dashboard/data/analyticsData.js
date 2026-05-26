export function getDeploymentRateSeries(range = 'all') {
  const full = [
    { quarter: 'Q1 23', rate: 12 },
    { quarter: 'Q2 23', rate: 15 },
    { quarter: 'Q3 23', rate: 17 },
    { quarter: 'Q4 23', rate: 20 },
    { quarter: 'Q1 24', rate: 18 },
    { quarter: 'Q2 24', rate: 22 },
    { quarter: 'Q3 24', rate: 28 },
    { quarter: 'Q4 24', rate: 31 },
    { quarter: 'Q1 25', rate: 35 },
    { quarter: 'Q2 25', rate: 38 }
  ];
  if (range === '1y') return full.slice(-4);
  if (range === '2y') return full.slice(-8);
  return full;
}

export function getSectorAllocation() {
  return [
    { name: 'Real estate', value: 42 },
    { name: 'Private credit', value: 28 },
    { name: 'Infrastructure', value: 18 },
    { name: 'Equity', value: 12 }
  ];
}

export function getVintageYearData(range = 'all') {
  const full = [
    { year: '2018', deployed: 8, count: 2 },
    { year: '2019', deployed: 12, count: 3 },
    { year: '2020', deployed: 18, count: 4 },
    { year: '2021', deployed: 24, count: 5 },
    { year: '2022', deployed: 31, count: 6 },
    { year: '2023', deployed: 28, count: 5 },
    { year: '2024', deployed: 35, count: 7 },
    { year: '2025', deployed: 22, count: 4 }
  ];
  if (range === '1y') return full.slice(-2);
  if (range === '2y') return full.slice(-4);
  return full;
}

export function computeAnalyticsSummary(deployment, sectors, vintage) {
  const rates = deployment.map((d) => d.rate);
  const avgRate = rates.length ? rates.reduce((a, b) => a + b, 0) / rates.length : 0;
  const topSector = sectors.length
    ? [...sectors].sort((a, b) => b.value - a.value)[0]
    : { name: '—', value: 0 };
  const totalDeployed = vintage.reduce((s, v) => s + v.deployed, 0);
  const totalDeals = vintage.reduce((s, v) => s + v.count, 0);
  const latestRate = rates.length ? rates[rates.length - 1] : 0;
  const priorRate = rates.length > 1 ? rates[rates.length - 2] : latestRate;
  const rateDelta = latestRate - priorRate;

  return {
    avgDeploymentPct: Math.round(avgRate * 10) / 10,
    topSectorName: topSector.name,
    topSectorPct: topSector.value,
    totalDeployedM: totalDeployed,
    totalDeals,
    latestRate,
    rateDelta
  };
}
