import { createClient } from "@/lib/supabase/server";

// This file already exists in the project (it's what every other admin
// actions.ts imports assertAdmin from). Included here only so the import
// path below resolves — if your copy lives somewhere else, just update
// the import in reviews/actions.ts to match.
export async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated.");

  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if ((data as { role?: string } | null)?.role !== "admin") {
    throw new Error("Not authorized.");
  }
  return supabase;
}
