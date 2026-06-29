import React, { useCallback, useEffect, useState } from 'react';
import { RotateCcw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { PageHeader } from '../shared/dashboard/PageHeader';
import { DataTable, Column } from '../shared/dashboard/DataTable';
import { ConfirmDialog } from '../ui/confirm-dialog';
import {
  DeletedDocument,
  fetchTrash,
  restoreDocument,
  permanentDeleteDocument
} from '../../services/documentManagerService';

export function TrashDocumentsView() {
  const [docs, setDocs] = useState<DeletedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<{ ids: string[] } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetchTrash().then(setDocs).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === docs.length) setSelected(new Set());
    else setSelected(new Set(docs.map((d) => d.id)));
  };

  const handleRestore = async (ids: string[]) => {
    setBusy(true);
    try {
      await Promise.all(ids.map(restoreDocument));
      toast.success(ids.length > 1 ? `${ids.length} documents restored` : 'Document restored');
      setSelected(new Set());
      load();
    } finally {
      setBusy(false);
    }
  };

  const handlePermanentDelete = async () => {
    if (!confirmDelete) return;
    setBusy(true);
    try {
      await Promise.all(confirmDelete.ids.map(permanentDeleteDocument));
      toast.success('Permanently deleted');
      setSelected(new Set());
      setConfirmDelete(null);
      load();
    } finally {
      setBusy(false);
    }
  };

  const columns: Column<DeletedDocument>[] = [
    {
      key: 'select',
      label: 'Select',
      render: (r) => (
        <input
          type="checkbox"
          checked={selected.has(r.id)}
          onChange={(e) => {
            e.stopPropagation();
            toggleSelect(r.id);
          }}
          onClick={(e) => e.stopPropagation()}
        />
      )
    },
    { key: 'name', label: 'Document', sortable: true },
    { key: 'originalPath', label: 'Original path' },
    { key: 'size', label: 'Size' },
    { key: 'deletedBy', label: 'Deleted by', sortable: true },
    { key: 'deletedAt', label: 'Deleted date', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button type="button" variant="outline" size="sm" onClick={() => handleRestore([r.id])}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Restore
          </Button>
          <Button type="button" variant="outline" size="sm" className="text-red-600" onClick={() => setConfirmDelete({ ids: [r.id] })}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Trash"
        description="Deleted documents can be restored or permanently removed."
        actions={
          selected.size > 0 ? (
            <div className="flex gap-2">
              <Button type="button" variant="outline" disabled={busy} onClick={() => handleRestore([...selected])}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Restore ({selected.size})
              </Button>
              <Button
                type="button"
                variant="outline"
                className="text-red-600 border-red-200"
                disabled={busy}
                onClick={() => setConfirmDelete({ ids: [...selected] })}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete permanently
              </Button>
            </div>
          ) : null
        }
      />

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={docs.length > 0 && selected.size === docs.length}
          onChange={toggleAll}
          id="trash-select-all"
        />
        <label htmlFor="trash-select-all">Select all in trash</label>
      </div>

      <DataTable
        columns={columns}
        data={docs}
        loading={loading}
        getRowId={(r) => r.id}
        emptyTitle="Trash is empty"
        emptyDescription="Deleted documents will appear here for 30 days."
        pageSize={50}
      />

      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handlePermanentDelete}
        title="Permanently delete?"
        description="This action cannot be undone. Selected documents will be removed permanently."
        confirmLabel="Delete forever"
        variant="danger"
        isLoading={busy}
      />
    </div>
  );
}
