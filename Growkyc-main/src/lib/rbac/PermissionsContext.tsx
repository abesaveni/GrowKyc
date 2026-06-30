import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiRequest } from '../../app/services/apiClient';
import { useAuth } from '../../context/AuthContext';

/**
 * PermissionsContext
 * ------------------
 * Fetches the current user's role + permission keys from the backend
 * (GET /auth/permissions) — the single source of truth (core/permissions.py) —
 * and exposes them to the UI so navigation, landing pages, and per-action gating
 * all derive from the same matrix the backend enforces.
 */

interface PermissionsState {
  role: string | null;
  roleLabel: string | null;
  permissions: string[];
  loading: boolean;
  has: (permission: string) => boolean;
  hasAny: (permissions: string[]) => boolean;
  reload: () => void;
}

const PermissionsContext = createContext<PermissionsState | undefined>(undefined);

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [roleLabel, setRoleLabel] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const token = sessionStorage.getItem('growkyc_token');
    if (!token) {
      setRole(null);
      setRoleLabel(null);
      setPermissions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await apiRequest<{ role: string; role_label: string; permissions: string[] }>(
        '/auth/permissions'
      );
      setRole(data.role);
      setRoleLabel(data.role_label);
      setPermissions(data.permissions || []);
    } catch {
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload whenever auth state changes (login / logout).
  useEffect(() => {
    load();
  }, [isAuthenticated, load]);

  const has = useCallback((permission: string) => permissions.includes(permission), [permissions]);
  const hasAny = useCallback(
    (perms: string[]) => perms.some(p => permissions.includes(p)),
    [permissions]
  );

  return (
    <PermissionsContext.Provider
      value={{ role, roleLabel, permissions, loading, has, hasAny, reload: load }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

export function usePermissions(): PermissionsState {
  const ctx = useContext(PermissionsContext);
  if (!ctx) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return ctx;
}

/** Conditionally render children only if the user has the given permission. */
export const Can: React.FC<{
  permission?: string;
  anyOf?: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ permission, anyOf, children, fallback = null }) => {
  const { has, hasAny } = usePermissions();
  const allowed = permission ? has(permission) : anyOf ? hasAny(anyOf) : false;
  return <>{allowed ? children : fallback}</>;
};
