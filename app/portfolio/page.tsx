import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PortfolioClient from "@/components/PortfolioClient";
import { getPublishedPortfolioItems } from "@/lib/portfolio/getPortfolioItems";

export const metadata: Metadata = {
  title: "Portfolio — AP Solutions Hub",
  description:
    "The full AP Solutions Hub archive — websites, dashboards, graphic design, digital marketing and 3D architecture work, filterable by category.",
};

// No `limit` here — the dedicated portfolio page shows every published
// project from Supabase, unlike the bounded homepage preview.
export default async function PortfolioPage() {
  const items = await getPublishedPortfolioItems();

  return (
    <main>
      <Header />
      <div className="pt-20 md:pt-24">
        <PortfolioClient projects={items} />
      </div>
      <Footer />
    </main>
  );
}
