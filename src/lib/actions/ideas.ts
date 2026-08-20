"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo";

export async function submitIdea(title: string, description: string, category: string) {
  if (!title || !description) return { success: false, error: "Título y descripción son requeridos" };

  if (isDemoMode()) {
    revalidatePath("/ideas");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "No autenticado" };

    const { data: profile } = await supabase
      .from("profiles")
      .select("org_id")
      .eq("id", user.id)
      .single();

    if (!profile?.org_id) return { success: false, error: "Organización no encontrada" };

    const { error } = await supabase.from("ideas").insert({
      org_id: profile.org_id,
      author_id: user.id,
      title,
      description,
      category: category || "general",
      status: "under_review",
    });

    if (error) return { success: false, error: error.message };

    revalidatePath("/ideas");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error al enviar la idea" };
  }
}

export async function voteIdea(ideaId: string) {
  if (isDemoMode()) {
    revalidatePath("/ideas");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "No autenticado" };

    const { error } = await supabase.from("idea_votes").insert({
      idea_id: ideaId,
      user_id: user.id,
    });

    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "Ya has votado por esta idea" };
      }
      return { success: false, error: error.message };
    }

    revalidatePath("/ideas");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error al registrar el voto" };
  }
}

export async function updateIdeaStatus(ideaId: string, status: string) {
  if (isDemoMode()) {
    revalidatePath("/ideas");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("ideas")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", ideaId);

    if (error) return { success: false, error: error.message };

    revalidatePath("/ideas");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error al actualizar la idea" };
  }
}
