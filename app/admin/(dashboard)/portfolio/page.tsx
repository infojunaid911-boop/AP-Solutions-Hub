import { createClient } from "@/lib/supabase/server";
import type { PortfolioProject } from "@/lib/supabase/types";
import PortfolioAdminList from "@/components/admin/portfolio/PortfolioAdminList";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("portfolio_projects")
    .select(
      "id, title, slug, category, description, client_name, project_url, featured, status, cover_image, created_at, updated_at"
    )
    .order("created_at", { ascending: false });

  const projects = (data ?? []) as PortfolioProject[];

  return <PortfolioAdminList projects={projects} />;
}
