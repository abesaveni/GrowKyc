import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Shield, 
  User, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Activity, 
  Loader2, 
  XCircle,
  Send,
  Info
} from 'lucide-react';
import { toast } from '../../lib/toast';
import { ClientsDB } from '../kyc/ClientsDatabase';

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
  
  // Request More Info Modal States
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [selectedDocs, setSelectedDocs] = useState<Record<string, boolean>>({
    passport: true,
    addressProof: false,
    structureChart: false,
    fundsVerification: false,
    pepDeclaration: false
  });
  
  const [customInstructions, setCustomInstructions] = useState(
    'Please upload certified color copies of the primary identity documentation (Passport or Driver\'s License) to resolve the active screening flag.'
  );

  // Fetch client details dynamically from ClientsDB
  const [client, setClient] = useState(() => {
    const dbClient = ClientsDB.getClients().find(c => 
      c.id === clientId || 
      c.name.toLowerCase() === decodeURIComponent(clientId || '').toLowerCase()
    );
    if (dbClient) return dbClient;
    
    // Fallback Mock Client if not in DB
    return {
      id: clientId || '5',
      name: 'Sarah Williams',
      entityType: 'Individual',
      status: 'Under Review',
      country: 'Australia',
      industry: 'Executive Management',
      riskScores: { overall: 84 },
      quickStatus: { identity: 'Verified', aml: 'PEP Match' },
      amlData: { sanctionsMatches: 0, pepStatus: 'Domestic PEP', adverseMediaHits: 5 }
    };
  });

  // Handle template updates when checkboxes are clicked
  const handleDocCheckboxChange = (key: string, checked: boolean) => {
    const updatedDocs = { ...selectedDocs, [key]: checked };
    setSelectedDocs(updatedDocs);

    // Update instruction text area with preset templates
    let instructionsList: string[] = [];
    if (updatedDocs.passport) instructionsList.push('Certified primary photographic ID (e.g., Passport, National ID card).');
    if (updatedDocs.addressProof) instructionsList.push('Certified proof of residential address issued within the last 3 months.');
    if (updatedDocs.structureChart) instructionsList.push('Signed corporate organization chart showing complete ultimate beneficial ownership mapping down to individuals holding >=25% holdings.');
    if (updatedDocs.fundsVerification) instructionsList.push('Audited financial statement or primary bank account records confirming source of funds.');
    if (updatedDocs.pepDeclaration) instructionsList.push('Completed Politically Exposed Person (PEP) declaration questionnaire.');

    if (instructionsList.length > 0) {
      setCustomInstructions(
        `Please provide the following required documentation to complete your compliance review:\n\n` +
        instructionsList.map((inst, index) => `${index + 1}. ${inst}`).join('\n') +
        `\n\nAll documentation must be certified by an authorized official.`
      );
    } else {
      setCustomInstructions('Please provide the requested supplementary details.');
    }
  };

  // Central log function to match the PersonalizedDashboard localStorage listener
  const logActivity = (actionText: string, iconName: string, color: string) => {
    const saved = localStorage.getItem('growkyc_logged_activities');
    let activities = [];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          activities = parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    
    const activePersona = localStorage.getItem('growkyc_selected_user') || 'sarah_chen';
    const userDisplay = activePersona === 'emma_williams' ? 'Emma Williams' : 'Sarah Chen';

    const newActivity = {
      type: 'review',
      user: userDisplay,
      action: actionText,
      time: 'Just now',
      iconName: iconName,
      color: color
    };

    activities = [newActivity, ...activities];
    localStorage.setItem('growkyc_logged_activities', JSON.stringify(activities));
    
    // Dispatch custom event to notify and refresh components
    window.dispatchEvent(new CustomEvent('growkyc:activity_logged'));
  };

  const updateClientStatusInDB = (newStatus: 'Active' | 'Inactive' | 'Suspended' | 'Under Review') => {
    ClientsDB.updateClient(client.id, {
      status: newStatus
    });
    
    // Refresh local component state
    const dbClient = ClientsDB.getClients().find(c => c.id === clientId);
    if (dbClient) {
      setClient(dbClient);
    } else {
      setClient(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleApprove = async () => {
    setLoadingAction('approve');
    await new Promise(resolve => setTimeout(resolve, 800)); // Network simulation
    
    updateClientStatusInDB('Active');
    logActivity(`approved client ${client.name} following KYC review`, 'CheckCircle', 'text-green-600');
    toast.success('Client Approved', `Client ID: ${client.id} has been successfully verified.`);
    
    setLoadingAction(null);
    navigate(`/${role}/dashboard`);
  };

  const handleFlag = async () => {
    setLoadingAction('flag');
    await new Promise(resolve => setTimeout(resolve, 800)); // Network simulation
    
    updateClientStatusInDB('Suspended');
    logActivity(`flagged client ${client.name} for suspicious AML activity`, 'AlertOctagon', 'text-red-600');
    toast.warning('Client Flagged', `Client ${client.id} is now under investigation.`);
    
    setLoadingAction(null);
    navigate(`/${role}/dashboard`);
  };

  const handleRequestInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction('info');
    setShowInfoModal(false);
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated processing delay

    // Update status in the database to trigger reactivity
    updateClientStatusInDB('Under Review');
    
    // Log the event with the requested items list
    let requestedDocTitles: string[] = [];
    if (selectedDocs.passport) requestedDocTitles.push('Primary Photographic ID');
    if (selectedDocs.addressProof) requestedDocTitles.push('Proof of Address');
    if (selectedDocs.structureChart) requestedDocTitles.push('Ownership Chart');
    if (selectedDocs.fundsVerification) requestedDocTitles.push('Source of Funds');
    if (selectedDocs.pepDeclaration) requestedDocTitles.push('PEP Declaration');

    const docsSummary = requestedDocTitles.join(', ');
    logActivity(`requested more info (${docsSummary}) from client ${client.name}`, 'Clock', 'text-amber-500');
    
    toast.success('Info Requested', `More information has been requested from ${client.id}.`);
    setLoadingAction(null);
  };

  // Map database status string to UI text
  const getStatusText = () => {
    if (client.status === 'Active') return 'Approved';
    if (client.status === 'Suspended') return 'Flagged';
    return 'Pending';
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
            <h1 className="text-3xl font-bold text-gray-900">Review: {client.name}</h1>
            <p className="text-gray-600">Detailed compliance review and AML/CTF assessment</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <p className="text-sm text-red-700 font-semibold mb-1">Risk Score</p>
              <p className="text-3xl font-bold text-red-700">
                {client.riskScores?.overall ? (client.riskScores.overall / 10).toFixed(1) : '8.4'} / 10
              </p>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4">
              <p className="text-sm text-amber-700 font-semibold mb-1">Status</p>
              <p className="text-3xl font-bold text-amber-700">{getStatusText()}</p>
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
                { 
                  label: 'Identity Verification (IDV)', 
                  status: client.quickStatus?.identity || 'Verified', 
                  color: client.quickStatus?.identity === 'Info Requested' ? 'text-amber-600' : 'text-green-600' 
                },
                { 
                  label: 'Sanctions Screening', 
                  status: client.amlData?.sanctionsMatches > 0 ? 'Potential Match' : 'Clear', 
                  color: client.amlData?.sanctionsMatches > 0 ? 'text-red-600' : 'text-green-600' 
                },
                { 
                  label: 'PEP Check', 
                  status: client.amlData?.pepStatus || 'Clear', 
                  color: client.amlData?.pepStatus && client.amlData.pepStatus !== 'Not PEP' ? 'text-red-600' : 'text-green-600' 
                },
                { 
                  label: 'Adverse Media', 
                  status: client.amlData?.adverseMediaHits > 0 ? 'Review Required' : 'Clear', 
                  color: client.amlData?.adverseMediaHits > 0 ? 'text-amber-600' : 'text-green-600' 
                }
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
              onClick={() => setShowInfoModal(true)}
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

      {/* ==================== PREMIUM REQUEST MORE INFO DIALOG ==================== */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8" />
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Request Supplementary KYC Information</h3>
                  <p className="text-xs text-amber-100 font-medium">Dispatches verification email to {client.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowInfoModal(false)}
                className="text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleRequestInfoSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Category selector */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-amber-500 rounded-full" />
                  Select Document Categories Required
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: 'passport', label: 'Primary Photographic ID', desc: 'Certified Passport or DL' },
                    { id: 'addressProof', label: 'Proof of Residency', desc: 'Utility Bill or Gov Letter' },
                    { id: 'structureChart', label: 'Corporate Ownership Chart', desc: 'Signed UBO relationship map' },
                    { id: 'fundsVerification', label: 'Source of Funds Proof', desc: 'Tax statements or bank sheets' },
                    { id: 'pepDeclaration', label: 'Politically Exposed Person questionnaire', desc: 'Signed PEP status declaration' }
                  ].map((doc) => (
                    <label 
                      key={doc.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedDocs[doc.id] 
                          ? 'bg-amber-50/70 border-amber-400 shadow-sm' 
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={selectedDocs[doc.id]}
                        onChange={(e) => handleDocCheckboxChange(doc.id, e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-gray-900">{doc.label}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{doc.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Guidelines textarea */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-amber-500 rounded-full" />
                  Custom Compliance Guidelines & Instructions
                </label>
                <textarea
                  required
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-xs text-gray-800 leading-relaxed font-mono"
                  placeholder="Explain exactly what the client needs to upload..."
                />
              </div>

              {/* Urgency settings */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-amber-500 rounded-full" />
                  Request Priority Urgency Level
                </label>
                <div className="flex gap-4">
                  {[
                    { level: 'Low' as const, label: 'Standard (5 business days)', color: 'border-green-300 text-green-700 bg-green-50/30' },
                    { level: 'Medium' as const, label: 'High Priority (3 business days)', color: 'border-amber-300 text-amber-700 bg-amber-50/30' },
                    { level: 'High' as const, label: 'Escalated Urgency (24 Hours)', color: 'border-red-300 text-red-700 bg-red-50/30' }
                  ].map((opt) => (
                    <label
                      key={opt.level}
                      className={`flex-1 flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer text-xs font-bold transition-all ${
                        urgency === opt.level
                          ? `${opt.color} border-current shadow-md ring-1 ring-current`
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="urgency"
                        checked={urgency === opt.level}
                        onChange={() => setUrgency(opt.level)}
                        className="sr-only"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Informative advice */}
              <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-100 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-[11px] text-amber-800 leading-relaxed">
                  <strong>Notification Dispatching:</strong> Upon confirmation, the compliance client portal will transition to <span className="font-semibold">"Pending Info"</span> status, and an automated verification request containing your specific custom instructions will be emailed directly to the client's registered representative.
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setShowInfoModal(false)}
                  className="px-5 py-2 border-gray-300"
                >
                  Cancel Request
                </Button>
                <Button 
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold flex items-center gap-2 rounded-xl shadow-md"
                >
                  <Send className="w-4 h-4" />
                  Dispatch Verification Request
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
