"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { testimonials } from "@/lib/testimonialsData";

const AUTOPLAY_MS = 5500;

export default function Reviews() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const total = testimonials.length;

  const goTo = useCallback(
    (next: number) => {
      setDirection(next > index ? 1 : -1);
      setIndex(((next % total) + total) % total);
    },
    [index, total]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % total);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, total]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 70;
    if (info.offset.x < -threshold) next();
    else if (info.offset.x > threshold) prev();
  };

  const review = testimonials[index];
  const initials = review.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <section
      id="reviews"
      className="bg-white py-24 md:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-shell px-6 md:px-10">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <span className="text-[13px] font-semibold tracking-wide text-red">Client Feedback</span>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.1] tracking-[-0.01em] text-ink sm:text-[2.75rem]">
              Trusted by businesses.
              <br />
              Loved by clients.
            </h2>
          </motion.div>

          {/* Rating summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0"
          >
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-5xl font-bold text-ink">4.9</span>
              <span className="text-lg font-medium text-ink/40">/ 5</span>
            </div>
            <Stars rating={5} className="mt-2" />
            <p className="mt-2 text-[13px] font-medium text-ink/45">Based on Client Feedback</p>
          </motion.div>
        </div>

        {/* Editorial testimonial slider */}
        <div className="relative mt-16 overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={index}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={handleDragEnd}
              className="cursor-grab rounded-2xl border border-ink/10 bg-offwhite p-8 active:cursor-grabbing md:p-14"
            >
              <span className="font-display text-6xl leading-none text-red/25 md:text-7xl">&ldquo;</span>

              <p className="mt-4 max-w-3xl font-display text-2xl font-medium leading-snug tracking-[-0.01em] text-ink md:text-3xl">
                {review.quote}
              </p>

              <div className="mt-9 flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-white">
                  {initials}
                </span>
                <div>
                  <p className="font-display text-[15px] font-semibold text-ink">{review.name}</p>
                  <p className="text-[13.5px] text-ink/55">{review.business}</p>
                </div>
                <Stars rating={review.rating} className="ml-auto hidden sm:flex" />
              </div>
              <Stars rating={review.rating} className="mt-5 sm:hidden" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                aria-label={`Go to review from ${t.name}`}
                onClick={() => goTo(i)}
                className="group flex h-8 items-center"
              >
                <span
                  className={`h-[3px] rounded-full transition-all duration-300 ease-premium ${
                    i === index ? "w-8 bg-red" : "w-4 bg-ink/15 group-hover:bg-ink/30"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              aria-label="Previous review"
              onClick={prev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/12 text-ink transition-colors duration-200 hover:border-red hover:text-red"
            >
              <ArrowLeft size={17} strokeWidth={1.8} />
            </button>
            <button
              aria-label="Next review"
              onClick={next}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/12 text-ink transition-colors duration-200 hover:border-red hover:text-red"
            >
              <ArrowRight size={17} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={15}
          strokeWidth={0}
          className={i < rating ? "fill-red" : "fill-mist"}
        />
      ))}
    </div>
  );
}
