"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

type SlideKind =
  | "website"
  | "dashboard"
  | "marketing"
  | "architecture"
  | "branding";

type Slide = {
  number: string;
  title: string;
  description: string;
  kind: SlideKind;
  image: string;
};

const SLIDES: Slide[] = [
  {
    number: "01",
    title: "Website Development",
    description:
      "Realistic, modern website previews built for speed and clarity.",
    kind: "website",
    image: "/previews/Websites.jpeg",
  },
  {
    number: "02",
    title: "Business Dashboards",
    description:
      "Analytics and data visualization interfaces that make numbers easy to read.",
    kind: "dashboard",
    image: "/previews/Dashboards.jpeg",
  },
  {
    number: "03",
    title: "Digital Marketing",
    description:
      "Campaign visuals and social media creative built to convert.",
    kind: "marketing",
    image: "/previews/Marketing.jpeg",
  },
  {
    number: "04",
    title: "3D Architecture",
    description:
      "Architectural renders that bring a concept to life before it's built.",
    kind: "architecture",
    image: "/previews/Architecture.jpeg",
  },
  {
    number: "05",
    title: "Graphic Design",
    description:
      "Branding systems, colour and type that give a business a real identity.",
    kind: "branding",
    image: "/previews/Portfolio.jpeg",
  },
];

const AUTOPLAY_MS = 2000;

