// =====================================================
// SENTRY CONFIGURATION - Error Tracking
// =====================================================

import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

export function initializeSentry() {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      integrations: [
        new BrowserTracing(),
        new (Sentry as any).Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      
      // Performance Monitoring
      tracesSampleRate: 1.0, // Capture 100% of transactions in production
      
      // Session Replay
      replaysSessionSampleRate: 0.1, // 10% of sessions
      replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
      
      // Environment
      environment: process.env.NODE_ENV,
      
      // Release Tracking
      release: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
      
      // Ignore certain errors
      ignoreErrors: [
        // Browser extensions
        'top.GLOBALS',
        // Random plugins/extensions
        'originalCreateNotification',
        'canvas.contentDocument',
        'MyApp_RemoveAllHighlights',
        // Network errors
        'NetworkError',
        'Network request failed',
      ],
      
      // Scrub sensitive data
      beforeSend(event, hint) {
        // Remove sensitive data from events
        if (event.request) {
          delete event.request.cookies;
          delete event.request.headers?.['Authorization'];
        }
        
        // Remove PII from breadcrumbs
        if (event.breadcrumbs) {
          event.breadcrumbs = event.breadcrumbs.map(breadcrumb => {
            if (breadcrumb.data) {
              delete breadcrumb.data.email;
              delete breadcrumb.data.phone;
              delete breadcrumb.data.password;
            }
            return breadcrumb;
          });
        }
        
        return event;
      },
    });
  }
}

// Set user context when available
export function setSentryUser(user: {
  id: string;
  email: string;
  organizationId: string;
}) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      organizationId: user.organizationId,
    });
  }
}

// Clear user context on logout
export function clearSentryUser() {
  if (process.env.NODE_ENV === 'production') {
    Sentry.setUser(null);
  }
}

// =====================================================
// PERFORMANCE MONITORING
// =====================================================

export function trackPerformance(metricName: string, duration: number, metadata?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    (Sentry.metrics as any).distribution(metricName, duration, {
      tags: metadata,
      unit: 'millisecond',
    });
  }
}

// Usage example:
// const start = Date.now();
// await someOperation();
// trackPerformance('file_upload_duration', Date.now() - start, { fileSize: '5MB' });

// =====================================================
// CUSTOM ERROR TRACKING
// =====================================================

export function trackError(error: Error, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      contexts: {
        custom: context,
      },
    });
  } else {
    console.error('Error:', error, 'Context:', context);
  }
}

// =====================================================
// WEB VITALS TRACKING
// =====================================================

export function trackWebVitals() {
  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      const handleMetric = (name: string, metric: any) => {
        Sentry.addBreadcrumb({
          category: 'web-vitals',
          message: `${name}: ${metric.value}`,
          level: 'info',
          data: {
            id: metric.id,
            value: metric.value,
            rating: metric.rating,
          },
        });
      };

      onCLS((metric: any) => handleMetric('CLS', metric));
      onINP((metric: any) => handleMetric('INP', metric));
      onFCP((metric: any) => handleMetric('FCP', metric));
      onLCP((metric: any) => handleMetric('LCP', metric));
      onTTFB((metric: any) => handleMetric('TTFB', metric));
    }).catch((err) => {
      console.error('Failed to load web-vitals', err);
    });
  }
}

function getVitalScore(rating: 'good' | 'needs-improvement' | 'poor'): string {
  return rating;
}

// =====================================================
// CUSTOM INSTRUMENTATION
// =====================================================

export function trackUserAction(action: string, properties?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.addBreadcrumb({
      category: 'user-action',
      message: action,
      level: 'info',
      data: properties,
    });
  }
}

// Usage:
// trackUserAction('file_uploaded', { module: 'grow_accounting', size: '5MB' });
// trackUserAction('workpaper_created', { jobId: 'JOB-001', client: 'ABC Pty Ltd' });

// =====================================================
// TRANSACTION MONITORING
// =====================================================

export async function monitorTransaction<T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(error, {
        tags: { transaction: name }
      });
    }
    throw error;
  }
}

// Usage:
// await monitorTransaction('process_payment', async () => {
//   return await processPayment(paymentData);
// });
