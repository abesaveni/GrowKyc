import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  Mail,
  Inbox,
  Send,
  Star,
  Trash2,
  Archive,
  Search,
  Filter,
  Plus,
  Paperclip,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  User,
  Tag,
  FolderOpen,
  FileText,
  Download,
  Forward,
  Reply,
  MoreVertical,
  X
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface EmailIntegrationProps {
  onNavigate?: (page: string) => void;
}

export function EmailIntegration({ onNavigate }: EmailIntegrationProps) {
  const [selectedFolder, setSelectedFolder] = useState<'inbox' | 'sent' | 'starred' | 'archived'>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  const emails = [
    {
      id: 'E-001',
      from: 'john@smithsmsf.com.au',
      fromName: 'John Smith',
      to: 'you@growaccounting.com.au',
      subject: 'Q4 BAS Documents - Urgent',
      preview: 'Hi, I\'ve attached the bank statements and receipts for Q4. Please let me know if you need anything else...',
      body: 'Hi,\n\nI\'ve attached the bank statements and receipts for Q4. Please let me know if you need anything else for the BAS lodgment.\n\nThanks,\nJohn',
      date: '2024-03-14 09:23 AM',
      unread: true,
      starred: false,
      hasAttachments: true,
      attachments: ['Bank_Statement_Q4.pdf', 'Receipts_March.xlsx'],
      client: 'Smith SMSF',
      job: 'BAS Q4 2024',
      labels: ['Urgent', 'Client']
    },
    {
      id: 'E-002',
      from: 'mary@abcptyltd.com.au',
      fromName: 'Mary Chen',
      to: 'you@growaccounting.com.au',
      subject: 'Annual Return - Review Comments',
      preview: 'I\'ve reviewed the draft annual return. A few questions about the depreciation schedule...',
      body: 'I\'ve reviewed the draft annual return. A few questions about the depreciation schedule on page 12.\n\nCan we schedule a call this week?\n\nBest,\nMary',
      date: '2024-03-14 08:15 AM',
      unread: true,
      starred: true,
      hasAttachments: false,
      attachments: [],
      client: 'ABC Pty Ltd',
      job: 'Annual Return 2024',
      labels: ['Client', 'Review']
    },
    {
      id: 'E-003',
      from: 'david@xyzgroup.com.au',
      fromName: 'David Wilson',
      to: 'you@growaccounting.com.au',
      subject: 'Trust Tax Return - Additional Information',
      preview: 'Thanks for the request list. Here are the additional documents you requested...',
      body: 'Thanks for the request list. Here are the additional documents you requested for the trust tax return.\n\nLet me know if you need anything else.\n\nRegards,\nDavid',
      date: '2024-03-13 04:45 PM',
      unread: false,
      starred: false,
      hasAttachments: true,
      attachments: ['Trust_Documents.pdf'],
      client: 'XYZ Family Trust',
      job: 'Trust Tax Return FY2023',
      labels: ['Client']
    },
    {
      id: 'E-004',
      from: 'sarah@wilsonco.com.au',
      fromName: 'Sarah Wilson',
      to: 'you@growaccounting.com.au',
      subject: 'Invoice #INV-2024-123',
      preview: 'Thank you for completing our year-end accounts. Invoice received and payment processed...',
      body: 'Thank you for completing our year-end accounts. Invoice received and payment processed.\n\nLooking forward to working with you next year.\n\nBest regards,\nSarah',
      date: '2024-03-13 02:30 PM',
      unread: false,
      starred: false,
      hasAttachments: false,
      attachments: [],
      client: 'Wilson Co',
      job: 'Year End FY2023',
      labels: ['Invoice', 'Paid']
    }
  ];

  const folders = [
    { id: 'inbox', name: 'Inbox', icon: Inbox, count: 2 },
    { id: 'sent', name: 'Sent', icon: Send, count: 0 },
    { id: 'starred', name: 'Starred', icon: Star, count: 1 },
    { id: 'archived', name: 'Archived', icon: Archive, count: 8 }
  ];

  const displayedEmails = emails.filter(email => {
    if (selectedFolder === 'inbox') return email.unread || true;
    if (selectedFolder === 'starred') return email.starred;
    return true;
  });

  return (
    <WorkpaperLayout currentPage="email" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-slate-100">Email Integration</h1>
            <p className="text-sm text-slate-300 mt-1">Manage client emails and link to jobs</p>
          </div>
          <Button 
            className="bg-[#2855a6] hover:bg-[#1e4089]"
            onClick={() => setComposeOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Compose
          </Button>
        </div>

        {/* Email Interface */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Folders */}
          <div className="col-span-3">
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-100 mb-3">Folders</h3>
                <div className="space-y-1">
                  {folders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => {
                        setSelectedFolder(folder.id as any);
                        setSelectedEmail(null);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        selectedFolder === folder.id
                          ? 'bg-blue-500/10 text-[#2855a6]'
                          : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <folder.icon className="w-4 h-4" />
                        <span className="font-medium text-sm">{folder.name}</span>
                      </div>
                      {folder.count > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          selectedFolder === folder.id
                            ? 'bg-[#2855a6] text-white'
                            : 'bg-white/10 text-slate-300'
                        }`}>
                          {folder.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <h4 className="font-semibold text-slate-100 text-sm mb-2">Quick Links</h4>
                  <div className="space-y-1">
                    <button className="w-full flex items-center gap-2 p-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg">
                      <Tag className="w-4 h-4" />
                      Labels
                    </button>
                    <button className="w-full flex items-center gap-2 p-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg">
                      <FolderOpen className="w-4 h-4" />
                      Link to Job
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle - Email List */}
          {!selectedEmail && (
            <div className="col-span-9">
              <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                <CardContent className="p-6">
                  {/* Search & Filter */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search emails..."
                        className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>

                  {/* Email List */}
                  <div className="space-y-2">
                    {displayedEmails.map((email) => (
                      <div
                        key={email.id}
                        onClick={() => setSelectedEmail(email)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          email.unread
                            ? 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/15'
                            : 'bg-white border-white/10 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`font-semibold text-sm ${email.unread ? 'text-slate-100' : 'text-slate-300'}`}>
                                {email.fromName}
                              </span>
                              {email.starred && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                              {email.hasAttachments && <Paperclip className="w-4 h-4 text-gray-400" />}
                            </div>
                            <h4 className={`text-sm mb-1 ${email.unread ? 'font-semibold text-slate-100' : 'text-slate-300'}`}>
                              {email.subject}
                            </h4>
                            <p className="text-xs text-slate-300 line-clamp-2">{email.preview}</p>
                          </div>
                          <span className="text-xs text-slate-400 ml-4">{email.date}</span>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-0.5 bg-blue-500/15 text-blue-300 text-xs rounded">
                            {email.client}
                          </span>
                          <span className="px-2 py-0.5 bg-white/5 text-slate-300 text-xs rounded">
                            {email.job}
                          </span>
                          {email.labels.map((label, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-orange-500/15 text-orange-300 text-xs rounded">
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Email Detail View */}
          {selectedEmail && (
            <div className="col-span-9">
              <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedEmail(null)}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Inbox
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Reply className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                      <Button variant="outline" size="sm">
                        <Forward className="w-4 h-4 mr-2" />
                        Forward
                      </Button>
                      <Button variant="outline" size="sm">
                        <Archive className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Email Content */}
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-100 mb-4">{selectedEmail.subject}</h2>
                      
                      <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg mb-4">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                          {selectedEmail.fromName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-slate-100">{selectedEmail.fromName}</span>
                            <span className="text-sm text-slate-400">{selectedEmail.date}</span>
                          </div>
                          <p className="text-sm text-slate-300">{selectedEmail.from}</p>
                          <p className="text-sm text-slate-300 mt-1">to: {selectedEmail.to}</p>
                        </div>
                      </div>

                      {/* Linked Job/Client */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1.5 bg-blue-500/15 text-blue-300 text-sm rounded-lg flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {selectedEmail.client}
                        </span>
                        <span className="px-3 py-1.5 bg-purple-500/15 text-purple-300 text-sm rounded-lg flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          {selectedEmail.job}
                        </span>
                        <Button variant="outline" size="sm">
                          Change Job
                        </Button>
                      </div>
                    </div>

                    {/* Email Body */}
                    <div className="p-4 bg-white border border-white/10 rounded-lg">
                      <p className="text-slate-100 whitespace-pre-wrap">{selectedEmail.body}</p>
                    </div>

                    {/* Attachments */}
                    {selectedEmail.hasAttachments && (
                      <div>
                        <h4 className="font-semibold text-slate-100 mb-3">Attachments ({selectedEmail.attachments.length})</h4>
                        <div className="space-y-2">
                          {selectedEmail.attachments.map((attachment: string, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Paperclip className="w-5 h-5 text-gray-400" />
                                <span className="text-sm text-slate-100">{attachment}</span>
                              </div>
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Reply Box */}
                    <div className="pt-4 border-t border-white/10">
                      <h4 className="font-semibold text-slate-100 mb-3">Reply</h4>
                      <textarea
                        rows={4}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply..."
                        className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
                      />
                      <div className="flex items-center gap-2 mt-3">
                        <Button className="bg-[#2855a6] hover:bg-[#1e4089]">
                          <Send className="w-4 h-4 mr-2" />
                          Send Reply
                        </Button>
                        <Button variant="outline">
                          <Paperclip className="w-4 h-4 mr-2" />
                          Attach
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Compose Email Modal */}
        {composeOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-3xl shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-100">New Email</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setComposeOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">To</label>
                    <input
                      type="email"
                      placeholder="client@example.com"
                      className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Subject</label>
                    <input
                      type="text"
                      placeholder="Email subject"
                      className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Link to Job (Optional)</label>
                    <select className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]">
                      <option>Select a job...</option>
                      <option>BAS Q4 2024 - Smith SMSF</option>
                      <option>Annual Return 2024 - ABC Pty Ltd</option>
                      <option>Trust Tax Return FY2023 - XYZ Trust</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Message</label>
                    <textarea
                      rows={8}
                      placeholder="Type your message..."
                      className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <Button variant="outline">
                      <Paperclip className="w-4 h-4 mr-2" />
                      Attach Files
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => setComposeOpen(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-[#2855a6] hover:bg-[#1e4089]">
                        <Send className="w-4 h-4 mr-2" />
                        Send Email
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </WorkpaperLayout>
  );
}
