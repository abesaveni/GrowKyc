import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import {
  Shield,
  CheckCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Download,
  Upload,
  Camera,
  User,
  AlertTriangle,
  Eye,
  FileText,
  CreditCard,
  XCircle,
  ChevronRight,
  Scan
} from 'lucide-react';

type ViewMode = 'dashboard' | 'new-verification' | 'review-workbench' | 'identity-profile';

interface IdentityBotProps {
  onBack?: () => void;
}

export function IdentityBot({ onBack }: IdentityBotProps) {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');

  if (currentView === 'dashboard') {
    return <IdentityControlCentre onNavigate={setCurrentView} onBack={onBack} />;
  }

  if (currentView === 'new-verification') {
    return <IdentityVerificationFlow onBack={() => setCurrentView('dashboard')} />;
  }

  return <IdentityControlCentre onNavigate={setCurrentView} onBack={onBack} />;
}

// Screen 1: Identity Control Centre
function IdentityControlCentre({ onNavigate, onBack }: { onNavigate: (view: ViewMode) => void; onBack?: () => void }) {
  return (
    <div className="min-h-screen bg-[#0a0e17]">
      <div className="bg-[#0d121d] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          {onBack && (
            <Button onClick={onBack} variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Grow Compliance OS
            </Button>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Scan className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">AI Identity Verification Bot</h1>
                  <p className="text-slate-300">Document OCR • Biometric matching • Liveness detection</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button onClick={() => onNavigate('new-verification')} className="bg-[#13B5EA] hover:bg-[#0E7C9E]">
                <Camera className="w-4 h-4 mr-2" />
                Start Verification
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Results
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="border-2 hover:border-blue-400 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <Badge className="bg-blue-100 text-blue-700">23</Badge>
              </div>
              <p className="text-sm font-medium text-white">Pending Verifications</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-green-400 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <Badge className="bg-green-100 text-green-700">187</Badge>
              </div>
              <p className="text-sm font-medium text-white">Completed Today</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-red-400 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <Badge className="bg-red-100 text-red-700">8</Badge>
              </div>
              <p className="text-sm font-medium text-white">Failed</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-amber-400 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-5 h-5 text-amber-600" />
                <Badge className="bg-amber-100 text-amber-700">14</Badge>
              </div>
              <p className="text-sm font-medium text-white">Manual Reviews</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-purple-400 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-5 h-5 text-purple-600" />
                <Badge className="bg-purple-100 text-purple-700">3</Badge>
              </div>
              <p className="text-sm font-medium text-white">Duplicate Alerts</p>
            </CardContent>
          </Card>
        </div>

        {/* Queue Tables */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Active Verifications */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Active Verifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#0a0e17] border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Document</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Match %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { name: 'Emma Wilson', doc: 'Passport', status: 'Verified', match: 98 },
                      { name: 'James Chen', doc: 'Driver Licence', status: 'Processing', match: null },
                      { name: 'Sofia Rodriguez', doc: 'Passport', status: 'Review Required', match: 72 },
                      { name: 'Michael Brown', doc: 'Driver Licence', status: 'Verified', match: 96 },
                    ].map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/5 cursor-pointer">
                        <td className="px-4 py-3 font-medium text-white">{item.name}</td>
                        <td className="px-4 py-3 text-xs text-slate-300">{item.doc}</td>
                        <td className="px-4 py-3">
                          <Badge className={
                            item.status === 'Verified' ? 'bg-green-100 text-green-700' :
                            item.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }>
                            {item.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          {item.match !== null ? (
                            <span className={`font-semibold ${item.match >= 90 ? 'text-green-600' : item.match >= 75 ? 'text-amber-600' : 'text-red-600'}`}>
                              {item.match}%
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">Pending</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t bg-[#0a0e17]">
                <Button variant="ghost" className="w-full text-blue-700 hover:bg-blue-50" onClick={() => onNavigate('new-verification')}>
                  View All Verifications <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Failed Attempts */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b">
              <CardTitle className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                Failed Attempts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#0a0e17] border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Reason</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Attempts</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { name: 'David Kim', reason: 'Expired ID', attempts: 1 },
                      { name: 'Lisa Martinez', reason: 'Name Mismatch', attempts: 2 },
                      { name: 'Robert Taylor', reason: 'Low Face Match', attempts: 1 },
                      { name: 'Anna Kowalski', reason: 'Suspicious Document', attempts: 3 },
                    ].map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/5 cursor-pointer">
                        <td className="px-4 py-3 font-medium text-white">{item.name}</td>
                        <td className="px-4 py-3 text-xs text-red-700">{item.reason}</td>
                        <td className="px-4 py-3 text-xs text-slate-300">{item.attempts}</td>
                        <td className="px-4 py-3">
                          <Button size="sm" variant="outline" className="text-xs">
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t bg-[#0a0e17]">
                <Button variant="ghost" className="w-full text-red-700 hover:bg-red-50">
                  View All Failed <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="border-2">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-xs text-slate-300 mb-1">Document Types</p>
              <p className="text-2xl font-bold text-white mb-2">3</p>
              <p className="text-xs text-slate-400">Passport, Licence, ID</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-xs text-slate-300 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-green-600 mb-2">94.2%</p>
              <p className="text-xs text-slate-400">Last 30 days</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Scan className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-xs text-slate-300 mb-1">Avg Match Score</p>
              <p className="text-2xl font-bold text-purple-600 mb-2">96.7%</p>
              <p className="text-xs text-slate-400">Biometric accuracy</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <p className="text-xs text-slate-300 mb-1">Avg Processing</p>
              <p className="text-2xl font-bold text-amber-600 mb-2">8.4s</p>
              <p className="text-xs text-slate-400">Per verification</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Screen 2: Identity Verification Flow
function IdentityVerificationFlow({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [documentType, setDocumentType] = useState<'passport' | 'licence' | 'other'>('passport');
  const [processing, setProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const processVerification = () => {
    setProcessing(true);
    setTimeout(() => {
      setVerificationResult({
        faceMatch: 98,
        documentValid: true,
        expiryValid: true,
        dataExtracted: true,
        livenessPass: true
      });
      setProcessing(false);
      setStep(4);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0a0e17]">
      <div className="bg-[#0d121d] border-b border-white/10">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Scan className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Identity Verification Flow</h1>
              <p className="text-slate-300">Document capture • Biometric matching • Real-time validation</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6 flex items-center justify-between max-w-xl">
            {[
              { num: 1, label: 'Document Upload' },
              { num: 2, label: 'Selfie Capture' },
              { num: 3, label: 'Processing' },
              { num: 4, label: 'Results' },
              { num: 5, label: 'Review' }
            ].map((s) => (
              <div key={s.num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= s.num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-slate-300'
                }`}>
                  {s.num}
                </div>
                <div className="ml-2">
                  <p className={`text-xs font-medium ${step >= s.num ? 'text-blue-600' : 'text-slate-400'}`}>
                    {s.label}
                  </p>
                </div>
                {s.num < 5 && <div className={`mx-2 w-8 h-0.5 ${step > s.num ? 'bg-blue-600' : 'bg-gray-300'}`}></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Step 1: Document Upload */}
        {step === 1 && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Step 1: Document Upload</CardTitle>
              <CardDescription>Upload a government-issued ID document</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Select Document Type *</Label>
                <div className="grid md:grid-cols-3 gap-4 mt-3">
                  {[
                    { value: 'passport', label: 'Passport', icon: FileText },
                    { value: 'licence', label: 'Driver Licence', icon: CreditCard },
                    { value: 'other', label: 'Other ID', icon: Shield }
                  ].map((doc) => {
                    const Icon = doc.icon;
                    return (
                      <label 
                        key={doc.value}
                        className={`flex flex-col items-center gap-3 p-6 border-2 rounded-lg cursor-pointer hover:border-blue-400 ${
                          documentType === doc.value ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="docType"
                          value={doc.value}
                          checked={documentType === doc.value as any}
                          onChange={(e) => setDocumentType(e.target.value as any)}
                          className="sr-only"
                        />
                        <Icon className="w-12 h-12 text-blue-600" />
                        <span className="font-medium text-white">{doc.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 cursor-pointer transition-colors">
                <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-white mb-2">Upload Document Image</p>
                <p className="text-sm text-slate-300 mb-4">
                  Drag and drop or click to browse
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
                <p className="text-xs text-slate-400 mt-4">
                  Supported: JPG, PNG, PDF • Max size: 10MB
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Document Requirements</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Clear, well-lit image of document</li>
                  <li>• All text and details must be readable</li>
                  <li>• Document must not be expired</li>
                  <li>• No glare or shadows obscuring information</li>
                </ul>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button variant="outline" onClick={onBack}>Cancel</Button>
                <Button onClick={() => setStep(2)} className="bg-blue-600 hover:bg-blue-700">
                  Next: Selfie Capture <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Selfie Capture */}
        {step === 2 && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Step 2: Selfie Capture</CardTitle>
              <CardDescription>Take a live selfie for biometric matching</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-80 border-4 border-blue-500 rounded-full opacity-50"></div>
                </div>
                <Camera className="w-24 h-24 text-white opacity-50" />
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <p className="text-white text-sm mb-3">Position your face within the oval</p>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Camera className="w-5 h-5 mr-2" />
                    Capture Selfie
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="font-semibold text-green-900">Liveness Detection</p>
                  </div>
                  <p className="text-sm text-green-700">Active - Ready</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="font-semibold text-green-900">Anti-Spoofing</p>
                  </div>
                  <p className="text-sm text-green-700">Enabled</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="font-semibold text-green-900">Face Detection</p>
                  </div>
                  <p className="text-sm text-green-700">Active</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-900 mb-2">Selfie Tips</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Look directly at the camera</li>
                  <li>• Ensure good lighting on your face</li>
                  <li>• Remove glasses and face coverings</li>
                  <li>• Keep a neutral expression</li>
                </ul>
              </div>

              <div className="flex justify-between gap-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={() => setStep(3)} className="bg-blue-600 hover:bg-blue-700">
                  Continue to Processing <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Processing */}
        {step === 3 && (
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
              <CardTitle>Step 3: AI Processing</CardTitle>
              <CardDescription>Verifying document and biometric data</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <Scan className="w-10 h-10 text-blue-600" />
                </div>

                <div className="space-y-4 max-w-md mx-auto">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300">OCR Extraction</span>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300">Document Validation</span>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300">Biometric Face Match</span>
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300">Liveness Verification</span>
                      <Clock className="w-5 h-5 text-slate-400" />
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                </div>

                <Button onClick={processVerification} className="bg-green-600 hover:bg-green-700">
                  Complete Verification
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Results */}
        {step === 4 && verificationResult && (
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Step 4: Verification Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="p-6 bg-green-50 border-2 border-green-400 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-900">IDENTITY VERIFIED</p>
                      <p className="text-sm text-green-700">All checks passed successfully</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-green-600">98%</p>
                    <p className="text-xs text-green-700">Match Score</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-white">Biometric Face Match</p>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">98%</p>
                    <p className="text-xs text-slate-300 mt-1">Very High Confidence</p>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-white">Document Validity</p>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-lg font-bold text-green-600">VALID</p>
                    <p className="text-xs text-slate-300 mt-1">Authentic document detected</p>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-white">Expiry Status</p>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-lg font-bold text-green-600">CURRENT</p>
                    <p className="text-xs text-slate-300 mt-1">Expires: 2028-06-15</p>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-white">Liveness Check</p>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-lg font-bold text-green-600">PASSED</p>
                    <p className="text-xs text-slate-300 mt-1">Live capture confirmed</p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Extracted Data</h4>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-300">Full Name</p>
                    <p className="font-semibold text-white">Emma Louise Wilson</p>
                  </div>
                  <div>
                    <p className="text-slate-300">Date of Birth</p>
                    <p className="font-semibold text-white">1990-03-15</p>
                  </div>
                  <div>
                    <p className="text-slate-300">Document Number</p>
                    <p className="font-semibold text-white">N2847563</p>
                  </div>
                  <div>
                    <p className="text-slate-300">Nationality</p>
                    <p className="font-semibold text-white">Australian</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Verify Another Person
                </Button>
                <Button onClick={() => setStep(5)} className="bg-blue-600 hover:bg-blue-700">
                  Proceed to Review <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Analyst Review */}
        {step === 5 && (
          <Card className="border-2 border-green-400">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">Identity Verification Complete</h2>
              <p className="text-slate-300 mb-8">Emma Louise Wilson - VERIFIED</p>

              <div className="max-w-2xl mx-auto space-y-4 mb-8">
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="p-4 bg-[#0a0e17] rounded-lg">
                    <p className="text-xs text-slate-300">Verification Status</p>
                    <p className="font-semibold text-green-600">APPROVED</p>
                  </div>
                  <div className="p-4 bg-[#0a0e17] rounded-lg">
                    <p className="text-xs text-slate-300">Face Match Score</p>
                    <p className="font-semibold text-white">98%</p>
                  </div>
                  <div className="p-4 bg-[#0a0e17] rounded-lg">
                    <p className="text-xs text-slate-300">Verification Date</p>
                    <p className="font-semibold text-white">{new Date().toLocaleDateString('en-AU')}</p>
                  </div>
                  <div className="p-4 bg-[#0a0e17] rounded-lg">
                    <p className="text-xs text-slate-300">Document Type</p>
                    <p className="font-semibold text-white">Passport</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700">
                  Return to Dashboard
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Certificate
                </Button>
                <Button variant="outline" onClick={() => setStep(1)}>
                  Verify Another
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
