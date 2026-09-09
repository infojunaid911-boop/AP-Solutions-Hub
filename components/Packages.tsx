"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { PACKAGE_TABS, packagesData, type PackageCategory } from "@/lib/packagesData";

export default function Packages() {
  const [active, setActive] = useState<PackageCategory>("Website");
  const tiers = packagesData[active];

  return (
    <section id="packages" className="bg-offwhite py-24 md:py-32">
      <div className="mx-auto max-w-shell px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <h2 className="font-display text-4xl font-semibold leading-[1.1] tracking-[-0.01em] text-ink sm:text-[2.75rem]">
            Solutions built for every stage of your business.
          </h2>
        </motion.div>

        {/* Category tabs — horizontal scroll on mobile */}
        <div className="-mx-6 mt-10 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:px-0">
          <div className="flex w-max gap-2.5 md:w-auto md:flex-wrap">
            {PACKAGE_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-[13.5px] font-semibold transition-colors duration-200 ${
                  active === tab
                    ? "border-ink bg-ink text-white"
                    : "border-ink/12 bg-white text-ink/60 hover:border-ink/30 hover:text-ink"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tiers */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 grid gap-6 lg:grid-cols-3"
          >
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`flex flex-col rounded-2xl p-8 ${
                  tier.popular
                    ? "border border-ink bg-ink text-white lg:-translate-y-3"
                    : "border border-ink/10 bg-white text-ink"
                }`}
              >
                {tier.popular && (
                  <span className="mb-5 inline-flex w-fit items-center rounded-full bg-red px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                    Most Popular
                  </span>
                )}

                <h3 className="font-display text-xl font-semibold">{tier.name}</h3>
                <p className={`mt-2 text-[14px] leading-relaxed ${tier.popular ? "text-white/55" : "text-ink/55"}`}>
                  {tier.audience}
                </p>

                <div className={`mt-6 border-t pt-6 ${tier.popular ? "border-white/12" : "border-ink/10"}`}>
                  <span className={`text-[11.5px] font-medium uppercase tracking-wide ${tier.popular ? "text-white/40" : "text-ink/40"}`}>
                    {tier.priceLabel}
                  </span>
                </div>

                <ul className="mt-6 flex-1 space-y-3.5">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-[14px] leading-snug">
                      <Check
                        size={16}
                        strokeWidth={2.2}
                        className={`mt-0.5 shrink-0 ${tier.popular ? "text-red" : "text-red"}`}
                      />
                      <span className={tier.popular ? "text-white/80" : "text-ink/70"}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3.5 text-[14px] font-semibold transition-colors duration-200 ${
                    tier.popular
                      ? "bg-white text-ink hover:bg-red hover:text-white"
                      : "bg-ink text-white hover:bg-red"
                  }`}
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
