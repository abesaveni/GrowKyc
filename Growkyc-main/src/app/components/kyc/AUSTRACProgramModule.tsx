import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Shield,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle,
  Download,
  Upload,
  Eye,
  Lock,
  Target,
  TrendingUp,
  Activity,
  Book,
  Layers,
  Settings,
  Clock,
  Edit,
  Calendar
} from 'lucide-react';

export function AUSTRACProgramModule() {
  const [activeSection, setActiveSection] = useState<'overview' | 'part-a' | 'part-b' | 'documents'>('overview');

  const programStatus = {
    completeness: 98,
    lastReview: '2024-01-15',
    nextReview: '2025-01-15',
    approvedBy: 'Sarah Chen, MLRO',
    version: '3.2'
  };

  const partASections = [
    {
      id: 'A1',
      title: 'Part A - Program Overview',
      sections: [
        { name: '1. AML/CTF Program', status: 'complete', lastUpdated: '2024-01-15' },
        { name: '2. Reporting Entity Details', status: 'complete', lastUpdated: '2024-01-10' },
        { name: '3. Business Overview', status: 'complete', lastUpdated: '2024-01-10' },
        { name: '4. ML/TF Risk Assessment', status: 'complete', lastUpdated: '2024-01-15' },
        { name: '5. AML/CTF Program Controls', status: 'complete', lastUpdated: '2024-01-12' }
      ]
    }
  ];

  const partBSections = [
    {
      id: 'B1',
      title: 'Part B - Compliance Procedures',
      sections: [
        { name: '1. Customer Identification Procedures', status: 'complete', lastUpdated: '2024-01-15' },
        { name: '2. Ongoing Customer Due Diligence', status: 'complete', lastUpdated: '2024-01-14' },
        { name: '3. Applicable Customer Identification Procedures (ACIP)', status: 'complete', lastUpdated: '2024-01-13' },
        { name: '4. Enhanced Customer Due Diligence', status: 'complete', lastUpdated: '2024-01-15' },
        { name: '5. Beneficial Owner Identification', status: 'complete', lastUpdated: '2024-01-12' },
        { name: '6. Correspondent Banking', status: 'complete', lastUpdated: '2024-01-10' },
        { name: '7. Electronic Funds Transfer Instructions', status: 'complete', lastUpdated: '2024-01-11' },
        { name: '8. Reporting Requirements (SMR/TTR/IFT)', status: 'complete', lastUpdated: '2024-01-15' },
        { name: '9. Record Keeping', status: 'complete', lastUpdated: '2024-01-10' },
        { name: '10. Employee Due Diligence & Training', status: 'complete', lastUpdated: '2024-01-14' },
        { name: '11. AML/CTF Compliance Officer', status: 'complete', lastUpdated: '2024-01-10' },
        { name: '12. Independent Review', status: 'complete', lastUpdated: '2024-01-15' }
      ]
    }
  ];

  const documents = [
    { name: 'Complete AML/CTF Program (Part A + B)', size: '2.4 MB', type: 'PDF', date: '2024-01-15' },
    { name: 'ML/TF Risk Assessment Report', size: '1.8 MB', type: 'PDF', date: '2024-01-15' },
    { name: 'Customer Identification Procedures', size: '856 KB', type: 'PDF', date: '2024-01-15' },
    { name: 'Beneficial Ownership Guide', size: '624 KB', type: 'PDF', date: '2024-01-12' },
    { name: 'Employee Training Materials', size: '3.2 MB', type: 'PDF', date: '2024-01-14' },
    { name: 'SMR/TTR Reporting Procedures', size: '1.1 MB', type: 'PDF', date: '2024-01-15' },
    { name: 'Record Retention Policy', size: '445 KB', type: 'PDF', date: '2024-01-10' },
    { name: 'Independent Review Report 2024', size: '2.1 MB', type: 'PDF', date: '2024-01-15' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="w-16 h-16" />
            <div>
              <h1 className="text-4xl font-bold mb-2">AUSTRAC AML/CTF Program</h1>
              <p className="text-xl text-blue-100">Complete Anti-Money Laundering & Counter-Terrorism Financing Program</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white text-slate-800 hover:bg-slate-100">
              <Download className="w-5 h-5 mr-2" />
              Download Program
            </Button>
            <Button className="bg-white text-slate-800 hover:bg-slate-100">
              <Edit className="w-5 h-5 mr-2" />
              Edit Program
            </Button>
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-5 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Completeness</h3>
              <CheckCircle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-green-300">{programStatus.completeness}%</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Version</h3>
              <Activity className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{programStatus.version}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Last Review</h3>
              <Clock className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-lg font-bold">{new Date(programStatus.lastReview).toLocaleDateString()}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Next Review</h3>
              <Calendar className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-lg font-bold">{new Date(programStatus.nextReview).toLocaleDateString()}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Status</h3>
              <Shield className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-sm font-bold text-green-300">AUSTRAC Compliant</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: Book },
            { id: 'part-a', label: 'Part A - Program', icon: FileText },
            { id: 'part-b', label: 'Part B - Procedures', icon: Layers },
            { id: 'documents', label: 'Documents', icon: Download }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-6 py-3 font-semibold flex items-center gap-2 transition-colors ${
                  activeSection === tab.id
                    ? 'border-b-2 border-blue-700 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Tab */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">AML/CTF Program Overview</h3>
            <p className="text-gray-700 mb-4">
              This AML/CTF Program has been developed in accordance with the Anti-Money Laundering and Counter-Terrorism 
              Financing Act 2006 (AML/CTF Act) and the AML/CTF Rules. The program is designed to identify, mitigate and 
              manage the money laundering and terrorism financing risks faced by Melbourne Accounting Partners.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h4 className="font-bold text-blue-900 mb-2">Part A - Program Overview</h4>
                <p className="text-sm text-blue-800 mb-3">
                  Sets out the ML/TF risks faced by the business and the controls implemented to mitigate these risks.
                </p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Business overview & services</li>
                  <li>• ML/TF risk assessment</li>
                  <li>• Risk mitigation strategies</li>
                  <li>• Program governance</li>
                </ul>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h4 className="font-bold text-green-900 mb-2">Part B - Compliance Procedures</h4>
                <p className="text-sm text-green-800 mb-3">
                  Details the specific procedures to comply with AML/CTF obligations.
                </p>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Customer identification (KYC/CDD)</li>
                  <li>• Beneficial ownership verification</li>
                  <li>• Ongoing monitoring & screening</li>
                  <li>• Reporting (SMR/TTR/IFT)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Key Program Elements</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { title: 'Risk-Based Approach', icon: Target, desc: 'Risk assessment drives controls' },
                { title: 'Customer Due Diligence', icon: Users, desc: 'Enhanced KYC procedures' },
                { title: 'Ongoing Monitoring', icon: Activity, desc: 'Continuous client screening' },
                { title: 'Reporting', icon: FileText, desc: 'SMR/TTR/IFT compliance' },
                { title: 'Record Keeping', icon: Lock, desc: '7-year retention policy' },
                { title: 'Training', icon: TrendingUp, desc: 'Staff awareness program' }
              ].map((element, index) => {
                const Icon = element.icon;
                return (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <Icon className="w-8 h-8 text-blue-600 mb-3" />
                    <h4 className="font-bold text-gray-900 mb-1">{element.title}</h4>
                    <p className="text-sm text-gray-600">{element.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-bold text-green-900 mb-2">Program Approval & Review</h3>
                <p className="text-sm text-green-800 mb-2">
                  This AML/CTF Program has been approved by the Board of Directors and is reviewed annually.
                </p>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• <strong>Approved by:</strong> {programStatus.approvedBy}</li>
                  <li>• <strong>Last Review:</strong> {new Date(programStatus.lastReview).toLocaleDateString()}</li>
                  <li>• <strong>Next Review:</strong> {new Date(programStatus.nextReview).toLocaleDateString()}</li>
                  <li>• <strong>Independent Review:</strong> Completed by external auditor (January 2024)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Part A Tab */}
      {activeSection === 'part-a' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Part A - AML/CTF Program</h3>
            <p className="text-gray-700 mb-6">
              Part A establishes the framework for the AML/CTF Program, including the ML/TF risk assessment 
              and the controls implemented to address identified risks.
            </p>

            <div className="space-y-3">
              {partASections[0].sections.map((section, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">{section.name}</h4>
                      <p className="text-sm text-gray-600">Last updated: {section.lastUpdated}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        COMPLETE
                      </span>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Part B Tab */}
      {activeSection === 'part-b' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Part B - Compliance Procedures</h3>
            <p className="text-gray-700 mb-6">
              Part B contains the detailed procedures for complying with AML/CTF obligations, including 
              customer identification, ongoing due diligence, and reporting requirements.
            </p>

            <div className="space-y-3">
              {partBSections[0].sections.map((section, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">{section.name}</h4>
                      <p className="text-sm text-gray-600">Last updated: {section.lastUpdated}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        COMPLETE
                      </span>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeSection === 'documents' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Program Documents</h3>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>

            <div className="space-y-3">
              {documents.map((doc, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{doc.name}</h4>
                      <p className="text-sm text-gray-600">{doc.size} • {doc.type} • Updated {doc.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}