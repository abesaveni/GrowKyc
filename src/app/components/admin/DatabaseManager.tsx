import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Database,
  Upload,
  Download,
  RefreshCw,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  FileText,
  Clock,
  HardDrive,
  TrendingUp
} from 'lucide-react';

interface DataTable {
  name: string;
  records: number;
  size: number; // MB
  lastUpdated: string;
  category: 'gov_data' | 'client_data' | 'system';
  updateFrequency: string;
}

interface DatabaseManagerProps {
  onBack: () => void;
}

export function DatabaseManager({ onBack }: DatabaseManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const tables: DataTable[] = [
    {
      name: 'dfat_sanctions_list',
      records: 2847,
      size: 12.3,
      lastUpdated: '2026-03-20 08:30',
      category: 'gov_data',
      updateFrequency: 'Daily'
    },
    {
      name: 'abn_bulk_extract',
      records: 9847235,
      size: 4523.8,
      lastUpdated: '2026-03-17 02:00',
      category: 'gov_data',
      updateFrequency: 'Weekly'
    },
    {
      name: 'asic_companies',
      records: 3456789,
      size: 1892.4,
      lastUpdated: '2026-03-15 03:00',
      category: 'gov_data',
      updateFrequency: 'Monthly'
    },
    {
      name: 'asic_business_names',
      records: 2134567,
      size: 987.2,
      lastUpdated: '2026-03-15 04:00',
      category: 'gov_data',
      updateFrequency: 'Monthly'
    },
    {
      name: 'asic_afs_licensees',
      records: 4523,
      size: 2.1,
      lastUpdated: '2026-03-18 05:00',
      category: 'gov_data',
      updateFrequency: 'Weekly'
    },
    {
      name: 'asic_credit_licensees',
      records: 12847,
      size: 5.8,
      lastUpdated: '2026-03-18 06:00',
      category: 'gov_data',
      updateFrequency: 'Weekly'
    },
    {
      name: 'asic_financial_advisers',
      records: 19234,
      size: 8.9,
      lastUpdated: '2026-03-18 07:00',
      category: 'gov_data',
      updateFrequency: 'Weekly'
    },
    {
      name: 'asic_banned_disqualified',
      records: 1847,
      size: 1.2,
      lastUpdated: '2026-03-19 08:00',
      category: 'gov_data',
      updateFrequency: 'Weekly'
    },
    {
      name: 'organizations',
      records: 147,
      size: 0.8,
      lastUpdated: '2026-03-20 14:22',
      category: 'client_data',
      updateFrequency: 'Realtime'
    },
    {
      name: 'users',
      records: 1842,
      size: 3.2,
      lastUpdated: '2026-03-20 14:22',
      category: 'client_data',
      updateFrequency: 'Realtime'
    },
    {
      name: 'clients_screened',
      records: 8934,
      size: 45.6,
      lastUpdated: '2026-03-20 14:20',
      category: 'client_data',
      updateFrequency: 'Realtime'
    },
    {
      name: 'screening_results',
      records: 34892,
      size: 189.3,
      lastUpdated: '2026-03-20 14:20',
      category: 'client_data',
      updateFrequency: 'Realtime'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Tables', count: tables.length },
    { id: 'gov_data', name: 'Government Data', count: tables.filter(t => t.category === 'gov_data').length },
    { id: 'client_data', name: 'Client Data', count: tables.filter(t => t.category === 'client_data').length }
  ];

  const filteredTables = selectedCategory === 'all'
    ? tables
    : tables.filter(t => t.category === selectedCategory);

  const stats = {
    totalTables: tables.length,
    totalRecords: tables.reduce((sum, t) => sum + t.records, 0),
    totalSize: tables.reduce((sum, t) => sum + t.size, 0),
    govDataSize: tables.filter(t => t.category === 'gov_data').reduce((sum, t) => sum + t.size, 0),
    clientDataSize: tables.filter(t => t.category === 'client_data').reduce((sum, t) => sum + t.size, 0)
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white px-8 py-12">
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
            <Database className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2">Database Manager</h1>
            <p className="text-white/90 text-xl">Bulk uploads • Data refresh • Storage management</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Total Tables</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.totalTables}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Total Records</div>
            </div>
            <div className="text-3xl font-bold mb-1">{(stats.totalRecords / 1000000).toFixed(1)}M</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Total Size</div>
            </div>
            <div className="text-3xl font-bold mb-1">{(stats.totalSize / 1000).toFixed(1)} GB</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Gov Data</div>
            </div>
            <div className="text-3xl font-bold mb-1">{(stats.govDataSize / 1000).toFixed(1)} GB</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Client Data</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.clientDataSize.toFixed(1)} MB</div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Bulk Upload */}
        <Card className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              Bulk Data Upload
            </CardTitle>
            <CardDescription>Upload CSV files from government data sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-6 bg-white rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-500 cursor-pointer transition-all">
                <Upload className="w-8 h-8 text-blue-600 mb-3" />
                <h4 className="font-bold text-gray-900 mb-1">DFAT Sanctions</h4>
                <p className="text-sm text-gray-600 mb-3">Upload CSV/XML from DFAT</p>
                <Button size="sm" className="w-full">
                  Select File
                </Button>
              </div>

              <div className="p-6 bg-white rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-500 cursor-pointer transition-all">
                <Upload className="w-8 h-8 text-blue-600 mb-3" />
                <h4 className="font-bold text-gray-900 mb-1">ABN Bulk Extract</h4>
                <p className="text-sm text-gray-600 mb-3">Upload ZIP from data.gov.au</p>
                <Button size="sm" className="w-full">
                  Select File
                </Button>
              </div>

              <div className="p-6 bg-white rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-500 cursor-pointer transition-all">
                <Upload className="w-8 h-8 text-blue-600 mb-3" />
                <h4 className="font-bold text-gray-900 mb-1">ASIC Datasets</h4>
                <p className="text-sm text-gray-600 mb-3">Upload CSV from ASIC</p>
                <Button size="sm" className="w-full">
                  Select File
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="flex items-center gap-3 mb-6">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
              <Badge variant="secondary" className="ml-2">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Tables */}
        <div className="space-y-4">
          {filteredTables.map((table) => (
            <Card key={table.name} className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center">
                      <Database className="w-6 h-6 text-purple-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-mono font-bold text-gray-900 text-lg">{table.name}</h3>
                        <Badge className={table.category === 'gov_data' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}>
                          {table.category === 'gov_data' ? 'Government' : 'Client'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-4 gap-6">
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Records</div>
                          <div className="font-bold text-gray-900">{table.records.toLocaleString()}</div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-600 mb-1">Size</div>
                          <div className="font-bold text-gray-900">
                            {table.size > 1000 ? `${(table.size / 1000).toFixed(1)} GB` : `${table.size.toFixed(1)} MB`}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-600 mb-1">Last Updated</div>
                          <div className="font-bold text-gray-900">{table.lastUpdated}</div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-600 mb-1">Update Frequency</div>
                          <div className="font-bold text-gray-900">{table.updateFrequency}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-6">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    {table.category === 'gov_data' && (
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Automated Refresh Schedule */}
        <Card className="mt-12 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              Automated Refresh Jobs
            </CardTitle>
            <CardDescription>Scheduled data updates from government sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'DFAT Sanctions Daily Refresh', schedule: 'Daily at 8:30 AM', nextRun: '2026-03-21 08:30', status: 'scheduled' },
                { name: 'ABN Bulk Extract Weekly Refresh', schedule: 'Sundays at 2:00 AM', nextRun: '2026-03-24 02:00', status: 'scheduled' },
                { name: 'ASIC Datasets Weekly Refresh', schedule: 'Sundays at 5:00 AM', nextRun: '2026-03-24 05:00', status: 'scheduled' },
                { name: 'ASIC Companies Monthly Refresh', schedule: '1st of month at 3:00 AM', nextRun: '2026-04-01 03:00', status: 'scheduled' }
              ].map((job, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200">
                  <div className="flex items-center gap-4">
                    <RefreshCw className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-bold text-gray-900">{job.name}</div>
                      <div className="text-sm text-gray-600">{job.schedule} • Next: {job.nextRun}</div>
                    </div>
                  </div>
                  <Badge className="bg-green-600 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {job.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="mt-8 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible actions - use with caution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200">
                <div>
                  <div className="font-bold text-gray-900">Clear All Government Data</div>
                  <div className="text-sm text-gray-600">Removes all DFAT, ABN, ASIC datasets (can be re-synced)</div>
                </div>
                <Button variant="outline" className="text-red-600 hover:text-red-700 border-red-300">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Gov Data
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200">
                <div>
                  <div className="font-bold text-gray-900">Database Backup</div>
                  <div className="text-sm text-gray-600">Create full database backup before major changes</div>
                </div>
                <Button variant="outline" className="border-blue-300">
                  <Download className="w-4 h-4 mr-2" />
                  Create Backup
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
