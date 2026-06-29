import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Bot, Loader2, Send, Shield } from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import {
  ComplianceAIMessage,
  sendComplianceAIMessage
} from '../../../services/complianceAIService';

interface ChatMessage extends ComplianceAIMessage {
  id: string;
  timestamp: Date;
  sources?: Array<{ title: string; type: string }>;
}

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'I am your AI Compliance Analyst Copilot. I can draft ECDD memos, summarize case files, explain risk decisions, and identify missing evidence. I cannot submit SMRs or approve cases without human review.\n\nHow can I assist?',
  timestamp: new Date()
};

interface AICopilotBotProps {
  onBack: () => void;
}

export function AICopilotBot({ onBack }: AICopilotBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setError(null);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date()
    };
    const history: ComplianceAIMessage[] = [...messages, userMsg]
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({
        role: m.role,
        content: m.content
      }));

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendComplianceAIMessage(history, { page: 'tier5-copilot' });
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: res.content,
          timestamp: new Date(),
          sources: res.sources
        }
      ]);
    } catch {
      setError('Unable to reach the compliance AI service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b shrink-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tier 5 Hub
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <Badge className="bg-purple-600 text-white mb-1">AI COPILOT</Badge>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">AI Compliance Analyst Copilot</h1>
              <p className="text-sm text-gray-600">Explainable AI beside every reviewer</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-6 flex flex-col min-h-0">
        <div className="flex items-center gap-2 text-xs text-purple-800 bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 mb-4">
          <Shield className="w-4 h-4 shrink-0" />
          Human approval required for regulatory submissions. Copilot outputs are draft guidance only.
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800" role="alert">
            {error}
          </div>
        )}

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[280px] max-h-[calc(100vh-320px)] pr-1"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white rounded-br-md'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <ul className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                    {msg.sources.map((s) => (
                      <li key={s.title} className="text-xs text-gray-500">
                        {s.type}: {s.title}
                      </li>
                    ))}
                  </ul>
                )}
                <p className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-purple-200' : 'text-gray-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-2 text-sm text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                Analyzing compliance context...
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 pt-2 pb-4">
          <div className="flex gap-2 bg-white border border-gray-300 rounded-xl p-2 shadow-sm">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask about ECDD, risk, SMR process, or case evidence..."
              rows={2}
              className="flex-1 resize-none border-0 focus:ring-0 text-sm px-2 py-1.5 min-h-[44px]"
              disabled={loading}
              aria-label="Copilot message"
            />
            <Button
              type="button"
              onClick={send}
              disabled={loading || !input.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white shrink-0 self-end"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
