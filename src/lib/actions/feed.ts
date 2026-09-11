"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

async function isLocalSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has("elevate_session");
}

export async function createPost(formData: FormData) {
  const content = (formData.get("content") as string || "").trim();
  const postType = (formData.get("postType") as string || "post");
  const attachmentUrl = (formData.get("attachmentUrl") as string || "").trim();

  if (!content) {
    return { success: false, error: "El contenido no puede estar vacío" };
  }

  if (await isLocalSession()) {
    revalidatePath("/feed");
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

    const attachments = attachmentUrl ? [attachmentUrl] : [];

    const { error } = await supabase.from("posts").insert({
      org_id: profile.org_id,
      author_id: user.id,
      content,
      post_type: postType,
      attachment_urls: attachments,
    });

    if (error) return { success: false, error: error.message };

    revalidatePath("/feed");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error al publicar" };
  }
}

export async function addReaction(postId: string, emoji: string) {
  if (await isLocalSession()) {
    revalidatePath("/feed");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "No autenticado" };

    const { error } = await supabase.from("post_reactions").upsert({
      post_id: postId,
      user_id: user.id,
      emoji,
    });

    if (error) return { success: false, error: error.message };

    revalidatePath("/feed");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error al reaccionar" };
  }
}

export async function votePoll(pollId: string, optionIndex: number) {
  if (await isLocalSession()) {
    revalidatePath("/feed");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "No autenticado" };

    const { error } = await supabase.from("poll_votes").upsert({
      poll_id: pollId,
      user_id: user.id,
      option_index: optionIndex,
    });

    if (error) return { success: false, error: error.message };

    revalidatePath("/feed");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error al registrar el voto" };
  }
}

export async function sendKudos(recipientId: string, badgeType: string, message: string) {
  if (await isLocalSession()) {
    revalidatePath("/feed");
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

    // 1. Create post entry
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .insert({
        org_id: profile.org_id,
        author_id: user.id,
        content: message || `Reconocimiento entregado`,
        post_type: "kudos",
      })
      .select("id")
      .single();

    if (postError || !postData) return { success: false, error: postError?.message || "Error al crear la publicación" };

    // 2. Create kudos entry
    const { error: kudosError } = await supabase.from("kudos").insert({
      post_id: postData.id,
      recipient_id: recipientId,
      badge_type: badgeType,
      message,
    });

    if (kudosError) return { success: false, error: kudosError.message };

    revalidatePath("/feed");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error al entregar reconocimiento" };
  }
}
