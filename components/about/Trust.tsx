"use client";

import { SectionCopy, SplitBlock } from "./Scene";
import { TrustVisual } from "./visuals";
import { TRUST_PILLARS } from "./content";

export type AboutReview = {
  id: string;
  client_name: string;
  company: string | null;
  rating: number;
  review: string;
};

export default function Trust({ reviews }: { reviews: AboutReview[] }) {
  return (
    <section id="trust" className="bg-paper py-24 md:py-32">
      <SplitBlock invert visual={<TrustVisual />}>
        <SectionCopy
          index="07"
          title={
            <>
              Trust &amp; Credibility
              <span className="mt-1 block text-ink/35">How the studio actually works with you.</span>
            </>
          }
        >
          <p>
            No invented awards or vanity metrics — just the way we already
            run projects: one team, fast replies, support after launch.
          </p>
        </SectionCopy>
      </SplitBlock>

      <div className="mx-auto mt-16 grid max-w-shell gap-5 px-6 sm:grid-cols-2 md:px-10">
        {TRUST_PILLARS.map((pillar) => (
          <article
            key={pillar.title}
            className="rounded-2xl border border-ink/10 bg-offwhite p-7 transition-colors duration-300 hover:border-red/30"
          >
            <h3 className="font-display text-xl font-semibold text-ink">{pillar.title}</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-ink/55">
              {pillar.detail}
            </p>
          </article>
        ))}
      </div>

      {reviews.length > 0 && (
        <div className="mx-auto mt-12 grid max-w-shell gap-5 px-6 md:grid-cols-2 md:px-10 lg:grid-cols-3">
          {reviews.slice(0, 6).map((review) => (
            <blockquote
              key={review.id}
              className="rounded-2xl border border-ink/10 bg-paper p-6"
            >
              <p className="font-body text-sm leading-relaxed text-ink/70">
                “{review.review}”
              </p>
              <footer className="mt-5">
                <cite className="not-italic font-display text-sm font-semibold text-ink">
                  {review.client_name}
                </cite>
                {review.company && (
                  <p className="mt-0.5 text-xs text-ink/45">{review.company}</p>
                )}
              </footer>
            </blockquote>
          ))}
        </div>
      )}
    </section>
  );
}
