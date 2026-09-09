"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { PORTFOLIO_CATEGORIES, type PortfolioStatus } from "@/lib/supabase/types";
import { upsertProjectAction, type ProjectFormInput } from "@/app/admin/(dashboard)/portfolio/actions";
import ImageUploader, { type UploaderImage } from "./ImageUploader";

export type ProjectFormInitial = {
  id?: string;
  title: string;
  category: string;
  clientName: string;
  projectUrl: string;
  shortDescription: string;
  detailedDescription: string;
  featured: boolean;
  status: PortfolioStatus;
  images: UploaderImage[];
  coverId: string | null;
};

const EMPTY: ProjectFormInitial = {
  title: "",
  category: PORTFOLIO_CATEGORIES[0],
  clientName: "",
  projectUrl: "",
  shortDescription: "",
  detailedDescription: "",
  featured: false,
  status: "draft",
  images: [],
  coverId: null,
};

export default function ProjectForm({ initial }: { initial?: ProjectFormInitial }) {
  const data = initial ?? EMPTY;
  const isEdit = Boolean(data.id);

  const [title, setTitle] = useState(data.title);
  const [category, setCategory] = useState(data.category);
  const [clientName, setClientName] = useState(data.clientName);
  const [projectUrl, setProjectUrl] = useState(data.projectUrl);
  const [shortDescription, setShortDescription] = useState(data.shortDescription);
  const [detailedDescription, setDetailedDescription] = useState(data.detailedDescription);
  const [featured, setFeatured] = useState(data.featured);
  const [status, setStatus] = useState<PortfolioStatus>(data.status === "archived" ? "draft" : data.status);
  const [images, setImages] = useState<UploaderImage[]>(data.images);
  const [coverId, setCoverId] = useState<string | null>(data.coverId);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const folderKeyRef = useRef(data.id ?? crypto.randomUUID());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Give the project a title before publishing.");
      return;
    }
    if (images.some((img) => img.status === "uploading")) {
      setError("Hang on — some images are still uploading.");
      return;
    }

    const readyImages = images.filter((img) => img.status === "done" && img.remoteUrl);
    const coverImageUrl =
      readyImages.find((img) => img.id === coverId)?.remoteUrl ?? readyImages[0]?.remoteUrl ?? null;

    const input: ProjectFormInput = {
      id: data.id,
      title: title.trim(),
      category,
      clientName: clientName.trim(),
      projectUrl: projectUrl.trim(),
      shortDescription: shortDescription.trim(),
      detailedDescription: detailedDescription.trim(),
      featured,
      status,
      images: readyImages.map((img, i) => ({ url: img.remoteUrl as string, display_order: i })),
      coverImageUrl,
    };

    setSubmitting(true);
    try {
      await upsertProjectAction(input);
    } catch (err: unknown) {
      // Server Actions signal redirects by throwing — let Next handle those.
      if (err && typeof err === "object" && "digest" in err && String(err.digest).startsWith("NEXT_REDIRECT")) {
        throw err;
      }
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-ink/12 bg-white px-4 py-3 text-[14.5px] text-ink outline-none transition-colors duration-200 placeholder:text-ink/30 focus:border-ink";

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-6 rounded-xl border border-red/25 bg-red/5 px-4 py-3 text-[13.5px] text-red">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-ink/8 bg-white p-6 md:p-8">
        <h2 className="font-display text-[16px] font-semibold text-ink">Project Details</h2>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-wide text-ink/45">
              Project Title
            </span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Coastline Restaurant Website"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-wide text-ink/45">
              Category
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`${inputClass} appearance-none`}
            >
              {PORTFOLIO_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-wide text-ink/45">
              Client Name
            </span>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Coastline Restaurant Group"
              className={inputClass}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-wide text-ink/45">
              Project URL
            </span>
            <input
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              placeholder="https://"
              className={inputClass}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-wide text-ink/45">
              Short Description
            </span>
            <textarea
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="One or two sentences — shown on project cards."
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-wide text-ink/45">
              Detailed Description
            </span>
            <textarea
              value={detailedDescription}
              onChange={(e) => setDetailedDescription(e.target.value)}
              placeholder="The full write-up — shown in the project's detail view."
              rows={5}
              className={`${inputClass} resize-none`}
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-5 border-t border-ink/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={featured}
              onClick={() => setFeatured((v) => !v)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                featured ? "bg-red" : "bg-mist"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  featured ? "translate-x-[22px]" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className="text-[14px] font-medium text-ink">Featured Project</span>
          </label>

          <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-offwhite p-1">
            {(["draft", "published"] as PortfolioStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`rounded-full px-4 py-2 text-[13px] font-semibold capitalize transition-colors duration-200 ${
                  status === s ? "bg-ink text-white" : "text-ink/50 hover:text-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-ink/8 bg-white p-6 md:p-8">
        <h2 className="font-display text-[16px] font-semibold text-ink">Project Images</h2>
        <div className="mt-6">
          <ImageUploader
            images={images}
            onChange={setImages}
            folderKey={folderKeyRef.current}
            coverId={coverId}
            onCoverChange={setCoverId}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <Link
          href="/admin/portfolio"
          className="rounded-full px-6 py-3.5 text-[14px] font-semibold text-ink/60 transition-colors hover:text-ink"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 text-[14.5px] font-semibold text-white transition-colors duration-200 hover:bg-red disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting && <Loader2 size={16} className="animate-spin" strokeWidth={2} />}
          {submitting ? "Saving..." : isEdit ? "Save Changes" : "Publish Project"}
        </button>
      </div>
    </form>
  );
}
