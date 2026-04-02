import React from 'react';
import { Button } from '../components/ui/button';
import { 
  ArrowRight,
  Zap,
  Shield,
  Users,
  BarChart3,
  Globe,
  Lock,
  RefreshCw,
  Cloud,
  Smartphone,
  Palette,
  Code,
  Bell,
  FileText,
  CreditCard,
  Settings,
  TrendingUp,
  CheckCircle,
  Layers
} from 'lucide-react';

interface FeaturesPageProps {
  onNavigate: (page: string) => void;
}

export function FeaturesPage({ onNavigate }: FeaturesPageProps) {
  const coreFeatures = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built on modern technology for blazing-fast performance. Load pages instantly and work without interruption.',
      color: 'orange'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption, SOC 2 compliance, and comprehensive audit logs keep your data safe.',
      color: 'blue'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Real-time collaboration, role-based permissions, and activity tracking for seamless teamwork.',
      color: 'green'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Powerful dashboards, custom reports, and real-time insights across all your operations.',
      color: 'purple'
    },
    {
      icon: Globe,
      title: 'Multi-Currency',
      description: 'Support for 150+ currencies with automatic conversion and localization.',
      color: 'indigo'
    },
    {
      icon: Smartphone,
      title: 'Mobile Ready',
      description: 'Fully responsive design works perfectly on desktop, tablet, and mobile devices.',
      color: 'pink'
    },
    {
      icon: Cloud,
      title: 'Cloud-Based',
      description: 'Access your data anywhere, anytime with 99.9% uptime SLA and automatic backups.',
      color: 'cyan'
    },
    {
      icon: RefreshCw,
      title: 'Auto-Sync',
      description: 'All modules sync automatically. No manual exports, imports, or data transfers needed.',
      color: 'teal'
    },
    {
      icon: Code,
      title: 'API Access',
      description: 'RESTful API and webhooks for seamless integration with your existing tools.',
      color: 'red'
    },
    {
      icon: Palette,
      title: 'White-Label',
      description: 'Custom branding, logos, colors, and domains. Make it completely yours.',
      color: 'yellow'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Email, SMS, and in-app notifications keep you informed without overwhelming you.',
      color: 'green'
    },
    {
      icon: Lock,
      title: 'Compliance Ready',
      description: 'Built-in compliance tools for KYC/AML, GDPR, SOC 2, and industry regulations.',
      color: 'blue'
    }
  ];

  const platformFeatures = [
    {
      category: 'Automation & Workflows',
      icon: Settings,
      features: [
        'Custom workflow builder',
        'Automated task assignment',
        'Email automation',
        'Document generation',
        'Recurring tasks & billing',
        'Approval workflows'
      ]
    },
    {
      category: 'Data & Reporting',
      icon: BarChart3,
      features: [
        'Real-time dashboards',
        'Custom report builder',
        'Data export (CSV, Excel, PDF)',
        'Scheduled reports',
        'Performance metrics',
        'Audit trails'
      ]
    },
    {
      category: 'Integration & API',
      icon: Layers,
      features: [
        'RESTful API',
        'Webhook support',
        'Third-party integrations',
        'Zapier compatibility',
        'Custom connectors',
        'API documentation'
      ]
    },
    {
      category: 'Security & Compliance',
      icon: Shield,
      features: [
        'Two-factor authentication',
        'Role-based access control',
        'IP whitelisting',
        'Session management',
        'Encryption at rest & transit',
        'Compliance certifications'
      ]
    },
    {
      category: 'User Management',
      icon: Users,
      features: [
        'Unlimited user seats (Enterprise)',
        'Team management',
        'Permission controls',
        'SSO/SAML support',
        'User activity tracking',
        'Bulk user operations'
      ]
    },
    {
      category: 'Support & Training',
      icon: FileText,
      features: [
        '24/7 support (Premium)',
        'Live chat support',
        'Knowledge base',
        'Video tutorials',
        'Onboarding assistance',
        'Dedicated account manager'
      ]
    }
  ];

  const integrationFeatures = [
    {
      name: 'Accounting',
      tools: ['Xero', 'QuickBooks', 'MYOB', 'Sage'],
      description: 'Sync financial data automatically'
    },
    {
      name: 'Payment',
      tools: ['Stripe', 'PayPal', 'Square', 'Bank Transfer'],
      description: 'Accept payments from anywhere'
    },
    {
      name: 'Communication',
      tools: ['Gmail', 'Outlook', 'Slack', 'Microsoft Teams'],
      description: 'Streamline your communications'
    },
    {
      name: 'Storage',
      tools: ['Google Drive', 'Dropbox', 'OneDrive', 'Box'],
      description: 'Connect your cloud storage'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Everything You Need, All in One Place
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}Modern Businesses
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            From automation to analytics, security to scalability. Grow Platform has everything 
            you need to run your business efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8"
              onClick={() => onNavigate('signup')}
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8"
              onClick={() => onNavigate('modules')}
            >
              View All Modules
            </Button>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Performance & Scale
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every feature is designed to help you work smarter, faster, and more securely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-all"
                >
                  <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Complete Platform Capabilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your business operations in one unified system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformFeatures.map((category, index) => {
              const Icon = category.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{category.category}</h3>
                  </div>
                  <ul className="space-y-2">
                    {category.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integration Partners */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Integrates With Your Favorite Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect Grow Platform with the tools you already use. Seamless integrations out of the box.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {integrationFeatures.map((integration, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center"
              >
                <h3 className="font-bold text-gray-900 mb-3">{integration.name}</h3>
                <div className="flex flex-wrap justify-center gap-2 mb-3">
                  {integration.tools.map((tool, toolIndex) => (
                    <span
                      key={toolIndex}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600">{integration.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Plus 100+ more integrations via API</p>
            <Button variant="outline" onClick={() => onNavigate('contact')}>
              Request Custom Integration
            </Button>
          </div>
        </div>
      </section>

      {/* Scalability Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-4xl font-bold mb-6">
                Built to Scale With Your Business
              </h2>
              <p className="text-xl text-blue-100 mb-6">
                Start small and grow big. Grow Platform scales from solo entrepreneurs to 
                enterprise organizations with thousands of users.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <TrendingUp className="w-6 h-6 text-blue-200 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Unlimited Scalability</h3>
                    <p className="text-blue-100">Add users, modules, and storage as you grow</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Shield className="w-6 h-6 text-blue-200 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Enterprise-Grade</h3>
                    <p className="text-blue-100">Security and compliance at every level</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Globe className="w-6 h-6 text-blue-200 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Global Infrastructure</h3>
                    <p className="text-blue-100">Lightning-fast performance worldwide</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">99.9%</div>
                  <div className="text-blue-100">Uptime SLA</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">&lt;100ms</div>
                  <div className="text-blue-100">Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">24/7</div>
                  <div className="text-blue-100">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">150+</div>
                  <div className="text-blue-100">Countries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start your 14-day free trial today. No credit card required. 
            Full access to all features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-lg px-8"
              onClick={() => onNavigate('signup')}
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8"
              onClick={() => onNavigate('contact')}
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
