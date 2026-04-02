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
  MoreVertical
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
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-blue-600" />;
      case 'excel':
        return <FileType className="w-5 h-5 text-green-600" />;
      case 'word':
        return <FileText className="w-5 h-5 text-blue-600" />;
      default:
        return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      contract: 'bg-purple-100 text-purple-800',
      valuation: 'bg-blue-100 text-blue-800',
      inspection: 'bg-green-100 text-green-800',
      kyc: 'bg-amber-100 text-amber-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[category as keyof typeof colors]}`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
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
    toast.info('Upload documents', {
      description: 'Select files to upload'
    });
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
                <p className="text-sm text-gray-600 mb-1">Total Documents</p>
                <p className="text-3xl font-semibold text-gray-900">{documents.length}</p>
                <p className="text-xs text-gray-500 mt-1">All files</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Storage Used</p>
                <p className="text-3xl font-semibold text-gray-900">{formatFileSize(totalSize)}</p>
                <p className="text-xs text-gray-500 mt-1">Total size</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <FolderOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Starred</p>
                <p className="text-3xl font-semibold text-gray-900">{starredCount}</p>
                <p className="text-xs text-gray-500 mt-1">Favorites</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Week</p>
                <p className="text-3xl font-semibold text-gray-900">
                  {documents.filter(d => d.uploadedDate > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Recently added</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Upload className="w-6 h-6 text-purple-600" />
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
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-shrink-0">
                      {getFileIcon(doc.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 truncate">{doc.name}</p>
                        {getCategoryBadge(doc.category)}
                        {doc.caseNumber && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {doc.caseNumber}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{formatFileSize(doc.size)}</span>
                        <span>•</span>
                        <span>Uploaded by {doc.uploadedBy}</span>
                        <span>•</span>
                        <span>{format(doc.uploadedDate, 'dd MMM yyyy, HH:mm')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStar(doc.id)}
                      className={doc.starred ? 'text-amber-600' : 'text-gray-400'}
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
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <FolderOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Document Management</p>
              <p className="text-sm text-blue-800">
                All documents are encrypted and stored securely. Documents are retained per Australian compliance requirements.
              </p>
              <div className="mt-2 text-xs text-blue-700 space-y-1">
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
    </div>
  );
}
