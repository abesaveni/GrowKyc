import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Database,
  Bot,
  Building,
  Shield,
  DollarSign,
  Scale,
  User,
  CreditCard,
  TrendingUp,
  FileCheck,
  Activity,
  Globe,
  HardDrive,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Upload
} from 'lucide-react';
import { ClientDocumentRepository, IntegrationDocument, INTEGRATION_DOCUMENTS_DATABASE, saveDocumentsDatabase } from './IntegrationDocumentsData';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';


interface IntegrationDocumentsDisplayProps {
  documentRepo: ClientDocumentRepository;
}

export function IntegrationDocumentsDisplay({ documentRepo }: IntegrationDocumentsDisplayProps) {
  const [localRepo, setLocalRepo] = useState<ClientDocumentRepository>(documentRepo);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedDocument, setExpandedDocument] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  React.useEffect(() => {
    setLocalRepo(documentRepo);
  }, [documentRepo]);

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleConfirmUpload = () => {
    if (!selectedFile) {
      toast.error('Please select a file first.');
      return;
    }
    if (!documentName.trim()) {
      toast.error('Please enter a document name.');
      return;
    }
    if (!selectedRole) {
      toast.error('Please select a role for this document.');
      return;
    }

    const newDoc: IntegrationDocument = {
      id: `DOC-NEW-${Date.now()}`,
      documentName: documentName.trim(),
      documentType: selectedRole,
      category: selectedRole as any,
      source: 'User Upload',
      integrationProvider: 'InfoTrack', 
      receivedDate: new Date().toISOString().split('T')[0],
      documentDate: new Date().toISOString().split('T')[0],
      fileType: (selectedFile.name.split('.').pop()?.toUpperCase() as any) || 'PDF',
      fileSize: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
      downloadedBy: 'current.user@grow.com',
      verificationStatus: 'Uncertified',
      aiAnalysisStatus: 'Pending',
      searchable: true,
      tags: ['uploaded', selectedRole.toLowerCase()]
    };

    setLocalRepo(prev => {
      const newCategories = [...prev.categories];
      const categoryIndex = newCategories.findIndex(c => c.category === selectedRole);
      
      if (categoryIndex >= 0) {
        newCategories[categoryIndex] = {
          ...newCategories[categoryIndex],
          count: newCategories[categoryIndex].count + 1,
          documents: [newDoc, ...newCategories[categoryIndex].documents]
        };
      } else {
        newCategories.push({
          category: selectedRole,
          count: 1,
          lastUpdated: newDoc.receivedDate,
          documents: [newDoc]
        });
      }

      return {
        ...prev,
        totalDocuments: prev.totalDocuments + 1,
        categories: newCategories
      };
    });

    if (documentRepo.clientId && INTEGRATION_DOCUMENTS_DATABASE[documentRepo.clientId]) {
      const dbRepo = INTEGRATION_DOCUMENTS_DATABASE[documentRepo.clientId];
      const categoryIndex = dbRepo.categories.findIndex(c => c.category === selectedRole);
      
      if (categoryIndex >= 0) {
        dbRepo.categories[categoryIndex].documents.unshift(newDoc);
        dbRepo.categories[categoryIndex].count += 1;
      } else {
        dbRepo.categories.push({
          category: selectedRole as any,
          count: 1,
          lastUpdated: newDoc.receivedDate,
          documents: [newDoc]
        });
      }
      dbRepo.totalDocuments += 1;
      saveDocumentsDatabase();
    }

    toast.success(`Successfully uploaded "${documentName.trim()}" as ${selectedRole}`);
    setIsUploadModalOpen(false);
    setSelectedFile(null);
    setSelectedRole('');
    setDocumentName('');
  };

  const handleCertifyDocument = (docId: string, categoryName: string) => {
    setLocalRepo(prev => {
      const newCategories = [...prev.categories];
      const categoryIndex = newCategories.findIndex(c => c.category === categoryName);
      
      if (categoryIndex >= 0) {
        const newDocs = [...newCategories[categoryIndex].documents];
        const docIndex = newDocs.findIndex(d => d.id === docId);
        if (docIndex >= 0) {
          newDocs[docIndex] = {
            ...newDocs[docIndex],
            verificationStatus: 'Certified',
            verifiedBy: 'current.user@grow.com',
            verifiedDate: new Date().toISOString().split('T')[0]
          };
          newCategories[categoryIndex] = {
            ...newCategories[categoryIndex],
            documents: newDocs
          };
        }
      }
      return { ...prev, categories: newCategories };
    });

    if (documentRepo.clientId && INTEGRATION_DOCUMENTS_DATABASE[documentRepo.clientId]) {
      const dbRepo = INTEGRATION_DOCUMENTS_DATABASE[documentRepo.clientId];
      const categoryIndex = dbRepo.categories.findIndex(c => c.category === categoryName);
      
      if (categoryIndex >= 0) {
        const docIndex = dbRepo.categories[categoryIndex].documents.findIndex(d => d.id === docId);
        if (docIndex >= 0) {
          dbRepo.categories[categoryIndex].documents[docIndex].verificationStatus = 'Certified';
          dbRepo.categories[categoryIndex].documents[docIndex].verifiedBy = 'current.user@grow.com';
          dbRepo.categories[categoryIndex].documents[docIndex].verifiedDate = new Date().toISOString().split('T')[0];
          saveDocumentsDatabase();
        }
      }
    }

    toast.success('Document has been successfully marked as Certified.');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Identity Verification': return User;
      case 'Company Search': return Building;
      case 'Credit Report': return CreditCard;
      case 'AML Screening': return Shield;
      case 'Compliance': return FileCheck;
      case 'Financial': return DollarSign;
      case 'Legal': return Scale;
      case 'Background Check': return Activity;
      default: return FileText;
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'Verified': 
      case 'Certified': return 'bg-green-100 text-green-800 border-green-300';
      case 'Pending Review': 
      case 'Uncertified': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Flagged': return 'bg-red-100 text-red-800 border-red-300';
      case 'Expired': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getAIStatusColor = (status: string) => {
    switch (status) {
      case 'Analyzed': return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'Pending': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Failed': return 'bg-red-100 text-red-800 border-red-300';
      case 'Not Required': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getProviderColor = (provider: string) => {
    const colors: Record<string, string> = {
      'InfoTrack': 'bg-blue-100 text-blue-800',
      'ASIC': 'bg-purple-100 text-purple-800',
      'World-Check': 'bg-orange-100 text-orange-800',
      'GreenID': 'bg-green-100 text-green-800',
      'Equifax': 'bg-red-100 text-red-800',
      'illion': 'bg-indigo-100 text-indigo-800',
      'CreditorWatch': 'bg-yellow-100 text-yellow-800',
      'Dun & Bradstreet': 'bg-teal-100 text-teal-800',
      'AUSTRAC': 'bg-cyan-100 text-cyan-800',
      'Australian Tax Office': 'bg-pink-100 text-pink-800',
      'AFP': 'bg-red-100 text-red-800'
    };
    return colors[provider] || 'bg-gray-100 text-gray-800';
  };

  const filteredDocuments = selectedCategory
    ? localRepo.categories.find(c => c.category === selectedCategory)?.documents || []
    : localRepo.categories.flatMap(c => c.documents);

  const searchedDocuments = searchTerm
    ? filteredDocuments.filter(doc =>
        doc.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        doc.source.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredDocuments;

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <Card className="border-2 border-cyan-300 shadow-lg">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <Database className="w-6 h-6 text-cyan-600" />
            Integration Documents Repository
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-cyan-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-cyan-600" />
                <p className="text-sm text-gray-600">Total Documents</p>
              </div>
              <p className="text-3xl font-bold text-cyan-700">{localRepo.totalDocuments}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-5 h-5 text-purple-600" />
                <p className="text-sm text-gray-600">AI Analyzed</p>
              </div>
              <p className="text-3xl font-bold text-purple-700">{localRepo.documentsAnalyzed}</p>
              <p className="text-xs text-purple-600 mt-1">
                {localRepo.totalDocuments > 0 ? Math.round((localRepo.documentsAnalyzed / localRepo.totalDocuments) * 100) : 0}% Complete
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5 text-green-600" />
                <p className="text-sm text-gray-600">Integration Sources</p>
              </div>
              <p className="text-3xl font-bold text-green-700">{localRepo.integrationSources.length}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="w-5 h-5 text-amber-600" />
                <p className="text-sm text-gray-600">Storage Used</p>
              </div>
              <p className="text-3xl font-bold text-amber-700">{localRepo.totalStorageUsed}</p>
            </div>
          </div>

          {/* Integration Sources */}
          <div className="mt-6">
            <h3 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Connected Integration Sources
            </h3>
            <div className="flex flex-wrap gap-2">
              {localRepo.integrationSources.map((source) => (
                <Badge key={source} className={`${getProviderColor(source)} border px-3 py-1`}>
                  {source}
                </Badge>
              ))}
            </div>
          </div>

          {/* AI Analysis Status */}
          {localRepo.aiAnalysisEnabled && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-cyan-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-600" />
                <div>
                  <p className="font-semibold text-cyan-800">AI Analysis Enabled</p>
                  <p className="text-xs text-cyan-700">
                    All documents are searchable by AI bots and compliance copilot. Automated risk analysis and key findings extraction active.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card className="border-2 border-blue-300 shadow-lg">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents by name, tags, or source..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Advanced Filter
            </Button>
            <Button 
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white"
              onClick={handleUploadClick}
            >
              <Upload className="w-4 h-4" />
              Upload Document
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Category Cards */}
      <div className="grid grid-cols-4 gap-4">
        {localRepo.categories.map((category) => {
          const Icon = getCategoryIcon(category.category);
          const isSelected = selectedCategory === category.category;
          
          return (
            <button
              key={category.category}
              onClick={() => setSelectedCategory(isSelected ? null : category.category)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'bg-cyan-600 border-cyan-700 text-white shadow-lg'
                  : 'bg-white border-gray-200 hover:border-cyan-400 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-cyan-600'}`} />
                <span className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-cyan-700'}`}>
                  {category.count}
                </span>
              </div>
              <p className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                {category.category}
              </p>
              <p className={`text-xs mt-1 ${isSelected ? 'text-cyan-100' : 'text-gray-500'}`}>
                Updated {category.lastUpdated}
              </p>
            </button>
          );
        })}
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">
            {selectedCategory || 'All Documents'} 
            <span className="text-gray-500 text-sm ml-2">
              ({searchedDocuments.length} {searchedDocuments.length === 1 ? 'document' : 'documents'})
            </span>
          </h3>
          {selectedCategory && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              Clear Filter
            </Button>
          )}
        </div>

        {searchedDocuments.map((doc) => {
          const isExpanded = expandedDocument === doc.id;
          
          return (
            <Card key={doc.id} className="border-2 border-gray-200 hover:border-cyan-400 transition-all">
              <CardContent className="p-0">
                {/* Document Header - Always Visible */}
                <button
                  onClick={() => setExpandedDocument(isExpanded ? null : doc.id)}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-lg ${
                      doc.verificationStatus === 'Flagged' ? 'bg-red-100' :
                      doc.verificationStatus === 'Verified' ? 'bg-green-100' :
                      'bg-blue-100'
                    }`}>
                      <FileText className={`w-6 h-6 ${
                        doc.verificationStatus === 'Flagged' ? 'text-red-600' :
                        doc.verificationStatus === 'Verified' ? 'text-green-600' :
                        'text-blue-600'
                      }`} />
                    </div>

                    {/* Document Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{doc.documentName}</h4>
                          <p className="text-sm text-gray-600 mt-1">{doc.documentType}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Badges Row */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge className={`${getProviderColor(doc.integrationProvider)} border px-2 py-0.5 text-xs`}>
                          {doc.integrationProvider}
                        </Badge>
                        <Badge className={`${getVerificationColor(doc.verificationStatus)} border px-2 py-0.5 text-xs`}>
                          {doc.verificationStatus}
                        </Badge>
                        {doc.searchable && (
                          <Badge className="bg-cyan-100 text-cyan-800 border border-cyan-300 px-2 py-0.5 text-xs flex items-center gap-1">
                            <Bot className="w-3 h-3" />
                            AI Searchable
                          </Badge>
                        )}
                        <Badge className="bg-gray-100 text-gray-700 border border-gray-300 px-2 py-0.5 text-xs">
                          {doc.fileType}
                        </Badge>
                        <Badge className="bg-gray-100 text-gray-700 border border-gray-300 px-2 py-0.5 text-xs">
                          {doc.fileSize}
                        </Badge>
                      </div>

                      {/* Quick Info */}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Received: {doc.receivedDate}</span>
                        <span>•</span>
                        <span>Source: {doc.source}</span>
                        <span>•</span>
                        <span className="font-semibold text-gray-700">Verified by: {doc.verifiedBy || 'Pending'}</span>
                        <span>•</span>
                        <span className="font-semibold text-gray-700">Verify Date: {doc.verifiedDate || 'Pending'}</span>
                        {doc.expiryDate && (
                          <>
                            <span>•</span>
                            <span className="font-semibold text-gray-700">Expires: {doc.expiryDate}</span>
                          </>
                        )}
                        {doc.referenceNumber && (
                          <>
                            <span>•</span>
                            <span>Ref: {doc.referenceNumber}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t bg-gray-50 p-6 space-y-4">
                    {/* AI Analysis Status */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-cyan-600" />
                        <h5 className="font-semibold text-gray-800">AI Analysis</h5>
                        <Badge className={`${getAIStatusColor(doc.aiAnalysisStatus)} border px-2 py-0.5 text-xs ml-auto`}>
                          {doc.aiAnalysisStatus}
                        </Badge>
                      </div>
                      {doc.aiSummary && (
                        <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200">
                          <p className="text-sm text-gray-800">{doc.aiSummary}</p>
                        </div>
                      )}
                    </div>

                    {/* Key Findings */}
                    {doc.keyFindings && doc.keyFindings.length > 0 && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <h5 className="font-semibold text-gray-800">Key Findings</h5>
                        </div>
                        <ul className="space-y-2">
                          {doc.keyFindings.map((finding, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <span className="text-cyan-600 mt-1">•</span>
                              <span className={finding.includes('⚠️') ? 'text-red-700' : 'text-gray-700'}>
                                {finding}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Risk Indicators */}
                    {doc.riskIndicators && doc.riskIndicators.length > 0 && (
                      <div className="bg-white rounded-lg p-4 border border-red-200">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          <h5 className="font-semibold text-red-800">Risk Indicators</h5>
                        </div>
                        <ul className="space-y-2">
                          {doc.riskIndicators.map((risk, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                              <span className="text-red-700">{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Document Details */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h5 className="font-semibold text-gray-800 mb-3">Document Details</h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Document Date</p>
                          <p className="font-semibold">{doc.documentDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Received Date</p>
                          <p className="font-semibold">{doc.receivedDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Downloaded By</p>
                          <p className="font-semibold">{doc.downloadedBy}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Verified By</p>
                          <p className="font-semibold">{doc.verifiedBy || 'Pending'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Verified Date</p>
                          <p className="font-semibold">{doc.verifiedDate || 'Pending'}</p>
                        </div>
                        {doc.pages && (
                          <div>
                            <p className="text-gray-500">Pages</p>
                            <p className="font-semibold">{doc.pages}</p>
                          </div>
                        )}
                        {doc.cost && (
                          <div>
                            <p className="text-gray-500">Cost</p>
                            <p className="font-semibold">{doc.cost}</p>
                          </div>
                        )}
                        {doc.expiryDate && (
                          <div>
                            <p className="text-gray-500">Expiry Date</p>
                            <p className="font-semibold">{doc.expiryDate}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    {doc.tags.length > 0 && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h5 className="font-semibold text-gray-800 mb-3">Tags</h5>
                        <div className="flex flex-wrap gap-2">
                          {doc.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700"
                        onClick={() => {
                          toast.info(`Opening preview for "${doc.documentName}"...`, {
                            description: `${doc.fileType} • ${doc.fileSize} • ${doc.source}`,
                            duration: 4000,
                          });
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        View Document
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={() => {
                          toast.loading(`Preparing download...`, { id: `dl-${doc.id}`, duration: 1500 });
                          setTimeout(() => {
                            toast.success(`Downloaded "${doc.documentName}" successfully`, {
                              id: `dl-${doc.id}`,
                              description: `${doc.fileType} • ${doc.fileSize}`,
                            });
                          }, 1500);
                        }}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={() => {
                          toast.info(`AI is analyzing "${doc.documentName}"...`, {
                            description: 'This may take a moment.',
                            duration: 3000,
                          });
                        }}
                      >
                        <Bot className="w-4 h-4" />
                        Ask AI About This Document
                      </Button>
                      {doc.verificationStatus === 'Verified' && (
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50"
                          onClick={() => handleCertifyDocument(doc.id, doc.category)}
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark as Certified
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {searchedDocuments.length === 0 && (
          <Card className="border-2 border-gray-200">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No documents found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Select a document to upload and assign its relevant role or category.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Document Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="e.g. Passport - John Smith"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Select File <span className="text-red-500">*</span></label>
              <input 
                type="file" 
                onChange={handleFileSelect}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Document Role/Type <span className="text-red-500">*</span></label>
              <select 
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              >
                <option value="">Select a role...</option>
                <option value="Identity Verification">Identity Verification</option>
                <option value="Company Search">Company Search</option>
                <option value="Credit Report">Credit Report</option>
                <option value="AML Screening">AML Screening</option>
                <option value="Compliance">Compliance</option>
                <option value="Financial">Financial</option>
                <option value="Legal">Legal</option>
                <option value="Background Check">Background Check</option>
                <option value="Trust Deed">Trust Deed</option>
                <option value="Tax">Tax</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmUpload} className="bg-cyan-600 hover:bg-cyan-700">Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
