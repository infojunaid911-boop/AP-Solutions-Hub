import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const LOGIN_PATH = "/admin/login";
const UNAUTHORIZED_PATH = "/admin/unauthorized";
const DEFAULT_ADMIN_PATH = "/admin";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: do not run any code between createServerClient and getUser().
  // A simple mistake here can cause hard-to-debug session issues.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === LOGIN_PATH;
  const isUnauthorizedRoute = pathname === UNAUTHORIZED_PATH;
  const isPublicAdminRoute = isLoginRoute || isUnauthorizedRoute;

  if (!isAdminRoute) {
    return supabaseResponse;
  }

  // Redirects must carry forward any session cookie that getUser() just
  // refreshed on `supabaseResponse` — a bare NextResponse.redirect() starts
  // from a blank response and would silently drop it, which can cause the
  // user to appear logged out right after being redirected.
  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    const response = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie);
    });
    return response;
  };

  // Not logged in and trying to reach a protected admin page.
  if (!isPublicAdminRoute && !user) {
    return redirectTo(LOGIN_PATH);
  }

  if (user && (isLoginRoute || !isPublicAdminRoute)) {
    // Any authenticated visit to a gated admin path (including the login
    // page itself) needs a role check so we route to the right place in a
    // single redirect rather than bouncing through /admin first.
    const { data, error } = await supabase
  .from("profiles")
  .select("id, email, role")
  .eq("id", user.id)
  .single();

console.log("========== ADMIN DEBUG ==========");
console.log("AUTH USER ID:", user.id);
console.log("AUTH EMAIL:", user.email);
console.log("PROFILE DATA:", data);
console.log("PROFILE ERROR:", error);
console.log("================================");

const role = (data as { role?: string } | null)?.role;
const isAdmin = role === "admin";

    if (isLoginRoute) {
      return isAdmin ? redirectTo(DEFAULT_ADMIN_PATH) : redirectTo(UNAUTHORIZED_PATH);
    }
    if (!isAdmin) {
      return redirectTo(UNAUTHORIZED_PATH);
    }
  }

  return supabaseResponse;
}
