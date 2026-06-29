import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from '../../lib/toast';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { ArrowLeft, Lock, Key, Shield, CheckCircle, AlertCircle, Smartphone, Monitor, X } from 'lucide-react';

interface SecuritySettingsProps {
  onBack?: () => void;
}

export function SecuritySettings({ onBack }: SecuritySettingsProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [confirm2FAOpen, setConfirm2FAOpen] = useState(false);
  const [confirmSignOutAllOpen, setConfirmSignOutAllOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'enable' | 'disable' | null>(null);

  const validatePassword = () => {
    if (!currentPassword.trim()) {
      toast.error('Current password is required');
      return false;
    }
    if (!newPassword.trim()) {
      toast.error('New password is required');
      return false;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }
    if (!/[A-Z]/.test(newPassword)) {
      toast.error('Password must contain at least one uppercase letter');
      return false;
    }
    if (!/[a-z]/.test(newPassword)) {
      toast.error('Password must contain at least one lowercase letter');
      return false;
    }
    if (!/[0-9]/.test(newPassword)) {
      toast.error('Password must contain at least one number');
      return false;
    }
    if (!confirmPassword.trim()) {
      toast.error('Please confirm your new password');
      return false;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setIsSaving(true);
    toast.loading('Updating password...');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    
    toast.success('Password changed successfully!', 'You can now sign in with your new password');
    
    // Clear form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleToggle2FAClick = (action: 'enable' | 'disable') => {
    setPendingAction(action);
    setConfirm2FAOpen(true);
  };

  const handleConfirm2FA = async () => {
    setConfirm2FAOpen(false);
    
    toast.loading(pendingAction === 'enable' ? 'Enabling 2FA...' : 'Disabling 2FA...');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (pendingAction === 'enable') {
      setTwoFactorEnabled(true);
      toast.success('Two-factor authentication enabled!', 'Scan the QR code with your authenticator app');
    } else {
      setTwoFactorEnabled(false);
      toast.success('Two-factor authentication disabled', 'Your account security has been reduced');
    }
    
    setPendingAction(null);
  };

  const handleSignOutSession = (device: string) => {
    toast.success(`Signed out from ${device}`);
  };

  const handleSignOutAll = async () => {
    setConfirmSignOutAllOpen(false);
    
    toast.loading('Signing out all sessions...');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('All other sessions signed out', 'You remain signed in on this device');
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '#' },
    { label: 'Settings', href: '#', onClick: onBack },
    { label: 'Security' }
  ];

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { label: '', color: '', width: '0%' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
    if (strength <= 4) return { label: 'Medium', color: 'bg-amber-500', width: '66%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      <div className="max-w-3xl">
        {/* Change Password */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Lock className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <CardTitle>Change Password</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Update your password regularly to keep your account secure</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Current Password *</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            <div>
              <Label>New Password *</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              {newPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">Password strength:</span>
                    <span className={`font-semibold ${
                      passwordStrength.label === 'Weak' ? 'text-red-600' :
                      passwordStrength.label === 'Medium' ? 'text-amber-600' :
                      'text-green-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters with uppercase, lowercase, and numbers</p>
            </div>

            <div>
              <Label>Confirm New Password *</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Passwords do not match
                </p>
              )}
            </div>

            <div className="pt-4">
              <Button onClick={handleChangePassword} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-2" />
                    Change Password
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900">Status:</h4>
                  {twoFactorEnabled ? (
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Enabled
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-600 font-medium">
                      <AlertCircle className="w-4 h-4" />
                      Disabled
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {twoFactorEnabled 
                    ? 'Your account is protected with two-factor authentication.'
                    : 'Enable 2FA to significantly improve your account security.'}
                </p>
              </div>
              <Button 
                variant={twoFactorEnabled ? 'outline' : 'default'}
                onClick={() => handleToggle2FAClick(twoFactorEnabled ? 'disable' : 'enable')}
              >
                {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              </Button>
            </div>

            {twoFactorEnabled && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 mb-2">
                  <strong>2FA is active.</strong> You'll need to enter a code from your authenticator app when signing in.
                </p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline">
                    <Smartphone className="w-4 h-4 mr-1" />
                    View Backup Codes
                  </Button>
                  <Button size="sm" variant="outline">
                    Regenerate QR Code
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Sessions</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Manage devices where you're currently signed in</p>
              </div>
              <span className="text-sm text-gray-500">3 active</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Monitor className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Current Session</p>
                  <p className="text-sm text-gray-600">MacBook Pro • Melbourne, VIC</p>
                  <p className="text-xs text-gray-500 mt-1">Last active: Just now</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">iPhone 14 Pro</p>
                  <p className="text-sm text-gray-600">iOS • Sydney, NSW</p>
                  <p className="text-xs text-gray-500 mt-1">Last active: 2 hours ago</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleSignOutSession('iPhone 14 Pro')}
              >
                <X className="w-4 h-4 mr-1" />
                Sign Out
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <Monitor className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Windows PC</p>
                  <p className="text-sm text-gray-600">Chrome • Brisbane, QLD</p>
                  <p className="text-xs text-gray-500 mt-1">Last active: 1 day ago</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleSignOutSession('Windows PC')}
              >
                <X className="w-4 h-4 mr-1" />
                Sign Out
              </Button>
            </div>

            <div className="pt-4 border-t">
              <Button 
                variant="outline" 
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setConfirmSignOutAllOpen(true)}
              >
                Sign Out All Other Sessions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Tips */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-base">Security Best Practices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-blue-900">Use a unique password not used on other sites</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-blue-900">Enable two-factor authentication for extra protection</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-blue-900">Review active sessions regularly</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-blue-900">Never share your password or 2FA codes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirm 2FA Toggle Dialog */}
      <ConfirmDialog
        isOpen={confirm2FAOpen}
        onClose={() => setConfirm2FAOpen(false)}
        title={pendingAction === 'enable' ? 'Enable Two-Factor Authentication?' : 'Disable Two-Factor Authentication?'}
        description={
          pendingAction === 'enable'
            ? 'You will need to scan a QR code with your authenticator app (Google Authenticator, Authy, etc.). This significantly improves account security.'
            : 'Disabling 2FA will make your account less secure. Are you sure you want to continue?'
        }
        confirmLabel={pendingAction === 'enable' ? 'Enable 2FA' : 'Disable 2FA'}
        onConfirm={handleConfirm2FA}
        variant={pendingAction === 'disable' ? 'danger' : 'info'}
      />

      {/* Confirm Sign Out All Dialog */}
      <ConfirmDialog
        isOpen={confirmSignOutAllOpen}
        onClose={() => setConfirmSignOutAllOpen(false)}
        title="Sign Out All Other Sessions?"
        description="This will sign you out from all other devices. You will remain signed in on this device."
        confirmLabel="Sign Out All"
        onConfirm={handleSignOutAll}
        variant="danger"
      />
    </div>
  );
}
