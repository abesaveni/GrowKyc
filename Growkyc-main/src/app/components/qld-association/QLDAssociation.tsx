import * as React from 'react';
const { useState } = React;
import { 
  Home, FileText, Users, Calendar, DollarSign, Shield, 
  AlertTriangle, Folder, GraduationCap, BarChart3, Settings as SettingsIcon,
  HelpCircle, Building2, Bell, Sparkles, ChevronDown, Menu,
  CheckCircle, Clock, XCircle, Plus, Search, Filter, Download,
  Upload, Eye, Edit, Trash2, MoreVertical, ArrowLeft, X, Play
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';

type View = 
  | 'dashboard' 
  | 'compliance' 
  | 'meetings' 
  | 'members' 
  | 'finance' 
  | 'safety' 
  | 'integrity' 
  | 'documents' 
  | 'training' 
  | 'reports' 
  | 'settings';

interface QLDAssociationProps {
  onSwitchModule?: (module: string) => void;
}

export function QLDAssociation({ onSwitchModule }: QLDAssociationProps) {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [selectedClub, setSelectedClub] = useState('Springwood United FC');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedCompliance, setSelectedCompliance] = useState<any>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [automationMode, setAutomationMode] = useState<'assist' | 'autopilot'>('assist');
  const [selectedCashSession, setSelectedCashSession] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [selectedCabinet, setSelectedCabinet] = useState('governance');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, item: 'First aid kit inspected', completed: true },
    { id: 2, item: 'Field inspection completed', completed: true },
    { id: 3, item: 'Emergency contact list updated', completed: false },
    { id: 4, item: 'Match officials briefed', completed: false }
  ]);

  // Status chip component
  const StatusChip = ({ status, children }: { status: 'green' | 'amber' | 'red' | 'grey'; children: React.ReactNode }) => {
    const colors = {
      green: 'bg-green-100 text-green-800 border-green-300',
      amber: 'bg-amber-100 text-amber-800 border-amber-300',
      red: 'bg-red-100 text-red-800 border-red-300',
      grey: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return (
      <Badge variant="outline" className={`${colors[status]} border`}>
        {children}
      </Badge>
    );
  };

  // Metric tile component
  const MetricTile = ({ icon: Icon, label, value, status, trend }: any) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-2">
          <Icon className={`w-8 h-8 ${
            status === 'green' ? 'text-green-600' :
            status === 'amber' ? 'text-amber-600' :
            status === 'red' ? 'text-red-600' : 'text-gray-600'
          }`} />
          {trend && <span className="text-xs text-gray-600">{trend}</span>}
        </div>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600 mt-1">{label}</p>
      </CardContent>
    </Card>
  );

  // Alert card component
  const AlertCard = ({ type, title, description, action }: any) => (
    <Card className={`border-l-4 ${
      type === 'critical' ? 'border-l-red-600 bg-red-50' :
      type === 'warning' ? 'border-l-amber-600 bg-amber-50' :
      'border-l-blue-600 bg-blue-50'
    }`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className={`w-5 h-5 ${
                type === 'critical' ? 'text-red-600' :
                type === 'warning' ? 'text-amber-600' : 'text-blue-600'
              }`} />
              <h4 className="font-semibold text-gray-900">{title}</h4>
            </div>
            <p className="text-sm text-gray-700">{description}</p>
          </div>
          {action && (
            <Button size="sm" className="ml-4">
              {action}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Health compliance score component
  const HealthComplianceScore = ({ score, breakdown }: any) => (
    <Card className="border-2 border-blue-600">
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <div className="bg-white rounded-full w-28 h-28 flex items-center justify-center">
              <div>
                <div className="text-4xl font-bold text-gray-900">{score}</div>
                <div className="text-xs text-gray-600">/ 100</div>
              </div>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900">Health Compliance Score</h3>
          <p className="text-sm text-gray-600">Overall compliance status</p>
        </div>
        <div className="space-y-2">
          {breakdown.map((item: any, index: number) => (
            <div key={index}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-medium text-gray-900">{item.score}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    item.score >= 80 ? 'bg-green-500' :
                    item.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Dashboard view
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Score */}
        <HealthComplianceScore 
          score={87}
          breakdown={[
            { label: 'Governance', score: 92 },
            { label: 'Finance', score: 85 },
            { label: 'Safety', score: 88 },
            { label: 'Integrity', score: 95 },
            { label: 'Training', score: 75 }
          ]}
        />

        {/* Metrics */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <MetricTile icon={Calendar} label="Next Meeting" value="3 days" status="green" />
            <MetricTile icon={Users} label="Active Members" value="247" status="green" />
            <MetricTile icon={DollarSign} label="Cash on Hand" value="$12.4k" status="green" />
            <MetricTile icon={AlertTriangle} label="Action Items" value="5" status="amber" />
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Alerts Requiring Action</h3>
        <div className="space-y-3">
          <AlertCard 
            type="critical"
            title="Blue Card Expiry"
            description="3 coaching staff blue cards expire in next 14 days"
            action="Review"
          />
          <AlertCard 
            type="warning"
            title="AGM Notice Required"
            description="AGM notice must be sent by 18 March 2026"
            action="Prepare"
          />
          <AlertCard 
            type="info"
            title="Training Update"
            description="New concussion protocol training available"
            action="View"
          />
        </div>
      </div>

      {/* Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: 'Committee Meeting', date: 'Mon 26 Feb', status: 'green', quorum: 'Met' },
                { type: 'AGM', date: 'Sat 15 Mar', status: 'amber', quorum: 'Pending' },
                { type: 'Finance Review', date: 'Wed 5 Mar', status: 'green', quorum: 'Met' }
              ].map((meeting, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{meeting.type}</p>
                    <p className="text-sm text-gray-600">{meeting.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusChip status={meeting.status as any}>{meeting.quorum}</StatusChip>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Income (YTD)</span>
                <span className="font-semibold text-gray-900">$145,230</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Expenses (YTD)</span>
                <span className="font-semibold text-gray-900">$132,875</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="text-sm font-semibold text-gray-900">Net Position</span>
                <span className="font-bold text-green-600">$12,355</span>
              </div>
              <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-amber-900">2 transactions pending approval</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Compliance view - keeping the existing implementation
  const renderCompliance = () => {
    const obligations = [
      { id: 1, obligation: 'AGM Must be held annually', source: 'QLD Govt', category: 'Governance', status: 'green', due: '15 Mar 2026', risk: 'High' },
      { id: 2, obligation: 'Blue Card renewals', source: 'QLD Blue Card', category: 'Safety', status: 'amber', due: '8 Mar 2026', risk: 'Critical' },
      { id: 3, obligation: 'Financial statements lodged', source: 'OFT', category: 'Finance', status: 'green', due: '30 Jun 2026', risk: 'High' },
      { id: 4, obligation: 'Committee meeting minutes', source: 'Governing Body', category: 'Governance', status: 'green', due: 'Monthly', risk: 'Medium' },
      { id: 5, obligation: 'Incident reporting protocol', source: 'Governing Body', category: 'Safety', status: 'amber', due: 'As required', risk: 'High' }
    ];

    return (
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="governance">Governance</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="integrity">Integrity</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="compliant">Compliant</SelectItem>
                  <SelectItem value="attention">Attention Required</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Obligations table */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Obligations</CardTitle>
            <CardDescription>All regulatory and governing body requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Obligation</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Source</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Due Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Risk</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900"></th>
                  </tr>
                </thead>
                <tbody>
                  {obligations.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedCompliance(item)}>
                      <td className="py-3 px-4 text-sm text-gray-900">{item.obligation}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{item.source}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{item.category}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <StatusChip status={item.status as any}>
                          {item.status === 'green' ? 'Compliant' : 'Attention Required'}
                        </StatusChip>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{item.due}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={
                          item.risk === 'Critical' ? 'bg-red-50 text-red-700 border-red-300' :
                          item.risk === 'High' ? 'bg-amber-50 text-amber-700 border-amber-300' :
                          'bg-gray-50 text-gray-700'
                        }>{item.risk}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Detail drawer */}
        {selectedCompliance && (
          <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Compliance Detail</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedCompliance(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-xs text-gray-600">Obligation</Label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedCompliance.obligation}</p>
                </div>

                <div>
                  <Label className="text-xs text-gray-600">Description</Label>
                  <p className="text-sm text-gray-700 mt-1">
                    This is a mandatory requirement under Queensland legislation. Non-compliance may result in penalties.
                  </p>
                </div>

                <div>
                  <Label className="text-xs text-gray-600">Evidence Required</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">Meeting notice sent</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">Agenda prepared</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span className="text-gray-700">Minutes drafted</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-600">Responsible Role</Label>
                  <p className="text-sm text-gray-900 mt-1">Secretary</p>
                </div>

                <div>
                  <Label className="text-xs text-gray-600">Linked Documents</Label>
                  <div className="mt-2 space-y-2">
                    <div className="p-2 border border-gray-200 rounded text-sm">
                      Association Rules.pdf
                    </div>
                    <div className="p-2 border border-gray-200 rounded text-sm">
                      AGM Notice Template.docx
                    </div>
                  </div>
                </div>

                <Button className="w-full">Mark as Complete</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Meetings view - keeping existing
  const renderMeetings = () => {
    const meetings = [
      { id: 1, type: 'Committee Meeting', date: '26 Feb 2026', status: 'upcoming', noticeSent: true, quorum: 'Met' },
      { id: 2, type: 'AGM', date: '15 Mar 2026', status: 'upcoming', noticeSent: false, quorum: 'Pending' },
      { id: 3, type: 'Committee Meeting', date: '15 Jan 2026', status: 'completed', noticeSent: true, quorum: 'Met' }
    ];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Meetings</h2>
            <p className="text-gray-600 mt-1">Manage governance meetings and AGMs</p>
          </div>
          <Button onClick={() => toast.success('Create meeting wizard opened')}>
            <Plus className="w-4 h-4 mr-2" />
            New Meeting
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Notice Sent</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Quorum</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900"></th>
                  </tr>
                </thead>
                <tbody>
                  {meetings.map((meeting) => (
                    <tr key={meeting.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedMeeting(meeting)}>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{meeting.type}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{meeting.date}</td>
                      <td className="py-3 px-4">
                        <StatusChip status={meeting.status === 'completed' ? 'green' : 'amber' as any}>
                          {meeting.status}
                        </StatusChip>
                      </td>
                      <td className="py-3 px-4">
                        {meeting.noticeSent ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <StatusChip status={meeting.quorum === 'Met' ? 'green' : 'amber' as any}>
                          {meeting.quorum}
                        </StatusChip>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Meeting detail */}
        {selectedMeeting && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedMeeting.type}</CardTitle>
                  <CardDescription>{selectedMeeting.date}</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setSelectedMeeting(null)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to List
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <div className="flex gap-6">
                    {['Overview', 'Agenda', 'Papers', 'Minutes', 'Decisions', 'Actions'].map((tab) => (
                      <button key={tab} className="pb-3 border-b-2 border-blue-600 text-sm font-medium text-blue-600">
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Overview content */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm text-gray-600">Meeting Type</Label>
                    <p className="text-sm font-medium text-gray-900 mt-1">{selectedMeeting.type}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Date & Time</Label>
                    <p className="text-sm font-medium text-gray-900 mt-1">{selectedMeeting.date} at 7:00 PM</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Location</Label>
                    <p className="text-sm font-medium text-gray-900 mt-1">Clubhouse Meeting Room</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Chair</Label>
                    <p className="text-sm font-medium text-gray-900 mt-1">Sarah Mitchell (President)</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Attendees</h4>
                  <div className="space-y-2">
                    {['Sarah Mitchell (President)', 'John Davis (Treasurer)', 'Emma Wilson (Secretary)', 'Michael Brown (Member)'].map((person) => (
                      <div key={person} className="flex items-center gap-3 p-2 border border-gray-200 rounded">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-900">{person}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // Members view - keeping existing
  const renderMembers = () => {
    const members = [
      { id: 1, name: 'Sarah Mitchell', role: 'President', class: 'Full Member', status: 'Active', voting: true },
      { id: 2, name: 'John Davis', role: 'Treasurer', class: 'Full Member', status: 'Active', voting: true },
      { id: 3, name: 'Emma Wilson', role: 'Secretary', class: 'Full Member', status: 'Active', voting: true },
      { id: 4, name: 'Michael Brown', role: 'Coach', class: 'Associate', status: 'Active', voting: false },
      { id: 5, name: 'Lisa Anderson', role: 'Member', class: 'Full Member', status: 'Active', voting: true }
    ];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Members</h2>
            <p className="text-gray-600 mt-1">Manage club members and roles</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-3 mb-6">
              <Input placeholder="Search members..." className="max-w-sm" />
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Class</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Voting Eligible</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900"></th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedMember(member)}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{member.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{member.role}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{member.class}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <StatusChip status="green">{member.status}</StatusChip>
                      </td>
                      <td className="py-3 px-4">
                        {member.voting ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Finance view - NEW
  const renderFinance = () => {
    const cashSessions = [
      { id: 1, date: '23 Feb 2026', event: 'Home Match vs Brisbane', amount: 2450, status: 'pending', variance: 0 },
      { id: 2, date: '16 Feb 2026', event: 'Canteen Sales', amount: 1890, status: 'approved', variance: 15 },
      { id: 3, date: '10 Feb 2026', event: 'Training Night', amount: 450, status: 'approved', variance: 0 }
    ];

    if (selectedCashSession) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setSelectedCashSession(null)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Cash Session Detail</h2>
                <p className="text-gray-600">{selectedCashSession.event}</p>
              </div>
            </div>
            {selectedCashSession.status === 'pending' && (
              <Button className="bg-green-600 hover:bg-green-700">
                Approve Session
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Count 1 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Count 1</CardTitle>
                <CardDescription>First counter - Sarah Mitchell</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cash:</span>
                  <span className="font-semibold">$2,125.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">EFTPOS:</span>
                  <span className="font-semibold">$325.00</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="text-sm font-semibold">Total:</span>
                  <span className="font-bold text-green-600">$2,450.00</span>
                </div>
                <div className="mt-4 pt-3 border-t">
                  <p className="text-xs text-gray-600 mb-2">Counted at: 9:45 PM</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">Signed off</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Count 2 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Count 2</CardTitle>
                <CardDescription>Second counter - John Davis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cash:</span>
                  <span className="font-semibold">$2,125.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">EFTPOS:</span>
                  <span className="font-semibold">$325.00</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="text-sm font-semibold">Total:</span>
                  <span className="font-bold text-green-600">$2,450.00</span>
                </div>
                <div className="mt-4 pt-3 border-t">
                  <p className="text-xs text-gray-600 mb-2">Counted at: 9:52 PM</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">Signed off</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Variance Check */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Variance Check</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-2 border-green-300">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Counts Match</p>
                    <p className="text-sm text-gray-600">No variance detected</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600">$0.00</div>
              </div>
            </CardContent>
          </Card>

          {/* Banking Proof */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Banking Proof</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-4">Upload bank deposit receipt</p>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Finance</h2>
          <p className="text-gray-600 mt-1">Manage budgets, transactions, and cash sessions</p>
        </div>

        {/* Summary tiles */}
        <div className="grid grid-cols-4 gap-4">
          <MetricTile icon={DollarSign} label="YTD Income" value="$145k" status="green" />
          <MetricTile icon={DollarSign} label="YTD Expenses" value="$133k" status="green" />
          <MetricTile icon={AlertTriangle} label="Pending Approvals" value="2" status="amber" />
          <MetricTile icon={CheckCircle} label="Budget vs Actual" value="92%" status="green" />
        </div>

        {/* Cash Sessions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Cash Sessions</CardTitle>
                <CardDescription>Match day and event cash handling</CardDescription>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Session
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Event</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Variance</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900"></th>
                  </tr>
                </thead>
                <tbody>
                  {cashSessions.map((session) => (
                    <tr key={session.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedCashSession(session)}>
                      <td className="py-3 px-4 text-sm text-gray-900">{session.date}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{session.event}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">${session.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        {session.variance === 0 ? (
                          <span className="text-sm text-green-600">$0</span>
                        ) : (
                          <span className="text-sm text-amber-600">${session.variance}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <StatusChip status={session.status === 'approved' ? 'green' : 'amber'}>
                          {session.status}
                        </StatusChip>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Budget vs Actual */}
        <Card>
          <CardHeader>
            <CardTitle>Budget vs Actual - FY 2026</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: 'Player Registration', budget: 45000, actual: 42300, variance: -2700 },
                { category: 'Facility Costs', budget: 28000, actual: 29500, variance: 1500 },
                { category: 'Equipment', budget: 15000, actual: 12800, variance: -2200 },
                { category: 'Insurance', budget: 8500, actual: 8500, variance: 0 }
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-900 font-medium">{item.category}</span>
                    <div className="flex gap-4">
                      <span className="text-gray-600">Budget: ${item.budget.toLocaleString()}</span>
                      <span className="text-gray-900 font-semibold">Actual: ${item.actual.toLocaleString()}</span>
                      <span className={item.variance > 0 ? 'text-red-600' : 'text-green-600'}>
                        {item.variance > 0 ? '+' : ''}{item.variance.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.variance > 0 ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${(item.actual / item.budget) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Safety view - NEW
  const renderSafety = () => {
    if (showIncidentForm) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setShowIncidentForm(false)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Report Incident</h2>
              <p className="text-gray-600">Document safety incident details</p>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Incident Date</Label>
                  <Input type="date" className="mt-2" />
                </div>
                <div>
                  <Label>Incident Time</Label>
                  <Input type="time" className="mt-2" />
                </div>
              </div>

              <div>
                <Label>Severity Level</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor - No medical attention</SelectItem>
                    <SelectItem value="moderate">Moderate - First aid given</SelectItem>
                    <SelectItem value="serious">Serious - Medical attention required</SelectItem>
                    <SelectItem value="critical">Critical - Emergency services called</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Description</Label>
                <textarea 
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg resize-none"
                  rows={4}
                  placeholder="Describe what happened..."
                />
              </div>

              <div>
                <Label>Photos</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upload incident photos</p>
                  <Button variant="outline" size="sm" className="mt-3">Choose Files</Button>
                </div>
              </div>

              <div>
                <Label>Immediate Action Taken</Label>
                <textarea 
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg resize-none"
                  rows={3}
                  placeholder="What action was taken immediately?"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowIncidentForm(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast.success('Incident report submitted');
                  setShowIncidentForm(false);
                }}>
                  Submit Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (selectedEvent) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Match Day Checklist</h2>
                <p className="text-gray-600">{selectedEvent.name}</p>
              </div>
            </div>
            <Button 
              disabled={checklistItems.some(item => !item.completed)}
              onClick={() => toast.success('Match cleared to proceed')}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete & Sign Off
            </Button>
          </div>

          {checklistItems.some(item => !item.completed) && (
            <Card className="border-l-4 border-l-red-600 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <XCircle className="w-6 h-6 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-900">Match Blocked</p>
                    <p className="text-sm text-red-700">Complete all checklist items before match can proceed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Safety Checklist</CardTitle>
              <CardDescription>All items must be completed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checklistItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                    <button
                      onClick={() => {
                        setChecklistItems(checklistItems.map(i => 
                          i.id === item.id ? { ...i, completed: !i.completed } : i
                        ));
                      }}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        item.completed ? 'bg-green-600 border-green-600' : 'border-gray-300'
                      }`}
                    >
                      {item.completed && <CheckCircle className="w-4 h-4 text-white" />}
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${item.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {item.item}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Photo
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Safety</h2>
            <p className="text-gray-600 mt-1">Match day checklists and incident management</p>
          </div>
          <Button onClick={() => setShowIncidentForm(true)} className="bg-red-600 hover:bg-red-700">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Report Incident
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <MetricTile icon={Calendar} label="Upcoming Events" value="5" status="green" />
          <MetricTile icon={CheckCircle} label="Checklists Complete" value="12/15" status="amber" />
          <MetricTile icon={AlertTriangle} label="Incidents (YTD)" value="3" status="green" />
          <MetricTile icon={Shield} label="Risk Rating" value="Low" status="green" />
        </div>

        {/* Upcoming events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Match day safety checklists</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { id: 1, name: 'Home Match vs Brisbane City', date: 'Sat 1 Mar', checklist: 'pending' },
                { id: 2, name: 'Training Session', date: 'Tue 4 Mar', checklist: 'pending' },
                { id: 3, name: 'Away Match @ Gold Coast', date: 'Sat 8 Mar', checklist: 'pending' }
              ].map((event) => (
                <div key={event.id} 
                     className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                     onClick={() => setSelectedEvent(event)}>
                  <div>
                    <p className="font-medium text-gray-900">{event.name}</p>
                    <p className="text-sm text-gray-600">{event.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusChip status="amber">Checklist Pending</StatusChip>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent incidents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: '15 Feb 2026', type: 'Minor Injury', severity: 'Minor', status: 'Closed' },
                { date: '8 Feb 2026', type: 'Equipment Damage', severity: 'Minor', status: 'Closed' }
              ].map((incident, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{incident.type}</p>
                    <p className="text-sm text-gray-600">{incident.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{incident.severity}</Badge>
                    <StatusChip status="grey">{incident.status}</StatusChip>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Integrity view - NEW
  const renderIntegrity = () => {
    const cases = [
      { id: 'IC-2026-001', category: 'Code of Conduct', status: 'Investigation', severity: 'Medium', restricted: true },
      { id: 'IC-2026-002', category: 'Complaint', status: 'Hearing Scheduled', severity: 'High', restricted: true },
      { id: 'IC-2025-089', category: 'Appeal', status: 'Closed', severity: 'Low', restricted: false }
    ];

    if (selectedCase) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setSelectedCase(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Case {selectedCase.id}</h2>
              <p className="text-gray-600">{selectedCase.category}</p>
            </div>
          </div>

          {selectedCase.restricted && (
            <Card className="border-l-4 border-l-amber-600 bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-amber-600" />
                  <div>
                    <p className="font-semibold text-amber-900">Restricted Access</p>
                    <p className="text-sm text-amber-700">This case contains confidential information. Access is logged.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Case Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: '20 Feb 2026', event: 'Hearing scheduled', user: 'Integrity Officer' },
                  { date: '15 Feb 2026', event: 'Evidence submitted', user: 'Complainant' },
                  { date: '10 Feb 2026', event: 'Case opened', user: 'System' }
                ].map((entry, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{entry.event}</p>
                      <p className="text-xs text-gray-600">{entry.date} by {entry.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-3 border border-gray-200 rounded flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-900">Witness Statement.pdf</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-3 border border-gray-200 rounded flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-900">Evidence Photo.jpg</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hearing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-gray-600">Scheduled Date</Label>
                <p className="text-sm font-medium text-gray-900 mt-1">Tuesday, 25 February 2026 at 7:00 PM</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Panel Members</Label>
                <p className="text-sm text-gray-900 mt-1">3 panel members appointed</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Location</Label>
                <p className="text-sm text-gray-900 mt-1">Clubhouse Board Room</p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Integrity</h2>
            <p className="text-gray-600 mt-1">Complaints and code of conduct cases</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Case
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Case ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Severity</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Access</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900"></th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((caseItem) => (
                    <tr key={caseItem.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedCase(caseItem)}>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{caseItem.id}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{caseItem.category}</td>
                      <td className="py-3 px-4">
                        <StatusChip status={caseItem.status === 'Closed' ? 'grey' : 'amber'}>
                          {caseItem.status}
                        </StatusChip>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={
                          caseItem.severity === 'High' ? 'bg-red-50 text-red-700 border-red-300' :
                          caseItem.severity === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-300' :
                          'bg-gray-50 text-gray-700'
                        }>{caseItem.severity}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        {caseItem.restricted && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                            <Shield className="w-3 h-3 mr-1" />
                            Restricted
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Documents view - NEW
  const renderDocuments = () => {
    const cabinets = [
      { id: 'governance', label: 'Governance', icon: Shield, count: 24 },
      { id: 'finance', label: 'Finance', icon: DollarSign, count: 156 },
      { id: 'safety', label: 'Safety', icon: AlertTriangle, count: 45 },
      { id: 'integrity', label: 'Integrity', icon: FileText, count: 8 },
      { id: 'training', label: 'Training', icon: GraduationCap, count: 32 }
    ];

    const documents = [
      { name: 'AGM Minutes 2026.pdf', type: 'Minutes', version: 'v1.0', status: 'Final', date: '15 Mar 2026' },
      { name: 'Committee Meeting Feb 2026.pdf', type: 'Minutes', version: 'v1.0', status: 'Draft', date: '26 Feb 2026' },
      { name: 'Association Rules.pdf', type: 'Rules', version: 'v2.1', status: 'Current', date: '1 Jan 2026' }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
            <p className="text-gray-600 mt-1">Organized document management by category</p>
          </div>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {cabinets.map((cabinet) => {
            const Icon = cabinet.icon;
            return (
              <button
                key={cabinet.id}
                onClick={() => setSelectedCabinet(cabinet.id)}
                className={`p-6 border-2 rounded-lg text-center transition-all ${
                  selectedCabinet === cabinet.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className={`w-8 h-8 mx-auto mb-3 ${
                  selectedCabinet === cabinet.id ? 'text-blue-600' : 'text-gray-600'
                }`} />
                <p className="font-semibold text-gray-900">{cabinet.label}</p>
                <p className="text-sm text-gray-600 mt-1">{cabinet.count} docs</p>
              </button>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="capitalize">{selectedCabinet} Documents</CardTitle>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Version</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900"></th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-900">{doc.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{doc.type}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{doc.version}</td>
                      <td className="py-3 px-4">
                        <StatusChip status={doc.status === 'Final' || doc.status === 'Current' ? 'green' : 'amber'}>
                          {doc.status}
                        </StatusChip>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{doc.date}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Training view - NEW
  const renderTraining = () => {
    if (selectedCourse) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setSelectedCourse(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.title}</h2>
              <p className="text-gray-600">{selectedCourse.duration}</p>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-6">
                <div className="text-center text-white">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <Play className="w-10 h-10 text-white ml-2" />
                  </div>
                  <p className="text-lg font-medium">Video Player</p>
                  <p className="text-sm text-gray-400 mt-1">Click to start training</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Course Content</h3>
                  <div className="space-y-2">
                    {[
                      { title: 'Introduction', duration: '5 min', completed: false },
                      { title: 'Core Concepts', duration: '15 min', completed: false },
                      { title: 'Practical Application', duration: '10 min', completed: false },
                      { title: 'Assessment', duration: '5 min', completed: false }
                    ].map((module, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                            {module.completed && <CheckCircle className="w-4 h-4 text-green-600" />}
                          </div>
                          <span className="text-sm text-gray-900">{module.title}</span>
                        </div>
                        <span className="text-sm text-gray-600">{module.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Acknowledgement</p>
                      <p className="text-sm text-gray-700 mt-1">
                        I confirm that I have completed this training and understand the content covered.
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="w-full" onClick={() => {
                  toast.success('Training completed!');
                  setSelectedCourse(null);
                }}>
                  Complete Training
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Training</h2>
          <p className="text-gray-600 mt-1">Mandatory training and certifications</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <MetricTile icon={GraduationCap} label="Required Courses" value="12" status="green" />
          <MetricTile icon={CheckCircle} label="Completion Rate" value="75%" status="amber" />
          <MetricTile icon={AlertTriangle} label="Expiring Soon" value="4" status="amber" />
          <MetricTile icon={Users} label="Staff Trained" value="18/24" status="amber" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Role-Based Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { role: 'Coach', required: 3, completed: 2, expiring: 1 },
                { role: 'First Aid Officer', required: 2, completed: 2, expiring: 0 },
                { role: 'Committee Member', required: 1, completed: 1, expiring: 0 }
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-900">{item.role}</span>
                    <span className="text-gray-600">{item.completed}/{item.required} completed</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.completed === item.required ? 'bg-green-500' : 'bg-amber-500'}`}
                      style={{ width: `${(item.completed / item.required) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 1, title: 'Concussion Protocol', duration: '35 minutes', status: 'Required', expiry: null },
                { id: 2, title: 'First Aid Basics', duration: '45 minutes', status: 'Complete', expiry: '15 Jun 2026' },
                { id: 3, title: 'Code of Conduct', duration: '20 minutes', status: 'Complete', expiry: '31 Dec 2026' },
                { id: 4, title: 'Child Safety', duration: '60 minutes', status: 'Required', expiry: null }
              ].map((course) => (
                <div key={course.id} 
                     className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 cursor-pointer transition-all"
                     onClick={() => setSelectedCourse(course)}>
                  <div className="flex items-start justify-between mb-3">
                    <GraduationCap className="w-8 h-8 text-blue-600" />
                    <StatusChip status={course.status === 'Complete' ? 'green' : 'amber'}>
                      {course.status}
                    </StatusChip>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-600">{course.duration}</p>
                  {course.expiry && (
                    <p className="text-xs text-gray-500 mt-2">Expires: {course.expiry}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Reports view - NEW
  const renderReports = () => {
    if (selectedReport) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setSelectedReport(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedReport.title}</h2>
              <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Report Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <p className="font-semibold text-green-900">Report Generated Successfully</p>
                </div>
                <p className="text-sm text-gray-700">
                  This report contains all required information for {selectedReport.title.toLowerCase()}.
                </p>
              </div>

              <div>
                <Label className="text-sm text-gray-600">Report Period</Label>
                <p className="text-sm font-medium text-gray-900 mt-1">Financial Year 2025-2026</p>
              </div>

              <div>
                <Label className="text-sm text-gray-600">Sections Included</Label>
                <div className="mt-2 space-y-2">
                  {[
                    'Executive Summary',
                    'Compliance Overview',
                    'Financial Position',
                    'Risk Assessment',
                    'Recommendations'
                  ].map((section, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">{section}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
          <p className="text-gray-600 mt-1">Generate compliance and operational reports</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 1, title: 'OFT Compliance Pack', description: 'Annual return to Office of Fair Trading', icon: Shield },
                { id: 2, title: 'AGM Pack', description: 'Complete AGM documentation', icon: Calendar },
                { id: 3, title: 'Risk Report', description: 'Risk assessment and mitigation', icon: AlertTriangle },
                { id: 4, title: 'Training Report', description: 'Staff training compliance', icon: GraduationCap },
                { id: 5, title: 'Finance Controls Pack', description: 'Financial controls audit', icon: DollarSign },
                { id: 6, title: 'Safety Report', description: 'Incident and safety compliance', icon: Shield }
              ].map((report) => {
                const Icon = report.icon;
                return (
                  <div key={report.id} 
                       className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-600 cursor-pointer transition-all"
                       onClick={() => setSelectedReport(report)}>
                    <Icon className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                    <Button size="sm" variant="outline" className="w-full">
                      Generate Report
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Settings view
  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">Configure your association settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Club Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Club Name</Label>
            <Input defaultValue="Springwood United FC" className="mt-2" />
          </div>
          <div>
            <Label>Incorporation Number</Label>
            <Input defaultValue="IA12345" className="mt-2" />
          </div>
          <div>
            <Label>Governing Body</Label>
            <Select defaultValue="football-qld">
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="football-qld">Football Queensland</SelectItem>
                <SelectItem value="cricket-qld">Cricket Queensland</SelectItem>
                <SelectItem value="rugby-qld">Rugby Queensland</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Automation Mode</CardTitle>
          <CardDescription>Control how the system handles routine tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setAutomationMode('assist')}
              className={`p-6 border-2 rounded-lg text-left transition-all ${
                automationMode === 'assist' 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  automationMode === 'assist' ? 'border-blue-600' : 'border-gray-300'
                }`}>
                  {automationMode === 'assist' && (
                    <div className="w-3 h-3 rounded-full bg-blue-600" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900">Assist Mode</h3>
              </div>
              <p className="text-sm text-gray-600">
                You approve most actions. System prepares documents and drafts for your review.
              </p>
            </button>

            <button
              onClick={() => setAutomationMode('autopilot')}
              className={`p-6 border-2 rounded-lg text-left transition-all ${
                automationMode === 'autopilot' 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  automationMode === 'autopilot' ? 'border-blue-600' : 'border-gray-300'
                }`}>
                  {automationMode === 'autopilot' && (
                    <div className="w-3 h-3 rounded-full bg-blue-600" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900">Autopilot Mode</h3>
              </div>
              <p className="text-sm text-gray-600">
                System handles low-risk admin automatically. You review only critical decisions.
              </p>
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Recent Auto-Actions</h4>
            <div className="space-y-2">
              <div className="text-sm text-gray-700">• Meeting notice sent to committee (22 Feb 2026)</div>
              <div className="text-sm text-gray-700">• Blue card renewal reminder sent (20 Feb 2026)</div>
              <div className="text-sm text-gray-700">• Financial report generated (18 Feb 2026)</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900">Risk Disclaimer</p>
                <p className="text-sm text-amber-700 mt-1">
                  Committee remains legally responsible for all actions. Review audit log regularly.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // AI Panel
  const renderAIPanel = () => (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-2xl z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowAIPanel(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-gray-900">Ask a Question</Label>
            <Input 
              placeholder="e.g. When is our AGM due?" 
              className="mt-2"
            />
            <Button className="w-full mt-2">Ask</Button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Answer</h4>
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <p className="text-sm text-gray-900">
                Your AGM must be held by <strong>15 March 2026</strong>. Notice must be sent at least 21 days prior.
              </p>
              <div className="text-xs text-gray-600">
                <p className="font-medium mb-1">Sources:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3 h-3" />
                    <span>Association Rules v2.1 - Section 12.3</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-3 h-3" />
                    <span>QLD Associations Incorporation Act 1981</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Suggested Actions</h4>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule AGM
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Draft AGM Notice
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Review Member List
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'compliance':
        return renderCompliance();
      case 'meetings':
        return renderMeetings();
      case 'members':
        return renderMembers();
      case 'finance':
        return renderFinance();
      case 'safety':
        return renderSafety();
      case 'integrity':
        return renderIntegrity();
      case 'documents':
        return renderDocuments();
      case 'training':
        return renderTraining();
      case 'reports':
        return renderReports();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'safety', label: 'Safety', icon: AlertTriangle },
    { id: 'integrity', label: 'Integrity', icon: FileText },
    { id: 'documents', label: 'Documents', icon: Folder },
    { id: 'training', label: 'Training', icon: GraduationCap },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
    { id: 'help', label: 'Help', icon: HelpCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 fixed inset-y-0 left-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">QLD Assoc OS</h1>
              <p className="text-xs text-gray-600">Community Platform</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as View)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Select value={selectedClub} onValueChange={setSelectedClub}>
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Springwood United FC">Springwood United FC</SelectItem>
                    <SelectItem value="Brisbane Cricket Club">Brisbane Cricket Club</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 border border-green-300 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-green-600" />
                  <span className="text-sm font-semibold text-green-900">87</span>
                  <span className="text-xs text-green-700">Compliance Score</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => onSwitchModule?.('grow_hq')}>
                  Switch Module
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setShowNotifications(!showNotifications)}>
                  <Bell className="w-5 h-5" />
                </Button>
                <Button onClick={() => setShowAIPanel(true)} className="bg-gradient-to-r from-purple-600 to-blue-600">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Assistant
                </Button>
                <Button variant="ghost" size="icon">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {renderContent()}
        </div>
      </div>

      {/* AI Panel */}
      {showAIPanel && renderAIPanel()}
    </div>
  );
}
