import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo";
import { SYSTEM_PERMISSIONS } from "./constants";

export * from "./constants";

/**
 * Resolves all effective permissions for a user ID (Server-only).
 * Combines role_permissions + user_permission_overrides with precedence:
 *   SuperAdmin bypass → User Deny → User Grant → Role Permission → Default Deny
 */
export async function getEffectivePermissions(userId: string): Promise<string[]> {
  if (isDemoMode()) {
    // Demo admin user has all permissions
    return SYSTEM_PERMISSIONS.map((p) => `${p.resource}:${p.action}`);
  }

  try {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, role_id, role_details:roles(*)")
      .eq("id", userId)
      .single();

    if (!profile) return [];

    // Level 0 SuperAdmin bypasses all checks — grant everything
    if (profile.role === "super_admin" || (profile.role_details as any)?.hierarchy_level === 0) {
      return SYSTEM_PERMISSIONS.map((p) => `${p.resource}:${p.action}`);
    }

    // Build permissions map: role permissions first, then overrides
    const permissionsMap: Record<string, boolean> = {};

    // 1. Role permissions (if role_id exists)
    if (profile.role_id) {
      const { data: rolePerms } = await supabase
        .from("role_permissions")
        .select("permission:permissions(resource, action)")
        .eq("role_id", profile.role_id);

      if (rolePerms) {
        for (const rp of rolePerms) {
          const perm = rp.permission as any;
          if (perm) {
            permissionsMap[`${perm.resource}:${perm.action}`] = true;
          }
        }
      }
    }

    // 2. User permission overrides (higher precedence)
    const { data: overrides } = await supabase
      .from("user_permission_overrides")
      .select("is_granted, permission:permissions(resource, action)")
      .eq("user_id", userId);

    if (overrides) {
      for (const override of overrides) {
        const perm = override.permission as any;
        if (perm) {
          const key = `${perm.resource}:${perm.action}`;
          // Override always wins: deny (false) removes, grant (true) adds
          permissionsMap[key] = override.is_granted;
        }
      }
    }

    // Return only the granted permissions as string array
    return Object.entries(permissionsMap)
      .filter(([, granted]) => granted)
      .map(([key]) => key);
  } catch (error) {
    console.error("Error evaluating user permissions:", error);
    return [];
  }
}

/**
 * Checks if a user has a specific resource:action permission (Server-only).
 * Evaluates the full precedence chain including user overrides.
 */
export async function hasPermission(
  userId: string,
  resource: string,
  action: string
): Promise<boolean> {
  const permissions = await getEffectivePermissions(userId);
  const target = `${resource}:${action}`;
  return permissions.includes(target) || permissions.includes(`${resource}:manage`) || permissions.includes("*:*");
}
