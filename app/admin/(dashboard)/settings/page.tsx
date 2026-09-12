import { createClient } from "@/lib/supabase/server";
import SettingsTabs from "@/components/admin/settings/SettingsTabs";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Role comes from the same profiles table assertAdmin() already checks
  // elsewhere — reading it here is just a lookup, not a new dependency.
  const { data: profile } = user
    ? await supabase.from("profiles").select("role").eq("id", user.id).single()
    : { data: null };

  return (
    <SettingsTabs
      adminEmail={user?.email ?? ""}
      adminName={(user?.user_metadata?.full_name as string | undefined) ?? ""}
      adminRole={(profile as { role?: string } | null)?.role ?? "admin"}
    />
  );
}
