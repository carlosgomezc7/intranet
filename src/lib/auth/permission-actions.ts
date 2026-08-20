"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo";

export interface PermissionMatrixItem {
  permission_id: string;
  resource: string;
  action: string;
  description: string | null;
  status: 'inherited' | 'explicitly_allowed' | 'explicitly_blocked' | 'denied';
  is_granted: boolean;
  source: 'super_admin_bypass' | 'user_override' | 'role_permission' | 'denied';
}

/**
 * Returns the full matrix of permissions for a specific user,
 * indicating whether each permission is inherited from their role,
 * explicitly allowed by override, explicitly blocked by override, or denied.
 */
export async function getUserPermissionMatrix(targetUserId: string): Promise<{
  success: boolean;
  matrix?: PermissionMatrixItem[];
  error?: string;
}> {
  if (isDemoMode()) {
    // In demo mode, fetch all system permissions and mark them as inherited
    try {
      const supabase = await createClient();
      const { data: perms } = await supabase.from("permissions").select("*");
      if (perms) {
        const matrix: PermissionMatrixItem[] = perms.map((p) => ({
          permission_id: p.id,
          resource: p.resource,
          action: p.action,
          description: p.description,
          status: 'inherited',
          is_granted: true,
          source: 'role_permission',
        }));
        return { success: true, matrix };
      }
    } catch {
      // Fallback if DB query fails in demo mode
    }
    return { success: true, matrix: [] };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    // Call database function get_effective_user_permissions
    const { data: effective, error: effError } = await supabase.rpc(
      "get_effective_user_permissions",
      { p_user_id: targetUserId }
    );

    // Also get all system permissions to build the full matrix
    const { data: allPermissions, error: permError } = await supabase
      .from("permissions")
      .select("*")
      .order("resource", { ascending: true })
      .order("action", { ascending: true });

    if (permError || !allPermissions) {
      return { success: false, error: permError?.message || "No se pudo cargar el catálogo de permisos" };
    }

    // Get explicit overrides for target user
    const { data: overrides } = await supabase
      .from("user_permission_overrides")
      .select("permission_id, is_granted")
      .eq("user_id", targetUserId);

    const overrideMap = new Map<string, boolean>();
    if (overrides) {
      overrides.forEach((o) => overrideMap.set(o.permission_id, o.is_granted));
    }

    // Get target user's role permissions
    const { data: targetProfile } = await supabase
      .from("profiles")
      .select("role, role_id, role_details:roles(hierarchy_level)")
      .eq("id", targetUserId)
      .single();

    const targetRoleId = targetProfile?.role_id;
    const isTargetSuperAdmin =
      targetProfile?.role === "super_admin" ||
      (targetProfile?.role_details as any)?.hierarchy_level === 0;

    let rolePermissionIds = new Set<string>();
    if (targetRoleId) {
      const { data: rolePerms } = await supabase
        .from("role_permissions")
        .select("permission_id")
        .eq("role_id", targetRoleId);
      if (rolePerms) {
        rolePermissionIds = new Set(rolePerms.map((rp) => rp.permission_id));
      }
    }

    // Build matrix for each permission
    const matrix: PermissionMatrixItem[] = allPermissions.map((perm) => {
      const hasOverride = overrideMap.has(perm.id);
      const overrideVal = overrideMap.get(perm.id);
      const isRoleGranted = isTargetSuperAdmin || rolePermissionIds.has(perm.id);

      let status: PermissionMatrixItem["status"];
      let is_granted: boolean;
      let source: PermissionMatrixItem["source"];

      if (isTargetSuperAdmin) {
        status = "inherited";
        is_granted = true;
        source = "super_admin_bypass";
      } else if (hasOverride) {
        if (overrideVal === true) {
          status = "explicitly_allowed";
          is_granted = true;
          source = "user_override";
        } else {
          status = "explicitly_blocked";
          is_granted = false;
          source = "user_override";
        }
      } else if (isRoleGranted) {
        status = "inherited";
        is_granted = true;
        source = "role_permission";
      } else {
        status = "denied";
        is_granted = false;
        source = "denied";
      }

      return {
        permission_id: perm.id,
        resource: perm.resource,
        action: perm.action,
        description: perm.description,
        status,
        is_granted,
        source,
      };
    });

    return { success: true, matrix };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error al obtener la matriz de permisos" };
  }
}

