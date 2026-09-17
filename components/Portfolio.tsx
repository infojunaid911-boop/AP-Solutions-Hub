import { getPublishedPortfolioItems } from "@/lib/portfolio/getPortfolioItems";
import PortfolioPreview from "./PortfolioPreview";

const PREVIEW_FETCH_LIMIT = 8;

export default async function Portfolio() {
  const items = await getPublishedPortfolioItems(PREVIEW_FETCH_LIMIT);

  return (
    <section
      id="portfolio"
      className="relative overflow-hidden bg-offwhite py-8 md:py-10"
    >
      {/* Soft background decoration */}
      <div className="pointer-events-none absolute left-[-180px] top-[15%] h-[420px] w-[420px] rounded-full bg-red/[0.025] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-180px] right-[-100px] h-[500px] w-[500px] rounded-full bg-ink/[0.025] blur-3xl" />

      <div className="relative mx-auto max-w-shell px-5 md:px-10">
        <PortfolioPreview items={items} />
      </div>
    </section>
  );
}2