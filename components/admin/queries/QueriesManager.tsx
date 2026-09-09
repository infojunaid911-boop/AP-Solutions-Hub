"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Inbox, Mail, MessageCircle, Search, X } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  updateInquiryNotesAction,
  updateInquiryStatusAction,
} from "@/app/admin/(dashboard)/queries/actions";
import { emailHref, whatsappHref } from "@/lib/inquiries";
import {
  INQUIRY_STATUS_LABELS,
  INQUIRY_STATUSES,
  type Inquiry,
  type InquiryStatus,
} from "@/lib/supabase/types";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export default function QueriesManager({
  inquiries,
  initialId,
}: {
  inquiries: Inquiry[];
  initialId?: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | InquiryStatus>("all");
  const [selectedId, setSelectedId] = useState<string | null>(initialId ?? null);

  const selected = inquiries.find((item) => item.id === selectedId) ?? null;

  const stats = useMemo(
    () => ({
      new: inquiries.filter((i) => i.status === "new").length,
      contacted: inquiries.filter((i) => i.status === "contacted").length,
      discussion: inquiries.filter((i) => i.status === "discussion").length,
      converted: inquiries.filter((i) => i.status === "converted").length,
    }),
    [inquiries]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inquiries.filter((item) => {
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.service ?? "").toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        (item.business_name ?? "").toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [inquiries, search, statusFilter]);

  useEffect(() => {
    if (initialId && inquiries.some((item) => item.id === initialId)) {
      setSelectedId(initialId);
    }
  }, [initialId, inquiries]);

  return (
    <div>
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink md:text-[1.7rem]">Queries</h1>
        <p className="mt-1.5 text-[14.5px] text-ink/55">Track and follow up on customer inquiries.</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "New Queries", value: stats.new, key: "new" as const },
          { label: "Contacted", value: stats.contacted, key: "contacted" as const },
          { label: "In Discussion", value: stats.discussion, key: "discussion" as const },
          { label: "Converted", value: stats.converted, key: "converted" as const },
        ].map((card) => (
          <button
            key={card.label}
            onClick={() => setStatusFilter(statusFilter === card.key ? "all" : card.key)}
            className={`rounded-2xl border bg-white p-5 text-left transition-colors ${
              statusFilter === card.key ? "border-ink" : "border-ink/8 hover:border-ink/15"
            }`}
          >
            <p className="font-display text-3xl font-bold text-ink">{card.value}</p>
            <p className="mt-1 text-[13.5px] font-medium text-ink/50">{card.label}</p>
          </button>
        ))}
      </div>

      <div className="mt-8 relative w-full sm:max-w-xs">
        <Search size={16} strokeWidth={1.8} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, service..."
          className="w-full rounded-full border border-ink/12 bg-white py-2.5 pl-11 pr-4 text-[14px] text-ink outline-none transition-colors focus:border-ink"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink/8 bg-white">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center text-[14px] text-ink/45">
            <Inbox size={22} strokeWidth={1.6} className="mb-3 text-ink/25" />
            {inquiries.length === 0 ? "No inquiries yet." : "No inquiries match your search."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-ink/8 text-[11.5px] font-semibold uppercase tracking-wide text-ink/40">
                  <th className="px-6 py-3 font-medium">Customer Name</th>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Budget</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    className={`border-b border-ink/6 last:border-0 ${
                      inquiry.status === "new" ? "bg-red/[0.045]" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <p className="text-[14px] font-medium text-ink">{inquiry.name}</p>
                      {inquiry.business_name && (
                        <p className="text-[12.5px] text-ink/45">{inquiry.business_name}</p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-[13.5px] text-ink/60">{inquiry.service ?? "—"}</td>
                    <td className="px-4 py-4 text-[13.5px] text-ink/60">{inquiry.budget ?? "—"}</td>
                    <td className="px-4 py-4 text-[13.5px] text-ink/50">
                      {dateFormatter.format(new Date(inquiry.created_at))}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={inquiry.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedId(inquiry.id)}
                        className="text-[13px] font-semibold text-ink/60 transition-colors hover:text-red"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <InquiryDrawer
        inquiry={selected}
        onClose={() => setSelectedId(null)}
        onSaved={() => router.refresh()}
      />
    </div>
  );
}

function InquiryDrawer({
  inquiry,
  onClose,
  onSaved,
}: {
  inquiry: Inquiry | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<InquiryStatus>("new");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!inquiry) return;
    setNotes(inquiry.admin_notes ?? "");
    setStatus(inquiry.status);
    setError(null);
  }, [inquiry]);

  const save = (nextStatus = status, nextNotes = notes) => {
    if (!inquiry) return;
    setError(null);
    startTransition(async () => {
      try {
        if (nextStatus !== inquiry.status) {
          await updateInquiryStatusAction(inquiry.id, nextStatus);
        }
        if (nextNotes !== (inquiry.admin_notes ?? "")) {
          await updateInquiryNotesAction(inquiry.id, nextNotes);
        }
        onSaved();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't save changes.");
      }
    });
  };

  return (
    <AnimatePresence>
      {inquiry && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-ink/50"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-ink/8 px-6 py-5">
              <div>
                <h2 className="font-display text-[17px] font-semibold text-ink">Inquiry details</h2>
                <p className="text-[12.5px] text-ink/45">Internal notes stay private to admins.</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/12 text-ink"
              >
                <X size={16} strokeWidth={1.8} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <dl className="space-y-4 text-[14px]">
                <Row label="Full Name" value={inquiry.name} />
                <Row label="Business Name" value={inquiry.business_name} />
                <Row label="Email" value={inquiry.email} />
                <Row label="WhatsApp Number" value={inquiry.whatsapp} />
                <Row label="Service Requested" value={inquiry.service} />
                <Row label="Budget" value={inquiry.budget} />
                <Row label="Submission Date" value={dateFormatter.format(new Date(inquiry.created_at))} />
              </dl>

              <div className="mt-6">
                <p className="mb-1.5 text-[12px] font-medium uppercase tracking-wide text-ink/45">
                  Project Description
                </p>
                <p className="whitespace-pre-wrap rounded-xl border border-ink/8 bg-offwhite p-4 text-[14px] leading-relaxed text-ink/70">
                  {inquiry.message || "—"}
                </p>
              </div>

              <label className="mt-6 block">
                <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-wide text-ink/45">
                  Status
                </span>
                <select
                  value={status}
                  onChange={(e) => {
                    const next = e.target.value as InquiryStatus;
                    setStatus(next);
                    save(next, notes);
                  }}
                  className="w-full rounded-xl border border-ink/12 bg-white px-4 py-3 text-[14px] outline-none focus:border-ink"
                >
                  {INQUIRY_STATUSES.map((value) => (
                    <option key={value} value={value}>
                      {INQUIRY_STATUS_LABELS[value]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-5 block">
                <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-wide text-ink/45">
                  Internal Admin Notes
                </span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={5}
                  placeholder="Private notes — never shown on the public website."
                  className="w-full resize-none rounded-xl border border-ink/12 bg-white px-4 py-3 text-[14px] outline-none focus:border-ink"
                />
              </label>

              {error && <p className="mt-3 text-[13px] text-red">{error}</p>}
            </div>

            <div className="border-t border-ink/8 px-6 py-5">
              <div className="flex flex-wrap gap-2">
                {inquiry.whatsapp && (
                  <a
                    href={whatsappHref(inquiry.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-4 py-3 text-[13.5px] font-semibold text-white hover:bg-red"
                  >
                    <MessageCircle size={15} strokeWidth={1.8} />
                    WhatsApp
                  </a>
                )}
                <a
                  href={emailHref(inquiry.email, inquiry.name)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-ink/12 px-4 py-3 text-[13.5px] font-semibold text-ink hover:border-ink/30"
                >
                  <Mail size={15} strokeWidth={1.8} />
                  Email
                </a>
              </div>
              <button
                onClick={() => save()}
                disabled={pending}
                className="mt-3 w-full rounded-full border border-ink/12 py-3 text-[13.5px] font-semibold text-ink disabled:opacity-60"
              >
                {pending ? "Saving..." : "Save notes"}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-[12px] font-medium uppercase tracking-wide text-ink/40">{label}</dt>
      <dd className="mt-0.5 text-ink">{value || "—"}</dd>
    </div>
  );
}
