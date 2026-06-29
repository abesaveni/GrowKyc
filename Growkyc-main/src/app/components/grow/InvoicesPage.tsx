import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Plus, 
  FileText, 
  Send, 
  Eye, 
  Download, 
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
}

interface InvoicesPageProps {
  onNavigate?: (page: string) => void;
}

const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    invoiceNumber: 'INV-2026-001',
    client: 'ABC Corporation',
    date: '2026-05-01',
    dueDate: '2026-05-15',
    amount: 16500, // $15,000 + 10% GST
    status: 'paid',
    items: [
      { description: 'Consulting Services - May', quantity: 1, rate: 15000 }
    ]
  },
  {
    id: 'INV-002',
    invoiceNumber: 'INV-2026-002',
    client: 'XYZ Limited',
    date: '2026-05-05',
    dueDate: '2026-05-19',
    amount: 9350, // $8,500 + 10% GST
    status: 'sent',
    items: [
      { description: 'Web Development Services', quantity: 1, rate: 8500 }
    ]
  },
  {
    id: 'INV-003',
    invoiceNumber: 'INV-2026-003',
    client: 'DEF Enterprises',
    date: '2026-04-28',
    dueDate: '2026-05-12',
    amount: 5720, // $5,200 + 10% GST
    status: 'overdue',
    items: [
      { description: 'Monthly Retainer - April', quantity: 1, rate: 5200 }
    ]
  },
  {
    id: 'INV-004',
    invoiceNumber: 'INV-2026-004',
    client: 'GHI Holdings',
    date: '2026-05-10',
    dueDate: '2026-05-24',
    amount: 14080, // $12,800 + 10% GST
    status: 'sent',
    items: [
      { description: 'Software License', quantity: 4, rate: 3200 }
    ]
  },
  {
    id: 'INV-005',
    invoiceNumber: 'INV-2026-005',
    client: 'JKL Solutions',
    date: '2026-05-13',
    dueDate: '2026-05-27',
    amount: 3795, // $3,450 + 10% GST
    status: 'draft',
    items: [
      { description: 'Consulting - Phase 1', quantity: 1, rate: 3450 }
    ]
  }
];

