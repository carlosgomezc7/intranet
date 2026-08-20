import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isDemoMode } from "@/lib/demo";

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

  const demoCookie = request.cookies.get("elevate_demo_session");
  const hasDemoCookie = Boolean(demoCookie?.value);

  let user = null;

  if (hasDemoCookie && isDemoMode()) {
    // Only honor demo cookie when demo mode is explicitly enabled
    user = { id: "demo-user-1", email: "admin@elevate.com.mx" };
  } else if (hasDemoCookie && !isDemoMode()) {
    // Demo cookie exists but demo mode is off → clear it and don't authenticate
    supabaseResponse.cookies.delete("elevate_demo_session");
    user = null;
  } else {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

      if (!supabaseUrl || !supabaseKey) {
        // Supabase not configured and demo mode off → block access
        if (!isDemoMode()) {
          const isProtectedPath = PROTECTED_PREFIXES.some((path) =>
            request.nextUrl.pathname.startsWith(path)
          );
          if (isProtectedPath) {
            const url = request.nextUrl.clone();
            url.pathname = "/login";
            url.searchParams.set("error", "connection_failed");
            return NextResponse.redirect(url);
          }
        }
        return supabaseResponse;
      }

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
      user = data?.user ?? null;
    } catch {
      // Supabase unreachable and demo mode OFF → redirect with connection error
      if (!isDemoMode()) {
        const isProtectedPath = PROTECTED_PREFIXES.some((path) =>
          request.nextUrl.pathname.startsWith(path)
        );
        if (isProtectedPath) {
          const url = request.nextUrl.clone();
          url.pathname = "/login";
          url.searchParams.set("error", "connection_failed");
          return NextResponse.redirect(url);
        }
      }
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
