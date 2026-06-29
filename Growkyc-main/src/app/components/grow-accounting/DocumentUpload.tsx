import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  Upload,
  FileText,
  Image,
  File,
  Download,
  Eye,
  Trash2,
  Search,
  Filter,
  Plus,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  FolderOpen,
  Grid,
  List,
  MoreVertical
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface DocumentUploadProps {
  onNavigate?: (page: string) => void;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  category: string;
  status: 'processing' | 'complete' | 'error';
  ocrStatus?: 'pending' | 'processing' | 'complete' | 'error';
  extractedData?: {
    accountName?: string;
    abn?: string;
    amount?: string;
    date?: string;
  };
  linkedTo?: {
    type: 'job' | 'client' | 'workpaper';
    id: string;
    name: string;
  };
  thumbnail?: string;
}

const mockDocuments: Document[] = [
  {
    id: 'DOC-001',
    name: 'Bank_Statement_Dec2024.pdf',
    type: 'PDF',
    size: '2.4 MB',
    uploadedAt: '2024-03-01 10:30 AM',
    uploadedBy: 'Mike Brown',
    category: 'Bank Statements',
    status: 'complete',
    ocrStatus: 'complete',
    extractedData: {
      accountName: 'Commonwealth Bank',
      abn: '48 123 456 789',
      amount: '$45,678.90',
      date: '31/12/2024'
    },
    linkedTo: {
      type: 'job',
      id: 'JOB-2024-003',
      name: 'Smith SMSF - FY2024'
    }
  },
  {
    id: 'DOC-002',
    name: 'BAS_Return_Q4.xlsx',
    type: 'Excel',
    size: '156 KB',
    uploadedAt: '2024-03-01 09:15 AM',
    uploadedBy: 'Mike Brown',
    category: 'BAS',
    status: 'complete',
    ocrStatus: 'complete',
    extractedData: {
      amount: '$14,300.00',
      date: '31/12/2024'
    },
    linkedTo: {
      type: 'job',
      id: 'JOB-2024-003',
      name: 'Smith SMSF - FY2024'
    }
  },
  {
    id: 'DOC-003',
    name: 'ATO_Notice_2024.pdf',
    type: 'PDF',
    size: '892 KB',
    uploadedAt: '2024-02-28 02:45 PM',
    uploadedBy: 'System',
    category: 'ATO',
    status: 'complete',
    ocrStatus: 'complete',
    extractedData: {
      abn: '48 123 456 789',
      date: '28/02/2024'
    }
  },
  {
    id: 'DOC-004',
    name: 'Super_Contributions_Jan2024.pdf',
    type: 'PDF',
    size: '234 KB',
    uploadedAt: '2024-02-27 11:20 AM',
    uploadedBy: 'Emily Davis',
    category: 'Super',
    status: 'complete',
    ocrStatus: 'complete',
    extractedData: {
      amount: '$8,200.00',
      date: '31/01/2024'
    },
    linkedTo: {
      type: 'job',
      id: 'JOB-2024-003',
      name: 'Smith SMSF - FY2024'
    }
  },
  {
    id: 'DOC-005',
    name: 'Invoice_Supplier_ABC.pdf',
    type: 'PDF',
    size: '1.1 MB',
    uploadedAt: '2024-02-25 04:30 PM',
    uploadedBy: 'Client Portal',
    category: 'Invoices',
    status: 'complete',
    ocrStatus: 'processing',
    extractedData: {
      amount: '$2,350.00',
      date: '15/02/2024'
    }
  },
  {
    id: 'DOC-006',
    name: 'Receipt_Office_Supplies.jpg',
    type: 'Image',
    size: '456 KB',
    uploadedAt: '2024-02-24 01:15 PM',
    uploadedBy: 'Mike Brown',
    category: 'Receipts',
    status: 'complete',
    ocrStatus: 'complete',
    extractedData: {
      amount: '$156.90',
      date: '20/02/2024'
    }
  }
];

