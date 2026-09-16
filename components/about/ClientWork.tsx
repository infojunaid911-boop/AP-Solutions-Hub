"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionCopy } from "./Scene";
import { TiltScene } from "./Scene";

export type AboutProject = {
  id: string;
  title: string;
  category: string;
  coverImage: string;
  client: string;
  description: string;
};

export default function ClientWork({ projects }: { projects: AboutProject[] }) {
  return (
    <section id="client-work" className="bg-offwhite py-24 md:py-32">
      <div className="mx-auto max-w-shell px-6 md:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionCopy
            index="06"
            title={
              <>
                Our Client Work
                <span className="mt-1 block text-ink/35">Built with strategy and detail.</span>
              </>
            }
          >
            <p>
              From websites and dashboards to branding and 3D visualization —
              a collection of work published from the studio archive.
            </p>
          </SectionCopy>

          <Link
            href="/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-ink/15 px-6 py-3 font-display text-sm font-semibold text-ink transition-all duration-300 ease-premium hover:border-red hover:bg-red/5"
          >
            View full portfolio
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {projects.length === 0 ? (
          <p className="mt-14 max-w-lg font-body text-base text-ink/55">
            Selected pieces live in the portfolio. Open the archive for the
            current published work.
          </p>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <TiltScene key={project.id} className="h-full" range={6}>
                <article
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-[0_18px_40px_rgba(10,10,10,0.06)]"
                  style={{ transform: `translateZ(${8 + (i % 3) * 6}px)` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <span className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-red">
                      {project.category}
                    </span>
                    <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="mt-2 line-clamp-3 font-body text-sm leading-relaxed text-ink/55">
                        {project.description}
                      </p>
                    )}
                  </div>
                </article>
              </TiltScene>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
