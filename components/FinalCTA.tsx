"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from "@/lib/whatsapp";

export default function FinalCTA({
  contactHref = "#contact",
}: {
  contactHref?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red/[0.12] blur-[120px]"
        />
      </div>

      <div className="relative mx-auto max-w-shell px-6 text-center md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl font-display text-4xl font-semibold leading-[1.1] tracking-[-0.01em] text-white sm:text-5xl"
        >
          Have an idea?
          <br />
          Let&apos;s build something great.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-5 max-w-md text-[16px] leading-relaxed text-white/55"
        >
          Tell us about your project and let&apos;s turn it into something powerful.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href={contactHref}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14.5px] font-semibold text-ink transition-colors duration-200 hover:bg-red hover:text-white"
          >
            Start Your Project
            <ArrowUpRight
              size={16}
              strokeWidth={2}
              className="transition-transform duration-300 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-[14.5px] font-semibold text-white transition-colors duration-200 hover:border-white/40"
          >
            <MessageCircle size={16} strokeWidth={1.8} />
            Chat On WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
