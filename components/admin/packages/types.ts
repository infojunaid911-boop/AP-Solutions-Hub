// Local to the packages admin so it only ever depends on the 10 columns
// that actually exist on public.packages — nothing here assumes a
// display_order column or any other schema change.

export const SERVICE_CATEGORIES = [
  "Website",
  "Marketing",
  "Design",
  "Dashboard",
  "3D Architecture",
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export type PackageRow = {
  id: string;
  service_category: string;
  package_name: string;
  description: string | null;
  features: string[];
  price_label: string | null;
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export function asFeatureArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}
