import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClientKYCDashboard } from '../kyc/ClientKYCDashboard';

interface KYCClientDetailsProps {
  onBack?: () => void;
  clientId?: string;
}

export function KYCClientDetails({ onBack, clientId: propClientId }: KYCClientDetailsProps) {
  const params = useParams<{ clientId: string; role: string }>();
  const clientId = propClientId || params.clientId;
  const role = params.role;
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(`/${role}/kyc`);
    }
  };

  if (!clientId) {
    return (
      <div className="p-8 text-center text-gray-500">
        No client ID provided.
      </div>
    );
  }

  return (
    <ClientKYCDashboard 
      clientId={clientId}
      onBack={handleBack}
    />
  );
}
