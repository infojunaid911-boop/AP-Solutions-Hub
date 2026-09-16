"use client";

import { useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Code2,
  Cpu,
  Globe,
} from "lucide-react";
import { CATEGORY_TABS } from "@/lib/portfolioData";
import type { PublicPortfolioItem } from "@/lib/portfolio/getPortfolioItems";
import PortfolioModal from "./PortfolioModal";

export type { PublicPortfolioItem };

/* ------------------------------------------------------------------ *
 *  PORTFOLIO HERO — "Digital Robot"
 *
 *  Giant outline/solid headline + the AP Solutions Hub robot as the
 *  visual anchor, service pills on the right, collaborate CTA on the
 *  left. Self-contained: owns its own entrance choreography, cursor
 *  parallax, and the scroll handoff into the grid below.
 * ------------------------------------------------------------------ */

const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;

/** Hairline outline treatment for "DIGITAL". */
const OUTLINE_STYLE: CSSProperties = {
  WebkitTextFillColor: "transparent",
  WebkitTextStrokeWidth: "1.5px",
  WebkitTextStrokeColor: "currentColor",
};

const SERVICE_PILLS = [
  { label: "Websites", Icon: Globe },
  { label: "Dashboards", Icon: BarChart3 },
  { label: "Automation", Icon: Code2 },
  { label: "AI Solutions", Icon: Cpu },
] as const;

/** Adds two motion values together — used to blend cursor parallax with scroll parallax. */
function useCombinedMotionValue(a: MotionValue<number>, b: MotionValue<number>) {
  return useTransform([a, b], (values: number[]) => values[0] + values[1]);
}

