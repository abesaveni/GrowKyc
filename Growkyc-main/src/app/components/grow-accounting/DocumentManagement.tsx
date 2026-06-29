import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  FolderOpen,
  File,
  FileText,
  Upload,
  Download,
  Search,
  Filter,
  Grid3x3,
  List,
  Star,
  Clock,
  User,
  Eye,
  MoreVertical,
  ChevronRight,
  FolderClosed,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Calendar,
  Plus,
  Archive,
  Building2
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface DocumentManagementProps {
  onNavigate?: (page: string) => void;
  initialClient?: string | null;
  initialClientName?: string | null;
}

interface Cabinet {
  id: string;
  name: string;
  type: 'client' | 'year' | 'doctype';
  client?: string;
  year?: string;
  docType?: string;
  count: number;
  lastModified: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  client: string;
  year: string;
  docType: string;
  size: string;
  uploadDate: string;
  uploadedBy: string;
  aiProcessed: boolean;
  aiStatus: 'pending' | 'processing' | 'completed' | 'error';
  tags: string[];
  starred: boolean;
}

const docTypes = [
  'Tax Returns',
  'BAS Lodgements',
  'SMSF Documents',
  'Financial Statements',
  'Management Reports',
  'Source Documents',
  'Bank Statements',
  'Invoices',
  'Receipts',
  'Correspondence',
  'Workpapers',
  'Audit Files'
];

const permanentFileTypes = [
  'Constitutions',
  'Trust Deeds',
  'Partnership Agreements',
  'Engagement Letters',
  'Entity Registration',
  'Licenses & Permits',
  'Insurance Policies',
  'Shareholder Agreements',
  'Director IDs',
  'Operating Agreements',
  'Lease Agreements',
  'Loan Documents'
];

