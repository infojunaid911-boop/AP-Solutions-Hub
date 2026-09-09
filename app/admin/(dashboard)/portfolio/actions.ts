"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { packDescription } from "@/lib/portfolio/description";
import { slugify } from "@/lib/portfolio/slug";
import type { PortfolioStatus } from "@/lib/supabase/types";

export type ProjectImageInput = {
  url: string;
  display_order: number;
};

export type ProjectFormInput = {
  id?: string;
  title: string;
  category: string;
  clientName: string;
  projectUrl: string;
  shortDescription: string;
  detailedDescription: string;
  featured: boolean;
  status: PortfolioStatus;
  images: ProjectImageInput[];
  coverImageUrl: string | null;
};

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated.");

  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if ((data as { role?: string } | null)?.role !== "admin") {
    throw new Error("Not authorized.");
  }
  return supabase;
}

function revalidatePublicAndAdmin(projectId?: string) {
  revalidatePath("/");
  revalidatePath("/admin/portfolio");
  if (projectId) revalidatePath(`/admin/portfolio/${projectId}/edit`);
}

export async function upsertProjectAction(input: ProjectFormInput) {
  const supabase = await assertAdmin();

  const description = packDescription(input.shortDescription, input.detailedDescription);
  const baseSlug = slugify(input.title);

  const projectPayload = {
    title: input.title,
    slug: baseSlug,
    category: input.category,
    description,
    client_name: input.clientName || null,
    project_url: input.projectUrl || null,
    featured: input.featured,
    status: input.status,
    cover_image: input.coverImageUrl,
  };

  let projectId = input.id;

  if (projectId) {
    const { error } = await supabase.from("portfolio_projects").update(projectPayload).eq("id", projectId);
    if (error) throw error;

    // Replace the image set — simplest way to persist reordering/removals.
    const { error: deleteImagesError } = await supabase
      .from("portfolio_images")
      .delete()
      .eq("project_id", projectId);
    if (deleteImagesError) throw deleteImagesError;
  } else {
    const { data, error } = await supabase
      .from("portfolio_projects")
      .insert(projectPayload)
      .select("id")
      .single();
    if (error) throw error;
    projectId = (data as { id: string }).id;
  }

  if (input.images.length > 0) {
    const { error: insertImagesError } = await supabase.from("portfolio_images").insert(
      input.images.map((img) => ({
        project_id: projectId,
        image_url: img.url,
        display_order: img.display_order,
      }))
    );
    if (insertImagesError) throw insertImagesError;
  }

  revalidatePublicAndAdmin(projectId);
  redirect("/admin/portfolio");
}

export async function deleteProjectAction(projectId: string) {
  const supabase = await assertAdmin();

  const { error: imagesError } = await supabase
    .from("portfolio_images")
    .delete()
    .eq("project_id", projectId);
  if (imagesError) throw imagesError;

  const { error: projectError } = await supabase
    .from("portfolio_projects")
    .delete()
    .eq("id", projectId);
  if (projectError) throw projectError;

  revalidatePublicAndAdmin();
}
