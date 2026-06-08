import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import {
  Settings,
  Users,
  Shield,
  Bell,
  Key,
  Zap,
  Globe,
  CreditCard,
  Building2,
  Lock,
  Eye,
  EyeOff,
  Download,
  Upload,
  RefreshCw,
  Check,
  X,
  Plus,
  Trash2,
  Edit,
  Save,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Database,
  Code,
  Webhook,
  Activity,
  BarChart3,
  DollarSign,
  Crown,
  ArrowLeft,
  Search,
  Filter,
  MoreVertical,
  Copy,
  ExternalLink,
  Info,
  GitBranch,
  Play,
  Pause
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RoleAccessControl } from './RoleAccessControl';
import { BankFeedIntegrations } from './BankFeedIntegrations';
import { StrategicRoadmap } from './StrategicRoadmap';
import { FeatureModules } from './FeatureModules';

interface SystemSettingsProps {
  onBack: () => void;
}

const getPersonaConfig = (userId: string) => {
  const configs: Record<string, { name: string; title: string; role: string }> = {
    sarah_chen: { name: 'Sarah Chen', title: 'Head of Compliance', role: 'compliance_officer' },
    emma_williams: { name: 'Emma Williams', title: 'Compliance Officer', role: 'compliance_officer' },
    jessica_lee: { name: 'Jessica Lee', title: 'Senior Compliance Officer', role: 'compliance_officer' },
    alex_rivera: { name: 'Alex Rivera', title: 'AML Analyst', role: 'analyst' },
    david_thompson: { name: 'David Thompson', title: 'Internal Auditor', role: 'auditor' },
    michael_roberts: { name: 'Michael Roberts', title: 'Managing Partner', role: 'partner' },
    robert_kim: { name: 'Robert Kim', title: 'Risk Partner', role: 'partner' }
  };
  return configs[userId] || configs.sarah_chen;
};

