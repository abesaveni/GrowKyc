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
          return { variant: 'default' as const, label: 'Active', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
        case 'pending':
          return { variant: 'secondary' as const, label: 'Pending', color: 'bg-white/5 text-slate-300 border-white/10' };
        case 'in_auction':
          return { variant: 'default' as const, label: 'In Auction', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
        case 'under_contract':
          return { variant: 'default' as const, label: 'Under Contract', color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' };
        case 'completed':
          return { variant: 'default' as const, label: 'Completed', color: 'bg-green-500/15 text-green-300 border-green-500/30' };
        case 'cancelled':
          return { variant: 'destructive' as const, label: 'Cancelled', color: 'bg-red-500/15 text-red-300 border-red-500/30' };
        default:
          return { variant: 'outline' as const, label: status, color: '' };
      }
    }
    
    if (type === 'risk') {
      switch (statusLower) {
        case 'low':
          return { variant: 'default' as const, label: 'Low Risk', color: 'bg-green-500/15 text-green-300 border-green-500/30' };
        case 'medium':
          return { variant: 'default' as const, label: 'Medium Risk', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
        case 'high':
          return { variant: 'default' as const, label: 'High Risk', color: 'bg-orange-500/15 text-orange-300 border-orange-500/30' };
        case 'critical':
          return { variant: 'destructive' as const, label: 'Critical', color: 'bg-red-500/15 text-red-300 border-red-500/30' };
        default:
          return { variant: 'outline' as const, label: status, color: '' };
      }
    }
    
    if (type === 'kyc') {
      switch (statusLower) {
        case 'kyc_review':
          return { variant: 'default' as const, label: 'KYC Review', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
        case 'approved':
          return { variant: 'default' as const, label: 'Approved', color: 'bg-green-500/15 text-green-300 border-green-500/30' };
        case 'rejected':
          return { variant: 'destructive' as const, label: 'Rejected', color: 'bg-red-500/15 text-red-300 border-red-500/30' };
        default:
          return { variant: 'outline' as const, label: status, color: '' };
      }
    }
    
    if (type === 'settlement') {
      switch (statusLower) {
        case 'draft':
          return { variant: 'default' as const, label: 'Draft', color: 'bg-white/5 text-slate-300 border-white/10' };
        case 'pending_docs':
          return { variant: 'default' as const, label: 'Pending Docs', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
        case 'ready':
          return { variant: 'default' as const, label: 'Ready', color: 'bg-green-500/15 text-green-300 border-green-500/30' };
        case 'completed':
          return { variant: 'default' as const, label: 'Completed', color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' };
        default:
          return { variant: 'outline' as const, label: status, color: '' };
      }
    }
    
    if (type === 'document') {
      switch (statusLower) {
        case 'pending':
          return { variant: 'default' as const, label: 'Pending', color: 'bg-white/5 text-slate-300 border-white/10' };
        case 'uploaded':
          return { variant: 'default' as const, label: 'Uploaded', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
        case 'approved':
          return { variant: 'default' as const, label: 'Approved', color: 'bg-green-500/15 text-green-300 border-green-500/30' };
        default:
          return { variant: 'outline' as const, label: status, color: '' };
      }
    }
    
    if (type === 'task') {
      switch (statusLower) {
        case 'urgent':
          return { variant: 'destructive' as const, label: 'Urgent', color: 'bg-red-500/15 text-red-300 border-red-500/30' };
        case 'high':
          return { variant: 'default' as const, label: 'High', color: 'bg-orange-500/15 text-orange-300 border-orange-500/30' };
        case 'medium':
          return { variant: 'default' as const, label: 'Medium', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
        case 'low':
          return { variant: 'default' as const, label: 'Low', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
        case 'completed':
          return { variant: 'default' as const, label: 'Done', color: 'bg-green-500/15 text-green-300 border-green-500/30' };
        default:
          return { variant: 'outline' as const, label: status, color: '' };
      }
    }
    
    // Role type
    return { variant: 'outline' as const, label: status, color: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' };
  };

  const { label, color } = getVariantAndLabel();

  return (
    <Badge className={`${color} border font-medium text-xs px-2.5 py-0.5 rounded-md`}>
      {label}
    </Badge>
  );
}