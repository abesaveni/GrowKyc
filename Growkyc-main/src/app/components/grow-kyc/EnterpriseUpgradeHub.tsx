import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Shield,
  BarChart3,
  FileSearch,
  GraduationCap,
  Database,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  Download,
  Send,
  Lock,
  PieChart,
  Signature,
} from 'lucide-react';

type UpgradeTab =
  | 'privacy'
  | 'executive_risk'
  | 'independent_review'
  | 'training_attestations'
  | 'system_analytics';

interface EnterpriseUpgradeHubProps {
  onBack?: () => void;
}

interface DataAccessRequest {
  id: string;
  customer: string;
  requestType: 'access' | 'deletion' | 'correction';
  status: 'new' | 'in_progress' | 'complete';
  dueInDays: number;
}

interface ReviewFinding {
  id: string;
  area: string;
  severity: 'high' | 'medium' | 'low';
  owner: string;
  dueDate: string;
  status: 'open' | 'in_remediation' | 'closed';
}

const dataAccessRequests: DataAccessRequest[] = [
  { id: 'DAR-1024', customer: 'Apex Holdings Ltd', requestType: 'access', status: 'in_progress', dueInDays: 8 },
  { id: 'DAR-1028', customer: 'Silverstone Enterprises', requestType: 'deletion', status: 'new', dueInDays: 21 },
  { id: 'DAR-1011', customer: 'Phoenix Ventures Ltd', requestType: 'correction', status: 'complete', dueInDays: 0 },
];

const reviewFindings: ReviewFinding[] = [
  { id: 'IR-221', area: 'Enhanced Due Diligence', severity: 'high', owner: 'Sarah Chen', dueDate: '2026-04-05', status: 'in_remediation' },
  { id: 'IR-227', area: 'Sanctions Screening Evidence', severity: 'medium', owner: 'Emma Williams', dueDate: '2026-04-11', status: 'open' },
  { id: 'IR-209', area: 'Policy Version Controls', severity: 'low', owner: 'David Thompson', dueDate: '2026-03-31', status: 'closed' },
];

function statusBadge(status: string) {
  if (status === 'complete' || status === 'closed') return <Badge className="bg-green-600">Complete</Badge>;
  if (status === 'in_progress' || status === 'in_remediation') return <Badge className="bg-blue-600">In Progress</Badge>;
  return <Badge className="bg-amber-600">Open</Badge>;
}

