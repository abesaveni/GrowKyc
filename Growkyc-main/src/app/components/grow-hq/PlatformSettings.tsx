import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  ArrowRight,
  Key,
  Webhook,
  Check,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Lock,
  RefreshCw,
  Settings,
  Shield,
  Info,
  Download,
  Upload,
  FileText,
  Database,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface PlatformSettingsProps {
  onBack?: () => void;
}

export function PlatformSettings({ onBack }: PlatformSettingsProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://acmefs.grow.cloud/webhooks/inbound');
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'Production API Key', key: 'sk_live_***************************', created: '2024-01-15', lastUsed: '2 hours ago', status: 'active' },
    { id: 2, name: 'Development API Key', key: 'sk_test_***************************', created: '2024-01-10', lastUsed: '1 day ago', status: 'active' },
    { id: 3, name: 'Legacy API Key', key: 'sk_live_***************************', created: '2023-12-01', lastUsed: 'Never', status: 'revoked' }
  ]);

  const [webhooks, setWebhooks] = useState([
    { id: 1, url: 'https://acmefs.grow.cloud/webhooks/crm', events: ['contact.created', 'contact.updated'], status: 'active', lastDelivery: '5 minutes ago', successRate: '100%' },
    { id: 2, url: 'https://acmefs.grow.cloud/webhooks/documents', events: ['document.uploaded', 'document.signed'], status: 'active', lastDelivery: '1 hour ago', successRate: '98.7%' },
    { id: 3, url: 'https://acmefs.grow.cloud/webhooks/payments', events: ['payment.success', 'payment.failed'], status: 'error', lastDelivery: '3 hours ago', successRate: '45.2%' }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Grow HQ
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
              <p className="text-gray-600 mt-2">
                Advanced configuration, API keys, webhooks, and platform settings
              </p>
            </div>
          </div>
        </div>

        {/* API Keys Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-6 h-6 text-blue-600" />
                  API Keys
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">Manage API keys for programmatic access to Grow platform</p>
              </div>
              <Button onClick={() => toast.success('Creating new API key...')}>
                <Plus className="w-4 h-4 mr-2" />
                Create API Key
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className={`p-4 border-2 rounded-lg ${
                  apiKey.status === 'active' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900">{apiKey.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          apiKey.status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'
                        }`}>
                          {apiKey.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                          {apiKey.key}
                        </code>
                        <Button size="sm" variant="ghost" onClick={() => toast.success('Copied to clipboard')}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>Created: {apiKey.created}</span>
                        <span>•</span>
                        <span>Last used: {apiKey.lastUsed}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {apiKey.status === 'active' && (
                        <Button size="sm" variant="outline" onClick={() => toast.warning('API key revoked')}>
                          <Lock className="w-4 h-4 mr-2" />
                          Revoke
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => toast.error('API key deleted')}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-blue-900">API Key Security</p>
                  <p className="text-sm text-blue-800 mt-1">
                    API keys provide full access to your Grow account. Store them securely and never commit them to version control. 
                    Rotate keys regularly and revoke any keys that may have been compromised.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Webhooks Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Webhook className="w-6 h-6 text-purple-600" />
                  Webhooks
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">Configure webhook endpoints for real-time event notifications</p>
              </div>
              <Button onClick={() => toast.success('Creating new webhook...')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Webhook
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className={`p-4 border-2 rounded-lg ${
                  webhook.status === 'active' ? 'border-green-200 bg-green-50' :
                  webhook.status === 'error' ? 'border-red-200 bg-red-50' :
                  'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Globe className="w-5 h-5 text-gray-600" />
                        <code className="text-sm font-mono text-gray-900">{webhook.url}</code>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          webhook.status === 'active' ? 'bg-green-600 text-white' :
                          webhook.status === 'error' ? 'bg-red-600 text-white' :
                          'bg-gray-400 text-white'
                        }`}>
                          {webhook.status}
                        </span>
                      </div>
                      <div className="mb-2">
                        <p className="text-xs text-gray-600 mb-1">Subscribed Events:</p>
                        <div className="flex flex-wrap gap-2">
                          {webhook.events.map((event, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              {event}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>Last delivery: {webhook.lastDelivery}</span>
                        <span>•</span>
                        <span>Success rate: {webhook.successRate}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => toast.info('Testing webhook...')}>
                        <Zap className="w-4 h-4 mr-2" />
                        Test
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toast.info('Opening webhook settings...')}>
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => toast.error('Webhook deleted')}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  {webhook.status === 'error' && (
                    <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <p className="text-sm text-red-800 font-semibold">Webhook Failing</p>
                      </div>
                      <p className="text-xs text-red-700 mt-1">
                        Last 10 deliveries failed with HTTP 500. Check your endpoint configuration.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-purple-900">Available Events</p>
                    <ul className="text-sm text-purple-800 mt-2 space-y-1">
                      <li>• contact.*, document.*, payment.*, user.*</li>
                      <li>• case.*, job.*, loan.*, fund.*</li>
                      <li>• invoice.*, time_entry.*, trust_transaction.*</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-900">Webhook Security</p>
                    <p className="text-sm text-blue-800 mt-1">
                      All webhooks are signed with HMAC-SHA256. Verify the signature using your webhook secret.
                    </p>
                    <Button size="sm" className="mt-2" onClick={() => toast.info('Opening webhook security guide...')}>
                      View Guide
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rate Limits & Quotas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-600" />
              API Rate Limits & Quotas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border-2 border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <p className="font-semibold text-gray-900">Hourly Limit</p>
                </div>
                <p className="text-3xl font-bold text-blue-600">2,847</p>
                <p className="text-xs text-gray-600 mt-1">of 10,000 requests used</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '28.47%' }}></div>
                </div>
              </div>

              <div className="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-5 h-5 text-green-600" />
                  <p className="font-semibold text-gray-900">Daily Limit</p>
                </div>
                <p className="text-3xl font-bold text-green-600">45,231</p>
                <p className="text-xs text-gray-600 mt-1">of 200,000 requests used</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '22.6%' }}></div>
                </div>
              </div>

              <div className="p-4 border-2 border-purple-200 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <p className="font-semibold text-gray-900">Storage Used</p>
                </div>
                <p className="text-3xl font-bold text-purple-600">2.4 TB</p>
                <p className="text-xs text-gray-600 mt-1">of 5 TB included</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '48%' }}></div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Need higher limits?</p>
                  <p className="text-sm text-gray-600">Upgrade to Enterprise plan for unlimited API requests</p>
                </div>
                <Button variant="outline">
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Retention & Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-6 h-6 text-indigo-600" />
              Data Retention & Backup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Retention Policies</h3>
                <div className="space-y-3">
                  {[
                    { type: 'Audit Logs', retention: '7 years', size: '145 MB', compliance: 'Required' },
                    { type: 'User Activity', retention: '2 years', size: '89 MB', compliance: 'Recommended' },
                    { type: 'Webhook Logs', retention: '90 days', size: '23 MB', compliance: 'Standard' },
                    { type: 'Deleted Records', retention: '30 days', size: '12 MB', compliance: 'Recovery Period' }
                  ].map((policy, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{policy.type}</p>
                        <p className="text-xs text-gray-600">{policy.retention} • {policy.size}</p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {policy.compliance}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Automated Backups</h3>
                <div className="space-y-3">
                  <div className="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="font-semibold text-green-900">Backup Status: Active</p>
                    </div>
                    <ul className="space-y-1 text-sm text-green-800">
                      <li>• Hourly incremental backups</li>
                      <li>• Daily full backups</li>
                      <li>• 30-day retention period</li>
                      <li>• Geo-redundant storage</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-gray-50 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900">Last Backup</span>
                      <span className="text-sm text-gray-600">12 minutes ago</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.info('Initiating manual backup...')}>
                        <Upload className="w-4 h-4 mr-2" />
                        Backup Now
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.info('Opening backup restore...')}>
                        <Download className="w-4 h-4 mr-2" />
                        Restore
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Environment Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-6 h-6 text-gray-600" />
              Environment Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">Environment</p>
                    <p className="text-sm text-gray-600">Current deployment environment</p>
                  </div>
                  <select className="px-3 py-2 border rounded-lg font-medium text-gray-900 bg-white">
                    <option value="production">Production</option>
                    <option value="staging">Staging</option>
                    <option value="development">Development</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Base URL</p>
                  <code className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded block">
                    https://api.grow.cloud/v1
                  </code>
                </div>

                <div className="p-4 border rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Webhook URL</p>
                  <code className="text-sm font-mono text-purple-600 bg-purple-50 px-2 py-1 rounded block">
                    https://acmefs.grow.cloud/webhooks
                  </code>
                </div>

                <div className="p-4 border rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Region</p>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Australia (Sydney) ap-southeast-2</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">CDN Status</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">Active • Cloudflare</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-red-600" />
              Security & Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="font-semibold text-gray-900">SSL/TLS Certificate</p>
                </div>
                <p className="text-sm text-gray-700 mb-2">Valid until: June 15, 2026</p>
                <p className="text-xs text-gray-600">Issued by: Let's Encrypt</p>
                <Button size="sm" variant="outline" className="mt-3" onClick={() => toast.info('Renewing certificate...')}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Renew Now
                </Button>
              </div>

              <div className="p-4 border-2 border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <p className="font-semibold text-gray-900">2FA Enforcement</p>
                </div>
                <p className="text-sm text-gray-700 mb-2">Required for all users</p>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>77 users enrolled</span>
                </div>
                <Button size="sm" variant="outline" className="mt-3">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
              </div>

              <div className="p-4 border-2 border-purple-200 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <p className="font-semibold text-gray-900">IP Whitelisting</p>
                </div>
                <p className="text-sm text-gray-700 mb-2">3 IP addresses whitelisted</p>
                <p className="text-xs text-gray-600">Restricts API access</p>
                <Button size="sm" variant="outline" className="mt-3">
                  <Plus className="w-4 h-4 mr-2" />
                  Add IP
                </Button>
              </div>

              <div className="p-4 border-2 border-orange-200 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <p className="font-semibold text-gray-900">Session Timeout</p>
                </div>
                <p className="text-sm text-gray-700 mb-2">Auto-logout after 30 minutes</p>
                <p className="text-xs text-gray-600">Idle sessions terminated</p>
                <Button size="sm" variant="outline" className="mt-3">
                  <Settings className="w-4 h-4 mr-2" />
                  Adjust
                </Button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-yellow-700 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-yellow-900">Compliance Certifications</p>
                  <p className="text-sm text-yellow-800 mt-1 mb-3">
                    Grow platform is certified for: ISO 27001, SOC 2 Type II, GDPR, Australian Privacy Act
                  </p>
                  <Button size="sm" onClick={() => toast.info('Downloading compliance documents...')}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificates
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Export & Import */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-6 h-6 text-green-600" />
              Data Export & Import
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border-2 border-blue-200 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Export Data</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Export all your data in standard formats for backup or migration purposes.
                </p>
                <div className="space-y-2">
                  <Button className="w-full" onClick={() => toast.success('Preparing data export...')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export All Data (CSV/JSON)
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => toast.info('Generating report...')}>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Compliance Report
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  Last export: February 1, 2026
                </p>
              </div>

              <div className="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Import Data</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Import data from other systems or restore from previous exports.
                </p>
                <div className="space-y-2">
                  <Button className="w-full" onClick={() => toast.info('Opening import wizard...')}>
                    <Upload className="w-4 h-4 mr-2" />
                    Import from CSV/JSON
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => toast.info('Opening migration tool...')}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Migrate from Another System
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  Supports: Xero, MYOB, QuickBooks, Excel
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Developer Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-gray-600" />
              Developer Tools & Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-24 flex-col" variant="outline" onClick={() => window.open('https://docs.grow.cloud', '_blank')}>
                <FileText className="w-8 h-8 mb-2 text-blue-600" />
                <span>API Documentation</span>
              </Button>
              <Button className="h-24 flex-col" variant="outline" onClick={() => toast.info('Opening API playground...')}>
                <Zap className="w-8 h-8 mb-2 text-purple-600" />
                <span>API Playground</span>
              </Button>
              <Button className="h-24 flex-col" variant="outline" onClick={() => toast.info('Downloading SDK...')}>
                <Download className="w-8 h-8 mb-2 text-green-600" />
                <span>Download SDKs</span>
              </Button>
            </div>

            <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
              <p className="font-semibold text-gray-900 mb-2">Available SDKs</p>
              <div className="flex flex-wrap gap-2">
                {['JavaScript', 'Python', 'Ruby', 'PHP', 'Java', '.NET', 'Go'].map((sdk) => (
                  <span key={sdk} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    {sdk}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
