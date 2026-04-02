import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from '../../lib/toast';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { ArrowLeft, Building2, Users, Plus, Trash2, Mail, Save, CreditCard, AlertCircle } from 'lucide-react';

interface OrganizationSettingsProps {
  onBack?: () => void;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function OrganizationSettings({ onBack }: OrganizationSettingsProps) {
  const [orgData, setOrgData] = useState({
    name: 'Platinum Capital Partners',
    abn: '12 345 678 901',
    industry: 'Financial Services',
    size: '50-100 employees',
    website: 'https://platinumcapital.com.au',
    phone: '+61 3 9123 4567',
    address: '123 Collins Street',
    city: 'Melbourne',
    state: 'VIC',
    postcode: '3000'
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'Michael Chen', email: 'michael.chen@platinumcapital.com.au', role: 'Administrator' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah.johnson@platinumcapital.com.au', role: 'Member' },
    { id: '3', name: 'David Wilson', email: 'david.wilson@platinumcapital.com.au', role: 'Member' }
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showManagePlanDialog, setShowManagePlanDialog] = useState(false);
  const [showUpdatePaymentDialog, setShowUpdatePaymentDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [paymentMethod, setPaymentMethod] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const handleChange = (field: string, value: string) => {
    setOrgData({ ...orgData, [field]: value });
    setHasChanges(true);
  };

  const validateOrgData = () => {
    if (!orgData.name.trim()) {
      toast.error('Organization name is required');
      return false;
    }
    if (!orgData.abn.trim()) {
      toast.error('ABN is required');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateOrgData()) return;

    setIsSaving(true);
    toast.loading('Saving organization settings...');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setHasChanges(false);
    
    toast.success('Organization settings saved!', {
      description: 'Your changes have been updated'
    });
  };

  const handleInviteMember = () => {
    setShowInviteDialog(true);
  };

  const sendInvite = () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setShowInviteDialog(false);
    toast.success(`Invitation sent to ${inviteEmail}!`, {
      description: 'They will receive an email with instructions'
    });
    setInviteEmail('');
  };

  const handleRemoveMemberClick = (member: TeamMember) => {
    setMemberToRemove(member);
    setConfirmRemoveOpen(true);
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;

    setConfirmRemoveOpen(false);
    toast.loading('Removing member...');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setTeamMembers(teamMembers.filter(m => m.id !== memberToRemove.id));
    
    toast.success(`${memberToRemove.name} removed from organization`, {
      description: 'They will lose access to all resources'
    });
    
    setMemberToRemove(null);
  };

  const handleRoleChange = (memberId: string, newRole: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    setTeamMembers(teamMembers.map(m =>
      m.id === memberId ? { ...m, role: newRole } : m
    ));
    toast.success(`Role updated to ${newRole}`, {
      description: member?.name
    });
  };

  const handleManageSubscription = () => {
    setShowManagePlanDialog(true);
  };

  const handleUpdatePayment = () => {
    setShowUpdatePaymentDialog(true);
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '#' },
    { label: 'Settings', href: '#', onClick: onBack },
    { label: 'Organization' }
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      <div className="max-w-4xl space-y-6">
        {/* Organization Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Building2 className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <CardTitle>Organization Details</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Manage your organization information</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Organization Name *</Label>
                <Input
                  value={orgData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Your organization name"
                />
              </div>
              <div>
                <Label>ABN *</Label>
                <Input
                  value={orgData.abn}
                  onChange={(e) => handleChange('abn', e.target.value)}
                  placeholder="12 345 678 901"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Industry</Label>
                <select
                  value={orgData.industry}
                  onChange={(e) => handleChange('industry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Financial Services">Financial Services</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Legal Services">Legal Services</option>
                  <option value="Investment Management">Investment Management</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <Label>Company Size</Label>
                <select
                  value={orgData.size}
                  onChange={(e) => handleChange('size', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="1-10 employees">1-10 employees</option>
                  <option value="11-50 employees">11-50 employees</option>
                  <option value="50-100 employees">50-100 employees</option>
                  <option value="100+ employees">100+ employees</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Website</Label>
                <Input
                  type="url"
                  value={orgData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  value={orgData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+61 X XXXX XXXX"
                />
              </div>
            </div>

            <div>
              <Label>Street Address</Label>
              <Input
                value={orgData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="123 Example Street"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>City</Label>
                <Input
                  value={orgData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="City"
                />
              </div>
              <div>
                <Label>State</Label>
                <select
                  value={orgData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="NSW">NSW</option>
                  <option value="VIC">VIC</option>
                  <option value="QLD">QLD</option>
                  <option value="SA">SA</option>
                  <option value="WA">WA</option>
                  <option value="TAS">TAS</option>
                  <option value="NT">NT</option>
                  <option value="ACT">ACT</option>
                </select>
              </div>
              <div>
                <Label>Postcode</Label>
                <Input
                  value={orgData.postcode}
                  onChange={(e) => handleChange('postcode', e.target.value)}
                  placeholder="3000"
                  maxLength={4}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Team Members ({teamMembers.length})</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Manage who has access to your organization</p>
                </div>
              </div>
              <Button onClick={handleInviteMember}>
                <Plus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Administrator">Administrator</option>
                      <option value="Member">Member</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                    {member.role !== 'Administrator' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMemberClick(member)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Team Member Roles:</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• <strong>Administrator:</strong> Full access to all settings and data</li>
                <li>• <strong>Member:</strong> Can view and manage deals, but cannot change organization settings</li>
                <li>• <strong>Viewer:</strong> Read-only access to organization data</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Billing Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle>Billing Information</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Subscription and payment details</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-br from-indigo-50 to-white border-2 border-indigo-200 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900 text-lg">Professional Plan</p>
                <p className="text-sm text-gray-600">A$299/month • Billed annually</p>
                <p className="text-xs text-gray-500 mt-1">Next billing date: 1 March 2026</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleManageSubscription}>
                Manage Plan
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Payment Method</p>
                <p className="text-sm text-gray-600">•••• •••• •••• 4242</p>
                <p className="text-xs text-gray-500 mt-1">Expires 12/2025</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleUpdatePayment}>
                <CreditCard className="w-4 h-4 mr-1" />
                Update
              </Button>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-1">Billing Contact</p>
                  <p>All invoices will be sent to the organization administrator email.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-between items-center pt-4">
          <div>
            {hasChanges && (
              <p className="text-sm text-amber-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                You have unsaved changes
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Invite Member Dialog */}
      <ConfirmDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        title="Invite Team Member"
        description="Enter the email address of the person you'd like to invite to your organization."
        confirmLabel="Send Invite"
        onConfirm={sendInvite}
        variant="default"
      >
        <div className="py-4">
          <Label>Email Address</Label>
          <Input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@example.com"
            className="mt-2"
          />
        </div>
      </ConfirmDialog>

      {/* Confirm Remove Member Dialog */}
      <ConfirmDialog
        open={confirmRemoveOpen}
        onOpenChange={setConfirmRemoveOpen}
        title="Remove Team Member?"
        description={`Are you sure you want to remove ${memberToRemove?.name} from the organization? They will lose access to all resources.`}
        confirmLabel="Remove Member"
        onConfirm={handleRemoveMember}
        variant="destructive"
      />

      {/* Manage Plan Dialog */}
      <ConfirmDialog
        open={showManagePlanDialog}
        onOpenChange={setShowManagePlanDialog}
        title="Manage Subscription Plan"
        description="Choose the plan that best fits your organization's needs."
        confirmLabel="Update Plan"
        onConfirm={() => {
          setShowManagePlanDialog(false);
          toast.success(`Subscription updated to ${selectedPlan === 'starter' ? 'Starter' : selectedPlan === 'professional' ? 'Professional' : 'Enterprise'} plan!`, {
            description: 'Changes will take effect immediately'
          });
        }}
        variant="default"
      >
        <div className="py-4 space-y-4">
          <div 
            onClick={() => setSelectedPlan('starter')}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedPlan === 'starter' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">Starter Plan</h4>
                <p className="text-sm text-gray-600 mt-1">Perfect for small teams</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">A$99<span className="text-sm font-normal text-gray-600">/month</span></p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                selectedPlan === 'starter' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
              } flex items-center justify-center`}>
                {selectedPlan === 'starter' && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
              </div>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-gray-700">
              <li>• Up to 5 team members</li>
              <li>• 10 GB storage</li>
              <li>• Basic support</li>
            </ul>
          </div>

          <div 
            onClick={() => setSelectedPlan('professional')}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedPlan === 'professional' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">Professional Plan</h4>
                  <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs rounded font-semibold">Current</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">For growing businesses</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">A$299<span className="text-sm font-normal text-gray-600">/month</span></p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                selectedPlan === 'professional' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
              } flex items-center justify-center`}>
                {selectedPlan === 'professional' && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
              </div>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-gray-700">
              <li>• Up to 50 team members</li>
              <li>• 100 GB storage</li>
              <li>• Priority support</li>
              <li>• Advanced analytics</li>
            </ul>
          </div>

          <div 
            onClick={() => setSelectedPlan('enterprise')}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedPlan === 'enterprise' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">Enterprise Plan</h4>
                <p className="text-sm text-gray-600 mt-1">For large organizations</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">A$799<span className="text-sm font-normal text-gray-600">/month</span></p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                selectedPlan === 'enterprise' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
              } flex items-center justify-center`}>
                {selectedPlan === 'enterprise' && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
              </div>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-gray-700">
              <li>• Unlimited team members</li>
              <li>• Unlimited storage</li>
              <li>• 24/7 dedicated support</li>
              <li>• Custom integrations</li>
              <li>• SLA guarantee</li>
            </ul>
          </div>
        </div>
      </ConfirmDialog>

      {/* Update Payment Method Dialog */}
      <ConfirmDialog
        open={showUpdatePaymentDialog}
        onOpenChange={setShowUpdatePaymentDialog}
        title="Update Payment Method"
        description="Enter your new payment card details below."
        confirmLabel="Update Payment Method"
        onConfirm={() => {
          if (!paymentMethod.cardNumber || !paymentMethod.expiry || !paymentMethod.cvv || !paymentMethod.name) {
            toast.error('Please fill in all payment details');
            return;
          }
          setShowUpdatePaymentDialog(false);
          toast.success('Payment method updated successfully!', {
            description: 'Your new card has been saved securely'
          });
          setPaymentMethod({ cardNumber: '', expiry: '', cvv: '', name: '' });
        }}
        variant="default"
      >
        <div className="py-4 space-y-4">
          <div>
            <Label>Cardholder Name</Label>
            <Input
              value={paymentMethod.name}
              onChange={(e) => setPaymentMethod({ ...paymentMethod, name: e.target.value })}
              placeholder="John Smith"
              className="mt-2"
            />
          </div>
          <div>
            <Label>Card Number</Label>
            <Input
              value={paymentMethod.cardNumber}
              onChange={(e) => setPaymentMethod({ ...paymentMethod, cardNumber: e.target.value })}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="mt-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Expiry Date</Label>
              <Input
                value={paymentMethod.expiry}
                onChange={(e) => setPaymentMethod({ ...paymentMethod, expiry: e.target.value })}
                placeholder="MM/YY"
                maxLength={5}
                className="mt-2"
              />
            </div>
            <div>
              <Label>CVV</Label>
              <Input
                value={paymentMethod.cvv}
                onChange={(e) => setPaymentMethod({ ...paymentMethod, cvv: e.target.value })}
                placeholder="123"
                maxLength={3}
                type="password"
                className="mt-2"
              />
            </div>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              🔒 Your payment information is encrypted and stored securely. We never store your CVV.
            </p>
          </div>
        </div>
      </ConfirmDialog>
    </div>
  );
}