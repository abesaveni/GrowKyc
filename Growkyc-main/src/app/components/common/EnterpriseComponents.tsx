import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, Info, X } from 'lucide-react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface EnterpriseAlertProps {
  type: AlertType;
  title: string;
  message: string;
  onClose?: () => void;
  actions?: React.ReactNode;
}

export function EnterpriseAlert({ type, title, message, onClose, actions }: EnterpriseAlertProps) {
  const config = {
    success: {
      icon: CheckCircle,
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      iconColor: 'text-green-400',
      titleColor: 'text-green-300',
      messageColor: 'text-green-300'
    },
    error: {
      icon: AlertCircle,
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      iconColor: 'text-red-400',
      titleColor: 'text-red-300',
      messageColor: 'text-red-300'
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      iconColor: 'text-amber-400',
      titleColor: 'text-amber-300',
      messageColor: 'text-amber-300'
    },
    info: {
      icon: Info,
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-300',
      messageColor: 'text-blue-300'
    }
  };

  const style = config[type];
  const Icon = style.icon;

  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-4`}>
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold ${style.titleColor} mb-1`}>{title}</h4>
          <p className={`text-sm ${style.messageColor}`}>{message}</p>
          {actions && <div className="mt-3">{actions}</div>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${style.iconColor} hover:opacity-70 flex-shrink-0`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="p-4 bg-white/5 rounded-full mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-300 text-center max-w-md mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ message = 'Loading...', size = 'md' }: LoadingStateProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`${sizes[size]} border-4 border-white/10 border-t-primary rounded-full animate-spin mb-4`} />
      <p className="text-slate-300 font-medium">{message}</p>
    </div>
  );
}

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variants = {
    danger: {
      icon: AlertCircle,
      iconColor: 'text-red-400',
      bgColor: 'bg-red-500/10',
      buttonColor: 'bg-red-600 hover:bg-red-700'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      buttonColor: 'bg-amber-600 hover:bg-amber-700'
    },
    default: {
      icon: Info,
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      buttonColor: 'bg-primary hover:bg-primary/90'
    }
  };

  const style = variants[variant];
  const Icon = style.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex gap-4">
            <div className={`p-3 ${style.bgColor} rounded-full flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${style.iconColor}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-100 mb-2">{title}</h3>
              <p className="text-slate-300">{message}</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-white/5 border-t flex gap-3 justify-end rounded-b-lg">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-white/10 rounded-lg text-slate-300 font-semibold hover:bg-white/5 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 ${style.buttonColor} text-white rounded-lg font-semibold transition-colors`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  status: 'active' | 'pending' | 'completed' | 'cancelled' | 'error' | 'draft' | 'review' | 'approved' | 'rejected';
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const styles = {
    active: 'bg-green-500/15 text-green-300',
    pending: 'bg-amber-500/15 text-amber-300',
    completed: 'bg-blue-500/15 text-blue-300',
    cancelled: 'bg-white/5 text-slate-300',
    error: 'bg-red-500/15 text-red-300',
    draft: 'bg-white/5 text-slate-300',
    review: 'bg-purple-500/15 text-purple-300',
    approved: 'bg-green-500/15 text-green-300',
    rejected: 'bg-red-500/15 text-red-300'
  };

  return (
    <span className={`${sizes[size]} ${styles[status]} rounded-full font-semibold inline-block`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
