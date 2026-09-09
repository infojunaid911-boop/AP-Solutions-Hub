import { createClient } from "@/lib/supabase/server";

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
