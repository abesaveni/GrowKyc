import React from 'react';
import { ClientKYCDashboard } from '../kyc/ClientKYCDashboard';
import { CaseControlCentre, CaseWorkbench, CaseCreationModal } from '../cases';
import { ClientDetail } from './ClientDetail';

type KYCView = 
  | 'client_detail' 
  | 'client_kyc_dashboard' 
  | 'case_control_centre' 
  | 'case_workbench';

interface KYCRouterProps {
  view: KYCView;
  clientId?: string;
  caseId?: string;
  onNavigate: (view: KYCView, id?: string) => void;
  onBack: () => void;
}

export function KYCRouter({ view, clientId, caseId, onNavigate, onBack }: KYCRouterProps) {
  switch (view) {
    case 'client_kyc_dashboard':
      return <ClientKYCDashboard />;
    
    case 'case_control_centre':
      return <CaseControlCentre />;
    
    case 'case_workbench':
      return <CaseWorkbench />;
    
    case 'client_detail':
      if (!clientId) {
        console.error('ClientDetail requires clientId');
        onBack();
        return null;
      }
      return <ClientDetail clientId={clientId} onBack={onBack} />;
    
    default:
      return null;
  }
}
