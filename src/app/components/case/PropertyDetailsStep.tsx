import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { RPDataOverrideModal } from './RPDataOverrideModal';
import { 
  Home,
  AlertCircle,
  CheckCircle,
  Search,
  Database,
  RefreshCw,
  Shield,
  FileText
} from 'lucide-react';

interface PropertyDetailsStepProps {
  formData: any;
  rpDataStatus: 'idle' | 'validating' | 'found' | 'error';
  rpDataResults: any;
  showOverrideModal: boolean;
  setShowOverrideModal: (show: boolean) => void;
  handleInputChange: (field: string, value: any) => void;
  validateWithRPData: () => void;
  acceptRPData: () => void;
  handleOverride: (overrideValue: string, overrideReason: string, evidenceAttached: boolean) => void;
}

export function PropertyDetailsStep({
  formData,
  rpDataStatus,
  rpDataResults,
  showOverrideModal,
  setShowOverrideModal,
  handleInputChange,
  validateWithRPData,
  acceptRPData,
  handleOverride
}: PropertyDetailsStepProps) {
  // Calculate LVR if both values exist
  const calculateLVR = () => {
    const loan = parseFloat(formData.intendedLoanAmount);
    const value = formData.overrideFlag 
      ? parseFloat(formData.overrideValue)
      : parseFloat(formData.rpDataAvmMid);
    
    if (loan && value) {
      return ((loan / value) * 100).toFixed(1);
    }
    return null;
  };

  const lvr = calculateLVR();
  const confidenceScore = parseFloat(formData.rpDataConfidence);
  
  // Determine confidence badge color
  const getConfidenceBadge = () => {
    if (confidenceScore >= 75) return { color: 'green', label: 'High Confidence', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' };
    if (confidenceScore >= 60) return { color: 'amber', label: 'Medium Confidence', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800' };
    return { color: 'red', label: 'Low Confidence', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' };
  };

  const badge = rpDataStatus === 'found' ? getConfidenceBadge() : null;

  return (
    <div className="space-y-6">
      <RPDataOverrideModal
        isOpen={showOverrideModal}
        onClose={() => setShowOverrideModal(false)}
        onSave={handleOverride}
        formData={formData}
        onInputChange={handleInputChange}
      />

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-50 rounded-lg">
          <Home className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Property Details</h2>
          <p className="text-gray-600 text-sm">Enter property address for RP Data validation</p>
        </div>
        {rpDataStatus === 'found' && badge && (
          <div className={`flex items-center gap-2 px-4 py-2 ${badge.bg} border ${badge.border} rounded-lg`}>
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className={`text-sm font-semibold ${badge.text}`}>{badge.label}</span>
          </div>
        )}
      </div>

      {/* Section A: Address Entry Card */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-lg">Property Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="propertyAddress">Street Address * (Auto-complete enabled)</Label>
              <Input
                id="propertyAddress"
                value={formData.propertyAddress}
                onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                placeholder="45 Victoria Street"
                className="text-lg"
              />
            </div>

            <div>
              <Label htmlFor="propertySuburb">Suburb *</Label>
              <Input
                id="propertySuburb"
                value={formData.propertySuburb}
                onChange={(e) => handleInputChange('propertySuburb', e.target.value)}
                placeholder="Potts Point"
              />
            </div>

            <div>
              <Label htmlFor="propertyState">State *</Label>
              <select
                id="propertyState"
                value={formData.propertyState}
                onChange={(e) => handleInputChange('propertyState', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
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

            <div>
              <Label htmlFor="propertyPostcode">Postcode *</Label>
              <Input
                id="propertyPostcode"
                value={formData.propertyPostcode}
                onChange={(e) => handleInputChange('propertyPostcode', e.target.value)}
                placeholder="2011"
                maxLength={4}
              />
            </div>

            <div>
              <Label htmlFor="propertyType">Property Type *</Label>
              <select
                id="propertyType"
                value={formData.propertyType}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="townhouse">Townhouse</option>
                <option value="unit">Unit</option>
                <option value="land">Vacant Land</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="intendedLoanAmount">Intended Loan Amount (A$) *</Label>
              <Input
                id="intendedLoanAmount"
                type="number"
                value={formData.intendedLoanAmount}
                onChange={(e) => handleInputChange('intendedLoanAmount', e.target.value)}
                placeholder="650000"
                className="text-lg font-semibold"
              />
            </div>

            <div className="md:col-span-2 mt-4">
              {rpDataStatus === 'idle' && (
                <Button
                  onClick={validateWithRPData}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                  disabled={!formData.propertyAddress || !formData.propertySuburb || !formData.propertyPostcode}
                >
                  <Search className="w-5 h-5 mr-2" />
                  Validate & Pull Property Data
                </Button>
              )}

              {rpDataStatus === 'validating' && (
                <div className="flex flex-col items-center justify-center py-8">
                  <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mb-3" />
                  <p className="text-lg font-semibold text-gray-900">Verifying property data...</p>
                  <p className="text-sm text-gray-600">Connecting to RP Data API</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section B: RP Data Results Panel */}
      {rpDataStatus === 'found' && rpDataResults && (
        <Card className="border-2 border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="w-5 h-5 text-green-600" />
                  RP Data Snapshot
                </CardTitle>
                <p className="text-xs text-gray-600 mt-1">
                  Data Source: RP Data  •  {new Date(formData.rpDataTimestamp).toLocaleString()}
                </p>
              </div>
              {badge && (
                <div className={`px-3 py-1.5 ${badge.bg} border ${badge.border} rounded-lg`}>
                  <span className={`text-sm font-bold ${badge.text}`}>
                    {confidenceScore}% Confidence
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Estimated Value (Midpoint)</p>
                  <p className="text-3xl font-bold text-gray-900">
                    A${parseFloat(formData.rpDataAvmMid).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Value Range</p>
                  <p className="text-lg font-semibold text-gray-700">
                    A${parseFloat(formData.rpDataAvmLow).toLocaleString()} – 
                    A${parseFloat(formData.rpDataAvmHigh).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Confidence Score</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          confidenceScore >= 75 ? 'bg-green-600' :
                          confidenceScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${confidenceScore}%` }}
                      />
                    </div>
                    <span className="text-lg font-bold">{confidenceScore}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Last Sale Date</p>
                    <p className="font-semibold">{new Date(formData.rpDataLastSaleDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Last Sale Price</p>
                    <p className="font-semibold">A${parseFloat(formData.rpDataLastSalePrice).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Land Size</p>
                    <p className="text-lg font-semibold">{formData.landSize} sqm</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Dwelling Type</p>
                    <p className="text-lg font-semibold capitalize">{rpDataResults.dwellingType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Bedrooms</p>
                    <p className="text-lg font-semibold">{formData.bedrooms}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Bathrooms</p>
                    <p className="text-lg font-semibold">{formData.bathrooms}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm font-semibold text-gray-900 mb-3">Comparable Sales</p>
                  <div className="space-y-2">
                    {rpDataResults.comparableSales.map((sale: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                        <span className="text-gray-700">{sale.address}</span>
                        <div className="text-right">
                          <p className="font-semibold">A${sale.price.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{new Date(sale.saleDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* LVR Indicator */}
            {lvr && (
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-900">Loan-to-Value Ratio (LVR)</p>
                  <span className={`text-2xl font-bold ${
                    parseFloat(lvr) > 80 ? 'text-red-600' :
                    parseFloat(lvr) > 70 ? 'text-amber-600' : 'text-green-600'
                  }`}>
                    {lvr}%
                  </span>
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`absolute h-4 rounded-full ${
                      parseFloat(lvr) > 80 ? 'bg-red-500' :
                      parseFloat(lvr) > 70 ? 'bg-amber-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(parseFloat(lvr), 100)}%` }}
                  />
                  <div className="absolute left-[70%] top-0 bottom-0 w-0.5 bg-gray-400" />
                  <div className="absolute left-[80%] top-0 bottom-0 w-0.5 bg-red-400" />
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>0%</span>
                  <span className="absolute left-[70%] -translate-x-1/2">70%</span>
                  <span className="absolute left-[80%] -translate-x-1/2">80%</span>
                  <span>100%</span>
                </div>
                {parseFloat(lvr) > 70 && (
                  <p className="text-xs text-amber-700 mt-2 bg-amber-50 p-2 rounded">
                    ⚠️ LVR exceeds 70% - Additional valuation may be required
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              {!formData.rpDataAccepted ? (
                <>
                  <Button
                    onClick={acceptRPData}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Accept RP Data
                  </Button>
                  <Button
                    onClick={() => setShowOverrideModal(true)}
                    variant="outline"
                    className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
                    size="lg"
                  >
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Override Value
                  </Button>
                </>
              ) : (
                <div className="flex-1 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">
                      {formData.overrideFlag ? 'Override Applied' : 'RP Data Accepted'}
                    </p>
                    <p className="text-sm text-green-700">
                      {formData.overrideFlag 
                        ? `Manual value: A$${parseFloat(formData.overrideValue).toLocaleString()}`
                        : `Valuation: A$${parseFloat(formData.rpDataAvmMid).toLocaleString()}`
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>

            {confidenceScore < 60 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-900">Low Confidence - Valuation Required</p>
                  <p className="text-xs text-red-700 mt-1">
                    This property has been flagged for a full valuation order in the next step due to low confidence score.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {rpDataStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-900">Property data unavailable</p>
            <p className="text-xs text-red-700 mt-1">
              Please retry or proceed with manual entry. You'll be required to provide an override reason.
            </p>
            <Button
              onClick={validateWithRPData}
              variant="outline"
              className="mt-3 border-red-300 text-red-700 hover:bg-red-50"
              size="sm"
            >
              Retry RP Data Lookup
            </Button>
          </div>
        </div>
      )}
      
      {/* PPSA Security Requirements Section */}
      <Card className="border-2 border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            Security Requirements (PPSA Compliance)
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Personal Property Securities Act 2009 - Ensure security interests are properly registered
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">PPSA Compliance Required</p>
                <p>
                  Under the Personal Property Securities Act 2009, all security interests in personal property must be registered on the PPSR to be enforceable against third parties. For real property mortgages, registration on title is required.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="securityType">Type of Security *</Label>
              <select
                id="securityType"
                value={formData.securityType}
                onChange={(e) => handleInputChange('securityType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="registered_mortgage">Registered Mortgage (Real Property)</option>
                <option value="general_security_agreement">General Security Agreement (GSA)</option>
                <option value="specific_goods">Security over Specific Goods</option>
                <option value="pmsi">Purchase Money Security Interest (PMSI)</option>
                <option value="unsecured">Unsecured</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                PPSA s12 - Classification of security interest type
              </p>
            </div>

            {formData.securityType === 'registered_mortgage' && (
              <div className="space-y-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Registered Mortgage Requirements
                </h4>
                
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="mortgageRegisteredOnTitle"
                    checked={formData.mortgageRegisteredOnTitle}
                    onCheckedChange={(checked) => handleInputChange('mortgageRegisteredOnTitle', checked)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="mortgageRegisteredOnTitle" className="cursor-pointer font-medium">
                      Mortgage Registered on Title *
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">
                      Confirm that the mortgage is registered on the Certificate of Title at the relevant Land Titles Office (Real Property Act)
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="mortgagePriority">Mortgage Priority *</Label>
                  <select
                    id="mortgagePriority"
                    value={formData.mortgagePriority}
                    onChange={(e) => handleInputChange('mortgagePriority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="first">First Mortgage (Priority)</option>
                    <option value="second">Second Mortgage</option>
                    <option value="third">Third Mortgage</option>
                    <option value="subordinated">Subordinated</option>
                  </select>
                </div>
              </div>
            )}

            {(formData.securityType === 'general_security_agreement' || 
              formData.securityType === 'specific_goods' || 
              formData.securityType === 'pmsi') && (
              <div className="space-y-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  PPSR Registration Requirements
                </h4>
                
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="ppsrRegistered"
                    checked={formData.ppsrRegistered}
                    onCheckedChange={(checked) => handleInputChange('ppsrRegistered', checked)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="ppsrRegistered" className="cursor-pointer font-medium">
                      Registered on Personal Property Securities Register (PPSR) *
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">
                      PPSA s21 - Security interests must be registered on PPSR to be perfected and enforceable against third parties
                    </p>
                  </div>
                </div>

                {formData.ppsrRegistered && (
                  <>
                    <div>
                      <Label htmlFor="ppsrRegistrationNumber">PPSR Registration Number *</Label>
                      <Input
                        id="ppsrRegistrationNumber"
                        value={formData.ppsrRegistrationNumber}
                        onChange={(e) => handleInputChange('ppsrRegistrationNumber', e.target.value)}
                        placeholder="e.g., 201234567890123456"
                        maxLength={18}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        18-digit PPSR registration number
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="ppsrExpiryDate">Registration Expiry Date</Label>
                      <Input
                        id="ppsrExpiryDate"
                        type="date"
                        value={formData.ppsrExpiryDate}
                        onChange={(e) => handleInputChange('ppsrExpiryDate', e.target.value)}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        PPSR registrations can be for a fixed term or indefinite (perpetual)
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="securityAgreementDate">Security Agreement Date</Label>
              <Input
                id="securityAgreementDate"
                type="date"
                value={formData.securityAgreementDate}
                onChange={(e) => handleInputChange('securityAgreementDate', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Date when security agreement was executed
              </p>
            </div>

            <div>
              <Label htmlFor="securityDescription">Description of Secured Property</Label>
              <Textarea
                id="securityDescription"
                value={formData.securityDescription}
                onChange={(e) => handleInputChange('securityDescription', e.target.value)}
                placeholder="Describe the property or assets that are subject to the security interest..."
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                PPSA s153 - Clear description of collateral required
              </p>
            </div>

            {/* PPSA Compliance Confirmation */}
            <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="ppsaComplianceConfirmed"
                  checked={formData.ppsaComplianceConfirmed}
                  onCheckedChange={(checked) => handleInputChange('ppsaComplianceConfirmed', checked)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="ppsaComplianceConfirmed" className="cursor-pointer font-semibold text-purple-900">
                    I confirm PPSA compliance for this security interest *
                  </Label>
                  <p className="text-xs text-purple-700 mt-1">
                    I confirm that all security interests have been properly perfected according to PPSA requirements, including registration where required, and all necessary searches have been conducted.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
