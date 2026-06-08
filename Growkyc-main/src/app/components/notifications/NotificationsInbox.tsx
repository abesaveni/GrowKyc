import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from '../../lib/toast';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { EmptyState } from '../ui/empty-state';
import { SearchFilter } from '../ui/search-filter';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { Bell, Mail, MessageSquare, Search, Filter, Check, CheckCheck, Trash2, Eye } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'bid' | 'message' | 'system' | 'kyc' | 'contract' | 'payment';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  relatedPage?: string; // Added to track which page to navigate to
  relatedId?: string; // Added to track specific item ID if needed
}

const initialNotifications: Notification[] = [
  {
    id: 'notif-001',
    type: 'bid',
    title: 'New Bid Placed',
    message: 'A new bid of A$1,100,000 has been placed on MIP-2024-001',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
    actionUrl: '#',
    relatedPage: 'auction_room'
  },
  {
    id: 'notif-002',
    type: 'message',
    title: 'New Message',
    message: 'Sarah Mitchell sent you a message about MIP-2024-003',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    actionUrl: '#',
    relatedPage: 'messages'
  },
  {
    id: 'notif-003',
    type: 'system',
    title: 'Auction Ending Soon',
    message: 'MIP-2024-002 auction ends in 30 minutes',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: true,
    actionUrl: '#',
    relatedPage: 'auction_room'
  },
  {
    id: 'notif-004',
    type: 'bid',
    title: 'Bid Outbid',
    message: 'Your bid on MIP-2024-001 has been outbid',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    actionUrl: '#',
    relatedPage: 'auction_room'
  },
  {
    id: 'notif-005',
    type: 'kyc',
    title: 'KYC Approved',
    message: 'Your KYC verification has been approved',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
    relatedPage: 'kyc'
  },
  {
    id: 'notif-006',
    type: 'contract',
    title: 'Contract Ready for Signature',
    message: 'Contract for MIP-2024-005 is ready for your digital signature',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: false,
    actionUrl: '#',
    relatedPage: 'contracts'
  },
  {
    id: 'notif-007',
    type: 'payment',
    title: 'Payment Received',
    message: 'Your payment of A$1,050,000 has been received and confirmed',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    read: true,
    relatedPage: 'payment'
  }
];

interface NotificationsInboxProps {
  onNavigate?: (page: string) => void;
}

