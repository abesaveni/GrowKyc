import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  Settings as SettingsIcon,
  Link,
  FileText,
  Users,
  Bell,
  Shield,
  Building,
  CreditCard,
  Palette
} from 'lucide-react';
import { IntegrationsSettings } from './IntegrationsSettings';
import { FormCustomizationSettings } from './FormCustomizationSettings';
import { ProfileSettings } from './ProfileSettings';
import { OrganizationSettings } from './OrganizationSettings';
import { SecuritySettings } from './SecuritySettings';
import { NotificationSettings } from './NotificationSettings';

type SettingsTab = 
  | 'profile'
  | 'organization'
  | 'integrations'
  | 'forms'
  | 'security'
  | 'notifications';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('integrations');

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: Users, component: ProfileSettings },
    { id: 'organization' as const, label: 'Organization', icon: Building, component: OrganizationSettings },
    { id: 'integrations' as const, label: 'API Integrations', icon: Link, component: IntegrationsSettings },
    { id: 'forms' as const, label: 'Form Customization', icon: FileText, component: FormCustomizationSettings },
    { id: 'security' as const, label: 'Security', icon: Shield, component: SecuritySettings },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell, component: NotificationSettings },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary rounded-lg">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">
              Manage your account, integrations, and platform configuration
            </p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Card>
          <CardContent className="p-0">
            <div className="flex overflow-x-auto border-b">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-semibold whitespace-nowrap transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Active Tab Content */}
        <div>
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
}
