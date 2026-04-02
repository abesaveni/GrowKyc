import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  CheckCircle,
  Circle,
  Plus,
  Edit,
  Trash2,
  Copy,
  Download,
  Upload,
  Search,
  Filter,
  MoreVertical,
  GripVertical,
  Clock,
  User,
  Target,
  AlertCircle,
  FileText,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface ChecklistsProps {
  onNavigate?: (page: string) => void;
}

interface ChecklistItem {
  id: string;
  text: string;
  required: boolean;
  assignee?: string;
  estimatedTime?: number;
  order: number;
}

interface ChecklistTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  items: ChecklistItem[];
  usageCount: number;
  lastModified: string;
  createdBy: string;
  isDefault: boolean;
}

export function Checklists({ onNavigate }: ChecklistsProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [expandedSections, setExpandedSections] = useState<string[]>(['templates']);

  const templates: ChecklistTemplate[] = [
    {
      id: 'TPL-001',
      name: 'BAS Preparation',
      category: 'Compliance',
      description: 'Standard checklist for quarterly BAS preparation and lodgement',
      usageCount: 156,
      lastModified: '2024-02-15',
      createdBy: 'Sarah Johnson',
      isDefault: true,
      items: [
        { id: 'IT-001', text: 'Obtain bank statements for the quarter', required: true, assignee: 'Accountant', estimatedTime: 15, order: 1 },
        { id: 'IT-002', text: 'Reconcile bank accounts', required: true, assignee: 'Accountant', estimatedTime: 30, order: 2 },
        { id: 'IT-003', text: 'Review GST coding in accounting system', required: true, assignee: 'Accountant', estimatedTime: 45, order: 3 },
        { id: 'IT-004', text: 'Verify GST on sales', required: true, assignee: 'Accountant', estimatedTime: 30, order: 4 },
        { id: 'IT-005', text: 'Verify GST on purchases', required: true, assignee: 'Accountant', estimatedTime: 30, order: 5 },
        { id: 'IT-006', text: 'Calculate PAYG withholding', required: true, assignee: 'Accountant', estimatedTime: 20, order: 6 },
        { id: 'IT-007', text: 'Review prior period adjustments', required: false, assignee: 'Reviewer', estimatedTime: 15, order: 7 },
        { id: 'IT-008', text: 'Complete BAS worksheet', required: true, assignee: 'Accountant', estimatedTime: 30, order: 8 },
        { id: 'IT-009', text: 'Manager review', required: true, assignee: 'Manager', estimatedTime: 20, order: 9 },
        { id: 'IT-010', text: 'Lodge BAS via portal', required: true, assignee: 'Accountant', estimatedTime: 10, order: 10 }
      ]
    },
    {
      id: 'TPL-002',
      name: 'Year End Financial Statements',
      category: 'Tax',
      description: 'Complete checklist for preparing year end financial statements',
      usageCount: 89,
      lastModified: '2024-01-20',
      createdBy: 'Mike Brown',
      isDefault: true,
      items: [
        { id: 'IT-011', text: 'Trial balance prepared', required: true, assignee: 'Accountant', estimatedTime: 30, order: 1 },
        { id: 'IT-012', text: 'Bank reconciliation completed', required: true, assignee: 'Accountant', estimatedTime: 45, order: 2 },
        { id: 'IT-013', text: 'Stock take verification', required: true, assignee: 'Accountant', estimatedTime: 60, order: 3 },
        { id: 'IT-014', text: 'Debtors review and provisions', required: true, assignee: 'Accountant', estimatedTime: 45, order: 4 },
        { id: 'IT-015', text: 'Fixed assets register updated', required: true, assignee: 'Accountant', estimatedTime: 60, order: 5 },
        { id: 'IT-016', text: 'Prepayments and accruals', required: true, assignee: 'Accountant', estimatedTime: 30, order: 6 },
        { id: 'IT-017', text: 'Provisions and liabilities review', required: true, assignee: 'Manager', estimatedTime: 45, order: 7 },
        { id: 'IT-018', text: 'Director loan accounts', required: false, assignee: 'Manager', estimatedTime: 20, order: 8 },
        { id: 'IT-019', text: 'Related party transactions', required: false, assignee: 'Manager', estimatedTime: 30, order: 9 },
        { id: 'IT-020', text: 'Draft financial statements', required: true, assignee: 'Manager', estimatedTime: 90, order: 10 },
        { id: 'IT-021', text: 'Partner review', required: true, assignee: 'Partner', estimatedTime: 60, order: 11 }
      ]
    },
    {
      id: 'TPL-003',
      name: 'SMSF Annual Compliance',
      category: 'SMSF',
      description: 'Annual compliance checklist for Self-Managed Super Funds',
      usageCount: 67,
      lastModified: '2024-02-01',
      createdBy: 'Emily Davis',
      isDefault: true,
      items: [
        { id: 'IT-022', text: 'Obtain member statements', required: true, assignee: 'Accountant', estimatedTime: 20, order: 1 },
        { id: 'IT-023', text: 'Bank account reconciliation', required: true, assignee: 'Accountant', estimatedTime: 30, order: 2 },
        { id: 'IT-024', text: 'Investment portfolio verification', required: true, assignee: 'Accountant', estimatedTime: 45, order: 3 },
        { id: 'IT-025', text: 'Contribution limits check', required: true, assignee: 'Accountant', estimatedTime: 30, order: 4 },
        { id: 'IT-026', text: 'In-house asset rules compliance', required: true, assignee: 'Reviewer', estimatedTime: 20, order: 5 },
        { id: 'IT-027', text: 'Sole purpose test review', required: true, assignee: 'Reviewer', estimatedTime: 30, order: 6 },
        { id: 'IT-028', text: 'Related party transactions', required: true, assignee: 'Manager', estimatedTime: 30, order: 7 },
        { id: 'IT-029', text: 'Prepare financial statements', required: true, assignee: 'Accountant', estimatedTime: 90, order: 8 },
        { id: 'IT-030', text: 'Complete tax return', required: true, assignee: 'Accountant', estimatedTime: 60, order: 9 },
        { id: 'IT-031', text: 'Audit arrangement', required: true, assignee: 'Manager', estimatedTime: 15, order: 10 }
      ]
    },
    {
      id: 'TPL-004',
      name: 'New Client Onboarding',
      category: 'Onboarding',
      description: 'Standard process for onboarding new accounting clients',
      usageCount: 45,
      lastModified: '2024-01-15',
      createdBy: 'Tom Wilson',
      isDefault: false,
      items: [
        { id: 'IT-032', text: 'Engagement letter signed', required: true, assignee: 'Admin', estimatedTime: 10, order: 1 },
        { id: 'IT-033', text: 'ID verification completed', required: true, assignee: 'Admin', estimatedTime: 15, order: 2 },
        { id: 'IT-034', text: 'Setup client in practice management', required: true, assignee: 'Admin', estimatedTime: 20, order: 3 },
        { id: 'IT-035', text: 'Obtain prior year tax returns', required: true, assignee: 'Accountant', estimatedTime: 10, order: 4 },
        { id: 'IT-036', text: 'Setup accounting software access', required: false, assignee: 'Accountant', estimatedTime: 30, order: 5 },
        { id: 'IT-037', text: 'Initial meeting with client', required: true, assignee: 'Manager', estimatedTime: 60, order: 6 },
        { id: 'IT-038', text: 'Document requirements list', required: true, assignee: 'Accountant', estimatedTime: 20, order: 7 },
        { id: 'IT-039', text: 'Setup recurring calendar items', required: true, assignee: 'Admin', estimatedTime: 15, order: 8 }
      ]
    },
    {
      id: 'TPL-005',
      name: 'Monthly Bookkeeping',
      category: 'Bookkeeping',
      description: 'Monthly bookkeeping and reconciliation checklist',
      usageCount: 234,
      lastModified: '2024-02-10',
      createdBy: 'Sarah Johnson',
      isDefault: true,
      items: [
        { id: 'IT-040', text: 'Download bank statements', required: true, assignee: 'Bookkeeper', estimatedTime: 10, order: 1 },
        { id: 'IT-041', text: 'Import transactions', required: true, assignee: 'Bookkeeper', estimatedTime: 15, order: 2 },
        { id: 'IT-042', text: 'Categorize transactions', required: true, assignee: 'Bookkeeper', estimatedTime: 90, order: 3 },
        { id: 'IT-043', text: 'Bank reconciliation', required: true, assignee: 'Bookkeeper', estimatedTime: 30, order: 4 },
        { id: 'IT-044', text: 'Credit card reconciliation', required: true, assignee: 'Bookkeeper', estimatedTime: 20, order: 5 },
        { id: 'IT-045', text: 'Process payroll', required: false, assignee: 'Bookkeeper', estimatedTime: 45, order: 6 },
        { id: 'IT-046', text: 'Review outstanding debtors', required: true, assignee: 'Bookkeeper', estimatedTime: 20, order: 7 },
        { id: 'IT-047', text: 'Review creditors', required: true, assignee: 'Bookkeeper', estimatedTime: 15, order: 8 },
        { id: 'IT-048', text: 'Generate reports for client', required: true, assignee: 'Bookkeeper', estimatedTime: 15, order: 9 },
        { id: 'IT-049', text: 'Quality review', required: true, assignee: 'Reviewer', estimatedTime: 20, order: 10 }
      ]
    }
  ];

  const categories = ['all', 'Compliance', 'Tax', 'SMSF', 'Onboarding', 'Bookkeeping'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getTotalTime = (items: ChecklistItem[]) => {
    return items.reduce((sum, item) => sum + (item.estimatedTime || 0), 0);
  };

  const getRequiredCount = (items: ChecklistItem[]) => {
    return items.filter(item => item.required).length;
  };

  return (
    <WorkpaperLayout currentPage="checklists" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-gray-900">Checklists</h1>
            <p className="text-sm text-gray-600 mt-1">Create and manage standardized workflow checklists</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button className="bg-[#2855a6] hover:bg-[#1e4089]">
              <Plus className="w-4 h-4 mr-2" />
              New Checklist
            </Button>
          </div>
        </div>

        {/* Search & Filters */}
        <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search checklists..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
                  />
                </div>
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Templates List */}
          <div className="col-span-5 space-y-3">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all shadow-[0_4px_12px_rgba(0,0,0,0.06)] ${
                  selectedTemplate?.id === template.id
                    ? 'border-2 border-[#2855a6] bg-blue-50'
                    : 'hover:border-[#2855a6] hover:shadow-lg'
                }`}
                onClick={() => {
                  setSelectedTemplate(template);
                  setIsEditing(false);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        {template.isDefault && (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded border border-blue-200">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">{template.description}</p>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {template.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>{template.items.length} items</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{getTotalTime(template.items)} min</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-600">
                      <span>Used {template.usageCount} times</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Modified {template.lastModified}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredTemplates.length === 0 && (
              <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                <CardContent className="p-12 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No checklists found</p>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Checklist
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Template Detail */}
          <div className="col-span-7">
            {selectedTemplate ? (
              <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedTemplate.name}</h2>
                      <p className="text-sm text-gray-600 mt-1">{selectedTemplate.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                      <Button 
                        size="sm"
                        className="bg-[#2855a6] hover:bg-[#1e4089]"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {isEditing ? 'Save' : 'Edit'}
                      </Button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Total Items</p>
                      <p className="text-xl font-bold text-gray-900">{selectedTemplate.items.length}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Required</p>
                      <p className="text-xl font-bold text-gray-900">{getRequiredCount(selectedTemplate.items)}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Est. Time</p>
                      <p className="text-xl font-bold text-gray-900">{getTotalTime(selectedTemplate.items)} min</p>
                    </div>
                  </div>

                  {/* Checklist Items */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">Checklist Items</h3>
                      {isEditing && (
                        <Button size="sm" variant="outline">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Item
                        </Button>
                      )}
                    </div>

                    {selectedTemplate.items.map((item, idx) => (
                      <div
                        key={item.id}
                        className={`p-3 border rounded-lg ${
                          isEditing ? 'border-gray-300 hover:border-[#2855a6] cursor-move' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {isEditing && (
                            <GripVertical className="w-4 h-4 text-gray-400 mt-0.5 cursor-grab" />
                          )}
                          <div className="flex items-start gap-3 flex-1">
                            {item.required ? (
                              <CheckCircle className="w-5 h-5 text-[#2855a6] mt-0.5" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-300 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 mb-2">{item.text}</p>
                              <div className="flex items-center gap-3 text-xs text-gray-600">
                                {item.required && (
                                  <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded">
                                    Required
                                  </span>
                                )}
                                {item.assignee && (
                                  <div className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    <span>{item.assignee}</span>
                                  </div>
                                )}
                                {item.estimatedTime && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{item.estimatedTime} min</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {isEditing && (
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="ghost">
                                <Edit className="w-4 h-4 text-gray-600" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Metadata */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Created By</p>
                        <p className="font-medium text-gray-900">{selectedTemplate.createdBy}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Last Modified</p>
                        <p className="font-medium text-gray-900">{selectedTemplate.lastModified}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Category</p>
                        <p className="font-medium text-gray-900">{selectedTemplate.category}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Usage Count</p>
                        <p className="font-medium text-gray-900">{selectedTemplate.usageCount} times</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                <CardContent className="p-12 text-center">
                  <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Checklist</h3>
                  <p className="text-gray-600 mb-6">Choose a checklist from the left to view and edit details</p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Checklist
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </WorkpaperLayout>
  );
}
