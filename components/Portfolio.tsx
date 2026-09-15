import { getPublishedPortfolioItems } from "@/lib/portfolio/getPortfolioItems";
import PortfolioPreview from "./PortfolioPreview";

// Fixed preview size: bounded so the homepage section stays a predictable,
// sensible size as more work gets uploaded from the admin panel. The full,
// unbounded archive lives at /portfolio.
const PREVIEW_LIMIT = 12;

export default async function Portfolio() {
  const items = await getPublishedPortfolioItems(PREVIEW_LIMIT);

  return (
    <section
      id="portfolio"
      className="relative overflow-hidden bg-offwhite py-24 md:py-32"
    >
      {/* Soft background decoration */}
      <div className="pointer-events-none absolute left-[-180px] top-[15%] h-[420px] w-[420px] rounded-full bg-red/[0.025] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-180px] right-[-100px] h-[500px] w-[500px] rounded-full bg-ink/[0.025] blur-3xl" />

      <div className="relative mx-auto max-w-shell px-5 md:px-10">
        {/* ================= HEADER ================= */}
        <div className="max-w-3xl">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-red" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-red">
              Selected Work
            </span>
          </div>

          <h2 className="font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-ink sm:text-5xl md:text-[4rem]">
            Explore our
            <span className="block text-ink/35">creative work.</span>
          </h2>

          <p className="mt-6 max-w-xl text-[15px] leading-7 text-ink/55 md:text-base">
            From websites and dashboards to branding and 3D
            visualization — a collection of work built with
            strategy, creativity and attention to detail.
          </p>
        </div>

        {/* Masonry gallery + in-page project modal + "View All" (opens /portfolio in a new tab) */}
        <PortfolioPreview items={items} />
      </div>
    </section>
  );
}
