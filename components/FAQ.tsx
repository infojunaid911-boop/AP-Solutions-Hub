"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

const FAQS = [
  {
    question: "What services do you provide?",
    answer:
      "We build websites, dashboards and digital marketing strategies, plus branding, UI/UX and 3D architecture visualization — everything a modern business needs to grow online.",
  },
  {
    question: "How long does a website take?",
    answer:
      "Most websites take between 2 and 6 weeks depending on scope. We'll give you a clear timeline before any work begins.",
  },
  {
    question: "Can you redesign my existing website?",
    answer:
      "Yes. We can rebuild your site from scratch or improve what's already working, without losing the content and rankings you've already built.",
  },
  {
    question: "Do you provide ongoing support?",
    answer:
      "Every package includes support after launch, and we offer ongoing maintenance plans for businesses that want continued updates.",
  },
  {
    question: "Can I request a custom package?",
    answer:
      "Absolutely. If our standard packages don't fit what you need, tell us your scope and we'll put together a custom quote.",
  },
  {
    question: "Do you work with international clients?",
    answer:
      "Yes, we work with businesses around the world and communicate over email, WhatsApp and video calls to fit your time zone.",
  },
  {
    question: "How do I start a project?",
    answer:
      "Fill out the project inquiry form below or message us on WhatsApp, and we'll schedule a call to talk through your idea.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-offwhite py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center font-display text-4xl font-semibold leading-[1.1] tracking-[-0.01em] text-ink sm:text-[2.75rem]"
        >
          Questions? We&apos;ve got answers.
        </motion.h2>

        <div className="mt-14 border-t border-ink/10">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ delay: i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="border-b border-ink/10"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span
                    className={`font-display text-[16.5px] font-semibold transition-colors duration-200 md:text-[18px] ${
                      isOpen ? "text-ink" : "text-ink/75"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ease-premium ${
                      isOpen ? "rotate-45 border-red bg-red text-white" : "border-ink/15 text-ink"
                    }`}
                  >
                    <Plus size={16} strokeWidth={2} />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 pr-12 text-[14.5px] leading-relaxed text-ink/55">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
