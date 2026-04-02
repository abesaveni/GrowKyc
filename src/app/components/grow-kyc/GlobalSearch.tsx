import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Search,
  Command,
  FileText,
  Users,
  AlertTriangle,
  Shield,
  Clock,
  Settings,
  HelpCircle,
  Bell,
  Moon,
  Sun,
  Globe,
  Zap,
  TrendingUp,
  Database,
  BookOpen
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { VisuallyHidden } from '../ui/visually-hidden';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, id?: string) => void;
}

interface SearchResult {
  id: string;
  type: 'client' | 'case' | 'document' | 'policy' | 'rule' | 'alert';
  title: string;
  subtitle: string;
  metadata: string;
  risk?: 'high' | 'medium' | 'low';
}

export function GlobalSearch({ isOpen, onClose, onNavigate }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchMode, setSearchMode] = useState<'search' | 'command'>('search');

  // Mock search results with AI-powered natural language understanding
  const mockSearchResults: SearchResult[] = [
    {
      id: 'C001',
      type: 'client',
      title: 'Alpha Holdings Pty Ltd',
      subtitle: 'Corporate • Australia',
      metadata: 'CDD Due: 15 days',
      risk: 'high'
    },
    {
      id: 'C002',
      type: 'client',
      title: 'John Smith',
      subtitle: 'Individual • PEP',
      metadata: 'Last verified: 2 months ago',
      risk: 'high'
    },
    {
      id: 'CASE-001',
      type: 'case',
      title: 'EDD Investigation - Alpha Holdings',
      subtitle: 'Enhanced Due Diligence',
      metadata: 'Assigned to: Sarah Wilson',
      risk: 'high'
    },
    {
      id: 'DOC-001',
      type: 'document',
      title: 'Passport - John Smith',
      subtitle: 'Identity Document',
      metadata: 'Uploaded: 2024-02-15',
    },
    {
      id: 'POL-001',
      type: 'policy',
      title: 'AML/CTF Policy v2.4',
      subtitle: 'Governance',
      metadata: 'Last updated: 2024-01-15',
    },
    {
      id: 'RULE-001',
      type: 'rule',
      title: 'High Risk Corporate EDD',
      subtitle: 'Regulatory Engine',
      metadata: 'Triggered 23 times',
    }
  ];

  const commands = [
    { id: 'create-case', title: 'Create New Case', icon: FileText, action: 'create_case' },
    { id: 'run-verification', title: 'Run Verification', icon: Shield, action: 'verification' },
    { id: 'export-report', title: 'Export Report', icon: Database, action: 'export' },
    { id: 'go-clients', title: 'Go to Client Registry', icon: Users, action: 'navigate_clients' },
    { id: 'go-cases', title: 'Go to Case Management', icon: FileText, action: 'navigate_cases' },
    { id: 'go-monitoring', title: 'Go to Risk Monitoring', icon: AlertTriangle, action: 'navigate_monitoring' },
    { id: 'settings', title: 'Open Settings', icon: Settings, action: 'settings' },
    { id: 'help', title: 'Get Help', icon: HelpCircle, action: 'help' },
  ];

  useEffect(() => {
    if (query.trim()) {
      // Simulate AI-powered search with natural language understanding
      const filtered = mockSearchResults.filter(r => 
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.subtitle.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, (searchMode === 'search' ? results : commands).length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (searchMode === 'search' && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        } else if (searchMode === 'command' && commands[selectedIndex]) {
          handleCommandClick(commands[selectedIndex].action);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, selectedIndex, results, searchMode]);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'client') {
      onNavigate('client_detail', result.id);
    } else if (result.type === 'case') {
      onNavigate('case_detail', result.id);
    }
    onClose();
  };

  const handleCommandClick = (action: string) => {
    onClose();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'client': return Users;
      case 'case': return FileText;
      case 'document': return FileText;
      case 'policy': return BookOpen;
      case 'rule': return Zap;
      case 'alert': return Bell;
      default: return FileText;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0">
        <VisuallyHidden>
          <DialogTitle>Global Search</DialogTitle>
          <DialogDescription>
            Search for clients, cases, documents, policies, rules, and alerts across the platform
          </DialogDescription>
        </VisuallyHidden>
        <div className="border-b">
          <div className="flex items-center gap-3 px-4 py-3">
            <Search className="w-5 h-5 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search clients, cases, documents... or type a command"
              className="border-0 focus-visible:ring-0 text-lg"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={searchMode === 'search' ? 'default' : 'ghost'}
                onClick={() => setSearchMode('search')}
              >
                <Search className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={searchMode === 'command' ? 'default' : 'ghost'}
                onClick={() => setSearchMode('command')}
              >
                <Command className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {searchMode === 'search' ? (
            <>
              {results.length === 0 && query.trim() && (
                <div className="p-8 text-center text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No results found for "{query}"</p>
                  <p className="text-sm mt-2">Try searching for clients, cases, or documents</p>
                </div>
              )}

              {results.length === 0 && !query.trim() && (
                <div className="p-8 text-center text-gray-500">
                  <div className="mb-4">
                    <Zap className="w-12 h-12 mx-auto mb-3 text-blue-400" />
                    <p className="font-semibold text-gray-700">AI-Powered Search</p>
                    <p className="text-sm mt-2">Try natural language queries:</p>
                  </div>
                  <div className="space-y-2 text-left max-w-md mx-auto">
                    <div className="p-2 bg-gray-50 rounded text-sm">
                      "show me high risk clients with PEP flags"
                    </div>
                    <div className="p-2 bg-gray-50 rounded text-sm">
                      "cases expiring this week"
                    </div>
                    <div className="p-2 bg-gray-50 rounded text-sm">
                      "clients in Singapore with overdue CDD"
                    </div>
                  </div>
                </div>
              )}

              {results.map((result, index) => {
                const Icon = getTypeIcon(result.type);
                return (
                  <div
                    key={result.id}
                    className={`flex items-center gap-4 px-4 py-3 cursor-pointer ${
                      index === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleResultClick(result)}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      result.risk === 'high' ? 'bg-red-100' :
                      result.risk === 'medium' ? 'bg-amber-100' :
                      'bg-blue-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        result.risk === 'high' ? 'text-red-600' :
                        result.risk === 'medium' ? 'text-amber-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{result.title}</span>
                        {result.risk && (
                          <Badge className={
                            result.risk === 'high' ? 'bg-red-500' :
                            result.risk === 'medium' ? 'bg-amber-500' :
                            'bg-green-500'
                          }>
                            {result.risk.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">{result.subtitle}</div>
                      <div className="text-xs text-gray-500 mt-1">{result.metadata}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {result.type}
                    </Badge>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-600 border-b">
                COMMANDS
              </div>
              {commands.map((command, index) => {
                const Icon = command.icon;
                return (
                  <div
                    key={command.id}
                    className={`flex items-center gap-4 px-4 py-3 cursor-pointer ${
                      index === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleCommandClick(command.action)}
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{command.title}</span>
                    </div>
                    <kbd className="px-2 py-1 text-xs bg-gray-100 rounded border">↵</kbd>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <div className="border-t px-4 py-2 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border">↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border">↵</kbd>
              to select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border">esc</kbd>
              to close
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-blue-500" />
            <span>AI-Powered</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}