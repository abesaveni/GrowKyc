import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Settings as SettingsIcon, Link as LinkIcon, FileText, Users, Bell, Shield, Building } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

export function SettingsPage() {
  const tabs = [
    { id: 'profile', label: 'Profile', icon: Users, path: '/settings/profile' },
    { id: 'organisation', label: 'Organization', icon: Building, path: '/settings/organisation' },
    { id: 'integrations', label: 'API Integrations', icon: LinkIcon, path: '/settings/integrations' },
    { id: 'forms', label: 'Form Customization', icon: FileText, path: '/settings/forms' },
    { id: 'security', label: 'Security', icon: Shield, path: '/settings/security' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/settings/notifications' },
  ];

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
                  <NavLink
                    key={tab.id}
                    to={tab.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-6 py-4 font-semibold whitespace-nowrap transition-colors border-b-2 ${
                        isActive
                          ? 'border-primary text-primary bg-primary/5'
                          : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </NavLink>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Active Tab Content */}
        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

