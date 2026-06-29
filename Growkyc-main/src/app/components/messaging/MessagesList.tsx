import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from '../../lib/toast';
import { EmptyState } from '../ui/empty-state';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { 
  MessageSquare, 
  Search,
  Plus,
  Trash2,
  Check,
  CheckCheck,
  User
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface Conversation {
  id: string;
  participantName: string;
  participantRole: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
  unreadCount?: number;
}

const mockConversations: Conversation[] = [
  {
    id: 'conv-001',
    participantName: 'Sarah Mitchell',
    participantRole: 'Borrower',
    lastMessage: 'Perfect! I\'d like to schedule a property inspection. When would be available?',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    unread: true,
    unreadCount: 2
  },
  {
    id: 'conv-002',
    participantName: 'David Wilson',
    participantRole: 'Lender',
    lastMessage: 'Thanks for the update. I\'ll review the documents today.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unread: false
  },
  {
    id: 'conv-003',
    participantName: 'Emma Thompson',
    participantRole: 'Investor',
    lastMessage: 'Can you send me the investment memorandum for MIP-2024-005?',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    unread: true,
    unreadCount: 1
  },
  {
    id: 'conv-004',
    participantName: 'James Anderson',
    participantRole: 'Admin',
    lastMessage: 'Your KYC has been approved. You can now access all platform features.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    unread: false
  },
  {
    id: 'conv-005',
    participantName: 'Rachel Green',
    participantRole: 'Investor',
    lastMessage: 'Looking forward to the auction tomorrow!',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    unread: false
  }
];

interface MessagesListProps {
  onSelectConversation?: (conversationId: string) => void;
}

export function MessagesList({ onSelectConversation }: MessagesListProps) {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUnread, setFilterUnread] = useState(false);

  const unreadCount = conversations.filter(c => c.unread).length;

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const searchMatch = searchQuery === '' || 
      conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    const unreadMatch = !filterUnread || conv.unread;
    
    return searchMatch && unreadMatch;
  });

  const handleMarkAsRead = (convId: string) => {
    setConversations(conversations.map(c => 
      c.id === convId ? { ...c, unread: false, unreadCount: 0 } : c
    ));
    toast.success('Marked as read');
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount === 0) {
      toast.info('No unread messages');
      return;
    }
    
    setConversations(conversations.map(c => ({ ...c, unread: false, unreadCount: 0 })));
    toast.success(`${unreadCount} conversation${unreadCount > 1 ? 's' : ''} marked as read`);
  };

  const handleDelete = (convId: string, participantName: string) => {
    setConversations(conversations.filter(c => c.id !== convId));
    toast.success('Conversation deleted', `Chat with ${participantName}`);
  };

  const handleNewMessage = () => {
    toast.info('New message', 'Select a user to start messaging');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterUnread(false);
    toast.info('Filters cleared');
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '#' },
    { label: 'Messages' }
  ];

  const getRoleBadge = (role: string) => {
    const colors = {
      borrower: 'bg-blue-500/15 text-blue-300',
      lender: 'bg-green-500/15 text-green-300',
      investor: 'bg-purple-500/15 text-purple-300',
      admin: 'bg-red-500/15 text-red-300'
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${colors[role.toLowerCase() as keyof typeof colors]}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300 mb-1">Total Conversations</p>
                <p className="text-3xl font-semibold text-slate-100">{conversations.length}</p>
                <p className="text-xs text-slate-400 mt-1">All messages</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300 mb-1">Unread</p>
                <p className="text-3xl font-semibold text-slate-100">{unreadCount}</p>
                <p className="text-xs text-slate-400 mt-1">Requires attention</p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-lg">
                <MessageSquare className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300 mb-1">This Week</p>
                <p className="text-3xl font-semibold text-slate-100">
                  {conversations.filter(c => c.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </p>
                <p className="text-xs text-slate-400 mt-1">Last 7 days</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <MessageSquare className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversations List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Messages ({filteredConversations.length})</CardTitle>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search messages..."
                  className="pl-9 w-64"
                />
              </div>

              {/* Unread Filter */}
              <Button
                variant={filterUnread ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterUnread(!filterUnread)}
              >
                Unread Only
              </Button>

              {/* Actions */}
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                <CheckCheck className="w-4 h-4 mr-1" />
                Mark All Read
              </Button>

              <Button size="sm" onClick={handleNewMessage}>
                <Plus className="w-4 h-4 mr-1" />
                New Message
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredConversations.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No conversations found"
              description={
                searchQuery || filterUnread
                  ? "No messages match your filters"
                  : "Start a conversation to see it here"
              }
              actionLabel={
                searchQuery || filterUnread
                  ? 'Clear Filters'
                  : 'New Message'
              }
              onAction={
                searchQuery || filterUnread
                  ? handleClearFilters
                  : handleNewMessage
              }
            />
          ) : (
            <div className="space-y-2">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                    conv.unread 
                      ? 'bg-blue-500/10 border-blue-500/30' 
                      : 'bg-white border-white/10 hover:border-white/10'
                  }`}
                  onClick={() => {
                    onSelectConversation?.(conv.id);
                    handleMarkAsRead(conv.id);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold flex-shrink-0">
                      {conv.participantName.split(' ').map(n => n[0]).join('')}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-100">{conv.participantName}</h4>
                          {getRoleBadge(conv.participantRole)}
                          {conv.unread && conv.unreadCount && conv.unreadCount > 0 && (
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-semibold">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 whitespace-nowrap">
                          {formatDistanceToNow(conv.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                      <p className={`text-sm line-clamp-2 ${conv.unread ? 'text-slate-100 font-medium' : 'text-slate-300'}`}>
                        {conv.lastMessage}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {!conv.unread && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(conv.id, conv.participantName);
                          }}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
