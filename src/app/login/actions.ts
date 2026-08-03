"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 1. Sign up the user (this triggers the DB to create a Profile via handle_new_user)
  // We pass the role 'admin' in user metadata so the trigger catches it
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: "admin",
      },
    },
  });

  if (authError) {
    redirect(`/login?error=${encodeURIComponent(authError.message)}`);
  }

  // If email confirmations are OFF, authData.user is signed in automatically.
  // Now we create their Organization.
  if (authData.user) {
    // 2. Create the Organization (Tenant)
    const { data: orgData, error: orgError } = await supabase
      .from("organizations")
      .insert({
        name: "Mi Empresa", // Placeholder, they can change it in settings later
      })
      .select("id")
      .single();

    if (orgError) {
      console.error("Error creating organization:", orgError);
    } else if (orgData) {
      // 3. Update the Profile to link to the new Organization
      await supabase
        .from("profiles")
        .update({ organization_id: orgData.id })
        .eq("id", authData.user.id);
    }
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
