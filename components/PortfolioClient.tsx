"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { CATEGORY_TABS } from "@/lib/portfolioData";
import { MarketingVisual } from "@/components/about/visuals.tsx";

export type PublicPortfolioItem = {
  id: string;
  title: string;
  category: string;
  coverImage: string;
  images: string[];
  client: string;
  services: string[];
  description: string;
};

const TYPING_WORDS = [
  "website",
  "dashboard",
  "graphic design",
  "branding",
  "3D visualization",
];

export default function PortfolioClient({
  projects,
}: {
  projects: PublicPortfolioItem[];
}) {
  const [activeTab, setActiveTab] =
    useState<(typeof CATEGORY_TABS)[number]>("All Work");

  const [selected, setSelected] =
    useState<PublicPortfolioItem | null>(null);

  /* =====================================================
     TYPING ANIMATION
  ===================================================== */

  const [typingWord, setTypingWord] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = TYPING_WORDS[wordIndex];

    const typingSpeed = isDeleting ? 45 : 85;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        const nextText = currentWord.slice(
          0,
          typingWord.length + 1
        );

        setTypingWord(nextText);

        if (nextText === currentWord) {
          setTimeout(() => {
            setIsDeleting(true);
          }, 1100);
        }
      } else {
        const nextText = currentWord.slice(
          0,
          typingWord.length - 1
        );

        setTypingWord(nextText);

        if (nextText === "") {
          setIsDeleting(false);

          setWordIndex(
            (prev) => (prev + 1) % TYPING_WORDS.length
          );
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [typingWord, wordIndex, isDeleting]);

  /* =====================================================
     FILTERED ITEMS
  ===================================================== */

  const items = useMemo(() => {
    if (activeTab === "All Work") return projects;

    return projects.filter(
      (item) => item.category === activeTab
    );
  }, [projects, activeTab]);

  return (
    <section
      id="portfolio"
      className="
        relative
        overflow-hidden
        bg-offwhite
        py-4
        md:py-7
      "
    >
      {/* =====================================================
          SOFT BACKGROUND DECORATION
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-[-180px]
          top-[15%]
          h-[420px]
          w-[420px]
          rounded-full
          bg-red/[0.025]
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-[-180px]
          right-[-100px]
          h-[500px]
          w-[500px]
          rounded-full
          bg-ink/[0.025]
          blur-3xl
        "
      />

      <div
        className="
          relative
          mx-auto
          max-w-shell
          px-5
          md:px-10
        "
      >
        {/* =====================================================
            HEADER + VISUAL
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: "-15% 0px",
          }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            -translate-y-4
            grid
            grid-cols-1
            items-center
            gap-5
            lg:-translate-y-8
            lg:grid-cols-[1fr_0.9fr]
            lg:gap-8
          "
        >
          {/* =====================================================
              LEFT CONTENT
          ===================================================== */}

          <div className="max-w-3xl">
            {/* EYEBROW */}

            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-red" />

              <span
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-red
                "
              >
                WHAT WE&apos;VE BUILT
              </span>
            </div>

            {/* HEADING */}

            <h2
              className="
                font-display
                text-4xl
                font-semibold
                leading-[1.02]
                tracking-[-0.035em]
                text-ink
                sm:text-5xl
                md:text-[4rem]
              "
            >
              Explore our

              <span className="block text-ink/35">
                creative work.
              </span>
            </h2>

            {/* DESCRIPTION */}

            <p
              className="
                mt-6
                max-w-xl
                text-[15px]
                leading-7
                text-ink/55
                md:text-base
              "
            >
              From websites and dashboards to branding and 3D
              visualization — a collection of work built with
              strategy, creativity and attention to detail.
            </p>

            {/* =====================================================
                TYPING ANIMATION
            ===================================================== */}

            <div
              className="
                mt-7
                flex
                min-h-[30px]
                items-center
                gap-3
              "
            >
              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-ink/35
                  sm:text-[11px]
                "
              >
                We create
              </span>

              <div className="flex items-center">
                <span
                  className="
                    font-display
                    text-lg
                    font-semibold
                    leading-none
                    tracking-[-0.02em]
                    text-ink
                    sm:text-xl
                  "
                >
                  {typingWord}
                </span>

                {/* CURSOR */}

                <motion.span
                  animate={{
                    opacity: [1, 0, 1],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="
                    ml-1.5
                    h-5
                    w-[2px]
                    rounded-full
                    bg-red
                    sm:h-6
                  "
                />
              </div>
            </div>
          </div>

          {/* =====================================================
              RIGHT VISUAL
          ===================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
              scale: 0.96,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            viewport={{
              once: true,
              margin: "-10% 0px",
            }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              relative
              flex
              min-h-[300px]
              items-center
              justify-center
              overflow-visible
              sm:min-h-[350px]
              md:min-h-[380px]
              lg:min-h-[400px]
            "
          >
            <MarketingVisual />
          </motion.div>
        </motion.div>

        {/* =====================================================
            FILTERS
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
            delay: 0.1,
          }}
          className="
            mt-8
            md:mt-10
          "
        >
          <div
            className="
              flex
              gap-2
              overflow-x-auto
              pb-2
              scrollbar-none
            "
          >
            {CATEGORY_TABS.map((tab) => {
              const active = activeTab === tab;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    relative
                    shrink-0
                    overflow-hidden
                    rounded-full
                    border
                    px-5
                    py-2.5
                    text-[13px]
                    font-semibold
                    transition-all
                    duration-300
                    ${
                      active
                        ? "border-ink bg-ink text-white shadow-lg shadow-ink/10"
                        : "border-ink/10 bg-white/70 text-ink/55 hover:border-ink/25 hover:bg-white hover:text-ink"
                    }
                  `}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* =====================================================
            PINTEREST GRID
        ===================================================== */}

        <motion.div
          layout
          className="
            mt-10
            columns-2
            gap-3
            sm:columns-2
            md:columns-3
            md:gap-4
            lg:columns-4
            xl:columns-5
          "
        >
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <motion.button
                key={item.id}
                layout
                initial={{
                  opacity: 0,
                  y: 30,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.94,
                }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(
                    index * 0.035,
                    0.25
                  ),
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={() => setSelected(item)}
                className="
                  group
                  relative
                  mb-3
                  block
                  w-full
                  break-inside-avoid
                  overflow-hidden
                  rounded-[14px]
                  bg-mist
                  text-left
                  shadow-[0_2px_10px_rgba(0,0,0,0.035)]
                  transition-all
                  duration-500
                  hover:-translate-y-1
                  hover:shadow-[0_18px_45px_rgba(0,0,0,0.12)]
                  md:mb-4
                  md:rounded-[16px]
                "
              >
                {/* IMAGE */}

                <div className="relative w-full overflow-hidden">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    width={1000}
                    height={1000}
                    loading={
                      index < 5
                        ? "eager"
                        : "lazy"
                    }
                    sizes="
                      (max-width: 640px) 50vw,
                      (max-width: 1024px) 33vw,
                      (max-width: 1280px) 25vw,
                      20vw
                    "
                    className="
                      block
                      h-auto
                      w-full
                      object-cover
                      transition-transform
                      duration-700
                      ease-[cubic-bezier(0.16,1,0.3,1)]
                      group-hover:scale-[1.045]
                    "
                  />

                  {/* DARK HOVER */}

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/75
                      via-black/5
                      to-transparent
                      opacity-0
                      transition-opacity
                      duration-300
                      group-hover:opacity-100
                    "
                  />

                  {/* PROJECT INFO */}

                  <div
                    className="
                      absolute
                      inset-x-0
                      bottom-0
                      translate-y-3
                      p-4
                      opacity-0
                      transition-all
                      duration-300
                      ease-out
                      group-hover:translate-y-0
                      group-hover:opacity-100
                    "
                  >
                    <span
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        text-white/65
                      "
                    >
                      {item.category}
                    </span>

                    <div
                      className="
                        mt-1.5
                        flex
                        items-end
                        justify-between
                        gap-3
                      "
                    >
                      <span
                        className="
                          font-display
                          text-[14px]
                          font-semibold
                          leading-tight
                          text-white
                          md:text-[15px]
                        "
                      >
                        {item.title}
                      </span>

                      <span
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-white
                          text-ink
                          transition-transform
                          duration-300
                          group-hover:rotate-45
                        "
                      >
                        <ArrowUpRight
                          size={14}
                          strokeWidth={2.2}
                        />
                      </span>
                    </div>
                  </div>

                  {/* TOP CATEGORY */}

                  <div
                    className="
                      absolute
                      left-3
                      top-3
                      rounded-full
                      bg-white/90
                      px-2.5
                      py-1
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-ink/65
                      opacity-0
                      backdrop-blur-sm
                      transition-opacity
                      duration-300
                      group-hover:opacity-100
                    "
                  >
                    {item.category}
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {items.length === 0 && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="py-24 text-center"
          >
            <p className="text-sm text-ink/40">
              No projects found in this category.
            </p>
          </motion.div>
        )}
      </div>

      {/* =====================================================
          MODAL
      ===================================================== */}

      <ProjectModal
        item={selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}

/* =========================================================
   PROJECT MODAL
========================================================= */

function ProjectModal({
  item,
  onClose,
}: {
  item: PublicPortfolioItem | null;
  onClose: () => void;
}) {
  const [activeImage, setActiveImage] = useState(0);

  /* RESET ACTIVE IMAGE */

  useEffect(() => {
    if (item) {
      setActiveImage(0);
    }
  }, [item]);

  /* LOCK BODY SCROLL */

  useEffect(() => {
    document.body.style.overflow = item
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [item]);

  /* ESCAPE KEY */

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKey
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKey
      );
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.25,
          }}
          className="
            fixed
            inset-0
            z-[70]
            flex
            items-center
            justify-center
            bg-ink/75
            p-3
            backdrop-blur-md
            sm:p-5
            md:p-8
          "
          onClick={onClose}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.97,
            }}
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
            className="
              max-h-[92vh]
              w-full
              max-w-5xl
              overflow-y-auto
              rounded-[20px]
              bg-white
              shadow-2xl
              md:rounded-[24px]
            "
          >
            {/* HERO IMAGE */}

            <div
              className="
                relative
                aspect-[16/10]
                w-full
                overflow-hidden
                bg-mist
                md:aspect-[16/9]
              "
            >
              <Image
                src={item.images[activeImage]}
                alt={item.title}
                fill
                sizes="
                  (max-width: 768px) 100vw,
                  1024px
                "
                className="object-cover"
                priority
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/30
                  via-transparent
                  to-transparent
                "
              />

              {/* CLOSE */}

              <button
                aria-label="Close project"
                onClick={onClose}
                className="
                  absolute
                  right-4
                  top-4
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-white/90
                  text-ink
                  shadow-lg
                  backdrop-blur
                  transition-all
                  hover:scale-105
                  hover:bg-white
                  md:right-5
                  md:top-5
                "
              >
                <X
                  size={18}
                  strokeWidth={2}
                />
              </button>
            </div>

            {/* THUMBNAILS */}

            {item.images.length > 1 && (
              <div
                className="
                  flex
                  gap-2
                  overflow-x-auto
                  border-b
                  border-ink/8
                  p-4
                  md:p-5
                "
              >
                {item.images.map(
                  (src, index) => (
                    <button
                      key={`${src}-${index}`}
                      onClick={() =>
                        setActiveImage(index)
                      }
                      className={`
                        relative
                        h-14
                        w-20
                        shrink-0
                        overflow-hidden
                        rounded-lg
                        transition-all
                        duration-200
                        ${
                          index === activeImage
                            ? "opacity-100 ring-2 ring-red ring-offset-2"
                            : "opacity-50 hover:opacity-90"
                        }
                      `}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  )
                )}
              </div>
            )}

            {/* DETAILS */}

            <div className="p-6 md:p-10">
              <div
                className="
                  flex
                  flex-col
                  gap-6
                  md:flex-row
                  md:items-start
                  md:justify-between
                "
              >
                <div className="max-w-2xl">
                  <span
                    className="
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-red
                    "
                  >
                    {item.category}
                  </span>

                  <h3
                    className="
                      mt-2
                      font-display
                      text-3xl
                      font-semibold
                      leading-tight
                      tracking-[-0.025em]
                      text-ink
                      md:text-4xl
                    "
                  >
                    {item.title}
                  </h3>
                </div>

                <div
                  className="
                    hidden
                    shrink-0
                    rounded-full
                    border
                    border-ink/10
                    px-4
                    py-2
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-ink/45
                    md:block
                  "
                >
                  Selected Work
                </div>
              </div>

              {/* META */}

              <div
                className="
                  mt-8
                  grid
                  grid-cols-1
                  gap-6
                  border-y
                  border-ink/8
                  py-7
                  sm:grid-cols-2
                "
              >
                <div>
                  <span
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.16em]
                      text-ink/35
                    "
                  >
                    Client Industry
                  </span>

                  <p
                    className="
                      mt-2
                      text-[15px]
                      font-medium
                      text-ink
                    "
                  >
                    {item.client}
                  </p>
                </div>

                <div>
                  <span
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.16em]
                      text-ink/35
                    "
                  >
                    Services Provided
                  </span>

                  <p
                    className="
                      mt-2
                      text-[15px]
                      font-medium
                      leading-6
                      text-ink
                    "
                  >
                    {item.services.join(", ")}
                  </p>
                </div>
              </div>

              {/* DESCRIPTION */}

              <p
                className="
                  mt-7
                  max-w-3xl
                  text-[15px]
                  leading-7
                  text-ink/60
                  md:text-base
                  md:leading-8
                "
              >
                {item.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}