import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  User,
  Calendar,
  Shield,
  TrendingUp,
  Eye,
  Download,
  MessageSquare,
  CheckSquare,
  AlertOctagon,
  Clock,
  Target,
  BarChart3
} from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '../ui/dialog';
import { DecisionRecord } from './DecisionData';
import { toast } from '../../lib/toast';

interface EnhancedDecisionTabProps {
  decision: DecisionRecord;
}

export function EnhancedDecisionTab({ decision }: EnhancedDecisionTabProps) {
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);
  const [expandedRiskAssessment, setExpandedRiskAssessment] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleViewReport = () => {
    // kept for backward compatibility (shows quick toast)
    toast.info('Full Report Viewer', 'Opening comprehensive KYC report...');
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    toast.loading('Generating Decision PDF...');
    
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.dismiss();
    setIsExporting(false);
    toast.success('PDF Export Complete', 'The decision summary report has been downloaded.');
  };

  const getDecisionColor = () => {
    switch (decision.decision) {
      case 'Approved': return 'bg-green-500/10 border-green-300';
      case 'Approved with Conditions': return 'bg-blue-500/10 border-blue-300';
      case 'Rejected': return 'bg-red-500/10 border-red-300';
      case 'Pending': return 'bg-yellow-500/10 border-yellow-300';
      default: return 'bg-white/5 border-white/10';
    }
  };

  const getDecisionIcon = () => {
    switch (decision.decision) {
      case 'Approved': return <CheckCircle className="w-12 h-12 text-green-400" />;
      case 'Approved with Conditions': return <CheckSquare className="w-12 h-12 text-blue-400" />;
      case 'Rejected': return <XCircle className="w-12 h-12 text-red-400" />;
      case 'Pending': return <Clock className="w-12 h-12 text-yellow-400" />;
      default: return <AlertTriangle className="w-12 h-12 text-slate-300" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500/15 text-red-300 border-red-300';
      case 'High': return 'bg-orange-500/15 text-orange-300 border-orange-300';
      case 'Medium': return 'bg-yellow-500/15 text-yellow-300 border-yellow-300';
      case 'Low': return 'bg-blue-500/15 text-blue-300 border-blue-300';
      default: return 'bg-white/5 text-slate-100 border-white/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-green-500/15 text-green-300 border-green-300';
      case 'Mitigated': return 'bg-blue-500/15 text-blue-300 border-blue-300';
      case 'Accepted Risk': return 'bg-red-500/15 text-red-300 border-red-300';
      case 'Waived': return 'bg-white/5 text-slate-100 border-white/10';
      default: return 'bg-white/5 text-slate-100 border-white/10';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-500/15 text-green-300';
      case 'Medium': return 'bg-yellow-500/15 text-yellow-300';
      case 'High': return 'bg-orange-500/15 text-orange-300';
      case 'Extreme': return 'bg-red-500/15 text-red-300';
      default: return 'bg-white/5 text-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Decision Header */}
      <Card className={`border-4 shadow-xl ${getDecisionColor()}`}>
        <CardContent className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              {getDecisionIcon()}
              <div>
                <h2 className="text-4xl font-bold mb-2">{decision.decision}</h2>
                <p className="text-lg text-slate-300 mb-4">{decision.clientName}</p>
                <div className="flex items-center gap-4 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Decision Date: {decision.decisionDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>By: {decision.decisionMaker}</span>
                  </div>
                  <Badge variant="outline">{decision.decisionMakerRole}</Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    View Full Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl">
                  <DialogTitle>Full Report Viewer — {decision.clientName}</DialogTitle>
                  <DialogDescription>Comprehensive KYC report for this decision.</DialogDescription>

                  <div className="mt-4 space-y-4 max-h-[70vh] overflow-auto">
                    <section>
                      <h4 className="font-semibold">Executive Summary</h4>
                      <p className="text-sm text-slate-300 whitespace-pre-line">{decision.executiveSummary}</p>
                    </section>

                    <section>
                      <h4 className="font-semibold mt-3">Issues Identified & Resolutions</h4>
                      <div className="space-y-2 mt-2">
                        {decision.issuesIdentified.map(issue => (
                          <div key={issue.id} className="p-3 border rounded-md bg-white">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium">{issue.issue}</p>
                                <p className="text-xs text-slate-400">{issue.category} • Identified: {issue.identified}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold">{issue.status}</p>
                                <p className="text-xs text-slate-400">{issue.severity}</p>
                              </div>
                            </div>
                            <div className="mt-2 text-sm text-slate-300">{issue.resolution}</div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h4 className="font-semibold mt-3">Risk Assessment</h4>
                      <div className="mt-2 text-sm text-slate-300 space-y-2">
                        {decision.riskAssessments && decision.riskAssessments.length > 0 ? (
                          decision.riskAssessments.map((ra) => (
                            <div key={ra.id} className="p-3 border rounded bg-white">
                              <p className="font-semibold text-slate-100 text-sm">Overall Risk: {ra.overallRisk} (Score: {ra.riskScore}/100)</p>
                              <p className="text-xs text-slate-400">Date: {ra.assessmentDate} • Assessed By: {ra.assessedBy}</p>
                              <div className="mt-1">
                                <p className="font-medium text-xs text-slate-100">Mitigations:</p>
                                <ul className="list-disc list-inside text-xs pl-2 text-slate-300">
                                  {ra.mitigation.map((m, idx) => <li key={idx}>{m}</li>)}
                                </ul>
                              </div>
                            </div>
                          ))
                        ) : (
                          'No detailed risk assessment available.'
                        )}
                      </div>
                    </section>
                  </div>

                  <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => toast.info('Opening print preview...')}>Print</Button>
                    <Button onClick={() => toast.success('Download started...')}>Download PDF</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={handleExportPDF}
                disabled={isExporting}
              >
                <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
                {isExporting ? 'Exporting...' : 'Export PDF'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Executive Summary */}
      <Card className="border-2 border-purple-300 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-400" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-slate-100 leading-relaxed whitespace-pre-line">{decision.executiveSummary}</p>
        </CardContent>
      </Card>

      {/* Issues Identified and Resolutions */}
      <Card className="border-2 border-orange-300 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-orange-400" />
            Issues Identified & Resolutions ({decision.issuesIdentified.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {decision.issuesIdentified.map((issue) => {
              const isExpanded = expandedIssue === issue.id;
              
              return (
                <div key={issue.id} className="border-2 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedIssue(isExpanded ? null : issue.id)}
                    className="w-full p-4 bg-white hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${getSeverityColor(issue.severity)} border px-2 py-0.5 text-xs`}>
                            {issue.severity}
                          </Badge>
                          <Badge variant="outline" className="text-xs">{issue.category}</Badge>
                          <Badge className={`${getStatusColor(issue.status)} border px-2 py-0.5 text-xs`}>
                            {issue.status}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-slate-100 mb-1">{issue.issue}</h4>
                        <p className="text-sm text-slate-300">Identified: {issue.identified}</p>
                      </div>
                      <div className="ml-4">
                        {issue.status === 'Resolved' ? (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        ) : issue.status === 'Accepted Risk' ? (
                          <AlertTriangle className="w-6 h-6 text-red-400" />
                        ) : (
                          <AlertOctagon className="w-6 h-6 text-orange-400" />
                        )}
                      </div>
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="bg-white/5 border-t-2 p-4 space-y-4">
                      <div>
                        <h5 className="font-semibold text-sm text-slate-300 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Resolution
                        </h5>
                        <p className="text-slate-100 bg-white rounded-lg p-3 border">{issue.resolution}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-300 mb-1">Resolved By</p>
                          <p className="font-semibold">{issue.resolvedBy}</p>
                        </div>
                        <div>
                          <p className="text-slate-300 mb-1">Resolved Date</p>
                          <p className="font-semibold">{issue.resolvedDate}</p>
                        </div>
                      </div>

                      {issue.evidence && issue.evidence.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-sm text-slate-300 mb-2">Supporting Evidence</h5>
                          <div className="flex flex-wrap gap-2">
                            {issue.evidence.map((doc, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                <FileText className="w-3 h-3 mr-1" />
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessments */}
      <Card className="border-2 border-cyan-300 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            Risk Assessments ({decision.riskAssessments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {decision.riskAssessments.map((assessment) => (
              <div key={assessment.id} className="border-2 rounded-lg overflow-hidden">
                {/* Assessment Summary */}
                <div className={`p-4 ${getRiskColor(assessment.overallRisk)} border-b-2`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-lg mb-1">Overall Risk: {assessment.overallRisk}</h4>
                      <p className="text-sm">Score: {assessment.riskScore}/100</p>
                    </div>
                    <div className="text-right text-sm">
                      <p>Assessed: {assessment.assessmentDate}</p>
                      <p>By: {assessment.assessedBy}</p>
                    </div>
                  </div>
                </div>

                {/* Risk Categories */}
                <div className="p-4 bg-white">
                  <h5 className="font-semibold mb-3">Risk Categories</h5>
                  <div className="space-y-3">
                    {assessment.categories.map((cat, idx) => (
                      <div key={idx} className="bg-white/5 rounded-lg p-3 border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-slate-100">{cat.category}</span>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getRiskColor(cat.risk)} px-2 py-0.5 text-xs`}>
                              {cat.risk}
                            </Badge>
                            <span className="text-sm font-bold">{cat.score}/100</span>
                          </div>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                          <div
                            className={`h-2 rounded-full ${
                              cat.risk === 'Low' ? 'bg-green-500' :
                              cat.risk === 'Medium' ? 'bg-yellow-500' :
                              cat.risk === 'High' ? 'bg-orange-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${cat.score}%` }}
                          />
                        </div>
                        <ul className="space-y-1 text-sm text-slate-300">
                          {cat.factors.map((factor, fidx) => (
                            <li key={fidx} className="flex items-start gap-2">
                              <span className="text-cyan-400 mt-0.5">•</span>
                              <span>{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mitigation */}
                <div className="p-4 bg-blue-500/10 border-t">
                  <h5 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    Mitigation Measures
                  </h5>
                  <ul className="space-y-1 text-sm">
                    {assessment.mitigation.map((measure, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span>{measure}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendation */}
                <div className={`p-4 border-t-2 ${
                  assessment.recommendation === 'Approve' ? 'bg-green-500/10' :
                  assessment.recommendation === 'Reject' ? 'bg-red-500/10' :
                  'bg-yellow-500/10'
                }`}>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    <span className="font-semibold">Recommendation:</span>
                    <Badge className="text-sm">{assessment.recommendation}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Approval Reasoning (only if approved) */}
      {(decision.decision === 'Approved' || decision.decision === 'Approved with Conditions') && (
        <Card className="border-2 border-green-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              Approval Reasoning
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Key Strengths */}
            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Key Strengths
              </h4>
              <ul className="space-y-2">
                {decision.approvalReasoning.keyStrengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-green-500/10 rounded-lg p-3 border border-green-500/30">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-100">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Concerns Addressed */}
            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-blue-400" />
                Concerns Addressed
              </h4>
              <ul className="space-y-2">
                {decision.approvalReasoning.concernsAddressed.map((concern, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-blue-500/10 rounded-lg p-3 border border-blue-500/30">
                    <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-100">{concern}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ongoing Monitoring */}
            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                Ongoing Monitoring
              </h4>
              <ul className="space-y-2">
                {decision.approvalReasoning.ongoingMonitoring.map((monitor, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/30">
                    <Eye className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-100">{monitor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Decision Comments */}
      <Card className="border-2 border-blue-300 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-400" />
            Decision Comments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-white/5 rounded-lg p-6 border-2 border-white/10">
            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-100 leading-relaxed">
              {decision.decisionComments}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Review History Timeline */}
      <Card className="border-2 border-purple-300 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-purple-400" />
            Review History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-[20px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 via-blue-300 to-cyan-300" />
            
            {/* Timeline Events */}
            <div className="space-y-4">
              {decision.reviewHistory.map((review, idx) => (
                <div key={idx} className="relative pl-12">
                  {/* Timeline Dot */}
                  <div className="absolute left-[11px] top-[6px] w-5 h-5 rounded-full border-4 bg-cyan-500 border-cyan-500/30" />
                  
                  {/* Event Card */}
                  <div className="bg-white rounded-lg p-4 border-2 border-white/10 hover:border-cyan-400 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-semibold text-slate-100">{review.action}</h5>
                        <p className="text-sm text-slate-300">{review.reviewer}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{review.date}</Badge>
                    </div>
                    <p className="text-sm text-slate-300">{review.comments}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
