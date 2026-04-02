import React from 'react';
import { Badge } from './ui/badge';

export type CaseStatus = 
  | 'active' 
  | 'pending' 
  | 'in_auction' 
  | 'under_contract' 
  | 'completed' 
  | 'cancelled'
  | 'kyc_review'
  | 'approved'
  | 'rejected';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

interface StatusBadgeProps {
  status: CaseStatus | RiskLevel | string;
  type?: 'case' | 'risk' | 'role' | 'kyc' | 'settlement' | 'document' | 'task';
}

export function StatusBadge({ status, type = 'case' }: StatusBadgeProps) {
  const getVariantAndLabel = () => {
    const statusLower = status.toLowerCase();
    
    if (type === 'case') {
      switch (statusLower) {
        case 'active':
          return { variant: 'default' as const, label: 'Active', color: 'bg-blue-100 text-blue-700 border-blue-200' };
        case 'pending':
          return { variant: 'secondary' as const, label: 'Pending', color: 'bg-gray-100 text-gray-700 border-gray-200' };
        case 'in_auction':
          return { variant: 'default' as const, label: 'In Auction', color: 'bg-purple-100 text-purple-700 border-purple-200' };
        case 'under_contract':
          return { variant: 'default' as const, label: 'Under Contract', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' };
        case 'completed':
          return { variant: 'default' as const, label: 'Completed', color: 'bg-green-100 text-green-700 border-green-200' };
        case 'cancelled':
          return { variant: 'destructive' as const, label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200' };
        default:
          return { variant: 'outline' as const, label: status, color: '' };
      }
    }
    
    if (type === 'risk') {
      switch (statusLower) {
        case 'low':
          return { variant: 'default' as const, label: 'Low Risk', color: 'bg-green-100 text-green-700 border-green-200' };
        case 'medium':
          return { variant: 'default' as const, label: 'Medium Risk', color: 'bg-amber-100 text-amber-700 border-amber-200' };
        case 'high':
          return { variant: 'default' as const, label: 'High Risk', color: 'bg-orange-100 text-orange-700 border-orange-200' };
        case 'critical':
          return { variant: 'destructive' as const, label: 'Critical', color: 'bg-red-100 text-red-700 border-red-200' };
        default:
          return { variant: 'outline' as const, label: status, color: '' };
      }
    }
    
    if (type === 'kyc') {
      switch (statusLower) {
        case 'kyc_review':
          return { variant: 'default' as const, label: 'KYC Review', color: 'bg-amber-100 text-amber-700 border-amber-200' };
        case 'approved':
          return { variant: 'default' as const, label: 'Approved', color: 'bg-green-100 text-green-700 border-green-200' };
        case 'rejected':
          return { variant: 'destructive' as const, label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200' };
        default:
          return { variant: 'outline' as const, label: status, color: '' };
      }
    }
    
    if (type === 'settlement') {
      switch (statusLower) {
        case 'draft':
          return { variant: 'default' as const, label: 'Draft', color: 'bg-gray-100 text-gray-700 border-gray-200' };
        case 'pending_docs':
          return { variant: 'default' as const, label: 'Pending Docs', color: 'bg-amber-100 text-amber-700 border-amber-200' };
        case 'ready':
          return { variant: 'default' as const, label: 'Ready', color: 'bg-green-100 text-green-700 border-green-200' };
        case 'completed':
          return { variant: 'default' as const, label: 'Completed', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' };
        default:
          return { variant: 'outline' as const, label: status, color: '' };
      }
    }
    
    if (type === 'document') {
      switch (statusLower) {
        case 'pending':
          return { variant: 'default' as const, label: 'Pending', color: 'bg-gray-100 text-gray-700 border-gray-200' };
        case 'uploaded':
          return { variant: 'default' as const, label: 'Uploaded', color: 'bg-blue-100 text-blue-700 border-blue-200' };
        case 'approved':
          return { variant: 'default' as const, label: 'Approved', color: 'bg-green-100 text-green-700 border-green-200' };
        default:
          return { variant: 'outline' as const, label: status, color: '' };
      }
    }
    
    if (type === 'task') {
      switch (statusLower) {
        case 'urgent':
          return { variant: 'destructive' as const, label: 'Urgent', color: 'bg-red-100 text-red-700 border-red-200' };
        case 'high':
          return { variant: 'default' as const, label: 'High', color: 'bg-orange-100 text-orange-700 border-orange-200' };
        case 'medium':
          return { variant: 'default' as const, label: 'Medium', color: 'bg-amber-100 text-amber-700 border-amber-200' };
        case 'low':
          return { variant: 'default' as const, label: 'Low', color: 'bg-blue-100 text-blue-700 border-blue-200' };
        case 'completed':
          return { variant: 'default' as const, label: 'Done', color: 'bg-green-100 text-green-700 border-green-200' };
        default:
          return { variant: 'outline' as const, label: status, color: '' };
      }
    }
    
    // Role type
    return { variant: 'outline' as const, label: status, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
  };

  const { label, color } = getVariantAndLabel();

  return (
    <Badge className={`${color} border font-medium text-xs px-2.5 py-0.5 rounded-md`}>
      {label}
    </Badge>
  );
}