import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Users,
  Building,
  User,
  Share2,
  Target,
  Eye,
  CheckCircle,
  AlertTriangle,
  Download,
  Plus,
  Edit,
  Search,
  Filter,
  TrendingUp
} from 'lucide-react';

interface BeneficialOwner {
  id: string;
  name: string;
  ownershipPercent: number;
  controlType: 'direct' | 'indirect' | 'control-person';
  verified: boolean;
  idVerified: boolean;
  pepStatus: 'clear' | 'pep' | 'rca';
  relationship: string;
}

interface OwnershipStructure {
  clientId: string;
  clientName: string;
  entityType: 'company' | 'trust' | 'partnership' | 'smsf';
  owners: BeneficialOwner[];
  layers: number;
  complexity: 'simple' | 'moderate' | 'complex';
  lastVerified: Date;
  nextReviewDue: Date;
}

export function BeneficialOwnership() {
  const [activeTab, setActiveTab] = useState<'overview' | 'register' | 'verification' | 'analysis'>('overview');
  
  const ownershipThreshold = (() => {
    try {
      const val = localStorage.getItem('grow_settings_ownership_threshold');
      return val ? JSON.parse(val) : 25;
    } catch {
      return 25;
    }
  })();
  
  const [sampleStructure] = useState<OwnershipStructure>({
    clientId: 'C-2024-001',
    clientName: 'TechCorp Pty Ltd',
    entityType: 'company',
    owners: [
      {
        id: 'UBO-001',
        name: 'John Smith',
        ownershipPercent: 40,
        controlType: 'direct',
        verified: true,
        idVerified: true,
        pepStatus: 'clear',
        relationship: 'Director & Shareholder'
      },
      {
        id: 'UBO-002',
        name: 'Sarah Lee',
        ownershipPercent: 35,
        controlType: 'direct',
        verified: true,
        idVerified: true,
        pepStatus: 'clear',
        relationship: 'Shareholder'
      },
      {
        id: 'UBO-003',
        name: 'Smith Family Trust',
        ownershipPercent: 25,
        controlType: 'indirect',
        verified: true,
        idVerified: false,
        pepStatus: 'clear',
        relationship: 'Corporate Shareholder'
      },
      {
        id: 'UBO-004',
        name: 'Michael Smith (via Trust)',
        ownershipPercent: 25,
        controlType: 'indirect',
        verified: true,
        idVerified: true,
        pepStatus: 'clear',
        relationship: 'Ultimate Beneficial Owner'
      }
    ],
    layers: 2,
    complexity: 'moderate',
    lastVerified: new Date('2024-01-15'),
    nextReviewDue: new Date('2025-01-15')
  });

  const stats = {
    totalClients: 247,
    uboIdentified: 235,
    pendingVerification: 12,
    complexStructures: 28,
    pepDetected: 3,
    avgOwners: 2.8
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Users className="w-16 h-16" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Beneficial Ownership</h1>
              <p className="text-xl text-indigo-100">UBO Identification & Ownership Structure</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white text-indigo-600 hover:bg-indigo-50">
              <Plus className="w-5 h-5 mr-2" />
              New Structure
            </Button>
            <Button className="bg-white text-indigo-600 hover:bg-indigo-50">
              <Download className="w-5 h-5 mr-2" />
              Export Register
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-6 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Total Clients</h3>
              <Building className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{stats.totalClients}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">UBO ID'd</h3>
              <CheckCircle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-green-300">{stats.uboIdentified}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Pending</h3>
              <AlertTriangle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-orange-300">{stats.pendingVerification}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Complex</h3>
              <Share2 className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-yellow-300">{stats.complexStructures}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">PEP Found</h3>
              <AlertTriangle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-red-300">{stats.pepDetected}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Avg Owners</h3>
              <TrendingUp className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{stats.avgOwners}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: Target },
            { id: 'register', label: 'UBO Register', icon: Users },
            { id: 'verification', label: 'Verification Status', icon: CheckCircle },
            { id: 'analysis', label: 'Structure Analysis', icon: Share2 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-semibold flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
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

      {/* UBO Identification Threshold */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Target className="w-6 h-6 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-blue-900 mb-2">Ultimate Beneficial Owner (UBO) Threshold: {ownershipThreshold}%</h3>
            <p className="text-sm text-blue-800 mb-3">
              Under Australian AML/CTF regulations, a beneficial owner is an individual who ultimately owns or controls 
              (directly or indirectly) {ownershipThreshold}% or more of the customer, or exercises control over the customer's management.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-blue-700 font-semibold mb-1">Direct Ownership</p>
                <p className="text-sm text-gray-700">Individual owns ≥{ownershipThreshold}% shares directly</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-blue-700 font-semibold mb-1">Indirect Ownership</p>
                <p className="text-sm text-gray-700">Individual owns ≥{ownershipThreshold}% through entities</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-blue-700 font-semibold mb-1">Control Person</p>
                <p className="text-sm text-gray-700">Senior managing official with control</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Ownership Structure */}
      <div className="bg-white rounded-lg border-2 border-indigo-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{sampleStructure.clientName}</h3>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-full">
                {sampleStructure.entityType.toUpperCase()}
              </span>
              <span className={`px-3 py-1 ${
                sampleStructure.complexity === 'simple' ? 'bg-green-100 text-green-700' :
                sampleStructure.complexity === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              } text-sm font-bold rounded-full`}>
                {sampleStructure.complexity.toUpperCase()} STRUCTURE
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">
                {sampleStructure.layers} Layer{sampleStructure.layers > 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Eye className="w-4 h-4 mr-2" />
              View Full Tree
            </Button>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Ownership Visualization */}
        <div className="mb-6">
          <h4 className="font-bold text-gray-900 mb-4">Ownership Structure Visualization</h4>
          
          {/* Visual Tree Diagram */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex flex-col items-center space-y-6">
              {/* Top Level - Entity */}
              <div className="bg-indigo-600 text-white px-6 py-4 rounded-lg font-bold text-center">
                {sampleStructure.clientName}
                <br />
                <span className="text-sm font-normal">Pty Ltd</span>
              </div>

              {/* Connection Lines */}
              <div className="w-1 h-8 bg-gray-300" />

              {/* Direct Shareholders */}
              <div className="flex gap-8 justify-center">
                {sampleStructure.owners.filter(o => o.controlType === 'direct').map((owner) => (
                  <div key={owner.id} className="flex flex-col items-center">
                    <div className={`${
                      owner.verified ? 'bg-green-100 border-green-500' : 'bg-yellow-100 border-yellow-500'
                    } border-2 px-6 py-4 rounded-lg text-center`}>
                      <User className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                      <p className="font-bold text-gray-900">{owner.name}</p>
                      <p className="text-2xl font-bold text-indigo-600">{owner.ownershipPercent}%</p>
                      <p className="text-xs text-gray-600">{owner.relationship}</p>
                      {owner.verified && (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto mt-2" />
                      )}
                    </div>
                    {owner.name === 'Smith Family Trust' && (
                      <>
                        <div className="w-1 h-8 bg-gray-300 mt-2" />
                        <div className="bg-blue-100 border-2 border-blue-500 px-4 py-3 rounded-lg text-center mt-2">
                          <User className="w-6 h-6 mx-auto mb-1 text-blue-700" />
                          <p className="font-semibold text-gray-900 text-sm">Michael Smith</p>
                           <p className="text-sm font-bold text-blue-600">UBO ({ownershipThreshold}%)</p>
                          <p className="text-xs text-gray-600">via Trust</p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Beneficial Owners Table */}
        <div>
          <h4 className="font-bold text-gray-900 mb-3">Beneficial Owners Register</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-200">
                  <th className="text-left p-3 font-semibold text-gray-900">Name</th>
                  <th className="text-left p-3 font-semibold text-gray-900">Ownership %</th>
                  <th className="text-left p-3 font-semibold text-gray-900">Control Type</th>
                  <th className="text-left p-3 font-semibold text-gray-900">Relationship</th>
                  <th className="text-left p-3 font-semibold text-gray-900">ID Verified</th>
                  <th className="text-left p-3 font-semibold text-gray-900">PEP Status</th>
                  <th className="text-left p-3 font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {sampleStructure.owners.map((owner) => (
                  <tr key={owner.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-600" />
                        <span className="font-semibold text-gray-900">{owner.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full font-bold ${
                        owner.ownershipPercent >= 50 ? 'bg-red-100 text-red-700' :
                        owner.ownershipPercent >= 25 ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {owner.ownershipPercent}%
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        owner.controlType === 'direct' ? 'bg-blue-100 text-blue-700' :
                        owner.controlType === 'indirect' ? 'bg-purple-100 text-purple-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {owner.controlType.toUpperCase().replace('-', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-700">{owner.relationship}</td>
                    <td className="p-3">
                      {owner.idVerified ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        owner.pepStatus === 'clear' ? 'bg-green-100 text-green-700' :
                        owner.pepStatus === 'pep' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {owner.pepStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3">
                      {owner.verified ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                          VERIFIED
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded">
                          PENDING
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification Status */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-semibold text-green-900 mb-2">✓ Verification Complete</p>
            <p className="text-sm text-green-800">
              All beneficial owners identified and verified. Last verified: {sampleStructure.lastVerified.toLocaleDateString()}
            </p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-blue-900 mb-2">→ Next Review Due</p>
            <p className="text-sm text-blue-800">
              Annual UBO review scheduled for {sampleStructure.nextReviewDue.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Entity Type Templates */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Entity Type UBO Requirements</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border-2 border-blue-200 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              Company (Pty Ltd)
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Shareholders with ≥{ownershipThreshold}% ownership</li>
              <li>• Directors with ultimate control</li>
              <li>• Trace through corporate shareholders</li>
              <li>• Verify ASIC company extract</li>
            </ul>
          </div>

          <div className="p-4 border-2 border-purple-200 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Trust
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Trustee (individual or company)</li>
              <li>• Settlor (if still involved)</li>
              <li>• Beneficiaries with ≥{ownershipThreshold}% entitlement</li>
              <li>• Appointor (power to appoint/remove trustee)</li>
            </ul>
          </div>

          <div className="p-4 border-2 border-green-200 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-green-600" />
              Partnership
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• All partners</li>
              <li>• Partners with ≥{ownershipThreshold}% profit share</li>
              <li>• Managing partners</li>
              <li>• Verify partnership agreement</li>
            </ul>
          </div>

          <div className="p-4 border-2 border-orange-200 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-600" />
              SMSF
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• All members</li>
              <li>• All trustees (individual or corporate)</li>
              <li>• Directors of corporate trustee</li>
              <li>• Verify SMSF deed and ATO registration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