export function InvoicesPage({ onNavigate }: InvoicesPageProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoiceForPreview, setSelectedInvoiceForPreview] = useState<Invoice | null>(null);

  const handleDownloadPDF = (invoice: Invoice) => {
    try {
      const doc = new jsPDF();
      
      // Document Brand Styling
      doc.setFillColor(19, 181, 234); // Brand primary color (#13B5EA)
      doc.rect(0, 0, 210, 8, 'F');
      
      // Header Section
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(33, 37, 41);
      doc.text('GrowKYC Compliance Invoice', 14, 25);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(108, 117, 125);
      doc.text('Platform: growkyc.com | billing@growkyc.com', 14, 30);
      
      // Invoice Metadata Right Aligned
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(33, 37, 41);
      doc.text(`INVOICE: ${invoice.invoiceNumber}`, 140, 25);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(73, 80, 87);
      doc.text(`Date Created: ${invoice.date}`, 140, 31);
      doc.text(`Due Date: ${invoice.dueDate}`, 140, 37);
      
      // Horizontal Line
      doc.setDrawColor(222, 226, 230);
      doc.line(14, 45, 196, 45);
      
      // Issuer and Billed-to details
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(33, 37, 41);
      doc.text('ISSUER:', 14, 53);
      doc.text('BILLED TO:', 105, 53);
      
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(73, 80, 87);
      doc.text('GrowKYC Pty Ltd\n120 Pitt Street, Sydney NSW 2000\nAustralia', 14, 59);
      doc.text(`${invoice.client}\nCorporate KYC Target Client\nAustralia`, 105, 59);
      
      // Table Header Background
      doc.setFillColor(248, 249, 250);
      doc.rect(14, 80, 182, 8, 'F');
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(33, 37, 41);
      doc.text('Description', 16, 85);
      doc.text('Qty', 120, 85);
      doc.text('Rate', 145, 85);
      doc.text('Amount', 175, 85);
      
      doc.line(14, 88, 196, 88);
      
      // Table Content
      let yOffset = 95;
      invoice.items.forEach((item) => {
        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(73, 80, 87);
        doc.text(item.description, 16, yOffset);
        doc.text(String(item.quantity), 120, yOffset);
        doc.text(`$${item.rate.toLocaleString()}`, 145, yOffset);
        doc.setFont('Helvetica', 'bold');
        doc.setTextColor(33, 37, 41);
        doc.text(`$${(item.quantity * item.rate).toLocaleString()}`, 175, yOffset);
        yOffset += 8;
      });
      
      doc.setDrawColor(222, 226, 230);
      doc.line(14, yOffset, 196, yOffset);
      yOffset += 8;
      
      // Totals Calculations
      const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
      const gst = subtotal * 0.1;
      
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(108, 117, 125);
      doc.text('Subtotal:', 140, yOffset);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(73, 80, 87);
      doc.text(`$${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 175, yOffset);
      yOffset += 6;
      
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(108, 117, 125);
      doc.text('GST (10%):', 140, yOffset);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(73, 80, 87);
      doc.text(`$${gst.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 175, yOffset);
      yOffset += 8;
      
      doc.setDrawColor(222, 226, 230);
      doc.line(135, yOffset - 3, 196, yOffset - 3);
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(19, 181, 234); // Brand primary color
      doc.text('Total Amount:', 140, yOffset);
      doc.text(`$${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 175, yOffset);
      
      // Footer Term Note
      yOffset += 20;
      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(108, 117, 125);
      doc.text('Please transfer funds to the designated corporate bank account within the due date period.', 14, yOffset);
      doc.text('Thank you for choosing GrowKYC for your compliance operations.', 14, yOffset + 4);
      
      doc.save(`GrowKYC-${invoice.invoiceNumber}.pdf`);
      toast.success(`PDF Statement for ${invoice.invoiceNumber} generated and downloaded.`);
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Downloading text invoice fallback.');
      
      // Text fallback download
      const content = `GrowKYC Compliance Invoice\n\nInvoice Number: ${invoice.invoiceNumber}\nClient: ${invoice.client}\nDate: ${invoice.date}\nDue Date: ${invoice.dueDate}\nTotal (inc GST): $${invoice.amount.toLocaleString()}\nStatus: ${invoice.status}`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `GrowKYC-${invoice.invoiceNumber}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [client, setClient] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14); // Default 14 days
    return d.toISOString().split('T')[0];
  });
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, rate: 0 }
  ]);

  // Auto-generate invoice number based on number of invoices
  const generatedInvoiceNumber = `INV-2026-${(invoices.length + 1).toString().padStart(3, '0')}`;

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(prev => {
      const updated = [...prev];
      updated[index] = { 
        ...updated[index], 
        [field]: field === 'description' ? value : Number(value) 
      };
      return updated;
    });
  };

  const addItem = () => {
    setItems(prev => [...prev, { description: '', quantity: 1, rate: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, idx) => idx !== index));
    } else {
      toast.warning('An invoice must have at least one line item.');
    }
  };

  // Financial calculations
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };
  const gstRate = 0.10; // 10% GST
  const calculateGST = () => calculateSubtotal() * gstRate;
  const calculateTotal = () => calculateSubtotal() + calculateGST();

  // Reset form helper
  const resetForm = () => {
    setClient('');
    setInvoiceDate(new Date().toISOString().split('T')[0]);
    const d = new Date();
    d.setDate(d.getDate() + 14);
    setDueDate(d.toISOString().split('T')[0]);
    setItems([{ description: '', quantity: 1, rate: 0 }]);
  };

  // Save Draft Handler
  const handleSaveDraft = () => {
    if (!client) {
      toast.error('Please select a client');
      return;
    }
    
    const newInvoice: Invoice = {
      id: `INV-NEW-${Date.now()}`,
      invoiceNumber: generatedInvoiceNumber,
      client,
      date: invoiceDate,
      dueDate,
      amount: calculateTotal(),
      status: 'draft',
      items: [...items]
    };

    setInvoices(prev => [newInvoice, ...prev]);
    toast.success(`Draft ${generatedInvoiceNumber} saved successfully!`);
    setShowCreateModal(false);
    resetForm();
  };

  // Create & Send Handler
  const handleCreateAndSend = () => {
    if (!client) {
      toast.error('Please select a client');
      return;
    }

    const newInvoice: Invoice = {
      id: `INV-NEW-${Date.now()}`,
      invoiceNumber: generatedInvoiceNumber,
      client,
      date: invoiceDate,
      dueDate,
      amount: calculateTotal(),
      status: 'sent',
      items: [...items]
    };

    setInvoices(prev => [newInvoice, ...prev]);
    toast.success(`Invoice ${generatedInvoiceNumber} created and sent to client!`, {
      description: `Notification email dispatched to ${client}'s billing department.`
    });
    setShowCreateModal(false);
    resetForm();
  };

  const getStatusBadge = (status: Invoice['status']) => {
    const config = {
      draft: { label: 'Draft', className: 'bg-white/5 text-slate-300 border-white/10' },
      sent: { label: 'Sent', className: 'bg-blue-500/10 text-blue-300 border-blue-500/30' },
      paid: { label: 'Paid', className: 'bg-green-500/10 text-green-300 border-green-500/30' },
      overdue: { label: 'Overdue', className: 'bg-red-500/10 text-red-300 border-red-500/30' },
      cancelled: { label: 'Cancelled', className: 'bg-white/5 text-slate-400 border-white/10' }
    };
    
    const { label, className } = config[status];
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${className}`}>
        {label}
      </span>
    );
  };

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'sent':
        return <Send className="w-4 h-4 text-blue-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  // Filter and search
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.client.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate high-level stats
  const totalOutstanding = invoices
    .filter(i => i.status === 'sent' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalPaid = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalDraft = invoices
    .filter(i => i.status === 'draft')
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="min-h-screen bg-white/5 p-4 sm:p-8">
      <div className="max-w-[2000px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Invoice Management Portal</h1>
          <p className="text-slate-300 mt-1">Generate, track, and manage client bills and real-time revenue collection.</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-[#13B5EA] to-[#0E7C9E] hover:from-[#13B5EA]/90 hover:to-[#0E7C9E]/90 text-white font-semibold shadow-lg transition-transform hover:scale-[1.02] duration-200"
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-blue-300">Total Outstanding</span>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-slate-100">${totalOutstanding.toLocaleString()}</p>
            <p className="text-xs text-blue-400 mt-1.5 font-medium">Awaiting collection across multiple terms</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 border border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-green-300">Total Paid</span>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-slate-100">${totalPaid.toLocaleString()}</p>
            <p className="text-xs text-green-400 mt-1.5 font-medium">Cleared revenue settled this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 border border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-purple-300">Draft Value</span>
              <FileText className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-slate-100">${totalDraft.toLocaleString()}</p>
            <p className="text-xs text-purple-400 mt-1.5 font-medium">Prepared invoices pending finalization</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white/5 p-4 rounded-xl border border-gray-150">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by client or invoice number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border border-white/10 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#13B5EA]"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'draft', 'sent', 'paid', 'overdue'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
                statusFilter === status 
                  ? 'bg-gradient-to-r from-[#13B5EA] to-[#0E7C9E] text-white border-transparent shadow-sm'
                  : 'bg-white text-slate-300 border-white/10 hover:bg-white/5'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List Table */}
      <Card className="shadow-lg border-white/10 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-wider">Invoice</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-wider">Client</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-wider">Date Created</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-wider">Due Date</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-wider">Grand Total (inc GST)</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium bg-white">
                      No invoices found matching the current filters.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-white/5/50 transition-colors bg-white">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          {getStatusIcon(invoice.status)}
                          <span className="font-mono text-sm font-bold text-slate-100">
                            {invoice.invoiceNumber}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-slate-100">{invoice.client}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-300">{invoice.date}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-300">{invoice.dueDate}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-100">
                          ${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedInvoiceForPreview(invoice)}
                            className="text-slate-400 hover:text-slate-300 hover:bg-white/5"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadPDF(invoice)}
                            className="text-slate-400 hover:text-slate-300 hover:bg-white/5"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          {invoice.status === 'draft' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setInvoices(prev => prev.map(i => i.id === invoice.id ? { ...i, status: 'sent' } : i));
                                toast.success(`Invoice ${invoice.invoiceNumber} approved and dispatched!`);
                              }}
                              className="text-[#13B5EA] hover:text-[#0E7C9E] hover:bg-[#13B5EA]/5"
                              title="Send Invoice"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Creation Pop-up Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-gray-150 animate-in slide-in-from-bottom-8 duration-300">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white sticky top-0 z-10 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-100">Create New Invoice</CardTitle>
                  <p className="text-xs text-slate-400 mt-1">Fill in the details below to generate a new billing record.</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-full text-gray-400 hover:text-slate-300 hover:bg-white/5 w-8 h-8 p-0"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Auto-generated Invoice Number & Client Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Invoice Number <span className="text-gray-400 font-normal">(Auto-generated)</span>
                  </label>
                  <Input 
                    type="text" 
                    value={generatedInvoiceNumber} 
                    disabled 
                    className="bg-white/5 font-mono text-sm border-white/10 text-slate-300 select-all font-bold cursor-not-allowed" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Client <span className="text-red-500">*</span>
                  </label>
                  <select 
                    className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#13B5EA]" 
                    value={client} 
                    onChange={e => setClient(e.target.value)}
                  >
                    <option value="">Select Client Dropdown...</option>
                    <option value="ABC Corporation">ABC Corporation</option>
                    <option value="XYZ Limited">XYZ Limited</option>
                    <option value="DEF Enterprises">DEF Enterprises</option>
                    <option value="GHI Holdings">GHI Holdings</option>
                    <option value="JKL Solutions">JKL Solutions</option>
                  </select>
                </div>
              </div>

              {/* Invoice Date & Due Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Invoice Date</label>
                  <Input 
                    type="date" 
                    value={invoiceDate} 
                    onChange={e => setInvoiceDate(e.target.value)} 
                    className="border-white/10 focus:ring-2 focus:ring-[#13B5EA]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Due Date</label>
                  <Input 
                    type="date" 
                    value={dueDate} 
                    onChange={e => setDueDate(e.target.value)} 
                    className="border-white/10 focus:ring-2 focus:ring-[#13B5EA]"
                  />
                </div>
              </div>

              {/* Line Items List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Line Items</label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addItem}
                    className="text-[#13B5EA] border-[#13B5EA]/30 hover:bg-[#13B5EA]/5 hover:border-[#13B5EA] font-semibold text-xs py-1 h-8"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-3 p-3 bg-white/5 border border-gray-250 rounded-xl relative group">
                      <div className="flex-1">
                        <Input 
                          placeholder="Item description (e.g. Compliance Audit Services)" 
                          value={item.description} 
                          onChange={e => handleItemChange(idx, 'description', e.target.value)}
                          className="border-white/10 text-sm bg-white focus:ring-2 focus:ring-[#13B5EA]"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2.5 w-full md:w-[320px]">
                        <div className="w-[80px]">
                          <Input 
                            type="number" 
                            min="1" 
                            placeholder="Qty" 
                            value={item.quantity} 
                            onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                            className="border-white/10 text-sm text-center bg-white focus:ring-2 focus:ring-[#13B5EA]"
                          />
                        </div>
                        <div className="flex-1 relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">$</span>
                          <Input 
                            type="number" 
                            min="0"
                            placeholder="Rate" 
                            value={item.rate} 
                            onChange={e => handleItemChange(idx, 'rate', e.target.value)}
                            className="border-white/10 pl-6 text-sm bg-white focus:ring-2 focus:ring-[#13B5EA]"
                          />
                        </div>
                        <div className="w-[100px] text-right font-semibold text-slate-300 text-sm self-center">
                          ${(item.quantity * item.rate).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeItem(idx)}
                          className="text-red-500 hover:text-red-300 hover:bg-red-500/10 w-8 h-8 p-0 shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Calculations Summary */}
              <div className="bg-white/5 border border-gray-150 rounded-xl p-4 space-y-2 max-w-sm ml-auto">
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-100">${calculateSubtotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-300">
                  <span>GST (10%)</span>
                  <span className="font-semibold text-slate-100">${calculateGST().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="border-t border-white/10 my-1.5" />
                <div className="flex justify-between text-base font-bold text-slate-100">
                  <span>Total Amount</span>
                  <span className="text-[#0E7C9E]">${calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t sticky bottom-0 bg-white">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateModal(false)}
                  className="w-full sm:w-auto border-white/10 hover:bg-white/5 font-semibold"
                >
                  Cancel
                </Button>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    onClick={handleSaveDraft}
                    className="w-full sm:w-auto text-slate-300 border-white/10 hover:bg-white/5 font-semibold"
                  >
                    Save as Draft
                  </Button>
                  <Button 
                    onClick={handleCreateAndSend}
                    className="w-full sm:w-auto bg-gradient-to-r from-[#13B5EA] to-[#0E7C9E] hover:from-[#13B5EA]/90 hover:to-[#0E7C9E]/90 text-white font-bold px-6 shadow-md transition-transform hover:scale-[1.02] duration-200"
                  >
                    Create &amp; Send
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      )}

      {/* Interactive Invoice Preview Modal */}
      {selectedInvoiceForPreview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <Card className="max-w-2xl w-full bg-white shadow-2xl border border-gray-150 rounded-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-gray-50 to-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Invoice Details</span>
                <h3 className="text-xl font-bold text-slate-100 mt-0.5">{selectedInvoiceForPreview.invoiceNumber}</h3>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedInvoiceForPreview.status)}
                <button 
                  onClick={() => setSelectedInvoiceForPreview(null)}
                  className="text-gray-400 hover:text-slate-300 hover:bg-white/5 w-8 h-8 rounded-full flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Addresses / Metadata */}
              <div className="grid grid-cols-2 gap-6 pb-6 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Issued By</span>
                  <div className="text-sm font-bold text-slate-100 mt-1">GrowKYC Pty Ltd</div>
                  <div className="text-xs text-slate-400 mt-0.5">120 Pitt Street, Sydney NSW 2000</div>
                  <div className="text-xs text-slate-400">billing@growkyc.com</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Billed To</span>
                  <div className="text-sm font-bold text-slate-100 mt-1">{selectedInvoiceForPreview.client}</div>
                  <div className="text-xs text-slate-400 mt-0.5">Corporate Client</div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/10 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Date Issued</span>
                  <div className="font-semibold text-slate-100 mt-0.5">{selectedInvoiceForPreview.date}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Due Date</span>
                  <div className="font-semibold text-slate-100 mt-0.5">{selectedInvoiceForPreview.dueDate}</div>
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Invoice Items</span>
                <div className="border border-white/10 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-4 py-2.5 text-xs font-bold text-slate-400">Description</th>
                        <th className="px-4 py-2.5 text-xs font-bold text-slate-400 text-center w-16">Qty</th>
                        <th className="px-4 py-2.5 text-xs font-bold text-slate-400 text-right w-24">Rate</th>
                        <th className="px-4 py-2.5 text-xs font-bold text-slate-400 text-right w-28">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-xs">
                      {selectedInvoiceForPreview.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 text-slate-300 font-medium">{item.description}</td>
                          <td className="px-4 py-3 text-slate-300 text-center">{item.quantity}</td>
                          <td className="px-4 py-3 text-slate-300 text-right">${item.rate.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          <td className="px-4 py-3 text-slate-100 font-semibold text-right">${(item.quantity * item.rate).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Calculations Summary */}
              <div className="flex justify-between items-start pt-4 border-t border-white/10">
                <div className="text-xs text-slate-400 max-w-[300px]">
                  Thank you for your business. Please settle this invoice within the due date terms via bank transfer.
                </div>
                <div className="w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-100">${(selectedInvoiceForPreview.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>GST (10%)</span>
                    <span className="font-semibold text-slate-100">${(selectedInvoiceForPreview.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0) * 0.1).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="border-t border-white/10 my-1" />
                  <div className="flex justify-between text-sm font-bold text-slate-100">
                    <span>Total Amount</span>
                    <span className="text-[#0E7C9E]">${selectedInvoiceForPreview.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white/5 px-6 py-4 border-t flex items-center justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setSelectedInvoiceForPreview(null)}
                className="font-semibold"
              >
                Close
              </Button>
              <Button 
                onClick={() => handleDownloadPDF(selectedInvoiceForPreview)}
                className="bg-gradient-to-r from-[#13B5EA] to-[#0E7C9E] hover:from-[#13B5EA]/90 hover:to-[#0E7C9E]/90 text-white font-bold"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </Card>
        </div>
      )}
      </div>
    </div>
  );
}
