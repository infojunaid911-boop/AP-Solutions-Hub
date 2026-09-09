export type PortfolioCategory =
  | "Websites"
  | "Dashboards"
  | "Graphic Design"
  | "Digital Marketing"
  | "3D Architecture";

export type PortfolioSize = "tall" | "square" | "horizontal" | "small" | "featured";

export type PortfolioItem = {
  id: string;
  slug: string;
  title: string;
  category: PortfolioCategory;
  size: PortfolioSize;
  /** Placeholder cover image — swap for the real asset when ready. */
  coverImage: string;
  /** Placeholder gallery images — swap for real assets when ready. */
  images: string[];
  client: string;
  services: string[];
  description: string;
};

export const CATEGORY_TABS = [
  "All Work",
  "Websites",
  "Dashboards",
  "Graphic Design",
  "Digital Marketing",
  "3D Architecture",
] as const;

const img = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const portfolioData: PortfolioItem[] = [
  {
    id: "p1",
    slug: "coastline-restaurant-website",
    title: "Coastline Restaurant Website",
    category: "Websites",
    size: "tall",
    coverImage: img("coastline-cover", 800, 1000),
    images: [img("coastline-1", 1200, 900), img("coastline-2", 1200, 900), img("coastline-3", 1200, 900)],
    client: "Hospitality",
    services: ["Website Development", "UI/UX Design"],
    description:
      "A warm, appetite-driving site for a family restaurant group, built around fast page loads and easy online reservations.",
  },
  {
    id: "p2",
    slug: "northline-analytics-dashboard",
    title: "Northline Analytics Dashboard",
    category: "Dashboards",
    size: "horizontal",
    coverImage: img("northline-cover", 1200, 800),
    images: [img("northline-1", 1300, 900), img("northline-2", 1300, 900)],
    client: "Logistics",
    services: ["Dashboard Development", "Data Visualization"],
    description:
      "A real-time operations dashboard that gives a fast-moving logistics team one clear view of fleet performance.",
  },
  {
    id: "p3",
    slug: "verdant-brand-identity",
    title: "Verdant Brand Identity",
    category: "Graphic Design",
    size: "square",
    coverImage: img("verdant-cover", 900, 900),
    images: [img("verdant-1", 1100, 1100), img("verdant-2", 1100, 1100), img("verdant-3", 1100, 1100)],
    client: "Consumer Goods",
    services: ["Branding", "Graphic Design"],
    description:
      "A full identity system — mark, colour palette and typography — for a plant-based food brand entering retail.",
  },
  {
    id: "p4",
    slug: "summit-construction-website",
    title: "Summit Construction Website",
    category: "Websites",
    size: "small",
    coverImage: img("summit-cover", 800, 700),
    images: [img("summit-1", 1200, 900), img("summit-2", 1200, 900)],
    client: "Construction",
    services: ["Website Development"],
    description:
      "A confident, project-led site for a regional construction firm, structured around case studies and capabilities.",
  },
  {
    id: "p5",
    slug: "pulse-social-campaign",
    title: "Pulse Social Campaign",
    category: "Digital Marketing",
    size: "featured",
    coverImage: img("pulse-cover", 1600, 700),
    images: [img("pulse-1", 1400, 900), img("pulse-2", 1400, 900), img("pulse-3", 1400, 900)],
    client: "Retail",
    services: ["Digital Marketing", "Social Media Management"],
    description:
      "A coordinated multi-platform campaign that lifted engagement and follower growth across every channel.",
  },
  {
    id: "p6",
    slug: "harborview-tower-render",
    title: "Harborview Tower Render",
    category: "3D Architecture",
    size: "tall",
    coverImage: img("harborview-cover", 800, 1050),
    images: [img("harborview-1", 1200, 900), img("harborview-2", 1200, 900)],
    client: "Real Estate",
    services: ["3D Architecture", "Visualization"],
    description:
      "Photoreal exterior and interior renders used to pre-sell residential units before groundbreak.",
  },
  {
    id: "p7",
    slug: "layer-corporate-dashboard",
    title: "Layer Corporate Dashboard",
    category: "Dashboards",
    size: "square",
    coverImage: img("layer-cover", 950, 950),
    images: [img("layer-1", 1200, 1000), img("layer-2", 1200, 1000)],
    client: "Finance",
    services: ["Dashboard Development"],
    description:
      "An internal reporting suite that unifies data across departments into one consistent view.",
  },
  {
    id: "p8",
    slug: "orbital-ecommerce-store",
    title: "Orbital E-commerce Store",
    category: "Websites",
    size: "horizontal",
    coverImage: img("orbital-cover", 1200, 850),
    images: [img("orbital-1", 1300, 950), img("orbital-2", 1300, 950), img("orbital-3", 1300, 950)],
    client: "Retail",
    services: ["Website Development", "UI/UX Design"],
    description:
      "A conversion-focused storefront for a growing retail brand, built for speed on mobile checkout.",
  },
  {
    id: "p9",
    slug: "maple-cafe-branding",
    title: "Maple Café Branding",
    category: "Graphic Design",
    size: "small",
    coverImage: img("maple-cover", 800, 750),
    images: [img("maple-1", 1100, 900), img("maple-2", 1100, 900)],
    client: "Hospitality",
    services: ["Branding", "Print Design"],
    description:
      "Packaging, signage and menu design for an independent café opening its second location.",
  },
  {
    id: "p10",
    slug: "riverside-residences-render",
    title: "Riverside Residences Render",
    category: "3D Architecture",
    size: "square",
    coverImage: img("riverside-cover", 950, 950),
    images: [img("riverside-1", 1200, 1000), img("riverside-2", 1200, 1000)],
    client: "Real Estate",
    services: ["3D Architecture"],
    description:
      "Concept-stage massing studies and walkthrough stills for a riverside residential development.",
  },
  {
    id: "p11",
    slug: "clearpath-lead-campaign",
    title: "Clearpath Lead Campaign",
    category: "Digital Marketing",
    size: "tall",
    coverImage: img("clearpath-cover", 800, 1000),
    images: [img("clearpath-1", 1200, 900), img("clearpath-2", 1200, 900)],
    client: "Professional Services",
    services: ["Digital Marketing"],
    description:
      "A paid and organic lead-generation campaign built to fill a B2B sales pipeline quarter over quarter.",
  },
  {
    id: "p12",
    slug: "atlas-fitness-website",
    title: "Atlas Fitness Website",
    category: "Websites",
    size: "featured",
    coverImage: img("atlas-cover", 1600, 700),
    images: [img("atlas-1", 1400, 900), img("atlas-2", 1400, 900), img("atlas-3", 1400, 900)],
    client: "Health & Fitness",
    services: ["Website Development", "UI/UX Design"],
    description:
      "A bold, class-schedule-first site for a boutique fitness studio expanding to three locations.",
  },
  {
    id: "p13",
    slug: "signal-hr-dashboard",
    title: "Signal HR Dashboard",
    category: "Dashboards",
    size: "small",
    coverImage: img("signal-cover", 800, 750),
    images: [img("signal-1", 1200, 900), img("signal-2", 1200, 900)],
    client: "Human Resources",
    services: ["Dashboard Development"],
    description:
      "A headcount and attrition dashboard that gives HR leadership a live read on workforce health.",
  },
  {
    id: "p14",
    slug: "birchwood-packaging",
    title: "Birchwood Packaging System",
    category: "Graphic Design",
    size: "horizontal",
    coverImage: img("birchwood-cover", 1200, 850),
    images: [img("birchwood-1", 1300, 950), img("birchwood-2", 1300, 950)],
    client: "Consumer Goods",
    services: ["Graphic Design", "Branding"],
    description:
      "A shelf-ready packaging system for a small-batch skincare line, designed to scale across SKUs.",
  },
  {
    id: "p15",
    slug: "meridian-office-render",
    title: "Meridian Office Render",
    category: "3D Architecture",
    size: "tall",
    coverImage: img("meridian-cover", 800, 1000),
    images: [img("meridian-1", 1200, 900), img("meridian-2", 1200, 900)],
    client: "Commercial Real Estate",
    services: ["3D Architecture", "Visualization"],
    description:
      "Interior fit-out renders used to lease a commercial office floor ahead of construction completion.",
  },
  {
    id: "p16",
    slug: "wavelength-brand-campaign",
    title: "Wavelength Brand Campaign",
    category: "Digital Marketing",
    size: "square",
    coverImage: img("wavelength-cover", 950, 950),
    images: [img("wavelength-1", 1200, 1000), img("wavelength-2", 1200, 1000)],
    client: "Technology",
    services: ["Digital Marketing", "Social Media Management"],
    description:
      "A brand-awareness push that introduced a new SaaS product to its category with a coordinated content push.",
  },
];
