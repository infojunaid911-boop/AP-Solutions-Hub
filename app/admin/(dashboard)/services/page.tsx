import { createClient } from "@/lib/supabase/server";
import type { ServiceRow } from "@/components/admin/services/types";
import ServicesAdminList from "@/components/admin/services/ServicesAdminList";

// Depends on the auth session (via the DashboardLayout above it) and the
// freshest ordering, so it should never be statically cached.
export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("services")
    .select(
      "id, name, slug, description, icon, image_url, featured, active, display_order, created_at, updated_at"
    )
    .order("display_order", { ascending: true });

  const services = (data ?? []) as ServiceRow[];

  return <ServicesAdminList services={services} />;
}
