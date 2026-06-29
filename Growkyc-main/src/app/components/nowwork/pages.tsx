import React from 'react';
import { 
  Plus, Edit, Trash2, Search, Filter, Download, Eye, Clock, 
  DollarSign, Building2, FileText, CheckCircle, AlertCircle, 
  BarChart3, Activity, Target, Briefcase, Users, Upload
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from '../../lib/toast';

interface Job {
  id: string;
  client: string;
  service: string;
  status: string;
  budget: number;
  actual: number;
  hours: number;
  margin: number;
  due: string;
  risk: string;
}

export const renderJobs = (activeJobs: Job[], setCurrentPage: (page: string) => void) => (
  <div className="space-y-6">
    {/* Jobs Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button size="sm" variant="outline">
          <Filter className="w-4 h-4 mr-1" />
          Filter
        </Button>
        <Button size="sm" variant="outline">
          <Search className="w-4 h-4 mr-1" />
          Search
        </Button>
      </div>
      <Button onClick={() => toast.success('Create new job')}>
        <Plus className="w-4 h-4 mr-2" />
        New Job
      </Button>
    </div>

    {/* Jobs Grid */}
    <div className="grid grid-cols-1 gap-4">
      {activeJobs.map((job) => (
        <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => toast.info(`Opening ${job.id}...`)}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-lg font-bold text-gray-900">{job.id}</span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded ${
                    job.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    job.status === 'review' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {job.status.toUpperCase()}
                  </span>
                  {job.risk === 'high' && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      HIGH RISK
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{job.client}</h3>
                <p className="text-gray-600">{job.service}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Due Date</p>
                <p className="text-lg font-semibold text-gray-900">{job.due}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Budget</p>
                <p className="text-lg font-bold text-gray-900">${(job.budget / 1000).toFixed(0)}K</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Actual</p>
                <p className="text-lg font-bold text-gray-900">${(job.actual / 1000).toFixed(0)}K</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Hours</p>
                <p className="text-lg font-bold text-gray-900">{job.hours}h</p>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Margin</p>
                <p className="text-lg font-bold text-gray-900">{job.margin}%</p>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Budget Progress</span>
                <span className={job.actual > job.budget ? 'text-red-600 font-semibold' : 'text-gray-900'}>
                  {Math.round((job.actual / job.budget) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${job.actual > job.budget ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min((job.actual / job.budget) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); toast.info('View details'); }}>
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setCurrentPage('time-tracking'); }}>
                <Clock className="w-4 h-4 mr-1" />
                Log Time
              </Button>
              <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); toast.info('Edit job'); }}>
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export const renderClients = (
  selectedClient: string | null,
  viewMode: 'list' | 'view' | 'edit',
  setSelectedClient: (client: string | null) => void,
  setViewMode: (mode: 'list' | 'view' | 'edit') => void
) => {
  const clientsData = [
    { name: 'Acme Corp', activeJobs: 3, ytdRevenue: 145, avgMargin: 42, email: 'contact@acmecorp.com', phone: '+1 (555) 123-4567', address: '123 Business St, New York, NY 10001' },
    { name: 'TechStart Pty', activeJobs: 2, ytdRevenue: 98, avgMargin: 38, email: 'hello@techstart.com.au', phone: '+61 2 1234 5678', address: '456 Innovation Ave, Sydney NSW 2000' },
    { name: 'Property Group', activeJobs: 4, ytdRevenue: 187, avgMargin: 45, email: 'admin@propertygroup.com', phone: '+1 (555) 987-6543', address: '789 Real Estate Blvd, Los Angeles, CA 90001' },
    { name: 'Retail Ltd', activeJobs: 1, ytdRevenue: 67, avgMargin: 35, email: 'info@retailltd.com', phone: '+44 20 1234 5678', address: '321 Commerce Road, London, UK' },
    { name: 'Innovation Co', activeJobs: 5, ytdRevenue: 203, avgMargin: 48, email: 'team@innovationco.io', phone: '+1 (555) 456-7890', address: '654 Tech Park, San Francisco, CA 94102' },
    { name: 'Growth Partners', activeJobs: 2, ytdRevenue: 112, avgMargin: 40, email: 'contact@growthpartners.com', phone: '+1 (555) 234-5678', address: '987 Finance St, Chicago, IL 60601' }
  ];

  const currentClient = selectedClient ? clientsData.find(c => c.name === selectedClient) : null;

  // View Mode - Client Details
  if (viewMode === 'view' && currentClient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => { setViewMode('list'); setSelectedClient(null); }}>
            ← Back to Clients
          </Button>
          <Button onClick={() => setViewMode('edit')}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Client
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-100 rounded-lg">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">{currentClient.name}</CardTitle>
                <p className="text-gray-500">Active Client</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{currentClient.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{currentClient.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-900">{currentClient.address}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Active Jobs</p>
                    <p className="text-2xl font-bold text-gray-900">{currentClient.activeJobs}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">YTD Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${currentClient.ytdRevenue}K</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Average Margin</p>
                    <p className="text-2xl font-bold text-gray-900">{currentClient.avgMargin}%</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Job history for {currentClient.name} will appear here...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Edit Mode - Client Edit Form
  if (viewMode === 'edit' && currentClient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Edit Client</h2>
          <Button variant="outline" onClick={() => setViewMode('view')}>
            Cancel
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  defaultValue={currentClient.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={currentClient.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    defaultValue={currentClient.phone}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  rows={3}
                  defaultValue={currentClient.address}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    toast.success('Client updated successfully!');
                    setViewMode('view');
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setViewMode('view')}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // List Mode - Default Client Grid
  return (
    <div className="space-y-6">
      {/* Clients Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button size="sm" variant="outline">
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </Button>
        </div>
        <Button onClick={() => toast.success('Create new client')}>
          <Plus className="w-4 h-4 mr-2" />
          New Client
        </Button>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientsData.map((client, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
            setSelectedClient(client.name);
            setViewMode('view');
          }}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-500">Active Client</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Jobs</span>
                  <span className="text-sm font-semibold text-gray-900">{client.activeJobs}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">YTD Revenue</span>
                  <span className="text-sm font-semibold text-gray-900">${client.ytdRevenue}K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Margin</span>
                  <span className="text-sm font-semibold text-green-600">{client.avgMargin}%</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={(e) => { 
                  e.stopPropagation(); 
                  setSelectedClient(client.name);
                  setViewMode('view');
                }}>
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={(e) => { 
                  e.stopPropagation(); 
                  setSelectedClient(client.name);
                  setViewMode('edit');
                }}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const renderBilling = (activeJobs: Job[]) => (
  <div className="space-y-6">
    {/* Billing Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">WIP Balance</span>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">$324K</p>
          <p className="text-xs text-green-600 mt-1">↓ 8.2% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Outstanding</span>
            <DollarSign className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">$156K</p>
          <p className="text-xs text-gray-500 mt-1">Average 28 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">This Month</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">$847K</p>
          <p className="text-xs text-green-600 mt-1">↑ 12.4% vs last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Draft Invoices</span>
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">12</p>
          <p className="text-xs text-gray-500 mt-1">Ready to send</p>
        </CardContent>
      </Card>
    </div>

    {/* Ready to Bill */}
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Ready to Bill</CardTitle>
          <Button onClick={() => toast.success('Generate invoices')}>
            <Plus className="w-4 h-4 mr-2" />
            Generate Invoices
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Job</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Client</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Hours</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Margin</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activeJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono font-semibold text-gray-900">{job.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{job.client}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900">{job.hours}h</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">${job.actual.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      job.margin >= 40 ? 'bg-green-100 text-green-700' : 
                      job.margin >= 30 ? 'bg-amber-100 text-amber-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {job.margin}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button size="sm" variant="outline" onClick={() => toast.success('Invoice created')}>
                      Create Invoice
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

export const renderReports = () => (
  <div className="space-y-6">
    {/* Report Categories */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => toast.info('Opening Profitability Report')}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Profitability</h3>
              <p className="text-sm text-gray-500">Revenue & Margin Analysis</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Job profitability, client margins, service line performance</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => toast.info('Opening Productivity Report')}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Productivity</h3>
              <p className="text-sm text-gray-500">Time & Utilisation</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Staff utilisation, recovery rates, capacity planning</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => toast.info('Opening Financial Report')}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Financial</h3>
              <p className="text-sm text-gray-500">WIP & Debtors</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Work in progress, outstanding invoices, cash flow</p>
        </CardContent>
      </Card>
    </div>

    {/* Quick Reports */}
    <Card>
      <CardHeader>
        <CardTitle>Quick Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button variant="outline" className="justify-start h-auto py-3" onClick={() => toast.info('Generating report...')}>
            <FileText className="w-5 h-5 mr-3" />
            <div className="text-left">
              <p className="font-semibold">Revenue by Service</p>
              <p className="text-xs text-gray-500">YTD breakdown by service line</p>
            </div>
          </Button>

          <Button variant="outline" className="justify-start h-auto py-3" onClick={() => toast.info('Generating report...')}>
            <FileText className="w-5 h-5 mr-3" />
            <div className="text-left">
              <p className="font-semibold">Client Profitability</p>
              <p className="text-xs text-gray-500">Ranked by gross margin</p>
            </div>
          </Button>

          <Button variant="outline" className="justify-start h-auto py-3" onClick={() => toast.info('Generating report...')}>
            <FileText className="w-5 h-5 mr-3" />
            <div className="text-left">
              <p className="font-semibold">Staff Performance</p>
              <p className="text-xs text-gray-500">Utilisation and recovery rates</p>
            </div>
          </Button>

          <Button variant="outline" className="justify-start h-auto py-3" onClick={() => toast.info('Generating report...')}>
            <FileText className="w-5 h-5 mr-3" />
            <div className="text-left">
              <p className="font-semibold">WIP Aging</p>
              <p className="text-xs text-gray-500">Unbilled time by age</p>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>

    {/* Custom Report Builder */}
    <Card>
      <CardHeader>
        <CardTitle>Custom Report Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Revenue Analysis</option>
                <option>Time Analysis</option>
                <option>Client Analysis</option>
                <option>Staff Analysis</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>This Month</option>
                <option>Last Month</option>
                <option>This Quarter</option>
                <option>This Year</option>
                <option>Custom Range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
            </div>
          </div>
          <Button className="w-full" onClick={() => toast.success('Report generated!')}>
            <Download className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

export const renderContracts = (showCreateForm: boolean, setShowCreateForm: (show: boolean) => void) => {
  const contracts = [
    { id: 'CON-2024-012', client: 'Acme Corp', service: 'Annual Audit', type: 'Fixed Fee', value: 45000, status: 'active', startDate: '2024-01-15', endDate: '2024-06-30', signed: true },
    { id: 'CON-2024-011', client: 'TechStart Pty', service: 'Tax Advisory', type: 'Hourly', value: 12000, status: 'active', startDate: '2024-02-01', endDate: '2024-12-31', signed: true },
    { id: 'CON-2024-010', client: 'Property Group', service: 'CFO Services', type: 'Retainer', value: 8000, status: 'pending', startDate: '2024-03-01', endDate: '2025-02-28', signed: false },
    { id: 'CON-2024-009', client: 'Retail Ltd', service: 'Compliance Review', type: 'Fixed Fee', value: 18000, status: 'active', startDate: '2024-01-10', endDate: '2024-04-30', signed: true },
    { id: 'CON-2024-008', client: 'Innovation Co', service: 'Strategic Advisory', type: 'Milestone', value: 35000, status: 'draft', startDate: '2024-04-01', endDate: '2024-09-30', signed: false },
  ];

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Create New Contract</h2>
          <Button variant="outline" onClick={() => setShowCreateForm(false)}>
            Cancel
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contract Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Select client...</option>
                    <option>Acme Corp</option>
                    <option>TechStart Pty</option>
                    <option>Property Group</option>
                    <option>Retail Ltd</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                  <input
                    type="text"
                    placeholder="e.g. Annual Audit"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contract Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Fixed Fee</option>
                    <option>Hourly</option>
                    <option>Retainer</option>
                    <option>Milestone</option>
                    <option>Subscription</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contract Value</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>USD</option>
                    <option>AUD</option>
                    <option>GBP</option>
                    <option>EUR</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Scope of Work</label>
                <textarea
                  rows={4}
                  placeholder="Describe the scope of work..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
                <textarea
                  rows={4}
                  placeholder="Enter contract terms and conditions..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    toast.success('Contract created successfully!');
                    setShowCreateForm(false);
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Create Contract
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => {
                  toast.info('Saved as draft');
                  setShowCreateForm(false);
                }}>
                  Save as Draft
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Active Contracts</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{contracts.filter(c => c.status === 'active').length}</p>
            <p className="text-xs text-gray-500 mt-1">{contracts.filter(c => c.signed).length} signed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Value</span>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">${(contracts.reduce((sum, c) => sum + c.value, 0) / 1000).toFixed(0)}K</p>
            <p className="text-xs text-gray-500 mt-1">Active contracts</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Pending</span>
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{contracts.filter(c => c.status === 'pending').length}</p>
            <p className="text-xs text-gray-500 mt-1">Awaiting signature</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Drafts</span>
              <FileText className="w-5 h-5 text-gray-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{contracts.filter(c => c.status === 'draft').length}</p>
            <p className="text-xs text-gray-500 mt-1">In progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Contracts List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Contracts</CardTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Filter className="w-4 h-4 mr-1" />
                Filter
              </Button>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Contract
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contract ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Value</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Period</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono font-semibold text-gray-900">{contract.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{contract.client}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{contract.service}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{contract.type}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">${contract.value.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        contract.status === 'active' ? 'bg-green-100 text-green-700' :
                        contract.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {contract.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">
                      {contract.startDate} to {contract.endDate}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => toast.info('View contract')}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {!contract.signed && (
                          <Button size="sm" variant="ghost" onClick={() => toast.success('Sent for e-signature')}>
                            <FileText className="w-4 h-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => toast.info('Edit contract')}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const renderDocuments = () => {
  const [uploadedFiles, setUploadedFiles] = React.useState([
    { id: 1, name: 'Annual_Audit_Report_2024.pdf', size: '2.4 MB', client: 'Acme Corp', job: 'JOB-2024-047', uploadedBy: 'Sarah Chen', uploadedDate: '2024-02-10', type: 'pdf' },
    { id: 2, name: 'Tax_Return_Documents.xlsx', size: '1.2 MB', client: 'TechStart Pty', job: 'JOB-2024-046', uploadedBy: 'James Wilson', uploadedDate: '2024-02-09', type: 'xlsx' },
    { id: 3, name: 'Financial_Statements_Q1.pdf', size: '3.1 MB', client: 'Property Group', job: 'JOB-2024-045', uploadedBy: 'Emma Thompson', uploadedDate: '2024-02-08', type: 'pdf' },
    { id: 4, name: 'Client_Contract_Signed.docx', size: '456 KB', client: 'Retail Ltd', job: 'JOB-2024-044', uploadedBy: 'Michael Brown', uploadedDate: '2024-02-07', type: 'docx' },
    { id: 5, name: 'Meeting_Notes_Jan.pdf', size: '890 KB', client: 'Acme Corp', job: 'JOB-2024-047', uploadedBy: 'Sarah Chen', uploadedDate: '2024-02-05', type: 'pdf' }
  ]);

  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [selectedClient, setSelectedClient] = React.useState('');
  const [selectedJob, setSelectedJob] = React.useState('');

  const getFileIcon = (type: string) => {
    switch(type) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-600" />;
      case 'xlsx':
      case 'xls':
        return <FileText className="w-8 h-8 text-green-600" />;
      case 'docx':
      case 'doc':
        return <FileText className="w-8 h-8 text-blue-600" />;
      default:
        return <FileText className="w-8 h-8 text-gray-600" />;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const newFile = {
        id: uploadedFiles.length + 1,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        client: selectedClient || 'Acme Corp',
        job: selectedJob || 'JOB-2024-047',
        uploadedBy: 'Michael Carter',
        uploadedDate: new Date().toISOString().split('T')[0],
        type: file.name.split('.').pop() || 'file'
      };
      setUploadedFiles([newFile, ...uploadedFiles]);
      setShowUploadModal(false);
      toast.success(`${file.name} uploaded successfully!`);
    }
  };

  const handleDelete = (id: number) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
    toast.success('Document deleted successfully');
  };

  if (showUploadModal) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Upload Document</h2>
          <Button variant="outline" onClick={() => setShowUploadModal(false)}>
            Cancel
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Document Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                  >
                    <option value="">Select client...</option>
                    <option value="Acme Corp">Acme Corp</option>
                    <option value="TechStart Pty">TechStart Pty</option>
                    <option value="Property Group">Property Group</option>
                    <option value="Retail Ltd">Retail Ltd</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job (Optional)</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                  >
                    <option value="">Select job...</option>
                    <option value="JOB-2024-047">JOB-2024-047 - Annual Audit</option>
                    <option value="JOB-2024-046">JOB-2024-046 - Tax Return</option>
                    <option value="JOB-2024-045">JOB-2024-045 - Advisory</option>
                    <option value="JOB-2024-044">JOB-2024-044 - Compliance</option>
                  </select>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drop files here or click to browse</p>
                <p className="text-sm text-gray-500 mb-4">Support for PDF, Word, Excel, and image files</p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                />
                <label htmlFor="file-upload">
                  <Button asChild>
                    <span className="cursor-pointer">
                      <Plus className="w-4 h-4 mr-2" />
                      Choose File
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Documents</span>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{uploadedFiles.length}</p>
            <p className="text-xs text-gray-500 mt-1">Across all jobs</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Storage Used</span>
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">8.1 MB</p>
            <p className="text-xs text-gray-500 mt-1">of 100 GB</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">This Month</span>
              <Plus className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">12</p>
            <p className="text-xs text-gray-500 mt-1">New uploads</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Clients</span>
              <Building2 className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">4</p>
            <p className="text-xs text-gray-500 mt-1">With documents</p>
          </CardContent>
        </Card>
      </div>

      {/* Documents Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button size="sm" variant="outline">
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </Button>
        </div>
        <Button onClick={() => setShowUploadModal(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>All Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{file.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {file.client}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {file.job}
                      </span>
                      <span>{file.size}</span>
                      <span>Uploaded by {file.uploadedBy}</span>
                      <span>{file.uploadedDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => toast.info('Viewing document...')}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => toast.success('Downloading document...')}>
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDelete(file.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
              <Upload className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Sarah Chen uploaded Annual_Audit_Report_2024.pdf</p>
                <p className="text-xs text-gray-500">2 hours ago • Acme Corp</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border-l-4 border-green-500 bg-green-50 rounded">
              <Download className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">James Wilson downloaded Tax_Return_Documents.xlsx</p>
                <p className="text-xs text-gray-500">5 hours ago • TechStart Pty</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border-l-4 border-purple-500 bg-purple-50 rounded">
              <Upload className="w-5 h-5 text-purple-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Emma Thompson uploaded Financial_Statements_Q1.pdf</p>
                <p className="text-xs text-gray-500">1 day ago • Property Group</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const renderSettings = () => (
  <div className="space-y-6">
    <Card>
      <CardContent className="p-12 text-center">
        <Activity className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">System Settings</h2>
        <p className="text-gray-600">Configure rates, workflows, permissions and integrations</p>
      </CardContent>
    </Card>
  </div>
);