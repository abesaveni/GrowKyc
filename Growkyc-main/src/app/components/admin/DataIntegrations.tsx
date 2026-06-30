import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Globe,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Activity,
  Database,
  Download,
  Settings,
  Eye,
  Calendar,
  Clock,
  Zap,
  Shield,
  FileText,
  Building2,
  Users,
  XCircle,
  Upload
} from 'lucide-react';
import { SanctionsUploadModal } from './SanctionsUploadModal';

interface DataSource {
  id: string;
  name: string;
  provider: string;
  category: 'sanctions' | 'entity' | 'licensing' | 'banned' | 'enrichment';
  status: 'active' | 'syncing' | 'error' | 'disabled';
  lastSync: string;
  nextSync: string;
  recordCount: number;
  apiEndpoint: string;
  updateFrequency: 'realtime' | 'daily' | 'weekly' | 'monthly';
  costTier: 'free' | 'paid';
  description: string;
}

interface DataIntegrationsProps {
  onBack: () => void;
}

export function DataIntegrations({ onBack }: DataIntegrationsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSanctionsUpload, setShowSanctionsUpload] = useState(false);

  const dataSources: DataSource[] = [
    {
      id: 'dfat-sanctions',
      name: 'DFAT Consolidated Sanctions List',
      provider: 'Department of Foreign Affairs and Trade',
      category: 'sanctions',
      status: 'active',
      lastSync: '2026-03-20 08:30',
      nextSync: '2026-03-21 08:30',
      recordCount: 2847,
      apiEndpoint: 'https://www.dfat.gov.au/international-relations/security/sanctions/consolidated-list',
      updateFrequency: 'daily',
      costTier: 'free',
      description: 'Australian sanctions against persons and entities under UN, autonomous and thematic sanctions regimes'
    },
    {
      id: 'abn-lookup',
      name: 'ABN Lookup API',
      provider: 'Australian Business Register',
      category: 'entity',
      status: 'active',
      lastSync: '2026-03-20 14:22',
      nextSync: 'Realtime',
      recordCount: 0, // API-based, no local storage
      apiEndpoint: 'https://abr.business.gov.au/abrxmlsearch/AbrXmlSearch.asmx',
      updateFrequency: 'realtime',
      costTier: 'free',
      description: 'Realtime ABN validation and entity name lookup'
    },
    {
      id: 'abn-bulk',
      name: 'ABN Bulk Extract',
      provider: 'Australian Business Register',
      category: 'entity',
      status: 'active',
      lastSync: '2026-03-17 02:00',
      nextSync: '2026-03-24 02:00',
      recordCount: 9847235,
      apiEndpoint: 'https://data.gov.au/data/dataset/abn-bulk-extract',
      updateFrequency: 'weekly',
      costTier: 'free',
      description: 'Complete ABN register for bulk entity verification (9.8M+ records)'
    },
    {
      id: 'asic-companies',
      name: 'ASIC Companies Dataset',
      provider: 'Australian Securities & Investments Commission',
      category: 'entity',
      status: 'active',
      lastSync: '2026-03-15 03:00',
      nextSync: '2026-04-01 03:00',
      recordCount: 3456789,
      apiEndpoint: 'https://data.gov.au/data/dataset/asic-companies',
      updateFrequency: 'monthly',
      costTier: 'free',
      description: 'All registered companies in Australia with ACN, directors, status'
    },
    {
      id: 'asic-business-names',
      name: 'ASIC Business Names Dataset',
      provider: 'Australian Securities & Investments Commission',
      category: 'entity',
      status: 'active',
      lastSync: '2026-03-15 04:00',
      nextSync: '2026-04-01 04:00',
      recordCount: 2134567,
      apiEndpoint: 'https://data.gov.au/data/dataset/asic-business-names',
      updateFrequency: 'monthly',
      costTier: 'free',
      description: 'All registered business names linked to ABN holders'
    },
    {
      id: 'asic-afs-licensees',
      name: 'ASIC AFS Licensee Dataset',
      provider: 'Australian Securities & Investments Commission',
      category: 'licensing',
      status: 'active',
      lastSync: '2026-03-18 05:00',
      nextSync: '2026-03-25 05:00',
      recordCount: 4523,
      apiEndpoint: 'https://download.asic.gov.au/media/3340825/afs-licensees.csv',
      updateFrequency: 'weekly',
      costTier: 'free',
      description: 'All Australian Financial Services (AFS) license holders'
    },
    {
      id: 'asic-credit-licensees',
      name: 'ASIC Credit Licensee Dataset',
      provider: 'Australian Securities & Investments Commission',
      category: 'licensing',
      status: 'active',
      lastSync: '2026-03-18 06:00',
      nextSync: '2026-03-25 06:00',
      recordCount: 12847,
      apiEndpoint: 'https://download.asic.gov.au/media/3340826/credit-licensees.csv',
      updateFrequency: 'weekly',
      costTier: 'free',
      description: 'All Australian Credit License (ACL) holders'
    },
    {
      id: 'asic-financial-advisers',
      name: 'ASIC Financial Advisers Dataset',
      provider: 'Australian Securities & Investments Commission',
      category: 'licensing',
      status: 'active',
      lastSync: '2026-03-18 07:00',
      nextSync: '2026-03-25 07:00',
      recordCount: 19234,
      apiEndpoint: 'https://download.asic.gov.au/media/3340827/financial-advisers.csv',
      updateFrequency: 'weekly',
      costTier: 'free',
      description: 'All registered financial advisers under AFSL licenses'
    },
    {
      id: 'asic-banned',
      name: 'ASIC Banned & Disqualified Register',
      provider: 'Australian Securities & Investments Commission',
      category: 'banned',
      status: 'active',
      lastSync: '2026-03-19 08:00',
      nextSync: '2026-03-26 08:00',
      recordCount: 1847,
      apiEndpoint: 'https://download.asic.gov.au/media/3340828/banned-disqualified.csv',
      updateFrequency: 'weekly',
      costTier: 'free',
      description: 'Banned and disqualified persons and organizations'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Data Sources', count: dataSources.length, icon: Globe },
    { id: 'sanctions', name: 'Sanctions Lists', count: dataSources.filter(d => d.category === 'sanctions').length, icon: Shield },
    { id: 'entity', name: 'Entity Validation', count: dataSources.filter(d => d.category === 'entity').length, icon: Building2 },
    { id: 'licensing', name: 'Licensing Checks', count: dataSources.filter(d => d.category === 'licensing').length, icon: FileText },
    { id: 'banned', name: 'Banned/Disqualified', count: dataSources.filter(d => d.category === 'banned').length, icon: XCircle }
  ];

  const filteredSources = selectedCategory === 'all'
    ? dataSources
    : dataSources.filter(d => d.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600 text-white';
      case 'syncing': return 'bg-blue-600 text-white';
      case 'error': return 'bg-red-600 text-white';
      case 'disabled': return 'bg-gray-600 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const stats = {
    totalSources: dataSources.length,
    activeSources: dataSources.filter(d => d.status === 'active').length,
    totalRecords: dataSources.reduce((sum, d) => sum + d.recordCount, 0),
    apiCallsToday: 45238,
    lastFullSync: '2026-03-20 08:30'
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white px-8 py-12">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-white hover:bg-white/20 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin
        </Button>

        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
            <Globe className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2">Government Data Integrations</h1>
            <p className="text-white/90 text-xl">Free Australian baseline • 9 data sources • Real-time sync</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Data Sources</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.totalSources}</div>
            <div className="text-xs text-white/70">{stats.activeSources} active</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Total Records</div>
            </div>
            <div className="text-3xl font-bold mb-1">{(stats.totalRecords / 1000000).toFixed(1)}M</div>
            <div className="text-xs text-white/70">Across all sources</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">API Calls Today</div>
            </div>
            <div className="text-4xl font-bold mb-1">{(stats.apiCallsToday / 1000).toFixed(1)}K</div>
            <div className="text-xs text-white/70">To gov't APIs</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">System Health</div>
            </div>
            <div className="text-4xl font-bold mb-1">100%</div>
            <div className="text-xs text-white/70">All sources operational</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Last Full Sync</div>
            </div>
            <div className="text-lg font-bold mb-1">Today</div>
            <div className="text-xs text-white/70">{stats.lastFullSync}</div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Category Filter */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                <CategoryIcon className="w-4 h-4 mr-2" />
                {category.name}
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </Button>
            );
          })}
        </div>

        {/* Admin Actions */}
        <div className="mb-8 p-6 bg-gray-50 border-2 border-purple-300 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">SaaS Admin Controls</h3>
              <p className="text-gray-700">Upload and manage sanctions lists for all organizations</p>
            </div>
            <Button
              onClick={() => setShowSanctionsUpload(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg px-6 py-6 text-lg"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Monthly Sanctions List
            </Button>
          </div>
        </div>

        {/* Data Sources */}
        <div className="space-y-6">
          {filteredSources.map((source) => (
            <Card key={source.id} className="border-2 border-gray-200 hover:border-blue-300 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Database className="w-8 h-8 text-blue-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">{source.name}</h3>
                        <Badge className={getStatusColor(source.status)}>
                          {source.status}
                        </Badge>
                        <Badge className="bg-green-600 text-white">
                          {source.costTier === 'free' ? 'FREE' : 'PAID'}
                        </Badge>
                      </div>

                      <div className="text-sm text-gray-600 mb-4">{source.provider}</div>

                      <p className="text-gray-700 mb-4">{source.description}</p>

                      <div className="grid grid-cols-4 gap-6 mb-4">
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Records</div>
                          <div className="font-bold text-gray-900">
                            {source.recordCount === 0 ? 'Realtime API' : source.recordCount.toLocaleString()}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-600 mb-1">Update Frequency</div>
                          <div className="font-bold text-gray-900 capitalize">{source.updateFrequency}</div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-600 mb-1">Last Sync</div>
                          <div className="font-bold text-gray-900">{source.lastSync}</div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-600 mb-1">Next Sync</div>
                          <div className="font-bold text-gray-900">{source.nextSync}</div>
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-xs text-gray-600 mb-1">API Endpoint</div>
                        <div className="font-mono text-sm text-gray-900">{source.apiEndpoint}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-6">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sync Now
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Data
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Integration Benefits */}
        <Card className="mt-12 bg-gray-50 border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              What These Integrations Give You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Sanctions Screening:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    UN, autonomous & thematic sanctions (DFAT)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Auto-screen all clients against 2,847+ sanctioned entities
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Daily updates ensure fresh data
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-3">Entity Validation:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Realtime ABN validation (ABN Lookup API)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    9.8M+ ABN records for bulk verification
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    3.4M+ company records with ACN, directors, status
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    2.1M+ business name registrations
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-3">Licensing Checks:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    4,523 AFS license holders (AFSL)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    12,847 credit license holders (ACL)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    19,234 registered financial advisers
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Auto-validate adviser credentials
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-3">Banned/Disqualified:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    1,847 banned & disqualified persons/orgs
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Prevent engagement with disqualified directors
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Weekly updates from ASIC
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sync Schedule */}
        <Card className="mt-8 bg-gray-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Automated Sync Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-bold text-gray-900">Realtime</div>
                    <div className="text-sm text-gray-600">ABN Lookup API (on-demand validation)</div>
                  </div>
                </div>
                <Badge className="bg-blue-600 text-white">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-bold text-gray-900">Daily at 8:30 AM</div>
                    <div className="text-sm text-gray-600">DFAT Sanctions List</div>
                  </div>
                </div>
                <Badge className="bg-green-600 text-white">Complete</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-bold text-gray-900">Weekly (Sundays at 2:00 AM)</div>
                    <div className="text-sm text-gray-600">ABN Bulk Extract, ASIC AFS/ACL/Advisers/Banned datasets</div>
                  </div>
                </div>
                <Badge className="bg-green-600 text-white">Scheduled</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-bold text-gray-900">Monthly (1st of month at 3:00 AM)</div>
                    <div className="text-sm text-gray-600">ASIC Companies & Business Names datasets</div>
                  </div>
                </div>
                <Badge className="bg-green-600 text-white">Scheduled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sanctions Upload Modal */}
      <SanctionsUploadModal
        isOpen={showSanctionsUpload}
        onClose={() => setShowSanctionsUpload(false)}
      />
    </div>
  );
}