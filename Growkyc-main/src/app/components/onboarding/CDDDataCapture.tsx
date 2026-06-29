// Comprehensive CDD Data Capture Component - ALL Entity Types
import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Save, Upload, Plus, Trash2, AlertCircle, Shield, CheckCircle, Clock } from 'lucide-react';
import { PrimaryButton, SecondaryButton, StatusBadge } from './DesignSystem';
import { toast } from 'sonner';
import { CompanyCDDForm, TrustCDDForm, GovernmentCDDForm, SMSFCDDForm } from './CDDForms';

interface CDDDataCaptureProps {
  entities: any[];
  onUpdate: (id: string, data: Record<string, any>, complianceStatus: any, riskStatus: any) => void;
  onBack: () => void;
  onContinue: () => void;
  canProgress: boolean;
}

export function CDDDataCapture({ entities, onUpdate, onBack, onContinue, canProgress }: CDDDataCaptureProps) {
  const [selectedEntityId, setSelectedEntityId] = useState(entities[0]?.id);
  const [isScreening, setIsScreening] = useState(false);

  const selectedEntity = entities.find(e => e.id === selectedEntityId);

  const handleComplete = async (entityId: string, formData: any) => {
    setIsScreening(true);
    toast.info('🔍 Running sanctions and PEP screening...');
    
    // Simulate screening
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onUpdate(entityId, formData, 'complete', 'not-assessed');
    setIsScreening(false);
    toast.success('✓ CDD data captured and screening complete');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Phase 4: Full AML/CDD Compliance</h2>
        <p className="text-slate-300">Complete all mandatory fields for AUSTRAC compliance</p>
      </div>

      {/* Entity Selection Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b-2 border-white/10">
        {entities.map((entity) => (
          <button
            key={entity.id}
            onClick={() => setSelectedEntityId(entity.id)}
            className={`px-4 py-2 rounded-t-lg whitespace-nowrap flex items-center gap-2 ${
              selectedEntityId === entity.id
                ? 'bg-blue-600 text-white'
                : 'bg-white border-2 border-white/10 text-slate-300 hover:border-blue-300'
            }`}
          >
            {entity.name}
            {entity.complianceStatus === 'complete' && (
              <CheckCircle className="w-4 h-4" />
            )}
            {entity.complianceStatus === 'blocked' && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
          </button>
        ))}
      </div>

      {/* Entity Form */}
      {selectedEntity && (
        <div className="bg-white border-2 border-white/10 rounded-lg p-6">
          {selectedEntity.type === 'individual' || selectedEntity.type === 'sole-trader' ? (
            <IndividualCDDForm
              entity={selectedEntity}
              onComplete={handleComplete}
              isScreening={isScreening}
            />
          ) : selectedEntity.type === 'company' ? (
            <CompanyCDDForm
              entity={selectedEntity}
              onComplete={handleComplete}
              isScreening={isScreening}
            />
          ) : selectedEntity.type === 'trust' ? (
            <TrustCDDForm
              entity={selectedEntity}
              onComplete={handleComplete}
              isScreening={isScreening}
            />
          ) : selectedEntity.type === 'government' ? (
            <GovernmentCDDForm
              entity={selectedEntity}
              onComplete={handleComplete}
              isScreening={isScreening}
            />
          ) : selectedEntity.type === 'smsf' ? (
            <SMSFCDDForm
              entity={selectedEntity}
              onComplete={handleComplete}
              isScreening={isScreening}
            />
          ) : (
            <div className="text-center py-12 text-slate-300">
              CDD form for {selectedEntity.type} coming soon
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between mt-8">
        <SecondaryButton onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </SecondaryButton>
        <div className="flex items-center gap-4">
          {!canProgress && (
            <div className="flex items-center gap-2 text-amber-400">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">Complete all mandatory fields and clear screenings</span>
            </div>
          )}
          <PrimaryButton onClick={onContinue} disabled={!canProgress || isScreening}>
            Continue to Review
            <ArrowRight className="w-4 h-4 ml-2" />
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

// INDIVIDUAL CDD FORM - ALL REQUIRED FIELDS
function IndividualCDDForm({ entity, onComplete, isScreening }: any) {
  const [formData, setFormData] = useState(entity.data || {});

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    // Validate mandatory fields
    const required = [
      'fullLegalName', 'dateOfBirth', 'residentialAddress', 
      'email', 'phone', 'occupation', 'sourceOfFunds'
    ];
    
    const missing = required.filter(field => !formData[field]);
    
    if (missing.length > 0) {
      toast.error(`Missing required fields: ${missing.join(', ')}`);
      return;
    }

    onComplete(entity.id, formData);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
        <Shield className="w-6 h-6 text-blue-400" />
        Individual CDD Form - {entity.name}
      </h3>

      {/* Personal Details */}
      <div className="border-l-4 border-blue-600 pl-4">
        <h4 className="font-bold text-slate-100 mb-4">Personal Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
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
              Any Former Names
            </label>
            <input
              type="text"
              value={formData.formerNames || ''}
              onChange={(e) => updateField('formerNames', e.target.value)}
              className="w-full px-4 py-2 border border-white/10 rounded-lg"
              placeholder="Previous names if any"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Date of Birth <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={formData.dateOfBirth || ''}
              onChange={(e) => updateField('dateOfBirth', e.target.value)}
              className="w-full px-4 py-2 border border-white/10 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Occupation <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.occupation || ''}
              onChange={(e) => updateField('occupation', e.target.value)}
              className="w-full px-4 py-2 border border-white/10 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Employer
            </label>
            <input
              type="text"
              value={formData.employer || ''}
              onChange={(e) => updateField('employer', e.target.value)}
              className="w-full px-4 py-2 border border-white/10 rounded-lg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Residential Address <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.residentialAddress || ''}
              onChange={(e) => updateField('residentialAddress', e.target.value)}
              className="w-full px-4 py-2 border border-white/10 rounded-lg"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Postal Address (if different)
            </label>
            <input
              type="text"
              value={formData.postalAddress || ''}
              onChange={(e) => updateField('postalAddress', e.target.value)}
              className="w-full px-4 py-2 border border-white/10 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full px-4 py-2 border border-white/10 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Phone <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => updateField('phone', e.target.value)}
              className="w-full px-4 py-2 border border-white/10 rounded-lg"
              required
            />
          </div>
        </div>
      </div>

      {/* Tax Information */}
      <div className="border-l-4 border-green-600 pl-4">
        <h4 className="font-bold text-slate-100 mb-4">Tax Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Tax File Number (TFN)
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
              Country of Tax Residence
            </label>
            <select
              value={formData.taxResidenceCountry || 'Australia'}
              onChange={(e) => updateField('taxResidenceCountry', e.target.value)}
              className="w-full px-4 py-2 border border-white/10 rounded-lg"
            >
              <option value="Australia">Australia</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="New Zealand">New Zealand</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Foreign Tax ID (if applicable)
            </label>
            <input
              type="text"
              value={formData.foreignTaxId || ''}
              onChange={(e) => updateField('foreignTaxId', e.target.value)}
              className="w-full px-4 py-2 border border-white/10 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Sole Trader Additional Fields */}
      {entity.type === 'sole-trader' && (
        <div className="border-l-4 border-purple-600 pl-4">
          <h4 className="font-bold text-slate-100 mb-4">Business Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Business Name
              </label>
              <input
                type="text"
                value={formData.businessName || ''}
                onChange={(e) => updateField('businessName', e.target.value)}
                className="w-full px-4 py-2 border border-white/10 rounded-lg"
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
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Nature of Business
              </label>
              <textarea
                value={formData.natureOfBusiness || ''}
                onChange={(e) => updateField('natureOfBusiness', e.target.value)}
                className="w-full px-4 py-2 border border-white/10 rounded-lg"
                rows={2}
              />
            </div>
          </div>
        </div>
      )}

      {/* Risk Assessment */}
      <div className="border-l-4 border-red-600 pl-4">
        <h4 className="font-bold text-slate-100 mb-4">Risk Assessment</h4>
        <div className="space-y-3">
          <label className="flex items-start gap-3 p-3 border border-white/10 rounded hover:bg-white/5">
            <input
              type="checkbox"
              checked={formData.cashInvolvement || false}
              onChange={(e) => updateField('cashInvolvement', e.target.checked)}
              className="mt-1 w-4 h-4"
            />
            <div>
              <span className="text-sm font-semibold text-slate-100">Cash Involvement</span>
              <p className="text-xs text-slate-300">Significant cash transactions in business activities</p>
            </div>
          </label>
          <label className="flex items-start gap-3 p-3 border border-white/10 rounded hover:bg-white/5">
            <input
              type="checkbox"
              checked={formData.cryptoInvolvement || false}
              onChange={(e) => updateField('cryptoInvolvement', e.target.checked)}
              className="mt-1 w-4 h-4"
            />
            <div>
              <span className="text-sm font-semibold text-slate-100">Cryptocurrency Involvement</span>
              <p className="text-xs text-slate-300">Dealing in digital currencies or crypto assets</p>
            </div>
          </label>
          <label className="flex items-start gap-3 p-3 border border-white/10 rounded hover:bg-white/5">
            <input
              type="checkbox"
              checked={formData.pepStatus || false}
              onChange={(e) => updateField('pepStatus', e.target.checked)}
              className="mt-1 w-4 h-4"
            />
            <div>
              <span className="text-sm font-semibold text-slate-100">Politically Exposed Person (PEP)</span>
              <p className="text-xs text-slate-300">Hold or have held prominent public function</p>
            </div>
          </label>
          <label className="flex items-start gap-3 p-3 border border-white/10 rounded hover:bg-white/5">
            <input
              type="checkbox"
              checked={formData.relatedPartyPep || false}
              onChange={(e) => updateField('relatedPartyPep', e.target.checked)}
              className="mt-1 w-4 h-4"
            />
            <div>
              <span className="text-sm font-semibold text-slate-100">Related Party PEP</span>
              <p className="text-xs text-slate-300">Family member or close associate of PEP</p>
            </div>
          </label>
          <label className="flex items-start gap-3 p-3 border border-white/10 rounded hover:bg-white/5">
            <input
              type="checkbox"
              checked={formData.unexplainedWealth || false}
              onChange={(e) => updateField('unexplainedWealth', e.target.checked)}
              className="mt-1 w-4 h-4"
            />
            <div>
              <span className="text-sm font-semibold text-slate-100">Unexplained Wealth Declaration</span>
              <p className="text-xs text-slate-300">Unable to adequately explain source of wealth</p>
            </div>
          </label>
          <label className="flex items-start gap-3 p-3 border border-white/10 rounded hover:bg-white/5">
            <input
              type="checkbox"
              checked={formData.charityNpo || false}
              onChange={(e) => updateField('charityNpo', e.target.checked)}
              className="mt-1 w-4 h-4"
            />
            <div>
              <span className="text-sm font-semibold text-slate-100">Charity or NPO Involvement</span>
              <p className="text-xs text-slate-300">Involved with charities or not-for-profit organizations</p>
            </div>
          </label>
        </div>
      </div>

      {/* Source of Funds */}
      <div className="border-l-4 border-amber-600 pl-4">
        <h4 className="font-bold text-slate-100 mb-4">Source Information</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Source of Funds <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.sourceOfFunds || ''}
              onChange={(e) => updateField('sourceOfFunds', e.target.value)}
              className="w-full px-4 py-2 border border-white/10 rounded-lg"
              rows={3}
              placeholder="Describe where your money comes from (e.g., employment income, business profits, investments)"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Source of Wealth
            </label>
            <textarea
              value={formData.sourceOfWealth || ''}
              onChange={(e) => updateField('sourceOfWealth', e.target.value)}
              className="w-full px-4 py-2 border border-white/10 rounded-lg"
              rows={3}
              placeholder="Describe how you accumulated your wealth (e.g., inheritance, business sale, career earnings)"
            />
          </div>
        </div>
      </div>

      {/* ID Documents */}
      <div className="border-l-4 border-indigo-600 pl-4">
        <h4 className="font-bold text-slate-100 mb-4">
          ID Documents <span className="text-red-400">*</span>
        </h4>
        <p className="text-sm text-slate-300 mb-4">
          Upload certified copy of Driver License OR Passport (as per Appendix A)
        </p>
        <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-slate-300 mb-2">Drag and drop or click to upload</p>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              updateField('idDocuments', files);
              toast.success(`${files.length} document(s) uploaded`);
            }}
            className="hidden"
            id="id-upload"
          />
          <label htmlFor="id-upload">
            <span className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 cursor-pointer inline-block">
              Choose Files
            </span>
          </label>
          {formData.idDocuments && formData.idDocuments.length > 0 && (
            <p className="text-sm text-green-400 mt-2">
              ✓ {formData.idDocuments.length} document(s) uploaded
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
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

// COMPANY CDD FORM - Continue in next file...