/**
 * Sets an explicit permission override (grant or block) for a specific user.
 * Includes server-side hierarchy and privilege verification.
 */
export async function setUserPermissionOverride(
  targetUserId: string,
  permissionId: string,
  isGranted: boolean
): Promise<{ success: boolean; error?: string }> {
  if (isDemoMode()) {
    revalidatePath("/settings/access");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    // 1. Check actor (current user) hierarchy level
    const { data: actorProfile } = await supabase
      .from("profiles")
      .select("role, role_id, role_details:roles(hierarchy_level)")
      .eq("id", user.id)
      .single();

    const actorLevel =
      actorProfile?.role === "super_admin"
        ? 0
        : (actorProfile?.role_details as any)?.hierarchy_level ?? 99;

    // 2. Check target user hierarchy level
    const { data: targetProfile } = await supabase
      .from("profiles")
      .select("role, role_id, role_details:roles(hierarchy_level)")
      .eq("id", targetUserId)
      .single();

    if (!targetProfile) {
      return { success: false, error: "Usuario objetivo no encontrado" };
    }

    const targetLevel =
      targetProfile.role === "super_admin"
        ? 0
        : (targetProfile.role_details as any)?.hierarchy_level ?? 99;

    // Guardrail: Actor hierarchy level must be strictly lower (higher privilege) than target
    if (actorLevel >= targetLevel && actorLevel !== 0) {
      return {
        success: false,
        error: "No tienes autorización para modificar usuarios con jerarquía igual o superior a la tuya",
      };
    }

    // 3. If granting (isGranted = true), verify actor possesses the permission themselves
    if (isGranted && actorLevel !== 0) {
      const { data: actorPerms } = await supabase.rpc(
        "get_effective_user_permissions",
        { p_user_id: user.id }
      );

      const { data: targetPerm } = await supabase
        .from("permissions")
        .select("resource, action")
        .eq("id", permissionId)
        .single();

      if (targetPerm && actorPerms) {
        const actorHasIt = actorPerms.some(
          (ap: any) =>
            ap.resource === targetPerm.resource &&
            ap.action === targetPerm.action &&
            ap.is_granted === true
        );

        if (!actorHasIt) {
          return {
            success: false,
            error: "No puedes conceder permisos que no posees",
          };
        }
      }
    }

    // 4. Upsert user_permission_overrides record
    const { error: upsertError } = await supabase
      .from("user_permission_overrides")
      .upsert({
        user_id: targetUserId,
        permission_id: permissionId,
        is_granted: isGranted,
        granted_by: user.id,
        updated_at: new Date().toISOString(),
      });

    if (upsertError) {
      return { success: false, error: upsertError.message };
    }

    revalidatePath("/settings/access");
    revalidatePath("/directory");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error al guardar la preferencia" };
  }
}

/**
 * Removes an explicit permission override for a user, reverting the feature to role default.
 */
export async function removeUserPermissionOverride(
  targetUserId: string,
  permissionId: string
): Promise<{ success: boolean; error?: string }> {
  if (isDemoMode()) {
    revalidatePath("/settings/access");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    const { error: deleteError } = await supabase
      .from("user_permission_overrides")
      .delete()
      .eq("user_id", targetUserId)
      .eq("permission_id", permissionId);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    revalidatePath("/settings/access");
    revalidatePath("/directory");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error al eliminar la preferencia" };
  }
}

/**
 * Resets all custom permission overrides for a user, restoring full base role defaults.
 */
export async function resetUserOverrides(
  targetUserId: string
): Promise<{ success: boolean; error?: string }> {
  if (isDemoMode()) {
    revalidatePath("/settings/access");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    const { error: resetError } = await supabase
      .from("user_permission_overrides")
      .delete()
      .eq("user_id", targetUserId);

    if (resetError) {
      return { success: false, error: resetError.message };
    }

    revalidatePath("/settings/access");
    revalidatePath("/directory");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error al restablecer los permisos" };
  }
}
