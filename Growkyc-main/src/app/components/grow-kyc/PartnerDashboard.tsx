import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import {
  Shield,
  TrendingUp,
  Clock,
  Users,
  Activity,
  Target,
  XCircle,
  AlertCircle,
  X,
  Check,
  Zap,
  Flag,
  AlertTriangle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

import {
  regulatoryComplianceStatusData,
  strategicInsightsData
} from './mockDashboardData';

import { ClientsDB } from '../kyc/ClientsDatabase';
import { toast } from '../../lib/toast';

export interface PartnerDashboardProps {
  userName: string;
  userRole: string;
  userTitle: string;
  userAvatar: string;
  onNavigateToClients?: () => void;
  onNavigateToCases?: () => void;
  onNavigateToCaseControl?: () => void;
  onNavigateToMonitoring?: () => void;
  onNavigateToAUSTRAC?: () => void;
  onNavigateToActionItems?: () => void;
  onNavigateToClient?: (clientId: string) => void;
  onNavigateToRequirements?: () => void;
}

export function PartnerDashboard({
  userName,
  userRole,
  userTitle,
  userAvatar,
  onNavigateToClients,
  onNavigateToCases,
  onNavigateToCaseControl,
  onNavigateToMonitoring,
  onNavigateToAUSTRAC,
  onNavigateToActionItems,
  onNavigateToClient,
  onNavigateToRequirements,
}: PartnerDashboardProps) {
  const navigate = useNavigate();
  const { role } = useParams();
  const [approvalModalOpen, setApprovalModalOpen] = React.useState(false);
  const [selectedApproval, setSelectedApproval] = React.useState<any>(null);
  const [approvalComment, setApprovalComment] = React.useState('');

  // Partner dynamic stats state
  const [partnerStats, setPartnerStats] = React.useState({
    totalClients: 452,
    activeClients: 326,
    highRiskClients: 13,
    criticalRiskClients: 3,
    openInvestigations: 24,
    openEddReviews: 8,
    smrsSubmitted: 42,
    overdueReviews: 12,
    slaBreaches: 4,
    complianceIncidents: 1,
    targetAchievement: 98.2,
    itemsNeedApproval: 12,
    urgentItems: 3
  });

  const [clients, setClients] = React.useState<any[]>([]);
  const [caseRefreshKey, setCaseRefreshKey] = React.useState(0);

  React.useEffect(() => {
    setClients(ClientsDB.getClients());
    return ClientsDB.subscribe(setClients);
  }, []);

  React.useEffect(() => {
    const onCasesUpdated = () => setCaseRefreshKey((k) => k + 1);
    window.addEventListener('growkyc:cases_updated', onCasesUpdated);
    return () => window.removeEventListener('growkyc:cases_updated', onCasesUpdated);
  }, []);

  // Derived compliance statistics
  const complianceOfficerStats = React.useMemo(() => {
    const total = clients.length;
    const activeClients = clients.filter(c => c.status === 'Active' || c.status === 'verified').length;
    
    const verifiedClients = clients.filter(c => c.quickStatus?.identity === 'Verified' || c.status === 'Active').length;

    return {
      activeClients,
      completedToday: clients.filter(c => c.lastReview === new Date().toISOString().split('T')[0]).length,
    };
  }, [clients]);

  const partnerApprovalsData = React.useMemo(() => {
    return clients
      .filter(c => c.status === 'Under Review')
      .map(c => ({
        item: `High Risk Client Onboarding - ${c.name}`,
        type: 'New Client',
        priority: c.amlData?.riskRating === 'Critical' || c.amlData?.riskRating === 'High' ? 'High' : 'Medium'
      }));
  }, [clients]);

  React.useEffect(() => {
    if (clients.length === 0) return;
    const interval = setInterval(() => {
      // Dynamically update partner stats occasionally
      setPartnerStats(prev => {
        const clientChange = Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0;
        const approvalChange = Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        
        return {
          ...prev,
          activeClients: prev.activeClients + clientChange,
          totalClients: prev.totalClients + clientChange,
          itemsNeedApproval: Math.max(0, prev.itemsNeedApproval + approvalChange),
          targetAchievement: Math.min(100, Math.max(90, parseFloat((prev.targetAchievement + (Math.random() > 0.5 ? 0.1 : -0.1)).toFixed(1))))
        };
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [clients.length]);

  return (
    <div className="bg-white min-h-screen">
      <div className="space-y-6 bg-white min-h-screen px-4 md:px-8 pb-8">
        {/* Executive Welcome */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 md:p-8 text-white mt-4 md:mt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4">
              <div className="text-5xl">{userAvatar}</div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Executive Overview</h1>
                <p className="text-purple-100 text-base">{userName} • {userTitle}</p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-xs md:text-sm text-purple-100">Overall Compliance Health</div>
              <div className="text-3xl md:text-4xl font-bold">{partnerStats.targetAchievement}%</div>
            </div>
          </div>
        </div>

        {/* Executive Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card
            className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 border-0 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
            onClick={onNavigateToClients}
          >
            <CardContent className="p-5 md:p-8 relative z-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-500" />
              <Users className="w-10 h-10 md:w-12 md:h-12 text-white/90 mb-4 drop-shadow-lg group-hover:scale-110 transition-transform" />
              <div className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-md">{partnerStats.activeClients}</div>
              <div className="text-xs md:text-sm font-semibold text-white/80 uppercase tracking-wide">Active Clients</div>
              <div className="mt-3 flex items-center text-white/60 text-[10px] md:text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>{complianceOfficerStats.activeClients} active</span>
              </div>
            </CardContent>
          </Card>

          <Card
            className="relative overflow-hidden bg-gradient-to-br from-amber-600 to-orange-700 border-0 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
            onClick={() => {
              // Scroll to approvals section
              setTimeout(() => {
                const approvalsCard = document.querySelector('[data-approvals-section]');
                if (approvalsCard) {
                  approvalsCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  // Flash the card to draw attention
                  approvalsCard.classList.add('ring-4', 'ring-amber-400');
                  setTimeout(() => {
                    approvalsCard.classList.remove('ring-4', 'ring-amber-400');
                  }, 2000);
                }
              }, 100);
            }}
          >
            <CardContent className="p-5 md:p-8 relative z-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <AlertCircle className="w-10 h-10 md:w-12 md:h-12 text-white/90 mb-4 drop-shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white/80 rounded-full animate-pulse" />
              </div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-md">{partnerStats.itemsNeedApproval}</div>
              <div className="text-xs md:text-sm font-semibold text-white/80 uppercase tracking-wide">Items Need Approval</div>
              <div className="mt-3 flex items-center text-white/60 text-[10px] md:text-xs">
                <Clock className="w-3 h-3 mr-1" />
                <span>{partnerStats.urgentItems} urgent • {Math.max(0, partnerStats.itemsNeedApproval - partnerStats.urgentItems)} standard</span>
              </div>
            </CardContent>
          </Card>

          <Card
            className="relative overflow-hidden bg-gradient-to-br from-rose-600 to-red-700 border-0 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
            onClick={onNavigateToCases}
          >
            <CardContent className="p-5 md:p-8 relative z-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <Flag className="w-10 h-10 md:w-12 md:h-12 text-white/90 mb-4 drop-shadow-lg group-hover:scale-110 group-hover:-rotate-12 transition-all" />
                <div className="absolute top-0 right-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse">
                  !
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-md">{partnerStats.highRiskClients}</div>
              <div className="text-xs md:text-sm font-semibold text-white/80 uppercase tracking-wide">High Risk Clients</div>
              <div className="mt-3 flex items-center text-white/60 text-[10px] md:text-xs">
                <Shield className="w-3 h-3 mr-1" />
                <span>Immediate attention required</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 border-0 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
            <CardContent className="p-5 md:p-8 relative z-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-500" />
              <Target className="w-10 h-10 md:w-12 md:h-12 text-white/90 mb-4 drop-shadow-lg group-hover:scale-110 group-hover:rotate-180 transition-all duration-500" />
              <div className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-md">{partnerStats.targetAchievement}%</div>
              <div className="text-xs md:text-sm font-semibold text-white/80 uppercase tracking-wide">Target Achievement</div>
              <div className="mt-3 flex items-center text-white/60 text-[10px] md:text-xs">
                <Zap className="w-3 h-3 mr-1" />
                <span>Exceeding goals by 8.2%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Risk Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Portfolio Risk Overview</CardTitle>
              <CardDescription>Client distribution by risk category and AUM</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { category: 'Low Risk', clients: 245, aum: 15.2 },
                  { category: 'Medium Risk', clients: 68, aum: 6.8 },
                  { category: 'High Risk', clients: 13, aum: 2.5 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="clients" fill="#3b82f6" name="Clients" />
                  <Bar yAxisId="right" dataKey="aum" fill="#10b981" name="AUM ($M)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card data-approvals-section className="transition-all">
            <CardHeader>
              <CardTitle>Requires Your Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {partnerApprovalsData.map((approval, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-semibold text-sm">{approval.item}</div>
                      <Badge variant={approval.priority === 'High' ? 'destructive' : 'default'} className="text-xs">
                        {approval.priority}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">{approval.type}</div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="default" className="flex-1 h-7" onClick={() => {
                        setApprovalModalOpen(true);
                        setSelectedApproval(approval);
                      }}>Approve</Button>
                      <Button size="sm" variant="outline" className="h-7" onClick={() => {
                        setApprovalModalOpen(true);
                        setSelectedApproval(approval);
                      }}>Review</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Compliance Status</CardTitle>
              <CardDescription>Compliance across jurisdictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regulatoryComplianceStatusData.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{item.jurisdiction}</span>
                      <span className="text-sm font-semibold">{item.compliance}%</span>
                    </div>
                    <Progress value={item.compliance} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Strategic Insights</CardTitle>
              <CardDescription>AI-powered recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {strategicInsightsData.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <item.icon className={`w-5 h-5 flex-shrink-0 ${item.color}`} />
                    <p className="text-sm text-gray-900">{item.insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Approval Modal */}
      {approvalModalOpen && selectedApproval && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Review & Approve</h2>
                <p className="text-sm text-gray-600 mt-1">{selectedApproval.item}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => {
                setApprovalModalOpen(false);
                setApprovalComment('');
              }}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Type</p>
                    <p className="font-semibold">{selectedApproval.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Priority</p>
                    <Badge variant={selectedApproval.priority === 'High' ? 'destructive' : 'default'}>
                      {selectedApproval.priority}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Approval Comments <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  placeholder="Provide details of your approval decision..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Comments will be recorded in the audit trail
                </p>
              </div>

              <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-900 mb-1">
                      Dual Control Required
                    </p>
                    <p className="text-sm text-amber-800">
                      This action requires approval from 2 authorized users. Your approval will be the 1st of 2 required.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setApprovalModalOpen(false);
                  setApprovalComment('');
                }}
              >
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={() => {
                    toast.warning('Declined', `${selectedApproval.item} — logged in audit trail.`);
                    setApprovalModalOpen(false);
                    setApprovalComment('');
                  }}
                  disabled={!approvalComment.trim()}
                >
                  <X className="w-4 h-4 mr-2" />
                  Decline
                </Button>
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    toast.success('Approved', `${selectedApproval.item} — recorded in compliance audit trail.`);
                    setApprovalModalOpen(false);
                    setApprovalComment('');
                  }}
                  disabled={!approvalComment.trim()}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
