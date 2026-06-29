import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Upload,
  File,
  FileText,
  Image,
  Folder,
  Download,
  Trash2,
  Eye,
  Search,
  Filter,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface DocumentsProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  size: string;
  uploadedBy: string;
  uploadedDate: string;
  status: 'verified' | 'pending' | 'rejected';
}

export function Documents({ onNavigate, onBack }: DocumentsProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dragActive, setDragActive] = useState(false);

  const documents: Document[] = [
    {
      id: 'DOC-001',
      name: 'Financial Statements 2023.pdf',
      type: 'PDF',
      category: 'Financial',
      size: '2.4 MB',
      uploadedBy: 'John Smith',
      uploadedDate: '2024-02-10',
      status: 'verified'
    },
    {
      id: 'DOC-002',
      name: 'Company Extract ASIC.pdf',
      type: 'PDF',
      category: 'Legal',
      size: '856 KB',
      uploadedBy: 'Sarah Johnson',
      uploadedDate: '2024-02-11',
      status: 'verified'
    },
    {
      id: 'DOC-003',
      name: 'Property Valuation Report.pdf',
      type: 'PDF',
      category: 'Valuation',
      size: '5.2 MB',
      uploadedBy: 'John Smith',
      uploadedDate: '2024-02-12',
      status: 'pending'
    },
    {
      id: 'DOC-004',
      name: 'Director ID - Jane Doe.jpg',
      type: 'Image',
      category: 'Identity',
      size: '1.1 MB',
      uploadedBy: 'Sarah Johnson',
      uploadedDate: '2024-02-13',
      status: 'verified'
    },
    {
      id: 'DOC-005',
      name: 'Tax Returns 2022-2023.pdf',
      type: 'PDF',
      category: 'Financial',
      size: '3.8 MB',
      uploadedBy: 'John Smith',
      uploadedDate: '2024-02-09',
      status: 'verified'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Documents', count: documents.length },
    { id: 'financial', label: 'Financial', count: documents.filter(d => d.category === 'Financial').length },
    { id: 'legal', label: 'Legal', count: documents.filter(d => d.category === 'Legal').length },
    { id: 'identity', label: 'Identity', count: documents.filter(d => d.category === 'Identity').length },
    { id: 'valuation', label: 'Valuation', count: documents.filter(d => d.category === 'Valuation').length },
    { id: 'other', label: 'Other', count: 0 }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    alert(`Uploading ${files.length} file(s): ${Array.from(files).map(f => f.name).join(', ')}`);
  };

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: JSX.Element } = {
      'verified': <span className="px-2 py-0.5 bg-green-500/15 text-green-300 text-xs font-semibold rounded flex items-center gap-1"><CheckCircle className="w-3 h-3" />VERIFIED</span>,
      'pending': <span className="px-2 py-0.5 bg-amber-500/15 text-amber-300 text-xs font-semibold rounded flex items-center gap-1"><Clock className="w-3 h-3" />PENDING</span>,
      'rejected': <span className="px-2 py-0.5 bg-red-500/15 text-red-300 text-xs font-semibold rounded flex items-center gap-1"><AlertCircle className="w-3 h-3" />REJECTED</span>
    };
    return badges[status];
  };

  const getFileIcon = (type: string) => {
    if (type === 'PDF') return <FileText className="w-5 h-5 text-red-400" />;
    if (type === 'Image') return <Image className="w-5 h-5 text-blue-400" />;
    return <File className="w-5 h-5 text-slate-300" />;
  };

  return (
    <div className="min-h-screen bg-white/5">
      {/* Header */}
      <div className="bg-white border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <Folder className="w-6 h-6 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold text-slate-100">Document Management</h1>
              <p className="text-xs text-slate-300">Upload and manage loan documents</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Upload Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            dragActive
              ? 'border-blue-600 bg-blue-500/10'
              : 'border-white/10 bg-white hover:border-blue-400'
          }`}
        >
          <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">
            {dragActive ? 'Drop files here' : 'Upload Documents'}
          </h3>
          <p className="text-sm text-slate-300 mb-4">
            Drag and drop files here, or click to browse
          </p>
          <input
            type="file"
            id="fileInput"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Select Files
          </Button>
          <p className="text-xs text-slate-400 mt-3">
            Supported formats: PDF, JPG, PNG, DOC, XLSX (Max 10MB per file)
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 border border-white/10 rounded text-sm"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Documents List */}
        <div className="bg-white border border-white/10 rounded overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Document</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Category</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Size</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Uploaded By</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Date</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300">Status</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-blue-500/10">
                  <td className="border border-white/10 px-3 py-2">
                    <div className="flex items-center gap-2">
                      {getFileIcon(doc.type)}
                      <div>
                        <div className="font-semibold text-slate-100">{doc.name}</div>
                        <div className="text-xs text-slate-400">{doc.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-slate-300">
                    {doc.category}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-slate-300 font-mono">
                    {doc.size}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-slate-300">
                    {doc.uploadedBy}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-slate-300">
                    {doc.uploadedDate}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-center">
                    {getStatusBadge(doc.status)}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <button className="px-2 py-1 text-xs bg-blue-500/15 text-blue-300 hover:bg-blue-500/20 rounded font-semibold">
                        <Eye className="w-3 h-3 inline mr-1" />
                        View
                      </button>
                      <button className="px-2 py-1 text-xs bg-green-500/15 text-green-300 hover:bg-green-500/20 rounded font-semibold">
                        <Download className="w-3 h-3 inline mr-1" />
                        Download
                      </button>
                      <button className="px-2 py-1 text-xs bg-red-500/15 text-red-300 hover:bg-red-500/20 rounded font-semibold">
                        <Trash2 className="w-3 h-3 inline mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-white/10 rounded p-4">
            <div className="text-sm text-slate-300 mb-1">Total Documents</div>
            <div className="text-2xl font-bold text-slate-100">{documents.length}</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded p-4">
            <div className="text-sm text-green-300 mb-1">Verified</div>
            <div className="text-2xl font-bold text-green-300">
              {documents.filter(d => d.status === 'verified').length}
            </div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded p-4">
            <div className="text-sm text-amber-300 mb-1">Pending Review</div>
            <div className="text-2xl font-bold text-amber-300">
              {documents.filter(d => d.status === 'pending').length}
            </div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded p-4">
            <div className="text-sm text-blue-300 mb-1">Total Size</div>
            <div className="text-2xl font-bold text-blue-300">13.3 MB</div>
          </div>
        </div>
      </div>
    </div>
  );
}
