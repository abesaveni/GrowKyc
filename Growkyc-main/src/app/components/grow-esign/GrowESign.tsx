import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  FileSignature,
  Upload,
  Users,
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Download,
  Send,
  Plus,
  Search,
  Filter,
  Settings,
  FileText,
  Lock,
  Smartphone,
  Mail,
  Calendar,
  BarChart3,
  ArrowLeft,
  X,
  Edit,
  Trash2,
  Copy,
  History,
  UserCheck,
  MessageSquare,
  Paperclip,
  AlertTriangle,
  CheckSquare,
  FileCheck,
  Key,
  Fingerprint,
  Video,
  Building2,
  Globe,
  Zap,
  TrendingUp,
  Package,
  Folders,
  PlayCircle,
  PauseCircle,
  Target,
  Award,
  Database,
  Code,
  Webhook,
  Link,
  Home
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { toast } from '../../lib/toast';

interface GrowESignProps {
  onSwitchModule?: (module: string) => void;
}

type View = 
  | 'dashboard'
  | 'documents'
  | 'templates'
  | 'workflows'
  | 'signers'
  | 'audit'
  | 'compliance'
  | 'analytics'
  | 'integrations'
  | 'team'
  | 'settings';

export function GrowESign({ onSwitchModule }: GrowESignProps) {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showNewDocumentModal, setShowNewDocumentModal] = useState(false);
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const [showNewWorkflowModal, setShowNewWorkflowModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateCategory, setTemplateCategory] = useState('Finance');
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [showDocumentEditor, setShowDocumentEditor] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<any>(null);
  const [signers, setSigners] = useState<any[]>([]);
  const [showAddSignerModal, setShowAddSignerModal] = useState(false);
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [signerRole, setSignerRole] = useState('Signer');
  const [documentStep, setDocumentStep] = useState(1); // 1: Upload, 2: Add Signers, 3: Place Fields, 4: Review & Send
  const [signatureFields, setSignatureFields] = useState<any[]>([]);
  const [selectedFieldType, setSelectedFieldType] = useState<string>('signature');

  // Mock data
  const dashboardStats = {
    documentsThisMonth: 1247,
    documentsChange: 18,
    completionRate: 94,
    completionChange: 5,
    avgCompletionTime: '1.2 days',
    timeChange: -15,
    activeSigners: 3456,
    signersChange: 12
  };

  const recentDocuments = [
    {
      id: 'DOC-2024-1247',
      name: 'Loan Agreement - Anderson Property Trust',
      template: 'Commercial Loan',
      status: 'in_progress',
      parties: 3,
      completed: 2,
      created: '2024-02-21',
      creator: 'Sarah Johnson'
    },
    {
      id: 'DOC-2024-1246',
      name: 'Employment Contract - Tech Solutions Ltd',
      template: 'Employment Agreement',
      status: 'completed',
      parties: 2,
      completed: 2,
      created: '2024-02-21',
      completedAt: '2024-02-21',
      creator: 'Michael Brown'
    },
    {
      id: 'DOC-2024-1245',
      name: 'NDA - Enterprise Client Onboarding',
      template: 'Confidentiality Agreement',
      status: 'pending',
      parties: 4,
      completed: 0,
      created: '2024-02-20',
      creator: 'Emma Wilson'
    },
    {
      id: 'DOC-2024-1244',
      name: 'Service Agreement - Marketing Services',
      template: 'Service Contract',
      status: 'declined',
      parties: 2,
      completed: 0,
      created: '2024-02-20',
      declinedBy: 'Client',
      creator: 'David Lee'
    }
  ];

  const templates = [
    {
      id: 'TPL-001',
      name: 'Commercial Loan Agreement',
      category: 'Finance',
      description: 'Comprehensive commercial loan documentation',
      parties: 3,
      fields: 24,
      pages: 18,
      usage: 247,
      lastUsed: '2 hours ago',
      compliance: ['APRA', 'ASIC']
    },
    {
      id: 'TPL-002',
      name: 'Employment Agreement',
      category: 'HR',
      description: 'Standard employment contract with Fair Work compliance',
      parties: 2,
      fields: 16,
      pages: 8,
      usage: 523,
      lastUsed: '4 hours ago',
      compliance: ['Fair Work']
    },
    {
      id: 'TPL-003',
      name: 'Confidentiality Agreement',
      category: 'Legal',
      description: 'Mutual NDA for business partnerships',
      parties: 2,
      fields: 10,
      pages: 4,
      usage: 892,
      lastUsed: '1 day ago',
      compliance: ['General']
    },
    {
      id: 'TPL-004',
      name: 'Service Agreement',
      category: 'Commercial',
      description: 'Professional services contract template',
      parties: 2,
      fields: 18,
      pages: 12,
      usage: 456,
      lastUsed: '3 days ago',
      compliance: ['ACL']
    },
    {
      id: 'TPL-005',
      name: 'Property Purchase Contract',
      category: 'Real Estate',
      description: 'Standard property sale and purchase agreement',
      parties: 4,
      fields: 32,
      pages: 24,
      usage: 334,
      lastUsed: '1 week ago',
      compliance: ['REIQ']
    },
    {
      id: 'TPL-006',
      name: 'Partnership Agreement',
      category: 'Corporate',
      description: 'Business partnership formation document',
      parties: 3,
      fields: 28,
      pages: 16,
      usage: 156,
      lastUsed: '2 weeks ago',
      compliance: ['Corporations Act']
    }
  ];

  const workflows = [
    {
      id: 'WF-001',
      name: 'Standard Loan Approval',
      description: 'Sequential approval workflow for loan documents',
      steps: 5,
      avgTime: '2.3 days',
      activeDocuments: 23,
      status: 'active'
    },
    {
      id: 'WF-002',
      name: 'Employment Onboarding',
      description: 'Multi-document onboarding sequence',
      steps: 4,
      avgTime: '1.1 days',
      activeDocuments: 47,
      status: 'active'
    },
    {
      id: 'WF-003',
      name: 'Vendor Approval Process',
      description: 'Approval chain for vendor contracts',
      steps: 6,
      avgTime: '3.5 days',
      activeDocuments: 12,
      status: 'active'
    }
  ];

  const integrations = [
    {
      id: 'int-001',
      name: 'Grow Accounting',
      icon: Building2,
      status: 'connected',
      description: 'Auto-send invoices and financial documents',
      documentsThisMonth: 234
    },
    {
      id: 'int-002',
      name: 'Grow CRM',
      icon: Users,
      status: 'connected',
      description: 'Client contract automation',
      documentsThisMonth: 567
    },
    {
      id: 'int-003',
      name: 'Grow Trust',
      icon: Shield,
      status: 'connected',
      description: 'Trust deed and compliance documents',
      documentsThisMonth: 89
    },
    {
      id: 'int-004',
      name: 'DocuSign',
      icon: FileSignature,
      status: 'available',
      description: 'Import existing DocuSign templates',
      documentsThisMonth: 0
    },
    {
      id: 'int-005',
      name: 'Xero',
      icon: Database,
      status: 'connected',
      description: 'Auto-generate contracts from invoices',
      documentsThisMonth: 123
    },
    {
      id: 'int-006',
      name: 'Slack',
      icon: MessageSquare,
      status: 'connected',
      description: 'Signature notifications',
      documentsThisMonth: 1247
    }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to Grow E-Sign</h1>
            <p className="text-blue-100 text-lg">Enterprise e-signature platform with bank-level compliance</p>
            <div className="flex gap-4 mt-4">
              <Button 
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => setShowNewDocumentModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Document
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/20"
                onClick={() => setCurrentView('templates')}
              >
                <Folders className="w-4 h-4 mr-2" />
                Browse Templates
              </Button>
            </div>
          </div>
          <FileSignature className="w-32 h-32 opacity-20" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-blue-600" />
              <Badge variant="outline" className="bg-green-50 text-green-700">
                +{dashboardStats.documentsChange}%
              </Badge>
            </div>
            <p className="text-2xl font-bold text-gray-900">{dashboardStats.documentsThisMonth}</p>
            <p className="text-sm text-gray-600">Documents This Month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <Badge variant="outline" className="bg-green-50 text-green-700">
                +{dashboardStats.completionChange}%
              </Badge>
            </div>
            <p className="text-2xl font-bold text-gray-900">{dashboardStats.completionRate}%</p>
            <p className="text-sm text-gray-600">Completion Rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-orange-600" />
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {dashboardStats.timeChange}%
              </Badge>
            </div>
            <p className="text-2xl font-bold text-gray-900">{dashboardStats.avgCompletionTime}</p>
            <p className="text-sm text-gray-600">Avg Completion Time</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-purple-600" />
              <Badge variant="outline" className="bg-green-50 text-green-700">
                +{dashboardStats.signersChange}%
              </Badge>
            </div>
            <p className="text-2xl font-bold text-gray-900">{dashboardStats.activeSigners}</p>
            <p className="text-sm text-gray-600">Active Signers</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Documents */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Documents</CardTitle>
              <CardDescription>Your latest signature requests</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setCurrentView('documents')}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    doc.status === 'completed' ? 'bg-green-100' :
                    doc.status === 'in_progress' ? 'bg-blue-100' :
                    doc.status === 'pending' ? 'bg-yellow-100' :
                    'bg-red-100'
                  }`}>
                    <FileCheck className={`w-6 h-6 ${
                      doc.status === 'completed' ? 'text-green-600' :
                      doc.status === 'in_progress' ? 'text-blue-600' :
                      doc.status === 'pending' ? 'text-yellow-600' :
                      'text-red-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                    <div className="flex gap-3 text-sm text-gray-600 mt-1">
                      <span>{doc.id}</span>
                      <span>•</span>
                      <span>{doc.template}</span>
                      <span>•</span>
                      <span>{doc.completed}/{doc.parties} signed</span>
                      <span>•</span>
                      <span>by {doc.creator}</span>
                    </div>
                  </div>
                  <Badge className={
                    doc.status === 'completed' ? 'bg-green-100 text-green-800' :
                    doc.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {doc.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Workflows */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workflows.slice(0, 3).map((wf) => (
                <div key={wf.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{wf.name}</p>
                    <p className="text-xs text-gray-600">{wf.activeDocuments} active</p>
                  </div>
                  <Badge variant="outline">{wf.avgTime}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Popular Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {templates.slice(0, 3).map((tpl) => (
                <div key={tpl.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{tpl.name}</p>
                    <p className="text-xs text-gray-600">{tpl.usage} uses</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <PlayCircle className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Connected Apps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {integrations.filter(i => i.status === 'connected').slice(0, 3).map((int) => (
                <div key={int.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <int.icon className="w-4 h-4 text-gray-600" />
                    <p className="font-medium text-gray-900 text-sm">{int.name}</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Template Library</h2>
          <p className="text-gray-600 mt-1">Pre-configured document templates for common use cases</p>
        </div>
        <Button onClick={() => setShowNewTemplateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search templates..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <Badge variant="outline" className="mt-1">{template.category}</Badge>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{template.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Parties:</span>
                  <span className="font-medium text-gray-900">{template.parties}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fields:</span>
                  <span className="font-medium text-gray-900">{template.fields}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pages:</span>
                  <span className="font-medium text-gray-900">{template.pages}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Usage:</span>
                  <span className="font-medium text-gray-900">{template.usage}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {template.compliance.map((comp) => (
                  <Badge key={comp} variant="secondary" className="text-xs">
                    {comp}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    toast.success(`📄 Opening preview for ${template.name}`);
                    setSelectedTemplate(template.id);
                    // In production, this would open a preview modal with the template
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button size="sm" className="flex-1" onClick={() => {
                  toast.success('Creating document from template...');
                  setSelectedTemplate(template.id);
                  setShowNewDocumentModal(true);
                }}>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Use
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderWorkflows = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Automated Workflows</h2>
          <p className="text-gray-600 mt-1">Create multi-step signing sequences with automation</p>
        </div>
        <Button onClick={() => setShowNewWorkflowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                    <Badge variant="outline" className="mt-1 bg-green-50 text-green-700">
                      {workflow.status}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-sm text-gray-600 mb-4">{workflow.description}</p>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{workflow.steps}</p>
                  <p className="text-xs text-gray-600">Steps</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{workflow.avgTime}</p>
                  <p className="text-xs text-gray-600">Avg Time</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{workflow.activeDocuments}</p>
                  <p className="text-xs text-gray-600">Active</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button size="sm" className="flex-1">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Start Workflow
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workflow Builder Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Builder</CardTitle>
          <CardDescription>Visual workflow designer (coming soon)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Drag & drop workflow builder</p>
            <p className="text-sm text-gray-500">Create complex multi-step signing workflows with conditional logic</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Integrations</h2>
          <p className="text-gray-600 mt-1">Connect Grow E-Sign with your favorite tools</p>
        </div>
        <Button variant="outline">
          <Code className="w-4 h-4 mr-2" />
          API Documentation
        </Button>
      </div>

      {/* Integration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Connected Apps</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {integrations.filter(i => i.status === 'connected').length}
                </p>
              </div>
              <Link className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">API Calls This Month</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">24,567</p>
              </div>
              <Database className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Webhooks Active</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
              </div>
              <Webhook className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <integration.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                    <Badge 
                      variant="outline" 
                      className={integration.status === 'connected' ? 'bg-green-50 text-green-700 border-green-300' : ''}
                    >
                      {integration.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{integration.description}</p>

              {integration.status === 'connected' && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-600">Documents this month</p>
                  <p className="text-lg font-bold text-gray-900">{integration.documentsThisMonth}</p>
                </div>
              )}

              <Button 
                variant={integration.status === 'connected' ? 'outline' : 'default'}
                size="sm" 
                className="w-full"
              >
                {integration.status === 'connected' ? 'Configure' : 'Connect'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* API Section */}
      <Card>
        <CardHeader>
          <CardTitle>Developer API</CardTitle>
          <CardDescription>Build custom integrations with our REST API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-900 text-white p-4 rounded-lg font-mono text-sm">
              <div className="text-green-400">POST</div>
              <div className="mt-2">https://api.grow.com/esign/v1/documents</div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Code className="w-4 h-4 mr-2" />
                View Documentation
              </Button>
              <Button variant="outline">
                <Key className="w-4 h-4 mr-2" />
                Get API Key
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics & Reporting</h2>
        <p className="text-gray-600 mt-1">Track performance and compliance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-blue-600" />
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">1,247</p>
            <p className="text-sm text-gray-600">Total Documents</p>
            <p className="text-xs text-green-600 mt-1">+18% vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">94%</p>
            <p className="text-sm text-gray-600">Completion Rate</p>
            <p className="text-xs text-green-600 mt-1">+5% vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-orange-600" />
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">1.2d</p>
            <p className="text-sm text-gray-600">Avg Completion</p>
            <p className="text-xs text-green-600 mt-1">15% faster</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-8 h-8 text-purple-600" />
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">100%</p>
            <p className="text-sm text-gray-600">Compliance</p>
            <p className="text-xs text-green-600 mt-1">Bank Level</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Documents Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Line chart showing document trends</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completion by Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Bar chart showing template performance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Template Performance</CardTitle>
          <CardDescription>Completion rates and average times by template</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {templates.slice(0, 5).map((template) => (
              <div key={template.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{template.name}</h4>
                  <p className="text-sm text-gray-600">{template.usage} uses this month</p>
                </div>
                <div className="flex gap-6">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">96%</p>
                    <p className="text-xs text-gray-600">Completion</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">1.4d</p>
                    <p className="text-xs text-gray-600">Avg Time</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">Configure Grow E-Sign preferences</p>
      </div>

      {/* Organization Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Organization Name</Label>
            <Input defaultValue="Acme Financial Services" className="mt-2" />
          </div>
          <div>
            <Label>Default Sender Name</Label>
            <Input defaultValue="Acme E-Sign Team" className="mt-2" />
          </div>
          <div>
            <Label>Reply-to Email</Label>
            <Input type="email" defaultValue="esign@acme.com" className="mt-2" />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security & Compliance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Require 2FA for Signers</h4>
              <p className="text-sm text-gray-600">SMS or email verification required</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">IP Address Logging</h4>
              <p className="text-sm text-gray-600">Record IP for all signatures</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Audit Trail Export</h4>
              <p className="text-sm text-gray-600">Allow PDF audit trail downloads</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Logo</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Upload your logo</p>
            </div>
          </div>
          <div>
            <Label>Brand Color</Label>
            <Input type="color" defaultValue="#2563eb" className="mt-2 h-12" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDocumentEditor = () => (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => {
              setShowDocumentEditor(false);
              setCurrentDocument(null);
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{currentDocument.name}</h2>
            <p className="text-sm text-gray-600">{currentDocument.id} • Created {currentDocument.created}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button 
            onClick={() => {
              if (signers.length === 0) {
                toast.error('Please add at least one signer');
                return;
              }
              toast.success(`Document sent to ${signers.length} signer(s)!`);
              setShowDocumentEditor(false);
              setCurrentDocument(null);
              setSigners([]);
            }}
          >
            <Send className="w-4 h-4 mr-2" />
            Send for Signature
          </Button>
        </div>
      </div>

      {/* Progress Steps - CLICKABLE */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <button onClick={() => setDocumentStep(2)} className="flex items-center gap-3 cursor-pointer hover:opacity-80">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${documentStep >= 1 ? 'bg-green-100' : 'bg-gray-100'}`}>
                <CheckCircle className={`w-5 h-5 ${documentStep >= 1 ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className={`font-medium ${documentStep >= 1 ? 'text-gray-900' : 'text-gray-600'}`}>1. Upload Document</p>
                <p className="text-xs text-gray-600">Complete</p>
              </div>
            </button>
            <div className="h-px flex-1 bg-gray-300 mx-4" />
            <button onClick={() => setDocumentStep(2)} className="flex items-center gap-3 cursor-pointer hover:opacity-80">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${documentStep >= 2 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Users className={`w-5 h-5 ${documentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className={`font-medium ${documentStep >= 2 ? 'text-gray-900' : 'text-gray-600'}`}>2. Add Signers</p>
                <p className="text-xs text-gray-600">{signers.length} added</p>
              </div>
            </button>
            <div className="h-px flex-1 bg-gray-300 mx-4" />
            <button onClick={() => { if (signers.length > 0) { setDocumentStep(3); } else { toast.error('Add signers first'); } }} className="flex items-center gap-3 cursor-pointer hover:opacity-80">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${documentStep >= 3 ? 'bg-purple-100' : 'bg-gray-100'}`}>
                <FileSignature className={`w-5 h-5 ${documentStep >= 3 ? 'text-purple-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className={`font-medium ${documentStep >= 3 ? 'text-gray-900' : 'text-gray-600'}`}>3. Place Fields</p>
                <p className="text-xs text-gray-600">{signatureFields.length} fields</p>
              </div>
            </button>
            <div className="h-px flex-1 bg-gray-300 mx-4" />
            <button onClick={() => { if (signers.length > 0) { setDocumentStep(4); } else { toast.error('Add signers first'); } }} className="flex items-center gap-3 cursor-pointer hover:opacity-80">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${documentStep >= 4 ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Send className={`w-5 h-5 ${documentStep >= 4 ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className={`font-medium ${documentStep >= 4 ? 'text-gray-900' : 'text-gray-600'}`}>4. Review & Send</p>
                <p className="text-xs text-gray-600">Ready</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Add Signers */}
      {documentStep === 2 && (
      <div className="grid grid-cols-3 gap-6">
        {/* Left: Document Preview */}
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Document Preview</CardTitle>
              <CardDescription>Your document is ready for signature fields</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50 min-h-[600px] flex flex-col items-center justify-center">
                <FileText className="w-24 h-24 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">{currentDocument.name}</p>
                <p className="text-sm text-gray-600 mb-4">
                  PDF document ready for signatures
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Document
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Add Signature Fields
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Signers Panel */}
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Signers & Recipients</CardTitle>
                  <CardDescription>{signers.length} added</CardDescription>
                </div>
                <Button size="sm" onClick={() => setShowAddSignerModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {signers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-4">
                    No signers added yet
                  </p>
                  <Button size="sm" onClick={() => setShowAddSignerModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Signer
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {signers.map((signer, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <UserCheck className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{signer.name}</p>
                            <p className="text-sm text-gray-600">{signer.email}</p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {signer.role}
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSigners(signers.filter((_, i) => i !== index));
                            toast.success('Signer removed');
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Signing Options */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Signing Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Require 2FA</p>
                  <p className="text-xs text-gray-600">SMS verification</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Signing Order</p>
                  <p className="text-xs text-gray-600">Sequential signing</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Expiry Date</p>
                  <p className="text-xs text-gray-600">30 days</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Navigation Button */}
          <Button 
            className="w-full mt-6"
            disabled={signers.length === 0}
            onClick={() => {
              if (signers.length === 0) {
                toast.error('Please add at least one signer');
                return;
              }
              setDocumentStep(3);
            }}
          >
            Next: Place Fields
            <FileSignature className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
      )}

      {/* Step 3: Place Signature Fields */}
      {documentStep === 3 && (
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Place Signature Fields</CardTitle>
              <CardDescription>Add fields for each signer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white border-2 border-gray-300 rounded-lg p-8 min-h-[500px]">
                <div className="text-center mb-6">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="font-semibold text-gray-900">{currentDocument.name}</p>
                  <p className="text-sm text-gray-600">Use tools on the right to add fields</p>
                </div>
                <div className="space-y-3">
                  {signatureFields.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <FileSignature className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">No fields added yet</p>
                    </div>
                  ) : (
                    signatureFields.map((field, index) => (
                      <div key={index} className="border-2 border-blue-500 bg-blue-50 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileSignature className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-semibold">{field.type} Field</p>
                            <p className="text-xs text-gray-600">For: {field.signerName}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => {
                          setSignatureFields(signatureFields.filter((_, i) => i !== index));
                          toast.success('Field removed');
                        }}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setDocumentStep(2)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => setDocumentStep(4)}>
              Continue
              <Send className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Add Fields</CardTitle>
              <CardDescription>{signatureFields.length} fields</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {signers.map((signer, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <p className="text-sm font-semibold">{signer.name}</p>
                  </div>
                  <div className="space-y-2">
                    <Button size="sm" variant="outline" className="w-full justify-start bg-white" onClick={() => {
                      setSignatureFields([...signatureFields, { type: 'Signature', signerName: signer.name, signerEmail: signer.email }]);
                      toast.success(`Signature field added`);
                    }}>
                      <FileSignature className="w-4 h-4 mr-2" />
                      Signature
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start bg-white" onClick={() => {
                      setSignatureFields([...signatureFields, { type: 'Initial', signerName: signer.name, signerEmail: signer.email }]);
                      toast.success(`Initial field added`);
                    }}>
                      <Edit className="w-4 h-4 mr-2" />
                      Initial
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start bg-white" onClick={() => {
                      setSignatureFields([...signatureFields, { type: 'Date', signerName: signer.name, signerEmail: signer.email }]);
                      toast.success(`Date field added`);
                    }}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Date
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      )}

      {/* Step 4: Review & Send */}
      {documentStep === 4 && (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Review Before Sending</CardTitle>
            <CardDescription>Confirm all details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Document</h3>
              <div className="bg-gray-50 rounded p-3 space-y-1">
                <p className="text-sm"><strong>Name:</strong> {currentDocument.name}</p>
                <p className="text-sm"><strong>ID:</strong> {currentDocument.id}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Signers ({signers.length})</h3>
              <div className="space-y-2">
                {signers.map((signer, i) => (
                  <div key={i} className="bg-gray-50 rounded p-3 flex items-center gap-3">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">{signer.name}</p>
                      <p className="text-xs text-gray-600">{signer.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Fields ({signatureFields.length})</h3>
              {signatureFields.length > 0 ? (
                <div className="bg-gray-50 rounded p-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{signatureFields.filter(f => f.type === 'Signature').length}</p>
                    <p className="text-xs text-gray-600">Signatures</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{signatureFields.filter(f => f.type === 'Initial').length}</p>
                    <p className="text-xs text-gray-600">Initials</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{signatureFields.filter(f => f.type === 'Date').length}</p>
                    <p className="text-xs text-gray-600">Dates</p>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-center">
                  <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm text-yellow-800">No fields placed</p>
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setDocumentStep(3)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button className="ml-auto" onClick={() => {
                toast.success(`Document sent to ${signers.length} signer(s)!`);
                setShowDocumentEditor(false);
                setCurrentDocument(null);
                setSigners([]);
                setSignatureFields([]);
                setDocumentStep(2);
              }}>
                <Send className="w-4 h-4 mr-2" />
                Send Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      )}
    </div>
  );

  const renderContent = () => {
    // If document editor is open, show it instead
    if (showDocumentEditor && currentDocument) {
      return renderDocumentEditor();
    }
    
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'templates':
        return renderTemplates();
      case 'workflows':
        return renderWorkflows();
      case 'integrations':
        return renderIntegrations();
      case 'analytics':
        return renderAnalytics();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <FileSignature className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Grow E-Sign</h1>
                  <p className="text-xs text-gray-600">Enterprise E-Signature Platform</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => onSwitchModule?.('grow_hq')}>
                <Building2 className="w-4 h-4 mr-2" />
                Switch Module
              </Button>
              <Button onClick={() => setShowNewDocumentModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Document
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-1 mt-4 border-b border-gray-200">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'templates', label: 'Templates', icon: Folders },
              { id: 'workflows', label: 'Workflows', icon: Zap },
              { id: 'signers', label: 'Signers', icon: Users },
              { id: 'audit', label: 'Audit', icon: History },
              { id: 'compliance', label: 'Compliance', icon: Shield },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'integrations', label: 'Integrations', icon: Link },
              { id: 'team', label: 'Team', icon: Users },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as View)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    currentView === item.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {renderContent()}
      </div>

      {/* New Document Modal */}
      <Dialog open={showNewDocumentModal} onOpenChange={setShowNewDocumentModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Document</DialogTitle>
            <DialogDescription>
              Upload a document or start from a template
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Template Selection */}
            <div>
              <Label>Start from Template</Label>
              <select className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg">
                <option>Select a template...</option>
                {templates.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="text-center text-gray-500 py-2">
              — OR —
            </div>

            {/* Upload */}
            <div>
              <Label>Upload Document</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900 mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
              </div>
            </div>

            {/* Document Name */}
            <div>
              <Label>Document Name</Label>
              <Input placeholder="e.g., Loan Agreement - Smith Property" className="mt-2" value={documentName} onChange={(e) => setDocumentName(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDocumentModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (!documentName.trim()) {
                toast.error('Please enter a document name');
                return;
              }
              
              // Create new document
              const newDoc = {
                id: `DOC-2024-${Math.floor(Math.random() * 10000)}`,
                name: documentName,
                template: selectedTemplate || 'Custom Document',
                status: 'draft',
                created: new Date().toISOString().split('T')[0],
                creator: 'You'
              };
              
              setCurrentDocument(newDoc);
              setSigners([]);
              setShowNewDocumentModal(false);
              setShowDocumentEditor(true);
              setDocumentStep(2); // Start at step 2 (Add Signers)
              setDocumentName('');
              toast.success('Document created! Add signers to continue.');
            }}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Template Modal */}
      <Dialog open={showNewTemplateModal} onOpenChange={setShowNewTemplateModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>
              Build a reusable document template
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Template Name</Label>
              <Input placeholder="e.g., Standard Employment Agreement" className="mt-2" value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
            </div>
            <div>
              <Label>Category</Label>
              <select 
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg"
                value={templateCategory}
                onChange={(e) => setTemplateCategory(e.target.value)}
              >
                <option>Finance</option>
                <option>HR</option>
                <option>Legal</option>
                <option>Commercial</option>
                <option>Real Estate</option>
                <option>Corporate</option>
              </select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea rows={3} placeholder="Describe when to use this template..." className="mt-2" value={templateDescription} onChange={(e) => setTemplateDescription(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowNewTemplateModal(false);
              setTemplateName('');
              setTemplateDescription('');
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (!templateName.trim()) {
                toast.error('Please enter a template name');
                return;
              }
              
              // Create new template (in production, this would call an API)
              const newTemplate = {
                id: `TPL-${String(templates.length + 1).padStart(3, '0')}`,
                name: templateName,
                category: templateCategory,
                description: templateDescription || 'Custom template',
                parties: 2,
                fields: 0,
                pages: 1,
                usage: 0,
                lastUsed: 'Just created',
                compliance: ['General']
              };
              
              toast.success(`✅ Template "${templateName}" created successfully!`);
              setShowNewTemplateModal(false);
              setTemplateName('');
              setTemplateDescription('');
              setTemplateCategory('Finance');
              
              // In production, would refresh the templates list or add to state
            }}>
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Workflow Modal */}
      <Dialog open={showNewWorkflowModal} onOpenChange={setShowNewWorkflowModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
            <DialogDescription>
              Automate multi-step signing processes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Workflow Name</Label>
              <Input placeholder="e.g., Client Onboarding Process" className="mt-2" value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea rows={3} placeholder="Describe the workflow purpose..." className="mt-2" value={workflowDescription} onChange={(e) => setWorkflowDescription(e.target.value)} />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Configure workflow steps in the visual builder after creation
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewWorkflowModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success('Workflow created! Configure steps in the builder.');
              setShowNewWorkflowModal(false);
            }}>
              Create Workflow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Signer Modal */}
      <Dialog open={showAddSignerModal} onOpenChange={setShowAddSignerModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Signer</DialogTitle>
            <DialogDescription>
              Add a signer or recipient to this document
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input 
                placeholder="e.g., John Smith" 
                className="mt-2" 
                value={signerName} 
                onChange={(e) => setSignerName(e.target.value)} 
              />
            </div>
            <div>
              <Label>Email Address</Label>
              <Input 
                type="email"
                placeholder="e.g., john.smith@company.com" 
                className="mt-2" 
                value={signerEmail} 
                onChange={(e) => setSignerEmail(e.target.value)} 
              />
            </div>
            <div>
              <Label>Role</Label>
              <select 
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg"
                value={signerRole}
                onChange={(e) => setSignerRole(e.target.value)}
              >
                <option>Signer</option>
                <option>Approver</option>
                <option>CC Recipient</option>
                <option>Witness</option>
              </select>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                The signer will receive an email with a secure link to sign the document
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddSignerModal(false);
              setSignerName('');
              setSignerEmail('');
              setSignerRole('Signer');
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (!signerName.trim() || !signerEmail.trim()) {
                toast.error('Please enter both name and email');
                return;
              }
              
              setSigners([...signers, {
                name: signerName,
                email: signerEmail,
                role: signerRole
              }]);
              
              toast.success(`${signerName} added as signer`);
              setShowAddSignerModal(false);
              setSignerName('');
              setSignerEmail('');
              setSignerRole('Signer');
            }}>
              Add Signer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}