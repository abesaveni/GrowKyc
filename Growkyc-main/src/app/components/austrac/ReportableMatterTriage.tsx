import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Shield,
  FileText,
  Users,
  Building,
  TrendingUp,
  Eye,
  ArrowRight,
  Ban,
  Activity
} from 'lucide-react';

interface TriggerContext {
  id: string;
  sourceModule: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  explanation: string;
  details: string;
}

interface ReportableMatterTriageProps {
  caseId?: string;
  onBack?: () => void;
}

export function ReportableMatterTriage({ caseId, onBack }: ReportableMatterTriageProps) {
  const [triageDecision, setTriageDecision] = useState<string>('');
  const [preliminarySuspicion, setPreliminarySuspicion] = useState(false);
  const [serviceHold, setServiceHold] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultCaseInfo = {
    caseId: caseId || 'AUS-2026-002',
    subjectName: caseId === 'AUS-2026-001' ? 'Innovation Partners Trust' :
                 caseId === 'AUS-2026-003' ? 'David Chen' :
                 caseId === 'AUS-2026-004' ? 'TechCorp Pty Ltd' :
                 caseId === 'AUS-2026-005' ? 'Melbourne Family Trust' :
                 'ABC Enterprises Pty Ltd',
    subjectType: (caseId === 'AUS-2026-003' ? 'Individual' :
                  (caseId === 'AUS-2026-001' || caseId === 'AUS-2026-005') ? 'Trust' : 'Company'),
    linkedClient: 'C-2024-004',
    triggerSource: 'Sanctions Screening Bot',
    triggerDate: '2026-03-20 14:30',
    currentRiskBand: caseId === 'AUS-2026-003' ? 'Medium' :
                     caseId === 'AUS-2026-005' ? 'Medium' :
                     caseId === 'AUS-2026-002' ? 'Critical' : 'High',
    serviceStatus: 'Active - Under Review',
    monitoringStatus: 'Live Monitoring Active',
    status: 'UNDER_REVIEW'
  };

  const [caseInfo, setCaseInfo] = useState(defaultCaseInfo);

  // Sync if prop changes
  React.useEffect(() => {
    if (caseId) {
      setCaseInfo(prev => ({
        ...prev,
        caseId,
        subjectName: caseId === 'AUS-2026-001' ? 'Innovation Partners Trust' :
                     caseId === 'AUS-2026-003' ? 'David Chen' :
                     caseId === 'AUS-2026-004' ? 'TechCorp Pty Ltd' :
                     caseId === 'AUS-2026-005' ? 'Melbourne Family Trust' :
                     'ABC Enterprises Pty Ltd',
        subjectType: (caseId === 'AUS-2026-003' ? 'Individual' :
                      (caseId === 'AUS-2026-001' || caseId === 'AUS-2026-005') ? 'Trust' : 'Company'),
        currentRiskBand: caseId === 'AUS-2026-003' ? 'Medium' :
                         caseId === 'AUS-2026-005' ? 'Medium' :
                         caseId === 'AUS-2026-002' ? 'Critical' : 'High',
      }));
    }
  }, [caseId]);

  const handleFlagAsReportable = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/v1/cases/${caseInfo.caseId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'REPORTABLE' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response contains json or text
      const contentType = response.headers.get("content-type");
      let data: any = {};
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      }

      // Set state using actual backend response if structured, otherwise update status directly
      const newStatus = data?.status || 'REPORTABLE';
      setCaseInfo(prev => ({ 
        ...prev, 
        ...(data && typeof data === 'object' ? data : {}), 
        status: newStatus 
      }));

      toast.success(`Case ${caseInfo.caseId} flagged as Reportable successfully!`);
    } catch (error) {
      console.error('Error flagging case as reportable:', error);
      toast.error(`Failed to flag case as reportable: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerContexts: TriggerContext[] = [
    {
      id: 'T1',
      sourceModule: 'Sanctions Screening Bot',
      timestamp: '2026-03-20 14:30:12',
      severity: 'critical',
      confidence: 0.94,
      explanation: 'Confirmed sanctions match - DFAT consolidated list',
      details: 'Director "John Smith" matched to sanctioned individual. 94% confidence. Entity name also flags potential link to sanctioned jurisdiction.'
    },
    {
      id: 'T2',
      sourceModule: 'Adverse Media Bot',
      timestamp: '2026-03-20 14:32:45',
      severity: 'high',
      confidence: 0.82,
      explanation: 'Severe adverse media - financial crime theme',
      details: '3 articles from 2025-2026 linking entity to money laundering investigation. Regulatory action pending in Singapore.'
    },
    {
      id: 'T3',
      sourceModule: 'Source of Funds Bot',
      timestamp: '2026-03-19 10:15:30',
      severity: 'medium',
      confidence: 0.67,
      explanation: 'Unexplained source of funds',
      details: 'Recent capital injection of $2.5M. Declared source "business operations" but operating history shows losses. Unable to verify legitimate trading activity.'
    }
  ];

  const getSeverityBadge = (severity: string) => {
    const config = {
      low: 'bg-green-100 text-green-700 border-green-300',
      medium: 'bg-amber-100 text-amber-700 border-amber-300',
      high: 'bg-orange-100 text-orange-700 border-orange-300',
      critical: 'bg-red-100 text-red-700 border-red-300'
    };
    return (
      <Badge className={`${config[severity as keyof typeof config]} text-xs px-2 py-1`}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-orange-900 rounded-lg p-6 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20 flex-shrink-0">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold">Reportable Matter Triage</h1>
                <p className="text-sm md:text-base text-white/90">Case ID: {caseInfo.caseId}</p>
              </div>
            </div>
            <Button onClick={onBack} className="bg-white text-red-900 hover:bg-red-50 w-full sm:w-auto">
              Return to Control Centre
            </Button>
          </div>
        </div>

        {/* Three-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT PANEL - Case Summary */}
          <Card className="border-2 border-blue-300 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                Case Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Case ID</p>
                <p className="font-mono font-bold text-blue-900 text-lg">{caseInfo.caseId}</p>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">Subject Name</p>
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-gray-600" />
                  <p className="font-bold text-gray-900">{caseInfo.subjectName}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">Subject Type</p>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                  {caseInfo.subjectType}
                </Badge>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">Linked Client</p>
                <p className="font-mono text-sm text-gray-900">{caseInfo.linkedClient}</p>
              </div>

              <div className="pt-3 border-t">
                <p className="text-xs text-gray-600 mb-2">Trigger Source</p>
                <Badge className="bg-red-100 text-red-700 border-red-300 mb-2">
                  <Shield className="w-3 h-3 mr-1" />
                  {caseInfo.triggerSource}
                </Badge>
                <p className="text-xs text-gray-700">Triggered: {caseInfo.triggerDate}</p>
              </div>

              <div className="pt-3 border-t">
                <p className="text-xs text-gray-600 mb-2">Current Risk Band</p>
                <Badge className="bg-red-100 text-red-700 border-red-300 text-sm px-3 py-1">
                  {caseInfo.currentRiskBand.toUpperCase()}
                </Badge>
              </div>

              <div className="pt-3 border-t">
                <p className="text-xs text-gray-600 mb-2">Service Status</p>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-600" />
                  <p className="text-sm text-amber-700 font-semibold">{caseInfo.serviceStatus}</p>
                </div>
              </div>

              <div className="pt-3 border-t">
                <p className="text-xs text-gray-600 mb-2">Monitoring Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-green-700 font-semibold">{caseInfo.monitoringStatus}</p>
                </div>
              </div>

              <div className="pt-3 border-t">
                <p className="text-xs text-gray-600 mb-2">Case Status</p>
                <Badge className={caseInfo.status === 'REPORTABLE' ? 'bg-red-600 text-white text-sm px-3 py-1 font-bold' : 'bg-blue-100 text-blue-700 border-blue-300 text-sm px-3 py-1'}>
                  {caseInfo.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* CENTRE PANEL - Trigger Context */}
          <Card className="border-2 border-orange-300 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                Trigger Context
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">What caused this case</p>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {triggerContexts.map((trigger) => (
                <div
                  key={trigger.id}
                  className={`p-4 rounded-lg border-2 ${
                    trigger.severity === 'critical' ? 'border-red-300 bg-red-50' :
                    trigger.severity === 'high' ? 'border-orange-300 bg-orange-50' :
                    trigger.severity === 'medium' ? 'border-amber-300 bg-amber-50' :
                    'border-green-300 bg-green-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-xs mb-2">
                        <Shield className="w-3 h-3 mr-1" />
                        {trigger.sourceModule}
                      </Badge>
                      <p className="text-xs text-gray-600">{trigger.timestamp}</p>
                    </div>
                    <div className="text-right">
                      {getSeverityBadge(trigger.severity)}
                      <p className="text-xs text-gray-600 mt-1">
                        Confidence: <span className="font-bold">{(trigger.confidence * 100).toFixed(0)}%</span>
                      </p>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 mb-2">{trigger.explanation}</h3>
                  <p className="text-sm text-gray-700">{trigger.details}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* RIGHT PANEL - Triage Decision */}
          <Card className="border-2 border-purple-300 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-purple-600" />
                Triage Decision
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Decision Action</label>
                <select
                  value={triageDecision}
                  onChange={(e) => setTriageDecision(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select decision...</option>
                  <option value="continue">Continue Review</option>
                  <option value="request_info">Request More Information</option>
                  <option value="escalate">Escalate to Compliance Manager</option>
                  <option value="hold">Hold Service Activity</option>
                  <option value="close">Close as Non-Reportable</option>
                </select>
              </div>

              <div className="p-4 bg-red-50 rounded-lg border-2 border-red-300">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={preliminarySuspicion}
                    onChange={(e) => setPreliminarySuspicion(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <span className="font-bold text-red-900">Preliminary Suspicion Flag</span>
                </label>
                <p className="text-xs text-red-700 mt-2">
                  Check if initial review indicates suspicious matter
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Urgency Level</label>
                <select className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="routine">Routine (72 hours)</option>
                  <option value="priority">Priority (48 hours)</option>
                  <option value="urgent">Urgent (24 hours)</option>
                  <option value="immediate">Immediate (Same day)</option>
                </select>
              </div>

              <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-300">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={serviceHold}
                    onChange={(e) => setServiceHold(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <span className="font-bold text-amber-900">Service Hold Required</span>
                </label>
                <p className="text-xs text-amber-700 mt-2">
                  Immediately restrict or suspend services during investigation
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Assigned Owner</label>
                <select className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="">Select reviewer...</option>
                  <option value="sarah">Sarah Johnson - Senior Analyst</option>
                  <option value="michael">Michael Chen - Lead Analyst</option>
                  <option value="lisa">Lisa Martinez - Compliance Manager</option>
                  <option value="mlro">MLRO - Direct Assignment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Triage Notes</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter preliminary observations, concerns, or instructions..."
                />
              </div>

              <div className="pt-4 border-t space-y-3">
                <Button 
                  onClick={handleFlagAsReportable} 
                  disabled={isSubmitting || caseInfo.status === 'REPORTABLE'}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-lg py-6 font-bold"
                >
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  {caseInfo.status === 'REPORTABLE' ? 'Flagged as Reportable' : 'Flag as Reportable'}
                </Button>
                <Button 
                  onClick={() => {
                    toast.success(`Triage complete for case ${caseInfo.caseId}. Decision successfully submitted.`);
                    if (onBack) onBack();
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-6"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Complete Triage
                </Button>
                <Button 
                  onClick={() => {
                    toast.success('Triage form draft successfully saved.');
                  }}
                  variant="outline" 
                  className="w-full border-2"
                >
                  Save Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Hold Warning Banner */}
        {serviceHold && (
          <Card className="border-4 border-red-500 bg-red-50 shadow-xl animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Ban className="w-12 h-12 text-red-600" />
                <div>
                  <h3 className="text-2xl font-bold text-red-900 mb-1">Service Hold Will Be Applied</h3>
                  <p className="text-red-800">
                    Upon completing triage, all services for this client will be immediately restricted pending
                    investigation outcome. Client will be notified per policy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
