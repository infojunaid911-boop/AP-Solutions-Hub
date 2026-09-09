"use client";

import { useCallback, useRef, useState } from "react";
import { Reorder } from "framer-motion";
import { ImagePlus, Loader2, Star, X, AlertCircle } from "lucide-react";
import { uploadPortfolioImage } from "@/lib/supabase/storage";

export type UploaderImage = {
  id: string;
  previewUrl: string;
  remoteUrl: string | null;
  status: "uploading" | "done" | "error";
  progress: number;
};

export default function ImageUploader({
  images,
  onChange,
  folderKey,
  coverId,
  onCoverChange,
}: {
  images: UploaderImage[];
  onChange: (images: UploaderImage[]) => void;
  folderKey: string;
  coverId: string | null;
  onCoverChange: (id: string) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Refs so async upload callbacks always see the latest state/props,
  // without re-subscribing effects on every keystroke-level re-render.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const imagesRef = useRef(images);
  imagesRef.current = images;
  const coverIdRef = useRef(coverId);
  coverIdRef.current = coverId;
  const onCoverChangeRef = useRef(onCoverChange);
  onCoverChangeRef.current = onCoverChange;

  const addFiles = useCallback(
    (fileList: FileList | File[]) => {
      const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
      if (files.length === 0) return;

      const newItems: UploaderImage[] = files.map((file) => ({
        id: crypto.randomUUID(),
        previewUrl: URL.createObjectURL(file),
        remoteUrl: null,
        status: "uploading",
        progress: 8,
      }));

      onChangeRef.current([...imagesRef.current, ...newItems]);

      newItems.forEach((item, i) => {
        const file = files[i];

        // Supabase JS storage upload doesn't expose byte-level progress, so
        // this ramps a simulated bar while the real upload is in flight —
        // still gives useful feedback on larger files.
        const interval = setInterval(() => {
          const current = imagesRef.current.find((img) => img.id === item.id);
          if (!current || current.status !== "uploading" || current.progress >= 88) return;
          onChangeRef.current(
            imagesRef.current.map((img) =>
              img.id === item.id ? { ...img, progress: Math.min(88, img.progress + 14) } : img
            )
          );
        }, 220);

        uploadPortfolioImage(file, folderKey)
          .then((url) => {
            clearInterval(interval);
            onChangeRef.current(
              imagesRef.current.map((img) =>
                img.id === item.id ? { ...img, status: "done" as const, progress: 100, remoteUrl: url } : img
              )
            );
            // First successfully uploaded image becomes the cover by default.
            if (!coverIdRef.current) onCoverChangeRef.current(item.id);
          })
          .catch(() => {
            clearInterval(interval);
            onChangeRef.current(
              imagesRef.current.map((img) =>
                img.id === item.id ? { ...img, status: "error" as const, progress: 0 } : img
              )
            );
          });
      });
    },
    [folderKey]
  );

  const removeImage = (id: string) => {
    const next = images.filter((img) => img.id !== id);
    onChange(next);
    if (coverId === id) {
      const nextCover = next.find((img) => img.status === "done");
      if (nextCover) onCoverChange(nextCover.id);
    }
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors duration-200 ${
          dragOver ? "border-red bg-red/[0.04]" : "border-ink/15 bg-offwhite hover:border-ink/30"
        }`}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-red shadow-sm">
          <ImagePlus size={20} strokeWidth={1.8} />
        </span>
        <p className="mt-4 text-[14.5px] font-semibold text-ink">
          Drag &amp; drop images here, or click to browse
        </p>
        <p className="mt-1.5 text-[13px] text-ink/45">
          Upload as many as you need — you can reorder and pick a cover after.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {images.length > 0 && (
        <>
          <p className="mt-5 text-[12.5px] font-medium text-ink/45">
            Drag thumbnails to reorder · click the star to set the cover image
          </p>
          <Reorder.Group
            axis="x"
            values={images}
            onReorder={onChange}
            className="mt-3 flex flex-wrap gap-3"
          >
            {images.map((img) => (
              <Reorder.Item
                key={img.id}
                value={img}
                className="relative h-28 w-28 shrink-0 cursor-grab overflow-hidden rounded-xl border border-ink/10 bg-white active:cursor-grabbing"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.previewUrl} alt="" className="h-full w-full object-cover" draggable={false} />

                {img.status === "uploading" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-ink/55 text-white">
                    <Loader2 size={16} className="animate-spin" strokeWidth={2} />
                    <span className="text-[10px] font-semibold">{img.progress}%</span>
                  </div>
                )}

                {img.status === "error" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-red/85 text-white">
                    <AlertCircle size={16} strokeWidth={2} />
                    <span className="text-[10px] font-semibold">Failed</span>
                  </div>
                )}

                {img.status === "done" && (
                  <button
                    type="button"
                    onClick={() => onCoverChange(img.id)}
                    aria-label="Set as cover image"
                    className={`absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                      coverId === img.id ? "bg-red text-white" : "bg-white/85 text-ink/60 hover:text-ink"
                    }`}
                  >
                    <Star size={12} strokeWidth={2} fill={coverId === img.id ? "currentColor" : "none"} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  aria-label="Remove image"
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/85 text-ink/60 transition-colors hover:bg-red hover:text-white"
                >
                  <X size={13} strokeWidth={2} />
                </button>

                {coverId === img.id && (
                  <span className="absolute inset-x-0 bottom-0 bg-red py-0.5 text-center text-[9px] font-bold uppercase tracking-wide text-white">
                    Cover
                  </span>
                )}
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </>
      )}
    </div>
  );
}
