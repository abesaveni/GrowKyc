import React from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { formatDistanceToNow } from 'date-fns';

export interface Message {
  id: string;
  sender: {
    name: string;
    role: string;
  };
  content: string;
  timestamp: Date;
  isCurrentUser?: boolean;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const initials = message.sender.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className={`flex gap-3 ${message.isCurrentUser ? 'flex-row-reverse' : ''}`}>
      <Avatar className="w-8 h-8">
        <AvatarFallback className={message.isCurrentUser ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}>
          {initials}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex-1 max-w-md ${message.isCurrentUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm font-medium text-gray-900">{message.sender.name}</span>
          <span className="text-xs text-gray-500">{message.sender.role}</span>
        </div>
        
        <div className={`rounded-lg px-4 py-2 ${
          message.isCurrentUser
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}>
          <p className="text-sm">{message.content}</p>
        </div>
        
        <span className="text-xs text-gray-500 mt-1">
          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
