"use client";

import { ShoppingBag } from "lucide-react";

import { calculateCartQuantity } from "../domain/cart.utils";
import { useCartHydrated, useCartStore } from "../stores/use-cart-store";

interface MiniCartButtonProps {
  className?: string;
  showLabel?: boolean;
}

export function MiniCartButton({
  className = "",
  showLabel = false,
}: MiniCartButtonProps) {
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartHydrated();
  const openDrawer = useCartStore((state) => state.openDrawer);
  const quantity = hasHydrated ? calculateCartQuantity(items) : 0;

  return (
    <button
      type="button"
      onClick={openDrawer}
      className={`relative inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full text-[var(--ink-950)] transition-colors hover:bg-[var(--paper-100)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest-600)] ${className}`}
      aria-label={`Mở giỏ hàng${quantity > 0 ? `, ${quantity} sản phẩm` : ""}`}
      aria-haspopup="dialog"
    >
      <ShoppingBag className="size-5" aria-hidden="true" />
      {showLabel ? <span>Giỏ hàng</span> : null}
      {quantity > 0 ? (
        <span
          data-testid="cart-count"
          className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[var(--clay-500)] px-1 text-[0.65rem] font-bold leading-none text-white"
          aria-hidden="true"
        >
          {quantity > 99 ? "99+" : quantity}
        </span>
      ) : null}
    </button>
  );
}
