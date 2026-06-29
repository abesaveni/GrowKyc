import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  X,
  Upload,
  Palette,
  Globe,
  Building2,
  Eye,
  Save,
  RotateCcw,
  Check,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';

interface BrandingEditorProps {
  onClose: () => void;
  currentBranding: {
    organizationName: string;
    primaryColor: string;
    customDomain: string;
    logoUrl?: string;
  };
  onSave: (branding: any) => void;
}

export function BrandingEditor({ onClose, currentBranding, onSave }: BrandingEditorProps) {
  const [organizationName, setOrganizationName] = useState(currentBranding.organizationName);
  const [primaryColor, setPrimaryColor] = useState(currentBranding.primaryColor);
  const [customDomain, setCustomDomain] = useState(currentBranding.customDomain);
  const [logoUrl, setLogoUrl] = useState(currentBranding.logoUrl || '');
  const [showPreview, setShowPreview] = useState(false);

  const predefinedColors = [
    { name: 'Blue', value: '#2855a6' },
    { name: 'Indigo', value: '#4f46e5' },
    { name: 'Purple', value: '#7c3aed' },
    { name: 'Pink', value: '#db2777' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Orange', value: '#ea580c' },
    { name: 'Green', value: '#16a34a' },
    { name: 'Teal', value: '#0d9488' },
    { name: 'Cyan', value: '#0891b2' },
    { name: 'Gray', value: '#6b7280' }
  ];

  const handleSave = () => {
    onSave({
      organizationName,
      primaryColor,
      customDomain,
      logoUrl
    });
    toast.success('Branding updated successfully!');
    onClose();
  };

  const handleReset = () => {
    setOrganizationName(currentBranding.organizationName);
    setPrimaryColor(currentBranding.primaryColor);
    setCustomDomain(currentBranding.customDomain);
    setLogoUrl(currentBranding.logoUrl || '');
    toast.info('Changes reset to saved values');
  };

  const handleLogoUpload = () => {
    // Simulate file upload
    toast.success('Logo uploaded successfully!');
    setLogoUrl('https://via.placeholder.com/200x50/2855a6/ffffff?text=Your+Logo');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Brand Editor</h2>
            <p className="text-sm text-slate-300 mt-1">Customize your platform's appearance and identity</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Settings */}
            <div className="space-y-6">
              {/* Organization Name */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    <CardTitle className="text-lg">Organization Name</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="w-full px-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter organization name"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    This will appear in the header, emails, and documents
                  </p>
                </CardContent>
              </Card>

              {/* Brand Color */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-400" />
                    <CardTitle className="text-lg">Brand Color</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Color Picker */}
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-16 h-16 rounded-lg cursor-pointer border-2 border-white/10"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-full px-4 py-2 border border-white/10 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="#000000"
                        />
                        <p className="text-xs text-slate-400 mt-1">
                          Primary color for buttons, links, and accents
                        </p>
                      </div>
                    </div>

                    {/* Predefined Colors */}
                    <div>
                      <p className="text-sm font-semibold text-slate-300 mb-2">Quick Colors</p>
                      <div className="grid grid-cols-5 gap-2">
                        {predefinedColors.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setPrimaryColor(color.value)}
                            className="group relative"
                            title={color.name}
                          >
                            <div
                              className="w-full aspect-square rounded-lg border-2 transition-all"
                              style={{
                                backgroundColor: color.value,
                                borderColor: primaryColor === color.value ? '#000' : '#e5e7eb'
                              }}
                            >
                              {primaryColor === color.value && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Check className="w-5 h-5 text-white drop-shadow-lg" />
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-slate-300 mt-1 text-center">{color.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Custom Domain */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-green-400" />
                    <CardTitle className="text-lg">Custom Domain</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="w-full px-4 py-2 border border-white/10 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="yourcompany.grow.cloud"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Point your custom domain with a CNAME record
                  </p>
                  <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-xs font-mono text-blue-300">
                      CNAME: {customDomain} → grow.cloud
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Logo Upload */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-amber-400" />
                    <CardTitle className="text-lg">Logo</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {logoUrl && (
                      <div className="p-4 border-2 border-dashed border-white/10 rounded-lg bg-white/5">
                        <img
                          src={logoUrl}
                          alt="Logo Preview"
                          className="max-h-16 mx-auto"
                        />
                      </div>
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleLogoUpload}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {logoUrl ? 'Replace Logo' : 'Upload Logo'}
                    </Button>
                    
                    <p className="text-xs text-slate-400">
                      PNG or SVG recommended • 512x512px • Max 2MB
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-blue-400" />
                      <CardTitle className="text-lg">Live Preview</CardTitle>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      {showPreview ? 'Hide' : 'Show'} Full Preview
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Header Preview */}
                  <div className="border-2 border-white/10 rounded-lg overflow-hidden">
                    <div className="bg-white border-b border-white/10 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {logoUrl ? (
                            <img src={logoUrl} alt="Logo" className="h-8" />
                          ) : (
                            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-slate-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-100">{organizationName || 'Organization Name'}</p>
                            <p className="text-xs text-slate-400">Financial Operating System</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Button Preview */}
                    <div className="p-6 space-y-4 bg-white/5">
                      <div>
                        <p className="text-sm font-semibold text-slate-300 mb-2">Primary Button</p>
                        <button
                          className="px-4 py-2 rounded-lg text-white font-medium"
                          style={{ backgroundColor: primaryColor }}
                        >
                          Action Button
                        </button>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-300 mb-2">Links & Text</p>
                        <p className="text-slate-300">
                          This is sample text with a{' '}
                          <span style={{ color: primaryColor }} className="font-semibold cursor-pointer">
                            branded link
                          </span>{' '}
                          to show your color.
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-300 mb-2">Status Badge</p>
                        <span
                          className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                          style={{ backgroundColor: primaryColor }}
                        >
                          Active
                        </span>
                      </div>
                    </div>
                  </div>

                  {showPreview && (
                    <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <p className="text-sm text-blue-300 font-semibold mb-2">
                        Full Preview Mode
                      </p>
                      <p className="text-xs text-blue-300">
                        Save your changes to see the full branding applied across all modules, login pages, and email templates.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Domain Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Domain Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-semibold text-slate-100">SSL Certificate</span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-green-600 text-white rounded font-semibold">ACTIVE</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-semibold text-slate-100">DNS Configuration</span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-green-600 text-white rounded font-semibold">VERIFIED</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-white/5">
          <Button variant="ghost" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Changes
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
