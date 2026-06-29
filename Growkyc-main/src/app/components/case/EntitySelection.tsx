import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Building2, User, Shield, Plus, Trash2, Users } from 'lucide-react';

interface EntitySelectionProps {
  entityType: 'personal' | 'company' | 'trust';
  onEntityTypeChange: (type: 'personal' | 'company' | 'trust') => void;
  formData: any;
  onInputChange: (field: string, value: any) => void;
  directors: Array<{name: string; position: string; dob: string; email: string; phone: string}>;
  setDirectors: (directors: any) => void;
  shareholders: Array<{name: string; percentage: number; dob: string; email: string; phone: string}>;
  setShareholders: (shareholders: any) => void;
  trustees: Array<{type: 'individual' | 'company'; name: string; abn?: string; directors?: Array<{name: string; position: string}>}>;
  setTrustees: (trustees: any) => void;
  guarantors: Array<{type: 'individual' | 'company'; name: string; dob?: string; email?: string; phone?: string; abn?: string; directors?: Array<{name: string; position: string}>}>;
  setGuarantors: (guarantors: any) => void;
}

export function EntitySelection({
  entityType,
  onEntityTypeChange,
  formData,
  onInputChange,
  directors,
  setDirectors,
  shareholders,
  setShareholders,
  trustees,
  setTrustees,
  guarantors,
  setGuarantors
}: EntitySelectionProps) {

  const addDirector = () => {
    setDirectors([...directors, { name: '', position: 'Director', dob: '', email: '', phone: '' }]);
  };

  const removeDirector = (index: number) => {
    setDirectors(directors.filter((_, i) => i !== index));
  };

  const updateDirector = (index: number, field: string, value: string) => {
    const updated = [...directors];
    updated[index] = { ...updated[index], [field]: value };
    setDirectors(updated);
  };

  const addShareholder = () => {
    setShareholders([...shareholders, { name: '', percentage: 0, dob: '', email: '', phone: '' }]);
  };

  const removeShareholder = (index: number) => {
    setShareholders(shareholders.filter((_, i) => i !== index));
  };

  const updateShareholder = (index: number, field: string, value: string | number) => {
    const updated = [...shareholders];
    updated[index] = { ...updated[index], [field]: value };
    setShareholders(updated);
  };

  const addTrustee = () => {
    setTrustees([...trustees, { type: 'individual', name: '', directors: [] }]);
  };

  const removeTrustee = (index: number) => {
    setTrustees(trustees.filter((_, i) => i !== index));
  };

  const updateTrustee = (index: number, field: string, value: any) => {
    const updated = [...trustees];
    updated[index] = { ...updated[index], [field]: value };
    setTrustees(updated);
  };

  const addTrusteeDirector = (trusteeIndex: number) => {
    const updated = [...trustees];
    if (!updated[trusteeIndex].directors) {
      updated[trusteeIndex].directors = [];
    }
    updated[trusteeIndex].directors!.push({ name: '', position: 'Director' });
    setTrustees(updated);
  };

  const removeTrusteeDirector = (trusteeIndex: number, directorIndex: number) => {
    const updated = [...trustees];
    updated[trusteeIndex].directors = updated[trusteeIndex].directors!.filter((_, i) => i !== directorIndex);
    setTrustees(updated);
  };

  const updateTrusteeDirector = (trusteeIndex: number, directorIndex: number, field: string, value: string) => {
    const updated = [...trustees];
    updated[trusteeIndex].directors![directorIndex] = {
      ...updated[trusteeIndex].directors![directorIndex],
      [field]: value
    };
    setTrustees(updated);
  };

  const addGuarantor = () => {
    setGuarantors([...guarantors, { type: 'individual', name: '', directors: [] }]);
  };

  const removeGuarantor = (index: number) => {
    setGuarantors(guarantors.filter((_, i) => i !== index));
  };

  const updateGuarantor = (index: number, field: string, value: any) => {
    const updated = [...guarantors];
    updated[index] = { ...updated[index], [field]: value };
    setGuarantors(updated);
  };

  const addGuarantorDirector = (guarantorIndex: number) => {
    const updated = [...guarantors];
    if (!updated[guarantorIndex].directors) {
      updated[guarantorIndex].directors = [];
    }
    updated[guarantorIndex].directors!.push({ name: '', position: 'Director' });
    setGuarantors(updated);
  };

  const removeGuarantorDirector = (guarantorIndex: number, directorIndex: number) => {
    const updated = [...guarantors];
    updated[guarantorIndex].directors = updated[guarantorIndex].directors!.filter((_, i) => i !== directorIndex);
    setGuarantors(updated);
  };

  const updateGuarantorDirector = (guarantorIndex: number, directorIndex: number, field: string, value: string) => {
    const updated = [...guarantors];
    updated[guarantorIndex].directors![directorIndex] = {
      ...updated[guarantorIndex].directors![directorIndex],
      [field]: value
    };
    setGuarantors(updated);
  };

  return (
    <div className="space-y-6">
      {/* Entity Type Selection */}
      <Card className="border-2 border-indigo-300">
        <CardHeader className="bg-indigo-50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            Borrowing Entity Type
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Select the type of entity borrowing the funds
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => onEntityTypeChange('personal')}
              className={`p-6 rounded-lg border-2 transition-all ${
                entityType === 'personal'
                  ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                  : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
              }`}
            >
              <User className={`w-8 h-8 mx-auto mb-2 ${entityType === 'personal' ? 'text-indigo-600' : 'text-gray-600'}`} />
              <div className="text-center">
                <div className="font-bold text-gray-900">Personal</div>
                <div className="text-xs text-gray-600 mt-1">Individual borrower</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onEntityTypeChange('company')}
              className={`p-6 rounded-lg border-2 transition-all ${
                entityType === 'company'
                  ? 'border-purple-500 bg-purple-50 shadow-lg'
                  : 'border-gray-300 hover:border-purple-300 hover:bg-gray-50'
              }`}
            >
              <Building2 className={`w-8 h-8 mx-auto mb-2 ${entityType === 'company' ? 'text-purple-600' : 'text-gray-600'}`} />
              <div className="text-center">
                <div className="font-bold text-gray-900">Company</div>
                <div className="text-xs text-gray-600 mt-1">Corporate entity</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onEntityTypeChange('trust')}
              className={`p-6 rounded-lg border-2 transition-all ${
                entityType === 'trust'
                  ? 'border-amber-500 bg-amber-50 shadow-lg'
                  : 'border-gray-300 hover:border-amber-300 hover:bg-gray-50'
              }`}
            >
              <Shield className={`w-8 h-8 mx-auto mb-2 ${entityType === 'trust' ? 'text-amber-600' : 'text-gray-600'}`} />
              <div className="text-center">
                <div className="font-bold text-gray-900">Trust</div>
                <div className="text-xs text-gray-600 mt-1">Trust structure</div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Company Details */}
      {entityType === 'company' && (
        <>
          <Card className="border-2 border-purple-300">
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                Company Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => onInputChange('companyName', e.target.value)}
                    placeholder="ABC Pty Ltd"
                  />
                </div>
                <div>
                  <Label htmlFor="companyACN">ACN *</Label>
                  <Input
                    id="companyACN"
                    value={formData.companyACN}
                    onChange={(e) => onInputChange('companyACN', e.target.value)}
                    placeholder="123 456 789"
                  />
                </div>
                <div>
                  <Label htmlFor="companyABN">ABN</Label>
                  <Input
                    id="companyABN"
                    value={formData.companyABN}
                    onChange={(e) => onInputChange('companyABN', e.target.value)}
                    placeholder="12 345 678 901"
                  />
                </div>
                <div>
                  <Label htmlFor="companyType">Company Type</Label>
                  <select
                    id="companyType"
                    value={formData.companyType}
                    onChange={(e) => onInputChange('companyType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="proprietary">Proprietary (Pty Ltd)</option>
                    <option value="public">Public Company</option>
                    <option value="unlimitedProprierary">Unlimited Proprietary</option>
                    <option value="limited">Limited</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="companyRegistrationDate">Registration Date</Label>
                  <Input
                    id="companyRegistrationDate"
                    type="date"
                    value={formData.companyRegistrationDate}
                    onChange={(e) => onInputChange('companyRegistrationDate', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Directors */}
          <Card className="border-2 border-blue-300">
            <CardHeader className="bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Directors ({directors.length})
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">All directors must be verified</p>
                </div>
                <Button type="button" onClick={addDirector} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Director
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {directors.length === 0 && (
                <p className="text-center text-gray-500 py-4">No directors added yet. Click "Add Director" to begin.</p>
              )}
              {directors.map((director, idx) => (
                <div key={idx} className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 relative">
                  <button
                    type="button"
                    onClick={() => removeDirector(idx)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid md:grid-cols-2 gap-4 pr-8">
                    <div>
                      <Label>Name *</Label>
                      <Input
                        value={director.name}
                        onChange={(e) => updateDirector(idx, 'name', e.target.value)}
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <Label>Position</Label>
                      <Input
                        value={director.position}
                        onChange={(e) => updateDirector(idx, 'position', e.target.value)}
                        placeholder="Managing Director"
                      />
                    </div>
                    <div>
                      <Label>Date of Birth *</Label>
                      <Input
                        type="date"
                        value={director.dob}
                        onChange={(e) => updateDirector(idx, 'dob', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={director.email}
                        onChange={(e) => updateDirector(idx, 'email', e.target.value)}
                        placeholder="john@company.com"
                      />
                    </div>
                    <div>
                      <Label>Phone *</Label>
                      <Input
                        type="tel"
                        value={director.phone}
                        onChange={(e) => updateDirector(idx, 'phone', e.target.value)}
                        placeholder="0400 000 000"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Shareholders 25%+ */}
          <Card className="border-2 border-green-300">
            <CardHeader className="bg-green-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    Shareholders with 25%+ Ownership ({shareholders.length})
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">AML/CTF Act requires verification of beneficial owners with 25%+ shareholding</p>
                </div>
                <Button type="button" onClick={addShareholder} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Shareholder
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {shareholders.length === 0 && (
                <p className="text-center text-gray-500 py-4">No shareholders added yet. Click "Add Shareholder" to begin.</p>
              )}
              {shareholders.map((shareholder, idx) => (
                <div key={idx} className="p-4 bg-green-50 rounded-lg border-2 border-green-200 relative">
                  <button
                    type="button"
                    onClick={() => removeShareholder(idx)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid md:grid-cols-2 gap-4 pr-8">
                    <div>
                      <Label>Name *</Label>
                      <Input
                        value={shareholder.name}
                        onChange={(e) => updateShareholder(idx, 'name', e.target.value)}
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div>
                      <Label>Ownership Percentage *</Label>
                      <Input
                        type="number"
                        min="25"
                        max="100"
                        value={shareholder.percentage}
                        onChange={(e) => updateShareholder(idx, 'percentage', parseInt(e.target.value))}
                        placeholder="50"
                      />
                    </div>
                    <div>
                      <Label>Date of Birth *</Label>
                      <Input
                        type="date"
                        value={shareholder.dob}
                        onChange={(e) => updateShareholder(idx, 'dob', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={shareholder.email}
                        onChange={(e) => updateShareholder(idx, 'email', e.target.value)}
                        placeholder="jane@example.com"
                      />
                    </div>
                    <div>
                      <Label>Phone *</Label>
                      <Input
                        type="tel"
                        value={shareholder.phone}
                        onChange={(e) => updateShareholder(idx, 'phone', e.target.value)}
                        placeholder="0400 000 000"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}

      {/* Trust Details */}
      {entityType === 'trust' && (
        <>
          <Card className="border-2 border-amber-300">
            <CardHeader className="bg-amber-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600" />
                Trust Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="trustName">Trust Name *</Label>
                  <Input
                    id="trustName"
                    value={formData.trustName}
                    onChange={(e) => onInputChange('trustName', e.target.value)}
                    placeholder="Smith Family Trust"
                  />
                </div>
                <div>
                  <Label htmlFor="trustType">Trust Type</Label>
                  <select
                    id="trustType"
                    value={formData.trustType}
                    onChange={(e) => onInputChange('trustType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                  >
                    <option value="family">Family Trust</option>
                    <option value="unit">Unit Trust</option>
                    <option value="discretionary">Discretionary Trust</option>
                    <option value="hybrid">Hybrid Trust</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="trustABN">ABN (if registered)</Label>
                  <Input
                    id="trustABN"
                    value={formData.trustABN}
                    onChange={(e) => onInputChange('trustABN', e.target.value)}
                    placeholder="12 345 678 901"
                  />
                </div>
                <div>
                  <Label htmlFor="trustEstablishmentDate">Establishment Date</Label>
                  <Input
                    id="trustEstablishmentDate"
                    type="date"
                    value={formData.trustEstablishmentDate}
                    onChange={(e) => onInputChange('trustEstablishmentDate', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trustees */}
          <Card className="border-2 border-violet-300">
            <CardHeader className="bg-violet-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-violet-600" />
                    Trustees ({trustees.length})
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">All trustees must be verified (can be individuals or companies)</p>
                </div>
                <Button type="button" onClick={addTrustee} size="sm" className="bg-violet-600 hover:bg-violet-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Trustee
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {trustees.length === 0 && (
                <p className="text-center text-gray-500 py-4">No trustees added yet. Click "Add Trustee" to begin.</p>
              )}
              {trustees.map((trustee, idx) => (
                <div key={idx} className="p-4 bg-violet-50 rounded-lg border-2 border-violet-200 relative">
                  <button
                    type="button"
                    onClick={() => removeTrustee(idx)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="space-y-4 pr-8">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Trustee Type *</Label>
                        <select
                          value={trustee.type}
                          onChange={(e) => updateTrustee(idx, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
                        >
                          <option value="individual">Individual Trustee</option>
                          <option value="company">Corporate Trustee</option>
                        </select>
                      </div>
                      <div>
                        <Label>Name *</Label>
                        <Input
                          value={trustee.name}
                          onChange={(e) => updateTrustee(idx, 'name', e.target.value)}
                          placeholder={trustee.type === 'individual' ? 'John Smith' : 'Trustee Company Pty Ltd'}
                        />
                      </div>
                      {trustee.type === 'company' && (
                        <div>
                          <Label>ABN/ACN</Label>
                          <Input
                            value={trustee.abn || ''}
                            onChange={(e) => updateTrustee(idx, 'abn', e.target.value)}
                            placeholder="12 345 678 901"
                          />
                        </div>
                      )}
                    </div>

                    {/* Corporate Trustee Directors */}
                    {trustee.type === 'company' && (
                      <div className="mt-4 p-4 bg-white rounded border border-violet-300">
                        <div className="flex items-center justify-between mb-3">
                          <Label className="text-sm font-bold">Directors of Corporate Trustee</Label>
                          <Button
                            type="button"
                            onClick={() => addTrusteeDirector(idx)}
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Director
                          </Button>
                        </div>
                        {(!trustee.directors || trustee.directors.length === 0) && (
                          <p className="text-xs text-gray-500 text-center py-2">No directors added</p>
                        )}
                        {trustee.directors && trustee.directors.map((director, didx) => (
                          <div key={didx} className="grid md:grid-cols-2 gap-2 mb-2 p-2 bg-blue-50 rounded relative">
                            <button
                              type="button"
                              onClick={() => removeTrusteeDirector(idx, didx)}
                              className="absolute top-1 right-1 text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                            <div>
                              <Input
                                value={director.name}
                                onChange={(e) => updateTrusteeDirector(idx, didx, 'name', e.target.value)}
                                placeholder="Director Name"
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <Input
                                value={director.position}
                                onChange={(e) => updateTrusteeDirector(idx, didx, 'position', e.target.value)}
                                placeholder="Position"
                                className="text-sm"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}

      {/* Guarantors (for all entity types) */}
      <Card className="border-2 border-teal-300">
        <CardHeader className="bg-teal-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                Guarantors ({guarantors.length})
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">Add any guarantors (optional - can be individuals or companies)</p>
            </div>
            <Button type="button" onClick={addGuarantor} size="sm" className="bg-teal-600 hover:bg-teal-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Guarantor
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {guarantors.length === 0 && (
            <p className="text-center text-gray-500 py-4">No guarantors added. Click "Add Guarantor" if required.</p>
          )}
          {guarantors.map((guarantor, idx) => (
            <div key={idx} className="p-4 bg-teal-50 rounded-lg border-2 border-teal-200 relative">
              <button
                type="button"
                onClick={() => removeGuarantor(idx)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="space-y-4 pr-8">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Guarantor Type *</Label>
                    <select
                      value={guarantor.type}
                      onChange={(e) => updateGuarantor(idx, 'type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    >
                      <option value="individual">Individual</option>
                      <option value="company">Company</option>
                    </select>
                  </div>
                  <div>
                    <Label>Name *</Label>
                    <Input
                      value={guarantor.name}
                      onChange={(e) => updateGuarantor(idx, 'name', e.target.value)}
                      placeholder={guarantor.type === 'individual' ? 'Sarah Johnson' : 'Guarantor Company Pty Ltd'}
                    />
                  </div>
                  {guarantor.type === 'individual' && (
                    <>
                      <div>
                        <Label>Date of Birth *</Label>
                        <Input
                          type="date"
                          value={guarantor.dob || ''}
                          onChange={(e) => updateGuarantor(idx, 'dob', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          value={guarantor.email || ''}
                          onChange={(e) => updateGuarantor(idx, 'email', e.target.value)}
                          placeholder="sarah@example.com"
                        />
                      </div>
                      <div>
                        <Label>Phone *</Label>
                        <Input
                          type="tel"
                          value={guarantor.phone || ''}
                          onChange={(e) => updateGuarantor(idx, 'phone', e.target.value)}
                          placeholder="0400 000 000"
                        />
                      </div>
                    </>
                  )}
                  {guarantor.type === 'company' && (
                    <div>
                      <Label>ABN/ACN *</Label>
                      <Input
                        value={guarantor.abn || ''}
                        onChange={(e) => updateGuarantor(idx, 'abn', e.target.value)}
                        placeholder="12 345 678 901"
                      />
                    </div>
                  )}
                </div>

                {/* Company Guarantor Directors */}
                {guarantor.type === 'company' && (
                  <div className="mt-4 p-4 bg-white rounded border border-teal-300">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-bold">Directors</Label>
                      <Button
                        type="button"
                        onClick={() => addGuarantorDirector(idx)}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Director
                      </Button>
                    </div>
                    {(!guarantor.directors || guarantor.directors.length === 0) && (
                      <p className="text-xs text-gray-500 text-center py-2">No directors added</p>
                    )}
                    {guarantor.directors && guarantor.directors.map((director, didx) => (
                      <div key={didx} className="grid md:grid-cols-2 gap-2 mb-2 p-2 bg-blue-50 rounded relative">
                        <button
                          type="button"
                          onClick={() => removeGuarantorDirector(idx, didx)}
                          className="absolute top-1 right-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <div>
                          <Input
                            value={director.name}
                            onChange={(e) => updateGuarantorDirector(idx, didx, 'name', e.target.value)}
                            placeholder="Director Name"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Input
                            value={director.position}
                            onChange={(e) => updateGuarantorDirector(idx, didx, 'position', e.target.value)}
                            placeholder="Position"
                            className="text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
