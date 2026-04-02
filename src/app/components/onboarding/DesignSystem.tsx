import React from 'react';
import { Check, AlertTriangle, Clock, Shield, X, ChevronRight } from 'lucide-react';

// DESIGN SYSTEM FOUNDATION
// All components follow consistent styling and behavior

// BUTTONS
export const PrimaryButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}> = ({ children, onClick, disabled, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors ${className}`}
  >
    {children}
  </button>
);

export const SecondaryButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}> = ({ children, onClick, disabled, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors ${className}`}
  >
    {children}
  </button>
);

export const DangerButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}> = ({ children, onClick, disabled, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors ${className}`}
  >
    {children}
  </button>
);

export const ApproveButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}> = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
  >
    <Check className="w-5 h-5" />
    {children}
  </button>
);

export const EscalateButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}> = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
  >
    <AlertTriangle className="w-5 h-5" />
    {children}
  </button>
);

// STATUS BADGES
export type BadgeStatus = 
  | 'draft'
  | 'awaiting-client'
  | 'awaiting-id'
  | 'sanctions-pending'
  | 'medium-risk'
  | 'high-risk'
  | 'escalated'
  | 'approved'
  | 'activated'
  | 'low-risk'
  | 'pending'
  | 'verified'
  | 'rejected';

export const StatusBadge: React.FC<{
  status: BadgeStatus;
  className?: string;
}> = ({ status, className = '' }) => {
  const configs = {
    'draft': { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft', icon: null },
    'awaiting-client': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Awaiting Client', icon: Clock },
    'awaiting-id': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Awaiting ID', icon: Clock },
    'sanctions-pending': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Sanctions Pending', icon: Shield },
    'low-risk': { bg: 'bg-green-100', text: 'text-green-700', label: 'Low Risk', icon: Check },
    'medium-risk': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Medium Risk', icon: AlertTriangle },
    'high-risk': { bg: 'bg-red-100', text: 'text-red-700', label: 'High Risk', icon: AlertTriangle },
    'escalated': { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Escalated', icon: AlertTriangle },
    'approved': { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved', icon: Check },
    'activated': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Activated', icon: Check },
    'pending': { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Pending', icon: Clock },
    'verified': { bg: 'bg-green-100', text: 'text-green-700', label: 'Verified', icon: Check },
    'rejected': { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected', icon: X },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase ${config.bg} ${config.text} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {config.label}
    </span>
  );
};

// RISK METER
export const RiskMeter: React.FC<{
  score: number; // 0-100
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ score, label, size = 'md' }) => {
  const getRiskLevel = () => {
    if (score <= 30) return { color: 'green', label: 'Low Risk' };
    if (score <= 60) return { color: 'amber', label: 'Medium Risk' };
    return { color: 'red', label: 'High Risk' };
  };

  const risk = getRiskLevel();
  const sizes = {
    sm: { height: 'h-2', width: 'w-32', text: 'text-xs' },
    md: { height: 'h-3', width: 'w-48', text: 'text-sm' },
    lg: { height: 'h-4', width: 'w-64', text: 'text-base' }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <span className={`font-semibold text-gray-700 ${sizes[size].text}`}>{label}</span>}
      <div className="flex items-center gap-3">
        <div className={`${sizes[size].width} ${sizes[size].height} bg-gray-200 rounded-full overflow-hidden`}>
          <div 
            className={`${sizes[size].height} bg-${risk.color}-600 transition-all duration-300`}
            style={{ width: `${score}%` }}
          />
        </div>
        <span className={`font-bold ${sizes[size].text} text-${risk.color}-700`}>
          {score}/100
        </span>
        <StatusBadge status={risk.label === 'Low Risk' ? 'low-risk' : risk.label === 'Medium Risk' ? 'medium-risk' : 'high-risk'} />
      </div>
    </div>
  );
};

// FORM INPUTS
export const TextInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}> = ({ label, value, onChange, placeholder, required, error, disabled }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
        error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
      }`}
    />
    {error && <span className="text-xs text-red-600">{error}</span>}
  </div>
);

export const DateInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
}> = ({ label, value, onChange, required, error }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
      }`}
    />
    {error && <span className="text-xs text-red-600">{error}</span>}
  </div>
);

export const DropdownInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
  placeholder?: string;
}> = ({ label, value, onChange, options, required, error, placeholder }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
      }`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <span className="text-xs text-red-600">{error}</span>}
  </div>
);

export const RiskFlagToggle: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  riskLevel?: 'low' | 'medium' | 'high';
  description?: string;
}> = ({ label, checked, onChange, riskLevel = 'medium', description }) => {
  const colors = {
    low: 'bg-green-600',
    medium: 'bg-amber-600',
    high: 'bg-red-600'
  };

  return (
    <div className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? colors[riskLevel] : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <div className="flex-1">
        <p className="font-semibold text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
    </div>
  );
};

// FILE UPLOAD AREA
export const FileUploadArea: React.FC<{
  label: string;
  onUpload: (file: File) => void;
  accept?: string;
  required?: boolean;
  uploaded?: boolean;
  fileName?: string;
}> = ({ label, onUpload, accept, required, uploaded, fileName }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        uploaded
          ? 'border-green-300 bg-green-50'
          : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
      }`}
      onClick={() => {
        const input = document.createElement('input');
        input.type = 'file';
        if (accept) input.accept = accept;
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) onUpload(file);
        };
        input.click();
      }}
    >
      {uploaded ? (
        <div className="flex flex-col items-center gap-2">
          <Check className="w-8 h-8 text-green-600" />
          <p className="font-semibold text-green-700">{fileName || 'File Uploaded'}</p>
          <p className="text-xs text-green-600">Click to replace</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <ChevronRight className="w-8 h-8 text-gray-400 rotate-90" />
          <p className="font-semibold text-gray-700">Drag and drop or click to upload</p>
          <p className="text-xs text-gray-500">{accept || 'All file types accepted'}</p>
        </div>
      )}
    </div>
  </div>
);

// PROGRESS INDICATOR
export const ProgressIndicator: React.FC<{
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}> = ({ currentStep, totalSteps, stepLabels }) => (
  <div className="w-full">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-semibold text-gray-700">
        Step {currentStep} of {totalSteps}
      </span>
      <span className="text-sm text-gray-600">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
    </div>
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
      <div
        className="h-full bg-blue-600 transition-all duration-300"
        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
      />
    </div>
    <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
      {stepLabels.map((label, idx) => (
        <div
          key={idx}
          className={`text-center ${
            idx < currentStep ? 'text-blue-600 font-semibold' : idx === currentStep - 1 ? 'text-gray-900 font-semibold' : ''
          }`}
        >
          {label}
        </div>
      ))}
    </div>
  </div>
);

// COMPLETION CHECKLIST
export const CompletionChecklist: React.FC<{
  items: { label: string; complete: boolean }[];
}> = ({ items }) => (
  <div className="space-y-2">
    {items.map((item, idx) => (
      <div
        key={idx}
        className={`flex items-center gap-3 p-3 rounded-lg ${
          item.complete ? 'bg-green-50' : 'bg-gray-50'
        }`}
      >
        {item.complete ? (
          <Check className="w-5 h-5 text-green-600" />
        ) : (
          <div className="w-5 h-5 border-2 border-gray-300 rounded" />
        )}
        <span className={`font-medium ${item.complete ? 'text-green-900' : 'text-gray-700'}`}>
          {item.label}
        </span>
      </div>
    ))}
  </div>
);
