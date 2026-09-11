import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/chat",
  "/files",
  "/projects",
  "/directory",
  "/requests",
  "/attendance",
  "/payroll",
  "/announcements",
  "/notifications",
  "/settings",
];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Clean up legacy demo cookie if present
  if (request.cookies.has("elevate_demo_session")) {
    supabaseResponse.cookies.delete("elevate_demo_session");
  }

  const sessionCookie = request.cookies.get("elevate_session");
  const hasLocalSession = Boolean(sessionCookie?.value);

  let user: { id: string; email: string } | null = null;

  if (hasLocalSession) {
    // Local offline default session
    try {
      const parsed = JSON.parse(sessionCookie!.value);
      user = {
        id: `default-${parsed.username || "admin"}`,
        email: `${parsed.username || "admin"}@elevate.local`,
      };
    } catch {
      user = { id: "default-admin", email: "admin@elevate.local" };
    }
  } else {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const supabaseKey =
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        "";

      if (supabaseUrl && supabaseKey) {
        const supabase = createServerClient(supabaseUrl, supabaseKey, {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) =>
                request.cookies.set(name, value)
              );
              supabaseResponse = NextResponse.next({
                request,
              });
              cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
              );
            },
          },
        });

        const { data } = await supabase.auth.getUser();
        user = data?.user ? { id: data.user.id, email: data.user.email || "" } : null;
      }
    } catch {
      user = null;
    }
  }

  const isProtectedPath = PROTECTED_PREFIXES.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Redirect unauthenticated users trying to access protected routes to /login
  if (!user && isProtectedPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users from /login to /dashboard
  if (user && request.nextUrl.pathname.startsWith("/login")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
