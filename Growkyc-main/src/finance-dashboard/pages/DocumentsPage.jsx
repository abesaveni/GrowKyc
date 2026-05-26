import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, Eye, FileText, Search, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../app/components/ui/button';
import { DashboardCard } from '../components/DashboardCard';
import { DashboardTable } from '../components/DashboardTable';
import { fetchMock } from '../utils/fetchMock';
import {
  computeDocumentsSummary,
  fetchImfoDocuments,
  uploadImfoDocument
} from '../../app/services/imfoDocumentsService';

const CATEGORIES = ['all', 'Fund', 'Investor', 'Deal', 'Compliance', 'Audit'];
const STATUSES = ['all', 'approved', 'pending-review', 'draft', 'archived'];

function StatusBadge({ status }) {
  const map = {
    approved: 'bg-green-100 text-green-800',
    'pending-review': 'bg-amber-100 text-amber-900',
    draft: 'bg-slate-100 text-slate-700',
    archived: 'bg-gray-100 text-gray-600'
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || map.draft}`}>
      {status.replace('-', ' ')}
    </span>
  );
}

export function DocumentsPage({ role = 'fund-manager' }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [fund, setFund] = useState('all');
  const [preview, setPreview] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Fund', fund: 'Growth Credit Fund I' });
  const [errors, setErrors] = useState({});

  const load = useCallback(() => {
    setLoading(true);
    fetchImfoDocuments({ search, category, status, fund })
      .then(setDocuments)
      .finally(() => setLoading(false));
  }, [search, category, status, fund]);

  useEffect(() => {
    load();
  }, [load]);

  const summary = useMemo(() => computeDocumentsSummary(documents), [documents]);

  const fundOptions = useMemo(() => {
    const funds = [...new Set(documents.map((d) => d.fund))];
    return ['all', ...funds];
  }, [documents]);

  const validateUpload = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Document name is required';
    if (!form.fund.trim()) e.fund = 'Fund is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleUpload = async (ev) => {
    ev.preventDefault();
    if (uploading) return;
    if (!validateUpload()) return;
    setUploading(true);
    try {
      await uploadImfoDocument({
        name: form.name.trim(),
        category: form.category,
        fund: form.fund.trim()
      });
      toast.success('Document uploaded — pending review');
      setShowUpload(false);
      setForm({ name: '', category: 'Fund', fund: 'Growth Credit Fund I' });
      load();
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const downloadDoc = (doc) => {
    const body = `IMFO Document\n${doc.id}\n${doc.name}\nFund: ${doc.fund}\nCategory: ${doc.category}\nVersion: ${doc.version}`;
    const blob = new Blob([body], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.id.replace(/\s/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Download started');
  };

  const columns = [
    { key: 'name', label: 'Document', sortable: true, render: (r) => (
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-indigo-500 flex-shrink-0" />
        <div>
          <p className="font-medium text-gray-900">{r.name}</p>
          <p className="text-xs text-gray-500">{r.id} · v{r.version}</p>
        </div>
      </div>
    )},
    { key: 'category', label: 'Category', sortable: true },
    { key: 'fund', label: 'Fund / SPV', sortable: true },
    { key: 'fileType', label: 'Type' },
    { key: 'sizeKb', label: 'Size', align: 'right', render: (r) => `${(r.sizeKb / 1024).toFixed(1)} MB` },
    { key: 'lastModified', label: 'Modified', sortable: true },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Button type="button" variant="ghost" size="sm" onClick={() => setPreview(r)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => downloadDoc(r)}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
          <p className="text-gray-600 mt-1">
            Fund, investor, deal, and compliance document library
            {role === 'investment-analyst' ? ' — analyst access to IM, deal, and research files' : ''}.
          </p>
        </div>
        <Button type="button" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setShowUpload(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload document
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total documents" value={String(summary.total)} icon={FileText} />
        <DashboardCard title="Approved" value={String(summary.approved)} icon={FileText} accent="emerald" />
        <DashboardCard title="Pending review" value={String(summary.pendingReview)} icon={FileText} accent="amber" />
        <DashboardCard title="Storage (filtered)" value={`${summary.totalSizeMb} MB`} icon={FileText} />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search name, ID, or fund..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c === 'all' ? 'All categories' : c}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s === 'all' ? 'All statuses' : s.replace('-', ' ')}</option>
          ))}
        </select>
        <select value={fund} onChange={(e) => setFund(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm min-w-[180px]">
          {fundOptions.map((f) => (
            <option key={f} value={f}>{f === 'all' ? 'All funds' : f}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500">
          Loading documents…
        </div>
      ) : (
        <DashboardTable
          columns={columns}
          rows={documents}
          onRowClick={setPreview}
          emptyMessage="No documents found. Adjust filters or upload a new document."
        />
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Document preview</h3>
              <button type="button" onClick={() => setPreview(null)} aria-label="Close"><X className="w-5 h-5" /></button>
            </div>
            <p className="font-medium text-gray-900">{preview.name}</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-gray-600">ID</dt><dd>{preview.id}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-600">Category</dt><dd>{preview.category}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-600">Fund</dt><dd>{preview.fund}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-600">Uploaded by</dt><dd>{preview.uploadedBy}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-600">Status</dt><dd><StatusBadge status={preview.status} /></dd></div>
            </dl>
            <div className="flex gap-2 mt-6">
              <Button type="button" variant="outline" className="flex-1" onClick={() => downloadDoc(preview)}>
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
              <Button type="button" className="flex-1" variant="outline" onClick={() => setPreview(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {showUpload && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto"
          onClick={() => !uploading && setShowUpload(false)}
          role="dialog"
          aria-modal="true"
        >
          <form
            className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 my-auto"
            onSubmit={handleUpload}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold">Upload document</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Document name *</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.filter((c) => c !== 'all').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fund / SPV *</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.fund} onChange={(e) => setForm({ ...form, fund: e.target.value })} />
              {errors.fund && <p className="text-xs text-red-600 mt-1">{errors.fund}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
              <input type="file" className="w-full text-sm" onChange={() => toast.message('File attached')} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowUpload(false)}>Cancel</Button>
              <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700" disabled={uploading}>
                {uploading ? 'Uploading…' : 'Upload'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
