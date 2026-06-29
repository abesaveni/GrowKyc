import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  AlertTriangle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  CheckCircle,
  XCircle,
  Shield,
  FileText,
  Globe,
  Clock,
  ChevronDown,
  ChevronUp,
  Link as LinkIcon
} from 'lucide-react';
import { HighRiskTransaction, SourceOfFundsProof } from './HighRiskTransactionsData';

interface HighRiskTransactionsDisplayProps {
  transactions: HighRiskTransaction[];
  sourceOfFundsProof: SourceOfFundsProof[];
}

export function HighRiskTransactionsDisplay({ transactions, sourceOfFundsProof }: HighRiskTransactionsDisplayProps) {
  const [expandedTxId, setExpandedTxId] = useState<string | null>(null);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      default: return 'bg-yellow-500';
    }
  };

  const getRiskBg = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'bg-red-500/10 border-red-300';
      case 'High': return 'bg-orange-500/10 border-orange-300';
      default: return 'bg-yellow-500/10 border-yellow-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reported to AUSTRAC': return 'bg-red-500/15 text-red-300 border-red-300';
      case 'Escalated': return 'bg-orange-500/15 text-orange-300 border-orange-300';
      case 'Under Review': return 'bg-yellow-500/15 text-yellow-300 border-yellow-300';
      default: return 'bg-green-500/15 text-green-300 border-green-300';
    }
  };

  const getProofIcon = (type: string) => {
    switch (type) {
      case 'LinkedIn Profile': return <LinkIcon className="w-5 h-5 text-blue-400" />;
      case 'Company Website': return <Globe className="w-5 h-5 text-green-400" />;
      case 'Business Registration': return <FileText className="w-5 h-5 text-purple-400" />;
      case 'News Article': return <FileText className="w-5 h-5 text-orange-400" />;
      case 'Annual Report': return <FileText className="w-5 h-5 text-cyan-400" />;
      default: return <LinkIcon className="w-5 h-5 text-slate-300" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* HIGH RISK TRANSACTIONS SECTION */}
      {transactions.length > 0 && (
        <Card className="border-2 border-red-400 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b-2 border-red-500/30">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              High Risk Transactions Detected ({transactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {transactions.map((tx) => {
                const isExpanded = expandedTxId === tx.id;
                
                return (
                  <div key={tx.id} className={`border-2 rounded-lg ${getRiskBg(tx.riskLevel)}`}>
                    {/* Transaction Header */}
                    <div 
                      className="p-4 cursor-pointer hover:bg-opacity-70 transition-all"
                      onClick={() => setExpandedTxId(isExpanded ? null : tx.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-lg text-slate-100">{tx.type}</h4>
                            <Badge className={`${getRiskColor(tx.riskLevel)} text-white`}>
                              {tx.riskLevel} Risk
                            </Badge>
                            <Badge className={`border ${getStatusColor(tx.investigationStatus)}`}>
                              {tx.investigationStatus}
                            </Badge>
                            {tx.direction === 'Inbound' ? (
                              <TrendingDown className="w-5 h-5 text-green-400" />
                            ) : (
                              <TrendingUp className="w-5 h-5 text-red-400" />
                            )}
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-xs text-slate-300">Amount</p>
                              <p className="font-bold text-xl text-slate-100">{tx.amount}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-300">Date</p>
                              <p className="font-semibold text-slate-100">{tx.date}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-300">Counterparty</p>
                              <p className="font-semibold text-slate-100">{tx.counterparty}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-300">Location</p>
                              <p className="font-semibold text-slate-100">{tx.counterpartyLocation}</p>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </Button>
                      </div>

                      {/* Risk Flags Summary (Always Visible) */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-semibold text-red-300">{tx.riskFlags.length} Risk Flags Identified</span>
                        <span className="text-xs text-slate-300">• Click to see details</span>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t-2 border-white/10 p-4 space-y-4 bg-white bg-opacity-50">
                        {/* Risk Flags */}
                        <div className="bg-red-500/15 border-2 border-red-400 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                            <h5 className="font-bold text-red-300">Risk Flags</h5>
                          </div>
                          <ul className="space-y-2">
                            {tx.riskFlags.map((flag, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-red-300">{flag}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* AML Concerns */}
                        <div className="bg-orange-500/15 border-2 border-orange-400 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-5 h-5 text-orange-400" />
                            <h5 className="font-bold text-orange-300">AML/CTF Concerns</h5>
                          </div>
                          <ul className="space-y-2">
                            {tx.amlConcerns.map((concern, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-orange-300">{concern}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Investigation Notes */}
                        {tx.investigationNotes && (
                          <div className="bg-blue-500/15 border-2 border-blue-400 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-5 h-5 text-blue-400" />
                              <h5 className="font-bold text-blue-300">Investigation Notes</h5>
                            </div>
                            <p className="text-sm text-blue-300">{tx.investigationNotes}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="text-xs">
                            <FileText className="w-3 h-3 mr-1" />
                            View Full Report
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            Investigation Timeline
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SOURCE OF FUNDS PROOF SECTION */}
      <Card className="border-2 border-blue-300 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="w-6 h-6 text-blue-400" />
            Source of Funds - Verification & Proof
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {sourceOfFundsProof.length > 0 ? (
            <div className="space-y-3">
              {sourceOfFundsProof.map((proof, idx) => (
                <div 
                  key={idx} 
                  className={`border-2 rounded-lg p-4 ${
                    proof.verified 
                      ? 'bg-green-500/10 border-green-300 hover:bg-green-500/15' 
                      : 'bg-red-500/10 border-red-300 hover:bg-red-500/15'
                  } transition-all cursor-pointer`}
                  onClick={() => window.open(proof.url, '_blank')}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getProofIcon(proof.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-bold text-slate-100">{proof.title}</h5>
                        {proof.verified ? (
                          <Badge className="bg-green-500 text-white flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500 text-white flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Unverified
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {proof.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-300 mb-2">{proof.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-300">
                        <div className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          <span className="truncate max-w-xs">{proof.url}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Checked: {proof.lastChecked}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <ExternalLink className={`w-5 h-5 ${proof.verified ? 'text-green-400' : 'text-red-400'}`} />
                    </div>
                  </div>
                </div>
              ))}

              {/* Verification Summary */}
              <div className={`rounded-lg p-4 border-2 mt-4 ${
                sourceOfFundsProof.every(p => p.verified)
                  ? 'bg-green-500/15 border-green-400'
                  : 'bg-orange-500/15 border-orange-400'
              }`}>
                <div className="flex items-center gap-2">
                  {sourceOfFundsProof.every(p => p.verified) ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="font-bold text-green-300">All Source of Funds Verified</p>
                        <p className="text-sm text-green-300">
                          {sourceOfFundsProof.length} independent sources confirmed and cross-checked
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-orange-400" />
                      <div>
                        <p className="font-bold text-orange-300">Source of Funds Verification Incomplete</p>
                        <p className="text-sm text-orange-300">
                          {sourceOfFundsProof.filter(p => !p.verified).length} of {sourceOfFundsProof.length} sources could not be verified
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 rounded-lg p-6 text-center border border-white/10">
              <p className="text-slate-300">No source of funds verification links available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Alert */}
      {transactions.length > 0 && (
        <Card className="border-2 border-red-400 bg-red-500/10">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-300 mb-1">
                  CRITICAL: {transactions.filter(t => t.riskLevel === 'Critical').length} Critical Risk Transactions Detected
                </p>
                <p className="text-sm text-red-300">
                  Enhanced due diligence required. {transactions.filter(t => t.investigationStatus === 'Reported to AUSTRAC').length} transactions reported to AUSTRAC.
                  Immediate senior management review recommended.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
