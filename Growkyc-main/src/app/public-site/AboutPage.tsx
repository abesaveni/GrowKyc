import React from 'react';
import {
  ArrowRight,
  Shield,
  Building2,
  Users,
  Code,
  Layers,
  FileCheck,
  Globe,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/button';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

function SectionShell({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</section>
  );
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const services = [
    { icon: Shield, title: 'AML/CTF Compliance', description: 'End-to-end KYC, ECDD, screening, and AUSTRAC-ready reporting for regulated businesses.' },
    { icon: Building2, title: 'Fund & Lending Ops', description: 'Portfolio, investor relations, deal pipeline, and receivership workflows in one platform.' },
    { icon: Users, title: 'Client Onboarding', description: 'Tiered onboarding, document collection, and perpetual identity wallets across entities.' },
    { icon: Layers, title: 'Document Intelligence', description: 'Enterprise document manager with approvals, templates, sharing, and audit trails.' }
  ];

  const team = [
    { name: 'Alexandra Reed', role: 'CEO & Co-founder', initials: 'AR' },
    { name: 'Marcus Chen', role: 'Chief Product Officer', initials: 'MC' },
    { name: 'Priya Sharma', role: 'Head of Compliance', initials: 'PS' },
    { name: "James O'Connor", role: 'Engineering Lead', initials: 'JO' },
    { name: 'Emily Torres', role: 'Customer Success', initials: 'ET' },
    { name: 'David Kim', role: 'Security & Infrastructure', initials: 'DK' }
  ];

  const tech = [
    { icon: Code, title: 'React Platform', description: 'Modern SPA architecture with modular enterprise modules.' },
    { icon: Shield, title: 'Security First', description: 'Encryption, RBAC, audit logs, and SOC 2 aligned controls.' },
    { icon: Sparkles, title: 'Explainable AI', description: 'Compliance copilot with human-in-the-loop guardrails.' },
    { icon: Globe, title: 'Cloud Native', description: 'Scalable APIs, multi-tenant isolation, and 99.9% uptime design.' }
  ];

  return (
    <div className="bg-white">
      <SectionShell className="py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">About Grow Platform</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Financial operations software built for regulated Australia
            </h1>
            <p className="text-lg text-gray-600 mt-6">
              We unify compliance, lending, funds, documents, and client onboarding so firms can operate with confidence—not fragmented tools.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                onClick={() => onNavigate('contact')}
              >
                Talk to our team
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" onClick={() => onNavigate('features')}>
                Explore features
              </Button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Modules', value: '40+' },
                { label: 'Enterprise clients', value: '120+' },
                { label: 'Documents processed', value: '2M+' },
                { label: 'Uptime SLA', value: '99.9%' }
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionShell>

      <div className="bg-gray-50 py-16 sm:py-20">
        <SectionShell>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">What we do</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Purpose-built modules for accounting firms, lenders, brokers, and investor groups.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-600">{s.description}</p>
                </div>
              );
            })}
          </div>
        </SectionShell>
      </div>

      <SectionShell className="py-16 sm:py-20">
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-8 sm:p-12 text-white">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium mb-4">
                <FileCheck className="w-4 h-4" />
                AUSTRAC aligned
              </span>
              <h2 className="text-3xl font-bold mb-4">AUSTRAC compliance at the core</h2>
              <p className="text-blue-100 leading-relaxed">
                Grow Platform is designed around Australian AML/CTF obligations: customer identification, ongoing due diligence, suspicious matter workflows, and audit-ready record keeping. Our architecture supports Tranche 2 readiness with explainable AI that never auto-files regulatory reports without human approval.
              </p>
            </div>
            <ul className="lg:w-80 space-y-3 text-sm">
              {['PEP & sanctions screening', 'SMR triage workflows', 'Immutable audit trails', 'Role-based access controls', 'Data residency in Australia'].map((item) => (
                <li key={item} className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-3">
                  <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionShell>

      <div className="bg-gray-50 py-16 sm:py-20">
        <SectionShell>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Leadership team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-xl p-6 border border-gray-200 text-center hover:shadow-md transition-shadow">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold mb-4">
                  {member.initials}
                </div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </div>

      <SectionShell className="py-16 sm:py-24">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Technology</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tech.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.title} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                <Icon className="w-8 h-8 text-indigo-600 mb-3" />
                <h3 className="font-semibold text-gray-900">{t.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{t.description}</p>
              </div>
            );
          })}
        </div>
      </SectionShell>
    </div>
  );
}
