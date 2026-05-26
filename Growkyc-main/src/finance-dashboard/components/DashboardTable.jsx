import React from 'react';

/**
 * Finance dashboard table — accepts `rows` or `data` (alias) to avoid prop mismatch errors.
 */
export function DashboardTable({
  columns,
  rows,
  data,
  loading = false,
  emptyMessage,
  emptyTitle,
  emptyDescription,
  onRowClick,
  getRowId = (row) => row?.id ?? row?.key ?? ''
}) {
  const tableRows = rows ?? data ?? [];
  const emptyText =
    emptyMessage ?? emptyDescription ?? emptyTitle ?? 'No records found.';

  if (loading) {
    return (
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm p-12 text-center text-gray-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="bg-slate-50 border-b border-gray-200 text-left">
            {columns.map((col) => (
              <th key={col.key} className="py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-10 px-4 text-center text-gray-500">
                {emptyText}
              </td>
            </tr>
          ) : (
            tableRows.map((row, index) => (
              <tr
                key={getRowId(row) || `row-${index}`}
                className={`border-b border-gray-100 hover:bg-slate-50/80 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td key={col.key} className="py-3 px-4 text-gray-800 align-middle">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
