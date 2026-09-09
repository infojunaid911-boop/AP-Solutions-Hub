import { createClient } from "@/lib/supabase/server";
import type { Package, Review, Service } from "@/lib/supabase/types";

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  return [];
}

export async function getActiveReviews(): Promise<Review[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, client_name, company, rating, review, client_image, featured, active, created_at, updated_at")
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map((row) => ({
    ...row,
    rating: Number(row.rating),
  })) as Review[];
}

export async function getActivePackages(): Promise<Package[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packages")
    .select(
      "id, service_category, package_name, description, features, price_label, featured, active, display_order, created_at, updated_at"
    )
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error || !data) return [];
  return data.map((row) => ({
    ...row,
    features: asStringArray(row.features),
  })) as Package[];
}

export async function getActiveServices(): Promise<Service[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select(
      "id, name, slug, description, icon, image_url, featured, active, display_order, created_at, updated_at"
    )
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error || !data) return [];
  return data as Service[];
}