export function DocumentManagement({ onNavigate, initialClient, initialClientName }: DocumentManagementProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentView, setCurrentView] = useState<'clients' | 'years' | 'doctypes'>(initialClient ? 'years' : 'clients');
  const [selectedClient, setSelectedClient] = useState<string | null>(initialClientName || null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Client folders (FIRST LEVEL)
  const clientFolders: Cabinet[] = [
    { id: 'C001', name: 'Smith SMSF', type: 'client', client: 'Smith SMSF', count: 487, lastModified: '2024-02-14' },
    { id: 'C002', name: 'ABC Pty Ltd', type: 'client', client: 'ABC Pty Ltd', count: 624, lastModified: '2024-02-13' },
    { id: 'C003', name: 'XYZ Trust', type: 'client', client: 'XYZ Trust', count: 365, lastModified: '2024-02-12' },
    { id: 'C004', name: 'Wilson SMSF', type: 'client', client: 'Wilson SMSF', count: 492, lastModified: '2024-02-11' },
    { id: 'C005', name: 'Brown Individual', type: 'client', client: 'Brown Individual', count: 243, lastModified: '2024-02-10' },
    { id: 'C006', name: 'Johnson & Co', type: 'client', client: 'Johnson & Co', count: 756, lastModified: '2024-02-09' },
    { id: 'C007', name: 'Green Family Trust', type: 'client', client: 'Green Family Trust', count: 378, lastModified: '2024-02-08' },
    { id: 'C008', name: 'Anderson Pty Ltd', type: 'client', client: 'Anderson Pty Ltd', count: 534, lastModified: '2024-02-07' }
  ];

  // Year folders within a client (SECOND LEVEL)
  const yearFolders: Cabinet[] = [
    { id: 'Y2024', name: '2024', type: 'year', year: '2024', count: 87, lastModified: '2024-02-14' },
    { id: 'Y2023', name: '2023', type: 'year', year: '2023', count: 156, lastModified: '2024-01-31' },
    { id: 'Y2022', name: '2022', type: 'year', year: '2022', count: 142, lastModified: '2023-12-31' },
    { id: 'Y2021', name: '2021', type: 'year', year: '2021', count: 134, lastModified: '2023-06-30' },
    { id: 'Y2020', name: '2020', type: 'year', year: '2020', count: 128, lastModified: '2022-12-15' }
  ];

  // Document type folders within a year (THIRD LEVEL)
  const docTypeFolders: Cabinet[] = docTypes.map((type, idx) => ({
    id: `DT${idx}`,
    name: type,
    type: 'doctype',
    docType: type,
    count: Math.floor(Math.random() * 30) + 5,
    lastModified: '2024-02-14'
  }));

  // Documents within a doc type folder
  const documents: Document[] = [
    { id: 'DOC001', name: 'Smith_SMSF_Annual_Return_2024.pdf', type: 'PDF', client: 'Smith SMSF', year: '2024', docType: 'Tax Returns', size: '2.4 MB', uploadDate: '2024-02-14', uploadedBy: 'Sarah Johnson', aiProcessed: true, aiStatus: 'completed', tags: ['SMSF', 'Annual Return'], starred: true },
    { id: 'DOC002', name: 'Q4_BAS_Worksheet.xlsx', type: 'XLSX', client: 'Smith SMSF', year: '2024', docType: 'BAS Lodgements', size: '845 KB', uploadDate: '2024-02-13', uploadedBy: 'Mike Brown', aiProcessed: true, aiStatus: 'completed', tags: ['BAS', 'Q4'], starred: false },
    { id: 'DOC003', name: 'Bank_Statement_Jan_2024.pdf', type: 'PDF', client: 'Smith SMSF', year: '2024', docType: 'Bank Statements', size: '1.2 MB', uploadDate: '2024-02-12', uploadedBy: 'Emily Davis', aiProcessed: true, aiStatus: 'completed', tags: ['Bank Statement', 'January'], starred: false },
    { id: 'DOC004', name: 'Investment_Portfolio_Summary.pdf', type: 'PDF', client: 'Smith SMSF', year: '2024', docType: 'Financial Statements', size: '3.1 MB', uploadDate: '2024-02-11', uploadedBy: 'Tom Wilson', aiProcessed: true, aiStatus: 'processing', tags: ['Investments', 'Portfolio'], starred: true },
    { id: 'DOC005', name: 'Member_Contributions_Report.xlsx', type: 'XLSX', client: 'Smith SMSF', year: '2024', docType: 'SMSF Documents', size: '654 KB', uploadDate: '2024-02-10', uploadedBy: 'Sarah Johnson', aiProcessed: false, aiStatus: 'pending', tags: ['Contributions', 'Members'], starred: false },
    { id: 'DOC006', name: 'Tax_Invoice_001234.pdf', type: 'PDF', client: 'Smith SMSF', year: '2024', docType: 'Invoices', size: '432 KB', uploadDate: '2024-02-09', uploadedBy: 'Mike Brown', aiProcessed: true, aiStatus: 'completed', tags: ['Invoice', 'Tax'], starred: false },
    { id: 'DOC007', name: 'Expense_Receipts_Feb.pdf', type: 'PDF', client: 'Smith SMSF', year: '2024', docType: 'Receipts', size: '5.2 MB', uploadDate: '2024-02-08', uploadedBy: 'Emily Davis', aiProcessed: true, aiStatus: 'error', tags: ['Receipts', 'Expenses'], starred: false },
    { id: 'DOC008', name: 'Compliance_Checklist_2024.pdf', type: 'PDF', client: 'Smith SMSF', year: '2024', docType: 'Workpapers', size: '876 KB', uploadDate: '2024-02-07', uploadedBy: 'Tom Wilson', aiProcessed: true, aiStatus: 'completed', tags: ['Compliance', 'Checklist'], starred: true }
  ];

  // Permanent File documents - critical long-term docs
  const permanentFileDocuments: Document[] = [
    { id: 'PERM001', name: 'Smith_SMSF_Trust_Deed_Original.pdf', type: 'PDF', client: 'Smith SMSF', year: 'Permanent', docType: 'Trust Deeds', size: '4.2 MB', uploadDate: '2018-03-15', uploadedBy: 'Mike Brown', aiProcessed: true, aiStatus: 'completed', tags: ['Trust Deed', 'Founding Document'], starred: true },
    { id: 'PERM002', name: 'Deed_of_Variation_2020.pdf', type: 'PDF', client: 'Smith SMSF', year: 'Permanent', docType: 'Trust Deeds', size: '1.8 MB', uploadDate: '2020-06-10', uploadedBy: 'Sarah Johnson', aiProcessed: true, aiStatus: 'completed', tags: ['Deed Variation', 'Amendment'], starred: true },
    { id: 'PERM003', name: 'Engagement_Letter_2018.pdf', type: 'PDF', client: 'Smith SMSF', year: 'Permanent', docType: 'Engagement Letters', size: '456 KB', uploadDate: '2018-03-20', uploadedBy: 'Mike Brown', aiProcessed: true, aiStatus: 'completed', tags: ['Engagement', 'Agreement'], starred: true },
    { id: 'PERM004', name: 'ABN_Registration_Certificate.pdf', type: 'PDF', client: 'Smith SMSF', year: 'Permanent', docType: 'Entity Registration', size: '234 KB', uploadDate: '2018-03-10', uploadedBy: 'Sarah Johnson', aiProcessed: true, aiStatus: 'completed', tags: ['ABN', 'Registration'], starred: false },
    { id: 'PERM005', name: 'ATO_Regulatory_Licences.pdf', type: 'PDF', client: 'Smith SMSF', year: 'Permanent', docType: 'Licenses & Permits', size: '678 KB', uploadDate: '2018-04-05', uploadedBy: 'Mike Brown', aiProcessed: true, aiStatus: 'completed', tags: ['ASIC', 'Licence'], starred: false },
    { id: 'PERM006', name: 'Trustee_Director_Resolutions.pdf', type: 'PDF', client: 'Smith SMSF', year: 'Permanent', docType: 'Director IDs', size: '890 KB', uploadDate: '2019-07-12', uploadedBy: 'Emily Davis', aiProcessed: true, aiStatus: 'completed', tags: ['Resolutions', 'Directors'], starred: false },
    { id: 'PERM007', name: 'Investment_Strategy_Original.pdf', type: 'PDF', client: 'Smith SMSF', year: 'Permanent', docType: 'Trust Deeds', size: '1.2 MB', uploadDate: '2018-03-25', uploadedBy: 'Tom Wilson', aiProcessed: true, aiStatus: 'completed', tags: ['Investment Strategy'], starred: true }
  ];

  const stats = {
    totalDocuments: 15678,
    totalSize: '45.3 GB',
    aiProcessed: 14234,
    recentUploads: 156
  };

  const getBreadcrumb = () => {
    const crumbs = ['Documents'];
    if (selectedClient) crumbs.push(selectedClient);
    if (selectedYear) crumbs.push(selectedYear);
    if (selectedDocType) crumbs.push(selectedDocType);
    return crumbs;
  };

  const handleNavigate = (level: 'clients' | 'years' | 'doctypes', value?: string) => {
    if (level === 'clients') {
      setCurrentView('clients');
      setSelectedClient(null);
      setSelectedYear(null);
      setSelectedDocType(null);
    } else if (level === 'years' && value) {
      setSelectedClient(value);
      setCurrentView('years');
      setSelectedYear(null);
      setSelectedDocType(null);
    } else if (level === 'doctypes' && value) {
      setSelectedYear(value);
      setCurrentView('doctypes');
      setSelectedDocType(null);
    }
  };

  const getAIStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded border border-green-300">
          <CheckCircle className="w-3 h-3" /> AI Processed
        </span>;
      case 'processing':
        return <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded border border-blue-300">
          <Sparkles className="w-3 h-3 animate-pulse" /> Processing
        </span>;
      case 'pending':
        return <span className="flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-700 text-xs font-semibold rounded border border-gray-300">
          <Clock className="w-3 h-3" /> Pending
        </span>;
      case 'error':
        return <span className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded border border-red-300">
          <AlertCircle className="w-3 h-3" /> Error
        </span>;
      default:
        return null;
    }
  };

  const getFileIcon = (type: string) => {
    if (type === 'PDF') return <FileText className="w-5 h-5 text-red-600" />;
    if (type === 'XLSX' || type === 'XLS') return <File className="w-5 h-5 text-green-600" />;
    return <File className="w-5 h-5 text-gray-600" />;
  };

  return (
    <WorkpaperLayout currentPage="documents" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-gray-900">Document Management</h1>
            <p className="text-sm text-gray-600 mt-1">Client → Year → Document Type hierarchy with AI-powered extraction</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </Button>
            <Button className="bg-[#2855a6] hover:bg-[#1e4089]">
              <Upload className="w-4 h-4 mr-2" />
              Upload Documents
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <File className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Documents</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalDocuments.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <FolderOpen className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Storage Used</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSize}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Sparkles className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">AI Processed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.aiProcessed.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Recent Uploads</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.recentUploads}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Breadcrumb & Actions */}
        <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm">
                {getBreadcrumb().map((crumb, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {idx > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                    <button
                      onClick={() => {
                        if (idx === 0) handleNavigate('clients');
                        else if (idx === 1) handleNavigate('years', crumb);
                        else if (idx === 2) handleNavigate('doctypes', crumb);
                      }}
                      className={`${
                        idx === getBreadcrumb().length - 1
                          ? 'font-semibold text-gray-900'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {crumb}
                    </button>
                  </div>
                ))}
              </div>

              {/* View Controls */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search documents..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <CardContent className="p-6">
            {/* Client Folders View (FIRST LEVEL) */}
            {currentView === 'clients' && (
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 gap-4' : 'space-y-2'}>
                {clientFolders.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => {
                      setSelectedClient(client.name);
                      setCurrentView('years');
                    }}
                    className={`${
                      viewMode === 'grid'
                        ? 'p-6 border-2 border-gray-200 rounded-lg hover:border-[#2855a6] cursor-pointer transition-all'
                        : 'p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center justify-between'
                    }`}
                  >
                    <div className={viewMode === 'grid' ? 'text-center' : 'flex items-center gap-4'}>
                      <Building2 className={`${viewMode === 'grid' ? 'w-16 h-16 mx-auto mb-3' : 'w-12 h-12'} text-[#2855a6]`} />
                      <div>
                        <h3 className={`font-bold ${viewMode === 'grid' ? 'text-lg' : 'text-base'} text-gray-900`}>{client.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{client.count} documents</p>
                        {viewMode === 'list' && (
                          <p className="text-xs text-gray-500 mt-1">Last modified: {client.lastModified}</p>
                        )}
                      </div>
                    </div>
                    {viewMode === 'list' && <ChevronRight className="w-5 h-5 text-gray-400" />}
                  </div>
                ))}
              </div>
            )}

            {/* Year Folders View (SECOND LEVEL) */}
            {currentView === 'years' && (
              <>
                {/* Client Document Overview Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedClient}</h2>
                      <p className="text-sm text-gray-600 mt-1">Complete document repository</p>
                    </div>
                    <Button className="bg-[#2855a6] hover:bg-[#1e4089]">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload to Client
                    </Button>
                  </div>

                  {/* Client Stats */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                      <CardContent className="p-4">
                        <p className="text-xs text-gray-600 mb-1">Total Documents</p>
                        <p className="text-2xl font-bold text-gray-900">487</p>
                        <p className="text-xs text-green-600 mt-1">↑ 23 this month</p>
                      </CardContent>
                    </Card>
                    <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                      <CardContent className="p-4">
                        <p className="text-xs text-gray-600 mb-1">Storage Used</p>
                        <p className="text-2xl font-bold text-gray-900">12.4 GB</p>
                        <p className="text-xs text-gray-500 mt-1">Across 5 years</p>
                      </CardContent>
                    </Card>
                    <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                      <CardContent className="p-4">
                        <p className="text-xs text-gray-600 mb-1">Recent Activity</p>
                        <p className="text-2xl font-bold text-gray-900">2 days ago</p>
                        <p className="text-xs text-gray-500 mt-1">Last upload</p>
                      </CardContent>
                    </Card>
                    <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                      <CardContent className="p-4">
                        <p className="text-xs text-gray-600 mb-1">AI Processed</p>
                        <p className="text-2xl font-bold text-gray-900">94%</p>
                        <p className="text-xs text-blue-600 mt-1">28 processing</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Recent Documents */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Recent Documents (Last 30 Days)</h3>
                  <div className="space-y-2">
                    {documents.slice(0, 5).map((doc) => (
                      <div key={doc.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getFileIcon(doc.type)}
                          <div>
                            <h4 className="font-medium text-sm text-gray-900">{doc.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                              <span>{doc.year}</span>
                              <span>•</span>
                              <span>{doc.docType}</span>
                              <span>•</span>
                              <span>{doc.uploadDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getAIStatusBadge(doc.aiStatus)}
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Document Type Breakdown */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Documents by Type</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {docTypes.slice(0, 6).map((type, idx) => (
                      <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:border-[#2855a6] cursor-pointer transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm text-gray-900">{type}</h4>
                          <span className="text-lg font-bold text-[#2855a6]">{Math.floor(Math.random() * 50) + 10}</span>
                        </div>
                        <p className="text-xs text-gray-600">Across all years</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Year folders + Permanent File */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Browse by Year & Permanent File</h3>
                  <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 gap-4' : 'space-y-2'}>
                    {/* Permanent File - Now looks like a year folder */}
                    <div
                      onClick={() => setSelectedDocType('Permanent File')}
                      className={`${
                        viewMode === 'grid'
                          ? 'p-6 border-2 border-amber-300 bg-amber-50 rounded-lg hover:border-amber-500 cursor-pointer transition-all'
                          : 'p-4 border-2 border-amber-300 bg-amber-50 rounded-lg hover:bg-amber-100 cursor-pointer flex items-center justify-between'
                      }`}
                    >
                      <div className={viewMode === 'grid' ? 'text-center' : 'flex items-center gap-4'}>
                        <FolderClosed className={`${viewMode === 'grid' ? 'w-12 h-12 mx-auto mb-3' : 'w-10 h-10'} text-amber-600`} />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold ${viewMode === 'grid' ? 'text-base' : 'text-sm'} text-amber-900`}>🔒 Permanent File</h3>
                          </div>
                          <p className="text-xs text-amber-700 mt-1">7 documents</p>
                          {viewMode === 'list' && (
                            <p className="text-xs text-amber-600 mt-1">Critical foundational docs</p>
                          )}
                        </div>
                      </div>
                      {viewMode === 'list' && <ChevronRight className="w-5 h-5 text-amber-600" />}
                    </div>

                    {/* Year folders */}
                    {yearFolders.map((year) => (
                      <div
                        key={year.id}
                        onClick={() => {
                          setSelectedYear(year.name);
                          setCurrentView('doctypes');
                        }}
                        className={`${
                          viewMode === 'grid'
                            ? 'p-6 border-2 border-gray-200 rounded-lg hover:border-[#2855a6] cursor-pointer transition-all'
                            : 'p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center justify-between'
                        }`}
                      >
                        <div className={viewMode === 'grid' ? 'text-center' : 'flex items-center gap-4'}>
                          <FolderClosed className={`${viewMode === 'grid' ? 'w-12 h-12 mx-auto mb-3' : 'w-10 h-10'} text-blue-500`} />
                          <div>
                            <h3 className={`font-semibold ${viewMode === 'grid' ? 'text-base' : 'text-sm'} text-gray-900`}>{year.name}</h3>
                            <p className="text-xs text-gray-600 mt-1">{year.count} documents</p>
                            {viewMode === 'list' && (
                              <p className="text-xs text-gray-500 mt-1">Last modified: {year.lastModified}</p>
                            )}
                          </div>
                        </div>
                        {viewMode === 'list' && <ChevronRight className="w-5 h-5 text-gray-400" />}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Document Type Folders OR Documents View (THIRD LEVEL) */}
            {currentView === 'doctypes' && !selectedDocType && (
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 gap-4' : 'space-y-2'}>
                {docTypeFolders.map((folder) => (
                  <div
                    key={folder.id}
                    onClick={() => setSelectedDocType(folder.name)}
                    className={`${
                      viewMode === 'grid'
                        ? 'p-6 border-2 border-gray-200 rounded-lg hover:border-[#2855a6] cursor-pointer transition-all'
                        : 'p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center justify-between'
                    }`}
                  >
                    <div className={viewMode === 'grid' ? 'text-center' : 'flex items-center gap-4'}>
                      <FolderOpen className={`${viewMode === 'grid' ? 'w-10 h-10 mx-auto mb-3' : 'w-8 h-8'} text-purple-500`} />
                      <div>
                        <h3 className={`font-semibold ${viewMode === 'grid' ? 'text-sm' : 'text-sm'} text-gray-900`}>{folder.name}</h3>
                        <p className="text-xs text-gray-600 mt-1">{folder.count} files</p>
                      </div>
                    </div>
                    {viewMode === 'list' && <ChevronRight className="w-5 h-5 text-gray-400" />}
                  </div>
                ))}
              </div>
            )}

            {/* Documents List */}
            {selectedDocType && (
              <div className="space-y-3">
                {/* Show Permanent File documents or regular documents */}
                {selectedDocType === 'Permanent File' ? (
                  <>
                    {/* Permanent File Header */}
                    <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                        <div>
                          <h4 className="font-semibold text-amber-900">Permanent File Documents</h4>
                          <p className="text-xs text-amber-700 mt-1">
                            Critical documents that remain constant across years. These should be updated only when legally changed.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Permanent File Document Categories */}
                    {permanentFileTypes.map((category, idx) => {
                      const categoryDocs = permanentFileDocuments.filter(d => d.docType === category);
                      if (categoryDocs.length === 0) return null;

                      return (
                        <div key={idx} className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <h4 className="font-semibold text-gray-900">{category}</h4>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                              {categoryDocs.length}
                            </span>
                          </div>
                          <div className="space-y-2">
                            {categoryDocs.map((doc) => (
                              <div key={doc.id} className="p-4 border-2 border-amber-200 bg-amber-50 rounded-lg hover:border-amber-400 cursor-pointer transition-all">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4 flex-1">
                                    {getFileIcon(doc.type)}
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-sm text-gray-900">{doc.name}</h4>
                                        {doc.starred && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                                          PERMANENT
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-3 text-xs text-gray-600">
                                        <span>{doc.size}</span>
                                        <span>•</span>
                                        <div className="flex items-center gap-1">
                                          <Calendar className="w-3 h-3" />
                                          <span>Uploaded: {doc.uploadDate}</span>
                                        </div>
                                        <span>•</span>
                                        <div className="flex items-center gap-1">
                                          <User className="w-3 h-3" />
                                          <span>{doc.uploadedBy}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2 mt-2">
                                        {getAIStatusBadge(doc.aiStatus)}
                                        {doc.tags.map((tag, idx) => (
                                          <span key={idx} className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button size="sm" variant="ghost">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                      <Download className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  /* Regular documents */
                  documents.map((doc) => (
                    <div key={doc.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          {getFileIcon(doc.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm text-gray-900">{doc.name}</h4>
                              {doc.starred && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-600">
                              <span>{doc.size}</span>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{doc.uploadDate}</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{doc.uploadedBy}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              {getAIStatusBadge(doc.aiStatus)}
                              {doc.tags.map((tag, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Agent Info */}
        <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)] bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">AI Document Processing</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Our AI agents automatically extract data from uploaded documents and populate workpaper fields in real-time.
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span><strong>OCR Extraction:</strong> Text, numbers, dates from PDFs & images</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span><strong>Data Validation:</strong> Cross-checks against workpaper templates</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span><strong>Smart Categorization:</strong> Auto-files to correct doc type</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span><strong>Workpaper Integration:</strong> Direct data feed to templates</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </WorkpaperLayout>
  );
}