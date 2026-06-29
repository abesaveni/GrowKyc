// Additional CDD Forms - Company, Trust, Government, SMSF
import React, { useState } from 'react';
import { Upload, Plus, Trash2, Save, Clock, Shield } from 'lucide-react';
import { PrimaryButton } from './DesignSystem';
import { toast } from 'sonner';

// COMPANY CDD FORM
export function CompanyCDDForm({ entity, onComplete, isScreening }: any) {
  const [formData, setFormData] = useState(entity.data || {
    beneficialOwners: [],
    directors: [],
    shareholders: []
  });

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const addBeneficialOwner = () => {
    const newOwner = {
      id: Date.now(),
      fullName: '',
      otherNames: '',
      dateOfBirth: '',
      residentialAddress: '',
      occupation: '',
      country: 'Australia',
      ownership: '',
      pepStatus: false
    };
    updateField('beneficialOwners', [...(formData.beneficialOwners || []), newOwner]);
  };

  const updateBeneficialOwner = (id: number, field: string, value: any) => {
    const updated = formData.beneficialOwners.map((owner: any) =>
      owner.id === id ? { ...owner, [field]: value } : owner
    );
    updateField('beneficialOwners', updated);
  };

  const removeBeneficialOwner = (id: number) => {
    updateField('beneficialOwners', formData.beneficialOwners.filter((owner: any) => owner.id !== id));
  };

  const handleSubmit = () => {
    const required = ['fullLegalName', 'acn', 'abn', 'registeredOffice', 'industry', 'dateIncorporated'];
    const missing = required.filter(field => !formData[field]);
    
    if (missing.length > 0) {
      toast.error(`Missing required fields: ${missing.join(', ')}`);
      return;
    }

    if (!formData.beneficialOwners || formData.beneficialOwners.length === 0) {
      toast.error('Must add at least one beneficial owner (25%+ ownership or CEO if none)');
      return;
    }

    onComplete(entity.id, formData);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
        <Shield className="w-6 h-6 text-blue-400" />
        Company CDD Form - {entity.name}
      </h3>

      {/* Company Details */}
      <div className="border-l-4 border-blue-600 pl-4">
        <h4 className="font-bold text-slate-100 mb-4">Company Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Full Legal Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.fullLegalName || ''}
              onChange={(e) => updateField('fullLegalName', e.target.value)}
              className="w-full px-4 py-2 border border-white/10 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              ACN <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.acn || ''}
              onChange={(e) => updateField('acn', e.target.value)}
              className="w-full px-4 py-2 border border-white/10 rounded-lg"
              maxLength={9}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              ABN <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.abn || ''}
              onChange={(e) => updateField('abn', e.target.value)}
              className="w-full px-4 py-2 border border-white/10 rounded-lg"
              maxLength={11}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              TFN
            </label>
            <input
              type="text"
              value={formData.tfn || ''}
              onChange={(e) => updateField('tfn', e.target.value)}
              className="w-full px-4 py-2 border border-white/10 rounded-lg"
              maxLength={9}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Date Incorporated <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={formData.dateIncorporated || ''}
              onChange={(e) => updateField('dateIncorporated', e.target.value)}
              className="w-full px-4 py-2 border border-white/10 rounded-lg"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Registered Office <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.registeredOffice || ''}
              onChange={(e) => updateField('registeredOffice', e.target.value)}
              className="w-full px-4 py-2 border border-white/10 rounded-lg"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Principal Place of Business
            </label>
            <input
              type="text"
              value={formData.principalPlace || ''}
              onChange={(e) => updateField('principalPlace', e.target.value)}
              className="w-full px-4 py-2 border border-white/10 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Industry <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.industry || ''}
              onChange={(e) => updateField('industry', e.target.value)}
              className="w-full px-4 py-2 border border-white/10 rounded-lg"
              required
            />
          </div>
        </div>
      </div>

      {/* Beneficial Owners */}
      <div className="border-l-4 border-purple-600 pl-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-bold text-slate-100">
              Beneficial Owners (25%+ ownership) <span className="text-red-400">*</span>
            </h4>
            <p className="text-sm text-slate-300">List all individuals who own 25% or more, or CEO if none</p>
          </div>
          <button
            onClick={addBeneficialOwner}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Owner
          </button>
        </div>

        {formData.beneficialOwners && formData.beneficialOwners.length > 0 ? (
          <div className="space-y-4">
            {formData.beneficialOwners.map((owner: any, index: number) => (
              <div key={owner.id} className="border-2 border-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-semibold text-slate-100">Beneficial Owner #{index + 1}</h5>
                  <button
                    onClick={() => removeBeneficialOwner(owner.id)}
                    className="p-1 hover:bg-red-500/15 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Full Legal Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={owner.fullName}
                      onChange={(e) => updateBeneficialOwner(owner.id, 'fullName', e.target.value)}
                      className="w-full px-4 py-2 border border-white/10 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Other Names
                    </label>
                    <input
                      type="text"
                      value={owner.otherNames}
                      onChange={(e) => updateBeneficialOwner(owner.id, 'otherNames', e.target.value)}
                      className="w-full px-4 py-2 border border-white/10 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Date of Birth <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={owner.dateOfBirth}
                      onChange={(e) => updateBeneficialOwner(owner.id, 'dateOfBirth', e.target.value)}
                      className="w-full px-4 py-2 border border-white/10 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Ownership % <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      value={owner.ownership}
                      onChange={(e) => updateBeneficialOwner(owner.id, 'ownership', e.target.value)}
                      className="w-full px-4 py-2 border border-white/10 rounded-lg"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Residential Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={owner.residentialAddress}
                      onChange={(e) => updateBeneficialOwner(owner.id, 'residentialAddress', e.target.value)}
                      className="w-full px-4 py-2 border border-white/10 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Occupation
                    </label>
                    <input
                      type="text"
                      value={owner.occupation}
                      onChange={(e) => updateBeneficialOwner(owner.id, 'occupation', e.target.value)}
                      className="w-full px-4 py-2 border border-white/10 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Country of Residence
                    </label>
                    <input
                      type="text"
                      value={owner.country}
                      onChange={(e) => updateBeneficialOwner(owner.id, 'country', e.target.value)}
                      className="w-full px-4 py-2 border border-white/10 rounded-lg"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-start gap-3 p-3 border border-white/10 rounded hover:bg-white/5">
                      <input
                        type="checkbox"
                        checked={owner.pepStatus}
                        onChange={(e) => updateBeneficialOwner(owner.id, 'pepStatus', e.target.checked)}
                        className="mt-1 w-4 h-4"
                      />
                      <div>
                        <span className="text-sm font-semibold text-slate-100">PEP Status</span>
                        <p className="text-xs text-slate-300">Is this person a Politically Exposed Person?</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white/5 rounded-lg border-2 border-dashed border-white/10">
            <p className="text-slate-300 mb-2">No beneficial owners added</p>
            <p className="text-sm text-slate-400">Click "Add Owner" to add beneficial owners</p>
          </div>
        )}
      </div>

      {/* Risk Questions */}
      <div className="border-l-4 border-red-600 pl-4">
        <h4 className="font-bold text-slate-100 mb-4">Risk Questions</h4>
        <div className="space-y-3">
          <label className="flex items-start gap-3 p-3 border border-white/10 rounded hover:bg-white/5">
            <input
              type="checkbox"
              checked={formData.cashInvolvement || false}
              onChange={(e) => updateField('cashInvolvement', e.target.checked)}
              className="mt-1 w-4 h-4"
            />
            <span className="text-sm text-slate-100">Significant cash transactions</span>
          </label>
          <label className="flex items-start gap-3 p-3 border border-white/10 rounded hover:bg-white/5">
            <input
              type="checkbox"
              checked={formData.cryptoInvolvement || false}
              onChange={(e) => updateField('cryptoInvolvement', e.target.checked)}
              className="mt-1 w-4 h-4"
            />
            <span className="text-sm text-slate-100">Cryptocurrency involvement</span>
          </label>
          <label className="flex items-start gap-3 p-3 border border-white/10 rounded hover:bg-white/5">
            <input
              type="checkbox"
              checked={formData.complexStructure || false}
              onChange={(e) => updateField('complexStructure', e.target.checked)}
              className="mt-1 w-4 h-4"
            />
            <span className="text-sm text-slate-100">Complex ownership structure</span>
          </label>
          <label className="flex items-start gap-3 p-3 border border-white/10 rounded hover:bg-white/5">
            <input
              type="checkbox"
              checked={formData.crossBorderExposure || false}
              onChange={(e) => updateField('crossBorderExposure', e.target.checked)}
              className="mt-1 w-4 h-4"
            />
            <span className="text-sm text-slate-100">Cross-border operations</span>
          </label>
          <label className="flex items-start gap-3 p-3 border border-white/10 rounded hover:bg-white/5">
            <input
              type="checkbox"
              checked={formData.highRiskCountry || false}
              onChange={(e) => updateField('highRiskCountry', e.target.checked)}
              className="mt-1 w-4 h-4"
            />
            <span className="text-sm text-slate-100">Links to high risk countries</span>
          </label>
        </div>
      </div>

      {/* Documents */}
      <div className="border-l-4 border-indigo-600 pl-4">
        <h4 className="font-bold text-slate-100 mb-4">
          Required Documents <span className="text-red-400">*</span>
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">ASIC Extract</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                if (e.target.files) toast.success('ASIC Extract uploaded');
              }}
              className="w-full px-4 py-2 border border-white/10 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Constitution</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                if (e.target.files) toast.success('Constitution uploaded');
              }}
              className="w-full px-4 py-2 border border-white/10 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Share Register</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                if (e.target.files) toast.success('Share Register uploaded');
              }}
              className="w-full px-4 py-2 border border-white/10 rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <PrimaryButton onClick={handleSubmit} disabled={isScreening}>
          {isScreening ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Screening...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save & Run Screenings
            </>
          )}
        </PrimaryButton>
      </div>
    </div>
  );
}

// TRUST, GOVERNMENT, SMSF forms would follow similar patterns...
// Exporting placeholders for now
export function TrustCDDForm({ entity, onComplete, isScreening }: any) {
  return <div className="text-center py-12">Trust CDD Form - Implementation similar to Company form with trustees, appointors, beneficiaries</div>;
}

export function GovernmentCDDForm({ entity, onComplete, isScreening }: any) {
  return <div className="text-center py-12">Government Body CDD Form - Implementation with legislative authority, office holders</div>;
}

export function SMSFCDDForm({ entity, onComplete, isScreening }: any) {
  return <div className="text-center py-12">SMSF CDD Form - Implementation with trustee structure, members, auditor details</div>;
}
