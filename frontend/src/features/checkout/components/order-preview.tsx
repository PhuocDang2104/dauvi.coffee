import type { CartItem } from "@/features/cart/domain/cart.types";
import {
  calculateCartSubtotal,
  describeCartItem,
  formatVnd,
} from "@/features/cart/domain/cart.utils";

interface OrderPreviewProps {
  items: CartItem[];
  shippingFee: number;
  className?: string;
}

export function OrderPreview({
  items,
  shippingFee,
  className = "",
}: OrderPreviewProps) {
  const subtotal = calculateCartSubtotal(items);

  return (
    <aside
      className={`rounded-[1.75rem] border border-[color:var(--sand-200)] bg-[var(--paper-100)] p-5 sm:p-6 ${className}`}
      aria-labelledby="order-preview-title"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="order-preview-title" className="font-display text-2xl">
          Đơn của bạn
        </h2>
        <span className="text-xs uppercase tracking-[0.14em] text-[var(--ink-500)]">
          Demo
        </span>
      </div>

      <ul className="mt-5 divide-y divide-[color:var(--sand-200)]">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3 py-4 first:pt-0">
            <span
              className="flex h-20 w-16 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-white p-2 text-center font-mono text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-[var(--forest-950)]"
              style={{ backgroundColor: item.accent }}
              aria-hidden="true"
            >
              {item.productShortName}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-5 text-[var(--ink-950)]">
                {item.productName}
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--ink-500)]">
                {describeCartItem(item)} · SL {item.quantity}
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold tabular-nums">
              {formatVnd(item.unitPrice * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <dl className="mt-2 space-y-3 border-t border-[color:var(--sand-200)] pt-5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--ink-700)]">Tạm tính</dt>
          <dd className="font-semibold tabular-nums">{formatVnd(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--ink-700)]">Giao hàng dự kiến</dt>
          <dd className="font-semibold tabular-nums">
            {shippingFee === 0 ? "Miễn phí" : formatVnd(shippingFee)}
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-[color:var(--sand-200)] pt-4 text-base">
          <dt className="font-semibold">Tổng dự kiến</dt>
          <dd className="text-lg font-bold tabular-nums text-[var(--forest-950)]">
            {formatVnd(subtotal + shippingFee)}
          </dd>
        </div>
      </dl>

      <p className="mt-5 text-xs leading-5 text-[var(--ink-500)]">
        Đây là bản xem trước frontend. Không có khoản tiền nào được thu ở luồng
        này.
      </p>
    </aside>
  );
}
