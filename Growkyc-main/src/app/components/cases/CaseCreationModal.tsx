import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useAuth } from '../../../context/AuthContext';
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
  DollarSign,
  Eye,
  UserPlus,
} from 'lucide-react';
import { ClientsDB } from '../kyc/ClientsDatabase';
import {
  saveManualCase,
  getActivePersonaName,
  createClientFromManualCase,
  logComplianceActivity,
} from './complianceCaseUtils';
import { toast } from '../../lib/toast';

interface CaseCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newCase: any) => void;
}

export function CaseCreationModal({ isOpen, onClose, onSuccess }: CaseCreationModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [newClientName, setNewClientName] = useState('');
  const [newClientType, setNewClientType] = useState<'individual' | 'company' | 'trust'>('company');
  const [useNewClient, setUseNewClient] = useState(false);
  const [caseType, setCaseType] = useState<string>('');
  const [urgency, setUrgency] = useState<string>('medium');
  const [reason, setReason] = useState<string>('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [clients, setClients] = useState(() => ClientsDB.getClients());

  useEffect(() => {
    if (!isOpen) return;
    setClients(ClientsDB.getClients());
    return ClientsDB.subscribe(setClients);
  }, [isOpen]);

  const resetForm = () => {
    setSearchTerm('');
    setSelectedClient(null);
    setNewClientName('');
    setNewClientType('company');
    setUseNewClient(false);
    setCaseType('');
    setUrgency('medium');
    setReason('');
    setAttachments([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const allClients = clients.map((c) => ({
    id: c.id,
    name: c.name,
    type: (c.entityType || 'Company').toLowerCase(),
    abn: c.abn,
    acn: c.acn,
  }));

  const filteredClients = allClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.abn && client.abn.includes(searchTerm)) ||
      (client.acn && client.acn.includes(searchTerm))
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
    { value: 'manual', label: 'Manual Referral', icon: Eye, color: 'blue' },
  ];

  const selectedCaseTypeClasses: Record<string, string> = {
    red: 'border-red-500 bg-red-50',
    purple: 'border-purple-500 bg-purple-50',
    orange: 'border-orange-500 bg-orange-50',
    indigo: 'border-indigo-500 bg-indigo-50',
    amber: 'border-amber-500 bg-amber-50',
    pink: 'border-pink-500 bg-pink-50',
    gray: 'border-gray-500 bg-gray-50',
    blue: 'border-blue-500 bg-blue-50',
  };

  const iconColorClasses: Record<string, string> = {
    red: 'text-red-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    indigo: 'text-indigo-600',
    amber: 'text-amber-600',
    pink: 'text-pink-600',
    gray: 'text-gray-600',
    blue: 'text-blue-600',
  };

  const urgencyClasses: Record<string, string> = {
    red: 'border-red-500 bg-red-50',
    orange: 'border-orange-500 bg-orange-50',
    amber: 'border-amber-500 bg-amber-50',
    green: 'border-green-500 bg-green-50',
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const canSubmit =
    caseType &&
    reason.trim() &&
    (useNewClient ? newClientName.trim() : selectedClient);

  const handleSubmit = () => {
    if (!canSubmit) {
      toast.error('Please complete all required fields');
      return;
    }

    const caseTypeLabels: Record<string, string> = {
      aml_alert: 'AML Alert',
      pep: 'PEP Match',
      adverse_media: 'Adverse Media',
      sanctions: 'Sanctions Match',
      ownership: 'Ownership Issue',
      sof: 'EDD / Source of Funds',
      fraud: 'Fraud / Identity',
      legal: 'Legal / Court',
      manual: 'Manual Referral',
    };

    let clientId = selectedClient || '';
    let clientName = 'Unknown';
    let clientType: 'individual' | 'company' | 'trust' = 'company';

    if (useNewClient) {
      const created = createClientFromManualCase(newClientName.trim(), newClientType, urgency);
      ClientsDB.addClient(created);
      clientId = created.id;
      clientName = created.name;
      clientType = newClientType;
      logComplianceActivity(`onboarded client ${created.name} via manual case referral`, 'UserPlus', 'text-blue-600');
    } else {
      const client = allClients.find((c) => c.id === selectedClient);
      clientName = client?.name || 'Unknown';
      clientType =
        client?.type === 'individual' ? 'individual' : client?.type === 'trust' ? 'trust' : 'company';
      ClientsDB.updateClient(clientId, { status: 'Under Review' });
    }

    const slaHours = urgency === 'critical' ? 24 : urgency === 'high' ? 48 : urgency === 'medium' ? 72 : 120;
    const newCaseId = `CASE-2026-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const payload = {
      id: newCaseId,
      clientId,
      clientName,
      clientType,
      caseType: caseTypeLabels[caseType] || caseType,
      triggerSource: 'Manual Referral',
      riskLevel: (urgency as 'low' | 'medium' | 'high' | 'critical') || 'medium',
      status: 'new' as const,
      assignedTo: getActivePersonaName(),
      created: now,
      lastUpdated: now,
      slaHours,
      slaRemaining: slaHours,
      reason: reason.trim(),
      attachmentNames: attachments.map((f) => f.name),
    };

    saveManualCase(payload);
    logComplianceActivity(`created manual case ${newCaseId} for ${clientName}`, 'AlertTriangle', 'text-red-600');
    toast.success('Manual case created', `${newCaseId} — ${clientName}`);

    if (onSuccess) {
      onSuccess(payload);
    }
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto border-4 border-red-400 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white border-b sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <AlertTriangle className="w-8 h-8" />
              Create Manual Case
            </CardTitle>
            <Button
              onClick={handleClose}
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

            <div className="flex gap-2 mb-4">
              <Button
                type="button"
                size="sm"
                variant={!useNewClient ? 'default' : 'outline'}
                onClick={() => {
                  setUseNewClient(false);
                  setNewClientName('');
                }}
              >
                Existing Client
              </Button>
              <Button
                type="button"
                size="sm"
                variant={useNewClient ? 'default' : 'outline'}
                onClick={() => {
                  setUseNewClient(true);
                  setSelectedClient(null);
                  if (searchTerm.trim()) setNewClientName(searchTerm.trim());
                }}
              >
                <UserPlus className="w-4 h-4 mr-1" />
                New Client
              </Button>
            </div>

            {useNewClient ? (
              <div className="space-y-3 p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                <input
                  type="text"
                  placeholder="Enter new client / entity name..."
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  {(['individual', 'company', 'trust'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewClientType(t)}
                      className={`px-4 py-2 rounded-lg border-2 capitalize text-sm font-semibold ${
                        newClientType === t ? 'border-blue-600 bg-blue-100 text-blue-900' : 'border-gray-300 bg-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-blue-800">
                  A new client record will be created and linked to this case. Total clients on the dashboard will update automatically.
                </p>
              </div>
            ) : (
              <>
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
                  {filteredClients.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <p className="mb-2">No clients found{searchTerm ? ` for "${searchTerm}"` : ''}.</p>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          setUseNewClient(true);
                          setNewClientName(searchTerm.trim());
                        }}
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Create new client{searchTerm.trim() ? `: ${searchTerm.trim()}` : ''}
                      </Button>
                    </div>
                  ) : (
                    filteredClients.map((client) => (
                      <button
                        key={client.id}
                        type="button"
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
                            {client.abn ? `ABN: ${client.abn}` : client.acn ? `ACN: ${client.acn}` : client.type}
                          </p>
                        </div>
                        <Badge className="bg-gray-100 text-gray-700 capitalize">{client.type}</Badge>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
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
                    type="button"
                    onClick={() => setCaseType(type.value)}
                    className={`p-4 rounded-lg border-2 text-left hover:shadow-md transition-all ${
                      caseType === type.value
                        ? selectedCaseTypeClasses[type.color] || 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-5 h-5 ${iconColorClasses[type.color] || 'text-blue-600'}`} />
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
                { value: 'low', label: 'Low', color: 'green', sla: '5 days' },
              ].map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setUrgency(level.value)}
                  className={`p-4 rounded-lg border-2 text-center hover:shadow-md transition-all ${
                    urgency === level.value
                      ? urgencyClasses[level.color] || 'border-amber-500 bg-amber-50'
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
          </div>

          {/* Step 5: Attachments */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">5. Attachments (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-700 mb-2">Drag and drop files here, or click to browse</p>
              <input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" />
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

          <div className="flex items-center justify-between pt-6 border-t-2 border-gray-200">
            <Button variant="outline" onClick={handleClose} className="border-2">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
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
