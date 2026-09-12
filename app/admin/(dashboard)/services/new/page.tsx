import { createClient } from "@/lib/supabase/server";
import ServiceForm from "@/components/admin/services/ServiceForm";

export const dynamic = "force-dynamic";

export default async function NewServicePage() {
  const supabase = await createClient();
  const { count } = await supabase
    .from("services")
    .select("id", { count: "exact", head: true });

  return <ServiceForm mode="create" nextDisplayOrder={(count ?? 0) + 1} />;
}
