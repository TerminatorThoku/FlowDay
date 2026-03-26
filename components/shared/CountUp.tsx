"use client";
import {
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useRef, useEffect } from "react";

export function CountUp({
  target,
  decimals = 1,
  suffix = "",
  className,
}: {
  target: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const display = useTransform(count, (v) => v.toFixed(decimals) + suffix);

  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isInView) {
      animate(count, target, { duration: 1.2, ease: "easeOut" });
    }
  }, [isInView, target, count]);

  useEffect(() => {
    const unsubscribe = display.on("change", (v) => {
      if (displayRef.current) displayRef.current.textContent = v;
    });
    return () => unsubscribe();
  }, [display]);

  return (
    <span ref={ref} className={className}>
      <span ref={displayRef}>0</span>
    </span>
  );
}
