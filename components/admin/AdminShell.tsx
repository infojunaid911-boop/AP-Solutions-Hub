"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Inbox,
  Star,
  Package,
  Layers,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";

type NavLeaf = { label: string; href: string };
type NavItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  children?: NavLeaf[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  {
    label: "Portfolio",
    icon: FolderKanban,
    children: [
      { label: "All Projects", href: "/admin/portfolio" },
      { label: "Add Project", href: "/admin/portfolio/new" },
    ],
  },
  { label: "Queries", icon: Inbox, href: "/admin/queries" },
  { label: "Reviews", icon: Star, href: "/admin/reviews" },
  { label: "Packages", icon: Package, href: "/admin/packages" },
  { label: "Services", icon: Layers, href: "/admin/services" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminShell({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const displayName = profile.full_name || profile.email || "Admin";
  const initials =
    displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "A";

  return (
    <div className="min-h-screen bg-offwhite">
      {/* Desktop fixed sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-ink/8 bg-white lg:flex">
        <SidebarContent displayName={displayName} initials={initials} onNavigate={() => {}} />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink/8 bg-white px-5 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-ink text-sm font-display font-bold text-white">
            AP
          </span>
          <span className="font-display text-[14px] font-semibold text-ink">Admin</span>
        </Link>
        <button
          aria-label="Open menu"
          onClick={() => setDrawerOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/12 text-ink"
        >
          <Menu size={19} strokeWidth={1.8} />
        </button>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-ink/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-white lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-ink/8 px-5 py-4">
                <span className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-ink text-sm font-display font-bold text-white">
                    AP
                  </span>
                  <span className="font-display text-[14px] font-semibold text-ink">Admin</span>
                </span>
                <button
                  aria-label="Close menu"
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/12 text-ink"
                >
                  <X size={17} strokeWidth={1.8} />
                </button>
              </div>
              <SidebarContent
                displayName={displayName}
                initials={initials}
                onNavigate={() => setDrawerOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="lg:pl-[260px]">
        <div className="mx-auto max-w-[1400px] px-5 py-8 md:px-8 md:py-10 lg:px-10">{children}</div>
      </main>
    </div>
  );
}

function SidebarContent({
  displayName,
  initials,
  onNavigate,
}: {
  displayName: string;
  initials: string;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const [portfolioOpen, setPortfolioOpen] = useState(pathname.startsWith("/admin/portfolio"));

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="flex h-full flex-col">
      {/* Logo (desktop only — mobile shows it in the top bar) */}
      <div className="hidden items-center gap-2.5 border-b border-ink/8 px-6 py-6 lg:flex">
        <span className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-ink text-sm font-display font-bold text-white">
          AP
        </span>
        <span className="font-display text-[15px] font-semibold text-ink">Solutions Hub</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            if (item.children) {
              const active = pathname.startsWith("/admin/portfolio");
              return (
                <li key={item.label}>
                  <button
                    onClick={() => setPortfolioOpen((v) => !v)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors duration-200 ${
                      active ? "text-ink" : "text-ink/55 hover:text-ink"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={17} strokeWidth={1.8} className={active ? "text-red" : ""} />
                      {item.label}
                    </span>
                    <ChevronDown
                      size={15}
                      strokeWidth={2}
                      className={`transition-transform duration-300 ease-premium ${
                        portfolioOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {portfolioOpen && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden pl-[42px]"
                      >
                        {item.children.map((leaf) => {
                          const leafActive = pathname === leaf.href;
                          return (
                            <li key={leaf.href}>
                              <Link
                                href={leaf.href}
                                onClick={onNavigate}
                                className={`block rounded-lg py-2 pl-2 text-[13.5px] font-medium transition-colors duration-200 ${
                                  leafActive ? "text-red" : "text-ink/50 hover:text-ink"
                                }`}
                              >
                                {leaf.label}
                              </Link>
                            </li>
                          );
                        })}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              );
            }

            const active = isActive(item.href!);
            return (
              <li key={item.label} className="relative">
                {active && (
                  <span className="absolute -left-4 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-red" />
                )}
                <Link
                  href={item.href!}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors duration-200 ${
                    active ? "bg-red/[0.06] text-ink" : "text-ink/55 hover:bg-ink/[0.03] hover:text-ink"
                  }`}
                >
                  <Icon size={17} strokeWidth={1.8} className={active ? "text-red" : ""} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom: profile, view website, logout */}
      <div className="border-t border-ink/8 px-4 py-5">
        <div className="mb-3 flex items-center gap-3 rounded-xl px-2 py-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink font-display text-[12px] font-bold text-white">
            {initials}
          </span>
          <span className="truncate text-[13.5px] font-medium text-ink/70">{displayName}</span>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-ink/55 transition-colors duration-200 hover:bg-ink/[0.03] hover:text-ink"
        >
          <ExternalLink size={17} strokeWidth={1.8} />
          View Website
        </a>
        <SidebarLogout />
      </div>
    </div>
  );
}

function SidebarLogout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-ink/55 transition-colors duration-200 hover:bg-red/[0.06] hover:text-red disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogOut size={17} strokeWidth={1.8} />
      {loading ? "Signing out..." : "Logout"}
    </button>
  );
}
