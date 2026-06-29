import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from '../../lib/toast';
import { EmptyState } from '../ui/empty-state';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { 
  FileText,
  Search,
  Upload,
  UploadCloud,
  X,
  Download,
  Eye,
  Trash2,
  Filter,
  FolderOpen,
  File,
  Image as ImageIcon,
  FileType,
  RefreshCw,
  Star,
  StarOff,
  Share2,
  MoreVertical,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'excel' | 'word' | 'other';
  category: 'contract' | 'valuation' | 'inspection' | 'kyc' | 'other';
  size: number;
  uploadedBy: string;
  uploadedDate: Date;
  expiryDate?: Date;
  status: 'Certified' | 'Uncertified' | 'Expired' | 'Rejected';
  verifiedBy?: string;
  verifiedDate?: Date;
  starred: boolean;
  caseNumber?: string;
}

const mockDocuments: Document[] = [
  {
    id: 'doc-001',
    name: 'Investment_Memorandum_MIP-2024-001.pdf',
    type: 'pdf',
    category: 'contract',
    size: 2450000,
    uploadedBy: 'Michael Chen',
    uploadedDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    status: 'Certified',
    verifiedBy: 'Sarah Jenkins',
    verifiedDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
    starred: true,
    caseNumber: 'MIP-2024-001'
  },
  {
    id: 'doc-002',
    name: 'Property_Valuation_Report.pdf',
    type: 'pdf',
    category: 'valuation',
    size: 1850000,
    uploadedBy: 'Preston Rowe Paterson',
    uploadedDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    status: 'Certified',
    verifiedBy: 'Tom Anderson',
    verifiedDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
    starred: false,
    caseNumber: 'MIP-2024-001'
  },
  {
    id: 'doc-003',
    name: 'Property_Inspection_Photos.zip',
    type: 'other',
    category: 'inspection',
    size: 15600000,
    uploadedBy: 'Sarah Mitchell',
    uploadedDate: new Date(Date.now() - 48 * 60 * 60 * 1000),
    status: 'Uncertified',
    starred: false,
    caseNumber: 'MIP-2024-001'
  },
  {
    id: 'doc-004',
    name: 'KYC_Documents_Michael_Chen.pdf',
    type: 'pdf',
    category: 'kyc',
    size: 3200000,
    uploadedBy: 'Michael Chen',
    uploadedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'Expired',
    verifiedBy: 'Jane Smith',
    verifiedDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    starred: false
  },
  {
    id: 'doc-005',
    name: 'Contract_Signed_MIP-2024-003.pdf',
    type: 'pdf',
    category: 'contract',
    size: 1250000,
    uploadedBy: 'David Wilson',
    uploadedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    status: 'Certified',
    verifiedBy: 'Tom Anderson',
    verifiedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    starred: true,
    caseNumber: 'MIP-2024-003'
  }
];

