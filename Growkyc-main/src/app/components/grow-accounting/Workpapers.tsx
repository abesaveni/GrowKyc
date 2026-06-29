import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Download,
  Copy,
  Edit,
  Trash2,
  MoreVertical,
  TrendingUp,
  Clock,
  CheckCircle,
  Target,
  Zap
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface WorkpaperTemplate {
  id: string;
  name: string;
  category: string;
  entityTypes: string[];
  description: string;
  timesUsed: number;
  avgCompletionTime: string;
  aiEnabled: boolean;
  accuracy: number;
  status: 'active' | 'draft' | 'archived';
  lastUpdated: string;
}

interface WorkpapersProps {
  onNavigate?: (page: string, templateId?: string) => void;
}

const mockTemplates: WorkpaperTemplate[] = [
  // BAS & GST
  {
    id: 'WP-001',
    name: 'BAS Reconciliation',
    category: 'BAS & GST',
    entityTypes: ['Company', 'Trust', 'Partnership', 'Individual'],
    description: 'Quarterly BAS reconciliation with GST calculations',
    timesUsed: 245,
    avgCompletionTime: '45 min',
    aiEnabled: true,
    accuracy: 96,
    status: 'active',
    lastUpdated: '2024-02-15'
  },
  {
    id: 'WP-002',
    name: 'IAS Reconciliation',
    category: 'BAS & GST',
    entityTypes: ['Company', 'Trust', 'Partnership'],
    description: 'Instalment Activity Statement reconciliation',
    timesUsed: 187,
    avgCompletionTime: '30 min',
    aiEnabled: true,
    accuracy: 94,
    status: 'active',
    lastUpdated: '2024-02-10'
  },
  {
    id: 'WP-003',
    name: 'GST Input Tax Credit Reconciliation',
    category: 'BAS & GST',
    entityTypes: ['Company', 'Trust', 'Partnership'],
    description: 'Detailed GST input tax credit analysis',
    timesUsed: 156,
    avgCompletionTime: '1.5 hrs',
    aiEnabled: true,
    accuracy: 92,
    status: 'active',
    lastUpdated: '2024-01-28'
  },

  // FBT
  {
    id: 'WP-004',
    name: 'FBT Car Pack',
    category: 'Fringe Benefits Tax',
    entityTypes: ['Company'],
    description: 'Motor vehicle fringe benefits calculation (up to 10 vehicles)',
    timesUsed: 134,
    avgCompletionTime: '2 hrs',
    aiEnabled: true,
    accuracy: 95,
    status: 'active',
    lastUpdated: '2024-02-20'
  },
  {
    id: 'WP-005',
    name: 'FBT Loan Pack',
    category: 'Fringe Benefits Tax',
    entityTypes: ['Company'],
    description: 'Fringe benefits for employee loans',
    timesUsed: 89,
    avgCompletionTime: '1 hr',
    aiEnabled: true,
    accuracy: 93,
    status: 'active',
    lastUpdated: '2024-02-18'
  },
  {
    id: 'WP-006',
    name: 'FBT Property Pack',
    category: 'Fringe Benefits Tax',
    entityTypes: ['Company'],
    description: 'Housing and property fringe benefits',
    timesUsed: 67,
    avgCompletionTime: '1.5 hrs',
    aiEnabled: true,
    accuracy: 91,
    status: 'active',
    lastUpdated: '2024-02-12'
  },
  {
    id: 'WP-007',
    name: 'FBT Meal Entertainment',
    category: 'Fringe Benefits Tax',
    entityTypes: ['Company'],
    description: 'Meal and entertainment fringe benefits',
    timesUsed: 112,
    avgCompletionTime: '45 min',
    aiEnabled: true,
    accuracy: 94,
    status: 'active',
    lastUpdated: '2024-02-08'
  },

  // SMSF
  {
    id: 'WP-008',
    name: 'SMSF Bank Reconciliation',
    category: 'SMSF',
    entityTypes: ['SMSF'],
    description: 'Monthly bank reconciliation for SMSF',
    timesUsed: 298,
    avgCompletionTime: '30 min',
    aiEnabled: true,
    accuracy: 98,
    status: 'active',
    lastUpdated: '2024-02-22'
  },
  {
    id: 'WP-009',
    name: 'SMSF NCC Test',
    category: 'SMSF',
    entityTypes: ['SMSF'],
    description: 'Non-concessional contributions cap test',
    timesUsed: 276,
    avgCompletionTime: '20 min',
    aiEnabled: true,
    accuracy: 97,
    status: 'active',
    lastUpdated: '2024-02-20'
  },
  {
    id: 'WP-010',
    name: 'SMSF Member Statement',
    category: 'SMSF',
    entityTypes: ['SMSF'],
    description: 'Annual member benefit statement',
    timesUsed: 264,
    avgCompletionTime: '1 hr',
    aiEnabled: true,
    accuracy: 96,
    status: 'active',
    lastUpdated: '2024-02-15'
  },
  {
    id: 'WP-011',
    name: 'SMSF Tax Estimate',
    category: 'SMSF',
    entityTypes: ['SMSF'],
    description: 'Tax liability estimate and provision',
    timesUsed: 243,
    avgCompletionTime: '45 min',
    aiEnabled: true,
    accuracy: 95,
    status: 'active',
    lastUpdated: '2024-02-10'
  },

  // Payroll
  {
    id: 'WP-012',
    name: 'STP Reconciliation',
    category: 'Payroll & Super',
    entityTypes: ['Company', 'Partnership'],
    description: 'Single Touch Payroll reconciliation',
    timesUsed: 312,
    avgCompletionTime: '1 hr',
    aiEnabled: true,
    accuracy: 94,
    status: 'active',
    lastUpdated: '2024-02-25'
  },
  {
    id: 'WP-013',
    name: 'Super Guarantee Compliance',
    category: 'Payroll & Super',
    entityTypes: ['Company', 'Partnership', 'Trust'],
    description: 'SGC quarterly review and compliance',
    timesUsed: 287,
    avgCompletionTime: '50 min',
    aiEnabled: true,
    accuracy: 96,
    status: 'active',
    lastUpdated: '2024-02-20'
  },
  {
    id: 'WP-014',
    name: 'Payroll Tax - Monthly',
    category: 'Payroll & Super',
    entityTypes: ['Company'],
    description: 'Monthly payroll tax calculation',
    timesUsed: 198,
    avgCompletionTime: '30 min',
    aiEnabled: true,
    accuracy: 93,
    status: 'active',
    lastUpdated: '2024-02-18'
  },

  // Bookkeeping
  {
    id: 'WP-015',
    name: 'Monthly Bookkeeping Review',
    category: 'Bookkeeping',
    entityTypes: ['Company', 'Trust', 'Partnership'],
    description: 'Comprehensive monthly bookkeeping workpaper',
    timesUsed: 421,
    avgCompletionTime: '1.5 hrs',
    aiEnabled: true,
    accuracy: 92,
    status: 'active',
    lastUpdated: '2024-02-28'
  },
  {
    id: 'WP-016',
    name: 'Bank Reconciliation',
    category: 'Bookkeeping',
    entityTypes: ['Company', 'Trust', 'Partnership', 'Individual'],
    description: 'Monthly bank account reconciliation',
    timesUsed: 534,
    avgCompletionTime: '25 min',
    aiEnabled: true,
    accuracy: 97,
    status: 'active',
    lastUpdated: '2024-03-01'
  },

  // Year-End
  {
    id: 'WP-017',
    name: 'Year-End Checklist',
    category: 'Year-End',
    entityTypes: ['Company', 'Trust', 'Partnership', 'Individual'],
    description: 'Comprehensive year-end compliance checklist',
    timesUsed: 156,
    avgCompletionTime: '2 hrs',
    aiEnabled: true,
    accuracy: 91,
    status: 'active',
    lastUpdated: '2024-02-15'
  },
  {
    id: 'WP-018',
    name: 'Final Summary Report',
    category: 'Year-End',
    entityTypes: ['Company', 'Trust', 'Partnership', 'Individual'],
    description: 'Client-ready final tax summary report',
    timesUsed: 189,
    avgCompletionTime: '1 hr',
    aiEnabled: true,
    accuracy: 94,
    status: 'active',
    lastUpdated: '2024-02-20'
  },

  // Div 7A
  {
    id: 'WP-019',
    name: 'Division 7A Loan Analysis',
    category: 'Tax Compliance',
    entityTypes: ['Company'],
    description: 'Division 7A loan and distribution analysis',
    timesUsed: 142,
    avgCompletionTime: '1.5 hrs',
    aiEnabled: true,
    accuracy: 95,
    status: 'active',
    lastUpdated: '2024-02-10'
  }
];

