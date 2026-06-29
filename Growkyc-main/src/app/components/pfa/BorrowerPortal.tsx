import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  CheckCircle,
  Circle,
  Upload,
  FileText,
  User,
  Building2,
  Shield,
  AlertCircle,
  Download,
  X,
  Check,
  ChevronRight,
  Lock,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CreditCard,
  Info
} from 'lucide-react';

export function BorrowerPortal() {
  const [currentSection, setCurrentSection] = useState('welcome');
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  // Mock application data
  const application = {
    id: 'APP-2024-001',
    borrowerName: 'ABC Enterprises Pty Ltd',
    loanAmount: 850000,
    loanType: 'Commercial Mortgage',
    broker: {
      name: 'Sarah Johnson',
      company: 'Elite Finance Group',
      phone: '0412 345 678',
      email: 'sarah.johnson@elitefinance.com.au'
    },
    submittedDate: '2024-02-10',
    expiryDate: '2024-02-24'
  };

  const sections = [
    {
      id: 'welcome',
      title: 'Welcome',
      icon: Info,
      description: 'Application overview',
      completed: true
    },
    {
      id: 'company-details',
      title: 'Company Details',
      icon: Building2,
      description: 'Verify & update company information',
      completed: completedSections.includes('company-details')
    },
    {
      id: 'directors',
      title: 'Directors & Guarantors',
      icon: User,
      description: 'Director details & personal information',
      completed: completedSections.includes('directors')
    },
    {
      id: 'kyc-verification',
      title: 'KYC Verification',
      icon: Shield,
      description: 'Identity verification & compliance',
      completed: completedSections.includes('kyc-verification')
    },
    {
      id: 'documents',
      title: 'Documents',
      icon: FileText,
      description: 'Upload required documents',
      completed: completedSections.includes('documents')
    },
    {
      id: 'declarations',
      title: 'Declarations',
      icon: CheckCircle,
      description: 'Review & sign declarations',
      completed: completedSections.includes('declarations')
    }
  ];

  const getProgressPercentage = () => {
    const total = sections.length - 1; // Exclude welcome
    return Math.round((completedSections.length / total) * 100);
  };

  const markSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
    }
  };

  const renderWelcome = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to Your Loan Application Portal</h1>
        <p className="text-blue-100 text-lg">
          Complete your application details securely online
        </p>
      </div>

      {/* Application Summary */}
      <div className="bg-white border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Application Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-300">Application ID</p>
            <p className="font-semibold text-slate-100">{application.id}</p>
          </div>
          <div>
            <p className="text-sm text-slate-300">Loan Type</p>
            <p className="font-semibold text-slate-100">{application.loanType}</p>
          </div>
          <div>
            <p className="text-sm text-slate-300">Loan Amount</p>
            <p className="font-semibold text-slate-100">${application.loanAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-slate-300">Submitted</p>
            <p className="font-semibold text-slate-100">{application.submittedDate}</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300">Action Required</p>
              <p className="text-sm text-amber-300 mt-1">
                Please complete all sections by <strong>{application.expiryDate}</strong> to proceed with your application.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Your Broker */}
      <div className="bg-white border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Your Broker</h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-500/15 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-100">{application.broker.name}</p>
            <p className="text-sm text-slate-300">{application.broker.company}</p>
            <div className="flex items-center gap-4 mt-2">
              <a href={`tel:${application.broker.phone}`} className="text-sm text-blue-400 hover:underline flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {application.broker.phone}
              </a>
              <a href={`mailto:${application.broker.email}`} className="text-sm text-blue-400 hover:underline flex items-center gap-1">
                <Mail className="w-4 h-4" />
                Email
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* What's Next */}
      <div className="bg-white border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">What You Need to Complete</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
            <div>
              <p className="font-medium text-slate-100">Verify Company Details</p>
              <p className="text-sm text-slate-300">Confirm your company information is correct</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
            <div>
              <p className="font-medium text-slate-100">Director Information</p>
              <p className="text-sm text-slate-300">Provide details for all directors and guarantors</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
            <div>
              <p className="font-medium text-slate-100">Identity Verification</p>
              <p className="text-sm text-slate-300">Upload ID documents for KYC compliance</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
            <div>
              <p className="font-medium text-slate-100">Upload Documents</p>
              <p className="text-sm text-slate-300">Financial statements, bank statements, and other required documents</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
            <div>
              <p className="font-medium text-slate-100">Sign Declarations</p>
              <p className="text-sm text-slate-300">Review and accept terms and declarations</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setCurrentSection('company-details')}>
          Get Started
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderCompanyDetails = () => (
    <div className="space-y-6">
      <div className="bg-white border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Company Details</h2>
        <p className="text-slate-300 mb-6">Please verify and update your company information</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Legal Company Name *</label>
            <input
              type="text"
              defaultValue="ABC Enterprises Pty Ltd"
              className="w-full px-4 py-2 border border-white/10 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">ACN *</label>
              <input
                type="text"
                defaultValue="123 456 789"
                className="w-full px-4 py-2 border border-white/10 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">ABN *</label>
              <input
                type="text"
                defaultValue="12 345 678 901"
                className="w-full px-4 py-2 border border-white/10 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Registered Office Address *</label>
            <input
              type="text"
              defaultValue="123 Business St"
              placeholder="Street Address"
              className="w-full px-4 py-2 border border-white/10 rounded-lg mb-2"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                defaultValue="Sydney"
                placeholder="Suburb"
                className="px-4 py-2 border border-white/10 rounded-lg"
              />
              <input
                type="text"
                defaultValue="NSW"
                placeholder="State"
                className="px-4 py-2 border border-white/10 rounded-lg"
              />
              <input
                type="text"
                defaultValue="2000"
                placeholder="Postcode"
                className="px-4 py-2 border border-white/10 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Trading Address (if different)</label>
            <input
              type="text"
              placeholder="Street Address"
              className="w-full px-4 py-2 border border-white/10 rounded-lg mb-2"
            />
            <div className="grid grid-cols-3 gap-2">
              <input type="text" placeholder="Suburb" className="px-4 py-2 border border-white/10 rounded-lg" />
              <input type="text" placeholder="State" className="px-4 py-2 border border-white/10 rounded-lg" />
              <input type="text" placeholder="Postcode" className="px-4 py-2 border border-white/10 rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Company Phone *</label>
              <input
                type="tel"
                placeholder="0400 000 000"
                className="w-full px-4 py-2 border border-white/10 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Company Email *</label>
              <input
                type="email"
                placeholder="info@company.com.au"
                className="w-full px-4 py-2 border border-white/10 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Industry/Business Type *</label>
            <select className="w-full px-4 py-2 border border-white/10 rounded-lg">
              <option>Select industry...</option>
              <option>Professional Services</option>
              <option>Retail</option>
              <option>Wholesale</option>
              <option>Manufacturing</option>
              <option>Technology</option>
              <option>Construction</option>
              <option>Healthcare</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">GST Registered?</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="gst" value="yes" defaultChecked />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="gst" value="no" />
                <span>No</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setCurrentSection('welcome')}>
          Back
        </Button>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            markSectionComplete('company-details');
            setCurrentSection('directors');
          }}
        >
          Save & Continue
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderDirectors = () => (
    <div className="space-y-6">
      <div className="bg-white border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Directors & Guarantors</h2>
        <p className="text-slate-300 mb-6">Provide details for all directors and guarantors</p>

        {/* Director 1 */}
        <div className="mb-8 pb-8 border-b">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Director 1</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">First Name *</label>
                <input
                  type="text"
                  defaultValue="John"
                  className="w-full px-4 py-2 border border-white/10 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Last Name *</label>
                <input
                  type="text"
                  defaultValue="Smith"
                  className="w-full px-4 py-2 border border-white/10 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Date of Birth *</label>
                <input
                  type="date"
                  defaultValue="1975-04-12"
                  className="w-full px-4 py-2 border border-white/10 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Position *</label>
                <select className="w-full px-4 py-2 border border-white/10 rounded-lg">
                  <option>Director</option>
                  <option>Managing Director</option>
                  <option>Executive Director</option>
                  <option>Secretary</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Mobile *</label>
                <input
                  type="tel"
                  placeholder="0400 000 000"
                  className="w-full px-4 py-2 border border-white/10 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                <input
                  type="email"
                  defaultValue="john@abc.com.au"
                  className="w-full px-4 py-2 border border-white/10 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Residential Address *</label>
              <input
                type="text"
                placeholder="Street Address"
                className="w-full px-4 py-2 border border-white/10 rounded-lg mb-2"
              />
              <div className="grid grid-cols-3 gap-2">
                <input type="text" placeholder="Suburb" className="px-4 py-2 border border-white/10 rounded-lg" />
                <input type="text" placeholder="State" className="px-4 py-2 border border-white/10 rounded-lg" />
                <input type="text" placeholder="Postcode" className="px-4 py-2 border border-white/10 rounded-lg" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Ownership % *</label>
              <input
                type="number"
                defaultValue="60"
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-white/10 rounded-lg"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span className="text-sm text-slate-300">Acting as personal guarantor</span>
              </label>
            </div>
          </div>
        </div>

        {/* Director 2 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Director 2</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">First Name *</label>
                <input
                  type="text"
                  defaultValue="Jane"
                  className="w-full px-4 py-2 border border-white/10 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Last Name *</label>
                <input
                  type="text"
                  defaultValue="Doe"
                  className="w-full px-4 py-2 border border-white/10 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Date of Birth *</label>
                <input
                  type="date"
                  defaultValue="1982-08-22"
                  className="w-full px-4 py-2 border border-white/10 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Position *</label>
                <select className="w-full px-4 py-2 border border-white/10 rounded-lg">
                  <option>Director</option>
                  <option>Managing Director</option>
                  <option>Executive Director</option>
                  <option>Secretary</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Mobile *</label>
                <input
                  type="tel"
                  placeholder="0400 000 000"
                  className="w-full px-4 py-2 border border-white/10 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                <input
                  type="email"
                  defaultValue="jane@abc.com.au"
                  className="w-full px-4 py-2 border border-white/10 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Residential Address *</label>
              <input
                type="text"
                placeholder="Street Address"
                className="w-full px-4 py-2 border border-white/10 rounded-lg mb-2"
              />
              <div className="grid grid-cols-3 gap-2">
                <input type="text" placeholder="Suburb" className="px-4 py-2 border border-white/10 rounded-lg" />
                <input type="text" placeholder="State" className="px-4 py-2 border border-white/10 rounded-lg" />
                <input type="text" placeholder="Postcode" className="px-4 py-2 border border-white/10 rounded-lg" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Ownership % *</label>
              <input
                type="number"
                defaultValue="40"
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-white/10 rounded-lg"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span className="text-sm text-slate-300">Acting as personal guarantor</span>
              </label>
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm">
          <User className="w-4 h-4 mr-2" />
          Add Another Director
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setCurrentSection('company-details')}>
          Back
        </Button>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            markSectionComplete('directors');
            setCurrentSection('kyc-verification');
          }}
        >
          Save & Continue
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderKYC = () => (
    <div className="space-y-6">
      <div className="bg-white border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">KYC & Identity Verification</h2>
        <p className="text-slate-300 mb-6">
          Upload identification documents for all directors (100 points of ID required per person)
        </p>

        {/* Director 1 KYC */}
        <div className="mb-8 pb-8 border-b">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">John Smith - Director 1</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Primary ID (70 points) *</label>
              <select className="w-full px-4 py-2 border border-white/10 rounded-lg mb-3">
                <option>Select ID type...</option>
                <option>Australian Passport</option>
                <option>Australian Driver License</option>
                <option>Proof of Age Card</option>
              </select>

              <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-slate-300 mb-2">Upload certified copy of ID</p>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
                <p className="text-xs text-slate-400 mt-2">PDF, JPG or PNG • Max 10MB</p>
              </div>

              <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                <p className="text-sm text-blue-300">
                  <strong>Note:</strong> Documents must be certified by an authorized person (JP, Pharmacist, Lawyer, etc.)
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Secondary ID (30 points minimum) *</label>
              <select className="w-full px-4 py-2 border border-white/10 rounded-lg mb-3">
                <option>Select ID type...</option>
                <option>Medicare Card</option>
                <option>Credit Card Statement</option>
                <option>Utility Bill</option>
                <option>Rates Notice</option>
              </select>

              <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-slate-300 mb-2">Upload secondary ID</p>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
              </div>
            </div>

            {/* Additional Questions */}
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <h4 className="font-medium text-slate-100 mb-3">Additional Verification Questions</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Have you ever been declared bankrupt?
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="bankrupt-1" value="no" defaultChecked />
                      <span>No</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="bankrupt-1" value="yes" />
                      <span>Yes</span>
                    </label>
                  </div>
                  <div className="mt-2">
                    <textarea
                      placeholder="If yes, please provide details and attach supporting documentation..."
                      className="w-full px-3 py-2 border border-white/10 rounded text-sm"
                      rows={3}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Are you a Politically Exposed Person (PEP)?
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="pep-1" value="no" defaultChecked />
                      <span>No</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="pep-1" value="yes" />
                      <span>Yes</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Have you had any adverse credit events in the last 7 years?
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="adverse-1" value="no" defaultChecked />
                      <span>No</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="adverse-1" value="yes" />
                      <span>Yes</span>
                    </label>
                  </div>
                  <div className="mt-2">
                    <textarea
                      placeholder="If yes, please provide details (defaults, judgments, etc.)..."
                      className="w-full px-3 py-2 border border-white/10 rounded text-sm"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Director 2 KYC */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Jane Doe - Director 2</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Primary ID (70 points) *</label>
              <select className="w-full px-4 py-2 border border-white/10 rounded-lg mb-3">
                <option>Select ID type...</option>
                <option>Australian Passport</option>
                <option>Australian Driver License</option>
                <option>Proof of Age Card</option>
              </select>

              <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-slate-300 mb-2">Upload certified copy of ID</p>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Secondary ID (30 points minimum) *</label>
              <select className="w-full px-4 py-2 border border-white/10 rounded-lg mb-3">
                <option>Select ID type...</option>
                <option>Medicare Card</option>
                <option>Credit Card Statement</option>
                <option>Utility Bill</option>
                <option>Rates Notice</option>
              </select>

              <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-slate-300 mb-2">Upload secondary ID</p>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
              </div>
            </div>

            {/* Additional Questions */}
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <h4 className="font-medium text-slate-100 mb-3">Additional Verification Questions</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Have you ever been declared bankrupt?
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="bankrupt-2" value="no" defaultChecked />
                      <span>No</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="bankrupt-2" value="yes" />
                      <span>Yes</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Are you a Politically Exposed Person (PEP)?
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="pep-2" value="no" defaultChecked />
                      <span>No</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="pep-2" value="yes" />
                      <span>Yes</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Have you had any adverse credit events in the last 7 years?
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="adverse-2" value="no" defaultChecked />
                      <span>No</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="adverse-2" value="yes" />
                      <span>Yes</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setCurrentSection('directors')}>
          Back
        </Button>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            markSectionComplete('kyc-verification');
            setCurrentSection('documents');
          }}
        >
          Save & Continue
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="bg-white border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Required Documents</h2>
        <p className="text-slate-300 mb-6">Upload all required documents for your application</p>

        <div className="space-y-4">
          {/* Financial Statements */}
          <div className="p-4 border border-white/10 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-slate-100">Financial Statements (Last 2 years) *</h4>
                <p className="text-sm text-slate-300">Profit & Loss, Balance Sheet</p>
              </div>
              <span className="px-2 py-1 bg-red-500/15 text-red-300 text-xs font-medium rounded">
                Required
              </span>
            </div>
            <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-slate-300 mb-2">Drag files here or click to upload</p>
              <Button variant="outline" size="sm">
                Choose Files
              </Button>
              <p className="text-xs text-slate-400 mt-2">PDF, JPG or PNG • Max 10MB per file</p>
            </div>
          </div>

          {/* Bank Statements */}
          <div className="p-4 border border-white/10 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-slate-100">Bank Statements (Last 6 months) *</h4>
                <p className="text-sm text-slate-300">All business bank accounts</p>
              </div>
              <span className="px-2 py-1 bg-red-500/15 text-red-300 text-xs font-medium rounded">
                Required
              </span>
            </div>
            <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-slate-300 mb-2">Drag files here or click to upload</p>
              <Button variant="outline" size="sm">
                Choose Files
              </Button>
            </div>
          </div>

          {/* Tax Returns */}
          <div className="p-4 border border-white/10 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-slate-100">Tax Returns (Last 2 years) *</h4>
                <p className="text-sm text-slate-300">Company tax returns with ATO lodgement receipt</p>
              </div>
              <span className="px-2 py-1 bg-red-500/15 text-red-300 text-xs font-medium rounded">
                Required
              </span>
            </div>
            <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-slate-300 mb-2">Drag files here or click to upload</p>
              <Button variant="outline" size="sm">
                Choose Files
              </Button>
            </div>
          </div>

          {/* ASIC Company Extract */}
          <div className="p-4 border border-white/10 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-slate-100">ASIC Company Extract *</h4>
                <p className="text-sm text-slate-300">Current company extract (less than 30 days old)</p>
              </div>
              <span className="px-2 py-1 bg-red-500/15 text-red-300 text-xs font-medium rounded">
                Required
              </span>
            </div>
            <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-slate-300 mb-2">Drag files here or click to upload</p>
              <Button variant="outline" size="sm">
                Choose File
              </Button>
            </div>
          </div>

          {/* Property Documents */}
          <div className="p-4 border border-white/10 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-slate-100">Property Documents *</h4>
                <p className="text-sm text-slate-300">Contract of Sale, Section 32, Title Search</p>
              </div>
              <span className="px-2 py-1 bg-red-500/15 text-red-300 text-xs font-medium rounded">
                Required
              </span>
            </div>
            <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-slate-300 mb-2">Drag files here or click to upload</p>
              <Button variant="outline" size="sm">
                Choose Files
              </Button>
            </div>
          </div>

          {/* Property Valuation */}
          <div className="p-4 border border-white/10 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-slate-100">Property Valuation</h4>
                <p className="text-sm text-slate-300">If available (otherwise we will arrange)</p>
              </div>
              <span className="px-2 py-1 bg-white/5 text-slate-300 text-xs font-medium rounded">
                Optional
              </span>
            </div>
            <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-slate-300 mb-2">Drag files here or click to upload</p>
              <Button variant="outline" size="sm">
                Choose File
              </Button>
            </div>
          </div>

          {/* Other Documents */}
          <div className="p-4 border border-white/10 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-slate-100">Other Supporting Documents</h4>
                <p className="text-sm text-slate-300">Any additional documents to support your application</p>
              </div>
              <span className="px-2 py-1 bg-white/5 text-slate-300 text-xs font-medium rounded">
                Optional
              </span>
            </div>
            <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-slate-300 mb-2">Drag files here or click to upload</p>
              <Button variant="outline" size="sm">
                Choose Files
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setCurrentSection('kyc-verification')}>
          Back
        </Button>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            markSectionComplete('documents');
            setCurrentSection('declarations');
          }}
        >
          Save & Continue
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderDeclarations = () => (
    <div className="space-y-6">
      <div className="bg-white border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Declarations & Consent</h2>
        <p className="text-slate-300 mb-6">Please read and accept the following declarations</p>

        <div className="space-y-6">
          {/* Privacy Consent */}
          <div className="p-4 border border-white/10 rounded-lg">
            <h3 className="font-semibold text-slate-100 mb-3">Privacy & Credit Consent</h3>
            <div className="bg-white/5 p-4 rounded max-h-60 overflow-y-auto text-sm text-slate-300 mb-4">
              <p className="mb-3">
                I/We consent to and authorize the collection, use and disclosure of personal information (including credit-related information) about me/us for the purposes of:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Assessing this credit application</li>
                <li>Credit reporting and credit checks from credit reporting bodies</li>
                <li>Verification of identity and information provided</li>
                <li>Fraud prevention and assessment</li>
                <li>Portfolio management and ongoing credit management</li>
                <li>Disclosure to credit providers, mortgage insurers, and other relevant third parties</li>
              </ul>
              <p className="mt-3">
                I/We understand that the lender may obtain a credit report containing personal credit information about me/us from a credit reporting body and that I/we can request access to this information.
              </p>
            </div>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-sm text-slate-300">
                I/We have read and agree to the Privacy & Credit Consent *
              </span>
            </label>
          </div>

          {/* Information Declaration */}
          <div className="p-4 border border-white/10 rounded-lg">
            <h3 className="font-semibold text-slate-100 mb-3">Information Accuracy Declaration</h3>
            <div className="bg-white/5 p-4 rounded text-sm text-slate-300 mb-4">
              <p>
                I/We declare that:
              </p>
              <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>All information provided in this application is true, complete and correct</li>
                <li>All documents provided are genuine and have not been altered</li>
                <li>I/We have disclosed all material information that may affect the assessment</li>
                <li>I/We have not withheld any information that might adversely affect this application</li>
                <li>I/We understand that providing false or misleading information is a serious offense</li>
              </ul>
            </div>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-sm text-slate-300">
                I/We declare that all information provided is true and accurate *
              </span>
            </label>
          </div>

          {/* Financial Position */}
          <div className="p-4 border border-white/10 rounded-lg">
            <h3 className="font-semibold text-slate-100 mb-3">Financial Position Declaration</h3>
            <div className="bg-white/5 p-4 rounded text-sm text-slate-300 mb-4">
              <p>
                I/We declare that:
              </p>
              <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>The financial information provided fairly represents the current financial position</li>
                <li>There are no material adverse changes to the financial position since the documents provided</li>
                <li>All liabilities, contingent liabilities and guarantees have been disclosed</li>
                <li>The company is solvent and able to pay its debts as and when they fall due</li>
                <li>There are no pending or threatened legal proceedings that may materially affect the company</li>
              </ul>
            </div>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-sm text-slate-300">
                I/We declare the financial position is accurately represented *
              </span>
            </label>
          </div>

          {/* Terms and Conditions */}
          <div className="p-4 border border-white/10 rounded-lg">
            <h3 className="font-semibold text-slate-100 mb-3">Terms & Conditions</h3>
            <div className="bg-white/5 p-4 rounded max-h-60 overflow-y-auto text-sm text-slate-300 mb-4">
              <p className="mb-3">
                By submitting this application, I/we acknowledge and agree that:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>This application does not constitute an offer of credit</li>
                <li>The lender reserves the right to decline this application</li>
                <li>Approval is subject to satisfactory credit assessment and due diligence</li>
                <li>All fees and charges as disclosed will apply</li>
                <li>The lender may require additional information or documentation</li>
                <li>Credit approval may be subject to conditions</li>
                <li>Settlement is subject to execution of formal loan documentation</li>
              </ul>
            </div>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-sm text-slate-300">
                I/We accept the Terms & Conditions *
              </span>
            </label>
          </div>

          {/* Electronic Signature */}
          <div className="p-4 border border-white/10 rounded-lg">
            <h3 className="font-semibold text-slate-100 mb-3">Electronic Signature</h3>
            <p className="text-sm text-slate-300 mb-4">
              By entering your name below, you agree that this constitutes a legal electronic signature
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name (Director 1) *</label>
                <input
                  type="text"
                  placeholder="John Smith"
                  className="w-full px-4 py-2 border border-white/10 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Date *</label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-white/10 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name (Director 2) *</label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  className="w-full px-4 py-2 border border-white/10 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Date *</label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-white/10 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setCurrentSection('documents')}>
          Back
        </Button>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => {
            markSectionComplete('declarations');
            // Show success message
          }}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Submit Application
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentSection) {
      case 'welcome':
        return renderWelcome();
      case 'company-details':
        return renderCompanyDetails();
      case 'directors':
        return renderDirectors();
      case 'kyc-verification':
        return renderKYC();
      case 'documents':
        return renderDocuments();
      case 'declarations':
        return renderDeclarations();
      default:
        return renderWelcome();
    }
  };

  return (
    <div className="min-h-screen bg-white/5">
      {/* Top Header */}
      <div className="bg-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-100">PFA Borrower Portal</h1>
                <p className="text-xs text-slate-300">Secure Application Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Lock className="w-4 h-4" />
              <span>Secure Connection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {currentSection !== 'welcome' && (
        <div className="bg-white border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-300">Application Progress</p>
              <p className="text-sm text-slate-300">{getProgressPercentage()}% Complete</p>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white border border-white/10 rounded-lg p-4 sticky top-4">
              <h3 className="font-semibold text-slate-100 mb-4">Sections</h3>
              <div className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = currentSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setCurrentSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-500/15 text-blue-300'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      {section.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">{section.title}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-9">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <p>© 2024 PFA - Personal Finance Advisor. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-blue-400">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400">Terms of Service</a>
              <a href="#" className="hover:text-blue-400">Contact Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
