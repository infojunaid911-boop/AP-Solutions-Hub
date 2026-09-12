"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/admin/auth";
import { deleteReviewImageByUrl } from "@/lib/supabase/storage";

// Reviews show up on the public site the moment they're active, so every
// mutation revalidates both the admin list and the homepage.
function revalidateReviewSurfaces() {
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}

export type ReviewInput = {
  client_name: string;
  company: string;
  rating: number;
  review: string;
  client_image: string | null;
  featured: boolean;
  active: boolean;
};

function validate(input: ReviewInput) {
  const client_name = input.client_name.trim();
  const company = input.company.trim();
  const review = input.review.trim();
  const rating = Math.round(Number(input.rating));

  if (client_name.length < 2 || client_name.length > 120) {
    throw new Error("Please enter a valid client name.");
  }
  if (company.length > 160) {
    throw new Error("Company name is too long.");
  }
  if (review.length < 5 || review.length > 2000) {
    throw new Error("Review text should be between 5 and 2000 characters.");
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  return { client_name, company, review, rating };
}

export async function createReview(input: ReviewInput) {
  const supabase = await assertAdmin();
  const { client_name, company, review, rating } = validate(input);

  const { error } = await supabase.from("reviews").insert({
    client_name,
    company,
    rating,
    review,
    client_image: input.client_image,
    featured: input.featured,
    active: input.active,
  });

  if (error) throw new Error(error.message);
  revalidateReviewSurfaces();
}

export async function updateReview(id: string, input: ReviewInput) {
  const supabase = await assertAdmin();
  const { client_name, company, review, rating } = validate(input);

  const { error } = await supabase
    .from("reviews")
    .update({
      client_name,
      company,
      rating,
      review,
      client_image: input.client_image,
      featured: input.featured,
      active: input.active,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidateReviewSurfaces();
}

export async function deleteReview(id: string, clientImageUrl: string | null) {
  const supabase = await assertAdmin();

  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (clientImageUrl) {
    // Best-effort — never blocks the delete if storage cleanup fails.
    await deleteReviewImageByUrl(clientImageUrl);
  }

  revalidateReviewSurfaces();
}

export async function setReviewFeatured(id: string, featured: boolean) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("reviews").update({ featured }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateReviewSurfaces();
}

export async function setReviewActive(id: string, active: boolean) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("reviews").update({ active }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateReviewSurfaces();
}

export async function setReviewRating(id: string, rating: number) {
  const supabase = await assertAdmin();
  const clamped = Math.min(5, Math.max(1, Math.round(rating)));
  const { error } = await supabase.from("reviews").update({ rating: clamped }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateReviewSurfaces();
}
