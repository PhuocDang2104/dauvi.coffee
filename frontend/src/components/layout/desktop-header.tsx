"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, UserRound } from "lucide-react";
import type { ReactNode } from "react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { PRIMARY_NAVIGATION } from "@/config/navigation";

import { SearchDialog } from "./search-dialog";

export interface DesktopHeaderProps {
  cartCount?: number;
  cartSlot?: ReactNode;
}

export function DesktopHeader({
  cartCount = 0,
  cartSlot,
}: DesktopHeaderProps) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Điều hướng chính"
      className="shell hidden h-[4.75rem] items-center gap-4 lg:flex"
    >
      <div className="shrink-0 xl:flex-1">
        <BrandLogo />
      </div>

      <ul className="flex items-center justify-center gap-1 xl:gap-2">
        {PRIMARY_NAVIGATION.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "page" : undefined}
              className="inline-flex min-h-11 items-center border-b-2 border-transparent px-2 text-sm font-semibold text-ink-700 transition-colors hover:text-forest-950 aria-[current=page]:border-forest-950 aria-[current=page]:text-forest-950 xl:px-3"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="ml-auto flex shrink-0 items-center justify-end gap-1">
        <SearchDialog />
        <Link
          href="/login"
          className="grid size-11 place-items-center rounded-full text-[var(--ink-700,#454944)] transition hover:bg-[var(--paper-100,#f3eee4)] hover:text-[var(--forest-950,#102a20)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clay-500,#b86f45)]"
          aria-label="Đăng nhập hoặc đăng ký"
        >
          <UserRound
            aria-hidden="true"
            className="size-[1.15rem]"
            strokeWidth={1.8}
          />
        </Link>
        {cartSlot ?? (
          <Link
            href="/cart"
            className="relative grid size-11 place-items-center rounded-full text-[var(--ink-950,#181a18)] transition hover:bg-[var(--paper-100,#f3eee4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clay-500,#b86f45)]"
            aria-label={`Giỏ hàng${cartCount > 0 ? `, ${cartCount} sản phẩm` : ""}`}
          >
            <ShoppingBag
              aria-hidden="true"
              className="size-[1.15rem]"
              strokeWidth={1.8}
            />
            {cartCount > 0 ? (
              <span className="absolute right-0 top-0 grid min-h-5 min-w-5 place-items-center rounded-full bg-[var(--clay-500,#b86f45)] px-1 text-[0.65rem] font-extrabold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            ) : null}
          </Link>
        )}
      </div>
    </nav>
  );
}