export function DocumentLibrary() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<Document['category']>('kyc');
  const [uploadExpiry, setUploadExpiry] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const searchMatch = searchQuery === '' || 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.caseNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const categoryMatch = categoryFilter === 'all' || doc.category === categoryFilter;
    const typeMatch = typeFilter === 'all' || doc.type === typeFilter;
    const starMatch = !showStarredOnly || doc.starred;
    
    return searchMatch && categoryMatch && typeMatch && starMatch;
  });

  // Calculate stats
  const totalSize = documents.reduce((acc, doc) => acc + doc.size, 0);
  const starredCount = documents.filter(d => d.starred).length;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-400" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-blue-400" />;
      case 'excel':
        return <FileType className="w-5 h-5 text-green-400" />;
      case 'word':
        return <FileText className="w-5 h-5 text-blue-400" />;
      default:
        return <File className="w-5 h-5 text-slate-300" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      contract: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
      valuation: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
      inspection: 'bg-teal-500/15 text-teal-300 border border-teal-500/30',
      kyc: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
      other: 'bg-white/5 text-slate-100 border border-white/10'
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[category as keyof typeof colors]}`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Certified':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-500/15 text-green-300 border border-green-500/30">Certified</span>;
      case 'Uncertified':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">Uncertified</span>;
      case 'Expired':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/15 text-red-300 border border-red-500/30">Expired</span>;
      case 'Rejected':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/5 text-slate-100 border border-white/10">Rejected</span>;
      default:
        return null;
    }
  };

  const getExpiryDisplay = (date?: Date) => {
    if (!date) return <span className="text-gray-400">No Expiry</span>;
    const now = new Date();
    const daysUntil = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) {
      return <span className="text-red-400 font-medium">Expired {format(date, 'dd MMM yyyy')}</span>;
    }
    if (daysUntil <= 30) {
      return <span className="text-amber-400 font-medium">Expiring {format(date, 'dd MMM yyyy')}</span>;
    }
    return <span className="text-slate-300">Expires {format(date, 'dd MMM yyyy')}</span>;
  };

  const handleToggleStar = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    setDocuments(documents.map(d => 
      d.id === docId ? { ...d, starred: !d.starred } : d
    ));
    toast.success(doc?.starred ? 'Removed from starred' : 'Added to starred', {
      description: doc?.name
    });
  };

  const handleToggleVerification = (docId: string, currentStatus: string) => {
    setDocuments(documents.map(d => {
      if (d.id === docId) {
        if (currentStatus === 'Certified' || currentStatus === 'Expired') {
          return { 
            ...d, 
            status: 'Uncertified', 
            verifiedBy: undefined, 
            verifiedDate: undefined 
          };
        } else {
          return { 
            ...d, 
            status: 'Certified', 
            verifiedBy: 'Current User', 
            verifiedDate: new Date() 
          };
        }
      }
      return d;
    }));
    toast.success(currentStatus === 'Uncertified' ? 'Document certified successfully' : 'Document uncertified');
  };

  const handleDeleteClick = (doc: Document) => {
    setDocumentToDelete(doc);
    setConfirmDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!documentToDelete) return;

    setConfirmDeleteOpen(false);
    toast.loading('Deleting document...');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setDocuments(documents.filter(d => d.id !== documentToDelete.id));
    
    toast.success('Document deleted', {
      description: documentToDelete.name
    });
    
    setDocumentToDelete(null);
  };

  const handleDownload = (doc: Document) => {
    toast.info('Downloading document...', {
      description: doc.name
    });
  };

  const handleView = (doc: Document) => {
    toast.info('Opening document...', {
      description: doc.name
    });
  };

  const handleShare = (doc: Document) => {
    toast.success('Share link copied', {
      description: 'Link copied to clipboard'
    });
  };

  const handleUpload = () => {
    setIsUploadModalOpen(true);
    setSelectedFile(null);
    setUploadExpiry('');
    setUploadCategory('kyc');
  };

  const submitUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    setIsUploading(true);
    // Simulate network upload
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: selectedFile.name,
      type: selectedFile.name.endsWith('.pdf') ? 'pdf' : selectedFile.name.match(/\.(jpg|jpeg|png)$/i) ? 'image' : 'other',
      category: uploadCategory,
      size: selectedFile.size,
      uploadedBy: 'Current User',
      uploadedDate: new Date(),
      expiryDate: uploadExpiry ? new Date(uploadExpiry) : undefined,
      status: 'Uncertified',
      starred: false,
    };

    setDocuments([newDoc, ...documents]);
    setIsUploading(false);
    setIsUploadModalOpen(false);
    toast.success('Document uploaded successfully');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setTypeFilter('all');
    setShowStarredOnly(false);
    toast.info('Filters cleared');
  };

  const handleExport = () => {
    toast.info('Preparing export...');
    setTimeout(() => {
      toast.success('Document list exported', {
        description: `${filteredDocuments.length} documents exported to CSV`
      });
    }, 1000);
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '#' },
    { label: 'Document Library' }
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300 mb-1">Total Documents</p>
                <p className="text-3xl font-semibold text-slate-100">{documents.length}</p>
                <p className="text-xs text-slate-400 mt-1">All files</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300 mb-1">Storage Used</p>
                <p className="text-3xl font-semibold text-slate-100">{formatFileSize(totalSize)}</p>
                <p className="text-xs text-slate-400 mt-1">Total size</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <FolderOpen className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300 mb-1">Starred</p>
                <p className="text-3xl font-semibold text-slate-100">{starredCount}</p>
                <p className="text-xs text-slate-400 mt-1">Favorites</p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <Star className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300 mb-1">This Week</p>
                <p className="text-3xl font-semibold text-slate-100">
                  {documents.filter(d => d.uploadedDate > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </p>
                <p className="text-xs text-slate-400 mt-1">Recently added</p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Upload className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Documents ({filteredDocuments.length})</CardTitle>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search documents..."
                  className="pl-9 w-64"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Categories</option>
                <option value="contract">Contract</option>
                <option value="valuation">Valuation</option>
                <option value="inspection">Inspection</option>
                <option value="kyc">KYC</option>
                <option value="other">Other</option>
              </select>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Types</option>
                <option value="pdf">PDF</option>
                <option value="image">Image</option>
                <option value="excel">Excel</option>
                <option value="word">Word</option>
                <option value="other">Other</option>
              </select>

              {/* Starred Filter */}
              <Button
                variant={showStarredOnly ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowStarredOnly(!showStarredOnly)}
              >
                <Star className="w-4 h-4 mr-1" />
                Starred
              </Button>

              {/* Actions */}
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>

              <Button size="sm" onClick={handleUpload}>
                <Upload className="w-4 h-4 mr-1" />
                Upload
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No documents found"
              description={
                searchQuery || categoryFilter !== 'all' || typeFilter !== 'all' || showStarredOnly
                  ? "No documents match your filters"
                  : "No documents have been uploaded yet"
              }
              action={
                searchQuery || categoryFilter !== 'all' || typeFilter !== 'all' || showStarredOnly
                  ? { label: 'Clear Filters', onClick: handleClearFilters }
                  : { label: 'Upload Documents', onClick: handleUpload }
              }
            />
          ) : (
            <div className="space-y-2">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0 p-3 bg-white/5 rounded-lg">
                      {getFileIcon(doc.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-4">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-100 truncate hover:text-blue-400 cursor-pointer transition-colors">{doc.name}</p>
                          {doc.caseNumber && (
                            <span className="text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded font-mono">
                              {doc.caseNumber}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>{formatFileSize(doc.size)}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span>By {doc.uploadedBy}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span>{format(doc.uploadedDate, 'dd MMM yy')}</span>
                        </div>
                      </div>

                      <div className="md:col-span-2 flex flex-col justify-center mt-2 md:mt-0">
                        <span className="text-xs text-slate-400 mb-1">Category</span>
                        <div className="flex items-start">
                          {getCategoryBadge(doc.category)}
                        </div>
                      </div>

                      <div className="md:col-span-2 flex flex-col mt-2 md:mt-0">
                        <span className="text-xs text-slate-400 mb-1">Expiry Status</span>
                        <div className="text-sm">
                          {getExpiryDisplay(doc.expiryDate)}
                        </div>
                      </div>

                      <div className="md:col-span-2 flex flex-col items-start mt-2 md:mt-0">
                        <span className="text-xs text-slate-400 mb-1">Status</span>
                        <div className="mb-1">{getStatusBadge(doc.status)}</div>
                        {(doc.status === 'Certified' || doc.verifiedBy) && (
                          <div className="text-[10px] text-slate-400 leading-tight">
                            <span>By {doc.verifiedBy}</span>
                            <br />
                            <span>{doc.verifiedDate ? format(doc.verifiedDate, 'dd MMM yy') : ''}</span>
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-2 flex flex-col items-start mt-2 md:mt-0">
                        <span className="text-xs text-slate-400 mb-1">Verify Action</span>
                        {doc.status === 'Uncertified' ? (
                          <Button 
                            size="sm" 
                            className="h-7 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm w-full md:w-auto"
                            onClick={() => handleToggleVerification(doc.id, doc.status)}
                          >
                            <CheckCircle className="w-3 h-3 mr-1.5" />
                            Verify Now
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-7 px-3 text-xs text-slate-300 hover:bg-white/5 hover:text-slate-100 w-full md:w-auto"
                            onClick={() => handleToggleVerification(doc.id, doc.status)}
                          >
                            <X className="w-3 h-3 mr-1.5" />
                            Revoke
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStar(doc.id)}
                      className={doc.starred ? 'text-amber-400' : 'text-gray-400'}
                    >
                      {doc.starred ? (
                        <Star className="w-4 h-4 fill-current" />
                      ) : (
                        <StarOff className="w-4 h-4" />
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(doc)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(doc)}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(doc)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-500/30 bg-blue-500/10">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <FolderOpen className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-300 mb-1">Document Management</p>
              <p className="text-sm text-blue-300">
                All documents are encrypted and stored securely. Documents are retained per Australian compliance requirements.
              </p>
              <div className="mt-2 text-xs text-blue-300 space-y-1">
                <p>• Maximum file size: 50MB per document</p>
                <p>• Supported formats: PDF, DOCX, XLSX, images (JPG, PNG)</p>
                <p>• Version control and audit trail maintained</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Delete Document?"
        description={`Are you sure you want to delete "${documentToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Document"
        onConfirm={handleDelete}
        variant="destructive"
      />

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-white/5/50 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-blue-400" />
                Upload Document
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsUploadModalOpen(false)} className="h-8 w-8 p-0 rounded-full">
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              
              {/* Drag and Drop Zone */}
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${selectedFile ? 'border-blue-400 bg-blue-500/10/50' : 'border-white/10 hover:border-blue-400 hover:bg-white/5'}`}
              >
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  onChange={handleFileSelect}
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className={`p-3 rounded-full ${selectedFile ? 'bg-blue-500/15 text-blue-400' : 'bg-white/5 text-slate-400'}`}>
                    {selectedFile ? <FileText className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
                  </div>
                  <div>
                    {selectedFile ? (
                      <>
                        <p className="font-semibold text-slate-100">{selectedFile.name}</p>
                        <p className="text-sm text-slate-400">{formatFileSize(selectedFile.size)}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-slate-100">Click to upload or drag and drop</p>
                        <p className="text-sm text-slate-400">SVG, PNG, JPG, PDF or DOCX (max. 50MB)</p>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Document Category</label>
                  <select 
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as Document['category'])}
                    className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="kyc">KYC / Identity</option>
                    <option value="contract">Contract / Agreement</option>
                    <option value="valuation">Valuation Report</option>
                    <option value="inspection">Inspection Report</option>
                    <option value="other">Other Document</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Expiry Date (Optional)</label>
                  <Input 
                    type="date" 
                    value={uploadExpiry}
                    onChange={(e) => setUploadExpiry(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsUploadModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" 
                  onClick={submitUpload}
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Upload Document'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
