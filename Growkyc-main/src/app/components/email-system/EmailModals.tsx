import React from 'react';
import { Button } from '../ui/button';
import {
  Send,
  Settings,
  Eye,
  Edit,
  Save,
  Code,
  Monitor,
  Smartphone,
} from 'lucide-react';
import { toast } from '../../lib/toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';

interface EmailModalsProps {
  showSettingsModal: boolean;
  setShowSettingsModal: (show: boolean) => void;
  showSendTestModal: boolean;
  setShowSendTestModal: (show: boolean) => void;
  showTemplatePreviewModal: boolean;
  setShowTemplatePreviewModal: (show: boolean) => void;
  showTemplateEditorModal: boolean;
  setShowTemplateEditorModal: (show: boolean) => void;
  selectedTemplate: any;
  previewDevice: 'desktop' | 'mobile';
  setPreviewDevice: (device: 'desktop' | 'mobile') => void;
}

export function EmailModals({
  showSettingsModal,
  setShowSettingsModal,
  showSendTestModal,
  setShowSendTestModal,
  showTemplatePreviewModal,
  setShowTemplatePreviewModal,
  showTemplateEditorModal,
  setShowTemplateEditorModal,
  selectedTemplate,
  previewDevice,
  setPreviewDevice,
}: EmailModalsProps) {
  return (
    <>
      {/* Email Settings Modal */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-400" />
              Email Settings
            </DialogTitle>
            <DialogDescription>
              Configure global email settings and notification preferences
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* SMTP Configuration */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-100">SMTP Configuration</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input id="smtp-host" placeholder="smtp.gmail.com" defaultValue="mail.Grow MIP.com" />
                </div>
                <div>
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input id="smtp-port" placeholder="587" defaultValue="587" />
                </div>
                <div>
                  <Label htmlFor="smtp-user">Username</Label>
                  <Input id="smtp-user" placeholder="noreply@Grow MIP.com" defaultValue="noreply@Grow MIP.com" />
                </div>
                <div>
                  <Label htmlFor="smtp-pass">Password</Label>
                  <Input id="smtp-pass" type="password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" />
                </div>
              </div>
            </div>

            {/* Sender Settings */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-100">Sender Settings</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from-name">From Name</Label>
                  <Input id="from-name" defaultValue="Grow MIP" />
                </div>
                <div>
                  <Label htmlFor="from-email">From Email</Label>
                  <Input id="from-email" defaultValue="noreply@Grow MIP.com" />
                </div>
                <div>
                  <Label htmlFor="reply-to">Reply-To Email</Label>
                  <Input id="reply-to" defaultValue="support@Grow MIP.com" />
                </div>
                <div>
                  <Label htmlFor="bcc-email">BCC Email (Optional)</Label>
                  <Input id="bcc-email" placeholder="archive@Grow MIP.com" />
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-100">Notification Preferences</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Daily Digest Emails</div>
                    <div className="text-xs text-slate-400">Send daily summary emails to all users</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Real-time Notifications</div>
                    <div className="text-xs text-slate-400">Send immediate email for urgent updates</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Marketing Emails</div>
                    <div className="text-xs text-slate-400">Include marketing content in newsletters</div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Email Analytics Tracking</div>
                    <div className="text-xs text-slate-400">Track opens, clicks, and engagement</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettingsModal(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setShowSettingsModal(false);
                toast.success('Email settings saved successfully!');
              }}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Test Email Modal */}
      <Dialog open={showSendTestModal} onOpenChange={setShowSendTestModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-400" />
              Send Test Email
            </DialogTitle>
            <DialogDescription>
              Send a test email to verify your email configuration
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="test-template">Select Template</Label>
              <select id="test-template" className="w-full px-3 py-2 border border-white/10 rounded-lg mt-1">
                <option>Investor Daily Digest</option>
                <option>Lender Daily Report</option>
                <option>Lawyer Daily Briefing</option>
                <option>Case Status Update</option>
              </select>
            </div>
            <div>
              <Label htmlFor="test-email">Recipient Email</Label>
              <Input
                id="test-email"
                type="email"
                placeholder="your.email@example.com"
                defaultValue="admin@Grow MIP.com"
              />
            </div>
            <div>
              <Label htmlFor="test-subject">Subject Line (Optional)</Label>
              <Input id="test-subject" placeholder="Leave blank to use template default" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendTestModal(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setShowSendTestModal(false);
                toast.success('Test email sent successfully! Check your inbox.');
              }}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Test Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Preview Modal */}
      <Dialog open={showTemplatePreviewModal} onOpenChange={setShowTemplatePreviewModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-400" />
                  {selectedTemplate?.name || 'Template Preview'}
                </DialogTitle>
                <DialogDescription>Preview how this template appears to recipients</DialogDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={previewDevice === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewDevice('desktop')}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewDevice === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewDevice('mobile')}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto border rounded-lg bg-white/5 p-4">
            <div
              className={`mx-auto bg-white shadow-lg ${
                previewDevice === 'mobile' ? 'max-w-sm' : 'max-w-3xl'
              }`}
            >
              {/* Mock Email Preview */}
              <div className="border-b border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-slate-100">{selectedTemplate?.name}</h3>
                  <span className="text-xs text-slate-400">February 21, 2026</span>
                </div>
                <p className="text-slate-300">{selectedTemplate?.preview}</p>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-lg text-slate-100 mb-3">Market Updates</h4>
                  <div className="space-y-2">
                    <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">New Property Listing</span>
                        <span className="text-blue-400 font-bold">$2.4M</span>
                      </div>
                      <p className="text-sm text-slate-300 mt-1">123 Main Street, Sydney NSW 2000</p>
                    </div>
                    <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Deal Closed</span>
                        <span className="text-green-400 font-bold">$1.8M</span>
                      </div>
                      <p className="text-sm text-slate-300 mt-1">456 Park Avenue, Melbourne VIC 3000</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg text-slate-100 mb-3">Portfolio Performance</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-slate-100">24</div>
                      <div className="text-sm text-slate-300">Active Cases</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">+12%</div>
                      <div className="text-sm text-slate-300">This Month</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">$12.4M</div>
                      <div className="text-sm text-slate-300">Total Value</div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button className="bg-blue-600 hover:bg-blue-700">View Full Dashboard</Button>
                </div>
              </div>

              <div className="border-t border-white/10 p-6 bg-white/5">
                <p className="text-xs text-slate-400 text-center">
                  Â© 2026 Grow MIP. All rights reserved. | Unsubscribe | Preferences
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTemplatePreviewModal(false)}>
              Close
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setShowTemplatePreviewModal(false);
                setShowTemplateEditorModal(true);
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Editor Modal */}
      <Dialog open={showTemplateEditorModal} onOpenChange={setShowTemplateEditorModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-blue-400" />
              Edit Template: {selectedTemplate?.name}
            </DialogTitle>
            <DialogDescription>Customize the email template content and design</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            {/* Template Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input id="template-name" defaultValue={selectedTemplate?.name} />
              </div>
              <div>
                <Label htmlFor="template-category">Category</Label>
                <select id="template-category" className="w-full px-3 py-2 border border-white/10 rounded-lg">
                  <option>Daily Reports</option>
                  <option>Notifications</option>
                  <option>Onboarding</option>
                  <option>Security</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="subject-line">Subject Line</Label>
              <Input
                id="subject-line"
                placeholder="Your Daily Digest - {{date.today}}"
                defaultValue="Your Daily Digest - {{date.today}}"
              />
            </div>

            <div>
              <Label htmlFor="preview-text">Preview Text</Label>
              <Input
                id="preview-text"
                placeholder="Summary of today's updates and notifications"
                defaultValue={selectedTemplate?.preview}
              />
            </div>

            {/* Email Content Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Email Content</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Code className="w-4 h-4 mr-1" />
                    HTML
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                </div>
              </div>
              <Textarea
                rows={15}
                className="font-mono text-sm"
                defaultValue={`<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1>Hello {{user.name}},</h1>
  
  <p>Here's your daily digest for ${new Date().toLocaleDateString()}:</p>
  
  <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h2>Market Updates</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
  </div>
  
  <a href="https://Grow MIP.com/dashboard" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
    View Dashboard
  </a>
  
  <p style="margin-top: 30px; color: #6b7280; font-size: 12px;">
    Â© 2026 Grow MIP. All rights reserved.
  </p>
</div>`}
              />
            </div>

            {/* Variables Helper */}
            <div className="bg-blue-500/10 rounded-lg border border-blue-500/30 p-4">
              <h4 className="font-semibold text-sm text-slate-100 mb-2">Available Variables</h4>
              <div className="flex flex-wrap gap-2">
                {['{{user.name}}', '{{user.email}}', '{{case.id}}', '{{date.today}}', '{{company.name}}'].map(
                  (variable) => (
                    <code
                      key={variable}
                      className="px-2 py-1 bg-white rounded text-blue-400 font-mono text-xs cursor-pointer hover:bg-blue-500/15"
                      onClick={() => toast.info(`Copied ${variable} to clipboard`)}
                    >
                      {variable}
                    </code>
                  )
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTemplateEditorModal(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowTemplateEditorModal(false);
                setShowTemplatePreviewModal(true);
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setShowTemplateEditorModal(false);
                toast.success('Template saved successfully!');
              }}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

