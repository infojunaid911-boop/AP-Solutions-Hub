"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/admin/auth";
import { deleteServiceImageByUrl } from "@/lib/supabase/storage";
import { slugify } from "@/components/admin/services/types";

// Services show up on the public site the moment they're active, so every
// mutation revalidates both the admin pages and the homepage.
function revalidateServiceSurfaces() {
  revalidatePath("/admin/services");
  revalidatePath("/");
}

export type ServiceInput = {
  name: string;
  slug: string;
  description: string;
  icon: string;
  image_url: string | null;
  featured: boolean;
  active: boolean;
  display_order: number;
};

function validate(input: ServiceInput) {
  const name = input.name.trim();
  const description = input.description.trim();
  const slug = slugify(input.slug.trim() || name);
  const display_order = Math.round(Number(input.display_order));

  if (name.length < 2 || name.length > 100) {
    throw new Error("Please enter a valid service name.");
  }
  if (description.length < 2 || description.length > 2000) {
    throw new Error("Please enter a description.");
  }
  if (!Number.isFinite(display_order) || display_order < 1) {
    throw new Error("Display order must be a positive number.");
  }

  return { name, slug, description, display_order };
}

export async function createService(input: ServiceInput) {
  const supabase = await assertAdmin();
  const { name, slug, description, display_order } = validate(input);

  // Slugs are used in public URLs, so they need to be unique. Rather than
  // rely on a DB constraint that may or may not exist, check here and
  // surface a friendly error instead of a raw Postgres one.
  const { data: existing } = await supabase
    .from("services")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (existing) {
    throw new Error(`The slug "${slug}" is already in use by another service.`);
  }

  const { error } = await supabase.from("services").insert({
    name,
    slug,
    description,
    icon: input.icon || null,
    image_url: input.image_url,
    featured: input.featured,
    active: input.active,
    display_order,
  });

  if (error) throw new Error(error.message);
  revalidateServiceSurfaces();
}

export async function updateService(id: string, input: ServiceInput) {
  const supabase = await assertAdmin();
  const { name, slug, description, display_order } = validate(input);

  const { data: existing } = await supabase
    .from("services")
    .select("id")
    .eq("slug", slug)
    .neq("id", id)
    .maybeSingle();
  if (existing) {
    throw new Error(`The slug "${slug}" is already in use by another service.`);
  }

  const { error } = await supabase
    .from("services")
    .update({
      name,
      slug,
      description,
      icon: input.icon || null,
      image_url: input.image_url,
      featured: input.featured,
      active: input.active,
      display_order,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidateServiceSurfaces();
}

export async function deleteService(id: string, imageUrl: string | null) {
  const supabase = await assertAdmin();

  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (imageUrl) {
    // Best-effort — never blocks the delete if storage cleanup fails.
    await deleteServiceImageByUrl(imageUrl);
  }

  revalidateServiceSurfaces();
}

export async function setServiceActive(id: string, active: boolean) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("services").update({ active }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateServiceSurfaces();
}

export async function setServiceFeatured(id: string, featured: boolean) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("services").update({ featured }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateServiceSurfaces();
}

/** Fallback path for the numeric "Display Order" input on a single row. */
export async function setServiceOrder(id: string, displayOrder: number) {
  const supabase = await assertAdmin();
  const order = Math.max(1, Math.round(displayOrder));
  const { error } = await supabase
    .from("services")
    .update({ display_order: order })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateServiceSurfaces();
}

/**
 * Drag-and-drop path: called once after a drop with the full list's ids in
 * their new order. Re-numbers everyone 1..N so ordering always stays
 * dense and unambiguous, rather than trying to patch just the two rows
 * that moved.
 */
export async function reorderServices(orderedIds: string[]) {
  const supabase = await assertAdmin();

  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("services")
        .update({ display_order: index + 1 })
        .eq("id", id)
    )
  );

  const failed = results.find((r) => r.error);
  if (failed?.error) throw new Error(failed.error.message);

  revalidateServiceSurfaces();
}
