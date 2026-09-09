"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, LineChart } from "lucide-react";
import StatCounter from "./StatCounter";

const TAGS = ["Websites", "Dashboards", "Marketing", "Design", "3D Architecture"];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-offwhite pb-24 pt-36 md:pb-32 md:pt-44">
      <div className="mx-auto grid max-w-shell items-center gap-16 px-6 md:px-10 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        {/* Left: copy */}
        <div>
          <motion.h1
            custom={0}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="font-display text-[13vw] font-semibold leading-[1.03] tracking-[-0.02em] text-ink sm:text-6xl lg:text-[3.6rem] xl:text-[4rem]"
          >
            We build digital solutions that help businesses grow.
          </motion.h1>

          <motion.p
            custom={1}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-7 max-w-[46ch] text-[16.5px] leading-relaxed text-ink/65 md:text-[17.5px]"
          >
            From websites and business dashboards to digital marketing,
            creative design and 3D visualization — we build everything your
            business needs to stand out and grow.
          </motion.p>

          <motion.div
            custom={2}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#contact"
              className="inline-flex items-center rounded-full bg-ink px-7 py-3.5 text-[14.5px] font-semibold text-white transition-colors duration-200 hover:bg-red"
            >
              Start Your Project
            </a>
            <a
              href="#portfolio"
              className="inline-flex items-center rounded-full border border-ink/15 px-7 py-3.5 text-[14.5px] font-semibold text-ink transition-colors duration-200 hover:border-ink"
            >
              Explore Our Work
            </a>
          </motion.div>

          <motion.div
            custom={3}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-2"
          >
            {TAGS.map((tag, i) => (
              <span key={tag} className="flex items-center text-[13.5px] font-medium text-ink/50">
                {tag}
                {i < TAGS.length - 1 && <span className="ml-4 h-1 w-1 rounded-full bg-ink/25" />}
              </span>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-ink/10 pt-8"
          >
            <StatCounter value={100} suffix="+" label="Projects Completed" />
            <StatCounter value={20} suffix="+" label="Happy Clients" />
            <StatCounter value={6} suffix="+" label="Digital Services" />
          </motion.div>
        </div>

        {/* Right: layered visual composition */}
        <div className="relative mx-auto h-[420px] w-full max-w-[440px] lg:h-[520px] lg:max-w-none">
          {/* Website preview card */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -6 }}
            animate={{ opacity: 1, y: 0, rotate: -6 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-2 w-[68%] overflow-hidden rounded-xl border border-ink/10 bg-white shadow-[0_20px_50px_-15px_rgba(10,10,10,0.18)]"
          >
            <div className="flex items-center gap-1.5 border-b border-ink/8 px-3 py-2.5">
              <span className="h-2 w-2 rounded-full bg-ink/15" />
              <span className="h-2 w-2 rounded-full bg-ink/15" />
              <span className="h-2 w-2 rounded-full bg-ink/15" />
              <span className="ml-2 h-4 flex-1 rounded-full bg-mist" />
            </div>
            <div className="space-y-2 p-4">
              <div className="h-3 w-2/3 rounded bg-ink/12" />
              <div className="h-2 w-full rounded bg-mist" />
              <div className="h-2 w-4/5 rounded bg-mist" />
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="h-14 rounded-lg bg-offwhite" />
                <div className="h-14 rounded-lg bg-red/10" />
                <div className="h-14 rounded-lg bg-offwhite" />
              </div>
            </div>
          </motion.div>

          {/* Dashboard card */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 4 }}
            animate={{ opacity: 1, y: 0, rotate: 4 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-24 w-[62%] rounded-xl border border-ink/10 bg-ink p-4 shadow-[0_20px_50px_-15px_rgba(10,10,10,0.3)] lg:top-28"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wide text-white/40">
                Revenue
              </span>
              <LineChart size={14} className="text-red" strokeWidth={2} />
            </div>
            <div className="flex h-16 items-end gap-1.5">
              {[40, 65, 45, 80, 60, 95, 70].map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-sm ${i === 5 ? "bg-red" : "bg-white/20"}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-white">
              <ArrowUpRight size={13} className="text-red" />
              32% this quarter
            </div>
          </motion.div>

          {/* Social tile */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: -3 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-2 left-4 w-[46%] rounded-xl border border-ink/10 bg-white p-3.5 shadow-[0_20px_50px_-15px_rgba(10,10,10,0.18)] lg:bottom-6"
          >
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 shrink-0 rounded-full bg-red/15" />
              <div className="h-2 w-16 rounded bg-ink/12" />
            </div>
            <div className="mt-2.5 aspect-[4/3] w-full rounded-lg bg-offwhite" />
          </motion.div>

          {/* 3D wireframe cube */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-10 right-2 flex h-24 w-24 items-center justify-center rounded-xl border border-ink/10 bg-white shadow-[0_20px_50px_-15px_rgba(10,10,10,0.18)] lg:bottom-16 lg:right-6"
          >
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <path
                d="M26 4 L46 15 V37 L26 48 L6 37 V15 Z"
                stroke="#0A0A0A"
                strokeOpacity="0.25"
                strokeWidth="1.4"
              />
              <path d="M26 4 V26 M26 26 L46 15 M26 26 L6 15 M26 26 V48" stroke="#EC1D25" strokeWidth="1.4" />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
