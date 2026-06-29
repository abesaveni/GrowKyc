import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  Settings, 
  Briefcase,
  Calculator,
  FileText,
  Power,
  Database,
  Globe,
  Mail,
  Bell,
  Shield,
  Clock,
  DollarSign
} from 'lucide-react';
import { toast } from '../../lib/toast';

interface ModuleConfig {
  id: string;
  name: string;
  icon: any;
  enabled: boolean;
  version: string;
  environment: 'production' | 'staging' | 'development';
  settings: {
    apiEndpoint: string;
    database: string;
    maxUsers: number;
    features: string[];
  };
}

const moduleConfigs: ModuleConfig[] = [
  {
    id: 'Grow MIP',
    name: 'Grow MIP',
    icon: Briefcase,
    enabled: true,
    version: '2.4.1',
    environment: 'production',
    settings: {
      apiEndpoint: 'https://api.Grow MIP.com/v2',
      database: 'Grow MIP-prod-au-east',
      maxUsers: 5000,
      features: ['Deals', 'Auctions', 'Contracts', 'Escrow', 'KYC']
    }
  },
  {
    id: 'grow_accounting',
    name: 'Grow Accounting',
    icon: Calculator,
    enabled: true,
    version: '1.8.3',
    environment: 'production',
    settings: {
      apiEndpoint: 'https://api.grow-accounting.com/v1',
      database: 'accounting-prod-au-east',
      maxUsers: 1000,
      features: ['Invoices', 'Bills', 'Clients', 'Reports', 'Transactions']
    }
  },
  {
    id: 'pfa',
    name: 'PFA',
    icon: FileText,
    enabled: false,
    version: '0.5.0',
    environment: 'development',
    settings: {
      apiEndpoint: 'https://api-dev.pfa.com/v1',
      database: 'pfa-dev-au-east',
      maxUsers: 100,
      features: ['Client Management', 'Financial Planning', 'Investment Advice']
    }
  }
];

export function ModuleSettings() {
  const [modules, setModules] = useState(moduleConfigs);
  const [selectedModule, setSelectedModule] = useState<ModuleConfig | null>(modules[0]);

  const toggleModule = (moduleId: string) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, enabled: !m.enabled } : m
    ));
    // Update selectedModule if it's the one being toggled
    if (selectedModule?.id === moduleId) {
      setSelectedModule(prev => prev ? { ...prev, enabled: !prev.enabled } : null);
    }
    toast.success(
      modules.find(m => m.id === moduleId)?.enabled 
        ? 'Module disabled' 
        : 'Module enabled'
    );
  };

  const updateSelectedModule = (updates: Partial<ModuleConfig>) => {
    if (!selectedModule) return;
    const updated = { ...selectedModule, ...updates };
    setSelectedModule(updated);
    setModules(modules.map(m => m.id === selectedModule.id ? updated : m));
  };

  const getStatusBadge = (enabled: boolean) => {
    return enabled ? (
      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
        <Power className="w-3 h-3" />
        Active
      </span>
    ) : (
      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full flex items-center gap-1">
        <Power className="w-3 h-3" />
        Inactive
      </span>
    );
  };

  const getEnvironmentBadge = (env: string) => {
    const colors = {
      production: 'bg-green-100 text-green-700',
      staging: 'bg-yellow-100 text-yellow-700',
      development: 'bg-blue-100 text-blue-700'
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${colors[env as keyof typeof colors]}`}>
        {env}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Module Settings</h1>
          <p className="text-gray-600">Configure and manage module settings</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Settings className="w-4 h-4 mr-2" />
          Global Settings
        </Button>
      </div>

      {/* Module Cards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Card 
              key={module.id}
              className={`cursor-pointer transition-all ${
                selectedModule?.id === module.id 
                  ? 'ring-2 ring-indigo-600 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedModule(module)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  {getStatusBadge(module.enabled)}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{module.name}</h3>
                <p className="text-xs text-gray-500 mb-3">Version {module.version}</p>
                {getEnvironmentBadge(module.environment)}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Module Configuration */}
      {selectedModule && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* General Settings */}
          <Card className="lg:col-span-2">
            <CardHeader className="border-b">
              <CardTitle>General Configuration</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">Module Status</h3>
                  <p className="text-sm text-gray-600">
                    {selectedModule.enabled ? 'Module is currently active' : 'Module is currently disabled'}
                  </p>
                </div>
                <Button
                  variant={selectedModule.enabled ? 'outline' : 'default'}
                  onClick={() => toggleModule(selectedModule.id)}
                  className={selectedModule.enabled ? 'border-red-600 text-red-600 hover:bg-red-50' : ''}
                >
                  {selectedModule.enabled ? 'Disable Module' : 'Enable Module'}
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Module Name</Label>
                  <Input 
                    value={selectedModule.name}
                    className="mt-1"
                    disabled
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Version</Label>
                  <Input 
                    value={selectedModule.version}
                    className="mt-1"
                    disabled
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Environment</Label>
                  <select 
                    value={selectedModule.environment}
                    onChange={(e) => updateSelectedModule({ environment: e.target.value as ModuleConfig['environment'] })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="production">Production</option>
                    <option value="staging">Staging</option>
                    <option value="development">Development</option>
                  </select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    API Endpoint
                  </Label>
                  <Input 
                    value={selectedModule.settings.apiEndpoint}
                    onChange={(e) => updateSelectedModule({ 
                      settings: { ...selectedModule.settings, apiEndpoint: e.target.value }
                    })}
                    className="mt-1 font-mono text-sm"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Database Connection
                  </Label>
                  <Input 
                    value={selectedModule.settings.database}
                    onChange={(e) => updateSelectedModule({ 
                      settings: { ...selectedModule.settings, database: e.target.value }
                    })}
                    className="mt-1 font-mono text-sm"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Maximum Users</Label>
                  <Input 
                    type="number"
                    value={selectedModule.settings.maxUsers}
                    onChange={(e) => updateSelectedModule({ 
                      settings: { ...selectedModule.settings, maxUsers: parseInt(e.target.value) }
                    })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Save Changes
                </Button>
                <Button variant="outline">
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Module Features */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {selectedModule.settings.features.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-medium text-gray-900">{feature}</span>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* System Configuration */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>System-Wide Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-5 h-5" />
                <h3 className="font-semibold">Email</h3>
              </div>
              <p className="text-sm text-gray-600">Configure SMTP and email templates</p>
              <Button variant="outline" size="sm" className="w-full">
                Configure
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Bell className="w-5 h-5" />
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <p className="text-sm text-gray-600">Manage notification settings</p>
              <Button variant="outline" size="sm" className="w-full">
                Configure
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Shield className="w-5 h-5" />
                <h3 className="font-semibold">Security</h3>
              </div>
              <p className="text-sm text-gray-600">Security and authentication</p>
              <Button variant="outline" size="sm" className="w-full">
                Configure
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-5 h-5" />
                <h3 className="font-semibold">Backups</h3>
              </div>
              <p className="text-sm text-gray-600">Automated backup schedule</p>
              <Button variant="outline" size="sm" className="w-full">
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
