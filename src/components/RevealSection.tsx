"use client";

import { ReactNode } from "react";
import { useInViewOnce } from "@/hooks/useInView";

export default function RevealSection({
  children,
  className = "",
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "footer";
}) {
  const { ref, inView } = useInViewOnce<HTMLElement>();

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${inView ? "in" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
