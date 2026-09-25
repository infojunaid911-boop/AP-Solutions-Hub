"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Globe2,
  BarChart3,
  Megaphone,
  Cuboid,
  PenTool,
} from "lucide-react";

export default function WhyChooseUs() {
  const prefersReducedMotion = useReducedMotion();

  const float = (distance = 4, delay = 0) => ({
    animate: prefersReducedMotion
      ? undefined
      : {
          y: [-distance, distance, -distance],
        },
    transition: {
      duration: 4.5,
      delay,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  });

  return (
    <section
      id="why-us"
      className="relative overflow-hidden bg-gradient-to-br from-[#8F0B10] via-[#EC1D25] to-[#65070B] py-20 md:py-24 lg:py-28"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-white/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-white/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF5A60]/[0.10] blur-3xl" />

      <div className="relative mx-auto grid max-w-shell items-center gap-10 px-6 md:px-10 lg:grid-cols-[0.96fr_1.04fr] lg:gap-6 xl:px-8">
        {/* =====================================================
            LEFT SIDE
        ===================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative z-20"
        >
          <span className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-white/75 sm:text-sm">
            Why AP Solutions Hub
          </span>

          <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.35rem]">
            One team.
            <span className="block text-white/75">
              Every digital solution.
            </span>
          </h2>

          <h3 className="mt-5 max-w-lg font-display text-xl font-medium leading-tight tracking-[-0.02em] text-white/65 sm:text-2xl">
            Built to move your business forward.
          </h3>

          <p className="mt-5 max-w-[500px] font-body text-base leading-relaxed text-white/70 sm:text-lg">
            Websites, dashboards, marketing, design and 3D strategy,
            creativity and technology brought together under one roof.
          </p>

          <Link
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-7 inline-flex items-center gap-3 rounded-full bg-black px-6 py-3.5 font-display text-sm font-semibold text-[#FFFFFF] transition-all duration-300 hover:bg-white/90 sm:px-7"
          >
            Meet the Studio
            <ArrowUpRight
              size={16}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </motion.div>

        {/* =====================================================
            RIGHT VISUAL
        ===================================================== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{
            duration: 0.8,
            delay: prefersReducedMotion ? 0 : 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative mx-auto w-full max-w-[620px]"
        >
          {/* ===================================================
              VISUAL CANVAS
          =================================================== */}
          <div className="relative mx-auto h-[340px] w-full max-w-[620px] sm:h-[410px] md:h-[470px] lg:h-[500px]">

            {/* =================================================
                WHITE CURVED CONNECTOR LINES
            ================================================= */}
            <svg
              className="pointer-events-none absolute inset-0 z-0 h-full w-full"
              viewBox="0 0 620 500"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Website */}
              <path
                d="M245 88 C180 62 105 72 82 120 C68 150 52 165 15 168"
                stroke="#FFFFFF"
                strokeWidth="1.1"
                opacity="0.45"
              />

              {/* Dashboard */}
              <path
                d="M385 80 C455 65 520 78 540 125 C553 154 570 168 610 172"
                stroke="#FFFFFF"
                strokeWidth="1.1"
                opacity="0.45"
              />

              {/* Marketing */}
              <path
                d="M238 405 C170 420 105 407 92 360 C83 327 58 315 18 315"
                stroke="#FFFFFF"
                strokeWidth="1.1"
                opacity="0.45"
              />

              {/* 3D */}
              <path
                d="M395 402 C465 415 522 400 535 355 C545 322 568 308 608 305"
                stroke="#FFFFFF"
                strokeWidth="1.1"
                opacity="0.45"
              />

              {/* Design */}
              <path
                d="M310 455 C345 435 380 435 408 455"
                stroke="#FFFFFF"
                strokeWidth="1.1"
                opacity="0.35"
              />
            </svg>

            {/* =================================================
                WEBSITE
            ================================================= */}
            <motion.div
              {...float(4, 0)}
              className="
                absolute
                left-[10%] top-[6%]
                z-10
                w-[35%]
                rotate-[-7deg]
                overflow-visible
              "
            >
              {/* Image */}
              <div className="overflow-hidden rounded-[9px] border-[5px] border-white bg-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] sm:rounded-[12px] sm:border-[6px]">
                <div className="aspect-[1.55/1] bg-[#e8e8e8]">
                  <img
                    src="/previews/Websites.jpeg"
                    alt="Website project"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Label */}
              <div
                className="
                  absolute
                  -bottom-5 -left-8
                  z-30
                  flex
                  min-w-[145px]
                  items-center
                  gap-2.5
                  rounded-[11px]
                  bg-white
                  px-3 py-2.5
                  shadow-[0_10px_25px_rgba(0,0,0,0.16)]
                  sm:-bottom-5 sm:-left-7
                  sm:min-w-[160px]
                "
              >
                <Globe2
                  className="h-[18px] w-[18px] shrink-0 text-[#B51218]"
                  strokeWidth={1.8}
                />

                <div>
                  <div className="font-display text-[11px] font-semibold text-[#151515] sm:text-xs">
                    Websites
                  </div>

                  <div className="mt-0.5 font-body text-[9px] text-[#777777] sm:text-[10px]">
                    Build your presence
                  </div>
                </div>
              </div>
            </motion.div>

            {/* =================================================
                DASHBOARD
            ================================================= */}
            <motion.div
              {...float(4, 0.4)}
              className="
                absolute
                right-[6%] top-[5%]
                z-10
                w-[35%]
                rotate-[6deg]
                overflow-visible
              "
            >
              <div className="overflow-hidden rounded-[9px] border-[5px] border-white bg-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] sm:rounded-[12px] sm:border-[6px]">
                <div className="aspect-[1.5/1] bg-[#e8e8e8]">
                  <img
                    src="/previews/Dashboards.jpeg"
                    alt="Dashboard project"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Label */}
              <div
                className="
                  absolute
                  -bottom-5 -right-7
                  z-30
                  flex
                  min-w-[150px]
                  items-center
                  gap-2.5
                  rounded-[11px]
                  bg-white
                  px-3 py-2.5
                  shadow-[0_10px_25px_rgba(0,0,0,0.16)]
                  sm:-bottom-5 sm:-right-6
                  sm:min-w-[165px]
                "
              >
                <BarChart3
                  className="h-[18px] w-[18px] shrink-0 text-[#B51218]"
                  strokeWidth={1.8}
                />

                <div>
                  <div className="font-display text-[11px] font-semibold text-[#151515] sm:text-xs">
                    Dashboards
                  </div>

                  <div className="mt-0.5 font-body text-[9px] text-[#777777] sm:text-[10px]">
                    Understand your data
                  </div>
                </div>
              </div>
            </motion.div>

            {/* =================================================
                MARKETING
            ================================================= */}
            <motion.div
              {...float(3.5, 0.8)}
              className="
                absolute
                left-[14%] top-[43%]
                z-[8]
                w-[24%]
                rotate-[-7deg]
                overflow-visible
              "
            >
              <div className="overflow-hidden rounded-[8px] border-[5px] border-white bg-white shadow-[0_13px_28px_rgba(0,0,0,0.18)] sm:rounded-[11px] sm:border-[6px]">
                <div className="aspect-[0.68/1] bg-[#e8e8e8]">
                  <img
                    src="/previews/about-marketing.jpg"
                    alt="Marketing project"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Label */}
              <div
                className="
                  absolute
                  -bottom-5 -left-10
                  z-30
                  flex
                  min-w-[145px]
                  items-center
                  gap-2.5
                  rounded-[11px]
                  bg-white
                  px-3 py-2.5
                  shadow-[0_10px_25px_rgba(0,0,0,0.16)]
                  sm:-bottom-5 sm:-left-8
                "
              >
                <Megaphone
                  className="h-[18px] w-[18px] shrink-0 text-[#B51218]"
                  strokeWidth={1.8}
                />

                <div>
                  <div className="font-display text-[11px] font-semibold text-[#151515] sm:text-xs">
                    Marketing
                  </div>

                  <div className="mt-0.5 font-body text-[9px] text-[#777777] sm:text-[10px]">
                    Reach your audience
                  </div>
                </div>
              </div>
            </motion.div>

            {/* =================================================
                3D
            ================================================= */}
            <motion.div
              {...float(3.5, 0.6)}
              className="
                absolute
                right-[2%] top-[45%]
                z-[8]
                w-[27%]
                rotate-[-7deg]
                overflow-visible
              "
            >
              <div className="overflow-hidden rounded-[9px] border-[5px] border-white bg-white shadow-[0_13px_28px_rgba(0,0,0,0.18)] sm:rounded-[11px] sm:border-[6px]">
                <div className="aspect-[1.12/1] bg-[#e8e8e8]">
                  <img
                    src="/previews/heroarchitecture.jpg"
                    alt="3D architecture project"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Label */}
              <div
                className="
                  absolute
                  -bottom-5 -right-9
                  z-30
                  flex
                  min-w-[135px]
                  items-center
                  gap-2.5
                  rounded-[11px]
                  bg-white
                  px-3 py-2.5
                  shadow-[0_10px_25px_rgba(0,0,0,0.16)]
                  sm:-bottom-5 sm:-right-7
                  sm:min-w-[150px]
                "
              >
                <Cuboid
                  className="h-[18px] w-[18px] shrink-0 text-[#B51218]"
                  strokeWidth={1.8}
                />

                <div>
                  <div className="font-display text-[11px] font-semibold text-[#151515] sm:text-xs">
                    3D
                  </div>

                  <div className="mt-0.5 font-body text-[9px] text-[#777777] sm:text-[10px]">
                    Visualize your ideas
                  </div>
                </div>
              </div>
            </motion.div>

            {/* =================================================
                DESIGN
            ================================================= */}
            <motion.div
              {...float(3.5, 1)}
              className="
                absolute
                bottom-[5%] left-[40%]
                z-[9]
                w-[29%]
                rotate-[5deg]
                overflow-visible
              "
            >
              <div className="overflow-hidden rounded-[9px] border-[5px] border-white bg-white shadow-[0_13px_28px_rgba(0,0,0,0.18)] sm:rounded-[11px] sm:border-[6px]">
                <div className="aspect-[1.4/1] bg-[#e8e8e8]">
                  <img
                    src="/previews/Marketing.jpeg"
                    alt="Design project"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Label */}
              <div
                className="
                  absolute
                  -bottom-5 right-[-45%]
                  z-30
                  flex
                  min-w-[135px]
                  items-center
                  gap-2.5
                  rounded-[11px]
                  bg-white
                  px-3 py-2.5
                  shadow-[0_10px_25px_rgba(0,0,0,0.16)]
                  sm:right-[-40%]
                  sm:min-w-[150px]
                "
              >
                <PenTool
                  className="h-[18px] w-[18px] shrink-0 text-[#B51218]"
                  strokeWidth={1.8}
                />

                <div>
                  <div className="font-display text-[11px] font-semibold text-[#151515] sm:text-xs">
                    Design
                  </div>

                  <div className="mt-0.5 font-body text-[9px] text-[#777777] sm:text-[10px]">
                    Build your identity
                  </div>
                </div>
              </div>
            </motion.div>

            {/* =================================================
                CENTER AP CARD
            ================================================= */}
            <motion.div
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      y: [-3, 3, -3],
                    }
              }
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                absolute
                left-[33%]
                top-[33%]
                z-30
                w-[38%]
                -translate-x-1/2
                -translate-y-1/2
              "
            >
              <div
                className="
                  rounded-[12px]
                  border
                  border-white/40
                  bg-white
                  px-2
                  py-2.5
                  text-center
                  shadow-[0_14px_35px_rgba(0,0,0,0.30)]
                  sm:rounded-[16px]
                  sm:px-3
                  sm:py-4
                "
              >
                <img
                  src="/previews/portrait-logo.png"
                  alt="AP Solutions Hub"
                  className="mx-auto h-auto w-[72%] max-w-[110px] object-contain"
                />

                <p className="mt-1 font-body text-[5px] leading-relaxed text-[#555555] sm:mt-1.5 sm:text-[8px]">
                  Digital solutions for modern businesses.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}