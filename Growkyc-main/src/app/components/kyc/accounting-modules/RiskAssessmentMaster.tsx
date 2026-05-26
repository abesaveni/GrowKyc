import React, { useState } from 'react';
import { Button } from '../../ui/button';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Save,
  Send,
  Plus,
  Trash2,
  Globe,
  Users,
  Wifi,
  Flag
} from 'lucide-react';

interface RiskAssessmentMasterProps {
  onComplete: (data: any) => void;
}

interface DesignatedService {
  id: string;
  name: string;
  inherentRisk: 'low' | 'medium' | 'high' | '';
  riskAppetite: 'yes' | 'no' | '';
  controlStatement: string;
}

interface ClientType {
  name: string;
  inherentRisk: 'low' | 'medium' | 'high' | '';
  riskAppetite: 'yes' | 'no' | '';
}

interface DeliveryChannel {
  name: string;
  inherentRisk: 'low' | 'medium' | 'high' | '';
  riskAppetite: 'yes' | 'no' | '';
}

interface RiskFactor {
  name: string;
  accept: 'yes' | 'no' | '';
  controlText: string;
}

interface Country {
  name: string;
  baselScore: number;
  fatfListed: boolean;
  dfatSanctions: boolean;
  autoRisk: 'low' | 'medium' | 'high';
  riskAppetite: 'yes' | 'no' | '';
  controlStatement: string;
}

