"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Loader2, Plus, X } from "lucide-react";
import { SERVICE_CATEGORIES, type PackageRow } from "@/components/admin/packages/types";
import { createPackage, updatePackage, type PackageInput } from "@/app/admin/(dashboard)/packages/actions";

const EMPTY_FORM: PackageInput = {
  service_category: "",
  package_name: "",
  description: "",
  features: [""],
  price_label: "",
  featured: false,
  active: true,
};

export default function PackageForm({
  mode,
  pkg,
}: {
  mode: "create" | "edit";
  pkg?: PackageRow;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<PackageInput>(
    pkg
      ? {
          service_category: pkg.service_category,
          package_name: pkg.package_name,
          description: pkg.description ?? "",
          features: pkg.features.length > 0 ? pkg.features : [""],
          price_label: pkg.price_label ?? "",
          featured: pkg.featured,
          active: pkg.active,
        }
      : EMPTY_FORM
  );

  function updateFeature(index: number, value: string) {
    setForm((f) => {
      const features = [...f.features];
      features[index] = value;
      return { ...f, features };
    });
  }

  function addFeature() {
    setForm((f) => ({ ...f, features: [...f.features, ""] }));
  }

  function removeFeature(index: number) {
    setForm((f) => ({ ...f, features: f.features.filter((_, i) => i !== index) }));
  }

  function moveFeature(index: number, direction: -1 | 1) {
    setForm((f) => {
      const target = index + direction;
      if (target < 0 || target >= f.features.length) return f;
      const features = [...f.features];
      [features[index], features[target]] = [features[target], features[index]];
      return { ...f, features };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        // Blank rows (e.g. a "+ Add Feature" the admin never filled in)
        // are dropped server-side in validate(), so no need to filter here.
        if (mode === "create") {
          await createPackage(form);
        } else if (pkg) {
          await updatePackage(pkg.id, form);
        }
        router.push("/admin/packages");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold text-ink">
        {mode === "create" ? "Add Package" : "Edit Package"}
      </h1>

      {error && <p className="rounded-md bg-red/10 px-3 py-2 text-sm text-red">{error}</p>}

      <div className="space-y-4 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <label className="block text-sm">
          <span className="mb-1 block text-ink/70">Service Category *</span>
          <select
            required
            value={form.service_category}
            onChange={(e) => setForm((f) => ({ ...f, service_category: e.target.value }))}
            className="w-full rounded-md border border-ink/15 px-3 py-2 text-sm"
          >
            <option value="" disabled>
              Choose a category
            </option>
            {SERVICE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-ink/70">Package Name *</span>
          <input
            required
            placeholder="Starter, Business, Premium..."
            value={form.package_name}
            onChange={(e) => setForm((f) => ({ ...f, package_name: e.target.value }))}
            className="w-full rounded-md border border-ink/15 px-3 py-2 text-sm"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-ink/70">Description</span>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full rounded-md border border-ink/15 px-3 py-2 text-sm"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-ink/70">Price Label</span>
          <input
            placeholder='e.g. "Starting From $XXX", "Custom Quote", "Contact Us"'
            value={form.price_label}
            onChange={(e) => setForm((f) => ({ ...f, price_label: e.target.value }))}
            className="w-full rounded-md border border-ink/15 px-3 py-2 text-sm"
          />
          <span className="mt-1 block text-xs text-ink/40">
            Leave blank if this package shouldn&apos;t show a price.
          </span>
        </label>
      </div>

      <div className="space-y-3 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <span className="block text-sm font-medium text-ink">Features</span>

        <div className="space-y-2">
          {form.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => moveFeature(index, -1)}
                  disabled={index === 0}
                  className="text-ink/30 hover:text-ink disabled:opacity-20"
                  aria-label="Move feature up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveFeature(index, 1)}
                  disabled={index === form.features.length - 1}
                  className="text-ink/30 hover:text-ink disabled:opacity-20"
                  aria-label="Move feature down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <input
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                placeholder="e.g. Mobile Responsive"
                className="flex-1 rounded-md border border-ink/15 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => removeFeature(index)}
                disabled={form.features.length === 1}
                className="rounded-md p-2 text-ink/40 hover:bg-red/10 hover:text-red disabled:opacity-20"
                aria-label="Remove feature"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addFeature}
          className="flex items-center gap-1.5 text-sm font-medium text-red hover:text-red/80"
        >
          <Plus className="h-4 w-4" />
          Add Feature
        </button>
      </div>

      <div className="flex flex-wrap gap-6 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <label className="flex items-center gap-3 text-sm">
          <span className="text-ink/70">Featured Package</span>
          <button
            type="button"
            role="switch"
            aria-checked={form.featured}
            onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
            className={`h-6 w-11 rounded-full transition ${
              form.featured ? "bg-red" : "bg-ink/15"
            }`}
          >
            <span
              className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white transition ${
                form.featured ? "translate-x-5" : ""
              }`}
            />
          </button>
        </label>

        <label className="flex items-center gap-3 text-sm">
          <span className="text-ink/70">Active Package</span>
          <button
            type="button"
            role="switch"
            aria-checked={form.active}
            onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
            className={`h-6 w-11 rounded-full transition ${
              form.active ? "bg-ink" : "bg-ink/15"
            }`}
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
          onClick={() => router.push("/admin/packages")}
          className="rounded-md px-4 py-2 text-sm text-ink/60 hover:bg-mist"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90 disabled:opacity-50"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "create" ? "Add Package" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
