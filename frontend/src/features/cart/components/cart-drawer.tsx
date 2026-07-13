"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight, ShoppingBag, X } from "lucide-react";

import { calculateCartQuantity } from "../domain/cart.utils";
import { useCartHydrated, useCartStore } from "../stores/use-cart-store";
import { CartItemRow } from "./cart-item-row";
import { CartSummary } from "./cart-summary";

export function CartDrawer() {
  useCartHydrated();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const items = useCartStore((state) => state.items);
  const isDrawerOpen = useCartStore((state) => state.isDrawerOpen);
  const closeDrawer = useCartStore((state) => state.closeDrawer);
  const quantity = calculateCartQuantity(items);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isDrawerOpen && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
    } else if (!isDrawerOpen && dialog.open) {
      dialog.close();
    }
  }, [isDrawerOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={closeDrawer}
      onCancel={(event) => {
        event.preventDefault();
        closeDrawer();
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeDrawer();
      }}
      className="fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-none w-full max-w-[30rem] overflow-hidden border-0 bg-white p-0 text-[var(--ink-950)] shadow-[-16px_0_40px_rgba(24,26,24,0.12)] backdrop:bg-[rgba(16,42,32,0.48)] open:flex open:flex-col"
      aria-labelledby="cart-drawer-title"
      aria-describedby="cart-drawer-description"
    >
      <header className="flex items-center justify-between border-b border-[color:var(--sand-200)] px-5 py-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest-600)]">
            Dấu vị của bạn
          </p>
          <h2
            id="cart-drawer-title"
            className="mt-1 font-display text-2xl leading-tight"
          >
            Giỏ hàng {quantity > 0 ? `(${quantity})` : ""}
          </h2>
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={closeDrawer}
          className="inline-flex size-11 items-center justify-center rounded-full border border-[color:var(--sand-200)] hover:bg-[var(--paper-100)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest-600)]"
          aria-label="Đóng giỏ hàng"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </header>

      <p id="cart-drawer-description" className="sr-only">
        Xem và thay đổi các sản phẩm trong giỏ hàng của bạn.
      </p>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <span className="inline-flex size-16 items-center justify-center rounded-full bg-[var(--paper-100)] text-[var(--forest-800)]">
            <ShoppingBag className="size-7" aria-hidden="true" />
          </span>
          <h3 className="mt-5 font-display text-2xl">
            Giỏ hàng đang chờ tách cà phê đầu tiên
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--ink-700)]">
            Khám phá bộ sưu tập hoặc để Coffee Advisor chọn giúp một dòng phù
            hợp với cách pha của bạn.
          </p>
          <div className="mt-7 flex w-full max-w-xs flex-col gap-3">
            <Link
              href="/shop"
              onClick={closeDrawer}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--forest-950)] px-5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest-600)]"
            >
              Khám phá bộ sưu tập
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/advisor"
              onClick={closeDrawer}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[color:var(--forest-950)] px-5 text-sm font-semibold text-[var(--forest-950)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest-600)]"
            >
              Mở Coffee Advisor
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 sm:px-6">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} compact />
            ))}
            {!items.some(
              (item) => item.productSlug === "catimor-da-lat-washed",
            ) ? (
              <aside className="my-5 rounded-2xl border border-dashed border-[color:var(--honey-500)] bg-[color-mix(in_srgb,var(--honey-500)_10%,white)] p-4 text-sm leading-6 text-[var(--ink-700)]">
                <strong className="text-[var(--ink-950)]">
                  Một gợi ý nhỏ:
                </strong>{" "}
                Catimor drip bag phù hợp cho những ngày cần pha nhanh.
                <Link
                  href="/shop/catimor-da-lat-washed"
                  onClick={closeDrawer}
                  className="ml-1 font-semibold text-[var(--forest-800)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Xem sản phẩm
                </Link>
              </aside>
            ) : null}
          </div>
          <div className="border-t border-[color:var(--sand-200)] bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-5">
            <CartSummary
              className="border-0 p-0 sm:p-0"
              onNavigate={closeDrawer}
            />
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="mt-3 inline-flex min-h-11 w-full items-center justify-center text-sm font-semibold text-[var(--forest-800)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest-600)]"
            >
              Xem giỏ hàng đầy đủ
            </Link>
          </div>
        </>
      )}
    </dialog>
  );
}
