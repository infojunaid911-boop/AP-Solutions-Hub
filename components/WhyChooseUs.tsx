"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const ADVANTAGES = [
  "Premium Quality",
  "Custom Solutions",
  "Modern Technology",
  "Fast Communication",
  "Business-Focused Strategy",
  "Mobile-First Design",
  "Scalable Systems",
  "Ongoing Support",
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-shell px-6 md:px-10">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-8">
          {/* Large typography */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-32 lg:self-start"
          >
            <h2 className="font-display text-4xl font-semibold leading-[1.08] tracking-[-0.01em] text-white sm:text-5xl lg:text-[3.25rem]">
              Creative enough
              <br />
              to stand out.
              <br />
              <span className="text-white/40">Smart enough</span>
              <br />
              to perform.
            </h2>
          </motion.div>

          {/* Interactive list */}
          <div className="border-t border-white/10">
            {ADVANTAGES.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex items-center justify-between border-b border-white/10 py-6 transition-colors duration-300"
              >
                <span className="pointer-events-none absolute inset-y-0 left-0 w-0 bg-red/[0.08] transition-all duration-300 ease-premium group-hover:w-full" />
                <span className="relative flex items-center gap-5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red transition-transform duration-300 ease-premium group-hover:scale-150" />
                  <span className="font-display text-xl font-semibold text-white/70 transition-all duration-300 ease-premium group-hover:translate-x-2 group-hover:text-white sm:text-2xl">
                    {item}
                  </span>
                </span>
                <ArrowUpRight
                  size={20}
                  strokeWidth={1.8}
                  className="relative shrink-0 text-white/0 transition-all duration-300 ease-premium group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-red"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
