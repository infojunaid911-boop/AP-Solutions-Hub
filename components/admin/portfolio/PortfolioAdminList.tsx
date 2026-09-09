"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search, Pencil, Trash2, Eye, ImageOff, X, ExternalLink } from "lucide-react";
import type { PortfolioProject } from "@/lib/supabase/types";
import { unpackDescription } from "@/lib/portfolio/description";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { deleteProjectAction } from "@/app/admin/(dashboard)/portfolio/actions";

const TABS = ["All", "Websites", "Dashboards", "Graphic Design", "Digital Marketing", "3D Architecture"];

export default function PortfolioAdminList({ projects }: { projects: PortfolioProject[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [viewTarget, setViewTarget] = useState<PortfolioProject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioProject | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesTab = activeTab === "All" || p.category === activeTab;
      const matchesSearch = p.title.toLowerCase().includes(search.trim().toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [projects, activeTab, search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteProjectAction(deleteTarget.id);
      setDeleteTarget(null);
      router.refresh();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Couldn't delete this project.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink md:text-[1.7rem]">Portfolio</h1>
          <p className="mt-1.5 text-[14.5px] text-ink/55">Manage your creative work and projects.</p>
        </div>
        <Link
          href="/admin/portfolio/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-red"
        >
          <Plus size={16} strokeWidth={2.2} />
          Upload New Project
        </Link>
      </div>

      {/* Search + filters */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} strokeWidth={1.8} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-full border border-ink/12 bg-white py-2.5 pl-11 pr-4 text-[14px] text-ink outline-none transition-colors focus:border-ink"
          />
        </div>

        <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
          <div className="flex w-max gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors duration-200 ${
                  activeTab === tab
                    ? "border-ink bg-ink text-white"
                    : "border-ink/12 bg-white text-ink/60 hover:border-ink/30 hover:text-ink"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Masonry grid */}
      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-ink/15 bg-white px-6 py-20 text-center text-[14px] text-ink/45">
          {projects.length === 0 ? "No projects yet — upload your first one." : "No projects match your search."}
        </div>
      ) : (
        <div className="mt-8 columns-2 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
          {filtered.map((project) => (
            <div key={project.id} className="mb-4 break-inside-avoid">
              <ProjectCard
                project={project}
                onView={() => setViewTarget(project)}
                onDelete={() => {
                  setDeleteError(null);
                  setDeleteTarget(project);
                }}
              />
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete this project?"
        description={`"${deleteTarget?.title}" and all of its images will be permanently removed. This can't be undone.${
          deleteError ? `\n\n${deleteError}` : ""
        }`}
        confirmLabel="Delete Project"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ProjectPreviewModal project={viewTarget} onClose={() => setViewTarget(null)} />
    </div>
  );
}

function ProjectCard({
  project,
  onView,
  onDelete,
}: {
  project: PortfolioProject;
  onView: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-ink/8 bg-white">
      <div className="relative aspect-[4/3] bg-offwhite">
        {project.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.cover_image} alt={project.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink/20">
            <ImageOff size={22} strokeWidth={1.6} />
          </div>
        )}

        <div className="absolute left-3 top-3 flex items-center gap-2">
          <StatusBadge status={project.status} />
        </div>

        {/* Hover actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/0 opacity-0 transition-all duration-300 ease-premium group-hover:bg-ink/45 group-hover:opacity-100">
          <button
            onClick={onView}
            aria-label="View project"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink transition-transform hover:scale-105"
          >
            <Eye size={16} strokeWidth={1.8} />
          </button>
          <Link
            href={`/admin/portfolio/${project.id}/edit`}
            aria-label="Edit project"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink transition-transform hover:scale-105"
          >
            <Pencil size={16} strokeWidth={1.8} />
          </Link>
          <button
            onClick={onDelete}
            aria-label="Delete project"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-red transition-transform hover:scale-105"
          >
            <Trash2 size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <span className="text-[11px] font-medium uppercase tracking-wide text-red">{project.category}</span>
        <h3 className="mt-1 truncate font-display text-[15px] font-semibold text-ink">{project.title}</h3>
      </div>
    </div>
  );
}

function ProjectPreviewModal({ project, onClose }: { project: PortfolioProject | null; onClose: () => void }) {
  const unpacked = project ? unpackDescription(project.description) : null;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white"
          >
            <div className="relative aspect-[16/10] w-full bg-offwhite">
              {project.cover_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.cover_image} alt={project.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-ink/20">
                  <ImageOff size={26} strokeWidth={1.6} />
                </div>
              )}
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink hover:bg-white"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2">
                <span className="text-[11.5px] font-semibold uppercase tracking-wide text-red">
                  {project.category}
                </span>
                <StatusBadge status={project.status} />
                {project.featured && (
                  <span className="inline-flex items-center rounded-full bg-ink/5 px-2.5 py-1 text-[11px] font-semibold text-ink">
                    Featured
                  </span>
                )}
              </div>
              <h3 className="mt-2 font-display text-xl font-semibold text-ink">{project.title}</h3>
              {project.client_name && (
                <p className="mt-1 text-[13.5px] text-ink/50">Client: {project.client_name}</p>
              )}
              {unpacked?.detailed && (
                <p className="mt-4 text-[14px] leading-relaxed text-ink/65">{unpacked.detailed}</p>
              )}

              <div className="mt-6 flex items-center gap-3">
                <Link
                  href={`/admin/portfolio/${project.id}/edit`}
                  className="rounded-full bg-ink px-5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-red"
                >
                  Edit Project
                </Link>
                {project.project_url && (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[13.5px] font-semibold text-ink/60 transition-colors hover:text-ink"
                  >
                    Visit URL
                    <ExternalLink size={13} strokeWidth={2} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
