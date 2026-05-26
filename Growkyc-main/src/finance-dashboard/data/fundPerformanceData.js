const SERIES = {
  '1M': [
    { month: 'Jan', fund: 100, benchmark: 100 },
    { month: 'Feb', fund: 101.2, benchmark: 100.4 }
  ],
  '3M': [
    { month: 'Nov', fund: 98, benchmark: 99 },
    { month: 'Dec', fund: 99.5, benchmark: 99.2 },
    { month: 'Jan', fund: 100, benchmark: 100 },
    { month: 'Feb', fund: 101.2, benchmark: 100.4 }
  ],
  '6M': [
    { month: 'Sep', fund: 96, benchmark: 97 },
    { month: 'Oct', fund: 97, benchmark: 97.5 },
    { month: 'Nov', fund: 98, benchmark: 99 },
    { month: 'Dec', fund: 99.5, benchmark: 99.2 },
    { month: 'Jan', fund: 100, benchmark: 100 },
    { month: 'Feb', fund: 101.2, benchmark: 100.4 }
  ],
  '1Y': [
    { month: 'Mar', fund: 92, benchmark: 94 },
    { month: 'Apr', fund: 93, benchmark: 94.5 },
    { month: 'May', fund: 94, benchmark: 95 },
    { month: 'Jun', fund: 94.5, benchmark: 95.2 },
    { month: 'Jul', fund: 95, benchmark: 96 },
    { month: 'Aug', fund: 95.5, benchmark: 96.5 },
    { month: 'Sep', fund: 96, benchmark: 97 },
    { month: 'Oct', fund: 97, benchmark: 97.5 },
    { month: 'Nov', fund: 98, benchmark: 99 },
    { month: 'Dec', fund: 99.5, benchmark: 99.2 },
    { month: 'Jan', fund: 100, benchmark: 100 },
    { month: 'Feb', fund: 101.2, benchmark: 100.4 }
  ],
  All: [
    { month: '2022', fund: 85, benchmark: 88 },
    { month: '2023', fund: 94, benchmark: 95 },
    { month: '2024', fund: 100, benchmark: 99 },
    { month: '2025', fund: 101.2, benchmark: 100.4 }
  ]
};

export const TIME_RANGES = ['1M', '3M', '6M', '1Y', 'All'];

export function getPerformanceSeries(range) {
  return SERIES[range] || SERIES['1Y'];
}

export function getPerformanceMetrics() {
  return {
    irr: 14.8,
    tvpi: 1.32,
    dpi: 0.41,
    rvpi: 0.91
  };
}
