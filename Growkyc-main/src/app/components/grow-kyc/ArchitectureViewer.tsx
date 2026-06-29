import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Users,
  TrendingUp,
  Shield,
  FileText,
  Network,
  ArrowLeft,
  CheckCircle,
  Zap,
  Lock,
  Activity,
  Eye,
  AlertTriangle,
  Database,
  Globe,
  Sparkles,
  GitBranch,
  Bell,
  Clock,
  BarChart3
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface ArchitectureViewerProps {
  onBack: () => void;
}

export function ArchitectureViewer({ onBack }: ArchitectureViewerProps) {
  const [selectedLayer, setSelectedLayer] = useState<number>(1);

  const layers = [
    {
      id: 1,
      name: 'Client & Entity Layer',
      icon: Users,
      color: 'blue',
      description: 'Onboarding, ownership mapping, and registry intelligence',
      modules: [
        { name: 'Self-Onboarding Engine', description: 'Interactive adaptive onboarding for 6 entity types' },
        { name: 'Ownership & Control Mapping', description: 'Visual graph, beneficial owner detection, network analysis' },
        { name: 'Multi-Entity Support', description: 'Independent workflows under master profile' },
        { name: 'ASIC Smart Autofill', description: 'Registry lookup and data pre-population' },
      ],
      features: [
        'Dynamic question logic',
        'Save & resume capability',
        'Risk preview indicator',
        'Digital signature capture',
        'Consent management',
        'Version history'
      ]
    },
    {
      id: 2,
      name: 'Risk & Intelligence Layer',
      icon: TrendingUp,
      color: 'purple',
      description: 'AI-powered risk assessment and graph intelligence',
      modules: [
        { name: 'Risk Engine', description: 'Multi-dimensional risk scoring across 9 factors' },
        { name: 'AI Risk Intelligence', description: 'ML-powered probability scoring and false positive suppression' },
        { name: 'Graph Intelligence Engine', description: 'Multi-layer entity graph with clustering detection' },
        { name: 'Transaction Monitoring', description: 'Real-time pattern detection and alert generation' },
      ],
      features: [
        'Risk probability scoring',
        'Director clustering',
        'Insolvency propagation',
        'Peer benchmarking',
        'Structuring detection',
        'Cross-border patterns'
      ]
    },
    {
      id: 3,
      name: 'Compliance Workflow Layer',
      icon: Shield,
      color: 'green',
      description: 'KYC verification, case management, and hard gate enforcement',
      modules: [
        { name: 'KYC Module', description: 'Digital ID, sanctions, PEP, adverse media, insolvency checks' },
        { name: 'Case Management', description: 'CDD/EDD cases with SLA tracking and escalation' },
        { name: 'Regulatory Clocks', description: 'SMR, TTR, RG78 deadline tracking' },
        { name: 'Hard Gate Enforcement', description: 'Automatic engagement restriction on critical hits' },
      ],
      features: [
        'Multi-provider integration',
        'Evidence normalization',
        'Three lines of defence',
        'Decision logging',
        'Override workflows',
        'Countdown timers'
      ]
    },
    {
      id: 4,
      name: 'Governance & Reporting Layer',
      icon: FileText,
      color: 'amber',
      description: 'Breach management, regulatory reporting, and audit readiness',
      modules: [
        { name: 'Governance Module', description: 'AML program tracking, policy library, compliance calendar' },
        { name: 'Breach & Incident Management', description: 'Significance testing, regulatory reporting, remediation' },
        { name: 'Credit & Responsible Lending', description: 'NCCP serviceability and credit decision logging' },
        { name: 'Compliance Reporting', description: 'SMR, TTR, ASIC reports, audit export bundles' },
      ],
      features: [
        'Board approval logs',
        'Root cause analysis',
        'Privacy breach workflow',
        'Retention enforcement',
        'Audit mode access',
        'Redaction controls'
      ]
    },
    {
      id: 5,
      name: 'Infrastructure & Integration Layer',
      icon: Network,
      color: 'pink',
      description: 'API platform, security controls, and evidence management',
      modules: [
        { name: 'Integration Suite', description: 'Multi-provider connectivity with failover routing' },
        { name: 'Developer Platform', description: 'API console, webhooks, SDK documentation' },
        { name: 'Security & Zero-Trust', description: 'RBAC, device management, access anomaly detection' },
        { name: 'Evidence Vault', description: 'SHA256 hashing, 7-year retention, immutable logs' },
      ],
      features: [
        'Webhook ingestion',
        'Provider SLA tracking',
        'Tenant isolation',
        'Field-level masking',
        'Encryption at rest',
        'Access history tracking'
      ]
    }
  ];

  const currentLayer = layers[selectedLayer - 1];
  const LayerIcon = currentLayer.icon;

  // Helper function to get color classes
  const getColorClasses = (color: string, type: 'bg' | 'text' | 'border' | 'ring') => {
    const colorMap: Record<string, Record<string, string>> = {
      blue: {
        bg: 'bg-blue-500/20',
        bgDark: 'bg-blue-500/30',
        text: 'text-blue-400',
        textLight: 'text-blue-300',
        border: 'border-blue-400',
        borderLight: 'border-blue-400/30',
        borderMedium: 'border-blue-400/50',
        ring: 'ring-blue-400',
        gradient: 'from-blue-500/20 to-blue-600/20'
      },
      purple: {
        bg: 'bg-purple-500/20',
        bgDark: 'bg-purple-500/30',
        text: 'text-purple-400',
        textLight: 'text-purple-300',
        border: 'border-purple-400',
        borderLight: 'border-purple-400/30',
        borderMedium: 'border-purple-400/50',
        ring: 'ring-purple-400',
        gradient: 'from-purple-500/20 to-purple-600/20'
      },
      green: {
        bg: 'bg-green-500/20',
        bgDark: 'bg-green-500/30',
        text: 'text-green-400',
        textLight: 'text-green-300',
        border: 'border-green-400',
        borderLight: 'border-green-400/30',
        borderMedium: 'border-green-400/50',
        ring: 'ring-green-400',
        gradient: 'from-green-500/20 to-green-600/20'
      },
      amber: {
        bg: 'bg-amber-500/20',
        bgDark: 'bg-amber-500/30',
        text: 'text-amber-400',
        textLight: 'text-amber-300',
        border: 'border-amber-400',
        borderLight: 'border-amber-400/30',
        borderMedium: 'border-amber-400/50',
        ring: 'ring-amber-400',
        gradient: 'from-amber-500/20 to-amber-600/20'
      },
      pink: {
        bg: 'bg-pink-500/20',
        bgDark: 'bg-pink-500/30',
        text: 'text-pink-400',
        textLight: 'text-pink-300',
        border: 'border-pink-400',
        borderLight: 'border-pink-400/30',
        borderMedium: 'border-pink-400/50',
        ring: 'ring-pink-400',
        gradient: 'from-pink-500/20 to-pink-600/20'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  const layerColors = getColorClasses(currentLayer.color, 'bg');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white hover:bg-white/10 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Overview
            </Button>
            <h1 className="text-4xl font-bold text-white mb-2">System Architecture</h1>
            <p className="text-gray-300">5-Layer Modular Compliance Infrastructure</p>
          </div>
          <Badge className="bg-green-500/20 text-green-300 border-green-500/50 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Enterprise Architecture
          </Badge>
        </div>

        {/* Layer Navigation */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {layers.map((layer) => {
            const Icon = layer.icon;
            const isSelected = selectedLayer === layer.id;
            const colors = getColorClasses(layer.color, 'bg');
            return (
              <Card
                key={layer.id}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? `${colors.bgDark} ${colors.border} ring-2 ${colors.ring}`
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
                onClick={() => setSelectedLayer(layer.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <div className={`text-xs font-medium mb-1 ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                    Layer {layer.id}
                  </div>
                  <h3 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                    {layer.name.replace(' Layer', '')}
                  </h3>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Layer Detail */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 mb-8">
          <CardHeader className={`bg-gradient-to-r ${layerColors.gradient} border-b border-white/10`}>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 ${layerColors.bgDark} rounded-2xl flex items-center justify-center`}>
                <LayerIcon className={`w-10 h-10 ${layerColors.textLight}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-white text-2xl">{currentLayer.name}</CardTitle>
                  <Badge className={`${layerColors.bg} ${layerColors.textLight} ${layerColors.borderMedium}`}>
                    Layer {currentLayer.id}
                  </Badge>
                </div>
                <CardDescription className="text-gray-300 text-base">
                  {currentLayer.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <Tabs defaultValue="modules" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/5">
                <TabsTrigger value="modules" className="data-[state=active]:bg-white/10">
                  Core Modules
                </TabsTrigger>
                <TabsTrigger value="features" className="data-[state=active]:bg-white/10">
                  Key Features
                </TabsTrigger>
              </TabsList>

              <TabsContent value="modules" className="space-y-4">
                {currentLayer.modules.map((module, index) => (
                  <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 ${layerColors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <CheckCircle className={`w-6 h-6 ${layerColors.text}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-lg mb-2">{module.name}</h3>
                          <p className="text-gray-300 text-sm">{module.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="features">
                <div className="grid grid-cols-2 gap-4">
                  {currentLayer.features.map((feature, index) => (
                    <Card key={index} className="bg-white/5 border-white/10">
                      <CardContent className="p-4 flex items-center gap-3">
                        <Zap className={`w-5 h-5 ${layerColors.text} flex-shrink-0`} />
                        <span className="text-white text-sm font-medium">{feature}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Integration Flow */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Layer Integration Flow</CardTitle>
            <CardDescription className="text-gray-300">
              How the layers work together
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {layers.map((layer, index) => {
                const Icon = layer.icon;
                const colors = getColorClasses(layer.color, 'bg');
                return (
                  <div key={layer.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-20 h-20 ${colors.bg} rounded-2xl flex items-center justify-center mb-3 border-2 ${colors.borderMedium}`}>
                        <Icon className={`w-10 h-10 ${colors.text}`} />
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-400 mb-1">Layer {layer.id}</div>
                        <div className="text-sm font-bold text-white max-w-[100px]">
                          {layer.name.replace(' Layer', '')}
                        </div>
                      </div>
                    </div>
                    {index < layers.length - 1 && (
                      <div className="flex items-center mx-2">
                        <div className="w-12 h-0.5 bg-gradient-to-r from-white/30 to-white/10" />
                        <div className="text-white/30">→</div>
                        <div className="w-12 h-0.5 bg-gradient-to-r from-white/10 to-white/30" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}