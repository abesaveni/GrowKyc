import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  HelpCircle,
  BookOpen,
  Search,
  ArrowLeft,
  Home,
  Building2,
  CreditCard,
  Users,
  TrendingUp,
  FileText,
  DollarSign,
  Shield,
  Package,
  Clock,
  Landmark,
  Briefcase,
  CheckCircle
} from 'lucide-react';

interface HelpCenterProps {
  onBack?: () => void;
}

// Module help availability based on what's purchased
const moduleHelpAvailability = [
  { id: 'Grow MIP', name: 'Grow MIP', subtitle: 'Virtual MIP Platform', icon: Building2, hasHelp: true, color: 'bg-blue-500/15 text-blue-400' },
  { id: 'grow_accounting', name: 'Grow Accounting', subtitle: 'Practice Management', icon: FileText, hasHelp: false, color: 'bg-green-500/15 text-green-400' },
  { id: 'grow_trust', name: 'Grow Trust', subtitle: 'Trust Management', icon: Landmark, hasHelp: false, color: 'bg-purple-500/15 text-purple-400' },
  { id: 'grow_lending', name: 'Grow Lending', subtitle: 'Business Lending', icon: DollarSign, hasHelp: false, color: 'bg-orange-500/15 text-orange-400' },
  { id: 'grow_investments', name: 'Grow Investments', subtitle: 'Fund Management (IMFO)', icon: TrendingUp, hasHelp: false, color: 'bg-indigo-500/15 text-indigo-400' },
  { id: 'grow_receivership', name: 'Grow Receivership', subtitle: 'Restructuring', icon: Briefcase, hasHelp: false, color: 'bg-red-500/15 text-red-400' },
  { id: 'grow_crm', name: 'Grow CRM', subtitle: 'Customer Relations', icon: Users, hasHelp: false, color: 'bg-pink-500/15 text-pink-400' },
  { id: 'grow_documents', name: 'Grow Documents', subtitle: 'Document Management', icon: FileText, hasHelp: false, color: 'bg-cyan-500/15 text-cyan-400' },
  { id: 'grow_time', name: 'Grow Time & Revenue', subtitle: 'Time Tracking', icon: Clock, hasHelp: false, color: 'bg-yellow-500/15 text-yellow-400' },
  { id: 'grow_payments', name: 'Grow Payments', subtitle: 'Payment Gateway', icon: CreditCard, hasHelp: false, color: 'bg-teal-500/15 text-teal-400' },
  { id: 'grow_settlement', name: 'Grow Settlement', subtitle: 'Property Settlement', icon: Home, hasHelp: false, color: 'bg-emerald-500/15 text-emerald-400' },
  { id: 'grow_kyc', name: 'Grow KYC', subtitle: 'Identity & Compliance', icon: Shield, hasHelp: false, color: 'bg-rose-500/15 text-rose-400' }
];

export function HelpCenter({ onBack }: HelpCenterProps) {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter modules based on search
  const filteredModules = moduleHelpAvailability.filter(module =>
    module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show module unavailable message
  if (selectedModule) {
    const module = moduleHelpAvailability.find(m => m.id === selectedModule);
    return (
      <div className="p-8 space-y-6">
        <Button variant="ghost" onClick={() => setSelectedModule(null)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Help Center
        </Button>

        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-yellow-300 bg-yellow-500/10">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-100 mb-2">{module?.name} Help</h2>
              <p className="text-slate-300 mb-6">
                Comprehensive help documentation for {module?.name} is coming soon!
              </p>
              <p className="text-sm text-slate-300 mb-6">
                In the meantime, contact our support team for assistance with {module?.name}.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => setSelectedModule(null)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Help Center
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main help center view
  return (
    <div className="p-8 space-y-6">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <HelpCircle className="w-10 h-10 text-indigo-400" />
            Help Center
          </h1>
          <p className="text-slate-300 mt-2">Access help documentation for your purchased modules</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-green-500/15 text-green-300 rounded-lg border border-green-300">
            <CheckCircle className="w-4 h-4 inline mr-2" />
            <span className="font-semibold">
              {moduleHelpAvailability.filter(m => m.hasHelp).length} of {moduleHelpAvailability.length}
            </span>
            <span className="ml-1">modules documented</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search for a module..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Total Modules</p>
                <p className="text-3xl font-bold text-slate-100 mt-1">{moduleHelpAvailability.length}</p>
              </div>
              <Package className="w-10 h-10 text-indigo-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Help Available</p>
                <p className="text-3xl font-bold text-green-400 mt-1">
                  {moduleHelpAvailability.filter(m => m.hasHelp).length}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Coming Soon</p>
                <p className="text-3xl font-bold text-yellow-400 mt-1">
                  {moduleHelpAvailability.filter(m => !m.hasHelp).length}
                </p>
              </div>
              <Clock className="w-10 h-10 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Banner */}
      <Card className="border-2 border-blue-300 bg-blue-500/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <BookOpen className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-blue-300 mb-2">Module-Specific Help Documentation</h3>
              <p className="text-sm text-blue-300 mb-3">
                Each module you've purchased has comprehensive help documentation including:
              </p>
              <ul className="text-sm text-blue-300 space-y-1">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>Complete feature explanations and user guides</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>Step-by-step getting started instructions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>Best practices and tips for each user role</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>FAQs and troubleshooting guides</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>Video tutorials and interactive walkthroughs</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Grid */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-4">Your Purchased Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => {
            const Icon = module.icon;
            return (
              <Card
                key={module.id}
                className={`hover:shadow-lg transition-all cursor-pointer border-2 ${
                  module.hasHelp ? 'hover:border-green-400 border-green-500/30' : 'hover:border-gray-400'
                }`}
                onClick={() => setSelectedModule(module.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {module.hasHelp ? (
                      <div className="flex items-center gap-1 px-3 py-1 bg-green-500/15 text-green-300 rounded-full text-xs font-semibold border border-green-300">
                        <CheckCircle className="w-3 h-3" />
                        Available
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/15 text-yellow-300 rounded-full text-xs font-semibold border border-yellow-300">
                        <Clock className="w-3 h-3" />
                        Coming Soon
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-100 text-lg mb-1">{module.name}</h3>
                  <p className="text-sm text-slate-300 mb-4">{module.subtitle}</p>

                  <Button
                    size="sm"
                    className={`w-full ${
                      module.hasHelp
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-400 hover:bg-gray-500'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    {module.hasHelp ? 'View Help Documentation' : 'Coming Soon'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredModules.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-slate-300">No modules found matching "{searchQuery}"</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Additional Resources */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-4">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 mb-1">General FAQ</h3>
                  <p className="text-sm text-slate-300 mb-3">
                    Common questions about the Grow Platform
                  </p>
                  <Button size="sm" variant="outline">View FAQ</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 mb-1">Contact Support</h3>
                  <p className="text-sm text-slate-300 mb-3">
                    Get help from our support team
                  </p>
                  <Button size="sm" variant="outline">Contact Us</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 mb-1">Video Tutorials</h3>
                  <p className="text-sm text-slate-300 mb-3">
                    Watch step-by-step video guides
                  </p>
                  <Button size="sm" variant="outline">Watch Videos</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 mb-1">API Documentation</h3>
                  <p className="text-sm text-slate-300 mb-3">
                    Developer guides and API reference
                  </p>
                  <Button size="sm" variant="outline">View API Docs</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

