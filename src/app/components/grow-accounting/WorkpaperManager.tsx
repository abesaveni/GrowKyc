import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  FolderOpen,
  FileSpreadsheet,
  FileText,
  CheckSquare,
  BookOpen,
  Image,
  FileEdit,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Target,
  TrendingUp,
  Brain,
  Zap,
  BarChart3,
  Settings
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';
import type { Binder, BinderSection, WorkpaperType, AnyWorkpaper, EntityType } from './workpaper-types';

interface WorkpaperManagerProps {
  onNavigate?: (page: string) => void;
}

export function WorkpaperManager({ onNavigate }: WorkpaperManagerProps) {
  const [selectedBinder, setSelectedBinder] = useState<string | null>('binder-001');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock binder data
  const binders: Binder[] = [
    {
      binder_id: 'binder-001',
      client_id: 'client-001',
      client_name: 'Acme Manufacturing Pty Ltd',
      entity_type: 'company',
      year: 'FY2024',
      status: 'in_progress',
      sections: [
        {
          section_id: 'sec-001',
          name: 'Trial Balance & Lead Schedules',
          order: 1,
          workpapers: [],
          auto_generated: true
        },
        {
          section_id: 'sec-002',
          name: 'Revenue',
          order: 2,
          workpapers: [],
          auto_generated: false
        },
        {
          section_id: 'sec-003',
          name: 'Division 7A',
          order: 3,
          workpapers: [],
          auto_generated: false
        }
      ],
      created_by: 'Sarah Chen',
      created_at: '2024-01-15',
      last_updated: '2024-02-14',
      locked: false
    }
  ];

  // Mock workpaper data for different types
  const workpapers: AnyWorkpaper[] = [
    {
      workpaper_id: 'wp-001',
      binder_id: 'binder-001',
      type: 'lead_schedule',
      section: 'Trial Balance & Lead Schedules',
      name: 'LS-01 Cash at Bank',
      preparer: 'Sarah Chen',
      reviewer: 'Michael Ross',
      status: 'approved',
      risk_score: 15,
      materiality: 'material',
      ai_flags: [],
      last_updated: '2024-02-12',
      version: 3,
      sealed: false,
      carry_forward_structure: true,
      carry_forward_balances: true,
      carry_forward_open_items: false,
      carry_forward_unadjusted: false,
      ai_confidence_score: 0.95,
      ai_reviewed: true,
      anomaly_flags: [],
      compliance_flags: [],
      account_ids: ['1100', '1110'],
      tb_balance: 247500,
      adjusted_balance: 247500,
      variance_prior_year: 58100,
      materiality_flag: true,
      risk_rating: 'low',
      sheet_id: 'sheet-001',
      tb_links: [],
      supporting_schedules: [],
      reconciliation_items: []
    },
    {
      workpaper_id: 'wp-002',
      binder_id: 'binder-001',
      type: 'grid',
      section: 'Revenue',
      name: 'Revenue Analysis & Reconciliation',
      preparer: 'David Kim',
      reviewer: 'Sarah Chen',
      status: 'in_review',
      risk_score: 45,
      materiality: 'material',
      ai_flags: ['Unusual variance detected', 'Review cut-off testing'],
      last_updated: '2024-02-13',
      version: 2,
      sealed: false,
      carry_forward_structure: true,
      carry_forward_balances: false,
      carry_forward_open_items: true,
      carry_forward_unadjusted: false,
      ai_confidence_score: 0.78,
      ai_reviewed: true,
      anomaly_flags: ['Q4 spike above threshold'],
      compliance_flags: [],
      sheet_id: 'sheet-002',
      named_ranges: [],
      tb_links: [],
      formula_cells: [],
      evidence_links: ['ev-001', 'ev-002'],
      review_notes: [],
      locked_ranges: []
    },
    {
      workpaper_id: 'wp-003',
      binder_id: 'binder-001',
      type: 'structured_form',
      section: 'Division 7A',
      name: 'Division 7A Loan Calculation',
      preparer: 'Emma Wilson',
      status: 'draft',
      risk_score: 65,
      materiality: 'material',
      ai_flags: ['Minimum interest rate check required'],
      last_updated: '2024-02-14',
      version: 1,
      sealed: false,
      carry_forward_structure: true,
      carry_forward_balances: true,
      carry_forward_open_items: true,
      carry_forward_unadjusted: false,
      ai_confidence_score: 0.82,
      ai_reviewed: false,
      anomaly_flags: [],
      compliance_flags: ['Benchmark rate verification needed'],
      form_schema: {
        title: 'Division 7A Loan Calculation',
        form_type: 'division_7a',
        sections: []
      },
      calculated_fields: [],
      required_fields: [],
      validation_rules: [],
      auto_calc_functions: [],
      export_map: [],
      form_data: {}
    },
    {
      workpaper_id: 'wp-004',
      binder_id: 'binder-001',
      type: 'checklist',
      section: 'Trial Balance & Lead Schedules',
      name: 'Year-End Completion Checklist',
      preparer: 'Sarah Chen',
      reviewer: 'Michael Ross',
      status: 'in_progress',
      risk_score: 20,
      materiality: 'normal',
      ai_flags: [],
      last_updated: '2024-02-14',
      version: 1,
      sealed: false,
      carry_forward_structure: true,
      carry_forward_balances: false,
      carry_forward_open_items: false,
      carry_forward_unadjusted: false,
      ai_confidence_score: 0.88,
      ai_reviewed: true,
      anomaly_flags: [],
      compliance_flags: [],
      checklist_items: [],
      signoff_required: true,
      manager_approval_gate: true
    },
    {
      workpaper_id: 'wp-005',
      binder_id: 'binder-001',
      type: 'journal_register',
      section: 'Trial Balance & Lead Schedules',
      name: 'Adjustment Journal Register',
      preparer: 'Sarah Chen',
      status: 'approved',
      risk_score: 35,
      materiality: 'material',
      ai_flags: [],
      last_updated: '2024-02-13',
      version: 2,
      sealed: true,
      carry_forward_structure: false,
      carry_forward_balances: false,
      carry_forward_open_items: false,
      carry_forward_unadjusted: true,
      ai_confidence_score: 0.92,
      ai_reviewed: true,
      anomaly_flags: [],
      compliance_flags: [],
      journals: [],
      auto_generate_summary: true
    },
    {
      workpaper_id: 'wp-006',
      binder_id: 'binder-001',
      type: 'evidence',
      section: 'Revenue',
      name: 'Revenue Evidence Repository',
      preparer: 'David Kim',
      status: 'in_progress',
      risk_score: 25,
      materiality: 'normal',
      ai_flags: [],
      last_updated: '2024-02-14',
      version: 1,
      sealed: false,
      carry_forward_structure: false,
      carry_forward_balances: false,
      carry_forward_open_items: false,
      carry_forward_unadjusted: false,
      ai_confidence_score: 0.85,
      ai_reviewed: true,
      anomaly_flags: [],
      compliance_flags: [],
      files: []
    },
    {
      workpaper_id: 'wp-007',
      binder_id: 'binder-001',
      type: 'narrative',
      section: 'Revenue',
      name: 'Revenue Recognition Policy Memo',
      preparer: 'Michael Ross',
      status: 'approved',
      risk_score: 30,
      materiality: 'normal',
      ai_flags: [],
      last_updated: '2024-02-10',
      version: 2,
      sealed: true,
      carry_forward_structure: true,
      carry_forward_balances: false,
      carry_forward_open_items: false,
      carry_forward_unadjusted: false,
      ai_confidence_score: 0.91,
      ai_reviewed: true,
      anomaly_flags: [],
      compliance_flags: [],
      narrative_type: 'policy_memo',
      rich_text_body: '',
      citations: [],
      linked_accounts: [],
      reviewer_comments: [],
      version_history: [],
      locked_on_signoff: true
    }
  ];

  const getWorkpaperIcon = (type: WorkpaperType) => {
    switch (type) {
      case 'grid':
        return FileSpreadsheet;
      case 'lead_schedule':
        return Target;
      case 'structured_form':
        return FileEdit;
      case 'checklist':
        return CheckSquare;
      case 'journal_register':
        return BookOpen;
      case 'evidence':
        return Image;
      case 'narrative':
        return FileText;
      default:
        return FileText;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded">DRAFT</span>;
      case 'in_progress':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">IN PROGRESS</span>;
      case 'in_review':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded">IN REVIEW</span>;
      case 'approved':
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">APPROVED</span>;
      case 'sealed':
        return <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded flex items-center gap-1">
          <Lock className="w-3 h-3" />
          SEALED
        </span>;
      default:
        return null;
    }
  };

  const getRiskBadge = (score: number) => {
    if (score >= 70) {
      return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">HIGH RISK</span>;
    } else if (score >= 40) {
      return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded">MED RISK</span>;
    } else {
      return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">LOW RISK</span>;
    }
  };

  const getMaterialityBadge = (materiality: string) => {
    switch (materiality) {
      case 'material':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">MATERIAL</span>;
      case 'normal':
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded">NORMAL</span>;
      case 'immaterial':
        return <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-xs font-semibold rounded">IMMATERIAL</span>;
      default:
        return null;
    }
  };

  const filteredWorkpapers = filterStatus === 'all' 
    ? workpapers 
    : workpapers.filter(wp => wp.status === filterStatus);

  const selectedBinderData = binders.find(b => b.binder_id === selectedBinder);

  return (
    <WorkpaperLayout currentPage="workpaper-manager" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FolderOpen className="w-8 h-8 text-blue-600" />
              Workpaper Manager
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Enterprise workpaper system • 7 workpaper types • Full audit trail
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Binder
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Workpaper
            </Button>
          </div>
        </div>

        {/* Binder Info Card */}
        {selectedBinderData && (
          <div className="bg-white border border-gray-300 rounded p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{selectedBinderData.client_name}</h2>
                  {getStatusBadge(selectedBinderData.status)}
                  {selectedBinderData.locked && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      LOCKED
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Entity Type:</span>
                    <div className="font-semibold text-gray-900 capitalize">{selectedBinderData.entity_type}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Year:</span>
                    <div className="font-semibold text-gray-900">{selectedBinderData.year}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Sections:</span>
                    <div className="font-semibold text-gray-900">{selectedBinderData.sections.length}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Workpapers:</span>
                    <div className="font-semibold text-gray-900">{workpapers.length}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Updated:</span>
                    <div className="font-semibold text-gray-900">{selectedBinderData.last_updated}</div>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Binder Settings
              </Button>
            </div>
          </div>
        )}

        {/* Workpaper Type Legend */}
        <div className="bg-blue-50 border border-blue-300 rounded p-4">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            7 Enterprise Workpaper Types
          </h3>
          <div className="grid grid-cols-7 gap-3">
            <div className="bg-white border border-blue-200 rounded p-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-600 mb-1" />
              <div className="text-xs font-semibold text-gray-900">Grid</div>
              <div className="text-xs text-gray-600">Spreadsheet</div>
            </div>
            <div className="bg-white border border-blue-200 rounded p-2">
              <Target className="w-5 h-5 text-green-600 mb-1" />
              <div className="text-xs font-semibold text-gray-900">Lead Schedule</div>
              <div className="text-xs text-gray-600">TB-Controlled</div>
            </div>
            <div className="bg-white border border-blue-200 rounded p-2">
              <FileEdit className="w-5 h-5 text-purple-600 mb-1" />
              <div className="text-xs font-semibold text-gray-900">Structured Form</div>
              <div className="text-xs text-gray-600">Div 7A, BAS, etc</div>
            </div>
            <div className="bg-white border border-blue-200 rounded p-2">
              <CheckSquare className="w-5 h-5 text-amber-600 mb-1" />
              <div className="text-xs font-semibold text-gray-900">Checklist</div>
              <div className="text-xs text-gray-600">Program</div>
            </div>
            <div className="bg-white border border-blue-200 rounded p-2">
              <BookOpen className="w-5 h-5 text-indigo-600 mb-1" />
              <div className="text-xs font-semibold text-gray-900">Journal Register</div>
              <div className="text-xs text-gray-600">Adjustments</div>
            </div>
            <div className="bg-white border border-blue-200 rounded p-2">
              <Image className="w-5 h-5 text-pink-600 mb-1" />
              <div className="text-xs font-semibold text-gray-900">Evidence</div>
              <div className="text-xs text-gray-600">Documents</div>
            </div>
            <div className="bg-white border border-blue-200 rounded p-2">
              <FileText className="w-5 h-5 text-teal-600 mb-1" />
              <div className="text-xs font-semibold text-gray-900">Narrative</div>
              <div className="text-xs text-gray-600">Memo</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search workpapers..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded text-sm w-80"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="approved">Approved</option>
              <option value="sealed">Sealed</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </div>
        </div>

        {/* Workpapers Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkpapers.map((wp) => {
              const Icon = getWorkpaperIcon(wp.type);
              return (
                <div
                  key={wp.workpaper_id}
                  className="bg-white border border-gray-300 rounded p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                    {getStatusBadge(wp.status)}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{wp.name}</h3>
                  <p className="text-xs text-gray-600 mb-3">{wp.section}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {getRiskBadge(wp.risk_score)}
                    {getMaterialityBadge(wp.materiality)}
                  </div>

                  {wp.ai_flags.length > 0 && (
                    <div className="bg-purple-50 border border-purple-200 rounded px-2 py-1 mb-3">
                      <div className="flex items-start gap-1">
                        <Brain className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-purple-800">{wp.ai_flags[0]}</span>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <User className="w-3 h-3" />
                      <span>Preparer: <strong>{wp.preparer}</strong></span>
                    </div>
                    {wp.reviewer && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle className="w-3 h-3" />
                        <span>Reviewer: <strong>{wp.reviewer}</strong></span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span>Updated: {wp.last_updated}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <TrendingUp className="w-3 h-3" />
                      <span>AI Confidence: {(wp.ai_confidence_score * 100).toFixed(0)}%</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        // Navigate based on workpaper type
                        if (wp.type === 'lead_schedule') {
                          onNavigate?.('lead-schedule-editor');
                        } else if (wp.type === 'structured_form') {
                          onNavigate?.('division-7a-form');
                        } else if (wp.type === 'checklist') {
                          onNavigate?.('checklist-workpaper');
                        } else if (wp.type === 'journal_register') {
                          onNavigate?.('journal-push-control');
                        } else if (wp.type === 'narrative') {
                          onNavigate?.('workpaper-detail');
                        } else if (wp.type === 'grid') {
                          onNavigate?.('workpaper-detail');
                        } else {
                          onNavigate?.('workpaper-detail');
                        }
                      }}
                    >
                      Open Workpaper
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Workpapers List View */}
        {viewMode === 'list' && (
          <div className="border border-gray-300 rounded bg-white overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Type</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Name</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Section</th>
                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">Status</th>
                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">Risk</th>
                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">Material</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Preparer</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Reviewer</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Last Updated</th>
                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkpapers.map((wp) => {
                  const Icon = getWorkpaperIcon(wp.type);
                  return (
                    <tr key={wp.workpaper_id} className="hover:bg-blue-50">
                      <td className="border border-gray-300 px-3 py-2">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-gray-900 font-medium">
                        {wp.name}
                        {wp.sealed && <Lock className="w-3 h-3 text-red-600 inline ml-2" />}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-gray-700 text-xs">
                        {wp.section}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        {getStatusBadge(wp.status)}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        {getRiskBadge(wp.risk_score)}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        {getMaterialityBadge(wp.materiality)}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-gray-700">
                        {wp.preparer}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-gray-700">
                        {wp.reviewer || '-'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-gray-700">
                        {wp.last_updated}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            // Navigate based on workpaper type
                            if (wp.type === 'lead_schedule') {
                              onNavigate?.('lead-schedule-editor');
                            } else if (wp.type === 'structured_form') {
                              onNavigate?.('division-7a-form');
                            } else if (wp.type === 'checklist') {
                              onNavigate?.('checklist-workpaper');
                            } else if (wp.type === 'journal_register') {
                              onNavigate?.('journal-push-control');
                            } else if (wp.type === 'narrative') {
                              onNavigate?.('workpaper-detail');
                            } else if (wp.type === 'grid') {
                              onNavigate?.('workpaper-detail');
                            } else {
                              onNavigate?.('workpaper-detail');
                            }
                          }}
                        >
                          Open
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </WorkpaperLayout>
  );
}