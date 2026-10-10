"use client";

import { cn } from "@/lib/utils";

/** A glass card whose border and fill glow toward the cursor. */
export function SpotlightCard({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty(
          "--spotlight-x",
          `${e.clientX - rect.left}px`,
        );
        e.currentTarget.style.setProperty(
          "--spotlight-y",
          `${e.clientY - rect.top}px`,
        );
        rest.onPointerMove?.(e);
      }}
      className={cn("glass spotlight rounded-3xl", className)}
    >
      {children}
    </div>
  );
}
