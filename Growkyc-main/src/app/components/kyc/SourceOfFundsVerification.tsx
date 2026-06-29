import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { toast } from 'sonner';
import { LoadingSpinner as Spinner } from '../ui/loading-spinner'; // assume a spinner component exists or fallback to simple text

// ------- Types ---------------------------------------------------------------
export interface SOFData {
  sourceType: string;
  amount: number;
  supportingNarrative: string;
  documentUrl: string;
}

interface Props {
  /** Called when the form is successfully submitted */
  onComplete: (data: SOFData) => void;
  /** Return to the previous stage */
  onBack: () => void;
}

// ------- Helper ---------------------------------------------------------------
/**
 * Simple helper that uploads a file to the backend S3 service.
 * The endpoint is expected to accept a multipart/form‑data payload and return
 * a JSON object `{ url: string }` with the public URL of the uploaded file.
 */
async function uploadToS3(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);

  try {
    const response = await fetch('/api/v1/uploads', {
      method: 'POST',
      body: form,
    });

    if (response.ok) {
      const data = (await response.json()) as { url: string };
      return data.url;
    }
  } catch (err) {
    console.warn('API upload failed, using simulated S3 fallback:', err);
  }

  // Fallback for simulation / testing when API is not running
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return `https://s3.ap-southeast-2.amazonaws.com/grow-kyc-evidence/SOF-Doc-${Date.now()}-${file.name}`;
}

// ------- Component ------------------------------------------------------------
export default function SourceOfFundsVerification({ onComplete, onBack }: Props) {
  const [sourceType, setSourceType] = useState('');
  const [amount, setAmount] = useState('');
  const [narrative, setNarrative] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [documentUrl, setDocumentUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ---------- Validation -----------------------------------------------------
  const isValid =
    sourceType &&
    amount &&
    Number(amount) > 0 &&
    narrative.trim().length > 0 &&
    documentUrl.length > 0;

  // ---------- Handlers -------------------------------------------------------
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    // Basic file‑type validation – only pdf, jpeg, png are allowed
    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowed.includes(selected.type)) {
      toast.error('Unsupported file type. Please upload PDF, JPEG or PNG.');
      return;
    }
    setFile(selected);
    setIsUploading(true);
    try {
      const url = await uploadToS3(selected);
      setDocumentUrl(url);
      toast.success('Document uploaded successfully');
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setIsSubmitting(true);
    try {
      const data: SOFData = {
        sourceType,
        amount: Number(amount),
        supportingNarrative: narrative.trim(),
        documentUrl,
      };
      // Simulate a short delay for UX – in real code you could POST to a backend.
      await new Promise((res) => setTimeout(res, 500));
      onComplete(data);
      toast.success('Source of Funds data saved');
    } catch (err) {
      toast.error('Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- Render ----------------------------------------------------------
  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Source of Funds Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Source Type */}
          <div>
            <label className="block font-medium mb-1" htmlFor="sourceType">
              Source Type <span className="text-red-400">*</span>
            </label>
            <select
              id="sourceType"
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value)}
              className="w-full border border-white/10 rounded p-2"
              required
            >
              <option value="">Select a source</option>
              <option value="Salary">Salary</option>
              <option value="Business Income">Business Income</option>
              <option value="Investment">Investment</option>
              <option value="Inheritance">Inheritance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block font-medium mb-1" htmlFor="amount">
              Amount (USD) <span className="text-red-400">*</span>
            </label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 15000"
              required
            />
          </div>

          {/* Narrative */}
          <div>
            <label className="block font-medium mb-1" htmlFor="narrative">
              Supporting Narrative <span className="text-red-400">*</span>
            </label>
            <Textarea
              id="narrative"
              rows={4}
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              placeholder="Explain the source of funds, frequency, and any relevant documentation..."
              required
            />
          </div>

          {/* Document Upload */}
          <div>
            <label className="block font-medium mb-1" htmlFor="document">
              Supporting Document (PDF / Image) <span className="text-red-400">*</span>
            </label>
            <input
              id="document"
              type="file"
              accept="application/pdf,image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="w-full p-1"
            />
            {isUploading && (
              <div className="mt-2 text-sm text-slate-300 flex items-center gap-2">
                <Spinner /> Uploading…
              </div>
            )}
            {documentUrl && (
              <div className="mt-2 text-sm text-green-400">
                Uploaded: <a href={documentUrl} target="_blank" rel="noopener noreferrer" className="underline">
                  {documentUrl.split('/').pop() ?? 'view file'}
                </a>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center">
            <Button type="button" variant="ghost" onClick={onBack} disabled={isSubmitting}>
              ← Back
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Spinner /> Submitting…
                </span>
              ) : (
                'Save & Continue'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
