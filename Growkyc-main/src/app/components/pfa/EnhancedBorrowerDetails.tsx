import React from 'react';
import { Button } from '../ui/button';
import {
  User,
  Users,
  Phone,
  Mail,
  Building2,
  Shield,
  CheckCircle,
  Clock,
  FileText,
  Edit
} from 'lucide-react';

interface EnhancedBorrowerDetailsProps {
  deal: any;
}

export function EnhancedBorrowerDetails({ deal }: EnhancedBorrowerDetailsProps) {
  // Enhanced director data with more details
  const directors = [
    {
      name: 'John Smith',
      role: 'Managing Director',
      dob: '12 April 1975',
      age: 48,
      email: 'john@abc.com.au',
      phone: '0412 111 222',
      mobile: '0412 111 222',
      residentialAddress: '45 Residential Ave, Mosman NSW 2088',
      ownership: 60,
      isGuarantor: true,
      guarantorType: 'Personal & Property',
      guaranteeAmount: 'Unlimited',
      kycStatus: 'Complete',
      creditCheck: 'Complete - Good',
      idVerification: 'Verified',
      bankruptcyCheck: 'Clear',
      directorsSearch: 'No adverse findings',
      yearsAsDirector: 8
    },
    {
      name: 'Jane Doe',
      role: 'Director & Company Secretary',
      dob: '22 August 1982',
      age: 41,
      email: 'jane@abc.com.au',
      phone: '0412 333 444',
      mobile: '0412 333 444',
      residentialAddress: '78 Beach Rd, Bondi NSW 2026',
      ownership: 40,
      isGuarantor: true,
      guarantorType: 'Personal Only',
      guaranteeAmount: 'Limited to $500,000',
      kycStatus: 'Pending Documents',
      creditCheck: 'Complete - Satisfactory',
      idVerification: 'In Progress',
      bankruptcyCheck: 'Clear',
      directorsSearch: 'Clear',
      yearsAsDirector: 5
    }
  ];

  return (
    <div className="space-y-6">
      {/* Company Details */}
      <div className="bg-white border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Company Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-slate-300 mb-1">Entity Type</p>
            <p className="font-semibold text-slate-100">{deal.borrower.type}</p>
          </div>
          <div>
            <p className="text-xs text-slate-300 mb-1">Company Name</p>
            <p className="font-semibold text-slate-100">{deal.borrower.name}</p>
          </div>
          <div>
            <p className="text-xs text-slate-300 mb-1">Industry</p>
            <p className="font-semibold text-slate-100">Professional Services</p>
          </div>
          <div>
            <p className="text-xs text-slate-300 mb-1">ACN</p>
            <p className="font-semibold text-slate-100">{deal.borrower.acn}</p>
          </div>
          <div>
            <p className="text-xs text-slate-300 mb-1">ABN</p>
            <p className="font-semibold text-slate-100">{deal.borrower.abn}</p>
          </div>
          <div>
            <p className="text-xs text-slate-300 mb-1">GST Registered</p>
            <p className="font-semibold text-slate-100">Yes</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-slate-300 mb-1">Registered Office Address</p>
            <p className="font-semibold text-slate-100">{deal.borrower.address}</p>
          </div>
          <div>
            <p className="text-xs text-slate-300 mb-1">Trading Since</p>
            <p className="font-semibold text-slate-100">2016 (8 years)</p>
          </div>
        </div>
      </div>

      {/* Directors & Guarantors - Detailed Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-100">Directors & Guarantors</h3>
          <span className="text-sm text-slate-300">{directors.length} Directors</span>
        </div>

        {directors.map((director, idx) => (
          <div key={idx} className="bg-white border border-white/10 rounded-lg">
            {/* Header */}
            <div className="p-4 bg-white/5 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/15 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100 text-lg">{director.name}</h4>
                    <p className="text-sm text-slate-300">{director.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {director.isGuarantor && (
                    <span className="px-3 py-1 bg-green-500/15 text-green-300 rounded text-xs font-medium">
                      <Shield className="w-3 h-3 inline mr-1" />
                      Guarantor
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded text-xs font-medium ${
                    director.kycStatus === 'Complete' 
                      ? 'bg-green-500/15 text-green-300' 
                      : 'bg-orange-500/15 text-orange-300'
                  }`}>
                    {director.kycStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="p-6">
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-xs text-slate-300 mb-2 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Personal Information
                  </p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-slate-400">Date of Birth</p>
                      <p className="font-semibold text-slate-100">{director.dob}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Age</p>
                      <p className="font-semibold text-slate-100">{director.age} years</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Years as Director</p>
                      <p className="font-semibold text-slate-100">{director.yearsAsDirector} years</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-300 mb-2 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Contact Details
                  </p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-slate-400">Mobile</p>
                      <a href={`tel:${director.mobile}`} className="font-semibold text-blue-400 hover:underline">
                        {director.mobile}
                      </a>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Email</p>
                      <a href={`mailto:${director.email}`} className="font-semibold text-blue-400 hover:underline text-sm">
                        {director.email}
                      </a>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Residential Address</p>
                      <p className="font-semibold text-slate-100 text-sm">{director.residentialAddress}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-300 mb-2 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    Ownership & Role
                  </p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-slate-400">Ownership %</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${director.ownership}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-slate-100">{director.ownership}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Position</p>
                      <p className="font-semibold text-slate-100">{director.role}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guarantor Information */}
              {director.isGuarantor && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg mb-6">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-400 mt-0.5" />
                    <div className="flex-1">
                      <h5 className="font-semibold text-green-300 mb-2">Personal Guarantee Details</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-green-300 mb-1">Guarantee Type</p>
                          <p className="font-semibold text-green-300">{director.guarantorType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-green-300 mb-1">Guarantee Amount</p>
                          <p className="font-semibold text-green-300">{director.guaranteeAmount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* KYC & Verification Status */}
              <div className="border-t border-white/10 pt-4">
                <h5 className="font-semibold text-slate-100 mb-3 text-sm">Verification Status</h5>
                <div className="grid grid-cols-4 gap-3">
                  <div className="p-3 bg-white/5 rounded">
                    <p className="text-xs text-slate-300 mb-1">ID Verification</p>
                    <div className="flex items-center gap-1">
                      {director.idVerification === 'Verified' ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-orange-400" />
                      )}
                      <p className={`text-xs font-semibold ${
                        director.idVerification === 'Verified' ? 'text-green-400' : 'text-orange-400'
                      }`}>
                        {director.idVerification}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded">
                    <p className="text-xs text-slate-300 mb-1">Credit Check</p>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <p className="text-xs font-semibold text-green-400">{director.creditCheck}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded">
                    <p className="text-xs text-slate-300 mb-1">Bankruptcy</p>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <p className="text-xs font-semibold text-green-400">{director.bankruptcyCheck}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded">
                    <p className="text-xs text-slate-300 mb-1">Directors Search</p>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <p className="text-xs font-semibold text-green-400">{director.directorsSearch}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Director
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Director
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  View Documents
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Details
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ownership Summary */}
      <div className="bg-white border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Ownership Structure</h3>
        <div className="space-y-3">
          {directors.map((director, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/15 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-400 text-sm">{director.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-100">{director.name}</p>
                  <p className="text-xs text-slate-300">{director.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-400">{director.ownership}%</p>
                  <p className="text-xs text-slate-300">Ownership</p>
                </div>
                {director.isGuarantor && (
                  <div className="px-3 py-1 bg-green-500/15 rounded">
                    <p className="text-xs font-medium text-green-300">Guarantor</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="pt-3 border-t border-white/10">
            <div className="flex justify-between">
              <p className="font-semibold text-slate-100">Total Ownership</p>
              <p className="text-2xl font-bold text-slate-100">
                {directors.reduce((sum, d) => sum + d.ownership, 0)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Guarantor Summary */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-300 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Guarantee Summary
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-green-300 mb-2">Total Guarantors</p>
            <p className="text-3xl font-bold text-green-300">
              {directors.filter(d => d.isGuarantor).length}
            </p>
          </div>
          <div>
            <p className="text-sm text-green-300 mb-2">Guaranteed Coverage</p>
            <p className="text-3xl font-bold text-green-300">
              {directors.filter(d => d.isGuarantor && d.guaranteeAmount.includes('Unlimited')).length > 0 ? 'Unlimited' : '100%'}
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {directors.filter(d => d.isGuarantor).map((director, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-white border border-green-500/30 rounded">
              <p className="font-semibold text-slate-100">{director.name}</p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-300">{director.guarantorType}</span>
                <span className="px-2 py-1 bg-green-500/15 text-green-300 rounded text-xs font-medium">
                  {director.guaranteeAmount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
