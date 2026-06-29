import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Shield,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Save,
  Send,
  Eye,
  Clock
} from 'lucide-react';

interface RiskFactor {
  id: string;
  name: string;
  inherentRisk: 'low' | 'medium' | 'high';
  riskAppetite: 'accept' | 'accept_with_controls' | 'do_not_accept';
  controlStatement: string;
}

interface Country {
  id: string;
  name: string;
  baselScore: number;
  fatfFlag: boolean;
  dfatSanctions: boolean;
  autoRisk: 'low' | 'medium' | 'high';
}

export function RiskAssessmentBuilder() {
  const [activeTab, setActiveTab] = useState<'services' | 'clients' | 'channels' | 'countries'>('services');
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const [designatedServices, setDesignatedServices] = useState([
    { id: '1', name: 'Tax Agent Services', selected: true },
    { id: '2', name: 'BAS Services', selected: true },
    { id: '3', name: 'Financial Advice', selected: false },
    { id: '4', name: 'Trust & Estate Services', selected: true },
    { id: '5', name: 'Corporate Restructuring', selected: false },
    { id: '6', name: 'Audit Services', selected: true }
  ]);

  const [clientTypes, setClientTypes] = useState<RiskFactor[]>([
    {
      id: '1',
      name: 'High Net Worth Individuals',
      inherentRisk: 'high',
      riskAppetite: 'accept_with_controls',
      controlStatement: 'Enhanced CDD required, source of wealth verification mandatory'
    },
    {
      id: '2',
      name: 'SME Companies',
      inherentRisk: 'medium',
      riskAppetite: 'accept',
      controlStatement: ''
    },
    {
      id: '3',
      name: 'Listed Public Companies',
      inherentRisk: 'low',
      riskAppetite: 'accept',
      controlStatement: ''
    },
    {
      id: '4',
      name: 'Cash-Intensive Businesses',
      inherentRisk: 'high',
      riskAppetite: 'accept_with_controls',
      controlStatement: 'Requires senior manager approval, quarterly monitoring'
    },
    {
      id: '5',
      name: 'Shell Companies',
      inherentRisk: 'high',
      riskAppetite: 'do_not_accept',
      controlStatement: 'Not accepted unless exceptional circumstances with senior manager approval'
    }
  ]);

  const [deliveryChannels, setDeliveryChannels] = useState<RiskFactor[]>([
    {
      id: '1',
      name: 'Face-to-Face',
      inherentRisk: 'low',
      riskAppetite: 'accept',
      controlStatement: ''
    },
    {
      id: '2',
      name: 'Electronic (Portal)',
      inherentRisk: 'medium',
      riskAppetite: 'accept',
      controlStatement: ''
    },
    {
      id: '3',
      name: 'Third-Party Referral',
      inherentRisk: 'high',
      riskAppetite: 'accept_with_controls',
      controlStatement: 'Reliance agreement required, independent verification of ID'
    }
  ]);

  const [countries, setCountries] = useState<Country[]>([
    { id: '1', name: 'Australia', baselScore: 7.52, fatfFlag: false, dfatSanctions: false, autoRisk: 'low' },
    { id: '2', name: 'United States', baselScore: 7.18, fatfFlag: false, dfatSanctions: false, autoRisk: 'low' },
    { id: '3', name: 'United Kingdom', baselScore: 7.44, fatfFlag: false, dfatSanctions: false, autoRisk: 'low' },
    { id: '4', name: 'Russia', baselScore: 2.46, fatfFlag: false, dfatSanctions: true, autoRisk: 'high' },
    { id: '5', name: 'North Korea', baselScore: 0.00, fatfFlag: true, dfatSanctions: true, autoRisk: 'high' },
    { id: '6', name: 'Iran', baselScore: 2.58, fatfFlag: true, dfatSanctions: true, autoRisk: 'high' },
    { id: '7', name: 'Singapore', baselScore: 7.74, fatfFlag: false, dfatSanctions: false, autoRisk: 'low' }
  ]);

  const [programVersion, setProgramVersion] = useState({
    current: '2.1',
    approved: '2024-01-15',
    approvedBy: 'John Smith - Senior Manager',
    nextReview: '2024-07-15',
    status: 'active'
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500/15 text-green-300 border-green-500/30';
      case 'medium': return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30';
      case 'high': return 'bg-red-500/15 text-red-300 border-red-500/30';
      default: return 'bg-white/5 text-slate-300 border-white/10';
    }
  };

  const getAppetiteColor = (appetite: string) => {
    switch (appetite) {
      case 'accept': return 'bg-green-500/10 text-green-300 border-green-300';
      case 'accept_with_controls': return 'bg-yellow-500/10 text-yellow-300 border-yellow-300';
      case 'do_not_accept': return 'bg-red-500/10 text-red-300 border-red-300';
      default: return 'bg-white/5 text-slate-300 border-white/10';
    }
  };

  const renderRiskFactorRow = (
    factor: RiskFactor,
    index: number,
    updateFn: (factors: RiskFactor[]) => void,
    factors: RiskFactor[]
  ) => {
    return (
      <div key={factor.id} className="p-4 border border-white/10 rounded-lg space-y-3">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <label className="text-xs text-slate-300 mb-1 block">Risk Factor</label>
            <input
              type="text"
              value={factor.name}
              onChange={(e) => {
                const updated = [...factors];
                updated[index].name = e.target.value;
                updateFn(updated);
              }}
              className="w-full px-3 py-2 border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-2">
            <label className="text-xs text-slate-300 mb-1 block">Inherent Risk</label>
            <select
              value={factor.inherentRisk}
              onChange={(e) => {
                const updated = [...factors];
                updated[index].inherentRisk = e.target.value as any;
                updateFn(updated);
              }}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${getRiskColor(factor.inherentRisk)}`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="col-span-3">
            <label className="text-xs text-slate-300 mb-1 block">Risk Appetite</label>
            <select
              value={factor.riskAppetite}
              onChange={(e) => {
                const updated = [...factors];
                updated[index].riskAppetite = e.target.value as any;
                updateFn(updated);
              }}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${getAppetiteColor(factor.riskAppetite)}`}
            >
              <option value="accept">Accept</option>
              <option value="accept_with_controls">Accept with Controls</option>
              <option value="do_not_accept">Do Not Accept</option>
            </select>
          </div>

          <div className="col-span-3">
            <label className="text-xs text-slate-300 mb-1 block">Control Statement</label>
            <input
              type="text"
              value={factor.controlStatement}
              onChange={(e) => {
                const updated = [...factors];
                updated[index].controlStatement = e.target.value;
                updateFn(updated);
              }}
              placeholder={factor.riskAppetite !== 'accept' ? 'Required' : 'Optional'}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                factor.riskAppetite !== 'accept' && !factor.controlStatement
                  ? 'border-red-300 bg-red-500/10'
                  : 'border-white/10'
              }`}
              required={factor.riskAppetite === 'do_not_accept'}
            />
          </div>

          <div className="col-span-1 flex items-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const updated = factors.filter((_, i) => i !== index);
                updateFn(updated);
              }}
              className="text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Risk Assessment Builder</h1>
          <p className="text-slate-300 mt-1">Define your AML/CTF risk assessment framework</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview Auto-Risk
          </Button>
          <Button variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowApprovalModal(true)}>
            <Send className="w-4 h-4 mr-2" />
            Submit for Approval
          </Button>
        </div>
      </div>

      {/* Program Version Status */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Current Program Version: {programVersion.current}</h3>
              <p className="text-green-100 text-sm mt-1">
                Approved: {programVersion.approved} by {programVersion.approvedBy}
              </p>
              <p className="text-green-100 text-sm">Next Review: {programVersion.nextReview}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block px-4 py-2 bg-white/20 rounded-lg font-bold">
              ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Warning for Material Changes */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-300">Material Change Warning</p>
            <p className="text-sm text-yellow-300 mt-1">
              Any changes to risk appetite or designated services require senior manager approval and will trigger a 14-day compliance implementation period.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="flex gap-1">
          {[
            { id: 'services', label: 'Designated Services' },
            { id: 'clients', label: 'Client Types' },
            { id: 'channels', label: 'Delivery Channels' },
            { id: 'countries', label: 'Country Exposure' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-600 text-blue-400'
                  : 'text-slate-300 hover:text-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Designated Services Tab */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-lg border border-white/10 p-6">
          <h3 className="font-bold text-slate-100 mb-4">Select Designated Services</h3>
          <div className="grid grid-cols-2 gap-4">
            {designatedServices.map((service) => (
              <label
                key={service.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  service.selected
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-white/10 hover:border-white/10'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={service.selected}
                    onChange={(e) => {
                      setDesignatedServices(
                        designatedServices.map((s) =>
                          s.id === service.id ? { ...s, selected: e.target.checked } : s
                        )
                      );
                    }}
                    className="w-5 h-5 text-blue-400 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 font-semibold text-slate-100">{service.name}</span>
                  {service.selected && <CheckCircle className="w-5 h-5 text-blue-400 ml-auto" />}
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Client Types Tab */}
      {activeTab === 'clients' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100">Client Type Risk Factors</h3>
            <Button
              onClick={() => {
                setClientTypes([
                  ...clientTypes,
                  {
                    id: Date.now().toString(),
                    name: '',
                    inherentRisk: 'medium',
                    riskAppetite: 'accept',
                    controlStatement: ''
                  }
                ]);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Client Type
            </Button>
          </div>
          <div className="space-y-3">
            {clientTypes.map((factor, index) =>
              renderRiskFactorRow(factor, index, setClientTypes, clientTypes)
            )}
          </div>
        </div>
      )}

      {/* Delivery Channels Tab */}
      {activeTab === 'channels' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100">Delivery Channel Risk Factors</h3>
            <Button
              onClick={() => {
                setDeliveryChannels([
                  ...deliveryChannels,
                  {
                    id: Date.now().toString(),
                    name: '',
                    inherentRisk: 'medium',
                    riskAppetite: 'accept',
                    controlStatement: ''
                  }
                ]);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Delivery Channel
            </Button>
          </div>
          <div className="space-y-3">
            {deliveryChannels.map((factor, index) =>
              renderRiskFactorRow(factor, index, setDeliveryChannels, deliveryChannels)
            )}
          </div>
        </div>
      )}

      {/* Country Exposure Tab */}
      {activeTab === 'countries' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100">Country Risk Assessment</h3>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Country
            </Button>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-blue-300">
                  <strong>Auto Risk Logic:</strong> Countries with FATF listing or DFAT sanctions are automatically
                  classified as HIGH risk. Basel AML Index score below 5.0 = Medium risk.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-white/10 overflow-hidden">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-100">Country</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-100">Basel Score</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-100">FATF Listed</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-100">DFAT Sanctions</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-100">Auto Risk</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {countries.map((country) => (
                  <tr key={country.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-4 font-semibold">{country.name}</td>
                    <td className="text-center py-3 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        country.baselScore >= 6 ? 'bg-green-500/15 text-green-300' :
                        country.baselScore >= 4 ? 'bg-yellow-500/15 text-yellow-300' :
                        'bg-red-500/15 text-red-300'
                      }`}>
                        {country.baselScore.toFixed(2)}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      {country.fatfFlag ? (
                        <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {country.dfatSanctions ? (
                        <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(country.autoRisk)}`}>
                        {country.autoRisk.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-bold text-slate-100 mb-4">Submit for Senior Manager Approval</h3>
            <div className="space-y-4 mb-6">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-sm text-yellow-300">
                  This will create a new program version (v2.2) and send it to the Senior Manager for approval.
                  A 14-day implementation period will begin upon approval.
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-100 mb-2">
                  Summary of Changes
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Describe the material changes made to the program..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowApprovalModal(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4 mr-2" />
                Submit for Approval
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
