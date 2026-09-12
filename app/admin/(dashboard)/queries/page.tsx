import { createClient } from "@/lib/supabase/server";
import QueriesManager from "@/components/admin/queries/QueriesManager";
import type { Inquiry } from "@/lib/supabase/types";

export default async function QueriesPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load inquiries:", error.message);
  }

  const inquiries = (data ?? []) as Inquiry[];

  return <QueriesManager inquiries={inquiries} initialId={id} />;
}