const categories = [
  'All Categories',
  'Bank Statements',
  'BAS',
  'ATO',
  'Super',
  'Invoices',
  'Receipts',
  'Payroll',
  'Other'
];

export function DocumentUpload({ onNavigate }: DocumentUploadProps) {
  const [documents, setDocuments] = useState(mockDocuments);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All Categories');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All Categories' || doc.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || doc.ocrStatus === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-400" />;
      case 'excel':
      case 'xlsx':
      case 'xls':
        return <File className="w-8 h-8 text-green-400" />;
      case 'image':
      case 'jpg':
      case 'png':
        return <Image className="w-8 h-8 text-blue-400" />;
      default:
        return <File className="w-8 h-8 text-slate-300" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <span className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs font-semibold rounded border border-blue-500/30">Processing</span>;
      case 'complete':
        return <span className="px-2 py-1 bg-green-500/10 text-green-300 text-xs font-semibold rounded border border-green-500/30">Complete</span>;
      case 'error':
        return <span className="px-2 py-1 bg-red-500/10 text-red-300 text-xs font-semibold rounded border border-red-500/30">Error</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-white/5 text-slate-300 text-xs font-semibold rounded border border-white/10">Pending</span>;
      default:
        return null;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file upload logic here
    setUploadModalOpen(true);
  };

  return (
    <WorkpaperLayout currentPage="documents" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-slate-100">Documents</h1>
            <p className="text-sm text-slate-300 mt-1">Upload, manage, and extract data from documents</p>
          </div>
          <Button 
            className="bg-[#2855a6] hover:bg-[#1e4089]"
            onClick={() => setUploadModalOpen(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Documents
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Total Documents</p>
                  <p className="text-2xl font-bold text-slate-100">{documents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Processed</p>
                  <p className="text-2xl font-bold text-slate-100">
                    {documents.filter(d => d.ocrStatus === 'complete').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Processing</p>
                  <p className="text-2xl font-bold text-slate-100">
                    {documents.filter(d => d.ocrStatus === 'processing').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">AI Extracted</p>
                  <p className="text-2xl font-bold text-slate-100">
                    {documents.filter(d => d.extractedData).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & View Toggle */}
        <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search documents..."
                    className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
              >
                <option value="all">All Status</option>
                <option value="complete">Complete</option>
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
                <option value="error">Error</option>
              </select>

              {/* View Toggle */}
              <div className="flex items-center gap-2 border border-white/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-[#2855a6] text-white' : 'text-slate-300 hover:bg-white/5'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-[#2855a6] text-white' : 'text-slate-300 hover:bg-white/5'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            isDragging 
              ? 'border-[#2855a6] bg-blue-500/10' 
              : 'border-white/10 hover:border-gray-400'
          }`}
        >
          <Upload className={`w-12 h-12 mx-auto mb-3 ${isDragging ? 'text-[#2855a6]' : 'text-gray-400'}`} />
          <p className="text-sm font-medium text-slate-100 mb-1">
            {isDragging ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-xs text-slate-400 mb-3">or click to browse</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setUploadModalOpen(true)}
          >
            Choose Files
          </Button>
          <p className="text-xs text-slate-400 mt-3">
            Supports: PDF, Excel, Word, Images (Max 10MB per file)
          </p>
        </div>

        {/* Documents Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <Card 
                key={doc.id}
                className="cursor-pointer hover:shadow-lg transition-all shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
              >
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getFileIcon(doc.type)}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-slate-100 truncate">{doc.name}</p>
                        <p className="text-xs text-slate-400">{doc.size}</p>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-white/5 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Category & Status */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-white/5 text-slate-300 text-xs rounded">
                      {doc.category}
                    </span>
                    {doc.ocrStatus && getStatusBadge(doc.ocrStatus)}
                  </div>

                  {/* Extracted Data */}
                  {doc.extractedData && doc.ocrStatus === 'complete' && (
                    <div className="mb-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-3 h-3 text-purple-400" />
                        <p className="text-xs font-semibold text-purple-300">AI Extracted Data</p>
                      </div>
                      <div className="space-y-1">
                        {doc.extractedData.accountName && (
                          <p className="text-xs text-purple-300">
                            <strong>Account:</strong> {doc.extractedData.accountName}
                          </p>
                        )}
                        {doc.extractedData.abn && (
                          <p className="text-xs text-purple-300">
                            <strong>ABN:</strong> {doc.extractedData.abn}
                          </p>
                        )}
                        {doc.extractedData.amount && (
                          <p className="text-xs text-purple-300">
                            <strong>Amount:</strong> {doc.extractedData.amount}
                          </p>
                        )}
                        {doc.extractedData.date && (
                          <p className="text-xs text-purple-300">
                            <strong>Date:</strong> {doc.extractedData.date}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Linked To */}
                  {doc.linkedTo && (
                    <div className="mb-3 p-2 bg-blue-500/10 border border-blue-500/30 rounded">
                      <p className="text-xs text-blue-300">
                        <strong>Linked:</strong> {doc.linkedTo.name}
                      </p>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="text-xs text-slate-400 mb-3">
                    <p>Uploaded by {doc.uploadedBy}</p>
                    <p>{doc.uploadedAt}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                    <Button size="sm" variant="ghost" className="flex-1">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="ghost" className="flex-1">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-0">
              <div className="divide-y divide-white/10">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="p-4 hover:bg-white/5 cursor-pointer transition-colors">
                    <div className="flex items-center gap-4">
                      {getFileIcon(doc.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-semibold text-sm text-slate-100">{doc.name}</p>
                          <span className="px-2 py-0.5 bg-white/5 text-slate-300 text-xs rounded">
                            {doc.category}
                          </span>
                          {doc.ocrStatus && getStatusBadge(doc.ocrStatus)}
                          {doc.linkedTo && (
                            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-300 text-xs rounded border border-blue-500/30">
                              {doc.linkedTo.name}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>Uploaded by {doc.uploadedBy}</span>
                          <span>•</span>
                          <span>{doc.uploadedAt}</span>
                        </div>
                        {doc.extractedData && doc.ocrStatus === 'complete' && (
                          <div className="flex items-center gap-3 mt-2 text-xs text-purple-300">
                            <Zap className="w-3 h-3" />
                            {doc.extractedData.amount && <span><strong>Amount:</strong> {doc.extractedData.amount}</span>}
                            {doc.extractedData.date && <span><strong>Date:</strong> {doc.extractedData.date}</span>}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {filteredDocuments.length === 0 && (
          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-12 text-center">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-100 mb-2">No documents found</h3>
              <p className="text-slate-300 mb-4">Try adjusting your search or filter criteria</p>
              <Button variant="outline">Clear Filters</Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-100">Upload Documents</h2>
                <button onClick={() => setUploadModalOpen(false)}>
                  <X className="w-5 h-5 text-slate-300" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm font-medium text-slate-100 mb-1">Drag & drop files here</p>
                  <p className="text-xs text-slate-400 mb-3">or</p>
                  <Button variant="outline" size="sm">
                    Browse Files
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Category
                  </label>
                  <select className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]">
                    {categories.filter(c => c !== 'All Categories').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Link to Job (Optional)
                  </label>
                  <select className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]">
                    <option value="">No link</option>
                    <option value="JOB-2024-003">Smith SMSF - FY2024</option>
                    <option value="JOB-2024-002">XYZ Trust - FY2024</option>
                    <option value="JOB-2024-001">ABC Pty Ltd - FY2024</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="ocr" className="rounded" defaultChecked />
                  <label htmlFor="ocr" className="text-sm text-slate-300">
                    Enable AI extraction (OCR)
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <Button className="flex-1 bg-[#2855a6] hover:bg-[#1e4089]">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setUploadModalOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </WorkpaperLayout>
  );
}
