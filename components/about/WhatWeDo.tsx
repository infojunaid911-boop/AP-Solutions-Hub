"use client";

import { SectionCopy, SplitBlock } from "./Scene";
import { visualForKind } from "./visuals";
import { FALLBACK_SERVICES, type AboutService } from "./content";

export default function WhatWeDo({
  services,
}: {
  services?: AboutService[];
}) {
  const items =
    services && services.length > 0
      ? services
      : FALLBACK_SERVICES.map((s) => ({
          title: s.title,
          description: s.description,
          kind: s.kind,
        }));

  return (
    <section id="what-we-do" className="bg-offwhite py-24 md:py-32">
      <div className="mx-auto max-w-shell px-6 pb-8 md:px-10">
        <SectionCopy
          index="02"
          title={
            <>
              What We Do
              <span className="mt-1 block text-ink/35">Disciplines, one studio.</span>
            </>
          }
        >
          <p>
            From a first sketch of a website to a rendered building that
            hasn&apos;t been built yet — the work lives in one team.
          </p>
        </SectionCopy>
      </div>

      <div>
        {items.map((service, i) => (
          <div
            key={service.title}
            className={`py-10 md:py-14 ${i % 2 === 1 ? "bg-paper" : ""}`}
          >
            <SplitBlock invert={i % 2 === 1} visual={visualForKind(service.kind)}>
              <SectionCopy
                kicker={String(i + 1).padStart(2, "0")}
                title={service.title}
              >
                <p>{service.description}</p>
              </SectionCopy>
            </SplitBlock>
          </div>
        ))}
      </div>
    </section>
  );
}
