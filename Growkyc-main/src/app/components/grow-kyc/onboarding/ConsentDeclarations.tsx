import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { FileText, CheckCircle, PenTool, AlertCircle } from 'lucide-react';
import { toast } from '../../../lib/toast';

interface ConsentDeclarationsProps {
  entity: any;
  onComplete: (data: any) => void;
}

export function ConsentDeclarations({ entity, onComplete }: ConsentDeclarationsProps) {
  const [consents, setConsents] = useState({
    informationCorrect: false,
    identityVerification: false,
    ongoingMonitoring: false,
    notifyChanges: false,
  });
  const [signature, setSignature] = useState('');

  const allConsented = Object.values(consents).every(v => v) && signature.length > 0;

  const handleSubmit = () => {
    if (!allConsented) {
      toast.error('Please complete all consents and sign');
      return;
    }
    onComplete({ consents, signature, timestamp: new Date().toISOString() });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>Consent & Declarations</CardTitle>
            <CardDescription>Before we proceed, we need your confirmation</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-semibold mb-1">Legal Requirements</p>
                <p>These declarations are required under the AML/CTF Act 2006 and other applicable legislation.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 border rounded-lg hover:bg-white/5 transition-colors">
            <Checkbox
              id="consent1"
              checked={consents.informationCorrect}
              onCheckedChange={(checked) => 
                setConsents({ ...consents, informationCorrect: checked as boolean })
              }
            />
            <label htmlFor="consent1" className="text-sm cursor-pointer flex-1">
              <span className="font-semibold text-white">I confirm the information provided is correct</span>
              <p className="text-slate-300 mt-1">
                I declare that all information provided is true and accurate to the best of my knowledge.
              </p>
            </label>
          </div>

          <div className="flex items-start gap-3 p-4 border rounded-lg hover:bg-white/5 transition-colors">
            <Checkbox
              id="consent2"
              checked={consents.identityVerification}
              onCheckedChange={(checked) => 
                setConsents({ ...consents, identityVerification: checked as boolean })
              }
            />
            <label htmlFor="consent2" className="text-sm cursor-pointer flex-1">
              <span className="font-semibold text-white">I consent to identity verification</span>
              <p className="text-slate-300 mt-1">
                I authorize verification of my identity using third-party verification services.
              </p>
            </label>
          </div>

          <div className="flex items-start gap-3 p-4 border rounded-lg hover:bg-white/5 transition-colors">
            <Checkbox
              id="consent3"
              checked={consents.ongoingMonitoring}
              onCheckedChange={(checked) => 
                setConsents({ ...consents, ongoingMonitoring: checked as boolean })
              }
            />
            <label htmlFor="consent3" className="text-sm cursor-pointer flex-1">
              <span className="font-semibold text-white">I consent to ongoing monitoring</span>
              <p className="text-slate-300 mt-1">
                I understand my profile will be subject to ongoing compliance monitoring.
              </p>
            </label>
          </div>

          <div className="flex items-start gap-3 p-4 border rounded-lg hover:bg-white/5 transition-colors">
            <Checkbox
              id="consent4"
              checked={consents.notifyChanges}
              onCheckedChange={(checked) => 
                setConsents({ ...consents, notifyChanges: checked as boolean })
              }
            />
            <label htmlFor="consent4" className="text-sm cursor-pointer flex-1">
              <span className="font-semibold text-white">I will notify of material changes</span>
              <p className="text-slate-300 mt-1">
                I agree to notify any material changes to the information provided within 30 days.
              </p>
            </label>
          </div>
        </div>

        {/* Digital Signature */}
        <Card className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <PenTool className="w-5 h-5 text-slate-300" />
              <CardTitle className="text-base">Digital Signature</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Type your full name to sign *
              </label>
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Type your full legal name"
                className="w-full px-4 py-3 border-2 border-white/10 rounded-lg focus:border-blue-500 focus:outline-none font-serif text-lg"
              />
              {signature && (
                <Card className="bg-green-500/10 border-green-500/30 mt-3">
                  <CardContent className="p-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-300">
                      Signed on {new Date().toLocaleDateString('en-AU')}
                    </span>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 pt-4">
          <Button
            className="flex-1"
            size="lg"
            onClick={handleSubmit}
            disabled={!allConsented}
          >
            Continue to Review
            <CheckCircle className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
