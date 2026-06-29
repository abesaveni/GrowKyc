// Service Selection Component with Pricing Engine
import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './DesignSystem';

interface ServiceSelectionProps {
  entities: any[];
  onUpdate: (id: string, services: string[], pricing: number, turnover?: number, employees?: number) => void;
  onBack: () => void;
  onContinue: () => void;
  canProgress: boolean;
}

export function ServiceSelection({ entities, onUpdate, onBack, onContinue, canProgress }: ServiceSelectionProps) {
  const [selectedEntityId, setSelectedEntityId] = useState(entities[0]?.id);

  const servicesByType: Record<string, { name: string; basePrice: number }[]> = {
    company: [
      { name: 'Financial Statements', basePrice: 2500 },
      { name: 'Company Tax Return', basePrice: 1500 },
      { name: 'BAS', basePrice: 800 },
      { name: 'Payroll', basePrice: 1200 },
      { name: 'ASIC Compliance', basePrice: 600 },
      { name: 'Advisory', basePrice: 3000 }
    ],
    trust: [
      { name: 'Trust Tax Return', basePrice: 1800 },
      { name: 'Distribution Minutes', basePrice: 500 },
      { name: 'Financial Statements', basePrice: 2000 }
    ],
    individual: [
      { name: 'Tax Return', basePrice: 400 },
      { name: 'Rental Property Schedule', basePrice: 300 },
      { name: 'Investment Reporting', basePrice: 500 }
    ],
    'sole-trader': [
      { name: 'Individual Tax Return', basePrice: 600 },
      { name: 'BAS', basePrice: 600 },
      { name: 'Business Activity Statement', basePrice: 400 },
      { name: 'Bookkeeping', basePrice: 1500 }
    ],
    smsf: [
      { name: 'SMSF Tax Return', basePrice: 1200 },
      { name: 'Financial Statements', basePrice: 1500 },
      { name: 'Audit', basePrice: 800 },
      { name: 'Member Statements', basePrice: 300 }
    ],
    partnership: [
      { name: 'Partnership Tax Return', basePrice: 1200 },
      { name: 'Financial Statements', basePrice: 1800 },
      { name: 'BAS', basePrice: 600 }
    ],
    government: [
      { name: 'Compliance Reporting', basePrice: 5000 },
      { name: 'Financial Statements', basePrice: 8000 },
      { name: 'Audit', basePrice: 10000 }
    ]
  };

  const calculatePricing = (entity: any, selectedServices: string[]) => {
    const services = servicesByType[entity.type] || [];
    let total = 0;

    selectedServices.forEach(serviceName => {
      const service = services.find(s => s.name === serviceName);
      if (service) {
        total += service.basePrice;
      }
    });

    // Complexity multipliers
    let multiplier = 1.0;

    // Turnover multiplier
    if (entity.turnover) {
      if (entity.turnover > 50000000) multiplier += 0.5;
      else if (entity.turnover > 10000000) multiplier += 0.3;
      else if (entity.turnover > 1000000) multiplier += 0.15;
    }

    // Employees multiplier
    if (entity.employees) {
      if (entity.employees > 100) multiplier += 0.3;
      else if (entity.employees > 50) multiplier += 0.2;
      else if (entity.employees > 20) multiplier += 0.1;
    }

    // Trust with corporate trustee
    if (entity.type === 'trust' && entity.data?.trustees?.some((t: any) => t.type === 'corporate')) {
      multiplier += 0.2;
    }

    // Group structure
    if (entities.length > 3) {
      multiplier += 0.1;
    }

    return Math.round(total * multiplier);
  };

  const selectedEntity = entities.find(e => e.id === selectedEntityId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Phase 2: Select Services & Pricing</h2>
        <p className="text-slate-300">Choose services for each entity - pricing updates live</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Entity Tabs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Entity Selection */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {entities.map((entity) => (
              <button
                key={entity.id}
                onClick={() => setSelectedEntityId(entity.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  selectedEntityId === entity.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border-2 border-white/10 text-slate-300 hover:border-blue-300'
                }`}
              >
                {entity.name}
              </button>
            ))}
          </div>

          {selectedEntity && (
            <div className="bg-white border-2 border-white/10 rounded-lg p-6">
              <h3 className="font-bold text-slate-100 mb-4">{selectedEntity.name}</h3>

              {/* Additional Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Annual Turnover (optional)
                  </label>
                  <input
                    type="number"
                    value={selectedEntity.turnover || ''}
                    onChange={(e) => {
                      const turnover = parseInt(e.target.value) || 0;
                      const pricing = calculatePricing(
                        { ...selectedEntity, turnover },
                        selectedEntity.services
                      );
                      onUpdate(selectedEntity.id, selectedEntity.services, pricing, turnover, selectedEntity.employees);
                    }}
                    placeholder="e.g. 1000000"
                    className="w-full px-4 py-2 border border-white/10 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Number of Employees (optional)
                  </label>
                  <input
                    type="number"
                    value={selectedEntity.employees || ''}
                    onChange={(e) => {
                      const employees = parseInt(e.target.value) || 0;
                      const pricing = calculatePricing(
                        { ...selectedEntity, employees },
                        selectedEntity.services
                      );
                      onUpdate(selectedEntity.id, selectedEntity.services, pricing, selectedEntity.turnover, employees);
                    }}
                    placeholder="e.g. 10"
                    className="w-full px-4 py-2 border border-white/10 rounded-lg"
                  />
                </div>
              </div>

              {/* Services */}
              <h4 className="font-semibold text-slate-100 mb-3">Select Services</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(servicesByType[selectedEntity.type] || []).map((service) => (
                  <label
                    key={service.name}
                    className="flex items-center justify-between gap-2 p-3 border border-white/10 rounded hover:bg-white/5 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedEntity.services.includes(service.name)}
                        onChange={(e) => {
                          const newServices = e.target.checked
                            ? [...selectedEntity.services, service.name]
                            : selectedEntity.services.filter((s: string) => s !== service.name);
                          const pricing = calculatePricing(selectedEntity, newServices);
                          onUpdate(selectedEntity.id, newServices, pricing, selectedEntity.turnover, selectedEntity.employees);
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-slate-100">{service.name}</span>
                    </div>
                    <span className="text-xs text-slate-300">${service.basePrice}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Pricing Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border-2 border-white/10 rounded-lg p-6 sticky top-6">
            <h3 className="font-bold text-slate-100 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-400" />
              Pricing Summary
            </h3>

            <div className="space-y-3 mb-4">
              {entities.map((entity) => (
                <div key={entity.id} className="py-2 border-b border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-slate-300">{entity.name}</span>
                    <span className="font-bold text-slate-100">${entity.pricing}/yr</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    {entity.services.length} service{entity.services.length !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t-2 border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100">Annual Total</span>
                <span className="text-2xl font-bold text-blue-400">
                  ${entities.reduce((sum, e) => sum + e.pricing, 0).toLocaleString()}/yr
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Monthly Estimate</span>
                <span className="font-semibold text-slate-100">
                  ${Math.round(entities.reduce((sum, e) => sum + e.pricing, 0) / 12).toLocaleString()}/mo
                </span>
              </div>

              {entities.some(e => e.turnover || e.employees) && (
                <div className="mt-4 p-3 bg-blue-500/10 rounded-lg">
                  <p className="text-xs text-blue-300 font-semibold mb-1">Complexity Adjustments:</p>
                  <ul className="text-xs text-blue-300 space-y-1">
                    {entities.some(e => e.turnover && e.turnover > 1000000) && (
                      <li>• High turnover multiplier applied</li>
                    )}
                    {entities.some(e => e.employees && e.employees > 20) && (
                      <li>• Large workforce multiplier applied</li>
                    )}
                    {entities.length > 3 && (
                      <li>• Group structure discount applied</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <SecondaryButton onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </SecondaryButton>
        <div className="flex items-center gap-4">
          {!canProgress && (
            <div className="flex items-center gap-2 text-amber-400">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">Select at least one service per entity</span>
            </div>
          )}
          <PrimaryButton onClick={onContinue} disabled={!canProgress}>
            Continue to Engagement
            <ArrowRight className="w-4 h-4 ml-2" />
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
