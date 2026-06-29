import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import {
  CheckCircle,
  Send,
  AlertCircle,
  Building2,
  Users,
  Shield,
  Briefcase,
  FileText,
  Crown,
  Award
} from 'lucide-react';
import { toast } from '../../../lib/toast';

interface FinalReviewProps {
  entity: any;
  onComplete: () => void;
}

export function FinalReview({ entity, onComplete }: FinalReviewProps) {
  const handleSubmit = () => {
    toast.success('Submitted for compliance review!', {
      description: 'You\'ll receive an update within 24-48 hours'
    });
    onComplete();
  };

  const completionItems = [
    { label: 'Entity Structure', complete: !!entity.data.name, icon: Building2 },
    { label: 'Ownership', complete: !!entity.data.people?.length, icon: Users },
    { label: 'People Verified', complete: !!entity.data.verifications, icon: Shield },
    { label: 'Business Profile', complete: !!entity.data.industry, icon: Briefcase },
    { label: 'Consents', complete: !!entity.data.consents, icon: FileText },
  ];

  const allComplete = completionItems.every(item => item.complete);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>Final Review & Submit</CardTitle>
            <CardDescription>Review your application before submitting</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Card */}
        <Card className="bg-gray-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4">{entity.data.name}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Entity Type:</span>
                <p className="font-semibold text-gray-900 capitalize">{entity.type.replace('_', ' ')}</p>
              </div>
              <div>
                <span className="text-gray-600">People:</span>
                <p className="font-semibold text-gray-900">{entity.data.people?.length || 0} individuals</p>
              </div>
              <div>
                <span className="text-gray-600">Industry:</span>
                <p className="font-semibold text-gray-900 capitalize">{entity.data.industry || 'N/A'}</p>
              </div>
              <div>
                <span className="text-gray-600">Risk Level:</span>
                <Badge className={
                  entity.riskLevel === 'high' ? 'bg-red-500' :
                  entity.riskLevel === 'medium' ? 'bg-amber-500' :
                  'bg-green-500'
                }>
                  {entity.riskLevel?.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completion Checklist */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Completion Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {completionItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    item.complete ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.complete ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {item.complete ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <Icon className={`w-5 h-5 ${
                    item.complete ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <span className={`font-medium ${
                    item.complete ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {item.label}
                  </span>
                  {!item.complete && (
                    <Badge className="ml-auto bg-red-500">Required</Badge>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* What Happens Next */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-gray-900 mb-3">What happens next?</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs flex-shrink-0">1</div>
                <p>We'll run automated compliance checks (sanctions, PEP, adverse media)</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs flex-shrink-0">2</div>
                <p>Our compliance team will review your application</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs flex-shrink-0">3</div>
                <p>You'll receive an update within 24-48 hours</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs flex-shrink-0">4</div>
                <p>If approved, you'll gain full platform access</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {allComplete && (
          <Card className="bg-gray-50 border-green-200 animate-in fade-in slide-in-from-bottom-4">
            <CardContent className="p-6 text-center">
              <Award className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold text-green-900 text-xl mb-2">Ready to Submit! 🎉</h3>
              <p className="text-green-800">
                Your application is complete and ready for compliance review.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            className="flex-1"
            size="lg"
            onClick={handleSubmit}
            disabled={!allComplete}
          >
            Submit for Review
            <Send className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
