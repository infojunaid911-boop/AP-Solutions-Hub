"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useTilt } from "./useTilt";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function TiltScene({
  children,
  className = "",
  range = 9,
}: {
  children: ReactNode;
  className?: string;
  range?: number;
}) {
  const { ref, rotateX, rotateY, onMouseMove, onMouseLeave, prefersReducedMotion } =
    useTilt(range);

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`relative [perspective:1400px] ${className}`}
    >
      <motion.div
        className="relative h-full w-full"
        style={
          prefersReducedMotion
            ? undefined
            : { rotateX, rotateY, transformStyle: "preserve-3d" }
        }
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red/[0.07] blur-3xl" />
        {children}
      </motion.div>
    </div>
  );
}

export function SplitBlock({
  invert = false,
  children,
  visual,
}: {
  invert?: boolean;
  children: ReactNode;
  visual: ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-shell items-center gap-12 px-6 md:px-10 lg:grid-cols-2 lg:gap-16">
      <div className={invert ? "lg:order-2" : ""}>{children}</div>
      <div className={invert ? "lg:order-1" : ""}>{visual}</div>
    </div>
  );
}

export function SectionCopy({
  index,
  kicker,
  title,
  children,
  light = false,
}: {
  index?: string;
  kicker?: string;
  title: ReactNode;
  children?: ReactNode;
  light?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      {index && (
        <span
          className={`font-display text-sm font-semibold ${light ? "text-red" : "text-red"}`}
        >
          {index}
        </span>
      )}
      {kicker && (
        <span
          className={`block font-display text-sm font-semibold uppercase tracking-[0.2em] ${
            index ? "mt-3" : ""
          } ${light ? "text-red" : "text-red"}`}
        >
          {kicker}
        </span>
      )}
      <h2
        className={`font-display text-3xl font-semibold leading-[1.06] tracking-[-0.02em] sm:text-4xl lg:text-[2.75rem] ${
          index || kicker ? "mt-3" : ""
        } ${light ? "text-white" : "text-ink"}`}
      >
        {title}
      </h2>
      {children && (
        <div
          className={`mt-5 max-w-lg font-body text-base leading-relaxed sm:text-lg ${
            light ? "text-white/60" : "text-ink/60"
          }`}
        >
          {children}
        </div>
      )}
    </motion.div>
  );
}
