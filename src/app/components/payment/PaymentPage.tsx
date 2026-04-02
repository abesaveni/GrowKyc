import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { toast } from '../../lib/toast';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { 
  CreditCard, 
  Building2, 
  CheckCircle, 
  ArrowLeft,
  Lock,
  AlertCircle,
  DollarSign,
  Calendar,
  Shield,
  FileText,
  Home,
  MapPin
} from 'lucide-react';
import { mockCases } from '../../data/mockData';

interface PaymentPageProps {
  onBack?: () => void;
  propertyId?: string;
}

export function PaymentPage({ onBack, propertyId }: PaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [confirmPaymentOpen, setConfirmPaymentOpen] = useState(false);
  
  // Form state
  const [termsAccepted, setTermsAccepted] = useState({
    memorandum: false,
    terms: false,
    risks: false,
    aml: false
  });
  
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const property = mockCases[1]; // Using second property for Buy Now

  // Calculate pricing
  const equity = property.valuation.amount - property.outstandingDebt;
  const buyNowPrice = property.outstandingDebt + (equity * 0.35);
  const legalFees = 2500;
  const stampDuty = buyNowPrice * 0.04;
  const totalCost = buyNowPrice + legalFees + stampDuty;

  const validateStep1 = () => {
    const allTermsAccepted = Object.values(termsAccepted).every(v => v);
    if (!allTermsAccepted) {
      toast.error('Please accept all terms and conditions to continue');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (paymentMethod === 'card') {
      if (!cardDetails.number || cardDetails.number.length < 16) {
        toast.error('Please enter a valid card number');
        return false;
      }
      if (!cardDetails.expiry || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
        toast.error('Please enter a valid expiry date (MM/YY)');
        return false;
      }
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
        toast.error('Please enter a valid CVV');
        return false;
      }
      if (!cardDetails.name || cardDetails.name.length < 3) {
        toast.error('Please enter the cardholder name');
        return false;
      }
    }
    return true;
  };

  const handleContinueToPayment = () => {
    if (validateStep1()) {
      setStep(2);
      toast.info('Please select your payment method');
    }
  };

  const handlePaymentClick = () => {
    if (validateStep2()) {
      setConfirmPaymentOpen(true);
    }
  };

  const handlePayment = async () => {
    setConfirmPaymentOpen(false);
    setProcessingPayment(true);
    
    // Show loading toast
    const loadingToast = toast.loading('Processing payment...');
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setProcessingPayment(false);
    
    // Success
    toast.success('Payment successful!', {
      description: `A$${totalCost.toLocaleString()} processed successfully`
    });
    
    setTimeout(() => {
      setStep(3);
    }, 500);
  };

  const handleCopyBankDetails = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (step === 3) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Your purchase has been confirmed. The settlement process will begin shortly.
            </p>
            
            <div className="bg-white border border-green-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Transaction Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono font-semibold">TXN-{Date.now()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property:</span>
                  <span className="font-semibold">{property.property.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Case Number:</span>
                  <span className="font-semibold">{property.caseNumber}</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-bold text-lg text-green-600">
                    A${totalCost.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900 mb-1">Documents Sent</p>
                <p className="text-xs text-gray-600">Check your email</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900 mb-1">Settlement: 45 Days</p>
                <p className="text-xs text-gray-600">Expected completion</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900 mb-1">Funds Secured</p>
                <p className="text-xs text-gray-600">In escrow</p>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button size="lg" onClick={onBack}>
                Return to Dashboard
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => toast.info('Contract will be available after settlement')}
              >
                View Contract
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Dashboard', onClick: onBack },
          { label: 'Payment', active: true }
        ]}
      />

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="font-semibold hidden sm:block">Review Order</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center gap-3 ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="font-semibold hidden sm:block">Payment</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center gap-3 ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="font-semibold hidden sm:block">Confirmation</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {step === 1 && (
            <>
              {/* Property Summary */}
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-primary" />
                    Property Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-32 h-32 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{property.property.address}</h3>
                      <div className="flex items-center gap-1 text-gray-600 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">
                          {property.property.suburb}, {property.property.state} {property.property.postcode}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span>{property.property.bedrooms} bed</span>
                        <span>{property.property.bathrooms} bath</span>
                        <span>{property.property.parking} car</span>
                        <span>{property.property.propertyType}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Terms & Conditions */}
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Terms & Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">Purchase Agreement</h4>
                      <p className="text-sm text-gray-700">
                        This is a binding purchase agreement for the property at {property.property.address}. 
                        By proceeding with payment, you agree to purchase the property at the stated price 
                        and complete settlement within 45 days.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mt-1" 
                          checked={termsAccepted.memorandum}
                          onChange={(e) => setTermsAccepted({...termsAccepted, memorandum: e.target.checked})}
                        />
                        <span className="text-sm text-gray-700">
                          I have read and understood the Investment Memorandum and Property Inspection Report
                        </span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mt-1"
                          checked={termsAccepted.terms}
                          onChange={(e) => setTermsAccepted({...termsAccepted, terms: e.target.checked})}
                        />
                        <span className="text-sm text-gray-700">
                          I agree to the purchase terms, conditions, and settlement period of 45 days
                        </span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mt-1"
                          checked={termsAccepted.risks}
                          onChange={(e) => setTermsAccepted({...termsAccepted, risks: e.target.checked})}
                        />
                        <span className="text-sm text-gray-700">
                          I acknowledge this is a purchase of a defaulted loan and accept all associated risks
                        </span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mt-1"
                          checked={termsAccepted.aml}
                          onChange={(e) => setTermsAccepted({...termsAccepted, aml: e.target.checked})}
                        />
                        <span className="text-sm text-gray-700">
                          I confirm my funds are from legitimate sources and comply with AML/CTF regulations
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button 
                      size="lg" 
                      onClick={handleContinueToPayment}
                      disabled={!Object.values(termsAccepted).every(v => v)}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {step === 2 && (
            <>
              {/* Payment Method Selection */}
              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Select Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-6 border-2 rounded-lg transition-all ${
                        paymentMethod === 'card' 
                          ? 'border-primary bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <CreditCard className={`w-8 h-8 mb-3 ${paymentMethod === 'card' ? 'text-primary' : 'text-gray-400'}`} />
                      <p className="font-semibold">Credit/Debit Card</p>
                      <p className="text-sm text-gray-600">Instant processing</p>
                    </button>
                    <button
                      onClick={() => {
                        setPaymentMethod('bank');
                        toast.info('Bank transfer selected - Please follow the instructions below');
                      }}
                      className={`p-6 border-2 rounded-lg transition-all ${
                        paymentMethod === 'bank' 
                          ? 'border-primary bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Building2 className={`w-8 h-8 mb-3 ${paymentMethod === 'bank' ? 'text-primary' : 'text-gray-400'}`} />
                      <p className="font-semibold">Bank Transfer</p>
                      <p className="text-sm text-gray-600">1-3 business days</p>
                    </button>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <Input 
                          placeholder="1234 5678 9012 3456" 
                          className="text-lg"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({...cardDetails, number: e.target.value.replace(/\s/g, '')})}
                          maxLength={16}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <Input 
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <Input 
                            placeholder="123" 
                            type="password"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                            maxLength={4}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name
                        </label>
                        <Input 
                          placeholder="John Smith"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'bank' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-amber-900 mb-1">
                              Bank Transfer Instructions
                            </p>
                            <p className="text-sm text-amber-800">
                              Please transfer the full amount to the account details below. 
                              Your purchase will be confirmed once funds are received (1-3 business days).
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-2 font-mono text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account Name:</span>
                          <button 
                            onClick={() => handleCopyBankDetails('Grow MIP Escrow Trust')}
                            className="font-semibold hover:text-primary"
                          >
                            Grow MIP Escrow Trust
                          </button>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">BSB:</span>
                          <button 
                            onClick={() => handleCopyBankDetails('062-000')}
                            className="font-semibold hover:text-primary"
                          >
                            062-000
                          </button>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account Number:</span>
                          <button 
                            onClick={() => handleCopyBankDetails('1234 5678')}
                            className="font-semibold hover:text-primary"
                          >
                            1234 5678
                          </button>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reference:</span>
                          <button 
                            onClick={() => handleCopyBankDetails(property.caseNumber)}
                            className="font-semibold hover:text-primary"
                          >
                            {property.caseNumber}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-green-900 mb-1">
                          Secure Payment
                        </p>
                        <p className="text-sm text-green-800">
                          All payments are processed securely and held in escrow until settlement. 
                          Your payment information is encrypted and protected.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button 
                      size="lg" 
                      className="flex-1"
                      onClick={handlePaymentClick}
                      disabled={processingPayment}
                    >
                      {processingPayment ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Complete Payment - A${totalCost.toLocaleString()}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Order Summary - 1/3 width */}
        <div>
          <Card className="sticky top-6">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Property</p>
                  <p className="font-semibold text-gray-900">{property.property.address}</p>
                  <p className="text-sm text-gray-600">{property.caseNumber}</p>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Purchase Price</span>
                    <span className="font-semibold">A${buyNowPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Legal Fees</span>
                    <span className="font-semibold">A${legalFees.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Stamp Duty (est.)</span>
                    <span className="font-semibold">A${stampDuty.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">
                      A${totalCost.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Settlement in 45 days</p>
                      <p className="text-xs text-gray-600">Professional conveyancing included</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Funds held in escrow</p>
                      <p className="text-xs text-gray-600">Protected until settlement</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Full documentation</p>
                      <p className="text-xs text-gray-600">Contract & IM provided</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-900 mb-1">Instant Equity</p>
                    <p className="text-lg font-bold text-blue-600">
                      A${((property.valuation.amount - buyNowPrice) / 1000).toFixed(0)}k
                    </p>
                    <p className="text-xs text-blue-800">
                      Property valued at A${(property.valuation.amount / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirm Payment Dialog */}
      <ConfirmDialog
        open={confirmPaymentOpen}
        onOpenChange={setConfirmPaymentOpen}
        title="Confirm Payment"
        description={`Are you sure you want to process payment of A$${totalCost.toLocaleString()}? This action cannot be undone.`}
        confirmLabel="Confirm Payment"
        onConfirm={handlePayment}
        variant="default"
      />
    </div>
  );
}

