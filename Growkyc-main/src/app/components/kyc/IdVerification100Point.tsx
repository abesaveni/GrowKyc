import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Upload, 
  FileCheck, 
  AlertCircle, 
  CheckCircle, 
  Shield, 
  X, 
  FileText, 
  Info, 
  XCircle, 
  Check,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { toast } from '../../lib/toast';

// 100-Point ID Matrix
const idDocuments = {
  categoryA: [
    { id: 'au_passport', name: 'Australian Passport (current)', points: 70, photo: true, dob: true, address: false },
    { id: 'foreign_passport', name: 'Foreign Passport (current)', points: 70, photo: true, dob: true, address: false },
    { id: 'au_drivers_licence', name: 'Australian Driver Licence', points: 40, photo: true, dob: true, address: true },
    { id: 'au_proof_age', name: 'Australian Proof of Age Card', points: 40, photo: true, dob: true, address: false },
    { id: 'foreign_national_id', name: 'National ID Card (foreign, govt issued)', points: 40, photo: true, dob: true, address: false }
  ],
  categoryB: [
    { id: 'au_birth_cert', name: 'Australian Birth Certificate', points: 70, photo: false, dob: true, address: false },
    { id: 'au_citizenship', name: 'Australian Citizenship Certificate', points: 70, photo: false, dob: true, address: false },
    { id: 'centrelink_card', name: 'Centrelink Pension Card', points: 40, photo: false, dob: false, address: false },
    { id: 'medicare_card', name: 'Medicare Card', points: 25, photo: false, dob: false, address: false },
    { id: 'utility_bill', name: 'Utility Bill (≤ 3 months)', points: 25, photo: false, dob: false, address: true },
    { id: 'bank_statement', name: 'Bank Statement (≤ 3 months)', points: 25, photo: false, dob: false, address: true },
    { id: 'rates_notice', name: 'Rates Notice', points: 25, photo: false, dob: false, address: true },
    { id: 'credit_card_statement', name: 'Credit Card Statement', points: 25, photo: false, dob: false, address: true },
    { id: 'ato_notice', name: 'ATO Notice of Assessment', points: 25, photo: false, dob: false, address: true }
  ]
};

interface IdVerification100PointProps {
  onComplete?: (data: any) => void;
  onBack?: () => void;
}

