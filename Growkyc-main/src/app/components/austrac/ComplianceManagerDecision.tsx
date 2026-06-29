import React, { useState } from 'react';
import { toast } from '../../lib/toast';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  Activity,
  AlertTriangle,
  FileText,
  User,
  Calendar,
  Send,
  ArrowLeft
} from 'lucide-react';

interface ComplianceManagerDecisionProps {
  caseId?: string;
  onBack?: () => void;
}

export function ComplianceManagerDecision({ caseId, onBack }: ComplianceManagerDecisionProps = {}) {
  const [finalDecision, setFinalDecision] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const caseData = {
    caseId: caseId || 'AUS-2026-002',
    subject: 'ABC Enterprises Pty Ltd',
    triggerReason: 'Sanctions Match + Adverse Media + Unexplained SOF',
    currentRisk: 'Critical',
    serviceStatus: 'Under Review - Restricted',
    assignedAnalyst: 'Michael Chen',
    completedDate: '2026-03-21'
  };

  const recommendation = {
    analyst: 'Michael Chen',
    recommendation: 'submit',
    confidence: 'High',
    keyEvidence: [
      'Director matches DFAT sanctions list (94% confidence)',
      'Multiple adverse media articles - money laundering investigation',
      'Unexplained capital injection of $2.5M',
      'Foreign PEP among directors',
      'Parent company under investigation in Singapore'
    ],
    missingEvidence: []
  };

  const decisionOptions = [
    {
      value: 'submit',
      label: 'Submit Report to AUSTRAC',
      description: 'Formal SMR submission - matter is suspicious',
      icon: Send,
      color: 'red',
      impact: 'Report will be lodged with AUSTRAC within 24 hours'
    },
    {
      value: 'no_submit',
      label: 'Do Not Submit Report',
      description: 'Not suspicious - close case',
      icon: XCircle,
      color: 'gray',
      impact: 'Case closed with documented rationale'
    },
    {
      value: 'further_investigation',
      label: 'Request Further Investigation',
      description: 'Return to analyst for more evidence',
      icon: Eye,
      color: 'amber',
      impact: 'Case returned to analyst with specific requests'
    },
    {
      value: 'enhanced_monitoring',
      label: 'Enhanced Monitoring',
      description: 'Watch closely for 90 days',
      icon: Activity,
      color: 'indigo',
      impact: 'Automated monitoring triggers set, case remains open'
    },
    {
      value: 'service_restrictions',
      label: 'Apply Service Restrictions',
      description: 'Limit or suspend services',
      icon: Ban,
      color: 'orange',
      impact: 'Client services restricted immediately'
    },
    {
      value: 'disengage',
      label: 'Disengage / Block Service',
      description: 'Exit relationship entirely',
      icon: Ban,
      color: 'red',
      impact: 'All services terminated, account closed'
    }
  ];

  const submissionTracker = [
    { step: 'Draft complete', status: 'complete', date: '2026-03-21' },
    { step: 'Approved for submission', status: 'pending', date: null },
    { step: 'Submitted', status: 'pending', date: null },
    { step: 'Acknowledged', status: 'pending', date: null },
    { step: 'Closed', status: 'pending', date: null }
  ];

  const handleDecision = () => {
    if (finalDecision) {
      setShowConfirmation(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" onClick={onBack} className="bg-white/10 border-2 border-white/20 text-white hover:bg-white/20">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
              )}
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Compliance Manager Decision</h1>
                <p className="text-white/90">Final decision point for {caseData.caseId}</p>
              </div>
            </div>
            <Badge className="bg-white text-red-900 text-xl px-6 py-3">
              MLRO DECISION REQUIRED
            </Badge>
          </div>
        </div>

        {/* Section A - Case Summary */}
        <Card className="border-2 border-blue-300 shadow-lg">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Case Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Subject</p>
                <p className="font-bold text-lg text-gray-900">{caseData.subject}</p>
                <p className="text-sm text-gray-600 mt-1">Case: {caseData.caseId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Trigger Reason</p>
                <p className="font-semibold text-gray-900">{caseData.triggerReason}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Risk Rating</p>
                <Badge className="bg-red-100 text-red-700 border-red-300 text-lg px-4 py-2">
                  {caseData.currentRisk.toUpperCase()}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Summary of Findings</p>
                <p className="text-sm text-gray-800">
                  Director matched to DFAT sanctions list. Severe adverse media linking to money laundering
                  investigation. Unexplained $2.5M capital injection.
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Service Status</p>
                <div className="flex items-center gap-2">
                  <Ban className="w-5 h-5 text-orange-600" />
                  <p className="font-semibold text-orange-700">{caseData.serviceStatus}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Investigation Completed</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <p className="font-semibold text-gray-900">{caseData.completedDate}</p>
                </div>
                <p className="text-sm text-gray-600">By: {caseData.assignedAnalyst}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section B - Recommendation Summary */}
        <Card className="border-2 border-purple-300 shadow-lg">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <User className="w-6 h-6 text-purple-600" />
              Analyst Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Analyst</p>
                <p className="font-bold text-gray-900">{recommendation.analyst}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Recommendation</p>
                {recommendation.recommendation === 'submit' && (
                  <Badge className="bg-red-100 text-red-700 border-red-300 text-lg px-4 py-2">
                    <Send className="w-5 h-5 mr-2" />
                    SUBMIT TO AUSTRAC
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Confidence</p>
                <Badge className="bg-green-100 text-green-700 border-green-300 text-lg px-4 py-2">
                  {recommendation.confidence}
                </Badge>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-bold text-gray-900 mb-2">Key Evidence</p>
              <div className="space-y-2">
                {recommendation.keyEvidence.map((evidence, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                    <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-900">{evidence}</p>
                  </div>
                ))}
              </div>
            </div>

            {recommendation.missingEvidence.length > 0 ? (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-300">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <p className="font-bold text-amber-900">Missing Evidence</p>
                </div>
                <ul className="space-y-1 text-sm text-amber-800">
                  {recommendation.missingEvidence.map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-4 bg-green-50 rounded-lg border border-green-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="font-bold text-green-900">All evidence complete - case ready for decision</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section C - Final Decision Panel */}
        <Card className="border-4 border-red-300 shadow-2xl">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Shield className="w-8 h-8 text-red-600" />
              Final Decision
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4 mb-6">
              {decisionOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = finalDecision === option.value;
                return (
                  <div
                    key={option.value}
                    onClick={() => setFinalDecision(option.value)}
                    className={`p-5 rounded-xl border-3 cursor-pointer transition-all ${
                      isSelected
                        ? `border-${option.color}-500 bg-${option.color}-50 ring-4 ring-${option.color}-200`
                        : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-${option.color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-7 h-7 text-${option.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{option.label}</h3>
                          {isSelected && (
                            <CheckCircle className={`w-6 h-6 text-${option.color}-600`} />
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{option.description}</p>
                        <p className="text-xs text-gray-600">
                          <strong>Impact:</strong> {option.impact}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {finalDecision && (
              <div className="space-y-4 pt-6 border-t">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Decision Reason / Rationale *</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Document your reasoning for this decision. This will form part of the audit trail..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Reviewer Name</label>
                    <input
                      type="text"
                      value="Lisa Martinez (MLRO)"
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Approval Date</label>
                    <input
                      type="text"
                      value={new Date().toISOString().split('T')[0]}
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>
                </div>

                {(finalDecision === 'service_restrictions' || finalDecision === 'disengage') && (
                  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-300">
                    <label className="block text-sm font-bold text-red-900 mb-2">Service Action Details</label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-red-300 rounded-lg"
                      placeholder="Specify which services will be restricted/terminated and timeline..."
                    />
                  </div>
                )}

                <Button
                  onClick={handleDecision}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-xl py-8"
                >
                  <CheckCircle className="w-6 h-6 mr-3" />
                  Confirm Final Decision
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section D - Submission Status Tracker */}
        <Card className="border-2 border-gray-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-gray-600" />
              Submission Status Tracker
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {submissionTracker.map((item, idx) => (
                <div key={idx} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 ${
                      item.status === 'complete'
                        ? 'bg-green-100 border-green-500'
                        : 'bg-gray-100 border-gray-300'
                    }`}>
                      {item.status === 'complete' ? (
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      ) : (
                        <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                    <p className={`text-xs font-semibold mt-2 text-center ${
                      item.status === 'complete' ? 'text-green-900' : 'text-gray-600'
                    }`}>
                      {item.step}
                    </p>
                    {item.date && (
                      <p className="text-xs text-gray-500">{item.date}</p>
                    )}
                  </div>
                  {idx < submissionTracker.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      item.status === 'complete' ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl border-4 border-red-500 shadow-2xl">
              <CardHeader className="bg-red-900 text-white">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8" />
                  Confirm Final Decision
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-lg text-gray-900">
                    You are about to make a final decision on case <strong>{caseData.caseId}</strong>.
                  </p>

                  <div className="p-6 bg-red-50 rounded-lg border-2 border-red-300">
                    <p className="font-bold text-red-900 text-xl mb-2">
                      Decision: {decisionOptions.find(d => d.value === finalDecision)?.label}
                    </p>
                    <p className="text-red-800">
                      {decisionOptions.find(d => d.value === finalDecision)?.impact}
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-300">
                    <p className="text-sm text-amber-900">
                      <strong>Important:</strong> This decision will be logged in the audit trail and cannot be undone.
                      All actions will be timestamped and attributed to you.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => {
                        setShowConfirmation(false);
                        // Here you would actually submit the decision
                        toast.success('Decision recorded and logged to audit trail');
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-lg py-6"
                    >
                      Yes, Confirm Decision
                    </Button>
                    <Button
                      onClick={() => setShowConfirmation(false)}
                      variant="outline"
                      className="flex-1 border-2 text-lg py-6"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
