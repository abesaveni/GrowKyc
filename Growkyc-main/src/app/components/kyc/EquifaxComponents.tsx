import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Upload,
  X,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  FileText,
  Shield,
  Clock,
  Info
} from 'lucide-react';

interface OrderReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OrderData) => void;
  clientName?: string;
  clientId?: string;
}

interface OrderData {
  productType: 'business-credit' | 'director-check' | 'insolvency' | 'ongoing-monitoring';
  clientId: string;
  clientName: string;
  consentConfirmed: boolean;
  costEstimate: number;
}

export function OrderReportModal({ isOpen, onClose, onSubmit, clientName, clientId }: OrderReportModalProps) {
  const [productType, setProductType] = useState<OrderData['productType']>('business-credit');
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const products = [
    {
      type: 'business-credit' as const,
      name: 'Business Credit Report',
      description: 'Comprehensive credit history, payment defaults, court actions, and credit score',
      cost: 89.50,
      features: ['Credit Risk Score', 'Payment History', 'Court Actions', 'Credit Enquiries', 'Director Details']
    },
    {
      type: 'director-check' as const,
      name: 'Director Network Check',
      description: 'Director relationships, associated entities, and network risk analysis',
      cost: 125.00,
      features: ['Director Connections', 'Related Entities', 'Phoenix Pattern Detection', 'Undisclosed Entities']
    },
    {
      type: 'insolvency' as const,
      name: 'Insolvency & External Admin Check',
      description: 'Detailed insolvency history, external administration status, and creditor information',
      cost: 75.00,
      features: ['Insolvency Status', 'Administrator Details', 'Creditor List', 'Court Orders']
    },
    {
      type: 'ongoing-monitoring' as const,
      name: 'Ongoing Monitoring Subscription',
      description: 'Real-time alerts for credit score changes, court actions, and director changes',
      cost: 49.00,
      features: ['Real-time Alerts', 'Automated Reports', 'Risk Score Changes', 'Director Changes', 'Monthly Billing']
    }
  ];

  const selectedProduct = products.find(p => p.type === productType);

  const handleSubmit = () => {
    if (!consentConfirmed || !selectedProduct) return;

    setLoading(true);
    setTimeout(() => {
      onSubmit({
        productType,
        clientId: clientId || 'C001',
        clientName: clientName || 'Client Name',
        consentConfirmed,
        costEstimate: selectedProduct.cost
      });
      setLoading(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 dark:text-gray-100">Order Equifax Report</h2>
            {clientName && (
              <p className="text-sm text-slate-300 dark:text-gray-400 mt-1">Client: {clientName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg hover:bg-white/5 dark:hover:bg-gray-700 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-slate-300 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Product Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-100 dark:text-gray-100 mb-3">
              Select Product Type <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {products.map((product) => (
                <button
                  key={product.type}
                  onClick={() => setProductType(product.type)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    productType === product.type
                      ? 'border-indigo-600 bg-indigo-500/10 dark:bg-indigo-900/20'
                      : 'border-white/10 dark:border-gray-700 hover:border-white/10 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-100 dark:text-gray-100">{product.name}</h3>
                        {productType === product.type && (
                          <CheckCircle className="w-5 h-5 text-indigo-400" />
                        )}
                      </div>
                      <p className="text-sm text-slate-300 dark:text-gray-400 mb-3">{product.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {product.features.map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-white/5 dark:bg-gray-700 text-xs font-semibold text-slate-300 dark:text-gray-300 rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-2xl font-bold text-indigo-400">${product.cost.toFixed(2)}</p>
                      <p className="text-xs text-slate-400 dark:text-gray-400">
                        {product.type === 'ongoing-monitoring' ? 'per month' : 'one-time'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Cost Estimate */}
          {selectedProduct && (
            <div className="bg-blue-500/10 dark:bg-blue-900/20 border border-blue-500/30 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-blue-400 dark:text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-300 dark:text-blue-300 mb-1">Cost Estimate</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-blue-300 dark:text-blue-300">
                      ${selectedProduct.cost.toFixed(2)}
                    </span>
                    <span className="text-sm text-blue-300 dark:text-blue-400">
                      {selectedProduct.type === 'ongoing-monitoring' ? 'per month (cancel anytime)' : 'one-time fee'}
                    </span>
                  </div>
                  <p className="text-sm text-blue-300 dark:text-blue-400 mt-2">
                    Report will be available within 15 minutes. You'll receive a notification when ready.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Consent Confirmation */}
          <div className="bg-yellow-500/10 dark:bg-yellow-900/20 border border-yellow-500/30 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 dark:text-yellow-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-300 dark:text-yellow-300 mb-2">Client Consent Required</h4>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentConfirmed}
                    onChange={(e) => setConsentConfirmed(e.target.checked)}
                    className="w-5 h-5 text-indigo-400 mt-1"
                  />
                  <span className="text-sm text-yellow-300 dark:text-yellow-300">
                    <strong>I confirm</strong> that the client has provided consent for Equifax to access their credit 
                    information and that this request is made in accordance with the Privacy Act 1988 (Cth) and 
                    AML/CTF obligations. Evidence of consent is stored in the client file.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Information Notice */}
          <div className="bg-white/5 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-slate-300 dark:text-gray-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-100 dark:text-gray-100 mb-2">What Happens Next</h4>
                <ul className="text-sm text-slate-300 dark:text-gray-400 space-y-1">
                  <li>• Report will be ordered from Equifax immediately</li>
                  <li>• Processing typically takes 10-15 minutes</li>
                  <li>• You'll receive an email and in-app notification when ready</li>
                  <li>• Report will be stored securely with SHA-256 hash for audit trail</li>
                  <li>• Risk score will be automatically recalculated</li>
                  <li>• Any adverse events will trigger monitoring alerts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/10 dark:border-gray-700 bg-white/5 dark:bg-gray-900 sticky bottom-0">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!consentConfirmed || loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-700"
          >
            {loading ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Order Report - ${selectedProduct?.cost.toFixed(2)}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Risk Score Gauge Component
export function RiskScoreGauge({ score, maxScore = 1000, riskTier }: { score: number; maxScore?: number; riskTier: 'low' | 'medium' | 'high' | 'critical' }) {
  const percentage = (score / maxScore) * 100;
  const rotation = (percentage / 100) * 180 - 90; // -90 to 90 degrees

  const getColor = () => {
    switch (riskTier) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#f97316';
      case 'critical': return '#ef4444';
    }
  };

  return (
    <div className="relative w-48 h-24">
      {/* Background Arc */}
      <svg className="w-full h-full" viewBox="0 0 200 100">
        <path
          d="M 10 90 A 80 80 0 0 1 190 90"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="20"
          strokeLinecap="round"
        />
        {/* Colored Arc */}
        <path
          d="M 10 90 A 80 80 0 0 1 190 90"
          fill="none"
          stroke={getColor()}
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray={`${percentage * 2.83} 283`}
        />
        {/* Needle */}
        <line
          x1="100"
          y1="90"
          x2="100"
          y2="30"
          stroke={getColor()}
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${rotation} 100 90)`}
        />
        <circle cx="100" cy="90" r="8" fill={getColor()} />
      </svg>
      {/* Score Display */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-3xl font-bold" style={{ color: getColor() }}>{score}</p>
        <p className="text-xs text-slate-400">out of {maxScore}</p>
      </div>
    </div>
  );
}

// Credit Risk Badge Component
export function CreditRiskBadge({ tier, size = 'md' }: { tier: 'low' | 'medium' | 'high' | 'critical'; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const colorClasses = {
    low: 'bg-green-500/15 text-green-300 border-green-500/30 dark:bg-green-900 dark:text-green-300 dark:border-green-800',
    medium: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800',
    high: 'bg-orange-500/15 text-orange-300 border-orange-500/30 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-800',
    critical: 'bg-red-500/15 text-red-300 border-red-500/30 dark:bg-red-900 dark:text-red-300 dark:border-red-800'
  };

  return (
    <span className={`${sizeClasses[size]} ${colorClasses[tier]} font-bold rounded-full border-2 inline-flex items-center gap-1`}>
      {tier === 'critical' && <AlertTriangle className="w-4 h-4" />}
      {tier.toUpperCase()} RISK
    </span>
  );
}

// Escalation Banner Component
export function EscalationBanner({ 
  previousRisk, 
  newRisk, 
  reason, 
  requiredAction,
  onReview,
  onRestrict
}: {
  previousRisk: string;
  newRisk: string;
  reason: string;
  requiredAction: string;
  onReview: () => void;
  onRestrict: () => void;
}) {
  return (
    <div className="bg-orange-500/10 dark:bg-orange-900/20 border-2 border-orange-500 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-4">
        <AlertTriangle className="w-8 h-8 text-orange-400 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-orange-300 dark:text-orange-300 mb-2">
            Risk Increased Due to Equifax Alert
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-orange-300 dark:text-orange-400 mb-1">Previous Risk</p>
              <p className="text-2xl font-bold text-orange-300 dark:text-orange-300">{previousRisk}</p>
            </div>
            <div>
              <p className="text-sm text-orange-300 dark:text-orange-400 mb-1">New Risk</p>
              <p className="text-2xl font-bold text-red-400">{newRisk}</p>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-sm font-semibold text-orange-300 dark:text-orange-300 mb-1">Trigger Reason:</p>
            <p className="text-orange-300 dark:text-orange-400">{reason}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-semibold text-orange-300 dark:text-orange-300 mb-1">Required Action:</p>
            <p className="text-orange-300 dark:text-orange-400">{requiredAction}</p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={onReview}>
              <FileText className="w-4 h-4 mr-2" />
              Review Case
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={onRestrict}>
              <Shield className="w-4 h-4 mr-2" />
              Restrict Engagement
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Lock Indicator Component
export function LockIndicator({ locked, reason }: { locked: boolean; reason?: string }) {
  if (!locked) return null;

  return (
    <div className="fixed top-20 right-8 z-50">
      <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-pulse">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold">CLIENT RESTRICTED</p>
          {reason && <p className="text-sm text-red-100">{reason}</p>}
        </div>
      </div>
    </div>
  );
}

// Immutable Hash Indicator Component
export function ImmutableHashIndicator({ hash, timestamp }: { hash: string; timestamp: Date }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-indigo-500/10 dark:bg-indigo-900/20 border border-indigo-500/30 dark:border-indigo-800 rounded-lg">
      <Shield className="w-5 h-5 text-indigo-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-indigo-300 dark:text-indigo-300 mb-1">Immutable Evidence Hash</p>
        <p className="text-xs text-indigo-300 dark:text-indigo-400 font-mono truncate">
          SHA-256: {hash}
        </p>
        <p className="text-xs text-indigo-400 dark:text-indigo-500 mt-1">
          Timestamped: {timestamp.toLocaleString()}
        </p>
      </div>
      <button
        onClick={copyToClipboard}
        className="px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded hover:bg-indigo-700"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}
