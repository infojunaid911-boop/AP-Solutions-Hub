import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FinalCTA from "@/components/FinalCTA";
import AboutHero from "@/components/about/AboutHero";
import WhoWeAre from "@/components/about/WhoWeAre";
import WhatWeDo from "@/components/about/WhatWeDo";
import { servicesFromRecords } from "@/components/about/content";
import WhyChoose from "@/components/about/WhyChoose";
import Technologies from "@/components/about/Technologies";
import HowWeWork from "@/components/about/HowWeWork";
import ClientWork from "@/components/about/ClientWork";
import Trust from "@/components/about/Trust";
import { getActiveReviews, getActiveServices } from "@/lib/public/content";
import { getPublishedPortfolioItems } from "@/lib/portfolio/getPortfolioItems";

export const metadata: Metadata = {
  title: "About — AP Solutions Hub",
  description:
    "Who we are, what we do, and how AP Solutions Hub builds websites, dashboards, marketing, branding and 3D visualization under one roof.",
};

export default async function AboutPage() {
  const [services, projects, reviews] = await Promise.all([
    getActiveServices(),
    getPublishedPortfolioItems(6),
    getActiveReviews(),
  ]);

  return (
    <main>
      <Header />
      <AboutHero />
      <WhoWeAre />
      <WhatWeDo services={servicesFromRecords(services)} />
      <WhyChoose />
      <Technologies />
      <HowWeWork />
      <ClientWork
        projects={projects.map((project) => ({
          id: project.id,
          title: project.title,
          category: project.category,
          coverImage: project.coverImage,
          client: project.client,
          description: project.description,
        }))}
      />
      <Trust
        reviews={reviews.map((review) => ({
          id: review.id,
          client_name: review.client_name,
          company: review.company,
          rating: review.rating,
          review: review.review,
        }))}
      />
      <FinalCTA contactHref="/#contact" />
      <Footer />
    </main>
  );
}
