import type { InquiryStatus } from "@/lib/supabase/types";

export const CONTACT_SERVICE_OPTIONS = [
  "Website Development",
  "Dashboard Development",
  "Digital Marketing",
  "Graphic Design",
  "3D Architecture",
  "Social Media Management",
  "Other",
] as const;

export const CONTACT_BUDGET_OPTIONS = [
  "Under $1,000",
  "$1,000 – $5,000",
  "$5,000 – $15,000",
  "$15,000+",
  "Not sure yet",
] as const;

export function digitsOnlyPhone(value: string) {
  return value.replace(/[^\d]/g, "");
}

export function whatsappHref(phone: string, message?: string) {
  const digits = digitsOnlyPhone(phone);
  const text = encodeURIComponent(
    message ?? "Hi, this is AP Solutions Hub following up on your project inquiry."
  );
  return `https://wa.me/${digits}?text=${text}`;
}

export function emailHref(email: string, name: string) {
  const subject = encodeURIComponent("Your project inquiry — AP Solutions Hub");
  const body = encodeURIComponent(
    `Hi ${name},\n\nThanks for getting in touch with AP Solutions Hub. We'd love to learn more about your project.\n\n`
  );
  return `mailto:${email}?subject=${subject}&body=${body}`;
}

export function isInquiryStatus(value: string): value is InquiryStatus {
  return ["new", "contacted", "discussion", "converted", "closed"].includes(value);
}
