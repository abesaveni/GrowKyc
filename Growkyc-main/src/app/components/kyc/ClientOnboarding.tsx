import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  User,
  Upload,
  CheckCircle,
  CreditCard,
  Activity,
  Shield,
  AlertTriangle,
  Building,
  Users,
  FileText,
  Loader2,
  ChevronRight,
  Check,
  X,
  Eye,
  ArrowLeft,
  Info,
  Lock,
  Globe,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Flag,
  Copy,
  Building2,
  Landmark,
  Download,
  ShieldCheck,
  Smartphone,
  Clock,
  Zap,
  CircleDollarSign,
} from 'lucide-react';
import { toast } from '../../lib/toast';

type OnboardingStep = 'personal' | 'upload-id' | 'consent' | 'payment' | 'processing' | 'results';

interface OnboardingData {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  email: string;
  mobile: string;
  residentialAddress: string;
  country: string;
  postalAddress: string;
  occupation: string;
  citizenship: string;
  actingForEntity: boolean;
  idType: string;
  idUploaded: boolean;
  consentIdentity: boolean;
  consentAML: boolean;
  consentMonitoring: boolean;
  confirmAccurate: boolean;
  paymentComplete: boolean;
}

interface CheckStatus {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'complete' | 'warning';
  provider?: string;
}

interface ClientOnboardingProps {
  onComplete?: () => void;
  onBack?: () => void;
}

