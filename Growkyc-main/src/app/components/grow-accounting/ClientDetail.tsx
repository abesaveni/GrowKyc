import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Briefcase,
  FileText,
  DollarSign,
  Edit,
  MoreVertical,
  Plus,
  Download,
  MessageSquare,
  Star,
  Activity,
  ChevronRight,
  Upload,
  FolderClosed
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface ClientDetailProps {
  onNavigate?: (page: string, id?: string) => void;
  clientId?: string;
}

interface Job {
  id: string;
  type: string;
  year: string;
  status: 'in_progress' | 'complete' | 'pending' | 'overdue';
  dueDate: string;
  assignedTo: string;
  progress: number;
}

interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

interface Note {
  id: string;
  text: string;
  createdBy: string;
  createdAt: string;
}

export function ClientDetail({ onNavigate, clientId = 'CLT-001' }: ClientDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'documents' | 'contacts' | 'notes'>('overview');
  const [newNote, setNewNote] = useState('');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);

  // Mock data
  const clientData = {
    id: clientId,
    name: 'Smith SMSF',
    entityType: 'SMSF',
    abn: '48 123 456 789',
    trustee: 'John Smith',
    status: 'active',
    rating: 4.8,
    clientSince: '2019-03-15',
    lastActivity: '2024-03-01',
    address: {
      street: '123 Collins Street',
      city: 'Melbourne',
      state: 'VIC',
      postcode: '3000'
    },
    billingInfo: {
      totalBilled: '$42,500',
      currentBalance: '$2,400',
      lastInvoice: '2024-02-15',
      paymentTerms: 'Net 30'
    },
    performance: {
      jobsCompleted: 28,
      onTimeCompletion: 96,
      avgResponseTime: '2.4 hours',
      satisfaction: 4.8
    }
  };

  const jobs: Job[] = [
    { id: 'JOB-2024-003', type: 'BAS Reconciliation', year: 'Q4 2024', status: 'in_progress', dueDate: '2024-03-18', assignedTo: 'Mike Brown', progress: 68 },
    { id: 'JOB-2024-002', type: 'Super Compliance', year: 'Q3 2024', status: 'complete', dueDate: '2024-02-28', assignedTo: 'Emily Davis', progress: 100 },
    { id: 'JOB-2024-001', type: 'Year End', year: 'FY2023', status: 'complete', dueDate: '2023-11-30', assignedTo: 'Mike Brown', progress: 100 },
    { id: 'JOB-2023-012', type: 'Tax Return', year: 'FY2023', status: 'complete', dueDate: '2023-10-31', assignedTo: 'Sarah Johnson', progress: 100 }
  ];

  const contacts: Contact[] = [
    { id: 'CON-001', name: 'John Smith', role: 'Trustee', email: 'john@smithsmsf.com.au', phone: '0412 345 678', isPrimary: true },
    { id: 'CON-002', name: 'Mary Smith', role: 'Member', email: 'mary@smithsmsf.com.au', phone: '0423 456 789', isPrimary: false },
    { id: 'CON-003', name: 'David Chen', role: 'Accountant', email: 'david@smithsmsf.com.au', phone: '0434 567 890', isPrimary: false }
  ];

  const notes: Note[] = [
    { id: 'NOTE-001', text: 'Client prefers email communication for all routine matters. Available M-F 9am-5pm.', createdBy: 'Mike Brown', createdAt: '2024-02-15' },
    { id: 'NOTE-002', text: 'Discussed investment strategy for SMSF. Client is risk-averse, prefers conservative allocation.', createdBy: 'Sarah Johnson', createdAt: '2024-01-20' },
    { id: 'NOTE-003', text: 'Annual review meeting scheduled for March 30, 2024. Prepare performance summary and recommendations.', createdBy: 'Mike Brown', createdAt: '2024-01-10' }
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-50 text-green-700 border-green-300',
      inactive: 'bg-gray-50 text-gray-700 border-gray-300',
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-300'
    };
    return styles[status as keyof typeof styles] || styles.active;
  };

  const getJobStatusBadge = (status: string) => {
    const styles = {
      in_progress: 'bg-blue-50 text-blue-700 border-blue-300',
      complete: 'bg-green-50 text-green-700 border-green-300',
      pending: 'bg-gray-50 text-gray-700 border-gray-300',
      overdue: 'bg-red-50 text-red-700 border-red-300'
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getJobStatusLabel = (status: string) => {
    const labels = {
      in_progress: 'In Progress',
      complete: 'Complete',
      pending: 'Pending',
      overdue: 'Overdue'
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <WorkpaperLayout currentPage="clients" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate?.('clients')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Clients
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{clientData.name}</h1>
                <span className={`px-2 py-1 text-xs font-semibold rounded border ${getStatusBadge(clientData.status)}`}>
                  {clientData.status.toUpperCase()}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold text-gray-900">{clientData.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                <span>{clientData.entityType}</span>
                <span>•</span>
                <span>ABN: {clientData.abn}</span>
                <span>•</span>
                <span>Client since {new Date(clientData.clientSince).getFullYear()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Active Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {jobs.filter(j => j.status === 'in_progress').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Jobs Complete</p>
                  <p className="text-2xl font-bold text-gray-900">{clientData.performance.jobsCompleted}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">On-Time Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{clientData.performance.onTimeCompletion}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Billed</p>
                  <p className="text-2xl font-bold text-gray-900">{clientData.billingInfo.totalBilled}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Main Content */}
          <div className="col-span-8 space-y-6">
            {/* Tabs */}
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-6">
                {/* Tab Navigation */}
                <div className="flex items-center gap-2 mb-6 border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'overview' 
                        ? 'text-[#2855a6] border-b-2 border-[#2855a6]' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'jobs' 
                        ? 'text-[#2855a6] border-b-2 border-[#2855a6]' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Jobs ({jobs.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('documents')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'documents' 
                        ? 'text-[#2855a6] border-b-2 border-[#2855a6]' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Documents
                  </button>
                  <button
                    onClick={() => setActiveTab('contacts')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'contacts' 
                        ? 'text-[#2855a6] border-b-2 border-[#2855a6]' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Contacts ({contacts.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'notes' 
                        ? 'text-[#2855a6] border-b-2 border-[#2855a6]' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Notes ({notes.length})
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Performance Metrics */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Performance</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Jobs Completed</p>
                          <p className="text-2xl font-bold text-gray-900">{clientData.performance.jobsCompleted}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">On-Time Completion</p>
                          <p className="text-2xl font-bold text-green-600">{clientData.performance.onTimeCompletion}%</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Avg Response Time</p>
                          <p className="text-2xl font-bold text-gray-900">{clientData.performance.avgResponseTime}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Satisfaction</p>
                          <div className="flex items-center gap-2">
                            <p className="text-2xl font-bold text-gray-900">{clientData.performance.satisfaction}</p>
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <Activity className="w-4 h-4 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">BAS Reconciliation updated</p>
                            <p className="text-xs text-gray-500">Mike Brown • 2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <FileText className="w-4 h-4 text-green-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">Document uploaded: Bank Statement</p>
                            <p className="text-xs text-gray-500">Client Portal • 1 day ago</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">Super Compliance job completed</p>
                            <p className="text-xs text-gray-500">Emily Davis • 3 days ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'jobs' && (
                  <div className="space-y-3">
                    {jobs.map((job) => (
                      <div
                        key={job.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-[#2855a6] hover:bg-blue-50 cursor-pointer transition-all"
                        onClick={() => onNavigate?.('job-detail', job.id)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{job.type}</h4>
                            <p className="text-sm text-gray-600">{job.year} • {job.id}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-semibold rounded border ${getJobStatusBadge(job.status)}`}>
                            {getJobStatusLabel(job.status)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600">Progress</span>
                          <span className="text-xs font-semibold text-gray-900">{job.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                          <div 
                            className="h-full bg-[#2855a6] transition-all"
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{job.assignedTo}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Due {job.dueDate}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Job
                    </Button>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-4">
                    {/* Breadcrumb */}
                    {(selectedYear || selectedDocType) && (
                      <div className="flex items-center gap-2 text-sm mb-4">
                        <button 
                          onClick={() => { setSelectedYear(null); setSelectedDocType(null); }}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Documents
                        </button>
                        {selectedYear && (
                          <>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            <button
                              onClick={() => setSelectedDocType(null)}
                              className={selectedDocType ? "text-gray-600 hover:text-gray-900" : "font-semibold text-gray-900"}
                            >
                              {selectedYear}
                            </button>
                          </>
                        )}
                        {selectedDocType && (
                          <>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold text-gray-900">{selectedDocType}</span>
                          </>
                        )}
                      </div>
                    )}

                    {/* Show folder view if no year selected */}
                    {!selectedYear && (
                      <>
                        {/* Document Stats for this client */}
                        <div className="grid grid-cols-4 gap-3">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Total Documents</p>
                            <p className="text-xl font-bold text-gray-900">487</p>
                          </div>
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Storage Used</p>
                            <p className="text-xl font-bold text-gray-900">12.4 GB</p>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">AI Processed</p>
                            <p className="text-xl font-bold text-gray-900">94%</p>
                          </div>
                          <div className="p-3 bg-orange-50 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Recent</p>
                            <p className="text-xl font-bold text-gray-900">23</p>
                          </div>
                        </div>

                        {/* Document Folders */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900">Document Folders</h4>
                            <Button size="sm" variant="outline">
                              <Upload className="w-4 h-4 mr-2" />
                              Upload
                            </Button>
                          </div>

                          {/* Permanent File Folder */}
                          <div 
                            onClick={() => setSelectedYear('Permanent File')}
                            className="mb-3 p-4 border-2 border-amber-300 bg-amber-50 rounded-lg hover:border-amber-500 cursor-pointer transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <FolderClosed className="w-8 h-8 text-amber-600" />
                                <div>
                                  <h4 className="font-semibold text-amber-900">🔒 Permanent File</h4>
                                  <p className="text-xs text-amber-700 mt-1">7 documents • Critical foundational docs</p>
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-amber-600" />
                            </div>
                          </div>

                          {/* Year Folders */}
                          <div className="space-y-2">
                            {['2024', '2023', '2022', '2021', '2020'].map((year, idx) => {
                              const counts = [87, 156, 142, 134, 128];
                              return (
                                <div 
                                  key={year}
                                  onClick={() => setSelectedYear(year)}
                                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-3">
                                    <FolderClosed className="w-6 h-6 text-blue-500" />
                                    <div>
                                      <h4 className="font-semibold text-gray-900 text-sm">{year}</h4>
                                      <p className="text-xs text-gray-600">{counts[idx]} documents</p>
                                    </div>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-gray-400" />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Recent Documents */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Recent Documents</h4>
                          <div className="space-y-2">
                            <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-red-600" />
                                <div className="flex-1">
                                  <h5 className="font-medium text-sm text-gray-900">Annual_Return_2024.pdf</h5>
                                  <p className="text-xs text-gray-600">2024 • Tax Returns • 2.4 MB • 2 days ago</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <Button size="sm" variant="ghost">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>

                            <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-green-600" />
                                <div className="flex-1">
                                  <h5 className="font-medium text-sm text-gray-900">Q4_BAS_Worksheet.xlsx</h5>
                                  <p className="text-xs text-gray-600">2024 • BAS Lodgements • 845 KB • 3 days ago</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <Button size="sm" variant="ghost">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>

                            <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-red-600" />
                                <div className="flex-1">
                                  <h5 className="font-medium text-sm text-gray-900">Bank_Statement_Jan_2024.pdf</h5>
                                  <p className="text-xs text-gray-600">2024 • Bank Statements • 1.2 MB • 5 days ago</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <Button size="sm" variant="ghost">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>

                            <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-red-600" />
                                <div className="flex-1">
                                  <h5 className="font-medium text-sm text-gray-900">Investment_Portfolio_Summary.pdf</h5>
                                  <p className="text-xs text-gray-600">2024 • Financial Statements • 3.1 MB • 1 week ago</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-blue-600" />
                                  <Button size="sm" variant="ghost">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Show document type folders when year is selected but not doc type */}
                    {selectedYear && !selectedDocType && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Document Types in {selectedYear}</h4>
                        <div className="space-y-2">
                          {[
                            { name: 'Tax Returns', count: 12, icon: '📄' },
                            { name: 'BAS Lodgements', count: 18, icon: '📊' },
                            { name: 'Bank Statements', count: 24, icon: '🏦' },
                            { name: 'Financial Statements', count: 8, icon: '💰' },
                            { name: 'SMSF Documents', count: 15, icon: '📋' },
                            { name: 'Invoices', count: 10, icon: '🧾' },
                          ].map((docType, idx) => (
                            <div 
                              key={idx}
                              onClick={() => setSelectedDocType(docType.name)}
                              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                  <span className="text-xl">{docType.icon}</span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 text-sm">{docType.name}</h4>
                                  <p className="text-xs text-gray-600">{docType.count} documents</p>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Show documents when both year and doc type are selected */}
                    {selectedYear && selectedDocType && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">{selectedDocType} - {selectedYear}</h4>
                        <div className="space-y-2">
                          {[
                            { name: 'Annual_Return.pdf', size: '2.4 MB', date: '2 days ago' },
                            { name: 'Q1_Statement.xlsx', size: '845 KB', date: '3 days ago' },
                            { name: 'Q2_Document.pdf', size: '1.2 MB', date: '5 days ago' },
                            { name: 'Q3_Report.pdf', size: '3.1 MB', date: '1 week ago' },
                            { name: 'Q4_Summary.xlsx', size: '654 KB', date: '2 weeks ago' },
                            { name: 'Year_End_File.pdf', size: '432 KB', date: '3 weeks ago' },
                          ].map((doc, idx) => (
                            <div key={idx} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <div className="flex items-center gap-3">
                                <FileText className={`w-5 h-5 ${doc.name.endsWith('.pdf') ? 'text-red-600' : 'text-green-600'}`} />
                                <div className="flex-1">
                                  <h5 className="font-medium text-sm text-gray-900">{doc.name}</h5>
                                  <p className="text-xs text-gray-600">{doc.size} • {doc.date}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <Button size="sm" variant="ghost">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'contacts' && (
                  <div className="space-y-3">
                    {contacts.map((contact) => (
                      <div key={contact.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                              {contact.isPrimary && (
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded">
                                  Primary
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{contact.role}</p>
                          </div>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <a href={`mailto:${contact.email}`} className="hover:text-[#2855a6]">
                              {contact.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <a href={`tel:${contact.phone}`} className="hover:text-[#2855a6]">
                              {contact.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Contact
                    </Button>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-4">
                    {/* Add Note */}
                    <div className="space-y-2">
                      <textarea
                        placeholder="Add a note..."
                        rows={3}
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
                      />
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Note
                      </Button>
                    </div>

                    {/* Notes List */}
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      {notes.map((note) => (
                        <div key={note.id} className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-900 mb-2">{note.text}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{note.createdBy}</span>
                            <span>{note.createdAt}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="col-span-4 space-y-4">
            {/* Contact Information */}
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-gray-600 mt-0.5" />
                    <div className="flex-1 text-sm">
                      <p className="text-gray-900 font-medium">{clientData.name}</p>
                      <p className="text-gray-600">{clientData.entityType}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-gray-600 mt-0.5" />
                    <div className="flex-1 text-sm">
                      <p className="text-gray-600">Trustee</p>
                      <p className="text-gray-900">{clientData.trustee}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-600 mt-0.5" />
                    <div className="flex-1 text-sm">
                      <p className="text-gray-900">{clientData.address.street}</p>
                      <p className="text-gray-600">
                        {clientData.address.city}, {clientData.address.state} {clientData.address.postcode}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Information */}
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Billing</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Billed</span>
                    <span className="font-semibold text-gray-900">{clientData.billingInfo.totalBilled}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Balance</span>
                    <span className="font-semibold text-orange-600">{clientData.billingInfo.currentBalance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Invoice</span>
                    <span className="text-gray-900">{clientData.billingInfo.lastInvoice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Terms</span>
                    <span className="text-gray-900">{clientData.billingInfo.paymentTerms}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <Download className="w-4 h-4 mr-2" />
                  View Invoices
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Plus className="w-3 h-3 mr-2" />
                    Create Job
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="w-3 h-3 mr-2" />
                    Upload Document
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageSquare className="w-3 h-3 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Calendar className="w-3 h-3 mr-2" />
                    Schedule Meeting
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Documents Overview */}
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Client Files</h3>
                
                {/* Tabs */}
                <div className="space-y-3">
                  {/* Documents Tab */}
                  <button 
                    onClick={() => onNavigate?.('documents', clientData.id, clientData.name)}
                    className="w-full p-3 bg-gray-50 hover:bg-blue-50 rounded-lg text-left transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <FileText className="w-4 h-4 text-[#2855a6]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">Documents</h4>
                          <p className="text-xs text-gray-600">487 files • 12.4 GB</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#2855a6]" />
                    </div>
                  </button>

                  {/* Jobs Tab */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <Briefcase className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">Jobs</h4>
                          <p className="text-xs text-gray-600">{jobs.length} active jobs</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contacts Tab */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <User className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">Contacts</h4>
                          <p className="text-xs text-gray-600">{contacts.length} contacts</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes Tab */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <MessageSquare className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">Notes</h4>
                          <p className="text-xs text-gray-600">{notes.length} notes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WorkpaperLayout>
  );
}