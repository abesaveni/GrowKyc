import React, { useCallback, useEffect, useState } from 'react';
import { Clock, Eye, FileText, Search, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { PageHeader } from '../shared/dashboard/PageHeader';
import { TableSkeleton } from '../ui/loading';
import { EmptyState } from '../ui/empty-state';
import {
  fetchRecentDocuments,
  touchRecentDocument,
  RecentDocument
} from '../../services/documentManagerService';
import { FileTypeIcon } from './documentFileUtils';

export function RecentDocumentsView() {
  const [documents, setDocuments] = useState<RecentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState<RecentDocument | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchRecentDocuments(search)
      .then(setDocuments)
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  const openDoc = (doc: RecentDocument) => {
    touchRecentDocument(doc.id);
    const now = new Date();
    const lastOpened = now.toLocaleString('en-AU', { dateStyle: 'short', timeStyle: 'short' });
    setDocuments((prev) =>
      [...prev]
        .map((d) =>
          d.id === doc.id
            ? { ...d, lastOpened, lastOpenedTs: now.getTime(), viewsToday: d.viewsToday + 1 }
            : d
        )
        .sort((a, b) => b.lastOpenedTs - a.lastOpenedTs)
    );
    setPreview({ ...doc, lastOpened, lastOpenedTs: now.getTime(), viewsToday: doc.viewsToday + 1 });
    toast.success(`Opened ${doc.name}`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Recent documents"
        description="Quick access to documents you opened recently, sorted by latest activity."
      />

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          placeholder="Search by name, client, or path..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search recent documents"
        />
      </div>

      {loading ? (
        <div className="bg-white border border-white/10 rounded-lg p-4">
          <TableSkeleton rows={5} />
        </div>
      ) : documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No recent documents"
          description="Documents you open will appear here for quick access."
        />
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {documents.map((doc, index) => (
              <div
                key={doc.id}
                className="bg-white border border-white/10 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md hover:border-blue-500/30 transition-all group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <FileTypeIcon type={doc.fileType} className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-100 truncate">{doc.name}</p>
                    <p className="text-sm text-slate-300 truncate">{doc.client}</p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Last opened {doc.lastOpened}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:shrink-0">
                  {index < 3 && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded-full">
                      <TrendingUp className="w-3 h-3" />
                      Recent
                    </span>
                  )}
                  {doc.viewsToday > 0 && (
                    <span className="text-xs text-slate-400">{doc.viewsToday} views today</span>
                  )}
                  <Button type="button" variant="outline" size="sm" onClick={() => openDoc(doc)}>
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-white/10 rounded-lg p-5 h-fit">
            <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Activity timeline
            </h3>
            <ul className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
              {documents.slice(0, 6).map((doc) => (
                <li key={`tl-${doc.id}`} className="relative pl-6">
                  <span className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white ring-2 ring-blue-100" />
                  <button
                    type="button"
                    className="text-left w-full hover:text-blue-300 transition-colors"
                    onClick={() => openDoc(doc)}
                  >
                    <p className="text-sm font-medium text-slate-100 line-clamp-1">{doc.name}</p>
                    <p className="text-xs text-slate-400">{doc.lastOpened}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
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
            <p className="text-sm text-slate-300 mt-1">{preview.client}</p>
            <p className="text-xs text-slate-400 mt-2">{preview.path}</p>
            <p className="text-sm text-slate-300 mt-4">Last opened: {preview.lastOpened}</p>
            <Button className="w-full mt-6" variant="outline" onClick={() => setPreview(null)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
