import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ServiceRow } from "@/components/admin/services/types";
import ServiceForm from "@/components/admin/services/ServiceForm";

export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("services")
    .select(
      "id, name, slug, description, icon, image_url, featured, active, display_order, created_at, updated_at"
    )
    .eq("id", id)
    .single();

  if (!data) notFound();

  return <ServiceForm mode="edit" service={data as ServiceRow} />;
}
