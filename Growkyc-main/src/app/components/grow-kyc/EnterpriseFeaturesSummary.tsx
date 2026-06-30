import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Shield,
  Users,
  Globe,
  Zap,
  Lock,
  BarChart3,
  FileText,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Activity,
  TrendingUp,
  Target,
  Sparkles,
  Network,
  Eye,
  Database,
  Cloud,
  Cpu,
  RefreshCw,
  Bell,
  Search,
  Filter,
  Download,
  Upload,
  Mail,
  MessageSquare,
  Phone,
  Video,
  Calendar,
  Clock,
  Award,
  Star,
  Briefcase,
  Building2,
  DollarSign,
  PiggyBank,
  Workflow
} from 'lucide-react';

export function EnterpriseFeaturesSummary() {
  const featureCategories = [
    {
      title: 'Client Onboarding',
      icon: Users,
      color: 'text-[#13B5EA]',
      bgColor: 'bg-blue-50',
      features: [
        { name: '100-Point ID Verification', icon: CheckCircle },
        { name: 'Biometric Verification', icon: Eye },
        { name: 'Liveness Detection', icon: Activity },
        { name: 'Document OCR', icon: FileText },
        { name: 'Address Verification', icon: Globe },
        { name: 'Multi-Entity Support', icon: Building2 }
      ]
    },
    {
      title: 'AML/CTF Compliance',
      icon: Shield,
      color: 'text-[#0E7C9E]',
      bgColor: 'bg-cyan-50',
      features: [
        { name: 'Real-time Sanctions Screening', icon: AlertTriangle },
        { name: 'PEP Database Check', icon: Users },
        { name: 'Adverse Media Monitoring', icon: FileText },
        { name: 'World-Check Integration', icon: Globe },
        { name: 'Transaction Monitoring', icon: Activity },
        { name: 'AUSTRAC Reporting', icon: Download }
      ]
    },
    {
      title: 'Risk Management',
      icon: Target,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      features: [
        { name: 'Automated Risk Scoring', icon: BarChart3 },
        { name: 'Risk Profile Analysis', icon: TrendingUp },
        { name: 'EDD Workflows', icon: Shield },
        { name: 'Geographic Risk Factors', icon: Globe },
        { name: 'Industry Risk Assessment', icon: Briefcase },
        { name: 'Composite Risk Matrix', icon: Target }
      ]
    },
    {
      title: 'Fraud Detection',
      icon: AlertCircle,
      color: 'text-[#FFA300]',
      bgColor: 'bg-orange-50',
      features: [
        { name: 'Identity Theft Detection', icon: AlertTriangle },
        { name: 'Document Forgery Analysis', icon: FileText },
        { name: 'Behavioral Analytics', icon: Activity },
        { name: 'IP/Device Fingerprinting', icon: Cpu },
        { name: 'Velocity Checks', icon: TrendingUp },
        { name: 'Pattern Anomaly Detection', icon: Network }
      ]
    },
    {
      title: 'Integrations Ecosystem',
      icon: Zap,
      color: 'text-[#3DD598]',
      bgColor: 'bg-green-50',
      features: [
        { name: '50+ Integration Partners', icon: Network },
        { name: 'Accounting Software (14)', icon: DollarSign },
        { name: 'Fund Management (4)', icon: PiggyBank },
        { name: 'Microsoft Suite (4)', icon: Mail },
        { name: 'Google Workspace (4)', icon: Cloud },
        { name: 'SMS Providers (4)', icon: MessageSquare }
      ]
    },
    {
      title: 'Ongoing Monitoring',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      features: [
        { name: 'Continuous Surveillance', icon: Eye },
        { name: 'Transaction Monitoring', icon: Activity },
        { name: 'Periodic Review Scheduling', icon: Calendar },
        { name: 'Document Expiry Tracking', icon: Clock },
        { name: 'Automatic Re-screening', icon: RefreshCw },
        { name: 'Alert Generation', icon: Bell }
      ]
    },
    {
      title: 'Reporting & Analytics',
      icon: BarChart3,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      features: [
        { name: 'Executive Dashboards', icon: BarChart3 },
        { name: 'Compliance Reports', icon: FileText },
        { name: 'Risk Heat Maps', icon: Target },
        { name: 'Portfolio Analytics', icon: TrendingUp },
        { name: 'Custom Report Builder', icon: Workflow },
        { name: 'Export to PDF/Excel', icon: Download }
      ]
    },
    {
      title: 'AI & Automation',
      icon: Sparkles,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      features: [
        { name: 'Compliance Copilot AI', icon: Sparkles },
        { name: 'Natural Language Queries', icon: MessageSquare },
        { name: 'Risk Assessment Automation', icon: Target },
        { name: 'Document Analysis', icon: FileText },
        { name: 'Pattern Detection', icon: Network },
        { name: '22 AI-Powered Bots', icon: Cpu }
      ]
    },
    {
      title: 'Global Compliance',
      icon: Globe,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      features: [
        { name: '7 Countries Supported', icon: Globe },
        { name: 'Multi-jurisdictional Rules', icon: Shield },
        { name: 'AUSTRAC (Australia)', icon: CheckCircle },
        { name: 'FCA (UK)', icon: CheckCircle },
        { name: 'FinCEN (USA)', icon: CheckCircle },
        { name: 'MAS (Singapore)', icon: CheckCircle }
      ]
    },
    {
      title: 'Case Management',
      icon: Briefcase,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      features: [
        { name: 'Comprehensive Workspace', icon: Briefcase },
        { name: 'Task Management', icon: CheckCircle },
        { name: 'Document Library', icon: FileText },
        { name: 'Verification Reports', icon: Download },
        { name: 'Collaboration Tools', icon: Users },
        { name: 'Approval Workflows', icon: Workflow }
      ]
    },
    {
      title: 'Security & Access',
      icon: Lock,
      color: 'text-gray-700',
      bgColor: 'bg-gray-50',
      features: [
        { name: 'Role-Based Access Control', icon: Shield },
        { name: 'MFA Ready', icon: Lock },
        { name: 'End-to-End Encryption', icon: Lock },
        { name: 'Audit Logging', icon: FileText },
        { name: 'Session Management', icon: Clock },
        { name: 'Data Retention Policies', icon: Database }
      ]
    },
    {
      title: 'Client Portal',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      features: [
        { name: 'Self-Service Onboarding', icon: Users },
        { name: 'Document Upload', icon: Upload },
        { name: 'Status Tracking', icon: Activity },
        { name: 'Secure Messaging', icon: Mail },
        { name: 'Mobile Responsive', icon: Phone },
        { name: 'Video Verification', icon: Video }
      ]
    }
  ];

  const platformStats = [
    { label: 'Total Integrations', value: '50+', icon: Zap, color: 'text-[#13B5EA]' },
    { label: 'Supported Countries', value: '7', icon: Globe, color: 'text-[#0E7C9E]' },
    { label: 'AI Bots', value: '22', icon: Sparkles, color: 'text-[#3DD598]' },
    { label: 'Client Profile Tabs', value: '17', icon: FileText, color: 'text-[#FFA300]' },
    { label: 'Compliance Frameworks', value: '7', icon: Shield, color: 'text-purple-600' },
    { label: 'Verification Methods', value: '15+', icon: CheckCircle, color: 'text-green-600' },
    { label: 'Entity Types', value: '6', icon: Building2, color: 'text-indigo-600' },
    { label: 'Regulatory Reports', value: '25+', icon: BarChart3, color: 'text-pink-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Hero Section */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-700 rounded-full mb-4">
          <Award className="w-5 h-5 text-white" />
          <span className="text-white font-semibold">Enterprise-Grade KYC Platform</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Grow KYC™ Operating System
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          The world's most comprehensive regulatory compliance and KYC platform, 
          powering financial institutions, accounting firms, and professional services globally.
        </p>
      </div>

      {/* Platform Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        {platformStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {featureCategories.map((category, index) => {
          const CategoryIcon = category.icon;
          return (
            <Card key={index} className="hover:shadow-xl transition-shadow">
              <CardHeader className={`${category.bgColor} border-b`}>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 bg-white rounded-lg ${category.color}`}>
                    <CategoryIcon className="w-6 h-6" />
                  </div>
                  <span className="text-gray-900">{category.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {category.features.map((feature, fIndex) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <li key={fIndex} className="flex items-center gap-3 text-gray-700">
                        <FeatureIcon className={`w-4 h-4 ${category.color} flex-shrink-0`} />
                        <span className="text-sm">{feature.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Production Ready Badge */}
      <Card className="bg-gradient-to-r from-[#3DD598] to-[#13B5EA] text-white">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckCircle className="w-12 h-12" />
            <h2 className="text-3xl font-bold">Production Ready</h2>
          </div>
          <p className="text-lg mb-6 opacity-90">
            Fully tested, enterprise-polished, and ready for immediate deployment
          </p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              <span className="font-semibold">70+ Components</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">AUSTRAC Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <span className="font-semibold">Multi-Jurisdictional</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">AI-Powered</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
