import React, { useCallback, useEffect, useState } from 'react';
import { Eye, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { PageHeader } from '../shared/dashboard/PageHeader';
import { DataTable, Column } from '../shared/dashboard/DataTable';
import {
  fetchSharedDocuments,
  SharedDocument,
  SharedDocumentsQuery
} from '../../services/documentManagerService';
import { FileTypeIcon, PermissionBadge } from './documentFileUtils';

export function SharedDocumentsView() {
  const [documents, setDocuments] = useState<SharedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [permission, setPermission] = useState('all');
  const [docType, setDocType] = useState('all');
  const [sortBy, setSortBy] = useState<SharedDocumentsQuery['sortBy']>('sharedDate');
  const [preview, setPreview] = useState<SharedDocument | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchSharedDocuments({ search, permission, docType, sortBy, sortDir: 'desc' })
      .then(setDocuments)
      .finally(() => setLoading(false));
  }, [search, permission, docType, sortBy]);

  useEffect(() => {
    load();
  }, [load]);

  const docTypes = ['all', 'Audit', 'Legal', 'Operations', 'Compliance', 'Valuation', 'Templates', 'KYC', 'Governance', 'Finance', 'Tax', 'SMSF'];

  const columns: Column<SharedDocument>[] = [
    {
      key: 'name',
      label: 'Document Name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2 min-w-[180px]">
          <FileTypeIcon type={row.fileType} />
          <span className="font-medium text-slate-100 truncate max-w-[220px]" title={row.name}>
            {row.name}
          </span>
        </div>
      )
    },
    { key: 'sharedBy', label: 'Shared By', sortable: true },
    {
      key: 'permission',
      label: 'Permission',
      render: (row) => <PermissionBadge permission={row.permission} />
    },
    { key: 'sharedDate', label: 'Shared Date', sortable: true },
    { key: 'lastOpened', label: 'Last Opened', sortable: true },
    {
      key: 'fileType',
      label: 'File Type',
      render: (row) => <span className="uppercase text-xs text-slate-300">{row.fileType}</span>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setPreview(row);
          }}
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
      )
    }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Shared with me"
        description="Documents shared by colleagues and external parties with permission controls."
      />

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search name, sharer, or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search shared documents"
          />
        </div>
        <select
          value={permission}
          onChange={(e) => setPermission(e.target.value)}
          className="px-3 py-2 border border-white/10 rounded-lg text-sm"
          aria-label="Filter by permission"
        >
          <option value="all">All permissions</option>
          <option value="View">View</option>
          <option value="Edit">Edit</option>
          <option value="Admin">Admin</option>
        </select>
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className="px-3 py-2 border border-white/10 rounded-lg text-sm"
          aria-label="Filter by document type"
        >
          {docTypes.map((t) => (
            <option key={t} value={t}>
              {t === 'all' ? 'All types' : t}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SharedDocumentsQuery['sortBy'])}
          className="px-3 py-2 border border-white/10 rounded-lg text-sm"
          aria-label="Sort shared documents"
        >
          <option value="sharedDate">Sort: Shared date</option>
          <option value="lastOpened">Sort: Last opened</option>
          <option value="name">Sort: Name</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={documents}
        loading={loading}
        getRowId={(row) => row.id}
        emptyTitle="No shared documents"
        emptyDescription="Nothing has been shared with you yet, or filters hide all results."
        pageSize={8}
        onRowClick={(row) => setPreview(row)}
      />

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto"
          onClick={() => setPreview(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shared-preview-title"
        >
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl my-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-3">
              <FileTypeIcon type={preview.fileType} className="w-8 h-8" />
              <div className="flex-1 min-w-0">
                <h3 id="shared-preview-title" className="text-lg font-semibold text-slate-100 truncate">
                  {preview.name}
                </h3>
                <p className="text-sm text-slate-300 mt-1">Shared by {preview.sharedBy}</p>
              </div>
              <PermissionBadge permission={preview.permission} />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-slate-400">Shared date</dt>
                <dd className="font-medium">{preview.sharedDate}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Last opened</dt>
                <dd className="font-medium">{preview.lastOpened}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Category</dt>
                <dd className="font-medium">{preview.docType}</dd>
              </div>
              <div>
                <dt className="text-slate-400">File type</dt>
                <dd className="font-medium uppercase">{preview.fileType}</dd>
              </div>
            </dl>
            <div className="flex gap-2 mt-6">
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  toast.success(`Opened ${preview.name}`);
                  setPreview(null);
                }}
              >
                Open document
              </Button>
              <Button variant="outline" onClick={() => setPreview(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
