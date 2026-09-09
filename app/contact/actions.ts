"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CONTACT_BUDGET_OPTIONS, CONTACT_SERVICE_OPTIONS } from "@/lib/inquiries";

export type InquiryFormPayload = {
  fullName: string;
  businessName: string;
  email: string;
  whatsapp: string;
  service: string;
  budget: string;
  description: string;
  website?: string;
  startedAt?: number;
};

export type InquirySubmitResult = { ok: true } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function validate(payload: InquiryFormPayload): string | null {
  if (payload.website?.trim()) return "spam";

  const startedAt = payload.startedAt ?? 0;
  if (!startedAt || Date.now() - startedAt < 2500) {
    return "Please wait a moment and try again.";
  }

  const fullName = clean(payload.fullName);
  const businessName = clean(payload.businessName);
  const email = clean(payload.email).toLowerCase();
  const whatsapp = payload.whatsapp.trim();
  const description = payload.description.trim();

  if (fullName.length < 2 || fullName.length > 120) return "Full name is required.";
  if (businessName.length < 2 || businessName.length > 160) return "Business name is required.";
  if (!EMAIL_RE.test(email) || email.length > 160) return "Enter a valid email address.";
  if (whatsapp.replace(/[^\d]/g, "").length < 8 || whatsapp.length > 30) {
    return "Enter a valid WhatsApp number.";
  }
  if (!CONTACT_SERVICE_OPTIONS.includes(payload.service as (typeof CONTACT_SERVICE_OPTIONS)[number])) {
    return "Select the service you need.";
  }
  if (!CONTACT_BUDGET_OPTIONS.includes(payload.budget as (typeof CONTACT_BUDGET_OPTIONS)[number])) {
    return "Select a budget range.";
  }
  if (description.length < 20) return "Tell us a little more about your project (at least 20 characters).";
  if (description.length > 4000) return "Project description is too long.";
  return null;
}

export async function submitInquiryAction(payload: InquiryFormPayload): Promise<InquirySubmitResult> {
  const spamOrError = validate(payload);
  if (spamOrError === "spam") return { ok: true };
  if (spamOrError) return { ok: false, error: spamOrError };

  const supabase = await createClient();
  const { error } = await supabase.rpc("submit_inquiry", {
    p_name: clean(payload.fullName),
    p_business_name: clean(payload.businessName),
    p_email: clean(payload.email).toLowerCase(),
    p_whatsapp: payload.whatsapp.trim(),
    p_service: payload.service,
    p_budget: payload.budget,
    p_message: payload.description.trim(),
  });

  if (error) {
    const message = error.message.replace(/^.*ERROR:\s*/i, "").split("\n")[0];
    return { ok: false, error: message || "Couldn't send your inquiry. Please try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/queries");
  return { ok: true };
}
