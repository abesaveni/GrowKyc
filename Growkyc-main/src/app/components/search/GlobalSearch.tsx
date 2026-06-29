import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from '../../lib/toast';
import { EmptyState } from '../ui/empty-state';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { 
  Search,
  FileText,
  User,
  Briefcase,
  MessageSquare,
  Filter,
  X,
  ExternalLink,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SearchResult {
  id: string;
  type: 'case' | 'user' | 'document' | 'message' | 'contract';
  title: string;
  description: string;
  metadata?: {
    caseNumber?: string;
    userName?: string;
    date?: Date;
    status?: string;
  };
  url: string;
}

const mockResults: SearchResult[] = [
  {
    id: 'result-001',
    type: 'case',
    title: 'MIP-2024-001: Bondi Beach Apartment',
    description: '3 bed, 2 bath apartment in Bondi Beach, NSW. Outstanding debt: A$950,000. Property valuation: A$1,250,000',
    metadata: {
      caseNumber: 'MIP-2024-001',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'In Auction'
    },
    url: '/cases/MIP-2024-001'
  },
  {
    id: 'result-002',
    type: 'user',
    title: 'Michael Chen',
    description: 'Investor • Platinum Capital Partners • Verified account • 12 successful bids',
    metadata: {
      userName: 'Michael Chen',
      status: 'Active'
    },
    url: '/users/michael-chen'
  },
  {
    id: 'result-003',
    type: 'document',
    title: 'Investment_Memorandum_MIP-2024-001.pdf',
    description: 'Investment Memorandum for Bondi Beach property case. Uploaded 3 days ago by Sarah Mitchell',
    metadata: {
      caseNumber: 'MIP-2024-001',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    url: '/documents/investment-memorandum-001'
  },
  {
    id: 'result-004',
    type: 'message',
    title: 'Property inspection scheduled',
    description: 'Message from Sarah Mitchell regarding property inspection for MIP-2024-001. "The inspection has been scheduled for this Friday at 10am..."',
    metadata: {
      caseNumber: 'MIP-2024-001',
      date: new Date(Date.now() - 12 * 60 * 60 * 1000)
    },
    url: '/messages/msg-004'
  },
  {
    id: 'result-005',
    type: 'contract',
    title: 'Investment Agreement - MIP-2024-003',
    description: 'Signed investment agreement for Melbourne CBD property. Executed on 10 Jan 2024',
    metadata: {
      caseNumber: 'MIP-2024-003',
      date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      status: 'Executed'
    },
    url: '/contracts/investment-agreement-003'
  }
];

export function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    // Filter mock results based on query and type
    const filtered = mockResults.filter(result => {
      const queryMatch = 
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.metadata?.caseNumber?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const typeMatch = selectedType === 'all' || result.type === selectedType;
      
      return queryMatch && typeMatch;
    });

    setResults(filtered);
    setIsSearching(false);

    toast.success(`Found ${filtered.length} result${filtered.length !== 1 ? 's' : ''}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setSelectedType('all');
    setHasSearched(false);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'case':
        return <Briefcase className="w-5 h-5 text-blue-600" />;
      case 'user':
        return <User className="w-5 h-5 text-green-600" />;
      case 'document':
        return <FileText className="w-5 h-5 text-purple-600" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-amber-600" />;
      case 'contract':
        return <FileText className="w-5 h-5 text-indigo-600" />;
      default:
        return <Search className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      case: 'bg-blue-100 text-blue-800',
      user: 'bg-green-100 text-green-800',
      document: 'bg-purple-100 text-purple-800',
      message: 'bg-amber-100 text-amber-800',
      contract: 'bg-indigo-100 text-indigo-800'
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${colors[type as keyof typeof colors]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '#' },
    { label: 'Search' }
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Search Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Search Everything</h1>
        <p className="text-gray-600">Find cases, users, documents, messages, and contracts</p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search for cases, users, documents..."
                  className="pl-12 py-6 text-lg"
                />
              </div>
              <Button 
                size="lg" 
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Filter by type:</span>
              <div className="flex gap-2">
                {['all', 'case', 'user', 'document', 'message', 'contract'].map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
              {(searchQuery || selectedType !== 'all' || hasSearched) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="ml-auto"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {hasSearched && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isSearching ? 'Searching...' : `${results.length} Result${results.length !== 1 ? 's' : ''}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isSearching ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-gray-600 mt-4">Searching...</p>
              </div>
            ) : results.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No results found"
                description="Try adjusting your search query or filters"
                actionLabel="Clear Search"
                onAction={handleClearSearch}
              />
            ) : (
              <div className="space-y-3">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => toast.info(`Opening: ${result.title}`)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                        {getResultIcon(result.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{result.title}</h4>
                          {getTypeBadge(result.type)}
                          {result.metadata?.status && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              {result.metadata.status}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {result.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {result.metadata?.caseNumber && (
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {result.metadata.caseNumber}
                            </span>
                          )}
                          {result.metadata?.date && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(result.metadata.date, { addSuffix: true })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action */}
                      <div className="flex-shrink-0">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search Tips */}
      {!hasSearched && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Search className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">Search Tips</p>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Use case numbers (e.g., "MIP-2024-001") for quick access</p>
                  <p>• Search by property location (e.g., "Bondi", "Melbourne")</p>
                  <p>• Find users by name or organization</p>
                  <p>• Search document titles or content</p>
                  <p>• Filter by type to narrow results</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Popular Searches */}
      {!hasSearched && (
        <Card>
          <CardHeader>
            <CardTitle>Popular Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                'MIP-2024-001',
                'Bondi Beach',
                'Michael Chen',
                'Investment Memorandum',
                'Contracts pending',
                'Melbourne CBD',
                'Property valuation',
                'Active auctions'
              ].map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery(term);
                    setTimeout(() => handleSearch(), 100);
                  }}
                >
                  {term}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
