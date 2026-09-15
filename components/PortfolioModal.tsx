"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { PublicPortfolioItem } from "@/lib/portfolio/getPortfolioItems";

export default function PortfolioModal({
  item,
  onClose,
}: {
  item: PublicPortfolioItem | null;
  onClose: () => void;
}) {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (item) {
      setActiveImage(0);
    }
  }, [item]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = item ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [item]);

  // Escape key
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/75 p-3 backdrop-blur-md sm:p-5 md:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[20px] bg-white shadow-2xl md:rounded-[24px]"
          >
            {/* HERO IMAGE */}
            <div className="relative flex h-[38vh] min-h-[220px] max-h-[520px] w-full shrink-0 items-center justify-center overflow-hidden bg-mist sm:h-[45vh] md:h-[48vh]">
              <Image
                src={item.images[activeImage]}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 1024px"
                className="object-contain"
                priority
              />

              {/* CLOSE BUTTON */}
              <button
                aria-label="Close project"
                onClick={onClose}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg backdrop-blur transition-all hover:scale-105 hover:bg-white md:right-5 md:top-5"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            {/* THUMBNAILS */}
            {item.images.length > 1 && (
              <div className="flex shrink-0 gap-2 overflow-x-auto border-b border-ink/8 p-3 md:p-4">
                {item.images.map((src, index) => (
                  <button
                    key={`${src}-${index}`}
                    onClick={() => setActiveImage(index)}
                    className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-lg transition-all duration-200 md:h-14 md:w-20 ${
                      index === activeImage
                        ? "opacity-100 ring-2 ring-red ring-offset-2"
                        : "opacity-50 hover:opacity-90"
                    }`}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* DETAILS */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="p-5 md:p-8 lg:p-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-2xl">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-red md:text-[11px]">
                      {item.category}
                    </span>

                    <h3 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-[-0.025em] text-ink md:text-3xl lg:text-4xl">
                      {item.title}
                    </h3>
                  </div>

                  <div className="hidden shrink-0 rounded-full border border-ink/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-ink/45 md:block">
                    Selected Work
                  </div>
                </div>

                {/* META */}
                <div className="mt-6 grid grid-cols-1 gap-5 border-y border-ink/8 py-5 sm:grid-cols-2 md:mt-7 md:gap-6 md:py-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink/35">
                      Client Industry
                    </span>

                    <p className="mt-2 text-sm font-medium text-ink md:text-[15px]">
                      {item.client}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink/35">
                      Services Provided
                    </span>

                    <p className="mt-2 text-sm font-medium leading-6 text-ink md:text-[15px]">
                      {item.services.join(", ")}
                    </p>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <p className="mt-6 max-w-3xl text-sm leading-7 text-ink/60 md:mt-7 md:text-base md:leading-8">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}