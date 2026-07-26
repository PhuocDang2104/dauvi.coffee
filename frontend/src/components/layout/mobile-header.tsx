"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { ArrowUpRight, LogIn, Menu, ShoppingBag, X } from "lucide-react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { PRIMARY_NAVIGATION } from "@/config/navigation";

import { SearchDialog } from "./search-dialog";

export interface MobileHeaderProps {
  cartCount?: number;
  cartSlot?: ReactNode;
}

export function MobileHeader({ cartCount = 0, cartSlot }: MobileHeaderProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) setOpen(false);
  }

  return (
    <nav
      aria-label="Điều hướng di động"
      className="grid h-[4.5rem] grid-cols-[1fr_auto_1fr] items-center px-3 lg:hidden"
    >
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="grid size-11 place-items-center rounded-full text-[var(--ink-950,#181a18)] transition hover:bg-[var(--paper-100,#f3eee4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clay-500,#b86f45)]"
          aria-haspopup="dialog"
          aria-label="Mở menu"
        >
          <Menu aria-hidden="true" className="size-5" />
        </button>
        <SearchDialog />
      </div>

      <BrandLogo
        variant="full"
        className="[&_svg]:size-8 [&_span_span:first-child]:text-lg"
      />

      <div className="flex justify-end">
        {cartSlot ?? (
          <Link
            href="/cart"
            className="relative grid size-11 place-items-center rounded-full text-[var(--ink-950,#181a18)] transition hover:bg-[var(--paper-100,#f3eee4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clay-500,#b86f45)]"
            aria-label={`Giỏ hàng${cartCount > 0 ? `, ${cartCount} sản phẩm` : ""}`}
          >
            <ShoppingBag
              aria-hidden="true"
              className="size-5"
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

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onCancel={(event) => {
          event.preventDefault();
          setOpen(false);
        }}
        onClick={closeOnBackdrop}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-black/30 p-0 backdrop:bg-black/30"
      >
        <div className="flex h-full w-[min(88vw,24rem)] flex-col bg-[var(--mist-50,#faf8f2)] px-6 pb-8 pt-5 shadow-2xl">
          <div className="flex items-center justify-between">
            <BrandLogo href={null} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid size-11 place-items-center rounded-full text-[var(--ink-950,#181a18)] transition hover:bg-[var(--paper-100,#f3eee4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clay-500,#b86f45)]"
              aria-label="Đóng menu"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>

          <p
            id={titleId}
            className="mt-10 text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--clay-500,#b86f45)]"
          >
            Khám phá DẤU VỊ
          </p>
          <ul className="mt-5 divide-y divide-[var(--sand-200,#e5d8c5)]">
            {PRIMARY_NAVIGATION.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-14 items-center justify-between rounded-lg py-3 font-display text-2xl text-[var(--ink-950,#181a18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clay-500,#b86f45)]"
                >
                  {item.label}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 text-[var(--ink-500,#6c716c)]"
                  />
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/login" onClick={() => setOpen(false)} className="mt-auto flex min-h-12 items-center justify-between rounded-xl border border-forest-950/15 px-4 text-sm font-bold text-forest-950">
            Đăng nhập / Đăng ký <LogIn aria-hidden="true" size={17} />
          </Link>
          <div className="mt-3 rounded-2xl bg-[var(--forest-950,#102a20)] p-5 text-white">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/65">
              Mã lô demo
            </p>
            <Link
              href="/traceability/TR4-DLK-26-N02"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex min-h-11 items-center font-mono text-sm font-bold tracking-[0.08em] underline decoration-white/35 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              TR4-DLK-26-N02
            </Link>
          </div>
        </div>
      </dialog>
    </nav>
  );
}
