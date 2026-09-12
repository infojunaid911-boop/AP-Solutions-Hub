import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { countNewInquiries } from "@/lib/inquiries";
import type { Profile } from "@/lib/supabase/types";
import AdminShell from "@/components/admin/AdminShell";

// Every page under this layout depends on the auth session — never
// statically cache it.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url, role, created_at, updated_at")
    .eq("id", user.id)
    .single();

  const profile = data as Profile | null;

  if (!profile || profile.role !== "admin") {
    redirect("/admin/unauthorized");
  }

  // Seeds the sidebar's "Queries" badge on first paint. AdminShell keeps it
  // in sync after that via a realtime subscription.
  const newInquiriesCount = await countNewInquiries(supabase);

  return (
    <AdminShell profile={profile} initialNewInquiriesCount={newInquiriesCount}>
      {children}
    </AdminShell>
  );
}
