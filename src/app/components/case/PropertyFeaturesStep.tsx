import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Building2, Upload, CheckCircle } from 'lucide-react';

interface PropertyFeaturesStepProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
}

export function PropertyFeaturesStep({ formData, handleInputChange }: PropertyFeaturesStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-teal-50 rounded-lg">
          <Building2 className="w-6 h-6 text-teal-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Property Features & Condition</h2>
          <p className="text-gray-600 text-sm">Detailed property information for lender assessment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Building Details */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Building Specifications</h3>
        </div>

        <div>
          <Label htmlFor="yearBuilt">Year Built</Label>
          <Input
            id="yearBuilt"
            type="number"
            value={formData.yearBuilt}
            onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
            placeholder="1995"
          />
        </div>

        <div>
          <Label htmlFor="floorArea">Floor Area (sqm)</Label>
          <Input
            id="floorArea"
            type="number"
            value={formData.floorArea}
            onChange={(e) => handleInputChange('floorArea', e.target.value)}
            placeholder="180"
          />
        </div>

        <div>
          <Label htmlFor="storeys">Number of Storeys</Label>
          <Input
            id="storeys"
            type="number"
            value={formData.storeys}
            onChange={(e) => handleInputChange('storeys', e.target.value)}
            placeholder="2"
          />
        </div>

        <div>
          <Label htmlFor="construction">Construction Type</Label>
          <select
            id="construction"
            value={formData.construction}
            onChange={(e) => handleInputChange('construction', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Select type</option>
            <option value="brick">Full Brick</option>
            <option value="brick_veneer">Brick Veneer</option>
            <option value="weatherboard">Weatherboard</option>
            <option value="concrete">Concrete</option>
            <option value="steel_frame">Steel Frame</option>
            <option value="timber">Timber</option>
          </select>
        </div>

        <div>
          <Label htmlFor="roofType">Roof Type</Label>
          <select
            id="roofType"
            value={formData.roofType}
            onChange={(e) => handleInputChange('roofType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Select type</option>
            <option value="tile">Tile</option>
            <option value="metal">Metal/Colorbond</option>
            <option value="slate">Slate</option>
            <option value="concrete">Concrete</option>
          </select>
        </div>

        <div>
          <Label htmlFor="condition">Property Condition</Label>
          <select
            id="condition"
            value={formData.condition}
            onChange={(e) => handleInputChange('condition', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="average">Average</option>
            <option value="fair">Fair - Some Maintenance Required</option>
            <option value="poor">Poor - Major Work Required</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="renovations">Recent Renovations/Improvements</Label>
          <Textarea
            id="renovations"
            value={formData.renovations}
            onChange={(e) => handleInputChange('renovations', e.target.value)}
            placeholder="Kitchen renovation 2022, new roof 2021, etc."
            rows={2}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="specialFeatures">Special Features</Label>
          <Textarea
            id="specialFeatures"
            value={formData.specialFeatures}
            onChange={(e) => handleInputChange('specialFeatures', e.target.value)}
            placeholder="Swimming pool, tennis court, granny flat, solar panels, etc."
            rows={2}
          />
        </div>

        {/* Rates & Charges */}
        <div className="md:col-span-2 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rates & Ongoing Charges</h3>
        </div>

        <div>
          <Label htmlFor="councilRates">Council Rates (Annual A$)</Label>
          <Input
            id="councilRates"
            type="number"
            value={formData.councilRates}
            onChange={(e) => handleInputChange('councilRates', e.target.value)}
            placeholder="2500"
          />
        </div>

        <div>
          <Label htmlFor="waterRates">Water Rates (Annual A$)</Label>
          <Input
            id="waterRates"
            type="number"
            value={formData.waterRates}
            onChange={(e) => handleInputChange('waterRates', e.target.value)}
            placeholder="800"
          />
        </div>

        <div>
          <Label htmlFor="strataFees">Strata Fees (Quarterly A$)</Label>
          <Input
            id="strataFees"
            type="number"
            value={formData.strataFees}
            onChange={(e) => handleInputChange('strataFees', e.target.value)}
            placeholder="1200"
          />
          <p className="text-xs text-gray-600 mt-1">If applicable (apartments/townhouses)</p>
        </div>

        <div>
          <Label htmlFor="landTax">Land Tax (Annual A$)</Label>
          <Input
            id="landTax"
            type="number"
            value={formData.landTax}
            onChange={(e) => handleInputChange('landTax', e.target.value)}
            placeholder="0"
          />
          <p className="text-xs text-gray-600 mt-1">If applicable (investment property)</p>
        </div>

        {/* Insurance */}
        <div className="md:col-span-2 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance</h3>
        </div>

        <div>
          <Label htmlFor="insuranceProvider">Insurance Provider</Label>
          <Input
            id="insuranceProvider"
            value={formData.insuranceProvider}
            onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
            placeholder="NRMA, RACV, etc."
          />
        </div>

        <div>
          <Label htmlFor="insuranceValue">Sum Insured (A$)</Label>
          <Input
            id="insuranceValue"
            type="number"
            value={formData.insuranceValue}
            onChange={(e) => handleInputChange('insuranceValue', e.target.value)}
            placeholder="800000"
          />
        </div>

        <div>
          <Label htmlFor="insuranceExpiry">Insurance Expiry Date</Label>
          <Input
            id="insuranceExpiry"
            type="date"
            value={formData.insuranceExpiry}
            onChange={(e) => handleInputChange('insuranceExpiry', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="insuranceDocument">Upload Insurance Policy</Label>
          <div className="mt-1 flex items-center gap-3">
            <Button variant="outline" className="flex-1">
              <Upload className="w-4 h-4 mr-2" />
              {formData.insuranceDocumentUploaded ? 'Change Document' : 'Upload Policy'}
            </Button>
            {formData.insuranceDocumentUploaded && (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
          </div>
        </div>

        {/* Sales History */}
        <div className="md:col-span-2 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales History</h3>
        </div>

        <div>
          <Label htmlFor="lastSalePrice">Last Sale Price (A$)</Label>
          <Input
            id="lastSalePrice"
            type="number"
            value={formData.lastSalePrice}
            onChange={(e) => handleInputChange('lastSalePrice', e.target.value)}
            placeholder="850000"
          />
        </div>

        <div>
          <Label htmlFor="lastSaleDate">Last Sale Date</Label>
          <Input
            id="lastSaleDate"
            type="date"
            value={formData.lastSaleDate}
            onChange={(e) => handleInputChange('lastSaleDate', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="priorSalePrice">Prior Sale Price (A$)</Label>
          <Input
            id="priorSalePrice"
            type="number"
            value={formData.priorSalePrice}
            onChange={(e) => handleInputChange('priorSalePrice', e.target.value)}
            placeholder="650000"
          />
        </div>

        <div>
          <Label htmlFor="priorSaleDate">Prior Sale Date</Label>
          <Input
            id="priorSaleDate"
            type="date"
            value={formData.priorSaleDate}
            onChange={(e) => handleInputChange('priorSaleDate', e.target.value)}
          />
        </div>

        {/* Document Uploads */}
        <div className="md:col-span-2 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Supporting Documents</h3>
        </div>

        <div>
          <Label htmlFor="titleDeed">Title Deed/Certificate</Label>
          <div className="mt-1 flex items-center gap-3">
            <Button variant="outline" className="flex-1">
              <Upload className="w-4 h-4 mr-2" />
              {formData.titleDeedUploaded ? 'Change Document' : 'Upload Title'}
            </Button>
            {formData.titleDeedUploaded && (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="rateCertificate">Rates Certificate</Label>
          <div className="mt-1 flex items-center gap-3">
            <Button variant="outline" className="flex-1">
              <Upload className="w-4 h-4 mr-2" />
              {formData.rateCertificateUploaded ? 'Change Document' : 'Upload Certificate'}
            </Button>
            {formData.rateCertificateUploaded && (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="buildingInspection">Building/Pest Inspection</Label>
          <div className="mt-1 flex items-center gap-3">
            <Button variant="outline" className="flex-1">
              <Upload className="w-4 h-4 mr-2" />
              {formData.buildingInspectionUploaded ? 'Change Report' : 'Upload Report'}
            </Button>
            {formData.buildingInspectionUploaded && (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
