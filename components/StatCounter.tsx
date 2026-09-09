"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

export default function StatCounter({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState(0);

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1400, bounce: 0 });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => setDisplay(Math.round(v)));
    return unsub;
  }, [spring]);

  return (
    <div>
      <span ref={ref} className="font-display text-3xl font-bold text-ink md:text-4xl">
        {display}
        {suffix}
      </span>
      <p className="mt-1 text-[13.5px] text-ink/55">{label}</p>
    </div>
  );
}