export function ClientOnboarding({ onComplete, onBack }: ClientOnboardingProps = {}) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('personal');
  const [formData, setFormData] = useState<OnboardingData>({
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    email: '',
    mobile: '',
    residentialAddress: '',
    country: 'Australia',
    postalAddress: '',
    occupation: '',
    citizenship: '',
    actingForEntity: false,
    idType: '',
    idUploaded: false,
    consentIdentity: false,
    consentAML: false,
    consentMonitoring: false,
    confirmAccurate: false,
    paymentComplete: false
  });

  const [checks, setChecks] = useState<CheckStatus[]>([
    { id: 'identity', label: 'Verifying identity', status: 'pending', provider: 'Equifax' },
    { id: 'aml', label: 'Running AML screening', status: 'pending', provider: 'ComplyAdvantage' },
    { id: 'business', label: 'Checking business risk', status: 'pending', provider: 'Illion' },
    { id: 'entities', label: 'Reviewing linked entities', status: 'pending', provider: 'ASIC' },
    { id: 'associates', label: 'Searching for associated parties', status: 'pending' },
    { id: 'ownership', label: 'Analysing ownership and control', status: 'pending' },
    { id: 'results', label: 'Preparing results', status: 'pending' }
  ]);

  const [processingComplete, setProcessingComplete] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'approved' | 'review' | 'additional-info'>('approved');

  type PaymentMethod = 'card' | 'bpay' | 'payid';
  type BpayStatus = 'awaiting_payment' | 'verifying' | 'confirmed';
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bpay');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState<string | null>(null);
  const [bpayStatus, setBpayStatus] = useState<BpayStatus>('awaiting_payment');
  const [cardDetails, setCardDetails] = useState({ name: '', number: '', expiry: '', cvc: '' });
  const [bpayReferenceInput, setBpayReferenceInput] = useState('');
  const [bpayPaymentMade, setBpayPaymentMade] = useState(false);
  const [payIdEmail, setPayIdEmail] = useState('');
  const [payIdReferenceInput, setPayIdReferenceInput] = useState('');
  const [paymentSessionStarted] = useState(() => Date.now());

  const baseFee = 49;
  const entityFee = formData.actingForEntity ? 25 : 0;
  const monitoringFee = formData.consentMonitoring ? 15 : 0;
  const subtotal = baseFee + entityFee + monitoringFee;
  const gstAmount = Math.round(subtotal * 0.1 * 100) / 100;
  const totalAmount = Math.round((subtotal + gstAmount) * 100) / 100;
  const bpayBillerCode = '933443';
  const [bpayReference] = useState(() => `GROW${Date.now().toString().slice(-10)}`);
  const payId = 'payments@growkyc.com.au';
  const clientFullName = `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}`.trim();

  useEffect(() => {
    if (currentStep === 'payment' && formData.email && !payIdEmail) {
      setPayIdEmail(formData.email);
    }
  }, [currentStep, formData.email, payIdEmail]);

  useEffect(() => {
    if (currentStep === 'payment' && paymentMethod === 'bpay') {
      const intent = {
        billerCode: bpayBillerCode,
        reference: bpayReference,
        amount: totalAmount,
        clientName: clientFullName,
        email: formData.email,
        createdAt: new Date().toISOString(),
        status: 'awaiting_payment',
      };
      try {
        localStorage.setItem(`growkyc_bpay_intent_${bpayReference}`, JSON.stringify(intent));
      } catch { /* ignore */ }
    }
  }, [currentStep, paymentMethod, bpayReference, totalAmount, clientFullName, formData.email]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success(`${label} copied`));
  };

  const copyAllBpayDetails = () => {
    const details = `BPAY Payment — GrowKYC\nBiller Code: ${bpayBillerCode}\nReference: ${bpayReference}\nAmount: $${totalAmount.toFixed(2)} AUD\nClient: ${clientFullName}`;
    copyToClipboard(details, 'All BPAY details');
  };

  const copyAllPayIdDetails = () => {
    const details = `PayID Transfer — GrowKYC\nPayID: ${payId}\nAmount: $${totalAmount.toFixed(2)} AUD\nDescription: ${clientFullName} — KYC Verification\nReference: ${payIdReferenceInput || bpayReference}`;
    copyToClipboard(details, 'All PayID details');
  };

  const detectCardBrand = (number: string): string => {
    const digits = number.replace(/\s/g, '');
    if (/^4/.test(digits)) return 'Visa';
    if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'Mastercard';
    if (/^3[47]/.test(digits)) return 'Amex';
    return 'Card';
  };

  const paymentMethods: Array<{
    id: PaymentMethod;
    label: string;
    icon: typeof Landmark;
    desc: string;
    badge?: string;
    eta: string;
  }> = [
    { id: 'bpay', label: 'BPAY', icon: Landmark, desc: 'Pay via your bank app', badge: 'Recommended', eta: '1–2 business days' },
    { id: 'payid', label: 'PayID', icon: Zap, desc: 'Instant Osko transfer', badge: 'Fastest', eta: 'Near instant' },
    { id: 'card', label: 'Card', icon: CreditCard, desc: 'Visa / Mastercard', eta: 'Immediate' },
  ];

  const paymentReferenceExpiry = new Date(paymentSessionStarted + 24 * 60 * 60 * 1000).toLocaleString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const downloadPaymentReceipt = () => {
    if (!paymentReceipt) return;
    const content = [
      'GrowKYC — Payment Receipt',
      '========================',
      `Receipt ID: ${paymentReceipt}`,
      `Date: ${new Date().toLocaleString('en-AU')}`,
      `Client: ${clientFullName}`,
      `Email: ${formData.email}`,
      `Method: ${paymentMethod.toUpperCase()}`,
      `Amount: $${totalAmount.toFixed(2)} AUD (incl. GST $${gstAmount.toFixed(2)})`,
      paymentMethod === 'bpay' ? `BPAY Biller: ${bpayBillerCode}` : '',
      paymentMethod === 'bpay' ? `BPAY Reference: ${bpayReference}` : '',
      paymentMethod === 'bpay' ? `Bank Receipt Ref: ${bpayReferenceInput}` : '',
      '',
      'Thank you for your payment.',
    ].filter(Boolean).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GrowKYC-Receipt-${paymentReceipt}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Receipt downloaded');
  };

  const processCardPayment = async () => {
    const digits = cardDetails.number.replace(/\s/g, '');
    if (!cardDetails.name.trim()) { toast.error('Enter cardholder name'); return false; }
    if (digits.length < 15) { toast.error('Enter a valid card number'); return false; }
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) { toast.error('Enter expiry as MM/YY'); return false; }
    if (cardDetails.cvc.length < 3) { toast.error('Enter a valid CVC'); return false; }
    setPaymentProcessing(true);
    await new Promise((r) => setTimeout(r, 1800));
    setPaymentProcessing(false);
    return true;
  };

  const processBpayPayment = async () => {
    const ref = bpayReferenceInput.trim().toUpperCase();
    if (!ref) {
      toast.error('Enter your BPAY receipt reference from your banking app');
      return false;
    }
    if (!/^[A-Z0-9]{6,20}$/.test(ref)) {
      toast.error('BPAY receipt reference must be 6–20 letters or numbers (no spaces)');
      return false;
    }

    setBpayStatus('verifying');
    setPaymentProcessing(true);
    await new Promise((r) => setTimeout(r, 2200));

    // Verify against stored BPAY intent
    let intentOk = false;
    try {
      const raw = localStorage.getItem(`growkyc_bpay_intent_${bpayReference}`);
      if (raw) {
        const intent = JSON.parse(raw);
        intentOk =
          intent.billerCode === bpayBillerCode &&
          intent.reference === bpayReference &&
          Math.abs(intent.amount - totalAmount) < 0.01;
      }
    } catch { /* ignore */ }

    if (!intentOk) {
      setBpayStatus('awaiting_payment');
      setPaymentProcessing(false);
      toast.error('BPAY payment could not be verified. Check biller code, reference, and amount.');
      return false;
    }

    setBpayStatus('confirmed');
    setPaymentProcessing(false);
    return true;
  };

  const processPayIdPayment = async () => {
    if (!payIdEmail.trim() || !payIdEmail.includes('@')) {
      toast.error('Enter the email used for your PayID transfer');
      return false;
    }
    if (!payIdReferenceInput.trim() || payIdReferenceInput.trim().length < 4) {
      toast.error('Enter your PayID transfer reference from your bank');
      return false;
    }
    setPaymentProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setPaymentProcessing(false);
    return true;
  };

  const handleCompletePayment = async () => {
    let ok = false;
    if (paymentMethod === 'card') ok = await processCardPayment();
    else if (paymentMethod === 'bpay') ok = await processBpayPayment();
    else ok = await processPayIdPayment();

    if (!ok) return;

    const receiptId = `RCP-${Date.now().toString().slice(-8)}`;
    setPaymentReceipt(receiptId);
    updateFormData('paymentComplete', true);

    const paymentRecord = {
      receiptId,
      method: paymentMethod,
      amount: totalAmount,
      gst: gstAmount,
      subtotal,
      clientName: clientFullName,
      email: formData.email,
      bpayBillerCode: paymentMethod === 'bpay' ? bpayBillerCode : undefined,
      bpayReference: paymentMethod === 'bpay' ? bpayReference : undefined,
      bankReceiptRef: paymentMethod === 'bpay' ? bpayReferenceInput.trim().toUpperCase() : undefined,
      payIdEmail: paymentMethod === 'payid' ? payIdEmail : undefined,
      payIdTransferRef: paymentMethod === 'payid' ? payIdReferenceInput : undefined,
      paidAt: new Date().toISOString(),
      status: 'confirmed',
    };
    try {
      localStorage.setItem(`growkyc_payment_${receiptId}`, JSON.stringify(paymentRecord));
      if (paymentMethod === 'bpay') {
        localStorage.setItem(
          `growkyc_bpay_intent_${bpayReference}`,
          JSON.stringify({ ...paymentRecord, intentReference: bpayReference, status: 'confirmed' })
        );
      }
    } catch { /* ignore */ }

    toast.success('Payment confirmed', `Receipt ${receiptId} — $${totalAmount.toFixed(2)} AUD`);
  };

  // Simulate processing checks
  useEffect(() => {
    if (currentStep === 'processing' && formData.paymentComplete) {
      const runChecks = async () => {
        for (let i = 0; i < checks.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          setChecks(prev => prev.map((check, idx) => {
            if (idx === i) return { ...check, status: 'running' };
            return check;
          }));
          
          await new Promise(resolve => setTimeout(resolve, 1500));
          setChecks(prev => prev.map((check, idx) => {
            if (idx === i) {
              // Simulate occasional warnings
              const hasWarning = i === 3 && Math.random() > 0.5;
              return { ...check, status: hasWarning ? 'warning' : 'complete' };
            }
            return check;
          }));
        }
        
        // Processing complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProcessingComplete(true);
        setVerificationResult('approved'); // Can be changed based on logic
        setCurrentStep('results');
      };
      
      runChecks();
    }
  }, [currentStep, formData.paymentComplete]);

  const steps: Array<{ id: OnboardingStep; label: string; icon: any }> = [
    { id: 'personal', label: 'Personal Details', icon: User },
    { id: 'upload-id', label: 'Upload ID', icon: Upload },
    { id: 'consent', label: 'Consent', icon: CheckCircle },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'processing', label: 'Processing', icon: Activity },
    { id: 'results', label: 'Results', icon: Shield }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const updateFormData = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'personal':
        return formData.firstName && formData.lastName && formData.dob && 
               formData.email && formData.mobile && formData.residentialAddress && 
               formData.country && formData.occupation && formData.citizenship;
      case 'upload-id':
        return formData.idType && formData.idUploaded;
      case 'consent':
        return formData.consentIdentity && formData.consentAML && 
               formData.consentMonitoring && formData.confirmAccurate;
      case 'payment':
        return formData.paymentComplete;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep === 'personal') setCurrentStep('upload-id');
    else if (currentStep === 'upload-id') setCurrentStep('consent');
    else if (currentStep === 'consent') setCurrentStep('payment');
    else if (currentStep === 'payment') {
      if (!formData.paymentComplete) {
        toast.error('Please complete payment before continuing');
        return;
      }
      setCurrentStep('processing');
    }
  };

  const handleBack = () => {
    if (currentStep === 'upload-id') setCurrentStep('personal');
    else if (currentStep === 'consent') setCurrentStep('upload-id');
    else if (currentStep === 'payment') setCurrentStep('consent');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Grow KYC Verification</h1>
          <p className="text-slate-300">Secure, fast, and compliant identity verification</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isComplete = idx < currentStepIndex;
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                      isComplete ? 'bg-green-500 text-white' :
                      isActive ? 'bg-cyan-500 text-white' :
                      'bg-white/10 text-slate-400'
                    }`}>
                      {isComplete ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <p className={`text-xs font-semibold hidden md:block ${
                      isActive ? 'text-cyan-400' : isComplete ? 'text-green-400' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded ${
                      idx < currentStepIndex ? 'bg-green-500' : 'bg-white/10'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="border-2 border-cyan-500/30 shadow-2xl">
          <CardContent className="p-8">
            {/* STEP 1: Personal Details */}
            {currentStep === 'personal' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100 mb-2">Complete your identity verification</h2>
                  <p className="text-slate-300">We use this to verify who you are and discover any linked entities or associated parties.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none"
                      placeholder="Enter first name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Middle Name</label>
                    <input
                      type="text"
                      value={formData.middleName}
                      onChange={(e) => updateFormData('middleName', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none"
                      placeholder="Enter middle name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none"
                      placeholder="Enter last name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => updateFormData('dob', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Mobile <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => updateFormData('mobile', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none"
                      placeholder="+61 4XX XXX XXX"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Residential Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.residentialAddress}
                      onChange={(e) => updateFormData('residentialAddress', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none"
                      placeholder="Start typing your address..."
                    />
                    <p className="text-xs text-slate-400 mt-1">Address autocomplete enabled</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => updateFormData('country', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="Australia">Australia</option>
                      <option value="New Zealand">New Zealand</option>
                      <option value="Singapore">Singapore</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Citizenship <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.citizenship}
                      onChange={(e) => updateFormData('citizenship', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none"
                      placeholder="e.g., Australian"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Postal Address (if different)</label>
                    <input
                      type="text"
                      value={formData.postalAddress}
                      onChange={(e) => updateFormData('postalAddress', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none"
                      placeholder="Leave blank if same as residential"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Occupation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.occupation}
                      onChange={(e) => updateFormData('occupation', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none"
                      placeholder="e.g., Software Engineer, Business Owner"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 p-4 bg-blue-500/10 rounded-lg border-2 border-blue-500/30 cursor-pointer hover:bg-blue-500/15 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.actingForEntity}
                        onChange={(e) => updateFormData('actingForEntity', e.target.checked)}
                        className="w-5 h-5"
                      />
                      <span className="text-sm font-semibold text-slate-100">
                        Are you acting for an entity (company, trust, partnership)?
                      </span>
                    </label>
                  </div>
                </div>

                <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/30">
                  <div className="flex gap-2">
                    <Lock className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-cyan-300">Your data is secure</p>
                      <p className="text-xs text-cyan-300 mt-1">
                        All information is encrypted and handled in accordance with Australian privacy laws.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Upload ID */}
            {currentStep === 'upload-id' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100 mb-2">Upload your ID</h2>
                  <p className="text-slate-300">We accept passport, driver's license, or national ID card.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">
                      Select ID Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid md:grid-cols-3 gap-3">
                      {['Passport', 'Driver License', 'National ID'].map((type) => (
                        <button
                          key={type}
                          onClick={() => updateFormData('idType', type)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            formData.idType === type
                              ? 'border-cyan-500 bg-cyan-500/10'
                              : 'border-white/10 hover:border-cyan-300'
                          }`}
                        >
                          <FileText className={`w-8 h-8 mx-auto mb-2 ${
                            formData.idType === type ? 'text-cyan-400' : 'text-gray-400'
                          }`} />
                          <p className="text-sm font-semibold text-slate-100">{type}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.idType && (
                    <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-cyan-400 transition-colors cursor-pointer">
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-slate-100 mb-2">
                        {formData.idUploaded ? 'Document Uploaded ✓' : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-sm text-slate-300 mb-4">
                        Accepted formats: JPG, PNG, PDF (max 10MB)
                      </p>
                      {!formData.idUploaded && (
                        <Button
                          onClick={() => updateFormData('idUploaded', true)}
                          className="bg-cyan-500 hover:bg-cyan-600 text-white"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Select File
                        </Button>
                      )}
                      {formData.idUploaded && (
                        <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30 inline-block">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-sm font-semibold text-green-300">
                              {formData.idType}_scan.pdf
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                    <p className="text-sm font-semibold text-blue-300 mb-2">Tips for best results:</p>
                    <ul className="text-sm text-blue-300 space-y-1 ml-4">
                      <li>• Ensure all text is clearly visible</li>
                      <li>• Avoid glare and shadows</li>
                      <li>• Capture the entire document</li>
                      <li>• Use good lighting</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Consent */}
            {currentStep === 'consent' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100 mb-2">Your consent</h2>
                  <p className="text-slate-300">Please review and accept the following:</p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border-2 border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.consentIdentity}
                      onChange={(e) => updateFormData('consentIdentity', e.target.checked)}
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-slate-100">Consent to identity verification</p>
                      <p className="text-sm text-slate-300 mt-1">
                        I consent to Grow verifying my identity using trusted third-party providers including Equifax and InfoTrack.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border-2 border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.consentAML}
                      onChange={(e) => updateFormData('consentAML', e.target.checked)}
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-slate-100">Consent to AML screening</p>
                      <p className="text-sm text-slate-300 mt-1">
                        I consent to Grow conducting AML/CTF checks including sanctions, PEP, and adverse media screening.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border-2 border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.consentMonitoring}
                      onChange={(e) => updateFormData('consentMonitoring', e.target.checked)}
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-slate-100">Consent to ongoing monitoring</p>
                      <p className="text-sm text-slate-300 mt-1">
                        I consent to ongoing monitoring of my profile for compliance purposes during the course of our relationship.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border-2 border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.confirmAccurate}
                      onChange={(e) => updateFormData('confirmAccurate', e.target.checked)}
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-slate-100">Confirm information is accurate</p>
                      <p className="text-sm text-slate-300 mt-1">
                        I confirm that all information provided is true, accurate, and complete to the best of my knowledge.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="space-y-2">
                  <button className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    View Privacy Policy
                  </button>
                  <button className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    View Terms & Conditions
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Payment */}
            {currentStep === 'payment' && (
              <div className="space-y-6">
                {/* Payment hero */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white p-6 md:p-8">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                  <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-5 h-5 text-cyan-300" />
                        <span className="text-sm text-cyan-200 font-medium">Secure Checkout</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-1">Complete Your Payment</h2>
                      <p className="text-blue-200 text-sm md:text-base">
                        KYC verification for <strong className="text-white">{clientFullName || 'your profile'}</strong>
                      </p>
                      <p className="text-blue-300/80 text-xs mt-1">{formData.email}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4 text-center md:text-right shrink-0">
                      <p className="text-xs text-blue-200 uppercase tracking-wider mb-1">Amount Due</p>
                      <p className="text-4xl font-bold tracking-tight">${totalAmount.toFixed(2)}</p>
                      <p className="text-xs text-blue-300 mt-1">AUD incl. GST</p>
                    </div>
                  </div>
                </div>

                {/* Payment mini-progress */}
                {!formData.paymentComplete && (
                  <div className="flex items-center gap-2 text-sm">
                    {[
                      { n: 1, label: 'Choose method', done: true },
                      { n: 2, label: 'Make payment', done: paymentMethod === 'bpay' ? bpayPaymentMade : paymentMethod === 'payid' ? !!payIdReferenceInput : !!cardDetails.number },
                      { n: 3, label: 'Confirm', done: false },
                    ].map((step, i) => (
                      <React.Fragment key={step.n}>
                        <div className={`flex items-center gap-2 ${step.done ? 'text-cyan-300' : 'text-gray-400'}`}>
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                            step.done ? 'bg-cyan-600 border-cyan-600 text-white' : 'border-white/10 bg-white'
                          }`}>{step.done ? <Check className="w-3.5 h-3.5" /> : step.n}</span>
                          <span className="font-medium hidden sm:inline">{step.label}</span>
                        </div>
                        {i < 2 && <div className={`flex-1 h-0.5 rounded ${step.done ? 'bg-cyan-400' : 'bg-white/10'}`} />}
                      </React.Fragment>
                    ))}
                  </div>
                )}

                <div className="grid lg:grid-cols-5 gap-6">
                  {/* Order summary */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border-2 border-white/10 shadow-sm p-5 sticky top-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <CircleDollarSign className="w-5 h-5 text-cyan-400" />
                        <p className="font-bold text-slate-100">Order Summary</p>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-start gap-3 p-3 bg-white/5 rounded-lg">
                          <div>
                            <p className="font-medium text-slate-100">Identity & AML verification</p>
                            <p className="text-xs text-slate-400 mt-0.5">Equifax + ComplyAdvantage</p>
                          </div>
                          <span className="font-semibold text-slate-100">${baseFee.toFixed(2)}</span>
                        </div>
                        {formData.actingForEntity && (
                          <div className="flex justify-between items-start gap-3 p-3 bg-white/5 rounded-lg">
                            <div>
                              <p className="font-medium text-slate-100">Entity structure review</p>
                              <p className="text-xs text-slate-400 mt-0.5">ASIC + ownership mapping</p>
                            </div>
                            <span className="font-semibold text-slate-100">${entityFee.toFixed(2)}</span>
                          </div>
                        )}
                        {monitoringFee > 0 && (
                          <div className="flex justify-between items-start gap-3 p-3 bg-white/5 rounded-lg">
                            <div>
                              <p className="font-medium text-slate-100">Ongoing monitoring</p>
                              <p className="text-xs text-slate-400 mt-0.5">12-month alert coverage</p>
                            </div>
                            <span className="font-semibold text-slate-100">${monitoringFee.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between px-1 text-slate-300">
                          <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between px-1 text-slate-300">
                          <span>GST (10%)</span><span>${gstAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-3 border-t-2 border-white/10 font-bold text-slate-100 text-lg">
                          <span>Total</span><span className="text-cyan-300">${totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="border-t border-white/10 pt-4 space-y-2">
                        {[
                          'Equifax identity verification',
                          'AML/CTF sanctions & PEP screening',
                          'ASIC entity & ownership checks',
                        ].map((item) => (
                          <div key={item} className="flex items-center gap-2 text-xs text-slate-300">
                            <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
                        <Lock className="w-3.5 h-3.5 shrink-0" />
                        <span>256-bit SSL • PCI DSS • AUSTRAC compliant</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment methods */}
                  <div className="lg:col-span-3 space-y-5">
                    {!formData.paymentComplete ? (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {paymentMethods.map((m) => {
                            const Icon = m.icon;
                            const selected = paymentMethod === m.id;
                            return (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => {
                                  setPaymentMethod(m.id);
                                  setBpayStatus('awaiting_payment');
                                  setBpayPaymentMade(false);
                                }}
                                className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                                  selected
                                    ? 'border-cyan-500 bg-cyan-500/10 shadow-md ring-2 ring-cyan-200'
                                    : 'border-white/10 bg-white hover:border-white/10 hover:shadow-sm'
                                }`}
                              >
                                {m.badge && (
                                  <span className={`absolute -top-2 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    m.badge === 'Fastest' ? 'bg-indigo-600 text-white' : 'bg-cyan-600 text-white'
                                  }`}>{m.badge}</span>
                                )}
                                <Icon className={`w-6 h-6 mb-2 ${selected ? 'text-cyan-300' : 'text-slate-400'}`} />
                                <p className={`font-bold ${selected ? 'text-cyan-300' : 'text-slate-100'}`}>{m.label}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{m.desc}</p>
                                <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {m.eta}
                                </p>
                              </button>
                            );
                          })}
                        </div>

                        {/* BPAY */}
                        {paymentMethod === 'bpay' && (
                          <div className="space-y-4 animate-in fade-in duration-200">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <Badge className={
                                bpayStatus === 'confirmed' ? 'bg-green-500/15 text-green-300 border-green-500/30' :
                                bpayStatus === 'verifying' ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' :
                                'bg-blue-500/15 text-blue-300 border-blue-500/30'
                              }>
                                {bpayStatus === 'confirmed' ? '✓ BPAY Verified' : bpayStatus === 'verifying' ? 'Verifying payment…' : 'Awaiting BPAY payment'}
                              </Badge>
                              <div className="flex gap-2">
                                <Button type="button" variant="outline" size="sm" onClick={copyAllBpayDetails}>
                                  <Copy className="w-4 h-4 mr-1" /> Copy all
                                </Button>
                              </div>
                            </div>

                            <div className="bg-gradient-to-br from-[#0c1e3d] to-[#1a2f6b] text-white rounded-2xl overflow-hidden shadow-xl">
                              <div className="bg-[#0066b3] px-5 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Landmark className="w-5 h-5" />
                                  <span className="font-bold tracking-wide">BPAY</span>
                                </div>
                                <span className="text-xs text-blue-100">Bill Payment</span>
                              </div>
                              <div className="p-5 space-y-4">
                                <p className="text-blue-200 text-sm">Use your bank app or internet banking. Enter these details exactly — incorrect references delay verification.</p>
                                <div className="grid sm:grid-cols-2 gap-3">
                                  {[
                                    { label: 'Biller Code', value: bpayBillerCode, copy: bpayBillerCode, highlight: true },
                                    { label: 'Customer Reference (CRN)', value: bpayReference, copy: bpayReference, highlight: true },
                                    { label: 'Amount', value: `$${totalAmount.toFixed(2)} AUD`, copy: totalAmount.toFixed(2), highlight: false },
                                    { label: 'Biller Name', value: 'GrowKYC Pty Ltd', copy: 'GrowKYC Pty Ltd', highlight: false },
                                  ].map((row) => (
                                    <div
                                      key={row.label}
                                      className={`rounded-xl p-4 border ${row.highlight ? 'bg-cyan-500/20 border-cyan-400/40' : 'bg-white/5 border-white/10'}`}
                                    >
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                          <p className="text-[10px] text-blue-300 uppercase tracking-widest mb-1">{row.label}</p>
                                          <p className={`font-mono font-bold break-all ${row.highlight ? 'text-xl text-white' : 'text-base text-blue-100'}`}>{row.value}</p>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => copyToClipboard(row.copy, row.label)}
                                          className="p-2 bg-white/15 hover:bg-white/25 rounded-lg transition-colors shrink-0"
                                          aria-label={`Copy ${row.label}`}
                                        >
                                          <Copy className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-blue-300 bg-white/5 rounded-lg px-3 py-2">
                                  <Clock className="w-3.5 h-3.5 shrink-0" />
                                  Reference valid until {paymentReferenceExpiry}
                                </div>
                              </div>
                            </div>

                            <div className="bg-white border-2 border-white/10 rounded-xl p-5">
                              <p className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
                                <Smartphone className="w-4 h-4 text-cyan-400" />
                                Pay with your banking app
                              </p>
                              <div className="grid sm:grid-cols-5 gap-3">
                                {[
                                  { step: '1', text: 'Open your bank app' },
                                  { step: '2', text: 'Select Pay BPAY Bill' },
                                  { step: '3', text: `Enter code ${bpayBillerCode}` },
                                  { step: '4', text: `Enter CRN ${bpayReference}` },
                                  { step: '5', text: `Pay $${totalAmount.toFixed(2)}` },
                                ].map((s) => (
                                  <div key={s.step} className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                                    <span className="w-6 h-6 rounded-full bg-cyan-600 text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">{s.step}</span>
                                    <p className="text-[11px] text-slate-300 leading-tight">{s.text}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <label className="flex items-start gap-3 p-4 bg-amber-500/10 border-2 border-amber-500/30 rounded-xl cursor-pointer hover:bg-amber-500/15/80 transition-colors">
                              <input
                                type="checkbox"
                                checked={bpayPaymentMade}
                                onChange={(e) => setBpayPaymentMade(e.target.checked)}
                                className="mt-1 w-4 h-4 accent-cyan-600"
                              />
                              <div>
                                <p className="font-semibold text-amber-300">I have completed the BPAY payment in my bank</p>
                                <p className="text-xs text-amber-300 mt-1">Check this after paying. Then enter your bank receipt reference below to confirm.</p>
                              </div>
                            </label>

                            {bpayPaymentMade && (
                              <div className="animate-in slide-in-from-top-2 duration-200 space-y-2">
                                <label className="block text-sm font-semibold text-slate-300">
                                  Bank Receipt Reference <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={bpayReferenceInput}
                                  onChange={(e) => setBpayReferenceInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                                  placeholder="e.g. 1234567890ABCDEF"
                                  maxLength={20}
                                  className="w-full px-4 py-3.5 border-2 border-white/10 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none font-mono uppercase text-lg tracking-wider"
                                />
                                <div className="flex justify-between text-xs text-slate-400">
                                  <span>From your bank confirmation screen</span>
                                  <span className={bpayReferenceInput.length >= 6 ? 'text-green-400 font-medium' : ''}>
                                    {bpayReferenceInput.length}/20 {bpayReferenceInput.length >= 6 ? '✓' : '(min 6)'}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Card */}
                        {paymentMethod === 'card' && (
                          <div className="space-y-4 animate-in fade-in duration-200">
                            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg aspect-[1.8/1] max-w-sm">
                              <div className="flex justify-between items-start mb-8">
                                <div className="w-10 h-8 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md" />
                                <span className="text-sm font-bold tracking-wider opacity-80">{detectCardBrand(cardDetails.number)}</span>
                              </div>
                              <p className="font-mono text-xl tracking-[0.2em] mb-6">
                                {cardDetails.number || '•••• •••• •••• ••••'}
                              </p>
                              <div className="flex justify-between items-end">
                                <div>
                                  <p className="text-[10px] uppercase opacity-60 mb-0.5">Cardholder</p>
                                  <p className="font-medium text-sm uppercase truncate max-w-[180px]">{cardDetails.name || 'YOUR NAME'}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase opacity-60 mb-0.5">Expires</p>
                                  <p className="font-mono text-sm">{cardDetails.expiry || 'MM/YY'}</p>
                                </div>
                              </div>
                            </div>
                            <div className="bg-white rounded-xl p-5 border-2 border-white/10 space-y-4">
                              <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Cardholder Name</label>
                                <input
                                  type="text"
                                  value={cardDetails.name}
                                  onChange={(e) => setCardDetails((p) => ({ ...p, name: e.target.value.toUpperCase() }))}
                                  placeholder="As shown on card"
                                  className="w-full px-4 py-3 border-2 border-white/10 rounded-xl focus:border-cyan-500 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Card Number</label>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={cardDetails.number}
                                  onChange={(e) => {
                                    const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                                    setCardDetails((p) => ({ ...p, number: v.replace(/(.{4})/g, '$1 ').trim() }));
                                  }}
                                  placeholder="4242 4242 4242 4242"
                                  className="w-full px-4 py-3 border-2 border-white/10 rounded-xl focus:border-cyan-500 focus:outline-none font-mono text-lg"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-semibold text-slate-300 mb-2">Expiry</label>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    value={cardDetails.expiry}
                                    onChange={(e) => {
                                      let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                                      if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                                      setCardDetails((p) => ({ ...p, expiry: v }));
                                    }}
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    className="w-full px-4 py-3 border-2 border-white/10 rounded-xl focus:border-cyan-500 focus:outline-none font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-slate-300 mb-2">CVC</label>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    value={cardDetails.cvc}
                                    onChange={(e) => setCardDetails((p) => ({ ...p, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                                    placeholder="•••"
                                    className="w-full px-4 py-3 border-2 border-white/10 rounded-xl focus:border-cyan-500 focus:outline-none font-mono"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-green-300 bg-green-500/10 rounded-lg p-3 border border-green-500/30">
                                <Lock className="w-4 h-4 shrink-0" />
                                Your card details are encrypted and never stored on our servers.
                              </div>
                            </div>
                          </div>
                        )}

                        {/* PayID */}
                        {paymentMethod === 'payid' && (
                          <div className="space-y-4 animate-in fade-in duration-200">
                            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-2xl p-6 shadow-lg">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <Zap className="w-5 h-5" />
                                  <h3 className="font-bold text-lg">PayID / Osko</h3>
                                </div>
                                <Badge className="bg-white/20 text-white border-white/30">Near instant</Badge>
                              </div>
                              <div className="bg-white/10 rounded-xl p-4 border border-white/20 mb-4">
                                <p className="text-xs text-indigo-200 uppercase tracking-wide mb-1">PayID Email</p>
                                <div className="flex items-center justify-between gap-3">
                                  <p className="font-mono font-bold text-lg break-all">{payId}</p>
                                  <button type="button" onClick={() => copyToClipboard(payId, 'PayID')} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg shrink-0">
                                    <Copy className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                                <div className="bg-white/10 rounded-lg p-3">
                                  <p className="text-indigo-200 text-xs">Amount</p>
                                  <p className="font-bold text-xl">${totalAmount.toFixed(2)} AUD</p>
                                </div>
                                <div className="bg-white/10 rounded-lg p-3">
                                  <p className="text-indigo-200 text-xs">Description</p>
                                  <p className="font-medium truncate">{clientFullName} — KYC</p>
                                </div>
                              </div>
                              <Button type="button" variant="outline" size="sm" className="mt-4 border-white/40 text-white hover:bg-white/10" onClick={copyAllPayIdDetails}>
                                <Copy className="w-4 h-4 mr-1" /> Copy transfer details
                              </Button>
                            </div>
                            <div className="bg-white rounded-xl p-5 border-2 border-white/10 space-y-4">
                              <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Email used for transfer <span className="text-red-500">*</span></label>
                                <input
                                  type="email"
                                  value={payIdEmail}
                                  onChange={(e) => setPayIdEmail(e.target.value)}
                                  placeholder={formData.email || 'you@email.com'}
                                  className="w-full px-4 py-3 border-2 border-white/10 rounded-xl focus:border-cyan-500 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Transfer reference from your bank <span className="text-red-500">*</span></label>
                                <input
                                  type="text"
                                  value={payIdReferenceInput}
                                  onChange={(e) => setPayIdReferenceInput(e.target.value)}
                                  placeholder="Reference shown in your banking app"
                                  className="w-full px-4 py-3 border-2 border-white/10 rounded-xl focus:border-cyan-500 focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <Button
                          onClick={handleCompletePayment}
                          disabled={
                            paymentProcessing ||
                            (paymentMethod === 'bpay' && (!bpayPaymentMade || bpayReferenceInput.length < 6))
                          }
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg py-7 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {paymentProcessing ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              {paymentMethod === 'bpay' && bpayStatus === 'verifying' ? 'Verifying BPAY with your bank…' : 'Processing payment…'}
                            </>
                          ) : (
                            <>
                              {paymentMethod === 'bpay' ? <Landmark className="w-5 h-5 mr-2" /> : paymentMethod === 'payid' ? <Zap className="w-5 h-5 mr-2" /> : <CreditCard className="w-5 h-5 mr-2" />}
                              {paymentMethod === 'bpay' ? 'Confirm BPAY Payment' : 'Pay Now'} — ${totalAmount.toFixed(2)} AUD
                            </>
                          )}
                        </Button>

                        {paymentMethod === 'bpay' && !bpayPaymentMade && (
                          <p className="text-center text-xs text-slate-400">Complete the BPAY payment in your bank, then check the box above to confirm.</p>
                        )}
                      </>
                    ) : (
                      <div className="bg-white rounded-2xl border-2 border-green-300 overflow-hidden shadow-lg">
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 flex items-center gap-3">
                          <CheckCircle className="w-8 h-8" />
                          <div>
                            <p className="font-bold text-xl">Payment Successful</p>
                            <p className="text-green-100 text-sm">Your verification can now begin</p>
                          </div>
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div className="p-3 bg-white/5 rounded-lg">
                              <p className="text-xs text-slate-400 mb-1">Amount Paid</p>
                              <p className="font-bold text-xl text-slate-100">${totalAmount.toFixed(2)} AUD</p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-lg">
                              <p className="text-xs text-slate-400 mb-1">Payment Method</p>
                              <p className="font-bold text-slate-100">{paymentMethod === 'bpay' ? 'BPAY' : paymentMethod === 'payid' ? 'PayID / Osko' : 'Credit Card'}</p>
                            </div>
                            {paymentReceipt && (
                              <div className="p-3 bg-white/5 rounded-lg">
                                <p className="text-xs text-slate-400 mb-1">Receipt ID</p>
                                <p className="font-mono font-bold text-slate-100">{paymentReceipt}</p>
                              </div>
                            )}
                            <div className="p-3 bg-white/5 rounded-lg">
                              <p className="text-xs text-slate-400 mb-1">Date</p>
                              <p className="font-medium text-slate-100">{new Date().toLocaleString('en-AU')}</p>
                            </div>
                            {paymentMethod === 'bpay' && bpayReferenceInput && (
                              <div className="p-3 bg-white/5 rounded-lg sm:col-span-2">
                                <p className="text-xs text-slate-400 mb-1">Bank Receipt Reference</p>
                                <p className="font-mono font-bold text-slate-100">{bpayReferenceInput}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={downloadPaymentReceipt} className="border-green-400 text-green-300">
                              <Download className="w-4 h-4 mr-2" /> Download Receipt
                            </Button>
                          </div>
                          <p className="text-sm text-green-300 bg-green-500/10 rounded-lg p-3 border border-green-500/30">
                            Click <strong>Start Verification</strong> below to begin your KYC checks. This usually takes 2–3 minutes.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Processing */}
            {currentStep === 'processing' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-cyan-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-10 h-10 text-cyan-400 animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-100 mb-2">We're verifying your details</h2>
                  <p className="text-slate-300">This usually takes 2-3 minutes. Please don't close this page.</p>
                </div>

                <div className="space-y-3">
                  {checks.map((check) => (
                    <div
                      key={check.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        check.status === 'complete' ? 'bg-green-500/10 border-green-300' :
                        check.status === 'warning' ? 'bg-amber-500/10 border-amber-300' :
                        check.status === 'running' ? 'bg-blue-500/10 border-blue-300' :
                        'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {check.status === 'pending' && <div className="w-6 h-6 rounded-full border-2 border-white/10" />}
                          {check.status === 'running' && <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />}
                          {check.status === 'complete' && <CheckCircle className="w-6 h-6 text-green-400" />}
                          {check.status === 'warning' && <AlertTriangle className="w-6 h-6 text-amber-400" />}
                          <div>
                            <p className="font-semibold text-slate-100">{check.label}</p>
                            {check.provider && check.status !== 'pending' && (
                              <p className="text-xs text-slate-400">via {check.provider}</p>
                            )}
                          </div>
                        </div>
                        {check.status === 'complete' && (
                          <Badge className="bg-green-500/15 text-green-300">Complete</Badge>
                        )}
                        {check.status === 'warning' && (
                          <Badge className="bg-amber-500/15 text-amber-300">Review Needed</Badge>
                        )}
                        {check.status === 'running' && (
                          <Badge className="bg-blue-500/15 text-blue-300">Running...</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/30 text-center">
                  <p className="text-sm text-cyan-300">
                    We're running comprehensive checks across multiple systems to ensure compliance and security.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 6: Results */}
            {currentStep === 'results' && (
              <div className="space-y-6">
                {verificationResult === 'approved' && (
                  <>
                    <div className="text-center">
                      <div className="w-24 h-24 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-16 h-16 text-green-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-green-300 mb-2">Verification Complete!</h2>
                      <p className="text-slate-300 text-lg">Your identity has been successfully verified</p>
                    </div>

                    <div className="bg-green-500/10 rounded-lg p-6 border-2 border-green-300">
                      <h3 className="font-bold text-green-300 mb-3">What happens next?</h3>
                      <ul className="space-y-2 text-sm text-green-300">
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>Your profile is now active and fully verified</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>All compliance checks have been completed successfully</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>You can now access all Grow platform services</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>Ongoing monitoring is active to keep your profile current</span>
                        </li>
                      </ul>
                    </div>

                    <Button
                      onClick={onComplete}
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
                    >
                      <ChevronRight className="w-5 h-5 mr-2" />
                      Continue to Dashboard
                    </Button>
                  </>
                )}

                {verificationResult === 'review' && (
                  <>
                    <div className="text-center">
                      <div className="w-24 h-24 bg-amber-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-16 h-16 text-amber-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-amber-300 mb-2">Review Required</h2>
                      <p className="text-slate-300 text-lg">Our team is reviewing your details</p>
                    </div>

                    <div className="bg-amber-500/10 rounded-lg p-6 border-2 border-amber-300">
                      <h3 className="font-bold text-amber-300 mb-3">What this means:</h3>
                      <p className="text-sm text-amber-300 mb-3">
                        Some aspects of your verification require manual review by our compliance team. This is a standard process and doesn't indicate any issues.
                      </p>
                      <ul className="space-y-2 text-sm text-amber-300">
                        <li className="flex items-start gap-2">
                          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>We'll complete the review within 1-2 business days</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>You'll receive an email once the review is complete</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>No further action is required from you at this time</span>
                        </li>
                      </ul>
                    </div>
                  </>
                )}

                {verificationResult === 'additional-info' && (
                  <>
                    <div className="text-center">
                      <div className="w-24 h-24 bg-blue-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-16 h-16 text-blue-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-blue-300 mb-2">Additional Information Required</h2>
                      <p className="text-slate-300 text-lg">We need a few more details to complete verification</p>
                    </div>

                    <div className="bg-blue-500/10 rounded-lg p-6 border-2 border-blue-300">
                      <h3 className="font-bold text-blue-300 mb-3">Please provide:</h3>
                      <ul className="space-y-2 text-sm text-blue-300">
                        <li className="flex items-start gap-2">
                          <FileText className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>Proof of address (utility bill or bank statement, dated within last 3 months)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FileText className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>Additional identification document</span>
                        </li>
                      </ul>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6">
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Documents
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep !== 'processing' && currentStep !== 'results' && (
              <div className="flex gap-3 mt-8 pt-6 border-t">
                {currentStep !== 'personal' && (
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 border-2 py-6"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`flex-1 py-6 text-lg ${
                    currentStep === 'personal' ? 'w-full' : ''
                  } ${
                    canProceed()
                      ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                      : 'bg-gray-300 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {currentStep === 'consent' ? 'Agree and Continue' : 
                   currentStep === 'upload-id' ? 'Continue' :
                   currentStep === 'payment' ? 'Start Verification' :
                   currentStep === 'personal' ? 'Continue to Upload ID' : 'Next'}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        {currentStep !== 'results' && (
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Bank-level security</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>AUSTRAC compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>ISO 27001 certified</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}