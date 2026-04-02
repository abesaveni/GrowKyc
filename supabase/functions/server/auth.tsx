import { createClient } from "npm:@supabase/supabase-js@2";
import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

// =====================================================
// AUTHENTICATION & AUTHORIZATION UTILITIES
// =====================================================

export interface AuthenticatedUser {
  id: string;
  email: string;
  organizationId: string;
  role: string;
  permissions: string[];
  moduleRoles: Record<string, string>;
}

export interface AuthResult {
  success: boolean;
  user?: AuthenticatedUser;
  error?: string;
}

/**
 * Extract and validate JWT token from Authorization header
 */
export function extractToken(request: Request): string | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Authenticate user from JWT token
 */
export async function authenticateRequest(
  request: Request,
  supabase: SupabaseClient
): Promise<AuthResult> {
  try {
    const token = extractToken(request);
    if (!token) {
      return { success: false, error: "No authentication token provided" };
    }

    // Verify token with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      await logSecurityEvent(supabase, {
        eventType: 'failed_authentication',
        severity: 'medium',
        ip: request.headers.get("x-forwarded-for") || 'unknown',
        metadata: { error: authError?.message }
      });
      return { success: false, error: "Invalid or expired token" };
    }

    // Fetch user profile with organization details
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("organization_id, role, permissions, module_roles, status")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return { success: false, error: "User profile not found" };
    }

    // Check if user is active
    if (profile.status !== 'active') {
      return { success: false, error: `User account is ${profile.status}` };
    }

    // Update last login
    await supabase
      .from("user_profiles")
      .update({
        last_login_at: new Date().toISOString(),
        last_login_ip: request.headers.get("x-forwarded-for") || null
      })
      .eq("id", user.id);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email!,
        organizationId: profile.organization_id,
        role: profile.role,
        permissions: profile.permissions || [],
        moduleRoles: profile.module_roles || {}
      }
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return { success: false, error: "Authentication failed" };
  }
}

/**
 * Check if user has required permission
 */
export function hasPermission(user: AuthenticatedUser, permission: string): boolean {
  // Super admins have all permissions
  if (user.role === 'super_admin') return true;
  
  // Check explicit permissions
  return user.permissions.includes(permission);
}

/**
 * Check if user has required role
 */
export function hasRole(user: AuthenticatedUser, requiredRoles: string[]): boolean {
  return requiredRoles.includes(user.role);
}

/**
 * Check if user has permission in specific module
 */
export function hasModulePermission(
  user: AuthenticatedUser,
  module: string,
  requiredRole: string
): boolean {
  // Super admins have all permissions
  if (user.role === 'super_admin') return true;
  
  // Check module-specific role
  const moduleRole = user.moduleRoles[module];
  return moduleRole === requiredRole || user.role === 'admin';
}

// =====================================================
// RATE LIMITING
// =====================================================

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Check rate limit for user/IP
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { windowMs: 60000, maxRequests: 100 }
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Date.now();
  const limit = rateLimitStore.get(identifier);

  // Clean up expired entries
  if (limit && limit.resetAt < now) {
    rateLimitStore.delete(identifier);
  }

  if (!limit || limit.resetAt < now) {
    // Create new limit window
    const resetAt = now + config.windowMs;
    rateLimitStore.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: config.maxRequests - 1, resetAt };
  }

  // Increment count
  limit.count++;
  rateLimitStore.set(identifier, limit);

  const allowed = limit.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - limit.count);

  return { allowed, remaining, resetAt: limit.resetAt };
}

// =====================================================
// AUDIT LOGGING
// =====================================================

export interface AuditLogEntry {
  organizationId?: string;
  userId?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  module?: string;
  severity?: 'info' | 'warning' | 'error' | 'critical';
  ipAddress?: string;
  userAgent?: string;
  requestUrl?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  metadata?: Record<string, any>;
}

/**
 * Log audit event
 */
