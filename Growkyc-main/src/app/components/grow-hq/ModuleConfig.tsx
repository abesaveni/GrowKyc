import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  X,
  Settings,
  Users,
  Shield,
  Bell,
  Key,
  Palette,
  Globe,
  Database,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  Save,
  Trash2,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

interface ModuleConfigProps {
  module: {
    id: string;
    name: string;
    subtitle: string;
    users: number;
    plan: string;
  };
  onClose: () => void;
  onSave: (config: any) => void;
  onDeactivate: () => void;
}

export function ModuleConfig({ module, onClose, onSave, onDeactivate }: ModuleConfigProps) {
  const [userLimit, setUserLimit] = useState(module.users.toString());
  const [autoProvision, setAutoProvision] = useState(true);
  const [ssoEnabled, setSSoEnabled] = useState(true);
  const [apiAccess, setApiAccess] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [auditLogging, setAuditLogging] = useState(true);
  const [dataRetention, setDataRetention] = useState('90');

  const handleSave = () => {
    onSave({
      userLimit: parseInt(userLimit),
      autoProvision,
      ssoEnabled,
      apiAccess,
      emailNotifications,
      auditLogging,
      dataRetention: parseInt(dataRetention)
    });
    toast.success(`${module.name} configuration saved!`);
    onClose();
  };

  const handleDeactivate = () => {
    if (confirm(`Are you sure you want to deactivate ${module.name}? All users will lose access immediately.`)) {
      onDeactivate();
      toast.success(`${module.name} has been deactivated`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="text-white">
            <h2 className="text-2xl font-bold">{module.name}</h2>
            <p className="text-blue-100 text-sm mt-1">{module.subtitle} • {module.plan} Plan</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Module Status */}
            <Card className="border-green-500/30 bg-green-500/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="font-semibold text-slate-100">Module Active</p>
                      <p className="text-sm text-slate-300">{module.users} users currently licensed</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                    ENABLED
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* User Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <CardTitle className="text-lg">User Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Maximum Users
                  </label>
                  <input
                    type="number"
                    value={userLimit}
                    onChange={(e) => setUserLimit(e.target.value)}
                    className="w-full px-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Unlimited"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Set to 0 for unlimited users (Enterprise plan only)
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-slate-300" />
                    <div>
                      <p className="font-semibold text-slate-100">Auto-Provision Users</p>
                      <p className="text-xs text-slate-300">Automatically create accounts on first login</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAutoProvision(!autoProvision)}
                    className="text-slate-300 hover:text-slate-100"
                  >
                    {autoProvision ? (
                      <ToggleRight className="w-8 h-8 text-green-400" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Security & Access */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <CardTitle className="text-lg">Security & Access</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-slate-300" />
                    <div>
                      <p className="font-semibold text-slate-100">Single Sign-On (SSO)</p>
                      <p className="text-xs text-slate-300">Enable enterprise SSO authentication</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSSoEnabled(!ssoEnabled)}
                    className="text-slate-300 hover:text-slate-100"
                  >
                    {ssoEnabled ? (
                      <ToggleRight className="w-8 h-8 text-green-400" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-slate-300" />
                    <div>
                      <p className="font-semibold text-slate-100">API Access</p>
                      <p className="text-xs text-slate-300">Allow programmatic access to module data</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setApiAccess(!apiAccess)}
                    className="text-slate-300 hover:text-slate-100"
                  >
                    {apiAccess ? (
                      <ToggleRight className="w-8 h-8 text-green-400" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-slate-300" />
                    <div>
                      <p className="font-semibold text-slate-100">Audit Logging</p>
                      <p className="text-xs text-slate-300">Log all user actions for compliance</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAuditLogging(!auditLogging)}
                    className="text-slate-300 hover:text-slate-100"
                  >
                    {auditLogging ? (
                      <ToggleRight className="w-8 h-8 text-green-400" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-400" />
                  <CardTitle className="text-lg">Notifications</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-slate-300" />
                    <div>
                      <p className="font-semibold text-slate-100">Email Notifications</p>
                      <p className="text-xs text-slate-300">Send automated emails to users</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className="text-slate-300 hover:text-slate-100"
                  >
                    {emailNotifications ? (
                      <ToggleRight className="w-8 h-8 text-green-400" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-green-400" />
                  <CardTitle className="text-lg">Data Retention</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Retention Period (Days)
                </label>
                <select
                  value={dataRetention}
                  onChange={(e) => setDataRetention(e.target.value)}
                  className="w-full px-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">1 year</option>
                  <option value="730">2 years</option>
                  <option value="0">Indefinite</option>
                </select>
                <p className="text-xs text-slate-400 mt-1">
                  How long to retain inactive records and audit logs
                </p>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-500/30 bg-red-500/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <CardTitle className="text-lg text-red-300">Danger Zone</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-100">Deactivate Module</p>
                    <p className="text-sm text-slate-300">
                      Remove access for all users and stop billing
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-red-300 text-red-400 hover:bg-red-500/15"
                    onClick={handleDeactivate}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Deactivate
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Billing Info */}
            <Card className="border-blue-500/30 bg-blue-500/10">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-300">Billing Information</p>
                    <p className="text-sm text-blue-300 mt-1">
                      Current plan: <strong>{module.plan}</strong> • $199/month • Billed monthly
                    </p>
                    <p className="text-xs text-blue-400 mt-1">
                      Changes to user limits or features may affect your next invoice
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-white/5">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}
