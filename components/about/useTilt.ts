"use client";

import { useRef } from "react";
import {
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/**
 * Shared cursor-parallax tilt for the About page's 3D-style visuals.
 * Wrap a container with `ref`, attach onMouseMove/onMouseLeave, and apply
 * `{ rotateX, rotateY }` to a child's style (with transformStyle: "preserve-3d").
 */
export function useTilt(range = 10) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mvY, { stiffness: 120, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [range, -range]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-range, range]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mvX.set((e.clientX - rect.left) / rect.width - 0.5);
    mvY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onMouseLeave() {
    mvX.set(0);
    mvY.set(0);
  }

  return { ref, rotateX, rotateY, onMouseMove, onMouseLeave, prefersReducedMotion };
}