export function NotificationsInbox({ onNavigate }: NotificationsInboxProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [confirmDeleteAllOpen, setConfirmDeleteAllOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Calculate stats
  const unreadCount = notifications.filter(n => !n.read).length;
  const thisWeekCount = notifications.filter(n => 
    n.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const searchMatch = searchQuery === '' || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const typeMatch = typeFilter === 'all' || notification.type === typeFilter;
    const statusMatch = statusFilter === 'all' || 
      (statusFilter === 'unread' && !notification.read) ||
      (statusFilter === 'read' && notification.read);
    
    return searchMatch && typeMatch && statusMatch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'bid':
        return <Bell className="w-5 h-5 text-blue-600" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-green-600" />;
      case 'kyc':
        return <CheckCheck className="w-5 h-5 text-purple-600" />;
      case 'contract':
        return <Mail className="w-5 h-5 text-indigo-600" />;
      case 'payment':
        return <Check className="w-5 h-5 text-emerald-600" />;
      default:
        return <Mail className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    toast.success('Marked as read');
  };

  const handleMarkAllAsRead = () => {
    const unreadNotifs = notifications.filter(n => !n.read);
    if (unreadNotifs.length === 0) {
      toast.info('No unread notifications');
      return;
    }
    
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success(`${unreadNotifs.length} notification${unreadNotifs.length > 1 ? 's' : ''} marked as read`);
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const handleDeleteAll = () => {
    const count = filteredNotifications.length;
    setNotifications(notifications.filter(n => !filteredNotifications.includes(n)));
    setConfirmDeleteAllOpen(false);
    toast.success(`${count} notification${count > 1 ? 's' : ''} deleted`);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setStatusFilter('all');
    toast.info('Filters cleared');
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Unread</p>
                <p className="text-3xl font-semibold text-gray-900">{unreadCount}</p>
                <p className="text-xs text-gray-500 mt-1">Requires attention</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <Bell className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Notifications</p>
                <p className="text-3xl font-semibold text-gray-900">{notifications.length}</p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Week</p>
                <p className="text-3xl font-semibold text-gray-900">{thisWeekCount}</p>
                <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-12 gap-3">
            {/* Search */}
            <div className="col-span-12 md:col-span-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="col-span-6 md:col-span-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary h-10"
              >
                <option value="all">All Types</option>
                <option value="bid">Bids</option>
                <option value="message">Messages</option>
                <option value="system">System</option>
                <option value="kyc">KYC</option>
                <option value="contract">Contracts</option>
                <option value="payment">Payments</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="col-span-6 md:col-span-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'unread' | 'read')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary h-10"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="col-span-12 md:col-span-3 flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                size="sm"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
              >
                <CheckCheck className="w-4 h-4 mr-1" />
                Mark All Read
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Notifications ({filteredNotifications.length})
            </CardTitle>
            {filteredNotifications.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setConfirmDeleteAllOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications"
              description={
                searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                  ? "No notifications match your filters"
                  : "You're all caught up! No notifications to show."
              }
              actionLabel={
                searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                  ? 'Clear Filters'
                  : undefined
              }
              onAction={
                searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                  ? handleClearFilters
                  : undefined
              }
            />
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer ${
                    !notification.read 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    handleMarkAsRead(notification.id);
                    setSelectedNotification(notification);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg border ${!notification.read ? 'bg-white' : 'bg-gray-50'}`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                            {!notification.read && (
                              <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-semibold">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{notification.message}</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                            setSelectedNotification(notification);
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Mark as read
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={confirmDeleteAllOpen}
        onClose={() => setConfirmDeleteAllOpen(false)}
        title="Delete All Notifications?"
        description={`Are you sure you want to delete ${filteredNotifications.length} notification${filteredNotifications.length > 1 ? 's' : ''}? This action cannot be undone.`}
        confirmLabel="Delete All"
        onConfirm={handleDeleteAll}
        variant="danger"
      />

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  {getIcon(selectedNotification.type)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedNotification.title}</h2>
                  <p className="text-sm text-gray-500">
                    {format(selectedNotification.timestamp, 'PPP p')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNotification(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                    {selectedNotification.type}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <p className="text-gray-900 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {selectedNotification.message}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    selectedNotification.read
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedNotification.read ? 'Read' : 'Unread'}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Received</label>
                  <p className="text-gray-600 text-sm">
                    {formatDistanceToNow(selectedNotification.timestamp, { addSuffix: true })}
                  </p>
                </div>

                {/* Related Items Section */}
                {selectedNotification.relatedPage && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Related Item</label>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">
                          {selectedNotification.relatedPage === 'auction_room' && 'Auction Room'}
                          {selectedNotification.relatedPage === 'messages' && 'Messages'}
                          {selectedNotification.relatedPage === 'kyc' && 'KYC Verification'}
                          {selectedNotification.relatedPage === 'contracts' && 'Contracts'}
                          {selectedNotification.relatedPage === 'payment' && 'Payment Details'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Click "Go to Related Item" to view this item
                        </p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Eye className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                  onClick={() => setSelectedNotification(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
                {selectedNotification.actionUrl && (
                  <Button
                    onClick={() => {
                      toast.success('Navigating to related item...');
                      setSelectedNotification(null);
                      if (onNavigate && selectedNotification.relatedPage) {
                        onNavigate(selectedNotification.relatedPage);
                      }
                    }}
                    className="flex-1"
                  >
                    Go to Related Item
                  </Button>
                )}
                <Button
                  onClick={(e) => {
                    handleDelete(selectedNotification.id);
                    setSelectedNotification(null);
                  }}
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}