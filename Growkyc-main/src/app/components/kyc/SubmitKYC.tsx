import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from '../../lib/toast';
import {
  Upload,
  FileText,
  CheckCircle,
  Clock,
  Shield,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';

function getAuthHeader(): Record<string, string> {
  const token = sessionStorage.getItem('growkyc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Mirrors the backend DocumentType enum (value form accepted by /documents/upload).
const DOC_TYPES = [
  { value: 'Passport', label: 'Passport' },
  { value: 'DriversLicence', label: "Driver's Licence" },
  { value: 'MedicareCard', label: 'Medicare Card' },
  { value: 'ProofOfAgeCard', label: 'Proof of Age Card' },
  { value: 'UtilityBill', label: 'Proof of Address (Utility Bill)' },
  { value: 'Other', label: 'Other' },
];

interface KycDoc {
  id: number;
  file_name: string;
  uploaded_at: string;
  verified_at: string | null;
}

interface KycRecord {
  id: number;
  name: string;
  status: string;
  dob?: string | null;
  gender?: string | null;
  address?: string | null;
  pan?: string | null;
  submitted_at?: string;
  rejection_reason?: string | null;
  documents?: KycDoc[];
}

export function SubmitKYC({ onBack }: { onBack?: () => void } = {}) {
  const [kyc, setKyc] = useState<KycRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState('Passport');
  const [form, setForm] = useState({ name: '', dob: '', gender: '', address: '', pan: '' });
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/kyc/status', { headers: getAuthHeader() });
      setKyc(res.ok ? await res.json() : null);
    } catch {
      setKyc(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async () => {
    if (!form.name.trim()) {
      toast.error('Full name is required');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/kyc/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({
          name: form.name,
          dob: form.dob || null,
          gender: form.gender || null,
          address: form.address || null,
          pan: form.pan || null,
        }),
      });
      if (!res.ok) {
        const detail = await res.text();
        console.error('KYC submit failed', res.status, detail);
        toast.error(`Could not submit KYC (${res.status})`);
        return;
      }
      toast.success('KYC submitted — now upload your supporting documents');
      await load();
    } catch (err) {
      console.error(err);
      toast.error('Network error submitting KYC');
    } finally {
      setSubmitting(false);
    }
  };

  const upload = async (file: File) => {
    if (!kyc?.id) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('kyc_id', String(kyc.id));
      fd.append('document_type', docType);
      fd.append('file', file);
      const res = await fetch('/api/v1/documents/upload', {
        method: 'POST',
        headers: getAuthHeader(), // no Content-Type: browser sets multipart boundary
        body: fd,
      });
      if (!res.ok) {
        const detail = await res.text();
        console.error('Upload failed', res.status, detail);
        toast.error(`Upload failed (${res.status})`);
        return;
      }
      toast.success(`${file.name} uploaded`);
      await load();
    } catch (err) {
      console.error(err);
      toast.error('Network error uploading document');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const statusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'approved') return <Badge className="bg-green-100 text-green-700 border-green-200">Approved</Badge>;
    if (s === 'rejected') return <Badge className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>;
    return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Pending Review</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-1" />Back
            </Button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">KYC Verification</h1>
              <p className="text-sm text-gray-500">Submit your identity details and supporting documents</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {loading ? (
          <Card><CardContent className="p-8 text-center text-gray-500">Loading…</CardContent></Card>
        ) : !kyc ? (
          // --- Submit form (no KYC record yet) ---
          <Card>
            <CardHeader className="border-b"><CardTitle className="text-lg">Step 1 — Your details</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Full name *">
                  <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="As shown on your ID" />
                </Field>
                <Field label="Date of birth">
                  <input type="date" className={inputCls} value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
                </Field>
                <Field label="Gender">
                  <select className={inputCls} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                    <option value="">Select…</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </Field>
                <Field label="Tax / PAN reference">
                  <input className={inputCls} value={form.pan} onChange={(e) => setForm({ ...form, pan: e.target.value })} placeholder="Optional" />
                </Field>
              </div>
              <Field label="Residential address">
                <input className={inputCls} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Street, suburb, state, postcode" />
              </Field>
              <Button onClick={submit} disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                {submitting ? 'Submitting…' : 'Submit KYC'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          // --- Record exists: show status + document upload ---
          <>
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Your KYC submission</CardTitle>
                  {statusBadge(kyc.status)}
                </div>
              </CardHeader>
              <CardContent className="p-6 grid md:grid-cols-2 gap-3 text-sm">
                <Row label="Reference" value={`KYC-${kyc.id}`} />
                <Row label="Name" value={kyc.name} />
                <Row label="Date of birth" value={kyc.dob || '—'} />
                <Row label="Submitted" value={kyc.submitted_at ? new Date(kyc.submitted_at).toLocaleString() : '—'} />
                <Row label="Address" value={kyc.address || '—'} />
                {kyc.rejection_reason && <Row label="Rejection reason" value={kyc.rejection_reason} />}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b"><CardTitle className="text-lg">Step 2 — Supporting documents</CardTitle></CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-wrap items-end gap-3">
                  <Field label="Document type">
                    <select className={inputCls} value={docType} onChange={(e) => setDocType(e.target.value)}>
                      {DOC_TYPES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                  </Field>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }}
                  />
                  <Button onClick={() => fileRef.current?.click()} disabled={uploading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Upload className="w-4 h-4 mr-2" />{uploading ? 'Uploading…' : 'Upload document'}
                  </Button>
                </div>

                <div className="divide-y border rounded-lg">
                  {(kyc.documents && kyc.documents.length > 0) ? kyc.documents.map((d) => (
                    <div key={d.id} className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm text-gray-800">{d.file_name}</span>
                      </div>
                      {d.verified_at ? (
                        <span className="flex items-center gap-1 text-green-700 text-xs font-semibold"><CheckCircle className="w-4 h-4" />Verified</span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600 text-xs font-semibold"><Clock className="w-4 h-4" />Awaiting verification</span>
                      )}
                    </div>
                  )) : (
                    <div className="p-4 text-sm text-gray-500">No documents uploaded yet. Upload at least one ID document so a compliance officer can verify and approve your KYC.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-gray-100 pb-2">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 text-right font-medium">{value}</span>
    </div>
  );
}
