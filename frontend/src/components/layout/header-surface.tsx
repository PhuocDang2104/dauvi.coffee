"use client";

import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/components/ui/utils";

export interface HeaderSurfaceProps {
  children: ReactNode;
  transparent?: boolean;
}

export function HeaderSurface({
  children,
  transparent = false,
}: HeaderSurfaceProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className={cn(
        "border-b transition-colors duration-200 motion-reduce:transition-none",
        scrolled || !transparent
          ? "border-[var(--sand-200,#e5d8c5)]/80 bg-[var(--mist-50,#faf8f2)]/92 shadow-[0_12px_40px_rgba(24,26,24,0.08)] backdrop-blur-xl"
          : "border-transparent bg-transparent",
      )}
    >
      {children}
    </div>
  );
}
