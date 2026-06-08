import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  ArrowLeft,
  Code,
  Key,
  Zap,
  Book,
  Activity,
  CheckCircle,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Settings,
  TrendingUp,
  Shield,
  Globe,
  Database,
  FileText,
  Terminal
} from 'lucide-react';

interface APIPlatformProps {
  onBack: () => void;
}

export function APIPlatform({ onBack }: APIPlatformProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'keys' | 'docs' | 'analytics'>('overview');
  const [showKey1, setShowKey1] = useState(false);
  const [showKey2, setShowKey2] = useState(false);

  const apiKeys = [
    {
      id: 'key_prod_xK8mP2nQ4vL9',
      name: 'Production API Key',
      environment: 'production',
      created: '2026-01-15',
      lastUsed: '2026-03-20 14:30',
      calls30d: 45238,
      status: 'active'
    },
    {
      id: 'key_test_aB7cD3eF6gH2',
      name: 'Test API Key',
      environment: 'test',
      created: '2026-02-01',
      lastUsed: '2026-03-20 11:15',
      calls30d: 8934,
      status: 'active'
    }
  ];

  const endpoints = [
    {
      method: 'POST',
      path: '/api/v1/screening/sanctions',
      description: 'Screen individual or entity against sanctions lists',
      rateLimit: '100 req/min',
      calls24h: 12847
    },
    {
      method: 'GET',
      path: '/api/v1/entity/abn-lookup',
      description: 'Lookup ABN details in real-time',
      rateLimit: '50 req/min',
      calls24h: 9234
    },
    {
      method: 'POST',
      path: '/api/v1/clients/create',
      description: 'Create new client with KYC data',
      rateLimit: '100 req/min',
      calls24h: 3421
    },
    {
      method: 'GET',
      path: '/api/v1/clients/{id}/risk-score',
      description: 'Get ML-powered risk score for client',
      rateLimit: '200 req/min',
      calls24h: 5892
    },
    {
      method: 'POST',
      path: '/api/v1/documents/upload',
      description: 'Upload KYC documents with OCR',
      rateLimit: '50 req/min',
      calls24h: 2134
    },
    {
      method: 'GET',
      path: '/api/v1/compliance/reports',
      description: 'Generate compliance reports',
      rateLimit: '20 req/min',
      calls24h: 892
    }
  ];

  const stats = {
    totalCalls30d: 54172,
    avgResponseTime: 124,
    successRate: 99.97,
    activeIntegrations: 12
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-12">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-white hover:bg-white/20 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
            <Code className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2">API Platform v1.0</h1>
            <p className="text-white/90 text-xl">RESTful API • Webhooks • Real-time integrations</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-6 h-6 text-white" />
              <div className="text-sm text-white/80">API Calls (30d)</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.totalCalls30d.toLocaleString()}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Activity className="w-6 h-6 text-white" />
              <div className="text-sm text-white/80">Avg Response</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.avgResponseTime}ms</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-6 h-6 text-white" />
              <div className="text-sm text-white/80">Success Rate</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.successRate}%</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-6 h-6 text-white" />
              <div className="text-sm text-white/80">Integrations</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.activeIntegrations}</div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex items-center gap-3 mb-8">
          <Button
            variant={selectedTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('overview')}
          >
            <Code className="w-4 h-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={selectedTab === 'keys' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('keys')}
          >
            <Key className="w-4 h-4 mr-2" />
            API Keys
          </Button>
          <Button
            variant={selectedTab === 'docs' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('docs')}
          >
            <Book className="w-4 h-4 mr-2" />
            Documentation
          </Button>
          <Button
            variant={selectedTab === 'analytics' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('analytics')}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </div>

        {/* API Keys Tab */}
        {selectedTab === 'keys' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your API Keys</CardTitle>
                <CardDescription>Manage your production and test API keys</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiKeys.map((key, idx) => (
                    <div key={key.id} className="p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-gray-900">{key.name}</h3>
                            <Badge className={key.environment === 'production' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}>
                              {key.environment}
                            </Badge>
                            <Badge className="bg-green-600 text-white">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {key.status}
                            </Badge>
                          </div>
                          
                          <div className="font-mono text-sm bg-white px-4 py-3 rounded border border-gray-300 flex items-center gap-3 mb-3">
                            <span className="flex-1">
                              {idx === 0 ? (showKey1 ? key.id : '••••••••••••••••••••') : (showKey2 ? key.id : '••••••••••••••••••••')}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => idx === 0 ? setShowKey1(!showKey1) : setShowKey2(!showKey2)}
                            >
                              {(idx === 0 ? showKey1 : showKey2) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="text-gray-600 mb-1">Created</div>
                              <div className="font-semibold text-gray-900">{key.created}</div>
                            </div>
                            <div>
                              <div className="text-gray-600 mb-1">Last Used</div>
                              <div className="font-semibold text-gray-900">{key.lastUsed}</div>
                            </div>
                            <div>
                              <div className="text-gray-600 mb-1">Calls (30 days)</div>
                              <div className="font-semibold text-gray-900">{key.calls30d.toLocaleString()}</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 ml-6">
                          <Button variant="outline" size="sm">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Rotate
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button className="w-full">
                    <Key className="w-4 h-4 mr-2" />
                    Generate New API Key
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Start */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
              <CardHeader>
                <CardTitle>Quick Start</CardTitle>
                <CardDescription>Get started with the Grow API in minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-blue-200">
                    <div className="font-bold text-gray-900 mb-2">1. Get your API key</div>
                    <p className="text-sm text-gray-600 mb-3">Navigate to the API Keys tab and copy your production or test key</p>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-blue-200">
                    <div className="font-bold text-gray-900 mb-2">2. Make your first request</div>
                    <div className="p-3 bg-gray-900 rounded font-mono text-sm text-green-400 overflow-x-auto">
                      <div>curl -X POST https://api.grow.io/v1/screening/sanctions \</div>
                      <div className="ml-4">-H "Authorization: Bearer YOUR_API_KEY" \</div>
                      <div className="ml-4">-H "Content-Type: application/json" \</div>
                      <div className="ml-4">-d '{`{"name": "John Smith", "dob": "1980-01-01"}`}'</div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-blue-200">
                    <div className="font-bold text-gray-900 mb-2">3. Handle the response</div>
                    <div className="p-3 bg-gray-900 rounded font-mono text-sm text-blue-400 overflow-x-auto">
                      <div>{'{'}</div>
                      <div className="ml-4">"status": "success",</div>
                      <div className="ml-4">"matches": 0,</div>
                      <div className="ml-4">"risk_score": 15,</div>
                      <div className="ml-4">"screened_lists": ["DFAT", "ASIC_BANNED"]</div>
                      <div>{'}'}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Endpoints */}
            <Card>
              <CardHeader>
                <CardTitle>Available Endpoints</CardTitle>
                <CardDescription>RESTful API endpoints for compliance automation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {endpoints.map((endpoint, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge className={
                            endpoint.method === 'GET' ? 'bg-blue-600 text-white' :
                            endpoint.method === 'POST' ? 'bg-green-600 text-white' :
                            'bg-purple-600 text-white'
                          }>
                            {endpoint.method}
                          </Badge>
                          <span className="font-mono font-semibold text-gray-900">{endpoint.path}</span>
                        </div>
                        <div className="text-sm text-gray-600">{endpoint.calls24h.toLocaleString()} calls (24h)</div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{endpoint.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Rate limit: {endpoint.rateLimit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Secure Authentication</h3>
                  <p className="text-sm text-gray-600">API keys with role-based permissions and IP whitelisting</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Webhooks</h3>
                  <p className="text-sm text-gray-600">Real-time notifications for screening results and status changes</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Database className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Rate Limiting</h3>
                  <p className="text-sm text-gray-600">Fair usage policies with automatic throttling and retry logic</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Documentation Tab */}
        {selectedTab === 'docs' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>Complete reference for all endpoints and data models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { title: 'Authentication', desc: 'API key setup and security', icon: Shield },
                    { title: 'Sanctions Screening', desc: 'Screen against global sanctions lists', icon: Globe },
                    { title: 'Entity Lookup', desc: 'ABN, ACN, and company searches', icon: Database },
                    { title: 'Client Management', desc: 'Create and manage KYC records', icon: FileText },
                    { title: 'Risk Scoring', desc: 'ML-powered risk assessment', icon: TrendingUp },
                    { title: 'Webhooks', desc: 'Real-time event notifications', icon: Zap },
                    { title: 'Rate Limits', desc: 'API quotas and throttling', icon: Settings },
                    { title: 'Error Handling', desc: 'Error codes and troubleshooting', icon: Terminal }
                  ].map((doc, idx) => {
                    const DocIcon = doc.icon;
                    return (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-all">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                            <DocIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 mb-1">{doc.title}</h4>
                            <p className="text-sm text-gray-600">{doc.desc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
