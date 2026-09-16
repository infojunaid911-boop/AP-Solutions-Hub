"use client";

import { motion, useReducedMotion } from "framer-motion";
import { StudioVisual } from "./visuals";

export default function AboutHero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-paper pb-16 pt-36 md:pb-24 md:pt-44">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-red/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-ink/[0.04] blur-3xl" />

      <div className="mx-auto grid max-w-shell items-center gap-10 px-6 md:px-10 lg:grid-cols-[1.15fr_0.95fr] lg:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-red">
            About AP Solutions Hub
          </span>
          <h1 className="mt-5 font-display text-[12vw] font-semibold leading-[0.98] tracking-[-0.035em] text-ink sm:text-6xl lg:text-[4.4rem]">
            Design in one hand.
            <span className="mt-1 block text-ink/35">Engineering in the other.</span>
          </h1>
          <p className="mt-7 max-w-xl font-body text-base leading-relaxed text-ink/60 sm:text-lg">
            AP Solutions Hub brings websites, dashboards, marketing, branding
            and 3D visualization together under one roof — so a business
            doesn&apos;t have to piece its digital presence together from
            five different vendors.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <StudioVisual />
        </motion.div>
      </div>

      <div className="mt-16 overflow-hidden border-y border-ink/10 py-4">
        <motion.div
          className="flex whitespace-nowrap font-display text-sm font-semibold uppercase tracking-[0.28em] text-ink/35"
          animate={prefersReducedMotion ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 2 }).map((_, loop) => (
            <span key={loop} className="flex gap-10 pr-10">
              {[
                "Websites",
                "Dashboards",
                "Marketing",
                "Graphic Design",
                "3D Architecture",
                "Social Media",
              ].map((item) => (
                <span key={`${loop}-${item}`} className="flex items-center gap-10">
                  {item}
                  <span className="h-1 w-1 rounded-full bg-red" />
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