export function SystemSettings({ onBack }: SystemSettingsProps) {
  const [activeTab, setActiveTab] = useState('roles');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [showFeatureModules, setShowFeatureModules] = useState(false);

  const activePersona = localStorage.getItem('growkyc_selected_user') || 'sarah_chen';
  const persona = getPersonaConfig(activePersona);
  const isAuthorized = persona.title === 'Head of Compliance' || persona.role === 'partner';

  if (showRoadmap) {
    return <StrategicRoadmap onBack={() => setShowRoadmap(false)} />;
  }

  if (showFeatureModules) {
    return <FeatureModules onBack={() => setShowFeatureModules(false)} />;
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full shadow-2xl border-2 border-amber-200">
          <CardHeader className="bg-amber-50 text-amber-900 pb-4">
            <div className="flex items-center gap-3">
              <Lock className="w-8 h-8 text-amber-600" />
              <div>
                <CardTitle className="text-lg font-bold">Access Restricted</CardTitle>
                <CardDescription className="text-amber-800 font-medium">Administrative Privileges Required</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              This settings panel contains critical system integrations, rule configurations, and role access controls that are restricted.
            </p>
            <div className="p-3 bg-gray-100 rounded-lg text-xs font-semibold text-gray-700">
              Authorized roles: Head of Compliance, Managing Partner, Risk Partner.
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onBack} className="w-full">
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <Settings className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
              <p className="text-sm text-gray-600">Partner-level administration and configuration</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowFeatureModules(true)}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Feature Modules
            </Button>
            <Button
              variant="default"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              onClick={() => setShowRoadmap(true)}
            >
              <GitBranch className="w-4 h-4 mr-2" />
              Strategic Roadmap
            </Button>
            <Badge variant="default" className="bg-purple-600">
              <Crown className="w-3 h-3 mr-1" />
              Partner Access Only
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-9 w-full mb-6">
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Roles & Access
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Transaction Rules
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              API & Webhooks
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Billing
            </TabsTrigger>
          </TabsList>

          {/* ROLES & ACCESS TAB */}
          <TabsContent value="roles">
            <RoleAccessControl onBack={onBack} />
          </TabsContent>

          {/* INTEGRATIONS TAB */}
          <TabsContent value="integrations" className="space-y-6">
            <BankFeedIntegrations />
          </TabsContent>

          {/* TRANSACTION MONITORING RULES TAB */}
          <TabsContent value="monitoring" className="space-y-6">
            {/* Rules Overview */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-8 h-8 text-green-600" />
                    <Badge variant="default" className="bg-green-600">Active</Badge>
                  </div>
                  <div className="text-3xl font-bold">4</div>
                  <div className="text-sm text-gray-600">Monitoring Rules</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                    <Badge variant="default" className="bg-red-600">High</Badge>
                  </div>
                  <div className="text-3xl font-bold">2</div>
                  <div className="text-sm text-gray-600">High Priority Rules</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <BarChart3 className="w-8 h-8 text-amber-600" />
                  </div>
                  <div className="text-3xl font-bold">28</div>
                  <div className="text-sm text-gray-600">Triggers (30d)</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-sm text-gray-600">Rules Active</div>
                </CardContent>
              </Card>
            </div>

            {/* Monitoring Rules Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Transaction Risk Detection Rules</CardTitle>
                    <CardDescription>Configure automated monitoring rules for AML surveillance</CardDescription>
                  </div>
                  <Button>
                    <GitBranch className="w-4 h-4 mr-2" />
                    Create New Rule
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Rule 1: Structuring Detection */}
                <Card className="border-2 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">Structuring Detection</h3>
                          <Badge className="bg-red-600">HIGH PRIORITY</Badge>
                          <Badge className="bg-green-500">
                            <Play className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">Multiple transactions just below $10,000 threshold</p>

                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                          <div className="text-sm font-semibold text-blue-900 mb-2">
                            Detection Conditions:
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-blue-800">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                              3+ transactions within 24 hours
                            </div>
                            <div className="flex items-center gap-2 text-sm text-blue-800">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                              Each transaction $8,000 - $9,999
                            </div>
                            <div className="flex items-center gap-2 text-sm text-blue-800">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                              Same beneficiary or pattern
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <span className="text-gray-600">Triggered:</span>
                            <span className="font-semibold">8 times (30d)</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-6">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Rule
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Triggers
                        </Button>
                        <Button size="sm" variant="outline">
                          <Pause className="w-4 h-4 mr-2" />
                          Disable
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Rule 2: Rapid Cash Movement */}
                <Card className="border-2 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">Rapid Cash Movement</h3>
                          <Badge className="bg-amber-600">MEDIUM PRIORITY</Badge>
                          <Badge className="bg-green-500">
                            <Play className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">Funds in and out within short timeframe</p>

                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                          <div className="text-sm font-semibold text-blue-900 mb-2">
                            Detection Conditions:
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-blue-800">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                              Funds in &gt; $50,000
                            </div>
                            <div className="flex items-center gap-2 text-sm text-blue-800">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                              Funds out within 48 hours
                            </div>
                            <div className="flex items-center gap-2 text-sm text-blue-800">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                              Minimal balance remaining
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <span className="text-gray-600">Triggered:</span>
                            <span className="font-semibold">3 times (30d)</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-6">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Rule
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Triggers
                        </Button>
                        <Button size="sm" variant="outline">
                          <Pause className="w-4 h-4 mr-2" />
                          Disable
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Rule 3: Cross-Border Spike */}
                <Card className="border-2 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">Cross-Border Spike</h3>
                          <Badge className="bg-red-600">HIGH PRIORITY</Badge>
                          <Badge className="bg-green-500">
                            <Play className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">Unusual international transaction volume</p>

                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                          <div className="text-sm font-semibold text-blue-900 mb-2">
                            Detection Conditions:
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-blue-800">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                              International transactions &gt; 3x baseline
                            </div>
                            <div className="flex items-center gap-2 text-sm text-blue-800">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                              High-risk jurisdiction
                            </div>
                            <div className="flex items-center gap-2 text-sm text-blue-800">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                              New beneficiary country
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <span className="text-gray-600">Triggered:</span>
                            <span className="font-semibold">12 times (30d)</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-6">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Rule
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Triggers
                        </Button>
                        <Button size="sm" variant="outline">
                          <Pause className="w-4 h-4 mr-2" />
                          Disable
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Rule 4: Unusual Transaction Size */}
                <Card className="border-2 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">Unusual Transaction Size</h3>
                          <Badge className="bg-amber-600">MEDIUM PRIORITY</Badge>
                          <Badge className="bg-green-500">
                            <Play className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">Transaction significantly larger than historical average</p>

                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                          <div className="text-sm font-semibold text-blue-900 mb-2">
                            Detection Conditions:
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-blue-800">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                              Transaction &gt; 5x average
                            </div>
                            <div className="flex items-center gap-2 text-sm text-blue-800">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                              No business justification pattern
                            </div>
                            <div className="flex items-center gap-2 text-sm text-blue-800">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                              First occurrence of size
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <span className="text-gray-600">Triggered:</span>
                            <span className="font-semibold">5 times (30d)</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-6">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Rule
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Triggers
                        </Button>
                        <Button size="sm" variant="outline">
                          <Pause className="w-4 h-4 mr-2" />
                          Disable
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Rules Configuration Guide */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">About Transaction Monitoring Rules</h3>
                    <p className="text-sm text-blue-800 mb-3">
                      These rules automatically analyze all transactions in real-time across connected bank accounts. 
                      When a rule is triggered, an alert is created in the Transaction Monitoring module for compliance review.
                    </p>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5"></div>
                        <span><strong>High Priority Rules:</strong> Generate immediate alerts requiring same-day review</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5"></div>
                        <span><strong>Medium Priority Rules:</strong> Generate alerts for review within 48 hours</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5"></div>
                        <span><strong>Partner-Level Access:</strong> Only partners can create, edit, or disable monitoring rules</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* USERS TAB */}
          <TabsContent value="users" className="space-y-6">
            {/* User Stats */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <Users className="w-8 h-8 text-blue-600 mb-2" />
                  <div className="text-3xl font-bold">24</div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
                  <div className="text-3xl font-bold">22</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Crown className="w-8 h-8 text-purple-600 mb-2" />
                  <div className="text-3xl font-bold">3</div>
                  <div className="text-sm text-gray-600">Partners</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Clock className="w-8 h-8 text-amber-600 mb-2" />
                  <div className="text-3xl font-bold">2</div>
                  <div className="text-sm text-gray-600">Pending Invites</div>
                </CardContent>
              </Card>
            </div>

            {/* User Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage team members and their permissions</CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Invite User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input placeholder="Search users..." className="pl-10" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="partner">Partner</SelectItem>
                      <SelectItem value="compliance_officer">Compliance Officer</SelectItem>
                      <SelectItem value="analyst">Analyst</SelectItem>
                      <SelectItem value="auditor">Auditor</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="active">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* User List */}
                <div className="space-y-2">
                  {[
                    { name: 'Sarah Chen', email: 'sarah.chen@growfinancial.com', role: 'Compliance Officer', avatar: '👩‍💼', status: 'active', lastActive: '2 min ago', permissions: 'Full Access' },
                    { name: 'Michael Roberts', email: 'michael.roberts@growfinancial.com', role: 'Managing Partner', avatar: '👨‍💼', status: 'active', lastActive: '5 min ago', permissions: 'Admin' },
                    { name: 'Emma Williams', email: 'emma.williams@growfinancial.com', role: 'AML Analyst', avatar: '👩‍💻', status: 'active', lastActive: '1 hour ago', permissions: 'Case Management' },
                    { name: 'David Thompson', email: 'david.thompson@growfinancial.com', role: 'Internal Auditor', avatar: '🕵️', status: 'active', lastActive: '3 hours ago', permissions: 'Read Only' },
                    { name: 'Jessica Lee', email: 'jessica.lee@growfinancial.com', role: 'Compliance Officer', avatar: '👩‍⚖️', status: 'active', lastActive: '10 min ago', permissions: 'Full Access' },
                    { name: 'Robert Kim', email: 'robert.kim@growfinancial.com', role: 'Risk Partner', avatar: '👨‍⚖️', status: 'active', lastActive: '30 min ago', permissions: 'Admin' },
                    { name: 'Amanda Foster', email: 'amanda.foster@growfinancial.com', role: 'Analyst', avatar: '👩‍💼', status: 'active', lastActive: '2 hours ago', permissions: 'Standard' },
                    { name: 'James Wilson', email: 'james.wilson@growfinancial.com', role: 'Compliance Officer', avatar: '👨‍💼', status: 'inactive', lastActive: '2 days ago', permissions: 'Full Access' }
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-3xl">{user.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{user.name}</span>
                            <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                              {user.status}
                            </Badge>
                            {user.role.includes('Partner') && (
                              <Badge variant="default" className="bg-purple-600 text-xs">
                                <Crown className="w-3 h-3 mr-1" />
                                Partner
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {user.role} • {user.permissions} • Last active: {user.lastActive}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button size="sm" variant="ghost">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Role Permissions Matrix */}
            <Card>
              <CardHeader>
                <CardTitle>Role Permissions</CardTitle>
                <CardDescription>Configure access levels for each role type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Permission</th>
                        <th className="text-center py-3 px-4 font-semibold">Partner</th>
                        <th className="text-center py-3 px-4 font-semibold">Compliance Officer</th>
                        <th className="text-center py-3 px-4 font-semibold">Analyst</th>
                        <th className="text-center py-3 px-4 font-semibold">Auditor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { permission: 'View Dashboard', partner: true, officer: true, analyst: true, auditor: true },
                        { permission: 'Manage Users', partner: true, officer: false, analyst: false, auditor: false },
                        { permission: 'System Settings', partner: true, officer: false, analyst: false, auditor: false },
                        { permission: 'Create Cases', partner: true, officer: true, analyst: true, auditor: false },
                        { permission: 'Close Cases', partner: true, officer: true, analyst: false, auditor: false },
                        { permission: 'Approve EDD', partner: true, officer: true, analyst: false, auditor: false },
                        { permission: 'View Audit Logs', partner: true, officer: true, analyst: false, auditor: true },
                        { permission: 'Configure Integrations', partner: true, officer: false, analyst: false, auditor: false },
                        { permission: 'Export Data', partner: true, officer: true, analyst: true, auditor: true },
                        { permission: 'Manage Billing', partner: true, officer: false, analyst: false, auditor: false }
                      ].map((row, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{row.permission}</td>
                          <td className="py-3 px-4 text-center">
                            {row.partner ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {row.officer ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {row.analyst ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {row.auditor ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SECURITY TAB */}
          <TabsContent value="security" className="space-y-6">
            {/* Security Overview */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <Shield className="w-8 h-8 text-green-600 mb-2" />
                  <div className="text-3xl font-bold">Secure</div>
                  <div className="text-sm text-gray-600">Security Status</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Lock className="w-8 h-8 text-blue-600 mb-2" />
                  <div className="text-3xl font-bold">24</div>
                  <div className="text-sm text-gray-600">Active Sessions</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Key className="w-8 h-8 text-purple-600 mb-2" />
                  <div className="text-3xl font-bold">12</div>
                  <div className="text-sm text-gray-600">API Keys</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Eye className="w-8 h-8 text-amber-600 mb-2" />
                  <div className="text-3xl font-bold">1.2K</div>
                  <div className="text-sm text-gray-600">Audit Events Today</div>
                </CardContent>
              </Card>
            </div>

            {/* Authentication Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Authentication & Access</CardTitle>
                <CardDescription>Configure authentication methods and security policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-semibold mb-1">Two-Factor Authentication (2FA)</div>
                    <div className="text-sm text-gray-600">Require 2FA for all users</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-semibold mb-1">Single Sign-On (SSO)</div>
                    <div className="text-sm text-gray-600">Enable SSO via Azure AD or Okta</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-semibold mb-1">IP Whitelist</div>
                    <div className="text-sm text-gray-600">Restrict access to specific IP addresses</div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-semibold mb-1">Session Timeout</div>
                    <div className="text-sm text-gray-600">Auto-logout after inactivity</div>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Password Policy */}
            <Card>
              <CardHeader>
                <CardTitle>Password Policy</CardTitle>
                <CardDescription>Set password requirements and rotation policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Minimum Length</Label>
                    <Select defaultValue="12">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8">8 characters</SelectItem>
                        <SelectItem value="10">10 characters</SelectItem>
                        <SelectItem value="12">12 characters</SelectItem>
                        <SelectItem value="16">16 characters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Password Expiry</Label>
                    <Select defaultValue="90">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Require uppercase letters</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Require numbers</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Require special characters</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Prevent password reuse (last 5)</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audit Log */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
                <CardDescription>Monitor system access and security-related activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { event: 'User login', user: 'sarah.chen@growfinancial.com', ip: '203.45.12.67', time: '2 min ago', status: 'success' },
                    { event: 'API key generated', user: 'michael.roberts@growfinancial.com', ip: '203.45.12.68', time: '15 min ago', status: 'success' },
                    { event: 'Failed login attempt', user: 'unknown@example.com', ip: '192.168.1.1', time: '1 hour ago', status: 'failed' },
                    { event: 'Password changed', user: 'emma.williams@growfinancial.com', ip: '203.45.12.69', time: '2 hours ago', status: 'success' },
                    { event: '2FA enabled', user: 'david.thompson@growfinancial.com', ip: '203.45.12.70', time: '3 hours ago', status: 'success' }
                  ].map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="font-semibold">{log.event}</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-600">{log.user}</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-600">IP: {log.ip}</span>
                      </div>
                      <span className="text-gray-500 text-xs">{log.time}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View Complete Audit Log
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NOTIFICATIONS TAB */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { category: 'High Risk Alerts', email: true, push: true, sms: false, description: 'Immediate alerts for high-risk clients or transactions' },
                  { category: 'Case Assignments', email: true, push: true, sms: false, description: 'Notifications when cases are assigned to you' },
                  { category: 'Document Approvals', email: true, push: false, sms: false, description: 'Documents requiring your approval' },
                  { category: 'System Updates', email: true, push: false, sms: false, description: 'Platform updates and maintenance notices' },
                  { category: 'Weekly Reports', email: true, push: false, sms: false, description: 'Weekly compliance summary reports' },
                  { category: 'Integration Status', email: false, push: false, sms: false, description: 'Integration health and connectivity alerts' }
                ].map((notification, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold mb-1">{notification.category}</div>
                        <div className="text-sm text-gray-600">{notification.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked={notification.email} />
                        <Label className="text-sm">Email</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked={notification.push} />
                        <Label className="text-sm">Push</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked={notification.sms} />
                        <Label className="text-sm">SMS</Label>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Notification Channels */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Channels</CardTitle>
                <CardDescription>Configure where notifications are sent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-semibold">Email</div>
                        <div className="text-sm text-gray-600">compliance@growfinancial.com</div>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-600">Verified</Badge>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="font-semibold">Slack</div>
                        <div className="text-sm text-gray-600">#compliance-alerts</div>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-600">Connected</Badge>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-semibold">SMS</div>
                        <div className="text-sm text-gray-600">+61 4XX XXX XXX</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Configure</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* GENERAL TAB */}
          <TabsContent value="general" className="space-y-6">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Your organization details and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Company Name</Label>
                    <Input defaultValue="Grow Financial Services" />
                  </div>
                  <div>
                    <Label>ABN / ACN</Label>
                    <Input defaultValue="12 345 678 901" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Industry</Label>
                    <Select defaultValue="financial">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="financial">Financial Services</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                        <SelectItem value="accounting">Accounting</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Company Size</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">1-50 employees</SelectItem>
                        <SelectItem value="medium">51-200 employees</SelectItem>
                        <SelectItem value="large">201-1000 employees</SelectItem>
                        <SelectItem value="enterprise">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Address</Label>
                  <Input defaultValue="Level 12, 123 Collins Street" className="mb-2" />
                  <div className="grid grid-cols-3 gap-2">
                    <Input defaultValue="Melbourne" placeholder="City" />
                    <Input defaultValue="VIC" placeholder="State" />
                    <Input defaultValue="3000" placeholder="Postcode" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Primary Contact Email</Label>
                    <Input defaultValue="info@growfinancial.com" type="email" />
                  </div>
                  <div>
                    <Label>Primary Contact Phone</Label>
                    <Input defaultValue="+61 3 9XXX XXXX" />
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Button>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Branding */}
            <Card>
              <CardHeader>
                <CardTitle>Branding & Appearance</CardTitle>
                <CardDescription>Customize your platform's look and feel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Company Logo</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                      G
                    </div>
                    <div>
                      <Button variant="outline" size="sm" className="mb-2">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload New Logo
                      </Button>
                      <p className="text-xs text-gray-600">PNG or JPG, max 2MB</p>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Primary Color</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input type="color" defaultValue="#3b82f6" className="w-20 h-10" />
                    <Input defaultValue="#3b82f6" className="flex-1" />
                  </div>
                </div>
                <div>
                  <Label>Time Zone</Label>
                  <Select defaultValue="aest">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aest">Australia/Melbourne (AEST)</SelectItem>
                      <SelectItem value="awst">Australia/Perth (AWST)</SelectItem>
                      <SelectItem value="acst">Australia/Adelaide (ACST)</SelectItem>
                      <SelectItem value="nzst">Pacific/Auckland (NZST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date Format</Label>
                  <Select defaultValue="dmy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Data & Privacy */}
            <Card>
              <CardHeader>
                <CardTitle>Data & Privacy</CardTitle>
                <CardDescription>Manage data retention and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-semibold mb-1">Data Retention Period</div>
                    <div className="text-sm text-gray-600">How long to retain compliance records</div>
                  </div>
                  <Select defaultValue="7years">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5years">5 years</SelectItem>
                      <SelectItem value="7years">7 years</SelectItem>
                      <SelectItem value="10years">10 years</SelectItem>
                      <SelectItem value="indefinite">Indefinite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-semibold mb-1">Data Encryption at Rest</div>
                    <div className="text-sm text-gray-600">AES-256 encryption for stored data</div>
                  </div>
                  <Badge variant="default" className="bg-green-600">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-semibold mb-1">GDPR Compliance Mode</div>
                    <div className="text-sm text-gray-600">Enhanced privacy controls for EU clients</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="pt-4 border-t">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export All Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API & WEBHOOKS TAB */}
          <TabsContent value="api" className="space-y-6">
            {/* API Keys */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>Manage API keys for programmatic access</CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Generate New Key
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Production API Key', key: 'gk_prod_xxxxxxxxxxxxxxxxxxx', created: '3 months ago', lastUsed: '2 min ago', calls: '1.2M' },
                    { name: 'Staging API Key', key: 'gk_stag_xxxxxxxxxxxxxxxxxxx', created: '2 months ago', lastUsed: '1 hour ago', calls: '450K' },
                    { name: 'Development API Key', key: 'gk_dev_xxxxxxxxxxxxxxxxxxx', created: '1 week ago', lastUsed: '5 hours ago', calls: '12K' }
                  ].map((apiKey, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold">{apiKey.name}</div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="font-mono text-sm bg-white p-2 rounded border mb-2">
                        {showApiKey ? apiKey.key : '••••••••••••••••••••'}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>Created: {apiKey.created}</span>
                        <span>•</span>
                        <span>Last used: {apiKey.lastUsed}</span>
                        <span>•</span>
                        <span>{apiKey.calls} calls</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Webhooks */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Webhooks</CardTitle>
                    <CardDescription>Configure webhooks for real-time event notifications</CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Webhook
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { url: 'https://api.yourapp.com/webhooks/kyc', events: ['case.created', 'case.updated', 'risk.flagged'], status: 'active', success: 99.8 },
                    { url: 'https://staging.yourapp.com/webhooks/compliance', events: ['document.approved', 'client.verified'], status: 'active', success: 98.5 }
                  ].map((webhook, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-mono text-sm font-semibold mb-1">{webhook.url}</div>
                          <div className="flex items-center gap-2">
                            <Badge variant="default" className="bg-green-600 text-xs">Active</Badge>
                            <span className="text-xs text-gray-600">{webhook.success}% success rate</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            Test
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.map((event, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* API Documentation */}
            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>Resources for developers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      API Reference Documentation
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      Code Examples & SDKs
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      API Status & Monitoring
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BILLING TAB */}
          <TabsContent value="billing" className="space-y-6">
            {/* Pricing Configuration */}
            <Card className="border-2 border-cyan-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <DollarSign className="w-6 h-6 text-cyan-600" />
                      KYC Verification Pricing
                    </CardTitle>
                    <CardDescription className="mt-1">Configure client-facing fees for verification services</CardDescription>
                  </div>
                  <Button className="bg-cyan-600 hover:bg-cyan-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Pricing
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* One-Time Verification Fee */}
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-6 border-2 border-cyan-200">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-cyan-600" />
                    One-Time Verification Fee
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Client-facing fee for initial KYC verification (includes all base checks)
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="verification-fee" className="text-sm font-semibold mb-2 block">
                        Verification Fee Amount
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-600">$</span>
                        <Input
                          id="verification-fee"
                          type="number"
                          defaultValue="49.00"
                          className="text-lg font-semibold border-2 border-cyan-300 focus:border-cyan-500"
                        />
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-cyan-200">
                      <p className="text-xs text-gray-600 mb-2">This fee includes:</p>
                      <ul className="text-xs text-gray-700 space-y-1">
                        <li className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-600" />
                          Identity verification (Equifax)
                        </li>
                        <li className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-600" />
                          AML screening (ComplyAdvantage)
                        </li>
                        <li className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-600" />
                          Business risk assessment (Illion)
                        </li>
                        <li className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-600" />
                          Entity and ownership analysis
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Individual Search Costs */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <Search className="w-5 h-5 text-purple-600" />
                    Individual Search Costs
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Internal costs for each external integration check (for tracking purposes)
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Equifax */}
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">Equifax Identity Check</p>
                          <p className="text-xs text-gray-600">Identity, fraud, credit signals</p>
                        </div>
                        <Shield className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-600">$</span>
                        <Input
                          type="number"
                          defaultValue="8.50"
                          className="border-2 border-purple-200 focus:border-purple-400"
                        />
                      </div>
                    </div>

                    {/* Illion */}
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">Illion Business Check</p>
                          <p className="text-xs text-gray-600">Credit, insolvency, court data</p>
                        </div>
                        <Building2 className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-600">$</span>
                        <Input
                          type="number"
                          defaultValue="12.00"
                          className="border-2 border-purple-200 focus:border-purple-400"
                        />
                      </div>
                    </div>

                    {/* ComplyAdvantage */}
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">ComplyAdvantage AML</p>
                          <p className="text-xs text-gray-600">Sanctions, PEP, adverse media</p>
                        </div>
                        <AlertTriangle className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-600">$</span>
                        <Input
                          type="number"
                          defaultValue="6.50"
                          className="border-2 border-purple-200 focus:border-purple-400"
                        />
                      </div>
                    </div>

                    {/* ASIC */}
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">ASIC Company Extract</p>
                          <p className="text-xs text-gray-600">Entity records, directors, shares</p>
                        </div>
                        <FileText className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-600">$</span>
                        <Input
                          type="number"
                          defaultValue="15.00"
                          className="border-2 border-purple-200 focus:border-purple-400"
                        />
                      </div>
                    </div>

                    {/* InfoTrack KYC */}
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">InfoTrack ID Verification</p>
                          <p className="text-xs text-gray-600">Document verification</p>
                        </div>
                        <Eye className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-600">$</span>
                        <Input
                          type="number"
                          defaultValue="4.50"
                          className="border-2 border-purple-200 focus:border-purple-400"
                        />
                      </div>
                    </div>

                    {/* LexisNexis (Optional) */}
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">LexisNexis Legal Check</p>
                          <p className="text-xs text-gray-600">Court records, litigation</p>
                        </div>
                        <Database className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-600">$</span>
                        <Input
                          type="number"
                          defaultValue="18.00"
                          className="border-2 border-purple-200 focus:border-purple-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 bg-white rounded-lg p-4 border border-purple-300">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-purple-900">Cost Tracking</p>
                        <p className="text-xs text-purple-700 mt-1">
                          These costs are for internal tracking and margin analysis. The client is charged the one-time verification fee regardless of how many individual checks are performed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ongoing Monitoring Fee */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    Ongoing Monitoring Subscription
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Monthly fee for continuous AML monitoring of client and associated parties
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="monitoring-fee" className="text-sm font-semibold mb-2 block">
                        Monthly Monitoring Fee
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-600">$</span>
                        <Input
                          id="monitoring-fee"
                          type="number"
                          defaultValue="15.00"
                          className="text-lg font-semibold border-2 border-green-300 focus:border-green-500"
                        />
                        <span className="text-sm text-gray-600 whitespace-nowrap">/ month</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Billed monthly per client entity
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="text-xs text-gray-600 mb-2">Monthly monitoring includes:</p>
                      <ul className="text-xs text-gray-700 space-y-1">
                        <li className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-600" />
                          Real-time sanctions screening
                        </li>
                        <li className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-600" />
                          PEP status monitoring
                        </li>
                        <li className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-600" />
                          Adverse media alerts
                        </li>
                        <li className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-600" />
                          Credit and business risk updates
                        </li>
                        <li className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-600" />
                          Associated party monitoring
                        </li>
                        <li className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-600" />
                          Automated case creation on alerts
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Monitoring Tiers */}
                  <div className="mt-4 grid md:grid-cols-3 gap-3">
                    <div className="bg-white rounded-lg p-4 border-2 border-green-300">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-blue-600">Standard</Badge>
                        <span className="font-bold text-lg">$15</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Monthly checks, standard alerts
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border-2 border-amber-400">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-amber-600">Enhanced</Badge>
                        <span className="font-bold text-lg">$35</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Weekly checks, priority alerts
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border-2 border-purple-400">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-purple-600">Premium</Badge>
                        <span className="font-bold text-lg">$75</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Real-time monitoring, instant alerts
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border-2 border-indigo-200">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    Pricing Summary
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-3">Revenue Model</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-200">
                          <span className="text-sm text-gray-700">Initial Verification</span>
                          <span className="font-bold text-indigo-600">$49.00</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-200">
                          <span className="text-sm text-gray-700">Monthly Monitoring (Standard)</span>
                          <span className="font-bold text-indigo-600">$15.00</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-indigo-100 rounded-lg border-2 border-indigo-300">
                          <span className="text-sm font-semibold text-indigo-900">12-Month Client Value</span>
                          <span className="font-bold text-xl text-indigo-600">$229</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-3">Cost Structure</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-200">
                          <span className="text-sm text-gray-700">Total External Checks</span>
                          <span className="font-bold text-gray-900">~$46.50</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-200">
                          <span className="text-sm text-gray-700">Monitoring Cost (est.)</span>
                          <span className="font-bold text-gray-900">~$5.00/mo</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg border-2 border-green-300">
                          <span className="text-sm font-semibold text-green-900">12-Month Margin</span>
                          <span className="font-bold text-xl text-green-600">$122.50</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Plan */}
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Crown className="w-6 h-6 text-purple-600" />
                      Enterprise Plan
                    </CardTitle>
                    <CardDescription className="text-base mt-1">Unlimited users, all features included</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-purple-600">$2,499</div>
                    <div className="text-sm text-gray-600">per month</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg">
                    <div className="text-2xl font-bold">Unlimited</div>
                    <div className="text-sm text-gray-600">Users</div>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg">
                    <div className="text-2xl font-bold">5M</div>
                    <div className="text-sm text-gray-600">API Calls/month</div>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg">
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-sm text-gray-600">Priority Support</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Change Plan
                </Button>
              </CardContent>
            </Card>

            {/* Usage This Month */}
            <Card>
              <CardHeader>
                <CardTitle>Usage This Month</CardTitle>
                <CardDescription>Monitor your consumption and limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">API Calls</span>
                    <span className="text-sm text-gray-600">1.2M / 5M</span>
                  </div>
                  <Progress value={24} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Active Users</span>
                    <span className="text-sm text-gray-600">24 / Unlimited</span>
                  </div>
                  <Progress value={10} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Storage Used</span>
                    <span className="text-sm text-gray-600">245 GB / 1 TB</span>
                  </div>
                  <Progress value={24} />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>Manage your billing information</CardDescription>
                  </div>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
                  <div className="flex items-center justify-between mb-4">
                    <CreditCard className="w-8 h-8" />
                    <Badge variant="default" className="bg-white/20">Primary</Badge>
                  </div>
                  <div className="font-mono text-lg mb-2">•••• •••• •••• 4242</div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Visa</span>
                    <span>Expires 12/25</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing History */}
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>View and download past invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { date: 'Mar 1, 2026', amount: '$2,499.00', status: 'paid', invoice: 'INV-2026-03' },
                    { date: 'Feb 1, 2026', amount: '$2,499.00', status: 'paid', invoice: 'INV-2026-02' },
                    { date: 'Jan 1, 2026', amount: '$2,499.00', status: 'paid', invoice: 'INV-2026-01' },
                    { date: 'Dec 1, 2025', amount: '$2,499.00', status: 'paid', invoice: 'INV-2025-12' }
                  ].map((bill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-semibold">{bill.invoice}</div>
                          <div className="text-sm text-gray-600">{bill.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">{bill.amount}</span>
                        <Badge variant="default" className="bg-green-600">Paid</Badge>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
