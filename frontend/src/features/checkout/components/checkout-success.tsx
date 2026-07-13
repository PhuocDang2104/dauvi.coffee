"use client";

import Link from "next/link";
import { Check, MapPin } from "lucide-react";

import { formatVnd } from "@/features/cart/domain/cart.utils";
import type { DemoOrderConfirmation } from "../domain/checkout.types";

interface CheckoutSuccessProps {
  confirmation: DemoOrderConfirmation;
}

export function CheckoutSuccess({ confirmation }: CheckoutSuccessProps) {
  return (
    <section
      className="mx-auto max-w-2xl rounded-[2rem] border border-[color:var(--sand-200)] bg-white px-6 py-12 text-center sm:px-10"
      aria-labelledby="checkout-success-title"
      role="status"
      tabIndex={-1}
    >
      <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-[var(--forest-950)] text-white">
        <Check className="size-7" aria-hidden="true" />
      </span>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--forest-600)]">
        Xác nhận trình diễn
      </p>
      <h2
        id="checkout-success-title"
        className="mt-2 font-display text-3xl text-[var(--ink-950)] sm:text-4xl"
      >
        Đơn demo đã được tạo
      </h2>
      <p className="mx-auto mt-4 max-w-lg leading-7 text-[var(--ink-700)]">
        Đây là luồng trình diễn frontend; chưa có giao dịch hoặc đơn hàng thật.
      </p>

      <div className="mx-auto mt-7 grid max-w-md gap-3 rounded-2xl bg-[var(--mist-50)] p-5 text-left text-sm sm:grid-cols-2">
        <div>
          <span className="block text-[var(--ink-500)]">Người nhận</span>
          <strong className="mt-1 block">{confirmation.recipientName}</strong>
        </div>
        <div>
          <span className="block text-[var(--ink-500)]">Giá trị minh họa</span>
          <strong className="mt-1 block tabular-nums">
            {formatVnd(confirmation.total)}
          </strong>
        </div>
      </div>

      <p className="mt-5 inline-flex items-center gap-2 text-xs leading-5 text-[var(--ink-500)]">
        <MapPin className="size-4" aria-hidden="true" />
        Không có yêu cầu giao hàng nào được gửi đi.
      </p>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/shop"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--forest-950)] px-6 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest-600)]"
        >
          Tiếp tục khám phá
        </Link>
        <Link
          href="/traceability"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-[color:var(--forest-950)] px-6 text-sm font-semibold text-[var(--forest-950)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest-600)]"
        >
          Tra cứu mã lô
        </Link>
      </div>
    </section>
  );
}
