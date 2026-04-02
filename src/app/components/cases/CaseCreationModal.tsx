import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  X,
  Upload,
  Search,
  Building,
  User,
  Shield,
  AlertTriangle,
  FileText,
  Users,
  TrendingUp,
  DollarSign,
  Eye
} from 'lucide-react';

interface CaseCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CaseCreationModal({ isOpen, onClose }: CaseCreationModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [caseType, setCaseType] = useState<string>('');
  const [urgency, setUrgency] = useState<string>('medium');
  const [reason, setReason] = useState<string>('');
  const [attachments, setAttachments] = useState<File[]>([]);

  if (!isOpen) return null;

  // Sample clients for search
  const clients = [
    { id: '1', name: 'ABC Enterprises Pty Ltd', type: 'company', abn: '12 345 678 901' },
    { id: '2', name: 'Innovation Partners Trust', type: 'trust', abn: '98 765 432 100' },
    { id: '3', name: 'David Williams', type: 'individual', dob: '1985-03-15' },
    { id: '4', name: 'TechCorp Pty Ltd', type: 'company', abn: '11 222 333 444' },
    { id: '5', name: 'Melbourne Family Trust', type: 'trust', abn: '55 666 777 888' }
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ('abn' in client && client.abn.includes(searchTerm))
  );

  const caseTypes = [
    { value: 'aml_alert', label: 'AML Alert', icon: Shield, color: 'red' },
    { value: 'pep', label: 'PEP Escalation', icon: Users, color: 'purple' },
    { value: 'adverse_media', label: 'Adverse Media', icon: FileText, color: 'orange' },
    { value: 'sanctions', label: 'Sanctions', icon: Shield, color: 'red' },
    { value: 'ownership', label: 'Ownership Issue', icon: Users, color: 'indigo' },
    { value: 'sof', label: 'Source of Funds', icon: DollarSign, color: 'amber' },
    { value: 'fraud', label: 'Fraud / Identity', icon: AlertTriangle, color: 'pink' },
    { value: 'legal', label: 'Legal / Court', icon: FileText, color: 'gray' },
    { value: 'manual', label: 'Manual Referral', icon: Eye, color: 'blue' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = () => {
    // Handle case creation
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto border-4 border-red-400 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-red-900 to-orange-900 text-white border-b sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <AlertTriangle className="w-8 h-8" />
              Create Manual Case
            </CardTitle>
            <Button
              onClick={onClose}
              className="bg-white/20 border-2 border-white/30 text-white hover:bg-white/30"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          {/* Step 1: Select Client */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              1. Select Client / Entity <span className="text-red-600">*</span>
            </label>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by client name or ABN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="max-h-60 overflow-y-auto border-2 border-gray-300 rounded-lg">
              {filteredClients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => setSelectedClient(client.id)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-blue-50 transition-colors border-b border-gray-200 ${
                    selectedClient === client.id ? 'bg-blue-100 border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  {client.type === 'individual' ? (
                    <User className="w-6 h-6 text-gray-600" />
                  ) : (
                    <Building className="w-6 h-6 text-gray-600" />
                  )}
                  <div className="flex-1 text-left">
                    <p className="font-bold text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-600">
                      {'abn' in client ? `ABN: ${client.abn}` : `DOB: ${client.dob}`}
                    </p>
                  </div>
                  <Badge className="bg-gray-100 text-gray-700 capitalize">{client.type}</Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Case Type */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              2. Case Type <span className="text-red-600">*</span>
            </label>
            <div className="grid md:grid-cols-3 gap-3">
              {caseTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setCaseType(type.value)}
                    className={`p-4 rounded-lg border-2 text-left hover:shadow-md transition-all ${
                      caseType === type.value
                        ? `border-${type.color}-500 bg-${type.color}-50`
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-5 h-5 text-${type.color}-600`} />
                      <span className="font-semibold text-gray-900">{type.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Urgency */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              3. Urgency Level <span className="text-red-600">*</span>
            </label>
            <div className="grid md:grid-cols-4 gap-3">
              {[
                { value: 'critical', label: 'Critical', color: 'red', sla: '24 hours' },
                { value: 'high', label: 'High', color: 'orange', sla: '48 hours' },
                { value: 'medium', label: 'Medium', color: 'amber', sla: '72 hours' },
                { value: 'low', label: 'Low', color: 'green', sla: '5 days' }
              ].map((level) => (
                <button
                  key={level.value}
                  onClick={() => setUrgency(level.value)}
                  className={`p-4 rounded-lg border-2 text-center hover:shadow-md transition-all ${
                    urgency === level.value
                      ? `border-${level.color}-500 bg-${level.color}-50`
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <p className="font-bold text-gray-900 mb-1">{level.label}</p>
                  <p className="text-xs text-gray-600">SLA: {level.sla}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Reason */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              4. Case Reason <span className="text-red-600">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Provide detailed reason for creating this case..."
            />
            <p className="text-xs text-gray-600 mt-2">
              Be specific. Include: What was observed? Why is it a concern? What action is needed?
            </p>
          </div>

          {/* Step 5: Attachments */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              5. Attachments (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-700 mb-2">Drag and drop files here, or click to browse</p>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
              >
                Choose Files
              </label>
            </div>
            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-900">{file.name}</span>
                      <span className="text-xs text-gray-600">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t-2 border-gray-200">
            <Button variant="outline" onClick={onClose} className="border-2">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedClient || !caseType || !reason}
              className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              Create Case
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