export function IdVerification100Point({ onComplete, onBack }: IdVerification100PointProps) {
  const [selectedDocuments, setSelectedDocuments] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File }>({});
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<'A' | 'B'>('A');
  const [docDetails, setDocDetails] = useState({ number: '', expiry: '', issuer: '' });
  const [isDragging, setIsDragging] = useState<string | null>(null);

  // Calculate 100-point total
  const calculatePoints = () => {
    const total = selectedDocuments.reduce((sum, doc) => sum + doc.points, 0);
    const hasCategoryA = selectedDocuments.some(doc => doc.category === 'A');
    const dobVerified = selectedDocuments.some(doc => doc.dob);
    const addressVerified = selectedDocuments.some(doc => doc.address);
    
    return { total, hasCategoryA, dobVerified, addressVerified };
  };

  const addDocument = (doc: any, category: 'A' | 'B', details: any) => {
    const newDoc = {
      ...doc,
      category,
      ...details,
      addedAt: new Date().toISOString()
    };
    
    setSelectedDocuments([...selectedDocuments, newDoc]);
  };

  const removeDocument = (docId: string) => {
    setSelectedDocuments(selectedDocuments.filter(d => d.id !== docId));
    const newFiles = { ...uploadedFiles };
    delete newFiles[docId];
    setUploadedFiles(newFiles);
  };

  const handleFileUpload = (docId: string, file: File) => {
    setUploadedFiles({ ...uploadedFiles, [docId]: file });
    toast.success(`File uploaded: ${file.name}`);
  };

  const handleDragOver = (e: React.DragEvent, docId: string) => {
    e.preventDefault();
    setIsDragging(docId);
  };

  const handleDragLeave = () => {
    setIsDragging(null);
  };

  const handleDrop = (e: React.DragEvent, docId: string) => {
    e.preventDefault();
    setIsDragging(null);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(docId, files[0]);
    }
  };

  const points = calculatePoints();
  const meetsRequirements = points.total >= 100 && points.hasCategoryA && points.dobVerified;
  const requiresAddress = !points.addressVerified;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-100">100-Point ID Verification</h2>

      {/* Official ID Matrix Reference */}
      <Card className="border-2 border-blue-500 bg-blue-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-300">
            <Info className="w-6 h-6" />
            Australian AML/CTF 100-Point ID Matrix
          </CardTitle>
          <CardDescription className="text-blue-300 font-semibold">
            Standard requirements: 100 points total • At least one Category A • Name and DOB verified • Address verified
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-white rounded-lg border-2 border-blue-300 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="text-left p-3 font-bold">Document Type</th>
                  <th className="text-center p-3 font-bold">Category</th>
                  <th className="text-center p-3 font-bold">Points</th>
                  <th className="text-center p-3 font-bold">Photo</th>
                  <th className="text-center p-3 font-bold">Verifies DOB</th>
                  <th className="text-center p-3 font-bold">Verifies Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {/* Category A Documents */}
                {idDocuments.categoryA.map((doc, idx) => (
                  <tr key={doc.id} className={idx % 2 === 0 ? 'bg-blue-500/10' : 'bg-white'}>
                    <td className="p-3 font-semibold text-slate-100">{doc.name}</td>
                    <td className="p-3 text-center">
                      <Badge className="bg-blue-600">A</Badge>
                    </td>
                    <td className="p-3 text-center font-bold text-blue-400">{doc.points}</td>
                    <td className="p-3 text-center">{doc.photo ? '✓ Yes' : '—'}</td>
                    <td className="p-3 text-center">{doc.dob ? '✓ Yes' : '—'}</td>
                    <td className="p-3 text-center">{doc.address ? '✓ Yes' : '✗ No'}</td>
                  </tr>
                ))}
                {/* Category B Documents */}
                {idDocuments.categoryB.map((doc, idx) => (
                  <tr key={doc.id} className={idx % 2 === 0 ? 'bg-purple-500/10' : 'bg-white'}>
                    <td className="p-3 font-semibold text-slate-100">{doc.name}</td>
                    <td className="p-3 text-center">
                      <Badge className="bg-purple-600">B</Badge>
                    </td>
                    <td className="p-3 text-center font-bold text-purple-400">{doc.points}</td>
                    <td className="p-3 text-center">{doc.photo ? '✓ Yes' : '✗ No'}</td>
                    <td className="p-3 text-center">{doc.dob ? '✓ Yes' : '✗ No'}</td>
                    <td className="p-3 text-center">{doc.address ? '✓ Yes' : '✗ No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Standard Combinations */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border-2 border-green-300">
              <p className="font-bold text-green-300 mb-2">✓ Example 1 – Passport Path</p>
              <ul className="text-sm space-y-1 text-slate-300">
                <li>• Passport (70)</li>
                <li>• Medicare Card (25)</li>
                <li>• Utility Bill (25)</li>
              </ul>
              <p className="font-bold text-green-400 mt-2 text-lg">= 120 points</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-green-300">
              <p className="font-bold text-green-300 mb-2">✓ Example 2 – Driver Licence Path</p>
              <ul className="text-sm space-y-1 text-slate-300">
                <li>• Driver Licence (40)</li>
                <li>• Birth Certificate (70)</li>
              </ul>
              <p className="font-bold text-green-400 mt-2 text-lg">= 110 points</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-green-300">
              <p className="font-bold text-green-300 mb-2">✓ Example 3 – No Passport</p>
              <ul className="text-sm space-y-1 text-slate-300">
                <li>• Driver Licence (40)</li>
                <li>• Birth Certificate (70)</li>
                <li>• Medicare Card (25)</li>
              </ul>
              <p className="font-bold text-green-400 mt-2 text-lg">= 135 points</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Points Dashboard */}
      <Card className={`border-4 ${meetsRequirements ? 'border-green-500 bg-green-500/10' : 'border-amber-400 bg-amber-500/10'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className={`text-6xl font-bold ${meetsRequirements ? 'text-green-400' : 'text-amber-400'}`}>
                  {points.total}
                </div>
                <p className="text-sm font-semibold text-slate-300 mt-1">/ 100 POINTS</p>
              </div>
              
              <div className="h-16 w-px bg-gray-300"></div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {points.hasCategoryA ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className="text-sm font-semibold">Category A (Photo ID) Required</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {points.dobVerified ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className="text-sm font-semibold">Date of Birth Verified</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {points.addressVerified ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                  )}
                  <span className="text-sm font-semibold">Address Verified {!points.addressVerified && '(If Required)'}</span>
                </div>
              </div>
            </div>

            {meetsRequirements ? (
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-400 mb-2" />
                <Badge className="bg-green-600 text-lg px-4 py-2">✓ COMPLIANT</Badge>
              </div>
            ) : (
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-amber-400 mb-2" />
                <Badge className="bg-amber-600 text-lg px-4 py-2">
                  {100 - points.total} MORE NEEDED
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {requiresAddress && points.hasCategoryA && (
        <Card className="bg-amber-500/10 border-amber-300 border-2">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-300">
                <p className="font-semibold mb-1">Address Verification Required</p>
                <p>Primary ID does not verify address. Please add a Category B document (Utility Bill, Bank Statement, or Rates Notice).</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Documents with Upload */}
      {selectedDocuments.length > 0 && (
        <div>
          <h3 className="font-bold text-slate-100 mb-3">Selected Documents ({selectedDocuments.length})</h3>
          <div className="space-y-3">
            {selectedDocuments.map((doc, idx) => {
              const hasFile = uploadedFiles[doc.id];
              const isDraggingThis = isDragging === doc.id;
              
              return (
                <Card key={idx} className="border-2 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Document Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={doc.category === 'A' ? 'bg-blue-600' : 'bg-purple-600'}>
                            Category {doc.category}
                          </Badge>
                          <Badge className="bg-green-600 text-lg px-3 py-1">+{doc.points}</Badge>
                        </div>
                        <p className="font-bold text-slate-100">{doc.name}</p>
                        <p className="text-sm text-slate-300 mt-1">
                          {doc.number && `#${doc.number}`} {doc.issuer && `• ${doc.issuer}`} {doc.expiry && `• Expires: ${doc.expiry}`}
                        </p>
                        <div className="flex gap-1 mt-2">
                          {doc.photo && <Badge variant="outline" className="text-xs">Photo</Badge>}
                          {doc.dob && <Badge variant="outline" className="text-xs">DOB</Badge>}
                          {doc.address && <Badge variant="outline" className="text-xs">Address</Badge>}
                        </div>
                      </div>

                      {/* Upload Area */}
                      <div className="w-64">
                        {!hasFile ? (
                          <div
                            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
                              isDraggingThis ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-gray-400'
                            }`}
                            onDragOver={(e) => handleDragOver(e, doc.id)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, doc.id)}
                            onClick={() => document.getElementById(`file-${doc.id}`)?.click()}
                          >
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs text-slate-300 mb-2">Drop file or click</p>
                            <input
                              type="file"
                              id={`file-${doc.id}`}
                              className="hidden"
                              accept="image/*,.pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(doc.id, file);
                              }}
                            />
                            <Badge variant="outline" className="text-xs">Required</Badge>
                          </div>
                        ) : (
                          <div className="border-2 border-green-500 bg-green-500/10 rounded-lg p-4 text-center">
                            <FileCheck className="w-8 h-8 text-green-400 mx-auto mb-2" />
                            <p className="text-xs font-semibold text-slate-100 truncate">{hasFile.name}</p>
                            <p className="text-xs text-slate-300">{(hasFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            <Badge className="bg-green-600 text-xs mt-2">✓ Uploaded</Badge>
                          </div>
                        )}
                      </div>

                      {/* Remove Button */}
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-400 hover:bg-red-500/10"
                        onClick={() => removeDocument(doc.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Document Sections */}
      <div className="grid grid-cols-2 gap-6">
        {/* Category A */}
        <Card className="border-2 border-blue-300">
          <CardHeader className="bg-blue-500/10">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Category A - Primary Photo ID
            </CardTitle>
            <CardDescription>At least ONE required (Photo ID with DOB)</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {idDocuments.categoryA.map((doc) => {
              const alreadyAdded = selectedDocuments.some(d => d.id === doc.id);
              
              return (
                <button
                  key={doc.id}
                  disabled={alreadyAdded}
                  onClick={() => {
                    setSelectedDoc(doc);
                    setSelectedCategory('A');
                    setShowAddDocModal(true);
                  }}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    alreadyAdded
                      ? 'bg-white/5 border-white/10 cursor-not-allowed'
                      : 'bg-white border-blue-500/30 hover:border-blue-500 hover:bg-blue-500/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-100 text-sm">{doc.name}</p>
                      <div className="flex gap-1 mt-1">
                        {doc.photo && <Badge variant="outline" className="text-xs bg-blue-500/15">Photo</Badge>}
                        {doc.dob && <Badge variant="outline" className="text-xs bg-green-500/15">DOB</Badge>}
                        {doc.address && <Badge variant="outline" className="text-xs bg-purple-500/15">Address</Badge>}
                      </div>
                    </div>
                    <Badge className="bg-blue-600 text-lg px-3 py-1">{doc.points}</Badge>
                  </div>
                  {alreadyAdded && (
                    <p className="text-xs text-slate-400 mt-2">✓ Already added</p>
                  )}
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Category B */}
        <Card className="border-2 border-purple-300">
          <CardHeader className="bg-purple-500/10">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              Category B - Secondary ID
            </CardTitle>
            <CardDescription>Additional points & address verification</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
            {idDocuments.categoryB.map((doc) => {
              const alreadyAdded = selectedDocuments.some(d => d.id === doc.id);
              
              return (
                <button
                  key={doc.id}
                  disabled={alreadyAdded}
                  onClick={() => {
                    setSelectedDoc(doc);
                    setSelectedCategory('B');
                    setShowAddDocModal(true);
                  }}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    alreadyAdded
                      ? 'bg-white/5 border-white/10 cursor-not-allowed'
                      : 'bg-white border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-100 text-sm">{doc.name}</p>
                      <div className="flex gap-1 mt-1">
                        {doc.dob && <Badge variant="outline" className="text-xs bg-green-500/15">DOB</Badge>}
                        {doc.address && <Badge variant="outline" className="text-xs bg-purple-500/15">Address</Badge>}
                      </div>
                    </div>
                    <Badge className="bg-purple-600 text-lg px-3 py-1">{doc.points}</Badge>
                  </div>
                  {alreadyAdded && (
                    <p className="text-xs text-slate-400 mt-2">✓ Already added</p>
                  )}
                </button>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Document Details Modal */}
      {showAddDocModal && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-slate-100">Add {selectedDoc.name}</h3>
              <Badge className={selectedCategory === 'A' ? 'bg-blue-600 mt-2' : 'bg-purple-600 mt-2'}>
                Category {selectedCategory} • {selectedDoc.points} Points
              </Badge>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Document Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={docDetails.number}
                  onChange={(e) => setDocDetails({ ...docDetails, number: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                  placeholder="Enter document number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Issuing Authority / State
                </label>
                <input
                  type="text"
                  value={docDetails.issuer}
                  onChange={(e) => setDocDetails({ ...docDetails, issuer: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                  placeholder="e.g., NSW, Australia, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Expiry Date (if applicable)
                </label>
                <input
                  type="date"
                  value={docDetails.expiry}
                  onChange={(e) => setDocDetails({ ...docDetails, expiry: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                />
              </div>

              <Card className="bg-white/5">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-300">
                    <strong>Verification Details:</strong>
                  </p>
                  <ul className="text-sm text-slate-300 mt-2 space-y-1">
                    {selectedDoc.photo && <li>✓ Photo verification required</li>}
                    {selectedDoc.dob && <li>✓ Verifies date of birth</li>}
                    {selectedDoc.address && <li>✓ Verifies residential address</li>}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="p-6 border-t flex gap-3">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  if (docDetails.number) {
                    addDocument(selectedDoc, selectedCategory, docDetails);
                    setShowAddDocModal(false);
                    setDocDetails({ number: '', expiry: '', issuer: '' });
                    setSelectedDoc(null);
                    toast.success(`${selectedDoc.name} added (+${selectedDoc.points} points)`);
                  } else {
                    toast.error('Please enter document number');
                  }
                }}
              >
                <Check className="w-4 h-4 mr-2" />
                Add Document
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddDocModal(false);
                  setDocDetails({ number: '', expiry: '', issuer: '' });
                  setSelectedDoc(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between mt-6">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
        {onComplete && (
          <Button 
            onClick={() => onComplete({ selectedDocuments, uploadedFiles })}
            disabled={!meetsRequirements}
            className={!meetsRequirements ? 'opacity-50 cursor-not-allowed ml-auto' : 'ml-auto'}
          >
            Complete Verification
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}