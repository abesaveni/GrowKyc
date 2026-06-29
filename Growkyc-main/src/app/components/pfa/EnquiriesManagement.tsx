import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  User,
  DollarSign,
  Home,
  Building,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface EnquiriesManagementProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

interface Enquiry {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  loanType: string;
  propertyType: string;
  loanAmount: number;
  propertyValue: number;
  employmentType: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: string;
  assignedTo: string;
  createdDate: string;
  lastContact?: string;
  priority: 'high' | 'medium' | 'low';
  notes: string;
}

export function EnquiriesManagement({ onNavigate, onBack }: EnquiriesManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewEnquiryModal, setShowNewEnquiryModal] = useState(false);

  const enquiries: Enquiry[] = [
    {
      id: 'ENQ-2024-156',
      clientName: 'Sarah Mitchell',
      phone: '0412 345 678',
      email: 'sarah.mitchell@email.com',
      loanType: 'Home Loan',
      propertyType: 'House',
      loanAmount: 650000,
      propertyValue: 850000,
      employmentType: 'Full-time',
      status: 'new',
      source: 'Website',
      assignedTo: 'John Smith',
      createdDate: '2024-02-14',
      priority: 'high',
      notes: 'First home buyer, pre-approved with another lender'
    },
    {
      id: 'ENQ-2024-155',
      clientName: 'James Chen',
      phone: '0423 456 789',
      email: 'j.chen@email.com',
      loanType: 'Refinance',
      propertyType: 'Unit',
      loanAmount: 420000,
      propertyValue: 550000,
      employmentType: 'Full-time',
      status: 'contacted',
      source: 'Referral',
      assignedTo: 'Sarah Johnson',
      createdDate: '2024-02-14',
      lastContact: '2024-02-14',
      priority: 'medium',
      notes: 'Looking to refinance from CBA, rate shopping'
    },
    {
      id: 'ENQ-2024-154',
      clientName: 'Emma Thompson',
      phone: '0434 567 890',
      email: 'emma.t@email.com',
      loanType: 'Investment',
      propertyType: 'Unit',
      loanAmount: 580000,
      propertyValue: 720000,
      employmentType: 'Self-employed',
      status: 'qualified',
      source: 'Google Ads',
      assignedTo: 'John Smith',
      createdDate: '2024-02-13',
      lastContact: '2024-02-14',
      priority: 'high',
      notes: 'Experienced investor, owns 2 properties already'
    },
    {
      id: 'ENQ-2024-153',
      clientName: 'Michael Brown',
      phone: '0445 678 901',
      email: 'm.brown@email.com',
      loanType: 'Home Loan',
      propertyType: 'House',
      loanAmount: 750000,
      propertyValue: 950000,
      employmentType: 'Full-time',
      status: 'new',
      source: 'Facebook',
      assignedTo: 'Sarah Johnson',
      createdDate: '2024-02-13',
      priority: 'medium',
      notes: 'Upgrading from apartment to house'
    },
    {
      id: 'ENQ-2024-152',
      clientName: 'Lisa Anderson',
      phone: '0456 789 012',
      email: 'lisa.a@email.com',
      loanType: 'Construction',
      propertyType: 'Land',
      loanAmount: 820000,
      propertyValue: 1100000,
      employmentType: 'Full-time',
      status: 'contacted',
      source: 'Referral',
      assignedTo: 'John Smith',
      createdDate: '2024-02-12',
      lastContact: '2024-02-13',
      priority: 'high',
      notes: 'Building new home, needs construction loan'
    }
  ];

  const stats = {
    total: enquiries.length,
    new: enquiries.filter(e => e.status === 'new').length,
    contacted: enquiries.filter(e => e.status === 'contacted').length,
    qualified: enquiries.filter(e => e.status === 'qualified').length,
    converted: enquiries.filter(e => e.status === 'converted').length,
    conversionRate: 68
  };

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: JSX.Element } = {
      'new': <span className="px-2 py-0.5 bg-blue-500/15 text-blue-300 text-xs font-semibold rounded">NEW</span>,
      'contacted': <span className="px-2 py-0.5 bg-purple-500/15 text-purple-300 text-xs font-semibold rounded">CONTACTED</span>,
      'qualified': <span className="px-2 py-0.5 bg-green-500/15 text-green-300 text-xs font-semibold rounded">QUALIFIED</span>,
      'converted': <span className="px-2 py-0.5 bg-indigo-500/15 text-indigo-300 text-xs font-semibold rounded">CONVERTED</span>,
      'lost': <span className="px-2 py-0.5 bg-red-500/15 text-red-300 text-xs font-semibold rounded">LOST</span>
    };
    return badges[status];
  };

  const getPriorityBadge = (priority: string) => {
    const badges: { [key: string]: JSX.Element } = {
      'high': <span className="px-2 py-0.5 bg-red-500/15 text-red-300 text-xs font-semibold rounded">HIGH</span>,
      'medium': <span className="px-2 py-0.5 bg-amber-500/15 text-amber-300 text-xs font-semibold rounded">MEDIUM</span>,
      'low': <span className="px-2 py-0.5 bg-white/5 text-slate-300 text-xs font-semibold rounded">LOW</span>
    };
    return badges[priority];
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getLVR = (loanAmount: number, propertyValue: number) => {
    return Math.round((loanAmount / propertyValue) * 100);
  };

  const handleViewEnquiry = (enquiry: Enquiry) => {
    sessionStorage.setItem('pfa:selectedEnquiry', JSON.stringify(enquiry));
    onNavigate?.('pfa-enquiry-detail');
  };

  const handleConvertToApplication = (enquiry: Enquiry) => {
    sessionStorage.setItem(
      'pfa:enquiryToConvert',
      JSON.stringify({
        enquiryId: enquiry.id,
        clientName: enquiry.clientName,
        loanType: enquiry.loanType,
        loanAmount: enquiry.loanAmount,
        propertyValue: enquiry.propertyValue,
        notes: enquiry.notes,
      })
    );
    onNavigate?.('pfa-pipeline');
  };

  return (
    <div className="min-h-screen bg-white/5">
      {/* Header */}
      <div className="bg-white border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <Phone className="w-6 h-6 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold text-slate-100">Enquiries & Leads</h1>
              <p className="text-xs text-slate-300">Manage incoming enquiries and convert to applications</p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowNewEnquiryModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Enquiry
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="bg-white/5 rounded p-3 border border-white/10">
            <div className="text-xs text-slate-300">Total Enquiries</div>
            <div className="text-2xl font-bold text-slate-100">{stats.total}</div>
          </div>
          <div className="bg-blue-500/10 rounded p-3 border border-blue-500/30">
            <div className="text-xs text-blue-300">New</div>
            <div className="text-2xl font-bold text-blue-300">{stats.new}</div>
          </div>
          <div className="bg-purple-500/10 rounded p-3 border border-purple-500/30">
            <div className="text-xs text-purple-300">Contacted</div>
            <div className="text-2xl font-bold text-purple-300">{stats.contacted}</div>
          </div>
          <div className="bg-green-500/10 rounded p-3 border border-green-500/30">
            <div className="text-xs text-green-300">Qualified</div>
            <div className="text-2xl font-bold text-green-300">{stats.qualified}</div>
          </div>
          <div className="bg-indigo-500/10 rounded p-3 border border-indigo-500/30">
            <div className="text-xs text-indigo-300">Converted</div>
            <div className="text-2xl font-bold text-indigo-300">{stats.converted}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded p-3">
            <div className="text-xs opacity-90">Conversion Rate</div>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search enquiries by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-white/10 rounded text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-white/10 rounded text-sm"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Enquiries Table */}
        <div className="border border-white/10 rounded bg-white overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Enquiry ID</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Client</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Loan Type</th>
                <th className="border border-white/10 px-3 py-2 text-right font-semibold text-slate-300">Loan Amount</th>
                <th className="border border-white/10 px-3 py-2 text-right font-semibold text-slate-300">LVR</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300">Status</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300">Priority</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Source</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Assigned To</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enquiry) => (
                <tr
                  key={enquiry.id}
                  className="hover:bg-blue-500/10 cursor-pointer"
                  onClick={() => handleViewEnquiry(enquiry)}
                >
                  <td className="border border-white/10 px-3 py-2 text-slate-100 font-mono font-semibold">
                    {enquiry.id}
                  </td>
                  <td className="border border-white/10 px-3 py-2">
                    <div className="font-semibold text-slate-100">{enquiry.clientName}</div>
                    <div className="text-xs text-slate-300 flex items-center gap-2 mt-1">
                      <Phone className="w-3 h-3" />
                      {enquiry.phone}
                    </div>
                    <div className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                      <Mail className="w-3 h-3" />
                      {enquiry.email}
                    </div>
                  </td>
                  <td className="border border-white/10 px-3 py-2">
                    <div className="text-slate-100">{enquiry.loanType}</div>
                    <div className="text-xs text-slate-300">{enquiry.propertyType}</div>
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-right font-mono text-slate-100">
                    {formatCurrency(enquiry.loanAmount)}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-right">
                    <span className={`font-semibold ${getLVR(enquiry.loanAmount, enquiry.propertyValue) > 80 ? 'text-red-400' : 'text-green-400'}`}>
                      {getLVR(enquiry.loanAmount, enquiry.propertyValue)}%
                    </span>
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-center">
                    {getStatusBadge(enquiry.status)}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-center">
                    {getPriorityBadge(enquiry.priority)}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-slate-300">
                    {enquiry.source}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-slate-300">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      {enquiry.assignedTo}
                    </div>
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewEnquiry(enquiry);
                        }}
                        className="px-2 py-1 text-xs bg-blue-500/15 text-blue-300 hover:bg-blue-500/20 rounded font-semibold"
                      >
                        View
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConvertToApplication(enquiry);
                        }}
                        className="px-2 py-1 text-xs bg-green-500/15 text-green-300 hover:bg-green-500/20 rounded font-semibold"
                      >
                        Convert
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}