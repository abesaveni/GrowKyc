export interface LoggedActivity {
  type: 'approval' | 'alert' | 'review' | 'document' | 'update';
  user: string;
  action: string;
  time: string;
  iconName: 'CheckCircle' | 'AlertTriangle' | 'UserCheck' | 'FileText' | 'Activity';
  color: string;
}

export function logComplianceActivity(activity: Omit<LoggedActivity, 'user' | 'time'>) {
  if (typeof window === 'undefined') return;
  try {
    const saved = localStorage.getItem('growkyc_logged_activities');
    let list: LoggedActivity[] = [];
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        list = parsed;
      }
    }
    const newActivity: LoggedActivity = {
      ...activity,
      user: 'You',
      time: 'Just now'
    };
    list = [newActivity, ...list].slice(0, 50); // Keep last 50 activities
    localStorage.setItem('growkyc_logged_activities', JSON.stringify(list));
    
    // Dispatch a custom event to notify components (like PersonalizedDashboard) to refresh
    window.dispatchEvent(new CustomEvent('growkyc:activity_logged'));
  } catch (err) {
    console.error('Failed to save activity log:', err);
  }
}
