import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Users,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  FileText,
  Search,
  Eye,
  Download,
  Upload,
  Edit,
  Lock,
  Trash2,
  UserCheck,
  UserX,
  Award,
  BookOpen,
  Bell,
  Activity,
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react';

type StaffRole = 
  | 'governing-body'
  | 'senior-manager'
  | 'compliance-officer'
  | 'complaints-officer'
  | 'client-manager'
  | 'operations-staff'
  | 'support-staff';

type ComplianceStatus = 'compliant' | 'warning' | 'overdue' | 'non-compliant';

interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  email: string;
  appointedDate: Date;
  status: 'active' | 'suspended' | 'inactive';
  
  // PDD Requirements
  identityVerified: boolean;
  identityVerifiedDate?: Date;
  identityExpiryDate?: Date;
  
  criminalCheckComplete: boolean;
  criminalCheckDate?: Date;
  criminalCheckExpiry?: Date;
  
  bankruptcyCheckComplete: boolean;
  bankruptcyCheckDate?: Date;
  
  professionalBodyVerified: boolean;
  professionalBody?: string;
  membershipNumber?: string;
  
  suitabilityAssessment: boolean;
  suitabilityDate?: Date;
  suitabilityOutcome?: 'suitable' | 'conditional' | 'unsuitable';
  
  conflictOfInterest: boolean;
  conflictDetails?: string;
  
  // Training
  initialTrainingComplete: boolean;
  initialTrainingDate?: Date;
  lastRefresherDate?: Date;
  nextRefresherDue?: Date;
  
  // AUSTRAC Notification
  austracNotified: boolean;
  austracNotificationDate?: Date;
  
  // Risk Assessment
  riskRating: 'low' | 'medium' | 'high';
  
  complianceStatus: ComplianceStatus;
}

interface RoleDefinition {
  role: StaffRole;
  title: string;
  icon: any;
  description: string;
  responsibilities: string[];
  pddRequired: {
    identityVerification: boolean;
    criminalCheck: boolean;
    bankruptcyCheck: boolean;
    professionalBody: boolean;
    suitabilityAssessment: boolean;
  };
  austracNotification: boolean;
  mandatoryTraining: string[];
}

