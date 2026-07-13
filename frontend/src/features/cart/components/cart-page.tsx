"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";

import { useCartHydrated, useCartStore } from "../stores/use-cart-store";
import { CartItemRow } from "./cart-item-row";
import { CartSummary } from "./cart-summary";

export function CartPage() {
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartHydrated();

  if (!hasHydrated) {
    return (
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem]" aria-busy="true">
        <div className="space-y-4">
          {[0, 1].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-3xl bg-[var(--paper-100)] motion-reduce:animate-none"
            />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-3xl bg-[var(--paper-100)] motion-reduce:animate-none" />
        <span className="sr-only">Đang mở giỏ hàng…</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-2xl rounded-[2rem] border border-[color:var(--sand-200)] bg-white px-6 py-14 text-center sm:px-10">
        <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-[var(--paper-100)] text-[var(--forest-800)]">
          <ShoppingBag className="size-7" aria-hidden="true" />
        </span>
        <h2 className="mt-5 font-display text-3xl text-[var(--ink-950)]">
          Giỏ hàng đang chờ tách cà phê đầu tiên
        </h2>
        <p className="mx-auto mt-3 max-w-md leading-7 text-[var(--ink-700)]">
          Khám phá sáu sắc thái cà phê Việt Nam hoặc để Coffee Advisor chọn
          giúp bạn.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--forest-950)] px-6 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest-600)]"
          >
            Khám phá bộ sưu tập
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/advisor"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[color:var(--forest-950)] px-6 text-sm font-semibold text-[var(--forest-950)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest-600)]"
          >
            Mở Coffee Advisor
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16">
      <section aria-labelledby="cart-items-title">
        <div className="flex items-end justify-between gap-4 border-b border-[color:var(--sand-200)] pb-4">
          <h2 id="cart-items-title" className="font-display text-2xl">
            Sản phẩm đã chọn
          </h2>
          <span className="text-sm text-[var(--ink-500)]">
            {items.length} dòng sản phẩm
          </span>
        </div>
        {items.map((item) => (
          <CartItemRow key={item.id} item={item} />
        ))}
        <Link
          href="/shop"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-semibold text-[var(--forest-800)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest-600)]"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Tiếp tục mua sắm
        </Link>
      </section>

      <div className="lg:sticky lg:top-28">
        <CartSummary />
        <div className="mt-4 rounded-2xl border border-dashed border-[color:var(--sand-200)] p-4">
          <label
            htmlFor="promo-code"
            className="text-sm font-semibold text-[var(--ink-700)]"
          >
            Mã ưu đãi
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="promo-code"
              type="text"
              disabled
              placeholder="Sẽ có trong giai đoạn sau"
              className="min-h-11 min-w-0 flex-1 rounded-xl border border-[color:var(--sand-200)] bg-[var(--paper-100)] px-3 text-sm disabled:cursor-not-allowed"
            />
            <button
              type="button"
              disabled
              className="min-h-11 rounded-xl border border-[color:var(--sand-200)] px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