/** One word of the giant headline, masked and revealed on load. */
function RevealWord({
  children,
  delay,
  reduce,
  className = "",
  style,
}: {
  children: ReactNode;
  delay: number;
  reduce: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span className="inline-block overflow-hidden py-1">
      <motion.span
        initial={reduce ? false : { y: "115%" }}
        animate={reduce ? undefined : { y: "0%" }}
        transition={{ duration: 0.95, delay, ease: EASE_PREMIUM }}
        className={`inline-block ${className}`}
        style={style}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Extremely subtle grid lines behind the hero, fading out toward the grid. */
function HeroGridLines() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 opacity-70 [background-image:linear-gradient(to_right,#EDEDED_1px,transparent_1px),linear-gradient(to_bottom,#EDEDED_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_bottom,black,black,transparent)]"
    />
  );
}

function PortfolioHero() {
  const reduce = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLDivElement>(null);

  // Subtle cursor parallax. The values are intentionally small so the
  // composition stays locked to the visual grid.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 42, damping: 20, mass: 0.7 });
  const springY = useSpring(mouseY, { stiffness: 42, damping: 20, mass: 0.7 });

  const robotMouseX = useTransform(springX, [-1, 1], [-10, 10]);
  const robotMouseY = useTransform(springY, [-1, 1], [-7, 7]);
  const typeMouseX = useTransform(springX, [-1, 1], [-3, 3]);
  const typeMouseY = useTransform(springY, [-1, 1], [-2, 2]);
  const pillMouseX = useTransform(springX, [-1, 1], [-4, 4]);
  const pillMouseY = useTransform(springY, [-1, 1], [-3, 3]);

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
    mouseY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const scrollTypeY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduce ? 0 : -28]
  );
  const scrollRobotY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduce ? 0 : -46]
  );
  const scrollContentY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduce ? 0 : 18]
  );
  const scrollContentOpacity = useTransform(
    scrollYProgress,
    [0, 1],
    [1, reduce ? 1 : 0.55]
  );

  const typeY = useCombinedMotionValue(typeMouseY, scrollTypeY);
  const robotY = useCombinedMotionValue(robotMouseY, scrollRobotY);

  return (
    <div
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative -mx-5 overflow-hidden px-5 pb-2 pt-0 sm:-mx-6 sm:px-6 md:-mx-10 md:px-10"
    >
      <HeroGridLines />

      <h1 className="sr-only">AP Solutions Hub — Portfolio Archive</h1>

      {/* Small page context link — intentionally close to the navbar. */}
      <motion.div
        initial={reduce ? false : { opacity: 0, x: -8 }}
        animate={reduce ? undefined : { opacity: 1, x: 0 }}
        transition={{ duration: 0.55, delay: 0.05, ease: EASE_PREMIUM }}
        className="relative z-40 pt-1 md:pt-2"
      >
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-[12px] font-medium text-ink/45 transition-colors duration-300 hover:text-red sm:text-[13px]"
        >
          <ArrowLeft
            size={14}
            strokeWidth={2.2}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          Back to Home
        </Link>
      </motion.div>

      {/* ============================================================
          GIANT TITLE
          ============================================================ */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { x: typeMouseX, y: typeY }}
        className="relative z-10 mt-8 w-full overflow-visible sm:mt-9 md:mt-10 lg:mt-8"
      >
        <div className="flex w-full items-baseline whitespace-nowrap">
          <RevealWord
            delay={0.08}
            reduce={reduce}
            className="font-display text-[clamp(2.6rem,7.8vw,7rem)] font-bold leading-[0.78] tracking-[-0.06em] text-ink sm:text-[clamp(2.8rem,7.84vw,7.6rem)]"
            style={OUTLINE_STYLE}
          >
            PORTFOLIO
          </RevealWord>

          <RevealWord
            delay={0.28}
            reduce={reduce}
            className="ml-[clamp(0.4rem,0.9vw,1rem)] font-display text-[clamp(2.4rem,7.6vw,7rem)] font-black leading-[0.78] tracking-[-0.065em] text-ink sm:text-[clamp(2.8rem,7.84vw,7.6rem)]"
          >
            ARCHIVE
          </RevealWord>
        </div>
      </motion.div>

      {/* ============================================================
          CENTRAL HERO STAGE
          The robot is deliberately centered and oversized. It sits
          behind the supporting content but in front of the lower edge
          of the giant title, matching the supplied visual direction.
          ============================================================ */}
      <div className="relative z-20 mt-3 min-h-[535px] sm:mt-4 sm:min-h-[590px] md:min-h-[625px] lg:mt-1 lg:min-h-[560px] xl:min-h-[590px]">
        {/* Robot — central visual anchor */}
        <motion.div
          style={reduce ? undefined : { x: robotMouseX, y: robotY }}
          initial={reduce ? false : { opacity: 0, y: 34, scale: 0.9 }}
          animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.18, ease: EASE_PREMIUM }}
          className="absolute bottom-0 left-1/4 z-20 h-[500px] w-[450px] -translate-x-1/2 sm:h-[590px] sm:w-[530px] md:h-[670px] md:w-[610px] lg:h-[700px] lg:w-[640px] xl:h-[735px] xl:w-[675px]"
        >
          <Image
            src="/previews/robothero.png"
            alt="AP Solutions Hub robot"
            fill
            priority
            sizes="(max-width: 640px) 88vw, (max-width: 1024px) 55vw, 42vw"
            className="object-contain object-bottom"
          />
        </motion.div>

        {/* LEFT CONTENT */}
        <motion.div
          style={
            reduce
              ? undefined
              : { y: scrollContentY, opacity: scrollContentOpacity }
          }
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.72, delay: 0.5, ease: EASE_PREMIUM }}
          className="absolute bottom-5 left-0 z-40 w-[min(34%,430px)] min-w-0 sm:bottom-7 md:bottom-8 lg:w-[31%] xl:w-[30%]"
        >
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-red sm:text-[12px]">
            Portfolio Archive
          </p>

          <h2 className="font-display text-[1.55rem] font-semibold leading-[1.12] tracking-[-0.035em] text-red sm:text-[1.8rem] md:text-[2rem] lg:text-[2.05rem] xl:text-[2.2rem]">
            We build smart digital solutions that work for your business.
          </h2>

          <p className="mt-4 max-w-[34ch] text-[13px] leading-[1.7] text-red/65 sm:text-[14px]">
            Custom websites, powerful dashboards, automation and AI tools —
            all in one place.
          </p>

          <Link
            href="/#contact"
            className="group mt-6 inline-flex items-center gap-2.5 rounded-full bg-red px-6 py-3.5 text-[13px] font-semibold text-white shadow-[0_14px_30px_-14px_rgba(236,29,37,0.45)] transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:bg-[#0A0A0A] hover:shadow-[0_20px_40px_-16px_rgba(10,10,10,0.45)]"
          >
            Let&apos;s collaborate
            <ArrowUpRight
              size={15}
              strokeWidth={2.3}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </motion.div>

        {/* RIGHT SERVICE PILLS */}
        <div className="absolute right-0 top-[4.5rem] z-40 hidden flex-col items-end gap-3 sm:flex lg:top-[4.75rem] xl:top-[5rem]">
          {SERVICE_PILLS.map(({ label, Icon }, index) => (
            <motion.div
              key={label}
              style={reduce ? undefined : { x: pillMouseX, y: pillMouseY }}
              initial={reduce ? false : { opacity: 0, x: 16 }}
              animate={reduce ? undefined : { opacity: 1, x: 0 }}
              transition={{
                duration: 0.58,
                delay: 0.58 + index * 0.09,
                ease: EASE_PREMIUM,
              }}
              className="group flex min-w-[178px] items-center gap-3 rounded-full border border-[#EDEDED] bg-white/90 px-4 py-2.5 shadow-[0_10px_30px_-22px_rgba(10,10,10,0.5)] backdrop-blur-md transition-all duration-300 ease-premium hover:-translate-x-1 hover:border-red/40 lg:min-w-[188px] lg:px-5 lg:py-3"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-offwhite text-ink transition-colors duration-300 group-hover:bg-red/10 group-hover:text-red">
                <Icon size={15} strokeWidth={2.1} />
              </span>
              <span className="text-[13px] font-semibold text-ink">
                {label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* MOBILE SERVICE PILLS */}
        <div className="absolute bottom-0 left-0 right-0 z-40 flex flex-wrap gap-2 sm:hidden">
          {SERVICE_PILLS.map(({ label, Icon }, index) => (
            <motion.div
              key={label}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.62 + index * 0.07,
                ease: EASE_PREMIUM,
              }}
              className="flex items-center gap-2 rounded-full border border-[#EDEDED] bg-white/90 px-3 py-2 backdrop-blur-md"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-offwhite text-ink">
                <Icon size={13} strokeWidth={2} />
              </span>
              <span className="text-[11px] font-semibold text-ink">
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
/* ------------------------------------------------------------------ *
 *  PAGE
 * ------------------------------------------------------------------ */

// The full, dedicated /portfolio archive: the redesigned "Digital Robot"
// hero above, then every published project in a true Pinterest-style
// masonry grid (natural image aspect ratios, no cropping), working
// category filters, and the same project modal used on the homepage
// preview.
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
      className="relative overflow-hidden bg-offwhite pb-16 pt-4 md:pb-24 md:pt-6"
    >
      {/* Soft background decoration */}
      <div className="pointer-events-none absolute left-[-180px] top-[15%] h-[420px] w-[420px] rounded-full bg-red/[0.025] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-180px] right-[-100px] h-[500px] w-[500px] rounded-full bg-ink/[0.025] blur-3xl" />

      <div className="relative mx-auto max-w-shell px-5 md:px-10">
        {/* Back to home — this page is opened in a new tab from the site */}
        <Link
          href="/"
          className="hidden"
        >
          <ArrowLeft
            size={15}
            strokeWidth={2.2}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          Back to Home
        </Link>

        {/* ================= HERO ================= */}
        <PortfolioHero />

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