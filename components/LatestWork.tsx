"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  animate as fmAnimate,
  type PanInfo,
} from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, ImageOff } from "lucide-react";
import type { PublicPortfolioItem } from "@/lib/portfolio/getPortfolioItems";

// Same shape as the existing /portfolio data (PublicPortfolioItem), just
// renamed locally to what the carousel/card code already expects.
type Project = {
  id: string;
  category: string;
  name: string;
  description: string;
  image: string | null;
};

function toProject(item: PublicPortfolioItem): Project {
  return {
    id: item.id,
    category: item.category || "Project",
    name: item.title || "Untitled project",
    description: item.description || "",
    image: item.coverImage || null,
  };
}

const CLONE = 3;
const GAP = 24;

// Continuous scrolling speed.
// Lower number = slower.
// 0.035 is a very subtle premium-style movement.
const AUTO_SCROLL_SPEED = 0.035;

const TRANSITION = {
  duration: 0.6,
  ease: [0.16, 1, 0.3, 1] as const,
};

export default function LatestWork({
  items,
}: {
  // Same Supabase-backed data /portfolio uses (getPublishedPortfolioItems).
  items: PublicPortfolioItem[];
}) {
  // Map once into the shape the existing carousel markup already expects —
  // no change to the slider mechanics below, just a real data source.
  const PROJECTS = useMemo(() => items.map(toProject), [items]);

  // The infinite-loop clone trick needs at least `CLONE` real items to
  // clone from. With fewer projects than that (including zero), clamp so
  // the slice() calls below can't duplicate/overlap in a broken way.
  const cloneCount = Math.min(CLONE, PROJECTS.length);

  const extended = useMemo(() => {
    if (PROJECTS.length === 0) return [];
    return [
      ...PROJECTS.slice(-cloneCount),
      ...PROJECTS,
      ...PROJECTS.slice(0, cloneCount),
    ];
  }, [PROJECTS, cloneCount]);

  const [index, setIndex] = useState(cloneCount);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);

  const itemRef = useRef<HTMLDivElement>(null);
  const [itemWidth, setItemWidth] = useState(0);

  const x = useMotionValue(0);

  const animationRef = useRef<ReturnType<typeof fmAnimate> | null>(null);
  const manualAnimationRef = useRef(false);

  /*
   * ---------------------------------------------------------
   * Measure card width
   * ---------------------------------------------------------
   */
  useEffect(() => {
    const measure = () => {
      if (itemRef.current) {
        setItemWidth(itemRef.current.offsetWidth);
      }
    };

    measure();

    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("resize", measure);
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * Initial position
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!itemWidth) return;

    x.set(-cloneCount * (itemWidth + GAP));
  }, [itemWidth, x, cloneCount]);

  /*
   * ---------------------------------------------------------
   * CONTINUOUS AUTO SCROLL
   *
   * Moves very slowly to the left.
   * Stops when mouse enters carousel.
   * Starts again when mouse leaves.
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!itemWidth || PROJECTS.length === 0) return;

    let animationFrame = 0;
    let lastTime = performance.now();

    const step = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      if (!paused && !dragging && !manualAnimationRef.current) {
        const currentX = x.get();

        // Movement is frame-rate independent
        const movement = AUTO_SCROLL_SPEED * delta;

        let nextX = currentX - movement;

        const totalStep = itemWidth + GAP;

        /*
         * Once we reach the right-side clones,
         * instantly move back to the original set.
         */
        const endPosition =
          -(cloneCount + PROJECTS.length) * totalStep;

        if (nextX <= endPosition) {
          nextX += PROJECTS.length * totalStep;
        }

        x.set(nextX);
      }

      animationFrame = requestAnimationFrame(step);
    };

    animationFrame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [itemWidth, paused, dragging, x, cloneCount, PROJECTS.length]);

  /*
   * ---------------------------------------------------------
   * Update active progress indicator based on position
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!itemWidth || PROJECTS.length === 0) return;

    const unsubscribe = x.on("change", (latestX) => {
      const step = itemWidth + GAP;

      const rawIndex = Math.round(Math.abs(latestX) / step);

      const realIndex =
        ((rawIndex - cloneCount) % PROJECTS.length + PROJECTS.length) %
        PROJECTS.length;

      setIndex(cloneCount + realIndex);
    });

    return unsubscribe;
  }, [x, itemWidth, cloneCount, PROJECTS.length]);

  /*
   * ---------------------------------------------------------
   * Move to specific card
   * ---------------------------------------------------------
   */
  const snapTo = async (targetIndex: number) => {
    if (!itemWidth) return;

    manualAnimationRef.current = true;

    if (animationRef.current) {
      animationRef.current.stop();
    }

    const target = -targetIndex * (itemWidth + GAP);

    animationRef.current = fmAnimate(x, target, TRANSITION);

    try {
  await animationRef.current?.then(() => {});
} catch {
  // Animation was interrupted
}

    manualAnimationRef.current = false;
  };

  /*
   * ---------------------------------------------------------
   * Previous
   * ---------------------------------------------------------
   */
  const prev = async () => {
    const nextIndex = index - 1;

    setIndex(nextIndex);

    await snapTo(nextIndex);

    // Infinite carousel correction
    if (nextIndex < cloneCount) {
      const corrected = nextIndex + PROJECTS.length;

      x.set(-corrected * (itemWidth + GAP));
      setIndex(corrected);
    }
  };

  /*
   * ---------------------------------------------------------
   * Next
   * ---------------------------------------------------------
   */
  const next = async () => {
    const nextIndex = index + 1;

    setIndex(nextIndex);

    await snapTo(nextIndex);

    // Infinite carousel correction
    if (nextIndex >= cloneCount + PROJECTS.length) {
      const corrected = nextIndex - PROJECTS.length;

      x.set(-corrected * (itemWidth + GAP));
      setIndex(corrected);
    }
  };

  /*
   * ---------------------------------------------------------
   * Drag
   * ---------------------------------------------------------
   */
  const handleDragStart = () => {
    setDragging(true);

    if (animationRef.current) {
      animationRef.current.stop();
    }
  };

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    setDragging(false);

    const threshold = itemWidth / 4;

    if (info.offset.x < -threshold) {
      next();
    } else if (info.offset.x > threshold) {
      prev();
    } else {
      snapTo(index);
    }
  };

  const activeReal =
    PROJECTS.length === 0
      ? 0
      : ((index - cloneCount) % PROJECTS.length + PROJECTS.length) %
        PROJECTS.length;

  return (
    <section
      id="work"
      className="overflow-hidden bg-white py-24 md:py-32"
    >
      <div className="mx-auto max-w-shell px-6 md:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{
              once: true,
              margin: "-15% 0px",
            }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span className="text-[13px] font-semibold tracking-wide text-red">
              Our Lastest Work
            </span>

            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.1] tracking-[-0.01em] text-ink sm:text-[2.75rem]">
              Latest things we&apos;ve built.
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{
              once: true,
              margin: "-15% 0px",
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="max-w-sm text-[15.5px] leading-relaxed text-ink/55"
          >
            Real projects created for real businesses.
          </motion.p>
        </div>
      </div>

      {/* =====================================================
          CAROUSEL
          (Nothing published yet — keep the header above but skip an
          empty/broken-looking carousel rather than rendering nothing at
          all or crashing on the divide-by-zero below.)
          ===================================================== */}
      {PROJECTS.length === 0 ? (
        <p className="mx-auto mt-14 max-w-shell px-6 text-[14px] text-ink/45 md:px-10">
          New work is on the way — check back soon.
        </p>
      ) : (
        <>
          <div
            className="mt-14 pl-6 md:pl-10"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <motion.div
              className="flex cursor-grab active:cursor-grabbing"
              style={{
                x,
                gap: GAP,
              }}
              drag="x"
              dragElastic={0.08}
              dragMomentum={false}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              {extended.map((project, i) => (
                <div
                  key={`${project.id}-${i}`}
                  ref={i === 0 ? itemRef : undefined}
                  className="w-[86%] shrink-0 sm:w-[70%] md:w-[47%] lg:w-[31.5%]"
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </motion.div>
          </div>

          {/* =====================================================
              CONTROLS
              ===================================================== */}
          <div className="mx-auto mt-10 flex max-w-shell items-center justify-between px-6 md:px-10">
            <div className="h-[3px] w-40 overflow-hidden rounded-full bg-mist sm:w-56">
              <motion.div
                className="h-full rounded-full bg-red"
                animate={{
                  width: `${((activeReal + 1) / PROJECTS.length) * 100}%`,
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                aria-label="Previous project"
                onClick={prev}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/12 text-ink transition-colors duration-200 hover:border-red hover:text-red"
              >
                <ArrowLeft
                  size={17}
                  strokeWidth={1.8}
                />
              </button>

              <button
                aria-label="Next project"
                onClick={next}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/12 text-ink transition-colors duration-200 hover:border-red hover:text-red"
              >
                <ArrowRight
                  size={17}
                  strokeWidth={1.8}
                />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

/*
 * ===========================================================
 * PROJECT CARD
 * ===========================================================
 */
function ProjectCard({
  project,
}: {
  project: Project;
}) {
  return (
    <article className="group select-none">
      {/* Same box (aspect-[4/3], rounded-2xl) as before — only the
          content inside it changed, from a decorative tone/icon block
          to the real portfolio image (or a clean fallback). */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-mist">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.name}
            fill
            sizes="(max-width: 640px) 86vw, (max-width: 768px) 70vw, (max-width: 1024px) 47vw, 31.5vw"
            // contain (never cover): the whole image stays visible,
            // uncropped, with the bg-mist box showing through as the
            // border around it for any image that isn't itself 4:3.
            className="object-contain transition-transform duration-500 ease-premium group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageOff
              size={28}
              strokeWidth={1.6}
              className="text-ink/25"
            />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-300 ease-premium group-hover:bg-ink/45 group-hover:opacity-100">
          <span className="translate-y-2 rounded-full bg-white px-6 py-3 text-[13.5px] font-semibold text-ink opacity-0 shadow-lg transition-all duration-300 ease-premium group-hover:translate-y-0 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5">
              View Project
              <ArrowUpRight
                size={14}
                strokeWidth={2}
              />
            </span>
          </span>
        </div>
      </div>

      <div className="mt-5">
        <span className="text-[12.5px] font-medium uppercase tracking-wide text-red">
          {project.category}
        </span>

        <h3 className="mt-1.5 font-display text-lg font-semibold text-ink">
          {project.name}
        </h3>

        {project.description && (
          // line-clamp-2 keeps card height consistent when a project's
          // description is much longer/shorter than the others.
          <p className="mt-1.5 line-clamp-2 max-w-[38ch] text-[14px] leading-relaxed text-ink/55">
            {project.description}
          </p>
        )}
      </div>
    </article>
  );
}
