"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import { useParallax } from "@/hooks/useParallax";

export default function Parallax({
  children,
  speed = 0.15,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const { ref, y } = useParallax<HTMLDivElement>(speed);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
