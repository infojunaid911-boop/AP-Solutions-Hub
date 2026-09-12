import PackageForm from "@/components/admin/packages/PackageForm";

export const dynamic = "force-dynamic";

export default function NewPackagePage() {
  return <PackageForm mode="create" />;
}
