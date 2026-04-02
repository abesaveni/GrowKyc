import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  ArrowLeft,
  TrendingUp,
  AlertTriangle,
  Shield,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  History,
  FileText,
  Lock,
  Unlock,
  Globe,
  Building,
  Users,
  DollarSign,
  Activity,
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Slider } from '../ui/slider';

interface CustomerRiskScoringEngineProps {
  clientId?: string;
  clientName?: string;
  onBack: () => void;
}

export function CustomerRiskScoringEngine({ 
  clientId = 'CL-2024-1847',
  clientName = 'Pinnacle Investment Group Pty Ltd',
  onBack 
}: CustomerRiskScoringEngineProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  // 10-Factor Risk Scoring Model
  const [riskFactors, setRiskFactors] = useState({
    jurisdiction: { score: 3, weight: 15, rationale: 'Australian domiciled with operations in Singapore (Medium Risk jurisdiction)' },
    entityType: { score: 4, weight: 10, rationale: 'Private company with complex corporate structure' },
    ownershipComplexity: { score: 5, weight: 15, rationale: 'Multi-tier ownership structure with offshore trust involvement' },
    pepMatch: { score: 2, weight: 15, rationale: 'No direct PEP matches, minor family association flagged' },
    sanctionsMatch: { score: 1, weight: 20, rationale: 'No sanctions matches identified' },
    sourceOfFunds: { score: 3, weight: 10, rationale: 'Mixed funding sources including international investors' },
    serviceRisk: { score: 4, weight: 5, rationale: 'High-value investment advisory services' },
    deliveryChannel: { score: 2, weight: 5, rationale: 'Face-to-face with digital document exchange' },
    adverseMedia: { score: 3, weight: 5, rationale: '1 minor adverse media mention regarding business dispute' }
  });

  // Calculate weighted score
  const calculateWeightedScore = () => {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    Object.values(riskFactors).forEach(factor => {
      totalWeightedScore += (factor.score * factor.weight);
      totalWeight += factor.weight;
    });

    return (totalWeightedScore / totalWeight).toFixed(1);
  };

  const weightedScore = parseFloat(calculateWeightedScore());

  // Determine risk band
  const getRiskBand = (score: number) => {
    if (score >= 8) return { label: 'EXTREME', color: 'bg-red-600', textColor: 'text-red-600' };
    if (score >= 6) return { label: 'HIGH', color: 'bg-orange-600', textColor: 'text-orange-600' };
    if (score >= 4) return { label: 'MEDIUM', color: 'bg-amber-600', textColor: 'text-amber-600' };
    return { label: 'LOW', color: 'bg-green-600', textColor: 'text-green-600' };
  };

  const riskBand = getRiskBand(weightedScore);

  // Risk change history
  const riskHistory = [
    {
      date: '2024-03-15',
      score: 5.8,
      band: 'MEDIUM',
      changedBy: 'Sarah Chen',
      reason: 'Annual review - no material changes',
      type: 'review'
    },
    {
      date: '2024-01-20',
      score: 6.2,
      band: 'HIGH',
      changedBy: 'Michael Roberts',
      reason: 'Override: Downgraded from HIGH to MEDIUM after enhanced due diligence completed',
      type: 'override'
    },
    {
      date: '2023-10-10',
      score: 6.5,
      band: 'HIGH',
      changedBy: 'Emma Williams',
      reason: 'Adverse media flag added - business dispute identified',
      type: 'increase'
    },
    {
      date: '2023-06-01',
      score: 5.2,
      band: 'MEDIUM',
      changedBy: 'System',
      reason: 'Initial risk assessment completed',
      type: 'initial'
    }
  ];

  // Escalation triggers
  const escalationTriggers = [
    { condition: 'Risk Score >= 8.0', triggered: false, action: 'Immediate Senior Partner review required' },
    { condition: 'Risk Score >= 6.0', triggered: false, action: 'Enhanced Due Diligence (EDD) required' },
    { condition: 'PEP Match Score >= 4', triggered: false, action: 'PEP-specific enhanced monitoring' },
    { condition: 'Sanctions Match Score >= 2', triggered: true, action: 'Sanctions review and approval required' },
    { condition: 'Adverse Media Score >= 4', triggered: false, action: 'Adverse media investigation' },
    { condition: 'Ownership Complexity >= 6', triggered: false, action: 'Beneficial ownership verification' }
  ];

  const factorIcons = {
    jurisdiction: Globe,
    entityType: Building,
    ownershipComplexity: Users,
    pepMatch: Shield,
    sanctionsMatch: AlertTriangle,
    sourceOfFunds: DollarSign,
    serviceRisk: Activity,
    deliveryChannel: Smartphone,
    adverseMedia: AlertCircle
  };

  const factorLabels = {
    jurisdiction: 'Jurisdiction Risk',
    entityType: 'Entity Type Risk',
    ownershipComplexity: 'Ownership Complexity',
    pepMatch: 'PEP Match Risk',
    sanctionsMatch: 'Sanctions Match Risk',
    sourceOfFunds: 'Source of Funds Risk',
    serviceRisk: 'Service Risk',
    deliveryChannel: 'Delivery Channel Risk',
    adverseMedia: 'Adverse Media Flag'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#13B5EA] to-[#0E7C9E] text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="h-6 w-px bg-white/30" />
            <TrendingUp className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-bold">Customer Risk Scoring Engine</h1>
              <p className="text-sm text-white/90">AUSTRAC-Compliant 10-Factor Risk Assessment</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20"
              onClick={() => setIsEditMode(!isEditMode)}
            >
              {isEditMode ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
              {isEditMode ? 'Save Changes' : 'Edit Score'}
            </Button>
          </div>
        </div>
      </div>

      {/* Client Info Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-xs text-gray-600">Client ID</div>
              <div className="font-semibold text-gray-900">{clientId}</div>
            </div>
            <div className="h-8 w-px bg-gray-300" />
            <div>
              <div className="text-xs text-gray-600">Client Name</div>
              <div className="font-semibold text-gray-900">{clientName}</div>
            </div>
            <div className="h-8 w-px bg-gray-300" />
            <div>
              <div className="text-xs text-gray-600">Last Scored</div>
              <div className="font-semibold text-gray-900">2024-03-15</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Risk Score Summary Card */}
        <Card className="mb-6 border-2 border-cyan-200">
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-cyan-600" />
              Overall Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Weighted Score */}
              <div className="text-center">
                <div className="text-6xl font-bold text-cyan-600 mb-2">{weightedScore}</div>
                <div className="text-sm text-gray-600 mb-4">Weighted Risk Score (out of 10)</div>
                <Progress value={weightedScore * 10} className="h-3" />
              </div>

              {/* Risk Band */}
              <div className="text-center">
                <div className={`text-4xl font-bold ${riskBand.textColor} mb-2`}>{riskBand.label}</div>
                <div className="text-sm text-gray-600 mb-4">Risk Band Classification</div>
                <Badge className={`${riskBand.color} text-white text-lg px-6 py-2`}>
                  {riskBand.label} RISK CLIENT
                </Badge>
              </div>

              {/* Actions Required */}
              <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-200">
                <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Actions Required
                </h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  {weightedScore >= 6 && <li>✓ Enhanced Due Diligence (EDD)</li>}
                  {weightedScore >= 4 && <li>✓ Annual review required</li>}
                  {riskFactors.ownershipComplexity.score >= 5 && <li>✓ Beneficial ownership verification</li>}
                  {riskFactors.adverseMedia.score >= 3 && <li>✓ Adverse media monitoring</li>}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="factors" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="factors">
              <TrendingUp className="w-4 h-4 mr-2" />
              Risk Factors
            </TabsTrigger>
            <TabsTrigger value="escalations">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Escalations
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="override">
              <Lock className="w-4 h-4 mr-2" />
              Override
            </TabsTrigger>
          </TabsList>

          {/* RISK FACTORS TAB */}
          <TabsContent value="factors">
            <div className="grid gap-4">
              {Object.entries(riskFactors).map(([key, factor]) => {
                const Icon = factorIcons[key as keyof typeof factorIcons];
                const label = factorLabels[key as keyof typeof factorLabels];
                const factorRiskBand = getRiskBand(factor.score);

                return (
                  <Card key={key} className="border-2 border-gray-200">
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-12 gap-6 items-center">
                        {/* Icon & Label */}
                        <div className="md:col-span-3 flex items-center gap-3">
                          <Icon className="w-8 h-8 text-cyan-600" />
                          <div>
                            <div className="font-bold text-gray-900">{label}</div>
                            <div className="text-xs text-gray-600">Weight: {factor.weight}%</div>
                          </div>
                        </div>

                        {/* Score Slider */}
                        <div className="md:col-span-5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Risk Level</span>
                            <span className={`text-2xl font-bold ${factorRiskBand.textColor}`}>
                              {factor.score}/10
                            </span>
                          </div>
                          {isEditMode ? (
                            <Slider
                              value={[factor.score]}
                              min={1}
                              max={10}
                              step={1}
                              onValueChange={(value) => {
                                setRiskFactors(prev => ({
                                  ...prev,
                                  [key]: { ...prev[key as keyof typeof prev], score: value[0] }
                                }));
                              }}
                              className="cursor-pointer"
                            />
                          ) : (
                            <Progress value={factor.score * 10} className="h-3" />
                          )}
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Low</span>
                            <span>Medium</span>
                            <span>High</span>
                            <span>Extreme</span>
                          </div>
                        </div>

                        {/* Risk Band Badge */}
                        <div className="md:col-span-2 text-center">
                          <Badge className={`${factorRiskBand.color} text-white text-sm px-4 py-2`}>
                            {factorRiskBand.label}
                          </Badge>
                        </div>

                        {/* Weighted Contribution */}
                        <div className="md:col-span-2 text-right">
                          <div className="text-xs text-gray-600 mb-1">Contribution</div>
                          <div className="text-2xl font-bold text-gray-900">
                            {((factor.score * factor.weight) / 100).toFixed(1)}
                          </div>
                        </div>
                      </div>

                      {/* Rationale */}
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-xs font-semibold text-gray-700 mb-1">Rationale:</div>
                        {isEditMode ? (
                          <Textarea
                            value={factor.rationale}
                            onChange={(e) => {
                              setRiskFactors(prev => ({
                                ...prev,
                                [key]: { ...prev[key as keyof typeof prev], rationale: e.target.value }
                              }));
                            }}
                            className="text-sm"
                            rows={2}
                          />
                        ) : (
                          <p className="text-sm text-gray-700">{factor.rationale}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Score Breakdown */}
            <Card className="mt-6 border-2 border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle>Score Calculation Breakdown</CardTitle>
                <CardDescription>How the weighted score is calculated</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2 text-sm">
                  {Object.entries(riskFactors).map(([key, factor]) => (
                    <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-700">{factorLabels[key as keyof typeof factorLabels]}</span>
                      <span className="font-mono text-gray-900">
                        {factor.score} × {factor.weight}% = {((factor.score * factor.weight) / 100).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t-2 border-gray-300 pt-2 mt-2">
                    <div className="flex items-center justify-between font-bold text-lg">
                      <span>Weighted Average Risk Score:</span>
                      <span className={`${riskBand.textColor}`}>{weightedScore} / 10</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ESCALATIONS TAB */}
          <TabsContent value="escalations">
            <Card>
              <CardHeader>
                <CardTitle>Escalation Triggers</CardTitle>
                <CardDescription>Automated alerts and required actions based on risk score</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {escalationTriggers.map((trigger, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-2 ${
                        trigger.triggered
                          ? 'bg-red-50 border-red-300'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {trigger.triggered ? (
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                            ) : (
                              <CheckCircle className="w-5 h-5 text-gray-400" />
                            )}
                            <span className="font-bold text-gray-900">{trigger.condition}</span>
                          </div>
                          <p className="text-sm text-gray-700 ml-7">{trigger.action}</p>
                        </div>
                        <Badge className={trigger.triggered ? 'bg-red-600' : 'bg-gray-400'}>
                          {trigger.triggered ? 'TRIGGERED' : 'Not Triggered'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* HISTORY TAB */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Risk Score Change History</CardTitle>
                <CardDescription>Complete audit trail of risk score changes</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {riskHistory.map((entry, idx) => {
                    const entryBand = getRiskBand(entry.score);
                    return (
                      <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className={`w-3 h-3 rounded-full mt-1.5 ${
                          entry.type === 'increase' ? 'bg-red-600' :
                          entry.type === 'override' ? 'bg-amber-600' :
                          entry.type === 'review' ? 'bg-blue-600' :
                          'bg-green-600'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-bold text-gray-900">{entry.score}</span>
                              <Badge className={entryBand.color}>{entry.band}</Badge>
                            </div>
                            <span className="text-sm text-gray-600">{entry.date}</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-1">{entry.reason}</p>
                          <div className="text-xs text-gray-600">Changed by: {entry.changedBy}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* OVERRIDE TAB */}
          <TabsContent value="override">
            <Card className="border-2 border-amber-200">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-600" />
                  Risk Score Override
                </CardTitle>
                <CardDescription>
                  Manual override requires senior approval and detailed justification
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-300 mb-6">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-900">Override Warning</p>
                      <p className="text-xs text-amber-700 mt-1">
                        Risk score overrides must be approved by a Senior Partner and documented with clear rationale. 
                        All overrides are logged in the audit trail and subject to independent review.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Current Calculated Score</Label>
                      <div className="text-3xl font-bold text-cyan-600 mt-2">{weightedScore}</div>
                    </div>
                    <div>
                      <Label>Current Risk Band</Label>
                      <Badge className={`${riskBand.color} text-white text-lg px-4 py-2 mt-2`}>
                        {riskBand.label}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label>Override Score</Label>
                    <Input type="number" min="1" max="10" step="0.1" placeholder="Enter override score" className="mt-2" />
                  </div>

                  <div>
                    <Label>Override Reason (Required)</Label>
                    <Textarea 
                      placeholder="Provide detailed justification for risk score override..."
                      rows={4}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Approving Officer</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select senior partner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="michael">Michael Roberts (Managing Partner)</SelectItem>
                        <SelectItem value="david">David Thompson (Senior Partner)</SelectItem>
                        <SelectItem value="sarah">Sarah Chen (Head of Compliance)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      <Unlock className="w-4 h-4 mr-2" />
                      Submit Override for Approval
                    </Button>
                    <Button variant="outline">
                      Cancel
                    </Button>
                  </div>
                </div>

                {/* Previous Overrides */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4">Previous Overrides</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">Override: 6.2 → 5.8</span>
                        <Badge className="bg-green-600">Approved</Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">
                        Enhanced due diligence completed. No adverse findings. Client relationship &gt; 3 years with no incidents.
                      </p>
                      <div className="text-xs text-gray-600">
                        Approved by: Michael Roberts | Date: 2024-01-20
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
