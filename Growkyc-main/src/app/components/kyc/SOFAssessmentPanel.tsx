
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  DollarSign, 
  Wallet, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ChevronRight,
  MoreVertical,
  Download,
  FileSearch,
  UserCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { ClientFinancialAssessment, SOFAssessment, SOFDocument } from './SOFData';

interface SOFAssessmentPanelProps {
  data: ClientFinancialAssessment;
}

export function SOFAssessmentPanel({ data }: SOFAssessmentPanelProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AssessmentCard title="Source of Funds (SOF)" assessment={data.sof} icon={<DollarSign className="w-5 h-5 text-green-400" />} />
        <AssessmentCard title="Source of Wealth (SOW)" assessment={data.sow} icon={<Wallet className="w-5 h-5 text-blue-400" />} />
      </div>
    </div>
  );
}

function AssessmentCard({ title, assessment, icon }: { title: string; assessment: SOFAssessment; icon: React.ReactNode }) {
  const [localAssessment, setLocalAssessment] = React.useState<SOFAssessment>(assessment);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'High': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'Critical': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-slate-300 bg-white/5 border-white/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'In Progress': return <Clock className="w-5 h-5 text-blue-500 animate-spin-slow" />;
      case 'Action Required': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newDoc: SOFDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: file.type || 'application/octet-stream',
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Pending'
      };
      
      setLocalAssessment(prev => ({
        ...prev,
        evidenceDocuments: [...prev.evidenceDocuments, newDoc]
      }));
      toast.success(`${file.name} uploaded successfully and pending review.`);
      
      // Reset input so the same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownload = (doc: SOFDocument) => {
    const content = `Mock Secure Document Content\n---------------------------\nFile Name: ${doc.name}\nFile Type: ${doc.type}\nFile Size: ${doc.fileSize}\nStatus: ${doc.status}\nUpload Date: ${doc.uploadDate}\n\nThis is a securely generated mock document for demonstration purposes.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success(`Downloaded ${doc.name}`);
  };

  const handleUpdateAssessment = () => {
    setIsUpdating(true);
    setLocalAssessment(prev => ({ ...prev, status: 'In Progress' }));
    
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2500)),
      {
        loading: `Running background verification for ${title}...`,
        success: () => {
          setLocalAssessment(prev => ({ 
            ...prev, 
            status: 'Verified',
            assessmentDate: new Date().toISOString().split('T')[0],
            // Auto-verify all pending documents during the assessment
            evidenceDocuments: prev.evidenceDocuments.map(d => ({ ...d, status: 'Verified' }))
          }));
          setIsUpdating(false);
          return `${title} verified successfully`;
        },
        error: () => {
          setIsUpdating(false);
          return 'Verification failed';
        }
      }
    );
  };

  return (
    <Card className="border-2 border-white/10 shadow-xl overflow-hidden bg-white dark:bg-slate-900 flex flex-col h-full">
      <CardHeader className="bg-white/5 dark:bg-slate-800/50 border-b border-white/10 dark:border-slate-700 py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-white/10 dark:border-slate-700">
              {icon}
            </div>
            <CardTitle className="text-lg font-bold text-slate-100 dark:text-slate-100">{title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`${getRiskColor(localAssessment.riskRating)} border-2 px-3 py-0.5 font-black uppercase tracking-tighter text-[10px]`}>
              {localAssessment.riskRating} RISK
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="space-y-6 flex-1">
          {/* Top Section: Type & Status */}
          <div className="flex items-start justify-between bg-white/5 dark:bg-slate-800 p-4 rounded-2xl border border-white/10 dark:border-slate-700">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Primary Type</p>
              <h4 className="text-xl font-black text-slate-100 dark:text-slate-100">{localAssessment.type}</h4>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                {getStatusIcon(localAssessment.status)}
                <span className="text-sm font-bold text-slate-300 dark:text-slate-200">{localAssessment.status}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Status as of {localAssessment.assessmentDate}</p>
            </div>
          </div>

          {/* Methodology & Description */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <FileSearch className="w-3 h-3" />
                Verification Methodology
              </p>
              <p className="text-sm font-bold text-slate-300 dark:text-slate-300 bg-indigo-500/10/50 dark:bg-indigo-900/10 p-3 rounded-xl border border-indigo-500/20 dark:border-indigo-900/30">
                {localAssessment.verificationMethod}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assessment Notes</p>
              <p className="text-sm text-slate-300 dark:text-slate-400 leading-relaxed italic">
                "{localAssessment.description}"
              </p>
            </div>
          </div>

          {/* Evidence Documents */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Evidence Documents ({localAssessment.evidenceDocuments.length})</p>
              
              {/* Hidden file input for actual OS file picking */}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileUpload} 
              />
              
              <button 
                className="text-[10px] font-bold text-blue-400 hover:underline flex items-center gap-1"
                onClick={() => fileInputRef.current?.click()}
              >
                UPLOAD NEW
              </button>
            </div>
            
            {localAssessment.evidenceDocuments.length === 0 ? (
              <div className="p-8 border-2 border-dashed border-white/10 dark:border-slate-800 rounded-2xl text-center">
                <AlertTriangle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-bold">NO EVIDENCE DOCUMENTS PROVIDED</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">Immediate action required to verify profile</p>
              </div>
            ) : (
              <div className="space-y-2">
                {localAssessment.evidenceDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl border border-white/10 dark:border-slate-800 hover:bg-white/5 dark:hover:bg-slate-800 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 dark:bg-slate-800 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-100 dark:text-slate-200">{doc.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{doc.type} • {doc.fileSize}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-[10px] font-black uppercase tracking-widest border-none ${
                        doc.status === 'Verified' ? 'bg-green-500/15 text-green-300' :
                        doc.status === 'Pending' ? 'bg-blue-500/15 text-blue-300' :
                        'bg-red-500/15 text-red-300'
                      }`}>
                        {doc.status}
                      </Badge>
                      <button 
                        className="p-2 hover:bg-white/10 dark:hover:bg-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer: Assessor Info */}
        <div className="mt-8 pt-4 border-t border-white/10 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500/15 flex items-center justify-center text-indigo-400">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Assessed By</p>
              <p className="text-xs font-bold text-slate-300 dark:text-slate-200">{localAssessment.assessedBy}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs font-bold border-white/10 hover:bg-white/5"
            onClick={handleUpdateAssessment}
            disabled={isUpdating}
          >
            {isUpdating ? 'UPDATING...' : 'UPDATE ASSESSMENT'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