export default function ServiceShowcase() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setIndex((current) => (current + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex(
      (current) => (current - 1 + SLIDES.length) % SLIDES.length
    );
  }, []);

  const goTo = useCallback(
    (nextIndex: number) => {
      if (nextIndex === index) return;

      const forwardDistance =
        (nextIndex - index + SLIDES.length) % SLIDES.length;

      setDirection(
        forwardDistance <= Math.floor(SLIDES.length / 2) ? 1 : -1
      );

      setIndex(nextIndex);
    },
    [index]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((current) => (current + 1) % SLIDES.length);
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, []);

  const getRelativePosition = (slideIndex: number) => {
    let difference = slideIndex - index;

    if (difference > SLIDES.length / 2) {
      difference -= SLIDES.length;
    }

    if (difference < -SLIDES.length / 2) {
      difference += SLIDES.length;
    }

    return difference;
  };

  const positionStyles = {
  "-2": {
    x: "-340%",
    scale: 0.7,
    opacity: 0,
    zIndex: 1,
    rotate: -5,
  },

  "-1": {
    x: "-120%",
    scale: 0.82,
    opacity: 0.7,
    zIndex: 10,
    rotate: -3,
  },

  "0": {
    x: "-50%",
    scale: 1,
    opacity: 1,
    zIndex: 30,
    rotate: 0,
  },

  "1": {
    x: "20%",
    scale: 0.82,
    opacity: 0.7,
    zIndex: 10,
    rotate: 3,
  },

  "2": {
    x: "240%",
    scale: 0.7,
    opacity: 0,
    zIndex: 1,
    rotate: 5,
  },
} as const;

  return (
    <section
  id="showcase"
  className="
    relative
    overflow-hidden
    bg-gradient-to-b
    from-[#7A0C10]
    via-[#EC1D25]
    to-[#FF555C]
    py-20
    md:py-28
  "
>
      {/* ============================================================
          BACKGROUND GLOW
      ============================================================ */}

      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute
            left-1/2
            top-[-180px]
            h-[450px]
            w-[850px]
            -translate-x-1/2
            rounded-full
            bg-white/20
            blur-3xl
          "
        />
      </div>

      <div className="relative mx-auto max-w-[1920px] px-5 sm:px-8 lg:px-12">
        {/* ============================================================
    SECTION TITLE
============================================================ */}

<div className="mb-8 text-center md:mb-10">
  <h2 className="font-display text-xl font-semibold tracking-tight text-white md:text-2xl">
    Our Services
  </h2>
</div>
        {/* ============================================================
            CAROUSEL
        ============================================================ */}

        <div
          className="
            relative
            mx-auto
            h-[360px]
            overflow-visible
            sm:h-[390px]
            md:h-[430px]
            lg:h-[450px]
          "
        >
          {SLIDES.map((slide) => {
            const position = getRelativePosition(
              SLIDES.indexOf(slide)
            );

            const style =
              positionStyles[
                String(position) as keyof typeof positionStyles
              ] ?? positionStyles["2"];

            return (
              <motion.div
                key={slide.kind}
                initial={false}
                animate={{
                  x: style.x,
                  scale: style.scale,
                  opacity: style.opacity,
                  rotate: style.rotate,
                }}
                transition={{
  type: "spring",
  stiffness: 180,
  damping: 22,
  mass: 0.8,
}}
                className="
                  absolute
                  left-1/2
                  top-[0%]   
                  w-[94%]
                  -translate-y-1/2
                  overflow-hidden
                  rounded-[24px]
                  border
                  border-white/60
                  shadow-[0_25px_80px_rgba(25,25,50,0.18)]
                  sm:w-[82%]
                  md:w-[68%]
                  lg:w-[40%]
                "
                style={{
                  zIndex: style.zIndex,
                  pointerEvents:
                    position === 0 ? "auto" : "none",
                }}
              >
                <div
                  className="
                    aspect-[16/10]
                    overflow-hidden
                    rounded-[19px]
                    bg-white
                  "
                >
                  <SlidePreview image={slide.image} title={slide.title} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ============================================================
            CATEGORY NAVIGATION
        ============================================================ */}

        <div className="relative z-30 mt-8 flex justify-center">
          <div
            className="
              flex
              max-w-full
              items-center
              gap-1
              overflow-x-auto
              rounded-full
              bg-white/75
              p-1.5
              shadow-[0_8px_30px_rgba(30,30,60,0.08)]
              backdrop-blur-md
            "
          >
            {SLIDES.map((slide, i) => (
              <button
                key={slide.kind}
                onClick={() => goTo(i)}
                className={`
                  whitespace-nowrap
                  rounded-full
                  px-5
                  py-3
                  text-[13px]
                  font-semibold
                  transition-all
                  duration-300
                  md:px-7
                  md:text-[14px]
                  ${
                    i === index
                      ? "bg-[#111111] text-white shadow-md"
                      : "text-[#171717] hover:bg-white"
                  }
                `}
              >
                {slide.title === "Website Development"
                  ? "Websites"
                  : slide.title === "Business Dashboards"
                    ? "Dashboards"
                    : slide.title === "Digital Marketing"
                      ? "Marketing"
                      : slide.title === "3D Architecture"
                        ? "Architecture"
                        : "Portfolios"}
              </button>
            ))}
          </div>
        </div>

        {/* ============================================================
            DESCRIPTION
        ============================================================ */}

        <motion.div
          key={SLIDES[index].kind}
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mx-auto mt-7 max-w-[680px] text-center"
        >
          <p className="text-[14px] leading-relaxed text-black/75 md:text-[15px]">
            {SLIDES[index].description}
          </p>
        </motion.div>

        {/* ============================================================
            CTA + CONTROLS
        ============================================================ */}

        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-black/15
              bg-white/30
              text-black
              backdrop-blur-sm
              transition-all
              duration-200
              hover:bg-white
            "
          >
            <ArrowLeft size={16} strokeWidth={1.8} />
          </button>

          <a
            href="#contact"
            className="
              inline-flex
              items-center
              justify-center
              rounded-lg
              bg-[#111111]
              px-9
              py-3.5
              text-[13px]
              font-semibold
              text-white
              shadow-lg
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-black
            "
          >
            Start for Free
          </a>

          <button
            onClick={next}
            aria-label="Next slide"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-black/15
              bg-white/30
              text-black
              backdrop-blur-sm
              transition-all
              duration-200
              hover:bg-white
            "
          >
            <ArrowRight size={16} strokeWidth={1.8} />
          </button>
        </div>

        {/* ============================================================
            SLIDE INDICATORS
        ============================================================ */}

        <div className="mt-7 flex justify-center gap-1.5">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.kind}
              aria-label={`Go to ${slide.title}`}
              onClick={() => goTo(i)}
              className="group flex h-4 items-center"
            >
              <span
                className={`
                  block
                  h-[3px]
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    i === index
                      ? "w-8 bg-black"
                      : "w-4 bg-black/20 group-hover:bg-black/40"
                  }
                `}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   PREVIEW WRAPPER
================================================================ */

function SlidePreview({
  image,
  title,
}: {
  image: string;
  title: string;
}) {
  return (
    <div className="h-full w-full overflow-hidden bg-white">
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

/* ================================================================
   WEBSITE PREVIEW
================================================================ */

function WebsitePreview() {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-1.5 border-b border-black/10 px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-black/15" />
        <span className="h-2 w-2 rounded-full bg-black/15" />
        <span className="h-2 w-2 rounded-full bg-black/15" />

        <div className="ml-3 h-4 max-w-[220px] flex-1 rounded-full bg-black/[0.06]" />
      </div>

      <div className="flex flex-1 gap-4 p-5">
        <div className="flex-1 space-y-3">
          <div className="h-4 w-4/5 rounded bg-black/10" />

          <div className="h-2.5 w-full rounded bg-black/[0.06]" />

          <div className="h-2.5 w-3/4 rounded bg-black/[0.06]" />

          <div className="mt-4 h-9 w-32 rounded-full bg-[#ef3038]" />
        </div>

        <div className="flex flex-1 items-center justify-center rounded-lg bg-[#f6f6f4]">
          <div className="h-4/5 w-4/5 rounded-md border border-black/10 bg-white" />
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   DASHBOARD PREVIEW
================================================================ */

function DashboardPreview() {
  return (
    <div className="flex h-full flex-col gap-3 bg-[#151515] p-5">
      <div className="grid grid-cols-3 gap-3">
        {["Revenue", "Users", "Conversion"].map((label) => (
          <div
            key={label}
            className="
              rounded-lg
              border
              border-white/10
              bg-white/[0.05]
              p-3
            "
          >
            <span className="text-[10px] uppercase tracking-wide text-white/40">
              {label}
            </span>

            <div className="mt-1.5 h-3 w-14 rounded bg-white/25" />
          </div>
        ))}
      </div>

      <div className="flex flex-1 items-end gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] p-4">
        {[35, 55, 40, 70, 50, 85, 60, 95, 75].map(
          (height, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm ${
                i === 7
                  ? "bg-[#ef3038]"
                  : "bg-white/20"
              }`}
              style={{
                height: `${height}%`,
              }}
            />
          )
        )}
      </div>
    </div>
  );
}

/* ================================================================
   MARKETING PREVIEW
================================================================ */

function MarketingPreview() {
  return (
    <div className="grid h-full grid-cols-3 gap-2 bg-[#f3f3f1] p-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className={`
            relative
            rounded-lg
            ${
              i === 2
                ? "col-span-2 row-span-2"
                : ""
            }
            ${
              [
                "bg-[#151515]",
                "bg-[#ef3038]",
                "border border-black/10 bg-white",
                "bg-[#dededb]",
                "bg-[#151515]",
                "bg-[#ef3038]/30",
              ][i]
            }
          `}
        >
          {i === 2 && (
            <span
              className="
                absolute
                bottom-2
                left-2
                rounded-full
                bg-white
                px-2
                py-0.5
                text-[10px]
                font-semibold
                text-black
              "
            >
              +248% reach
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ================================================================
   ARCHITECTURE PREVIEW
================================================================ */

function ArchitecturePreview() {
  return (
    <div className="flex h-full items-center justify-center bg-[#151515]">
      <svg
        width="70%"
        height="70%"
        viewBox="0 0 240 160"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M40 140 V70 L120 30 L200 70 V140"
          stroke="white"
          strokeOpacity="0.25"
          strokeWidth="1.3"
        />

        <path
          d="M40 140 H200"
          stroke="white"
          strokeOpacity="0.25"
          strokeWidth="1.3"
        />

        <path
          d="M70 140 V90 H100 V140"
          stroke="white"
          strokeOpacity="0.25"
          strokeWidth="1.3"
        />

        <path
          d="M120 30 V140 M120 30 L60 62 M120 30 L180 62"
          stroke="#EC1D25"
          strokeWidth="1.4"
        />

        <path
          d="M140 140 V95 H175 V140"
          stroke="white"
          strokeOpacity="0.4"
          strokeWidth="1.3"
        />
      </svg>
    </div>
  );
}

/* ================================================================
   BRANDING PREVIEW
================================================================ */

function BrandingPreview() {
  return (
    <div className="flex h-full flex-col justify-between bg-white p-6">
      <div className="flex items-center gap-3">
        <span
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-md
            bg-[#151515]
            text-sm
            font-bold
            text-white
          "
        >
          A
        </span>

        <div className="h-2.5 w-24 rounded bg-black/15" />
      </div>

      <div className="flex gap-2.5">
        <span className="h-10 w-10 rounded-full bg-[#151515]" />

        <span className="h-10 w-10 rounded-full bg-[#ef3038]" />

        <span className="h-10 w-10 rounded-full bg-[#dededb]" />

        <span className="h-10 w-10 rounded-full border border-black/15 bg-white" />
      </div>

      <div className="space-y-1.5">
        <span className="block text-lg font-semibold text-black">
          Aa Bb Cc
        </span>

        <span className="block text-[12px] text-black/45">
          Typography & visual identity system
        </span>
      </div>
    </div>
  );
}