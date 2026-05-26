import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { IMFODashboard } from '../app/components/imfo/IMFODashboard';
import { PortfolioManagementPage } from './pages/PortfolioManagementPage';
import { FundPerformancePage } from './pages/FundPerformancePage';
import { InvestorRelationsPage } from './pages/InvestorRelationsPage';
import { DealPipelinePage } from './pages/DealPipelinePage';
import { ComplianceRiskPage } from './pages/ComplianceRiskPage';
import { RegulatoryReportingPage } from './pages/RegulatoryReportingPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { DocumentsPage } from './pages/DocumentsPage';

function FinancePlaceholder({ title, description }) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
      <p className="text-sm text-gray-500 mt-4">This section is coming soon.</p>
    </div>
  );
}

/**
 * React Router routes for the finance / compliance dashboard (under /finance/*).
 */
export function FinanceDashboardRoutes({ onGoToKyc, onNavigate, role = 'fund-manager' }) {
  const dashboardNavigate = (page) => {
    if (onNavigate) onNavigate(page);
  };

  return (
    <Routes>
      <Route path="/finance" element={<Navigate to="/finance/dashboard" replace />} />
      <Route
        path="/finance/dashboard"
        element={<IMFODashboard onNavigate={dashboardNavigate} />}
      />
      <Route path="/finance/portfolio-management" element={<PortfolioManagementPage />} />
      <Route path="/finance/fund-performance" element={<FundPerformancePage />} />
      <Route
        path="/finance/investor-relations"
        element={<InvestorRelationsPage onNavigate={onNavigate} role={role} />}
      />
      <Route path="/finance/deal-pipeline" element={<DealPipelinePage />} />
      <Route
        path="/finance/compliance"
        element={<ComplianceRiskPage onGoToKyc={onGoToKyc} />}
      />
      <Route path="/finance/reporting" element={<RegulatoryReportingPage />} />
      <Route path="/finance/analytics" element={<AnalyticsPage role={role} />} />
      <Route path="/finance/documents" element={<DocumentsPage role={role} />} />
      <Route
        path="/finance/settings"
        element={
          <FinancePlaceholder title="Settings" description="Platform and fund settings" />
        }
      />
      <Route
        path="/finance/investor-onboarding"
        element={
          <FinancePlaceholder
            title="Investor onboarding"
            description="Full onboarding workflows run in the IMFO platform module. This finance dashboard view is a focused demo."
          />
        }
      />
      <Route path="*" element={<Navigate to="/finance/dashboard" replace />} />
    </Routes>
  );
}
