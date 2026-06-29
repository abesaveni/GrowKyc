import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Save,
  Search,
  Plus,
  Check,
  GripVertical,
  Trash2,
  FileText,
  Users,
  Calendar,
  ChevronRight,
  Zap,
  AlertCircle,
  Edit
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface WorkpaperBuilderProps {
  onNavigate?: (page: string) => void;
  jobId?: string;
}

interface Section {
  id: string;
  name: string;
  group: string;
  hint?: string;
  requiredDocs?: number;
  isCore?: boolean;
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

export function WorkpaperBuilder({ onNavigate, jobId = 'JOB-2024-003' }: WorkpaperBuilderProps) {
  const [selectedEntity, setSelectedEntity] = useState<EntityType>('individual');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSections, setSelectedSections] = useState<SelectedSection[]>([]);

  // Section libraries by entity type
  const sectionLibraries: Record<EntityType, Section[]> = {
    individual: [
      // Shared sections
      { id: 'shared-1', name: 'Client Retention Checklist', group: 'Admin + Client Comms', requiredDocs: 0, isCore: true },
      { id: 'shared-2', name: 'Checklist', group: 'Admin + Client Comms', requiredDocs: 0, isCore: true },
      { id: 'shared-3', name: 'Materials Requested', group: 'Admin + Client Comms', requiredDocs: 0 },
      { id: 'shared-4', name: 'Queries', group: 'Admin + Client Comms', requiredDocs: 0 },
      { id: 'shared-5', name: 'Source Documents', group: 'Admin + Client Comms', requiredDocs: 5 },
      { id: 'shared-6', name: 'ATO Prefill', group: 'ATO + Prefill', requiredDocs: 0, isCore: true },
      { id: 'shared-7', name: 'ATO Reports', group: 'ATO + Prefill', requiredDocs: 0 },
      { id: 'shared-8', name: 'ATO Notices', group: 'ATO + Prefill', requiredDocs: 0 },
      { id: 'shared-9', name: 'ATO Accounts', group: 'ATO + Prefill', requiredDocs: 0 },
      { id: 'shared-10', name: 'Tax Summary', group: 'Finalisation', requiredDocs: 0, isCore: true },
      { id: 'shared-11', name: 'Carry Forward Notes', group: 'Finalisation', requiredDocs: 0 },
      { id: 'shared-12', name: 'Final Review Notes', group: 'Finalisation', requiredDocs: 0, isCore: true },
      { id: 'shared-13', name: 'Signoff', group: 'Finalisation', requiredDocs: 0, isCore: true },
      
      // Individual specific
      { id: 'ind-1', name: 'Income Indiv. 1', group: 'Income + Deductions', requiredDocs: 3, isCore: true },
      { id: 'ind-2', name: 'Deductions Indiv. 1', group: 'Income + Deductions', requiredDocs: 2, isCore: true },
      { id: 'ind-3', name: 'Income Indiv. 2', group: 'Income + Deductions', requiredDocs: 3 },
      { id: 'ind-4', name: 'Deductions Indiv. 2', group: 'Income + Deductions', requiredDocs: 2 },
      { id: 'ind-5', name: 'Investment Income', group: 'Investments', requiredDocs: 4 },
      { id: 'ind-6', name: 'Shares', group: 'Investments', requiredDocs: 2 },
      { id: 'ind-7', name: 'Rental Property 1', group: 'Investments', requiredDocs: 5 },
      { id: 'ind-8', name: 'Rental Property 2', group: 'Investments', requiredDocs: 5 },
      { id: 'ind-9', name: 'Property CGT', group: 'Investments', requiredDocs: 3 },
      { id: 'ind-10', name: 'PSI', group: 'Business (Individual)', requiredDocs: 2 },
      { id: 'ind-11', name: 'Business 1', group: 'Business (Individual)', requiredDocs: 6 },
      { id: 'ind-12', name: 'Business 2', group: 'Business (Individual)', requiredDocs: 6 },
      { id: 'ind-13', name: 'Business Schedule', group: 'Business (Individual)', requiredDocs: 4 },
      { id: 'ind-14', name: 'Business Schedule Summary', group: 'Business (Individual)', requiredDocs: 1 },
      { id: 'ind-15', name: 'Sales Reconciliation', group: 'Business (Individual)', requiredDocs: 3 },
      { id: 'ind-16', name: 'BAS-GST Reconciliation', group: 'BAS + ATO Accounts', requiredDocs: 4 },
      { id: 'ind-17', name: 'BAS Lodged', group: 'BAS + ATO Accounts', requiredDocs: 1 },
      { id: 'ind-18', name: 'ATO - ICA', group: 'BAS + ATO Accounts', requiredDocs: 1 },
      { id: 'ind-19', name: 'ATO - ITA', group: 'BAS + ATO Accounts', requiredDocs: 1 },
      { id: 'ind-20', name: 'HP - Chattel Mortgages', group: 'Finance Schedules', requiredDocs: 2 },
      { id: 'ind-21', name: 'Loan Schedule 1', group: 'Finance Schedules', requiredDocs: 3 },
      { id: 'ind-22', name: 'Loan Schedule 2', group: 'Finance Schedules', requiredDocs: 3 },
      { id: 'ind-23', name: 'Borrowing Costs', group: 'Finance Schedules', requiredDocs: 2 }
    ],
    company: [
      // Shared sections
      { id: 'shared-1', name: 'Client Retention Checklist', group: 'Admin + Client Comms', requiredDocs: 0, isCore: true },
      { id: 'shared-2', name: 'Checklist', group: 'Admin + Client Comms', requiredDocs: 0, isCore: true },
      { id: 'shared-3', name: 'Materials Requested', group: 'Admin + Client Comms', requiredDocs: 0 },
      { id: 'shared-4', name: 'Queries', group: 'Admin + Client Comms', requiredDocs: 0 },
      { id: 'shared-5', name: 'Source Documents', group: 'Admin + Client Comms', requiredDocs: 5 },
      { id: 'shared-6', name: 'ATO Prefill', group: 'ATO + Prefill', requiredDocs: 0, isCore: true },
      { id: 'shared-7', name: 'ATO Reports', group: 'ATO + Prefill', requiredDocs: 0 },
      { id: 'shared-8', name: 'ATO Notices', group: 'ATO + Prefill', requiredDocs: 0 },
      { id: 'shared-9', name: 'ATO Accounts', group: 'ATO + Prefill', requiredDocs: 0 },
      { id: 'shared-10', name: 'Tax Summary', group: 'Finalisation', requiredDocs: 0, isCore: true },
      { id: 'shared-11', name: 'Carry Forward Notes', group: 'Finalisation', requiredDocs: 0 },
      { id: 'shared-12', name: 'Final Review Notes', group: 'Finalisation', requiredDocs: 0, isCore: true },
      { id: 'shared-13', name: 'Signoff', group: 'Finalisation', requiredDocs: 0, isCore: true },
      
      // Company specific
      { id: 'co-1', name: 'ASIC Extract', group: 'Entity + Governance', requiredDocs: 1, isCore: true },
      { id: 'co-2', name: 'Director Details', group: 'Entity + Governance', requiredDocs: 1, isCore: true },
      { id: 'co-3', name: 'Shareholders and Dividends', group: 'Entity + Governance', requiredDocs: 2, isCore: true },
      { id: 'co-4', name: 'Div 7A Loans and Compliance', group: 'Entity + Governance', requiredDocs: 3 },
      { id: 'co-5', name: 'Minutes and Resolutions', group: 'Entity + Governance', requiredDocs: 2 },
      { id: 'co-6', name: 'Trial Balance', group: 'Financial Statements', requiredDocs: 1, isCore: true },
      { id: 'co-7', name: 'Balance Sheet Workings', group: 'Financial Statements', requiredDocs: 3, isCore: true },
      { id: 'co-8', name: 'Profit and Loss Workings', group: 'Financial Statements', requiredDocs: 3, isCore: true },
      { id: 'co-9', name: 'General Ledger Review', group: 'Financial Statements', requiredDocs: 1 },
      { id: 'co-10', name: 'Journals and Adjustments', group: 'Financial Statements', requiredDocs: 2 },
      { id: 'co-11', name: 'Company Tax Reconciliation', group: 'Tax and Compliance', requiredDocs: 2, isCore: true },
      { id: 'co-12', name: 'Depreciation Schedule', group: 'Tax and Compliance', requiredDocs: 1, isCore: true },
      { id: 'co-13', name: 'Prepayments and Accruals', group: 'Tax and Compliance', requiredDocs: 2 },
      { id: 'co-14', name: 'Provisions', group: 'Tax and Compliance', requiredDocs: 1 },
      { id: 'co-15', name: 'Income Tax Payable', group: 'Tax and Compliance', requiredDocs: 1, isCore: true },
      { id: 'co-16', name: 'Franking Account', group: 'Tax and Compliance', requiredDocs: 1 },
      { id: 'co-17', name: 'R&D or Tax Concessions', group: 'Tax and Compliance', requiredDocs: 3 },
      { id: 'co-18', name: 'STP Reconciliation', group: 'Payroll + Super', requiredDocs: 2 },
      { id: 'co-19', name: 'Payroll Reconciliation', group: 'Payroll + Super', requiredDocs: 2 },
      { id: 'co-20', name: 'Super Guarantee Review', group: 'Payroll + Super', requiredDocs: 1 },
      { id: 'co-21', name: 'BAS-GST Reconciliation', group: 'BAS + GST', requiredDocs: 4, isCore: true },
      { id: 'co-22', name: 'BAS Lodged', group: 'BAS + GST', requiredDocs: 1 },
      { id: 'co-23', name: 'GST Adjustments', group: 'BAS + GST', requiredDocs: 2 },
      { id: 'co-24', name: 'Loan Schedule', group: 'Loans + Finance', requiredDocs: 3 },
      { id: 'co-25', name: 'Interest and Borrowing Costs', group: 'Loans + Finance', requiredDocs: 2 },
      { id: 'co-26', name: 'Related Party Loans', group: 'Loans + Finance', requiredDocs: 2 }
    ],
    trust: [
      // Shared sections
      { id: 'shared-1', name: 'Client Retention Checklist', group: 'Admin + Client Comms', requiredDocs: 0, isCore: true },
      { id: 'shared-2', name: 'Checklist', group: 'Admin + Client Comms', requiredDocs: 0, isCore: true },
      { id: 'shared-3', name: 'Materials Requested', group: 'Admin + Client Comms', requiredDocs: 0 },
      { id: 'shared-4', name: 'Queries', group: 'Admin + Client Comms', requiredDocs: 0 },
      { id: 'shared-5', name: 'Source Documents', group: 'Admin + Client Comms', requiredDocs: 5 },
      { id: 'shared-6', name: 'ATO Prefill', group: 'ATO + Prefill', requiredDocs: 0, isCore: true },
      { id: 'shared-7', name: 'ATO Reports', group: 'ATO + Prefill', requiredDocs: 0 },
      { id: 'shared-8', name: 'ATO Notices', group: 'ATO + Prefill', requiredDocs: 0 },
      { id: 'shared-9', name: 'ATO Accounts', group: 'ATO + Prefill', requiredDocs: 0 },
      { id: 'shared-10', name: 'Tax Summary', group: 'Finalisation', requiredDocs: 0, isCore: true },
      { id: 'shared-11', name: 'Carry Forward Notes', group: 'Finalisation', requiredDocs: 0 },
      { id: 'shared-12', name: 'Final Review Notes', group: 'Finalisation', requiredDocs: 0, isCore: true },
      { id: 'shared-13', name: 'Signoff', group: 'Finalisation', requiredDocs: 0, isCore: true },
      
      // Trust specific
      { id: 'tr-1', name: 'Trust Deed and Variations', group: 'Trust Core', requiredDocs: 2, isCore: true },
      { id: 'tr-2', name: 'Trustee Details', group: 'Trust Core', requiredDocs: 1, isCore: true },
      { id: 'tr-3', name: 'Beneficiaries Register', group: 'Trust Core', requiredDocs: 1, isCore: true },
      { id: 'tr-4', name: 'Distribution Minutes', group: 'Trust Core', requiredDocs: 2, isCore: true },
      { id: 'tr-5', name: 'Trust Income Summary', group: 'Income + Distributions', requiredDocs: 2, isCore: true },
      { id: 'tr-6', name: 'Distribution Register', group: 'Income + Distributions', requiredDocs: 1, isCore: true },
      { id: 'tr-7', name: 'Present Entitlement (UPE) Tracking', group: 'Income + Distributions', requiredDocs: 2 },
      { id: 'tr-8', name: 'Trust Tax Reconciliation', group: 'Tax and Compliance', requiredDocs: 2, isCore: true },
      { id: 'tr-9', name: 'Capital Gains Summary', group: 'Tax and Compliance', requiredDocs: 2 },
      { id: 'tr-10', name: 'Streaming Elections', group: 'Tax and Compliance', requiredDocs: 1 },
      { id: 'tr-11', name: 'Trial Balance', group: 'Financial Statements', requiredDocs: 1, isCore: true },
      { id: 'tr-12', name: 'Balance Sheet Workings', group: 'Financial Statements', requiredDocs: 3, isCore: true },
      { id: 'tr-13', name: 'Profit and Loss Workings', group: 'Financial Statements', requiredDocs: 3, isCore: true },
      { id: 'tr-14', name: 'Journals and Adjustments', group: 'Financial Statements', requiredDocs: 2 },
      { id: 'tr-15', name: 'Shares and Distributions', group: 'Investments', requiredDocs: 3 },
      { id: 'tr-16', name: 'Managed Funds', group: 'Investments', requiredDocs: 2 },
      { id: 'tr-17', name: 'Property Schedule', group: 'Investments', requiredDocs: 4 },
      { id: 'tr-18', name: 'Rental Property Schedule', group: 'Investments', requiredDocs: 5 },
      { id: 'tr-19', name: 'BAS-GST Reconciliation', group: 'BAS + GST', requiredDocs: 4 },
      { id: 'tr-20', name: 'BAS Lodged', group: 'BAS + GST', requiredDocs: 1 },
      { id: 'tr-21', name: 'GST Adjustments', group: 'BAS + GST', requiredDocs: 2 }
    ],
    smsf: [
      // Shared sections
      { id: 'shared-1', name: 'Client Retention Checklist', group: 'Admin + Client Comms', requiredDocs: 0, isCore: true },
      { id: 'shared-2', name: 'Checklist', group: 'Admin + Client Comms', requiredDocs: 0, isCore: true },
      { id: 'shared-3', name: 'Materials Requested', group: 'Admin + Client Comms', requiredDocs: 0 },
      { id: 'shared-4', name: 'Queries', group: 'Admin + Client Comms', requiredDocs: 0 },
      { id: 'shared-5', name: 'Source Documents', group: 'Admin + Client Comms', requiredDocs: 5 },
      { id: 'shared-6', name: 'ATO Prefill', group: 'ATO + Prefill', requiredDocs: 0, isCore: true },
      { id: 'shared-7', name: 'ATO Reports', group: 'ATO + Prefill', requiredDocs: 0 },
      { id: 'shared-8', name: 'ATO Notices', group: 'ATO + Prefill', requiredDocs: 0 },
      { id: 'shared-9', name: 'ATO Accounts', group: 'ATO + Prefill', requiredDocs: 0 },
      { id: 'shared-10', name: 'Tax Summary', group: 'Finalisation', requiredDocs: 0, isCore: true },
      { id: 'shared-11', name: 'Carry Forward Notes', group: 'Finalisation', requiredDocs: 0 },
      { id: 'shared-12', name: 'Final Review Notes', group: 'Finalisation', requiredDocs: 0, isCore: true },
      { id: 'shared-13', name: 'Signoff', group: 'Finalisation', requiredDocs: 0, isCore: true },
      
      // SMSF specific
      { id: 'sm-1', name: 'Trust Deed', group: 'Fund Setup', requiredDocs: 1, isCore: true },
      { id: 'sm-2', name: 'Investment Strategy', group: 'Fund Setup', requiredDocs: 1, isCore: true },
      { id: 'sm-3', name: 'Member Details', group: 'Fund Setup', requiredDocs: 2, isCore: true },
      { id: 'sm-4', name: 'Trustee Minutes', group: 'Fund Setup', requiredDocs: 2, isCore: true },
      { id: 'sm-5', name: 'Bank Reconciliation', group: 'Core SMSF Workpapers', requiredDocs: 3, isCore: true },
      { id: 'sm-6', name: 'Contributions (CC and NCC)', group: 'Core SMSF Workpapers', requiredDocs: 2, isCore: true },
      { id: 'sm-7', name: 'Pension Accounts', group: 'Core SMSF Workpapers', requiredDocs: 2, isCore: true },
      { id: 'sm-8', name: 'Rollovers', group: 'Core SMSF Workpapers', requiredDocs: 2 },
      { id: 'sm-9', name: 'Member Statements', group: 'Core SMSF Workpapers', requiredDocs: 4, isCore: true },
      { id: 'sm-10', name: 'Listed Securities', group: 'Investments', requiredDocs: 3, isCore: true },
      { id: 'sm-11', name: 'Managed Funds', group: 'Investments', requiredDocs: 2 },
      { id: 'sm-12', name: 'Property', group: 'Investments', requiredDocs: 5 },
      { id: 'sm-13', name: 'Term Deposits', group: 'Investments', requiredDocs: 2 },
      { id: 'sm-14', name: 'Other Assets', group: 'Investments', requiredDocs: 2 },
      { id: 'sm-15', name: 'SMSF Tax Estimate', group: 'Tax + Compliance', requiredDocs: 1, isCore: true },
      { id: 'sm-16', name: 'NCC Test', group: 'Tax + Compliance', requiredDocs: 1 },
      { id: 'sm-17', name: 'Regulatory Checklist', group: 'Tax + Compliance', requiredDocs: 0, isCore: true },
      { id: 'sm-18', name: 'Auditor Pack', group: 'Tax + Compliance', requiredDocs: 5, isCore: true },
      { id: 'sm-19', name: 'Annual Return Support', group: 'Tax + Compliance', requiredDocs: 2, isCore: true },
      { id: 'sm-20', name: 'Audit Trail Summary', group: 'Admin + Audit', requiredDocs: 0 },
      { id: 'sm-21', name: 'Evidence Index', group: 'Admin + Audit', requiredDocs: 0 },
      { id: 'sm-22', name: 'Final Signoff', group: 'Admin + Audit', requiredDocs: 0, isCore: true }
    ]
  };

