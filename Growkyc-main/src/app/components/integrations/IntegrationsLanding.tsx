import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Database,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  GitBranch,
  Server,
  Workflow,
  Eye,
  FileText,
  TrendingUp,
  Lock,
  Globe,
  Brain
} from 'lucide-react';

function getRuntimeEnv(): Record<string, string | boolean | undefined> {
  const viteEnv = (typeof import.meta !== 'undefined' ? (import.meta as any).env : {}) || {};
  const processEnv = ((globalThis as any)?.process?.env || {}) as Record<string, string>;
  return { ...processEnv, ...viteEnv };
}

function isFlagEnabled(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
}

interface IntegrationsLandingProps {
  onNavigate: (page: string) => void;
}

export function IntegrationsLanding({ onNavigate }: IntegrationsLandingProps) {
  const env = getRuntimeEnv();
  const isProduction =
    Boolean((import.meta as any)?.env?.PROD) ||
    env.NODE_ENV === 'production' ||
    env.VITE_APP_ENV === 'production';
  const allowDemoInProduction = isFlagEnabled(env.VITE_ENABLE_INTEGRATIONS_DEMO);
  const blockDemoNavigation = isProduction && !allowDemoInProduction;

  const providers = [
    { name: 'ASIC Direct', icon: '🏛️', color: 'blue', purpose: 'Entity Verification' },
    { name: 'Equifax', icon: '📊', color: 'purple', purpose: 'Identity & Credit' },
    { name: 'Illion', icon: '🏢', color: 'indigo', purpose: 'Business Risk' },
    { name: 'ComplyAdvantage', icon: '🛡️', color: 'green', purpose: 'AML Screening' },
    { name: 'LexisNexis', icon: '⚖️', color: 'amber', purpose: 'Advanced Legal' },
    { name: 'Chainalysis', icon: '₿', color: 'orange', purpose: 'Crypto Risk' }
  ];

  const features = [
    {
      title: 'One Orchestration Layer',
      description: 'Single workflow engine decides which providers to call, when, and how',
      icon: Workflow,
      color: 'purple'
    },
    {
      title: 'Unified Schema',
      description: 'All 6 providers normalised into one canonical data model',
      icon: Database,
      color: 'blue'
    },
    {
      title: 'Risk Intelligence',
      description: 'Aggregated risk from all sources into one intelligent decision',
      icon: Brain,
      color: 'green'
    },
    {
      title: 'Full Audit Trail',
      description: 'Every check logged with provider, timestamp, and decision for compliance',
      icon: FileText,
      color: 'amber'
    },
    {
      title: 'Live Monitoring',
      description: 'Continuous screening across providers for ongoing compliance',
      icon: Eye,
      color: 'indigo'
    },
    {
      title: 'Native Experience',
      description: 'Users see results, not APIs. Provider complexity hidden completely',
      icon: Shield,
      color: 'pink'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border-4 border-white/20 shadow-2xl">
              <GitBranch className="w-14 h-14" />
            </div>
            <div>
              <h1 className="text-6xl font-bold mb-4">Integrations Layer</h1>
              <p className="text-3xl text-white/90">
                Six different data providers — one intelligent system
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="w-10 h-10" />
                  <div>
                    <p className="text-4xl font-bold">6</p>
                    <p className="text-white/80">Data Providers</p>
                  </div>
                </div>
                <p className="text-sm text-white/70">Core + optional providers for complete coverage</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Workflow className="w-10 h-10" />
                  <div>
                    <p className="text-4xl font-bold">1</p>
                    <p className="text-white/80">Unified System</p>
                  </div>
                </div>
                <p className="text-sm text-white/70">All providers normalised to single schema</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-10 h-10" />
                  <div>
                    <p className="text-4xl font-bold">100%</p>
                    <p className="text-white/80">Audit Ready</p>
                  </div>
                </div>
                <p className="text-sm text-white/70">Full compliance traceability for AUSTRAC</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Providers Grid */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-slate-100 mb-3 flex items-center gap-3">
            <Globe className="w-10 h-10 text-purple-400" />
            All Providers Connected
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            4 core providers always active + 2 optional trigger-based providers
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {providers.map((provider, idx) => (
              <Card
                key={idx}
                className={`border-2 border-${provider.color}-300 hover:border-${provider.color}-500 transition-all hover:shadow-xl`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br from-${provider.color}-500 to-${provider.color}-700 rounded-2xl flex items-center justify-center text-4xl shadow-lg`}>
                      {provider.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-100">{provider.name}</h3>
                      <p className="text-sm text-slate-300">{provider.purpose}</p>
                    </div>
                  </div>
                  {idx < 4 ? (
                    <Badge className="bg-green-500/15 text-green-300 border-green-300">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Core Provider
                    </Badge>
                  ) : (
                    <Badge className="bg-purple-500/15 text-purple-300 border-purple-300">
                      <Zap className="w-3 h-3 mr-1" />
                      Trigger-Based
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Architecture Flow */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-slate-100 mb-3 flex items-center gap-3">
            <Server className="w-10 h-10 text-blue-400" />
            API Architecture
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Clean separation of concerns with orchestration layer
          </p>

          <Card className="border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Eye className="w-8 h-8 text-blue-400" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">Front End</h3>
                      <p className="text-sm text-slate-300">Calls internal APIs only</p>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-8 h-8 text-gray-400 mx-4" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Server className="w-8 h-8 text-indigo-400" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">API Gateway</h3>
                      <p className="text-sm text-slate-300">Centralised auth & routing</p>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-8 h-8 text-gray-400 mx-4" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Workflow className="w-8 h-8 text-purple-400" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">Orchestration</h3>
                      <p className="text-sm text-slate-300">Workflow decision engine</p>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-8 h-8 text-gray-400 mx-4" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Database className="w-8 h-8 text-green-400" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">Adapters</h3>
                      <p className="text-sm text-slate-300">6 provider connectors</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-slate-100 mb-3 flex items-center gap-3">
            <Zap className="w-10 h-10 text-purple-400" />
            Key Features
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Everything needed for production-ready compliance
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="border-2 border-white/10 hover:border-purple-300 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-${feature.color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-7 h-7 text-${feature.color}-600`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-100 mb-2">{feature.title}</h3>
                        <p className="text-slate-300">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-slate-100 mb-8 flex items-center gap-3">
            <ArrowRight className="w-10 h-10 text-green-400" />
            Explore the System
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-blue-300 hover:border-blue-500 transition-all cursor-pointer" onClick={() => onNavigate('integrations_hub_new')}>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-6 h-6 text-blue-400" />
                  Integrations Hub
                </CardTitle>
                <CardDescription>Configure all 6 providers</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-2 text-sm text-slate-300 mb-4">
                  <li>• Connection status & health</li>
                  <li>• API credentials & config</li>
                  <li>• Usage tracking & costs</li>
                  <li>• Test connections</li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  View Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card
              className={`border-2 transition-all ${blockDemoNavigation ? 'border-white/10 opacity-70 cursor-not-allowed' : 'border-purple-300 hover:border-purple-500 cursor-pointer'}`}
              onClick={() => {
                if (blockDemoNavigation) return;
                onNavigate('integrations_demo');
              }}
            >
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="w-6 h-6 text-purple-400" />
                  API Demo
                </CardTitle>
                <CardDescription>
                  {blockDemoNavigation
                    ? 'Blocked in production runtime'
                    : 'See the architecture in action'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-2 text-sm text-slate-300 mb-4">
                  <li>• Live check results</li>
                  <li>• Risk intelligence panel</li>
                  <li>• Audit trail & evidence</li>
                  <li>• Orchestration flow</li>
                </ul>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  View Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-300 hover:border-green-500 transition-all cursor-pointer" onClick={() => onNavigate('client_list')}>
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-green-400" />
                  Client List
                </CardTitle>
                <CardDescription>View compliance in action</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-2 text-sm text-slate-300 mb-4">
                  <li>• 10 clients with Tier 1-5 data</li>
                  <li>• Full compliance scores</li>
                  <li>• AI bot status</li>
                  <li>• Transaction monitoring</li>
                </ul>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  View Clients
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Footer */}
        <Card className="border-4 border-purple-300 bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white shadow-2xl">
          <CardContent className="p-12">
            <div className="text-center mb-8">
              <h2 className="text-5xl font-bold mb-4">Production Ready</h2>
              <p className="text-2xl text-white/90">Complete integration layer, ready to connect</p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-green-400 mb-2">6</div>
                <p className="text-white/80">Providers Integrated</p>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-400 mb-2">8</div>
                <p className="text-white/80">API Endpoints</p>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold text-purple-400 mb-2">1</div>
                <p className="text-white/80">Unified Schema</p>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold text-amber-400 mb-2">100%</div>
                <p className="text-white/80">Audit Compliant</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
