// Hand-written types for the columns this project actually reads/writes.
// The full schema already exists in Supabase — this is not a source of truth,
// just enough shape for type safety in the auth flow. Expand as needed when
// building out the rest of the admin panel.

export type AdminRole = "admin";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: AdminRole | string;
  created_at: string;
  updated_at: string;
};

export type PortfolioCategory =
  | "Websites"
  | "Dashboards"
  | "Graphic Design"
  | "Digital Marketing"
  | "3D Architecture";

export type PortfolioStatus = "draft" | "published" | "archived";

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  "Websites",
  "Dashboards",
  "Graphic Design",
  "Digital Marketing",
  "3D Architecture",
];

export type PortfolioProject = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string | null;
  client_name: string | null;
  project_url: string | null;
  featured: boolean;
  status: PortfolioStatus;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
};

export type PortfolioImage = {
  id: string;
  project_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type InquiryStatus = "new" | "contacted" | "discussion" | "converted" | "closed";

export const INQUIRY_STATUSES: InquiryStatus[] = [
  "new",
  "contacted",
  "discussion",
  "converted",
  "closed",
];

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  discussion: "In Discussion",
  converted: "Converted",
  closed: "Closed",
};

export type Inquiry = {
  id: string;
  name: string;
  business_name: string | null;
  email: string;
  whatsapp: string | null;
  service: string | null;
  budget: string | null;
  message: string | null;
  status: InquiryStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: string;
  client_name: string;
  company: string | null;
  rating: number;
  review: string;
  client_image: string | null;
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type Service = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  featured: boolean;
  active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type Package = {
  id: string;
  service_category: string;
  package_name: string;
  description: string | null;
  features: string[];
  price_label: string | null;
  featured: boolean;
  active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};
