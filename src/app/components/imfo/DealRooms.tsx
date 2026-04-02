import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Lock,
  Unlock,
  FileText,
  Download,
  Upload,
  MessageSquare,
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Folder,
  File,
  Image,
  Video,
  Archive
} from 'lucide-react';

interface DealRoomsProps {
  onNavigate: (page: string) => void;
  role: string;
  onBack?: () => void;
}

type DealRoomStatus = 'active' | 'closed' | 'pending';

interface DealRoom {
  id: string;
  name: string;
  dealName: string;
  status: DealRoomStatus;
  participants: number;
  documents: number;
  questions: number;
  lastActivity: string;
  confidential: boolean;
  fundManager: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  downloads: number;
  category: 'financials' | 'legal' | 'operational' | 'marketing' | 'other';
}

interface Question {
  id: string;
  question: string;
  askedBy: string;
  askedAt: string;
  status: 'pending' | 'answered' | 'deferred';
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
}

export function DealRooms({ onNavigate, role, onBack }: DealRoomsProps) {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'documents' | 'qa'>('documents');
  const [searchTerm, setSearchTerm] = useState('');

  const dealRooms: DealRoom[] = [
    {
      id: 'dr-001',
      name: 'Westfield Shopping Centre Acquisition',
      dealName: 'Retail Fund II - Deal #12',
      status: 'active',
      participants: 23,
      documents: 47,
      questions: 12,
      lastActivity: '2 hours ago',
      confidential: true,
      fundManager: 'Sarah Chen'
    },
    {
      id: 'dr-002',
      name: 'Melbourne CBD Office Tower',
      dealName: 'Commercial Property Fund - Deal #8',
      status: 'active',
      participants: 18,
      documents: 32,
      questions: 8,
      lastActivity: '5 hours ago',
      confidential: true,
      fundManager: 'Michael Roberts'
    },
    {
      id: 'dr-003',
      name: 'Brisbane Residential Development',
      dealName: 'Residential Development Fund - Deal #5',
      status: 'active',
      participants: 15,
      documents: 28,
      questions: 15,
      lastActivity: '1 day ago',
      confidential: false,
      fundManager: 'Emma Wilson'
    },
    {
      id: 'dr-004',
      name: 'Sydney Logistics Warehouse',
      dealName: 'Industrial Fund - Deal #3',
      status: 'closed',
      participants: 12,
      documents: 53,
      questions: 21,
      lastActivity: '3 days ago',
      confidential: true,
      fundManager: 'David Lee'
    }
  ];

  const documents: Document[] = [
    {
      id: 'doc-001',
      name: 'Information Memorandum.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadedBy: 'Sarah Chen',
      uploadedAt: '2026-02-10',
      downloads: 23,
      category: 'marketing'
    },
    {
      id: 'doc-002',
      name: 'Financial Projections.xlsx',
      type: 'Excel',
      size: '892 KB',
      uploadedBy: 'Michael Roberts',
      uploadedAt: '2026-02-11',
      downloads: 18,
      category: 'financials'
    },
    {
      id: 'doc-003',
      name: 'Legal Due Diligence Report.pdf',
      type: 'PDF',
      size: '5.1 MB',
      uploadedBy: 'Legal Team',
      uploadedAt: '2026-02-12',
      downloads: 15,
      category: 'legal'
    },
    {
      id: 'doc-004',
      name: 'Property Valuation Report.pdf',
      type: 'PDF',
      size: '3.2 MB',
      uploadedBy: 'External Valuers',
      uploadedAt: '2026-02-13',
      downloads: 21,
      category: 'financials'
    },
    {
      id: 'doc-005',
      name: 'Site Photos.zip',
      type: 'Archive',
      size: '45 MB',
      uploadedBy: 'Operations Team',
      uploadedAt: '2026-02-14',
      downloads: 12,
      category: 'operational'
    }
  ];

  const questions: Question[] = [
    {
      id: 'q-001',
      question: 'What is the current occupancy rate of the property?',
      askedBy: 'Investor A',
      askedAt: '2026-02-14 10:30 AM',
      status: 'answered',
      answer: 'The property currently has an occupancy rate of 94%. We have 3 tenants with leases expiring in the next 12 months.',
      answeredBy: 'Sarah Chen',
      answeredAt: '2026-02-14 2:45 PM'
    },
    {
      id: 'q-002',
      question: 'Are there any pending legal issues or disputes related to this property?',
      askedBy: 'Investor B',
      askedAt: '2026-02-14 11:15 AM',
      status: 'answered',
      answer: 'No, there are no pending legal issues or disputes. The legal due diligence report confirms clean title and no outstanding matters.',
      answeredBy: 'Legal Team',
      answeredAt: '2026-02-14 3:20 PM'
    },
    {
      id: 'q-003',
      question: 'What is the expected IRR for this investment?',
      askedBy: 'Investor C',
      askedAt: '2026-02-15 9:00 AM',
      status: 'pending'
    },
    {
      id: 'q-004',
      question: 'Can you provide more details on the capital expenditure requirements?',
      askedBy: 'Investor D',
      askedAt: '2026-02-15 10:45 AM',
      status: 'pending'
    }
  ];

  const statusConfig = {
    active: { label: 'Active', color: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle },
    closed: { label: 'Closed', color: 'bg-gray-100 text-gray-700 border-gray-300', icon: Lock },
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: Clock }
  };

  const categoryConfig = {
    financials: { label: 'Financial', color: 'bg-blue-100 text-blue-700', icon: FileText },
    legal: { label: 'Legal', color: 'bg-purple-100 text-purple-700', icon: FileText },
    operational: { label: 'Operational', color: 'bg-green-100 text-green-700', icon: FileText },
    marketing: { label: 'Marketing', color: 'bg-orange-100 text-orange-700', icon: FileText },
    other: { label: 'Other', color: 'bg-gray-100 text-gray-700', icon: FileText }
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-600" />;
      case 'excel':
        return <FileText className="w-8 h-8 text-green-600" />;
      case 'image':
        return <Image className="w-8 h-8 text-blue-600" />;
      case 'video':
        return <Video className="w-8 h-8 text-purple-600" />;
      case 'archive':
        return <Archive className="w-8 h-8 text-gray-600" />;
      default:
        return <File className="w-8 h-8 text-gray-600" />;
    }
  };

  // List View
  if (!selectedRoom) {
    return (
      <div className="p-8 space-y-6">
        <div>
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          )}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Deal Rooms</h1>
              <p className="text-gray-600 mt-1">Secure virtual data rooms for deal documentation and investor Q&A</p>
            </div>
            {(role === 'fund-manager' || role === 'fund-accountant') && (
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Deal Room
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Deal Rooms</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{dealRooms.length}</p>
                </div>
                <Folder className="w-8 h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Rooms</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">
                    {dealRooms.filter(r => r.status === 'active').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Participants</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">
                    {dealRooms.reduce((sum, r) => sum + r.participants, 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Open Questions</p>
                  <p className="text-3xl font-bold text-orange-600 mt-1">
                    {dealRooms.reduce((sum, r) => sum + r.questions, 0)}
                  </p>
                </div>
                <MessageSquare className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search deal rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Deal Rooms List */}
        <div className="grid grid-cols-1 gap-4">
          {dealRooms.map((room) => {
            const config = statusConfig[room.status];
            const StatusIcon = config.icon;

            return (
              <Card
                key={room.id}
                className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-indigo-400"
                onClick={() => setSelectedRoom(room.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                        {room.confidential && (
                          <Lock className="w-5 h-5 text-red-600" />
                        )}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{room.dealName}</p>

                      <div className="grid grid-cols-4 gap-6">
                        <div>
                          <p className="text-xs text-gray-500">Participants</p>
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            <Users className="w-4 h-4 inline mr-1" />
                            {room.participants}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Documents</p>
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            <FileText className="w-4 h-4 inline mr-1" />
                            {room.documents}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Questions</p>
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            <MessageSquare className="w-4 h-4 inline mr-1" />
                            {room.questions}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Last Activity</p>
                          <p className="text-sm font-medium text-gray-700 mt-1">{room.lastActivity}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                        <span>Fund Manager: <span className="font-medium text-gray-900">{room.fundManager}</span></span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Deal Room Detail View
  const currentRoom = dealRooms.find(r => r.id === selectedRoom);
  if (!currentRoom) return null;

  return (
    <div className="p-8 space-y-6">
      <div>
        <Button variant="ghost" onClick={() => setSelectedRoom(null)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Deal Rooms
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{currentRoom.name}</h1>
              {currentRoom.confidential && (
                <Lock className="w-6 h-6 text-red-600" />
              )}
            </div>
            <p className="text-gray-600">{currentRoom.dealName}</p>
          </div>
          {(role === 'fund-manager' || role === 'fund-accountant') && (
            <div className="flex gap-2">
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Participants</p>
                <p className="text-2xl font-bold text-gray-900">{currentRoom.participants}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Documents</p>
                <p className="text-2xl font-bold text-gray-900">{currentRoom.documents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Questions</p>
                <p className="text-2xl font-bold text-gray-900">{currentRoom.questions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Last Activity</p>
                <p className="text-sm font-medium text-gray-900">{currentRoom.lastActivity}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'documents'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Documents ({documents.length})
            </button>
            <button
              onClick={() => setActiveTab('qa')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'qa'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Q&A ({questions.length})
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {activeTab === 'documents' && (
            <div className="space-y-4">
              {documents.map((doc) => {
                const category = categoryConfig[doc.category];
                return (
                  <div key={doc.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all">
                    <div className="flex items-start gap-4">
                      {getFileIcon(doc.type)}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {doc.size} • Uploaded by {doc.uploadedBy} on {doc.uploadedAt}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${category.color}`}>
                            {category.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>
                            <Download className="w-4 h-4 inline mr-1" />
                            {doc.downloads} downloads
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'qa' && (
            <div className="space-y-6">
              {/* Ask Question Form */}
              <Card className="border-2 border-indigo-300 bg-indigo-50">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <textarea
                      placeholder="Ask a question..."
                      rows={3}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Submit
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Questions List */}
              <div className="space-y-4">
                {questions.map((q) => (
                  <Card key={q.id} className={q.status === 'pending' ? 'border-2 border-orange-300' : ''}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-2">{q.question}</h3>
                              <p className="text-sm text-gray-600">
                                Asked by {q.askedBy} • {q.askedAt}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                q.status === 'answered'
                                  ? 'bg-green-100 text-green-700 border border-green-300'
                                  : q.status === 'pending'
                                  ? 'bg-orange-100 text-orange-700 border border-orange-300'
                                  : 'bg-gray-100 text-gray-700 border border-gray-300'
                              }`}
                            >
                              {q.status === 'answered' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                              {q.status === 'pending' && <Clock className="w-3 h-3 inline mr-1" />}
                              {q.status === 'deferred' && <AlertCircle className="w-3 h-3 inline mr-1" />}
                              {q.status.charAt(0).toUpperCase() + q.status.slice(1)}
                            </span>
                          </div>

                          {q.answer && (
                            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                              <div className="flex items-start gap-2 mb-2">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                <div className="flex-1">
                                  <p className="font-semibold text-green-900">Answer</p>
                                  <p className="text-sm text-gray-700 mt-2">{q.answer}</p>
                                  <p className="text-xs text-gray-600 mt-2">
                                    Answered by {q.answeredBy} • {q.answeredAt}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {q.status === 'pending' && (role === 'fund-manager' || role === 'fund-accountant') && (
                            <div className="mt-4">
                              <textarea
                                placeholder="Type your answer..."
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                              <div className="flex gap-2 mt-2">
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  Submit Answer
                                </Button>
                                <Button size="sm" variant="outline">
                                  Defer
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
