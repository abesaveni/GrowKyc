import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Home, 
  FileText, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Upload,
  MessageSquare,
  Calendar,
  TrendingUp,
  Info
} from 'lucide-react';
import { mockCases } from '../../data/mockData';
import { StatusBadge } from '../StatusBadge';
import { format } from 'date-fns';

interface BorrowerDashboardProps {
  onNavigate?: (page: string) => void;
}

export function BorrowerDashboard({ onNavigate }: BorrowerDashboardProps) {
  // Get borrower's case (typically only one)
  const myCase = mockCases[0];
  
  const nextActions = [
    { action: 'Upload property valuation', status: 'pending', due: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), navigateTo: 'documents' },
    { action: 'Complete identity verification', status: 'completed', due: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), navigateTo: 'kyc' },
    { action: 'Review auction terms', status: 'pending', due: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), navigateTo: 'contracts' }
  ];

  const recentActivity = [
    { event: 'Case submitted for review', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), type: 'status' },
    { event: 'Documents uploaded: Title deed', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), type: 'document' },
    { event: 'New message from Admin', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), type: 'message' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-500/30">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-100 mb-2">Welcome back!</h1>
              <p className="text-slate-300 mb-4">
                Your case is currently <span className="font-semibold text-blue-400">under review</span>. 
                Here's what you need to do next.
              </p>
              <Button onClick={() => onNavigate?.('cases')}>
                <Home className="w-4 h-4 mr-2" />
                View My Case
              </Button>
            </div>
            <div className="text-right">
              <StatusBadge status={myCase.status} type="case" />
              <p className="text-sm text-slate-300 mt-2">
                Case #{myCase.caseNumber}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-white border-2 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Home className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-sm text-slate-300 mb-1">Property Value</p>
            <p className="text-3xl font-bold text-slate-100">${(myCase.valuation.amount / 1000).toFixed(0)}k</p>
            <p className="text-xs text-slate-400 mt-1">Valuation date: {format(myCase.valuation.date, 'MMM yyyy')}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-sm text-slate-300 mb-1">Outstanding Debt</p>
            <p className="text-3xl font-bold text-slate-100">${(myCase.outstandingDebt / 1000).toFixed(0)}k</p>
            <p className="text-xs text-slate-400 mt-1">Current balance</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-amber-400" />
            </div>
            <p className="text-sm text-slate-300 mb-1">Documents</p>
            <p className="text-3xl font-bold text-slate-100">8/12</p>
            <p className="text-xs text-slate-400 mt-1">4 documents required</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-sm text-slate-300 mb-1">Messages</p>
            <p className="text-3xl font-bold text-slate-100">3</p>
            <p className="text-xs text-slate-400 mt-1">2 unread messages</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Actions Required */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              Next Actions Required
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {nextActions.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-white/5 transition-colors">
                  {item.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`font-semibold ${item.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-100'}`}>
                      {item.action}
                    </p>
                    <p className="text-sm text-slate-300 mt-1">
                      Due: {format(item.due, 'dd MMM yyyy')}
                    </p>
                  </div>
                  {item.status === 'pending' && (
                    <Button size="sm" variant="outline" onClick={() => onNavigate?.(item.navigateTo)}>
                      Start
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Case Status Timeline */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Case Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      item.type === 'status' ? 'bg-blue-600' :
                      item.type === 'document' ? 'bg-green-600' :
                      'bg-purple-600'
                    }`}></div>
                    {index < recentActivity.length - 1 && (
                      <div className="w-0.5 h-full bg-white/10 my-1"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-semibold text-slate-100">{item.event}</p>
                    <p className="text-sm text-slate-300">{format(item.date, 'dd MMM yyyy, HH:mm')}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Property Details */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5 text-primary" />
            Your Property
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-slate-300 mb-1">Address</p>
              <p className="font-semibold text-slate-100">{myCase.property.address}</p>
              <p className="text-sm text-slate-300">{myCase.property.suburb}, {myCase.property.state}</p>
            </div>
            <div>
              <p className="text-sm text-slate-300 mb-1">Property Type</p>
              <p className="font-semibold text-slate-100">{myCase.property.propertyType}</p>
            </div>
            <div>
              <p className="text-sm text-slate-300 mb-1">Bedrooms / Bathrooms</p>
              <p className="font-semibold text-slate-100">{myCase.property.bedrooms} bed / {myCase.property.bathrooms} bath</p>
            </div>
            <div>
              <p className="text-sm text-slate-300 mb-1">Land Size</p>
              <p className="font-semibold text-slate-100">{myCase.property.landSize} m²</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Card className="bg-blue-500/10 border-2 border-blue-500/30">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Info className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-slate-100 mb-2">What happens next?</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Complete all required document uploads</li>
                <li>• Our team will review your case and property valuation</li>
                <li>• Once approved, your case will be listed for auction</li>
                <li>• You'll be able to review and accept bids from qualified lenders</li>
                <li>• After accepting a bid, proceed to contract signing and settlement</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}