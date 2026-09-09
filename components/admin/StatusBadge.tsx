const STATUS_STYLES: Record<string, string> = {
  // inquiries.status
  new: "bg-red text-white",
  contacted: "bg-ink text-white",
  discussion: "border border-ink/15 text-ink/70",
  converted: "bg-ink text-white",
  closed: "bg-mist text-ink/40",
  // portfolio_projects.status
  draft: "border border-ink/15 text-ink/50",
  published: "bg-ink text-white",
  archived: "bg-mist text-ink/40",
};

export default function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? "border border-ink/15 text-ink/50";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize tracking-wide ${style}`}
    >
      {status}
    </span>
  );
}
