import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import {
  ArrowLeft,
  Activity,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Zap,
  Database,
  Eye,
  Settings,
  Play,
  Pause,
  Download,
  RefreshCw,
  GitBranch,
  Clock,
  Shield,
  AlertCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { toast } from '../../lib/toast';
import { Breadcrumbs } from './Breadcrumbs';

interface TransactionMonitoringProps {
  onBack: () => void;
}

export function TransactionMonitoring({ onBack }: TransactionMonitoringProps) {
  const [selectedFeed, setSelectedFeed] = useState<string | null>(null);

  const bankFeeds = [
    {
      id: 'feed-001',
      accountName: 'Commonwealth Bank - Business Account',
      accountNumber: '***1234',
      bank: 'CommBank',
      status: 'connected',
      lastSync: '2024-03-01 09:30',
      transactionsToday: 47,
      dataSource: 'Open Banking API (CDR)',
      refreshFrequency: 'Real-time'
    },
    {
      id: 'feed-002',
      accountName: 'NAB - Investment Account',
      accountNumber: '***5678',
      bank: 'NAB',
      status: 'connected',
      lastSync: '2024-03-01 09:25',
      transactionsToday: 23,
      dataSource: 'Open Banking API (CDR)',
      refreshFrequency: 'Real-time'
    },
    {
      id: 'feed-003',
      accountName: 'ANZ - Trust Account',
      accountNumber: '***9012',
      bank: 'ANZ',
      status: 'error',
      lastSync: '2024-02-28 14:20',
      transactionsToday: 0,
      dataSource: 'Open Banking API (CDR)',
      refreshFrequency: 'Real-time'
    }
  ];

  const monitoringRules = [
    {
      id: 'rule-001',
      name: 'Structuring Detection',
      description: 'Multiple transactions just below $10,000 threshold',
      status: 'active',
      triggers: 8,
      priority: 'high',
      conditions: [
        '3+ transactions within 24 hours',
        'Each transaction $8,000 - $9,999',
        'Same beneficiary or pattern'
      ]
    },
    {
      id: 'rule-002',
      name: 'Rapid Cash Movement',
      description: 'Funds in and out within short timeframe',
      status: 'active',
      triggers: 3,
      priority: 'medium',
      conditions: [
        'Funds in > $50,000',
        'Funds out within 48 hours',
        'Minimal balance remaining'
      ]
    },
    {
      id: 'rule-003',
      name: 'Cross-Border Spike',
      description: 'Unusual international transaction volume',
      status: 'active',
      triggers: 12,
      priority: 'high',
      conditions: [
        'International transactions > 3x baseline',
        'High-risk jurisdiction',
        'New beneficiary country'
      ]
    },
    {
      id: 'rule-004',
      name: 'Unusual Transaction Size',
      description: 'Transaction significantly larger than historical average',
      status: 'active',
      triggers: 5,
      priority: 'medium',
      conditions: [
        'Transaction > 5x average',
        'No business justification pattern',
        'First occurrence of size'
      ]
    }
  ];

  const transactionAlerts = [
    {
      id: 'alert-001',
      client: 'Alpha Holdings Pty Ltd',
      riskScore: 92,
      pattern: 'Structuring Detected',
      details: '4 transactions totaling $38,500 within 6 hours, each $9,500-$9,800',
      transactions: 4,
      totalAmount: 38500,
      timeframe: '6 hours',
      status: 'new',
      flaggedAt: '2024-03-01 08:45',
      autoAction: 'Account under review hold'
    },
    {
      id: 'alert-002',
      client: 'John Smith',
      riskScore: 78,
      pattern: 'Rapid Cash Movement',
      details: '$75,000 received and $72,000 sent within 24 hours',
      transactions: 2,
      totalAmount: 75000,
      timeframe: '24 hours',
      status: 'investigating',
      flaggedAt: '2024-03-01 07:30',
      autoAction: 'None'
    },
    {
      id: 'alert-003',
      client: 'Beta Investment Corp',
      riskScore: 85,
      pattern: 'High-Risk Jurisdiction Transfer',
      details: '$120,000 to UAE entity with no prior business relationship',
      transactions: 1,
      totalAmount: 120000,
      timeframe: 'Single',
      status: 'escalated',
      flaggedAt: '2024-02-29 16:20',
      autoAction: 'Transaction held pending review'
    }
  ];

  const heatmapData = [
    { date: '2024-02-24', riskScore: 25, flagged: 2 },
    { date: '2024-02-25', riskScore: 18, flagged: 1 },
    { date: '2024-02-26', riskScore: 42, flagged: 3 },
    { date: '2024-02-27', riskScore: 68, flagged: 5 },
    { date: '2024-02-28', riskScore: 85, flagged: 8 },
    { date: '2024-02-29', riskScore: 92, flagged: 12 },
    { date: '2024-03-01', riskScore: 78, flagged: 9 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="h-6 w-px bg-white/30" />
              <Activity className="w-6 h-6 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Transaction Monitoring</h1>
                <p className="text-sm text-white/90">Real-Time AML Surveillance & Pattern Detection</p>
              </div>
            </div>
            <Badge className="bg-white text-green-600 text-sm px-3 py-1">
              <Zap className="w-4 h-4 mr-1" />
              Live Monitoring Active
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="alerts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="alerts">Transaction Alerts</TabsTrigger>
            <TabsTrigger value="heatmap">Risk Heatmap</TabsTrigger>
          </TabsList>

          {/* Transaction Alerts */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="space-y-4">
              {transactionAlerts.map((alert) => (
                <Card 
                  key={alert.id}
                  className={`border-2 ${
                    alert.riskScore >= 90 ? 'border-red-300 bg-red-50' :
                    alert.riskScore >= 70 ? 'border-amber-300 bg-amber-50' :
                    'border-blue-300 bg-blue-50'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <AlertTriangle className={`w-6 h-6 ${
                            alert.riskScore >= 90 ? 'text-red-600' :
                            alert.riskScore >= 70 ? 'text-amber-600' :
                            'text-blue-600'
                          }`} />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{alert.client}</h3>
                            <div className="text-sm text-gray-600">{alert.pattern}</div>
                          </div>
                          <Badge className={
                            alert.riskScore >= 90 ? 'bg-red-600' :
                            alert.riskScore >= 70 ? 'bg-amber-600' :
                            'bg-blue-600'
                          }>
                            Risk: {alert.riskScore}/100
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-800 mb-4 p-3 bg-white rounded border">
                          {alert.details}
                        </p>

                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-600">Transactions</div>
                            <div className="font-semibold">{alert.transactions}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Total Amount</div>
                            <div className="font-semibold text-green-600">
                              ${alert.totalAmount.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Timeframe</div>
                            <div className="font-semibold">{alert.timeframe}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Status</div>
                            <Badge variant="outline">{alert.status}</Badge>
                          </div>
                        </div>

                        {alert.autoAction !== 'None' && (
                          <div className="p-3 bg-amber-100 rounded border border-amber-300 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-semibold text-amber-900">
                              Auto Action: {alert.autoAction}
                            </span>
                          </div>
                        )}

                        <div className="text-xs text-gray-500 mt-3">
                          Flagged: {alert.flaggedAt}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-6">
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          <Shield className="w-4 h-4 mr-2" />
                          Create SMR Case
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Investigate
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Export Evidence
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Risk Heatmap */}
          <TabsContent value="heatmap" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>7-Day Transaction Risk Heatmap</CardTitle>
                <CardDescription>
                  Daily risk score trend and flagged transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {heatmapData.map((day, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-24 text-sm font-medium text-gray-700">
                        {new Date(day.date).toLocaleDateString('en-AU', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Progress 
                            value={day.riskScore} 
                            className={`h-8 ${
                              day.riskScore >= 80 ? 'bg-red-100' :
                              day.riskScore >= 50 ? 'bg-amber-100' :
                              'bg-green-100'
                            }`}
                          />
                          <span className={`font-bold text-lg ${
                            day.riskScore >= 80 ? 'text-red-600' :
                            day.riskScore >= 50 ? 'text-amber-600' :
                            'text-green-600'
                          }`}>
                            {day.riskScore}
                          </span>
                        </div>
                      </div>
                      <div className="w-32 text-right">
                        <Badge className={
                          day.flagged >= 10 ? 'bg-red-600' :
                          day.flagged >= 5 ? 'bg-amber-600' :
                          'bg-blue-600'
                        }>
                          {day.flagged} flagged
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}