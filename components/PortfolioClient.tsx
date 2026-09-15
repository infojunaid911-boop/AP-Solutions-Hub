"use client";

import { useEffect, useMemo, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { CATEGORY_TABS } from "@/lib/portfolioData";
import type { PublicPortfolioItem } from "@/lib/portfolio/getPortfolioItems";
import PortfolioModal from "./PortfolioModal";

export type { PublicPortfolioItem };

/* ------------------------------------------------------------------ *
 *  HERO VISUAL — kinetic discipline index.
 *
 *  Every word here comes from the real category list, so it can never
 *  drift out of sync with the filters. Swap this constant for a custom
 *  array (e.g. ["Web", "UI/UX", "Brand", "3D", "Marketing"]) if you
 *  ever want shorter wording in the hero.
 * ------------------------------------------------------------------ */

const DISCIPLINES = CATEGORY_TABS.filter((tab) => tab !== "All Work");

const CYCLE_MS = 2600;

/** Hairline outline for the resting state, solid ink for the active one. */
const OUTLINE_STYLE = {
  WebkitTextFillColor: "transparent",
  WebkitTextStrokeWidth: "1px",
  WebkitTextStrokeColor: "currentColor",
} as const;

const FILLED_STYLE = {
  WebkitTextStrokeWidth: "1px",
  WebkitTextStrokeColor: "currentColor",
} as const;

function DisciplineIndex({ projects }: { projects: PublicPortfolioItem[] }) {
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);

  // Real per-category totals — derived from the projects already passed in.
  const counts = useMemo(() => {
    const map = new Map<string, number>();

    projects.forEach((project) => {
      map.set(project.category, (map.get(project.category) ?? 0) + 1);
    });

    return map;
  }, [projects]);

  useEffect(() => {
    if (reduce || DISCIPLINES.length === 0) return;

    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % DISCIPLINES.length);
    }, CYCLE_MS);

    return () => window.clearInterval(id);
  }, [reduce]);

  // Whisper-quiet mouse parallax on the whole index.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const px = useSpring(mouseX, { stiffness: 45, damping: 20, mass: 0.8 });
  const py = useSpring(mouseY, { stiffness: 45, damping: 20, mass: 0.8 });

  const stackX = useTransform(px, [-1, 1], [-7, 7]);
  const stackY = useTransform(py, [-1, 1], [-5, 5]);

  const handleMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (reduce) return;

    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
    mouseY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const handleLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  if (DISCIPLINES.length === 0) return null;

  return (
    <div onMouseMove={handleMove} onMouseLeave={handleLeave} className="w-full">
      <motion.div style={{ x: stackX, y: stackY }} className="relative">
        {/* index rule */}
        <span
          aria-hidden
          className="absolute left-0 top-0 block h-full w-px bg-ink/10"
        />

        <ul className="flex flex-col gap-1.5 pl-6 sm:gap-2 sm:pl-8">
          {DISCIPLINES.map((label, index) => {
            const isActive = index === active;
            const count = counts.get(label) ?? 0;

            return (
              <li key={label} className="relative">
                {/* red marker slides between rows */}
                <div
                  aria-hidden
                  className="absolute -left-6 top-0 flex h-full items-center sm:-left-8"
                >
                  {isActive && (
                    <motion.span
                      layoutId="disciplineMarker"
                      className="block h-5 w-[2px] bg-red sm:h-6"
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </div>

                <motion.div
                  animate={reduce ? undefined : { x: isActive ? 10 : 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-baseline gap-4"
                >
                  <span className="relative block font-display text-[26px] font-semibold leading-[1.16] tracking-[-0.035em] sm:text-[33px] lg:text-[39px] xl:text-[43px]">
                    {/* resting: hairline outline */}
                    <span className="block text-ink/25" style={OUTLINE_STYLE}>
                      {label}
                    </span>

                    {/* active: solid ink, crossfaded on top */}
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 block text-ink"
                      style={FILLED_STYLE}
                      animate={{ opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      {label}
                    </motion.span>
                  </span>

                  <span
                    className={`shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] tabular-nums transition-colors duration-500 ${
                      isActive ? "text-red" : "text-ink/20"
                    }`}
                  >
                    {String(count).padStart(2, "0")}
                  </span>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  PAGE
 * ------------------------------------------------------------------ */

// The full, dedicated /portfolio archive: every published project, a true
// Pinterest-style masonry grid (natural image aspect ratios, no cropping),
// working category filters, and the same project modal used on the
// homepage preview.
export default function PortfolioClient({ projects }: { projects: PublicPortfolioItem[] }) {
  const [activeTab, setActiveTab] =
    useState<(typeof CATEGORY_TABS)[number]>("All Work");

  const [selected, setSelected] = useState<PublicPortfolioItem | null>(null);

  const reduce = useReducedMotion() ?? false;

  const items = useMemo(() => {
    if (activeTab === "All Work") return projects;

    return projects.filter((item) => item.category === activeTab);
  }, [projects, activeTab]);

  return (
    <section
      id="portfolio"
      className="relative overflow-hidden bg-offwhite py-20 md:py-28"
    >
      {/* Soft background decoration */}
      <div className="pointer-events-none absolute left-[-180px] top-[15%] h-[420px] w-[420px] rounded-full bg-red/[0.025] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-180px] right-[-100px] h-[500px] w-[500px] rounded-full bg-ink/[0.025] blur-3xl" />

      <div className="relative mx-auto max-w-shell px-5 md:px-10">
        {/* Back to home — this page is opened in a new tab from the site */}
        <Link
          href="/"
          className="group mb-12 inline-flex items-center gap-2 text-[13px] font-semibold text-ink/45 transition-colors hover:text-ink"
        >
          <ArrowLeft
            size={15}
            strokeWidth={2.2}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          Back to Home
        </Link>

        {/* ================= HERO ================= */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10"
        >
          {/* LEFT — type */}
          <div className="lg:col-span-6">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-red" />
              <span className="text-[11px] font-bold uppercase tracking-[0.26em] text-red">
                Our Work
              </span>
            </div>

            <h1 className="font-display text-[2.65rem] font-semibold leading-[0.98] tracking-[-0.04em] text-ink sm:text-[3.5rem] lg:text-[4.25rem] xl:text-[4.75rem]">
              The complete
              <span className="block text-ink/30">portfolio archive.</span>
            </h1>

            <p className="mt-8 max-w-[38ch] text-[15px] leading-[1.75] text-ink/55 md:text-base md:leading-[1.8]">
              Every project we&apos;ve shipped — websites, dashboards,
              branding, digital marketing and 3D visualization — in one
              place, filterable by category.
            </p>
          </div>

          {/* RIGHT — kinetic discipline index */}
          <div className="w-full lg:col-span-6 lg:pl-10 xl:pl-20">
            <DisciplineIndex projects={projects} />
          </div>
        </motion.div>

        {/* ================= FILTERS ================= */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-16 border-t border-ink/[0.08] pt-7 md:mt-20 md:pt-8"
        >
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 scrollbar-none md:mx-0 md:px-0">
            {CATEGORY_TABS.map((tab) => {
              const active = activeTab === tab;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  aria-pressed={active}
                  className={`shrink-0 rounded-full border px-[18px] py-2.5 text-[12.5px] font-semibold transition-all duration-300 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2 focus-visible:ring-offset-offwhite ${
                    active
                      ? "border-ink bg-ink text-white shadow-[0_8px_20px_-10px_rgba(0,0,0,0.55)]"
                      : "border-ink/[0.12] bg-white/60 text-ink/55 hover:border-ink/30 hover:bg-white hover:text-ink"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Index line */}
          <div className="mt-5 text-[10px] font-bold uppercase tracking-[0.28em] text-ink/30 tabular-nums">
            <span aria-hidden>
              {items.length} / {projects.length}
            </span>
            <span className="sr-only">
              Showing {items.length} of {projects.length} projects
            </span>
          </div>
        </motion.div>

        {/* ================= PINTEREST MASONRY GRID ================= */}
        {/*
          True masonry: CSS multi-column layout + break-inside-avoid, and
          every image renders at ITS OWN natural aspect ratio (width={0}
          height={0} + style width:100%/height:auto tells next/image to
          size the box from the actual file, not a fixed box) — no
          cropping, no forced square/equal-height tiles.
        */}
        <motion.div
          layout
          className="mt-10 columns-2 gap-4 sm:columns-2 md:columns-3 lg:columns-4 lg:gap-5 xl:columns-5"
        >
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <motion.button
                key={item.id}
                layout
                initial={reduce ? false : { opacity: 0, y: 22 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1, margin: "0px 0px -40px 0px" }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{
                  duration: 0.5,
                  delay: (index % 5) * 0.045,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={() => setSelected(item)}
                className="group mb-4 block w-full break-inside-avoid rounded-[18px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-4 focus-visible:ring-offset-offwhite lg:mb-5"
              >
                {/* Card surface — lift + shadow live here so they never
                    fight framer-motion's inline transform on the button. */}
                <div className="relative overflow-hidden rounded-[18px] bg-mist ring-1 ring-ink/[0.06] transition-all duration-500 ease-premium group-hover:-translate-y-[5px] group-hover:shadow-[0_20px_45px_-18px_rgba(0,0,0,0.28)] group-hover:ring-ink/[0.14]">
                  {/* IMAGE — natural size, never cropped or forced to a fixed ratio */}
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    width={0}
                    height={0}
                    loading={index < 5 ? "eager" : "lazy"}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    className="block w-full transition-transform duration-700 ease-premium group-hover:scale-[1.03]"
                    style={{ width: "100%", height: "auto" }}
                  />

                  {/* DARK HOVER */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* PROJECT INFO */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 md:p-5">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                      {item.category}
                    </span>

                    <div className="mt-2 flex items-end justify-between gap-3">
                      <span className="font-display text-[14px] font-semibold leading-snug tracking-[-0.01em] text-white md:text-[15px]">
                        {item.title}
                      </span>

                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-transform duration-500 ease-premium group-hover:rotate-45">
                        <ArrowUpRight size={14} strokeWidth={2.2} />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* EMPTY STATE */}
        {items.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 text-center"
          >
            <span className="mx-auto mb-5 block h-px w-10 bg-red/50" />
            <p className="text-sm text-ink/40">
              No projects found in this category.
            </p>
          </motion.div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      <PortfolioModal item={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
