"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MapPinned,
  Package,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

import { MOBILE_NAVIGATION } from "@/config/navigation";
import { cn } from "@/components/ui/utils";

const icons: Record<string, LucideIcon> = {
  "/": Home,
  "/shop": Package,
  "/traceability": MapPinned,
  "/cart": ShoppingBag,
};

export interface MobileBottomNavProps {
  cartCount?: number;
}

export function MobileBottomNav({ cartCount = 0 }: MobileBottomNavProps) {
  const pathname = usePathname();
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const isEditable = (target: EventTarget | null) =>
      target instanceof HTMLElement &&
      (target.matches("input, textarea, select") || target.isContentEditable);

    const onFocusIn = (event: FocusEvent) => {
      if (isEditable(event.target)) setEditing(true);
    };
    const onFocusOut = () => {
      window.setTimeout(
        () => setEditing(isEditable(document.activeElement)),
        0,
      );
    };

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  if (pathname.startsWith("/checkout") || editing) return null;

  return (
    <nav
      aria-label="Điều hướng nhanh"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--sand-200,#e5d8c5)] bg-[var(--mist-50,#faf8f2)]/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_rgba(24,26,24,0.08)] backdrop-blur-xl lg:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {MOBILE_NAVIGATION.map((item) => {
          const Icon = icons[item.href] ?? Home;
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const count = item.href === "/cart" ? cartCount : 0;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex min-h-[4.25rem] flex-col items-center justify-center gap-1 rounded-xl px-1 text-[0.68rem] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--clay-500,#b86f45)]",
                  active
                    ? "text-[var(--forest-950,#102a20)]"
                    : "text-[var(--ink-500,#6c716c)] hover:text-[var(--ink-950,#181a18)]",
                )}
              >
                <span className="relative">
                  <Icon
                    aria-hidden="true"
                    className="size-5"
                    strokeWidth={active ? 2.2 : 1.7}
                  />
                  {count > 0 ? (
                    <span className="absolute -right-3 -top-2 grid min-h-4 min-w-4 place-items-center rounded-full bg-[var(--clay-500,#b86f45)] px-1 text-[0.55rem] text-white">
                      {count > 99 ? "99+" : count}
                    </span>
                  ) : null}
                </span>
                <span>{item.label}</span>
                {active ? (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1 h-0.5 w-5 rounded-full bg-[var(--clay-500,#b86f45)]"
                  />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
