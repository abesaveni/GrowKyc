import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Mail,
  X,
  Sparkles,
  FileText,
  Eye,
  CheckCircle,
  Plus,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';

export function CampaignBuilderModal({ campaign, onClose, onSave }: { campaign: any, onClose: () => void, onSave: (campaignName: string) => void }) {
  const [content, setContent] = useState('');
  const [previewHTML, setPreviewHTML] = useState('');
  const [activeBuilderTab, setActiveBuilderTab] = useState<'design' | 'html' | 'preview'>('design');
  const [showImageModal, setShowImageModal] = useState(false);
  const [showButtonModal, setShowButtonModal] = useState(false);

  const handleSaveCampaign = () => {
    onSave(campaign.name);
  };

  const handleAddButton = (buttonText: string, buttonUrl: string, buttonColor: string) => {
    const buttonMarkup = `\n\n[BUTTON: ${buttonText} | ${buttonUrl} | ${buttonColor}]\n\n`;
    setContent(content + buttonMarkup);
    setShowButtonModal(false);
  };

  const handleAddImage = (imageUrl: string, altText: string) => {
    const imageMarkup = `\n\n[IMAGE: ${imageUrl} | Alt: ${altText}]\n\n`;
    setContent(content + imageMarkup);
    setShowImageModal(false);
  };

  const handleAddDivider = () => {
    const dividerMarkup = `\n\n---\n\n`;
    setContent(content + dividerMarkup);
  };

  const generatePreview = () => {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">${campaign.name}</h1>
            <p style="margin-top: 10px; font-size: 16px;">${campaign.subject || 'Your subject line here'}</p>
          </div>
          <div style="padding: 30px; background: white; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
            <p style="color: #374151; line-height: 1.6; font-size: 15px;">${content || 'Hi there,<br/><br/>Start designing your email content here! You can use the AI generator to create compelling copy automatically.<br/><br/>This email will be sent to your target audience: ' + campaign.audience}</p>
            <div style="margin-top: 30px; text-align: center;">
              <a href="#" style="background: #9333ea; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">Take Action Now</a>
            </div>
          </div>
          <div style="background: #111827; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px;">
            <p style="margin: 0 0 8px 0;">You're receiving this because you subscribed to our newsletter.</p>
            <p style="margin: 0;"><a href="#" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a> | <a href="#" style="color: #9ca3af; text-decoration: underline;">Update Preferences</a></p>
          </div>
        </body>
      </html>
    `;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Campaign Builder</h2>
              <p className="text-sm text-gray-600">{campaign.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Campaign Info Bar */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Type:</span>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded font-medium">{campaign.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Audience:</span>
              <span className="font-medium text-gray-900">{campaign.audience}</span>
            </div>
            {campaign.scheduleType && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Schedule:</span>
                <span className="font-medium text-gray-900">{campaign.scheduleType}</span>
              </div>
            )}
            {campaign.subject && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Subject:</span>
                <span className="font-medium text-gray-900">{campaign.subject}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex px-6">
            {[
              { id: 'design', label: 'Design', icon: Sparkles },
              { id: 'html', label: 'HTML Code', icon: FileText },
              { id: 'preview', label: 'Preview', icon: Eye }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveBuilderTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeBuilderTab === tab.id
                      ? 'border-purple-600 text-purple-600 font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeBuilderTab === 'design' && (
            <div className="space-y-6">
              {/* AI Email Generator */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6" />
                  <h3 className="font-semibold text-lg">AI Email Generator</h3>
                </div>
                <p className="text-indigo-100 mb-6">
                  Let AI write your email content based on your campaign goals and target audience
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setContent(`Dear ${campaign.audience},\n\nWe're excited to announce our latest update! This is exactly what you've been waiting for.\n\nOur team has been working hard to bring you innovative solutions that will transform your workflow.\n\nClick below to learn more and get started today!\n\nBest regards,\nThe Team`)}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg p-3 text-left transition-all"
                  >
                    <Zap className="w-5 h-5 mb-2" />
                    <p className="text-sm font-medium">Generate Content</p>
                    <p className="text-xs text-indigo-100 mt-1">AI writes email copy</p>
                  </button>
                  <button
                    type="button"
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg p-3 text-left transition-all"
                  >
                    <Target className="w-5 h-5 mb-2" />
                    <p className="text-sm font-medium">Optimize Subject</p>
                    <p className="text-xs text-indigo-100 mt-1">Improve open rates</p>
                  </button>
                  <button
                    type="button"
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg p-3 text-left transition-all"
                  >
                    <TrendingUp className="w-5 h-5 mb-2" />
                    <p className="text-sm font-medium">A/B Test</p>
                    <p className="text-xs text-indigo-100 mt-1">Create variations</p>
                  </button>
                </div>
              </div>

              {/* Email Content Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Content
                </label>
                <textarea
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your email content here, or use AI to generate it..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-4">
                <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-purple-500 transition-colors text-left" onClick={() => setShowButtonModal(true)}>
                  <Plus className="w-5 h-5 text-purple-600 mb-2" />
                  <p className="text-sm font-medium text-gray-900">Add Button</p>
                  <p className="text-xs text-gray-600">Call-to-action button</p>
                </button>
                <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-purple-500 transition-colors text-left" onClick={() => setShowImageModal(true)}>
                  <Plus className="w-5 h-5 text-purple-600 mb-2" />
                  <p className="text-sm font-medium text-gray-900">Add Image</p>
                  <p className="text-xs text-gray-600">Upload or select image</p>
                </button>
                <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-purple-500 transition-colors text-left" onClick={handleAddDivider}>
                  <Plus className="w-5 h-5 text-purple-600 mb-2" />
                  <p className="text-sm font-medium text-gray-900">Add Divider</p>
                  <p className="text-xs text-gray-600">Horizontal line</p>
                </button>
              </div>
            </div>
          )}

          {activeBuilderTab === 'html' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HTML Source Code
              </label>
              <textarea
                rows={20}
                value={previewHTML || generatePreview()}
                onChange={(e) => setPreviewHTML(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter HTML code..."
              />
            </div>
          )}

          {activeBuilderTab === 'preview' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <Eye className="w-4 h-4" />
                  <p>This is how your email will appear to recipients</p>
                </div>
              </div>
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                <div className="border-b border-gray-300 bg-gray-50 px-4 py-3">
                  <p className="text-xs text-gray-600">From: marketing@company.com</p>
                  <p className="text-xs text-gray-600 mt-1">To: {campaign.audience}</p>
                  <p className="text-xs font-medium text-gray-900 mt-1">Subject: {campaign.subject || 'Your subject line'}</p>
                </div>
                <div 
                  className="bg-white" 
                  dangerouslySetInnerHTML={{ __html: generatePreview() }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <Button type="button" variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Save as Draft
          </Button>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setActiveBuilderTab('preview')}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button 
              type="button" 
              className="bg-purple-600 hover:bg-purple-700 text-white" 
              onClick={handleSaveCampaign}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Save & Launch Campaign
            </Button>
          </div>
        </div>
      </div>

      {/* Add Button Modal */}
      {showButtonModal && <AddButtonModal onClose={() => setShowButtonModal(false)} onAdd={handleAddButton} />}

      {/* Add Image Modal */}
      {showImageModal && <AddImageModal onClose={() => setShowImageModal(false)} onAdd={handleAddImage} />}
    </div>
  );
}

// Add Button Modal Component
function AddButtonModal({ onClose, onAdd }: { onClose: () => void, onAdd: (text: string, url: string, color: string) => void }) {
  const [buttonText, setButtonText] = useState('Click Here');
  const [buttonUrl, setButtonUrl] = useState('https://');
  const [buttonColor, setButtonColor] = useState('#9333ea');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Add Call-to-Action Button</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
            <input
              type="text"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Get Started, Learn More"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Button URL</label>
            <input
              type="url"
              value={buttonUrl}
              onChange={(e) => setButtonUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Button Color</label>
            <div className="flex gap-3">
              {['#9333ea', '#2563eb', '#059669', '#ea580c', '#dc2626'].map((color) => (
                <button
                  key={color}
                  onClick={() => setButtonColor(color)}
                  className={`w-10 h-10 rounded-lg border-2 ${buttonColor === color ? 'border-gray-900' : 'border-gray-300'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div className="pt-4">
            <div 
              className="w-full py-3 text-center rounded-lg font-medium text-white"
              style={{ backgroundColor: buttonColor }}
            >
              {buttonText}
            </div>
          </div>
        </div>
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            type="button" 
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => onAdd(buttonText, buttonUrl, buttonColor)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Button
          </Button>
        </div>
      </div>
    </div>
  );
}

// Add Image Modal Component
function AddImageModal({ onClose, onAdd }: { onClose: () => void, onAdd: (url: string, alt: string) => void }) {
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');

  const stockImages = [
    { url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600', alt: 'Business team collaboration' },
    { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600', alt: 'Team meeting' },
    { url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600', alt: 'Product showcase' },
    { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600', alt: 'Analytics dashboard' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Add Image</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text (for accessibility)</label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Describe the image"
            />
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Or select from stock images:</p>
            <div className="grid grid-cols-2 gap-3">
              {stockImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setImageUrl(img.url);
                    setAltText(img.alt);
                  }}
                  className="relative group overflow-hidden rounded-lg border-2 border-gray-300 hover:border-purple-500 transition-colors"
                >
                  <img src={img.url} alt={img.alt} className="w-full h-32 object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                    <Plus className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {imageUrl && (
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <img src={imageUrl} alt={altText} className="w-full rounded-lg border border-gray-300" />
            </div>
          )}
        </div>
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            type="button" 
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => onAdd(imageUrl, altText)}
            disabled={!imageUrl}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Image
          </Button>
        </div>
      </div>
    </div>
  );
}