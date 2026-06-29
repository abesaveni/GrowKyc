import React, { useCallback, useEffect, useState } from 'react';
import { Eye, FileText, Plus, Search, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { PageHeader } from '../shared/dashboard/PageHeader';
import { TableSkeleton } from '../ui/loading';
import { EmptyState } from '../ui/empty-state';
import { fetchTemplates, DocumentTemplate } from '../../services/documentManagerService';

export function TemplatesLibraryView() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [preview, setPreview] = useState<DocumentTemplate | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchTemplates(category, search)
      .then(setTemplates)
      .finally(() => setLoading(false));
  }, [category, search]);

  useEffect(() => {
    load();
  }, [load]);

  const categories = ['all', 'Client Onboarding', 'Compliance', 'Investments', 'Receivership'];

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Templates library"
        description="Standard document templates with version control and preview."
        actions={
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => toast.success('Template upload wizard opened')}>
            <Plus className="w-4 h-4 mr-2" />
            Create template
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg text-sm"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 border border-white/10 rounded-lg text-sm"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c === 'all' ? 'All categories' : c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="bg-white border border-white/10 rounded-lg p-4">
          <TableSkeleton rows={4} />
        </div>
      ) : templates.length === 0 ? (
        <EmptyState icon={FileText} title="No templates found" description="Adjust search or category filters." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => (
            <div key={t.id} className="bg-white border border-white/10 rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <FileText className="w-8 h-8 text-blue-400" />
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300">{t.category}</span>
              </div>
              <h3 className="font-semibold text-slate-100">{t.name}</h3>
              <p className="text-sm text-slate-300 mt-1 line-clamp-2">{t.description}</p>
              <p className="text-xs text-slate-400 mt-3">v{t.version} · Modified {t.lastModified}</p>
              <div className="flex gap-2 mt-4">
                <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => setPreview(t)}>
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => toast.success(`Using template ${t.name}`)}>
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto"
          onClick={() => setPreview(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl max-w-lg w-full p-6 my-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-100">{preview.name}</h3>
            <p className="text-sm text-slate-300 mt-2">{preview.description}</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-slate-300">Category</dt><dd>{preview.category}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-300">Version</dt><dd>{preview.version}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-300">Last modified</dt><dd>{preview.lastModified}</dd></div>
            </dl>
            <Button className="w-full mt-6" variant="outline" onClick={() => setPreview(null)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}
