import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { StatusBadge } from '../StatusBadge';
import { SettlementChecklistManager } from './SettlementChecklistManager';
import { PEXAWorkspaceViewer } from './PEXAWorkspaceViewer';
import {
  Plus,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  Paperclip,
  Send,
  Download,
  Lock,
  DollarSign,
  Eye,
  FileText,
  XCircle,
  CheckSquare,
  TrendingUp,
  Building2
} from 'lucide-react';
import { format } from 'date-fns';

function getRuntimeEnv(): Record<string, string | boolean | undefined> {
  const viteEnv = (typeof import.meta !== 'undefined' ? (import.meta as any).env : {}) || {};
  const processEnv = ((globalThis as any)?.process?.env || {}) as Record<string, string>;
  return { ...processEnv, ...viteEnv };
}

function isFlagEnabled(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
}

interface SettlementCentreProps {
  caseData: any;
  userRole: string;
}

export function SettlementCentre({ caseData, userRole }: SettlementCentreProps) {
  const env = getRuntimeEnv();
  const isProduction =
    Boolean((import.meta as any)?.env?.PROD) ||
    env.NODE_ENV === 'production' ||
    env.VITE_APP_ENV === 'production';
  const allowLegacySettlementOverview = isFlagEnabled(env.VITE_ENABLE_LEGACY_SETTLEMENT_OVERVIEW);
  const blockLegacyOverview = isProduction && !allowLegacySettlementOverview;

  const [activeTab, setActiveTab] = useState('checklist');
  const [checklistItems, setChecklistItems] = useState([
    {
      id: '1',
      title: 'Signed Loan Agreement',
      responsible: 'Borrower',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: 'Open',
      notes: '',
      hasAttachment: false
    },
    {
      id: '2',
      title: 'Discharge Authority',
      responsible: 'Lender',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: 'Submitted',
      notes: '',
      hasAttachment: true
    },
    {
      id: '3',
      title: 'Title Transfer Documents',
      responsible: 'Lawyer',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'Open',
      notes: '',
      hasAttachment: false
    },
    {
      id: '4',
      title: 'Insurance Certificate',
      responsible: 'Borrower',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'Approved',
      notes: '',
      hasAttachment: true
    }
  ]);

  const [settlementMessages, setSettlementMessages] = useState([
    {
      id: '1',
      sender: 'Sarah Mitchell',
      role: 'Admin',
      message: 'All parties confirmed for settlement on March 15th',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isPinned: true
    },
    {
      id: '2',
      sender: 'David Chen',
      role: 'Lawyer',
      message: 'Title transfer documents uploaded',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      isPinned: false
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [settlementReadiness, setSettlementReadiness] = useState(65);

  const milestones = [
    { id: 1, label: 'Contract Signed', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), status: 'complete' },
    { id: 2, label: 'Escrow Funded', date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), status: 'complete' },
    { id: 3, label: 'All Docs Received', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), status: 'pending' },
    { id: 4, label: 'Settlement Booked', date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), status: 'pending' },
    { id: 5, label: 'Funds Released', date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), status: 'pending' }
  ];

  const requiredDocuments = [
    { id: '1', name: 'Signed Loan Agreement', responsible: 'Borrower', status: 'Uploaded', uploadedBy: 'John Smith', version: 2 },
    { id: '2', name: 'Discharge Authority', responsible: 'Lender', status: 'Uploaded', uploadedBy: 'ANZ Bank', version: 1 },
    { id: '3', name: 'Title Transfer', responsible: 'Lawyer', status: 'Pending', uploadedBy: null, version: 0 },
    { id: '4', name: 'Insurance Certificate', responsible: 'Borrower', status: 'Uploaded', uploadedBy: 'John Smith', version: 1 },
    { id: '5', name: 'ID Verification', responsible: 'Borrower', status: 'Approved', uploadedBy: 'John Smith', version: 1 }
  ];

  const getOutstandingItems = () => {
    const now = new Date();
    const items = checklistItems.filter(item => item.status !== 'Approved');
    
    const overdue = items.filter(item => new Date(item.dueDate) < now);
    const dueSoon = items.filter(item => {
      const daysUntilDue = Math.ceil((new Date(item.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilDue <= 3 && daysUntilDue >= 0;
    });
    const awaitingApproval = items.filter(item => item.status === 'Submitted');

    return { overdue, dueSoon, awaitingApproval };
  };

  const outstanding = getOutstandingItems();

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setSettlementMessages([
        ...settlementMessages,
        {
          id: Date.now().toString(),
          sender: 'You',
          role: userRole,
          message: newMessage,
          timestamp: new Date(),
          isPinned: false
        }
      ]);
      setNewMessage('');
    }
  };

  const handleStatusChange = (itemId: string, newStatus: string) => {
    setChecklistItems(checklistItems.map(item => 
      item.id === itemId ? { ...item, status: newStatus } : item
    ));
  };

  const getDaysRemaining = (dueDate: Date) => {
    const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const handleTabChange = (nextTab: string) => {
    if (blockLegacyOverview && nextTab === 'legacy') {
      setActiveTab('checklist');
      return;
    }

    setActiveTab(nextTab);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="w-full justify-start mb-6">
        <TabsTrigger value="checklist">
          <CheckSquare className="w-4 h-4 mr-2" />
          AI Checklist Manager
        </TabsTrigger>
        {!blockLegacyOverview && (
          <TabsTrigger value="legacy">
            <FileText className="w-4 h-4 mr-2" />
            Settlement Overview
          </TabsTrigger>
        )}
        <TabsTrigger value="pexa">
          <Building2 className="w-4 h-4 mr-2" />
          PEXA Settlement
        </TabsTrigger>
      </TabsList>

      {/* AI Checklist Manager Tab */}
      <TabsContent value="checklist">
        <SettlementChecklistManager caseData={caseData} />
      </TabsContent>

      {/* PEXA Settlement Tab */}
      <TabsContent value="pexa">
        <PEXAWorkspaceViewer caseData={caseData} />
      </TabsContent>

      {/* Legacy Settlement Overview Tab */}
      {!blockLegacyOverview && (
      <TabsContent value="legacy">
        <div className="space-y-6">
          {/* Settlement Status Banner */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {/* Left: Property Thumbnail */}
                <div className="flex items-center gap-4">
                  <img 
                    src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=200" 
                    alt="Property"
                    className="w-[120px] h-[80px] object-cover rounded-lg"
                  />
                  <div>
                    <p className="text-sm text-slate-400">Deal ID: {caseData.caseNumber}</p>
                    <h3 className="font-semibold text-lg">{caseData.property.address}</h3>
                    <p className="text-slate-300">{caseData.property.suburb}, {caseData.property.state}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">Settlement: {format(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 'dd MMM yyyy')}</span>
                      </div>
                      <StatusBadge status="pending_docs" type="settlement" />
                    </div>
                  </div>
                </div>

                {/* Right: Progress & Actions */}
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-sm text-slate-300 mb-2">Settlement Readiness</p>
                    <div className="flex items-center gap-3">
                      <div className="w-64 h-3 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                          style={{ width: `${settlementReadiness}%` }}
                        />
                      </div>
                      <span className="font-bold text-lg text-indigo-400">{settlementReadiness}%</span>
                    </div>
                  </div>
                  {userRole === 'admin' && (
                    <Button>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Ready For Settlement
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3-Column Main Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column: Checklist Manager (12 columns - Full Width) */}
            <div className="col-span-12">
              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle>Settlement Checklist</CardTitle>
                    <Button size="sm" onClick={() => setShowAddItemModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Responsible</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Upload</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {checklistItems.map((item) => {
                          const daysRemaining = getDaysRemaining(item.dueDate);
                          const isOverdue = daysRemaining < 0;
                          
                          return (
                            <TableRow key={item.id} className={isOverdue ? 'bg-red-500/10' : ''}>
                              <TableCell className="font-medium">{item.title}</TableCell>
                              <TableCell>
                                <span className="px-2 py-1 bg-white/5 text-slate-300 text-xs rounded">
                                  {item.responsible}
                                </span>
                              </TableCell>
                              <TableCell className={isOverdue ? 'text-red-400 font-semibold' : ''}>
                                {format(item.dueDate, 'dd MMM yyyy')}
                                {isOverdue && <span className="ml-2 text-xs">(Overdue)</span>}
                              </TableCell>
                              <TableCell>
                                <select
                                  value={item.status}
                                  onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                  className="px-2 py-1 border border-white/10 rounded text-sm"
                                  disabled={userRole !== 'admin' && userRole !== item.responsible.toLowerCase()}
                                >
                                  <option value="Open">Open</option>
                                  <option value="Submitted">Submitted</option>
                                  <option value="Approved">Approved</option>
                                </select>
                              </TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm">
                                  <Upload className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 2-Column Layout: Outstanding Items + Settlement Thread */}
          <div className="grid grid-cols-2 gap-6">
            {/* Middle Column: Outstanding Items (6 columns) */}
            <div className="col-span-1">
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-base">Outstanding Items</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {/* Overdue */}
                  {outstanding.overdue.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Overdue ({outstanding.overdue.length})
                      </h4>
                      <div className="space-y-2">
                        {outstanding.overdue.map(item => (
                          <div key={item.id} className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="font-medium text-sm">{item.title}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs px-2 py-1 bg-white rounded">{item.responsible}</span>
                              <span className="text-xs text-red-400 font-semibold">
                                {Math.abs(getDaysRemaining(item.dueDate))} days overdue
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Due Soon */}
                  {outstanding.dueSoon.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Due Soon ({outstanding.dueSoon.length})
                      </h4>
                      <div className="space-y-2">
                        {outstanding.dueSoon.map(item => (
                          <div key={item.id} className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                            <p className="font-medium text-sm">{item.title}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs px-2 py-1 bg-white rounded">{item.responsible}</span>
                              <span className="text-xs text-amber-400">
                                {getDaysRemaining(item.dueDate)} days left
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Awaiting Approval */}
                  {outstanding.awaitingApproval.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Awaiting Approval ({outstanding.awaitingApproval.length})
                      </h4>
                      <div className="space-y-2">
                        {outstanding.awaitingApproval.map(item => (
                          <div key={item.id} className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <p className="font-medium text-sm">{item.title}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs px-2 py-1 bg-white rounded">{item.responsible}</span>
                              {userRole === 'admin' && (
                                <Button size="sm" variant="outline" onClick={() => handleStatusChange(item.id, 'Approved')}>
                                  Approve
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {outstanding.overdue.length === 0 && outstanding.dueSoon.length === 0 && outstanding.awaitingApproval.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                      <p className="text-sm">All items up to date!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Settlement Chat (6 columns) */}
            <div className="col-span-1">
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-base">Settlement Thread</CardTitle>
                  <p className="text-xs text-slate-400 mt-1">Settlement-specific communication</p>
                </CardHeader>
                <CardContent className="p-4">
                  {/* Pinned Messages */}
                  {settlementMessages.filter(m => m.isPinned).length > 0 && (
                    <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <p className="text-xs font-semibold text-yellow-300 mb-2">📌 Pinned</p>
                      {settlementMessages.filter(m => m.isPinned).map(msg => (
                        <div key={msg.id} className="text-sm text-slate-300">
                          {msg.message}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Messages */}
                  <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                    {settlementMessages.map(msg => (
                      <div key={msg.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          {msg.sender[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="font-semibold text-sm">{msg.sender}</span>
                            <span className="text-xs text-slate-400">{msg.role}</span>
                            <span className="text-xs text-gray-400">{format(msg.timestamp, 'HH:mm')}</span>
                          </div>
                          <p className="text-sm text-slate-300 mt-1">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button size="sm" variant="outline">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={handleSendMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Required Documents Section */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Required Settlement Documents</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {requiredDocuments.map(doc => (
                  <Card key={doc.id} className="border-2 hover:border-indigo-300 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-indigo-500/15 rounded-lg">
                            <FileText className="w-5 h-5 text-indigo-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{doc.name}</h4>
                            <p className="text-sm text-slate-300">Responsible: {doc.responsible}</p>
                          </div>
                        </div>
                        <StatusBadge status={doc.status.toLowerCase()} type="document" />
                      </div>
                      
                      {doc.status === 'Uploaded' || doc.status === 'Approved' ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-300">Version {doc.version}</span>
                            <span className="text-slate-300">by {doc.uploadedBy}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button variant="outline" className="w-full">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Document
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Settlement Timeline */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Settlement Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-white/10" />
                
                {/* Milestones */}
                <div className="relative flex justify-between">
                  {milestones.map((milestone, index) => (
                    <div key={milestone.id} className="flex flex-col items-center" style={{ width: `${100 / milestones.length}%` }}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center relative z-10 ${
                        milestone.status === 'complete' 
                          ? 'bg-green-500' 
                          : milestone.status === 'pending' 
                          ? 'bg-amber-400' 
                          : 'bg-red-500'
                      }`}>
                        {milestone.status === 'complete' ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : milestone.status === 'pending' ? (
                          <Clock className="w-6 h-6 text-white" />
                        ) : (
                          <AlertTriangle className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="text-center mt-3">
                        <p className="font-semibold text-sm">{milestone.label}</p>
                        <p className="text-xs text-slate-300 mt-1">{format(milestone.date, 'dd MMM yyyy')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Controls */}
          {userRole === 'admin' && (
            <Card className="border-2 border-indigo-500/30 bg-indigo-500/10">
              <CardHeader className="border-b border-indigo-500/30">
                <CardTitle className="flex items-center gap-2 text-indigo-300">
                  <Lock className="w-5 h-5" />
                  Settlement Controls (Admin Only)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-4 gap-3">
                  <Button variant="outline" className="bg-white">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve All Documents
                  </Button>
                  <Button variant="outline" className="bg-white">
                    <Lock className="w-4 h-4 mr-2" />
                    Lock Settlement
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Release Funds
                  </Button>
                  <Button variant="outline" className="bg-white">
                    <Download className="w-4 h-4 mr-2" />
                    Export Settlement Pack
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add Item Modal */}
          {showAddItemModal && (
            <AddChecklistItemModal
              onClose={() => setShowAddItemModal(false)}
              onSave={(newItem) => {
                setChecklistItems([...checklistItems, { ...newItem, id: Date.now().toString() }]);
                setShowAddItemModal(false);
              }}
            />
          )}
        </div>
      </TabsContent>
      )}
    </Tabs>
  );
}

// Add Checklist Item Modal
function AddChecklistItemModal({ onClose, onSave }: { onClose: () => void; onSave: (item: any) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsible: 'Borrower',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'Open',
    requiresDocument: false,
    notes: '',
    hasAttachment: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Create Checklist Item</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <XCircle className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Responsible Party *</Label>
                <select
                  value={formData.responsible}
                  onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                  className="w-full px-3 py-2 border border-white/10 rounded-lg"
                >
                  <option value="Borrower">Borrower</option>
                  <option value="Lender">Lender</option>
                  <option value="Lawyer">Lawyer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <Label>Due Date *</Label>
                <Input
                  type="date"
                  value={format(formData.dueDate, 'yyyy-MM-dd')}
                  onChange={(e) => setFormData({ ...formData, dueDate: new Date(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="requiresDocument"
                checked={formData.requiresDocument}
                onChange={(e) => setFormData({ ...formData, requiresDocument: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="requiresDocument" className="cursor-pointer">
                Required Document?
              </Label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Add Item
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}