"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo";

export async function createRoleAction(formData: FormData) {
  const name = (formData.get("name") as string || "").trim();
  const slug = (formData.get("slug") as string || name.toLowerCase().replace(/\s+/g, "_")).trim();
  const description = (formData.get("description") as string || "").trim();
  const hierarchyLevel = parseInt((formData.get("hierarchyLevel") as string) || "4", 10);
  const permissions = formData.getAll("permissions") as string[];

  if (!name || !slug) {
    return { success: false, error: "El nombre y identificador del rol son obligatorios." };
  }

  if (isDemoMode()) {
    revalidatePath("/settings/access");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "No autenticado." };

    // Get caller's profile hierarchy & org_id
    const { data: callerProfile } = await supabase
      .from("profiles")
      .select("org_id, role, role_id, role_details:roles(*)")
      .eq("id", user.id)
      .single();

    const callerLevel = callerProfile?.role === "super_admin" ? 0 : ((callerProfile?.role_details as any)?.hierarchy_level ?? 1);

    // Hierarchical protection: Cannot create roles with higher or equal privilege
    if (hierarchyLevel <= callerLevel && callerLevel !== 0) {
      return {
        success: false,
        error: "No puedes crear roles con nivel jerárquico igual o superior al tuyo.",
      };
    }

    const { data: role, error: roleError } = await supabase
      .from("roles")
      .insert({
        org_id: callerProfile?.org_id,
        name,
        slug,
        description,
        hierarchy_level: Math.max(hierarchyLevel, 2),
        is_system: false,
      })
      .select("id")
      .single();

    if (roleError || !role) {
      return { success: false, error: roleError?.message || "Error al crear el rol." };
    }

    // Insert permissions
    if (permissions.length > 0) {
      const rolePermRows = permissions.map((permId) => ({
        role_id: role.id,
        permission_id: permId,
      }));
      await supabase.from("role_permissions").insert(rolePermRows);
    }

    revalidatePath("/settings/access");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error al procesar la solicitud." };
  }
}

export async function deleteRoleAction(roleId: string) {
  if (isDemoMode()) {
    revalidatePath("/settings/access");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "No autenticado." };

    // Prevent system role deletion
    const { data: targetRole } = await supabase
      .from("roles")
      .select("is_system, hierarchy_level")
      .eq("id", roleId)
      .single();

    if (targetRole?.is_system) {
      return { success: false, error: "Los roles base del sistema no pueden ser eliminados." };
    }

    const { error } = await supabase.from("roles").delete().eq("id", roleId);
    if (error) return { success: false, error: error.message };

    revalidatePath("/settings/access");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error al eliminar el rol." };
  }
}

export async function createGroupAction(formData: FormData) {
  const name = (formData.get("name") as string || "").trim();
  const description = (formData.get("description") as string || "").trim();
  const slug = (formData.get("slug") as string || name.toLowerCase().replace(/\s+/g, "_")).trim();

  if (!name) return { success: false, error: "El nombre del grupo es obligatorio." };

  if (isDemoMode()) {
    revalidatePath("/settings/access/groups");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "No autenticado." };

    const { data: profile } = await supabase.from("profiles").select("org_id").eq("id", user.id).single();

    const { error } = await supabase.from("groups").insert({
      org_id: profile?.org_id,
      name,
      slug,
      description,
    });

    if (error) return { success: false, error: error.message };

    revalidatePath("/settings/access/groups");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error al crear grupo." };
  }
}

export async function updateMandatoryPasswordAction(formData: FormData) {
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: "La nueva contraseña debe contener al menos 8 caracteres." };
  }
  if (newPassword !== confirmPassword) {
    return { success: false, error: "Las contraseñas no coinciden." };
  }

  if (isDemoMode()) {
    revalidatePath("/", "layout");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "No autenticado." };

    const { error: authError } = await supabase.auth.updateUser({ password: newPassword });
    if (authError) return { success: false, error: authError.message };

    await supabase.from("profiles").update({ must_change_password: false }).eq("id", user.id);

    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error al actualizar contraseña." };
  }
}
