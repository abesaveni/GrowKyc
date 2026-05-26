import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from '../../lib/toast';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { 
  HelpCircle,
  Search,
  BookOpen,
  FileText,
  Video,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Mail,
  Phone
} from 'lucide-react';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 'faq-001',
    category: 'Getting Started',
    question: 'How do I register as an investor?',
    answer: 'To register as an investor, click "Sign Up" on the homepage, select "Investor" as your role, and complete the registration form. You\'ll need to provide your contact information and complete KYC verification before you can start bidding on deals.'
  },
  {
    id: 'faq-002',
    category: 'Getting Started',
    question: 'What is KYC and why is it required?',
    answer: 'KYC (Know Your Customer) is a verification process required by Australian regulations. You\'ll need to provide identity documents (passport or driver\'s license) and proof of address. This ensures platform security and compliance with financial regulations.'
  },
  {
    id: 'faq-003',
    category: 'Bidding',
    question: 'How does the auction process work?',
    answer: 'Auctions run for a specified time period. You can place bids that meet or exceed the minimum bid amount. The highest bidder when the auction closes wins the deal. You\'ll be notified immediately and can proceed with payment and contract signing.'
  },
  {
    id: 'faq-004',
    category: 'Bidding',
    question: 'Can I retract a bid once placed?',
    answer: 'No, bids are binding once submitted. Please ensure you\'ve reviewed all case details, including the Investment Memorandum, valuation report, and property information before placing a bid.'
  },
  {
    id: 'faq-005',
    category: 'Payments',
    question: 'What payment methods are accepted?',
    answer: 'We accept bank transfers (EFT) for all transactions. Payment instructions will be provided after winning a bid or accepting a Buy Now offer. All funds are held in escrow until settlement is completed.'
  },
  {
    id: 'faq-006',
    category: 'Payments',
    question: 'How does escrow work?',
    answer: 'Your payment is held securely in an escrow account managed by our licensed escrow agent. Funds are only released when all conditions are met, including contract signing and property transfer. This protects both buyers and sellers.'
  },
  {
    id: 'faq-007',
    category: 'Cases',
    question: 'What information is included in a case?',
    answer: 'Each case includes property details, valuation report, outstanding debt amount, borrower information, property inspection reports, Investment Memorandum, and legal documentation. All information is verified before listing.'
  },
  {
    id: 'faq-008',
    category: 'Cases',
    question: 'What is an Investment Memorandum?',
    answer: 'The Investment Memorandum (IM) is a comprehensive document detailing the investment opportunity, including property analysis, financial projections, risk assessment, and legal considerations. It\'s required reading before investing.'
  },
  {
    id: 'faq-009',
    category: 'Legal',
    question: 'What legal documents will I need to sign?',
    answer: 'You\'ll sign an Investment Agreement, Mortgage Assignment documents, and any property-specific legal documents. All contracts use digital signatures and are legally binding under Australian law. We recommend having your solicitor review all documents.'
  },
  {
    id: 'faq-010',
    category: 'Legal',
    question: 'What are my rights as a mortgage investor?',
    answer: 'As a mortgage investor, you acquire rights to the defaulted mortgage, including security over the property and rights to enforce the mortgage. You\'ll have first claim on property proceeds and can pursue foreclosure if necessary.'
  }
];

const categories = [
  { id: 'all', label: 'All Topics', icon: BookOpen },
  { id: 'Getting Started', label: 'Getting Started', icon: HelpCircle },
  { id: 'Bidding', label: 'Bidding & Auctions', icon: FileText },
  { id: 'Payments', label: 'Payments & Escrow', icon: FileText },
  { id: 'Cases', label: 'Cases & Properties', icon: FileText },
  { id: 'Legal', label: 'Legal & Compliance', icon: FileText }
];

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQs, setExpandedFAQs] = useState<Set<string>>(new Set());

  // Filter FAQs
  const filteredFAQs = faqData.filter(faq => {
    const searchMatch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const categoryMatch = selectedCategory === 'all' || faq.category === selectedCategory;
    
    return searchMatch && categoryMatch;
  });

  const toggleFAQ = (faqId: string) => {
    const newExpanded = new Set(expandedFAQs);
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId);
    } else {
      newExpanded.add(faqId);
    }
    setExpandedFAQs(newExpanded);
  };

  const handleContactSupport = () => {
    toast.info('Opening support ticket...', {
      description: 'Redirecting to support form'
    });
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '#' },
    { label: 'Help Center' }
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">How can we help you?</h1>
        <p className="text-gray-600">Search our knowledge base or browse categories below</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="pl-12 py-6 text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg">Documentation</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Comprehensive guides and tutorials to help you get started
            </p>
            <Button variant="outline" size="sm" className="w-full">
              View Docs
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg">Video Tutorials</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Watch step-by-step video guides on platform features
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Watch Videos
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleContactSupport}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg">Contact Support</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Get help from our support team via ticket or live chat
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Contact Us
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              <Icon className="w-4 h-4 mr-2" />
              {category.label}
            </Button>
          );
        })}
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions ({filteredFAQs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No results found</p>
              <p className="text-sm text-gray-500">Try adjusting your search or browse by category</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className="border rounded-lg">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full flex items-start justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <span className="text-xs text-gray-500 font-semibold">{faq.category}</span>
                      <h4 className="font-semibold text-gray-900 mt-1">{faq.question}</h4>
                    </div>
                    {expandedFAQs.has(faq.id) ? (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                    )}
                  </button>
                  {expandedFAQs.has(faq.id) && (
                    <div className="p-4 pt-0 text-gray-600 text-sm border-t">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Still need help?</p>
              <p className="text-sm text-blue-800 mb-3">
                Our support team is available Monday-Friday, 9am-5pm AEST
              </p>
              <div className="flex gap-4 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>support@Grow MIP.com.au</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>1300 Grow MIP</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

