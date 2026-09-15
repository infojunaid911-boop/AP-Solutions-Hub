import { createClient } from "@/lib/supabase/server";
import { unpackDescription } from "./description";

export type PublicPortfolioItem = {
  id: string;
  title: string;
  category: string;
  coverImage: string;
  images: string[];
  client: string;
  services: string[];
  description: string;
};

// Reads live from Supabase on every request (the server client here touches
// cookies(), which already opts callers out of static caching) — so
// anything published in the admin panel appears immediately, with no
// redeploy or code change needed.
//
// `limit` is optional: pass it for a bounded preview (e.g. the homepage
// section), omit it for the full /portfolio archive. Ordered newest-first
// either way, so a limited call always returns the most recently uploaded
// work.
export async function getPublishedPortfolioItems(
  limit?: number
): Promise<PublicPortfolioItem[]> {
  const supabase = await createClient();

  let query = supabase
    .from("portfolio_projects")
    .select("id, title, category, description, client_name, cover_image")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data: projectsData } = await query;

  const projects = projectsData ?? [];
  const projectIds = projects.map((p) => p.id);

  const imagesByProject = new Map<string, string[]>();
  if (projectIds.length > 0) {
    const { data: imagesData } = await supabase
      .from("portfolio_images")
      .select("project_id, image_url, display_order")
      .in("project_id", projectIds)
      .order("display_order", { ascending: true });

    (imagesData ?? []).forEach((img) => {
      const list = imagesByProject.get(img.project_id) ?? [];
      list.push(img.image_url);
      imagesByProject.set(img.project_id, list);
    });
  }

  return projects
    .map((project) => {
      const gallery = imagesByProject.get(project.id) ?? [];
      const coverImage = project.cover_image ?? gallery[0] ?? null;
      if (!coverImage) return null; // no image to show — skip rather than break the grid

      const { detailed, short } = unpackDescription(project.description);

      return {
        id: project.id,
        title: project.title,
        category: project.category,
        coverImage,
        images: gallery.length > 0 ? gallery : [coverImage],
        client: project.client_name || "Confidential",
        services: [project.category],
        description: detailed || short,
      };
    })
    .filter((item): item is PublicPortfolioItem => item !== null);
}
