import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";
import LogoutButton from "@/components/admin/LogoutButton";

// This page reads the auth session on every request and must never be
// statically cached — Next.js infers this automatically from cookies()/
// auth calls, but it's made explicit here since the page gates real access.
export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already guards this route, but a Server Component should
  // never trust that alone — verify session and role again here.
  if (!user) {
    redirect("/admin/login");
  }

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url, role, created_at, updated_at")
    .eq("id", user.id)
    .single();

  // Cast rather than `.single<Profile>()` — the generic overload on
  // `.single()` isn't available on every postgrest-js version, so this
  // avoids a build error that depends on exactly which version installs.
  const profile = data as Profile | null;

  if (!profile || profile.role !== "admin") {
    redirect("/admin/unauthorized");
  }

  const displayName = profile.full_name || profile.email || user.email;

  return (
    <div className="min-h-screen bg-offwhite px-6 py-16 md:px-10">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-ink text-sm font-display font-bold text-white">
              AP
            </span>
            <span className="font-display text-[15px] font-semibold text-ink">Admin</span>
          </span>
          <LogoutButton />
        </div>

        <div className="mt-14 rounded-2xl border border-ink/10 bg-white p-8 md:p-10">
          <h1 className="font-display text-2xl font-semibold text-ink md:text-[1.75rem]">
            Welcome to AP Solutions Hub Admin
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/60">
            Signed in as{" "}
            <span className="font-medium text-ink">{displayName}</span>
            {profile.email && profile.email !== displayName ? ` (${profile.email})` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
