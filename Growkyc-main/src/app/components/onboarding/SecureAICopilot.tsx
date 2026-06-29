import React, { useState } from 'react';
import {
  Bot,
  Search,
  Send,
  Paperclip,
  Sparkles,
  FileText,
  ExternalLink,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Shield,
  Lock,
  History,
  Zap,
  CheckCircle
} from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './DesignSystem';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: {
    title: string;
    type: 'internal' | 'external';
    url?: string;
    snippet?: string;
  }[];
  suggested?: string[];
}

interface SearchResult {
  title: string;
  type: 'document' | 'template' | 'workflow' | 'external';
  category: string;
  snippet: string;
  relevance: number;
  lastModified?: string;
}

export function SecureAICopilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your secure AI assistant. I can help you search through your firm's documents, templates, workflows, and public resources like government websites. I'm trained on your firm's knowledge base and can provide insights while maintaining complete data security. How can I assist you today?",
      timestamp: new Date(),
      suggested: [
        'Show me Division 7A loan templates',
        'How do I handle trust distributions?',
        'What are the ATO reporting requirements?',
        'Find client onboarding checklists'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(inputValue),
        timestamp: new Date(),
        sources: getRelevantSources(inputValue),
        suggested: getFollowUpSuggestions(inputValue)
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const getAIResponse = (query: string): string => {
    // Simulated AI responses based on query patterns
    if (query.toLowerCase().includes('division 7a')) {
      return "Based on your firm's templates and current ATO guidance, here's what I found about Division 7A loans:\n\nA Division 7A loan must:\n1. Be documented with a written loan agreement\n2. Charge the benchmark interest rate (currently 8.27% for 2024)\n3. Have minimum yearly repayments\n4. Be repaid within 7 years (or 25 years for secured property loans)\n\nI found 3 Division 7A templates in your document library and the latest ATO ruling TR 2010/3. Would you like me to show you these templates?";
    } else if (query.toLowerCase().includes('trust distribution')) {
      return "Trust distributions require careful documentation. Based on your firm's procedures:\n\n1. Trustee must make distribution resolution before June 30\n2. Document beneficiaries and amounts\n3. Consider tax implications for each beneficiary\n4. Maintain minutes of trustee meetings\n\nI found your 'Trust Distribution Checklist' template and the ATO's Trust Tax Return guide (NAT 0659). The checklist has been used 47 times this year.";
    } else if (query.toLowerCase().includes('ato reporting')) {
      return "ATO reporting requirements vary by entity type. Here are the key obligations:\n\n**Companies:**\n- Annual tax return due 15 May (or extended dates for agents)\n- PAYG instalments quarterly\n- BAS monthly/quarterly depending on turnover\n\n**Trusts:**\n- Trust tax return due same as companies\n- Distribution statements to beneficiaries\n\n**SMSFs:**\n- Annual return and member statements\n- Auditor's report\n\nI found 12 related templates and the ATO's latest lodgment guide. Would you like specific details for any entity type?";
    } else if (query.toLowerCase().includes('onboarding')) {
      return "Your firm has 8 standardized onboarding workflows:\n\n1. **Standard Client Onboarding** (12 steps, avg 45 mins)\n   - Engagement letter\n   - KYC verification\n   - System setup\n   - Initial meeting\n\n2. **Corporate Client Onboarding** (15 steps, avg 90 mins)\n   - Enhanced due diligence\n   - ASIC verification\n   - Multiple stakeholder coordination\n\n3. **SMSF Onboarding** (10 steps, avg 60 mins)\n\nThe most popular is 'Standard Client Onboarding' with 156 completions this year. Would you like me to walk you through any of these?";
    } else {
      return `I understand you're asking about "${query}". I've searched through your firm's documents, templates, and relevant external resources.\n\nBased on what I found, I can help you with:\n- Relevant templates and workflows\n- Best practice guidance\n- Regulatory requirements\n- Similar client cases\n\nCould you provide more specific details about what you're trying to achieve? For example, are you:\n- Looking for a specific template?\n- Need compliance guidance?\n- Setting up a new process?\n- Researching client work?`;
    }
  };

  const getRelevantSources = (query: string): Message['sources'] => {
    return [
      {
        title: 'Division 7A Loan Agreement Template',
        type: 'internal',
        snippet: 'Standard Division 7A loan agreement with all required clauses...'
      },
      {
        title: 'ATO - Division 7A',
        type: 'external',
        url: 'https://ato.gov.au/division-7a',
        snippet: 'Official ATO guidance on Division 7A loans and deemed dividends...'
      },
      {
        title: 'Client Onboarding Checklist',
        type: 'internal',
        snippet: 'Comprehensive checklist for new client setup including KYC...'
      }
    ];
  };

  const getFollowUpSuggestions = (query: string): string[] => {
    return [
      'Show me the loan agreement template',
      'What are the interest rate requirements?',
      'Find examples from similar clients',
      'What are the penalties for non-compliance?'
    ];
  };

  const handleSuggestedClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white border-2 border-gray-200 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b-2 border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg">
            <Bot className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-white">
            <h3 className="font-bold text-lg">Secure AI Copilot</h3>
            <p className="text-sm text-purple-100">Powered by your firm's knowledge base</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
            <Shield className="w-3 h-3" />
            SECURE
          </span>
          <span className="flex items-center gap-1 px-3 py-1 bg-white text-purple-600 text-xs font-bold rounded-full">
            <Lock className="w-3 h-3" />
            ENCRYPTED
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-4`}>
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-bold text-purple-600">AI ASSISTANT</span>
                </div>
              )}
              <p className="whitespace-pre-line">{message.content}</p>

              {/* Sources */}
              {message.sources && message.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <p className="text-xs font-bold text-gray-700 mb-2">SOURCES:</p>
                  <div className="space-y-2">
                    {message.sources.map((source, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 bg-white border border-gray-200 rounded">
                        <FileText className="w-4 h-4 text-gray-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-semibold text-gray-900">{source.title}</p>
                            {source.type === 'external' && (
                              <ExternalLink className="w-3 h-3 text-blue-600" />
                            )}
                          </div>
                          {source.snippet && (
                            <p className="text-xs text-gray-600 mt-1">{source.snippet}</p>
                          )}
                        </div>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Copy className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Follow-ups */}
              {message.suggested && message.suggested.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <p className="text-xs font-bold text-gray-700 mb-2">SUGGESTED FOLLOW-UPS:</p>
                  <div className="flex flex-wrap gap-2">
                    {message.suggested.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestedClick(suggestion)}
                        className="px-3 py-1 bg-white border border-purple-300 text-purple-700 text-xs rounded-full hover:bg-purple-50"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback */}
              {message.role === 'assistant' && (
                <div className="mt-3 pt-3 border-t border-gray-300 flex items-center gap-2">
                  <span className="text-xs text-gray-600">Was this helpful?</span>
                  <button className="p-1 hover:bg-gray-200 rounded" onClick={() => toast.success('Thank you for your feedback!')}>
                    <ThumbsUp className="w-3 h-3 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded" onClick={() => toast.info('We\'ll improve our responses')}>
                    <ThumbsDown className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                <span className="text-sm text-gray-600">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Access Buttons */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setInputValue('Show me all Division 7A templates')}
            className="px-3 py-1 bg-white border border-gray-300 text-xs rounded-full hover:bg-gray-100"
          >
            <Zap className="w-3 h-3 inline mr-1" />
            Division 7A
          </button>
          <button
            onClick={() => setInputValue('Find client onboarding workflows')}
            className="px-3 py-1 bg-white border border-gray-300 text-xs rounded-full hover:bg-gray-100"
          >
            <Zap className="w-3 h-3 inline mr-1" />
            Onboarding
          </button>
          <button
            onClick={() => setInputValue('What are the latest ATO changes?')}
            className="px-3 py-1 bg-white border border-gray-300 text-xs rounded-full hover:bg-gray-100"
          >
            <Zap className="w-3 h-3 inline mr-1" />
            ATO Updates
          </button>
          <button
            onClick={() => setInputValue('Show engagement letter templates')}
            className="px-3 py-1 bg-white border border-gray-300 text-xs rounded-full hover:bg-gray-100"
          >
            <Zap className="w-3 h-3 inline mr-1" />
            Templates
          </button>
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t-2 border-gray-200">
        <div className="flex gap-3">
          <button className="p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything about your firm's documents, templates, or compliance..."
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSendMessage}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            disabled={!inputValue.trim()}
          >
            <Send className="w-5 h-5" />
            Send
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
          <Shield className="w-3 h-3" />
          All conversations are encrypted and stored securely. Your data never leaves your firm's environment.
        </p>
      </div>
    </div>
  );
}

// Training & Enablement Component
export function TrainingCenter() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const modules = [
    {
      id: 'onboarding',
      title: 'Client Onboarding Mastery',
      description: 'Learn the complete client onboarding process',
      duration: '45 mins',
      lessons: 8,
      completed: 6,
      topics: ['Initial contact', 'Engagement letters', 'KYC procedures', 'System setup', 'First meeting', 'Documentation', 'Follow-up', 'Best practices']
    },
    {
      id: 'tax-compliance',
      title: 'Tax Compliance Workflows',
      description: 'Master standardized tax preparation workflows',
      duration: '60 mins',
      lessons: 10,
      completed: 10,
      topics: ['Document collection', 'Data entry', 'Review procedures', 'Client communication', 'Lodgment', 'Follow-up']
    },
    {
      id: 'document-management',
      title: 'Document Management Best Practices',
      description: 'Learn to effectively use document templates and version control',
      duration: '30 mins',
      lessons: 5,
      completed: 0,
      topics: ['Template library', 'Version control', 'Collaboration', 'Security', 'Best practices']
    },
    {
      id: 'client-communication',
      title: 'Professional Client Communications',
      description: 'Master email templates and client messaging',
      duration: '40 mins',
      lessons: 7,
      completed: 3,
      topics: ['Email templates', 'Meeting agendas', 'Follow-up protocols', 'Difficult conversations', 'Professional tone']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Training & Enablement Center</h2>
          <p className="text-gray-600">AI-powered learning system with self-paced modules</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-gray-600">Your Progress</p>
            <p className="text-2xl font-bold text-gray-900">63%</p>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#e5e7eb"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#8b5cf6"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 28 * 0.63} ${2 * Math.PI * 28}`}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module) => {
          const progress = (module.completed / module.lessons) * 100;
          const isCompleted = module.completed === module.lessons;

          return (
            <div key={module.id} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-purple-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{module.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>⏱️ {module.duration}</span>
                    <span>📚 {module.lessons} lessons</span>
                  </div>
                </div>
                {isCompleted && (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-bold text-gray-900">{module.completed}/{module.lessons} completed</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Topics */}
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-700 uppercase mb-2">Topics Covered</p>
                <div className="flex flex-wrap gap-1">
                  {module.topics.map((topic, idx) => (
                    <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={() => setSelectedModule(module.id)}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                {isCompleted ? 'Review Module' : progress > 0 ? 'Continue Learning' : 'Start Module'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Learning Path */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-6">
        <h3 className="font-bold text-xl mb-2">Recommended Learning Path</h3>
        <p className="mb-4 opacity-90">Based on your role and progress, we recommend:</p>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100">
            Start Document Management →
          </button>
          <button className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800">
            View All Courses
          </button>
        </div>
      </div>
    </div>
  );
}

// Document Management with Version Control
export function DocumentCollaboration() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Document Collaboration</h2>
        <p className="text-gray-600">Secure, searchable store with version control</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Documents', value: '1,247', icon: FileText, color: 'blue' },
          { label: 'Templates', value: '324', icon: Copy, color: 'green' },
          { label: 'Workflows', value: '89', icon: Zap, color: 'purple' },
          { label: 'Team Members', value: '24', icon: Users, color: 'orange' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg p-4">
              <Icon className={`w-6 h-6 text-${stat.color}-600 mb-2`} />
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Document Categories */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { category: 'Policies & Procedures', count: 45, lastUpdated: '2 days ago' },
          { category: 'Client Templates', count: 234, lastUpdated: '1 hour ago' },
          { category: 'Workflow Guides', count: 89, lastUpdated: '1 week ago' },
          { category: 'Training Materials', count: 67, lastUpdated: '3 days ago' },
          { category: 'Compliance Documents', count: 123, lastUpdated: '5 days ago' },
          { category: 'Marketing Assets', count: 56, lastUpdated: '1 day ago' }
        ].map((cat, idx) => (
          <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 cursor-pointer">
            <h3 className="font-bold text-gray-900 mb-2">{cat.category}</h3>
            <p className="text-sm text-gray-600 mb-1">{cat.count} documents</p>
            <p className="text-xs text-gray-500">Updated {cat.lastUpdated}</p>
          </div>
        ))}
      </div>

      {/* Version Control Demo */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="font-bold text-gray-900 mb-4">Recent Version History</h3>
        <div className="space-y-3">
          {[
            { doc: 'Client Engagement Letter', version: '2.4', user: 'Sarah Johnson', time: '2 hours ago', change: 'Updated fee schedule' },
            { doc: 'Tax Checklist Template', version: '1.8', user: 'Mike Chen', time: '1 day ago', change: 'Added Division 7A section' },
            { doc: 'SMSF Annual Workflow', version: '3.1', user: 'Emma Wilson', time: '2 days ago', change: 'Updated compliance steps' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{item.doc}</p>
                <p className="text-xs text-gray-600">v{item.version} • {item.user} • {item.time}</p>
                <p className="text-xs text-gray-500 mt-1">{item.change}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200">
                  View
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200">
                  Restore
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Import for Users icon (Shield and Lock are already imported at the top)
import { Users } from 'lucide-react';