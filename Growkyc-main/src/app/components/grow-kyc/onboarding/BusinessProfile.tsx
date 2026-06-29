import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Briefcase, CheckCircle, HelpCircle, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Switch } from '../../ui/switch';
import { Badge } from '../../ui/badge';
import { toast } from '../../../lib/toast';

interface BusinessProfileProps {
  entity: any;
  onComplete: (data: any) => void;
}

export function BusinessProfile({ entity, onComplete }: BusinessProfileProps) {
  const [formData, setFormData] = useState({
    industry: entity.data.industry || '',
    turnover: entity.data.turnover || '',
    countries: entity.data.countries || ['Australia'],
    cashHandling: entity.data.cashHandling || false,
    cryptoExposure: entity.data.cryptoExposure || false,
    crossBorder: entity.data.crossBorder || false,
  });
  const [riskScore, setRiskScore] = useState(10);

  const calculateRisk = (data: typeof formData) => {
    let score = 10;
    if (data.cashHandling) score += 20;
    if (data.cryptoExposure) score += 25;
    if (data.crossBorder) score += 15;
    if (data.countries.length > 1) score += 10;
    return Math.min(score, 100);
  };

  const handleChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    setRiskScore(calculateRisk(newData));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle>Understand Your Business</CardTitle>
            <CardDescription>Help us assess your compliance requirements</CardDescription>
          </div>
          <Card className="border-2">
            <CardContent className="p-3 text-center">
              <TrendingUp className={`w-6 h-6 mx-auto mb-1 ${
                riskScore < 30 ? 'text-green-400' :
                riskScore < 60 ? 'text-amber-400' :
                'text-red-400'
              }`} />
              <div className="text-xs text-slate-300">Risk Score</div>
              <div className={`text-lg font-bold ${
                riskScore < 30 ? 'text-green-400' :
                riskScore < 60 ? 'text-amber-400' :
                'text-red-400'
              }`}>{riskScore}</div>
            </CardContent>
          </Card>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Industry *</Label>
          <Select value={formData.industry} onValueChange={(v) => handleChange('industry', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="accounting">Accounting & Bookkeeping</SelectItem>
              <SelectItem value="legal">Legal Services</SelectItem>
              <SelectItem value="financial">Financial Services</SelectItem>
              <SelectItem value="realestate">Real Estate</SelectItem>
              <SelectItem value="consulting">Consulting</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Expected Annual Turnover</Label>
          <Select value={formData.turnover} onValueChange={(v) => handleChange('turnover', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-100k">$0 - $100,000</SelectItem>
              <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
              <SelectItem value="500k-1m">$500,000 - $1M</SelectItem>
              <SelectItem value="1m-5m">$1M - $5M</SelectItem>
              <SelectItem value="5m+">$5M+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="border-2">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="text-base font-semibold">Cash Handling</Label>
                <p className="text-sm text-slate-300">Do you handle significant cash transactions?</p>
              </div>
              <Switch
                checked={formData.cashHandling}
                onCheckedChange={(v) => handleChange('cashHandling', v)}
              />
            </div>
            {formData.cashHandling && (
              <Card className="bg-amber-500/10 border-amber-500/30">
                <CardContent className="p-3 text-sm text-amber-300">
                  Additional verification may be required due to higher risk profile.
                </CardContent>
              </Card>
            )}

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="text-base font-semibold">Cryptocurrency Exposure</Label>
                <p className="text-sm text-slate-300">Do you deal with cryptocurrency?</p>
              </div>
              <Switch
                checked={formData.cryptoExposure}
                onCheckedChange={(v) => handleChange('cryptoExposure', v)}
              />
            </div>
            {formData.cryptoExposure && (
              <Card className="bg-amber-500/10 border-amber-500/30">
                <CardContent className="p-3 text-sm text-amber-300">
                  Enhanced due diligence applies to cryptocurrency activities.
                </CardContent>
              </Card>
            )}

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="text-base font-semibold">Cross-Border Transactions</Label>
                <p className="text-sm text-slate-300">Do you conduct international business?</p>
              </div>
              <Switch
                checked={formData.crossBorder}
                onCheckedChange={(v) => handleChange('crossBorder', v)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 pt-4">
          <Button className="flex-1" size="lg" onClick={() => onComplete(formData)} disabled={!formData.industry}>
            Continue to Consent
            <CheckCircle className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
