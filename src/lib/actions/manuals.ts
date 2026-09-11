"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

async function isLocalSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has("elevate_session");
}

export async function createManual(title: string, description: string, category: string, icon: string) {
  if (!title) return { success: false, error: "El título es obligatorio" };

  if (await isLocalSession()) {
    revalidatePath("/manuals");
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

    const { error } = await supabase.from("manuals").insert({
      org_id: profile.org_id,
      author_id: user.id,
      title,
      description,
      category: category || "general",
      icon: icon || "BookOpen",
    });

    if (error) return { success: false, error: error.message };

    revalidatePath("/manuals");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error al crear el manual" };
  }
}

export async function createChapter(manualId: string, title: string, sortOrder: number = 0) {
  if (!title) return { success: false, error: "El título del capítulo es obligatorio" };

  if (await isLocalSession()) {
    revalidatePath("/manuals");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("manual_chapters").insert({
      manual_id: manualId,
      title,
      sort_order: sortOrder,
    });

    if (error) return { success: false, error: error.message };

    revalidatePath("/manuals");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error al crear el capítulo" };
  }
}

export async function publishArticle(chapterId: string, title: string, content: string) {
  if (!title || !content) return { success: false, error: "Título y contenido son obligatorios" };

  if (await isLocalSession()) {
    revalidatePath("/manuals");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("manual_articles").insert({
      chapter_id: chapterId,
      author_id: user?.id,
      title,
      content,
      status: "published",
    });

    if (error) return { success: false, error: error.message };

    revalidatePath("/manuals");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error al publicar el artículo" };
  }
}
