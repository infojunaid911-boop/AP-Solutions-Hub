"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Megaphone,
  Globe,
  LayoutDashboard,
  Boxes,
  PenTool,
  Share2,
  type LucideIcon,
} from "lucide-react";

type Service = {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
  span: string;
};

const SERVICES: Service[] = [
  {
    number: "01",
    icon: Megaphone,
    title: "Digital Marketing",
    description: "Grow your audience and reach more customers.",
    span: "lg:col-span-4",
  },
  {
    number: "02",
    icon: Globe,
    title: "Website Development",
    description:
      "Modern, fast and professional websites built for your business.",
    span: "lg:col-span-4",
  },
  {
    number: "03",
    icon: LayoutDashboard,
    title: "Dashboard Development",
    description:
      "Turn complex business data into clear and powerful insights.",
    span: "lg:col-span-4",
  },
  {
    number: "04",
    icon: Boxes,
    title: "3D Architecture",
    description:
      "Realistic architectural visualization and professional 3D concepts.",
    span: "lg:col-span-4",
  },
  {
    number: "05",
    icon: PenTool,
    title: "Graphic Design",
    description:
      "Branding, marketing materials and creative visual design.",
    span: "lg:col-span-4",
  },
  {
    number: "06",
    icon: Share2,
    title: "Social Media Management",
    description:
      "Content and strategy designed to build your online presence.",
    span: "lg:col-span-4",
  },
];

const reveal = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.06 * i,
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function Services() {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-white py-24 md:py-32"
    >
      {/* Very subtle background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-red/[0.025] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-shell px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{
            duration: 0.65,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="max-w-2xl"
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-red" />

            <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-red">
              What We Do
            </span>
          </div>

          <h2 className="font-display text-4xl font-semibold leading-[1.08] tracking-[-0.025em] text-ink sm:text-[2.9rem]">
            Everything your business needs to{" "}
            <span className="text-ink/45">grow digitally.</span>
          </h2>

          <p className="mt-5 max-w-xl text-[16px] leading-[1.7] text-ink/55">
            One creative team providing complete digital solutions for modern
            businesses.
          </p>
        </motion.div>

        {/* Premium Bento Grid */}
        <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {SERVICES.map((service, i) => {
            const Icon = service.icon;

            return (
              <motion.a
                key={service.title}
                href="#contact"
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{
                  once: true,
                  margin: "-10% 0px",
                }}
                variants={reveal}
                className={`group relative min-h-[280px] overflow-hidden rounded-[24px] border border-ink/[0.08] bg-[#fafafa] p-7 shadow-[0_2px_8px_rgba(10,10,10,0.025)] transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:border-ink/[0.13] hover:bg-white hover:shadow-[0_25px_70px_-30px_rgba(10,10,10,0.28)] md:min-h-[300px] md:p-9 ${service.span}`}
              >
                {/* Large subtle background number */}
                <span className="pointer-events-none absolute -right-2 -top-8 select-none font-display text-[150px] font-semibold leading-none tracking-[-0.08em] text-ink/[0.025] transition-all duration-500 group-hover:text-red/[0.045]">
                  {service.number}
                </span>

                {/* Hover glow */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-red/[0.03] blur-3xl transition-all duration-700 group-hover:bg-red/[0.09]" />

                {/* Top row */}
                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-1 w-1 rounded-full bg-red/70" />

                    <span className="font-display text-[11px] font-semibold tracking-[0.16em] text-ink/35">
                      {service.number}
                    </span>
                  </div>

                  {/* Premium icon container */}
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-[15px] border border-ink/[0.08] bg-white shadow-[0_6px_20px_rgba(10,10,10,0.05)] transition-all duration-500 group-hover:-translate-y-1 group-hover:border-red/20 group-hover:shadow-[0_10px_28px_rgba(10,10,10,0.10)]">
                    <Icon
                      size={19}
                      strokeWidth={1.6}
                      className="text-ink/75 transition-colors duration-300 group-hover:text-red"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 mt-14">
                  <h3 className="font-display text-[21px] font-semibold tracking-[-0.015em] text-ink md:text-[23px]">
                    {service.title}
                  </h3>

                  <p className="mt-3 max-w-[42ch] text-[14px] leading-[1.7] text-ink/50">
                    {service.description}
                  </p>
                </div>

                {/* Bottom action */}
                <div className="absolute bottom-7 left-7 right-7 z-10 flex items-center justify-between md:bottom-9 md:left-9 md:right-9">
                  <span className="text-[12px] font-semibold tracking-wide text-ink/35 transition-colors duration-300 group-hover:text-red">
                    Explore service
                  </span>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/[0.08] bg-white transition-all duration-400 group-hover:border-red/20 group-hover:bg-red group-hover:text-white">
                    <ArrowUpRight
                      size={14}
                      strokeWidth={1.8}
                      className="transition-transform duration-400 group-hover:translate-x-[1px] group-hover:-translate-y-[1px]"
                    />
                  </div>
                </div>

                {/* Bottom red accent */}
                <div className="absolute bottom-0 left-9 right-9 h-px origin-left scale-x-0 bg-red/50 transition-transform duration-500 ease-premium group-hover:scale-x-100" />
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}