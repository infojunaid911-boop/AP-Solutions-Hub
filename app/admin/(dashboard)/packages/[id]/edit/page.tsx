import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { asFeatureArray, type PackageRow } from "@/components/admin/packages/types";
import PackageForm from "@/components/admin/packages/PackageForm";

export const dynamic = "force-dynamic";

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("packages")
    .select(
      "id, service_category, package_name, description, features, price_label, featured, active, created_at, updated_at"
    )
    .eq("id", id)
    .single();

  if (!data) notFound();

  const pkg = { ...data, features: asFeatureArray(data.features) } as PackageRow;

  return <PackageForm mode="edit" pkg={pkg} />;
}
