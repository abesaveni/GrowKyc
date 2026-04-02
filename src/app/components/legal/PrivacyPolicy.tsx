import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Shield, FileText, AlertCircle } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              This Privacy Policy describes how Grow Platform ("we", "us", or "our") collects, uses, 
              and shares your personal information when you use our services.
            </p>
            <p className="text-gray-700">
              By using our platform, you agree to the collection and use of information in accordance 
              with this policy. We are committed to protecting your privacy and ensuring the security 
              of your personal information.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Section title="1. Information We Collect">
            <Subsection title="Personal Information">
              <p>We collect the following personal information:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Name, email address, and contact information</li>
                <li>Organization details and business information</li>
                <li>Financial data related to your use of specific modules</li>
                <li>Authentication credentials (encrypted)</li>
                <li>Profile information and preferences</li>
              </ul>
            </Subsection>

            <Subsection title="Usage Information">
              <p>We automatically collect information about your use of our platform:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Log data (IP address, browser type, pages visited)</li>
                <li>Device information</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Usage patterns and feature interactions</li>
              </ul>
            </Subsection>

            <Subsection title="File and Document Information">
              <p>When you upload files to our platform:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>File metadata (name, size, type, upload date)</li>
                <li>File contents (encrypted at rest)</li>
                <li>Access logs for compliance and security</li>
              </ul>
            </Subsection>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Provide Services:</strong> Operate and maintain the platform</li>
              <li><strong>Authentication:</strong> Verify your identity and secure your account</li>
              <li><strong>Communication:</strong> Send you updates, security alerts, and support messages</li>
              <li><strong>Improvement:</strong> Analyze usage to improve our services</li>
              <li><strong>Compliance:</strong> Meet legal and regulatory requirements</li>
              <li><strong>Security:</strong> Detect and prevent fraud, abuse, and security incidents</li>
            </ul>
          </Section>

          <Section title="3. Data Storage and Security">
            <Subsection title="Security Measures">
              <p>We implement industry-standard security measures:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>End-to-end encryption for data in transit (TLS/SSL)</li>
                <li>Encryption at rest for sensitive data</li>
                <li>Multi-factor authentication (MFA) support</li>
                <li>Regular security audits and penetration testing</li>
                <li>Access controls and role-based permissions</li>
                <li>Audit logging of all sensitive operations</li>
              </ul>
            </Subsection>

            <Subsection title="Data Location">
              <p>Your data is stored in secure data centers located in:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Primary: Australia (for Australian customers)</li>
                <li>Backup: Geographic redundancy for disaster recovery</li>
                <li>Compliance: Data residency requirements are respected</li>
              </ul>
            </Subsection>
          </Section>

          <Section title="4. Data Sharing and Disclosure">
            <p>We do not sell your personal information. We may share data:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>With Your Consent:</strong> When you explicitly authorize sharing</li>
              <li><strong>Service Providers:</strong> Third-party vendors who assist in operations (hosting, email, analytics)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale</li>
            </ul>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Third-Party Services:</strong> We use Supabase for infrastructure, SendGrid for emails, 
                and Stripe for payments. These providers have their own privacy policies.
              </p>
            </div>
          </Section>

          <Section title="5. Your Rights (GDPR & Australian Privacy Act)">
            <p>You have the following rights regarding your personal data:</p>
            
            <Subsection title="Access and Portability">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
                <li><strong>Data Portability:</strong> Export your data in a machine-readable format</li>
              </ul>
            </Subsection>

            <Subsection title="Correction and Deletion">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Right to Rectification:</strong> Correct inaccurate personal data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your account and data</li>
                <li><strong>Right to Restriction:</strong> Limit how we process your data</li>
              </ul>
            </Subsection>

            <Subsection title="How to Exercise Your Rights">
              <p>To exercise any of these rights, you can:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Use the in-app data export feature (Settings → Privacy → Export Data)</li>
                <li>Request account deletion (Settings → Account → Delete Account)</li>
                <li>Contact us at privacy@growplatform.com</li>
              </ul>
              <p className="mt-2 text-sm text-gray-600">
                We will respond to your request within 30 days.
              </p>
            </Subsection>
          </Section>

          <Section title="6. Data Retention">
            <p>We retain your data for as long as necessary to provide our services and comply with legal obligations:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Active Accounts:</strong> Data retained while account is active</li>
              <li><strong>Closed Accounts:</strong> Data deleted within 30 days of account closure</li>
              <li><strong>Financial Records:</strong> Retained for 7 years (legal requirement)</li>
              <li><strong>Audit Logs:</strong> Retained for 2 years for security purposes</li>
            </ul>
          </Section>

          <Section title="7. Cookies and Tracking">
            <p>We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Essential Cookies:</strong> Required for authentication and security</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences</li>
              <li><strong>Analytics Cookies:</strong> Understand how you use our platform</li>
            </ul>
            <p className="mt-2">You can control cookies through your browser settings.</p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>
              Our services are not intended for individuals under the age of 18. 
              We do not knowingly collect personal information from children. 
              If you believe we have collected information from a child, please contact us immediately.
            </p>
          </Section>

          <Section title="9. International Data Transfers">
            <p>
              If you are located outside Australia, your information may be transferred to and processed in Australia. 
              We ensure appropriate safeguards are in place to protect your data in compliance with GDPR and 
              Australian Privacy Act requirements.
            </p>
          </Section>

          <Section title="10. Changes to This Privacy Policy">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Posting the new policy on this page</li>
              <li>Updating the "Last updated" date</li>
              <li>Sending you an email notification for significant changes</li>
            </ul>
            <p className="mt-2">
              Your continued use of the platform after changes become effective constitutes acceptance of the revised policy.
            </p>
          </Section>

          <Section title="11. Contact Us">
            <p>If you have questions about this Privacy Policy or wish to exercise your rights, contact us:</p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-semibold">Grow Platform Privacy Team</p>
              <p className="text-sm mt-2">Email: privacy@growplatform.com</p>
              <p className="text-sm">Phone: +61 (0)2 XXXX XXXX</p>
              <p className="text-sm">Address: [Your Business Address]</p>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-900">
                <strong>Data Protection Officer:</strong> For GDPR-related inquiries, contact our Data Protection Officer at dpo@growplatform.com
              </p>
            </div>

            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-900">
                <strong>Complaints:</strong> If you believe we have not complied with privacy laws, 
                you can lodge a complaint with the Office of the Australian Information Commissioner (OAIC) 
                or your local data protection authority.
              </p>
            </div>
          </Section>
        </div>

        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Quick Actions</h3>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Export My Data
            </button>
            <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              Manage Cookies
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Contact Privacy Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-gray-700">
        {children}
      </CardContent>
    </Card>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
      <div className="text-gray-700">{children}</div>
    </div>
  );
}
