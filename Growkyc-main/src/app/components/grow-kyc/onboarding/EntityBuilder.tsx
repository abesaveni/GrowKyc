import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import {
  Building2,
  Shield,
  UserCircle,
  Briefcase,
  Search,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { toast } from '../../../lib/toast';

interface EntityBuilderProps {
  entity: any;
  onComplete: (data: any) => void;
}

export function EntityBuilder({ entity, onComplete }: EntityBuilderProps) {
  const [formData, setFormData] = useState({
    name: entity.data.name || '',
    acn: entity.data.acn || '',
    abn: entity.data.abn || '',
    trustType: entity.data.trustType || '',
    trusteeType: entity.data.trusteeType || '',
    dob: entity.data.dob || '',
    ...entity.data
  });
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [asicData, setAsicData] = useState<any>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const handleASICLookup = async () => {
    if (!formData.acn || formData.acn.length < 9) {
      toast.error('Please enter a valid ACN');
      return;
    }

    setIsLookingUp(true);
    
    // Simulate ASIC lookup
    setTimeout(() => {
      const mockData = {
        companyName: 'ALPHA HOLDINGS PTY LTD',
        acn: formData.acn,
        abn: '12 345 678 901',
        registeredDate: '2015-03-15',
        status: 'Registered',
        type: 'Australian Proprietary Company',
        state: 'VIC',
        registeredAddress: '123 Collins Street, Melbourne VIC 3000'
      };
      
      setAsicData(mockData);
      setFormData({
        ...formData,
        name: mockData.companyName,
        abn: mockData.abn,
        registeredAddress: mockData.registeredAddress
      });
      setIsLookingUp(false);
      toast.success('ASIC data retrieved successfully!');
    }, 1500);
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.name) {
      toast.error('Please enter a name');
      return;
    }

    if (entity.type === 'company' && !formData.acn) {
      toast.error('Please enter an ACN');
      return;
    }

    onComplete(formData);
  };

  const renderCompanyFields = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="acn">Australian Company Number (ACN) *</Label>
          <button
            type="button"
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
            onClick={() => setShowTooltip(showTooltip === 'acn' ? null : 'acn')}
          >
            <HelpCircle className="w-4 h-4" />
            Why do we need this?
          </button>
        </div>
        {showTooltip === 'acn' && (
          <Card className="bg-blue-500/10 border-blue-500/30 animate-in fade-in slide-in-from-top-2">
            <CardContent className="p-3 text-sm text-blue-300">
              We use your ACN to verify your company details with ASIC and ensure accurate record-keeping.
            </CardContent>
          </Card>
        )}
        <div className="flex gap-2">
          <Input
            id="acn"
            value={formData.acn}
            onChange={(e) => setFormData({ ...formData, acn: e.target.value })}
            placeholder="123 456 789"
            maxLength={11}
          />
          <Button
            type="button"
            onClick={handleASICLookup}
            disabled={isLookingUp}
          >
            {isLookingUp ? (
              <>
                <Search className="w-4 h-4 mr-2 animate-spin" />
                Looking up...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                ASIC Lookup
              </>
            )}
          </Button>
        </div>
      </div>

      {asicData && (
        <Card className="bg-green-500/10 border-green-500/30 animate-in fade-in slide-in-from-top-4">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <CardTitle className="text-green-300">ASIC Data Retrieved</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-300">Status:</span>
              <Badge className="bg-green-500">{asicData.status}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Type:</span>
              <span className="font-medium text-white">{asicData.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Registered:</span>
              <span className="font-medium text-white">{asicData.registeredDate}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name *</Label>
        <Input
          id="companyName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter company name"
          disabled={!!asicData}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="abn">Australian Business Number (ABN)</Label>
        <Input
          id="abn"
          value={formData.abn}
          onChange={(e) => setFormData({ ...formData, abn: e.target.value })}
          placeholder="12 345 678 901"
          disabled={!!asicData}
        />
      </div>
    </div>
  );

  const renderTrustFields = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="trustName">Trust Name *</Label>
        <Input
          id="trustName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter trust name"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="trustType">Trust Type *</Label>
          <button
            type="button"
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
            onClick={() => setShowTooltip(showTooltip === 'trustType' ? null : 'trustType')}
          >
            <HelpCircle className="w-4 h-4" />
            Why do we need this?
          </button>
        </div>
        {showTooltip === 'trustType' && (
          <Card className="bg-blue-500/10 border-blue-500/30 animate-in fade-in slide-in-from-top-2">
            <CardContent className="p-3 text-sm text-blue-300">
              Different trust types have different compliance requirements. This helps us apply the correct rules.
            </CardContent>
          </Card>
        )}
        <Select
          value={formData.trustType}
          onValueChange={(value) => setFormData({ ...formData, trustType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select trust type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="discretionary">Discretionary Trust</SelectItem>
            <SelectItem value="unit">Unit Trust</SelectItem>
            <SelectItem value="hybrid">Hybrid Trust</SelectItem>
            <SelectItem value="fixed">Fixed Trust</SelectItem>
            <SelectItem value="charitable">Charitable Trust</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="trusteeType">Trustee Type *</Label>
        <Select
          value={formData.trusteeType}
          onValueChange={(value) => setFormData({ ...formData, trusteeType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select trustee type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="corporate">Corporate Trustee</SelectItem>
            <SelectItem value="individual">Individual Trustee(s)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.trusteeType === 'corporate' && (
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-300">
              <p className="font-semibold mb-1">Additional verification required</p>
              <p>You'll need to provide the corporate trustee's details in the next stage.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderIndividualFields = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Legal Name *</Label>
        <Input
          id="fullName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter full name as it appears on ID"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dob">Date of Birth *</Label>
        <Input
          id="dob"
          type="date"
          value={formData.dob}
          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="your@email.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mobile">Mobile Number *</Label>
        <Input
          id="mobile"
          type="tel"
          value={formData.mobile}
          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          placeholder="04XX XXX XXX"
        />
      </div>
    </div>
  );

  const renderSoleTraderFields = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="tradingName">Trading Name *</Label>
        <Input
          id="tradingName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Your business trading name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="abn">ABN *</Label>
        <Input
          id="abn"
          value={formData.abn}
          onChange={(e) => setFormData({ ...formData, abn: e.target.value })}
          placeholder="12 345 678 901"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ownerName">Your Full Name *</Label>
        <Input
          id="ownerName"
          value={formData.ownerName}
          onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
          placeholder="Enter your full legal name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dob">Date of Birth *</Label>
        <Input
          id="dob"
          type="date"
          value={formData.dob}
          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
        />
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            {entity.type === 'company' && <Building2 className="w-6 h-6 text-white" />}
            {entity.type === 'trust' && <Shield className="w-6 h-6 text-white" />}
            {entity.type === 'individual' && <UserCircle className="w-6 h-6 text-white" />}
            {entity.type === 'sole_trader' && <Briefcase className="w-6 h-6 text-white" />}
          </div>
          <div>
            <CardTitle>Build Your Structure</CardTitle>
            <CardDescription>
              Let's start with the basics. We'll auto-fill what we can.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {entity.type === 'company' && renderCompanyFields()}
        {entity.type === 'trust' && renderTrustFields()}
        {entity.type === 'individual' && renderIndividualFields()}
        {entity.type === 'sole_trader' && renderSoleTraderFields()}

        {/* Progress Indicator */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-blue-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-white">You're doing great!</p>
              <p className="text-sm text-slate-300">This is just the first step. We'll guide you through everything.</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 pt-4">
          <Button className="flex-1" size="lg" onClick={handleSubmit}>
            Continue to Ownership
            <CheckCircle className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
