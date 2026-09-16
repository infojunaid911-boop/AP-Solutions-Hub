"use client";

import { SectionCopy, SplitBlock } from "./Scene";
import { TechVisual } from "./visuals";
import { TECH_LAYERS } from "./content";

export default function Technologies() {
  return (
    <section id="technologies" className="bg-offwhite py-24 md:py-32">
      <SplitBlock invert visual={<TechVisual />}>
        <SectionCopy
          index="04"
          title={
            <>
              Technologies We Use
              <span className="mt-1 block text-ink/35">Modern, mobile-first, scalable.</span>
            </>
          }
        >
          <p>
            The stack is chosen for the job: systems that load quickly,
            scale cleanly, and stay maintainable after launch — not a
            parade of logos.
          </p>
        </SectionCopy>
      </SplitBlock>

      <div className="mx-auto mt-16 max-w-shell px-6 md:px-10">
        <div className="grid overflow-hidden rounded-3xl border border-ink/10 md:grid-cols-5">
          {TECH_LAYERS.map((layer, i) => (
            <div
              key={layer.title}
              className="border-b border-ink/10 bg-paper p-6 transition-colors duration-300 hover:bg-offwhite md:border-b-0 md:border-r md:border-ink/10 md:p-7 md:last:border-r-0"
            >
              <span className="font-display text-xs font-semibold text-red">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                {layer.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-ink/55">
                {layer.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
