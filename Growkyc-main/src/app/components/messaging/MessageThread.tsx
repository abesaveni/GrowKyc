import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { toast } from '../../lib/toast';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { EmptyState } from '../ui/empty-state';
import { 
  ArrowLeft,
  Send,
  Paperclip,
  Image as ImageIcon,
  MoreVertical,
  User,
  Check,
  CheckCheck
} from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
  isCurrentUser: boolean;
}

const mockMessages: Message[] = [
  {
    id: 'msg-001',
    senderId: '2',
    senderName: 'Sarah Mitchell',
    content: 'Hi, I\'m interested in learning more about the property at 45 Bourke Street. Can you provide additional details?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
    isCurrentUser: false
  },
  {
    id: 'msg-002',
    senderId: '1',
    senderName: 'You',
    content: 'Absolutely! The property is a 3-bedroom house in excellent condition. The valuation report shows strong upside potential.',
    timestamp: new Date(Date.now() - 90 * 60 * 1000),
    read: true,
    isCurrentUser: true
  },
  {
    id: 'msg-003',
    senderId: '2',
    senderName: 'Sarah Mitchell',
    content: 'That sounds great. What\'s the current LVR on the outstanding debt?',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    read: true,
    isCurrentUser: false
  },
  {
    id: 'msg-004',
    senderId: '1',
    senderName: 'You',
    content: 'The LVR is 68%, which provides a strong safety margin. The property is in a high-demand area with good rental yield.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    read: true,
    isCurrentUser: true
  },
  {
    id: 'msg-005',
    senderId: '2',
    senderName: 'Sarah Mitchell',
    content: 'Perfect! I\'d like to schedule a property inspection. When would be available?',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
    isCurrentUser: false
  }
];

interface MessageThreadProps {
  threadId?: string;
  recipientName?: string;
  onBack?: () => void;
}

export function MessageThread({ threadId = 'thread-001', recipientName = 'Sarah Mitchell', onBack }: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsSending(true);

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: '1',
      senderName: 'You',
      content: newMessage,
      timestamp: new Date(),
      read: true,
      isCurrentUser: true
    };

    await new Promise(resolve => setTimeout(resolve, 500));

    setMessages([...messages, message]);
    setNewMessage('');
    setIsSending(false);

    toast.success('Message sent');
  };

  const handleAttachment = () => {
    toast.info('Attachment feature', 'Select files to attach');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '#' },
    { label: 'Messages', href: '#', onClick: onBack },
    { label: recipientName }
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      <Card className="h-[700px] flex flex-col">
        {/* Thread Header */}
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                {recipientName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <CardTitle className="text-lg">{recipientName}</CardTitle>
                <p className="text-xs text-gray-500">Active now</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <EmptyState
              icon={User}
              title="No messages yet"
              description="Start the conversation by sending a message"
            />
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${message.isCurrentUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  {!message.isCurrentUser && (
                    <span className="text-xs text-gray-500 ml-1">{message.senderName}</span>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      message.isCurrentUser
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <div className="flex items-center gap-1 px-1">
                    <span className="text-xs text-gray-500">
                      {format(message.timestamp, 'HH:mm')}
                    </span>
                    {message.isCurrentUser && (
                      message.read ? (
                        <CheckCheck className="w-3 h-3 text-blue-600" />
                      ) : (
                        <Check className="w-3 h-3 text-gray-400" />
                      )
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex items-end gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleAttachment}
              className="flex-shrink-0"
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            
            <div className="flex-1">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message... (Press Enter to send)"
                className="resize-none min-h-[60px]"
                rows={2}
              />
            </div>

            <Button 
              size="lg"
              onClick={handleSendMessage}
              disabled={isSending || !newMessage.trim()}
              className="flex-shrink-0"
            >
              {isSending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </Card>
    </div>
  );
}
