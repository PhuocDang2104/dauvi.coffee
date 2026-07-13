"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import type { CartItem } from "../domain/cart.types";
import { describeCartItem, formatVnd } from "../domain/cart.utils";
import { useCartStore } from "../stores/use-cart-store";

interface CartItemRowProps {
  item: CartItem;
  compact?: boolean;
}

export function CartItemRow({ item, compact = false }: CartItemRowProps) {
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  return (
    <article
      className={`grid grid-cols-[5.25rem_1fr] gap-4 border-b border-[color:var(--sand-200)] py-5 ${
        compact ? "sm:grid-cols-[4.5rem_1fr]" : "sm:grid-cols-[6.5rem_1fr]"
      }`}
    >
      <Link
        href={`/shop/${item.productSlug}`}
        className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-black/10 bg-[var(--paper-100)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest-600)]"
        aria-label={`Xem ${item.productName}`}
      >
        <span
          className="relative flex h-full items-center justify-center overflow-hidden p-2 text-center font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white transition-transform duration-200 motion-safe:group-hover:-translate-y-1"
          style={{ backgroundColor: item.accent ?? "var(--forest-800)" }}
          role="img"
          aria-label={item.image?.alt ?? `Gói cà phê ${item.productName}`}
        >
          <span
            className="absolute -right-5 -top-5 size-16 rounded-full border border-current opacity-30"
            aria-hidden="true"
          />
          <span
            className="absolute -bottom-7 -left-7 size-20 rounded-full border border-current opacity-20"
            aria-hidden="true"
          />
          <span className="relative">{item.productShortName}</span>
        </span>
      </Link>

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/shop/${item.productSlug}`}
              className="font-semibold leading-snug text-[var(--ink-950)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest-600)]"
            >
              {item.productName}
            </Link>
            <p className="mt-1 text-sm leading-5 text-[var(--ink-700)]">
              {describeCartItem(item)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--ink-700)] transition-colors hover:bg-[var(--paper-100)] hover:text-[var(--danger-600)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest-600)]"
            aria-label={`Xóa ${item.productName} khỏi giỏ hàng`}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div
            className="inline-grid min-h-11 grid-cols-[2.75rem_2.75rem_2.75rem] items-center rounded-full border border-[color:var(--sand-200)] bg-white"
            aria-label={`Số lượng ${item.productName}`}
          >
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="inline-flex size-11 items-center justify-center rounded-full hover:bg-[var(--paper-100)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest-600)]"
              aria-label={`Giảm số lượng ${item.productName}`}
            >
              <Minus className="size-4" aria-hidden="true" />
            </button>
            <output
              className="text-center text-sm font-semibold tabular-nums"
              aria-live="polite"
              aria-label={`${item.quantity} sản phẩm`}
            >
              {item.quantity}
            </output>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= 99}
              className="inline-flex size-11 items-center justify-center rounded-full hover:bg-[var(--paper-100)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest-600)] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Tăng số lượng ${item.productName}`}
            >
              <Plus className="size-4" aria-hidden="true" />
            </button>
          </div>
          <p className="font-semibold tabular-nums text-[var(--ink-950)]">
            {formatVnd(item.unitPrice * item.quantity)}
          </p>
        </div>
      </div>
    </article>
  );
}
