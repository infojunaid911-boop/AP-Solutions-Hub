import { createClient } from "@/lib/supabase/client";

// Expected to already exist in the Supabase project as a public bucket
// (Storage -> New bucket -> name it exactly this, mark it Public, and add
// an INSERT policy for authenticated admins). Nothing here creates it —
// see the setup note in the chat response.
export const PORTFOLIO_BUCKET = "portfolio-images";
export const REVIEW_BUCKET = "review-images";

function slugifyFilename(name: string) {
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : "";
  const safeBase = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${safeBase || "image"}${ext.toLowerCase()}`;
}

export async function uploadPortfolioImage(
  file: File,
  projectSlug: string
): Promise<string> {
  const supabase = createClient();

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  console.log("=== PORTFOLIO IMAGE UPLOAD ===");
  console.log("User:", user?.id);
  console.log("Email:", user?.email);
  console.log("Auth error:", authError?.message);

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const path = `${projectSlug}/${crypto.randomUUID()}-${slugifyFilename(
    file.name
  )}`;

  console.log("Bucket:", PORTFOLIO_BUCKET);
  console.log("Path:", path);
  console.log("File:", {
    name: file.name,
    type: file.type,
    size: file.size,
  });

  const { error } = await supabase.storage
    .from(PORTFOLIO_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error("=== SUPABASE STORAGE ERROR ===");
    console.error("Message:", error.message);
    console.error("Name:", error.name);
    console.error("Status:", error.status);
    console.error("Status Code:", error.statusCode);
    console.error("Full error:", error);

    throw error;
  }

  const { data } = supabase.storage
    .from(PORTFOLIO_BUCKET)
    .getPublicUrl(path);

  console.log("UPLOAD SUCCESS:", data.publicUrl);

  return data.publicUrl;
}

export async function uploadReviewImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload an image file.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Images must be 5MB or smaller.");
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User is not authenticated.");

  const path = `${crypto.randomUUID()}-${slugifyFilename(file.name)}`;
  const { error } = await supabase.storage.from(REVIEW_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;

  return supabase.storage.from(REVIEW_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Best-effort cleanup — never blocks the calling action if it fails. */
export async function deletePortfolioImageByUrl(url: string) {
  try {
    const supabase = createClient();
    const marker = `/object/public/${PORTFOLIO_BUCKET}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return;
    const path = decodeURIComponent(url.slice(idx + marker.length));
    await supabase.storage.from(PORTFOLIO_BUCKET).remove([path]);
  } catch {
    // Non-critical — the DB record is the source of truth either way.
  }
}
