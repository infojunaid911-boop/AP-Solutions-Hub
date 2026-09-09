import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import ProjectForm, { type ProjectFormInitial } from "@/components/admin/portfolio/ProjectForm";
import type { UploaderImage } from "@/components/admin/portfolio/ImageUploader";
import { createClient } from "@/lib/supabase/server";
import { unpackDescription } from "@/lib/portfolio/description";
import type { PortfolioProject, PortfolioImage, PortfolioStatus } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: projectData }, { data: imagesData }] = await Promise.all([
    supabase
      .from("portfolio_projects")
      .select(
        "id, title, slug, category, description, client_name, project_url, featured, status, cover_image, created_at, updated_at"
      )
      .eq("id", id)
      .single(),
    supabase
      .from("portfolio_images")
      .select("id, project_id, image_url, display_order, created_at, updated_at")
      .eq("project_id", id)
      .order("display_order", { ascending: true }),
  ]);

  const project = projectData as PortfolioProject | null;
  if (!project) notFound();

  const images = (imagesData ?? []) as PortfolioImage[];
  const { short, detailed } = unpackDescription(project.description);

  const uploaderImages: UploaderImage[] = images.map((img) => ({
    id: img.id,
    previewUrl: img.image_url,
    remoteUrl: img.image_url,
    status: "done",
    progress: 100,
  }));

  const coverMatch = images.find((img) => img.image_url === project.cover_image);
  const coverId = coverMatch?.id ?? uploaderImages[0]?.id ?? null;

  const initial: ProjectFormInitial = {
    id: project.id,
    title: project.title,
    category: project.category,
    clientName: project.client_name ?? "",
    projectUrl: project.project_url ?? "",
    shortDescription: short,
    detailedDescription: detailed,
    featured: project.featured,
    status: project.status as PortfolioStatus,
    images: uploaderImages,
    coverId,
  };

  return (
    <div>
      <PageHeader title="Edit Project" description={`Editing "${project.title}"`} />
      <div className="mt-8 max-w-3xl">
        <ProjectForm initial={initial} />
      </div>
    </div>
  );
}
