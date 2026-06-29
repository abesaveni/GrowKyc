import React, { useState } from 'react';
import { Search, SlidersHorizontal, Download, Upload, Filter, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface DataTableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  filterable?: boolean;
  exportable?: boolean;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  actions?: {
    label: string;
    icon?: React.ElementType;
    onClick: (selectedRows: T[]) => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }[];
}

export function EnterpriseDataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = 'Search...',
  filterable = false,
  exportable = false,
  onRowClick,
  emptyMessage = 'No data available',
  actions = []
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Filter data based on search
  const filteredData = data.filter((row) => {
    if (!searchTerm) return true;
    return Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    
    if (aVal === bVal) return 0;
    
    const comparison = aVal > bVal ? 1 : -1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.size === sortedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(sortedData.map((_, idx) => idx)));
    }
  };

  const handleSelectRow = (index: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const handleExport = () => {
    const csv = [
      columns.map(col => col.label).join(','),
      ...sortedData.map(row =>
        columns.map(col => {
          const value = row[col.key as keyof T];
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1 min-w-[300px]">
          {searchable && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {filterable && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          )}
          
          {exportable && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          )}

          {actions.length > 0 && selectedRows.size > 0 && (
            <div className="flex gap-2">
              {actions.map((action, idx) => {
                const Icon = action.icon;
                const selectedData = Array.from(selectedRows).map(i => sortedData[i]);
                
                return (
                  <Button
                    key={idx}
                    variant={action.variant === 'danger' ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => action.onClick(selectedData)}
                    className={`gap-2 ${
                      action.variant === 'danger' ? 'text-red-400 hover:bg-red-500/10' : ''
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {action.label} ({selectedRows.size})
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-slate-300">
        Showing {sortedData.length} of {data.length} results
        {selectedRows.size > 0 && ` • ${selectedRows.size} selected`}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b">
              <tr>
                {actions.length > 0 && (
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === sortedData.length && sortedData.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-white/10"
                    />
                  </th>
                )}
                {columns.map((column, idx) => (
                  <th
                    key={idx}
                    className={`px-4 py-3 text-left text-sm font-semibold text-slate-100 ${
                      column.sortable ? 'cursor-pointer hover:bg-white/5' : ''
                    }`}
                    style={{ width: column.width }}
                    onClick={() => column.sortable && handleSort(String(column.key))}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && sortColumn === column.key && (
                        <span className="text-primary">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {sortedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                    className="px-4 py-12 text-center text-slate-400"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                sortedData.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={`hover:bg-white/5 transition-colors ${
                      onRowClick ? 'cursor-pointer' : ''
                    } ${selectedRows.has(rowIdx) ? 'bg-blue-500/10' : ''}`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {actions.length > 0 && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(rowIdx)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectRow(rowIdx);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-white/10"
                        />
                      </td>
                    )}
                    {columns.map((column, colIdx) => (
                      <td key={colIdx} className="px-4 py-3 text-sm text-slate-100">
                        {column.render
                          ? column.render(row[column.key as keyof T], row)
                          : String(row[column.key as keyof T] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
