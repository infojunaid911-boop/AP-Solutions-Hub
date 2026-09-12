"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, Upload, X } from "lucide-react";
import { slugify, type ServiceRow } from "@/components/admin/services/types";
import { SERVICE_ICON_NAMES, getServiceIcon } from "@/lib/service-icons";
import { uploadServiceImage } from "@/lib/supabase/storage";
import {
  createService,
  updateService,
  type ServiceInput,
} from "@/app/admin/(dashboard)/services/actions";

const EMPTY_FORM: ServiceInput = {
  name: "",
  slug: "",
  description: "",
  icon: "",
  image_url: null,
  featured: false,
  active: true,
  display_order: 1,
};

export default function ServiceForm({
  mode,
  service,
  nextDisplayOrder,
}: {
  mode: "create" | "edit";
  service?: ServiceRow;
  /** Suggested order for a brand-new service — existing count + 1. */
  nextDisplayOrder?: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [iconSearch, setIconSearch] = useState("");
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ServiceInput>(
    service
      ? {
          name: service.name,
          slug: service.slug,
          description: service.description ?? "",
          icon: service.icon ?? "",
          image_url: service.image_url,
          featured: service.featured,
          active: service.active,
          display_order: service.display_order,
        }
      : { ...EMPTY_FORM, display_order: nextDisplayOrder ?? 1 }
  );

  // Slug only auto-follows the name while the admin hasn't touched it
  // directly — once they edit the slug field by hand, typing in the name
  // stops overwriting it.
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  function handleNameChange(value: string) {
    setForm((f) => ({
      ...f,
      name: value,
      slug: slugTouched ? f.slug : slugify(value),
    }));
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadServiceImage(file);
      setForm((f) => ({ ...f, image_url: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        if (mode === "create") {
          await createService(form);
        } else if (service) {
          await updateService(service.id, form);
        }
        router.push("/admin/services");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  const filteredIcons = SERVICE_ICON_NAMES.filter((n) =>
    n.toLowerCase().includes(iconSearch.toLowerCase())
  );
  const SelectedIcon = getServiceIcon(form.icon);

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold text-ink">
        {mode === "create" ? "Add Service" : "Edit Service"}
      </h1>

      {error && <p className="rounded-md bg-red/10 px-3 py-2 text-sm text-red">{error}</p>}

      <div className="space-y-4 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <label className="block text-sm">
          <span className="mb-1 block text-ink/70">Service Name *</span>
          <input
            required
            placeholder="Digital Marketing"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full rounded-md border border-ink/15 px-3 py-2 text-sm"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-ink/70">Slug</span>
          <input
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              setForm((f) => ({ ...f, slug: e.target.value }));
            }}
            placeholder="digital-marketing"
            className="w-full rounded-md border border-ink/15 px-3 py-2 text-sm font-mono"
          />
          <span className="mt-1 block text-xs text-ink/40">
            Auto-generated from the name — edit it directly if you need something different.
          </span>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-ink/70">Description *</span>
          <textarea
            required
            rows={3}
            placeholder="Grow your audience and reach more customers with strategic digital marketing."
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full rounded-md border border-ink/15 px-3 py-2 text-sm"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-ink/70">Display Order</span>
          <input
            type="number"
            min={1}
            value={form.display_order}
            onChange={(e) =>
              setForm((f) => ({ ...f, display_order: Number(e.target.value) || 1 }))
            }
            className="w-24 rounded-md border border-ink/15 px-3 py-2 text-sm"
          />
          <span className="mt-1 block text-xs text-ink/40">
            Lower numbers show first. You can also drag services into order from the list.
          </span>
        </label>
      </div>

      <div className="space-y-3 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <span className="block text-sm font-medium text-ink">Icon</span>

        <button
          type="button"
          onClick={() => setIconPickerOpen((v) => !v)}
          className="flex items-center gap-3 rounded-md border border-ink/15 px-3 py-2 text-sm hover:bg-mist"
        >
          <SelectedIcon className="h-5 w-5 text-ink/70" />
          {form.icon || "Choose an icon"}
        </button>

        {iconPickerOpen && (
          <div className="rounded-md border border-ink/10 p-3">
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
              <input
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                placeholder="Search icons..."
                className="w-full rounded-md border border-ink/15 py-2 pl-9 pr-3 text-sm"
              />
            </div>
            <div className="grid max-h-56 grid-cols-6 gap-2 overflow-y-auto sm:grid-cols-8">
              {filteredIcons.map((name) => {
                const IconOption = getServiceIcon(name);
                return (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    onClick={() => {
                      setForm((f) => ({ ...f, icon: name }));
                      setIconPickerOpen(false);
                    }}
                    className={`flex h-10 w-10 items-center justify-center rounded-md border transition ${
                      form.icon === name
                        ? "border-red bg-red/10 text-red"
                        : "border-ink/10 text-ink/60 hover:bg-mist"
                    }`}
                  >
                    <IconOption className="h-5 w-5" />
                  </button>
                );
              })}
              {filteredIcons.length === 0 && (
                <p className="col-span-full py-4 text-center text-xs text-ink/40">
                  No icons match &quot;{iconSearch}&quot;.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <span className="block text-sm font-medium text-ink">Service Image</span>

        {form.image_url ? (
          <div className="relative w-fit">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.image_url}
              alt=""
              className="h-32 w-32 rounded-lg border border-ink/10 object-cover"
            />
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, image_url: null }))}
              className="absolute -right-2 -top-2 rounded-full bg-ink p-1 text-white hover:bg-red"
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="mt-2 block text-xs font-medium text-red hover:text-red/80"
            >
              Replace image
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-sm transition ${
              dragOver ? "border-red bg-red/5 text-red" : "border-ink/15 text-ink/40 hover:bg-mist"
            }`}
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <Upload className="h-6 w-6" />
                <span>Drag & drop an image, or click to browse</span>
              </>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
        />
      </div>

      <div className="flex flex-wrap gap-6 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <label className="flex items-center gap-3 text-sm">
          <span className="text-ink/70">Featured Service</span>
          <button
            type="button"
            role="switch"
            aria-checked={form.featured}
            onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
            className={`h-6 w-11 rounded-full transition ${form.featured ? "bg-red" : "bg-ink/15"}`}
          >
            <span
              className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white transition ${
                form.featured ? "translate-x-5" : ""
              }`}
            />
          </button>
        </label>

        <label className="flex items-center gap-3 text-sm">
          <span className="text-ink/70">Active Service</span>
          <button
            type="button"
            role="switch"
            aria-checked={form.active}
            onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
            className={`h-6 w-11 rounded-full transition ${form.active ? "bg-ink" : "bg-ink/15"}`}
          >
            <span
              className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white transition ${
                form.active ? "translate-x-5" : ""
              }`}
            />
          </button>
        </label>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/services")}
          className="rounded-md px-4 py-2 text-sm text-ink/60 hover:bg-mist"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending || uploading}
          className="flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90 disabled:opacity-50"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Service
        </button>
      </div>
    </form>
  );
}
