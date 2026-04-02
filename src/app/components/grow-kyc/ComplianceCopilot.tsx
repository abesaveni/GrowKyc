import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import {
  Sparkles,
  MessageSquare,
  Send,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RefreshCw,
  Minimize2,
  Maximize2,
  X,
  Zap,
  FileText,
  Shield,
  AlertTriangle,
  HelpCircle,
  BookOpen,
  TrendingUp
} from 'lucide-react';

interface ComplianceCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  context?: {
    page: string;
    clientId?: string;
    caseId?: string;
  };
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: Array<{
    label: string;
    action: string;
  }>;
  sources?: Array<{
    title: string;
    type: string;
  }>;
}

export function ComplianceCopilot({ isOpen, onClose, context }: ComplianceCopilotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      setMessages([{
        id: '1',
        role: 'assistant',
        content: `👋 Hi! I'm your Compliance Copilot, powered by AI. I can help you with:\n\n• Explaining regulatory requirements\n• Suggesting documents needed for cases\n• Answering compliance questions\n• Creating cases and running verifications\n• Analyzing risk profiles\n\nWhat would you like help with today?`,
        timestamp: new Date(),
        actions: [
          { label: 'What documents do I need for EDD?', action: 'edd_docs' },
          { label: 'Why is this client high risk?', action: 'risk_explanation' },
          { label: 'How do I file a suspicious matter report?', action: 'smr_guide' }
        ]
      }]);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response (in production, this would call your AI service)
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (query: string): Message => {
    const lowerQuery = query.toLowerCase();

    // Context-aware responses
    if (lowerQuery.includes('edd') || lowerQuery.includes('enhanced due diligence')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `For Enhanced Due Diligence (EDD), you'll need:\n\n**1. Extended Identity Verification**\n• Certified copy of passport or national ID\n• Proof of address (< 3 months old)\n• Facial recognition verification\n\n**2. Source of Funds/Wealth**\n• Bank statements (6 months)\n• Tax returns (2 years)\n• Employment verification\n• Asset ownership documentation\n\n**3. Business Information (if corporate)**\n• Company structure chart\n• Beneficial ownership details (25%+ holders)\n• Business activity description\n• Financial statements\n\n**4. Enhanced Screening**\n• PEP screening\n• Sanctions list check\n• Adverse media review\n• Ongoing monitoring subscription\n\nWould you like me to create an EDD case with these requirements pre-populated?`,
        timestamp: new Date(),
        actions: [
          { label: 'Create EDD Case', action: 'create_edd' },
          { label: 'View EDD Policy', action: 'view_policy' }
        ],
        sources: [
          { title: 'EDD Policy v1.9', type: 'policy' },
          { title: 'AUSTRAC Guidance', type: 'regulation' }
        ]
      };
    }

    if (lowerQuery.includes('high risk') || lowerQuery.includes('why')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `This client is rated **HIGH RISK** based on:\n\n**🚨 Primary Risk Factors (AI Analysis):**\n1. **PEP Status** - Client is a Politically Exposed Person\n   • Former government official in high-risk jurisdiction\n   • Elevated corruption risk\n\n2. **Complex Ownership Structure**\n   • Circular ownership detected\n   • Multiple offshore entities\n   • Nominee shareholders identified\n\n3. **Geographic Risk**\n   • Operations in high-risk jurisdictions (FATF grey list)\n   • Cross-border transactions with shell company indicators\n\n4. **Transaction Patterns**\n   • Unusual transaction volume spike (+400% in 30 days)\n   • Rapid movement of funds\n   • Structuring indicators detected\n\n**📊 Risk Score Breakdown:**\n• Base risk: 45/100\n• PEP factor: +25\n• Geographic: +15\n• Transaction anomaly: +15\n• **Total: 100/100 (Critical)**\n\n**✅ Recommended Actions:**\n• Enhanced Due Diligence required\n• Daily monitoring recommended\n• Senior manager approval needed for transactions\n\nWould you like me to create an EDD case and enable real-time monitoring?`,
        timestamp: new Date(),
        actions: [
          { label: 'Create EDD Case', action: 'create_edd' },
          { label: 'Enable Daily Monitoring', action: 'enable_monitoring' },
          { label: 'View Risk Model', action: 'view_model' }
        ],
        sources: [
          { title: 'AI Risk Model v2.3', type: 'model' },
          { title: 'FATF Recommendation 10', type: 'regulation' }
        ]
      };
    }

    if (lowerQuery.includes('smr') || lowerQuery.includes('suspicious matter')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Here's how to file a Suspicious Matter Report (SMR) to AUSTRAC:\n\n**Step 1: Gather Information**\n• Client details and transaction history\n• Specific suspicious indicators\n• Timeline of events\n• Supporting evidence\n\n**Step 2: Complete SMR Form**\nI can help you auto-generate the SMR with:\n• Pre-filled client information from our system\n• Transaction analysis summary\n• Risk indicators identified by AI\n• Linked evidence from Evidence Vault\n\n**Step 3: Review & Submit**\n• Compliance Officer approval required\n• 24-hour deadline from identification\n• Electronic submission to AUSTRAC\n• Confirmation receipt stored\n\n**⚠️ Important Reminders:**\n• Do NOT inform client (tipping off offense)\n• Document decision-making process\n• Keep evidence for 7 years\n• Monitor AUSTRAC acknowledgment\n\nWould you like me to start an SMR draft for this case?`,
        timestamp: new Date(),
        actions: [
          { label: 'Start SMR Draft', action: 'start_smr' },
          { label: 'View SMR Template', action: 'view_template' },
          { label: 'Check Deadline', action: 'check_deadline' }
        ],
        sources: [
          { title: 'AML/CTF Act Section 41', type: 'legislation' },
          { title: 'AUSTRAC SMR Guide', type: 'guidance' }
        ]
      };
    }

    if (lowerQuery.includes('create') || lowerQuery.includes('case')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `I can create a new case for you. What type of case do you need?\n\n**Available Case Types:**\n\n1. **Standard CDD** - Customer Due Diligence\n   • For low-medium risk clients\n   • Standard verification requirements\n   • 2-year review cycle\n\n2. **Enhanced Due Diligence (EDD)**\n   • For high-risk clients\n   • Extended verification\n   • 12-month review cycle\n\n3. **Periodic Review**\n   • Annual CDD refresh\n   • Update client information\n   • Re-screening and monitoring\n\n4. **Suspicious Matter Investigation**\n   • For potential SMR\n   • Detailed investigation workflow\n   • Evidence collection\n\n5. **Remediation**\n   • Fix incomplete cases\n   • Update missing documents\n\nWhich case type would you like to create?`,
        timestamp: new Date(),
        actions: [
          { label: 'Create Standard CDD', action: 'create_cdd' },
          { label: 'Create EDD Case', action: 'create_edd' },
          { label: 'Create Investigation', action: 'create_investigation' }
        ]
      };
    }

    // Default response with suggestions
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `I can help you with that! Here are some things I can assist with:\n\n**📋 Case Management**\n• Create and manage CDD/EDD cases\n• Explain document requirements\n• Track case status and deadlines\n\n**🔍 Risk Analysis**\n• Explain risk ratings\n• Identify risk factors\n• Suggest mitigation actions\n\n**📊 Compliance Tasks**\n• Guide through regulatory processes\n• Help with SMR/TTR reporting\n• Policy and procedure lookup\n\n**🤖 Automation**\n• Run verifications\n• Generate reports\n• Automate routine tasks\n\nCould you provide more details about what you'd like help with?`,
      timestamp: new Date(),
      actions: [
        { label: 'Explain a risk rating', action: 'explain_risk' },
        { label: 'Show me compliance calendar', action: 'show_calendar' },
        { label: 'Run a verification', action: 'run_verification' }
      ]
    };
  };

  const handleActionClick = (action: string) => {
    // Add follow-up message
    const actionMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Action executed: ${action}\n\nI've started that process for you. Is there anything else I can help with?`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, actionMessage]);
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
    setTimeout(() => handleSend(), 100);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed ${isMinimized ? 'bottom-4 right-4' : 'bottom-4 right-4'} z-50 transition-all`}>
      {isMinimized ? (
        <Button
          size="lg"
          className="rounded-full w-14 h-14 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={() => setIsMinimized(false)}
        >
          <Sparkles className="w-6 h-6" />
        </Button>
      ) : (
        <Card className="w-96 h-[600px] shadow-2xl flex flex-col">
          <CardHeader className="border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <CardTitle className="text-white">Compliance Copilot</CardTitle>
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
                <Zap className="w-3 h-3 mr-1" />
                AI-Powered
              </Badge>
              <Badge className="bg-white/20 text-white text-xs">
                Real-time
              </Badge>
            </div>
          </CardHeader>

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
                  
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.actions.map((action, idx) => (
                        <Button
                          key={idx}
                          size="sm"
                          variant="outline"
                          className="w-full justify-start text-xs bg-white"
                          onClick={() => handleActionClick(action.action)}
                        >
                          <Zap className="w-3 h-3 mr-2" />
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}

                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <div className="text-xs text-gray-600 mb-2">Sources:</div>
                      {message.sources.map((source, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                          <BookOpen className="w-3 h-3" />
                          <span>{source.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {source.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-xs opacity-60 mt-2">
                    {message.timestamp.toLocaleTimeString('en-AU', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask me anything about compliance..."
                className="resize-none"
                rows={2}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
