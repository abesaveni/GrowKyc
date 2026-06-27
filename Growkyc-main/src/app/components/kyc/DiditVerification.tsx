import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  ShieldCheck,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Fingerprint,
  ScanFace,
  FileSearch,
} from 'lucide-react';
import { toast } from '../../lib/toast';
import {
  startVerification,
  getVerification,
  TERMINAL_STATUSES,
  type VerificationKind,
} from '../../services/diditApi';

interface DiditVerificationProps {
  kind?: VerificationKind;
  kycId?: number;
  /** Called whenever the status changes (e.g. to advance an onboarding flow). */
  onResult?: (status: string) => void;
}

function statusVariant(status: string): { label: string; className: string; icon: React.ReactNode } {
  switch (status) {
    case 'Approved':
      return { label: 'Approved', className: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle className="w-4 h-4" /> };
    case 'Declined':
      return { label: 'Declined', className: 'bg-red-100 text-red-800 border-red-200', icon: <XCircle className="w-4 h-4" /> };
    case 'In Review':
      return { label: 'In Review', className: 'bg-amber-100 text-amber-800 border-amber-200', icon: <Clock className="w-4 h-4" /> };
    case 'In Progress':
      return { label: 'In Progress', className: 'bg-blue-100 text-blue-800 border-blue-200', icon: <Loader2 className="w-4 h-4 animate-spin" /> };
    default:
      return { label: status || 'Not Started', className: 'bg-gray-100 text-gray-700 border-gray-200', icon: <Clock className="w-4 h-4" /> };
  }
}

const CHECK_META: { key: string; label: string; icon: React.ReactNode }[] = [
  { key: 'id_verification', label: 'ID Verification', icon: <FileSearch className="w-4 h-4" /> },
  { key: 'liveness', label: 'Liveness', icon: <ScanFace className="w-4 h-4" /> },
  { key: 'face_match', label: 'Face Match', icon: <Fingerprint className="w-4 h-4" /> },
  { key: 'aml', label: 'AML Screening', icon: <ShieldCheck className="w-4 h-4" /> },
];

/**
 * Self-contained card that runs a Didit KYC/AML verification:
 * Start -> opens the Didit hosted page -> auto-polls our backend for the result.
 */
export function DiditVerification({ kind = 'individual', kycId, onResult }: DiditVerificationProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Not Started');
  const [decision, setDecision] = useState<Record<string, any> | null>(null);
  const [starting, setStarting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isTerminal = TERMINAL_STATUSES.includes(status);

  const refresh = useCallback(
    async (manual = false): Promise<string | undefined> => {
      if (!sessionId) return;
      if (manual) setRefreshing(true);
      try {
        const v = await getVerification(sessionId, true);
        setStatus(v.status);
        setDecision(v.decision);
        onResult?.(v.status);
        return v.status;
      } catch {
        if (manual) toast.error('Could not refresh verification status.');
      } finally {
        if (manual) setRefreshing(false);
      }
    },
    [sessionId, onResult]
  );

  // Auto-poll every 5s until a terminal status is reached.
  useEffect(() => {
    if (!sessionId || isTerminal) {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }
    pollRef.current = setInterval(() => {
      refresh().then((s) => {
        if (s && TERMINAL_STATUSES.includes(s) && pollRef.current) {
          clearInterval(pollRef.current);
        }
      });
    }, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [sessionId, isTerminal, refresh]);

  const handleStart = async () => {
    setStarting(true);
    try {
      const r = await startVerification(kind, kycId);
      setSessionId(r.session_id);
      setUrl(r.url);
      setStatus(r.status);
      setDecision(null);
      window.open(r.url, '_blank', 'noopener,noreferrer');
      toast.success('Verification started', 'Complete the steps in the new tab; status updates here automatically.');
    } catch (e: any) {
      if (e?.status === 503) {
        toast.error('Verification unavailable', 'KYC verification (Didit) is not enabled in this environment.');
      } else if (e?.status === 401) {
        toast.error('Please sign in again to start verification.');
      } else {
        toast.error('Could not start verification', 'Please try again in a moment.');
      }
    } finally {
      setStarting(false);
    }
  };

  const sv = statusVariant(status);

  return (
    <Card className="border-blue-100">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <CardTitle>Identity & AML Verification</CardTitle>
          </div>
          <Badge variant="outline" className={`flex items-center gap-1 ${sv.className}`}>
            {sv.icon}
            {sv.label}
          </Badge>
        </div>
        <CardDescription>
          Government ID check, liveness, face match, and sanctions/PEP (AML) screening, powered by Didit.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!sessionId && (
          <Button onClick={handleStart} disabled={starting} className="w-full sm:w-auto">
            {starting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
            Start verification
          </Button>
        )}

        {sessionId && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {url && !isTerminal && (
                <Button asChild variant="outline" size="sm">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open verification page
                  </a>
                </Button>
              )}
              <Button onClick={() => refresh(true)} disabled={refreshing} variant="outline" size="sm">
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Check status
              </Button>
              {!isTerminal && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> auto-updating…
                </span>
              )}
            </div>

            {/* Per-check breakdown once a decision is available */}
            {decision && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CHECK_META.map(({ key, label, icon }) => {
                  const node = decision[key];
                  const checkStatus = node?.status ?? (node ? 'Done' : '—');
                  const ok = String(checkStatus).toLowerCase().includes('approv') || String(checkStatus).toLowerCase() === 'clear';
                  return (
                    <div key={key} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                      <span className="flex items-center gap-2 text-gray-700">
                        {icon}
                        {label}
                      </span>
                      <span className={ok ? 'text-green-700' : 'text-gray-500'}>{checkStatus}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {status === 'Approved' && (
              <div className="flex items-center gap-2 text-green-700 text-sm">
                <CheckCircle className="w-4 h-4" /> Verification approved.
              </div>
            )}
            {status === 'Declined' && (
              <div className="flex items-center gap-2 text-red-700 text-sm">
                <XCircle className="w-4 h-4" /> Verification declined.
              </div>
            )}
            {status === 'In Review' && (
              <div className="flex items-center gap-2 text-amber-700 text-sm">
                <Clock className="w-4 h-4" /> Sent to a compliance officer for manual review.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DiditVerification;
