import Link from "next/link";
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
  return (
    <nav
      aria-label="Điều hướng chính"
      className="mx-auto hidden h-[5.25rem] w-full max-w-[90rem] items-center gap-7 px-10 lg:flex xl:px-16"
    >
      <div className="min-w-[12.5rem] flex-1">
        <BrandLogo />
      </div>

      <ul className="flex items-center justify-center gap-1 xl:gap-2">
        {PRIMARY_NAVIGATION.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-[var(--ink-700,#454944)] transition-colors hover:bg-[var(--paper-100,#f3eee4)] hover:text-[var(--forest-950,#102a20)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clay-500,#b86f45)] xl:px-4"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex min-w-[12.5rem] flex-1 items-center justify-end gap-1">
        <SearchDialog />
        <button
          type="button"
          disabled
          title="Tài khoản sẽ được tích hợp ở giai đoạn sau"
          className="grid size-11 place-items-center rounded-full text-[var(--ink-500,#6c716c)] opacity-65"
          aria-label="Tài khoản — sắp có"
        >
          <UserRound
            aria-hidden="true"
            className="size-[1.15rem]"
            strokeWidth={1.8}
          />
        </button>
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
