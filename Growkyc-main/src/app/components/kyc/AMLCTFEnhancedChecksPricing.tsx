import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Shield,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Building,
  User,
  FileText,
  Search,
  MapPin,
  Clock,
  Info,
  Lock,
  Unlock
} from 'lucide-react';

interface CheckItem {
  id: string;
  name: string;
  description: string;
  mandatory: boolean;
  pricingModel: 'per-individual' | 'per-entity' | 'per-property' | 'finalized-later';
  basePrice?: number;
  icon: any;
  category: 'individual' | 'entity' | 'property';
  notes?: string;
}

export function AMLCTFEnhancedChecksPricing() {
  const [selectedChecks, setSelectedChecks] = useState<string[]>([
    'individual_idv',
    'director_officer_search'
  ]);

  const checks: CheckItem[] = [
    // MANDATORY CHECKS
    {
      id: 'individual_idv',
      name: 'Individual Identity Verification',
      description: 'Enhanced AML/CTF individual verification via GreenID/InfoTrack - DVS certified',
      mandatory: true,
      pricingModel: 'per-individual',
      basePrice: 12.50,
      icon: User,
      category: 'individual',
      notes: 'MANDATORY - Must be paid for every individual client, beneficial owner, director, and officer'
    },
    {
      id: 'director_officer_search',
      name: 'Director/Officer Search',
      description: 'ASIC director and officer history check including disqualifications',
      mandatory: true,
      pricingModel: 'per-individual',
      basePrice: 15.00,
      icon: Shield,
      category: 'individual',
      notes: 'MANDATORY - Required for all directors and officers of companies and trusts'
    },

    // PER ENTITY CHECKS (Price finalized after client-entity association identified)
    {
      id: 'asic_company_search',
      name: 'ASIC Company Search',
      description: 'Current company extract including directors, shareholders, and company status',
      mandatory: false,
      pricingModel: 'finalized-later',
      basePrice: 45.00,
      icon: Building,
      category: 'entity',
      notes: 'Per company - Final price determined once client association with entity is confirmed'
    },
    {
      id: 'asic_historical_search',
      name: 'ASIC Historical Company Search',
      description: 'Historical company extract including former directors and previous addresses',
      mandatory: false,
      pricingModel: 'finalized-later',
      basePrice: 65.00,
      icon: FileText,
      category: 'entity',
      notes: 'Per company - Enhanced check for high-risk entities or complex structures'
    },
    {
      id: 'trust_search',
      name: 'Trust Document Search',
      description: 'Trust deed verification and trustee identification',
      mandatory: false,
      pricingModel: 'finalized-later',
      basePrice: 75.00,
      icon: Shield,
      category: 'entity',
      notes: 'Per trust - Price finalized once trust-client relationship is identified'
    },
    {
      id: 'abn_lookup',
      name: 'ABN/ACN Verification',
      description: 'Australian Business Number and Australian Company Number verification',
      mandatory: false,
      pricingModel: 'finalized-later',
      basePrice: 5.00,
      icon: Search,
      category: 'entity',
      notes: 'Per entity - Included with ASIC searches, standalone if required'
    },
    {
      id: 'ppsr_search',
      name: 'PPSR Security Interest Search',
      description: 'Personal Property Securities Register search for security interests',
      mandatory: false,
      pricingModel: 'finalized-later',
      basePrice: 35.00,
      icon: Lock,
      category: 'entity',
      notes: 'Per entity - Optional enhanced check for lending and secured transactions'
    },
    {
      id: 'litigation_search',
      name: 'Litigation History Search',
      description: 'Federal and State court records search',
      mandatory: false,
      pricingModel: 'finalized-later',
      basePrice: 65.00,
      icon: FileText,
      category: 'entity',
      notes: 'Per entity - Enhanced due diligence for high-risk clients'
    },
    {
      id: 'bankruptcy_search',
      name: 'Bankruptcy & Insolvency Search',
      description: 'NPII bankruptcy and insolvency records check',
      mandatory: false,
      pricingModel: 'finalized-later',
      basePrice: 25.00,
      icon: AlertCircle,
      category: 'entity',
      notes: 'Per individual or entity - Enhanced check for financial risk assessment'
    },

    // TITLE SEARCHES
    {
      id: 'title_search_current',
      name: 'Current Title Search',
      description: 'Current registered proprietor and encumbrances search',
      mandatory: false,
      pricingModel: 'per-property',
      basePrice: 45.00,
      icon: MapPin,
      category: 'property',
      notes: 'Per property title - Required when entity owns real property or client provides property as security'
    },
    {
      id: 'title_search_historical',
      name: 'Historical Title Search',
      description: '20-year historical title search including previous owners',
      mandatory: false,
      pricingModel: 'per-property',
      basePrice: 75.00,
      icon: Clock,
      category: 'property',
      notes: 'Per property title - Enhanced check for complex property ownership or source of wealth verification'
    },
    {
      id: 'title_search_dealing',
      name: 'Dealing Search',
      description: 'Search for recent or pending dealings on title',
      mandatory: false,
      pricingModel: 'per-property',
      basePrice: 35.00,
      icon: FileText,
      category: 'property',
      notes: 'Per property title - Identifies pending mortgages, caveats, or transfers'
    },
    {
      id: 'property_valuation',
      name: 'Property Valuation Report',
      description: 'Professional property valuation for security or source of wealth',
      mandatory: false,
      pricingModel: 'per-property',
      basePrice: 250.00,
      icon: DollarSign,
      category: 'property',
      notes: 'Per property - Required for secured lending or high-value property ownership verification'
    }
  ];

  const toggleCheck = (checkId: string) => {
    const check = checks.find(c => c.id === checkId);
    if (check?.mandatory) {
      // Cannot deselect mandatory checks
      return;
    }

    if (selectedChecks.includes(checkId)) {
      setSelectedChecks(selectedChecks.filter(id => id !== checkId));
    } else {
      setSelectedChecks([...selectedChecks, checkId]);
    }
  };

  const calculateEstimatedCost = () => {
    let mandatoryCost = 0;
    let optionalCost = 0;
    let finalizedLaterCount = 0;

    selectedChecks.forEach(checkId => {
      const check = checks.find(c => c.id === checkId);
      if (check?.basePrice) {
        if (check.mandatory) {
          mandatoryCost += check.basePrice;
        } else if (check.pricingModel === 'finalized-later') {
          finalizedLaterCount++;
        } else {
          optionalCost += check.basePrice;
        }
      }
    });

    return { mandatoryCost, optionalCost, finalizedLaterCount };
  };

  const costs = calculateEstimatedCost();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'individual': return User;
      case 'entity': return Building;
      case 'property': return MapPin;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-4 rounded-full">
            <Shield className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">AML/CTF Enhanced Checks & Pricing</h1>
            <p className="text-xl text-purple-100">
              Identity Verification, Director Searches, Entity Checks & Title Searches
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-6 h-6 text-red-600" />
              <h3 className="font-bold text-red-900">Mandatory Checks</h3>
            </div>
            <p className="text-4xl font-bold text-red-600">${costs.mandatoryCost.toFixed(2)}</p>
            <p className="text-sm text-red-700 mt-1">Must be paid</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Unlock className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-blue-900">Optional Checks</h3>
            </div>
            <p className="text-4xl font-bold text-blue-600">${costs.optionalCost.toFixed(2)}</p>
            <p className="text-sm text-blue-700 mt-1">Selected</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-amber-600" />
              <h3 className="font-bold text-amber-900">Finalized Later</h3>
            </div>
            <p className="text-4xl font-bold text-amber-600">{costs.finalizedLaterCount}</p>
            <p className="text-sm text-amber-700 mt-1">Per entity/property</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h3 className="font-bold text-green-900">Total Estimate</h3>
            </div>
            <p className="text-4xl font-bold text-green-600">
              ${(costs.mandatoryCost + costs.optionalCost).toFixed(2)}+
            </p>
            <p className="text-sm text-green-700 mt-1">Confirmed now</p>
          </CardContent>
        </Card>
      </div>

      {/* Important Notice */}
      <Card className="border border-gray-200 bg-white">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-red-900 text-lg mb-2">Payment Required for Mandatory Checks</h3>
              <div className="space-y-2 text-red-800">
                <p>
                  <strong>• Individual Identity Verification ($12.50 per person)</strong> - Required for EVERY individual 
                  including clients, beneficial owners, directors, officers, and authorized signatories
                </p>
                <p>
                  <strong>• Director/Officer Search ($15.00 per person)</strong> - Required for ALL directors and officers 
                  of companies and trusts to verify ASIC history and check for disqualifications
                </p>
                <p className="mt-3 pt-3 border-t border-red-300">
                  Other checks are priced <strong>per company, per trust, or per property title</strong>. 
                  Final amounts will be confirmed once we have identified the client's association with those entities.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mandatory Checks */}
      <Card className="border-2 border-red-300">
        <CardHeader className="bg-red-50">
          <CardTitle className="flex items-center gap-2 text-red-900">
            <Lock className="w-6 h-6" />
            Mandatory Payment Checks
          </CardTitle>
          <CardDescription className="text-red-700">
            These checks must be completed and paid for every relevant individual
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {checks.filter(c => c.mandatory).map(check => {
            const Icon = check.icon;
            const CategoryIcon = getCategoryIcon(check.category);
            const isSelected = selectedChecks.includes(check.id);

            return (
              <div
                key={check.id}
                className="border border-gray-200 bg-white rounded-lg p-6 cursor-not-allowed"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="bg-red-600 p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-red-900">{check.name}</h3>
                        <Badge className="bg-red-600 text-white">MANDATORY</Badge>
                        <Badge variant="outline" className="border-red-400 text-red-700">
                          <CategoryIcon className="w-3 h-3 mr-1" />
                          {check.category}
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-3">{check.description}</p>
                      {check.notes && (
                        <div className="bg-white border border-red-200 rounded p-3 mt-2">
                          <div className="flex gap-2">
                            <Info className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{check.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-red-600 mb-1">
                      ${check.basePrice?.toFixed(2)}
                    </div>
                    <div className="text-sm text-red-700 font-semibold">
                      {check.pricingModel === 'per-individual' && 'per person'}
                      {check.pricingModel === 'per-entity' && 'per entity'}
                    </div>
                    <div className="mt-3">
                      <Lock className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Entity Checks - Finalized Later */}
      <Card className="border-2 border-amber-300">
        <CardHeader className="bg-amber-50">
          <CardTitle className="flex items-center gap-2 text-amber-900">
            <Building className="w-6 h-6" />
            Entity Checks - Per Company/Trust
          </CardTitle>
          <CardDescription className="text-amber-700">
            Final pricing determined once client association with entity is identified
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {checks.filter(c => !c.mandatory && c.category === 'entity').map(check => {
            const Icon = check.icon;
            const isSelected = selectedChecks.includes(check.id);

            return (
              <div
                key={check.id}
                onClick={() => toggleCheck(check.id)}
                className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-amber-200 bg-white hover:border-amber-400 hover:bg-amber-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${
                      isSelected ? 'bg-amber-600' : 'bg-amber-200'
                    }`}>
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-amber-700'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{check.name}</h3>
                        <Badge variant="outline" className="border-amber-400 text-amber-700">
                          Optional
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-3">{check.description}</p>
                      {check.notes && (
                        <div className="bg-white border border-amber-200 rounded p-3 mt-2">
                          <div className="flex gap-2">
                            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-800">{check.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-amber-600 mb-1">
                      ${check.basePrice?.toFixed(2)}
                    </div>
                    <div className="text-sm text-amber-700 font-semibold">per entity</div>
                    <div className="mt-3">
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        isSelected
                          ? 'bg-amber-600 border-amber-600'
                          : 'border-amber-400'
                      }`}>
                        {isSelected && <CheckCircle className="w-5 h-5 text-white" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Title Searches */}
      <Card className="border-2 border-blue-300">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <MapPin className="w-6 h-6" />
            Title Searches - Per Property
          </CardTitle>
          <CardDescription className="text-blue-700">
            Property title searches when entities own real property or provide property as security
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {checks.filter(c => c.category === 'property').map(check => {
            const Icon = check.icon;
            const isSelected = selectedChecks.includes(check.id);

            return (
              <div
                key={check.id}
                onClick={() => toggleCheck(check.id)}
                className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-blue-200 bg-white hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${
                      isSelected ? 'bg-blue-600' : 'bg-blue-200'
                    }`}>
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-blue-700'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{check.name}</h3>
                        <Badge variant="outline" className="border-blue-400 text-blue-700">
                          Optional
                        </Badge>
                        <Badge className="bg-blue-600 text-white">
                          <MapPin className="w-3 h-3 mr-1" />
                          Property
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-3">{check.description}</p>
                      {check.notes && (
                        <div className="bg-white border border-blue-200 rounded p-3 mt-2">
                          <div className="flex gap-2">
                            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-blue-800">{check.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      ${check.basePrice?.toFixed(2)}
                    </div>
                    <div className="text-sm text-blue-700 font-semibold">per property</div>
                    <div className="mt-3">
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-blue-400'
                      }`}>
                        {isSelected && <CheckCircle className="w-5 h-5 text-white" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Pricing Summary */}
      <Card className="border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <DollarSign className="w-6 h-6" />
            Pricing Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-red-100 rounded-lg border-2 border-red-300">
              <div>
                <p className="font-bold text-red-900">Mandatory Checks (Must Pay)</p>
                <p className="text-sm text-red-700">Individual IDV + Director/Officer Search</p>
              </div>
              <div className="text-2xl font-bold text-red-600">${costs.mandatoryCost.toFixed(2)}</div>
            </div>

            <div className="flex justify-between items-center p-4 bg-blue-100 rounded-lg border-2 border-blue-300">
              <div>
                <p className="font-bold text-blue-900">Optional Checks (Selected)</p>
                <p className="text-sm text-blue-700">Pre-selected entity and property checks</p>
              </div>
              <div className="text-2xl font-bold text-blue-600">${costs.optionalCost.toFixed(2)}</div>
            </div>

            {costs.finalizedLaterCount > 0 && (
              <div className="flex justify-between items-center p-4 bg-amber-100 rounded-lg border-2 border-amber-300">
                <div>
                  <p className="font-bold text-amber-900">Entity/Property Checks (Finalized Later)</p>
                  <p className="text-sm text-amber-700">
                    {costs.finalizedLaterCount} checks - Price confirmed after entity identification
                  </p>
                </div>
                <div className="text-2xl font-bold text-amber-600">TBD</div>
              </div>
            )}

            <div className="flex justify-between items-center p-4 bg-green-100 rounded-lg border-2 border-green-400">
              <div>
                <p className="font-bold text-green-900 text-xl">Total Confirmed Now</p>
                <p className="text-sm text-green-700">Mandatory + Pre-selected optional checks</p>
              </div>
              <div className="text-3xl font-bold text-green-600">
                ${(costs.mandatoryCost + costs.optionalCost).toFixed(2)}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white border-2 border-gray-300 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-3">Pricing Notes:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-red-600">•</span>
                <span><strong>Mandatory checks ($27.50/person)</strong> must be paid for each individual (client, beneficial owner, director, officer)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-600">•</span>
                <span><strong>Entity checks</strong> are priced per company or trust. Final amount determined once client's association with entity is confirmed</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span><strong>Title searches</strong> are priced per property. Required when entity owns real property or provides it as security</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600">•</span>
                <span>All prices are in AUD and exclude GST</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
