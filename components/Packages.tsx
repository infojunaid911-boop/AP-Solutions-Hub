import { getActivePackages } from "@/lib/public/content";
import PackagesTabs from "@/components/PackagesTabs";

const CATEGORY_ORDER = ["Website", "Marketing", "Design", "Dashboard", "3D Architecture"];

export default async function Packages() {
  const packages = await getActivePackages();

  // Group by service_category, keeping the fixed tab order above rather
  // than whatever order rows happen to come back in.
  const byCategory = CATEGORY_ORDER.map((category) => ({
    category,
    packages: packages.filter((p) => p.service_category === category),
  }));

  return (
    <section id="packages" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-ink sm:text-4xl">
            Packages & Pricing
          </h2>
          <p className="mt-3 text-ink/60">
            Simple, transparent packages for every stage of your business.
          </p>
        </div>

        <div className="mt-12">
          <PackagesTabs categories={byCategory} />
        </div>
      </div>
    </section>
  );
}
