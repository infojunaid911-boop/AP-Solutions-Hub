"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/admin/auth";
import { isInquiryStatus } from "@/lib/inquiries";
import type { InquiryStatus } from "@/lib/supabase/types";

function revalidateInquiries() {
  revalidatePath("/admin");
  revalidatePath("/admin/queries");
}

export async function updateInquiryStatusAction(id: string, status: InquiryStatus) {
  if (!isInquiryStatus(status)) throw new Error("Invalid status.");
  const supabase = await assertAdmin();
  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
  if (error) throw error;
  revalidateInquiries();
}

export async function updateInquiryNotesAction(id: string, notes: string) {
  if (notes.length > 8000) throw new Error("Notes are too long.");
  const supabase = await assertAdmin();
  const { error } = await supabase
    .from("inquiries")
    .update({ admin_notes: notes.trim() || null })
    .eq("id", id);
  if (error) throw error;
  revalidateInquiries();
}
