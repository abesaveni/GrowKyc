import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  RefreshCw,
  Save,
  Download
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';
import { toast } from 'sonner';

interface XeroAccountMappingProps {
  onNavigate?: (page: string) => void;
}

interface AccountMapping {
  id: string;
  workpaperLine: string;
  workpaperSection: string;
  xeroAccountCode: string;
  xeroAccountName: string;
  currentYearBalance: number;
  priorYearBalance: number;
  status: 'mapped' | 'unmapped' | 'conflict';
  autoMapped: boolean;
}

export function XeroAccountMapping({ onNavigate }: XeroAccountMappingProps) {
  const [mappings, setMappings] = useState<AccountMapping[]>([
    {
      id: 'M1',
      workpaperLine: 'Salary & Wages',
      workpaperSection: 'Income Indiv. 1',
      xeroAccountCode: '200',
      xeroAccountName: 'Sales - General',
      currentYearBalance: 125000,
      priorYearBalance: 108500,
      status: 'mapped',
      autoMapped: true
    },
    {
      id: 'M2',
      workpaperLine: 'Interest Income',
      workpaperSection: 'Income Indiv. 1',
      xeroAccountCode: '270',
      xeroAccountName: 'Interest Income',
      currentYearBalance: 2450,
      priorYearBalance: 2100,
      status: 'mapped',
      autoMapped: true
    },
    {
      id: 'M3',
      workpaperLine: 'Dividend Income - Franked',
      workpaperSection: 'Income Indiv. 1',
      xeroAccountCode: '275',
      xeroAccountName: 'Dividend Income',
      currentYearBalance: 8900,
      priorYearBalance: 8400,
      status: 'mapped',
      autoMapped: false
    },
    {
      id: 'M4',
      workpaperLine: 'Rental Income',
      workpaperSection: 'Rental Property 1',
      xeroAccountCode: '',
      xeroAccountName: '',
      currentYearBalance: 0,
      priorYearBalance: 0,
      status: 'unmapped',
      autoMapped: false
    },
    {
      id: 'M5',
      workpaperLine: 'Work Related Expenses',
      workpaperSection: 'Deductions Indiv. 1',
      xeroAccountCode: '400',
      xeroAccountName: 'Advertising',
      currentYearBalance: 3500,
      priorYearBalance: 2800,
      status: 'conflict',
      autoMapped: true
    }
  ]);

  const handleSync = () => {
    toast.info('Syncing from Xero...', {
      description: 'Pulling latest account balances'
    });
    
    setTimeout(() => {
      toast.success('Sync complete', {
        description: 'All mapped accounts updated'
      });
    }, 2000);
  };

  const handleSaveMappings = () => {
    toast.success('Mappings saved', {
      description: 'Account mappings have been updated'
    });
  };

  const mappedCount = mappings.filter(m => m.status === 'mapped').length;
  const unmappedCount = mappings.filter(m => m.status === 'unmapped').length;
  const conflictCount = mappings.filter(m => m.status === 'conflict').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'mapped':
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">Mapped</span>;
      case 'unmapped':
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded">Unmapped</span>;
      case 'conflict':
        return <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded">Conflict</span>;
      default:
        return null;
    }
  };

  return (
    <WorkpaperLayout currentPage="integrations" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => onNavigate?.('integrations')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Integrations
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Xero Account Mapping</h1>
              <p className="text-sm text-gray-600 mt-1">Map Xero chart of accounts to workpaper line items</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSync}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync from Xero
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveMappings}>
              <Save className="w-4 h-4 mr-2" />
              Save Mappings
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-gray-50 border border-gray-300 rounded px-6 py-3">
          <div className="flex items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Mapped:</span>
              <span className="font-semibold text-green-600">{mappedCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Unmapped:</span>
              <span className="font-semibold text-gray-600">{unmappedCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Conflicts:</span>
              <span className="font-semibold text-orange-600">{conflictCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Progress:</span>
              <span className="font-semibold text-blue-600">
                {Math.round((mappedCount / mappings.length) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded px-4 py-3">
          <div className="flex items-start gap-3">
            <LinkIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">How Account Mapping Works</h3>
              <p className="text-sm text-blue-800">
                Link Xero chart of accounts to workpaper fields. When you sync, balances automatically populate into workpapers. 
                AI suggests mappings based on account names and types.
              </p>
            </div>
          </div>
        </div>

        {/* Mapping Table */}
        <div className="border border-gray-300 rounded bg-white overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-300 px-4 py-2">
            <h3 className="font-semibold text-gray-900">Account Mappings</h3>
          </div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 w-8">Ref</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 w-40">WP Section</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">WP Line Item</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 w-24">Xero Code</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Xero Account</th>
                <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700 w-28">Current Bal.</th>
                <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700 w-28">Prior Bal.</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-24">Status</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-16">Auto</th>
              </tr>
            </thead>
            <tbody>
              {mappings.map((mapping) => (
                <tr 
                  key={mapping.id}
                  className={`hover:bg-gray-50 ${
                    mapping.status === 'mapped' ? 'bg-green-50' :
                    mapping.status === 'conflict' ? 'bg-orange-50' : ''
                  }`}
                >
                  <td className="border border-gray-300 px-3 py-2 text-center text-gray-600 font-mono text-xs">
                    {mapping.id}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-700 text-xs">
                    {mapping.workpaperSection}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-900">
                    {mapping.workpaperLine}
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <input
                      type="text"
                      value={mapping.xeroAccountCode}
                      onChange={(e) => {
                        const newMappings = [...mappings];
                        const index = mappings.findIndex(m => m.id === mapping.id);
                        newMappings[index].xeroAccountCode = e.target.value;
                        setMappings(newMappings);
                      }}
                      placeholder="Code"
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      value={mapping.xeroAccountName}
                      onChange={(e) => {
                        const newMappings = [...mappings];
                        const index = mappings.findIndex(m => m.id === mapping.id);
                        newMappings[index].xeroAccountName = e.target.value;
                        setMappings(newMappings);
                      }}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select account...</option>
                      <option value="Sales - General">200 - Sales - General</option>
                      <option value="Interest Income">270 - Interest Income</option>
                      <option value="Dividend Income">275 - Dividend Income</option>
                      <option value="Rental Income">280 - Rental Income</option>
                      <option value="Advertising">400 - Advertising</option>
                      <option value="Bank Fees">404 - Bank Fees</option>
                      <option value="Office Expenses">429 - Office Expenses</option>
                    </select>
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-900">
                    {mapping.currentYearBalance > 0 ? mapping.currentYearBalance.toLocaleString() : '-'}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-600">
                    {mapping.priorYearBalance > 0 ? mapping.priorYearBalance.toLocaleString() : '-'}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    {getStatusBadge(mapping.status)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    {mapping.autoMapped && (
                      <CheckCircle className="w-4 h-4 text-green-600 mx-auto" title="AI auto-mapped" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Conflict Resolution */}
        {conflictCount > 0 && (
          <div className="bg-orange-50 border border-orange-300 rounded px-4 py-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-900 mb-1">Mapping Conflicts Detected</h3>
                <p className="text-sm text-orange-800">
                  {conflictCount} mapping{conflictCount > 1 ? 's' : ''} require attention. 
                  The selected Xero account may not match the workpaper line item type. Review and update as needed.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </WorkpaperLayout>
  );
}
