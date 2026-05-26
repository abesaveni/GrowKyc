import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { PEXAService } from "./pexa_service.tsx";
import {
  authenticateRequest,
  hasPermission,
  checkRateLimit,
  logAudit,
  logSecurityEvent,
  validateFileUpload,
  sanitizeString,
  isValidUUID,
  unauthorized,
  forbidden,
  badRequest,
  rateLimitExceeded,
  internalError,
  type AuthenticatedUser
} from "./auth.tsx";

const app = new Hono();

// Initialize Supabase client with service role for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Storage bucket name
const STORAGE_BUCKET = 'make-b186a255-documents';

// Initialize storage bucket on startup
async function initializeStorage() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKET);
    
    if (!bucketExists) {
      console.log(`Creating storage bucket: ${STORAGE_BUCKET}`);
      const { data, error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
        public: false,
        fileSizeLimit: 52428800, // 50MB limit
      });
      
      if (error) {
        console.error('Error creating bucket:', error);
      } else {
        console.log('Storage bucket created successfully');
      }
    } else {
      console.log('Storage bucket already exists');
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}

// Initialize storage on startup
initializeStorage();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS - PRODUCTION: Replace with specific origins
app.use(
  "/*",
  cors({
    origin: "*", // TODO: Replace with actual domain(s) in production
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ==================== MIDDLEWARE ====================

// Authentication middleware
async function authMiddleware(c: any, next: any) {
  const authResult = await authenticateRequest(c.req.raw, supabase);
  
  if (!authResult.success) {
    return unauthorized(authResult.error);
  }
  
  // Attach user to context
  c.set('user', authResult.user);
  await next();
}

// Rate limiting middleware
async function rateLimitMiddleware(c: any, next: any) {
  const user = c.get('user') as AuthenticatedUser;
  const identifier = user?.id || c.req.header('x-forwarded-for') || 'unknown';
  
  const rateLimit = await checkRateLimit(identifier, {
    windowMs: 60000, // 1 minute
    maxRequests: 100 // 100 requests per minute
  });
  
  if (!rateLimit.allowed) {
    await logSecurityEvent(supabase, {
      userId: user?.id,
      organizationId: user?.organizationId,
      eventType: 'rate_limit_exceeded',
      severity: 'medium',
      ip: c.req.header('x-forwarded-for'),
      metadata: { endpoint: c.req.path }
    });
    return rateLimitExceeded(rateLimit.resetAt);
  }
  
  // Add rate limit headers
  c.header('X-RateLimit-Limit', '100');
  c.header('X-RateLimit-Remaining', rateLimit.remaining.toString());
  c.header('X-RateLimit-Reset', new Date(rateLimit.resetAt).toISOString());
  
  await next();
}

// ==================== PUBLIC ENDPOINTS ====================

// Health check endpoint (no auth required)
app.get("/make-server-b186a255/health", (c) => {
  return c.json({ 
    status: "ok", 
    storage: STORAGE_BUCKET,
    timestamp: new Date().toISOString()
  });
});

// ==================== SECURED ENDPOINTS ====================

// Upload file endpoint with security
app.post("/make-server-b186a255/files/upload", async (c) => {
  try {
    // Authenticate user
    const user = c.get('user') as AuthenticatedUser;
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'general';
    const module = formData.get('module') as string || 'default';
    const metadata = formData.get('metadata') as string;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Security checks
    const validation = validateFileUpload(file);
    if (!validation.success) {
      await logSecurityEvent(supabase, {
        userId: user.id,
        organizationId: user.organizationId,
        eventType: 'file_upload_rejected',
        severity: validation.severity,
        ip: c.req.header('x-forwarded-for'),
        metadata: { file: file.name, type: file.type, size: file.size }
      });
      return c.json({ error: validation.error }, validation.statusCode);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${user.organizationId}/${module}/${folder}/${timestamp}_${sanitizedName}`;
    
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, uint8Array, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      await logSecurityEvent(supabase, {
        userId: user.id,
        organizationId: user.organizationId,
        eventType: 'file_upload_failed',
        severity: 'medium',
        ip: c.req.header('x-forwarded-for'),
        metadata: { file: file.name, type: file.type, size: file.size, error: error.message }
      });
      return c.json({ error: `Upload failed: ${error.message}` }, 500);
    }

    // Store file metadata
    const fileMetadata = {
      id: `file_${timestamp}`,
      path: filePath,
      name: file.name,
      size: file.size,
      type: file.type,
      organizationId: user.organizationId,
      module,
      folder,
      uploadedBy: user.id,
      uploadedAt: new Date().toISOString(),
      scanStatus: 'pending', // TODO: Implement virus scanning
      ...(metadata ? JSON.parse(metadata) : {})
    };
    
    await kv.set(`file_meta:${filePath}`, fileMetadata);

    // Audit log
    await logAudit(supabase, {
      userId: user.id,
      organizationId: user.organizationId,
      action: 'FILE_UPLOAD',
      resourceType: 'file',
      resourceId: filePath,
      ipAddress: c.req.header('X-Forwarded-For'),
      userAgent: c.req.header('User-Agent'),
      newValues: fileMetadata
    });

    return c.json({
      success: true,
      file: fileMetadata
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: `Upload failed: ${error.message}` }, 500);
  }
});

// Download file endpoint with authentication
app.get("/make-server-b186a255/files/download/:path{.+}", async (c) => {
  try {
    // Authenticate user
    const user = c.get('user') as AuthenticatedUser;
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const filePath = c.req.param('path');
    
    if (!filePath) {
      return c.json({ error: 'File path required' }, 400);
    }

    // Verify file belongs to user's organization
    if (!filePath.startsWith(user.organizationId)) {
      await logSecurityEvent(supabase, {
        userId: user.id,
        organizationId: user.organizationId,
        eventType: 'unauthorized_access',
        severity: 'high',
        ip: c.req.header('x-forwarded-for'),
        metadata: { file: filePath }
      });
      return c.json({ error: 'Access denied' }, 403);
    }

    // Generate signed URL
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(filePath, 3600);

    if (error) {
      console.error('Download error:', error);
      return c.json({ error: `Download failed: ${error.message}` }, 500);
    }

    // Audit log
    await logAudit(
      user.id,
      user.organizationId,
      'FILE_DOWNLOAD',
      'file',
      filePath,
      c.req.header('X-Forwarded-For'),
      c.req.header('User-Agent')
    );

    return c.json({
      success: true,
      signedUrl: data.signedUrl,
      expiresIn: 3600
    });
    
  } catch (error) {
    console.error('Download error:', error);
    return c.json({ error: `Download failed: ${error.message}` }, 500);
  }
});

// List files endpoint with organization filtering
app.get("/make-server-b186a255/files/list", async (c) => {
  try {
    // Authenticate user
    const user = c.get('user') as AuthenticatedUser;
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const folder = c.req.query('folder') || '';
    const module = c.req.query('module') || '';
    
    // Always scope to user's organization
    const path = `${user.organizationId}/${module}/${folder}`;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(path, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error('List error:', error);
      return c.json({ error: `List failed: ${error.message}` }, 500);
    }

    // Fetch metadata for each file
    const filesWithMetadata = await Promise.all(
      (data || []).map(async (file) => {
        const fullPath = `${path}/${file.name}`;
        const metadata = await kv.get(`file_meta:${fullPath}`);
        return {
          ...file,
          path: fullPath,
          metadata: metadata || {}
        };
      })
    );

    return c.json({
      success: true,
      files: filesWithMetadata,
      count: filesWithMetadata.length
    });
    
  } catch (error) {
    console.error('List error:', error);
    return c.json({ error: `List failed: ${error.message}` }, 500);
  }
});

// Delete file endpoint with authorization
app.delete("/make-server-b186a255/files/delete/:path{.+}", async (c) => {
  try {
    // Authenticate user
    const user = c.get('user') as AuthenticatedUser;
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const filePath = c.req.param('path');
    
    if (!filePath) {
      return c.json({ error: 'File path required' }, 400);
    }

    // Verify file belongs to user's organization
    if (!filePath.startsWith(user.organizationId)) {
      await logSecurityEvent(supabase, {
        userId: user.id,
        organizationId: user.organizationId,
        eventType: 'unauthorized_access',
        severity: 'high',
        ip: c.req.header('x-forwarded-for'),
        metadata: { file: filePath }
      });
      return c.json({ error: 'Access denied' }, 403);
    }

    // Get file metadata before deletion
    const oldMetadata = await kv.get(`file_meta:${filePath}`);

    // Delete from storage
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return c.json({ error: `Delete failed: ${error.message}` }, 500);
    }

    // Delete metadata
    await kv.del(`file_meta:${filePath}`);

    // Audit log
    await logAudit(
      user.id,
      user.organizationId,
      'FILE_DELETE',
      'file',
      filePath,
      c.req.header('X-Forwarded-For'),
      c.req.header('User-Agent'),
      oldMetadata,
      null
    );

    return c.json({
      success: true,
      message: 'File deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete error:', error);
    return c.json({ error: `Delete failed: ${error.message}` }, 500);
  }
});

// ==================== AUDIT LOG ENDPOINTS ====================

// Get audit logs for organization
app.get("/make-server-b186a255/audit/logs", async (c) => {
  try {
    // Authenticate user
    const user = c.get('user') as AuthenticatedUser;
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    // Check permission
    if (!hasPermission(user, 'admin.audit.view')) {
      return forbidden('Insufficient permissions');
    }

    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');
    const action = c.req.query('action');

    // Get audit logs from KV store
    const allLogs = await kv.getByPrefix('audit:');
    
    // Filter by organization and action
    let filteredLogs = allLogs.filter((log: any) => 
      log.organizationId === user.organizationId
    );

    if (action) {
      filteredLogs = filteredLogs.filter((log: any) => log.action === action);
    }

    // Sort by timestamp descending
    filteredLogs.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Paginate
    const paginatedLogs = filteredLogs.slice(offset, offset + limit);

    return c.json({
      success: true,
      logs: paginatedLogs,
      total: filteredLogs.length,
      limit,
      offset
    });
    
  } catch (error) {
    console.error('Audit log error:', error);
    return c.json({ error: `Failed to fetch audit logs: ${error.message}` }, 500);
  }
});

// Get security events
app.get("/make-server-b186a255/security/events", async (c) => {
  try {
    // Authenticate user
    const user = c.get('user') as AuthenticatedUser;
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    // Check permission
    if (!hasPermission(user, 'admin.audit.view')) {
      return forbidden('Insufficient permissions');
    }

    const severity = c.req.query('severity');
    
    // Get security events from KV store
    const allEvents = await kv.getByPrefix('security_event:');
    
    // Filter by organization and severity
    let filteredEvents = allEvents.filter((event: any) => 
      !event.organizationId || event.organizationId === user.organizationId
    );

    if (severity) {
      filteredEvents = filteredEvents.filter((event: any) => event.severity === severity);
    }

    // Sort by timestamp descending
    filteredEvents.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return c.json({
      success: true,
      events: filteredEvents,
      total: filteredEvents.length
    });
    
  } catch (error) {
    console.error('Security events error:', error);
    return c.json({ error: `Failed to fetch security events: ${error.message}` }, 500);
  }
});

// ==================== USER & ORGANIZATION ENDPOINTS ====================

// Get current user profile
app.get("/make-server-b186a255/auth/profile", async (c) => {
  try {
    const user = c.get('user') as AuthenticatedUser;
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    // Fetch full profile
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*, organizations(*)')
      .eq('id', user.id)
      .single();

    if (error) {
      return c.json({ error: `Failed to fetch profile: ${error.message}` }, 500);
    }

    return c.json({
      success: true,
      profile
    });
    
  } catch (error) {
    console.error('Profile error:', error);
    return c.json({ error: `Failed to fetch profile: ${error.message}` }, 500);
  }
});

// Update user profile
app.put("/make-server-b186a255/auth/profile", async (c) => {
  try {
    const user = c.get('user') as AuthenticatedUser;
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const body = await c.req.json();
    const { firstName, lastName, phone } = body;

    // Get old values for audit
    const { data: oldProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Update profile
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      return c.json({ error: `Update failed: ${error.message}` }, 500);
    }

    // Audit log
    await logAudit(
      user.id,
      user.organizationId,
      'PROFILE_UPDATE',
      'user_profile',
      user.id,
      c.req.header('X-Forwarded-For'),
      c.req.header('User-Agent'),
      oldProfile,
      profile
    );

    return c.json({
      success: true,
      profile
    });
    
  } catch (error) {
    console.error('Profile update error:', error);
    return c.json({ error: `Update failed: ${error.message}` }, 500);
  }
});

// Get organization details
app.get("/make-server-b186a255/organization", async (c) => {
  try {
    const user = c.get('user') as AuthenticatedUser;
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const { data: organization, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', user.organizationId)
      .single();

    if (error) {
      return c.json({ error: `Failed to fetch organization: ${error.message}` }, 500);
    }

    return c.json({
      success: true,
      organization
    });
    
  } catch (error) {
    console.error('Organization error:', error);
    return c.json({ error: `Failed to fetch organization: ${error.message}` }, 500);
  }
});

// ==================== DATA EXPORT (GDPR COMPLIANCE) ====================

app.post("/make-server-b186a255/gdpr/export-data", async (c) => {
  try {
    const user = c.get('user') as AuthenticatedUser;
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    // Get user's profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Get user's files
    const files = await kv.getByPrefix(`file_meta:${user.organizationId}`);
    const userFiles = files.filter((f: any) => f.uploadedBy === user.id);

    // Get user's audit logs
    const auditLogs = await kv.getByPrefix('audit:');
    const userAuditLogs = auditLogs
      .filter((log: any) => log.userId === user.id)
      .slice(0, 1000); // Limit to last 1000 entries

    const exportData = {
      profile,
      files: userFiles,
      auditLogs: userAuditLogs,
      exportedAt: new Date().toISOString(),
      exportedBy: user.email
    };

    // Audit log
    await logAudit(
      user.id,
      user.organizationId,
      'DATA_EXPORT_REQUEST',
      'gdpr',
      null,
      c.req.header('X-Forwarded-For'),
      c.req.header('User-Agent')
    );

    return c.json({
      success: true,
      data: exportData,
      message: 'Your data has been exported'
    });
    
  } catch (error) {
    console.error('Data export error:', error);
    return c.json({ error: `Export failed: ${error.message}` }, 500);
  }
});

// Request account deletion
app.post("/make-server-b186a255/gdpr/delete-account", async (c) => {
  try {
    const user = c.get('user') as AuthenticatedUser;
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const body = await c.req.json();
    const { reason } = body;

    // Create deletion request
    const deletionRequest = {
      id: `deletion_${Date.now()}`,
      userId: user.id,
      organizationId: user.organizationId,
      requestType: 'account_deletion',
      reason,
      status: 'pending',
      scheduledDeletionAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      createdAt: new Date().toISOString()
    };

    await kv.set(`deletion_request:${deletionRequest.id}`, deletionRequest);

    // Log security event
    await logSecurityEvent(supabase, {
      userId: user.id,
      organizationId: user.organizationId,
      eventType: 'account_deletion_requested',
      severity: 'medium',
      ip: c.req.header('x-forwarded-for'),
      metadata: { reason }
    });

    // Audit log
    await logAudit(
      user.id,
      user.organizationId,
      'DELETION_REQUEST',
      'gdpr',
      deletionRequest.id,
      c.req.header('X-Forwarded-For'),
      c.req.header('User-Agent')
    );

    return c.json({
      success: true,
      message: 'Account deletion scheduled for 30 days from now. You can cancel within this period.',
      scheduledDate: deletionRequest.scheduledDeletionAt
    });
    
  } catch (error) {
    console.error('Deletion request error:', error);
    return c.json({ error: `Request failed: ${error.message}` }, 500);
  }
});

// ==================== ERROR HANDLING ====================

app.onError((err, c) => {
  console.error('Server error:', err);
  
  // Log critical errors
  logSecurityEvent(supabase, {
    userId: null,
    organizationId: null,
    eventType: 'server_error',
    severity: 'high',
    ip: c.req.header('x-forwarded-for'),
    metadata: { error: err.message }
  });

  return c.json({
    error: 'Internal server error',
    message: 'An unexpected error occurred. Please try again later.',
  }, 500);
});

// ==================== START SERVER ====================

Deno.serve(app.fetch);