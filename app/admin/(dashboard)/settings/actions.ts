"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/admin/auth";

/**
 * Full name lives in Supabase Auth's user_metadata, not in a database
 * table — this is the one "profile" field that's safe to make editable
 * without touching the schema at all.
 */
export async function updateAdminName(fullName: string) {
  const supabase = await assertAdmin();
  const name = fullName.trim();

  if (name.length < 2 || name.length > 80) {
    throw new Error("Please enter a valid name.");
  }

  const { error } = await supabase.auth.updateUser({
    data: { full_name: name },
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/settings");
}

export async function changeAdminPassword(newPassword: string) {
  const supabase = await assertAdmin();

  if (newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
}

export async function signOutAdmin() {
  // Deliberately does NOT call assertAdmin() — a session that's already
  // expired or borderline-invalid should still be able to sign out
  // cleanly rather than getting stuck on an authorization check.
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  await supabase.auth.signOut();
}
