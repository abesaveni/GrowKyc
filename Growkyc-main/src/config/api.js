/**
 * Centralized API Configuration
 *
 * This file provides the base URL and Supabase constants
 * used throughout the application.
 */

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Helper function to safely read env vars
const getEnvVar = (viteName, legacyName, fallbackValue = "") => {
  // Vite env
  if (
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env[viteName]
  ) {
    return import.meta.env[viteName];
  }

  // Node env
  if (
    typeof process !== "undefined" &&
    process.env &&
    process.env[legacyName]
  ) {
    return process.env[legacyName];
  }

  // Fallback value
  return fallbackValue;
};

// Safe fallback values to prevent app crash
export const SUPABASE_URL = getEnvVar(
  "VITE_SUPABASE_URL",
  "SUPABASE_URL",
  "https://demo.supabase.co"
);

export const SUPABASE_KEY = getEnvVar(
  "VITE_SUPABASE_ANON_KEY",
  "SUPABASE_KEY",
  "demo-anon-key"
);

// Warning only — no crash
if (SUPABASE_URL === "https://demo.supabase.co") {
  console.warn(
    "WARNING: Using fallback Supabase URL. Configure real environment variables."
  );
}

if (SUPABASE_KEY === "demo-anon-key") {
  console.warn(
    "WARNING: Using fallback Supabase key. Configure real environment variables."
  );
}

// Legacy exports for backward compatibility
export const projectId = SUPABASE_URL;
export const publicAnonKey = SUPABASE_KEY;