"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo";

export async function scheduleTownHall(title: string, description: string, scheduledAt: string, streamUrl?: string) {
  if (!title || !scheduledAt) return { success: false, error: "Título y fecha programada son obligatorios" };

  if (isDemoMode()) {
    revalidatePath("/townhalls");
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

    const { error } = await supabase.from("town_halls").insert({
      org_id: profile.org_id,
      host_id: user.id,
      title,
      description,
      scheduled_at: scheduledAt,
      stream_url: streamUrl || null,
      status: "scheduled",
    });

    if (error) return { success: false, error: error.message };

    revalidatePath("/townhalls");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error al programar Town Hall" };
  }
}

export async function submitQuestion(townHallId: string, question: string) {
  if (!question) return { success: false, error: "La pregunta no puede estar vacía" };

  if (isDemoMode()) {
    revalidatePath("/townhalls");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "No autenticado" };

    const { error } = await supabase.from("town_hall_questions").insert({
      town_hall_id: townHallId,
      author_id: user.id,
      question,
    });

    if (error) return { success: false, error: error.message };

    revalidatePath("/townhalls");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error al enviar la pregunta" };
  }
}

export async function upvoteQuestion(questionId: string) {
  if (isDemoMode()) {
    revalidatePath("/townhalls");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { data: q } = await supabase
      .from("town_hall_questions")
      .select("upvotes")
      .eq("id", questionId)
      .single();

    const currentUpvotes = q?.upvotes || 0;

    const { error } = await supabase
      .from("town_hall_questions")
      .update({ upvotes: currentUpvotes + 1 })
      .eq("id", questionId);

    if (error) return { success: false, error: error.message };

    revalidatePath("/townhalls");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error al votar pregunta" };
  }
}