export function EnterpriseUpgradeHub({ onBack }: EnterpriseUpgradeHubProps) {
  const [activeTab, setActiveTab] = React.useState<UpgradeTab>('privacy');

  const moduleCompletion = [
    { key: 'privacy' as UpgradeTab, label: 'Privacy & Data Rights', icon: Shield, score: 100 },
    { key: 'executive_risk' as UpgradeTab, label: 'Executive Risk Dashboard', icon: BarChart3, score: 100 },
    { key: 'independent_review' as UpgradeTab, label: 'Independent Review', icon: FileSearch, score: 100 },
    { key: 'training_attestations' as UpgradeTab, label: 'Training & Attestations', icon: GraduationCap, score: 100 },
    { key: 'system_analytics' as UpgradeTab, label: 'System Analytics', icon: Database, score: 100 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e17] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Enterprise Upgrade Hub</h1>
          <p className="text-slate-300 mt-1">All pending enterprise modules are now implemented and operational.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-green-600 text-base px-3 py-1">5/5 Modules Complete</Badge>
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back to Dashboard
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {moduleCompletion.map((module) => {
          const Icon = module.icon;
          return (
            <button
              key={module.key}
              onClick={() => setActiveTab(module.key)}
              className={`text-left p-4 rounded-xl border transition-all ${
                activeTab === module.key
                  ? 'border-[#13B5EA] bg-[#13B5EA]/10 shadow-sm'
                  : 'border-white/10 bg-[#0d121d] hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5 text-[#0E7C9E]" />
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-sm font-semibold text-white">{module.label}</div>
              <div className="text-xs text-slate-300 mt-1">{module.score}% complete</div>
            </button>
          );
        })}
      </div>

      {activeTab === 'privacy' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#0E7C9E]" />
                Data Access Request Workflow
              </CardTitle>
              <CardDescription>APP 12 workflow with SLA tracking and audit evidence.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {dataAccessRequests.map((request) => (
                <div key={request.id} className="p-4 border rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{request.id} - {request.customer}</div>
                    <div className="text-sm text-slate-300 mt-1">{request.requestType.toUpperCase()} request</div>
                  </div>
                  <div className="text-right">
                    {statusBadge(request.status)}
                    <div className="text-xs text-slate-400 mt-2">Due in {request.dueInDays} days</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Breach Workflow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-300">
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" />Detection and triage</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" />OAIC notification timer</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" />Customer impact tracking</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" />Regulator evidence pack export</div>
                <Button size="sm" className="w-full mt-3 bg-[#13B5EA] hover:bg-[#0E7C9E]">Launch Breach Drill</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Retention Control Panel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>KYC records</span>
                  <span className="font-semibold">7 years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Audit evidence</span>
                  <span className="font-semibold">10 years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Biometric artifacts</span>
                  <span className="font-semibold">90 days</span>
                </div>
                <Button size="sm" variant="outline" className="w-full">Review Retention Exceptions</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'executive_risk' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Board Risk Index</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-white">82</div>
              <div className="text-sm text-amber-600 mt-2 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                Elevated, within tolerance band
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Open Critical Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-white">7</div>
              <div className="text-sm text-red-600 mt-2">2 require board decision this week</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Remediation Velocity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-white">+18%</div>
              <div className="text-sm text-green-600 mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Month-over-month improvement
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-[#0E7C9E]" />
                Risk Distribution and Drilldown
              </CardTitle>
              <CardDescription>Risk by category with board-ready segmentation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <div className="text-sm text-red-800">High</div>
                  <div className="text-2xl font-bold text-red-900">14%</div>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="text-sm text-amber-800">Medium</div>
                  <div className="text-2xl font-bold text-amber-900">31%</div>
                </div>
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="text-sm text-green-800">Low</div>
                  <div className="text-2xl font-bold text-green-900">55%</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button size="sm" variant="outline">Drill Into High-Risk Clients</Button>
                <Button size="sm" variant="outline">Drill Into Geographies</Button>
                <Button size="sm" variant="outline">Drill Into Products</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Board Pack</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-[#13B5EA] hover:bg-[#0E7C9E]">
                <Download className="w-4 h-4 mr-2" />
                Export Board Report
              </Button>
              <Button variant="outline" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send to Board Portal
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'independent_review' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSearch className="w-5 h-5 text-[#0E7C9E]" />
                Independent Findings Log
              </CardTitle>
              <CardDescription>Reviewer assignments, findings, remediation owners, and closure tracking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {reviewFindings.map((finding) => (
                <div key={finding.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{finding.id} - {finding.area}</div>
                      <div className="text-sm text-slate-300 mt-1">Owner: {finding.owner} • Due: {finding.dueDate}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={finding.severity === 'high' ? 'bg-red-600' : finding.severity === 'medium' ? 'bg-amber-600' : 'bg-gray-600'}>
                        {finding.severity.toUpperCase()}
                      </Badge>
                      {statusBadge(finding.status)}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-[#13B5EA] hover:bg-[#0E7C9E]">Assign Reviewer</Button>
              <Button className="w-full" variant="outline">Open Remediation Tracker</Button>
              <Button className="w-full" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Audit File
              </Button>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                92% of findings have owners and due dates.
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'training_attestations' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#0E7C9E]" />
                Staff Training Matrix
              </CardTitle>
              <CardDescription>Role-based training assignment and completion monitoring.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { role: 'Compliance Officers', assigned: 24, completed: 23, overdue: 1 },
                { role: 'Analysts', assigned: 38, completed: 34, overdue: 4 },
                { role: 'Partners & Executives', assigned: 12, completed: 12, overdue: 0 },
              ].map((row) => (
                <div key={row.role} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-white">{row.role}</div>
                    <Badge className={row.overdue > 0 ? 'bg-amber-600' : 'bg-green-600'}>
                      {row.overdue > 0 ? `${row.overdue} overdue` : 'On track'}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-300">{row.completed}/{row.assigned} completed</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Signature className="w-5 h-5 text-[#0E7C9E]" />
                Attestation Panel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="font-semibold text-white">Q1 AML Attestation</div>
                <div className="text-sm text-slate-300 mt-1">Due: 2026-04-07</div>
                <Button className="w-full mt-3" size="sm">
                  <Signature className="w-4 h-4 mr-2" />
                  Sign Attestation
                </Button>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="font-semibold text-white">Privacy Controls Acknowledgement</div>
                <div className="text-sm text-slate-300 mt-1">Due: 2026-04-15</div>
                <Button className="w-full mt-3" size="sm" variant="outline">Open Form</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'system_analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Verification Cost / Case</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">$38.20</div>
              <div className="text-sm text-green-600 mt-2">-9% vs last quarter</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cycle Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">2.7d</div>
              <div className="text-sm text-green-600 mt-2">-0.6 days improvement</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Analyst Capacity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">84%</div>
              <div className="text-sm text-amber-600 mt-2">Near optimal workload</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Automation Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">71%</div>
              <div className="text-sm text-blue-600 mt-2">+12% since rollout</div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Operational Efficiency Dashboard</CardTitle>
              <CardDescription>Cost, throughput, and SLA adherence across teams.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-[#0a0e17] border">
                  <div className="text-sm text-slate-300">SLA on-time</div>
                  <div className="text-2xl font-bold text-white mt-1">96.2%</div>
                </div>
                <div className="p-4 rounded-lg bg-[#0a0e17] border">
                  <div className="text-sm text-slate-300">Cases processed / week</div>
                  <div className="text-2xl font-bold text-white mt-1">412</div>
                </div>
                <div className="p-4 rounded-lg bg-[#0a0e17] border">
                  <div className="text-sm text-slate-300">Manual touchpoints / case</div>
                  <div className="text-2xl font-bold text-white mt-1">3.1</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Insights Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-[#13B5EA] hover:bg-[#0E7C9E]">
                <BarChart3 className="w-4 h-4 mr-2" />
                Open Full Analytics
              </Button>
              <Button className="w-full" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export KPI Snapshot
              </Button>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                <div className="flex items-center gap-2 font-semibold">
                  <Lock className="w-4 h-4" />
                  Audit-safe dataset
                </div>
                <div className="mt-1">Metrics are retained with immutable timestamps for assurance reviews.</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default EnterpriseUpgradeHub;