import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { toast } from 'sonner';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { ArrowLeft, Upload, Save, User, Mail, Phone, MapPin, X } from 'lucide-react';
import { mockCurrentUser } from '../../data/mockData';

interface ProfileSettingsProps {
  onBack?: () => void;
}

export function ProfileSettings({ onBack }: ProfileSettingsProps) {
  const [formData, setFormData] = useState({
    firstName: mockCurrentUser.name.split(' ')[0],
    lastName: mockCurrentUser.name.split(' ')[1] || '',
    email: mockCurrentUser.email,
    phone: '+61 412 345 678',
    company: 'Platinum Capital Partners',
    jobTitle: 'Investment Manager',
    address: '123 Collins Street',
    city: 'Melbourne',
    state: 'VIC',
    postcode: '3000',
    country: 'Australia',
    bio: 'Experienced investment professional specializing in distressed asset management and mortgage investment opportunities.'
  });

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast.error('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      toast.error('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    toast.loading('Saving profile...');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setHasChanges(false);
    
    toast.success('Profile updated successfully!', {
      description: 'Your changes have been saved'
    });
  };

  const handleUploadPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    toast.success('Profile photo removed');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        onBack?.();
      }
    } else {
      onBack?.();
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '#' },
    { label: 'Settings', href: '#', onClick: onBack },
    { label: 'Profile' }
  ];

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Photo */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center">
                <Avatar className="w-32 h-32">
                  {profilePhoto ? (
                    <AvatarImage src={profilePhoto} alt="Profile Photo" />
                  ) : (
                    <AvatarFallback className="bg-indigo-600 text-white text-3xl">
                      {formData.firstName[0]}{formData.lastName[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="mt-4 space-y-2 w-full">
                  <Button variant="outline" className="w-full" onClick={handleUploadPhoto}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={handleRemovePhoto}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove Photo
                  </Button>
                </div>
              </div>
              <div className="pt-4 border-t text-xs text-slate-400">
                <p>Recommended: Square image, at least 400x400px</p>
                <p className="mt-1">JPG, PNG or GIF. Max 5MB.</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Account Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">Member Since:</span>
                <span className="font-semibold">Jan 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Account Type:</span>
                <span className="font-semibold">Premium Investor</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Verification:</span>
                <span className="px-2 py-0.5 bg-green-500/15 text-green-300 rounded text-xs font-semibold">
                  Verified
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      className="pl-10"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                </div>
                <div>
                  <Label>Last Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      className="pl-10"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <Label>Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="tel"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+61 4XX XXX XXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Company</Label>
                  <Input
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <Label>Job Title</Label>
                  <Input
                    value={formData.jobTitle}
                    onChange={(e) => handleChange('jobTitle', e.target.value)}
                    placeholder="Your role"
                  />
                </div>
              </div>

              <div>
                <Label>Bio</Label>
                <Textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                />
                <p className="text-xs text-slate-400 mt-1">{formData.bio.length} / 500 characters</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Street Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    className="pl-10"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="123 Example Street"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>City</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label>State</Label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                    value={formData.postcode}
                    onChange={(e) => handleChange('postcode', e.target.value)}
                    placeholder="3000"
                    maxLength={4}
                  />
                </div>
              </div>

              <div>
                <Label>Country</Label>
                <Input
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  placeholder="Australia"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4">
            <div>
              {hasChanges && (
                <p className="text-sm text-amber-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                  You have unsaved changes
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleCancel}>
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
      </div>
    </div>
  );
}