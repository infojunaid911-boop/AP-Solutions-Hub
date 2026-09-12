import { createClient } from "@/lib/supabase/server";
import type { PackageRow } from "@/components/admin/packages/types";
import { asFeatureArray } from "@/components/admin/packages/types";
import PackagesAdminList from "@/components/admin/packages/PackagesAdminList";

// This depends on the auth session (via the DashboardLayout above it) and
// the freshest data, so it should never be statically cached.
export const dynamic = "force-dynamic";

export default async function AdminPackagesPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("packages")
    .select(
      "id, service_category, package_name, description, features, price_label, featured, active, created_at, updated_at"
    )
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  const packages = (data ?? []).map((row) => ({
    ...row,
    features: asFeatureArray(row.features),
  })) as PackageRow[];

  return <PackagesAdminList packages={packages} />;
}