  const currentSections = sectionLibraries[selectedEntity];
  
  // Group sections
  const groupedSections = currentSections.reduce((acc, section) => {
    if (!acc[section.group]) {
      acc[section.group] = [];
    }
    acc[section.group].push(section);
    return acc;
  }, {} as Record<string, Section[]>);

  // Filter sections based on search
  const filteredGroups = Object.entries(groupedSections).reduce((acc, [group, sections]) => {
    const filtered = sections.filter(section => 
      section.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[group] = filtered;
    }
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
          owner: 'Unassigned',
          dueDate: 'Not set',
          includeInChecklist: true
        }
      ]);
    }
  };

  const handleLoadCoreDefaults = () => {
    const coreSections = currentSections.filter(s => s.isCore);
    const newSelected = coreSections.map((section, index) => ({
      id: `sel-${section.id}`,
      section,
      order: index + 1,
      owner: 'Unassigned',
      dueDate: 'Not set',
      includeInChecklist: true
    }));
    setSelectedSections(newSelected);
  };

  const handleRemoveSection = (id: string) => {
    setSelectedSections(selectedSections.filter(s => s.id !== id));
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
              Back to Jobs
            </Button>
            <div>
              <h1 className="text-[32px] font-bold text-slate-100">Workpaper Builder</h1>
              <p className="text-sm text-slate-300 mt-1">Select sections to include in this job's workpaper template</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Sections
            </Button>
            <Button 
              className="bg-[#2855a6] hover:bg-[#1e4089]"
              onClick={() => onNavigate?.('workpaper-detail')}
            >
              <Save className="w-4 h-4 mr-2" />
              Save + Open Editor
            </Button>
          </div>
        </div>

        {/* Entity Type Tabs */}
        <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedEntity('individual')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedEntity === 'individual'
                    ? 'bg-[#2855a6] text-white shadow-md'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                Individual
              </button>
              <button
                onClick={() => setSelectedEntity('company')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedEntity === 'company'
                    ? 'bg-[#2855a6] text-white shadow-md'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                Company
              </button>
              <button
                onClick={() => setSelectedEntity('trust')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedEntity === 'trust'
                    ? 'bg-[#2855a6] text-white shadow-md'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                Trust
              </button>
              <button
                onClick={() => setSelectedEntity('smsf')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedEntity === 'smsf'
                    ? 'bg-[#2855a6] text-white shadow-md'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                SMSF
              </button>
              <div className="ml-auto">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLoadCoreDefaults}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Load Core Defaults
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two-Panel Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Section Library */}
          <div className="col-span-4">
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)] h-[calc(100vh-300px)] flex flex-col">
              <CardContent className="p-6 flex-1 overflow-auto">
                <div className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search sections..."
                      className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
                    />
                  </div>

                  {/* Section Groups */}
                  {Object.entries(filteredGroups).map(([group, sections]) => (
                    <div key={group}>
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        {group}
                      </h3>
                      <div className="space-y-1">
                        {sections.map((section) => {
                          const isSelected = isSectionSelected(section.id);
                          return (
                            <div
                              key={section.id}
                              onClick={() => handleToggleSection(section)}
                              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-blue-500/10 border-blue-300'
                                  : 'bg-white border-white/10 hover:border-[#2855a6] hover:bg-blue-500/10'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                  isSelected
                                    ? 'bg-[#2855a6] border-[#2855a6]'
                                    : 'border-white/10'
                                }`}>
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-slate-100">{section.name}</p>
                                    {section.isCore && (
                                      <span className="px-2 py-0.5 bg-green-500/15 text-green-300 text-xs font-semibold rounded">
                                        Core
                                      </span>
                                    )}
                                  </div>
                                  {section.hint && (
                                    <p className="text-xs text-slate-300 mt-1">{section.hint}</p>
                                  )}
                                  {section.requiredDocs && section.requiredDocs > 0 && (
                                    <p className="text-xs text-slate-400 mt-1">
                                      {section.requiredDocs} required docs
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Selected Sections */}
          <div className="col-span-8">
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)] h-[calc(100vh-300px)] flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-100">Selected Sections</h3>
                    <p className="text-sm text-slate-300">{selectedSections.length} sections selected</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Zap className="w-4 h-4 mr-2" />
                    Generate from Checklist
                  </Button>
                </div>

                {selectedSections.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-center">
                    <div>
                      <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-slate-300 mb-2">No sections selected yet</p>
                      <p className="text-sm text-slate-400">
                        Select sections from the left panel or click "Load Core Defaults"
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-auto">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-white/5 border-b border-white/10">
                        <tr>
                          <th className="text-left py-3 px-3 text-xs font-semibold text-slate-300 uppercase tracking-wider w-12">
                            Order
                          </th>
                          <th className="text-left py-3 px-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            Section
                          </th>
                          <th className="text-left py-3 px-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            Owner
                          </th>
                          <th className="text-left py-3 px-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            Due Date
                          </th>
                          <th className="text-center py-3 px-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            In Checklist
                          </th>
                          <th className="w-12"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {selectedSections.map((selected, index) => (
                          <tr key={selected.id} className="hover:bg-white/5">
                            <td className="py-3 px-3">
                              <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                            </td>
                            <td className="py-3 px-3">
                              <div>
                                <p className="text-sm font-medium text-slate-100">{selected.section.name}</p>
                                <p className="text-xs text-slate-400">{selected.section.group}</p>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <select className="text-sm border border-white/10 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#2855a6]">
                                <option>Unassigned</option>
                                <option>Sarah Johnson</option>
                                <option>Mike Brown</option>
                                <option>Emily Davis</option>
                              </select>
                            </td>
                            <td className="py-3 px-3">
                              <input
                                type="date"
                                className="text-sm border border-white/10 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
                              />
                            </td>
                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={selected.includeInChecklist}
                                onChange={() => {}}
                                className="w-4 h-4 text-[#2855a6] rounded focus:ring-[#2855a6]"
                              />
                            </td>
                            <td className="py-3 px-3">
                              <button
                                onClick={() => handleRemoveSection(selected.id)}
                                className="p-1 hover:bg-white/5 rounded"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Card */}
        <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)] bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-300 mb-1">How Workpaper Builder Works</h4>
                <ul className="text-sm text-blue-300 space-y-1">
                  <li>• Select entity type and tick applicable sections to create a job-specific template</li>
                  <li>• Only selected sections will appear in the Workpaper Editor sidebar</li>
                  <li>• Checklist generation uses selected sections + requires staff approval</li>
                  <li>• Template is locked after final signoff</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </WorkpaperLayout>
  );
}
