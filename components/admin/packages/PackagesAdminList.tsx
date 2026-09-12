"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import {
  SERVICE_CATEGORIES,
  type PackageRow,
} from "@/components/admin/packages/types";
import { deletePackage, setPackageActive } from "@/app/admin/(dashboard)/packages/actions";

const FILTERS = ["All", ...SERVICE_CATEGORIES] as const;
type Filter = (typeof FILTERS)[number];

export default function PackagesAdminList({ packages }: { packages: PackageRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<Filter>("All");
  const [pendingDelete, setPendingDelete] = useState<PackageRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  const visible = useMemo(
    () => (filter === "All" ? packages : packages.filter((p) => p.service_category === filter)),
    [packages, filter]
  );

  function handleToggleActive(pkg: PackageRow) {
    startTransition(async () => {
      try {
        await setPackageActive(pkg.id, !pkg.active);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    startTransition(async () => {
      try {
        await deletePackage(id);
        setPendingDelete(null);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Delete failed.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-ink">Packages</h1>
          <p className="mt-1 text-sm text-ink/50">
            Manage the packages and offers displayed on the AP Solutions Hub website.
          </p>
        </div>
        <Link
          href="/admin/packages/new"
          className="flex shrink-0 items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90"
        >
          <Plus className="h-4 w-4" />
          Add Package
        </Link>
      </div>

      {error && <p className="rounded-md bg-red/10 px-3 py-2 text-sm text-red">{error}</p>}

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              filter === f
                ? "bg-ink text-white"
                : "bg-mist text-ink/60 hover:bg-ink/10"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.length === 0 && (
          <p className="col-span-full rounded-lg border border-dashed border-ink/15 p-8 text-center text-sm text-ink/40">
            No packages in this category yet.
          </p>
        )}

        {visible.map((pkg) => (
          <div
            key={pkg.id}
            className={`flex flex-col gap-3 rounded-lg border bg-white p-4 shadow-sm ${
              pkg.featured ? "border-red/40 ring-1 ring-red/20" : "border-ink/10"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-ink">{pkg.package_name}</p>
                <p className="text-xs uppercase tracking-wide text-ink/40">
                  {pkg.service_category}
                </p>
              </div>
              {pkg.featured && (
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-red/10 px-2 py-0.5 text-xs font-medium text-red">
                  <Star className="h-3 w-3 fill-red" />
                  Featured
                </span>
              )}
            </div>

            <p className="text-sm text-ink/70">
              {pkg.price_label || <span className="text-ink/30">No price label set</span>}
            </p>

            <div className="flex items-center gap-2 text-xs text-ink/50">
              <span
                className={`rounded-full px-2 py-0.5 font-medium ${
                  pkg.active ? "bg-ink/5 text-ink/70" : "bg-mist text-ink/40"
                }`}
              >
                {pkg.active ? "Active" : "Inactive"}
              </span>
              <span>
                {pkg.features.length} feature{pkg.features.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="mt-auto flex items-center justify-between gap-2 pt-2">
              <button
                onClick={() => handleToggleActive(pkg)}
                disabled={isPending}
                className="rounded-md border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink/70 hover:bg-mist disabled:opacity-50"
              >
                {pkg.active ? "Deactivate" : "Activate"}
              </button>

              <div className="flex gap-1">
                <Link
                  href={`/admin/packages/${pkg.id}/edit`}
                  className="rounded-md p-1.5 text-ink/50 hover:bg-mist hover:text-ink"
                  aria-label="Edit package"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => setPendingDelete(pkg)}
                  className="rounded-md p-1.5 text-ink/50 hover:bg-red/10 hover:text-red"
                  aria-label="Delete package"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-lg">
            <p className="font-semibold text-ink">
              Delete &quot;{pendingDelete.package_name}&quot;?
            </p>
            <p className="mt-1 text-sm text-ink/50">This action cannot be undone.</p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setPendingDelete(null)}
                disabled={isPending}
                className="rounded-md px-4 py-2 text-sm text-ink/60 hover:bg-mist"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isPending}
                className="flex items-center gap-2 rounded-md bg-red px-4 py-2 text-sm font-medium text-white hover:bg-red/90 disabled:opacity-50"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
