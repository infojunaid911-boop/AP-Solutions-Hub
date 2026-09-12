"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GripVertical, Loader2, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import type { ServiceRow } from "@/components/admin/services/types";
import { getServiceIcon } from "@/lib/service-icons";
import {
  deleteService,
  reorderServices,
  setServiceActive,
  setServiceOrder,
} from "@/app/admin/(dashboard)/services/actions";

const FILTERS = ["All", "Active", "Inactive", "Featured"] as const;
type FilterOption = (typeof FILTERS)[number];

export default function ServicesAdminList({ services }: { services: ServiceRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<FilterOption>("All");
  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState<ServiceRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Local copy so a drag can reorder the list instantly, before the
  // server round-trip finishes.
  const [ordered, setOrdered] = useState(services);
  const dragIndex = useState<{ current: number | null }>({ current: null })[0];

  const isFiltering = filter !== "All" || query.trim().length > 0;

  const visible = useMemo(() => {
    let list = ordered;
    if (filter === "Active") list = list.filter((s) => s.active);
    if (filter === "Inactive") list = list.filter((s) => !s.active);
    if (filter === "Featured") list = list.filter((s) => s.featured);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((s) => s.name.toLowerCase().includes(q));
    return list;
  }, [ordered, filter, query]);

  function handleDrop(targetIndex: number) {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from === null || from === targetIndex) return;

    const next = [...ordered];
    const [moved] = next.splice(from, 1);
    next.splice(targetIndex, 0, moved);
    setOrdered(next);

    startTransition(async () => {
      try {
        await reorderServices(next.map((s) => s.id));
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Reorder failed.");
      }
    });
  }

  function handleOrderInput(service: ServiceRow, value: string) {
    const next = Number(value);
    if (!Number.isFinite(next) || next < 1) return;
    startTransition(async () => {
      try {
        await setServiceOrder(service.id, next);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  function handleToggleActive(service: ServiceRow) {
    startTransition(async () => {
      try {
        await setServiceActive(service.id, !service.active);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    const { id, image_url } = pendingDelete;
    startTransition(async () => {
      try {
        await deleteService(id, image_url);
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
          <h1 className="text-xl font-semibold text-ink">Services</h1>
          <p className="mt-1 text-sm text-ink/50">
            Manage the services displayed on the AP Solutions Hub website.
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="flex shrink-0 items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </Link>
      </div>

      {error && <p className="rounded-md bg-red/10 px-3 py-2 text-sm text-red">{error}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                filter === f ? "bg-ink text-white" : "bg-mist text-ink/60 hover:bg-ink/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services..."
            className="w-full rounded-md border border-ink/15 py-2 pl-9 pr-3 text-sm"
          />
        </div>
      </div>

      {isFiltering && (
        <p className="text-xs text-ink/40">
          Drag-and-drop reordering is only available with no filter or search applied —
          the number field on each row still works.
        </p>
      )}

      <div className="divide-y divide-ink/10 rounded-lg border border-ink/10 bg-white">
        {visible.length === 0 && (
          <p className="p-6 text-center text-sm text-ink/40">
            {ordered.length === 0 ? "No services yet — add your first one above." : "No services match."}
          </p>
        )}

        {visible.map((service, i) => {
          const Icon = getServiceIcon(service.icon);
          const realIndex = ordered.findIndex((s) => s.id === service.id);

          return (
            <div
              key={service.id}
              draggable={!isFiltering}
              onDragStart={() => {
                dragIndex.current = realIndex;
              }}
              onDragOver={(e) => {
                if (!isFiltering) e.preventDefault();
              }}
              onDrop={() => handleDrop(realIndex)}
              className={`flex items-center gap-4 p-4 ${!isFiltering ? "cursor-grab active:cursor-grabbing" : ""}`}
            >
              {!isFiltering && <GripVertical className="h-4 w-4 shrink-0 text-ink/25" />}

              <input
                type="number"
                min={1}
                defaultValue={service.display_order}
                onBlur={(e) => handleOrderInput(service, e.target.value)}
                disabled={isPending}
                className="w-14 shrink-0 rounded-md border border-ink/15 px-2 py-1 text-center text-sm"
                aria-label={`Display order for ${service.name}`}
              />

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-ink/10 bg-mist">
                <Icon className="h-5 w-5 text-ink/70" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-ink">{service.name}</p>
                  {service.featured && (
                    <span className="flex items-center gap-1 rounded-full bg-red/10 px-2 py-0.5 text-xs font-medium text-red">
                      <Star className="h-3 w-3 fill-red" />
                      Featured
                    </span>
                  )}
                  {!service.active && (
                    <span className="rounded-full bg-mist px-2 py-0.5 text-xs font-medium text-ink/40">
                      Inactive
                    </span>
                  )}
                </div>
                {service.description && (
                  <p className="mt-1 line-clamp-1 text-sm text-ink/50">{service.description}</p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => handleToggleActive(service)}
                  disabled={isPending}
                  className="rounded-md border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink/70 hover:bg-mist disabled:opacity-50"
                >
                  {service.active ? "Deactivate" : "Activate"}
                </button>
                <Link
                  href={`/admin/services/${service.id}/edit`}
                  className="rounded-md p-1.5 text-ink/50 hover:bg-mist hover:text-ink"
                  aria-label="Edit service"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => setPendingDelete(service)}
                  className="rounded-md p-1.5 text-ink/50 hover:bg-red/10 hover:text-red"
                  aria-label="Delete service"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-lg">
            <p className="font-semibold text-ink">Delete &quot;{pendingDelete.name}&quot;?</p>
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
