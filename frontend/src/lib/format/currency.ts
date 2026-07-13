import type { Money } from "@/features/products/domain/product.types";

const VND_FORMATTER = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  currencyDisplay: "symbol",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number | Money): string {
  const amount = typeof value === "number" ? value : value.amount;
  return VND_FORMATTER.format(amount).replace(/[\u00a0\u202f]/g, " ");
}

export const formatVnd = formatCurrency;

