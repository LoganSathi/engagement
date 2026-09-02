import { ReactNode } from "react";

/**
 * One arch-topped cream card inside the pillar-bordered runway (S5).
 */
export default function EventCard({
  icon,
  title,
  time,
  children,
}: {
  icon?: string;
  title: string;
  time?: string;
  children?: ReactNode;
}) {
  return (
    <div className="arch-card text-center">
      {icon && (
        <div className="text-3xl mb-2" aria-hidden>
          {icon}
        </div>
      )}
      <div className="font-heading text-xl text-[var(--maroon)]">{title}</div>
      {time && (
        <div className="text-xs uppercase tracking-wider text-[var(--ink)]/70 mt-1">
          {time}
        </div>
      )}
      {children}
    </div>
  );
}
