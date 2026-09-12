import { createClient } from "@/lib/supabase/server";
import type { Review } from "@/lib/supabase/types";
import ReviewsAdminList from "@/components/admin/reviews/ReviewsAdminList";

// Same reasoning as the portfolio admin page: this depends on the auth
// session (via the DashboardLayout above it) and the freshest data, so it
// should never be statically cached.
export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("reviews")
    .select(
      "id, client_name, company, rating, review, client_image, featured, active, created_at, updated_at"
    )
    // Featured first, then newest — matches how they're prioritized on the
    // public site (see lib/public/content.ts getActiveReviews).
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  const reviews = (data ?? []) as Review[];

  return <ReviewsAdminList reviews={reviews} />;
}
