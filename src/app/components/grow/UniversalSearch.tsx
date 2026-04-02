import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  FileText,
  Users,
  Briefcase,
  FolderOpen,
  DollarSign,
  CheckSquare,
  Calendar,
  AlertTriangle,
  Shield,
  Brain,
  TrendingUp,
  MessageSquare,
  Lightbulb,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Filter,
  Clock
} from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../onboarding/DesignSystem';
import { toast } from 'sonner';

interface SearchResult {
  id: string;
  type: 'person' | 'organisation' | 'project' | 'task' | 'document' | 'invoice' | 'meeting' | 'policy' | 'risk' | 'lead';
  title: string;
  subtitle?: string;
  description?: string;
  matchedField?: string;
  matchedText?: string;
  relevanceScore: number;
  lastModified: Date;
  url: string;
  metadata?: Record<string, any>;
}

interface AIExplanation {
  summary: string;
  keyPoints: string[];
  nextActions: string[];
  risks: string[];
  sources: { title: string; type: string; excerpt: string }[];
}

export function UniversalSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [explanation, setExplanation] = useState<AIExplanation | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  const entityTypes = [
    { type: 'person', label: 'People', icon: Users, count: 1247 },
    { type: 'organisation', label: 'Organisations', icon: Briefcase, count: 856 },
    { type: 'project', label: 'Projects', icon: FolderOpen, count: 432 },
    { type: 'task', label: 'Tasks', icon: CheckSquare, count: 3421 },
    { type: 'document', label: 'Documents', icon: FileText, count: 8765 },
    { type: 'invoice', label: 'Invoices', icon: DollarSign, count: 2341 },
    { type: 'meeting', label: 'Meetings', icon: Calendar, count: 567 },
    { type: 'policy', label: 'Policies', icon: Shield, count: 89 },
    { type: 'risk', label: 'Risks', icon: AlertTriangle, count: 156 },
    { type: 'lead', label: 'Leads', icon: TrendingUp, count: 234 }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    // Simulate universal search across all entities
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'organisation',
          title: 'Acme Pty Ltd',
          subtitle: 'High Value Client',
          description: 'Manufacturing company specializing in industrial equipment',
          matchedField: 'name',
          matchedText: 'Acme',
          relevanceScore: 0.95,
          lastModified: new Date('2024-02-15'),
          url: '/organisations/1',
          metadata: { revenue: '$450,000', status: 'active' }
        },
        {
          id: '2',
          type: 'project',
          title: 'Annual Tax Compliance - Acme Pty Ltd',
          subtitle: 'Active • Due Mar 31',
          description: 'FY2024 tax return preparation and lodgment',
          matchedField: 'organisation',
          matchedText: 'Acme',
          relevanceScore: 0.92,
          lastModified: new Date('2024-02-18'),
          url: '/projects/2',
          metadata: { status: 'in-progress', budget: '$12,000' }
        },
        {
          id: '3',
          type: 'document',
          title: 'Engagement Letter - Acme Pty Ltd 2024',
          subtitle: 'Signed • v2.1',
          description: 'Annual engagement letter for tax and advisory services',
          matchedField: 'content',
          matchedText: 'Acme Pty Ltd professional services agreement',
          relevanceScore: 0.89,
          lastModified: new Date('2024-01-10'),
          url: '/documents/3',
          metadata: { signedDate: '2024-01-12', type: 'contract' }
        },
        {
          id: '4',
          type: 'invoice',
          title: 'INV-2024-001234',
          subtitle: 'Paid • $4,500',
          description: 'January advisory services for Acme Pty Ltd',
          matchedField: 'organisation',
          matchedText: 'Acme',
          relevanceScore: 0.87,
          lastModified: new Date('2024-01-31'),
          url: '/invoices/4',
          metadata: { amount: '$4,500', status: 'paid' }
        },
        {
          id: '5',
          type: 'meeting',
          title: 'Quarterly Business Review - Acme',
          subtitle: 'Completed • Feb 10',
          description: 'Q4 2023 review with CFO and operations manager',
          matchedField: 'title',
          matchedText: 'Acme',
          relevanceScore: 0.85,
          lastModified: new Date('2024-02-10'),
          url: '/meetings/5',
          metadata: { attendees: 4, decisions: 3, actions: 7 }
        },
        {
          id: '6',
          type: 'task',
          title: 'Prepare Division 7A loan documentation',
          subtitle: 'In Progress • Due Mar 1',
          description: 'Update loan agreements for Acme directors',
          matchedField: 'description',
          matchedText: 'Acme directors loan agreements',
          relevanceScore: 0.82,
          lastModified: new Date('2024-02-16'),
          url: '/tasks/6',
          metadata: { assignee: 'Sarah Johnson', priority: 'high' }
        }
      ];

      setSearchResults(mockResults);
      setIsSearching(false);
    }, 800);
  };

  const handleExplain = async (result: SearchResult) => {
    setSelectedResult(result);
    setIsExplaining(true);

    // Simulate AI explanation
    setTimeout(() => {
      const mockExplanation: AIExplanation = {
        summary: `Acme Pty Ltd is a high-value manufacturing client with annual revenue of $450,000. They've been a client since 2019 and receive tax compliance, advisory, and Division 7A services. Their current engagement is active with several in-progress tasks.`,
        keyPoints: [
          'Annual revenue: $450,000 from tax and advisory services',
          'Engagement letter signed for FY2024 on January 12, 2024',
          'Current project: Annual Tax Compliance (due March 31)',
          '4 active tasks including Division 7A loan documentation',
          'Last quarterly review held February 10 with 3 decisions and 7 action items',
          'All invoices paid on time - strong payment history'
        ],
        nextActions: [
          'Complete Division 7A loan documentation by March 1 (assigned to Sarah Johnson)',
          'Prepare tax return working papers',
          'Schedule March meeting to review draft tax return',
          'Follow up on action items from February quarterly review',
          'Prepare FY2025 engagement letter (June deadline)'
        ],
        risks: [
          '⚠️ Division 7A deadline approaching - ensure compliance by June 30',
          '⚠️ Tax return lodgment due March 31 - track progress',
          'ℹ️ Health score: 95/100 - client relationship is strong',
          'ℹ️ No overdue invoices or outstanding compliance issues'
        ],
        sources: [
          {
            title: 'Client Record: Acme Pty Ltd',
            type: 'Organisation',
            excerpt: 'High-value manufacturing client, established 2019, annual revenue $450K...'
          },
          {
            title: 'Project: Annual Tax Compliance FY2024',
            type: 'Project',
            excerpt: 'Tax return preparation in progress, 4 tasks, budget $12,000...'
          },
          {
            title: 'Meeting: Quarterly Business Review',
            type: 'Meeting',
            excerpt: 'February 10 review with CFO, 3 decisions made, 7 action items assigned...'
          }
        ]
      };

      setExplanation(mockExplanation);
      setIsExplaining(false);
    }, 1200);
  };

  const getIcon = (type: string) => {
    const iconMap: Record<string, any> = {
      person: Users,
      organisation: Briefcase,
      project: FolderOpen,
      task: CheckSquare,
      document: FileText,
      invoice: DollarSign,
      meeting: Calendar,
      policy: Shield,
      risk: AlertTriangle,
      lead: TrendingUp
    };
    return iconMap[type] || FileText;
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-8">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-10 h-10" />
          <div>
            <h1 className="text-3xl font-bold">Universal Search & AI</h1>
            <p className="text-purple-100">Search across all data with AI-powered insights</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search people, organisations, projects, documents, invoices, meetings..."
              className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
            {isSearching && (
              <div className="absolute right-4 top-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600" />
              </div>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="px-8 py-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            AI Search
          </button>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {entityTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedFilters.includes(type.type);
            return (
              <button
                key={type.type}
                onClick={() => {
                  if (isSelected) {
                    setSelectedFilters(selectedFilters.filter(t => t !== type.type));
                  } else {
                    setSelectedFilters([...selectedFilters, type.type]);
                  }
                }}
                className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-2 ${
                  isSelected
                    ? 'bg-white text-purple-600'
                    : 'bg-purple-700 text-white hover:bg-purple-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {type.label}
                <span className="text-xs opacity-75">({type.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Results List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Found {searchResults.length} results for "{searchQuery}"
              </h2>
              <div className="flex gap-2">
                <SecondaryButton onClick={() => toast.info('Export results')}>
                  <Copy className="w-4 h-4 mr-2" />
                  Export
                </SecondaryButton>
                <SecondaryButton onClick={() => toast.info('Advanced filters')}>
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </SecondaryButton>
              </div>
            </div>

            {searchResults.map((result) => {
              const Icon = getIcon(result.type);
              return (
                <div
                  key={result.id}
                  className={`bg-white border-2 rounded-lg p-6 hover:border-blue-300 cursor-pointer transition-all ${
                    selectedResult?.id === result.id ? 'border-blue-500 shadow-lg' : 'border-gray-200'
                  }`}
                  onClick={() => handleExplain(result)}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Icon className="w-6 h-6 text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg mb-1">{result.title}</h3>
                          {result.subtitle && (
                            <p className="text-sm text-gray-600">{result.subtitle}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded">
                            {Math.round(result.relevanceScore * 100)}% match
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExplain(result);
                            }}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            Explain
                          </button>
                        </div>
                      </div>
                      {result.description && (
                        <p className="text-sm text-gray-700 mb-3">{result.description}</p>
                      )}
                      {result.matchedText && (
                        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm mb-3">
                          <span className="font-semibold text-gray-700">Matched in {result.matchedField}:</span>
                          <span className="text-gray-600 ml-2">...{result.matchedText}...</span>
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {result.lastModified.toLocaleDateString()}
                        </span>
                        {result.metadata && Object.entries(result.metadata).map(([key, value]) => (
                          <span key={key}>
                            <span className="font-semibold">{key}:</span> {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Explanation Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 sticky top-6">
              {!selectedResult && !isExplaining && (
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Click on any result to get AI-powered insights</p>
                </div>
              )}

              {isExplaining && (
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-pulse" />
                  <p className="text-gray-700 font-semibold">AI is analyzing...</p>
                  <p className="text-sm text-gray-600 mt-2">Gathering context from related records</p>
                </div>
              )}

              {explanation && selectedResult && !isExplaining && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      AI Explanation
                    </h3>
                    <button className="text-blue-600 hover:text-blue-700 text-sm">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Summary */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 uppercase mb-2">Summary</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{explanation.summary}</p>
                  </div>

                  {/* Key Points */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 uppercase mb-2">Key Points</h4>
                    <ul className="space-y-2">
                      {explanation.keyPoints.map((point, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex gap-2">
                          <span className="text-blue-600">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Next Actions */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 uppercase mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-orange-600" />
                      Next Best Actions
                    </h4>
                    <ul className="space-y-2">
                      {explanation.nextActions.map((action, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex gap-2">
                          <span className="text-green-600">→</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Risks */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 uppercase mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      Risks & Alerts
                    </h4>
                    <ul className="space-y-2">
                      {explanation.risks.map((risk, idx) => (
                        <li key={idx} className="text-sm text-gray-700">
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sources */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 uppercase mb-2">Sources</h4>
                    <div className="space-y-2">
                      {explanation.sources.map((source, idx) => (
                        <div key={idx} className="p-2 bg-gray-50 border border-gray-200 rounded text-xs">
                          <p className="font-semibold text-gray-900">{source.title}</p>
                          <p className="text-gray-600 mt-1">{source.excerpt}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-2">Was this explanation helpful?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toast.success('Thank you for your feedback!')}
                        className="flex-1 px-3 py-2 bg-green-50 text-green-700 rounded hover:bg-green-100 flex items-center justify-center gap-2"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">Yes</span>
                      </button>
                      <button
                        onClick={() => toast.info('We\'ll improve our explanations')}
                        className="flex-1 px-3 py-2 bg-red-50 text-red-700 rounded hover:bg-red-100 flex items-center justify-center gap-2"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span className="text-sm">No</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {searchResults.length === 0 && searchQuery && !isSearching && (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-12 text-center">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600 mb-6">Try different keywords or remove some filters</p>
          <SecondaryButton onClick={() => setSearchQuery('')}>
            Clear Search
          </SecondaryButton>
        </div>
      )}

      {/* Quick AI Actions */}
      {!searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Draft Email',
              description: 'Let AI draft professional client emails',
              icon: MessageSquare,
              color: 'blue'
            },
            {
              title: 'Generate Report',
              description: 'Create reports from templates with AI',
              icon: FileText,
              color: 'green'
            },
            {
              title: 'Find Risks',
              description: 'AI scans for anomalies and missing docs',
              icon: AlertTriangle,
              color: 'red'
            },
            {
              title: 'Next Actions',
              description: 'Get AI recommendations for any record',
              icon: Lightbulb,
              color: 'orange'
            }
          ].map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={() => toast.info(`${action.title} coming soon`)}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-gray-300 text-left transition-all"
              >
                <Icon className={`w-8 h-8 text-${action.color}-600 mb-3`} />
                <h3 className="font-bold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