export async function logAudit(
  supabase: SupabaseClient,
  entry: AuditLogEntry
): Promise<void> {
  try {
    await supabase.from("audit_logs").insert({
      organization_id: entry.organizationId,
      user_id: entry.userId,
      action: entry.action,
      resource_type: entry.resourceType,
      resource_id: entry.resourceId,
      module: entry.module,
      severity: entry.severity || 'info',
      ip_address: entry.ipAddress,
      user_agent: entry.userAgent,
      request_url: entry.requestUrl,
      old_values: entry.oldValues,
      new_values: entry.newValues,
      metadata: entry.metadata
    });
  } catch (error) {
    console.error("Failed to log audit entry:", error);
  }
}

/**
 * Log security event
 */
export async function logSecurityEvent(
  supabase: SupabaseClient,
  event: {
    organizationId?: string;
    userId?: string;
    eventType: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description?: string;
    ip?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
  }
): Promise<void> {
  try {
    await supabase.from("security_events").insert({
      organization_id: event.organizationId,
      user_id: event.userId,
      event_type: event.eventType,
      severity: event.severity,
      description: event.description,
      ip_address: event.ip,
      user_agent: event.userAgent,
      metadata: event.metadata
    });
  } catch (error) {
    console.error("Failed to log security event:", error);
  }
}

// =====================================================
// SESSION MANAGEMENT
// =====================================================

/**
 * Create user session
 */
export async function createSession(
  supabase: SupabaseClient,
  userId: string,
  organizationId: string,
  request: Request,
  expiresInMs: number = 8 * 60 * 60 * 1000 // 8 hours
): Promise<string> {
  const sessionToken = crypto.randomUUID();
  const tokenHash = await hashToken(sessionToken);
  
  await supabase.from("user_sessions").insert({
    user_id: userId,
    organization_id: organizationId,
    token_hash: tokenHash,
    ip_address: request.headers.get("x-forwarded-for"),
    user_agent: request.headers.get("user-agent"),
    expires_at: new Date(Date.now() + expiresInMs).toISOString()
  });

  return sessionToken;
}

/**
 * Validate session
 */
export async function validateSession(
  supabase: SupabaseClient,
  sessionToken: string
): Promise<{ valid: boolean; userId?: string; organizationId?: string }> {
  const tokenHash = await hashToken(sessionToken);
  
  const { data, error } = await supabase
    .from("user_sessions")
    .select("user_id, organization_id, expires_at")
    .eq("token_hash", tokenHash)
    .single();

  if (error || !data) {
    return { valid: false };
  }

  if (new Date(data.expires_at) < new Date()) {
    // Session expired
    await supabase.from("user_sessions").delete().eq("token_hash", tokenHash);
    return { valid: false };
  }

  // Update last activity
  await supabase
    .from("user_sessions")
    .update({ last_activity_at: new Date().toISOString() })
    .eq("token_hash", tokenHash);

  return {
    valid: true,
    userId: data.user_id,
    organizationId: data.organization_id
  };
}

/**
 * Hash token for storage
 */
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// =====================================================
// INPUT VALIDATION & SANITIZATION
// =====================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize string input (prevent XSS)
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate and sanitize file upload
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFileUpload(
  file: File,
  maxSizeMB: number = 50,
  allowedTypes: string[] = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
): FileValidationResult {
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} is not allowed` };
  }

  // Check file name
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.sh', '.ps1', '.dll'];
  if (dangerousExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
    return { valid: false, error: 'Executable files are not allowed' };
  }

  return { valid: true };
}

// =====================================================
// ERROR RESPONSES
// =====================================================

export function unauthorized(message: string = "Unauthorized"): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 401,
    headers: { "Content-Type": "application/json" }
  });
}

export function forbidden(message: string = "Forbidden"): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 403,
    headers: { "Content-Type": "application/json" }
  });
}

export function badRequest(message: string = "Bad Request"): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { "Content-Type": "application/json" }
  });
}

export function rateLimitExceeded(resetAt: number): Response {
  return new Response(
    JSON.stringify({
      error: "Rate limit exceeded",
      resetAt: new Date(resetAt).toISOString()
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": Math.ceil((resetAt - Date.now()) / 1000).toString()
      }
    }
  );
}

export function internalError(message: string = "Internal Server Error"): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 500,
    headers: { "Content-Type": "application/json" }
  });
}
