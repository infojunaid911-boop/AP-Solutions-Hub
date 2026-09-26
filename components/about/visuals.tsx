"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { TiltScene } from "./Scene";
import type { VisualKind } from "./content";

function Stage({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <TiltScene
      className={`mx-auto h-[300px] w-full max-w-[460px] sm:h-[360px] lg:h-[400px] ${className}`}
    >
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
        animate={
          prefersReducedMotion ? undefined : { y: [0, -8, 0] }
        }
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.div>
    </TiltScene>
  );
}

export function StudioVisual() {
  return (
    <Stage>
      <div
        className="absolute left-1/2 top-1/2 h-[70%] w-[78%] -translate-x-1/2 -translate-y-1/2"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute inset-0 rounded-[28px] bg-mist"
          style={{
            transform:
              "translateZ(-50px) rotateY(12deg) rotateX(-6deg)",
          }}
        />

        <div
          className="absolute inset-[6%] rounded-[24px] bg-ink"
          style={{
            transform:
              "translateZ(10px) rotateY(-8deg) rotateX(4deg)",
          }}
        />

        {/* White screen — only this part changed */}
        <div
          className="absolute inset-[14%] overflow-hidden rounded-[20px] border border-ink/10 bg-offwhite shadow-[0_30px_60px_rgba(10,10,10,0.18)]"
          style={{ transform: "translateZ(70px)" }}
        >
          <img
            src="/previews/herowebsites.jpg"
            alt="Studio preview"
            className="h-full w-full object-cover"
          />
        </div>

        </div>
    </Stage>
  );
}

export function NetworkVisual() {
  const nodes = [
    { x: 18, y: 32 },
    { x: 48, y: 16 },
    { x: 76, y: 28 },
    { x: 86, y: 58 },
    { x: 58, y: 78 },
    { x: 28, y: 70 },
    { x: 12, y: 50 },
    { x: 50, y: 48 },
  ];

  const lines: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 0],
    [0, 7],
    [7, 4],
    [1, 7],
    [2, 7],
  ];

  return (
    <Stage>
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        style={{ transform: "translateZ(40px)" }}
      >
        {lines.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="rgba(10,10,10,0.12)"
            strokeWidth={0.35}
          />
        ))}

        {nodes.map((node, i) => (
          <g key={i}>
            <circle
              cx={node.x}
              cy={node.y}
              r={
                i === 7
                  ? 4.2
                  : i % 3 === 0
                    ? 2.4
                    : 1.5
              }
              fill={
                i === 7 || i % 4 === 0
                  ? "#EC1D25"
                  : "#0A0A0A"
              }
              fillOpacity={
                i === 7
                  ? 1
                  : i % 4 === 0
                    ? 0.85
                    : 0.28
              }
            />
          </g>
        ))}
      </svg>

      <div
        className="absolute left-[42%] top-[38%] h-16 w-16 rounded-2xl border border-ink/10 bg-paper/80 backdrop-blur-sm"
        style={{
          transform: "translateZ(80px) rotateY(-18deg)",
        }}
      />

      <div
        className="absolute right-[12%] top-[18%] h-10 w-14 rounded-xl bg-ink"
        style={{
          transform: "translateZ(55px) rotateY(22deg)",
        }}
      />
    </Stage>
  );
}

