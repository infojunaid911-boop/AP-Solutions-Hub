"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  animate as fmAnimate,
  type PanInfo,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  LayoutDashboard,
  Boxes,
} from "lucide-react";

type Project = {
  category: string;
  name: string;
  description: string;
  tone: "ink" | "offwhite" | "red" | "white";
};

const PROJECTS: Project[] = [
  {
    category: "Website Design",
    name: "Restaurant Website",
    description:
      "A warm, appetite-driving site for a family restaurant group.",
    tone: "offwhite",
  },
  {
    category: "Dashboards",
    name: "Business Analytics Dashboard",
    description:
      "Real-time reporting built for a fast-moving operations team.",
    tone: "ink",
  },
  {
    category: "Website Design",
    name: "Construction Company Website",
    description:
      "A confident, project-led site for a regional construction firm.",
    tone: "white",
  },
  {
    category: "E-commerce",
    name: "E-commerce Store",
    description:
      "A conversion-focused storefront for a growing retail brand.",
    tone: "offwhite",
  },
  {
    category: "Digital Marketing",
    name: "Social Media Campaign",
    description:
      "A coordinated campaign that lifted engagement across channels.",
    tone: "red",
  },
  {
    category: "Branding",
    name: "Brand Identity",
    description:
      "A full identity system — mark, colour, type — for a new venture.",
    tone: "white",
  },
  {
    category: "3D Architecture",
    name: "3D Architectural Visualization",
    description:
      "Photoreal renders used to pre-sell units before groundbreak.",
    tone: "ink",
  },
  {
    category: "Dashboards",
    name: "Corporate Dashboard",
    description:
      "An internal reporting suite unifying data across departments.",
    tone: "offwhite",
  },
];

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

const extended = [
  ...PROJECTS.slice(-CLONE),
  ...PROJECTS,
  ...PROJECTS.slice(0, CLONE),
];

export default function LatestWork() {
  const [index, setIndex] = useState(CLONE);
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

    x.set(-CLONE * (itemWidth + GAP));
  }, [itemWidth, x]);

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
    if (!itemWidth) return;

    let animationFrame: number;
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
          -(CLONE + PROJECTS.length) * totalStep;

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
  }, [itemWidth, paused, dragging, x]);

  /*
   * ---------------------------------------------------------
   * Update active progress indicator based on position
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!itemWidth) return;

    const unsubscribe = x.on("change", (latestX) => {
      const step = itemWidth + GAP;

      const rawIndex = Math.round(Math.abs(latestX) / step);

      const realIndex =
        ((rawIndex - CLONE) % PROJECTS.length + PROJECTS.length) %
        PROJECTS.length;

      setIndex(CLONE + realIndex);
    });

    return unsubscribe;
  }, [x, itemWidth]);

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
      await animationRef.current.finished;
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
    if (nextIndex < CLONE) {
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
    if (nextIndex >= CLONE + PROJECTS.length) {
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
    ((index - CLONE) % PROJECTS.length + PROJECTS.length) %
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
              Our Work
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
          ===================================================== */}
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
              key={i}
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
  const toneClasses: Record<Project["tone"], string> = {
    ink: "bg-ink",
    offwhite: "bg-offwhite",
    red: "bg-red",
    white: "bg-white border border-ink/10",
  };

  return (
    <article className="group select-none">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <div
          className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-premium group-hover:scale-[1.06] ${toneClasses[project.tone]}`}
        >
          <ProjectMark project={project} />
        </div>

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

        <p className="mt-1.5 max-w-[38ch] text-[14px] leading-relaxed text-ink/55">
          {project.description}
        </p>
      </div>
    </article>
  );
}

/*
 * ===========================================================
 * PROJECT MARK
 * ===========================================================
 */
function ProjectMark({
  project,
}: {
  project: Project;
}) {
  const isDark =
    project.tone === "ink" ||
    project.tone === "red";

  const dot = isDark
    ? "bg-white/25"
    : "bg-ink/15";

  const strong = isDark
    ? "bg-white/70"
    : "bg-ink/60";

  if (project.category === "Dashboards") {
    return (
      <div className="flex w-2/3 flex-col gap-2">
        <LayoutDashboard
          size={20}
          className={
            isDark
              ? "text-white/70"
              : "text-ink/50"
          }
          strokeWidth={1.6}
        />

        <div className="flex items-end gap-1">
          {[40, 70, 50, 90, 60].map(
            (h, i) => (
              <span
                key={i}
                className={`w-3 rounded-sm ${
                  i === 3
                    ? "bg-red"
                    : dot
                }`}
                style={{
                  height: h / 2.2,
                }}
              />
            )
          )}
        </div>
      </div>
    );
  }

  if (project.category === "3D Architecture") {
    return (
      <svg
        width="46%"
        height="46%"
        viewBox="0 0 100 80"
        fill="none"
      >
        <path
          d="M18 68 V32 L50 12 L82 32 V68"
          stroke="white"
          strokeOpacity="0.35"
          strokeWidth="1.4"
        />

        <path
          d="M50 12 V68"
          stroke="#EC1D25"
          strokeWidth="1.4"
        />
      </svg>
    );
  }

  if (project.category === "Digital Marketing") {
    return (
      <div className="grid w-1/2 grid-cols-3 gap-1.5">
        {Array.from({ length: 6 }).map(
          (_, i) => (
            <span
              key={i}
              className="aspect-square rounded-sm bg-white/25"
            />
          )
        )}
      </div>
    );
  }

  if (project.category === "Branding") {
    return (
      <div className="flex items-center gap-2">
        <span
          className={`h-9 w-9 rounded-full ${strong}`}
        />

        <span
          className={`h-9 w-9 rounded-full ${dot}`}
        />

        <span className="h-9 w-9 rounded-full bg-red" />
      </div>
    );
  }

  return (
    <div className="w-2/3">
      <div className="flex items-center gap-1.5">
        <span
          className={`h-2 w-2 rounded-full ${dot}`}
        />
        <span
          className={`h-2 w-2 rounded-full ${dot}`}
        />
        <span
          className={`h-2 w-2 rounded-full ${dot}`}
        />
      </div>

      <div
        className={`mt-3 h-2.5 w-4/5 rounded ${strong}`}
      />

      <div
        className={`mt-2 h-2 w-full rounded ${dot}`}
      />

      <div
        className={`mt-1.5 h-2 w-2/3 rounded ${dot}`}
      />

      <Boxes
        size={16}
        className={`mt-3 ${
          isDark
            ? "text-white/40"
            : "text-ink/30"
        }`}
        strokeWidth={1.6}
      />
    </div>
  );
}