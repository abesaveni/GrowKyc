import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Settings,
  User,
  Bell,
  Shield,
  Lock,
  Globe,
  Palette,
  Zap,
  Database,
  Mail,
  Smartphone,
  Key,
  Users,
  Building,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  TrendingUp
} from 'lucide-react';

export function SettingsModule() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'system' | 'integrations' | 'appearance'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  
  const [settings, setSettings] = useState({
    // Profile
    name: 'Sarah Chen',
    email: 'sarah.chen@growkyc.com',
    role: 'Compliance Officer',
    organization: 'Melbourne Accounting Partners',
    phone: '+61 400 123 456',
    timezone: 'Australia/Melbourne',
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    notifyNewClient: true,
    notifyReviewDue: true,
    notifyScreeningMatch: true,
    notifyComplianceAlert: true,
    notifySystemUpdate: false,
    dailyDigest: true,
    
    // Security
    twoFactorEnabled: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAlerts: true,
    
    // System
    autoSaveEnabled: true,
    autoSaveInterval: 5,
    defaultRiskThreshold: 50,
    requireApprovalThreshold: 75,
    dataRetention: 7,
    
    // Appearance
    theme: 'light',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    currency: 'AUD'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-slate-800 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Settings className="w-16 h-16" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Settings</h1>
              <p className="text-xl text-gray-300">System Configuration & Preferences</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white text-slate-100 hover:bg-white/5">
              <Download className="w-5 h-5 mr-2" />
              Export Settings
            </Button>
            <Button className="bg-white text-slate-100 hover:bg-white/5">
              <RefreshCw className="w-5 h-5 mr-2" />
              Reset to Default
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-white/10">
        <div className="flex gap-2">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'system', label: 'System', icon: Database },
            { id: 'integrations', label: 'Integrations', icon: Zap },
            { id: 'appearance', label: 'Appearance', icon: Palette }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-semibold flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-gray-800 text-slate-100'
                    : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-white/10 p-6">
            <h3 className="text-xl font-bold text-slate-100 mb-4">Profile Information</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-100 mb-2">Full Name</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => handleSettingChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-100 mb-2">Email Address</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleSettingChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-100 mb-2">Role</label>
                <input
                  type="text"
                  value={settings.role}
                  disabled
                  className="w-full px-4 py-2 border border-white/10 rounded-lg bg-white/5 text-slate-300"
                />
                <p className="text-xs text-slate-300 mt-1">Contact admin to change role</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-100 mb-2">Organization</label>
                <input
                  type="text"
                  value={settings.organization}
                  disabled
                  className="w-full px-4 py-2 border border-white/10 rounded-lg bg-white/5 text-slate-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-100 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => handleSettingChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-100 mb-2">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  className="w-full px-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Australia/Melbourne">Australia/Melbourne (AEST)</option>
                  <option value="Australia/Sydney">Australia/Sydney (AEST)</option>
                  <option value="Australia/Brisbane">Australia/Brisbane (AEST)</option>
                  <option value="Australia/Perth">Australia/Perth (AWST)</option>
                  <option value="Australia/Adelaide">Australia/Adelaide (ACST)</option>
                </select>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Profile Changes
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-white/10 p-6">
            <h3 className="text-xl font-bold text-slate-100 mb-4">Change Password</h3>
            
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-semibold text-slate-100 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-100 mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-300 mt-1">Min 12 characters, including uppercase, lowercase, number & symbol</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-100 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700">
                <Lock className="w-4 h-4 mr-2" />
                Update Password
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-white/10 p-6">
            <h3 className="text-xl font-bold text-slate-100 mb-4">Notification Preferences</h3>
            
            <div className="space-y-6">
              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="font-semibold text-slate-100 mb-3">Notification Channels</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      className="w-5 h-5 text-blue-400"
                    />
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-slate-300" />
                      <span className="font-semibold text-slate-100">Email Notifications</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.smsNotifications}
                      onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                      className="w-5 h-5 text-blue-400"
                    />
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-slate-300" />
                      <span className="font-semibold text-slate-100">SMS Notifications</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                      className="w-5 h-5 text-blue-400"
                    />
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-slate-300" />
                      <span className="font-semibold text-slate-100">Push Notifications</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="font-semibold text-slate-100 mb-3">Notification Types</h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-slate-100">New Client Onboarding</span>
                    <input
                      type="checkbox"
                      checked={settings.notifyNewClient}
                      onChange={(e) => handleSettingChange('notifyNewClient', e.target.checked)}
                      className="w-5 h-5 text-blue-400"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-slate-100">Review Due Reminders</span>
                    <input
                      type="checkbox"
                      checked={settings.notifyReviewDue}
                      onChange={(e) => handleSettingChange('notifyReviewDue', e.target.checked)}
                      className="w-5 h-5 text-blue-400"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-slate-100">Screening Matches (PEP/Sanctions)</span>
                    <input
                      type="checkbox"
                      checked={settings.notifyScreeningMatch}
                      onChange={(e) => handleSettingChange('notifyScreeningMatch', e.target.checked)}
                      className="w-5 h-5 text-blue-400"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-slate-100">Compliance Alerts</span>
                    <input
                      type="checkbox"
                      checked={settings.notifyComplianceAlert}
                      onChange={(e) => handleSettingChange('notifyComplianceAlert', e.target.checked)}
                      className="w-5 h-5 text-blue-400"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-slate-100">System Updates</span>
                    <input
                      type="checkbox"
                      checked={settings.notifySystemUpdate}
                      onChange={(e) => handleSettingChange('notifySystemUpdate', e.target.checked)}
                      className="w-5 h-5 text-blue-400"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-slate-100">Daily Digest Email</span>
                    <input
                      type="checkbox"
                      checked={settings.dailyDigest}
                      onChange={(e) => handleSettingChange('dailyDigest', e.target.checked)}
                      className="w-5 h-5 text-blue-400"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Notification Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-white/10 p-6">
            <h3 className="text-xl font-bold text-slate-100 mb-4">Security Settings</h3>
            
            <div className="space-y-6">
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-green-300 mb-1">Two-Factor Authentication</h4>
                    <p className="text-sm text-green-300">Add an extra layer of security to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.twoFactorEnabled}
                      onChange={(e) => handleSettingChange('twoFactorEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-white/10 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-white/10 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
                {settings.twoFactorEnabled && (
                  <div className="mt-3 pt-3 border-t border-green-500/30">
                    <Button size="sm" variant="outline">
                      <Smartphone className="w-4 h-4 mr-2" />
                      Configure Authenticator App
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="font-semibold text-slate-100 mb-3">Session Management</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-100 mb-2">
                      Auto-logout after inactivity
                    </label>
                    <select
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                      className="w-full max-w-xs px-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                      <option value={240}>4 hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-100 mb-2">
                      Password expiry period
                    </label>
                    <select
                      value={settings.passwordExpiry}
                      onChange={(e) => handleSettingChange('passwordExpiry', parseInt(e.target.value))}
                      className="w-full max-w-xs px-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={30}>30 days</option>
                      <option value={60}>60 days</option>
                      <option value={90}>90 days</option>
                      <option value={180}>180 days</option>
                      <option value={365}>1 year</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.loginAlerts}
                      onChange={(e) => handleSettingChange('loginAlerts', e.target.checked)}
                      className="w-5 h-5 text-blue-400"
                    />
                    <span className="text-slate-100">Send alerts for new device logins</span>
                  </label>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="font-semibold text-slate-100 mb-3">Active Sessions</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-white/10">
                    <div>
                      <p className="font-semibold text-slate-100">Current Session</p>
                      <p className="text-sm text-slate-300">Melbourne, Australia • Chrome on macOS</p>
                      <p className="text-xs text-slate-400">Last active: Just now</p>
                    </div>
                    <span className="px-3 py-1 bg-green-500/15 text-green-300 text-xs font-bold rounded-full">
                      ACTIVE
                    </span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    End All Other Sessions
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Security Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* System Settings */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-white/10 p-6">
            <h3 className="text-xl font-bold text-slate-100 mb-4">System Configuration</h3>
            
            <div className="space-y-6">
              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="font-semibold text-slate-100 mb-3">Auto-Save Settings</h4>
                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.autoSaveEnabled}
                      onChange={(e) => handleSettingChange('autoSaveEnabled', e.target.checked)}
                      className="w-5 h-5 text-blue-400"
                    />
                    <span className="text-slate-100">Enable auto-save for forms and documents</span>
                  </label>

                  {settings.autoSaveEnabled && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-100 mb-2">
                        Auto-save interval
                      </label>
                      <select
                        value={settings.autoSaveInterval}
                        onChange={(e) => handleSettingChange('autoSaveInterval', parseInt(e.target.value))}
                        className="w-full max-w-xs px-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={1}>Every 1 minute</option>
                        <option value={2}>Every 2 minutes</option>
                        <option value={5}>Every 5 minutes</option>
                        <option value={10}>Every 10 minutes</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="font-semibold text-slate-100 mb-3">Risk Assessment Defaults</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-100 mb-2">
                      Default risk threshold (Medium to High)
                    </label>
                    <input
                      type="number"
                      value={settings.defaultRiskThreshold}
                      onChange={(e) => handleSettingChange('defaultRiskThreshold', parseInt(e.target.value))}
                      min={0}
                      max={100}
                      className="w-full max-w-xs px-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-slate-300 mt-1">Score of {settings.defaultRiskThreshold} or above = High Risk</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-100 mb-2">
                      Senior approval required threshold
                    </label>
                    <input
                      type="number"
                      value={settings.requireApprovalThreshold}
                      onChange={(e) => handleSettingChange('requireApprovalThreshold', parseInt(e.target.value))}
                      min={0}
                      max={100}
                      className="w-full max-w-xs px-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-slate-300 mt-1">Score of {settings.requireApprovalThreshold} or above = Senior Approval Required</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h4 className="font-semibold text-blue-300 mb-3">Data Retention Policy</h4>
                <div>
                  <label className="block text-sm font-semibold text-blue-300 mb-2">
                    AUSTRAC record retention period
                  </label>
                  <select
                    value={settings.dataRetention}
                    onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
                    className="w-full max-w-xs px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={7}>7 years (AUSTRAC minimum)</option>
                    <option value={10}>10 years</option>
                    <option value={15}>15 years</option>
                  </select>
                  <p className="text-xs text-blue-300 mt-2">
                    <AlertTriangle className="w-3 h-3 inline mr-1" />
                    AUSTRAC requires minimum 7 years retention for AML/CTF records
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Save System Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Integrations */}
      {activeTab === 'integrations' && (
        <div className="space-y-4">
          {[
            { name: 'GreenID', status: 'connected', icon: Shield, color: 'green' },
            { name: 'InfoTrack', status: 'connected', icon: Building, color: 'blue' },
            { name: 'Equifax', status: 'connected', icon: TrendingUp, color: 'purple' },
            { name: 'AUSTRAC Online', status: 'connected', icon: Globe, color: 'orange' },
            { name: 'Xero', status: 'disconnected', icon: Database, color: 'gray' },
            { name: 'MYOB', status: 'disconnected', icon: Database, color: 'gray' }
          ].map((integration) => {
            const Icon = integration.icon;
            return (
              <div key={integration.name} className="bg-white rounded-lg border border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-${integration.color}-100 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${integration.color}-600`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100">{integration.name}</h4>
                      <p className="text-sm text-slate-300">
                        {integration.status === 'connected' ? 'Connected and syncing' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {integration.status === 'connected' ? (
                      <>
                        <span className="px-3 py-1 bg-green-500/15 text-green-300 text-sm font-bold rounded-full flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          CONNECTED
                        </span>
                        <Button size="sm" variant="outline">
                          Configure
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-400">
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Appearance */}
      {activeTab === 'appearance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-white/10 p-6">
            <h3 className="text-xl font-bold text-slate-100 mb-4">Appearance Settings</h3>
            
            <div className="space-y-6">
              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="font-semibold text-slate-100 mb-3">Theme</h4>
                <div className="grid grid-cols-3 gap-4">
                  {['light', 'dark', 'auto'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => handleSettingChange('theme', theme)}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        settings.theme === theme
                          ? 'border-blue-600 bg-blue-500/10'
                          : 'border-white/10 hover:border-white/10'
                      }`}
                    >
                      <p className="font-semibold text-slate-100 capitalize">{theme}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="font-semibold text-slate-100 mb-3">Localization</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-100 mb-2">Language</label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      className="w-full px-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="zh">中文 (Chinese)</option>
                      <option value="vi">Tiếng Việt (Vietnamese)</option>
                      <option value="ar">العربية (Arabic)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-100 mb-2">Date Format</label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                      className="w-full px-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-100 mb-2">Currency</label>
                    <select
                      value={settings.currency}
                      onChange={(e) => handleSettingChange('currency', e.target.value)}
                      className="w-full px-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="AUD">AUD ($)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Appearance Settings
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}