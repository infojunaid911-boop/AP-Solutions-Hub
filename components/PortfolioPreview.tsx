"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { PublicPortfolioItem } from "@/lib/portfolio/getPortfolioItems";

/* ------------------------------------------------------------------ *
 *  PORTFOLIO PREVIEW — "The Archive, at a glance"
 *
 *  A compact, editorial-agency teaser: big centered headline in the
 *  same two-tone display treatment as AboutHero, a fanned/overlapping
 *  arrangement of real project covers (rounded, gently rotated,
 *  raised on hover), a short line of supporting copy, and a "View
 *  All" CTA. No filters, no modal — every card and the CTA both just
 *  route to /portfolio, where PortfolioClient owns the real gallery.
 * ------------------------------------------------------------------ */

const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;

// Preview shows at most 5 covers — enough to read as a fanned
// composition without turning the homepage into a second gallery.
const PREVIEW_COUNT = 5;

export default function PortfolioPreview({
  items,
}: {
  items: PublicPortfolioItem[];
}) {
  const reduce = useReducedMotion() ?? false;
  const previewItems = items.slice(0, PREVIEW_COUNT);
  const total = previewItems.length;
  const center = (total - 1) / 2;

  return (
    <div className="mt-4">
      {/* ================= HEADLINE ================= */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 18 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: EASE_PREMIUM }}
        className="mx-auto max-w-2xl text-center"
      >
        <div className="mb-2 flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-red" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-red">
            WHAT WE'VE BUILT
          </span>
          <span className="h-px w-8 bg-red" />
        </div>

        <h2 className="font-display text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.035em] text-ink sm:text-5xl md:text-[3.6rem]">
          A place we&apos;re proud
          <span className="block text-ink/35">to put our name on.</span>
        </h2>
      </motion.div>

      {/* ================= FANNED IMAGE SHOWCASE ================= */}
      {total > 0 && (
  <motion.div
    initial={reduce ? false : { opacity: 0, y: 24 }}
    whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.7, delay: 0.1, ease: EASE_PREMIUM }}
    className="relative mt-6 flex items-center justify-center md:mt-8"
  >
          <div className="flex items-end justify-center">
            {previewItems.map((item, index) => {
              const offset = index - center;
              const rotate = reduce ? 0 : offset * 6;
              const lift = Math.abs(offset) * 14;
              const scale = 1 - Math.abs(offset) * 0.06;
              const zIndex = 100 - Math.abs(Math.round(offset * 10));

              // On the smallest screens, only the three centre-most
              // cards show — a real, compact mobile composition
              // rather than a shrunken desktop one.
              const mobileVisibility =
                total >= 5 && Math.abs(offset) > 1
                  ? "hidden sm:block"
                  : "";

              return (
                <motion.div
                  key={item.id}
                  initial={reduce ? false : { opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={
                    reduce
                      ? undefined
                      : {
                          opacity: 1,
                          y: lift,
                          scale,
                          rotate,
                        }
                  }
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.65,
                    delay: 0.15 + index * 0.08,
                    ease: EASE_PREMIUM,
                  }}
                  whileHover={
                    reduce
                      ? undefined
                      : {
                          y: lift - 14,
                          scale: scale + 0.06,
                          rotate: 0,
                          zIndex: 200,
                        }
                  }
                  style={{ zIndex }}
                  className={`${mobileVisibility} -ml-6 first:ml-0 sm:-ml-9 md:-ml-12 lg:-ml-14`}
                >
                  <Link
                    href="/portfolio"
                    aria-label={`View ${item.title} in the full portfolio`}
                    className="group block"
                  >
                    <div className="relative h-[168px] w-[128px] overflow-hidden rounded-[16px] bg-mist shadow-[0_18px_40px_-16px_rgba(0,0,0,0.25)] ring-1 ring-black/5 transition-shadow duration-500 ease-premium group-hover:shadow-[0_30px_60px_-18px_rgba(0,0,0,0.35)] sm:h-[210px] sm:w-[160px] sm:rounded-[18px] md:h-[250px] md:w-[190px] lg:h-[275px] lg:w-[210px] lg:rounded-[20px]">
                      <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 35vw, (max-width: 1024px) 22vw, 210px"
                        loading={index < 3 ? "eager" : "lazy"}
                        className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.06]"
                      />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      <span className="pointer-events-none absolute bottom-3 right-3 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-white text-ink opacity-0 shadow-md transition-all duration-300 ease-premium group-hover:translate-y-0 group-hover:opacity-100">
                        <ArrowUpRight size={14} strokeWidth={2.2} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ================= SUPPORTING TEXT + CTA ================= */}
      <motion.div
  initial={reduce ? false : { opacity: 0, y: 16 }}
  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.5 }}
  transition={{ duration: 0.6, delay: 0.2, ease: EASE_PREMIUM }}
  className={`mx-auto flex max-w-lg flex-col items-center gap-4 text-center ${
    total > 0 ? "mt-6 md:mt-8" : "mt-6"
  }`}
>
        <p className="text-[15px] leading-7 text-ink/55 md:text-base">
          From websites and branding to dashboards and 3D experiences,
           here's a look at what we've created for our clients.
          </p>

        <Link
          href="/portfolio"
          className="group inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-[13.5px] font-semibold text-white transition-colors duration-200 hover:bg-red"
        >
          View Our Work
          <ArrowUpRight
            size={16}
            strokeWidth={2.2}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </motion.div>
    </div>
  );
}
