"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { StudioVisual } from "@/components/about/visuals";

export default function WhyChooseUs() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="why-us"
      className="relative overflow-hidden bg-offwhite py-24 md:py-32"
    >
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-red/[0.06] blur-3xl" />

      <div className="relative mx-auto grid max-w-shell items-center gap-12 px-6 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-red">
            Why AP Solutions Hub
          </span>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.06] tracking-[-0.02em] text-ink sm:text-5xl lg:text-[3.35rem]">
            The studio
            <span className="block text-ink/35">behind the work.</span>
          </h2>
          <p className="mt-6 max-w-md font-body text-base leading-relaxed text-ink/60 sm:text-lg">
            One team for websites, dashboards, marketing, branding and 3D
            visualization — design and engineering in the same room.
          </p>

          <Link
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-display text-sm font-semibold text-white transition-all duration-300 ease-premium hover:bg-red"
          >
            Explore More
            <ArrowUpRight
              size={16}
              strokeWidth={2}
              className="transition-transform duration-300 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.7, delay: prefersReducedMotion ? 0 : 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <StudioVisual />
        </motion.div>
      </div>
    </section>
  );
}
