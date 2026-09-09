"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import {
  Lightbulb,
  Target,
  Code2,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Tell Us Your Idea",
    description: "Tell us what you need and what you want to achieve.",
    icon: Lightbulb,
  },
  {
    number: "02",
    title: "We Plan The Solution",
    description: "Our team creates the right strategy and direction.",
    icon: Target,
  },
  {
    number: "03",
    title: "We Design & Build",
    description: "We turn the idea into a professional digital product.",
    icon: Code2,
  },
  {
    number: "04",
    title: "Launch & Grow",
    description: "We help you launch, improve and grow.",
    icon: TrendingUp,
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "end 0.55"],
  });

  const lineScale = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 1]
  );

  /*
   * Active step changes according to scroll.
   *
   * 0.00 - 0.25 = 01
   * 0.25 - 0.50 = 02
   * 0.50 - 0.75 = 03
   * 0.75 - 1.00 = 04
   */
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const step = Math.min(
      STEPS.length - 1,
      Math.floor(latest * STEPS.length)
    );

    setActiveStep(step);
  });

  return (
    <section
      id="process"
      ref={sectionRef}
      className="bg-white py-24 md:py-32"
    >
      <div className="mx-auto max-w-shell px-6 md:px-10">

        {/* =========================
            HEADER
        ========================== */}
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: "-15% 0px",
          }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="max-w-xl"
        >
          <div className="flex items-center gap-4">
            <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-red">
              How It Works
            </span>

            <span className="h-px w-9 bg-red" />
          </div>

          <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[3.2rem]">
            Simple process.
            <br />
            Serious results.
          </h2>

          <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-ink/55">
            You explain your idea. We handle the complicated part.
          </p>
        </motion.div>

        {/* =========================
            DESKTOP
        ========================== */}
        <div className="mt-20 hidden lg:block">
          <div className="relative">

            {/* BASE LINE */}
            <div
              className="
                absolute
                left-[32px]
                right-[32px]
                top-[32px]
                z-0
                h-px
                bg-mist
              "
            />

            {/* ANIMATED RED LINE */}
            <motion.div
              style={{
                scaleX: lineScale,
              }}
              className="
                absolute
                left-[32px]
                right-[32px]
                top-[32px]
                z-0
                h-px
                origin-left
                bg-red
              "
            />

            <div className="relative grid grid-cols-4 gap-7">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                const isActive = activeStep === i;

                return (
                  <motion.div
                    key={step.number}
                    initial={{
                      opacity: 0,
                      y: 35,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      margin: "-10% 0px",
                    }}
                    transition={{
                      delay: i * 0.12,
                      duration: 0.65,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="group relative"
                  >

                    {/* =========================
                        NUMBER CIRCLE
                    ========================== */}
                    <div className="relative z-20 flex h-[64px] w-[64px] items-center justify-center">
                      <motion.div
                        animate={{
                          scale: isActive ? 1 : 0.95,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className={`
                          flex
                          h-16
                          w-16
                          items-center
                          justify-center
                          rounded-full
                          border-2
                          bg-white
                          font-display
                          text-sm
                          font-bold
                          transition-all
                          duration-300
                          ${
                            isActive
                              ? "border-red bg-red text-white shadow-[0_0_0_8px_rgba(239,68,68,0.08)]"
                              : "border-ink/30 text-ink"
                          }
                        `}
                      >
                        {step.number}
                      </motion.div>
                    </div>

                    {/* =========================
                        CARD
                    ========================== */}
                    <motion.div
                      animate={{
                        y: isActive ? -4 : 0,
                        minHeight: isActive ? 285 : 225,
                      }}
                      whileHover={{
                        y: isActive ? -7 : -6,
                      }}
                      transition={{
                        duration: 0.35,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={`
                        relative
                        mt-4
                        overflow-hidden
                        rounded-2xl
                        border
                        bg-white
                        p-7
                        transition-all
                        duration-300
                        ${
                          isActive
                            ? "border-red/50 shadow-[0_18px_50px_rgba(239,68,68,0.10)]"
                            : "border-black/[0.08] hover:border-red/30 hover:shadow-[0_18px_50px_rgba(0,0,0,0.06)]"
                        }
                      `}
                    >

                      {/* ICON */}
                      <motion.div
                        animate={{
                          scale: isActive ? 1 : 0.95,
                        }}
                        transition={{
                          duration: 0.3,
                        }}
                        className={`
                          flex
                          h-14
                          w-14
                          items-center
                          justify-center
                          rounded-xl
                          transition-all
                          duration-300
                          ${
                            isActive
                              ? "bg-red/10 text-red"
                              : "bg-red/[0.06] text-red"
                          }
                        `}
                      >
                        <Icon
                          size={27}
                          strokeWidth={1.7}
                        />
                      </motion.div>

                      {/* TITLE */}
                      <h3
                        className={`
                          mt-6
                          font-display
                          font-semibold
                          tracking-[-0.02em]
                          transition-all
                          duration-300
                          ${
                            isActive
                              ? "text-[21px] text-ink"
                              : "text-[18px] text-ink"
                          }
                        `}
                      >
                        {step.title}
                      </h3>

                      {/* DESCRIPTION */}
                      <p
                        className={`
                          mt-3
                          max-w-[29ch]
                          text-[15px]
                          leading-[1.55]
                          transition-all
                          duration-300
                          ${
                            isActive
                              ? "text-ink/55"
                              : "text-ink/45"
                          }
                        `}
                      >
                        {step.description}
                      </p>

                      {/* LEARN MORE */}
                      <motion.div
                        initial={false}
                        animate={{
                          opacity: isActive ? 1 : 0,
                          y: isActive ? 0 : 5,
                        }}
                        transition={{
                          duration: 0.25,
                        }}
                        className="
                          mt-5
                          flex
                          items-center
                          gap-2
                          text-[14px]
                          font-semibold
                          text-red
                        "
                      >
                        <span>Learn more</span>
                        <ArrowRight size={16} />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* =========================
              BOTTOM STATEMENT
          ========================== */}
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.3,
              duration: 0.6,
            }}
            className="mt-12 flex flex-col items-center"
          >
            <div className="flex items-center gap-5 text-[13px] font-semibold uppercase tracking-[0.2em] text-ink/50">
              <span className="hidden h-px w-16 bg-ink/15 md:block" />

              <span>One Idea</span>

              <ArrowRight
                size={16}
                className="text-red"
              />

              <span>One Clear Process</span>

              <ArrowRight
                size={16}
                className="text-red"
              />

              <span>One Digital Result</span>

              <span className="hidden h-px w-16 bg-ink/15 md:block" />
            </div>

            <a
              href="#contact"
              className="
                mt-8
                inline-flex
                items-center
                gap-3
                rounded-full
                bg-ink
                px-6
                py-3.5
                text-[14px]
                font-medium
                text-white
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-black
              "
            >
              Have a project in mind?

              <ArrowRight
                size={16}
                className="text-red"
              />
            </a>
          </motion.div>
        </div>

        {/* =========================
            MOBILE / TABLET
        ========================== */}
        <div className="relative mt-16 lg:hidden">

          {/* BASE LINE */}
          <div
            className="
              absolute
              bottom-8
              left-[27px]
              top-8
              w-px
              bg-mist
            "
          />

          {/* ANIMATED RED LINE */}
          <motion.div
            style={{
              scaleY: lineScale,
            }}
            className="
              absolute
              bottom-8
              left-[27px]
              top-8
              w-px
              origin-top
              bg-red
            "
          />

          <div className="relative space-y-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isActive = activeStep === i;

              return (
                <motion.div
                  key={step.number}
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                    margin: "-10% 0px",
                  }}
                  transition={{
                    delay: i * 0.1,
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative flex gap-5"
                >

                  {/* NUMBER */}
                  <div
                    className={`
                      relative
                      z-10
                      flex
                      h-14
                      w-14
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border-2
                      bg-white
                      font-display
                      text-sm
                      font-bold
                      transition-all
                      duration-300
                      ${
                        isActive
                          ? "border-red bg-red text-white shadow-[0_0_0_7px_rgba(239,68,68,0.08)]"
                          : "border-ink/30 text-ink"
                      }
                    `}
                  >
                    {step.number}
                  </div>

                  {/* CARD */}
                  <motion.div
                    animate={{
                      y: isActive ? -3 : 0,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`
                      flex-1
                      rounded-2xl
                      border
                      bg-white
                      p-6
                      transition-all
                      duration-300
                      ${
                        isActive
                          ? "border-red/50 shadow-[0_15px_40px_rgba(239,68,68,0.10)]"
                          : "border-black/[0.08] shadow-[0_10px_35px_rgba(0,0,0,0.04)]"
                      }
                    `}
                  >

                    {/* ICON */}
                    <div
                      className={`
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        transition-all
                        duration-300
                        ${
                          isActive
                            ? "bg-red/10 text-red"
                            : "bg-red/[0.07] text-red"
                        }
                      `}
                    >
                      <Icon
                        size={24}
                        strokeWidth={1.7}
                      />
                    </div>

                    {/* TITLE */}
                    <h3
                      className={`
                        mt-5
                        font-display
                        font-semibold
                        text-ink
                        transition-all
                        duration-300
                        ${
                          isActive
                            ? "text-[21px]"
                            : "text-xl"
                        }
                      `}
                    >
                      {step.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p
                      className={`
                        mt-2.5
                        text-[14.5px]
                        leading-relaxed
                        transition-all
                        duration-300
                        ${
                          isActive
                            ? "text-ink/55"
                            : "text-ink/45"
                        }
                      `}
                    >
                      {step.description}
                    </p>

                    {/* LEARN MORE */}
                    <motion.div
                      initial={false}
                      animate={{
                        opacity: isActive ? 1 : 0,
                        height: isActive ? "auto" : 0,
                        marginTop: isActive ? 16 : 0,
                      }}
                      className="
                        flex
                        items-center
                        gap-2
                        overflow-hidden
                        text-sm
                        font-semibold
                        text-red
                      "
                    >
                      Learn more
                      <ArrowRight size={15} />
                    </motion.div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* MOBILE BOTTOM */}
          <div className="mt-12 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
              One Idea
              <span className="mx-2 text-red">→</span>
              One Clear Process
              <span className="mx-2 text-red">→</span>
              One Digital Result
            </p>

            <a
              href="#contact"
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-ink
                px-5
                py-3
                text-sm
                font-medium
                text-white
              "
            >
              Have a project in mind?

              <ArrowRight
                size={15}
                className="text-red"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}