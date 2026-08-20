"use client";

import { useUser } from "./useUser";
import { UserRole } from "@/lib/types";
import { USER_ROLES } from "@/lib/constants";

/**
 * Legacy action-name aliases → resource:action pairs.
 * Preserves backward compatibility with existing `can('manage_users')` calls.
 */
const LEGACY_ALIASES: Record<string, string[]> = {
  manage_users: ["users:create", "users:read", "users:update", "users:delete"],
  manage_organization: ["roles:create", "roles:update", "roles:delete", "groups:create", "groups:update", "groups:delete"],
  manage_system_settings: ["roles:create", "roles:update", "roles:delete"],
  manage_access_control: ["roles:assign", "roles:create", "roles:update", "roles:delete"],
  manage_payroll: ["payroll:read:all", "payroll:import"],
  manage_attendance: ["attendance:read:all", "attendance:import"],
  manage_departments: ["users:update"],
  approve_department_requests: ["announcements:publish"],
  publish_announcements: ["announcements:create", "announcements:publish"],
  approve_team_requests: ["projects:update"],
  manage_team_members: ["projects:update"],
  view_own_payroll: ["payroll:read:self"],
  submit_requests: ["attendance:checkin:self"],
  access_chat: ["chat:access"],
  view_directory: ["users:read"],
};

export function usePermissions() {
  const { profile, loading } = useUser();
  const role: UserRole = profile?.role || "employee";
  const hierarchyLevel = USER_ROLES[role]?.level ?? 3;
  const isSuperAdmin = hierarchyLevel === 0;
  const effectivePermissions = profile?.effectivePermissions || {};

  /**
   * Evaluates if the current user has a given permission.
   *
   * Supports two syntaxes:
   * 1. `can('resource', 'action')` — looks up `resource:action` in effectivePermissions
   * 2. `can('legacy_action_name')` — translates via LEGACY_ALIASES then checks any match
   *
   * Precedence (already resolved in effectivePermissions map):
   * SuperAdmin bypass → User Deny → User Grant → Role Permission → Default Deny
   */
  const can = (resourceOrAction: string, specificAction?: string): boolean => {
    // SuperAdmin bypasses all restrictions
    if (isSuperAdmin) return true;

    // Granular resource:action syntax
    if (specificAction) {
      const key = `${resourceOrAction}:${specificAction}`;
      return effectivePermissions[key] === true;
    }

    // Check if it's a compound "resource:action" string
    if (resourceOrAction.includes(":")) {
      return effectivePermissions[resourceOrAction] === true;
    }

    // Legacy action-name mapping — returns true if ANY aliased permission is granted
    const aliases = LEGACY_ALIASES[resourceOrAction];
    if (aliases) {
      return aliases.some((alias) => effectivePermissions[alias] === true);
    }

    // Unknown permission → deny
    return false;
  };

  const hasRole = (requiredRoles: UserRole[]): boolean => {
    return requiredRoles.includes(role);
  };

  const hasMinimumRole = (minRole: UserRole): boolean => {
    const minLevel = USER_ROLES[minRole]?.level ?? 0;
    // Lower level number = higher privilege (0 = SuperAdmin)
    return hierarchyLevel <= minLevel;
  };

  return {
    role,
    hierarchyLevel,
    isSuperAdmin,
    isAdmin: hierarchyLevel <= 1,
    can,
    hasRole,
    hasMinimumRole,
    loading,
    effectivePermissions,
  };
}
