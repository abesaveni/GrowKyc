import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Settings
} from 'lucide-react';

export interface CaseRiskData {
  caseId: string;
  clientName: string;
  sanctionsMatch: boolean;
  foreignPEP: boolean;
  adverseMedia: boolean;
  unexplainedSOF: boolean;
  complexStructure: boolean;
  highRiskJurisdiction: boolean;
  baseScore?: number;
}

interface CustomerRiskAssessmentProps {
  caseData?: CaseRiskData;
  onComplete?: (finalRisk: {
    score: number;
    level: 'LOW' | 'MEDIUM' | 'HIGH';
    overridden: boolean;
    overrideReason?: string;
  }) => void;
}

export function CustomerRiskAssessment({ caseData, onComplete }: CustomerRiskAssessmentProps) {
  // Safe fallback mock caseData if not supplied
  const data: CaseRiskData = caseData || {
    caseId: 'AUS-2026-002',
    clientName: 'ABC Enterprises Pty Ltd',
    sanctionsMatch: true,
    foreignPEP: true,
    adverseMedia: true,
    unexplainedSOF: true,
    complexStructure: true,
    highRiskJurisdiction: true,
    baseScore: 15
  };

  // Reusable Risk Calculation Logic
  const riskCalculation = useMemo(() => {
    let score = data.baseScore || 10;
    const factors: { label: string; impact: number; severity: 'low' | 'medium' | 'high' | 'critical'; desc: string }[] = [];

    if (data.sanctionsMatch) {
      score += 45;
      factors.push({
        label: 'DFAT Sanctions Consolidated List Match',
        impact: 45,
        severity: 'critical',
        desc: 'Direct or high-confidence match on international sanctions or export control restrictions.'
      });
    }
    if (data.foreignPEP) {
      score += 30;
      factors.push({
        label: 'Politically Exposed Person (PEP) Status',
        impact: 30,
        severity: 'high',
        desc: 'Beneficial owner or director holds a prominent foreign public office.'
      });
    }
    if (data.adverseMedia) {
      score += 20;
      factors.push({
        label: 'Negative Adverse Media Indicators',
        impact: 20,
        severity: 'medium',
        desc: 'Reputable publications associate the customer with international money laundering inquiries.'
      });
    }
    if (data.unexplainedSOF) {
      score += 25;
      factors.push({
        label: 'Unexplained Source of Funds (SOF)',
        impact: 25,
        severity: 'high',
        desc: 'Capital injection contradicts historical trading performance or legitimate profiles.'
      });
    }
    if (data.complexStructure) {
      score += 15;
      factors.push({
        label: 'Offshore Company Layering',
        impact: 15,
        severity: 'medium',
        desc: 'Multi-layer offshore trust structure designed to distance beneficial owners.'
      });
    }
    if (data.highRiskJurisdiction) {
      score += 20;
      factors.push({
        label: 'High-Risk Country Ties',
        impact: 20,
        severity: 'high',
        desc: 'Direct transactions flowing through enhanced monitoring and high-risk regulatory hubs.'
      });
    }

    const calculatedScore = Math.min(100, Math.max(0, score));
    let level: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (calculatedScore >= 70) {
      level = 'HIGH';
    } else if (calculatedScore >= 35) {
      level = 'MEDIUM';
    }

    return { score: calculatedScore, level, factors };
  }, [data]);

  // Override States
  const [overrideLevel, setOverrideLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH' | ''>('');
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [isOverridden, setIsOverridden] = useState<boolean>(false);
  const [activeLevel, setActiveLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH'>(riskCalculation.level);

  const handleApplyOverride = () => {
    if (!overrideLevel) {
      toast.error('Please select a target risk level override');
      return;
    }
    if (!overrideReason.trim()) {
      toast.error('Justification documentation is mandatory to override standard scoring');
      return;
    }
    setActiveLevel(overrideLevel);
    setIsOverridden(true);
    toast.success(`Risk Level successfully overridden to ${overrideLevel}`);
  };

  const handleResetOverride = () => {
    setActiveLevel(riskCalculation.level);
    setIsOverridden(false);
    setOverrideLevel('');
    setOverrideReason('');
    toast.info('Risk assessment reset to calculated algorithm scoring');
  };

  const handleConfirmAssessment = () => {
    const payload = {
      score: riskCalculation.score,
      level: activeLevel,
      overridden: isOverridden,
      overrideReason: isOverridden ? overrideReason : undefined
    };
    
    if (onComplete) {
      onComplete(payload);
    }
    toast.success('AUSTRAC Customer Risk Assessment stage complete!');
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'critical': return 'bg-red-500/15 text-red-300 border-red-500/30';
      case 'high': return 'bg-orange-500/15 text-orange-300 border-orange-500/30';
      case 'medium': return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      default: return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
    }
  };

  const getRiskLevelStyles = (lvl: string) => {
    switch (lvl) {
      case 'HIGH':
        return {
          bg: 'bg-gradient-to-r from-red-600 to-orange-600',
          text: 'text-red-400',
          badge: 'bg-red-500 text-white',
          desc: 'Immediate enhanced due diligence and senior management approval required.'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
          text: 'text-amber-400',
          badge: 'bg-amber-500 text-white',
          desc: 'Ongoing transaction monitoring and periodic verification required.'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
          text: 'text-green-400',
          badge: 'bg-green-500 text-white',
          desc: 'Standard due diligence controls apply.'
        };
    }
  };

  const levelStyles = getRiskLevelStyles(activeLevel);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Risk Banner */}
      <div className={`${levelStyles.bg} rounded-2xl p-6 text-white shadow-xl relative overflow-hidden`}>
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-10">
          <Shield className="w-80 h-80" />
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
              {activeLevel === 'HIGH' ? <ShieldAlert className="w-10 h-10" /> : <ShieldCheck className="w-10 h-10" />}
            </div>
            <div>
              <span className="text-white/80 text-xs font-bold uppercase tracking-widest">AUSTRAC Simulated Audit Stage</span>
              <h2 className="text-3xl font-extrabold tracking-tight">Customer Risk Assessment</h2>
              <p className="text-white/90 text-sm mt-1">Case: {data.caseId} | Subject: {data.clientName}</p>
            </div>
          </div>
          <div className="flex gap-4 items-center bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
            <div className="text-center">
              <p className="text-xs text-white/80 uppercase font-black tracking-widest">Computed Score</p>
              <p className="text-4xl font-black">{riskCalculation.score}<span className="text-xs text-white/60">/100</span></p>
            </div>
            <div className="h-10 w-[1px] bg-white/20 mx-2" />
            <div className="text-center">
              <p className="text-xs text-white/80 uppercase font-black tracking-widest">Active Tier</p>
              <Badge className="bg-white text-slate-100 font-bold px-3 py-1 mt-1">{activeLevel}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Score & Factors */}
        <div className="lg:col-span-2 space-y-6">
          {/* Risk Factors Checklist */}
          <Card className="border shadow-lg">
            <CardHeader className="bg-white/5/50 border-b">
              <CardTitle className="flex items-center gap-2 text-lg text-slate-100">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Security Risk Factors Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {riskCalculation.factors.length > 0 ? (
                riskCalculation.factors.map((factor, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl border border-white/10 hover:border-white/10 bg-white transition-all shadow-sm">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-100 text-sm">{factor.label}</h4>
                        <Badge className={`${getSeverityColor(factor.severity)} text-xs font-semibold px-2 py-0.5 border`}>
                          +{factor.impact} Impact
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{factor.desc}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 space-y-3">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                  <p className="text-slate-300 font-medium">No elevated risk factors detected. Standard KYC clean profile.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Override & Confirm Controls */}
        <div className="space-y-6">
          {/* Risk Governance & Override Card */}
          <Card className="border shadow-lg">
            <CardHeader className="bg-white/5/50 border-b">
              <CardTitle className="flex items-center gap-2 text-lg text-slate-100">
                <Settings className="w-5 h-5 text-blue-400" />
                Compliance Override Panel
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">System Computed Tier</label>
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Algorithm Scoring</span>
                  <Badge variant="outline" className="font-black text-slate-100">{riskCalculation.level}</Badge>
                </div>
              </div>

              {isOverridden && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300">
                  <p className="font-bold">⚠️ Compliance Override Active</p>
                  <p className="mt-1">Standard scoring overridden by officer. Justification attached to permanent audit logs.</p>
                </div>
              )}

              <div className="space-y-4 pt-2 border-t border-white/10">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Override Target Tier</label>
                  <select
                    value={overrideLevel}
                    onChange={(e) => setOverrideLevel(e.target.value as any)}
                    className="w-full bg-white border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Level...</option>
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Compliance Justification</label>
                  <textarea
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    rows={3}
                    className="w-full border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter explicit operational rationale for overriding Computed Risk Score..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleApplyOverride}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl"
                  >
                    Apply Override
                  </Button>
                  {isOverridden && (
                    <Button 
                      variant="outline"
                      onClick={handleResetOverride}
                      className="border border-red-500/30 hover:bg-red-500/10 text-red-400 text-xs font-bold py-2.5 rounded-xl"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confirm Risk Assessment Stage */}
          <Card className="border-2 border-green-500/30 shadow-lg bg-green-500/10/20">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-3">
                <ShieldCheck className="w-8 h-8 text-green-400 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">Lock Assessment</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Once locked, this score will be written to the active audit report.
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleConfirmAssessment}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-3.5 rounded-xl shadow-md"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Lock & Confirm Risk Tier
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
