// Type definitions for Workpaper Automation Platform

export type UserRole = 'preparer' | 'reviewer' | 'manager' | 'admin';

export type JobStatus = 
  | 'todo'
  | 'awaiting_client'
  | 'in_progress'
  | 'in_review'
  | 'ready_to_lodge'
  | 'complete';

export interface Job {
  id: string;
  clientName: string;
  entity: string;
  year: string;
  status: JobStatus;
  assignedStaff: string[];
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  progress: number;
  checklistComplete: number;
  checklistTotal: number;
  aiAccuracy?: number;
}

export interface Client {
  id: string;
  name: string;
  abn: string;
  entityType: string;
  status: 'active' | 'inactive';
  performanceScore: number;
  contactEmail: string;
  contactPhone: string;
  assignedManager: string;
  lastActivity: string;
}

export interface Workpaper {
  id: string;
  jobId: string;
  section: string;
  name: string;
  status: 'draft' | 'in_review' | 'approved';
  assignedTo: string;
  lastModified: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'complete' | 'not_applicable';
  assignedTo?: string;
  dueDate?: string;
  aiSuggested?: boolean;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
  ocrExtracted: boolean;
}

export interface KPI {
  label: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down';
  format?: 'currency' | 'percentage' | 'number';
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  badge?: number;
  children?: NavigationItem[];
}
