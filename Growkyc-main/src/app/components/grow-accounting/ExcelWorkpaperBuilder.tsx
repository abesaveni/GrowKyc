import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  X,
  Plus,
  Check
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface ExcelWorkpaperBuilderProps {
  onNavigate?: (page: string) => void;
  jobId?: string;
}

interface Section {
  id: string;
  name: string;
  category: string;
  requiredDocs: number;
  notes: string;
}

interface SelectedSection {
  id: string;
  section: Section;
  order: number;
  owner: string;
  dueDate: string;
  includeInChecklist: boolean;
}

type EntityType = 'individual' | 'company' | 'trust' | 'smsf';

export function ExcelWorkpaperBuilder({ onNavigate, jobId = 'JOB-2024-003' }: ExcelWorkpaperBuilderProps) {
  const [selectedEntity, setSelectedEntity] = useState<EntityType>('individual');
  const [selectedYear, setSelectedYear] = useState('FY2024');
  const [selectedSections, setSelectedSections] = useState<SelectedSection[]>([]);

  // Section libraries by entity type
  const sectionLibraries: Record<EntityType, Section[]> = {
    individual: [
      // Income + Deductions
      { id: 'ind-1', name: 'Income Indiv. 1', category: 'Income + Deductions', requiredDocs: 3, notes: 'Employment income' },
      { id: 'ind-2', name: 'Deductions Indiv. 1', category: 'Income + Deductions', requiredDocs: 2, notes: 'Work expenses' },
      { id: 'ind-3', name: 'Income Indiv. 2', category: 'Income + Deductions', requiredDocs: 3, notes: 'Spouse income' },
      { id: 'ind-4', name: 'Deductions Indiv. 2', category: 'Income + Deductions', requiredDocs: 2, notes: 'Spouse expenses' },
      // Investments
      { id: 'ind-5', name: 'Investment Income', category: 'Investments', requiredDocs: 4, notes: 'Interest, dividends' },
      { id: 'ind-6', name: 'Shares', category: 'Investments', requiredDocs: 2, notes: 'Share portfolio' },
      { id: 'ind-7', name: 'Rental Property 1', category: 'Investments', requiredDocs: 5, notes: 'Property schedule' },
      { id: 'ind-8', name: 'Rental Property 2', category: 'Investments', requiredDocs: 5, notes: 'Property schedule' },
      { id: 'ind-9', name: 'Property CGT', category: 'Investments', requiredDocs: 3, notes: 'Capital gains' },
      // Business
      { id: 'ind-10', name: 'PSI', category: 'Business (Individual)', requiredDocs: 2, notes: 'Personal services' },
      { id: 'ind-11', name: 'Business 1', category: 'Business (Individual)', requiredDocs: 6, notes: 'Sole trader' },
      { id: 'ind-12', name: 'Business 2', category: 'Business (Individual)', requiredDocs: 6, notes: 'Partnership' },
      { id: 'ind-13', name: 'Business Schedule', category: 'Business (Individual)', requiredDocs: 4, notes: 'Income/expenses' },
      { id: 'ind-14', name: 'Sales Reconciliation', category: 'Business (Individual)', requiredDocs: 3, notes: 'Sales analysis' },
      // BAS
      { id: 'ind-15', name: 'BAS-GST Reconciliation', category: 'BAS + ATO', requiredDocs: 4, notes: 'Quarterly BAS' },
      { id: 'ind-16', name: 'BAS Lodged', category: 'BAS + ATO', requiredDocs: 1, notes: 'Lodgement history' },
      // Finalisation
      { id: 'ind-17', name: 'Tax Summary', category: 'Finalisation', requiredDocs: 0, notes: 'Return summary' },
      { id: 'ind-18', name: 'Signoff', category: 'Finalisation', requiredDocs: 0, notes: 'Final signoff' }
    ],
    company: [
      // Governance
      { id: 'co-1', name: 'ASIC Extract', category: 'Governance', requiredDocs: 1, notes: 'Company details' },
      { id: 'co-2', name: 'Director Details', category: 'Governance', requiredDocs: 1, notes: 'Director register' },
      { id: 'co-3', name: 'Shareholders and Dividends', category: 'Governance', requiredDocs: 2, notes: 'Share register' },
      { id: 'co-4', name: 'Div 7A Loans', category: 'Governance', requiredDocs: 3, notes: 'Loan compliance' },
      { id: 'co-5', name: 'Minutes and Resolutions', category: 'Governance', requiredDocs: 2, notes: 'AGM minutes' },
      // Financial Statements
      { id: 'co-6', name: 'Trial Balance', category: 'Financial Statements', requiredDocs: 1, notes: 'TB report' },
      { id: 'co-7', name: 'Balance Sheet', category: 'Financial Statements', requiredDocs: 3, notes: 'BS workings' },
      { id: 'co-8', name: 'Profit and Loss', category: 'Financial Statements', requiredDocs: 3, notes: 'P&L workings' },
      { id: 'co-9', name: 'General Ledger', category: 'Financial Statements', requiredDocs: 1, notes: 'GL review' },
      { id: 'co-10', name: 'Journals', category: 'Financial Statements', requiredDocs: 2, notes: 'Adjustments' },
      // Tax
      { id: 'co-11', name: 'Tax Reconciliation', category: 'Tax and Compliance', requiredDocs: 2, notes: 'Tax calc' },
      { id: 'co-12', name: 'Depreciation', category: 'Tax and Compliance', requiredDocs: 1, notes: 'Depn schedule' },
      { id: 'co-13', name: 'Prepayments', category: 'Tax and Compliance', requiredDocs: 2, notes: 'Prepaids' },
      { id: 'co-14', name: 'Provisions', category: 'Tax and Compliance', requiredDocs: 1, notes: 'Provisions' },
      { id: 'co-15', name: 'Franking Account', category: 'Tax and Compliance', requiredDocs: 1, notes: 'Franking' },
      // GST
      { id: 'co-16', name: 'BAS-GST Reconciliation', category: 'BAS + GST', requiredDocs: 4, notes: 'GST rec' },
      { id: 'co-17', name: 'BAS Lodged', category: 'BAS + GST', requiredDocs: 1, notes: 'BAS history' },
      // Loans
      { id: 'co-18', name: 'Loan Schedule', category: 'Loans + Finance', requiredDocs: 3, notes: 'Loan register' },
      { id: 'co-19', name: 'Related Party Loans', category: 'Loans + Finance', requiredDocs: 2, notes: 'RPT loans' }
    ],
    trust: [
      // Trust Core
      { id: 'tr-1', name: 'Trust Deed', category: 'Trust Core', requiredDocs: 2, notes: 'Deed + variations' },
      { id: 'tr-2', name: 'Trustee Details', category: 'Trust Core', requiredDocs: 1, notes: 'Trustee register' },
      { id: 'tr-3', name: 'Beneficiaries', category: 'Trust Core', requiredDocs: 1, notes: 'Beneficiary list' },
      { id: 'tr-4', name: 'Distribution Minutes', category: 'Trust Core', requiredDocs: 2, notes: 'Distribution res' },
      // Income
      { id: 'tr-5', name: 'Income Summary', category: 'Income + Distributions', requiredDocs: 2, notes: 'Trust income' },
      { id: 'tr-6', name: 'Distribution Register', category: 'Income + Distributions', requiredDocs: 1, notes: 'Distributions' },
      { id: 'tr-7', name: 'UPE Tracking', category: 'Income + Distributions', requiredDocs: 2, notes: 'Unpaid entitlements' },
      // Tax
      { id: 'tr-8', name: 'Tax Reconciliation', category: 'Tax and Compliance', requiredDocs: 2, notes: 'Tax calc' },
      { id: 'tr-9', name: 'Capital Gains', category: 'Tax and Compliance', requiredDocs: 2, notes: 'CGT summary' },
      // Financial Statements
      { id: 'tr-10', name: 'Trial Balance', category: 'Financial Statements', requiredDocs: 1, notes: 'TB report' },
      { id: 'tr-11', name: 'Balance Sheet', category: 'Financial Statements', requiredDocs: 3, notes: 'BS workings' },
      { id: 'tr-12', name: 'Profit and Loss', category: 'Financial Statements', requiredDocs: 3, notes: 'P&L workings' },
      // Investments
      { id: 'tr-13', name: 'Shares', category: 'Investments', requiredDocs: 3, notes: 'Share portfolio' },
      { id: 'tr-14', name: 'Property Schedule', category: 'Investments', requiredDocs: 4, notes: 'Properties' },
      { id: 'tr-15', name: 'Rental Income', category: 'Investments', requiredDocs: 5, notes: 'Rental schedule' }
    ],
    smsf: [
      // Fund Setup
      { id: 'sm-1', name: 'Trust Deed', category: 'Fund Setup', requiredDocs: 1, notes: 'SMSF deed' },
      { id: 'sm-2', name: 'Investment Strategy', category: 'Fund Setup', requiredDocs: 1, notes: 'Strategy doc' },
      { id: 'sm-3', name: 'Member Details', category: 'Fund Setup', requiredDocs: 2, notes: 'Member register' },
      { id: 'sm-4', name: 'Trustee Minutes', category: 'Fund Setup', requiredDocs: 2, notes: 'Minutes' },
      // Core SMSF
      { id: 'sm-5', name: 'Bank Reconciliation', category: 'Core SMSF', requiredDocs: 3, notes: 'Bank rec' },
      { id: 'sm-6', name: 'Contributions', category: 'Core SMSF', requiredDocs: 2, notes: 'CC and NCC' },
      { id: 'sm-7', name: 'Pension Accounts', category: 'Core SMSF', requiredDocs: 2, notes: 'Pension calcs' },
      { id: 'sm-8', name: 'Rollovers', category: 'Core SMSF', requiredDocs: 2, notes: 'Rollover docs' },
      { id: 'sm-9', name: 'Member Statements', category: 'Core SMSF', requiredDocs: 4, notes: 'Annual statements' },
      // Investments
      { id: 'sm-10', name: 'Listed Securities', category: 'Investments', requiredDocs: 3, notes: 'Share portfolio' },
      { id: 'sm-11', name: 'Property', category: 'Investments', requiredDocs: 5, notes: 'Property assets' },
      { id: 'sm-12', name: 'Term Deposits', category: 'Investments', requiredDocs: 2, notes: 'TD schedule' },
      // Tax + Compliance
      { id: 'sm-13', name: 'Tax Estimate', category: 'Tax + Compliance', requiredDocs: 1, notes: 'Tax calc' },
      { id: 'sm-14', name: 'Regulatory Checklist', category: 'Tax + Compliance', requiredDocs: 0, notes: 'Compliance' },
      { id: 'sm-15', name: 'Auditor Pack', category: 'Tax + Compliance', requiredDocs: 5, notes: 'Audit docs' },
      { id: 'sm-16', name: 'Annual Return', category: 'Tax + Compliance', requiredDocs: 2, notes: 'SAR support' }
    ]
  };

  const currentSections = sectionLibraries[selectedEntity];
  
  // Group sections by category
  const categorizedSections = currentSections.reduce((acc, section) => {
    if (!acc[section.category]) {
      acc[section.category] = [];
    }
    acc[section.category].push(section);
    return acc;
  }, {} as Record<string, Section[]>);

  const handleToggleSection = (section: Section) => {
    const exists = selectedSections.find(s => s.section.id === section.id);
    if (exists) {
      setSelectedSections(selectedSections.filter(s => s.section.id !== section.id));
    } else {
      setSelectedSections([
        ...selectedSections,
        {
          id: `sel-${section.id}`,
          section,
          order: selectedSections.length + 1,
          owner: '',
          dueDate: '',
          includeInChecklist: true
        }
      ]);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...selectedSections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    newSections.forEach((s, i) => s.order = i + 1);
    setSelectedSections(newSections);
  };

  const handleMoveDown = (index: number) => {
    if (index === selectedSections.length - 1) return;
    const newSections = [...selectedSections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    newSections.forEach((s, i) => s.order = i + 1);
    setSelectedSections(newSections);
  };

  const isSectionSelected = (sectionId: string) => {
    return selectedSections.some(s => s.section.id === sectionId);
  };

  return (
    <WorkpaperLayout currentPage="workpapers" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate?.('jobs')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-slate-100">Workpaper Builder</h1>
              <p className="text-sm text-slate-300 mt-1">Select sections for this job</p>
            </div>
          </div>
        </div>

        {/* Entity & Year Selectors */}
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Entity Type</label>
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value as EntityType)}
              className="px-3 py-2 border border-white/10 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="individual">Individual</option>
              <option value="company">Company</option>
              <option value="trust">Trust</option>
              <option value="smsf">SMSF</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Financial Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-white/10 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="FY2024">FY2024</option>
              <option value="FY2023">FY2023</option>
              <option value="FY2022">FY2022</option>
            </select>
          </div>
        </div>

        {/* Two-Table Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* LEFT: Section Library */}
          <div className="border border-white/10 rounded bg-white">
            <div className="bg-white/5 border-b border-white/10 px-4 py-2">
              <h3 className="font-semibold text-slate-100">Section Library</h3>
            </div>
            <div className="overflow-auto" style={{ maxHeight: '600px' }}>
              <table className="w-full text-sm">
                <thead className="bg-white/5 sticky top-0">
                  <tr className="border-b border-white/10">
                    <th className="px-2 py-2 text-left font-semibold text-slate-300 w-8"></th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-300">Section Name</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-300 w-32">Category</th>
                    <th className="px-3 py-2 text-center font-semibold text-slate-300 w-24">Req. Docs</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(categorizedSections).map(([category, sections]) => (
                    <React.Fragment key={category}>
                      {/* Category Header Row */}
                      <tr className="bg-white/5">
                        <td colSpan={4} className="px-3 py-2 font-semibold text-slate-100 text-xs uppercase tracking-wider border-t border-b border-white/10">
                          {category}
                        </td>
                      </tr>
                      {/* Section Rows */}
                      {sections.map((section) => {
                        const isSelected = isSectionSelected(section.id);
                        return (
                          <tr 
                            key={section.id}
                            className={`border-b border-white/10 hover:bg-white/5 cursor-pointer ${
                              isSelected ? 'bg-blue-500/10' : ''
                            }`}
                            onClick={() => handleToggleSection(section)}
                          >
                            <td className="px-2 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="w-4 h-4 rounded border-white/10 text-blue-400 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-3 py-2 text-slate-100">{section.name}</td>
                            <td className="px-3 py-2 text-slate-300 text-xs">{section.category}</td>
                            <td className="px-3 py-2 text-center text-slate-100 font-mono">{section.requiredDocs}</td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT: Selected Sections */}
          <div className="border border-white/10 rounded bg-white">
            <div className="bg-white/5 border-b border-white/10 px-4 py-2">
              <h3 className="font-semibold text-slate-100">Selected Sections ({selectedSections.length})</h3>
            </div>
            <div className="overflow-auto" style={{ maxHeight: '600px' }}>
              {selectedSections.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <p>No sections selected</p>
                  <p className="text-xs mt-1">Select sections from the left table</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-white/5 sticky top-0">
                    <tr className="border-b border-white/10">
                      <th className="px-2 py-2 text-left font-semibold text-slate-300 w-16">Order</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-300">Section</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-300 w-32">Owner</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-300 w-24">Due</th>
                      <th className="px-2 py-2 text-center font-semibold text-slate-300 w-20">Checklist</th>
                      <th className="px-2 py-2 text-center font-semibold text-slate-300 w-20"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSections.map((selected, index) => (
                      <tr key={selected.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMoveUp(index)}
                              disabled={index === 0}
                              className="p-0.5 hover:bg-white/10 rounded disabled:opacity-30"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleMoveDown(index)}
                              disabled={index === selectedSections.length - 1}
                              className="p-0.5 hover:bg-white/10 rounded disabled:opacity-30"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <span className="ml-1 text-slate-300 font-mono">{selected.order}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-slate-100">{selected.section.name}</td>
                        <td className="px-3 py-2">
                          <select 
                            className="w-full px-2 py-1 text-xs border border-white/10 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={selected.owner}
                            onChange={(e) => {
                              const newSections = [...selectedSections];
                              newSections[index].owner = e.target.value;
                              setSelectedSections(newSections);
                            }}
                          >
                            <option value="">Unassigned</option>
                            <option value="Mike Brown">Mike Brown</option>
                            <option value="Sarah Johnson">Sarah Johnson</option>
                            <option value="Emily Davis">Emily Davis</option>
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="date"
                            className="w-full px-2 py-1 text-xs border border-white/10 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={selected.dueDate}
                            onChange={(e) => {
                              const newSections = [...selectedSections];
                              newSections[index].dueDate = e.target.value;
                              setSelectedSections(newSections);
                            }}
                          />
                        </td>
                        <td className="px-2 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={selected.includeInChecklist}
                            onChange={(e) => {
                              const newSections = [...selectedSections];
                              newSections[index].includeInChecklist = e.target.checked;
                              setSelectedSections(newSections);
                            }}
                            className="w-4 h-4 rounded border-white/10 text-blue-400 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-2 py-2 text-center">
                          <button
                            onClick={() => handleToggleSection(selected.section)}
                            className="p-1 hover:bg-white/10 rounded"
                          >
                            <X className="w-4 h-4 text-slate-300" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-300">
            {selectedSections.length} sections selected
          </p>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={selectedSections.length === 0}
            onClick={() => onNavigate?.('workpaper-detail')}
          >
            <Check className="w-4 h-4 mr-2" />
            Create Workpaper
          </Button>
        </div>
      </div>
    </WorkpaperLayout>
  );
}
