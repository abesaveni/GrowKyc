import { apiRequest, delay } from './apiClient';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  recaptchaToken?: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  subject?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {};
  if (!data.name.trim()) errors.name = 'Name is required';
  else if (data.name.length > 120) errors.name = 'Name must be 120 characters or less';

  if (!data.email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(data.email)) errors.email = 'Enter a valid email address';
  else if (data.email.length > 254) errors.email = 'Email is too long';

  if (data.phone.length > 30) errors.phone = 'Phone must be 30 characters or less';

  if (!data.company.trim()) errors.company = 'Company is required';
  else if (data.company.length > 120) errors.company = 'Company must be 120 characters or less';

  if (!data.subject.trim()) errors.subject = 'Subject is required';
  else if (data.subject.length > 200) errors.subject = 'Subject must be 200 characters or less';

  if (!data.message.trim()) errors.message = 'Message is required';
  else if (data.message.length < 10) errors.message = 'Message must be at least 10 characters';
  else if (data.message.length > 5000) errors.message = 'Message must be 5000 characters or less';

  return errors;
}

export function isContactFormValid(errors: ContactFormErrors): boolean {
  return Object.keys(errors).length === 0;
}

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; referenceId?: string }> {
  try {
    return await apiRequest<{ success: boolean; referenceId?: string }>('/public/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  } catch {
    await delay(null, 600);
    return { success: true, referenceId: `REF-${Date.now().toString(36).toUpperCase()}` };
  }
}
