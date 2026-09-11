import { Profile } from "@/lib/types";

/**
 * Default credentials for local/offline authentication.
 * When Supabase is not available, the system accepts these credentials.
 */
export const DEFAULT_CREDENTIALS = {
  username: "admin",
  password: "admin",
} as const;

/**
 * Returns a default local profile for offline operation.
 * Used when Supabase is not connected and the user authenticates
 * with DEFAULT_CREDENTIALS.
 */
export function getDefaultProfile(username?: string): Profile {
  const name = username || "admin";
  return {
    id: `default-${name}`,
    org_id: "default-org-1",
    username: name,
    email: `${name}@elevate.local`,
    full_name: name === "admin" ? "Administrador" : name.replace(".", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    avatar_url: null,
    role: "super_admin",
    department_id: "default-dept-tech",
    job_title: "Super Administrador",
    phone: "+52 55 0000 0000",
    hire_date: "2026-01-01",
    is_active: true,
    settings_json: {
      theme: "dark",
      notifications_enabled: true,
      language: "es",
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Checks if a user ID represents a default/local profile (not from Supabase).
 */
export function isDefaultProfile(userId: string): boolean {
  return userId.startsWith("default-");
}
