"use client";

import { SectionCopy, SplitBlock } from "./Scene";
import { ProcessVisual } from "./visuals";
import { PROCESS_STEPS } from "./content";

export default function HowWeWork() {
  return (
    <section id="how-we-work" className="bg-paper py-24 md:py-32">
      <SplitBlock visual={<ProcessVisual />}>
        <SectionCopy
          index="05"
          title={
            <>
              How We Work
              <span className="mt-1 block text-ink/35">Simple process. Serious results.</span>
            </>
          }
        >
          <p>You explain your idea. We handle the complicated part.</p>
        </SectionCopy>
      </SplitBlock>

      <div className="mx-auto mt-16 grid max-w-shell gap-5 px-6 sm:grid-cols-2 lg:grid-cols-4 md:px-10">
        {PROCESS_STEPS.map((step) => (
          <article
            key={step.number}
            className="group rounded-2xl border border-ink/10 bg-offwhite p-6 transition-all duration-300 ease-premium hover:-translate-y-1 hover:border-red/40"
          >
            <span className="font-display text-sm font-bold text-red">{step.number}</span>
            <h3 className="mt-4 font-display text-xl font-semibold tracking-[-0.02em] text-ink">
              {step.title}
            </h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-ink/55">
              {step.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
