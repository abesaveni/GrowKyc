import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  DollarSign, 
  Wallet, 
  ShieldCheck, 
  FileCheck, 
  AlertTriangle, 
  Clock, 
  User, 
  FileText,
  Download,
  ExternalLink,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { SOFSOWAssessment, SOF_SOW_ASSESSMENTS } from './SOFSOWAssessmentData';

interface SOFSOWAssessmentProps {
  clientId: string;
}

export function SOFSOWAssessmentComponent({ clientId }: SOFSOWAssessmentProps) {
  const assessment = SOF_SOW_ASSESSMENTS[clientId];

  if (!assessment) {
    return (
      <Card className="border-2 border-dashed border-white/10 bg-white/5/50">
        <CardContent className="p-12 text-center">
          <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-300 mb-2">No SOF/SOW Assessment Found</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            This client has not yet undergone a formal Source of Funds or Source of Wealth assessment.
          </p>
          <Button className="bg-[#13B5EA] hover:bg-[#0E7C9E]">
            <Plus className="w-4 h-4 mr-2" />
            Start Assessment
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-500 hover:bg-green-600';
      case 'Medium': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'High': return 'bg-orange-500 hover:bg-orange-600';
      case 'Critical': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'Pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'Rejected': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <HelpCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <Card className="border-2 border-indigo-500/30 shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-500/20 p-6">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-indigo-300 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
            SOF / SOW Compliance Assessment
          </CardTitle>
          <Badge className={`${getRiskColor(assessment.riskRating)} text-white px-4 py-1 text-sm font-bold uppercase tracking-wider`}>
            {assessment.riskRating} RISK
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Main Assessment Info */}
          <div className="lg:col-span-2 p-8 border-r border-white/10">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-indigo-50 hover:border-indigo-500/30 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-500/15 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-300" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide">Source of Funds (SOF)</h4>
                  </div>
                  <p className="text-xl font-bold text-slate-100 leading-tight">{assessment.sofType}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-indigo-50 hover:border-indigo-500/30 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/15 rounded-lg">
                      <Wallet className="w-6 h-6 text-blue-300" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide">Source of Wealth (SOW)</h4>
                  </div>
                  <p className="text-xl font-bold text-slate-100 leading-tight">{assessment.sowType}</p>
                </div>
              </div>

              <div className="bg-indigo-500/10/30 rounded-xl p-6 border border-indigo-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <FileCheck className="w-6 h-6 text-indigo-400" />
                  <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wide">Verification Method</h4>
                </div>
                <p className="text-slate-100 font-semibold text-lg">{assessment.verificationMethod}</p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4">Compliance Comments</h4>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 relative italic text-slate-300 leading-relaxed">
                  "{assessment.comments}"
                  <div className="flex items-center gap-2 mt-4 not-italic font-bold text-slate-100 text-sm">
                    <User className="w-4 h-4 text-indigo-400" />
                    Assessed by {assessment.assessor} on {assessment.assessmentDate}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence Documents Sidebar */}
          <div className="bg-white/5/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                Evidence Documents
              </h4>
              <Badge variant="outline" className="bg-white">{assessment.evidenceDocuments.length}</Badge>
            </div>

            <div className="space-y-4">
              {assessment.evidenceDocuments.map((doc, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 border border-white/10 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-slate-100 text-sm truncate max-w-[150px]">{doc.name}</p>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(doc.status)}
                      <span className={`text-[10px] font-bold ${
                        doc.status === 'Verified' ? 'text-green-400' : 
                        doc.status === 'Pending' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {doc.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-3">{doc.type} • {doc.date}</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] px-2 text-indigo-400 hover:bg-indigo-500/10">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] px-2 text-indigo-400 hover:bg-indigo-500/10">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg">
              <Upload className="w-4 h-4 mr-2" />
              Upload New Evidence
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper icons needed but not in Lucide imports above
function Plus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function Upload(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}
