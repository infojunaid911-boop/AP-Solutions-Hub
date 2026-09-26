
"use client";

import { motion } from "framer-motion";
import StatCounter from "./StatCounter";

const TAGS = [
  "Websites",
  "Dashboards",
  "Digital Marketing",
  "Graphic & UI/UX Design",
  "3D Architecture",
  "Software Development",
  "E-commerce Solutions",
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.08 * i,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-offwhite pb-24 pt-36 md:pb-32 md:pt-44"
    >
      <div className="mx-auto grid max-w-shell items-center gap-12 px-5 sm:px-8 md:gap-16 md:px-10 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:px-10">

        {/* LEFT: COPY */}
        <div className="min-w-0">

          {/* Heading */}
          <motion.h1
            custom={0}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="max-w-[700px] font-display text-[11.5vw] font-semibold leading-[1.05] tracking-[-0.035em] text-ink sm:text-6xl md:text-[8vw] lg:text-[3.6rem] xl:text-[4rem]"
          >
            We build digital solutions that help businesses grow.
          </motion.h1>

          {/* Description */}
          <motion.p
            custom={1}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-5 max-w-[46ch] text-[15px] leading-[1.7] text-ink/65 sm:mt-7 sm:text-[16.5px] md:text-[17.5px]"
          >
            From websites and business dashboards to digital marketing,
            creative design and 3D visualization. We build everything your
            business needs to stand out and grow.
          </motion.p>

          {/* CTA BUTTONS */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9 sm:gap-4"
          >
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-red sm:px-7 sm:py-3.5 sm:text-[14.5px]"
            >
              Start Your Project
            </a>

            <a
              href="#portfolio"
              className="inline-flex items-center justify-center rounded-full border border-ink/15 px-5 py-3 text-[13px] font-semibold text-ink transition-colors duration-200 hover:border-ink sm:px-7 sm:py-3.5 sm:text-[14.5px]"
            >
              Explore Our Work
            </a>
          </motion.div>

          {/* SERVICES */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mx-auto mt-9 flex max-w-[620px] flex-wrap items-center justify-center gap-x-3 gap-y-3 text-center sm:mt-10 sm:gap-x-4 sm:gap-y-3"
          >
            {TAGS.map((tag, i) => (
              <div
                key={tag}
                className="flex items-center gap-3 text-[12px] font-medium text-ink/50 sm:text-[13.5px]"
              >
                <span>{tag}</span>

                {i < TAGS.length - 1 && (
                  <span className="h-1 w-1 shrink-0 rounded-full bg-ink/25" />
                )}
              </div>
            ))}
          </motion.div>

          {/* STATS */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-10 grid grid-cols-3 gap-3 border-t border-ink/10 pt-6 sm:mt-14 sm:max-w-md sm:gap-6 sm:pt-8"
          >
            <StatCounter
              value={125}
              suffix="+"
              label="Projects Completed"
            />

            <StatCounter
              value={37}
              suffix="+"
              label="Happy Clients"
            />

            <StatCounter
              value={16}
              suffix="+"
              label="Digital Services"
            />
          </motion.div>
        </div>

        {/* RIGHT: LAYERED VISUAL COMPOSITION */}
        <div className="relative mx-auto mt-2 h-[330px] w-full max-w-[370px] sm:h-[420px] sm:max-w-[440px] lg:mt-0 lg:h-[520px] lg:max-w-none">

          {/* 1. Website Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -6 }}
            animate={{ opacity: 1, y: 0, rotate: -6 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute left-0 top-2 z-10 w-[69%] overflow-hidden rounded-lg border border-ink/10 bg-white shadow-[0_20px_50px_-15px_rgba(10,10,10,0.18)] sm:rounded-xl"
          >
            <img
              src="/previews/herowebsites.jpg"
              alt="AP Solutions Hub Website Development"
              className="block h-auto w-full object-cover"
            />
          </motion.div>

          {/* 2. Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 4 }}
            animate={{ opacity: 1, y: 0, rotate: 4 }}
            transition={{
              duration: 0.8,
              delay: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute right-0 top-[76px] z-20 w-[62%] overflow-hidden rounded-lg border border-ink/10 bg-white shadow-[0_20px_50px_-15px_rgba(10,10,10,0.3)] sm:top-24 sm:rounded-xl lg:top-28"
          >
            <img
              src="/previews/herodashboard.jpg"
              alt="AP Solutions Hub Business Dashboard"
              className="block h-auto w-full object-cover"
            />
          </motion.div>

          {/* 3. Marketing / Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: -3 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute bottom-2 left-3 z-10 w-[45%] overflow-hidden rounded-lg border border-ink/10 bg-white shadow-[0_20px_50px_-15px_rgba(10,10,10,0.18)] sm:left-4 sm:rounded-xl lg:bottom-6"
          >
            <img
              src="/previews/heromarketing.jpg"
              alt="AP Solutions Hub Digital Marketing"
              className="aspect-[4/3] w-full object-cover"
            />
          </motion.div>

          {/* 4. 3D Architecture */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.65,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute bottom-8 right-2 z-30 flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-ink/10 bg-white shadow-[0_20px_50px_-15px_rgba(10,10,10,0.18)] sm:bottom-10 sm:h-24 sm:w-24 sm:rounded-xl lg:bottom-16 lg:right-6"
          >
            <img
              src="/previews/heroarchitecture.jpg"
              alt="AP Solutions Hub 3D Architecture"
              className="h-full w-full object-cover"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}