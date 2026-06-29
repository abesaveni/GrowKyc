import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { StatusBadge } from '../StatusBadge';
import { FileUpload } from '../FileUpload';
import { ChatMessage } from '../ChatMessage';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { InvestmentMemorandum } from './InvestmentMemorandum';
import { SettlementCentre } from '../settlement/SettlementCentre';
import { ComprehensiveCaseDetails } from './ComprehensiveCaseDetails';
import { CaseDashboard } from './CaseDashboard';
import { LawyerReview } from './LawyerReview';
import { CaseVerificationReports } from './CaseVerificationReports';
import { toast } from '../../lib/toast';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { 
  Home, 
  FileText, 
  DollarSign, 
  MessageSquare, 
  Activity, 
  Send,
  Download,
  Eye,
  Briefcase,
  XCircle,
  Upload,
  Image as ImageIcon,
  Sparkles,
  FileType,
  Wand2,
  RefreshCw,
  Handshake,
  ArrowLeft,
  Scale,
  FileCheck
} from 'lucide-react';
import { mockCases, mockBids, mockMessages } from '../../data/mockData';
import { format } from 'date-fns';
import { Label } from '../ui/label';

interface CaseWorkspaceProps {
  caseId?: string;
  onBack?: () => void;
}

export function CaseWorkspace({ caseId = 'case-001', onBack }: CaseWorkspaceProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newMessage, setNewMessage] = useState('');
  const [showManageModal, setShowManageModal] = useState(false);
  
  const caseData = mockCases.find(c => c.id === caseId) || mockCases[0];
  const caseBids = mockBids.filter(b => b.caseId === caseId);

  const handleFileUpload = (files: File[]) => {
    toast.success(`${files.length} file${files.length > 1 ? 's' : ''} uploaded`);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }
    toast.success('Message sent');
    setNewMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Dashboard', onClick: onBack },
          { label: 'Cases', onClick: onBack },
          { label: caseData.caseNumber, active: true }
        ]}
      />
      
      {/* Case Header */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold">{caseData.caseNumber}</h1>
              <StatusBadge status={caseData.status} type="case" />
              <StatusBadge status={caseData.riskLevel} type="risk" />
            </div>
            <p className="text-slate-300">
              {caseData.property.address}, {caseData.property.suburb}, {caseData.property.state} {caseData.property.postcode}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Export Report</Button>
            <Button onClick={() => setShowManageModal(true)}>Manage Case</Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-slate-400 mb-1">Borrower</p>
            <p className="font-medium">{caseData.borrowerName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Lender</p>
            <p className="font-medium">{caseData.lenderName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Outstanding Debt</p>
            <p className="font-medium">${caseData.outstandingDebt.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Property Valuation</p>
            <p className="font-medium">${caseData.valuation.amount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Case Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="dashboard">
            <Activity className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="details">
            <FileText className="w-4 h-4 mr-2" />
            Full Details
          </TabsTrigger>
          <TabsTrigger value="lawyer">
            <Scale className="w-4 h-4 mr-2" />
            Lawyer Review
          </TabsTrigger>
          <TabsTrigger value="property">
            <Home className="w-4 h-4 mr-2" />
            Property
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="w-4 h-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="verification">
            <FileCheck className="w-4 h-4 mr-2" />
            Verification Reports
          </TabsTrigger>
          <TabsTrigger value="im">
            <Briefcase className="w-4 h-4 mr-2" />
            Investment Memorandum
          </TabsTrigger>
          <TabsTrigger value="settlement">
            <Handshake className="w-4 h-4 mr-2" />
            Settlement
          </TabsTrigger>
          <TabsTrigger value="bids">
            <DollarSign className="w-4 h-4 mr-2" />
            Bids
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <CaseDashboard caseData={caseData} />
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityTimeline />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Full Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <ComprehensiveCaseDetails caseData={caseData} />
        </TabsContent>

        {/* Lawyer Review Tab */}
        <TabsContent value="lawyer">
          <LawyerReview caseData={caseData} />
        </TabsContent>

        {/* Property Tab */}
        <TabsContent value="property">
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-100 mb-3">Address</h3>
                  <div>
                    <p className="font-medium">{caseData.property.address}</p>
                    <p className="text-slate-300">
                      {caseData.property.suburb}, {caseData.property.state} {caseData.property.postcode}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-100 mb-3">Property Features</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-slate-400">Type</p>
                      <p className="font-medium">{caseData.property.propertyType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Bedrooms</p>
                      <p className="font-medium">{caseData.property.bedrooms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Bathrooms</p>
                      <p className="font-medium">{caseData.property.bathrooms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Parking</p>
                      <p className="font-medium">{caseData.property.parking}</p>
                    </div>
                    {caseData.property.landSize > 0 && (
                      <div>
                        <p className="text-sm text-slate-400">Land Size</p>
                        <p className="font-medium">{caseData.property.landSize} m²</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-span-2">
                  <h3 className="font-semibold text-slate-100 mb-3">Valuation</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Valuation Amount</p>
                      <p className="font-medium text-lg">${caseData.valuation.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Valuation Date</p>
                      <p className="font-medium">{format(caseData.valuation.date, 'dd MMM yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Valuer</p>
                      <p className="font-medium">{caseData.valuation.valuerName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Case Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileUpload
                onFileSelect={handleFileUpload}
                multiple
                label="Upload case documents"
              />

              <div>
                <h3 className="font-semibold mb-3">Uploaded Documents</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Property Inspection Report.pdf</TableCell>
                      <TableCell>Inspection</TableCell>
                      <TableCell>Sarah Mitchell</TableCell>
                      <TableCell>{format(new Date(), 'dd MMM yyyy')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Valuation Report.pdf</TableCell>
                      <TableCell>Valuation</TableCell>
                      <TableCell>Preston Rowe Paterson</TableCell>
                      <TableCell>{format(caseData.valuation.date, 'dd MMM yyyy')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verification Reports Tab */}
        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Verification Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <CaseVerificationReports caseData={caseData} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Investment Memorandum Tab */}
        <TabsContent value="im">
          <Card>
            <CardHeader>
              <CardTitle>Investment Memorandum</CardTitle>
            </CardHeader>
            <CardContent>
              <InvestmentMemorandum />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settlement Tab */}
        <TabsContent value="settlement">
          <SettlementCentre caseData={caseData} userRole="admin" />
        </TabsContent>

        {/* Bids Tab */}
        <TabsContent value="bids">
          <Card>
            <CardHeader>
              <CardTitle>Bid History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bidder</TableHead>
                    <TableHead>Bid Amount</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {caseBids.map((bid) => (
                    <TableRow key={bid.id}>
                      <TableCell className="font-medium">{bid.bidderName}</TableCell>
                      <TableCell className="text-lg font-semibold">
                        ${bid.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{format(bid.timestamp, "dd MMM yyyy, HH:mm 'AEST'")}</TableCell>
                      <TableCell>
                        <StatusBadge status={bid.status} type="case" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Case Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {mockMessages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                    rows={3}
                  />
                  <Button onClick={handleSendMessage} className="self-end">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Manage Case Modal */}
      {showManageModal && (
        <ManageCaseModal
          caseData={caseData}
          onClose={() => setShowManageModal(false)}
          onSave={(updatedData) => {
            toast.success('Case updated successfully', {
              description: 'All changes have been saved'
            });
            setShowManageModal(false);
          }}
        />
      )}
    </div>
  );
}

function ActivityTimeline({ showAll = false }: { showAll?: boolean }) {
  const activities = [
    {
      action: 'New bid placed',
      description: 'Platinum Capital Partners bid $1,100,000',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      type: 'bid'
    },
    {
      action: 'Document uploaded',
      description: 'Property inspection report added',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'document'
    },
    {
      action: 'Message received',
      description: 'Sarah Mitchell sent a message',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      type: 'message'
    },
    {
      action: 'Case status updated',
      description: 'Status changed to "In Auction"',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      type: 'status'
    },
    {
      action: 'Valuation completed',
      description: 'Property valued at $1,250,000',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      type: 'valuation'
    }
  ];

  const displayActivities = showAll ? activities : activities.slice(0, 3);

  return (
    <div className="space-y-4">
      {displayActivities.map((activity, index) => (
        <div key={index} className="flex gap-3">
          <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2" />
          <div className="flex-1">
            <p className="font-medium text-slate-100">{activity.action}</p>
            <p className="text-sm text-slate-300">{activity.description}</p>
            <p className="text-xs text-slate-400 mt-1">
              {format(activity.timestamp, "dd MMM yyyy, HH:mm 'AEST'")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Manage Case Modal - Full Edit with AI Features
function ManageCaseModal({ caseData, onClose, onSave }: { caseData: any; onClose: () => void; onSave: (data: any) => void }) {
  const [formData, setFormData] = useState(caseData);
  const [activeTab, setActiveTab] = useState('details');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

  const tabs = [
    { id: 'details', label: 'Case Details', icon: FileText },
    { id: 'images', label: 'Property Images', icon: ImageIcon },
    { id: 'content', label: 'AI Content', icon: Sparkles },
    { id: 'documents', label: 'Documents', icon: Download }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedImages([...uploadedImages, ...fileUrls]);
    }
  };

  const handleAIGenerateContent = async (type: string) => {
    setIsGeneratingContent(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (type === 'marketing') {
      setFormData({
        ...formData,
        marketingDescription: `This exceptional ${formData.property.propertyType.toLowerCase()} in ${formData.property.suburb} presents a unique investment opportunity. Located in one of ${formData.property.state}'s most sought-after suburbs, this property offers ${formData.property.bedrooms} bedrooms and ${formData.property.bathrooms} bathrooms. With strong capital growth prospects and an established market position, this represents a secure investment backed by first mortgage security.`
      });
    } else if (type === 'highlights') {
      setFormData({
        ...formData,
        investmentHighlights: `• First mortgage security with conservative LVR\n• Prime location in ${formData.property.suburb}\n• ${formData.property.bedrooms} bed, ${formData.property.bathrooms} bath ${formData.property.propertyType.toLowerCase()}\n• Enhanced returns at default rate\n• Significant equity buffer\n• Clear title with independent valuation`
      });
    } else if (type === 'location') {
      setFormData({
        ...formData,
        locationNotes: `${formData.property.suburb} is a highly desirable ${formData.property.state} suburb known for its strong community atmosphere and excellent amenities. The area has experienced consistent capital growth, with excellent transport links, quality schools, and shopping precincts.`
      });
    }
    setIsGeneratingContent(false);
  };

  const handleAIRetrieveImages = async () => {
    setIsGeneratingImages(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const suggestedImages = [
      'https://images.unsplash.com/photo-1715247018235-82cb9d34ddbd?w=800',
      'https://images.unsplash.com/photo-1580387128798-a5abad264ac4?w=800',
      'https://images.unsplash.com/photo-1766050589756-29eac959ff51?w=800',
      'https://images.unsplash.com/photo-1710253655362-a0eaad4f4e55?w=800'
    ];
    setUploadedImages([...uploadedImages, ...suggestedImages]);
    setIsGeneratingImages(false);
  };

  const handleGenerateDocument = (docType: string) => {
    if (docType === 'Investment Memorandum') {
      // Close the modal and navigate to IM tab
      onClose();
      toast.success('Opening Investment Memorandum', {
        description: 'View and download the full professional IM'
      });
      // Trigger navigation to IM tab after modal closes
      setTimeout(() => {
        // Find and click the IM tab
        const imTab = document.querySelector('[value="im"]') as HTMLElement;
        if (imTab) {
          imTab.click();
        }
      }, 100);
    } else if (docType === 'Marketing Flyer') {
      // Generate and download marketing flyer
      toast.success('Generating Marketing Flyer', {
        description: 'Creating single-page summary PDF...'
      });
      
      // Simulate document generation
      setTimeout(() => {
        toast.success('Marketing Flyer Ready', {
          description: 'Your document has been generated and is ready to download'
        });
        
        // Create a mock download (in production, this would be a real PDF)
        const link = document.createElement('a');
        link.href = '#'; // In production: actual PDF blob URL
        link.download = `marketing-flyer-${formData.caseNumber}.pdf`;
        // link.click(); // Uncomment when real PDF generation is implemented
      }, 1500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, images: uploadedImages });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-7xl max-h-[95vh] overflow-y-auto my-4">
        <CardHeader className="border-b sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Manage Case: {formData.caseNumber}</CardTitle>
              <p className="text-sm text-slate-300 mt-1">Update details, upload images, and generate AI content</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <XCircle className="w-5 h-5" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  type="button"
                  variant={activeTab === tab.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Case Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-4">Basic Information</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Case Number</Label>
                      <Input value={formData.caseNumber} disabled />
                    </div>
                    <div>
                      <Label>Borrower Name</Label>
                      <Input value={formData.borrowerName} onChange={(e) => setFormData({...formData, borrowerName: e.target.value})} />
                    </div>
                    <div>
                      <Label>Lender Name</Label>
                      <Input value={formData.lenderName} onChange={(e) => setFormData({...formData, lenderName: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-4">Loan Details</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label>Outstanding Debt</Label>
                      <Input type="number" value={formData.outstandingDebt} onChange={(e) => setFormData({...formData, outstandingDebt: +e.target.value})} />
                    </div>
                    <div>
                      <Label>Interest Rate (%)</Label>
                      <Input type="number" step="0.01" value={formData.interestRate || 5.75} onChange={(e) => setFormData({...formData, interestRate: +e.target.value})} />
                    </div>
                    <div>
                      <Label>Default Rate (%)</Label>
                      <Input type="number" step="0.01" value={formData.defaultRate || 8.25} onChange={(e) => setFormData({...formData, defaultRate: +e.target.value})} />
                    </div>
                    <div>
                      <Label>Days in Default</Label>
                      <Input type="number" value={formData.daysInDefault || 0} onChange={(e) => setFormData({...formData, daysInDefault: +e.target.value})} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-4">Property Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Address</Label>
                      <Input value={formData.property.address} onChange={(e) => setFormData({...formData, property: {...formData.property, address: e.target.value}})} />
                    </div>
                    <div>
                      <Label>Suburb</Label>
                      <Input value={formData.property.suburb} onChange={(e) => setFormData({...formData, property: {...formData.property, suburb: e.target.value}})} />
                    </div>
                    <div>
                      <Label>Postcode</Label>
                      <Input value={formData.property.postcode} onChange={(e) => setFormData({...formData, property: {...formData.property, postcode: e.target.value}})} />
                    </div>
                    <div>
                      <Label>Bedrooms</Label>
                      <Input type="number" value={formData.property.bedrooms} onChange={(e) => setFormData({...formData, property: {...formData.property, bedrooms: +e.target.value}})} />
                    </div>
                    <div>
                      <Label>Bathrooms</Label>
                      <Input type="number" value={formData.property.bathrooms} onChange={(e) => setFormData({...formData, property: {...formData.property, bathrooms: +e.target.value}})} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-4">Valuation</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Valuation Amount</Label>
                      <Input type="number" value={formData.valuation.amount} onChange={(e) => setFormData({...formData, valuation: {...formData.valuation, amount: +e.target.value}})} />
                    </div>
                    <div>
                      <Label>Valuation Date</Label>
                      <Input type="date" value={format(formData.valuation.date, 'yyyy-MM-dd')} onChange={(e) => setFormData({...formData, valuation: {...formData.valuation, date: new Date(e.target.value)}})} />
                    </div>
                    <div>
                      <Label>Valuer Name</Label>
                      <Input value={formData.valuation.valuerName} onChange={(e) => setFormData({...formData, valuation: {...formData.valuation, valuerName: e.target.value}})} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Images Tab */}
            {activeTab === 'images' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">Property Images</h3>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleAIRetrieveImages}
                      disabled={isGeneratingImages}
                    >
                      {isGeneratingImages ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Wand2 className="w-4 h-4 mr-2" />
                      )}
                      AI Suggest Images
                    </Button>
                    <label>
                      <Button type="button" variant="outline" as="span">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Images
                      </Button>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>

                {uploadedImages.length > 0 ? (
                  <div className="grid grid-cols-4 gap-4">
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt={`Property ${idx + 1}`} className="w-full h-48 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-white/10 rounded-lg p-12 text-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-slate-300 mb-2">No images uploaded yet</p>
                    <p className="text-sm text-slate-400">Upload property images or use AI to suggest relevant images</p>
                  </div>
                )}
              </div>
            )}

            {/* AI Content Tab */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-slate-100 mb-1">AI Content Generator</h3>
                      <p className="text-sm text-slate-300">Generate professional marketing content and investment highlights</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Marketing Description</Label>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAIGenerateContent('marketing')}
                      disabled={isGeneratingContent}
                    >
                      {isGeneratingContent ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Wand2 className="w-4 h-4 mr-2" />
                      )}
                      AI Generate
                    </Button>
                  </div>
                  <Textarea
                    rows={6}
                    value={formData.marketingDescription || ''}
                    onChange={(e) => setFormData({...formData, marketingDescription: e.target.value})}
                    placeholder="Professional marketing description..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Investment Highlights</Label>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAIGenerateContent('highlights')}
                      disabled={isGeneratingContent}
                    >
                      {isGeneratingContent ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Wand2 className="w-4 h-4 mr-2" />
                      )}
                      AI Generate
                    </Button>
                  </div>
                  <Textarea
                    rows={8}
                    value={formData.investmentHighlights || ''}
                    onChange={(e) => setFormData({...formData, investmentHighlights: e.target.value})}
                    placeholder="Key selling points..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Location & Market Notes</Label>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAIGenerateContent('location')}
                      disabled={isGeneratingContent}
                    >
                      {isGeneratingContent ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Wand2 className="w-4 h-4 mr-2" />
                      )}
                      AI Generate
                    </Button>
                  </div>
                  <Textarea
                    rows={5}
                    value={formData.locationNotes || ''}
                    onChange={(e) => setFormData({...formData, locationNotes: e.target.value})}
                    placeholder="Suburb information..."
                  />
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FileType className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-slate-100 mb-1">Document Generator</h3>
                      <p className="text-sm text-slate-300">Generate professional documents using case data</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-purple-500/15 rounded-lg">
                          <FileText className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-bold">Investment Memorandum</h4>
                          <p className="text-sm text-slate-300">Full professional IM</p>
                        </div>
                      </div>
                      <Button 
                        type="button" 
                        className="w-full" 
                        onClick={() => handleGenerateDocument('Investment Memorandum')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Generate IM
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-blue-500/15 rounded-lg">
                          <FileText className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-bold">Marketing Flyer</h4>
                          <p className="text-sm text-slate-300">Single-page summary</p>
                        </div>
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleGenerateDocument('Marketing Flyer')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Generate Flyer
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t sticky bottom-0 bg-white">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}