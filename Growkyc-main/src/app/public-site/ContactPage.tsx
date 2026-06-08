import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import {
  ContactFormData,
  validateContactForm,
  isContactFormValid,
  submitContactForm
} from '../services/publicContactService';

const INITIAL: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  subject: '',
  message: ''
};

export function ContactPage() {
  const [form, setForm] = useState<ContactFormData>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ referenceId?: string } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [recaptchaChecked, setRecaptchaChecked] = useState(false);

  const update = (field: keyof ContactFormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) {
      const next = validateContactForm({ ...form, [field]: value }) as Record<string, string | undefined>;
      setErrors((e) => {
        const copy = { ...e };
        if (!next[field]) delete copy[field];
        else copy[field] = next[field]!;
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitError(null);
    const validation = validateContactForm(form);
    const mapped = Object.fromEntries(
      Object.entries(validation).filter(([, v]) => v)
    ) as Record<string, string>;
    setErrors(mapped);
    if (!isContactFormValid(validation)) return;
    if (!recaptchaChecked) {
      setSubmitError('Please confirm you are not a robot.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitContactForm({ ...form, recaptchaToken: 'demo-token' });
      if (result.success) {
        setSuccess({ referenceId: result.referenceId });
        setForm(INITIAL);
        setRecaptchaChecked(false);
        toast.success('Message sent successfully');
      } else {
        setSubmitError('Unable to send your message. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
      toast.error('Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="py-16 sm:py-24 px-4">
        <div className="max-w-lg mx-auto text-center bg-white rounded-2xl border border-green-200 p-10 shadow-lg">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank you for contacting us</h1>
          <p className="text-gray-600 mb-4">We have received your message and will respond within one business day.</p>
          {success.referenceId && (
            <p className="text-sm text-gray-500 font-mono bg-gray-50 rounded-lg py-2 px-3 inline-block">
              Reference: {success.referenceId}
            </p>
          )}
          <Button className="mt-8" variant="outline" onClick={() => setSuccess(null)}>
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Contact us</h1>
          <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
            Speak with our team about compliance, onboarding, or enterprise deployment.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">Get in touch</h2>
              <ul className="space-y-4 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span>hello@growplatform.com.au</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span>1300 GROW AML (1300 476 926)</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Level 12, 100 Collins Street<br />Melbourne VIC 3000</span>
                </li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-sm text-blue-900">
              <Shield className="w-5 h-5 mb-2" />
              Enterprise enquiries receive a dedicated solutions architect within 24 hours.
            </div>
          </div>

          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-lg space-y-5"
              noValidate
            >
              {submitError && (
                <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm" role="alert">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {submitError}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Name" required error={errors.name}>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    className={inputClass(errors.name)}
                    maxLength={120}
                    aria-invalid={!!errors.name}
                  />
                </Field>
                <Field label="Email" required error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    className={inputClass(errors.email)}
                    aria-invalid={!!errors.email}
                  />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Phone" error={errors.phone}>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className={inputClass(errors.phone)}
                    maxLength={30}
                  />
                </Field>
                <Field label="Company" required error={errors.company}>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => update('company', e.target.value)}
                    className={inputClass(errors.company)}
                    maxLength={120}
                  />
                </Field>
              </div>

              <Field label="Subject" required error={errors.subject}>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => update('subject', e.target.value)}
                  className={inputClass(errors.subject)}
                  maxLength={200}
                />
              </Field>

              <Field label="Message" required error={errors.message}>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  className={inputClass(errors.message)}
                  maxLength={5000}
                />
                <p className="text-xs text-gray-500 mt-1 text-right">{form.message.length}/5000</p>
              </Field>

              <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recaptchaChecked}
                    onChange={(e) => setRecaptchaChecked(e.target.checked)}
                    className="mt-1 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium">reCAPTCHA</span> — I confirm I am not a robot.
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function inputClass(error?: string) {
  return `w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    error ? 'border-red-400' : 'border-gray-300'
  }`;
}
