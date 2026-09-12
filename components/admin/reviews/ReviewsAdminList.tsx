"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus, Star, Trash2, Upload, X } from "lucide-react";
import type { Review } from "@/lib/supabase/types";
import { uploadReviewImage } from "@/lib/supabase/storage";
import {
  createReview,
  deleteReview,
  setReviewActive,
  setReviewFeatured,
  setReviewRating,
  updateReview,
  type ReviewInput,
} from "@/app/admin/(dashboard)/reviews/actions";

const EMPTY_FORM: ReviewInput = {
  client_name: "",
  company: "",
  rating: 5,
  review: "",
  client_image: null,
  featured: false,
  active: true,
};

export default function ReviewsAdminList({ reviews }: { reviews: Review[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ReviewInput>(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function openAddForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
    setFormOpen(true);
  }

  function openEditForm(review: Review) {
    setEditingId(review.id);
    setForm({
      client_name: review.client_name,
      company: review.company ?? "",
      rating: review.rating,
      review: review.review,
      client_image: review.client_image,
      featured: review.featured,
      active: review.active,
    });
    setError(null);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setError(null);
  }

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadReviewImage(file);
      setForm((f) => ({ ...f, client_image: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        if (editingId) {
          await updateReview(editingId, form);
        } else {
          await createReview(form);
        }
        closeForm();
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  function handleDelete(review: Review) {
    if (!confirm(`Delete the review from ${review.client_name}? This can't be undone.`)) return;
    startTransition(async () => {
      try {
        await deleteReview(review.id, review.client_image);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Delete failed.");
      }
    });
  }

  function handleToggleFeatured(review: Review) {
    startTransition(async () => {
      await setReviewFeatured(review.id, !review.featured);
      router.refresh();
    });
  }

  function handleToggleActive(review: Review) {
    startTransition(async () => {
      await setReviewActive(review.id, !review.active);
      router.refresh();
    });
  }

  function handleRatingClick(review: Review, rating: number) {
    startTransition(async () => {
      await setReviewRating(review.id, rating);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Reviews</h1>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90"
        >
          <Plus className="h-4 w-4" />
          Add Review
        </button>
      </div>

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border border-ink/10 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">
              {editingId ? "Edit review" : "New review"}
            </h2>
            <button type="button" onClick={closeForm} className="text-ink/40 hover:text-ink">
              <X className="h-4 w-4" />
            </button>
          </div>

          {error && (
            <p className="rounded-md bg-red/10 px-3 py-2 text-sm text-red">{error}</p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-ink/70">Client Name</span>
              <input
                required
                value={form.client_name}
                onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))}
                className="w-full rounded-md border border-ink/15 px-3 py-2 text-sm"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-ink/70">Company Name</span>
              <input
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                className="w-full rounded-md border border-ink/15 px-3 py-2 text-sm"
              />
            </label>
          </div>

          <div className="block text-sm">
            <span className="mb-1 block text-ink/70">Rating</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, rating: n }))}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                >
                  <Star
                    className={`h-6 w-6 ${
                      n <= form.rating ? "fill-red text-red" : "text-ink/20"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <label className="block text-sm">
            <span className="mb-1 block text-ink/70">Review Text</span>
            <textarea
              required
              rows={4}
              value={form.review}
              onChange={(e) => setForm((f) => ({ ...f, review: e.target.value }))}
              className="w-full rounded-md border border-ink/15 px-3 py-2 text-sm"
            />
          </label>

          <div className="block text-sm">
            <span className="mb-1 block text-ink/70">Client Image</span>
            <div className="flex items-center gap-3">
              {form.client_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.client_image}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-mist" />
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 rounded-md border border-ink/15 px-3 py-1.5 text-sm text-ink/70 hover:bg-mist disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {form.client_image ? "Replace image" : "Upload image"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImagePick}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-ink/70">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-ink/70">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              />
              Active
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeForm}
              className="rounded-md px-4 py-2 text-sm text-ink/60 hover:bg-mist"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || uploading}
              className="flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90 disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingId ? "Save changes" : "Add review"}
            </button>
          </div>
        </form>
      )}

      <div className="divide-y divide-ink/10 rounded-lg border border-ink/10 bg-white">
        {reviews.length === 0 && (
          <p className="p-6 text-center text-sm text-ink/40">
            No reviews yet — add your first one above.
          </p>
        )}

        {reviews.map((review) => (
          <div key={review.id} className="flex items-start gap-4 p-4">
            {review.client_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={review.client_image}
                alt=""
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 shrink-0 rounded-full bg-mist" />
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-ink">{review.client_name}</p>
                {review.company && (
                  <span className="text-sm text-ink/40">· {review.company}</span>
                )}
                {review.featured && (
                  <span className="rounded-full bg-red/10 px-2 py-0.5 text-xs font-medium text-red">
                    Featured
                  </span>
                )}
                {!review.active && (
                  <span className="rounded-full bg-mist px-2 py-0.5 text-xs font-medium text-ink/40">
                    Hidden
                  </span>
                )}
              </div>

              <div className="mt-1 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => handleRatingClick(review, n)}
                    disabled={isPending}
                    aria-label={`Set rating to ${n}`}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        n <= review.rating ? "fill-red text-red" : "text-ink/20"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <p className="mt-2 line-clamp-2 text-sm text-ink/70">{review.review}</p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => openEditForm(review)}
                  className="rounded-md p-1.5 text-ink/50 hover:bg-mist hover:text-ink"
                  aria-label="Edit review"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(review)}
                  disabled={isPending}
                  className="rounded-md p-1.5 text-ink/50 hover:bg-red/10 hover:text-red"
                  aria-label="Delete review"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <label className="flex items-center gap-1.5 text-xs text-ink/60">
                <input
                  type="checkbox"
                  checked={review.featured}
                  disabled={isPending}
                  onChange={() => handleToggleFeatured(review)}
                />
                Featured
              </label>
              <label className="flex items-center gap-1.5 text-xs text-ink/60">
                <input
                  type="checkbox"
                  checked={review.active}
                  disabled={isPending}
                  onChange={() => handleToggleActive(review)}
                />
                Active
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
