import React from 'react';

interface FinanceDashboardRoutesProps {
  onGoToKyc?: () => void;
  onNavigate?: (page: string) => void;
  role?: 'fund-manager' | 'investment-analyst' | 'compliance-officer' | 'admin';
}

export declare function FinanceDashboardRoutes(props: FinanceDashboardRoutesProps): React.JSX.Element;