export function PersonnelManagement() {
  const [activeTab, setActiveTab] = useState<'overview' | 'roster' | 'pdd' | 'training' | 'monitoring' | 'audit'>('overview');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterRole, setFilterRole] = useState<StaffRole | 'all'>('all');

  const roleDefinitions: RoleDefinition[] = [
    {
      role: 'governing-body',
      title: 'Governing Body',
      icon: Target,
      description: 'Board of Directors or Partners - Ultimate accountability for AML/CTF program',
      responsibilities: [
        'Approve AML/CTF Program and material changes',
        'Appoint Senior Manager',
        'Oversee compliance strategy',
        'Review effectiveness reports',
        'Ensure adequate resourcing'
      ],
      pddRequired: {
        identityVerification: true,
        criminalCheck: true,
        bankruptcyCheck: true,
        professionalBody: false,
        suitabilityAssessment: true
      },
      austracNotification: false,
      mandatoryTraining: ['AML/CTF Overview', 'Governance Responsibilities']
    },
    {
      role: 'senior-manager',
      title: 'Senior Manager',
      icon: Shield,
      description: 'Day-to-day management and approval authority',
      responsibilities: [
        'Approve Part A of AML/CTF Program',
        'Approve high-risk client engagements',
        'Approve SMR lodgements',
        'Review compliance reports',
        'Delegate authorities in writing',
        'Ensure program implementation'
      ],
      pddRequired: {
        identityVerification: true,
        criminalCheck: true,
        bankruptcyCheck: true,
        professionalBody: true,
        suitabilityAssessment: true
      },
      austracNotification: false,
      mandatoryTraining: ['AML/CTF Comprehensive', 'Risk Assessment', 'SMR Decision Making']
    },
    {
      role: 'compliance-officer',
      title: 'AML/CTF Compliance Officer',
      icon: UserCheck,
      description: 'Implements and monitors AML/CTF program',
      responsibilities: [
        'Monitor compliance with program',
        'Conduct risk assessments',
        'Implement CDD procedures',
        'Manage screening and monitoring',
        'Prepare compliance reports',
        'Liaise with AUSTRAC',
        'Coordinate training',
        'Investigate suspicious matters'
      ],
      pddRequired: {
        identityVerification: true,
        criminalCheck: true,
        bankruptcyCheck: true,
        professionalBody: true,
        suitabilityAssessment: true
      },
      austracNotification: true,
      mandatoryTraining: ['AML/CTF Comprehensive', 'CDD Procedures', 'Screening', 'Monitoring', 'SMR/TTR', 'Investigation']
    },
    {
      role: 'complaints-officer',
      title: 'Complaints Officer',
      icon: Bell,
      description: 'Handles complaints and dispute resolution',
      responsibilities: [
        'Receive and record complaints',
        'Investigate complaints',
        'Coordinate resolution',
        'Report to governing body',
        'Maintain complaints register'
      ],
      pddRequired: {
        identityVerification: true,
        criminalCheck: true,
        bankruptcyCheck: true,
        professionalBody: false,
        suitabilityAssessment: true
      },
      austracNotification: false,
      mandatoryTraining: ['Complaints Handling', 'Privacy & Confidentiality']
    },
    {
      role: 'client-manager',
      title: 'Client Manager',
      icon: Users,
      description: 'Manages client relationships and onboarding',
      responsibilities: [
        'Conduct client onboarding',
        'Collect CDD information',
        'Assess client risk',
        'Monitor client relationships',
        'Identify suspicious activity',
        'Escalate to compliance officer'
      ],
      pddRequired: {
        identityVerification: true,
        criminalCheck: true,
        bankruptcyCheck: false,
        professionalBody: false,
        suitabilityAssessment: true
      },
      austracNotification: false,
      mandatoryTraining: ['AML/CTF Overview', 'CDD Basics', 'Red Flags', 'Escalation Procedures']
    },
    {
      role: 'operations-staff',
      title: 'Operations Staff',
      icon: Activity,
      description: 'Supports operational processes',
      responsibilities: [
        'Process transactions',
        'Maintain records',
        'Support compliance activities',
        'Report unusual activity'
      ],
      pddRequired: {
        identityVerification: true,
        criminalCheck: false,
        bankruptcyCheck: false,
        professionalBody: false,
        suitabilityAssessment: true
      },
      austracNotification: false,
      mandatoryTraining: ['AML/CTF Awareness', 'Record Keeping']
    }
  ];

  const [staffRoster, setStaffRoster] = useState<StaffMember[]>([
    {
      id: 'S001',
      name: 'Sarah Johnson',
      role: 'governing-body',
      email: 'sarah.johnson@firm.com',
      appointedDate: new Date('2023-01-15'),
      status: 'active',
      identityVerified: true,
      identityVerifiedDate: new Date('2023-01-10'),
      criminalCheckComplete: true,
      criminalCheckDate: new Date('2023-01-12'),
      criminalCheckExpiry: new Date('2024-01-12'),
      bankruptcyCheckComplete: true,
      bankruptcyCheckDate: new Date('2023-01-12'),
      professionalBodyVerified: true,
      professionalBody: 'CPA Australia',
      membershipNumber: 'CPA123456',
      suitabilityAssessment: true,
      suitabilityDate: new Date('2023-01-14'),
      suitabilityOutcome: 'suitable',
      conflictOfInterest: false,
      initialTrainingComplete: true,
      initialTrainingDate: new Date('2023-01-20'),
      lastRefresherDate: new Date('2024-01-20'),
      nextRefresherDue: new Date('2025-01-20'),
      austracNotified: false,
      riskRating: 'low',
      complianceStatus: 'compliant'
    },
    {
      id: 'S002',
      name: 'Michael Chen',
      role: 'senior-manager',
      email: 'michael.chen@firm.com',
      appointedDate: new Date('2023-01-15'),
      status: 'active',
      identityVerified: true,
      identityVerifiedDate: new Date('2023-01-10'),
      criminalCheckComplete: true,
      criminalCheckDate: new Date('2023-01-12'),
      criminalCheckExpiry: new Date('2024-01-12'),
      bankruptcyCheckComplete: true,
      bankruptcyCheckDate: new Date('2023-01-12'),
      professionalBodyVerified: true,
      professionalBody: 'Chartered Accountants ANZ',
      membershipNumber: 'CA987654',
      suitabilityAssessment: true,
      suitabilityDate: new Date('2023-01-14'),
      suitabilityOutcome: 'suitable',
      conflictOfInterest: false,
      initialTrainingComplete: true,
      initialTrainingDate: new Date('2023-01-20'),
      lastRefresherDate: new Date('2024-01-20'),
      nextRefresherDue: new Date('2025-01-20'),
      austracNotified: false,
      riskRating: 'low',
      complianceStatus: 'compliant'
    },
    {
      id: 'S003',
      name: 'Emma Wilson',
      role: 'compliance-officer',
      email: 'emma.wilson@firm.com',
      appointedDate: new Date('2023-02-01'),
      status: 'active',
      identityVerified: true,
      identityVerifiedDate: new Date('2023-01-25'),
      criminalCheckComplete: true,
      criminalCheckDate: new Date('2023-01-28'),
      criminalCheckExpiry: new Date('2024-01-28'),
      bankruptcyCheckComplete: true,
      bankruptcyCheckDate: new Date('2023-01-28'),
      professionalBodyVerified: true,
      professionalBody: 'CPA Australia',
      membershipNumber: 'CPA654321',
      suitabilityAssessment: true,
      suitabilityDate: new Date('2023-01-30'),
      suitabilityOutcome: 'suitable',
      conflictOfInterest: false,
      initialTrainingComplete: true,
      initialTrainingDate: new Date('2023-02-05'),
      lastRefresherDate: new Date('2024-02-05'),
      nextRefresherDue: new Date('2025-02-05'),
      austracNotified: true,
      austracNotificationDate: new Date('2023-02-10'),
      riskRating: 'low',
      complianceStatus: 'compliant'
    },
    {
      id: 'S004',
      name: 'James Patterson',
      role: 'complaints-officer',
      email: 'james.patterson@firm.com',
      appointedDate: new Date('2023-03-01'),
      status: 'active',
      identityVerified: true,
      identityVerifiedDate: new Date('2023-02-25'),
      criminalCheckComplete: true,
      criminalCheckDate: new Date('2024-01-15'),
      criminalCheckExpiry: new Date('2025-01-15'),
      bankruptcyCheckComplete: true,
      bankruptcyCheckDate: new Date('2023-02-25'),
      professionalBodyVerified: false,
      suitabilityAssessment: true,
      suitabilityDate: new Date('2023-02-28'),
      suitabilityOutcome: 'suitable',
      conflictOfInterest: false,
      initialTrainingComplete: true,
      initialTrainingDate: new Date('2023-03-10'),
      lastRefresherDate: new Date('2024-03-10'),
      nextRefresherDue: new Date('2025-03-10'),
      austracNotified: false,
      riskRating: 'low',
      complianceStatus: 'compliant'
    },
    {
      id: 'S005',
      name: 'Lisa Martinez',
      role: 'client-manager',
      email: 'lisa.martinez@firm.com',
      appointedDate: new Date('2023-06-01'),
      status: 'active',
      identityVerified: true,
      identityVerifiedDate: new Date('2023-05-25'),
      criminalCheckComplete: true,
      criminalCheckDate: new Date('2023-05-28'),
      criminalCheckExpiry: new Date('2024-05-28'),
      bankruptcyCheckComplete: false,
      professionalBodyVerified: false,
      suitabilityAssessment: true,
      suitabilityDate: new Date('2023-05-30'),
      suitabilityOutcome: 'suitable',
      conflictOfInterest: false,
      initialTrainingComplete: true,
      initialTrainingDate: new Date('2023-06-10'),
      lastRefresherDate: new Date('2024-06-10'),
      nextRefresherDue: new Date('2025-06-10'),
      austracNotified: false,
      riskRating: 'low',
      complianceStatus: 'warning'
    }
  ]);

  const getComplianceStats = () => {
    const total = staffRoster.length;
    const compliant = staffRoster.filter(s => s.complianceStatus === 'compliant').length;
    const warning = staffRoster.filter(s => s.complianceStatus === 'warning').length;
    const overdue = staffRoster.filter(s => s.complianceStatus === 'overdue').length;
    const nonCompliant = staffRoster.filter(s => s.complianceStatus === 'non-compliant').length;

    const criminalChecksExpiring = staffRoster.filter(s => {
      if (!s.criminalCheckExpiry) return false;
      const daysUntilExpiry = Math.floor((s.criminalCheckExpiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length;

    const trainingOverdue = staffRoster.filter(s => {
      if (!s.nextRefresherDue) return false;
      return s.nextRefresherDue < new Date();
    }).length;

    return {
      total,
      compliant,
      warning,
      overdue,
      nonCompliant,
      criminalChecksExpiring,
      trainingOverdue
    };
  };

  const stats = getComplianceStats();

  const filteredStaff = filterRole === 'all' 
    ? staffRoster 
    : staffRoster.filter(s => s.role === filterRole);

  const getRoleDefinition = (role: StaffRole) => {
    return roleDefinitions.find(r => r.role === role);
  };

  const getStatusColor = (status: ComplianceStatus) => {
    switch (status) {
      case 'compliant': return 'green';
      case 'warning': return 'yellow';
      case 'overdue': return 'orange';
      case 'non-compliant': return 'red';
    }
  };

  const getStatusIcon = (status: ComplianceStatus) => {
    switch (status) {
      case 'compliant': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'overdue': return Clock;
      case 'non-compliant': return XCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Users className="w-16 h-16" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Personnel Management</h1>
              <p className="text-xl text-indigo-100">AUSTRAC-Compliant Staff Monitoring & Personnel Due Diligence</p>
            </div>
          </div>
          <Button className="bg-white text-indigo-400 hover:bg-indigo-500/10">
            <Upload className="w-5 h-5 mr-2" />
            Add New Staff Member
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-white/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-100">Total Staff</h3>
            <Users className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-3xl font-bold text-slate-100">{stats.total}</p>
        </div>

        <div className="bg-white rounded-lg border border-green-500/30 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-100">Compliant</h3>
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-green-400">{stats.compliant}</p>
        </div>

        <div className="bg-white rounded-lg border border-yellow-500/30 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-100">Warning</h3>
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-yellow-400">{stats.warning}</p>
        </div>

        <div className="bg-white rounded-lg border border-orange-500/30 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-100">Overdue</h3>
            <Clock className="w-6 h-6 text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-orange-400">{stats.overdue}</p>
        </div>

        <div className="bg-white rounded-lg border border-red-500/30 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-100">Non-Compliant</h3>
            <XCircle className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-red-400">{stats.nonCompliant}</p>
        </div>

        <div className="bg-white rounded-lg border border-blue-500/30 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-100">Checks Due</h3>
            <Bell className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-blue-400">{stats.criminalChecksExpiring}</p>
        </div>
      </div>

      {/* Alerts Banner */}
      {(stats.criminalChecksExpiring > 0 || stats.trainingOverdue > 0) && (
        <div className="bg-orange-500/10 border-2 border-orange-500/30 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Bell className="w-6 h-6 text-orange-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-orange-300 mb-2">Action Required</h3>
              <ul className="space-y-1 text-orange-300">
                {stats.criminalChecksExpiring > 0 && (
                  <li>• {stats.criminalChecksExpiring} criminal history check{stats.criminalChecksExpiring > 1 ? 's' : ''} expiring within 30 days</li>
                )}
                {stats.trainingOverdue > 0 && (
                  <li>• {stats.trainingOverdue} staff member{stats.trainingOverdue > 1 ? 's' : ''} have overdue training refreshers</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="flex gap-2">
          {[
            { id: 'overview', label: 'Role Definitions', icon: Target },
            { id: 'roster', label: 'Staff Roster', icon: Users },
            { id: 'pdd', label: 'Personnel Due Diligence', icon: UserCheck },
            { id: 'training', label: 'Training & Competency', icon: BookOpen },
            { id: 'monitoring', label: 'Ongoing Monitoring', icon: Activity },
            { id: 'audit', label: 'Audit Trail', icon: Eye }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-semibold flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-indigo-600 text-indigo-400'
                    : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Role Definitions Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="font-bold text-blue-300 mb-2">AUSTRAC Personnel Requirements</h3>
            <p className="text-sm text-blue-300">
              Under the AML/CTF Act, reporting entities must conduct Personnel Due Diligence (PDD) on specific roles. 
              Each role has different screening requirements and responsibilities.
            </p>
          </div>

          {roleDefinitions.map((roleDef) => {
            const Icon = roleDef.icon;
            const staffCount = staffRoster.filter(s => s.role === roleDef.role).length;

            return (
              <div key={roleDef.role} className="bg-white rounded-lg border-2 border-white/10 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-100">{roleDef.title}</h3>
                        <span className="px-3 py-1 bg-indigo-500/15 text-indigo-300 text-sm font-semibold rounded-full">
                          {staffCount} assigned
                        </span>
                        {roleDef.austracNotification && (
                          <span className="px-3 py-1 bg-red-500/15 text-red-300 text-sm font-semibold rounded-full">
                            AUSTRAC Notification Required
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 mb-4">{roleDef.description}</p>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-slate-100 mb-2">Key Responsibilities</h4>
                          <ul className="space-y-1">
                            {roleDef.responsibilities.map((resp, index) => (
                              <li key={index} className="text-sm text-slate-300 flex items-start">
                                <span className="mr-2">•</span>
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-slate-100 mb-2">PDD Requirements</h4>
                          <div className="space-y-2">
                            {Object.entries(roleDef.pddRequired).map(([key, required]) => (
                              <div key={key} className="flex items-center justify-between">
                                <span className="text-sm text-slate-300">
                                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </span>
                                {required ? (
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-gray-300" />
                                )}
                              </div>
                            ))}
                          </div>

                          <h4 className="font-semibold text-slate-100 mt-4 mb-2">Mandatory Training</h4>
                          <div className="space-y-1">
                            {roleDef.mandatoryTraining.map((training, index) => (
                              <div key={index} className="text-sm text-slate-300 flex items-center">
                                <BookOpen className="w-3 h-3 mr-2 text-slate-400" />
                                {training}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Staff Roster Tab */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          {/* Role Filter */}
          <div className="bg-white rounded-lg border border-white/10 p-4">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-slate-100">Filter by Role:</span>
              <button
                onClick={() => setFilterRole('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterRole === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                All ({staffRoster.length})
              </button>
              {roleDefinitions.map((roleDef) => {
                const count = staffRoster.filter(s => s.role === roleDef.role).length;
                return (
                  <button
                    key={roleDef.role}
                    onClick={() => setFilterRole(roleDef.role)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      filterRole === roleDef.role
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {roleDef.title} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Staff List */}
          <div className="space-y-3">
            {filteredStaff.map((staff) => {
              const StatusIcon = getStatusIcon(staff.complianceStatus);
              const statusColor = getStatusColor(staff.complianceStatus);
              const roleDef = getRoleDefinition(staff.role);

              return (
                <div key={staff.id} className={`bg-white rounded-lg border-2 p-6 ${
                  staff.complianceStatus === 'compliant' ? 'border-green-500/30' :
                  staff.complianceStatus === 'warning' ? 'border-yellow-500/30' :
                  staff.complianceStatus === 'overdue' ? 'border-orange-500/30' :
                  'border-red-500/30'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-14 h-14 bg-${statusColor}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                        <Users className={`w-7 h-7 text-${statusColor}-600`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-slate-100">{staff.name}</h3>
                          <span className={`px-3 py-1 bg-${statusColor}-100 text-${statusColor}-700 text-sm font-bold rounded-full flex items-center gap-1`}>
                            <StatusIcon className="w-4 h-4" />
                            {staff.complianceStatus.toUpperCase()}
                          </span>
                          {staff.status === 'active' ? (
                            <span className="px-3 py-1 bg-green-500/15 text-green-300 text-sm font-semibold rounded-full">
                              ACTIVE
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-white/5 text-slate-300 text-sm font-semibold rounded-full">
                              {staff.status.toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-300 mb-4">
                          <span className="font-semibold text-indigo-400">{roleDef?.title}</span>
                          <span>•</span>
                          <span>{staff.email}</span>
                          <span>•</span>
                          <span>Appointed: {staff.appointedDate.toLocaleDateString()}</span>
                          {staff.austracNotified && (
                            <>
                              <span>•</span>
                              <span className="flex items-center text-blue-400">
                                <Shield className="w-4 h-4 mr-1" />
                                AUSTRAC Notified
                              </span>
                            </>
                          )}
                        </div>

                        {/* Compliance Checks Grid */}
                        <div className="grid grid-cols-5 gap-3">
                          <div className={`p-3 rounded-lg border ${
                            staff.identityVerified ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'
                          }`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-slate-300">Identity</span>
                              {staff.identityVerified ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-400" />
                              )}
                            </div>
                            {staff.identityVerifiedDate && (
                              <p className="text-xs text-slate-300">
                                {staff.identityVerifiedDate.toLocaleDateString()}
                              </p>
                            )}
                          </div>

                          <div className={`p-3 rounded-lg border ${
                            staff.criminalCheckComplete ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'
                          }`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-slate-300">Criminal</span>
                              {staff.criminalCheckComplete ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-400" />
                              )}
                            </div>
                            {staff.criminalCheckExpiry && (
                              <p className={`text-xs ${
                                staff.criminalCheckExpiry < new Date() ? 'text-red-400 font-semibold' :
                                Math.floor((staff.criminalCheckExpiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 30 ? 'text-orange-400 font-semibold' :
                                'text-slate-300'
                              }`}>
                                Exp: {staff.criminalCheckExpiry.toLocaleDateString()}
                              </p>
                            )}
                          </div>

                          <div className={`p-3 rounded-lg border ${
                            staff.bankruptcyCheckComplete ? 'border-green-500/30 bg-green-500/10' : 
                            roleDef?.pddRequired.bankruptcyCheck ? 'border-red-500/30 bg-red-500/10' : 'border-white/10 bg-white/5'
                          }`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-slate-300">Bankruptcy</span>
                              {roleDef?.pddRequired.bankruptcyCheck ? (
                                staff.bankruptcyCheckComplete ? (
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-400" />
                                )
                              ) : (
                                <span className="text-xs text-slate-400">N/A</span>
                              )}
                            </div>
                            {staff.bankruptcyCheckDate && (
                              <p className="text-xs text-slate-300">
                                {staff.bankruptcyCheckDate.toLocaleDateString()}
                              </p>
                            )}
                          </div>

                          <div className={`p-3 rounded-lg border ${
                            staff.suitabilityAssessment ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'
                          }`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-slate-300">Suitability</span>
                              {staff.suitabilityAssessment ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-400" />
                              )}
                            </div>
                            {staff.suitabilityOutcome && (
                              <p className={`text-xs font-semibold ${
                                staff.suitabilityOutcome === 'suitable' ? 'text-green-400' :
                                staff.suitabilityOutcome === 'conditional' ? 'text-yellow-400' :
                                'text-red-400'
                              }`}>
                                {staff.suitabilityOutcome.toUpperCase()}
                              </p>
                            )}
                          </div>

                          <div className={`p-3 rounded-lg border ${
                            staff.initialTrainingComplete ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'
                          }`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-slate-300">Training</span>
                              {staff.initialTrainingComplete ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-400" />
                              )}
                            </div>
                            {staff.nextRefresherDue && (
                              <p className={`text-xs ${
                                staff.nextRefresherDue < new Date() ? 'text-red-400 font-semibold' :
                                'text-slate-300'
                              }`}>
                                Due: {staff.nextRefresherDue.toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedStaff(staff)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Full PDD
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PDD Tab */}
      {activeTab === 'pdd' && (
        <div className="space-y-6">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
            <h3 className="font-bold text-blue-300 mb-3">Personnel Due Diligence (PDD) Requirements</h3>
            <p className="text-sm text-blue-300 mb-4">
              Under the AML/CTF Act, reporting entities must conduct PDD on certain personnel before appointment 
              and maintain ongoing monitoring. Requirements vary by role.
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-slate-100 mb-2">Before Appointment</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Identity verification</li>
                  <li>• Criminal history check</li>
                  <li>• Bankruptcy check</li>
                  <li>• Professional body verification</li>
                  <li>• Suitability assessment</li>
                  <li>• Conflict of interest check</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-slate-100 mb-2">Ongoing Requirements</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Annual criminal check renewal</li>
                  <li>• Training refreshers (annual)</li>
                  <li>• Performance monitoring</li>
                  <li>• Trigger-based reassessment</li>
                  <li>• Conflict reviews</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-slate-100 mb-2">Record Retention</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• 7 years after role ends</li>
                  <li>• Immutable timestamps</li>
                  <li>• Evidence hashing</li>
                  <li>• Access logging</li>
                  <li>• Version control</li>
                </ul>
              </div>
            </div>
          </div>

          {/* PDD Checklist Matrix */}
          <div className="bg-white rounded-lg border border-white/10 p-6">
            <h3 className="text-xl font-bold text-slate-100 mb-4">PDD Compliance Matrix</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-white/10">
                    <th className="text-left p-3 font-semibold text-slate-100">Staff Member</th>
                    <th className="text-left p-3 font-semibold text-slate-100">Role</th>
                    <th className="text-center p-3 font-semibold text-slate-100">ID</th>
                    <th className="text-center p-3 font-semibold text-slate-100">Criminal</th>
                    <th className="text-center p-3 font-semibold text-slate-100">Bankruptcy</th>
                    <th className="text-center p-3 font-semibold text-slate-100">Prof Body</th>
                    <th className="text-center p-3 font-semibold text-slate-100">Suitability</th>
                    <th className="text-center p-3 font-semibold text-slate-100">Training</th>
                    <th className="text-center p-3 font-semibold text-slate-100">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {staffRoster.map((staff) => {
                    const roleDef = getRoleDefinition(staff.role);
                    const StatusIcon = getStatusIcon(staff.complianceStatus);
                    
                    return (
                      <tr key={staff.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="p-3">
                          <div>
                            <p className="font-semibold text-slate-100">{staff.name}</p>
                            <p className="text-xs text-slate-300">{staff.email}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="text-sm text-indigo-400 font-semibold">{roleDef?.title}</span>
                        </td>
                        <td className="p-3 text-center">
                          {staff.identityVerified ? (
                            <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {staff.criminalCheckComplete ? (
                            <div className="flex flex-col items-center">
                              <CheckCircle className="w-5 h-5 text-green-400" />
                              {staff.criminalCheckExpiry && (
                                <span className={`text-xs mt-1 ${
                                  staff.criminalCheckExpiry < new Date() ? 'text-red-400 font-bold' :
                                  Math.floor((staff.criminalCheckExpiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 30 ? 'text-orange-400 font-bold' :
                                  'text-slate-300'
                                }`}>
                                  {staff.criminalCheckExpiry.toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {roleDef?.pddRequired.bankruptcyCheck ? (
                            staff.bankruptcyCheckComplete ? (
                              <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                            )
                          ) : (
                            <span className="text-xs text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {roleDef?.pddRequired.professionalBody ? (
                            staff.professionalBodyVerified ? (
                              <div className="flex flex-col items-center">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                {staff.professionalBody && (
                                  <span className="text-xs text-slate-300 mt-1">{staff.professionalBody}</span>
                                )}
                              </div>
                            ) : (
                              <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                            )
                          ) : (
                            <span className="text-xs text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {staff.suitabilityAssessment ? (
                            <div className="flex flex-col items-center">
                              <CheckCircle className="w-5 h-5 text-green-400" />
                              <span className={`text-xs mt-1 font-semibold ${
                                staff.suitabilityOutcome === 'suitable' ? 'text-green-400' :
                                staff.suitabilityOutcome === 'conditional' ? 'text-yellow-400' :
                                'text-red-400'
                              }`}>
                                {staff.suitabilityOutcome?.toUpperCase()}
                              </span>
                            </div>
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {staff.initialTrainingComplete ? (
                            <div className="flex flex-col items-center">
                              <CheckCircle className="w-5 h-5 text-green-400" />
                              {staff.nextRefresherDue && (
                                <span className={`text-xs mt-1 ${
                                  staff.nextRefresherDue < new Date() ? 'text-red-400 font-bold' :
                                  'text-slate-300'
                                }`}>
                                  {staff.nextRefresherDue.toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <StatusIcon className={`w-5 h-5 text-${getStatusColor(staff.complianceStatus)}-600 mx-auto`} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Monitoring Tab */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
            <h3 className="font-bold text-yellow-300 mb-3">Ongoing Monitoring Requirements</h3>
            <p className="text-sm text-yellow-300">
              Personnel must be continuously monitored for compliance with PDD requirements. 
              System automatically generates alerts for expiring checks, overdue training, and trigger events.
            </p>
          </div>

          {/* Monitoring Alerts */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-white/10 p-6">
              <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-400" />
                Expiring Criminal Checks (Next 90 Days)
              </h3>

              <div className="space-y-3">
                {staffRoster
                  .filter(s => {
                    if (!s.criminalCheckExpiry) return false;
                    const daysUntilExpiry = Math.floor((s.criminalCheckExpiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return daysUntilExpiry <= 90 && daysUntilExpiry >= 0;
                  })
                  .sort((a, b) => (a.criminalCheckExpiry!.getTime() - b.criminalCheckExpiry!.getTime()))
                  .map((staff) => {
                    const daysUntilExpiry = Math.floor((staff.criminalCheckExpiry!.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={staff.id} className={`p-4 rounded-lg border-2 ${
                        daysUntilExpiry <= 30 ? 'border-red-500/30 bg-red-500/10' :
                        daysUntilExpiry <= 60 ? 'border-orange-500/30 bg-orange-500/10' :
                        'border-yellow-500/30 bg-yellow-500/10'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-100">{staff.name}</p>
                            <p className="text-sm text-slate-300">{getRoleDefinition(staff.role)?.title}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${
                              daysUntilExpiry <= 30 ? 'text-red-400' :
                              daysUntilExpiry <= 60 ? 'text-orange-400' :
                              'text-yellow-400'
                            }`}>
                              {daysUntilExpiry} days
                            </p>
                            <p className="text-xs text-slate-300">
                              Exp: {staff.criminalCheckExpiry!.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700">
                          Request Renewal
                        </Button>
                      </div>
                    );
                  })}
                
                {staffRoster.filter(s => {
                  if (!s.criminalCheckExpiry) return false;
                  const daysUntilExpiry = Math.floor((s.criminalCheckExpiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return daysUntilExpiry <= 90 && daysUntilExpiry >= 0;
                }).length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <p className="text-slate-300">No criminal checks expiring in next 90 days</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-white/10 p-6">
              <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                Overdue Training Refreshers
              </h3>

              <div className="space-y-3">
                {staffRoster
                  .filter(s => s.nextRefresherDue && s.nextRefresherDue < new Date())
                  .sort((a, b) => (a.nextRefresherDue!.getTime() - b.nextRefresherDue!.getTime()))
                  .map((staff) => {
                    const daysOverdue = Math.floor((new Date().getTime() - staff.nextRefresherDue!.getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={staff.id} className="p-4 rounded-lg border-2 border-red-500/30 bg-red-500/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-100">{staff.name}</p>
                            <p className="text-sm text-slate-300">{getRoleDefinition(staff.role)?.title}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-red-400">{daysOverdue} days overdue</p>
                            <p className="text-xs text-slate-300">
                              Due: {staff.nextRefresherDue!.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" className="w-full mt-3 bg-red-600 hover:bg-red-700">
                          Schedule Training
                        </Button>
                      </div>
                    );
                  })}

                {staffRoster.filter(s => s.nextRefresherDue && s.nextRefresherDue < new Date()).length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <p className="text-slate-300">All staff training up to date</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Trigger-Based Reassessment */}
          <div className="bg-white rounded-lg border border-white/10 p-6">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Trigger-Based Reassessment Events</h3>
            
            <div className="space-y-3">
              <div className="p-4 border-l-4 border-red-600 bg-red-500/10 rounded-r-lg">
                <h4 className="font-semibold text-red-300 mb-2">Critical Triggers (Immediate Reassessment)</h4>
                <ul className="text-sm text-red-300 space-y-1">
                  <li>• Criminal charges or convictions</li>
                  <li>• Bankruptcy or insolvency proceedings</li>
                  <li>• Professional body sanctions or deregistration</li>
                  <li>• Serious breach of AML/CTF obligations</li>
                  <li>• Misconduct investigation</li>
                </ul>
              </div>

              <div className="p-4 border-l-4 border-orange-600 bg-orange-500/10 rounded-r-lg">
                <h4 className="font-semibold text-orange-300 mb-2">High Triggers (Review Within 30 Days)</h4>
                <ul className="text-sm text-orange-300 space-y-1">
                  <li>• Change in role or responsibilities</li>
                  <li>• Significant performance issues</li>
                  <li>• Customer complaints regarding conduct</li>
                  <li>• Unexplained wealth or lifestyle changes</li>
                  <li>• Association with high-risk clients</li>
                </ul>
              </div>

              <div className="p-4 border-l-4 border-yellow-600 bg-yellow-500/10 rounded-r-lg">
                <h4 className="font-semibold text-yellow-300 mb-2">Medium Triggers (Review Within 90 Days)</h4>
                <ul className="text-sm text-yellow-300 space-y-1">
                  <li>• Change in personal circumstances</li>
                  <li>• New conflicts of interest</li>
                  <li>• Training non-compliance</li>
                  <li>• Extended leave or absence</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
