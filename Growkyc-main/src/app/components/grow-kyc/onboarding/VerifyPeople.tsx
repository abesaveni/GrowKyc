import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import {
  Shield,
  Upload,
  Camera,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  FileText,
  HelpCircle
} from 'lucide-react';
import { Progress } from '../../ui/progress';
import { toast } from '../../../lib/toast';

interface VerifyPeopleProps {
  entity: any;
  onComplete: (data: any) => void;
}

export function VerifyPeople({ entity, onComplete }: VerifyPeopleProps) {
  const people = entity.data.people || [];
  const [verificationStatus, setVerificationStatus] = useState<{[key: string]: 'pending' | 'verified' | 'reviewing'}>(
    people.reduce((acc: any, p: any) => ({ ...acc, [p.id]: 'pending' }), {})
  );

  const handleVerify = (personId: string) => {
    // Simulate verification process
    setVerificationStatus({ ...verificationStatus, [personId]: 'reviewing' });
    
    setTimeout(() => {
      setVerificationStatus({ ...verificationStatus, [personId]: 'verified' });
      toast.success('Identity verified!', { description: 'Document processing complete' });
    }, 2000);
  };

  const allVerified = Object.values(verificationStatus).every(status => status === 'verified');
  const verifiedCount = Object.values(verificationStatus).filter(status => status === 'verified').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle>Verify People</CardTitle>
            <CardDescription>
              Upload ID documents for each person
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Verification Progress</span>
              <span className="text-sm font-bold text-blue-600">{verifiedCount} / {people.length}</span>
            </div>
            <Progress value={(verifiedCount / people.length) * 100} />
          </CardContent>
        </Card>

        {/* People Cards */}
        {people.map((person: any) => {
          const status = verificationStatus[person.id];
          return (
            <Card key={person.id} className={
              status === 'verified' ? 'border-green-500 bg-green-50' :
              status === 'reviewing' ? 'border-blue-500 bg-blue-50' :
              'border-gray-300'
            }>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      status === 'verified' ? 'bg-green-500' :
                      status === 'reviewing' ? 'bg-blue-500' :
                      'bg-gray-300'
                    }`}>
                      {status === 'verified' ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : status === 'reviewing' ? (
                        <Clock className="w-6 h-6 text-white animate-spin" />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{person.name}</h3>
                      <p className="text-sm text-gray-600">{person.role}</p>
                    </div>
                  </div>
                  <Badge className={
                    status === 'verified' ? 'bg-green-500' :
                    status === 'reviewing' ? 'bg-blue-500' :
                    'bg-gray-500'
                  }>
                    {status === 'verified' ? 'Verified' :
                     status === 'reviewing' ? 'Processing' :
                     'ID Required'}
                  </Badge>
                </div>

                {status === 'pending' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4 text-center" onClick={() => handleVerify(person.id)}>
                          <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-xs font-medium text-gray-900">Driver License</p>
                        </CardContent>
                      </Card>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4 text-center" onClick={() => handleVerify(person.id)}>
                          <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-xs font-medium text-gray-900">Passport</p>
                        </CardContent>
                      </Card>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4 text-center" onClick={() => handleVerify(person.id)}>
                          <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-xs font-medium text-gray-900">Upload File</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {status === 'reviewing' && (
                  <div className="text-center py-4">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2 animate-spin" />
                    <p className="text-sm text-gray-700">Verifying document...</p>
                  </div>
                )}

                {status === 'verified' && (
                  <div className="bg-green-100 rounded-lg p-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-900 font-medium">Identity verified successfully</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        <div className="flex gap-3 pt-4">
          <Button
            className="flex-1"
            size="lg"
            onClick={() => onComplete({ verifications: verificationStatus })}
            disabled={!allVerified}
          >
            {allVerified ? 'Continue to Business Profile' : `Verify ${people.length - verifiedCount} more`}
            <CheckCircle className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
