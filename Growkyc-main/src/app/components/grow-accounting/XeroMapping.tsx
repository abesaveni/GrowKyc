import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Link as LinkIcon,
  AlertCircle,
  Save,
  Search,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';
import { toast } from 'sonner';

interface XeroMappingProps {
  onNavigate?: (page: string) => void;
}

interface AccountMapping {
  id: string;
  xeroAccount: string;
  xeroAccountCode: string;
  xeroAccountType: string;
  workpaperSection: string;
  workpaperLineItem: string;
  autoSync: boolean;
  mapped: boolean;
}

export function XeroMapping({ onNavigate }: XeroMappingProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['income']));

  const [mappings, setMappings] = useState<AccountMapping[]>([
    // Income
    {
      id: 'M1',
      xeroAccount: 'Salary and Wages Income',
      xeroAccountCode: '200',
      xeroAccountType: 'Income',
      workpaperSection: 'Income Indiv. 1',
      workpaperLineItem: 'Salary & Wages',
      autoSync: true,
      mapped: true
    },
    {
      id: 'M2',
      xeroAccount: 'Allowances',
      xeroAccountCode: '210',
      xeroAccountType: 'Income',
      workpaperSection: 'Income Indiv. 1',
      workpaperLineItem: 'Allowances',
      autoSync: true,
      mapped: true
    },
    {
      id: 'M3',
      xeroAccount: 'Interest Income',
      xeroAccountCode: '260',
      xeroAccountType: 'Income',
      workpaperSection: 'Income Indiv. 1',
      workpaperLineItem: 'Interest Income',
      autoSync: true,
      mapped: true
    },
    {
      id: 'M4',
      xeroAccount: 'Dividend Income',
      xeroAccountCode: '270',
      xeroAccountType: 'Income',
      workpaperSection: 'Income Indiv. 1',
      workpaperLineItem: 'Dividend Income',
      autoSync: true,
      mapped: true
    },
    {
      id: 'M5',
      xeroAccount: 'Rental Income',
      xeroAccountCode: '280',
      xeroAccountType: 'Income',
      workpaperSection: 'Income Indiv. 1',
      workpaperLineItem: 'Gross Rental Income',
      autoSync: true,
      mapped: true
    },
    {
      id: 'M6',
      xeroAccount: 'Capital Gains',
      xeroAccountCode: '290',
      xeroAccountType: 'Income',
      workpaperSection: 'Income Indiv. 1',
      workpaperLineItem: 'Capital Gains',
      autoSync: true,
      mapped: true
    },
    // Expenses
    {
      id: 'M7',
      xeroAccount: 'Motor Vehicle Expenses',
      xeroAccountCode: '400',
      xeroAccountType: 'Expense',
      workpaperSection: 'Deductions Indiv. 1',
      workpaperLineItem: 'Motor Vehicle Expenses',
      autoSync: true,
      mapped: true
    },
    {
      id: 'M8',
      xeroAccount: 'Travel Expenses',
      xeroAccountCode: '410',
      xeroAccountType: 'Expense',
      workpaperSection: 'Deductions Indiv. 1',
      workpaperLineItem: 'Work Related Travel',
      autoSync: true,
      mapped: true
    },
    {
      id: 'M9',
      xeroAccount: 'Uniform & Laundry',
      xeroAccountCode: '420',
      xeroAccountType: 'Expense',
      workpaperSection: 'Deductions Indiv. 1',
      workpaperLineItem: 'Uniform & Protective Clothing',
      autoSync: true,
      mapped: true
    },
    {
      id: 'M10',
      xeroAccount: 'Home Office Expenses',
      xeroAccountCode: '430',
      xeroAccountType: 'Expense',
      workpaperSection: 'Deductions Indiv. 1',
      workpaperLineItem: 'Home Office Expenses',
      autoSync: true,
      mapped: true
    },
    {
      id: 'M11',
      xeroAccount: 'Self Education',
      xeroAccountCode: '440',
      xeroAccountType: 'Expense',
      workpaperSection: 'Deductions Indiv. 1',
      workpaperLineItem: 'Self Education',
      autoSync: true,
      mapped: true
    },
    {
      id: 'M12',
      xeroAccount: 'Professional Subscriptions',
      xeroAccountCode: '450',
      xeroAccountType: 'Expense',
      workpaperSection: 'Deductions Indiv. 1',
      workpaperLineItem: 'Other Work Related',
      autoSync: false,
      mapped: true
    },
    // Unmapped
    {
      id: 'M13',
      xeroAccount: 'Other Business Income',
      xeroAccountCode: '295',
      xeroAccountType: 'Income',
      workpaperSection: '',
      workpaperLineItem: '',
      autoSync: false,
      mapped: false
    },
    {
      id: 'M14',
      xeroAccount: 'Parking & Tolls',
      xeroAccountCode: '460',
      xeroAccountType: 'Expense',
      workpaperSection: '',
      workpaperLineItem: '',
      autoSync: false,
      mapped: false
    }
  ]);

  const handleMappingChange = (id: string, field: string, value: any) => {
    setMappings(mappings.map(m => 
      m.id === id ? { ...m, [field]: value, mapped: field === 'workpaperLineItem' && value ? true : m.mapped } : m
    ));
  };

  const handleSaveMappings = () => {
    toast.success('Mappings Saved', {
      description: 'Xero account mappings have been updated'
    });
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const groupedMappings = mappings.reduce((acc, mapping) => {
    const type = mapping.xeroAccountType.toLowerCase();
    if (!acc[type]) acc[type] = [];
    acc[type].push(mapping);
    return acc;
  }, {} as Record<string, AccountMapping[]>);

  const filteredMappings = Object.entries(groupedMappings).reduce((acc, [type, items]) => {
    const filtered = items.filter(m => 
      m.xeroAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.xeroAccountCode.includes(searchTerm) ||
      m.workpaperLineItem.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[type] = filtered;
    }
    return acc;
  }, {} as Record<string, AccountMapping[]>);

  const mappedCount = mappings.filter(m => m.mapped).length;
  const autoSyncCount = mappings.filter(m => m.autoSync).length;
  const unmappedCount = mappings.filter(m => !m.mapped).length;

  return (
    <WorkpaperLayout currentPage="integrations" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => onNavigate?.('xero-integration')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Xero
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Xero Account Mappings</h1>
              <p className="text-sm text-gray-600 mt-1">Map Xero chart of accounts to workpaper line items</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => {
                // Reset to defaults
                toast.info('Reset to Defaults');
              }}
            >
              Reset to Defaults
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSaveMappings}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Mappings
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-gray-50 border border-gray-300 rounded px-6 py-3">
          <div className="flex items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Total Accounts:</span>
              <span className="font-semibold text-gray-900">{mappings.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Mapped:</span>
              <span className="font-semibold text-green-600">{mappedCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Unmapped:</span>
              <span className="font-semibold text-orange-600">{unmappedCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Auto-Sync Enabled:</span>
              <span className="font-semibold text-blue-600">{autoSyncCount}</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white border border-gray-300 rounded px-4 py-2">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search accounts, codes, or line items..."
              className="flex-1 outline-none text-sm"
            />
          </div>
        </div>

        {/* Mappings Table */}
        <div className="border border-gray-300 rounded bg-white overflow-hidden">
          <table className="w-full text-sm border-collapse">
            {/* Header Row */}
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 w-8">Ref</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 w-24">Code</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Xero Account</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 w-16">→</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 w-48">Workpaper Section</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Workpaper Line Item</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-24">Auto-Sync</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-20">Status</th>
              </tr>
            </thead>

            {/* Data Rows Grouped by Type */}
            <tbody>
              {Object.entries(filteredMappings).map(([type, items]) => (
                <React.Fragment key={type}>
                  {/* Section Header Row */}
                  <tr 
                    className="bg-gray-100 cursor-pointer hover:bg-gray-200"
                    onClick={() => toggleSection(type)}
                  >
                    <td colSpan={8} className="border border-gray-300 px-3 py-2">
                      <div className="flex items-center gap-2">
                        {expandedSections.has(type) ? (
                          <ChevronDown className="w-4 h-4 text-gray-600" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-600" />
                        )}
                        <span className="font-semibold text-gray-900 uppercase text-xs">
                          {type} ({items.length})
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Mapping Rows */}
                  {expandedSections.has(type) && items.map((mapping) => (
                    <tr 
                      key={mapping.id} 
                      className={`hover:bg-gray-50 ${!mapping.mapped ? 'bg-orange-50' : ''}`}
                    >
                      <td className="border border-gray-300 px-3 py-2 text-center text-gray-600 font-mono text-xs">
                        {mapping.id.replace('M', '')}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-gray-700 font-mono text-xs">
                        {mapping.xeroAccountCode}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-gray-900">
                        {mapping.xeroAccount}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        <LinkIcon className="w-4 h-4 text-gray-400 mx-auto" />
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <select
                          value={mapping.workpaperSection}
                          onChange={(e) => handleMappingChange(mapping.id, 'workpaperSection', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Select section...</option>
                          <option value="Income Indiv. 1">Income Indiv. 1</option>
                          <option value="Income Indiv. 2">Income Indiv. 2</option>
                          <option value="Deductions Indiv. 1">Deductions Indiv. 1</option>
                          <option value="Deductions Indiv. 2">Deductions Indiv. 2</option>
                          <option value="Investment Income">Investment Income</option>
                          <option value="Rental Property 1">Rental Property 1</option>
                          <option value="Capital Gains">Capital Gains</option>
                        </select>
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <input
                          type="text"
                          value={mapping.workpaperLineItem}
                          onChange={(e) => handleMappingChange(mapping.id, 'workpaperLineItem', e.target.value)}
                          placeholder="Enter line item..."
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={mapping.autoSync}
                          onChange={(e) => handleMappingChange(mapping.id, 'autoSync', e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        {mapping.mapped ? (
                          <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-orange-600 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-300 rounded px-4 py-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">Mapping Instructions</h4>
              <ul className="text-sm text-blue-800 mt-1 space-y-1 list-disc pl-5">
                <li>Select the workpaper section and line item for each Xero account</li>
                <li>Enable Auto-Sync to automatically pull data during scheduled syncs</li>
                <li>Unmapped accounts (orange highlight) won't be imported</li>
                <li>You can map multiple Xero accounts to the same workpaper line (they'll be summed)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </WorkpaperLayout>
  );
}