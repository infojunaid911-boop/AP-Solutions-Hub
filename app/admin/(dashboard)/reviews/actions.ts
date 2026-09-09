"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/admin/auth";

export type ReviewFormInput = {
  id?: string;
  clientName: string;
  company: string;
  rating: number;
  review: string;
  clientImage: string | null;
  featured: boolean;
  active: boolean;
};

function revalidateReviews() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/reviews");
}

function validate(input: ReviewFormInput) {
  const clientName = input.clientName.trim();
  const review = input.review.trim();
  if (clientName.length < 2 || clientName.length > 120) throw new Error("Client name is required.");
  if (input.company.trim().length > 160) throw new Error("Company name is too long.");
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }
  if (review.length < 10 || review.length > 2000) {
    throw new Error("Review text must be between 10 and 2000 characters.");
  }
}

export async function upsertReviewAction(input: ReviewFormInput) {
  const supabase = await assertAdmin();
  validate(input);

  const payload = {
    client_name: input.clientName.trim(),
    company: input.company.trim() || null,
    rating: input.rating,
    review: input.review.trim(),
    client_image: input.clientImage,
    featured: input.featured,
    active: input.active,
  };

  if (input.id) {
    const { error } = await supabase.from("reviews").update(payload).eq("id", input.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("reviews").insert(payload);
    if (error) throw error;
  }

  revalidateReviews();
}

export async function deleteReviewAction(id: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw error;
  revalidateReviews();
}

export async function setReviewFlagAction(
  id: string,
  field: "featured" | "active",
  value: boolean
) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("reviews").update({ [field]: value }).eq("id", id);
  if (error) throw error;
  revalidateReviews();
}

export async function setReviewRatingAction(id: string, rating: number) {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }
  const supabase = await assertAdmin();
  const { error } = await supabase.from("reviews").update({ rating }).eq("id", id);
  if (error) throw error;
  revalidateReviews();
}