export function RiskAssessmentMaster({ onComplete }: RiskAssessmentMasterProps) {
  const [activeSection, setActiveSection] = useState<'services' | 'clients' | 'channels' | 'factors' | 'countries'>('services');

  // 2.1 Designated Services
  const [designatedServices, setDesignatedServices] = useState<DesignatedService[]>([
    { id: '1', name: 'Real estate transactions', inherentRisk: '', riskAppetite: '', controlStatement: '' },
    { id: '2', name: 'Body corporate transactions', inherentRisk: '', riskAppetite: '', controlStatement: '' },
    { id: '3', name: 'Holding or managing client property', inherentRisk: '', riskAppetite: '', controlStatement: '' },
    { id: '4', name: 'Equity/debt financing', inherentRisk: '', riskAppetite: '', controlStatement: '' },
    { id: '5', name: 'Shelf companies', inherentRisk: '', riskAppetite: '', controlStatement: '' },
    { id: '6', name: 'Company/trust formation', inherentRisk: '', riskAppetite: '', controlStatement: '' },
    { id: '7', name: 'Nominee positions', inherentRisk: '', riskAppetite: '', controlStatement: '' },
    { id: '8', name: 'Registered office services', inherentRisk: '', riskAppetite: '', controlStatement: '' }
  ]);

  // 2.2 Client Types
  const [clientTypes, setClientTypes] = useState<ClientType[]>([
    { name: 'Individuals', inherentRisk: '', riskAppetite: '' },
    { name: 'Body corporate', inherentRisk: '', riskAppetite: '' },
    { name: 'Trust', inherentRisk: '', riskAppetite: '' },
    { name: 'Partnership', inherentRisk: '', riskAppetite: '' },
    { name: 'Association', inherentRisk: '', riskAppetite: '' },
    { name: 'Government body', inherentRisk: '', riskAppetite: '' }
  ]);

  // 2.3 Delivery Channels
  const [deliveryChannels, setDeliveryChannels] = useState<DeliveryChannel[]>([
    { name: 'In person', inherentRisk: '', riskAppetite: '' },
    { name: 'Email', inherentRisk: '', riskAppetite: '' },
    { name: 'Phone', inherentRisk: '', riskAppetite: '' },
    { name: 'Online', inherentRisk: '', riskAppetite: '' },
    { name: 'Third party', inherentRisk: '', riskAppetite: '' },
    { name: 'Digital onboarding', inherentRisk: '', riskAppetite: '' }
  ]);

  // 2.4 Risk Factors
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([
    { name: 'High value transactions', accept: '', controlText: '' },
    { name: 'Physical currency', accept: '', controlText: '' },
    { name: 'Virtual assets', accept: '', controlText: '' },
    { name: 'Unusual behaviour', accept: '', controlText: '' },
    { name: 'Complex structures', accept: '', controlText: '' },
    { name: 'PEP exposure', accept: '', controlText: '' },
    { name: 'High-risk jurisdiction', accept: '', controlText: '' },
    { name: 'New technology', accept: '', controlText: '' }
  ]);

  // 2.5 Countries
  const [countries, setCountries] = useState<Country[]>([
    { name: 'Australia', baselScore: 7.52, fatfListed: false, dfatSanctions: false, autoRisk: 'low', riskAppetite: 'yes', controlStatement: '' },
    { name: 'United States', baselScore: 7.18, fatfListed: false, dfatSanctions: false, autoRisk: 'low', riskAppetite: 'yes', controlStatement: '' },
    { name: 'Russia', baselScore: 2.46, fatfListed: false, dfatSanctions: true, autoRisk: 'high', riskAppetite: '', controlStatement: '' },
    { name: 'North Korea', baselScore: 0.00, fatfListed: true, dfatSanctions: true, autoRisk: 'high', riskAppetite: '', controlStatement: '' }
  ]);

  const [showAddCountry, setShowAddCountry] = useState(false);

  const checkCompleteness = () => {
    // Check all designated services
    const servicesComplete = designatedServices.every(s => 
      s.inherentRisk && s.riskAppetite && (s.riskAppetite === 'yes' || s.controlStatement)
    );

    // Check all client types
    const clientsComplete = clientTypes.every(c => 
      c.inherentRisk && c.riskAppetite
    );

    // Check all delivery channels
    const channelsComplete = deliveryChannels.every(d => 
      d.inherentRisk && d.riskAppetite
    );

    // Check all risk factors
    const factorsComplete = riskFactors.every(f => 
      f.accept && (f.accept === 'yes' || f.controlText)
    );

    // Check all countries
    const countriesComplete = countries.every(c => 
      c.riskAppetite && (c.riskAppetite === 'yes' || c.controlStatement)
    );

    return servicesComplete && clientsComplete && channelsComplete && factorsComplete && countriesComplete;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleSubmit = () => {
    if (!checkCompleteness()) {
      alert('Cannot activate program: All rows must be completed with inherent risk, risk appetite, and control statements where required.');
      return;
    }

    onComplete({
      designatedServices,
      clientTypes,
      deliveryChannels,
      riskFactors,
      countries
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">1. Risk Assessment Module</h1>
        <p className="text-purple-100">Complete all sections to activate AML/CTF program</p>
      </div>

      {/* Critical Rule */}
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
          <div>
            <p className="font-bold text-red-900">SYSTEM RULE: Cannot activate program without completing all rows</p>
            <p className="text-sm text-red-700 mt-1">
              Every designated service, client type, delivery channel, risk factor, and country must have:
              inherent risk rating, risk appetite (YES/NO), and mandatory control statement if NO
            </p>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-2">
          {[
            { id: 'services', label: '2.1 Designated Services', icon: Shield },
            { id: 'clients', label: '2.2 Client Types', icon: Users },
            { id: 'channels', label: '2.3 Delivery Channels', icon: Wifi },
            { id: 'factors', label: '2.4 Risk Factors', icon: AlertTriangle },
            { id: 'countries', label: '2.5 Country Risk', icon: Globe }
          ].map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`px-6 py-3 font-semibold flex items-center gap-2 transition-colors ${
                  activeSection === section.id
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2.1 Designated Services */}
      {activeSection === 'services' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">2.1 Designated Services</h3>
          <p className="text-gray-600 mb-6">
            Complete each row with inherent risk rating and risk appetite. If NO - mandatory control statement required.
          </p>

          <div className="space-y-4">
            {designatedServices.map((service, index) => (
              <div key={service.id} className="border-2 border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3">
                    <label className="text-sm font-semibold text-gray-900 mb-2 block">Service</label>
                    <p className="font-semibold text-gray-900">{service.name}</p>
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-semibold text-gray-900 mb-2 block">Inherent Risk *</label>
                    <select
                      value={service.inherentRisk}
                      onChange={(e) => {
                        const updated = [...designatedServices];
                        updated[index].inherentRisk = e.target.value as any;
                        setDesignatedServices(updated);
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        service.inherentRisk ? getRiskColor(service.inherentRisk) : 'border-red-300 bg-red-50'
                      }`}
                      required
                    >
                      <option value="">Select...</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-semibold text-gray-900 mb-2 block">Risk Appetite *</label>
                    <select
                      value={service.riskAppetite}
                      onChange={(e) => {
                        const updated = [...designatedServices];
                        updated[index].riskAppetite = e.target.value as any;
                        setDesignatedServices(updated);
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        !service.riskAppetite ? 'border-red-300 bg-red-50' :
                        service.riskAppetite === 'yes' ? 'border-green-300 bg-green-50' :
                        'border-red-300 bg-red-50'
                      }`}
                      required
                    >
                      <option value="">Select...</option>
                      <option value="yes">YES</option>
                      <option value="no">NO</option>
                    </select>
                  </div>

                  <div className="col-span-5">
                    <label className="text-sm font-semibold text-gray-900 mb-2 block">
                      Control Statement {service.riskAppetite === 'no' && <span className="text-red-600">*</span>}
                    </label>
                    <input
                      type="text"
                      value={service.controlStatement}
                      onChange={(e) => {
                        const updated = [...designatedServices];
                        updated[index].controlStatement = e.target.value;
                        setDesignatedServices(updated);
                      }}
                      placeholder={service.riskAppetite === 'no' ? 'REQUIRED if NO' : 'Optional'}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        service.riskAppetite === 'no' && !service.controlStatement ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      required={service.riskAppetite === 'no'}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2.2 Client Types - Similar structure */}
      {activeSection === 'clients' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">2.2 Clients – Inherent Risk</h3>
          <p className="text-gray-600 mb-6">Risk appetite per client type</p>

          <div className="space-y-4">
            {clientTypes.map((client, index) => (
              <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-2 block">Client Type</label>
                    <p className="font-semibold text-gray-900">{client.name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-2 block">Inherent Risk *</label>
                    <select
                      value={client.inherentRisk}
                      onChange={(e) => {
                        const updated = [...clientTypes];
                        updated[index].inherentRisk = e.target.value as any;
                        setClientTypes(updated);
                      }}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        client.inherentRisk ? getRiskColor(client.inherentRisk) : 'border-red-300 bg-red-50'
                      }`}
                      required
                    >
                      <option value="">Select...</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-2 block">Risk Appetite *</label>
                    <select
                      value={client.riskAppetite}
                      onChange={(e) => {
                        const updated = [...clientTypes];
                        updated[index].riskAppetite = e.target.value as any;
                        setClientTypes(updated);
                      }}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        !client.riskAppetite ? 'border-red-300 bg-red-50' :
                        client.riskAppetite === 'yes' ? 'border-green-300 bg-green-50' :
                        'border-red-300 bg-red-50'
                      }`}
                      required
                    >
                      <option value="">Select...</option>
                      <option value="yes">YES</option>
                      <option value="no">NO</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save & Submit */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">
          <Save className="w-4 h-4 mr-2" />
          Save Draft
        </Button>
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={handleSubmit}
          disabled={!checkCompleteness()}
        >
          {checkCompleteness() ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Risk Assessment
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Complete All Sections ({Object.keys({designatedServices, clientTypes, deliveryChannels, riskFactors, countries}).filter(k => eval(k).every((i: any) => i.inherentRisk || i.accept)).length}/5)
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
