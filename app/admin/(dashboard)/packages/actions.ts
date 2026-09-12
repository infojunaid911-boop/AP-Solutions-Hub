"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/admin/auth";
import {
  SERVICE_CATEGORIES,
  asFeatureArray,
  type ServiceCategory,
} from "@/components/admin/packages/types";

// Packages show up on the public site the moment they're active, so every
// mutation revalidates both the admin pages and the homepage.
function revalidatePackageSurfaces() {
  revalidatePath("/admin/packages");
  revalidatePath("/");
}

export type PackageInput = {
  service_category: string;
  package_name: string;
  description: string;
  features: string[];
  price_label: string;
  featured: boolean;
  active: boolean;
};

function validate(input: PackageInput) {
  const service_category = input.service_category.trim();
  const package_name = input.package_name.trim();
  const description = input.description.trim();
  const price_label = input.price_label.trim();
  const features = asFeatureArray(input.features);

  if (!SERVICE_CATEGORIES.includes(service_category as ServiceCategory)) {
    throw new Error("Please choose a valid service category.");
  }
  if (package_name.length < 2 || package_name.length > 80) {
    throw new Error("Please enter a valid package name.");
  }
  if (description.length > 2000) {
    throw new Error("Description is too long.");
  }
  if (price_label.length > 60) {
    throw new Error("Price label is too long.");
  }

  return { service_category, package_name, description, price_label, features };
}

export async function createPackage(input: PackageInput) {
  const supabase = await assertAdmin();
  const { service_category, package_name, description, price_label, features } =
    validate(input);

  const { error } = await supabase.from("packages").insert({
    service_category,
    package_name,
    // Empty strings become null so blank fields don't render literally on
    // the public site (an empty description/price label should just be
    // omitted, not shown as "").
    description: description || null,
    price_label: price_label || null,
    features,
    featured: input.featured,
    active: input.active,
  });

  if (error) throw new Error(error.message);
  revalidatePackageSurfaces();
}

export async function updatePackage(id: string, input: PackageInput) {
  const supabase = await assertAdmin();
  const { service_category, package_name, description, price_label, features } =
    validate(input);

  const { error } = await supabase
    .from("packages")
    .update({
      service_category,
      package_name,
      description: description || null,
      price_label: price_label || null,
      features,
      featured: input.featured,
      active: input.active,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePackageSurfaces();
}

export async function deletePackage(id: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("packages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePackageSurfaces();
}

export async function setPackageActive(id: string, active: boolean) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("packages").update({ active }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePackageSurfaces();
}

export async function setPackageFeatured(id: string, featured: boolean) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("packages").update({ featured }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePackageSurfaces();
}
