"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Banknote, LockKeyhole, PackageCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  calculateCartQuantity,
  calculateCartSubtotal,
  calculateShippingFee,
} from "@/features/cart/domain/cart.utils";
import {
  useCartHydrated,
  useCartStore,
} from "@/features/cart/stores/use-cart-store";
import { isServerCheckoutEnabled } from "@/lib/data-source/feature-flags";
import { checkoutSchema } from "../domain/checkout.schema";
import type {
  CheckoutFormValues,
  DemoOrderConfirmation,
} from "../domain/checkout.types";
import { createDemoOrder } from "../services/create-demo-order";
import { CheckoutField } from "./checkout-field";
import { CheckoutProgress } from "./checkout-progress";
import { CheckoutSuccess } from "./checkout-success";
import { OrderPreview } from "./order-preview";

export function CheckoutForm() {
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartHydrated();
  const clearCart = useCartStore((state) => state.clearCart);
  const [confirmation, setConfirmation] =
    useState<DemoOrderConfirmation | null>(null);
  const subtotal = calculateCartSubtotal(items);
  const shippingFee = calculateShippingFee(subtotal);
  const serverCheckoutEnabled = isServerCheckoutEnabled();
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      province: "",
      district: "",
      ward: "",
      address: "",
      deliveryNote: "",
      shippingMethod: "standard",
      paymentMethod: "cod",
      acceptDemo: false,
    },
  });

  const submitDemoOrder = async (values: CheckoutFormValues) => {
    clearErrors("root.server");
    try {
      if (serverCheckoutEnabled) {
        const order = await createDemoOrder(values, items);
        setConfirmation({
          recipientName: order.recipientName,
          itemCount: order.itemCount,
          total: order.total,
          orderCode: order.orderCode,
          persistedOnServer: true,
        });
      } else {
        setConfirmation({
          recipientName: values.fullName,
          itemCount: calculateCartQuantity(items),
          total: subtotal + shippingFee,
          persistedOnServer: false,
        });
      }
      clearCart();
    } catch (error) {
      setError("root.server", {
        message:
          error instanceof Error
            ? error.message
            : "Chưa thể tạo đơn trình diễn. Vui lòng thử lại.",
      });
    }
  };

  if (!hasHydrated) {
    return (
      <div
        className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_25rem]"
        aria-busy="true"
      >
        <div className="h-[48rem] animate-pulse rounded-[2rem] bg-[var(--paper-100)] motion-reduce:animate-none" />
        <div className="h-96 animate-pulse rounded-[2rem] bg-[var(--paper-100)] motion-reduce:animate-none" />
        <span className="sr-only">Đang mở thông tin thanh toán…</span>
      </div>
    );
  }

  if (confirmation) {
    return (
      <div>
        <CheckoutProgress activeStep={3} />
        <div className="mt-10">
          <CheckoutSuccess confirmation={confirmation} />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-xl rounded-[2rem] border border-[color:var(--sand-200)] bg-white px-6 py-12 text-center">
        <PackageCheck
          className="mx-auto size-10 text-[var(--forest-600)]"
          aria-hidden="true"
        />
        <h2 className="mt-5 font-display text-3xl">
          Chưa có sản phẩm để xác nhận
        </h2>
        <p className="mt-3 leading-7 text-[var(--ink-700)]">
          Hãy chọn một gói cà phê trước khi mở luồng checkout trình diễn.
        </p>
        <Link
          href="/shop"
          className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--forest-950)] px-6 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest-600)]"
        >
          Xem bộ sưu tập
        </Link>
      </section>
    );
  }

  return (
    <div>
      <CheckoutProgress activeStep={1} />
      <form
        className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-12"
        onSubmit={handleSubmit(submitDemoOrder)}
        noValidate
      >
        <div className="space-y-6">
          <fieldset className="rounded-[1.75rem] border border-[color:var(--sand-200)] bg-white p-5 sm:p-7">
            <legend className="px-2 font-display text-2xl text-[var(--ink-950)]">
              1. Thông tin người nhận
            </legend>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <CheckoutField
                id="fullName"
                label="Họ và tên"
                autoComplete="name"
                placeholder="Nguyễn Minh Anh"
                registration={register("fullName")}
                error={errors.fullName?.message}
                className="sm:col-span-2"
              />
              <CheckoutField
                id="phone"
                label="Số điện thoại"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="090 123 4567"
                registration={register("phone")}
                error={errors.phone?.message}
              />
              <CheckoutField
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="ban@example.com"
                registration={register("email")}
                error={errors.email?.message}
                optional
              />
            </div>
          </fieldset>

          <fieldset className="rounded-[1.75rem] border border-[color:var(--sand-200)] bg-white p-5 sm:p-7">
            <legend className="px-2 font-display text-2xl text-[var(--ink-950)]">
              2. Giao hàng
            </legend>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <CheckoutField
                id="province"
                label="Tỉnh / thành phố"
                autoComplete="address-level1"
                registration={register("province")}
                error={errors.province?.message}
              />
              <CheckoutField
                id="district"
                label="Quận / huyện"
                autoComplete="address-level2"
                registration={register("district")}
                error={errors.district?.message}
              />
              <CheckoutField
                id="ward"
                label="Phường / xã"
                autoComplete="address-level3"
                registration={register("ward")}
                error={errors.ward?.message}
              />
              <CheckoutField
                id="address"
                label="Số nhà, tên đường"
                autoComplete="street-address"
                registration={register("address")}
                error={errors.address?.message}
              />
              <div className="sm:col-span-2">
                <label
                  htmlFor="deliveryNote"
                  className="mb-2 flex items-baseline justify-between gap-2 text-sm font-semibold text-[var(--ink-700)]"
                >
                  <span>Ghi chú giao hàng</span>
                  <span className="text-xs font-normal text-[var(--ink-500)]">
                    Không bắt buộc
                  </span>
                </label>
                <textarea
                  id="deliveryNote"
                  rows={3}
                  {...register("deliveryNote")}
                  aria-invalid={errors.deliveryNote ? "true" : "false"}
                  aria-describedby={
                    errors.deliveryNote ? "deliveryNote-error" : undefined
                  }
                  className="w-full resize-y rounded-xl border border-[color:var(--sand-200)] bg-white px-4 py-3 text-base outline-none focus:border-[var(--forest-600)] focus:ring-2 focus:ring-[color:var(--forest-600)]/20"
                  placeholder="Ví dụ: gọi trước khi giao"
                />
                {errors.deliveryNote ? (
                  <p
                    id="deliveryNote-error"
                    className="mt-2 text-sm text-[var(--danger-600)]"
                    role="alert"
                  >
                    {errors.deliveryNote.message}
                  </p>
                ) : null}
              </div>
            </div>

            <label className="mt-6 flex cursor-pointer gap-3 rounded-2xl border-2 border-[color:var(--forest-800)] bg-[var(--mist-50)] p-4">
              <input
                type="radio"
                value="standard"
                {...register("shippingMethod")}
                className="mt-1 size-4 accent-[var(--forest-950)]"
              />
              <span className="flex-1">
                <span className="flex justify-between gap-3 font-semibold">
                  <span>Giao hàng tiêu chuẩn</span>
                  <span className="tabular-nums">
                    {shippingFee === 0 ? "Miễn phí" : "30.000 ₫"}
                  </span>
                </span>
                <span className="mt-1 block text-sm leading-5 text-[var(--ink-500)]">
                  Thời gian và phí chỉ là minh họa; chưa có đơn vị vận chuyển
                  được kết nối.
                </span>
              </span>
            </label>
          </fieldset>

          <fieldset className="rounded-[1.75rem] border border-[color:var(--sand-200)] bg-white p-5 sm:p-7">
            <legend className="px-2 font-display text-2xl text-[var(--ink-950)]">
              3. Xác nhận đơn
            </legend>
            <label className="mt-4 flex cursor-pointer gap-3 rounded-2xl border-2 border-[color:var(--forest-800)] p-4">
              <input
                type="radio"
                value="cod"
                {...register("paymentMethod")}
                className="mt-1 size-4 accent-[var(--forest-950)]"
              />
              <Banknote
                className="mt-0.5 size-5 shrink-0 text-[var(--forest-800)]"
                aria-hidden="true"
              />
              <span>
                <strong className="block">
                  Thanh toán khi nhận hàng (COD)
                </strong>
                <span className="mt-1 block text-sm leading-5 text-[var(--ink-500)]">
                  Chế độ mô phỏng — không phát sinh khoản thu thật.
                </span>
              </span>
            </label>
            <div
              className="mt-3 flex gap-3 rounded-2xl border border-[color:var(--sand-200)] bg-[var(--paper-100)] p-4 opacity-60"
              aria-disabled="true"
            >
              <LockKeyhole className="size-5 shrink-0" aria-hidden="true" />
              <span className="text-sm">
                Chuyển khoản ngân hàng <strong>· Sắp có</strong>
              </span>
            </div>

            <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm leading-6 text-[var(--ink-700)]">
              <input
                type="checkbox"
                {...register("acceptDemo")}
                className="mt-1 size-5 shrink-0 rounded accent-[var(--forest-950)]"
                aria-invalid={errors.acceptDemo ? "true" : "false"}
                aria-describedby={
                  errors.acceptDemo ? "acceptDemo-error" : "acceptDemo-note"
                }
              />
              <span id="acceptDemo-note">
                Tôi hiểu đây là đơn trình diễn
                {serverCheckoutEnabled
                  ? " được lưu trên máy chủ,"
                  : " chỉ xử lý trên trình duyệt,"}{" "}
                chưa tạo giao dịch thanh toán hoặc yêu cầu vận chuyển thật.
              </span>
            </label>
            {errors.acceptDemo ? (
              <p
                id="acceptDemo-error"
                className="mt-2 text-sm text-[var(--danger-600)]"
                role="alert"
              >
                {errors.acceptDemo.message}
              </p>
            ) : null}
          </fieldset>

          {errors.root?.server ? (
            <p
              className="rounded-2xl border border-[color:var(--danger-600)]/30 bg-white p-4 text-sm text-[var(--danger-600)]"
              role="alert"
            >
              {errors.root.server.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[var(--forest-950)] px-6 text-base font-semibold text-white transition-colors hover:bg-[var(--forest-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest-600)] disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? "Đang tạo đơn demo…" : "Tạo đơn demo"}
          </button>
          <Link
            href="/cart"
            className="inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-semibold text-[var(--forest-800)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest-600)]"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Quay lại giỏ hàng
          </Link>
        </div>

        <OrderPreview
          items={items}
          shippingFee={shippingFee}
          className="lg:sticky lg:top-28"
        />
      </form>
    </div>
  );
}
