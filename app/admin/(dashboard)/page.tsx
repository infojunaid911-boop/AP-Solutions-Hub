import Link from "next/link";
import { FolderKanban, Inbox, Star, Package, ArrowUpRight, ImageOff } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/admin/StatusBadge";

type InquiryRow = {
  id: string;
  name: string;
  service: string;
  budget: string;
  status: string;
  created_at: string;
};

type ProjectRow = {
  id: string;
  title: string;
  category: string;
  status: string;
  cover_image: string | null;
  featured: boolean;
  created_at: string;
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    totalProjectsRes,
    newQueriesRes,
    totalReviewsRes,
    activePackagesRes,
    recentInquiriesRes,
    recentProjectsRes,
  ] = await Promise.all([
    supabase.from("portfolio_projects").select("*", { count: "exact", head: true }),
    supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("reviews").select("*", { count: "exact", head: true }),
    supabase.from("packages").select("*", { count: "exact", head: true }).eq("active", true),
    supabase
      .from("inquiries")
      .select("id, name, service, budget, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("portfolio_projects")
      .select("id, title, category, status, cover_image, featured, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const cards = [
    { label: "Total Projects", value: totalProjectsRes.count ?? 0, icon: FolderKanban },
    { label: "New Queries", value: newQueriesRes.count ?? 0, icon: Inbox },
    { label: "Total Reviews", value: totalReviewsRes.count ?? 0, icon: Star },
    { label: "Active Packages", value: activePackagesRes.count ?? 0, icon: Package },
  ];

  const inquiries = (recentInquiriesRes.data ?? []) as InquiryRow[];
  const projects = (recentProjectsRes.data ?? []) as ProjectRow[];

  const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div>
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink md:text-[1.7rem]">Dashboard</h1>
        <p className="mt-1.5 text-[14.5px] text-ink/55">
          A quick overview of AP Solutions Hub&apos;s activity.
        </p>
      </div>

      {/* Overview cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-ink/8 bg-white p-6 transition-colors duration-200 hover:border-ink/15"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red/[0.08] text-red">
                <Icon size={18} strokeWidth={1.8} />
              </span>
            </div>
            <p className="mt-5 font-display text-3xl font-bold text-ink">{value}</p>
            <p className="mt-1 text-[13.5px] font-medium text-ink/50">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent inquiries */}
      <div className="mt-10 rounded-2xl border border-ink/8 bg-white">
        <div className="flex items-center justify-between border-b border-ink/8 px-6 py-5">
          <h2 className="font-display text-[16px] font-semibold text-ink">Recent Inquiries</h2>
          <Link
            href="/admin/queries"
            className="flex items-center gap-1 text-[13px] font-semibold text-ink/50 transition-colors hover:text-red"
          >
            View all
            <ArrowUpRight size={13} strokeWidth={2} />
          </Link>
        </div>

        {inquiries.length === 0 ? (
          <p className="px-6 py-10 text-center text-[14px] text-ink/45">No inquiries yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-ink/8 text-[11.5px] font-semibold uppercase tracking-wide text-ink/40">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Budget</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="border-b border-ink/6 last:border-0">
                    <td className="px-6 py-4 text-[14px] font-medium text-ink">{inquiry.name}</td>
                    <td className="px-4 py-4 text-[13.5px] text-ink/60">{inquiry.service}</td>
                    <td className="px-4 py-4 text-[13.5px] text-ink/60">{inquiry.budget}</td>
                    <td className="px-4 py-4 text-[13.5px] text-ink/50">
                      {dateFormatter.format(new Date(inquiry.created_at))}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={inquiry.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href="/admin/queries"
                        className="text-[13px] font-semibold text-ink/60 transition-colors hover:text-red"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent portfolio projects */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[16px] font-semibold text-ink">Recent Portfolio Projects</h2>
          <Link
            href="/admin/portfolio"
            className="flex items-center gap-1 text-[13px] font-semibold text-ink/50 transition-colors hover:text-red"
          >
            View all
            <ArrowUpRight size={13} strokeWidth={2} />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-ink/15 bg-white px-6 py-14 text-center text-[14px] text-ink/45">
            No portfolio projects yet.
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project.id} className="overflow-hidden rounded-2xl border border-ink/8 bg-white">
                <div className="relative aspect-[4/3] bg-offwhite">
                  {project.cover_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-ink/20">
                      <ImageOff size={22} strokeWidth={1.6} />
                    </div>
                  )}
                  <div className="absolute left-3 top-3">
                    <StatusBadge status={project.status} />
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-[11.5px] font-medium uppercase tracking-wide text-red">
                    {project.category}
                  </span>
                  <h3 className="mt-1 truncate font-display text-[15px] font-semibold text-ink">
                    {project.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
