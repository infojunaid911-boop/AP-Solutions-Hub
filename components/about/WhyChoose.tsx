"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionCopy, SplitBlock } from "./Scene";
import { StudioVisual } from "./visuals";
import { STUDIO_ADVANTAGES } from "./content";

export default function WhyChoose() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="why-choose-us" className="bg-paper py-24 md:py-32">
      <SplitBlock visual={<StudioVisual />}>
        <SectionCopy
          index="03"
          title={
            <>
              Why Choose Us
              <span className="mt-1 block text-ink/35">Creative enough to stand out.</span>
            </>
          }
        >
          <p>
            Smart enough to perform. The same differentiators that already
            shape the work — quality, custom systems, speed of communication
            — without a generic agency pitch.
          </p>
        </SectionCopy>
      </SplitBlock>

      <div className="mx-auto mt-16 max-w-shell px-6 md:px-10">
        <div className="border-t border-ink/10">
          {STUDIO_ADVANTAGES.map((item, i) => (
            <motion.div
              key={item}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ delay: i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex items-center justify-between border-b border-ink/10 py-6"
            >
              <span className="pointer-events-none absolute inset-y-0 left-0 w-0 bg-red/[0.06] transition-all duration-300 ease-premium group-hover:w-full" />
              <span className="relative flex items-center gap-5">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full bg-red transition-transform duration-300 ease-premium ${
                    hovered === i ? "scale-150" : ""
                  }`}
                />
                <span className="font-display text-xl font-semibold text-ink/60 transition-all duration-300 ease-premium group-hover:translate-x-2 group-hover:text-ink sm:text-2xl">
                  {item}
                </span>
              </span>
              <ArrowUpRight
                size={20}
                strokeWidth={1.8}
                className="relative shrink-0 text-ink/0 transition-all duration-300 ease-premium group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-red"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
