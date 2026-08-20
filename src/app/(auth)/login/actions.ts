"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode, DEMO_USERS } from "@/lib/demo";

// Admin role UUID matching 012_rbac_pbac_system.sql seed
const ADMIN_ROLE_ID = "b1000000-0000-4000-b000-000000000002";

export async function loginAction(formData: FormData) {
  const identifier = (
    (formData.get("username") as string) ||
    (formData.get("email") as string) ||
    ""
  ).trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!identifier || !password) {
    redirect("/login?error=Por%20favor%20ingresa%20tu%20nombre%20de%20usuario%20y%20contrase%C3%B1a");
  }

  const cookieStore = await cookies();

  // Demo mode: only check demo credentials when explicitly enabled
  if (isDemoMode()) {
    const demoPassword = process.env.DEMO_PASSWORD || "elevate2026";
    const demoUser = DEMO_USERS.find(
      (u) => u.username === identifier || u.email === identifier
    );
    if (demoUser && password === demoPassword) {
      cookieStore.set("elevate_demo_session", JSON.stringify({ username: demoUser.username, role: demoUser.role }), {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
      revalidatePath("/", "layout");
      redirect("/dashboard");
    }
    // If demo mode is on but credentials don't match any demo user, still show generic error
    if (demoUser || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      redirect(`/login?error=${encodeURIComponent("Usuario o contraseña incorrectos")}`);
    }
  }

  // Real Supabase Authentication via resolve_login_identifier
  try {
    const supabase = await createClient();

    // Resolve identifier to email using secure DB function (case-insensitive, anti-enumeration)
    let authEmail: string | null = null;

    if (identifier.includes("@")) {
      // If it looks like an email, use it directly
      authEmail = identifier;
    } else {
      // Resolve username → email via RPC
      const { data: resolvedEmail } = await supabase.rpc(
        "resolve_login_identifier",
        { p_identifier: identifier }
      );
      authEmail = resolvedEmail || null;
    }

    // Always attempt authentication — even with null email, to maintain constant-time behavior
    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail || `${identifier}@invalid.local`,
      password,
    });

    if (error) {
      redirect(`/login?error=${encodeURIComponent("Usuario o contraseña incorrectos")}`);
    }
  } catch (err: unknown) {
    const error = err as { digest?: string; message?: string };
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    // Connection failure: redirect with error (no demo fallback in production)
    if (isDemoMode()) {
      const demoPassword = process.env.DEMO_PASSWORD || "elevate2026";
      if (password === demoPassword) {
        cookieStore.set("elevate_demo_session", JSON.stringify({ username: identifier, role: "admin" }), {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        });
        revalidatePath("/", "layout");
        redirect("/dashboard");
      }
    }
    redirect(`/login?error=${encodeURIComponent("No se pudo conectar con el servidor")}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signupAction(formData: FormData) {
  const username = (
    (formData.get("username") as string) ||
    ""
  ).trim().toLowerCase();
  const password = formData.get("password") as string;
  const fullName = (formData.get("fullName") as string) || "Administrador";
  const orgName = (formData.get("orgName") as string) || "Mi Empresa";
  const email = (
    (formData.get("email") as string) ||
    ""
  ).trim().toLowerCase();

  if (!username || !password) {
    redirect("/login?error=Por%20favor%20completa%20todos%20los%20campos%20requeridos");
  }

  if (!email) {
    redirect("/login?error=Por%20favor%20ingresa%20un%20correo%20electr%C3%B3nico");
  }

  const cookieStore = await cookies();

  if (isDemoMode()) {
    cookieStore.set("elevate_demo_session", JSON.stringify({ username, role: "admin" }), {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  try {
    const supabase = await createClient();

    // 1. Create Supabase Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: fullName,
          role: "admin",
        },
      },
    });

    if (authError) {
      redirect(`/login?error=${encodeURIComponent(authError.message)}`);
    }

    // 2. Create Organization & Link Profile with role_id
    if (authData?.user) {
      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .insert({
          name: orgName,
          max_users: 200,
          is_active: true,
        })
        .select("id")
        .single();

      if (orgError) {
        console.error("Error creating organization:", orgError);
        redirect(`/login?error=${encodeURIComponent("No se pudo crear la organización")}`);
      }

      if (orgData) {
        // Set both role (TEXT) and role_id (UUID FK) for consistency
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: authData.user.id,
          org_id: orgData.id,
          username,
          email,
          full_name: fullName,
          role: "admin",
          role_id: ADMIN_ROLE_ID,
          is_active: true,
        });

        if (profileError) {
          console.error("Error linking profile to organization:", profileError);
        }
      }
    }
  } catch (err: unknown) {
    const error = err as { digest?: string; message?: string };
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    redirect(`/login?error=${encodeURIComponent(error?.message || "Error durante el registro")}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("elevate_demo_session");

  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore sign out error if offline
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