const categories = [
  'All Categories',
  'BAS & GST',
  'Fringe Benefits Tax',
  'SMSF',
  'Payroll & Super',
  'Bookkeeping',
  'Year-End',
  'Tax Compliance'
];

export function Workpapers({ onNavigate }: WorkpapersProps) {
  const [templates, setTemplates] = useState(mockTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All Categories');
  const [filterEntity, setFilterEntity] = useState<string>('all');

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All Categories' || template.category === filterCategory;
    const matchesEntity = filterEntity === 'all' || template.entityTypes.includes(filterEntity);
    return matchesSearch && matchesCategory && matchesEntity;
  });

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'BAS & GST': 'bg-blue-50 text-blue-700 border-blue-200',
      'Fringe Benefits Tax': 'bg-purple-50 text-purple-700 border-purple-200',
      'SMSF': 'bg-green-50 text-green-700 border-green-200',
      'Payroll & Super': 'bg-orange-50 text-orange-700 border-orange-200',
      'Bookkeeping': 'bg-pink-50 text-pink-700 border-pink-200',
      'Year-End': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'Tax Compliance': 'bg-red-50 text-red-700 border-red-200'
    };
    return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <WorkpaperLayout currentPage="workpapers" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-gray-900">Workpaper Templates</h1>
            <p className="text-sm text-gray-600 mt-1">Manage and customize your workpaper library</p>
          </div>
          <Button 
            className="bg-[#2855a6] hover:bg-[#1e4089]"
            onClick={() => onNavigate?.('workpaper-new')}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Templates</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredTemplates.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Usage</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredTemplates.reduce((sum, t) => sum + t.timesUsed, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">AI Enabled</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredTemplates.filter(t => t.aiEnabled).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Target className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Accuracy</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(filteredTemplates.reduce((sum, t) => sum + t.accuracy, 0) / filteredTemplates.length)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
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
                    placeholder="Search templates by name or description..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Entity Filter */}
              <select
                value={filterEntity}
                onChange={(e) => setFilterEntity(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
              >
                <option value="all">All Entity Types</option>
                <option value="Company">Company</option>
                <option value="Trust">Trust</option>
                <option value="Partnership">Partnership</option>
                <option value="SMSF">SMSF</option>
                <option value="Individual">Individual</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="cursor-pointer hover:shadow-lg transition-all shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
              onClick={() => onNavigate?.('workpaper-detail', template.id)}
            >
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-xs text-gray-500 font-mono">{template.id}</p>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Category Badge */}
                <div className="mb-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {template.description}
                </p>

                {/* Entity Types */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.entityTypes.map((type, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {type}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Times Used</p>
                    <p className="text-lg font-bold text-blue-600">{template.timesUsed}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Avg Time</p>
                    <p className="text-lg font-bold text-orange-600">{template.avgCompletionTime}</p>
                  </div>
                </div>

                {/* AI & Accuracy */}
                <div className="flex items-center justify-between">
                  {template.aiEnabled && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 rounded">
                      <Zap className="w-3 h-3 text-purple-600" />
                      <span className="text-xs text-purple-700 font-semibold">AI Enabled</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-700 font-semibold">{template.accuracy}% accuracy</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Updated {template.lastUpdated}</span>
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded" title="Copy">
                      <Copy className="w-3 h-3 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                      <Edit className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
              <Button variant="outline">Clear Filters</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </WorkpaperLayout>
  );
}