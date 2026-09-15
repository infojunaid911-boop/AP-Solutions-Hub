"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CATEGORY_TABS } from "@/lib/portfolioData";
import type { PublicPortfolioItem } from "@/lib/portfolio/getPortfolioItems";
import PortfolioModal from "./PortfolioModal";

export default function PortfolioPreview({
  items,
}: {
  items: PublicPortfolioItem[];
}) {
  const [activeTab, setActiveTab] =
    useState<(typeof CATEGORY_TABS)[number]>("All Work");

  const [selected, setSelected] = useState<PublicPortfolioItem | null>(null);

  // Show latest 12 projects from the selected category.
  const filteredItems = useMemo(() => {
    const filtered =
      activeTab === "All Work"
        ? items
        : items.filter((item) => item.category === activeTab);

    return filtered.slice(0, 12);
  }, [items, activeTab]);

  return (
    <>
      {/* ================= FILTERS ================= */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-10"
      >
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const active = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative shrink-0 overflow-hidden rounded-full border px-5 py-2.5 text-[13px] font-semibold transition-all duration-300 ${
                  active
                    ? "border-ink bg-ink text-white shadow-lg shadow-ink/10"
                    : "border-ink/10 bg-white/70 text-ink/55 hover:border-ink/25 hover:bg-white hover:text-ink"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ================= PINTEREST MASONRY GRID ================= */}
      {filteredItems.length > 0 ? (
        <motion.div
          layout
          className="
            mt-12
            columns-2
            gap-3
            sm:columns-3
            md:columns-4
            md:gap-4
          "
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
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
                  delay: Math.min(index * 0.035, 0.25),
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
                <div className="relative w-full overflow-hidden">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    width={0}
                    height={0}
                    loading={index < 6 ? "eager" : "lazy"}
                    sizes="
                      (max-width: 640px) 50vw,
                      (max-width: 1024px) 33vw,
                      25vw
                    "
                    className="
                      block
                      h-auto
                      w-full
                      transition-transform
                      duration-700
                      ease-premium
                      group-hover:scale-[1.045]
                    "
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                  />

                  {/* HOVER OVERLAY */}
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
                      p-3
                      opacity-0
                      transition-all
                      duration-300
                      ease-out
                      group-hover:translate-y-0
                      group-hover:opacity-100
                      md:p-4
                    "
                  >
                    <span
                      className="
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        text-white/65
                        md:text-[9px]
                      "
                    >
                      {item.category}
                    </span>

                    <div className="mt-1.5 flex items-end justify-between gap-2">
                      <span
                        className="
                          font-display
                          text-[12px]
                          font-semibold
                          leading-tight
                          text-white
                          md:text-[14px]
                        "
                      >
                        {item.title}
                      </span>

                      <span
                        className="
                          flex
                          h-7
                          w-7
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-white
                          text-ink
                          transition-transform
                          duration-300
                          group-hover:rotate-45
                          md:h-8
                          md:w-8
                        "
                      >
                        <ArrowUpRight
                          size={13}
                          strokeWidth={2.2}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="
            mt-12
            rounded-[16px]
            border
            border-dashed
            border-ink/10
            bg-white/50
            py-16
            text-center
          "
        >
          <p className="text-sm text-ink/40">
            No projects found in this category.
          </p>
        </motion.div>
      )}

      {/* VIEW ALL */}
      <div className="mt-14 flex justify-center pb-8 md:mt-16 md:pb-12">
        <Link
          href="/portfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="
            group
            inline-flex
            items-center
            gap-2
            rounded-full
            bg-ink
            px-7
            py-3.5
            text-[13.5px]
            font-semibold
            text-white
            transition-colors
            duration-200
            hover:bg-red
          "
        >
          View All

          <ArrowUpRight
            size={16}
            strokeWidth={2.2}
            className="
              transition-transform
              duration-300
              group-hover:translate-x-0.5
              group-hover:-translate-y-0.5
            "
          />
        </Link>
      </div>

      {/* MODAL */}
      <PortfolioModal
        item={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}