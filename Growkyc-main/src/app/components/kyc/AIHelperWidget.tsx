import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Sparkles,
  X,
  HelpCircle,
  Lightbulb,
  Zap,
  FileText,
  CheckCircle,
  AlertTriangle,
  Users,
  Send,
  Download,
  Edit,
  Search,
  Brain
} from 'lucide-react';

interface AIHelperContext {
  screen: string;
  userRole: string;
  currentTask?: string;
  completionStatus?: number;
}

interface AISuggestion {
  id: string;
  type: 'next-step' | 'explanation' | 'fix' | 'draft' | 'action';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  action?: () => void;
}

export function AIHelperWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'help' | 'actions' | 'chat'>('help');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', message: string }>>([]);

  // Context-aware based on current screen
  const [context] = useState<AIHelperContext>({
    screen: 'client-onboarding',
    userRole: 'Client Manager',
    currentTask: 'Complete CDD for TechCorp Pty Ltd',
    completionStatus: 60
  });

  const suggestions: AISuggestion[] = [
    {
      id: 'S1',
      type: 'next-step',
      title: 'Next Required Step',
      description: 'Complete beneficial ownership graph. 2 parties identified, but control person analysis not done.',
      confidence: 0.95,
      actionable: true
    },
    {
      id: 'S2',
      type: 'fix',
      title: 'Missing Information Detected',
      description: 'Source of funds documentation not uploaded. This is required for HIGH risk clients.',
      confidence: 0.98,
      actionable: true
    },
    {
      id: 'S3',
      type: 'explanation',
      title: 'Why Enhanced CDD?',
      description: 'Client triggered Enhanced CDD due to: High-risk jurisdiction (Malaysia), Complex structure, International transactions.',
      confidence: 0.92,
      actionable: false
    },
    {
      id: 'S4',
      type: 'action',
      title: 'Quick Action Available',
      description: 'AI can draft Enhanced CDD memo based on current information. You can review and edit before submission.',
      confidence: 0.85,
      actionable: true
    }
  ];

  const quickActions = [
    {
      id: 'A1',
      icon: FileText,
      label: 'Draft CDD Memo',
      description: 'AI will generate complete CDD memo with evidence citations',
      color: 'purple'
    },
    {
      id: 'A2',
      icon: Users,
      label: 'Create Missing Party List',
      description: 'Identify beneficial owners and controllers not yet documented',
      color: 'blue'
    },
    {
      id: 'A3',
      icon: Send,
      label: 'Request Docs from Client',
      description: 'Generate document request email with specific requirements',
      color: 'green'
    },
    {
      id: 'A4',
      icon: CheckCircle,
      label: 'Prepare Approval Pack',
      description: 'Compile senior manager approval pack with all evidence',
      color: 'orange'
    },
    {
      id: 'A5',
      icon: Download,
      label: 'Export Evidence Pack',
      description: 'Generate complete evidence pack for audit purposes',
      color: 'indigo'
    },
    {
      id: 'A6',
      icon: AlertTriangle,
      label: 'Escalate to Compliance',
      description: 'Create case and notify compliance officer',
      color: 'red'
    }
  ];

  const explanations = [
    {
      question: 'What is a "control person"?',
      answer: 'A control person is anyone who directly or indirectly controls the entity, even if they own less than 25%. Control can be through voting rights, power to appoint directors, or other means. You must identify and verify ALL control persons.'
    },
    {
      question: 'What triggers Enhanced CDD?',
      answer: 'Enhanced CDD is triggered by: HIGH risk rating, PEP involvement, High-risk jurisdictions (FATF/DFAT listed), Complex ownership structures, Unusual transaction patterns, or Sanctions screening concerns.'
    },
    {
      question: 'What evidence is acceptable for Source of Funds?',
      answer: 'Acceptable evidence includes: Bank statements (last 6 months), Sale agreements for assets, Loan documentation, Tax returns, Financial statements, Investment statements. Evidence must be independently verifiable.'
    },
    {
      question: 'Can I delay CDD?',
      answer: 'CDD can only be delayed in specific circumstances defined in your policy. If delayed: Client marked "UNVERIFIED", Cannot deal with client funds, Countdown timer set, Auto-lock if not completed in timeframe. System enforces these rules.'
    }
  ];

  const handleSendChat = () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatHistory([...chatHistory, { role: 'user', message: userMessage }]);

    // Simulate AI response based on common queries
    setTimeout(() => {
      let response = '';
      
      if (userMessage.toLowerCase().includes('beneficial owner')) {
        response = 'A beneficial owner is any individual who ultimately owns or controls more than 25% of the entity, OR exercises control through other means (voting rights, director appointments, etc.).\n\nFor this client (TechCorp Pty Ltd), you need to:\n1. Trace ownership through all corporate layers\n2. Identify individuals at the end of the chain\n3. Verify each beneficial owner with ID + screening\n\nCurrent status: 2 parties identified, but beneficial ownership analysis incomplete.\n\n**Policy Reference:** Section 2.3.4 - Beneficial Ownership Requirements\n**Evidence:** Policy Document (https://...)';
      } else if (userMessage.toLowerCase().includes('source of funds')) {
        response = 'Source of Funds (SOF) explains where the money for THIS specific transaction came from. For Enhanced CDD (required for HIGH risk clients), you need:\n\n**Documentary Evidence:**\n• Bank statements showing origin (last 6 months)\n• Sale agreements if funds from asset sale\n• Loan documentation if borrowed\n• Tax returns or financial statements\n\n**Verification Level:**\nHIGH risk = Level 3 (Independent corroboration required)\n\n**Current Status:** ⚠️ MISSING - You should request this from client via document request.\n\n**Quick Action:** I can draft a document request email for you. Would you like me to generate it?';
      } else if (userMessage.toLowerCase().includes('how long')) {
        response = 'Based on the current client (TechCorp Pty Ltd - HIGH risk company):\n\n**Estimated Time Remaining:**\n• Beneficial ownership analysis: 10-15 min\n• Source of funds/wealth collection: 1-2 days (waiting on client)\n• Enhanced CDD memo draft: 5 min (I can do this)\n• Senior manager review: 1-2 days\n• Final approval: 5 min\n\n**Total:** 3-5 business days from now\n\n**Next Actions:**\n1. Complete beneficial ownership graph (15 min)\n2. Request documents from client (use Quick Action)\n3. Let me draft Enhanced CDD memo while you wait';
      } else {
        response = `I understand you're asking about "${userMessage}". Let me check our compliance policy and processes.\n\n**Context:** You're currently working on ${context.currentTask}\n\nBased on your role (${context.userRole}), I can help with:\n• Explaining compliance requirements\n• Drafting documents and memos\n• Identifying missing information\n• Creating task lists\n• Escalating to compliance officer\n\nCould you be more specific about what you need help with? Or try one of the Quick Actions below.`;
      }

      setChatHistory(prev => [...prev, { role: 'assistant', message: response }]);
    }, 500);

    setChatInput('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50 group"
      >
        <Brain className="w-8 h-8 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
          4
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6" />
            <h3 className="text-lg font-bold">AI Helper</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-purple-100">
          Context: {context.currentTask}
        </p>
        {context.completionStatus && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{context.completionStatus}%</span>
            </div>
            <div className="w-full bg-purple-400 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all"
                style={{ width: `${context.completionStatus}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'help', label: 'Help', icon: HelpCircle },
          { id: 'actions', label: 'Actions', icon: Zap },
          { id: 'chat', label: 'Ask AI', icon: Sparkles }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Help Tab */}
        {activeTab === 'help' && (
          <div className="space-y-4">
            <div className="bg-gray-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-purple-600" />
                <h4 className="font-bold text-purple-900">What I Can Help With</h4>
              </div>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Show you what to do next</li>
                <li>• Explain compliance requirements</li>
                <li>• Identify missing information</li>
                <li>• Draft documents and memos</li>
                <li>• Generate approval packs</li>
                <li>• Answer policy questions</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-3">AI Suggestions</h4>
              <div className="space-y-2">
                {suggestions.map((suggestion) => (
                  <div key={suggestion.id} className={`p-3 rounded-lg border-2 ${
                    suggestion.type === 'next-step' ? 'border-blue-200 bg-blue-50' :
                    suggestion.type === 'fix' ? 'border-red-200 bg-red-50' :
                    suggestion.type === 'explanation' ? 'border-yellow-200 bg-yellow-50' :
                    'border-purple-200 bg-purple-50'
                  }`}>
                    <div className="flex items-start justify-between mb-1">
                      <h5 className="font-semibold text-gray-900 text-sm">{suggestion.title}</h5>
                      <span className="text-xs text-gray-500">
                        {Math.round(suggestion.confidence * 100)}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 mb-2">{suggestion.description}</p>
                    {suggestion.actionable && (
                      <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-xs py-1">
                        Take Action
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-3">Common Questions</h4>
              <div className="space-y-2">
                {explanations.slice(0, 3).map((item, index) => (
                  <button
                    key={index}
                    className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-left transition-colors"
                    onClick={() => {
                      setActiveTab('chat');
                      setChatHistory([
                        { role: 'user', message: item.question },
                        { role: 'assistant', message: item.answer }
                      ]);
                    }}
                  >
                    <p className="text-sm font-semibold text-gray-900">{item.question}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions Tab */}
        {activeTab === 'actions' && (
          <div className="space-y-3">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                <strong>Quick Actions:</strong> One-click AI-powered workflows to speed up your compliance work.
              </p>
            </div>

            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  className={`w-full p-4 bg-${action.color}-50 border-2 border-${action.color}-200 rounded-lg hover:shadow-md transition-all text-left`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 text-${action.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-900 mb-1">{action.label}</h5>
                      <p className="text-xs text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}

            <div className="p-3 bg-white border border-gray-200 rounded-lg">
              <p className="text-xs text-yellow-900">
                <strong>Note:</strong> All AI actions generate drafts for your review. You maintain final approval.
              </p>
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            {chatHistory.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <Sparkles className="w-12 h-12 text-purple-600 mb-4" />
                <h4 className="font-bold text-gray-900 mb-2">Ask Me Anything</h4>
                <p className="text-sm text-gray-600 mb-4">
                  I can answer questions about compliance, explain requirements, or cite relevant policy sections.
                </p>
                <div className="space-y-2 w-full">
                  {[
                    'What is Enhanced CDD?',
                    'Who is a beneficial owner?',
                    'What evidence do I need?'
                  ].map((q, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setChatInput(q);
                        handleSendChat();
                      }}
                      className="w-full p-2 bg-purple-50 hover:bg-purple-100 rounded-lg text-sm text-purple-900 font-semibold transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 space-y-3 mb-4">
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-lg ${
                      chat.role === 'user' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{chat.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Input (only show on chat tab) */}
      {activeTab === 'chat' && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Ask about compliance..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
            <Button 
              onClick={handleSendChat}
              className="bg-purple-600 hover:bg-purple-700 px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            AI cites policy sections. If policy doesn't cover it, I'll tell you and suggest escalation.
          </p>
        </div>
      )}

      {/* Footer Info */}
      {activeTab !== 'chat' && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            <strong>Safe AI:</strong> I suggest, you decide. All critical actions require your approval.
          </p>
        </div>
      )}
    </div>
  );
}
