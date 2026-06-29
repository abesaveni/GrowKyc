import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Brain,
  TrendingUp,
  Target,
  AlertCircle,
  Sparkles,
  Zap,
  BarChart3,
  Users,
  DollarSign,
  Mail,
  Calendar,
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
  Award,
  Activity,
  ArrowRight,
  RefreshCw,
  Send,
  Lightbulb,
  Star,
  ThumbsUp,
  ThumbsDown,
  Plus
} from 'lucide-react';

interface AIModuleProps {
  role: string;
}

export function AIModule({ role }: AIModuleProps) {
  const [activeTab, setActiveTab] = useState<'insights' | 'predictions' | 'suggestions' | 'automation'>('insights');

  const aiInsights = [
    {
      id: 1,
      type: 'revenue',
      priority: 'high',
      title: 'Revenue Growth Opportunity',
      description: 'Your top 20% of customers generate 80% of revenue. Focus on similar customer profiles.',
      impact: '+$45K potential',
      confidence: 92,
      action: 'View Customer Segments'
    },
    {
      id: 2,
      type: 'churn',
      priority: 'high',
      title: 'Churn Risk Detected',
      description: '3 high-value customers show decreased engagement. Immediate outreach recommended.',
      impact: '$12K at risk',
      confidence: 85,
      action: 'View At-Risk Customers'
    },
    {
      id: 3,
      type: 'conversion',
      priority: 'medium',
      title: 'Conversion Rate Optimization',
      description: 'Leads from webinars convert 3x better. Increase webinar frequency.',
      impact: '+25% conversion',
      confidence: 78,
      action: 'View Conversion Data'
    },
    {
      id: 4,
      type: 'efficiency',
      priority: 'medium',
      title: 'Team Efficiency',
      description: 'Tuesday 2PM-4PM has highest response rates. Schedule important calls then.',
      impact: '+15% response',
      confidence: 88,
      action: 'Optimize Schedule'
    }
  ];

  const dealPredictions = [
    {
      dealName: 'TechCorp Enterprise License',
      client: 'TechCorp Solutions',
      currentStage: 'Negotiation',
      value: 45000,
      closeProbability: 75,
      predictedCloseDate: '2024-03-15',
      riskFactors: ['Budget approval pending', 'Competitor evaluation'],
      recommendations: ['Schedule CFO meeting', 'Send ROI analysis']
    },
    {
      dealName: 'Innovate Labs Integration',
      client: 'Innovate Labs',
      currentStage: 'Proposal',
      value: 28000,
      closeProbability: 55,
      predictedCloseDate: '2024-04-01',
      riskFactors: ['No recent contact', 'Price concerns'],
      recommendations: ['Follow up within 48 hours', 'Offer payment plan']
    },
    {
      dealName: 'Global Tech Migration',
      client: 'Global Tech Inc',
      currentStage: 'Discovery',
      value: 75000,
      closeProbability: 85,
      predictedCloseDate: '2024-03-20',
      riskFactors: [],
      recommendations: ['Fast-track to proposal', 'Assign senior team member']
    }
  ];

  const smartSuggestions = [
    {
      id: 1,
      category: 'email',
      title: 'Draft Follow-up Email',
      description: 'Sarah Mitchell (Hot Lead) has not responded in 3 days',
      preview: 'Hi Sarah, I wanted to follow up on our conversation about...',
      confidence: 90
    },
    {
      id: 2,
      category: 'task',
      title: 'Schedule Demo Call',
      description: 'David Thompson requested product demo 5 days ago',
      preview: 'Book a 30-minute slot this week for product walkthrough',
      confidence: 88
    },
    {
      id: 3,
      category: 'lead-score',
      title: 'Update Lead Score',
      description: 'Jennifer Lee visited pricing page 4 times today',
      preview: 'Increase score from 78 to 85 based on buying signals',
      confidence: 92
    },
    {
      id: 4,
      category: 'opportunity',
      title: 'Upsell Opportunity',
      description: 'TechCorp using 90% of current plan capacity',
      preview: 'Recommend Enterprise tier upgrade (+$150/month)',
      confidence: 82
    }
  ];

  const automationWorkflows = [
    {
      id: 1,
      name: 'Lead Nurture Sequence',
      trigger: 'New lead from website form',
      status: 'active',
      performance: { sent: 145, opened: 98, clicked: 45, converted: 12 },
      conversionRate: 8.3
    },
    {
      id: 2,
      name: 'Customer Onboarding',
      trigger: 'Deal marked as won',
      status: 'active',
      performance: { sent: 34, opened: 32, clicked: 28, converted: 31 },
      conversionRate: 91.2
    },
    {
      id: 3,
      name: 'Engagement Re-activation',
      trigger: 'No activity in 30 days',
      status: 'active',
      performance: { sent: 67, opened: 23, clicked: 8, converted: 5 },
      conversionRate: 7.5
    },
    {
      id: 4,
      name: 'Proposal Follow-up',
      trigger: 'Proposal sent',
      status: 'paused',
      performance: { sent: 89, opened: 71, clicked: 34, converted: 19 },
      conversionRate: 21.3
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">AI Intelligence</h1>
            <p className="text-slate-300">AI-powered insights, predictions, and automation</p>
          </div>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Insights
        </Button>
      </div>

      {/* AI Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-purple-300">Insights Generated</p>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-300">24</p>
          <p className="text-xs text-purple-400 mt-1">This week</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-blue-300">Accuracy Rate</p>
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-300">87%</p>
          <p className="text-xs text-blue-400 mt-1">Prediction accuracy</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-green-300">Actions Taken</p>
            <Zap className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-300">156</p>
          <p className="text-xs text-green-400 mt-1">Automated tasks</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-orange-300">Time Saved</p>
            <Clock className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-orange-300">42h</p>
          <p className="text-xs text-orange-400 mt-1">This month</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-white/10 rounded-lg overflow-hidden">
        <div className="border-b border-white/10 flex">
          {[
            { id: 'insights', label: 'AI Insights', icon: Lightbulb },
            { id: 'predictions', label: 'Deal Predictions', icon: TrendingUp },
            { id: 'suggestions', label: 'Smart Suggestions', icon: Sparkles },
            { id: 'automation', label: 'Automation', icon: Zap }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-400 font-medium bg-purple-500/10'
                    : 'border-transparent text-slate-300 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'insights' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-100">AI-Generated Business Insights</h3>
                <span className="text-sm text-slate-300">Based on 90 days of data</span>
              </div>

              <div className="space-y-3">
                {aiInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`border rounded-lg p-5 ${
                      insight.priority === 'high'
                        ? 'border-red-300 bg-red-500/10'
                        : 'border-yellow-300 bg-yellow-500/10'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          insight.type === 'revenue' ? 'bg-green-500/15' :
                          insight.type === 'churn' ? 'bg-red-500/15' :
                          insight.type === 'conversion' ? 'bg-blue-500/15' :
                          'bg-purple-500/15'
                        }`}>
                          {insight.type === 'revenue' && <DollarSign className="w-5 h-5 text-green-400" />}
                          {insight.type === 'churn' && <AlertCircle className="w-5 h-5 text-red-400" />}
                          {insight.type === 'conversion' && <Target className="w-5 h-5 text-blue-400" />}
                          {insight.type === 'efficiency' && <Zap className="w-5 h-5 text-purple-400" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-slate-100">{insight.title}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              insight.priority === 'high'
                                ? 'bg-red-500/15 text-red-300'
                                : 'bg-yellow-500/15 text-yellow-300'
                            }`}>
                              {insight.priority} priority
                            </span>
                          </div>
                          <p className="text-sm text-slate-300 mb-3">{insight.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-green-400" />
                              <span className="font-semibold text-green-300">{insight.impact}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-slate-300" />
                              <span className="text-slate-300">{insight.confidence}% confidence</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                        {insight.action}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'predictions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-100">AI Deal Close Predictions</h3>
                <span className="text-sm text-slate-300">Updated in real-time</span>
              </div>

              <div className="space-y-4">
                {dealPredictions.map((deal, idx) => (
                  <div key={idx} className="border border-white/10 rounded-lg p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-100 mb-1">{deal.dealName}</h4>
                        <p className="text-sm text-slate-300">{deal.client}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-100">${(deal.value / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-slate-400">{deal.currentStage}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-300">Close Probability</span>
                        <span className="text-sm font-bold text-slate-100">{deal.closeProbability}%</span>
                      </div>
                      <div className="h-3 bg-white/10 rounded-full">
                        <div
                          className={`h-3 rounded-full ${
                            deal.closeProbability >= 80 ? 'bg-green-600' :
                            deal.closeProbability >= 60 ? 'bg-blue-600' :
                            'bg-yellow-600'
                          }`}
                          style={{ width: `${deal.closeProbability}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-white/10">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Predicted Close Date</p>
                        <p className="text-sm font-medium text-slate-100">{deal.predictedCloseDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Risk Factors</p>
                        <p className="text-sm font-medium text-slate-100">{deal.riskFactors.length} identified</p>
                      </div>
                    </div>

                    {deal.riskFactors.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-red-300 mb-2">⚠️ Risk Factors</p>
                        <ul className="space-y-1">
                          {deal.riskFactors.map((risk, i) => (
                            <li key={i} className="text-sm text-red-400 flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-red-600" />
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-semibold text-green-300 mb-2">✓ AI Recommendations</p>
                      <div className="space-y-2">
                        {deal.recommendations.map((rec, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="text-sm text-slate-300">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-100">Smart Action Suggestions</h3>
                <span className="text-sm text-slate-300">AI-powered recommendations</span>
              </div>

              <div className="space-y-3">
                {smartSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="border border-white/10 rounded-lg p-5 hover:border-purple-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          suggestion.category === 'email' ? 'bg-blue-500/15' :
                          suggestion.category === 'task' ? 'bg-purple-500/15' :
                          suggestion.category === 'lead-score' ? 'bg-green-500/15' :
                          'bg-orange-500/15'
                        }`}>
                          {suggestion.category === 'email' && <Mail className="w-5 h-5 text-blue-400" />}
                          {suggestion.category === 'task' && <CheckCircle className="w-5 h-5 text-purple-400" />}
                          {suggestion.category === 'lead-score' && <Star className="w-5 h-5 text-green-400" />}
                          {suggestion.category === 'opportunity' && <TrendingUp className="w-5 h-5 text-orange-400" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-100 mb-1">{suggestion.title}</h4>
                          <p className="text-sm text-slate-300 mb-2">{suggestion.description}</p>
                          <div className="p-3 bg-white/5 rounded-lg mb-3">
                            <p className="text-sm text-slate-300 italic">{suggestion.preview}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">AI Confidence:</span>
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full max-w-24">
                              <div
                                className="h-1.5 bg-purple-600 rounded-full"
                                style={{ width: `${suggestion.confidence}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-purple-300">{suggestion.confidence}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Apply
                        </Button>
                        <div className="flex gap-1">
                          <button className="p-1.5 hover:bg-white/5 rounded">
                            <ThumbsUp className="w-4 h-4 text-slate-300" />
                          </button>
                          <button className="p-1.5 hover:bg-white/5 rounded">
                            <ThumbsDown className="w-4 h-4 text-slate-300" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'automation' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-100">Active Automation Workflows</h3>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  New Workflow
                </Button>
              </div>

              <div className="space-y-4">
                {automationWorkflows.map((workflow) => (
                  <div key={workflow.id} className="border border-white/10 rounded-lg p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-slate-100">{workflow.name}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            workflow.status === 'active'
                              ? 'bg-green-500/15 text-green-300'
                              : 'bg-white/5 text-slate-100'
                          }`}>
                            {workflow.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300">Trigger: {workflow.trigger}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-300">{workflow.conversionRate}%</p>
                        <p className="text-xs text-slate-400">Conversion rate</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="bg-blue-500/10 rounded-lg p-3">
                        <p className="text-xs text-blue-300 mb-1">Sent</p>
                        <p className="text-lg font-bold text-blue-300">{workflow.performance.sent}</p>
                      </div>
                      <div className="bg-purple-500/10 rounded-lg p-3">
                        <p className="text-xs text-purple-300 mb-1">Opened</p>
                        <p className="text-lg font-bold text-purple-300">{workflow.performance.opened}</p>
                      </div>
                      <div className="bg-indigo-500/10 rounded-lg p-3">
                        <p className="text-xs text-indigo-300 mb-1">Clicked</p>
                        <p className="text-lg font-bold text-indigo-300">{workflow.performance.clicked}</p>
                      </div>
                      <div className="bg-green-500/10 rounded-lg p-3">
                        <p className="text-xs text-green-300 mb-1">Converted</p>
                        <p className="text-lg font-bold text-green-300">{workflow.performance.converted}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      {workflow.status === 'active' ? (
                        <Button variant="outline" size="sm">
                          Pause
                        </Button>
                      ) : (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          Activate
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}