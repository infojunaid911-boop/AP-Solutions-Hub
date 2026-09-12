"use client";

import { useState } from "react";
import { Check, Star } from "lucide-react";
import type { Package } from "@/lib/supabase/types";

type CategoryGroup = { category: string; packages: Package[] };

export default function PackagesTabs({ categories }: { categories: CategoryGroup[] }) {
  // Start on the first tab that actually has active packages, so an admin
  // deactivating everything in "Website" doesn't land visitors on a blank tab.
  const firstWithPackages = categories.find((c) => c.packages.length > 0)?.category;
  const [active, setActive] = useState(firstWithPackages ?? categories[0]?.category);

  const current = categories.find((c) => c.category === active);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c.category}
            onClick={() => setActive(c.category)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              active === c.category
                ? "bg-ink text-white"
                : "bg-mist text-ink/60 hover:bg-ink/10"
            }`}
          >
            {c.category}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {current && current.packages.length > 0 ? (
          current.packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative flex flex-col rounded-2xl border bg-white p-6 ${
                pkg.featured
                  ? "border-red shadow-lg shadow-red/10"
                  : "border-ink/10"
              }`}
            >
              {pkg.featured && (
                <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-red px-3 py-1 text-xs font-semibold text-white">
                  <Star className="h-3 w-3 fill-white" />
                  MOST POPULAR
                </span>
              )}

              <h3 className="text-lg font-semibold text-ink">{pkg.package_name}</h3>

              {pkg.description && (
                <p className="mt-2 text-sm text-ink/60">{pkg.description}</p>
              )}

              {pkg.price_label && (
                <p className="mt-4 text-sm font-medium text-red">{pkg.price_label}</p>
              )}

              {pkg.features.length > 0 && (
                <ul className="mt-5 space-y-2.5">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink/70">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-red" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              <a
                href="#contact"
                className={`mt-6 rounded-md py-2.5 text-center text-sm font-medium transition ${
                  pkg.featured
                    ? "bg-red text-white hover:bg-red/90"
                    : "bg-ink text-white hover:bg-ink/90"
                }`}
              >
                Get Started
              </a>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-sm text-ink/40">
            New packages for this category are coming soon.
          </p>
        )}
      </div>
    </div>
  );
}
