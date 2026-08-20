import { Profile, UserRole } from "@/lib/types";

/**
 * Returns true if demo mode is explicitly enabled via environment variable.
 */
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}

/**
 * Demo user definitions for demo mode authentication.
 * Each entry maps a username to a role for demo login.
 */
export const DEMO_USERS: { username: string; email: string; role: UserRole }[] = [
  { username: "admin", email: "admin@elevate.com.mx", role: "admin" },
  { username: "superadmin", email: "superadmin@elevate.com.mx", role: "super_admin" },
  { username: "mariana.silva", email: "mariana.silva@elevate.com.mx", role: "manager" },
  { username: "alejandro.morales", email: "alejandro.morales@elevate.com.mx", role: "hr_manager" },
  { username: "diego.hernandez", email: "diego.hernandez@elevate.com.mx", role: "team_lead" },
  { username: "sofia.valenzuela", email: "sofia.valenzuela@elevate.com.mx", role: "employee" },
  { username: "mario.operador", email: "mario.operador@elevate.com.mx", role: "employee" },
];

/**
 * Returns a demo profile for the given username. Falls back to admin profile.
 * Only call this when isDemoMode() returns true.
 */
export function getDemoProfile(username?: string): Profile {
  const demoUser = DEMO_USERS.find((u) => u.username === username) || DEMO_USERS[0];
  return {
    id: `demo-${demoUser.username}`,
    org_id: "demo-org-1",
    username: demoUser.username,
    email: demoUser.email,
    full_name: demoUser.username === "admin" ? "Administrador Demo" : demoUser.username.replace(".", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    avatar_url: null,
    role: demoUser.role,
    department_id: "demo-dept-tech",
    job_title: "Demo User",
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
 * Default demo profile for backward compatibility.
 * @deprecated Use getDemoProfile(username) instead.
 */
export const DEMO_PROFILE: Profile = getDemoProfile("admin");
