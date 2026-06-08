// src/app/api/cases.ts

/**
 * Utility functions for case workflow actions.
 * These functions call the backend API endpoints. Adjust the URLs
 * to match the actual server routes.
 */

export async function approveCase(caseId: string, data: { notes?: string; notify?: boolean }) {
  const res = await fetch(`/api/cases/${caseId}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Approve request failed');
  return await res.json();
}

export async function rejectCase(caseId: string, data: { reason: string; notes?: string; notify?: boolean }) {
  const res = await fetch(`/api/cases/${caseId}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Reject request failed');
  return await res.json();
}

export async function requestMoreInfo(caseId: string, data: { description: string; notify?: boolean }) {
  const res = await fetch(`/api/cases/${caseId}/request-info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Request info failed');
  return await res.json();
}

export async function flagInvestigation(caseId: string, data: { reason: string; notify?: boolean }) {
  const res = await fetch(`/api/cases/${caseId}/flag-investigation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Flag investigation failed');
  return await res.json();
}

export async function escalateCase(caseId: string, data: { level: string; notes?: string; notify?: boolean }) {
  const res = await fetch(`/api/cases/${caseId}/escalate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Escalate request failed');
  return await res.json();
}

export async function openEdd(caseId: string, data: { details: string }) {
  const res = await fetch(`/api/cases/${caseId}/edd`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Open EDD failed');
  return await res.json();
}

export async function generateEvidencePack(caseId: string) {
  const res = await fetch(`/api/cases/${caseId}/evidence-pack`, {
    method: 'GET',
  });
  if (!res.ok) throw new Error('Generate evidence pack failed');
  // Assuming the endpoint returns a Blob (PDF)
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `evidence-pack-${caseId}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
