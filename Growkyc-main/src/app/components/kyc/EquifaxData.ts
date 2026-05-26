
export interface EquifaxScorePoint {
  date: string;
  score: number;
}

export interface EquifaxData {
  currentScore: number;
  maxScore: number;
  riskBand: 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Excellent';
  scoreHistory: EquifaxScorePoint[];
  lastUpdated: string;
  provider: 'Equifax';
}

export const EQUIFAX_MOCK_DATA: Record<string, EquifaxData> = {
  'client-001': {
    currentScore: 842,
    maxScore: 1200,
    riskBand: 'Very Good',
    scoreHistory: [
      { date: '2024-04', score: 710 }, { date: '2024-05', score: 715 }, { date: '2024-06', score: 720 },
      { date: '2024-07', score: 735 }, { date: '2024-08', score: 730 }, { date: '2024-09', score: 740 },
      { date: '2024-10', score: 755 }, { date: '2024-11', score: 750 }, { date: '2024-12', score: 765 },
      { date: '2025-01', score: 770 }, { date: '2025-02', score: 775 }, { date: '2025-03', score: 780 },
      { date: '2025-04', score: 785 }, { date: '2025-05', score: 790 }, { date: '2025-06', score: 795 },
      { date: '2025-07', score: 805 }, { date: '2025-08', score: 810 }, { date: '2025-09', score: 800 },
      { date: '2025-10', score: 780 }, { date: '2025-11', score: 795 }, { date: '2025-12', score: 810 },
      { date: '2026-01', score: 805 }, { date: '2026-02', score: 825 }, { date: '2026-03', score: 842 },
    ],
    lastUpdated: '2026-03-21',
    provider: 'Equifax',
  },
  'client-002': {
    currentScore: 915,
    maxScore: 1200,
    riskBand: 'Excellent',
    scoreHistory: [
      { date: '2024-04', score: 850 }, { date: '2024-05', score: 855 }, { date: '2024-06', score: 860 },
      { date: '2024-07', score: 865 }, { date: '2024-08', score: 870 }, { date: '2024-09', score: 875 },
      { date: '2024-10', score: 880 }, { date: '2024-11', score: 885 }, { date: '2024-12', score: 890 },
      { date: '2025-01', score: 895 }, { date: '2025-02', score: 900 }, { date: '2025-03', score: 905 },
      { date: '2025-04', score: 910 }, { date: '2025-05', score: 915 }, { date: '2025-06', score: 920 },
      { date: '2025-07', score: 918 }, { date: '2025-08', score: 915 }, { date: '2025-09', score: 912 },
      { date: '2025-10', score: 890 }, { date: '2025-11', score: 900 }, { date: '2025-12', score: 905 },
      { date: '2026-01', score: 910 }, { date: '2026-02', score: 912 }, { date: '2026-03', score: 915 },
    ],
    lastUpdated: '2026-03-20',
    provider: 'Equifax',
  },
  'client-003': {
    currentScore: 620,
    maxScore: 1200,
    riskBand: 'Fair',
    scoreHistory: [
      { date: '2024-04', score: 680 }, { date: '2024-05', score: 675 }, { date: '2024-06', score: 670 },
      { date: '2024-07', score: 665 }, { date: '2024-08', score: 660 }, { date: '2024-09', score: 655 },
      { date: '2024-10', score: 650 }, { date: '2024-11', score: 655 }, { date: '2024-12', score: 660 },
      { date: '2025-01', score: 665 }, { date: '2025-02', score: 670 }, { date: '2025-03', score: 675 },
      { date: '2025-04', score: 680 }, { date: '2025-05', score: 670 }, { date: '2025-06', score: 660 },
      { date: '2025-07', score: 655 }, { date: '2025-08', score: 650 }, { date: '2025-09', score: 645 },
      { date: '2025-10', score: 650 }, { date: '2025-11', score: 640 }, { date: '2025-12', score: 630 },
      { date: '2026-01', score: 625 }, { date: '2026-02', score: 615 }, { date: '2026-03', score: 620 },
    ],
    lastUpdated: '2026-03-21',
    provider: 'Equifax',
  },
  'client-004': {
    currentScore: 450,
    maxScore: 1200,
    riskBand: 'Poor',
    scoreHistory: [
      { date: '2024-04', score: 550 }, { date: '2024-05', score: 540 }, { date: '2024-06', score: 530 },
      { date: '2024-07', score: 520 }, { date: '2024-08', score: 510 }, { date: '2024-09', score: 500 },
      { date: '2024-10', score: 490 }, { date: '2024-11', score: 480 }, { date: '2024-12', score: 470 },
      { date: '2025-01', score: 460 }, { date: '2025-02', score: 455 }, { date: '2025-03', score: 450 },
      { date: '2025-04', score: 460 }, { date: '2025-05', score: 470 }, { date: '2025-06', score: 480 },
      { date: '2025-07', score: 490 }, { date: '2025-08', score: 500 }, { date: '2025-09', score: 510 },
      { date: '2025-10', score: 520 }, { date: '2025-11', score: 500 }, { date: '2025-12', score: 480 },
      { date: '2026-01', score: 470 }, { date: '2026-02', score: 460 }, { date: '2026-03', score: 450 },
    ],

    lastUpdated: '2026-03-21',
    provider: 'Equifax',
  },
};
