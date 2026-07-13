"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import type { CartItem } from "../domain/cart.types";
import {
  calculateCartSubtotal,
  calculateFreeShippingProgress,
  formatVnd,
  FREE_SHIPPING_THRESHOLD,
} from "../domain/cart.utils";
import { useCartStore } from "../stores/use-cart-store";

interface CartSummaryProps {
  items?: CartItem[];
  checkoutHref?: string;
  showCheckout?: boolean;
  className?: string;
  onNavigate?: () => void;
}

export function CartSummary({
  items,
  checkoutHref = "/checkout",
  showCheckout = true,
  className = "",
  onNavigate,
}: CartSummaryProps) {
  const storeItems = useCartStore((state) => state.items);
  const resolvedItems = items ?? storeItems;
  const subtotal = calculateCartSubtotal(resolvedItems);
  const amountUntilFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal,
  );
  const progress = calculateFreeShippingProgress(subtotal);

  return (
    <aside
      className={`rounded-3xl border border-[color:var(--sand-200)] bg-[var(--mist-50)] p-5 sm:p-6 ${className}`}
      aria-label="Tóm tắt giỏ hàng"
    >
      <div className="flex items-center justify-between gap-4 text-base">
        <span className="text-[var(--ink-700)]">Tạm tính</span>
        <strong className="text-lg tabular-nums text-[var(--ink-950)]">
          {formatVnd(subtotal)}
        </strong>
      </div>
      <p className="mt-2 text-xs leading-5 text-[var(--ink-500)]">
        Phí giao hàng dự kiến sẽ được hiển thị ở bước xác nhận.
      </p>

      <div className="mt-5 border-t border-[color:var(--sand-200)] pt-5">
        <div className="flex items-start gap-2 text-sm leading-5 text-[var(--ink-700)]">
          {amountUntilFreeShipping === 0 ? (
            <>
              <Check
                className="mt-0.5 size-4 shrink-0 text-[var(--success-600)]"
                aria-hidden="true"
              />
              <span>Bạn đã đạt mức miễn phí giao hàng nội thành.</span>
            </>
          ) : (
            <span>
              Mua thêm <strong>{formatVnd(amountUntilFreeShipping)}</strong> để
              được miễn phí giao hàng nội thành.
            </span>
          )}
        </div>
        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--sand-200)]"
          role="progressbar"
          aria-label="Tiến độ miễn phí giao hàng"
          aria-valuemin={0}
          aria-valuemax={FREE_SHIPPING_THRESHOLD}
          aria-valuenow={Math.min(subtotal, FREE_SHIPPING_THRESHOLD)}
        >
          <div
            className="h-full rounded-full bg-[var(--forest-600)] transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {showCheckout && resolvedItems.length > 0 ? (
        <Link
          href={checkoutHref}
          onClick={onNavigate}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--forest-950)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--forest-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest-600)]"
        >
          Tiếp tục thanh toán
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      ) : null}
    </aside>
  );
}

