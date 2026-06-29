import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  HelpCircle
} from 'lucide-react';
import { toast } from '../../../lib/toast';

interface OnboardingChatProps {
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function OnboardingChat({ onClose }: OnboardingChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm here to help you through the onboarding process. I can answer questions about:\n\n• What information you need\n• Why we need certain details\n• How long the process takes\n• What happens after you submit\n\nWhat would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('long') || lowerMessage.includes('time')) {
      return "The entire onboarding process typically takes 10-15 minutes to complete. Here's the breakdown:\n\n• Structure (2 min)\n• Ownership (3 min)\n• Verification (4 min)\n• Business Profile (3 min)\n• Consent (2 min)\n• Review (1 min)\n\nYou can save and resume anytime!";
    }

    if (lowerMessage.includes('why') || lowerMessage.includes('need')) {
      return "We collect this information to comply with Australian AML/CTF regulations. This includes:\n\n✓ Identifying beneficial owners (25%+ ownership)\n✓ Verifying identities to prevent fraud\n✓ Assessing risk levels\n✓ Meeting AUSTRAC reporting requirements\n\nAll your data is encrypted and securely stored.";
    }

    if (lowerMessage.includes('beneficial owner') || lowerMessage.includes('25%')) {
      return "A beneficial owner is anyone who:\n\n• Owns 25% or more of the entity\n• Has ultimate control through other means\n\nUnder AML/CTF law, we must identify and verify all beneficial owners. If no one owns 25%+, we'll ask who has control through voting rights or appointments.";
    }

    if (lowerMessage.includes('verification') || lowerMessage.includes('id') || lowerMessage.includes('document')) {
      return "For identity verification, we accept:\n\n✓ Australian Driver License\n✓ Passport\n✓ Medicare Card\n✓ National ID Card\n\nWe use secure third-party verification services. Your documents are processed within 2-3 minutes and encrypted during upload.";
    }

    if (lowerMessage.includes('what happens') || lowerMessage.includes('after') || lowerMessage.includes('submit')) {
      return "After submission:\n\n1️⃣ Automated checks run immediately (sanctions, PEP, adverse media)\n2️⃣ Compliance team reviews within 24-48 hours\n3️⃣ You receive email notification of status\n4️⃣ If approved, immediate platform access\n5️⃣ If more info needed, we'll email specific requirements\n\nMost applications are approved within 1 business day!";
    }

    if (lowerMessage.includes('risk') || lowerMessage.includes('score')) {
      return "Your risk score is calculated based on:\n\n• Industry type\n• Cash handling\n• Crypto exposure\n• Cross-border transactions\n• Countries of operation\n\nHigher risk doesn't mean rejection - it just means enhanced checks. This is completely normal and helps us maintain compliance.";
    }

    if (lowerMessage.includes('trust') || lowerMessage.includes('trustee')) {
      return "For trusts, we need:\n\n• Trust name and type\n• Trustee details (corporate or individual)\n• Appointor information\n• Beneficial ownership structure\n\nCorporate trustees require additional documentation. Discretionary trusts typically have higher compliance requirements.";
    }

    if (lowerMessage.includes('company') || lowerMessage.includes('acn')) {
      return "For companies:\n\n• We'll auto-lookup ASIC data using your ACN\n• This pre-fills company details\n• We need all directors and shareholders\n• Anyone with 25%+ ownership is a beneficial owner\n\nMake sure your ASIC details are current before starting!";
    }

    // Default response
    return "I'm here to help! You can ask me about:\n\n• Required documents\n• Processing times\n• Why we need certain information\n• What happens after submission\n• Technical issues\n• Risk assessments\n\nJust type your question and I'll do my best to help!";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-2">
        <Button
          size="lg"
          className="rounded-full w-16 h-16 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={() => setIsMinimized(false)}
        >
          <MessageCircle className="w-7 h-7" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <CardTitle className="text-white">Onboarding Assistant</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                onClick={() => setIsMinimized(true)}
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-white/20 text-white text-xs">
              AI-Powered
            </Badge>
            <Badge className="bg-white/20 text-white text-xs">
              Instant Help
            </Badge>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                <div className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString('en-AU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input Area */}
        <div className="border-t p-4 flex-shrink-0">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask me anything..."
              className="min-h-[60px] resize-none"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              size="lg"
              className="px-4"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <HelpCircle className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">
              Press Enter to send, Shift+Enter for new line
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
