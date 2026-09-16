export const STUDIO_ADVANTAGES = [
  "Premium Quality",
  "Custom Solutions",
  "Modern Technology",
  "Fast Communication",
  "Business-Focused Strategy",
  "Mobile-First Design",
  "Scalable Systems",
  "Ongoing Support",
] as const;

export const FALLBACK_SERVICES = [
  {
    title: "Website Development",
    description:
      "Realistic, modern website previews built for speed and clarity.",
    kind: "website" as const,
  },
  {
    title: "Business Dashboards",
    description:
      "Analytics and data visualization interfaces that make numbers easy to read.",
    kind: "dashboard" as const,
  },
  {
    title: "Digital Marketing",
    description:
      "Campaign visuals and social media creative built to convert.",
    kind: "marketing" as const,
  },
  {
    title: "3D Architecture",
    description:
      "Architectural renders that bring a concept to life before it's built.",
    kind: "architecture" as const,
  },
  {
    title: "Graphic Design",
    description:
      "Branding systems, colour and type that give a business a real identity.",
    kind: "branding" as const,
  },
];

export const PROCESS_STEPS = [
  {
    number: "01",
    title: "Tell Us Your Idea",
    description: "Tell us what you need and what you want to achieve.",
  },
  {
    number: "02",
    title: "We Plan The Solution",
    description: "Our team creates the right strategy and direction.",
  },
  {
    number: "03",
    title: "We Design & Build",
    description: "We turn the idea into a professional digital product.",
  },
  {
    number: "04",
    title: "Launch & Grow",
    description: "We help you launch, improve and grow.",
  },
];

export const TECH_LAYERS = [
  {
    title: "Web platforms",
    detail: "Fast, mobile-first websites built to represent the business clearly.",
  },
  {
    title: "Operational dashboards",
    detail: "Interfaces that turn numbers into a view a team can actually use.",
  },
  {
    title: "Campaign creative",
    detail: "Digital marketing visuals designed to get attention and convert it.",
  },
  {
    title: "Identity systems",
    detail: "Graphic design and branding that hold together across every touchpoint.",
  },
  {
    title: "3D visualization",
    detail: "Architectural renders that let a space exist before it is built.",
  },
];

export const TRUST_PILLARS = [
  {
    title: "One team, not a chain of vendors",
    detail:
      "Websites, dashboards, marketing, branding and 3D visualization sit under one roof.",
  },
  {
    title: "A reply within 24 hours",
    detail: "No obligation, free consultation — and a real person on the other side.",
  },
  {
    title: "Support after launch",
    detail:
      "Every package includes support after launch, with ongoing maintenance when you need it.",
  },
  {
    title: "Work that travels",
    detail:
      "We work with businesses around the world over email, WhatsApp and video calls.",
  },
];

export type VisualKind =
  | "website"
  | "dashboard"
  | "marketing"
  | "architecture"
  | "branding"
  | "studio";

export type AboutService = {
  title: string;
  description: string;
  kind: VisualKind;
};

export function servicesFromRecords(
  records: { name: string; description: string | null }[]
): AboutService[] {
  return records.map((record) => ({
    title: record.name,
    description:
      record.description ||
      FALLBACK_SERVICES.find((s) => s.title === record.name)?.description ||
      "Built to help a business look better, work smarter, and grow.",
    kind: visualKindFromName(record.name),
  }));
}

export function visualKindFromName(name: string): VisualKind {
  const n = name.toLowerCase();
  if (n.includes("website") || n.includes("web ")) return "website";
  if (n.includes("dashboard")) return "dashboard";
  if (n.includes("market") || n.includes("social")) return "marketing";
  if (n.includes("3d") || n.includes("architect")) return "architecture";
  if (n.includes("graphic") || n.includes("brand") || n.includes("design"))
    return "branding";
  return "studio";
}
