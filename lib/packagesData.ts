export type PackageCategory = "Website" | "Marketing" | "Design" | "Dashboard" | "3D Architecture";

export type PriceLabel = "Starting From" | "Request Custom Quote";

export type PackageTier = {
  name: "Starter" | "Business" | "Premium";
  audience: string;
  priceLabel: PriceLabel;
  cta: "Get Started" | "Talk To Us";
  features: string[];
  popular?: boolean;
};

export const PACKAGE_TABS: PackageCategory[] = [
  "Website",
  "Marketing",
  "Design",
  "Dashboard",
  "3D Architecture",
];

export const packagesData: Record<PackageCategory, PackageTier[]> = {
  Website: [
    {
      name: "Starter",
      audience: "For businesses getting started.",
      priceLabel: "Starting From",
      cta: "Get Started",
      features: [
        "Up to 5 pages",
        "Mobile-responsive design",
        "Basic on-page SEO",
        "2 rounds of revisions",
      ],
    },
    {
      name: "Business",
      audience: "For growing businesses.",
      priceLabel: "Starting From",
      cta: "Get Started",
      popular: true,
      features: [
        "Up to 12 pages",
        "Custom UI/UX design",
        "SEO optimization & analytics setup",
        "Priority support & 4 revisions",
      ],
    },
    {
      name: "Premium",
      audience: "For businesses needing a complete custom solution.",
      priceLabel: "Request Custom Quote",
      cta: "Talk To Us",
      features: [
        "Fully custom architecture",
        "Advanced integrations & automations",
        "Dedicated project strategist",
        "Ongoing optimization support",
      ],
    },
  ],
  Marketing: [
    {
      name: "Starter",
      audience: "For businesses getting started.",
      priceLabel: "Starting From",
      cta: "Get Started",
      features: [
        "Single-channel campaign setup",
        "Monthly performance report",
        "Basic audience targeting",
        "Email support",
      ],
    },
    {
      name: "Business",
      audience: "For growing businesses.",
      priceLabel: "Starting From",
      cta: "Get Started",
      popular: true,
      features: [
        "Multi-channel campaign management",
        "Weekly optimization & reporting",
        "Advanced audience segmentation",
        "Priority support",
      ],
    },
    {
      name: "Premium",
      audience: "For businesses needing a complete custom solution.",
      priceLabel: "Request Custom Quote",
      cta: "Talk To Us",
      features: [
        "Full-funnel strategy & execution",
        "Dedicated marketing strategist",
        "Custom reporting dashboard",
        "Continuous testing & scaling",
      ],
    },
  ],
  Design: [
    {
      name: "Starter",
      audience: "For businesses getting started.",
      priceLabel: "Starting From",
      cta: "Get Started",
      features: [
        "Logo & core brand assets",
        "Basic style guide",
        "2 rounds of revisions",
        "Source files included",
      ],
    },
    {
      name: "Business",
      audience: "For growing businesses.",
      priceLabel: "Starting From",
      cta: "Get Started",
      popular: true,
      features: [
        "Full brand identity system",
        "Marketing & social templates",
        "Extended style guide",
        "Priority support & 4 revisions",
      ],
    },
    {
      name: "Premium",
      audience: "For businesses needing a complete custom solution.",
      priceLabel: "Request Custom Quote",
      cta: "Talk To Us",
      features: [
        "Complete brand ecosystem",
        "Packaging & environmental design",
        "Dedicated brand strategist",
        "Ongoing design support",
      ],
    },
  ],
  Dashboard: [
    {
      name: "Starter",
      audience: "For businesses getting started.",
      priceLabel: "Starting From",
      cta: "Get Started",
      features: [
        "Single dashboard",
        "Up to 5 data visualizations",
        "Basic user roles",
        "Email support",
      ],
    },
    {
      name: "Business",
      audience: "For growing businesses.",
      priceLabel: "Starting From",
      cta: "Get Started",
      popular: true,
      features: [
        "Multi-dashboard system",
        "Custom data visualizations",
        "Advanced user permissions",
        "Priority support",
      ],
    },
    {
      name: "Premium",
      audience: "For businesses needing a complete custom solution.",
      priceLabel: "Request Custom Quote",
      cta: "Talk To Us",
      features: [
        "Enterprise-grade architecture",
        "Real-time data integrations",
        "Dedicated engineering support",
        "Ongoing scaling & maintenance",
      ],
    },
  ],
  "3D Architecture": [
    {
      name: "Starter",
      audience: "For businesses getting started.",
      priceLabel: "Starting From",
      cta: "Get Started",
      features: [
        "Up to 3 rendered views",
        "Standard lighting & materials",
        "2 rounds of revisions",
        "Digital delivery",
      ],
    },
    {
      name: "Business",
      audience: "For growing businesses.",
      priceLabel: "Starting From",
      cta: "Get Started",
      popular: true,
      features: [
        "Up to 8 rendered views",
        "Custom materials & lighting studies",
        "Walkthrough animation add-on",
        "Priority support & 4 revisions",
      ],
    },
    {
      name: "Premium",
      audience: "For businesses needing a complete custom solution.",
      priceLabel: "Request Custom Quote",
      cta: "Talk To Us",
      features: [
        "Full project visualization suite",
        "Interactive 3D walkthroughs",
        "Dedicated visualization artist",
        "Ongoing revisions & support",
      ],
    },
  ],
};