export function WebsiteVisual() {
  return (
    <Stage>
      <div
        className="absolute left-[8%] top-[16%] h-[68%] w-[78%]"
        style={{
          transform: "rotateX(18deg) rotateY(-26deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute inset-0 overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-[0_24px_50px_rgba(10,10,10,0.14)]"
            style={{
              transform: `translateZ(${i * 46}px) translateX(${i * 16}px) translateY(${i * -8}px)`,
            }}
          >
            <img
              src="/previews/about-website.jpg"
              alt="Website preview"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </Stage>
  );
}

export function DashboardVisual() {
  return (
    <Stage>
      <div
        className="absolute left-[12%] top-[18%] h-[64%] w-[76%] overflow-hidden rounded-2xl border border-white/10 bg-ink"
        style={{
          transform:
            "rotateX(22deg) rotateY(-16deg) translateZ(20px)",
          transformStyle: "preserve-3d",
        }}
      >
        <img
          src="/previews/Dashboards.jpeg"
          alt="Dashboard preview"
          className="h-full w-full object-cover"
        />
      </div>
    </Stage>
  );
}

/* =========================================================
   MARKETING / PORTFOLIO VISUAL
========================================================= */

export function MarketingVisual() {
  const cards = [
    {
      x: "6%",
      y: "18%",
      rot: -16,
      z: 25,
      image: "/previews/food.jpg",
      alt: "Architecture project preview",
    },
    {
      x: "35%",
      y: "7%",
      rot: 8,
      z: 65,
      image: "/previews/restaurants.jpg",
      alt: "Portfolio project preview",
    },
    {
      x: "19%",
      y: "47%",
      rot: 4,
      z: 90,
      image: "/previews/Portfolio.jpeg",
      alt: "Website project preview",
    },
    {
      x: "56%",
      y: "40%",
      rot: -10,
      z: 45,
      image: "/previews/marketing.jpg",
      alt: "Marketing project preview",
    },
  ];

  return (
    <Stage className="h-[300px] sm:h-[350px] md:h-[380px] lg:h-[400px]">
      {cards.map((card, i) => (
        <motion.div
          key={card.image}
          className="
            absolute
            h-[38%]
            w-[37%]
            overflow-hidden
            rounded-[16px]
            border
            border-white/20
            bg-mist
            shadow-[0_22px_50px_rgba(10,10,10,0.18)]
          "
          style={{
            left: card.x,
            top: card.y,
            transform: `translateZ(${card.z}px) rotateY(${card.rot}deg)`,
          }}
          whileHover={{
            scale: 1.035,
            zIndex: 100,
          }}
          transition={{
            duration: 0.35,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <Image
            src={card.image}
            alt={card.alt}
            fill
            sizes="
              (max-width: 640px) 38vw,
              (max-width: 1024px) 180px,
              220px
            "
            className="object-cover"
          />

          {/* Premium overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

          {/* Subtle shine */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />

          {/* Accent */}
          <div
            className={`absolute bottom-3 left-3 h-1.5 w-10 rounded-full ${
              i === 2 ? "bg-red" : "bg-white/60"
            }`}
          />
        </motion.div>
      ))}
    </Stage>
  );
}

export function ArchitectureVisual() {
  return (
    <Stage>
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform:
            "rotateX(18deg) rotateY(-22deg) translateZ(30px)",
        }}
      >
        <svg
          width="78%"
          height="78%"
          viewBox="0 0 240 180"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M30 160 V78 L120 28 L210 78 V160"
            stroke="#0A0A0A"
            strokeOpacity="0.18"
            strokeWidth="1.4"
          />
          <path
            d="M30 160 H210"
            stroke="#0A0A0A"
            strokeOpacity="0.18"
            strokeWidth="1.4"
          />
          <path
            d="M70 160 V102 H108 V160"
            stroke="#0A0A0A"
            strokeOpacity="0.22"
            strokeWidth="1.4"
          />
          <path
            d="M132 160 V96 H178 V160"
            stroke="#0A0A0A"
            strokeOpacity="0.35"
            strokeWidth="1.4"
          />
          <path
            d="M120 28 V160 M120 28 L62 66 M120 28 L178 66"
            stroke="#EC1D25"
            strokeWidth="1.6"
          />
          <path
            d="M88 78 H152 V118 H88 Z"
            stroke="#0A0A0A"
            strokeOpacity="0.12"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      <div
        className="absolute bottom-[18%] right-[14%] h-16 w-12 rounded-md bg-ink"
        style={{
          transform: "translateZ(70px) rotateY(28deg)",
        }}
      />

      <div
        className="absolute bottom-[22%] left-[16%] h-10 w-10 rounded-md bg-red"
        style={{
          transform: "translateZ(90px) rotateY(-18deg)",
        }}
      />
    </Stage>
  );
}

export function BrandingVisual() {
  return (
    <Stage>
      <div
        className="absolute left-[18%] top-[22%] h-[54%] w-[58%] overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-[0_24px_50px_rgba(10,10,10,0.12)]"
        style={{
          transform:
            "rotateX(12deg) rotateY(-20deg) translateZ(30px)",
          transformStyle: "preserve-3d",
        }}
      >
        <img
          src="/previews/Marketing.jpeg"
          alt="Branding preview"
          className="h-full w-full object-cover"
        />
      </div>
    
      <div
        className="absolute right-[10%] top-[16%] h-24 w-20 rounded-2xl bg-ink"
        style={{
          transform: "translateZ(80px) rotateY(24deg)",
        }}
      />

      <div
        className="absolute bottom-[14%] right-[18%] h-14 w-14 rounded-2xl bg-red"
        style={{
          transform: "translateZ(100px) rotateY(-12deg)",
        }}
      />
    </Stage>
  );
}

export function TechVisual() {
  const rings = [220, 164, 108];
  const prefersReducedMotion = useReducedMotion();

  return (
    <Stage>
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        {rings.map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full border border-ink/15"
            style={{
              width: size,
              height: size,
              transform: `rotateX(68deg) translateZ(${i * 24}px)`,
            }}
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    rotateZ: i % 2 === 0 ? 360 : -360,
                  }
            }
            transition={{
              duration: 18 + i * 6,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        <div
          className="absolute h-16 w-16 rounded-2xl bg-ink"
          style={{ transform: "translateZ(40px)" }}
        />

        <div
          className="absolute h-8 w-8 rounded-lg bg-red"
          style={{
            transform:
              "translateZ(70px) translateX(70px)",
          }}
        />

        <div
          className="absolute h-6 w-6 rounded-full border border-ink/10 bg-mist"
          style={{
            transform:
              "translateZ(50px) translateX(-64px) translateY(20px)",
          }}
        />
      </div>
    </Stage>
  );
}

export function ProcessVisual() {
  const steps = ["01", "02", "03", "04"];

  return (
    <Stage>
      <div
        className="absolute left-[8%] top-[22%] flex w-[84%] items-end justify-between"
        style={{
          transform: "rotateX(20deg) rotateY(-18deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {steps.map((step, i) => (
          <div
            key={step}
            className={`flex aspect-square w-[22%] flex-col items-center justify-center rounded-2xl border ${
              i === 2
                ? "border-red bg-red text-white"
                : "border-ink/10 bg-paper text-ink"
            } shadow-[0_18px_40px_rgba(10,10,10,0.1)]`}
            style={{
              transform: `translateZ(${i * 28}px) translateY(${(i % 2) * -18}px)`,
            }}
          >
            <span className="font-display text-lg font-bold">
              {step}
            </span>
          </div>
        ))}
      </div>
    </Stage>
  );
}

export function TrustVisual() {
  return (
    <Stage>
      <div
        className="absolute left-[16%] top-[18%] h-[64%] w-[68%] rounded-[28px] border border-ink/10 bg-paper p-6 shadow-[0_24px_50px_rgba(10,10,10,0.12)]"
        style={{
          transform:
            "rotateX(10deg) rotateY(-16deg) translateZ(20px)",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-red"
            />
          ))}
        </div>

        <div className="mt-6 space-y-2">
          <div className="h-2.5 w-full rounded bg-ink/10" />
          <div className="h-2.5 w-5/6 rounded bg-ink/[0.07]" />
          <div className="h-2.5 w-2/3 rounded bg-ink/[0.07]" />
        </div>

        <div className="mt-8 h-8 w-8 rounded-full bg-ink" />
      </div>

      <div
        className="absolute right-[10%] top-[12%] h-[48%] w-[34%] rounded-2xl bg-ink"
        style={{
          transform: "translateZ(70px) rotateY(18deg)",
        }}
      />
    </Stage>
  );
}

export function visualForKind(kind: VisualKind) {
  switch (kind) {
    case "website":
      return <WebsiteVisual />;

    case "dashboard":
      return <DashboardVisual />;

    case "marketing":
      return <MarketingVisual />;

    case "architecture":
      return <ArchitectureVisual />;

    case "branding":
      return <BrandingVisual />;

    default:
      return <StudioVisual />;
  }
}