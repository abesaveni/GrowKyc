// Payment Step Component for Onboarding
import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CreditCard, Shield, Lock, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './DesignSystem';
import { toast } from 'sonner';

interface PaymentStepProps {
  entities: any[];
  onBack: () => void;
  onContinue: () => void;
}

export function PaymentStep({ entities, onBack, onContinue }: PaymentStepProps) {
  const [paymentData, setPaymentData] = useState({
    cardName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingPostcode: '',
    billingCountry: 'Australia',
    agreedToTerms: false,
    agreedToCharges: false
  });

  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  // Calculate costs
  const onboardingFeePerEntity = 495; // Base onboarding fee
  const totalOnboardingFee = entities.length * onboardingFeePerEntity;
  
  // Compliance check costs
  const sanctionsScreeningCost = 25; // Per entity
  const pepScreeningCost = 25; // Per entity
  const idVerificationCost = 35; // Per entity
  const companySearchCost = 50; // Per company/trust entity
  
  const complexEntities = entities.filter(e => 
    e.type === 'company' || e.type === 'trust' || e.type === 'smsf'
  ).length;
  
  const totalComplianceChecks = 
    (entities.length * sanctionsScreeningCost) +
    (entities.length * pepScreeningCost) +
    (entities.length * idVerificationCost) +
    (complexEntities * companySearchCost);

  const totalOnboardingCost = totalOnboardingFee + totalComplianceChecks;
  const gst = totalOnboardingCost * 0.1;
  const totalIncGst = totalOnboardingCost + gst;

  // First year service fees
  const totalAnnualFees = entities.reduce((sum, e) => sum + e.pricing, 0);
  const firstMonthFee = Math.round(totalAnnualFees / 12);

  // Total payment today
  const totalPaymentToday = totalIncGst + firstMonthFee;

  const handlePayment = async () => {
    // RELAXED VALIDATION FOR TESTING - No validation required
    // In production, uncomment the validation below
    
    /*
    // Production validation:
    if (!paymentData.cardName.trim()) {
      toast.error('Please enter cardholder name');
      return;
    }
    if (paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
      toast.error('Please enter a valid 16-digit card number');
      return;
    }
    if (!paymentData.expiryMonth || !paymentData.expiryYear) {
      toast.error('Please enter card expiry date');
      return;
    }
    if (paymentData.cvv.length !== 3 && paymentData.cvv.length !== 4) {
      toast.error('Please enter valid CVV');
      return;
    }
    if (!paymentData.billingAddress || !paymentData.billingCity || !paymentData.billingPostcode) {
      toast.error('Please complete billing address');
      return;
    }
    if (!paymentData.agreedToTerms) {
      toast.error('Please accept terms and conditions');
      return;
    }
    if (!paymentData.agreedToCharges) {
      toast.error('Please acknowledge the charges');
      return;
    }
    */

    setProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Simulate payment success (in production, this would call Stripe/payment API)
    const success = true; // Always succeed in testing

    if (success) {
      setPaymentComplete(true);
      toast.success('✓ Payment successful - Proceeding with onboarding');
      setTimeout(() => onContinue(), 1500);
    } else {
      toast.error('Payment failed - Please check your card details and try again');
    }

    setProcessing(false);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Payment & Onboarding Fees</h2>
        <p className="text-slate-300">Secure your payment details to proceed with onboarding</p>
      </div>

      {/* Testing Mode Notice */}
      <div className="bg-amber-500/10 border-2 border-amber-300 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          <p className="text-sm font-semibold text-amber-300">
            TESTING MODE: No payment validation required - Click "Pay & Continue" to proceed
          </p>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-lg p-6">
        <h3 className="font-bold text-blue-300 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Payment Breakdown
        </h3>

        <div className="space-y-4">
          {/* Onboarding Fees */}
          <div>
            <p className="font-semibold text-blue-300 mb-2">Onboarding Fees</p>
            <div className="bg-white rounded-lg p-4 space-y-2">
              {entities.map(entity => (
                <div key={entity.id} className="flex justify-between text-sm">
                  <span className="text-slate-300">{entity.name || 'Unnamed Entity'} ({entity.type})</span>
                  <span className="font-semibold text-slate-100">${onboardingFeePerEntity.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                <span className="font-semibold text-slate-100">Subtotal</span>
                <span className="font-semibold text-slate-100">${totalOnboardingFee.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Compliance Checks */}
          <div>
            <p className="font-semibold text-blue-300 mb-2">Compliance & Verification Checks</p>
            <div className="bg-white rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Sanctions Screening ({entities.length} entities)</span>
                <span className="font-semibold text-slate-100">${(entities.length * sanctionsScreeningCost).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">PEP Screening ({entities.length} entities)</span>
                <span className="font-semibold text-slate-100">${(entities.length * pepScreeningCost).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">ID Verification ({entities.length} entities)</span>
                <span className="font-semibold text-slate-100">${(entities.length * idVerificationCost).toLocaleString()}</span>
              </div>
              {complexEntities > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Company/Trust Searches ({complexEntities} entities)</span>
                  <span className="font-semibold text-slate-100">${(complexEntities * companySearchCost).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                <span className="font-semibold text-slate-100">Subtotal</span>
                <span className="font-semibold text-slate-100">${totalComplianceChecks.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Tax & Total */}
          <div className="bg-white rounded-lg p-4 space-y-2 border-2 border-blue-300">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Onboarding Total (ex GST)</span>
              <span className="font-semibold text-slate-100">${totalOnboardingCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">GST (10%)</span>
              <span className="font-semibold text-slate-100">${gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-blue-500/30">
              <span className="font-bold text-blue-300">Onboarding Total (inc GST)</span>
              <span className="font-bold text-blue-300">${totalIncGst.toFixed(2)}</span>
            </div>
          </div>

          {/* First Month Service Fee */}
          <div className="bg-green-500/10 border-2 border-green-500/30 rounded-lg p-4">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold text-green-300">First Month Service Fee</p>
                <p className="text-xs text-green-300">(${totalAnnualFees.toLocaleString()} annual / 12 months)</p>
              </div>
              <span className="font-bold text-green-300">${firstMonthFee.toLocaleString()}</span>
            </div>
          </div>

          {/* Total Payment Today */}
          <div className="bg-gray-900 text-white rounded-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-300 text-sm mb-1">Total Payment Today</p>
                <p className="text-xs text-gray-400">One-time onboarding + First month service</p>
              </div>
              <span className="text-4xl font-bold">${totalPaymentToday.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      {!paymentComplete && (
        <div className="bg-white border-2 border-white/10 rounded-lg p-6">
          <h3 className="font-bold text-slate-100 mb-6 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-blue-400" />
            Payment Details
          </h3>

          <div className="space-y-4">
            {/* Card Information */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Cardholder Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={paymentData.cardName}
                onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                className="w-full px-4 py-2 border border-white/10 rounded-lg"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Card Number <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={paymentData.cardNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s/g, '');
                  if (/^\d*$/.test(value) && value.length <= 16) {
                    setPaymentData({ ...paymentData, cardNumber: formatCardNumber(value) });
                  }
                }}
                className="w-full px-4 py-2 border border-white/10 rounded-lg font-mono"
                placeholder="4242 4242 4242 4242"
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Month <span className="text-red-400">*</span>
                </label>
                <select
                  value={paymentData.expiryMonth}
                  onChange={(e) => setPaymentData({ ...paymentData, expiryMonth: e.target.value })}
                  className="w-full px-4 py-2 border border-white/10 rounded-lg"
                >
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month.toString().padStart(2, '0')}>
                      {month.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Year <span className="text-red-400">*</span>
                </label>
                <select
                  value={paymentData.expiryYear}
                  onChange={(e) => setPaymentData({ ...paymentData, expiryYear: e.target.value })}
                  className="w-full px-4 py-2 border border-white/10 rounded-lg"
                >
                  <option value="">YY</option>
                  {Array.from({ length: 10 }, (_, i) => 2024 + i).map(year => (
                    <option key={year} value={year.toString().slice(-2)}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  CVV <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={paymentData.cvv}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && value.length <= 4) {
                      setPaymentData({ ...paymentData, cvv: value });
                    }
                  }}
                  className="w-full px-4 py-2 border border-white/10 rounded-lg font-mono"
                  placeholder="123"
                  maxLength={4}
                />
              </div>
            </div>

            {/* Billing Address */}
            <div className="pt-4 border-t border-white/10">
              <h4 className="font-semibold text-slate-100 mb-4">Billing Address</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Street Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={paymentData.billingAddress}
                    onChange={(e) => setPaymentData({ ...paymentData, billingAddress: e.target.value })}
                    className="w-full px-4 py-2 border border-white/10 rounded-lg"
                    placeholder="123 Example Street"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      City <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={paymentData.billingCity}
                      onChange={(e) => setPaymentData({ ...paymentData, billingCity: e.target.value })}
                      className="w-full px-4 py-2 border border-white/10 rounded-lg"
                      placeholder="Sydney"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      State <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={paymentData.billingState}
                      onChange={(e) => setPaymentData({ ...paymentData, billingState: e.target.value })}
                      className="w-full px-4 py-2 border border-white/10 rounded-lg"
                    >
                      <option value="">Select State</option>
                      <option value="NSW">NSW</option>
                      <option value="VIC">VIC</option>
                      <option value="QLD">QLD</option>
                      <option value="SA">SA</option>
                      <option value="WA">WA</option>
                      <option value="TAS">TAS</option>
                      <option value="NT">NT</option>
                      <option value="ACT">ACT</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Postcode <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={paymentData.billingPostcode}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value) && value.length <= 4) {
                          setPaymentData({ ...paymentData, billingPostcode: value });
                        }
                      }}
                      className="w-full px-4 py-2 border border-white/10 rounded-lg"
                      placeholder="2000"
                      maxLength={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Country <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={paymentData.billingCountry}
                      readOnly
                      className="w-full px-4 py-2 border border-white/10 rounded-lg bg-white/5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={paymentData.agreedToTerms}
                  onChange={(e) => setPaymentData({ ...paymentData, agreedToTerms: e.target.checked })}
                  className="mt-1 w-5 h-5"
                />
                <span className="text-sm text-slate-300">
                  I accept the <a href="#" className="text-blue-400 underline">Terms and Conditions</a> and <a href="#" className="text-blue-400 underline">Privacy Policy</a> <span className="text-red-400">*</span>
                </span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={paymentData.agreedToCharges}
                  onChange={(e) => setPaymentData({ ...paymentData, agreedToCharges: e.target.checked })}
                  className="mt-1 w-5 h-5"
                />
                <span className="text-sm text-slate-300">
                  I acknowledge that ${totalPaymentToday.toLocaleString()} will be charged today (one-time onboarding fee of ${totalIncGst.toFixed(2)} + first month service fee of ${firstMonthFee.toLocaleString()}), and ${firstMonthFee.toLocaleString()}/month will be charged thereafter <span className="text-red-400">*</span>
                </span>
              </label>
            </div>

            {/* Security Notice */}
            <div className="bg-green-500/10 border-2 border-green-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-300 text-sm">Secure Payment</p>
                  <p className="text-xs text-green-300 mt-1">
                    Your payment information is encrypted and secure. We use industry-standard SSL encryption.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Success */}
      {paymentComplete && (
        <div className="bg-green-500/10 border-2 border-green-500/30 rounded-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-300 mb-2">Payment Successful!</h3>
          <p className="text-green-300 mb-4">
            ${totalPaymentToday.toLocaleString()} charged successfully
          </p>
          <p className="text-sm text-green-400">
            Proceeding with onboarding and compliance checks...
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <SecondaryButton onClick={onBack} disabled={processing || paymentComplete}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </SecondaryButton>
        
        {!paymentComplete && (
          <PrimaryButton
            onClick={handlePayment}
            disabled={processing}
          >
            {processing ? (
              <>Processing Payment...</>
            ) : (
              <>
                Pay ${totalPaymentToday.toLocaleString()} & Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}