export function formatAustralianDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error('value must be a valid date');
  }

  return new Intl.DateTimeFormat('en-AU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatCurrency(value: number, currency = 'AUD'): string {
  if (!Number.isFinite(value)) {
    throw new Error('value must be a finite number');
  }

  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
  }).format(value);
}
