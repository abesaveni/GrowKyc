import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Shield, User, Clock, CheckCircle, AlertTriangle, Activity, Flag, Bell, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from '../../lib/toast';

interface ClientReviewProps {
  clientId?: string;
  role?: string;
}

export function ClientReview({ clientId: propClientId, role: propRole }: ClientReviewProps) {
  const params = useParams();
  const clientId = propClientId || params.clientId;
  const role = propRole || params.role;
  const navigate = useNavigate();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const updateClientStatus = async (status: string) => {
    try {
      const response = await fetch(`/api/clients/${clientId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        console.warn(`API call failed with status ${response.status}. Simulating success for demo purposes.`);
      }
      
      // Simulate network delay for UX
      await new Promise(resolve => setTimeout(resolve, 800));
      return true;
    } catch (error) {
      console.error('Error updating status:', error);
      // Simulate success even on error for the UI demo as requested
      await new Promise(resolve => setTimeout(resolve, 800));
      return true;
    }
  };

  const handleApprove = async () => {
    setLoadingAction('approve');
    await updateClientStatus('approved');
    toast.success('Client Approved', `Client ID: ${clientId} has been successfully verified.`);
    setLoadingAction(null);
    navigate(`/${role}/dashboard`);
  };

  const handleFlag = async () => {
    setLoadingAction('flag');
    await updateClientStatus('investigation');
    toast.warning('Client Flagged', `Client ${clientId} is now under investigation.`);
    setLoadingAction(null);
  };

  const handleRequestInfo = async () => {
    setLoadingAction('info');
    await updateClientStatus('more-info');
    toast.info('Info Requested', `More information has been requested from ${clientId}.`);
    setLoadingAction(null);
  };

  return (
    <div className="p-8">
      <Button 
        variant="outline" 
        onClick={() => navigate(`/${role}/dashboard`)}
        className="mb-6"
      >
        ← Back to Dashboard
      </Button>
      
      <div className="bg-white rounded-xl shadow-lg border-2 border-blue-100 p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Review: {clientId}</h1>
            <p className="text-gray-600">Detailed compliance review and AML/CTF assessment</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <p className="text-sm text-red-700 font-semibold mb-1">Risk Score</p>
              <p className="text-3xl font-bold text-red-700">8.4 / 10</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4">
              <p className="text-sm text-amber-700 font-semibold mb-1">Status</p>
              <p className="text-3xl font-bold text-amber-700">Pending</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <p className="text-sm text-blue-700 font-semibold mb-1">Last Activity</p>
              <p className="text-3xl font-bold text-blue-700">2h ago</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Verification Checkpoints
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Identity Verification (IDV)', status: 'Verified', color: 'text-green-600' },
                { label: 'Sanctions Screening', status: 'Potential Match', color: 'text-red-600' },
                { label: 'PEP Check', status: 'Clear', color: 'text-green-600' },
                { label: 'Adverse Media', status: 'Pending Review', color: 'text-amber-600' }
              ].map((check, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white rounded border">
                  <span className="text-sm font-medium">{check.label}</span>
                  <span className={`text-sm font-bold ${check.color}`}>{check.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleApprove}
              disabled={loadingAction !== null}
            >
              {loadingAction === 'approve' ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Approving...</>
              ) : (
                'Approve Client'
              )}
            </Button>
            <Button 
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={handleFlag}
              disabled={loadingAction !== null}
            >
              {loadingAction === 'flag' ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Flagging...</>
              ) : (
                'Flag for Investigation'
              )}
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleRequestInfo}
              disabled={loadingAction !== null}
            >
              {loadingAction === 'info' ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Requesting...</>
              ) : (
                'Request More Info'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
