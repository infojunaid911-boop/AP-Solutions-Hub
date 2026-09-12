import { getActiveServices } from "@/lib/public/content";
import { getServiceIcon } from "@/lib/service-icons";

export default async function Services() {
  const services = await getActiveServices();

  if (services.length === 0) return null;

  return (
    <section id="services" className="bg-mist py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-ink sm:text-4xl">Our Services</h2>
          <p className="mt-3 text-ink/60">
            Everything you need to launch, grow, and stand out — under one roof.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = getServiceIcon(service.icon);
            return (
              <div
                key={service.id}
                className={`overflow-hidden rounded-2xl border bg-white transition hover:shadow-lg ${
                  service.featured ? "border-red shadow-md shadow-red/10" : "border-ink/10"
                }`}
              >
                {service.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={service.image_url}
                    alt={service.name}
                    className="h-40 w-full object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red/10">
                      <Icon className="h-5 w-5 text-red" />
                    </div>
                    <h3 className="font-semibold text-ink">{service.name}</h3>
                  </div>
                  {service.description && (
                    <p className="mt-3 text-sm text-ink/60">{service.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
